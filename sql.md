# SQL 知识点运用总结

> 本项目使用 OpenGauss 数据库，原生 SQL 与 Python 异步结合

---

## 一、DDL 数据定义语言

### 1.1 表创建 (CREATE TABLE)

```sql
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    code_style TEXT,
    knowledge_status TEXT
);
```

- `IF NOT EXISTS` - 防止重复创建报错
- 多字段类型：`SERIAL`、`VARCHAR`、`TEXT`、`TIMESTAMP`、`BOOLEAN`、`JSONB`

### 1.2 外键约束 (FOREIGN KEY)

```sql
CREATE TABLE assignment_submissions (
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id) ON DELETE CASCADE
);
```

- `ON DELETE CASCADE` - 级联删除，自动清理关联数据

### 1.3 默认值约束 (DEFAULT)

```sql
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## 二、DML 数据操作语言

### 2.1 基础 CRUD

```python
# 插入
await fetch_one(
    "INSERT INTO courses_assignments (courses_id, assignment_id) VALUES ($1, $2)",
    courseId, new_assign_id
)

# 查询
assignment = await AssignmentModel.get(id=assign_id)

# 更新
await fetch_one(
    "UPDATE assignment_submissions SET score=$1 WHERE id=$2",
    score, submission_id
)

# 删除
await assignment.delete()
```

### 2.2 批量查询 (JOIN)

```sql
SELECT a.* FROM assignments a
JOIN courses_assignments ca ON a.id = ca.assignment_id
WHERE ca.courses_id = $1
```

---

## 三、高级查询特性

### 3.1 视图 (VIEW) - 封装复杂查询

具体见 `backend\app\models\views.py:9`

```sql
-- 作业详情视图（包含课程ID、测试样例、截止时间）
CREATE OR REPLACE VIEW v_assignment_detail AS
SELECT
    a.id AS assignment_id,
    a.title,
    a.description,
    a.end_date AS ddl,
    a.type AS assignment_type,
    ca.courses_id AS course_id,
    ac.sample_input,
    ac.sample_expect_output,
    ac.original_code
FROM assignments a
LEFT JOIN courses_assignments ca ON a.id = ca.assignment_id
LEFT JOIN assignment_codes ac ON a.id = ac.assignment_id;
```
---

## 四、存储过程 (PROCEDURE)

### 两个存储过程

具体见 `backend\app\constants\procedures.sql`

```sql
-- =====================================================
-- 存储过程定义（OpenGauss 兼容版本）
-- =====================================================

