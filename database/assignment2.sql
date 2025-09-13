-- assignment2.sql (Task 1)

-- 1) Insert Tony Stark
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2) Update account_type to 'Admin' using PK via subquery
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = (
  SELECT account_id FROM public.account WHERE account_email = 'tony@starkent.com' LIMIT 1
);

-- 3) Delete Tony Stark using PK via subquery
DELETE FROM public.account
WHERE account_id = (
  SELECT account_id FROM public.account WHERE account_email = 'tony@starkent.com' LIMIT 1
);

-- 4) Update description for GM Hummer using REPLACE (uses PK via subquery)
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = (
  SELECT inv_id FROM public.inventory WHERE inv_make = 'GM' AND inv_model = 'Hummer' LIMIT 1
);

-- 5) Inner join select for category 'Sport'
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6) Add '/vehicles' to inv_image and inv_thumbnail for all inventory rows
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
