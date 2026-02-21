CREATE TABLE cart_items
(
    _cart_id   CHAR(36) NOT NULL,
    _course_id CHAR(36) NOT NULL,
    _id        CHAR(36) NOT NULL,
    CONSTRAINT cart_items_pkey PRIMARY KEY (_id)
);

CREATE TABLE carts
(
    _created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at TIMESTAMP WITHOUT TIME ZONE,
    _id         CHAR(36)                    NOT NULL,
    _user_id    CHAR(36)                    NOT NULL,
    _created_by VARCHAR(255),
    _updated_by VARCHAR(255),
    CONSTRAINT carts_pkey PRIMARY KEY (_id)
);

CREATE TABLE categories
(
    _created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at TIMESTAMP WITHOUT TIME ZONE,
    _id         CHAR(36)                    NOT NULL,
    _created_by VARCHAR(255),
    _icon       VARCHAR(255),
    _name       VARCHAR(255)                NOT NULL,
    _slug       VARCHAR(255)                NOT NULL,
    _updated_by VARCHAR(255),
    CONSTRAINT categories_pkey PRIMARY KEY (_id)
);

CREATE TABLE courses
(
    _average_rating      DOUBLE PRECISION,
    _count_rating        INTEGER,
    _price               numeric(38, 2)              NOT NULL,
    _sale_price          numeric(38, 2),
    _created_at          TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at          TIMESTAMP WITHOUT TIME ZONE,
    _category_id         CHAR(36)                    NOT NULL,
    _id                  CHAR(36)                    NOT NULL,
    _instructor_id       CHAR(36)                    NOT NULL,
    _course_requirements TEXT,
    _created_by          VARCHAR(255),
    _description         TEXT,
    _description_short   TEXT,
    _level               VARCHAR(255)                NOT NULL,
    _public_id           VARCHAR(255),
    _slug                VARCHAR(255)                NOT NULL,
    _status              VARCHAR(255)                NOT NULL,
    _thumbnail           VARCHAR(255),
    _title               VARCHAR(255)                NOT NULL,
    _updated_by          VARCHAR(255),
    CONSTRAINT courses_pkey PRIMARY KEY (_id)
);

CREATE TABLE enrollments
(
    _price_paid       numeric(38, 2)              NOT NULL,
    _progress         DOUBLE PRECISION,
    _completed_at     TIMESTAMP WITHOUT TIME ZONE,
    _created_at       TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _last_accessed_at TIMESTAMP WITHOUT TIME ZONE,
    _updated_at       TIMESTAMP WITHOUT TIME ZONE,
    _course_id        CHAR(36)                    NOT NULL,
    _id               CHAR(36)                    NOT NULL,
    _user_id          CHAR(36)                    NOT NULL,
    _created_by       VARCHAR(255),
    _updated_by       VARCHAR(255),
    CONSTRAINT enrollments_pkey PRIMARY KEY (_id)
);

CREATE TABLE instructors
(
    _total_student INTEGER,
    _created_at    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at    TIMESTAMP WITHOUT TIME ZONE,
    _user_id       CHAR(36)                    NOT NULL,
    _bio           TEXT,
    _created_by    VARCHAR(255),
    _title         VARCHAR(255),
    _updated_by    VARCHAR(255),
    CONSTRAINT instructors_pkey PRIMARY KEY (_user_id)
);

CREATE TABLE lesson_progress
(
    _is_completed        BOOLEAN                     NOT NULL,
    _last_watched_second INTEGER,
    _created_at          TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at          TIMESTAMP WITHOUT TIME ZONE,
    _id                  CHAR(36)                    NOT NULL,
    _lesson_id           CHAR(36)                    NOT NULL,
    _user_id             CHAR(36)                    NOT NULL,
    _created_by          VARCHAR(255),
    _updated_by          VARCHAR(255),
    CONSTRAINT lesson_progress_pkey PRIMARY KEY (_id)
);

CREATE TABLE lessons
(
    _order_index INTEGER                     NOT NULL,
    _preview     BOOLEAN                     NOT NULL,
    _created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at  TIMESTAMP WITHOUT TIME ZONE,
    _id          CHAR(36)                    NOT NULL,
    _section_id  CHAR(36)                    NOT NULL,
    _video_id    CHAR(36),
    _created_by  VARCHAR(255),
    _lesson_type VARCHAR(255)                NOT NULL,
    _title       VARCHAR(255)                NOT NULL,
    _updated_by  VARCHAR(255),
    CONSTRAINT lessons_pkey PRIMARY KEY (_id)
);

CREATE TABLE order_items
(
    _price      numeric(38, 2)              NOT NULL,
    _created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at TIMESTAMP WITHOUT TIME ZONE,
    _course_id  CHAR(36)                    NOT NULL,
    _id         CHAR(36)                    NOT NULL,
    _order_id   CHAR(36)                    NOT NULL,
    _created_by VARCHAR(255),
    _updated_by VARCHAR(255),
    CONSTRAINT order_items_pkey PRIMARY KEY (_id)
);

