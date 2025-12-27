-- user 表
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    code_style TEXT,
    knowledge_status TEXT
);

-- courses 表
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    course_name VARCHAR(200) NOT NULL,
    type VARCHAR(20) DEFAULT 'public',
    status VARCHAR(20) DEFAULT 'open',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- assignments 表
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    type VARCHAR(20),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- assignment_codes 表
CREATE TABLE IF NOT EXISTS assignment_codes (
    id VARCHAR(50) PRIMARY KEY,
    original_code VARCHAR(10000),
    sample_input VARCHAR(10000),
    sample_expect_output VARCHAR(10000),
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id)
);

-- assignment_submissions 表
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    score FLOAT,
    sample_real_output VARCHAR(10000),
    submit_code VARCHAR(10000),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id)
);

-- assignment_analysis 表
CREATE TABLE IF NOT EXISTS assignment_analysis (
    id SERIAL PRIMARY KEY,
    resolution JSONB,
    knowledge_analysis JSONB,
    code_analysis JSONB,
    learning_suggestions JSONB,
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id)
);

-- courses_assignments 多对多关联表
CREATE TABLE IF NOT EXISTS courses_assignments (
    courses_id VARCHAR(50) NOT NULL REFERENCES courses(id),
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id),
    PRIMARY KEY (courses_id, assignment_id)
);