CREATE DATABASE juniors_tech;

\c juniors_tech

CREATE TABLE "employment_status" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "country" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "pronoun" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "role" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "education" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "social_network" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "language" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "it_field" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "technology" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "user" (
  "id" CHAR(10) PRIMARY KEY,
  "email" VARCHAR NOT NULL,
  "username" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  "score" INTEGER DEFAULT 0 NOT NULL,
  "post_count" INTEGER DEFAULT 0 NOT NULL,
  "comment_count" INTEGER DEFAULT 0 NOT NULL,
  "open_to_work" BOOLEAN,
  "about" VARCHAR,
  "employment_status_id" CHAR(10),
  "it_field_id" CHAR(10),
  "pronoun_id" CHAR(10),
  "avatar_url" VARCHAR,
  "country_id" CHAR(10),
  "birthdate" DATE NOT NULL,
  "created_at" TIMESTAMP DEFAULT (NOW()) NOT NULL,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "muted_at" TIMESTAMP,
  "has_open_report" BOOLEAN DEFAULT FALSE NOT NULL

  CONSTRAINT existent_employment_status FOREIGN KEY (employment_status_id) REFERENCES employment_status (id),
  CONSTRAINT existent_it_field FOREIGN KEY (it_field_id) REFERENCES it_field (id),
  CONSTRAINT existent_pronoun FOREIGN KEY (pronoun_id) REFERENCES pronoun (id),
  CONSTRAINT existent_country FOREIGN KEY (country_id) REFERENCES country (id),
  CONSTRAINT unique_user_email UNIQUE (email),
  CONSTRAINT unique_user_username UNIQUE (username),
  CONSTRAINT non_negative_user_post_count CHECK (post_count >= 0),
  CONSTRAINT non_negative_user_comment_count CHECK (comment_count >= 0),
  CONSTRAINT min_allowed_age CHECK (EXTRACT(YEAR FROM JUSTIFY_INTERVAL(CURRENT_TIMESTAMP - birthdate)) >= 17)
);

CREATE TABLE "user_role" (
  "user_id" CHAR(10) NOT NULL,
  "role_id" CHAR(10) NOT NULL
);

CREATE TABLE "user_education" (
  "user_id" CHAR(10) NOT NULL,
  "education_id" CHAR(10) NOT NULL
);

CREATE TABLE "user_social_network" (
  "user_id" CHAR(10) NOT NULL,
  "social_network_id" CHAR(10) NOT NULL,
  "url" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "user_language" (
  "user_id" CHAR(10) NOT NULL,
  "language_id" CHAR(10) NOT NULL
);

CREATE TABLE "user_technology" (
  "user_id" CHAR(10) NOT NULL,
  "technology_id" CHAR(10) NOT NULL
);

CREATE TABLE "category" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  CONSTRAINT unique_post_category UNIQUE (name)
);

CREATE TABLE "aspect_type" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "aspect" (
  "id" CHAR(10) PRIMARY KEY,
  "aspect_type_id" CHAR(10) NOT NULL,
  "title" VARCHAR(300),
  "body" TEXT NOT NULL,
  "slug" VARCHAR,
  "parent_id" CHAR(10),
  "post_id" CHAR(10),
  "author_id" CHAR(10) NOT NULL,
  "category_id" CHAR(10),
  "vote_count" INTEGER DEFAULT 0 NOT NULL,
  "comment_count" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TIMESTAMP DEFAULT (NOW()) NOT NULL,
  "updated_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "has_open_report" BOOLEAN DEFAULT FALSE NOT NULL,

  CONSTRAINT existent_aspect_type FOREIGN KEY (aspect_type_id) REFERENCES aspect_type (id),
  CONSTRAINT existent_parent_comment FOREIGN KEY (parent_id) REFERENCES aspect (id),
  CONSTRAINT existent_post_id FOREIGN KEY (post_id) REFERENCES aspect (id),
  CONSTRAINT existent_aspect_author FOREIGN KEY (author_id) REFERENCES "user" (id),
  CONSTRAINT existent_aspect_category FOREIGN KEY (category_id) REFERENCES category (id),
  CONSTRAINT unique_post_title UNIQUE (title),
  CONSTRAINT non_negative_aspect_comment_count CHECK (comment_count >= 0),
  CONSTRAINT single_aspect_type CHECK (
    -- caso publicación
    (NUM_NULLS(title, slug, category_id) = 0 AND NUM_NONNULLS(parent_id, post_id) = 0)
    OR
    -- caso comentario
    (NUM_NULLS(parent_id, post_id) = 0 AND NUM_NONNULLS(title, slug, category_id) = 0))
);

CREATE TABLE "vote" (
  "id" CHAR(10) PRIMARY KEY,
  "vote_direction" smallint NOT NULL,
  "aspect_id" CHAR(10) NOT NULL,
  "user_id" CHAR(10) NOT NULL,

  CONSTRAINT existent_aspect FOREIGN KEY (aspect_id) REFERENCES aspect (id),
  CONSTRAINT existent_user FOREIGN KEY (user_id) REFERENCES "user" (id),
  CONSTRAINT valid_vote_direction_value CHECK (vote_direction IN (1, -1)),
  CONSTRAINT single_vote_per_aspect UNIQUE (aspect_id, user_id)
);

CREATE TABLE "report_type" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "report_reason" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "report_action" (
  "id" CHAR(10) PRIMARY KEY,
  "name" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE "report" (
  "id" CHAR(10) PRIMARY KEY,
  "reported_by" CHAR(10) NOT NULL,
  "report_type_id" CHAR(10) NOT NULL,
  "report_reason_id" CHAR(10) NOT NULL,
  "report_action_id" CHAR(10),
  "created_at" TIMESTAMP DEFAULT (NOW()) NOT NULL,
  "updated_at" TIMESTAMP,

  CONSTRAINT existent_report_author FOREIGN KEY (reported_by) REFERENCES "user" (id),
  CONSTRAINT existent_report_type FOREIGN KEY (report_type_id) REFERENCES report_type (id),
  CONSTRAINT existent_report_reason FOREIGN KEY (report_reason_id) REFERENCES report_reason (id),
  CONSTRAINT existent_report_action FOREIGN KEY (report_action_id) REFERENCES report_action (id)
);

CREATE TABLE "reported_item" (
  "id" CHAR(10) PRIMARY KEY,
  "report_id" CHAR(10),
  "aspect_id" CHAR(10),
  "user_id" CHAR(10),

  CONSTRAINT existent_report FOREIGN KEY (report_id) REFERENCES report (id),
  CONSTRAINT existent_reported_aspect FOREIGN KEY (aspect_id) REFERENCES aspect (id),
  CONSTRAINT existent_reported_user FOREIGN KEY (user_id) REFERENCES "user" (id),
  CONSTRAINT single_report_type CHECK (NUM_NONNULLS(aspect_id, user_id) = 1)
);
