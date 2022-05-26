-- user table
  CREATE TABLE users(id serial primary key, firstName varchar(255), lastName varchar(255), age int, email varchar(255) NOT NULL UNIQUE, password varchar(255) NOT NULL, created_at timestamp default current_timestamp, is_active bool default false, is_admin bool default false, is_blocked bool default false);

-- fileUploading table
  CREATE TABLE files(id serial primary key, owner int NOT NULL, FOREIGN KEY(owner) REFERENCES users(id), file_name varchar(255) NOT NULL, mime_type VARCHAR(255),file_data BYTEA NOT NULL, created_at timestamp default current_timestamp);

-- signup creating query
  INSERT INTO users(firstName, lastName, age, email, password) VALUES('$firstName', '$lastName', '$age', '$email', '$password') RETURNING firstName, lastName,age, email;