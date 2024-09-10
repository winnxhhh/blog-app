
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    articleTitle TEXT NOT NULL,
    articleDesc TEXT,
    articleContent TEXT,
    articleCreated TEXT,
    articleUpdated TEXT
);

CREATE TABLE IF NOT EXISTS publishedArticles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    articleTitle TEXT NOT NULL,
    articleDesc TEXT,
    articleContent TEXT,
    articleCreated TEXT,
    articleUpdated TEXT,
    articlePublished TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    commentName TEXT NOT NULL,
    commentContent TEXT,
    commentCreated TEXT,
    article_id INTEGER,
    FOREIGN KEY (article_id) REFERENCES publishedArticles(article_id)
);

CREATE TABLE IF NOT EXISTS settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    settingTitle TEXT NOT NULL,
    settingSubtitle TEXT,
    settingName TEXT NOT NULL
);


-- Set up three placeholder articles + default banner setting
INSERT INTO articles ('articleTitle', 'articleDesc', 'articleContent', 'articleCreated', 'articleUpdated') VALUES ('Concert Review: Stray Kids', 'A Night to Remember', 'Stray Kids delivered an electrifying performance, captivating the audience with their dynamic choreography and powerful vocals. Their stage presence and energy were unparalleled, leaving fans in awe and eager for more.', '05/02/2023, 23:07:37', '12/02/2023, 21:24:37');


INSERT INTO articles ('articleTitle', 'articleDesc', 'articleContent', 'articleCreated', 'articleUpdated') VALUES ('News Recap', 'Top news this week', 'News this week highlighted significant global developments, including President Bidens signing of a comprehensive climate bill aimed at drastically reducing carbon emissions by 2030 and NATO leaders addressing security threats at their summit in Brussels. Additionally, the tech world saw exciting advancements at the TechCon conference, while a breakthrough in malaria vaccine research by the WHO brought new hope for combating the disease in sub-Saharan Africa.', '12/07/2024, 21:07:37', '12/07/2024, 22:17:30');


INSERT INTO publishedArticles ('articleTitle', 'articleDesc', 'articleContent', 'articleCreated', 'articleUpdated', 'articlePublished', 'views', 'likes') VALUES ('CS Life', 'Why Computer Science?', 'Being a computer science student is a rewarding yet challenging journey, filled with complex problem-solving and constant learning. The sense of achievement from mastering new concepts and creating innovative solutions makes the intense workload and long hours worthwhile.', '10/07/2024, 01:27:00', '12/07/2024, 11:03:16', '12/07/2024, 21:07:37', 0, 0);


INSERT INTO settings ('settingTitle', 'settingSubtitle', 'settingName', 'setting_id') VALUES ('Blobby Blog', 'Welcome to', 'Winnah', 1);


COMMIT;

