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