-- =====================================================
-- 1. 作业分析 Upsert 存储过程（封装 ai.py 的 IF-ELSE）
-- OpenGauss 使用 INSERT ... ON DUPLICATE KEY UPDATE 语法
-- =====================================================
CREATE OR REPLACE FUNCTION upsert_assignment_analysis(
    p_assignment_id VARCHAR(50),
    p_resolution JSONB,
    p_knowledge_analysis JSONB DEFAULT NULL,
    p_code_analysis JSONB DEFAULT NULL,
    p_learning_suggestions JSONB DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- 检查是否存在记录
    SELECT COUNT(*) INTO v_count FROM assignment_analysis WHERE assignment_id = p_assignment_id;

    IF v_count > 0 THEN
        -- 更新现有记录
        UPDATE assignment_analysis
        SET resolution = p_resolution,
            knowledge_analysis = COALESCE(p_knowledge_analysis, knowledge_analysis),
            code_analysis = COALESCE(p_code_analysis, code_analysis),
            learning_suggestions = COALESCE(p_learning_suggestions, learning_suggestions)
        WHERE assignment_id = p_assignment_id;
    ELSE
        -- 插入新记录
        INSERT INTO assignment_analysis
            (assignment_id, resolution, knowledge_analysis, code_analysis, learning_suggestions)
        VALUES
            (p_assignment_id, p_resolution, p_knowledge_analysis, p_code_analysis, p_learning_suggestions);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. 提交代码存储过程（封装 assignment.py 的 IF-ELSE）
-- OpenGauss 兼容：使用 md5() 替代 gen_random_bytes()
-- =====================================================
CREATE OR REPLACE PROCEDURE submit_assignment(
    p_assignment_id VARCHAR(50),
    p_student_id VARCHAR(50),
    p_score FLOAT,
    p_sample_real_output TEXT,
    p_submit_code TEXT
)
IS
    v_count INTEGER;
    v_submission_id VARCHAR(50);
    v_existing_id VARCHAR(50);
BEGIN
    -- 检查是否存在提交，同时获取最新的 submission_id
    SELECT COUNT(*), MAX(id) INTO v_count, v_existing_id
    FROM assignment_submissions
    WHERE assignment_id = p_assignment_id AND student_id = p_student_id;

    IF v_count > 0 AND v_existing_id IS NOT NULL THEN
        -- 更新现有提交（使用找到的 ID）
        UPDATE assignment_submissions
        SET score = p_score,
            sample_real_output = p_sample_real_output,
            submit_code = p_submit_code,
            submitted_at = CURRENT_TIMESTAMP
        WHERE id = v_existing_id;
    ELSE
        -- 创建新提交（使用 md5 生成唯一 ID）
        v_submission_id := md5(p_assignment_id || p_student_id || clock_timestamp()::text);
        INSERT INTO assignment_submissions
            (id, assignment_id, student_id, score, sample_real_output, submit_code)
        VALUES
            (v_submission_id, p_assignment_id, p_student_id, p_score, p_sample_real_output, p_submit_code);
    END IF;
END;
/

```

---

## 五、触发器 (TRIGGER)

具体见 `backend\app\constants\triggers.sql`

```sql
-- =====================================================
-- 触发器定义
-- =====================================================

-- =====================================================
-- 1. updated_at 自动更新触发器
-- 封装应用层每次手动更新 updated_at 的操作
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为各表创建触发器
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 注意：assignment_analysis 表没有 updated_at 字段，不创建触发器

-- =====================================================
-- 2. 截止日期检查触发器
-- 封装 controller/assignment.py:200-201 的应用层检查
-- =====================================================
CREATE OR REPLACE FUNCTION check_submission_deadline()
RETURNS TRIGGER AS $$
DECLARE
    v_end_date TIMESTAMP;
BEGIN
    SELECT end_date INTO v_end_date
    FROM assignments WHERE id = NEW.assignment_id;

    -- 如果作业没有截止日期，允许提交
    IF v_end_date IS NOT NULL AND v_end_date < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Cannot submit after deadline (%)', v_end_date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_assignment_submission_deadline
    BEFORE INSERT ON assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION check_submission_deadline();

-- =====================================================
-- 3. 分数范围验证触发器
-- 确保分数在 0-100 范围内
-- =====================================================
CREATE OR REPLACE FUNCTION validate_submission_score()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.score < 0 THEN
        NEW.score := 0;
    ELSIF NEW.score > 100 THEN
        NEW.score := 100;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_score_range
    BEFORE INSERT OR UPDATE ON assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION validate_submission_score();

```

---

## 六、Python 异步 ORM 封装

### 6.1 连接池管理

```python
async def get_pool():
    if _pool is None:
        _pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    return _pool
```

### 6.2 基础操作函数

```python
async def fetch_one(sql: str, *args) -> Optional[dict]:
    """查询单条记录"""
    conn = await get_db()
    try:
        return await conn.fetchrow(sql, *args)
    finally:
        await conn.close()

async def execute(sql: str, *args) -> str:
    """执行 SQL，无返回值"""
    conn = await get_db()
    try:
        return await conn.execute(sql, *args)
    finally:
        await conn.close()
```

### 6.3 模型基类

```python
class Model:
    @classmethod
    async def get(cls, id: str):
        row = await fetch_one(f"SELECT * FROM {cls.__table__} WHERE id = $1", id)
        return cls(**dict(row)) if row else None

    @classmethod
    async def create(cls, **kwargs):
        keys = ', '.join(kwargs.keys())
        values = ', '.join(f'${i+1}' for i in range(len(kwargs)))
        await execute(f"INSERT INTO {cls.__table__} ({keys}) VALUES ({values})", *kwargs.values())
```

---

## 七、OpenGauss 兼容注意事项

| PostgreSQL 语法             | OpenGauss 语法                     |
| --------------------------- | ---------------------------------- |
| `ON CONFLICT`               | 改用 `IF EXISTS` + `INSERT/UPDATE` |
| `gen_random_bytes()`        | 改用 `md5()` + `clock_timestamp()` |
| `CREATE OR REPLACE TRIGGER` | 不支持，需 `DROP TRIGGER` 后再创建 |
| `$$` 定界符                 | 同样支持                           |
| `LANGUAGE plpgsql`          | 同样支持                           |
