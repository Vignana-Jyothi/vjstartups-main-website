-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'STUDENT', 'WING_MEMBER', 'WING_MASTER', 'ADMIN');

-- CreateEnum
CREATE TYPE "worthiness_level" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "access_level" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "funding_status" AS ENUM ('BOOTSTRAPPED', 'SEEKING_FUNDING', 'PRE_SEED', 'SEED', 'SERIES_A', 'LATER_STAGE');

-- CreateEnum
CREATE TYPE "incorporation_status" AS ENUM ('NOT_INCORPORATED', 'INCORPORATED', 'LLC', 'PARTNERSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "questionnaire_status" AS ENUM ('DRAFT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "project_member_role" AS ENUM ('MEMBER', 'LEAD');

-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');

-- CreateEnum
CREATE TYPE "task_priority" AS ENUM ('URGENT', 'HIGH', 'MEDIUM', 'LOW', 'NONE');

-- CreateEnum
CREATE TYPE "stage_type" AS ENUM ('PROBLEM', 'IDEA', 'STARTUP');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'STUDENT',
    "adminToken" TEXT,
    "adminTokenCreatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "briefparagraph" TEXT NOT NULL,
    "description" TEXT,
    "marketSize" TEXT,
    "existingSolutions" TEXT,
    "currentGaps" TEXT,
    "targetCustomers" TEXT,
    "image" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "background" TEXT,
    "scalability" TEXT,
    "addedByName" TEXT NOT NULL,
    "addedByEmail" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_collaborators" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_upvotes" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_upvotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_comments" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_comment_likes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_comment_replies" (
    "id" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_comment_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_reply_likes" (
    "id" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_reply_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "titleImage" TEXT,
    "relatedProblemId" TEXT,
    "stage" INTEGER NOT NULL DEFAULT 1,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "mentor" TEXT,
    "contact" TEXT,
    "addedByName" TEXT NOT NULL,
    "addedByEmail" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetCustomers" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isStartupWorthy" BOOLEAN NOT NULL DEFAULT false,
    "worthinessLevel" "worthiness_level",
    "evaluatedAt" TIMESTAMP(3),
    "hasStartupCreated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_collaborators" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_team_members" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_upvotes" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_upvotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_comments" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_comment_likes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_comment_replies" (
    "id" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_comment_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_reply_likes" (
    "id" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_reply_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_attachments" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "accessLevel" "access_level" NOT NULL DEFAULT 'PUBLIC',
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_links" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "accessLevel" "access_level" NOT NULL DEFAULT 'PUBLIC',
    "addedBy" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startups" (
    "id" TEXT NOT NULL,
    "startupName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "logo" TEXT,
    "founders" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "fundingStatus" "funding_status" NOT NULL,
    "fundingAmount" TEXT,
    "revenue" TEXT,
    "customers" TEXT,
    "markets" TEXT,
    "incorporationStatus" "incorporation_status" NOT NULL,
    "website" TEXT,
    "businessModel" TEXT,
    "keyFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "technologyStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "marketSize" TEXT,
    "annualGrowthRate" TEXT,
    "targetUsers" TEXT,
    "teamSize" INTEGER NOT NULL DEFAULT 1,
    "pitchDeck" TEXT,
    "onePager" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "problemStatement" TEXT,
    "solution" TEXT,
    "targetAudience" TEXT,
    "competitiveAdvantage" TEXT,
    "createdBy" TEXT NOT NULL,
    "ideaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "startups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_team_members" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "startup_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_milestones" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "startup_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_support_programs" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "startup_support_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_responses" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT,
    "ideaId" TEXT NOT NULL,
    "stageFrom" INTEGER NOT NULL,
    "stageTo" INTEGER NOT NULL,
    "responses" JSONB NOT NULL,
    "overallScore" INTEGER,
    "status" "questionnaire_status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaire_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_scores" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "problemClarity" INTEGER,
    "marketPotential" INTEGER,
    "solutionViability" INTEGER,
    "competitivePosition" INTEGER,
    "executionReadiness" INTEGER,

    CONSTRAINT "questionnaire_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_recommendations" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "questionnaire_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_criteria" (
    "id" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "revenueModelValidated" BOOLEAN NOT NULL DEFAULT false,
    "customerWillingnessToPay" BOOLEAN NOT NULL DEFAULT false,
    "marketValidation" BOOLEAN NOT NULL DEFAULT false,
    "revenueGenerated" BOOLEAN NOT NULL DEFAULT false,
    "technicalReadiness" BOOLEAN NOT NULL DEFAULT false,
    "customerBase" BOOLEAN NOT NULL DEFAULT false,
    "scalabilityPlan" BOOLEAN NOT NULL DEFAULT false,
    "metCriteria" INTEGER NOT NULL DEFAULT 0,
    "totalCriteria" INTEGER NOT NULL DEFAULT 7,
    "isStartupWorthy" BOOLEAN NOT NULL DEFAULT false,
    "worthinessLevel" "worthiness_level",

    CONSTRAINT "questionnaire_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#7c3aed',
    "emoji" TEXT NOT NULL DEFAULT '📋',
    "status" "project_status" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT,
    "role" "project_member_role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "task_status" NOT NULL DEFAULT 'TODO',
    "priority" "task_priority" NOT NULL DEFAULT 'NONE',
    "projectId" TEXT NOT NULL,
    "assigneeUserId" TEXT,
    "assigneeName" TEXT,
    "assigneePicture" TEXT,
    "labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dueDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdByUserId" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_comments" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorPicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postedByName" TEXT NOT NULL,
    "postedByEmail" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage_notifications" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "ideaTitle" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT,
    "userAvatar" TEXT,
    "previousStage" INTEGER NOT NULL,
    "newStage" INTEGER NOT NULL,
    "stageName" TEXT NOT NULL,
    "stageType" "stage_type" NOT NULL DEFAULT 'IDEA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stage_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_adminToken_key" ON "users"("adminToken");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "problems_problemId_key" ON "problems"("problemId");

-- CreateIndex
CREATE INDEX "problems_problemId_idx" ON "problems"("problemId");

-- CreateIndex
CREATE INDEX "problems_addedByEmail_idx" ON "problems"("addedByEmail");

-- CreateIndex
CREATE INDEX "problems_createdAt_idx" ON "problems"("createdAt");

-- CreateIndex
CREATE INDEX "problem_collaborators_problemId_idx" ON "problem_collaborators"("problemId");

-- CreateIndex
CREATE INDEX "problem_collaborators_email_idx" ON "problem_collaborators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "problem_collaborators_problemId_email_key" ON "problem_collaborators"("problemId", "email");

-- CreateIndex
CREATE INDEX "problem_upvotes_problemId_idx" ON "problem_upvotes"("problemId");

-- CreateIndex
CREATE INDEX "problem_upvotes_userEmail_idx" ON "problem_upvotes"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "problem_upvotes_problemId_userEmail_key" ON "problem_upvotes"("problemId", "userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "problem_comments_commentId_key" ON "problem_comments"("commentId");

-- CreateIndex
CREATE INDEX "problem_comments_problemId_idx" ON "problem_comments"("problemId");

-- CreateIndex
CREATE INDEX "problem_comments_email_idx" ON "problem_comments"("email");

-- CreateIndex
CREATE INDEX "problem_comments_createdAt_idx" ON "problem_comments"("createdAt");

-- CreateIndex
CREATE INDEX "problem_comment_likes_commentId_idx" ON "problem_comment_likes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "problem_comment_likes_commentId_userEmail_key" ON "problem_comment_likes"("commentId", "userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "problem_comment_replies_replyId_key" ON "problem_comment_replies"("replyId");

-- CreateIndex
CREATE INDEX "problem_comment_replies_commentId_idx" ON "problem_comment_replies"("commentId");

-- CreateIndex
CREATE INDEX "problem_comment_replies_createdAt_idx" ON "problem_comment_replies"("createdAt");

-- CreateIndex
CREATE INDEX "problem_reply_likes_replyId_idx" ON "problem_reply_likes"("replyId");

-- CreateIndex
CREATE UNIQUE INDEX "problem_reply_likes_replyId_userEmail_key" ON "problem_reply_likes"("replyId", "userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ideas_ideaId_key" ON "ideas"("ideaId");

-- CreateIndex
CREATE INDEX "ideas_ideaId_idx" ON "ideas"("ideaId");

-- CreateIndex
CREATE INDEX "ideas_addedByEmail_idx" ON "ideas"("addedByEmail");

-- CreateIndex
CREATE INDEX "ideas_relatedProblemId_idx" ON "ideas"("relatedProblemId");

-- CreateIndex
CREATE INDEX "ideas_stage_idx" ON "ideas"("stage");

-- CreateIndex
CREATE INDEX "ideas_createdAt_idx" ON "ideas"("createdAt");

-- CreateIndex
CREATE INDEX "idea_collaborators_ideaId_idx" ON "idea_collaborators"("ideaId");

-- CreateIndex
CREATE INDEX "idea_collaborators_email_idx" ON "idea_collaborators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "idea_collaborators_ideaId_email_key" ON "idea_collaborators"("ideaId", "email");

-- CreateIndex
CREATE INDEX "idea_team_members_ideaId_idx" ON "idea_team_members"("ideaId");

-- CreateIndex
CREATE INDEX "idea_upvotes_ideaId_idx" ON "idea_upvotes"("ideaId");

-- CreateIndex
CREATE INDEX "idea_upvotes_userEmail_idx" ON "idea_upvotes"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "idea_upvotes_ideaId_userEmail_key" ON "idea_upvotes"("ideaId", "userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "idea_comments_commentId_key" ON "idea_comments"("commentId");

-- CreateIndex
CREATE INDEX "idea_comments_ideaId_idx" ON "idea_comments"("ideaId");

-- CreateIndex
CREATE INDEX "idea_comments_email_idx" ON "idea_comments"("email");

-- CreateIndex
CREATE INDEX "idea_comments_createdAt_idx" ON "idea_comments"("createdAt");

-- CreateIndex
CREATE INDEX "idea_comment_likes_commentId_idx" ON "idea_comment_likes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "idea_comment_likes_commentId_userEmail_key" ON "idea_comment_likes"("commentId", "userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "idea_comment_replies_replyId_key" ON "idea_comment_replies"("replyId");

-- CreateIndex
CREATE INDEX "idea_comment_replies_commentId_idx" ON "idea_comment_replies"("commentId");

-- CreateIndex
CREATE INDEX "idea_comment_replies_createdAt_idx" ON "idea_comment_replies"("createdAt");

-- CreateIndex
CREATE INDEX "idea_reply_likes_replyId_idx" ON "idea_reply_likes"("replyId");

-- CreateIndex
CREATE UNIQUE INDEX "idea_reply_likes_replyId_userEmail_key" ON "idea_reply_likes"("replyId", "userEmail");

-- CreateIndex
CREATE INDEX "idea_attachments_ideaId_idx" ON "idea_attachments"("ideaId");

-- CreateIndex
CREATE INDEX "idea_attachments_accessLevel_idx" ON "idea_attachments"("accessLevel");

-- CreateIndex
CREATE INDEX "idea_links_ideaId_idx" ON "idea_links"("ideaId");

-- CreateIndex
CREATE INDEX "idea_links_accessLevel_idx" ON "idea_links"("accessLevel");

-- CreateIndex
CREATE UNIQUE INDEX "startups_ideaId_key" ON "startups"("ideaId");

-- CreateIndex
CREATE INDEX "startups_createdBy_idx" ON "startups"("createdBy");

-- CreateIndex
CREATE INDEX "startups_ideaId_idx" ON "startups"("ideaId");

-- CreateIndex
CREATE INDEX "startups_stage_idx" ON "startups"("stage");

-- CreateIndex
CREATE INDEX "startups_createdAt_idx" ON "startups"("createdAt");

-- CreateIndex
CREATE INDEX "startup_team_members_startupId_idx" ON "startup_team_members"("startupId");

-- CreateIndex
CREATE INDEX "startup_milestones_startupId_idx" ON "startup_milestones"("startupId");

-- CreateIndex
CREATE INDEX "startup_milestones_date_idx" ON "startup_milestones"("date");

-- CreateIndex
CREATE INDEX "startup_support_programs_startupId_idx" ON "startup_support_programs"("startupId");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_responses_responseId_key" ON "questionnaire_responses"("responseId");

-- CreateIndex
CREATE INDEX "questionnaire_responses_ideaId_idx" ON "questionnaire_responses"("ideaId");

-- CreateIndex
CREATE INDEX "questionnaire_responses_userEmail_idx" ON "questionnaire_responses"("userEmail");

-- CreateIndex
CREATE INDEX "questionnaire_responses_createdAt_idx" ON "questionnaire_responses"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_scores_questionnaireId_key" ON "questionnaire_scores"("questionnaireId");

-- CreateIndex
CREATE INDEX "questionnaire_recommendations_questionnaireId_idx" ON "questionnaire_recommendations"("questionnaireId");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_criteria_questionnaireId_key" ON "questionnaire_criteria"("questionnaireId");

-- CreateIndex
CREATE INDEX "projects_createdBy_idx" ON "projects"("createdBy");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt");

-- CreateIndex
CREATE INDEX "project_members_projectId_idx" ON "project_members"("projectId");

-- CreateIndex
CREATE INDEX "project_members_userId_idx" ON "project_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_projectId_userId_key" ON "project_members"("projectId", "userId");

-- CreateIndex
CREATE INDEX "tasks_projectId_status_idx" ON "tasks"("projectId", "status");

-- CreateIndex
CREATE INDEX "tasks_projectId_order_idx" ON "tasks"("projectId", "order");

-- CreateIndex
CREATE INDEX "tasks_assigneeUserId_idx" ON "tasks"("assigneeUserId");

-- CreateIndex
CREATE INDEX "tasks_createdByUserId_idx" ON "tasks"("createdByUserId");

-- CreateIndex
CREATE INDEX "task_comments_taskId_idx" ON "task_comments"("taskId");

-- CreateIndex
CREATE INDEX "task_comments_createdAt_idx" ON "task_comments"("createdAt");

-- CreateIndex
CREATE INDEX "announcements_isActive_idx" ON "announcements"("isActive");

-- CreateIndex
CREATE INDEX "announcements_createdAt_idx" ON "announcements"("createdAt");

-- CreateIndex
CREATE INDEX "stage_notifications_ideaId_createdAt_idx" ON "stage_notifications"("ideaId", "createdAt");

-- CreateIndex
CREATE INDEX "stage_notifications_userEmail_createdAt_idx" ON "stage_notifications"("userEmail", "createdAt");

-- CreateIndex
CREATE INDEX "stage_notifications_createdAt_idx" ON "stage_notifications"("createdAt");

-- CreateIndex
CREATE INDEX "stage_notifications_expiresAt_idx" ON "stage_notifications"("expiresAt");

-- AddForeignKey
ALTER TABLE "problems" ADD CONSTRAINT "problems_addedByEmail_fkey" FOREIGN KEY ("addedByEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_collaborators" ADD CONSTRAINT "problem_collaborators_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_upvotes" ADD CONSTRAINT "problem_upvotes_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_upvotes" ADD CONSTRAINT "problem_upvotes_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_comments" ADD CONSTRAINT "problem_comments_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_comments" ADD CONSTRAINT "problem_comments_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_comment_likes" ADD CONSTRAINT "problem_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "problem_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_comment_replies" ADD CONSTRAINT "problem_comment_replies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "problem_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_reply_likes" ADD CONSTRAINT "problem_reply_likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "problem_comment_replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_addedByEmail_fkey" FOREIGN KEY ("addedByEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_relatedProblemId_fkey" FOREIGN KEY ("relatedProblemId") REFERENCES "problems"("problemId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_collaborators" ADD CONSTRAINT "idea_collaborators_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_team_members" ADD CONSTRAINT "idea_team_members_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_upvotes" ADD CONSTRAINT "idea_upvotes_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_upvotes" ADD CONSTRAINT "idea_upvotes_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_comments" ADD CONSTRAINT "idea_comments_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_comments" ADD CONSTRAINT "idea_comments_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_comment_likes" ADD CONSTRAINT "idea_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "idea_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_comment_replies" ADD CONSTRAINT "idea_comment_replies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "idea_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_reply_likes" ADD CONSTRAINT "idea_reply_likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "idea_comment_replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_attachments" ADD CONSTRAINT "idea_attachments_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_links" ADD CONSTRAINT "idea_links_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startups" ADD CONSTRAINT "startups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startups" ADD CONSTRAINT "startups_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("ideaId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startup_team_members" ADD CONSTRAINT "startup_team_members_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startup_milestones" ADD CONSTRAINT "startup_milestones_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startup_support_programs" ADD CONSTRAINT "startup_support_programs_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("ideaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_scores" ADD CONSTRAINT "questionnaire_scores_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaire_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_recommendations" ADD CONSTRAINT "questionnaire_recommendations_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaire_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_criteria" ADD CONSTRAINT "questionnaire_criteria_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaire_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_notifications" ADD CONSTRAINT "stage_notifications_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("ideaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_notifications" ADD CONSTRAINT "stage_notifications_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
