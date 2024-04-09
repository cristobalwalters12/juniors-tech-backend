INSERT INTO "user"
(id, email, username, password, avatar_url, birthdate, updated_at, deleted_at, muted_at, has_open_report)
VALUES
('RuxfXYaO5Y', 'admin1234@correo.com', 'admin1234', '$2b$10$NckmokVn.WK/wSA.9SFfeuAXHwLNq4M6r7zoManfwcPyCtTqZgwO2', 'https://docs.material-tailwind.com/img/face-2.jpg', '1990-10-05');
('q8uwneJuCu', 'mod1234@correo.com', 'mod1234', '$2b$10$lSFL59i2on7ECzlSLqpJ8ebMsvZchFs00XRWfSZP3r5R9xtmI5.RK', 'https://docs.material-tailwind.com/img/face-3.jpg', '1990-10-05');
('r7Q-Fnug43', 'user1234@correo.com', 'user1234', '$2b$10$KYIv00g2R0F0nRBtGTO09.Yv3lhMVNdhui7W/JMqYGy7CNC7VXJ/K', 'https://docs.material-tailwind.com/img/face-4.jpg', '1990-10-05');

INSERT INTO "user_role"
(user_id, role_id)
VALUES
('RuxfXYaO5Y', '2SbUCqylYo');
('q8uwneJuCu', '2SbUCqylYo');
('r7Q-Fnug43', '2SbUCqylYo');
('RuxfXYaO5Y', 'iBM3mRqi3F'),
('q8uwneJuCu', '8h5NIrFj4K');