CREATE DATABASE juniors_tech;

\c juniors_tech

CREATE TABLE "user" (
  "id" char(10) PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "score" int DEFAULT 0,
  "post_count" int DEFAULT 0,
  "comment_count" int DEFAULT 0,
  "open_to_work" boolean,
  "about" varchar,
  "employment_status_id" char(10),
  "it_field_id" char(10),
  "pronoun_id" char(10),
  "avatar_url" varchar,
  "country_id" char(10),
  "birthdate" date NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp,
  "deleted_at" timestamp,
  "muted_at" timestamp
);

CREATE TABLE "post" (
  "id" char(10) PRIMARY KEY,
  "title" varchar UNIQUE,
  "body" text NOT NULL,
  "slug" varchar NOT NULL,
  "author_id" char(10) NOT NULL,
  "category_id" char(10) NOT NULL,
  "vote_count" int DEFAULT 0,
  "comment_count" int DEFAULT 0,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp,
  "reported_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "comment" (
  "id" char(10) PRIMARY KEY,
  "body" text NOT NULL,
  "parent_id" char(10),
  "post_id" char(10),
  "author_id" char(10) NOT NULL,
  "vote_count" int DEFAULT 0,
  "comment_count" int DEFAULT 0,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp,
  "reported_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "vote" (
  "id" char(10) PRIMARY KEY,
  "vote_direction" smallint NOT NULL,
  "vote_type_id" char(10) NOT NULL,
  "voted_item_id" char(10) NOT NULL,
  "user_id" char(10)
);

CREATE TABLE "vote_type" (
  "id" char(10) PRIMARY KEY,
  "name" varchar NOT NULL
);

CREATE TABLE "report" (
  "id" char(10) PRIMARY KEY,
  "reported_item_id" char(10) NOT NULL,
  "report_author_id" char(10) NOT NULL,
  "report_type_id" char(10) NOT NULL,
  "report_reason_id" char(10) NOT NULL,
  "action_id" char(10),
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "report_type" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "report_reason" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "report_action" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "employment_status" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "country" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "pronoun" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "role" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "user_role" (
  "user_id" char(10) NOT NULL,
  "role_id" char(10) NOT NULL
);

CREATE TABLE "education" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "user_education" (
  "user_id" char(10) NOT NULL,
  "education_id" char(10) NOT NULL
);

CREATE TABLE "social_network" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "user_social_network" (
  "user_id" char(10) NOT NULL,
  "social_network_id" char(10) NOT NULL,
  "url" varchar UNIQUE NOT NULL
);

CREATE TABLE "language" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "user_language" (
  "user_id" char(10) NOT NULL,
  "language_id" char(10) NOT NULL
);

CREATE TABLE "it_field" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "technology" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "user_technology" (
  "user_id" char(10) NOT NULL,
  "technology_id" char(10) NOT NULL
);

CREATE TABLE "category" (
  "id" char(10) PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

ALTER TABLE "user" ADD FOREIGN KEY ("pronoun_id") REFERENCES "pronoun" ("id");
ALTER TABLE "user" ADD FOREIGN KEY ("country_id") REFERENCES "country" ("id");
ALTER TABLE "user_role" ADD FOREIGN KEY ("role_id") REFERENCES "role" ("id");
ALTER TABLE "user_role" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "user_social_network" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "user_social_network" ADD FOREIGN KEY ("social_network_id") REFERENCES "social_network" ("id");
ALTER TABLE "user_technology" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "user_technology" ADD FOREIGN KEY ("technology_id") REFERENCES "technology" ("id");
ALTER TABLE "user_language" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "user_language" ADD FOREIGN KEY ("language_id") REFERENCES "language" ("id");
ALTER TABLE "vote" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "post" ADD FOREIGN KEY ("author_id") REFERENCES "user" ("id");
ALTER TABLE "post" ADD FOREIGN KEY ("category_id") REFERENCES "category" ("id");
ALTER TABLE "user" ADD FOREIGN KEY ("employment_status_id") REFERENCES "employment_status" ("id");
ALTER TABLE "report" ADD FOREIGN KEY ("reported_item_id") REFERENCES "user" ("id");
ALTER TABLE "report" ADD FOREIGN KEY ("reported_item_id") REFERENCES "post" ("id");
ALTER TABLE "vote" ADD FOREIGN KEY ("voted_item_id") REFERENCES "post" ("id");
ALTER TABLE "user_education" ADD FOREIGN KEY ("education_id") REFERENCES "education" ("id");
ALTER TABLE "user_education" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "report" ADD FOREIGN KEY ("report_type_id") REFERENCES "report_type" ("id");
ALTER TABLE "report" ADD FOREIGN KEY ("report_reason_id") REFERENCES "report_reason" ("id");
ALTER TABLE "comment" ADD FOREIGN KEY ("post_id") REFERENCES "post" ("id");
ALTER TABLE "comment" ADD FOREIGN KEY ("parent_id") REFERENCES "comment" ("id");
ALTER TABLE "comment" ADD FOREIGN KEY ("author_id") REFERENCES "user" ("id");
ALTER TABLE "vote" ADD FOREIGN KEY ("vote_type_id") REFERENCES "vote_type" ("id");
ALTER TABLE "vote" ADD FOREIGN KEY ("voted_item_id") REFERENCES "comment" ("id");
ALTER TABLE "report" ADD FOREIGN KEY ("id") REFERENCES "comment" ("id");
ALTER TABLE "report" ADD FOREIGN KEY ("action_id") REFERENCES "report_action" ("id");
ALTER TABLE "user" ADD FOREIGN KEY ("it_field_id") REFERENCES "it_field" ("id");