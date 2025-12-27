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
