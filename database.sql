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

-- get 2 latest records;
-- SELECT * 
-- FROM  accumulated_slp
-- ORDER  BY "created_on" DESC LIMIT 2;`