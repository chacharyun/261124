-- =========================================================================
-- 합격의 숲 — 나의 경찰 마을 (Pass Forest: Police Exam) Database Schema
-- 2027년 3월 20일 경찰공무원 순경 필기시험 대비 올인원 학습 관리 시스템
-- =========================================================================

-- 1. 사용자 계정 및 환경설정 (users, user_settings)
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name VARCHAR(50) NOT NULL DEFAULT '순경합격이',
    village_name VARCHAR(50) NOT NULL DEFAULT '푸른 순경마을',
    exam_date DATE NOT NULL DEFAULT '2027-03-20',
    daily_target_minutes INT NOT NULL DEFAULT 180,
    busy_day_min_minutes INT NOT NULL DEFAULT 60,
    sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    pen_only_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 과목 및 세부 단원 (subjects, topics)
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(30) PRIMARY KEY, -- 'criminal_law', 'police_studies', 'constitution'
    name_kr VARCHAR(50) NOT NULL,
    question_count INT NOT NULL,
    character_name VARCHAR(50) NOT NULL,
    character_animal VARCHAR(20) NOT NULL,
    building_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id VARCHAR(30) REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    order_index INT NOT NULL DEFAULT 0
);

-- 3. 교재 및 고정 일정 (textbooks, schedules)
CREATE TABLE IF NOT EXISTS textbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id VARCHAR(30) REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100),
    total_problems INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    day_of_week INT NOT NULL, -- 0=Sun, 1=Mon ... 6=Sat
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    category VARCHAR(30) NOT NULL, -- 'school', 'part_time', 'volunteer', 'etc'
    memo TEXT
);

-- 4. 학습 계획 및 실행 기록 (study_plans, study_sessions)
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    target_tier VARCHAR(20) NOT NULL DEFAULT 'standard', -- 'minimum', 'standard', 'extended'
    total_target_minutes INT NOT NULL DEFAULT 180,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id VARCHAR(30) REFERENCES subjects(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    skim_minutes INT DEFAULT 0,
    input_minutes INT DEFAULT 0,
    output_minutes INT DEFAULT 0,
    feedback_minutes INT DEFAULT 0,
    attempted_questions INT DEFAULT 0,
    correct_questions INT DEFAULT 0,
    confusing_concepts TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 간격 반복 복습 및 오답 관리 (review_items, review_attempts, attachments)
CREATE TABLE IF NOT EXISTS review_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id VARCHAR(30) REFERENCES subjects(id) ON DELETE CASCADE,
    topic VARCHAR(100) NOT NULL,
    textbook_name VARCHAR(150) NOT NULL,
    problem_number VARCHAR(50) NOT NULL,
    problem_image_url TEXT,
    solution_image_url TEXT,
    selected_answer VARCHAR(10),
    correct_answer VARCHAR(10),
    cause_tags TEXT[] NOT NULL DEFAULT '{}',
    understanding VARCHAR(20) NOT NULL DEFAULT 'confused', -- 'none', 'confused', 'unsure', 'mastered'
    registered_date DATE NOT NULL,
    next_review_date DATE NOT NULL,
    review_stage INT NOT NULL DEFAULT 1,
    review_count INT NOT NULL DEFAULT 0,
    overcome BOOLEAN NOT NULL DEFAULT FALSE,
    memo TEXT,
    is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_item_id UUID REFERENCES review_items(id) ON DELETE CASCADE,
    attempt_date DATE NOT NULL,
    selected_answer VARCHAR(10),
    is_correct BOOLEAN,
    understanding VARCHAR(20) NOT NULL,
    spent_seconds INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 손필기 노트 (handwritten_notes, note_pages)
CREATE TABLE IF NOT EXISTS handwritten_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id VARCHAR(30) REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    topic VARCHAR(100),
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS note_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID REFERENCES handwritten_notes(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    template VARCHAR(20) NOT NULL DEFAULT 'grid', -- 'blank', 'lined', 'grid', 'problem'
    strokes JSONB NOT NULL DEFAULT '[]'::jsonb,
    background_image_url TEXT,
    preview_url TEXT
);

-- 7. AI 코칭 및 보상 게이미피케이션 (ai_feedback, xp_transactions, rewards)
CREATE TABLE IF NOT EXISTS ai_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    disclaimer TEXT,
    related_subject VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    xp_awarded INT NOT NULL,
    subject_id VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS village_state (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    level INT NOT NULL DEFAULT 1,
    total_xp INT NOT NULL DEFAULT 0,
    coins INT NOT NULL DEFAULT 100,
    decorations JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