CREATE TABLE orders
(
    _total_amount numeric(38, 2)              NOT NULL,
    _completed_at TIMESTAMP WITHOUT TIME ZONE,
    _created_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _expires_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at   TIMESTAMP WITHOUT TIME ZONE,
    _id           CHAR(36)                    NOT NULL,
    _user_id      CHAR(36)                    NOT NULL,
    _created_by   VARCHAR(255),
    _status       VARCHAR(255)                NOT NULL,
    _updated_by   VARCHAR(255),
    CONSTRAINT orders_pkey PRIMARY KEY (_id)
);

CREATE TABLE payments
(
    _amount         numeric(38, 2)              NOT NULL,
    _created_at     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at     TIMESTAMP WITHOUT TIME ZONE,
    _id             CHAR(36)                    NOT NULL,
    _order_id       CHAR(36)                    NOT NULL,
    _created_by     VARCHAR(255),
    _payment_method VARCHAR(255)                NOT NULL,
    _status         VARCHAR(255)                NOT NULL,
    _transaction_no VARCHAR(255),
    _updated_by     VARCHAR(255),
    CONSTRAINT payments_pkey PRIMARY KEY (_id)
);

CREATE TABLE resources
(
    _created_at     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _size           BIGINT,
    _updated_at     TIMESTAMP WITHOUT TIME ZONE,
    _id             CHAR(36)                    NOT NULL,
    _created_by     VARCHAR(255),
    _file_extension VARCHAR(255),
    _mime_type      VARCHAR(255),
    _name           VARCHAR(255)                NOT NULL,
    _updated_by     VARCHAR(255),
    _url            VARCHAR(255)                NOT NULL,
    CONSTRAINT resources_pkey PRIMARY KEY (_id)
);

CREATE TABLE reviews
(
    _created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at TIMESTAMP WITHOUT TIME ZONE,
    _course_id  CHAR(36)                    NOT NULL,
    _id         CHAR(36)                    NOT NULL,
    _user_id    CHAR(36)                    NOT NULL,
    _content    TEXT,
    _created_by VARCHAR(255),
    _rating     VARCHAR(255)                NOT NULL,
    _updated_by VARCHAR(255),
    CONSTRAINT reviews_pkey PRIMARY KEY (_id)
);

CREATE TABLE sections
(
    _order_index       INTEGER                     NOT NULL,
    _created_at        TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at        TIMESTAMP WITHOUT TIME ZONE,
    _course_id         CHAR(36)                    NOT NULL,
    _id                CHAR(36)                    NOT NULL,
    _created_by        VARCHAR(255),
    _description_short TEXT,
    _title             VARCHAR(255)                NOT NULL,
    _updated_by        VARCHAR(255),
    CONSTRAINT sections_pkey PRIMARY KEY (_id)
);

CREATE TABLE users
(
    _active         BOOLEAN                     NOT NULL,
    _locked         BOOLEAN                     NOT NULL,
    _update_profile BOOLEAN                     NOT NULL,
    _created_at     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _updated_at     TIMESTAMP WITHOUT TIME ZONE,
    _id             CHAR(36)                    NOT NULL,
    _avatar_url     VARCHAR(255),
    _created_by     VARCHAR(255),
    _email          VARCHAR(255)                NOT NULL,
    _facebook_url   VARCHAR(255),
    _full_name      VARCHAR(255)                NOT NULL,
    _lock_reason    TEXT,
    _password       VARCHAR(255)                NOT NULL,
    _phone          VARCHAR(255),
    _public_id      VARCHAR(255),
    _role           VARCHAR(255)                NOT NULL,
    _updated_by     VARCHAR(255),
    CONSTRAINT users_pkey PRIMARY KEY (_id)
);

CREATE TABLE videos
(
    _duration   INTEGER                     NOT NULL,
    _created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    _size       BIGINT                      NOT NULL,
    _updated_at TIMESTAMP WITHOUT TIME ZONE,
    _id         CHAR(36)                    NOT NULL,
    _owner_id   CHAR(36)                    NOT NULL,
    _created_by VARCHAR(255),
    _file_name  VARCHAR(255)                NOT NULL,
    _hls_url    VARCHAR(255),
    _public_id  VARCHAR(255),
    _status     VARCHAR(255)                NOT NULL,
    _thumbnail  VARCHAR(255),
    _title      VARCHAR(255)                NOT NULL,
    _updated_by VARCHAR(255),
    CONSTRAINT videos_pkey PRIMARY KEY (_id)
);

ALTER TABLE carts
    ADD CONSTRAINT carts__user_id_key UNIQUE (_user_id);

ALTER TABLE categories
    ADD CONSTRAINT categories__name_key UNIQUE (_name);

ALTER TABLE categories
    ADD CONSTRAINT categories__slug_key UNIQUE (_slug);

ALTER TABLE courses
    ADD CONSTRAINT courses__slug_key UNIQUE (_slug);

ALTER TABLE enrollments
    ADD CONSTRAINT enrollments__user_id__course_id_key UNIQUE (_user_id, _course_id);

