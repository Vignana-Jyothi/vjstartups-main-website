-- Safe to run more than once: the deploy workflow applies this file on every deploy (the
-- production database has no Prisma migration history), so each statement skips work that's
-- already been done.

-- CreateTable
CREATE TABLE IF NOT EXISTS "success_stories" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "storyDate" TEXT NOT NULL DEFAULT '',
    "overview" TEXT NOT NULL DEFAULT '',
    "participants" JSONB NOT NULL DEFAULT '[]',
    "journey" JSONB NOT NULL DEFAULT '[]',
    "outcomes" JSONB NOT NULL DEFAULT '[]',
    "quotes" JSONB NOT NULL DEFAULT '[]',
    "gallery" JSONB NOT NULL DEFAULT '[]',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "achievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "postedByName" TEXT NOT NULL DEFAULT '',
    "postedByEmail" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "success_stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "success_stories_programId_idx" ON "success_stories"("programId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "success_stories_isPublished_idx" ON "success_stories"("isPublished");


-- The first story on record, moved here from the frontend's data file (same id, so its links keep working).
INSERT INTO "success_stories" ("id","programId","season","title","subtitle","storyDate","overview","participants","journey","outcomes","quotes","gallery","tags","achievements","featured","isPublished","postedByName","postedByEmail","createdAt","updatedAt")
VALUES ($story$startup-challenge-season-2-veda-dance$story$,$story$startup-challenge-2$story$,$story$Season 2$story$,$story$From ₹0 to ₹12,000: Dance Coaching$story$,$story$How Veda trained apartment kids for Ganesh fest dance event.$story$,$story$Aug-2025$story$,$story$Veda started with zero investment and identified an opportunity to teach dance to kids in her apartment complex for the upcoming Ganesh festival. Through her structured approach to training and community engagement, she successfully earned ₹12,000 while creating a memorable cultural experience for the children and families.$story$,
$story$[{"name": "Veda Nampally", "branch": "Computer Science - CSBS", "year": "2nd", "imageUrl": "/success-stories/veda_nampally.webp", "socialLinks": [{"platform": "linkedin", "url": "https://linkedin.com/in/veda-nampally", "displayName": "LinkedIn"}, {"platform": "instagram", "url": "https://instagram.com/veda_nampally", "displayName": "Instagram"}]}]$story$::jsonb,$story$[{"phase": "Day 1-2: Opportunity Identification", "description": "Noticed apartment kids needed dance training for Ganesh festival celebrations", "achievement": "Identified 20+ interested kids and confirmed parent interest"}, {"phase": "Day 3-5: Program Design", "description": "Created structured dance curriculum and practice schedule for different age groups", "achievement": "Designed 10-day intensive training program with daily 2-hour sessions"}, {"phase": "Day 6-10: Training Delivery", "description": "Conducted daily dance training sessions with kids aged 5-15 years", "achievement": "Successfully trained 10 kids with 90% attendance rate"}, {"phase": "Day 11-15: Event Success", "description": "Kids performed at the Ganesh festival celebration with great success", "achievement": "Standing ovation performance, ₹12,000 total earnings, requests for future events"}]$story$::jsonb,$story$[{"title": "Financial Success", "description": "Generated ₹12,000 revenue with ₹1,000 initial investment", "metrics": "1200% ROI in 15 days"}, {"title": "Community Impact", "description": "Trained 10 kids and created memorable cultural experience for families", "metrics": "90+% attendance rate, 100% parent satisfaction"}, {"title": "Skill Development", "description": "Enhanced teaching, leadership and event management skills", "metrics": "5 requests for future dance training programs"}]$story$::jsonb,$story$[{"text": "I never thought I could turn my passion for dance into a business opportunity. The Startup Challenge pushed me to think creatively and take action. Seeing the kids perform with confidence was the biggest reward.", "author": "Veda Nampally", "designation": "Dance Instructor & Entrepreneur"}]$story$::jsonb,$story$[{"type": "image", "url": "/success-stories/veda_team.webp", "caption": "Veda with the kids during dance training session"}, {"type": "video", "url": "https://youtu.be/zPyqROpLbOY?t=889", "caption": "Final presentation at Startup Challenge showcase"}]$story$::jsonb,
ARRAY[$story$dance-coaching$story$,$story$community-engagement$story$,$story$cultural-events$story$,$story$teaching$story$]::TEXT[],ARRAY[$story$1200% Return on Investment$story$,$story$10 Kids Successfully Trained$story$,$story$100% Parent Satisfaction$story$,$story$Standing Ovation Performance$story$]::TEXT[],
true,true,$story$VJ Startups$story$,$story$$story$,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
