CREATE TABLE scholars (
    id serial PRIMARY KEY, 
    roninAddress VARCHAR ( 255 ) UNIQUE NOT NULL, 
    name VARCHAR ( 255 ) NOT NULL, 
    discordid VARCHAR ( 255 ) NOT NULL, 
    encryptedPrivateKey TEXT NULL, 
    created_on TIMESTAMP NOT NULL
);

CREATE TABLE daily_stats (
    id serial PRIMARY KEY, 
    scholarId INT,
    roninAddress VARCHAR ( 255 ) NOT NULL, 
    totalSLP INT NOT NULL,
    elo INT NOT NULL,
    currentRank INT NOT NULL,
    lastTotalWinCount INT NULL,
    created_on TIMESTAMP NOT NULL,
    CONSTRAINT FK_SCHOLARID
        FOREIGN KEY(scholarId)
            REFERENCES scholars(id)
);





---
-- jarvib_db
--     scholars
--         -   id
--         -   roninAddress
--         -   name
--         -   createdOn
--         -   discordId

--     accumulated_slp
--         -   id
--         -   scholarId
--         -   roninAddress
--         -   total
--         -   createdOn

-- CREATE TABLE scholars (
--     id serial PRIMARY KEY, 
--     roninAddress VARCHAR ( 255 ) UNIQUE NOT NULL, 
--     name VARCHAR ( 255 ) NOT NULL, 
--     discordid VARCHAR ( 255 ) NOT NULL, 
--     created_on TIMESTAMP NOT NULL);

-- CREATE TABLE accumulated_SLP (
-- id SERIAL NOT NULL PRIMARY KEY,
-- scholarId INT NOT NULL,
-- roninAddress VARCHAR(255),
-- total INT NOT NULL,
-- created_on TIMESTAMP NOT NULL,
-- FOREIGN KEY (scholarId) REFERENCES scholars (id));


-- INSERT INTO accumulated_SLP(scholarId, roninAddress, total, created_on) VALUES
-- (1, 'ronin:55cce35326ba3ae2f27c3976dfbb8aa10d354407', 2300, current_timestamp);

-- INSERT INTO accumulated_SLP(scholarId, roninAddress, total, created_on) VALUES
-- (2, 'ronin:1e9d7412e75d4d89df9102f1bf796d86b0ade73f', 3375, current_timestamp);

-- INSERT INTO scholars(roninaddress, name, discordid, created_on) VALUES
-- ('ronin:2a19fe1c90655cd6ffadddc4e2c8c4508f12f1a1', 'Joseph', '645660043999445003', current_timestamp),
-- ('ronin:55cce35326ba3ae2f27c3976dfbb8aa10d354407', 'Jampot', '250629138862440448', current_timestamp),
-- ('ronin:1e9d7412e75d4d89df9102f1bf796d86b0ade73f', 'Ichiman', '543694609159684106', current_timestamp),
-- ('ronin:723d07f4547062b95c838270b3e8108c2b636764', 'Vince', '727916878890270860', current_timestamp),
-- ('ronin:cdb51e43ebd19f669ec456a049e621d802fa9034', 'Dan', '375344434121801729', current_timestamp),
-- ('ronin:c6785bde8faf553f9195fea6bfb64d4d9d00ef17', 'Ian', '763936451276570684', current_timestamp),
-- ('ronin:b31f4e1809d204fa764cdc7935a6e8072a4e7e6a', 'Aljon', '248055589832228864', current_timestamp);

-- get 2 latest records;
-- SELECT * 
-- FROM  accumulated_slp
-- ORDER  BY "created_on" DESC LIMIT 2;`