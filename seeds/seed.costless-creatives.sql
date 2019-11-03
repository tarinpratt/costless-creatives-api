BEGIN;

TRUNCATE
profile,
users
RESTART IDENTITY CASCADE;

INSERT INTO users
(username, email, password)
VALUES
('DanceLyfe', 'email@gmail.com', '$2a$04$hzNvsEA07oIMxge2AGpgg.qIFvqjz1R9Nkgz/ZLQP4zFUDCJQ/0V2'),
('ReadHeadBeauty', 'email@gmail.com', '$2a$04$bfK8kG9cxLakktVGPfK2tOtfWwSjTRbsjSjtc0rS6hdjW7vunt3ii'),
('JakeTheHairGuy', 'email@gmail.com', '$2a$04$fsfFTe66fCXo8PkubC9VpuYglmz8aRnNVjGJ/fDlnwmk6Iv3NUf9S'),
('YouCanCallMeAl', 'email@gmail.com', '$2a$04$mgnj/cKy.dkN7bstuLjDh.0Y.NWmC/CR4VkTKcKtd/qm9BxV5B6By'),
('JessLovesMakeUp', 'email@gmail.com', '$2a$04$mgnj/cKy.dkN7bstuLjDh.0Y.NWmC/CR4VkTKcKtd/qm9BxV5B6By')
;

INSERT INTO profile
(profile_pic, bio, user_id)
VALUES
('https://i.imgur.com/TZtcMca.jpg', 'Hey my name is Kat and I''m a professional dancer/choreographer in LA. I''m really trying to broaden my career in choreography currently and I''m trying to collect as much footage as I can. If you''re a dancer looking to practice dancing on film, hit me up! I film combos all of the time!', 1),
('https://i.imgur.com/M9nwgOo.jpg', 'Hey, I''m Rebecca. New to the Los Angeles area and fulfilling my modeling career. Looking for photographers who are open for abstract shoots.', 2),
('https://i.imgur.com/MNnNAh2.jpg', 'HairStylist at SalonCentric. Always looking for open minded models to experiment on!', 3),
('https://i.imgur.com/qWAXea9.jpg', 'Aspiring singer in North Hollywood. ALWAYS down to collab with other musicians. Shoot me your info!', 4),
('https://i.imgur.com/8mTnt5i.jpg', 'MUA at Sephora. Trying to put together look books and gain exposure to eventually work on film.', 5)
;

INSERT INTO posts
(description, project_pic, user_id)
VALUES
('I''m looking to shoot a video this weekend with 3 dancers. The choreo will be in heels and super classy. My friend is a videographer and will be shooting the vid, so it will be good quality footage to have in the future. Message me if interested!', 'https://i.imgur.com/c4ZeRVh.jpg', 1),
('Hi all! I''m a model who just moved to LA and am looking for a photographer who might want to collab for headshots! Hit me up!', 'https://i.imgur.com/Aon6qga.jpg', 2),
('Hi guys. Lookin for a hair model who wouldn''t mind me doing a pixie cut, and maybe dying it blue. Hit me up.', 'https://i.imgur.com/tYI9qGX.jpg', 3),
('What up everyone. I''m looking for someone to shoot me singing a single I just wrote. I just need some nice quality content that I can use to promote. Thanks!', 'https://i.imgur.com/LcoNgt8.jpg', 4),
('Hey Guys! Looking for some models down to get their make up done and willing shoot for my portfolio! Gunna be a glam theme. Let me know!', 'https://i.imgur.com/nv7hhUf.jpg', 5)
;

 
COMMIT;