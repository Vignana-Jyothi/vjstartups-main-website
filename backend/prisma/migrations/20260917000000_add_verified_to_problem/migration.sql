-- Add verified columns to Problem table
ALTER TABLE "problems"
ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "verified_by" TEXT,
ADD COLUMN "verified_at" TIMESTAMP(3),
ADD COLUMN "verification_notes" TEXT;

-- Add comment for documentation
COMMENT ON COLUMN "problems"."verified" IS 'Whether the problem has been verified by talent wing';
COMMENT ON COLUMN "problems"."verified_by" IS 'Email of user who verified the problem';
COMMENT ON COLUMN "problems"."verified_at" IS 'Timestamp when problem was verified';
COMMENT ON COLUMN "problems"."verification_notes" IS 'Optional notes from verifier';