ALTER TABLE lesson_progress
    ADD CONSTRAINT lesson_progress__user_id__lesson_id_key UNIQUE (_user_id, _lesson_id);

ALTER TABLE lessons
    ADD CONSTRAINT lessons__video_id_key UNIQUE (_video_id);

ALTER TABLE payments
    ADD CONSTRAINT payments__order_id_key UNIQUE (_order_id);

ALTER TABLE reviews
    ADD CONSTRAINT reviews__user_id__course_id_key UNIQUE (_user_id, _course_id);

ALTER TABLE users
    ADD CONSTRAINT users__email_key UNIQUE (_email);

ALTER TABLE users
    ADD CONSTRAINT users__phone_key UNIQUE (_phone);

ALTER TABLE enrollments
    ADD CONSTRAINT fk1yaqrhay12rxhkv99adfikopl FOREIGN KEY (_course_id) REFERENCES courses (_id) ON DELETE NO ACTION;

ALTER TABLE lessons
    ADD CONSTRAINT fk2cnb3t53j5s6sgecpcbidi58r FOREIGN KEY (_video_id) REFERENCES videos (_id) ON DELETE NO ACTION;

ALTER TABLE order_items
    ADD CONSTRAINT fk2n5orcu1bh32v39y8f73j1qfm FOREIGN KEY (_course_id) REFERENCES courses (_id) ON DELETE NO ACTION;

ALTER TABLE payments
    ADD CONSTRAINT fk46f8b0f4v3cq6xcwavnumr025 FOREIGN KEY (_order_id) REFERENCES orders (_id) ON DELETE NO ACTION;

ALTER TABLE lessons
    ADD CONSTRAINT fk5het5un2ktrsh13u6a2j5hkpi FOREIGN KEY (_section_id) REFERENCES sections (_id) ON DELETE NO ACTION;

ALTER TABLE reviews
    ADD CONSTRAINT fk5ojcpjtugo9e5l0581bdqb3e2 FOREIGN KEY (_user_id) REFERENCES users (_id) ON DELETE NO ACTION;

ALTER TABLE videos
    ADD CONSTRAINT fkai4gmdypmh2bhssrmi2eaqphr FOREIGN KEY (_owner_id) REFERENCES users (_id) ON DELETE NO ACTION;

ALTER TABLE carts
    ADD CONSTRAINT fkajgtnu65yjcbmp84porxhtq4t FOREIGN KEY (_user_id) REFERENCES users (_id) ON DELETE NO ACTION;

ALTER TABLE instructors
    ADD CONSTRAINT fkbmtvbqktfgubqb7d6tyxy5oan FOREIGN KEY (_user_id) REFERENCES users (_id) ON DELETE NO ACTION;

ALTER TABLE lesson_progress
    ADD CONSTRAINT fkc2i9kg12qevn4gqnbyeplbf1n FOREIGN KEY (_user_id) REFERENCES users (_id) ON DELETE NO ACTION;

ALTER TABLE enrollments
    ADD CONSTRAINT fkfm2mxehlu09xutyt76msjsu02 FOREIGN KEY (_user_id) REFERENCES users (_id) ON DELETE NO ACTION;

ALTER TABLE order_items
    ADD CONSTRAINT fkg9x3sibimhm5q8nnr027logni FOREIGN KEY (_order_id) REFERENCES orders (_id) ON DELETE NO ACTION;

ALTER TABLE cart_items
    ADD CONSTRAINT fkkywicdggdeusfexc6k9nucwdr FOREIGN KEY (_course_id) REFERENCES courses (_id) ON DELETE NO ACTION;

ALTER TABLE sections
    ADD CONSTRAINT fko42vxwy2eg6hftk16jy8ibgru FOREIGN KEY (_course_id) REFERENCES courses (_id) ON DELETE NO ACTION;

ALTER TABLE courses
    ADD CONSTRAINT fkou0u94fhobr0wnxm2vutoosus FOREIGN KEY (_category_id) REFERENCES categories (_id) ON DELETE NO ACTION;

ALTER TABLE orders
    ADD CONSTRAINT fkpqphdr8298urrk7amw3pmvsg9 FOREIGN KEY (_user_id) REFERENCES users (_id) ON DELETE NO ACTION;

ALTER TABLE courses
    ADD CONSTRAINT fkq5xcb4w1piclsif3ucjkv9isv FOREIGN KEY (_instructor_id) REFERENCES instructors (_user_id) ON DELETE NO ACTION;

ALTER TABLE lesson_progress
    ADD CONSTRAINT fkq8o1mt5plhsbfe0uv7lw0i6bk FOREIGN KEY (_lesson_id) REFERENCES lessons (_id) ON DELETE NO ACTION;

ALTER TABLE cart_items
    ADD CONSTRAINT fkr9xk90aocd4nxp54hy3fw7un5 FOREIGN KEY (_cart_id) REFERENCES carts (_id) ON DELETE NO ACTION;

ALTER TABLE reviews
    ADD CONSTRAINT fkt8gt9f4iiosgxh3n0urkr9xbj FOREIGN KEY (_course_id) REFERENCES courses (_id) ON DELETE NO ACTION;