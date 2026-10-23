-- The Digital Wing and the Flying Wing do not exist, so they come off the site. The seed in
-- 20260930000000_add_site_content no longer inserts them; this removes the rows already in the
-- production database. Safe to run more than once: the deploy applies this file on every deploy.

DELETE FROM "site_content" WHERE "kind" = 'wing' AND "slug" IN ('digital-wing', 'flying-wing');
