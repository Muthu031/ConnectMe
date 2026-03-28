CREATE TYPE "public"."call_status" AS ENUM('INCOMING', 'OUTGOING', 'MISSED', 'COMPLETED', 'DECLINED');--> statement-breakpoint
CREATE TYPE "public"."call_type" AS ENUM('AUDIO', 'VIDEO');--> statement-breakpoint
CREATE TYPE "public"."couple_status" AS ENUM('single', 'pending', 'coupled');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('SENT', 'DELIVERED', 'READ');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('PUBLIC', 'PRIVATE', 'FRIENDS_ONLY');--> statement-breakpoint
CREATE TABLE "calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caller_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"type" "call_type" NOT NULL,
	"status" "call_status" NOT NULL,
	"started_at" timestamp,
	"ended_at" timestamp,
	"duration" integer,
	"recording_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"is_group" boolean DEFAULT false,
	"group_image" varchar(500),
	"participants" jsonb DEFAULT '[]'::jsonb,
	"last_message" text,
	"last_message_at" timestamp,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text,
	"type" "message_type" DEFAULT 'TEXT',
	"media" jsonb,
	"status" "message_status" DEFAULT 'SENT',
	"read_by" jsonb DEFAULT '[]'::jsonb,
	"delivered_to" jsonb DEFAULT '[]'::jsonb,
	"reply_to" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text,
	"data" jsonb,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"related_user_id" uuid,
	"related_resource_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"caption" text,
	"media" jsonb DEFAULT '[]'::jsonb,
	"likes" jsonb DEFAULT '[]'::jsonb,
	"comments" jsonb DEFAULT '[]'::jsonb,
	"saves" jsonb DEFAULT '[]'::jsonb,
	"shares" jsonb DEFAULT '[]'::jsonb,
	"visibility" "visibility" DEFAULT 'PUBLIC',
	"is_commenting_disabled" boolean DEFAULT false,
	"location" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"caption" text,
	"video_url" varchar(500) NOT NULL,
	"duration" integer,
	"thumbnail" varchar(500),
	"effects" jsonb DEFAULT '[]'::jsonb,
	"music" jsonb,
	"likes" jsonb DEFAULT '[]'::jsonb,
	"comments" jsonb DEFAULT '[]'::jsonb,
	"shares" jsonb DEFAULT '[]'::jsonb,
	"saves" jsonb DEFAULT '[]'::jsonb,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"media" varchar(500) NOT NULL,
	"media_type" varchar(20),
	"viewers" jsonb DEFAULT '[]'::jsonb,
	"is_expired" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"password" text NOT NULL,
	"fullName" varchar(255),
	"bio" text,
	"profilePicture" varchar(500),
	"coverPicture" varchar(500),
	"website" varchar(255),
	"isPrivate" boolean DEFAULT false NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"couplePartnerId" uuid,
	"anniversaryDate" timestamp,
	"coupleStatus" "couple_status" DEFAULT 'single' NOT NULL,
	"deviceTokens" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"isOnline" boolean DEFAULT false NOT NULL,
	"lastSeen" timestamp,
	"otp" jsonb,
	"isEmailVerified" boolean DEFAULT false NOT NULL,
	"isPhoneVerified" boolean DEFAULT false NOT NULL,
	"refreshToken" text,
	"postsCount" integer DEFAULT 0 NOT NULL,
	"followersCount" integer DEFAULT 0 NOT NULL,
	"followingCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_caller_id_users_id_fk" FOREIGN KEY ("caller_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_user_id_users_id_fk" FOREIGN KEY ("related_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reels" ADD CONSTRAINT "reels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;