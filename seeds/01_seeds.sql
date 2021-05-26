INSERT INTO users (name, email, password)
VALUES
  ('Darcy Dog', 'darcy@dog.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Somebody Important', 'important_person@critical.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Puppet Master', 'tpm@controllers.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Whisky Jack', 'Whisky.Jack@malaz.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
  
INSERT INTO properties (
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active
)
VALUES
  (
    1,
    'Dog House',
    'In the back yard',
    'www.example.com/thumb',
    'www.example.com/cover',
    22,
    0,
    0,
    1,
    'Canada',
    'Doggone Rd',
    'Calgary',
    'AB',
    'B0W 0W0',
    TRUE
  ),
  (
    4,
    'Azath House',
    'Cozy old place',
    'www.example.com/malaz/thumb',
    'www.example.com/malaz/cover',
    14000,
    16,
    6,
    10,
    'Malazan Empire',
    'Malaz Way.',
    'Malaz City',
    'Wherever the capitol is',
    'R4E 5T1',
    TRUE
  ),
  (
    2,
    'Important Place',
    'A place of importance for important people',
    'www.example.com/important/thumb',
    'www.example.com/important/cover',
    400,
    2,
    4,
    4,
    'Canada',
    'Important St',
    'Important City',
    'Important Province',
    '1M9 4T1',
    FALSE
  );
  
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
  ('2021-05-01', '2021-05-7', 1, 3),
  ('0002-06-19', '9894-12-31', 2, 2),
  ('2021-03-29', '2021-04-07', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES
(3, 1, 1, 5, 'message one'),
(2, 2, 2, 4, 'message two'),
(1, 3, 3, 2, 'message three');