create table public.users (
id uuid not null,
email text null,
username text null,
bio text null,
onboarded boolean null default false,
created_at timestamp with time zone null default now(),
updated_at timestamp with time zone null default now(),
avatar_url text null,
first_name character varying(100) null,
last_name character varying(100) null,
constraint users_pkey primary key (id),
constraint users_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE deferrable initially DEFERRED
) TABLESPACE pg_default;

create table public.technical_profiles (
id uuid not null default gen_random_uuid (),
user_id uuid not null,
skills text[] not null default '{}'::text[],
github character varying(255) null,
portfolio character varying(255) null,
created_at timestamp with time zone null default CURRENT_TIMESTAMP,
updated_at timestamp with time zone null default CURRENT_TIMESTAMP,
constraint technical_profiles_pkey primary key (id),
constraint technical_profiles_user_id_key unique (user_id),
constraint technical_profiles_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.projects (
id uuid not null default gen_random_uuid (),
user_id uuid not null,
project_name character varying(255) not null,
project_image text null,
live_site_url text null,
github_link text null,
video_url text null,
tags text[] null default '{}'::text[],
case_summary text null,
build_journey text null,
key_features text[] null,
results text null,
created_at timestamp with time zone null default now(),
updated_at timestamp with time zone null default now(),
constraint projects_pkey primary key (id),
constraint projects_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
constraint projects_project_name_check check ((char_length((project_name)::text) > 0))
) TABLESPACE pg_default;

create table public.personal_details (
id uuid not null default gen_random_uuid (),
user_id uuid not null,
date_of_birth date null,
university character varying(200) not null,
department character varying(200) not null,
degree_level public.degree_level not null,
created_at timestamp with time zone null default CURRENT_TIMESTAMP,
updated_at timestamp with time zone null default CURRENT_TIMESTAMP,
constraint personal_details_pkey primary key (id),
constraint personal_details_user_id_key unique (user_id),
constraint personal_details_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;
