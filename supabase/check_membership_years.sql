-- Check membership years table
SELECT * FROM membership_years ORDER BY year_start DESC;

-- If empty, create the current year
INSERT INTO membership_years (year_start, year_end, renewal_fee)
VALUES ('2026-04-01', '2027-03-31', 10.00)
ON CONFLICT DO NOTHING;
