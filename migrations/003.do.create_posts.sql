CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date TIMESTAMP DEFAULT now() NOT NULL,
    description VARCHAR(500) NOT NULL,
    project_pic TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
); 