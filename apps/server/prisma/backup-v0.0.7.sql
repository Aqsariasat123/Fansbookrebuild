--
-- PostgreSQL database dump
--

\restrict zHYzQtov3kH66c6czD2SUDrJQrBEVoJgfE1RsJyupheIi4bTnsFboeXnf21sK1r

-- Dumped from database version 15.16 (Homebrew)
-- Dumped by pg_dump version 15.16 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: aqsa
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO aqsa;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: aqsa
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BadgeCategory; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."BadgeCategory" AS ENUM (
    'CONTENT',
    'SOCIAL',
    'ENGAGEMENT',
    'REVENUE',
    'SPECIAL'
);


ALTER TYPE public."BadgeCategory" OWNER TO aqsa;

--
-- Name: BadgeRarity; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."BadgeRarity" AS ENUM (
    'COMMON',
    'RARE',
    'EPIC',
    'LEGENDARY'
);


ALTER TYPE public."BadgeRarity" OWNER TO aqsa;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'COMPLETED',
    'NO_SHOW'
);


ALTER TYPE public."BookingStatus" OWNER TO aqsa;

--
-- Name: CallStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."CallStatus" AS ENUM (
    'RINGING',
    'ACTIVE',
    'ENDED',
    'MISSED',
    'REJECTED'
);


ALTER TYPE public."CallStatus" OWNER TO aqsa;

--
-- Name: ListingCategory; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."ListingCategory" AS ENUM (
    'DIGITAL_CONTENT',
    'PHYSICAL_MERCH',
    'EXPERIENCE',
    'CUSTOM_CONTENT',
    'SHOUTOUT'
);


ALTER TYPE public."ListingCategory" OWNER TO aqsa;

--
-- Name: ListingStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."ListingStatus" AS ENUM (
    'ACTIVE',
    'SOLD',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public."ListingStatus" OWNER TO aqsa;

--
-- Name: ListingType; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."ListingType" AS ENUM (
    'FIXED_PRICE',
    'AUCTION'
);


ALTER TYPE public."ListingType" OWNER TO aqsa;

--
-- Name: LiveStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."LiveStatus" AS ENUM (
    'SCHEDULED',
    'LIVE',
    'ENDED'
);


ALTER TYPE public."LiveStatus" OWNER TO aqsa;

--
-- Name: MediaType; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."MediaType" AS ENUM (
    'IMAGE',
    'VIDEO'
);


ALTER TYPE public."MediaType" OWNER TO aqsa;

--
-- Name: MessageType; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."MessageType" AS ENUM (
    'TEXT',
    'IMAGE',
    'VIDEO',
    'TIP'
);


ALTER TYPE public."MessageType" OWNER TO aqsa;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."NotificationType" AS ENUM (
    'LIKE',
    'COMMENT',
    'FOLLOW',
    'SUBSCRIBE',
    'TIP',
    'MESSAGE',
    'LIVE',
    'STORY',
    'MENTION',
    'SYSTEM'
);


ALTER TYPE public."NotificationType" OWNER TO aqsa;

--
-- Name: OtpType; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."OtpType" AS ENUM (
    'EMAIL_VERIFY',
    'PASSWORD_RESET'
);


ALTER TYPE public."OtpType" OWNER TO aqsa;

--
-- Name: PaymentGateway; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."PaymentGateway" AS ENUM (
    'CCBILL',
    'MIREXPAY'
);


ALTER TYPE public."PaymentGateway" OWNER TO aqsa;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO aqsa;

--
-- Name: PostVisibility; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."PostVisibility" AS ENUM (
    'PUBLIC',
    'SUBSCRIBERS',
    'TIER_SPECIFIC'
);


ALTER TYPE public."PostVisibility" OWNER TO aqsa;

--
-- Name: ReportReason; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."ReportReason" AS ENUM (
    'SPAM',
    'HARASSMENT',
    'NUDITY',
    'COPYRIGHT',
    'OTHER'
);


ALTER TYPE public."ReportReason" OWNER TO aqsa;

--
-- Name: ReportStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."ReportStatus" AS ENUM (
    'OPEN',
    'INVESTIGATING',
    'RESOLVED',
    'DISMISSED'
);


ALTER TYPE public."ReportStatus" OWNER TO aqsa;

--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'ACTIVE',
    'EXPIRED',
    'CANCELLED',
    'PAST_DUE'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO aqsa;

--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."TransactionStatus" OWNER TO aqsa;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."TransactionType" AS ENUM (
    'DEPOSIT',
    'SUBSCRIPTION',
    'TIP_SENT',
    'TIP_RECEIVED',
    'PPV_PURCHASE',
    'PPV_EARNING',
    'WITHDRAWAL',
    'REFUND',
    'BID_HOLD',
    'BID_RELEASE',
    'MARKETPLACE_PURCHASE',
    'MARKETPLACE_EARNING'
);


ALTER TYPE public."TransactionType" OWNER TO aqsa;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."UserRole" AS ENUM (
    'FAN',
    'CREATOR',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO aqsa;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'BANNED',
    'DEACTIVATED'
);


ALTER TYPE public."UserStatus" OWNER TO aqsa;

--
-- Name: WithdrawalStatus; Type: TYPE; Schema: public; Owner: aqsa
--

CREATE TYPE public."WithdrawalStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'REJECTED'
);


ALTER TYPE public."WithdrawalStatus" OWNER TO aqsa;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "adminId" text NOT NULL,
    action text NOT NULL,
    "targetType" text NOT NULL,
    "targetId" text NOT NULL,
    details jsonb,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO aqsa;

--
-- Name: Badge; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Badge" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    rarity public."BadgeRarity" DEFAULT 'COMMON'::public."BadgeRarity" NOT NULL,
    criteria jsonb,
    category public."BadgeCategory" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Badge" OWNER TO aqsa;

--
-- Name: Bid; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Bid" (
    id text NOT NULL,
    "listingId" text NOT NULL,
    "bidderId" text NOT NULL,
    amount double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Bid" OWNER TO aqsa;

--
-- Name: Block; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Block" (
    id text NOT NULL,
    "blockerId" text NOT NULL,
    "blockedId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Block" OWNER TO aqsa;

--
-- Name: Booking; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "creatorId" text NOT NULL,
    "fanId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "timeSlot" text NOT NULL,
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Booking" OWNER TO aqsa;

--
-- Name: Bookmark; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Bookmark" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Bookmark" OWNER TO aqsa;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "authorId" text NOT NULL,
    "parentId" text,
    text text NOT NULL,
    "likeCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO aqsa;

--
-- Name: CommentLike; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."CommentLike" (
    id text NOT NULL,
    "commentId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CommentLike" OWNER TO aqsa;

--
-- Name: Conversation; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Conversation" (
    id text NOT NULL,
    "participant1Id" text NOT NULL,
    "participant2Id" text NOT NULL,
    "lastMessageAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastMessage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Conversation" OWNER TO aqsa;

--
-- Name: Faq; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Faq" (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Faq" OWNER TO aqsa;

--
-- Name: Follow; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Follow" (
    id text NOT NULL,
    "followerId" text NOT NULL,
    "followingId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Follow" OWNER TO aqsa;

--
-- Name: Like; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Like" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Like" OWNER TO aqsa;

--
-- Name: LiveSession; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."LiveSession" (
    id text NOT NULL,
    "creatorId" text NOT NULL,
    title text NOT NULL,
    "streamKey" text NOT NULL,
    "rtmpUrl" text,
    "hlsUrl" text,
    status public."LiveStatus" DEFAULT 'SCHEDULED'::public."LiveStatus" NOT NULL,
    "viewerCount" integer DEFAULT 0 NOT NULL,
    "startedAt" timestamp(3) without time zone,
    "endedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LiveSession" OWNER TO aqsa;

--
-- Name: MarketplaceListing; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."MarketplaceListing" (
    id text NOT NULL,
    "sellerId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category public."ListingCategory" NOT NULL,
    type public."ListingType" DEFAULT 'FIXED_PRICE'::public."ListingType" NOT NULL,
    price double precision,
    "startingBid" double precision,
    "reservePrice" double precision,
    "endsAt" timestamp(3) without time zone,
    status public."ListingStatus" DEFAULT 'ACTIVE'::public."ListingStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MarketplaceListing" OWNER TO aqsa;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "senderId" text NOT NULL,
    text text,
    "mediaUrl" text,
    "mediaType" public."MessageType" DEFAULT 'TEXT'::public."MessageType" NOT NULL,
    "tipAmount" double precision,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO aqsa;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    "actorId" text,
    "entityId" text,
    "entityType" text,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO aqsa;

--
-- Name: NotificationPreference; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."NotificationPreference" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    "inApp" boolean DEFAULT true NOT NULL,
    email boolean DEFAULT true NOT NULL
);


ALTER TABLE public."NotificationPreference" OWNER TO aqsa;

--
-- Name: OtpCode; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."OtpCode" (
    id text NOT NULL,
    "userId" text NOT NULL,
    code text NOT NULL,
    type public."OtpType" NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."OtpCode" OWNER TO aqsa;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount double precision NOT NULL,
    gateway public."PaymentGateway" NOT NULL,
    "gatewayTransactionId" text,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    type text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO aqsa;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Post" (
    id text NOT NULL,
    "authorId" text NOT NULL,
    text text,
    visibility public."PostVisibility" DEFAULT 'PUBLIC'::public."PostVisibility" NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "ppvPrice" double precision,
    "likeCount" integer DEFAULT 0 NOT NULL,
    "commentCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Post" OWNER TO aqsa;

--
-- Name: PostMedia; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."PostMedia" (
    id text NOT NULL,
    "postId" text NOT NULL,
    url text NOT NULL,
    type public."MediaType" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    thumbnail text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PostMedia" OWNER TO aqsa;

--
-- Name: PpvPurchase; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."PpvPurchase" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "postId" text NOT NULL,
    amount double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PpvPurchase" OWNER TO aqsa;

--
-- Name: Referral; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Referral" (
    id text NOT NULL,
    "referrerId" text NOT NULL,
    "referredId" text NOT NULL,
    earnings double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Referral" OWNER TO aqsa;

--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."RefreshToken" (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "deviceInfo" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RefreshToken" OWNER TO aqsa;

--
-- Name: Report; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Report" (
    id text NOT NULL,
    "reporterId" text NOT NULL,
    "reportedUserId" text,
    "reportedPostId" text,
    reason public."ReportReason" NOT NULL,
    description text,
    status public."ReportStatus" DEFAULT 'OPEN'::public."ReportStatus" NOT NULL,
    "resolvedBy" text,
    "resolvedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Report" OWNER TO aqsa;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "deviceInfo" text,
    "ipAddress" text,
    "lastActive" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Session" OWNER TO aqsa;

--
-- Name: Story; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Story" (
    id text NOT NULL,
    "authorId" text NOT NULL,
    "mediaUrl" text NOT NULL,
    "mediaType" public."MediaType" NOT NULL,
    overlays jsonb,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Story" OWNER TO aqsa;

--
-- Name: StoryView; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."StoryView" (
    id text NOT NULL,
    "storyId" text NOT NULL,
    "viewerId" text NOT NULL,
    "viewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."StoryView" OWNER TO aqsa;

--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Subscription" (
    id text NOT NULL,
    "subscriberId" text NOT NULL,
    "tierId" text NOT NULL,
    "creatorId" text NOT NULL,
    status public."SubscriptionStatus" DEFAULT 'ACTIVE'::public."SubscriptionStatus" NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone,
    "renewalDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Subscription" OWNER TO aqsa;

--
-- Name: SubscriptionTier; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."SubscriptionTier" (
    id text NOT NULL,
    "creatorId" text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    description text,
    benefits jsonb DEFAULT '[]'::jsonb NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SubscriptionTier" OWNER TO aqsa;

--
-- Name: SupportTicket; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."SupportTicket" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "photoUrl" text,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SupportTicket" OWNER TO aqsa;

--
-- Name: Tip; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Tip" (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "receiverId" text NOT NULL,
    amount double precision NOT NULL,
    "postId" text,
    "messageId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Tip" OWNER TO aqsa;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "walletId" text NOT NULL,
    type public."TransactionType" NOT NULL,
    amount double precision NOT NULL,
    description text,
    "referenceId" text,
    status public."TransactionStatus" DEFAULT 'PENDING'::public."TransactionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO aqsa;

--
-- Name: User; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    "displayName" text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."UserRole" DEFAULT 'FAN'::public."UserRole" NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    avatar text,
    cover text,
    bio text,
    location text,
    website text,
    "firstName" text,
    "lastName" text,
    "mobileNumber" text,
    "secondaryEmail" text,
    gender text,
    country text,
    category text,
    "dateOfBirth" timestamp(3) without time zone,
    age integer,
    region text,
    "profileType" text,
    "aboutMe" text,
    timezone text,
    "socialLinks" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "blockedCountries" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "referralCode" text,
    "bankCountry" text,
    "bankDetails" jsonb,
    "idDocumentUrl" text,
    "selfieUrl" text,
    "introVideoUrl" text,
    "isVerified" boolean DEFAULT false NOT NULL,
    "statusText" text,
    "twoFactorSecret" text,
    "twoFactorEnabled" boolean DEFAULT false NOT NULL,
    "onboardingStep" integer DEFAULT 0 NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerifyToken" text,
    "notifSettings" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "passwordResetExpiry" timestamp(3) without time zone,
    "passwordResetToken" text,
    "privacySettings" jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE public."User" OWNER TO aqsa;

--
-- Name: UserBadge; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."UserBadge" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "badgeId" text NOT NULL,
    "earnedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserBadge" OWNER TO aqsa;

--
-- Name: VideoCall; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."VideoCall" (
    id text NOT NULL,
    "callerId" text NOT NULL,
    "calleeId" text NOT NULL,
    "vonageSessionId" text,
    status public."CallStatus" DEFAULT 'RINGING'::public."CallStatus" NOT NULL,
    duration integer,
    "startedAt" timestamp(3) without time zone,
    "endedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."VideoCall" OWNER TO aqsa;

--
-- Name: Wallet; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Wallet" (
    id text NOT NULL,
    "userId" text NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    "pendingBalance" double precision DEFAULT 0 NOT NULL,
    "totalEarned" double precision DEFAULT 0 NOT NULL,
    "totalSpent" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Wallet" OWNER TO aqsa;

--
-- Name: Withdrawal; Type: TABLE; Schema: public; Owner: aqsa
--

CREATE TABLE public."Withdrawal" (
    id text NOT NULL,
    "creatorId" text NOT NULL,
    amount double precision NOT NULL,
    "paymentMethod" text NOT NULL,
    status public."WithdrawalStatus" DEFAULT 'PENDING'::public."WithdrawalStatus" NOT NULL,
    "processedAt" timestamp(3) without time zone,
    "rejectionReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Withdrawal" OWNER TO aqsa;

--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."AuditLog" (id, "adminId", action, "targetType", "targetId", details, "ipAddress", "createdAt") FROM stdin;
\.


--
-- Data for Name: Badge; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Badge" (id, name, description, icon, rarity, criteria, category, "createdAt") FROM stdin;
cmm63fxxs0003rp4tpd5rllmw	Early Adopter	Joined during beta	rocket	RARE	\N	SPECIAL	2026-02-28 09:03:21.232
cmm63fxxu0004rp4t3r4vuxkj	First Post	Published first post	pencil	COMMON	\N	CONTENT	2026-02-28 09:03:21.235
cmm63fxxw0005rp4tftfvhfp0	Popular Creator	Reached 1000 followers	star	EPIC	\N	SOCIAL	2026-02-28 09:03:21.236
cmm63fxxx0006rp4tesz5rllf	Super Tipper	Sent over $500 in tips	gem	LEGENDARY	\N	REVENUE	2026-02-28 09:03:21.237
cmm63fxxy0007rp4tkc6atgtr	Engaged Fan	Liked 100 posts	heart	COMMON	\N	ENGAGEMENT	2026-02-28 09:03:21.238
\.


--
-- Data for Name: Bid; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Bid" (id, "listingId", "bidderId", amount, "createdAt") FROM stdin;
\.


--
-- Data for Name: Block; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Block" (id, "blockerId", "blockedId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Booking" (id, "creatorId", "fanId", date, "timeSlot", status, notes, "createdAt", "updatedAt") FROM stdin;
cmm6h4pxd00iprpktu5rtax12	cmm63fyi600blrp4tbrmdxkiz	cmm63fy5n0083rp4tigxuimhy	2026-03-07 15:26:32.257	10:00 AM - 11:00 AM	ACCEPTED	Photo review session	2026-02-28 15:26:32.257	2026-02-28 15:26:32.257
cmm6h4pxe00irrpktme7o9c92	cmm63fyi600blrp4tbrmdxkiz	cmm63fy5n0083rp4tigxuimhy	2026-03-14 15:26:32.257	2:00 PM - 3:00 PM	ACCEPTED	Custom content discussion	2026-02-28 15:26:32.258	2026-02-28 15:26:32.258
cmm6h4pxe00itrpkttphibckg	cmm63fyi600blrp4tbrmdxkiz	cmm63fy5n0083rp4tigxuimhy	2026-03-03 15:26:32.257	11:00 AM - 12:00 PM	PENDING	Video call request	2026-02-28 15:26:32.258	2026-02-28 15:26:32.258
cmm6h4pxe00ivrpktaamix7o9	cmm63fyi600blrp4tbrmdxkiz	cmm63fy5n0083rp4tigxuimhy	2026-02-23 15:26:32.257	3:00 PM - 4:00 PM	COMPLETED	Completed fan meetup	2026-02-28 15:26:32.259	2026-02-28 15:26:32.259
cmm6h4pxf00ixrpktk2s9yp9t	cmm63fyi600blrp4tbrmdxkiz	cmm63fy5n0083rp4tigxuimhy	2026-03-02 15:26:32.257	4:00 PM - 5:00 PM	REJECTED	Schedule conflict	2026-02-28 15:26:32.259	2026-02-28 15:26:32.259
\.


--
-- Data for Name: Bookmark; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Bookmark" (id, "postId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Comment" (id, "postId", "authorId", "parentId", text, "likeCount", "createdAt", "updatedAt") FROM stdin;
cmm6h4pe500aarpkta4j25v3t	cmm6h4pdz0094rpktdf4h8wxr	cmm63fxzi004erp4t158tuuka	\N	Absolutely stunning! 🔥	0	2026-02-28 14:06:31.564	2026-02-28 15:26:31.565
cmm6h4pe500acrpkt1toev6va	cmm6h4pdz0094rpktdf4h8wxr	cmm63fxzj004hrp4ts8x1hphz	\N	You look amazing as always!	0	2026-02-28 14:16:31.565	2026-02-28 15:26:31.566
cmm6h4pe500aerpktpe1em5mh	cmm6h4pdz0094rpktdf4h8wxr	cmm63fxza003prp4tjpc5uyiy	\N	Best content on Fansbook 💯	0	2026-02-28 14:26:31.565	2026-02-28 15:26:31.566
cmm6h4pe600agrpktyaft8g3t	cmm6h4pdz0094rpktdf4h8wxr	cmm63fxzb003srp4td3k99ui9	\N	Can't wait for more!	0	2026-02-28 14:36:31.566	2026-02-28 15:26:31.566
cmm6h4pe600airpkti5wd60gb	cmm6h4pdz0094rpktdf4h8wxr	cmm63fxzc003vrp4tcn85cvxu	\N	This is incredible work	0	2026-02-28 14:46:31.566	2026-02-28 15:26:31.566
cmm6h4pe600akrpkt6kgxgcze	cmm6h4pdz0094rpktdf4h8wxr	cmm63fxzi004erp4t158tuuka	\N	Love this photo set so much 😍	0	2026-02-28 14:56:31.566	2026-02-28 15:26:31.567
cmm6h4pe600amrpktbh5s12q2	cmm6h4pdz0094rpktdf4h8wxr	cmm63fxzj004hrp4ts8x1hphz	\N	You never disappoint!	0	2026-02-28 15:06:31.566	2026-02-28 15:26:31.567
cmm6h4pe700aorpktf0jz41y7	cmm6h4pdz0094rpktdf4h8wxr	cmm63fxza003prp4tjpc5uyiy	\N	Goals!! 🙌	0	2026-02-28 15:16:31.567	2026-02-28 15:26:31.567
cmm6h4pe700aqrpktqtege30f	cmm6h4pe2009qrpktl2w0ke7o	cmm63fxzi004erp4t158tuuka	\N	Can't wait for more!	0	2026-02-28 14:06:31.567	2026-02-28 15:26:31.568
cmm6h4pe700asrpktglexaak7	cmm6h4pe2009qrpktl2w0ke7o	cmm63fxzj004hrp4ts8x1hphz	\N	This is incredible work	0	2026-02-28 14:16:31.567	2026-02-28 15:26:31.568
cmm6h4pe800aurpktak7j7yqw	cmm6h4pe2009qrpktl2w0ke7o	cmm63fxza003prp4tjpc5uyiy	\N	Love this photo set so much 😍	0	2026-02-28 14:26:31.568	2026-02-28 15:26:31.568
cmm6h4pe800awrpktmy6kz6ou	cmm6h4pe2009qrpktl2w0ke7o	cmm63fxzb003srp4td3k99ui9	\N	You never disappoint!	0	2026-02-28 14:36:31.568	2026-02-28 15:26:31.568
cmm6h4pe800ayrpktea4iinw8	cmm6h4pe2009qrpktl2w0ke7o	cmm63fxzc003vrp4tcn85cvxu	\N	Goals!! 🙌	0	2026-02-28 14:46:31.568	2026-02-28 15:26:31.569
cmm6h4pe800b0rpktij011vll	cmm6h4pe2009qrpktl2w0ke7o	cmm63fxzi004erp4t158tuuka	\N	Absolutely stunning! 🔥	0	2026-02-28 14:56:31.568	2026-02-28 15:26:31.569
cmm6h4pe900b2rpkt02jjyrtb	cmm6h4pe2009qrpktl2w0ke7o	cmm63fxzj004hrp4ts8x1hphz	\N	You look amazing as always!	0	2026-02-28 15:06:31.569	2026-02-28 15:26:31.569
cmm6h4pe900b4rpkt1rum5fxs	cmm6h4pe2009qrpktl2w0ke7o	cmm63fxza003prp4tjpc5uyiy	\N	Best content on Fansbook 💯	0	2026-02-28 15:16:31.569	2026-02-28 15:26:31.569
cmm6h4pe900b6rpktbxydq9dm	cmm6h4pe300a2rpktj53njoly	cmm63fxzi004erp4t158tuuka	\N	You never disappoint!	0	2026-02-28 14:06:31.569	2026-02-28 15:26:31.57
cmm6h4pea00b8rpkto09epkbk	cmm6h4pe300a2rpktj53njoly	cmm63fxzj004hrp4ts8x1hphz	\N	Goals!! 🙌	0	2026-02-28 14:16:31.569	2026-02-28 15:26:31.57
cmm6h4pea00barpktm7o7jfv4	cmm6h4pe300a2rpktj53njoly	cmm63fxza003prp4tjpc5uyiy	\N	Absolutely stunning! 🔥	0	2026-02-28 14:26:31.57	2026-02-28 15:26:31.57
cmm6h4pea00bcrpktrwyvz6fc	cmm6h4pe300a2rpktj53njoly	cmm63fxzb003srp4td3k99ui9	\N	You look amazing as always!	0	2026-02-28 14:36:31.57	2026-02-28 15:26:31.57
cmm6h4pea00berpktla6apwex	cmm6h4pe300a2rpktj53njoly	cmm63fxzc003vrp4tcn85cvxu	\N	Best content on Fansbook 💯	0	2026-02-28 14:46:31.57	2026-02-28 15:26:31.571
cmm6h4peb00bgrpktc9crw2ji	cmm6h4pe300a2rpktj53njoly	cmm63fxzi004erp4t158tuuka	\N	Can't wait for more!	0	2026-02-28 14:56:31.57	2026-02-28 15:26:31.571
cmm6h4peb00birpktlv9qut9v	cmm6h4pe300a2rpktj53njoly	cmm63fxzj004hrp4ts8x1hphz	\N	This is incredible work	0	2026-02-28 15:06:31.571	2026-02-28 15:26:31.571
cmm6h4peb00bkrpkttk9nso12	cmm6h4pe300a2rpktj53njoly	cmm63fxza003prp4tjpc5uyiy	\N	Love this photo set so much 😍	0	2026-02-28 15:16:31.571	2026-02-28 15:26:31.571
cmm6h4peb00bmrpkttcpbzv6s	cmm6h4pe400a6rpktqnwa9rh2	cmm63fxzi004erp4t158tuuka	\N	You look amazing as always!	0	2026-02-28 14:06:31.571	2026-02-28 15:26:31.572
cmm6h4pec00borpktktn3lm0s	cmm6h4pe400a6rpktqnwa9rh2	cmm63fxzj004hrp4ts8x1hphz	\N	Best content on Fansbook 💯	0	2026-02-28 14:16:31.571	2026-02-28 15:26:31.572
cmm6h4pec00bqrpktwm5umtfr	cmm6h4pe400a6rpktqnwa9rh2	cmm63fxza003prp4tjpc5uyiy	\N	Can't wait for more!	0	2026-02-28 14:26:31.572	2026-02-28 15:26:31.572
cmm6h4pec00bsrpktwjay1an2	cmm6h4pe400a6rpktqnwa9rh2	cmm63fxzb003srp4td3k99ui9	\N	This is incredible work	0	2026-02-28 14:36:31.572	2026-02-28 15:26:31.572
cmm6h4pec00burpkt1ng412ux	cmm6h4pe400a6rpktqnwa9rh2	cmm63fxzc003vrp4tcn85cvxu	\N	Love this photo set so much 😍	0	2026-02-28 14:46:31.572	2026-02-28 15:26:31.573
cmm6h4pec00bwrpkthde4v1mf	cmm6h4pe400a6rpktqnwa9rh2	cmm63fxzi004erp4t158tuuka	\N	You never disappoint!	0	2026-02-28 14:56:31.572	2026-02-28 15:26:31.573
cmm6h4ped00byrpkt8rpheojx	cmm6h4pe400a6rpktqnwa9rh2	cmm63fxzj004hrp4ts8x1hphz	\N	Goals!! 🙌	0	2026-02-28 15:06:31.572	2026-02-28 15:26:31.573
cmm6h4ped00c0rpkt3t2wciye	cmm6h4pe400a6rpktqnwa9rh2	cmm63fxza003prp4tjpc5uyiy	\N	Absolutely stunning! 🔥	0	2026-02-28 15:16:31.573	2026-02-28 15:26:31.573
cmm6h4pwr00fjrpktzbbwtfs9	cmm6h4pwq00ffrpktwciru1sd	cmm63fxxz0008rp4tqn1g2m71	\N	Absolutely stunning! 🔥	0	2026-02-28 10:31:32.231	2026-02-28 15:26:32.235
cmm6h4pwr00flrpktfw5ekl4r	cmm6h4pwq00ffrpktwciru1sd	cmm63fxy4000drp4tmz6ic0ed	\N	You look amazing as always!	0	2026-02-28 10:36:32.231	2026-02-28 15:26:32.236
cmm6h4pws00fnrpkthpek7hfl	cmm6h4pwq00ffrpktwciru1sd	cmm63fxy7000irp4tgmz2ke1e	\N	Best content on Fansbook 💯	0	2026-02-28 10:41:32.231	2026-02-28 15:26:32.236
cmm6h4pws00fprpkt23eskyaj	cmm6h4pwq00ffrpktwciru1sd	cmm63fxy9000nrp4tgpr7j6ob	\N	Can't wait for more!	0	2026-02-28 10:46:32.231	2026-02-28 15:26:32.237
cmm6h4pwt00frrpkt37dcc2tv	cmm6h4pwq00ffrpktwciru1sd	cmm63fxyb000srp4tufgce1ck	\N	This is incredible work	0	2026-02-28 10:51:32.231	2026-02-28 15:26:32.237
cmm6h4pwt00ftrpkth2mqro5w	cmm6h4pwq00ffrpktwciru1sd	cmm63fxxz0008rp4tqn1g2m71	\N	Love this so much 😍	0	2026-02-28 10:56:32.231	2026-02-28 15:26:32.237
cmm6h4pwt00fvrpktu9l2z9ks	cmm6h4pwq00ffrpktwciru1sd	cmm63fxy4000drp4tmz6ic0ed	\N	You never disappoint!	0	2026-02-28 11:01:32.231	2026-02-28 15:26:32.238
cmm6h4pwv00g1rpktom1d8nez	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxxz0008rp4tqn1g2m71	\N	Absolutely stunning! 🔥	0	2026-02-28 05:31:32.231	2026-02-28 15:26:32.239
cmm6h4pwv00g3rpktlr6dr4fm	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxy4000drp4tmz6ic0ed	\N	You look amazing as always!	0	2026-02-28 05:36:32.231	2026-02-28 15:26:32.24
cmm6h4pww00g5rpktnrw36izs	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxy7000irp4tgmz2ke1e	\N	Best content on Fansbook 💯	0	2026-02-28 05:41:32.231	2026-02-28 15:26:32.24
cmm6h4pww00g7rpktxakgtykl	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxy9000nrp4tgpr7j6ob	\N	Can't wait for more!	0	2026-02-28 05:46:32.231	2026-02-28 15:26:32.241
cmm6h4pww00g9rpktzw6ntfsa	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxyb000srp4tufgce1ck	\N	This is incredible work	0	2026-02-28 05:51:32.231	2026-02-28 15:26:32.241
cmm6h4pwx00gbrpkt3ipm4ke5	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxxz0008rp4tqn1g2m71	\N	Love this so much 😍	0	2026-02-28 05:56:32.231	2026-02-28 15:26:32.241
cmm6h4pwx00gdrpkt8db5xfdz	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxy4000drp4tmz6ic0ed	\N	You never disappoint!	0	2026-02-28 06:01:32.231	2026-02-28 15:26:32.242
cmm6h4pwy00gfrpktqtmy7s1t	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxy7000irp4tgmz2ke1e	\N	Goals!! 🙌	0	2026-02-28 06:06:32.231	2026-02-28 15:26:32.242
cmm6h4pwy00ghrpkt4cnpynae	cmm6h4pwt00fxrpktwvt2lxy1	cmm63fxy9000nrp4tgpr7j6ob	\N	Keep it up queen! 👑	0	2026-02-28 06:11:32.231	2026-02-28 15:26:32.242
cmm6h4pwz00glrpktg3uj6tka	cmm6h4pwy00gjrpkts62oi966	cmm63fxxz0008rp4tqn1g2m71	\N	Absolutely stunning! 🔥	0	2026-02-27 19:31:32.231	2026-02-28 15:26:32.243
cmm6h4pwz00gnrpkthurb8vav	cmm6h4pwy00gjrpkts62oi966	cmm63fxy4000drp4tmz6ic0ed	\N	You look amazing as always!	0	2026-02-27 19:36:32.231	2026-02-28 15:26:32.244
cmm6h4pwz00gprpkt5zc5ubj7	cmm6h4pwy00gjrpkts62oi966	cmm63fxy7000irp4tgmz2ke1e	\N	Best content on Fansbook 💯	0	2026-02-27 19:41:32.231	2026-02-28 15:26:32.244
cmm6h4px000grrpktpz4o55rw	cmm6h4pwy00gjrpkts62oi966	cmm63fxy9000nrp4tgpr7j6ob	\N	Can't wait for more!	0	2026-02-27 19:46:32.231	2026-02-28 15:26:32.244
cmm6h4px000gtrpktvbwajhqy	cmm6h4pwy00gjrpkts62oi966	cmm63fxyb000srp4tufgce1ck	\N	This is incredible work	0	2026-02-27 19:51:32.231	2026-02-28 15:26:32.245
cmm6h4px000gvrpkty5tgawo2	cmm6h4pwy00gjrpkts62oi966	cmm63fxxz0008rp4tqn1g2m71	\N	Love this so much 😍	0	2026-02-27 19:56:32.231	2026-02-28 15:26:32.245
cmm6h4px100h1rpktbm7f127a	cmm6h4px100gxrpktsdt3zpik	cmm63fxxz0008rp4tqn1g2m71	\N	Absolutely stunning! 🔥	0	2026-02-27 09:31:32.231	2026-02-28 15:26:32.246
cmm6h4px200h3rpktictjqpmp	cmm6h4px100gxrpktsdt3zpik	cmm63fxy4000drp4tmz6ic0ed	\N	You look amazing as always!	0	2026-02-27 09:36:32.231	2026-02-28 15:26:32.246
cmm6h4px200h5rpktydfqsxoy	cmm6h4px100gxrpktsdt3zpik	cmm63fxy7000irp4tgmz2ke1e	\N	Best content on Fansbook 💯	0	2026-02-27 09:41:32.231	2026-02-28 15:26:32.247
cmm6h4px200h7rpkt69qr0822	cmm6h4px100gxrpktsdt3zpik	cmm63fxy9000nrp4tgpr7j6ob	\N	Can't wait for more!	0	2026-02-27 09:46:32.231	2026-02-28 15:26:32.247
cmm6h4px300h9rpktw7ph3tgn	cmm6h4px100gxrpktsdt3zpik	cmm63fxyb000srp4tufgce1ck	\N	This is incredible work	0	2026-02-27 09:51:32.231	2026-02-28 15:26:32.247
cmm6h4px300hbrpktiwhyi4qp	cmm6h4px100gxrpktsdt3zpik	cmm63fxxz0008rp4tqn1g2m71	\N	Love this so much 😍	0	2026-02-27 09:56:32.231	2026-02-28 15:26:32.247
cmm6h4px300hdrpktsrbgqx2n	cmm6h4px100gxrpktsdt3zpik	cmm63fxy4000drp4tmz6ic0ed	\N	You never disappoint!	0	2026-02-27 10:01:32.231	2026-02-28 15:26:32.248
cmm6h4px300hfrpktyv4uqwiy	cmm6h4px100gxrpktsdt3zpik	cmm63fxy7000irp4tgmz2ke1e	\N	Goals!! 🙌	0	2026-02-27 10:06:32.231	2026-02-28 15:26:32.248
cmm6h4px400hlrpkt8275vj6i	cmm6h4px400hhrpkt7rjx9skd	cmm63fxxz0008rp4tqn1g2m71	\N	Absolutely stunning! 🔥	0	2026-02-26 15:31:32.231	2026-02-28 15:26:32.249
cmm6h4px500hnrpktco2in8kp	cmm6h4px400hhrpkt7rjx9skd	cmm63fxy4000drp4tmz6ic0ed	\N	You look amazing as always!	0	2026-02-26 15:36:32.231	2026-02-28 15:26:32.249
cmm6h4px500hprpkto77h0atr	cmm6h4px400hhrpkt7rjx9skd	cmm63fxy7000irp4tgmz2ke1e	\N	Best content on Fansbook 💯	0	2026-02-26 15:41:32.231	2026-02-28 15:26:32.249
cmm6h4px500hrrpktzjkd7gl5	cmm6h4px400hhrpkt7rjx9skd	cmm63fxy9000nrp4tgpr7j6ob	\N	Can't wait for more!	0	2026-02-26 15:46:32.231	2026-02-28 15:26:32.25
cmm6h4px500htrpktqpqwk5xh	cmm6h4px400hhrpkt7rjx9skd	cmm63fxyb000srp4tufgce1ck	\N	This is incredible work	0	2026-02-26 15:51:32.231	2026-02-28 15:26:32.25
cmm6h4px600hvrpktn9l1kwkf	cmm6h4px400hhrpkt7rjx9skd	cmm63fxxz0008rp4tqn1g2m71	\N	Love this so much 😍	0	2026-02-26 15:56:32.231	2026-02-28 15:26:32.25
cmm6h4px600hxrpktqgpi2rea	cmm6h4px400hhrpkt7rjx9skd	cmm63fxy4000drp4tmz6ic0ed	\N	You never disappoint!	0	2026-02-26 16:01:32.231	2026-02-28 15:26:32.251
\.


--
-- Data for Name: CommentLike; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."CommentLike" (id, "commentId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Conversation; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Conversation" (id, "participant1Id", "participant2Id", "lastMessageAt", "lastMessage", "createdAt") FROM stdin;
cmm6h4pk700cerpkthxyvvdyd	cmm63fy5n0083rp4tigxuimhy	cmm63fy5r0086rp4tcz6umk4m	2026-02-28 15:26:31.783	Maybe a behind-the-scenes look at my creative process?	2026-02-28 15:26:31.784
cmm6h4pkc00cqrpkthujmewt5	cmm63fy5n0083rp4tigxuimhy	cmm63fy5u0089rp4t68jeguo8	2026-02-28 15:26:31.788	Can't wait to see it! Let me know if you need anything 💕	2026-02-28 15:26:31.788
cmm6h4pke00d0rpkt6nnhlei5	cmm63fy5n0083rp4tigxuimhy	cmm63fy5y008crp4tnz3updpb	2026-02-28 15:26:31.79	Sounds good, talk soon! 👊	2026-02-28 15:26:31.791
\.


--
-- Data for Name: Faq; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Faq" (id, question, answer, "order", "createdAt") FROM stdin;
cmm6h4pqx00f3rpktni16gc8b	How do I go live on FansBook?	To go live, navigate to your profile and click the "Go Live" button. You'll need to grant camera and microphone permissions. Make sure you have a stable internet connection for the best streaming experience.	1	2026-02-28 15:26:32.026
cmm6h4pqy00f4rpktrplnyyv5	How can I withdraw my earnings?	Go to your Wallet page and click "Withdraw". You can withdraw to your bank account or PayPal. Minimum withdrawal amount is $20. Processing takes 3-5 business days.	2	2026-02-28 15:26:32.027
cmm6h4pqy00f5rpktp05ckigs	How do I reset my password?	Go to Settings > Password section. Enter your current password and your new password. Click "Change Password" to save. If you forgot your password, use the "Forgot Password" link on the login page.	3	2026-02-28 15:26:32.027
cmm6h4pqz00f6rpktu32l4mto	What kind of content is not allowed?	Content involving minors, non-consensual activities, violence, illegal substances, or any content that violates our Terms of Service is strictly prohibited. Violations may result in account suspension or ban.	4	2026-02-28 15:26:32.027
cmm6h4pqz00f7rpkt2hm68kiq	How do I become a verified creator?	To get verified, go to Settings > Verification. Submit a valid government-issued ID and a selfie holding the ID. Verification usually takes 24-48 hours.	5	2026-02-28 15:26:32.027
cmm6h4pr000f8rpkt21hpwjq8	How do subscriptions work?	Creators set their own subscription prices. Once you subscribe, you get access to all their subscriber-only content. Subscriptions auto-renew monthly unless cancelled.	6	2026-02-28 15:26:32.029
cmm6h4pr100f9rpktlszq1to0	Can I block or report a user?	Yes, visit the user's profile and click the three dots menu. You can block them to prevent all interaction, or report them if they're violating our community guidelines.	7	2026-02-28 15:26:32.029
cmm6h4pr100farpkt0exrahlz	How do I delete my account?	Go to Settings > Account Security and click "Delete my account". This action is permanent and cannot be undone. All your content, messages, and data will be permanently removed.	8	2026-02-28 15:26:32.029
\.


--
-- Data for Name: Follow; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Follow" (id, "followerId", "followingId", "createdAt") FROM stdin;
cmm63fxym001nrp4t8bsnokn1	cmm63fxxz0008rp4tqn1g2m71	cmm63fxy4000drp4tmz6ic0ed	2026-02-28 09:03:21.262
cmm63fxyn001prp4twoz060k9	cmm63fxxz0008rp4tqn1g2m71	cmm63fxy7000irp4tgmz2ke1e	2026-02-28 09:03:21.264
cmm63fxyo001rrp4t1ry35bxo	cmm63fxxz0008rp4tqn1g2m71	cmm63fxy9000nrp4tgpr7j6ob	2026-02-28 09:03:21.264
cmm63fxyp001trp4tan2zsec0	cmm63fxy4000drp4tmz6ic0ed	cmm63fxy7000irp4tgmz2ke1e	2026-02-28 09:03:21.265
cmm63fxyp001vrp4ttkm6jlde	cmm63fxy4000drp4tmz6ic0ed	cmm63fxy9000nrp4tgpr7j6ob	2026-02-28 09:03:21.266
cmm63fxyq001xrp4the4nn96v	cmm63fxy4000drp4tmz6ic0ed	cmm63fxyb000srp4tufgce1ck	2026-02-28 09:03:21.266
cmm63fxyq001zrp4tzcp9fevp	cmm63fxy7000irp4tgmz2ke1e	cmm63fxy9000nrp4tgpr7j6ob	2026-02-28 09:03:21.267
cmm63fxyr0021rp4tbiss4f65	cmm63fxy7000irp4tgmz2ke1e	cmm63fxyb000srp4tufgce1ck	2026-02-28 09:03:21.267
cmm63fxys0023rp4t1h6lieah	cmm63fxy7000irp4tgmz2ke1e	cmm63fxyd000xrp4twpluerek	2026-02-28 09:03:21.268
cmm63fxys0025rp4tvc6lk30f	cmm63fxy9000nrp4tgpr7j6ob	cmm63fxyb000srp4tufgce1ck	2026-02-28 09:03:21.269
cmm63fxyt0027rp4t5sba99vt	cmm63fxy9000nrp4tgpr7j6ob	cmm63fxyd000xrp4twpluerek	2026-02-28 09:03:21.269
cmm63fxyt0029rp4thisrgd96	cmm63fxy9000nrp4tgpr7j6ob	cmm63fxyf0012rp4tazcntitx	2026-02-28 09:03:21.27
cmm63fxyu002brp4t1ncv1uzn	cmm63fxyb000srp4tufgce1ck	cmm63fxyd000xrp4twpluerek	2026-02-28 09:03:21.27
cmm63fxyu002drp4t70awmo1o	cmm63fxyb000srp4tufgce1ck	cmm63fxyf0012rp4tazcntitx	2026-02-28 09:03:21.271
cmm63fxyv002frp4tqrzpnuyr	cmm63fxyb000srp4tufgce1ck	cmm63fxyg0017rp4tsc8sjank	2026-02-28 09:03:21.271
cmm63fxyv002hrp4ty3vlvj42	cmm63fxyd000xrp4twpluerek	cmm63fxyf0012rp4tazcntitx	2026-02-28 09:03:21.272
cmm63fxyw002jrp4thzahktd2	cmm63fxyd000xrp4twpluerek	cmm63fxyg0017rp4tsc8sjank	2026-02-28 09:03:21.273
cmm63fxyx002lrp4tnqq4af1r	cmm63fxyd000xrp4twpluerek	cmm63fxyi001crp4tomcevcuq	2026-02-28 09:03:21.273
cmm63fxyx002nrp4twac2qb6w	cmm63fxyf0012rp4tazcntitx	cmm63fxyg0017rp4tsc8sjank	2026-02-28 09:03:21.274
cmm63fxyy002prp4tbn1mm7cw	cmm63fxyf0012rp4tazcntitx	cmm63fxyi001crp4tomcevcuq	2026-02-28 09:03:21.274
cmm63fxyy002rrp4tb5mqbzwr	cmm63fxyf0012rp4tazcntitx	cmm63fxyk001hrp4tu5axt1o9	2026-02-28 09:03:21.275
cmm63fxyz002trp4tde6npuq6	cmm63fxyg0017rp4tsc8sjank	cmm63fxyi001crp4tomcevcuq	2026-02-28 09:03:21.275
cmm63fxyz002vrp4tj1cshfvj	cmm63fxyg0017rp4tsc8sjank	cmm63fxyk001hrp4tu5axt1o9	2026-02-28 09:03:21.276
cmm63fxz0002xrp4tinqj80sj	cmm63fxyi001crp4tomcevcuq	cmm63fxyk001hrp4tu5axt1o9	2026-02-28 09:03:21.276
cmm63w57j0027rpkfuwl76222	cmm63fxyg0017rp4tsc8sjank	cmm63fxz4003arp4ti8wolkwg	2026-02-28 09:15:57.152
cmm63w57l002brpkftwlwl1ak	cmm63fxyi001crp4tomcevcuq	cmm63fxz4003arp4ti8wolkwg	2026-02-28 09:15:57.153
cmm63w57m002drpkfqhui5l4r	cmm63fxyi001crp4tomcevcuq	cmm63fxz6003drp4t141xl6pe	2026-02-28 09:15:57.154
cmm63w57m002frpkfj9l8maro	cmm63fxyk001hrp4tu5axt1o9	cmm63fxz4003arp4ti8wolkwg	2026-02-28 09:15:57.155
cmm63w57n002hrpkfkaefg0jz	cmm63fxyk001hrp4tu5axt1o9	cmm63fxz6003drp4t141xl6pe	2026-02-28 09:15:57.155
cmm63w57n002jrpkflf46kr4i	cmm63fxyk001hrp4tu5axt1o9	cmm63fxz7003grp4trm4zibt9	2026-02-28 09:15:57.156
cmm63w57o002lrpkfsmmcwz4e	cmm63fxz4003arp4ti8wolkwg	cmm63fxz6003drp4t141xl6pe	2026-02-28 09:15:57.157
cmm63w57p002nrpkffdyj1rq0	cmm63fxz4003arp4ti8wolkwg	cmm63fxz7003grp4trm4zibt9	2026-02-28 09:15:57.157
cmm63w57p002prpkf8kugzy99	cmm63fxz4003arp4ti8wolkwg	cmm63fxza003prp4tjpc5uyiy	2026-02-28 09:15:57.158
cmm63w57q002rrpkf6l59hvhx	cmm63fxz6003drp4t141xl6pe	cmm63fxz7003grp4trm4zibt9	2026-02-28 09:15:57.158
cmm63w57q002trpkftu0saek9	cmm63fxz6003drp4t141xl6pe	cmm63fxza003prp4tjpc5uyiy	2026-02-28 09:15:57.159
cmm63w57r002vrpkfpshwvvrh	cmm63fxz6003drp4t141xl6pe	cmm63fxzb003srp4td3k99ui9	2026-02-28 09:15:57.16
cmm63w57s002xrpkf6cjzrs8c	cmm63fxz7003grp4trm4zibt9	cmm63fxza003prp4tjpc5uyiy	2026-02-28 09:15:57.16
cmm63w57s002zrpkfbllu2ew7	cmm63fxz7003grp4trm4zibt9	cmm63fxzb003srp4td3k99ui9	2026-02-28 09:15:57.161
cmm63w57t0031rpkftlpkvrir	cmm63fxz7003grp4trm4zibt9	cmm63fxzc003vrp4tcn85cvxu	2026-02-28 09:15:57.161
cmm63w57u0033rpkf7kljnzdd	cmm63fxza003prp4tjpc5uyiy	cmm63fxzb003srp4td3k99ui9	2026-02-28 09:15:57.162
cmm63w57u0035rpkf17x40pq6	cmm63fxza003prp4tjpc5uyiy	cmm63fxzc003vrp4tcn85cvxu	2026-02-28 09:15:57.163
cmm63w57v0037rpkfb44tobw2	cmm63fxza003prp4tjpc5uyiy	cmm63fxzd003yrp4tbyym15ea	2026-02-28 09:15:57.163
cmm63w57v0039rpkf8rl7f52w	cmm63fxzb003srp4td3k99ui9	cmm63fxzc003vrp4tcn85cvxu	2026-02-28 09:15:57.164
cmm63w57w003brpkfr6oh11ll	cmm63fxzb003srp4td3k99ui9	cmm63fxzd003yrp4tbyym15ea	2026-02-28 09:15:57.164
cmm63w57w003drpkf42h211vy	cmm63fxzb003srp4td3k99ui9	cmm63fxzf0041rp4tvr2thuej	2026-02-28 09:15:57.165
cmm63w57x003frpkftk32n99o	cmm63fxzc003vrp4tcn85cvxu	cmm63fxzd003yrp4tbyym15ea	2026-02-28 09:15:57.166
cmm63w57y003hrpkf8pyt1zzp	cmm63fxzc003vrp4tcn85cvxu	cmm63fxzf0041rp4tvr2thuej	2026-02-28 09:15:57.166
cmm63w57y003jrpkfnzf120xc	cmm63fxzc003vrp4tcn85cvxu	cmm63fxzi004erp4t158tuuka	2026-02-28 09:15:57.167
cmm63w57z003lrpkftjdqucik	cmm63fxzd003yrp4tbyym15ea	cmm63fxzf0041rp4tvr2thuej	2026-02-28 09:15:57.168
cmm63w580003nrpkfw0fgt35m	cmm63fxzd003yrp4tbyym15ea	cmm63fxzi004erp4t158tuuka	2026-02-28 09:15:57.168
cmm63w580003prpkfy5up8gxp	cmm63fxzd003yrp4tbyym15ea	cmm63fxzj004hrp4ts8x1hphz	2026-02-28 09:15:57.169
cmm63w581003rrpkfxokjoawv	cmm63fxzf0041rp4tvr2thuej	cmm63fxzi004erp4t158tuuka	2026-02-28 09:15:57.169
cmm63w581003trpkf1l97qbir	cmm63fxzf0041rp4tvr2thuej	cmm63fxzj004hrp4ts8x1hphz	2026-02-28 09:15:57.17
cmm63w582003vrpkf8duxdjel	cmm63fxzf0041rp4tvr2thuej	cmm63fxzk004krp4toewa8dbx	2026-02-28 09:15:57.17
cmm63w583003xrpkffvayoirt	cmm63fxzi004erp4t158tuuka	cmm63fxzj004hrp4ts8x1hphz	2026-02-28 09:15:57.171
cmm63w583003zrpkfg3eb1ovt	cmm63fxzi004erp4t158tuuka	cmm63fxzk004krp4toewa8dbx	2026-02-28 09:15:57.172
cmm63w5840041rpkfmwtp50jo	cmm63fxzi004erp4t158tuuka	cmm63fxzm004nrp4t5tsvj8qd	2026-02-28 09:15:57.172
cmm63w5840043rpkfnlb0zy0s	cmm63fxzj004hrp4ts8x1hphz	cmm63fxzk004krp4toewa8dbx	2026-02-28 09:15:57.173
cmm63w5850045rpkf7zl1axmz	cmm63fxzj004hrp4ts8x1hphz	cmm63fxzm004nrp4t5tsvj8qd	2026-02-28 09:15:57.173
cmm63w5850047rpkfytzn1ts3	cmm63fxzj004hrp4ts8x1hphz	cmm63fxzn004qrp4tac9r6192	2026-02-28 09:15:57.174
cmm63w5860049rpkfhax9rons	cmm63fxzk004krp4toewa8dbx	cmm63fxzm004nrp4t5tsvj8qd	2026-02-28 09:15:57.174
cmm63w586004brpkfo2krl2vv	cmm63fxzk004krp4toewa8dbx	cmm63fxzn004qrp4tac9r6192	2026-02-28 09:15:57.175
cmm63w587004drpkf3zbc5vib	cmm63fxzk004krp4toewa8dbx	cmm63fxzo004trp4t3rwxfunq	2026-02-28 09:15:57.175
cmm63w587004frpkflkxlkb5d	cmm63fxzm004nrp4t5tsvj8qd	cmm63fxzn004qrp4tac9r6192	2026-02-28 09:15:57.176
cmm63w589004hrpkfmarlc81k	cmm63fxzm004nrp4t5tsvj8qd	cmm63fxzo004trp4t3rwxfunq	2026-02-28 09:15:57.177
cmm63w589004jrpkfrvkwytef	cmm63fxzm004nrp4t5tsvj8qd	cmm63fxzp004wrp4t3iqtl0lm	2026-02-28 09:15:57.177
cmm63w589004lrpkfl6mclmyo	cmm63fxzn004qrp4tac9r6192	cmm63fxzo004trp4t3rwxfunq	2026-02-28 09:15:57.178
cmm63w58a004nrpkfvzl3feze	cmm63fxzn004qrp4tac9r6192	cmm63fxzp004wrp4t3iqtl0lm	2026-02-28 09:15:57.178
cmm63w58a004prpkfqr6hotrk	cmm63fxzn004qrp4tac9r6192	cmm63fxzr004zrp4tgb7nj925	2026-02-28 09:15:57.179
cmm63w58b004rrpkfaswqil07	cmm63fxzo004trp4t3rwxfunq	cmm63fxzp004wrp4t3iqtl0lm	2026-02-28 09:15:57.179
cmm63w58b004trpkf04a8m4c7	cmm63fxzo004trp4t3rwxfunq	cmm63fxzr004zrp4tgb7nj925	2026-02-28 09:15:57.179
cmm63w58b004vrpkfqxs8rjbb	cmm63fxzo004trp4t3rwxfunq	cmm63fxzs0052rp4tfqiij0p6	2026-02-28 09:15:57.18
cmm63w58c004xrpkfp39m6e0b	cmm63fxzp004wrp4t3iqtl0lm	cmm63fxzr004zrp4tgb7nj925	2026-02-28 09:15:57.18
cmm63w58c004zrpkfmi85y3ns	cmm63fxzp004wrp4t3iqtl0lm	cmm63fxzs0052rp4tfqiij0p6	2026-02-28 09:15:57.181
cmm63w58c0051rpkf650ac0km	cmm63fxzp004wrp4t3iqtl0lm	cmm63fy5r0086rp4tcz6umk4m	2026-02-28 09:15:57.181
cmm63w58d0053rpkfqzc6u2mk	cmm63fxzr004zrp4tgb7nj925	cmm63fxzs0052rp4tfqiij0p6	2026-02-28 09:15:57.181
cmm63w58d0055rpkf07urtmxk	cmm63fxzr004zrp4tgb7nj925	cmm63fy5r0086rp4tcz6umk4m	2026-02-28 09:15:57.182
cmm63w58d0057rpkf27o9a5o1	cmm63fxzr004zrp4tgb7nj925	cmm63fy5u0089rp4t68jeguo8	2026-02-28 09:15:57.182
cmm63w58e0059rpkfnhzju2xm	cmm63fxzs0052rp4tfqiij0p6	cmm63fy5r0086rp4tcz6umk4m	2026-02-28 09:15:57.182
cmm63w58e005brpkfldvyea8g	cmm63fxzs0052rp4tfqiij0p6	cmm63fy5u0089rp4t68jeguo8	2026-02-28 09:15:57.183
cmm63w58f005drpkf0notplvb	cmm63fxzs0052rp4tfqiij0p6	cmm63fy5y008crp4tnz3updpb	2026-02-28 09:15:57.183
cmm63w58f005frpkfhd9pov1q	cmm63fy5r0086rp4tcz6umk4m	cmm63fy5u0089rp4t68jeguo8	2026-02-28 09:15:57.184
cmm63w58g005hrpkfcf59qa0s	cmm63fy5r0086rp4tcz6umk4m	cmm63fy5y008crp4tnz3updpb	2026-02-28 09:15:57.184
cmm63w58g005jrpkfui7qxg15	cmm63fy5r0086rp4tcz6umk4m	cmm63fybx009rrp4t5k7xu9xh	2026-02-28 09:15:57.184
cmm63w58g005lrpkf8w4b1eup	cmm63fy5u0089rp4t68jeguo8	cmm63fy5y008crp4tnz3updpb	2026-02-28 09:15:57.185
cmm63w58h005nrpkf0zg5bkne	cmm63fy5u0089rp4t68jeguo8	cmm63fybx009rrp4t5k7xu9xh	2026-02-28 09:15:57.185
cmm63w58h005prpkftb65ghte	cmm63fy5u0089rp4t68jeguo8	cmm63fyc0009urp4tg3oo6gpb	2026-02-28 09:15:57.186
cmm63w58h005rrpkfublejtjm	cmm63fy5y008crp4tnz3updpb	cmm63fybx009rrp4t5k7xu9xh	2026-02-28 09:15:57.186
cmm63w58i005trpkfo7lj6lpb	cmm63fy5y008crp4tnz3updpb	cmm63fyc0009urp4tg3oo6gpb	2026-02-28 09:15:57.186
cmm63w58i005vrpkfoxb1jxkh	cmm63fy5y008crp4tnz3updpb	cmm63fyc3009xrp4t3748n9t1	2026-02-28 09:15:57.187
cmm63w58j005xrpkfd6jd59yv	cmm63fybx009rrp4t5k7xu9xh	cmm63fyc0009urp4tg3oo6gpb	2026-02-28 09:15:57.187
cmm63w58j005zrpkfbayxhkk3	cmm63fybx009rrp4t5k7xu9xh	cmm63fyc3009xrp4t3748n9t1	2026-02-28 09:15:57.187
cmm63w58j0061rpkf09nuho9e	cmm63fybx009rrp4t5k7xu9xh	cmm63fyc500a0rp4t0qmwqz7l	2026-02-28 09:15:57.188
cmm63w58k0063rpkfus9y6by7	cmm63fyc0009urp4tg3oo6gpb	cmm63fyc3009xrp4t3748n9t1	2026-02-28 09:15:57.188
cmm63w58k0065rpkfcydl3gs5	cmm63fyc0009urp4tg3oo6gpb	cmm63fyc500a0rp4t0qmwqz7l	2026-02-28 09:15:57.188
cmm63w58k0067rpkf03vq1c9i	cmm63fyc0009urp4tg3oo6gpb	cmm63fyc800a3rp4tlulunw58	2026-02-28 09:15:57.189
cmm63w58l0069rpkfemjzvp5k	cmm63fyc3009xrp4t3748n9t1	cmm63fyc500a0rp4t0qmwqz7l	2026-02-28 09:15:57.189
cmm63w58l006brpkfksijs0lo	cmm63fyc3009xrp4t3748n9t1	cmm63fyc800a3rp4tlulunw58	2026-02-28 09:15:57.19
cmm63w58l006drpkf9u5aebv4	cmm63fyc3009xrp4t3748n9t1	cmm63fyca00a6rp4tv122und9	2026-02-28 09:15:57.19
cmm63w58m006frpkfp80e5cnx	cmm63fyc500a0rp4t0qmwqz7l	cmm63fyc800a3rp4tlulunw58	2026-02-28 09:15:57.19
cmm63w58m006hrpkftm4y1mxb	cmm63fyc500a0rp4t0qmwqz7l	cmm63fyca00a6rp4tv122und9	2026-02-28 09:15:57.191
cmm63w58n006jrpkf3houicce	cmm63fyc500a0rp4t0qmwqz7l	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 09:15:57.191
cmm63w58n006lrpkfzjuj3ule	cmm63fyc800a3rp4tlulunw58	cmm63fyca00a6rp4tv122und9	2026-02-28 09:15:57.191
cmm63w58n006nrpkfz2x4e8br	cmm63fyc800a3rp4tlulunw58	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 09:15:57.192
cmm63w58o006prpkftf8tznyx	cmm63fyc800a3rp4tlulunw58	cmm63fxxz0008rp4tqn1g2m71	2026-02-28 09:15:57.192
cmm63w58o006rrpkfu1efcjt8	cmm63fyca00a6rp4tv122und9	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 09:15:57.192
cmm63w58o006trpkfg2sx8f0y	cmm63fyca00a6rp4tv122und9	cmm63fxxz0008rp4tqn1g2m71	2026-02-28 09:15:57.193
cmm63w58p006vrpkf8n53giga	cmm63fyi600blrp4tbrmdxkiz	cmm63fxxz0008rp4tqn1g2m71	2026-02-28 09:15:57.193
cmm6df061001prp5u098cdm3t	cmm63fxyg0017rp4tsc8sjank	cmm63fxy4000drp4tmz6ic0ed	2026-02-28 13:42:33.625
cmm6df063001trp5u40kk9qxb	cmm63fxyi001crp4tomcevcuq	cmm63fxy4000drp4tmz6ic0ed	2026-02-28 13:42:33.627
cmm6df064001xrp5uiw87q2w5	cmm63fxyk001hrp4tu5axt1o9	cmm63fxy4000drp4tmz6ic0ed	2026-02-28 13:42:33.628
cmm6df0650021rp5ue5g65baa	cmm63fxyk001hrp4tu5axt1o9	cmm63fxzb003srp4td3k99ui9	2026-02-28 13:42:33.63
cmm6df0660023rp5upxobg325	cmm63fxy4000drp4tmz6ic0ed	cmm63fxz6003drp4t141xl6pe	2026-02-28 13:42:33.63
cmm6df0670025rp5u9qn0noyy	cmm63fxy4000drp4tmz6ic0ed	cmm63fxzb003srp4td3k99ui9	2026-02-28 13:42:33.631
cmm6df0670027rp5unj27mujq	cmm63fxy4000drp4tmz6ic0ed	cmm63fxzc003vrp4tcn85cvxu	2026-02-28 13:42:33.632
cmm6df069002brp5u1a4ecgxi	cmm63fxz6003drp4t141xl6pe	cmm63fxzc003vrp4tcn85cvxu	2026-02-28 13:42:33.633
cmm6df069002drp5ujuuvzc3o	cmm63fxz6003drp4t141xl6pe	cmm63fxzd003yrp4tbyym15ea	2026-02-28 13:42:33.634
cmm6df06b002jrp5u6nl9a5kp	cmm63fxzb003srp4td3k99ui9	cmm63fxzi004erp4t158tuuka	2026-02-28 13:42:33.635
cmm6df06c002prp5u5keodx4i	cmm63fxzc003vrp4tcn85cvxu	cmm63fxzj004hrp4ts8x1hphz	2026-02-28 13:42:33.637
cmm6df06e002vrp5u3i9pf0w9	cmm63fxzd003yrp4tbyym15ea	cmm63fy5r0086rp4tcz6umk4m	2026-02-28 13:42:33.639
cmm6df06f002zrp5uf3xhfsfz	cmm63fxzi004erp4t158tuuka	cmm63fy5r0086rp4tcz6umk4m	2026-02-28 13:42:33.64
cmm6df06g0031rp5u9kegoba4	cmm63fxzi004erp4t158tuuka	cmm63fxy7000irp4tgmz2ke1e	2026-02-28 13:42:33.64
cmm6df06g0033rp5u2anwdxvy	cmm63fxzj004hrp4ts8x1hphz	cmm63fy5r0086rp4tcz6umk4m	2026-02-28 13:42:33.641
cmm6df06h0035rp5uigoar4vw	cmm63fxzj004hrp4ts8x1hphz	cmm63fxy7000irp4tgmz2ke1e	2026-02-28 13:42:33.641
cmm6df06i0039rp5updawqwip	cmm63fy5r0086rp4tcz6umk4m	cmm63fxy7000irp4tgmz2ke1e	2026-02-28 13:42:33.643
cmm6df06j003brp5uczxcke7q	cmm63fy5r0086rp4tcz6umk4m	cmm63fxzm004nrp4t5tsvj8qd	2026-02-28 13:42:33.643
cmm6df06j003drp5uro41luhy	cmm63fy5r0086rp4tcz6umk4m	cmm63fxzo004trp4t3rwxfunq	2026-02-28 13:42:33.644
cmm6df06k003frp5u9fw0vdem	cmm63fxy7000irp4tgmz2ke1e	cmm63fxzm004nrp4t5tsvj8qd	2026-02-28 13:42:33.644
cmm6df06l003hrp5u0xm9c9ij	cmm63fxy7000irp4tgmz2ke1e	cmm63fxzo004trp4t3rwxfunq	2026-02-28 13:42:33.645
cmm6df06l003jrp5u1z1tc1x0	cmm63fxy7000irp4tgmz2ke1e	cmm63fxzp004wrp4t3iqtl0lm	2026-02-28 13:42:33.646
cmm6df06n003prp5uim1vlhsf	cmm63fxzm004nrp4t5tsvj8qd	cmm63fxzr004zrp4tgb7nj925	2026-02-28 13:42:33.647
cmm6df06o003vrp5uxlocm1sh	cmm63fxzo004trp4t3rwxfunq	cmm63fxza003prp4tjpc5uyiy	2026-02-28 13:42:33.649
cmm6df06p003zrp5ubkmzt5pj	cmm63fxzp004wrp4t3iqtl0lm	cmm63fxza003prp4tjpc5uyiy	2026-02-28 13:42:33.65
cmm6df06q0041rp5ur8qogwb4	cmm63fxzp004wrp4t3iqtl0lm	cmm63fxz7003grp4trm4zibt9	2026-02-28 13:42:33.65
cmm6df06r0043rp5utfhc89kc	cmm63fxzr004zrp4tgb7nj925	cmm63fxza003prp4tjpc5uyiy	2026-02-28 13:42:33.651
cmm6df06r0045rp5u7bt3p43g	cmm63fxzr004zrp4tgb7nj925	cmm63fxz7003grp4trm4zibt9	2026-02-28 13:42:33.652
cmm6df06s0047rp5ukzjgsxnq	cmm63fxzr004zrp4tgb7nj925	cmm63fxzk004krp4toewa8dbx	2026-02-28 13:42:33.652
cmm6df06s0049rp5uen5cmq75	cmm63fxza003prp4tjpc5uyiy	cmm63fxz7003grp4trm4zibt9	2026-02-28 13:42:33.653
cmm6df06t004brp5u9rxrhr16	cmm63fxza003prp4tjpc5uyiy	cmm63fxzk004krp4toewa8dbx	2026-02-28 13:42:33.653
cmm6df06u004drp5uk5t948lp	cmm63fxza003prp4tjpc5uyiy	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 13:42:33.654
cmm6df06u004frp5uqt8arq4c	cmm63fxz7003grp4trm4zibt9	cmm63fxzk004krp4toewa8dbx	2026-02-28 13:42:33.655
cmm6df06v004hrp5udeun59z6	cmm63fxz7003grp4trm4zibt9	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 13:42:33.655
cmm6df06v004jrp5utomj1s00	cmm63fxz7003grp4trm4zibt9	cmm63fxy9000nrp4tgpr7j6ob	2026-02-28 13:42:33.656
cmm6df06w004lrp5uocj0lu21	cmm63fxzk004krp4toewa8dbx	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 13:42:33.656
cmm6df06w004nrp5u0ebl2rcs	cmm63fxzk004krp4toewa8dbx	cmm63fxy9000nrp4tgpr7j6ob	2026-02-28 13:42:33.657
cmm6df06x004rrp5us9yi745o	cmm63fyi600blrp4tbrmdxkiz	cmm63fxy9000nrp4tgpr7j6ob	2026-02-28 13:42:33.658
cmm6df06y004trp5uv03e9b1u	cmm63fyi600blrp4tbrmdxkiz	cmm63fxzn004qrp4tac9r6192	2026-02-28 13:42:33.658
cmm6df06y004vrp5upbwwhifr	cmm63fyi600blrp4tbrmdxkiz	cmm63fxzs0052rp4tfqiij0p6	2026-02-28 13:42:33.659
cmm6df06z004xrp5ubx2wqe6q	cmm63fxy9000nrp4tgpr7j6ob	cmm63fxzn004qrp4tac9r6192	2026-02-28 13:42:33.659
cmm6df06z004zrp5uxwj8roav	cmm63fxy9000nrp4tgpr7j6ob	cmm63fxzs0052rp4tfqiij0p6	2026-02-28 13:42:33.66
cmm6df0700051rp5udaxdrzx7	cmm63fxy9000nrp4tgpr7j6ob	cmm63fxzf0041rp4tvr2thuej	2026-02-28 13:42:33.66
cmm6df0700053rp5uv8z66yej	cmm63fxzn004qrp4tac9r6192	cmm63fxzs0052rp4tfqiij0p6	2026-02-28 13:42:33.661
cmm6df0710055rp5u111w4whb	cmm63fxzn004qrp4tac9r6192	cmm63fxzf0041rp4tvr2thuej	2026-02-28 13:42:33.661
cmm6df0710057rp5ufe0r4281	cmm63fxzn004qrp4tac9r6192	cmm63fy5u0089rp4t68jeguo8	2026-02-28 13:42:33.662
cmm6df0720059rp5uzhbnelbt	cmm63fxzs0052rp4tfqiij0p6	cmm63fxzf0041rp4tvr2thuej	2026-02-28 13:42:33.662
cmm6df073005frp5udid4c48a	cmm63fxzf0041rp4tvr2thuej	cmm63fy5u0089rp4t68jeguo8	2026-02-28 13:42:33.664
cmm6df074005hrp5udy4rsr7w	cmm63fxzf0041rp4tvr2thuej	cmm63fy5y008crp4tnz3updpb	2026-02-28 13:42:33.664
cmm6df074005jrp5u8maj3jm0	cmm63fxzf0041rp4tvr2thuej	cmm63fybx009rrp4t5k7xu9xh	2026-02-28 13:42:33.664
cmm6df07a006jrp5uxy0ipaz7	cmm63fyc500a0rp4t0qmwqz7l	cmm63fxz4003arp4ti8wolkwg	2026-02-28 13:42:33.67
cmm6df07b006nrp5ugoabqcvn	cmm63fyc800a3rp4tlulunw58	cmm63fxz4003arp4ti8wolkwg	2026-02-28 13:42:33.671
cmm6df07b006rrp5uvprba0xs	cmm63fyca00a6rp4tv122und9	cmm63fxz4003arp4ti8wolkwg	2026-02-28 13:42:33.672
cmm6df07c006vrp5uiqbg9f2g	cmm63fxz4003arp4ti8wolkwg	cmm63fxxz0008rp4tqn1g2m71	2026-02-28 13:42:33.672
cmm6h4pbp001jrpkt4w7ubqcc	cmm63fxyg0017rp4tsc8sjank	cmm63fxza003prp4tjpc5uyiy	2026-02-28 15:26:31.478
cmm6h4pbr001nrpkt6k4t2gwj	cmm63fxyi001crp4tomcevcuq	cmm63fxza003prp4tjpc5uyiy	2026-02-28 15:26:31.479
cmm6h4pbs001prpktk6wq4pai	cmm63fxyi001crp4tomcevcuq	cmm63fxy7000irp4tgmz2ke1e	2026-02-28 15:26:31.48
cmm6h4pbt001rrpktatbhkz92	cmm63fxyk001hrp4tu5axt1o9	cmm63fxza003prp4tjpc5uyiy	2026-02-28 15:26:31.481
cmm6h4pbt001trpkt6ztl3sah	cmm63fxyk001hrp4tu5axt1o9	cmm63fxy7000irp4tgmz2ke1e	2026-02-28 15:26:31.482
cmm6h4pbu001xrpktruk6bxpg	cmm63fxza003prp4tjpc5uyiy	cmm63fxy7000irp4tgmz2ke1e	2026-02-28 15:26:31.483
cmm6h4pbv001zrpktsz37wpu5	cmm63fxza003prp4tjpc5uyiy	cmm63fxz6003drp4t141xl6pe	2026-02-28 15:26:31.483
cmm6h4pbw0023rpkthv1dfr1p	cmm63fxy7000irp4tgmz2ke1e	cmm63fxz6003drp4t141xl6pe	2026-02-28 15:26:31.485
cmm6h4pbx0025rpktgxdy0iyr	cmm63fxy7000irp4tgmz2ke1e	cmm63fxzc003vrp4tcn85cvxu	2026-02-28 15:26:31.485
cmm6h4pbx0027rpktj6d0u3yh	cmm63fxy7000irp4tgmz2ke1e	cmm63fxzd003yrp4tbyym15ea	2026-02-28 15:26:31.486
cmm6h4pbz002drpkt6h5aumam	cmm63fxz6003drp4t141xl6pe	cmm63fxzi004erp4t158tuuka	2026-02-28 15:26:31.488
cmm6h4pc2002prpktzinafe9b	cmm63fxzd003yrp4tbyym15ea	cmm63fxzk004krp4toewa8dbx	2026-02-28 15:26:31.491
cmm6h4pc60031rpkta9ht7qpn	cmm63fxzj004hrp4ts8x1hphz	cmm63fxzo004trp4t3rwxfunq	2026-02-28 15:26:31.495
cmm6h4pc70033rpkt7kytwzm2	cmm63fxzk004krp4toewa8dbx	cmm63fy5r0086rp4tcz6umk4m	2026-02-28 15:26:31.496
cmm6h4pc80037rpktzua1f2i5	cmm63fxzk004krp4toewa8dbx	cmm63fxzp004wrp4t3iqtl0lm	2026-02-28 15:26:31.497
cmm6h4pca003brpktw0sk0dde	cmm63fy5r0086rp4tcz6umk4m	cmm63fxzp004wrp4t3iqtl0lm	2026-02-28 15:26:31.498
cmm6h4pca003drpkts0334l5y	cmm63fy5r0086rp4tcz6umk4m	cmm63fxzr004zrp4tgb7nj925	2026-02-28 15:26:31.499
cmm6h4pcc003jrpkttez5b7qm	cmm63fxzo004trp4t3rwxfunq	cmm63fxy4000drp4tmz6ic0ed	2026-02-28 15:26:31.501
cmm6h4pcd003nrpktpjs7m69l	cmm63fxzp004wrp4t3iqtl0lm	cmm63fxy4000drp4tmz6ic0ed	2026-02-28 15:26:31.502
cmm6h4pce003prpktb0dn50i6	cmm63fxzp004wrp4t3iqtl0lm	cmm63fxzb003srp4td3k99ui9	2026-02-28 15:26:31.502
cmm6h4pce003rrpktmhvho72w	cmm63fxzr004zrp4tgb7nj925	cmm63fxy4000drp4tmz6ic0ed	2026-02-28 15:26:31.503
cmm6h4pcf003trpktss8x1m5o	cmm63fxzr004zrp4tgb7nj925	cmm63fxzb003srp4td3k99ui9	2026-02-28 15:26:31.503
cmm6h4pcf003vrpktj3y90sdc	cmm63fxzr004zrp4tgb7nj925	cmm63fxzm004nrp4t5tsvj8qd	2026-02-28 15:26:31.504
cmm6h4pch003zrpktnxky1kf0	cmm63fxy4000drp4tmz6ic0ed	cmm63fxzm004nrp4t5tsvj8qd	2026-02-28 15:26:31.505
cmm6h4pch0041rpkttzjj3rkw	cmm63fxy4000drp4tmz6ic0ed	cmm63fxz7003grp4trm4zibt9	2026-02-28 15:26:31.506
cmm6h4pci0043rpktlmgixsca	cmm63fxzb003srp4td3k99ui9	cmm63fxzm004nrp4t5tsvj8qd	2026-02-28 15:26:31.506
cmm6h4pci0045rpkt3tq887bo	cmm63fxzb003srp4td3k99ui9	cmm63fxz7003grp4trm4zibt9	2026-02-28 15:26:31.507
cmm6h4pcj0047rpktelp08fjx	cmm63fxzb003srp4td3k99ui9	cmm63fxxz0008rp4tqn1g2m71	2026-02-28 15:26:31.507
cmm6h4pck0049rpkthli1mwlq	cmm63fxzm004nrp4t5tsvj8qd	cmm63fxz7003grp4trm4zibt9	2026-02-28 15:26:31.508
cmm6h4pck004brpktg6p4t8ri	cmm63fxzm004nrp4t5tsvj8qd	cmm63fxxz0008rp4tqn1g2m71	2026-02-28 15:26:31.509
cmm6h4pcl004drpkt6j4o0o8x	cmm63fxzm004nrp4t5tsvj8qd	cmm63fy5u0089rp4t68jeguo8	2026-02-28 15:26:31.509
cmm6h4pcl004frpkti5mws4u8	cmm63fxz7003grp4trm4zibt9	cmm63fxxz0008rp4tqn1g2m71	2026-02-28 15:26:31.51
cmm6h4pcm004hrpkt6ahrtt29	cmm63fxz7003grp4trm4zibt9	cmm63fy5u0089rp4t68jeguo8	2026-02-28 15:26:31.51
cmm6h4pcm004jrpkt4zqkqs9q	cmm63fxz7003grp4trm4zibt9	cmm63fy5y008crp4tnz3updpb	2026-02-28 15:26:31.511
cmm6h4pcn004lrpkthxad4nnf	cmm63fxxz0008rp4tqn1g2m71	cmm63fy5u0089rp4t68jeguo8	2026-02-28 15:26:31.511
cmm6h4pcn004nrpktj3ijc1vg	cmm63fxxz0008rp4tqn1g2m71	cmm63fy5y008crp4tnz3updpb	2026-02-28 15:26:31.512
cmm6h4pco004prpkt775gpk0e	cmm63fxxz0008rp4tqn1g2m71	cmm63fybx009rrp4t5k7xu9xh	2026-02-28 15:26:31.512
cmm6h4pcx005vrpktlpp0x29x	cmm63fyc800a3rp4tlulunw58	cmm63fxzf0041rp4tvr2thuej	2026-02-28 15:26:31.521
cmm6h4pcx005zrpkt9eeywamd	cmm63fyca00a6rp4tv122und9	cmm63fxzf0041rp4tvr2thuej	2026-02-28 15:26:31.522
cmm6h4pcy0061rpktjh2pho8b	cmm63fyca00a6rp4tv122und9	cmm63fxzn004qrp4tac9r6192	2026-02-28 15:26:31.522
cmm6h4pcy0063rpktfiz00lil	cmm63fxz4003arp4ti8wolkwg	cmm63fxzf0041rp4tvr2thuej	2026-02-28 15:26:31.523
cmm6h4pcz0065rpktillsumjm	cmm63fxz4003arp4ti8wolkwg	cmm63fxzn004qrp4tac9r6192	2026-02-28 15:26:31.523
cmm6h4pcz0067rpktc7um2pg4	cmm63fxz4003arp4ti8wolkwg	cmm63fxzs0052rp4tfqiij0p6	2026-02-28 15:26:31.523
cmm6h4pcz0069rpkta5rlbo9c	cmm63fxzf0041rp4tvr2thuej	cmm63fxzn004qrp4tac9r6192	2026-02-28 15:26:31.524
cmm6h4pd0006brpktdcztzxdr	cmm63fxzf0041rp4tvr2thuej	cmm63fxzs0052rp4tfqiij0p6	2026-02-28 15:26:31.524
cmm6h4pd0006drpktva64m76a	cmm63fxzf0041rp4tvr2thuej	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 15:26:31.525
cmm6h4pd1006hrpkt9ihy8ibm	cmm63fxzn004qrp4tac9r6192	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 15:26:31.525
cmm6h4pd1006jrpktrkcpgqh5	cmm63fxzn004qrp4tac9r6192	cmm63fxy9000nrp4tgpr7j6ob	2026-02-28 15:26:31.526
cmm6h4pd2006lrpkthlbkt240	cmm63fxzs0052rp4tfqiij0p6	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 15:26:31.526
cmm6h4pd2006nrpktx2ydcqco	cmm63fxzs0052rp4tfqiij0p6	cmm63fxy9000nrp4tgpr7j6ob	2026-02-28 15:26:31.527
cmm6h4pd2006prpktqqtryv87	cmm63fxzs0052rp4tfqiij0p6	cmm63fxyb000srp4tufgce1ck	2026-02-28 15:26:31.527
cmm6h4pd3006trpktv10hjf0z	cmm63fyi600blrp4tbrmdxkiz	cmm63fxyb000srp4tufgce1ck	2026-02-28 15:26:31.528
cmm6h4pqh00e8rpktzqw7pxri	cmm63fy5n0083rp4tigxuimhy	cmm63fybx009rrp4t5k7xu9xh	2026-02-28 15:26:32.01
cmm6h4pqi00earpktn7w3v5rz	cmm63fy5n0083rp4tigxuimhy	cmm63fyc0009urp4tg3oo6gpb	2026-02-28 15:26:32.01
cmm6h4pqi00ecrpktwnhe1opa	cmm63fy5n0083rp4tigxuimhy	cmm63fyc3009xrp4t3748n9t1	2026-02-28 15:26:32.011
cmm6h4pqi00eerpktt23t6ujy	cmm63fy5n0083rp4tigxuimhy	cmm63fyc500a0rp4t0qmwqz7l	2026-02-28 15:26:32.011
cmm6h4pqj00egrpktjcblvyio	cmm63fy5n0083rp4tigxuimhy	cmm63fyc800a3rp4tlulunw58	2026-02-28 15:26:32.011
cmm6h4pqj00eirpktzo8cfszp	cmm63fy5n0083rp4tigxuimhy	cmm63fyca00a6rp4tv122und9	2026-02-28 15:26:32.012
cmm6h4pxf00izrpktehcmp8gv	cmm63fy5n0083rp4tigxuimhy	cmm63fyi600blrp4tbrmdxkiz	2026-02-28 15:26:32.26
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Like" (id, "postId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: LiveSession; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."LiveSession" (id, "creatorId", title, "streamKey", "rtmpUrl", "hlsUrl", status, "viewerCount", "startedAt", "endedAt", "createdAt") FROM stdin;
cmm6h4pd5006xrpktkbd0p1ob	cmm63fxxz0008rp4tqn1g2m71	Let's talk - Ask Me Anything!	stream_cmm63fxxz0008rp4tqn1g2m71_1772292391529_dfm8or	\N	\N	LIVE	1300	2026-02-28 14:56:31.529	\N	2026-02-28 15:26:31.53
cmm6h4pd6006zrpktzmlhjiaq	cmm63fxy4000drp4tmz6ic0ed	Let's talk - Ask Me Anything!	stream_cmm63fxy4000drp4tmz6ic0ed_1772292391530_ij7qvj	\N	\N	LIVE	2250	2026-02-28 14:41:31.53	\N	2026-02-28 15:26:31.53
cmm6h4pd60071rpktd8ej8b9f	cmm63fxy7000irp4tgmz2ke1e	Let's talk - Ask Me Anything!	stream_cmm63fxy7000irp4tgmz2ke1e_1772292391530_4kde9i	\N	\N	LIVE	2210	2026-02-28 15:06:31.53	\N	2026-02-28 15:26:31.531
cmm6h4pd60073rpktu0fsaskx	cmm63fxy9000nrp4tgpr7j6ob	Let's talk - Ask Me Anything!	stream_cmm63fxy9000nrp4tgpr7j6ob_1772292391530_yhaew8	\N	\N	LIVE	1300	2026-02-28 14:26:31.53	\N	2026-02-28 15:26:31.531
cmm6h4pd70075rpktv7at4dye	cmm63fxyb000srp4tufgce1ck	Let's talk - Ask Me Anything!	stream_cmm63fxyb000srp4tufgce1ck_1772292391531_gp9j0h	\N	\N	LIVE	2250	2026-02-28 15:11:31.531	\N	2026-02-28 15:26:31.531
cmm6h4pd70077rpktj1nbb50p	cmm63fxyd000xrp4twpluerek	Let's talk - Ask Me Anything!	stream_cmm63fxyd000xrp4twpluerek_1772292391531_smrjjz	\N	\N	LIVE	2210	2026-02-28 14:36:31.531	\N	2026-02-28 15:26:31.531
cmm6h4pdb007irpktm0ptwz6s	cmm63fxz4003arp4ti8wolkwg	Evening Chill Session	upcoming_cmm63fxz4003arp4ti8wolkwg_1772292391535_aiwogb	\N	\N	SCHEDULED	0	\N	\N	2026-02-28 10:30:00
cmm6h4pdb007krpktetra1dsv	cmm63fxz6003drp4t141xl6pe	Art & Chat Night	upcoming_cmm63fxz6003drp4t141xl6pe_1772292391535_zrxvpw	\N	\N	SCHEDULED	0	\N	\N	2026-02-28 11:15:00
cmm6h4pdb007mrpkt902rvavf	cmm63fxz7003grp4trm4zibt9	Cosplay Q&A Live	upcoming_cmm63fxz7003grp4trm4zibt9_1772292391535_q0dzr7	\N	\N	SCHEDULED	0	\N	\N	2026-02-28 13:00:00
\.


--
-- Data for Name: MarketplaceListing; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."MarketplaceListing" (id, "sellerId", title, description, category, type, price, "startingBid", "reservePrice", "endsAt", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Message" (id, "conversationId", "senderId", text, "mediaUrl", "mediaType", "tipAmount", "readAt", "createdAt") FROM stdin;
cmm6h4pk800cgrpktvhnum9yp	cmm6h4pk700cerpkthxyvvdyd	cmm63fy5r0086rp4tcz6umk4m	Hey! How are you doing? I saw your latest post, it was amazing! 🔥	\N	TEXT	\N	\N	2026-02-28 15:21:31.784
cmm6h4pk900cirpkta95pu6k8	cmm6h4pk700cerpkthxyvvdyd	cmm63fy5n0083rp4tigxuimhy	Thanks so much! I worked really hard on it. Glad you liked it 😊	\N	TEXT	\N	\N	2026-02-28 15:22:31.784
cmm6h4pk900ckrpkt7n236g7g	cmm6h4pk700cerpkthxyvvdyd	cmm63fy5r0086rp4tcz6umk4m	Seriously though, your content keeps getting better. Keep it up!	\N	TEXT	\N	\N	2026-02-28 15:23:31.784
cmm6h4pka00cmrpktkeg76ke2	cmm6h4pk700cerpkthxyvvdyd	cmm63fy5n0083rp4tigxuimhy	That means a lot! Any suggestions for what I should post next?	\N	TEXT	\N	\N	2026-02-28 15:24:31.784
cmm6h4pkb00corpkt8vz7t4pm	cmm6h4pk700cerpkthxyvvdyd	cmm63fy5n0083rp4tigxuimhy	Maybe a behind-the-scenes look at my creative process?	\N	TEXT	\N	\N	2026-02-28 15:25:31.784
cmm6h4pkc00csrpkt1wyutqhu	cmm6h4pkc00cqrpkthujmewt5	cmm63fy5u0089rp4t68jeguo8	Hey there! Welcome to my page 💕	\N	TEXT	\N	\N	2026-02-28 15:16:31.788
cmm6h4pkd00curpktk2enman3	cmm6h4pkc00cqrpkthujmewt5	cmm63fy5n0083rp4tigxuimhy	Hi Sarah! I love your work, been following you for a while now	\N	TEXT	\N	\N	2026-02-28 15:17:31.788
cmm6h4pkd00cwrpktm4nwmi5z	cmm6h4pkc00cqrpkthujmewt5	cmm63fy5u0089rp4t68jeguo8	That's so sweet! I have some exclusive content coming this week 🎉	\N	TEXT	\N	\N	2026-02-28 15:18:31.788
cmm6h4pke00cyrpkt22g1lfhw	cmm6h4pkc00cqrpkthujmewt5	cmm63fy5n0083rp4tigxuimhy	Can't wait to see it! Let me know if you need anything 💕	\N	TEXT	\N	\N	2026-02-28 15:19:31.788
cmm6h4pke00d2rpkt9oqq5jpu	cmm6h4pke00d0rpkt6nnhlei5	cmm63fy5y008crp4tnz3updpb	Yo! Thanks for subscribing to my channel 🙏	\N	TEXT	\N	\N	2026-02-28 15:06:31.79
cmm6h4pkf00d4rpktqw9yxgwn	cmm6h4pke00d0rpkt6nnhlei5	cmm63fy5n0083rp4tigxuimhy	No problem bro! Your fitness content is next level 💪	\N	TEXT	\N	\N	2026-02-28 15:07:31.79
cmm6h4pkf00d6rpkt2jcekmex	cmm6h4pke00d0rpkt6nnhlei5	cmm63fy5y008crp4tnz3updpb	Appreciate that! I'm dropping a new workout series next Monday	\N	TEXT	\N	\N	2026-02-28 15:08:31.79
cmm6h4pkg00d8rpktzwxcpy0t	cmm6h4pke00d0rpkt6nnhlei5	cmm63fy5n0083rp4tigxuimhy	Sounds good, talk soon! 👊	\N	TEXT	\N	\N	2026-02-28 15:09:31.79
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Notification" (id, "userId", type, "actorId", "entityId", "entityType", message, read, "createdAt") FROM stdin;
cmm6h4pqp00esrpktco40y0qb	cmm63fy5n0083rp4tigxuimhy	FOLLOW	\N	\N	avatar:/images/creators/creator1.webp|name:Jimmy Fox	Jimmy Fox Followed You	f	2026-02-28 15:23:32.017
cmm6h4pqq00eurpktduey7eyq	cmm63fy5n0083rp4tigxuimhy	COMMENT	\N	\N	avatar:/images/creators/creator2.webp|name:Allen Sin	Allen Sin commented on your post	f	2026-02-28 15:21:32.017
cmm6h4pqq00ewrpktly545nd2	cmm63fy5n0083rp4tigxuimhy	LIKE	\N	\N	avatar:/images/creators/creator3.webp|name:Kerry Zilly	Kerry Zilly Like Your Photo	f	2026-02-28 15:20:32.017
cmm6h4pqr00eyrpktd8klgy27	cmm63fy5n0083rp4tigxuimhy	MENTION	\N	\N	avatar:/images/creators/creator4.webp|name:Finny Pory	Finny Pory mentioned you	f	2026-02-28 15:19:32.017
cmm6h4pqr00f0rpkt4jn2cawc	cmm63fy5n0083rp4tigxuimhy	LIKE	\N	\N	avatar:/images/creators/creator5.webp|name:Binora Mell	Binora Mell like your comment	f	2026-02-28 15:18:32.017
cmm6h4pqr00f2rpktb16uxgs4	cmm63fy5n0083rp4tigxuimhy	SUBSCRIBE	\N	\N	avatar:/images/creators/creator6.webp|name:Robert Zak	Robert Zak Subscribed You	f	2026-02-28 15:17:32.017
\.


--
-- Data for Name: NotificationPreference; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."NotificationPreference" (id, "userId", type, "inApp", email) FROM stdin;
\.


--
-- Data for Name: OtpCode; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."OtpCode" (id, "userId", code, type, "expiresAt", used, "createdAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Payment" (id, "userId", amount, gateway, "gatewayTransactionId", status, type, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Post" (id, "authorId", text, visibility, "isPinned", "ppvPrice", "likeCount", "commentCount", "createdAt", "updatedAt") FROM stdin;
cmm6h4pdz0094rpktdf4h8wxr	cmm63fxzi004erp4t158tuuka	Just dropped a new exclusive photo set for my subscribers! Thank you all for the amazing support on Fansbook. You guys make creating content so much fun 💕	PUBLIC	f	\N	80	8	2026-02-28 13:26:31.559	2026-02-28 15:26:31.567
cmm6h4pe2009qrpktl2w0ke7o	cmm63fxzj004hrp4ts8x1hphz	New week, new vibes! Which look is your favorite? Let me know in the comments 💋	PUBLIC	f	\N	156	8	2026-02-28 14:26:31.562	2026-02-28 15:26:31.57
cmm6h4pe300a2rpktj53njoly	cmm63fxzj004hrp4ts8x1hphz	Behind the scenes of today's shoot! Subscribe to see the full video. Going live tonight at 9 PM — don't miss it 🎥🔥	PUBLIC	f	\N	80	8	2026-02-28 13:26:31.563	2026-02-28 15:26:31.572
cmm6h4pe400a6rpktqnwa9rh2	cmm63fxzi004erp4t158tuuka	Sneak peek of the new content dropping this weekend! Stay tuned 🔥✨	PUBLIC	f	\N	210	8	2026-02-28 13:56:31.564	2026-02-28 15:26:31.573
cmm6h4pwq00ffrpktwciru1sd	cmm63fyi600blrp4tbrmdxkiz	Just finished an amazing photoshoot today! Can't wait to share all the behind-the-scenes shots with my subscribers 📸	PUBLIC	f	\N	42	7	2026-02-28 10:26:32.231	2026-02-28 15:26:32.234
cmm6h4pwt00fxrpktwvt2lxy1	cmm63fyi600blrp4tbrmdxkiz	Finally we did a romantic video 🌃🤍	PUBLIC	f	\N	128	9	2026-02-28 05:26:32.231	2026-02-28 15:26:32.238
cmm6h4pwy00gjrpkts62oi966	cmm63fyi600blrp4tbrmdxkiz	Exclusive subscriber content dropping tonight! Get ready for something special ✨	SUBSCRIBERS	f	\N	89	6	2026-02-27 19:26:32.231	2026-02-28 15:26:32.243
cmm6h4px100gxrpktsdt3zpik	cmm63fyi600blrp4tbrmdxkiz	Behind the scenes from yesterday's shoot. These are just for my amazing subscribers 💕	SUBSCRIBERS	f	\N	56	8	2026-02-27 09:26:32.231	2026-02-28 15:26:32.245
cmm6h4px400hhrpkt7rjx9skd	cmm63fyi600blrp4tbrmdxkiz	Thank you for 1000 followers! Here's a special thank you post for everyone 🎉	PUBLIC	f	\N	234	7	2026-02-26 15:26:32.231	2026-02-28 15:26:32.248
\.


--
-- Data for Name: PostMedia; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."PostMedia" (id, "postId", url, type, "order", thumbnail, "createdAt") FROM stdin;
cmm6h4pdz0096rpktolzsmch7	cmm6h4pdz0094rpktdf4h8wxr	/icons/dashboard/post-image-main.webp	IMAGE	0	\N	2026-02-28 15:26:31.56
cmm6h4pe00098rpkttbsqeoyj	cmm6h4pdz0094rpktdf4h8wxr	/icons/dashboard/post-image-right-top.webp	IMAGE	1	\N	2026-02-28 15:26:31.56
cmm6h4pe0009arpktdqevexsw	cmm6h4pdz0094rpktdf4h8wxr	/icons/dashboard/post-image-blur.webp	IMAGE	2	\N	2026-02-28 15:26:31.561
cmm6h4pe0009crpktx3txbsgn	cmm6h4pdz0094rpktdf4h8wxr	/icons/dashboard/story-bg-1.webp	IMAGE	3	\N	2026-02-28 15:26:31.561
cmm6h4pe1009erpktbapqo07i	cmm6h4pdz0094rpktdf4h8wxr	/icons/dashboard/story-bg-2.webp	IMAGE	4	\N	2026-02-28 15:26:31.561
cmm6h4pe1009grpkt8ade4uwv	cmm6h4pdz0094rpktdf4h8wxr	/icons/dashboard/story-bg-3.webp	IMAGE	5	\N	2026-02-28 15:26:31.561
cmm6h4pe1009irpktwh8i58co	cmm6h4pdz0094rpktdf4h8wxr	/icons/dashboard/story-bg-4.webp	IMAGE	6	\N	2026-02-28 15:26:31.562
cmm6h4pe1009krpktj9ivcfyc	cmm6h4pdz0094rpktdf4h8wxr	/icons/dashboard/story-bg-5.webp	IMAGE	7	\N	2026-02-28 15:26:31.562
cmm6h4pe1009mrpkthmu8xh6w	cmm6h4pdz0094rpktdf4h8wxr	/images/creators/creator1.webp	IMAGE	8	\N	2026-02-28 15:26:31.562
cmm6h4pe2009orpkt6m2d5qou	cmm6h4pdz0094rpktdf4h8wxr	/images/creators/creator2.webp	IMAGE	9	\N	2026-02-28 15:26:31.562
cmm6h4pe2009srpktfzhuy6n1	cmm6h4pe2009qrpktl2w0ke7o	/images/creators/creator3.webp	IMAGE	0	\N	2026-02-28 15:26:31.563
cmm6h4pe2009urpktyf8myo33	cmm6h4pe2009qrpktl2w0ke7o	/images/creators/creator4.webp	IMAGE	1	\N	2026-02-28 15:26:31.563
cmm6h4pe3009wrpkt3e8qrjm3	cmm6h4pe2009qrpktl2w0ke7o	/images/creators/creator5.webp	IMAGE	2	\N	2026-02-28 15:26:31.563
cmm6h4pe3009yrpktgpv1bf47	cmm6h4pe2009qrpktl2w0ke7o	/images/creators/creator6.webp	IMAGE	3	\N	2026-02-28 15:26:31.563
cmm6h4pe300a0rpkti3q6t2oo	cmm6h4pe2009qrpktl2w0ke7o	/images/creators/creator7.webp	IMAGE	4	\N	2026-02-28 15:26:31.564
cmm6h4pe400a4rpktwggpqasf	cmm6h4pe300a2rpktj53njoly	/videos/sample-1.mp4	VIDEO	0	/icons/dashboard/video-thumbnail.webp	2026-02-28 15:26:31.564
cmm6h4pe400a8rpkt2qjiuhgc	cmm6h4pe400a6rpktqnwa9rh2	/videos/sample-2.mp4	VIDEO	0	/icons/dashboard/story-bg-3.webp	2026-02-28 15:26:31.565
cmm6h4pwr00fhrpktbfajj0su	cmm6h4pwq00ffrpktwciru1sd	/icons/dashboard/post-image-main.webp	IMAGE	0	\N	2026-02-28 15:26:32.235
cmm6h4pwu00fzrpkt6nclpwvr	cmm6h4pwt00fxrpktwvt2lxy1	/videos/romantic.mp4	VIDEO	0	/icons/dashboard/video-thumbnail.webp	2026-02-28 15:26:32.239
cmm6h4px100gzrpktjzbx9cuh	cmm6h4px100gxrpktsdt3zpik	/icons/dashboard/post-image-right-top.webp	IMAGE	0	\N	2026-02-28 15:26:32.246
cmm6h4px400hjrpktydgpw3n3	cmm6h4px400hhrpkt7rjx9skd	/icons/dashboard/story-bg-2.webp	IMAGE	0	\N	2026-02-28 15:26:32.249
\.


--
-- Data for Name: PpvPurchase; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."PpvPurchase" (id, "userId", "postId", amount, "createdAt") FROM stdin;
\.


--
-- Data for Name: Referral; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Referral" (id, "referrerId", "referredId", earnings, "createdAt") FROM stdin;
cmm63fyiw00dlrp4tnknce2fs	cmm63fyi600blrp4tbrmdxkiz	cmm63fyit00derp4t2r3wme7o	25	2026-02-28 09:03:21.993
cmm63fyix00dnrp4ttgxe9mkh	cmm63fyi600blrp4tbrmdxkiz	cmm63fyiv00dhrp4t8urx6yal	15.5	2026-02-28 09:03:21.994
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."RefreshToken" (id, "userId", token, "expiresAt", "deviceInfo", "createdAt") FROM stdin;
\.


--
-- Data for Name: Report; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Report" (id, "reporterId", "reportedUserId", "reportedPostId", reason, description, status, "resolvedBy", "resolvedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Session" (id, "userId", "deviceInfo", "ipAddress", "lastActive", "createdAt") FROM stdin;
\.


--
-- Data for Name: Story; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Story" (id, "authorId", "mediaUrl", "mediaType", overlays, "expiresAt", "viewCount", "createdAt") FROM stdin;
cmm6h4pdi0083rpktq6kxy92z	cmm63fxza003prp4tjpc5uyiy	/icons/dashboard/story-bg-1.webp	IMAGE	\N	2026-03-01 15:26:31.542	163	2026-02-28 15:26:31.543
cmm6h4pdj0085rpktpue5hc95	cmm63fxzb003srp4td3k99ui9	/icons/dashboard/story-bg-2.webp	IMAGE	\N	2026-03-01 15:26:31.543	300	2026-02-28 15:26:31.543
cmm6h4pdj0087rpkto6ls2csu	cmm63fxzc003vrp4tcn85cvxu	/icons/dashboard/story-bg-3.webp	IMAGE	\N	2026-03-01 15:26:31.543	204	2026-02-28 15:26:31.543
cmm6h4pdj0089rpkt4ulefuo5	cmm63fxzd003yrp4tbyym15ea	/icons/dashboard/story-bg-4.webp	IMAGE	\N	2026-03-01 15:26:31.543	416	2026-02-28 15:26:31.544
cmm6h4pdk008brpkthf49kplb	cmm63fxzf0041rp4tvr2thuej	/icons/dashboard/story-bg-5.webp	IMAGE	\N	2026-03-01 15:26:31.543	490	2026-02-28 15:26:31.544
\.


--
-- Data for Name: StoryView; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."StoryView" (id, "storyId", "viewerId", "viewedAt") FROM stdin;
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Subscription" (id, "subscriberId", "tierId", "creatorId", status, "startDate", "endDate", "renewalDate", "createdAt", "updatedAt") FROM stdin;
cmm6h4pql00ekrpktrrs0ziml	cmm63fy5n0083rp4tigxuimhy	cmm63fyce00amrp4tbeyjex3i	cmm63fyc800a3rp4tlulunw58	ACTIVE	2026-02-28 15:26:32.013	2026-03-30 15:26:32.013	2026-03-30 15:26:32.013	2026-02-28 15:26:32.013	2026-02-28 15:26:32.013
cmm6h4pqm00emrpktm202ydha	cmm63fy5n0083rp4tigxuimhy	cmm63fycg00aqrp4ta3k7v8o5	cmm63fyca00a6rp4tv122und9	PAST_DUE	2025-12-30 15:26:32.013	2026-01-29 15:26:32.013	2026-01-29 15:26:32.013	2026-02-28 15:26:32.015	2026-02-28 15:26:32.015
cmm6h4pqn00eorpkt391gwzyw	cmm63fy5n0083rp4tigxuimhy	cmm63fych00aurp4t5twfiz3v	cmm63fyc800a3rp4tlulunw58	ACTIVE	2025-10-31 15:26:32.013	2025-11-30 15:26:32.013	2025-11-30 15:26:32.013	2026-02-28 15:26:32.015	2026-02-28 15:26:32.015
cmm6h4pqn00eqrpktlrt2hd84	cmm63fy5n0083rp4tigxuimhy	cmm63fyci00ayrp4tv7h1et5t	cmm63fyca00a6rp4tv122und9	ACTIVE	2025-09-01 15:26:32.013	2025-10-01 15:26:32.013	2025-10-01 15:26:32.013	2026-02-28 15:26:32.016	2026-02-28 15:26:32.016
\.


--
-- Data for Name: SubscriptionTier; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."SubscriptionTier" (id, "creatorId", name, price, description, benefits, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cmm63fxy3000crp4trbbxxho5	cmm63fxxz0008rp4tqn1g2m71	Basic	17.67	Subscribe to Miamokala	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.244	2026-02-28 09:03:21.244
cmm63fxy6000hrp4tm1j9b3g4	cmm63fxy4000drp4tmz6ic0ed	Basic	14.99	Subscribe to Kiasyap	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.247	2026-02-28 09:03:21.247
cmm63fxy8000mrp4tqra14sw3	cmm63fxy7000irp4tgmz2ke1e	Basic	24.99	Subscribe to Sappie	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.249	2026-02-28 09:03:21.249
cmm63fxya000rrp4t1g6jvzlj	cmm63fxy9000nrp4tgpr7j6ob	Basic	9.99	Subscribe to Jourty	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.251	2026-02-28 09:03:21.251
cmm63fxyc000wrp4t3kzrkbg1	cmm63fxyb000srp4tufgce1ck	Basic	12.99	Subscribe to Olicvia	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.253	2026-02-28 09:03:21.253
cmm63fxye0011rp4tvw0pvscj	cmm63fxyd000xrp4twpluerek	Basic	7.99	Subscribe to Joneymeo	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.255	2026-02-28 09:03:21.255
cmm63fxyg0016rp4tfuldssj2	cmm63fxyf0012rp4tazcntitx	Basic	19.99	Subscribe to AlexFit	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.256	2026-02-28 09:03:21.256
cmm63fxyi001brp4tlduobyqa	cmm63fxyg0017rp4tsc8sjank	Basic	29.99	Subscribe to LunaStyle	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.258	2026-02-28 09:03:21.258
cmm63fxyj001grp4tuqihy9a9	cmm63fxyi001crp4tomcevcuq	Basic	11.99	Subscribe to DJ Marcus	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.26	2026-02-28 09:03:21.26
cmm63fxyl001lrp4tbfduptj6	cmm63fxyk001hrp4tu5axt1o9	Basic	8.99	Subscribe to Chef Maria	"[\\"Exclusive posts\\",\\"Direct messages\\",\\"Behind the scenes\\"]"	0	t	2026-02-28 09:03:21.261	2026-02-28 09:03:21.261
cmm63fyce00amrp4tbeyjex3i	cmm63fyc800a3rp4tlulunw58	Monthly	15	\N	[]	0	t	2026-02-28 09:03:21.759	2026-02-28 09:03:21.759
cmm63fycg00aqrp4ta3k7v8o5	cmm63fyca00a6rp4tv122und9	Yearly	55	\N	[]	0	t	2026-02-28 09:03:21.761	2026-02-28 09:03:21.761
cmm63fych00aurp4t5twfiz3v	cmm63fyc800a3rp4tlulunw58	Weekly	64	\N	[]	0	t	2026-02-28 09:03:21.761	2026-02-28 09:03:21.761
cmm63fyci00ayrp4tv7h1et5t	cmm63fyca00a6rp4tv122und9	Monthly	65	\N	[]	0	t	2026-02-28 09:03:21.762	2026-02-28 09:03:21.762
cmm63fyia00bprp4tl8axz8v9	cmm63fyi600blrp4tbrmdxkiz	Monthly	15	\N	["Access to all posts", "Direct messages", "Monthly exclusive content"]	0	t	2026-02-28 09:03:21.97	2026-02-28 09:03:21.97
cmm63fyib00brrp4t49ooumyy	cmm63fyi600blrp4tbrmdxkiz	3-Month Bundle	55	\N	["All Monthly benefits", "Priority DM responses", "Exclusive live access"]	1	t	2026-02-28 09:03:21.971	2026-02-28 09:03:21.971
cmm63fyib00btrp4tlmec2cfk	cmm63fyi600blrp4tbrmdxkiz	Yearly VIP	65	\N	["All 3-Month benefits", "Free video calls", "Custom content requests"]	2	t	2026-02-28 09:03:21.972	2026-02-28 09:03:21.972
cmm65ghdp0000rp8atf85y7mu	cmm63fxz4003arp4ti8wolkwg	Free Tier	0	Basic access to my feed & stories	["Access to free posts", "View stories", "Like & comment"]	1	t	2026-02-28 09:59:45.661	2026-02-28 09:59:45.661
cmm65ghdp0001rp8aji0kl5w9	cmm63fxz4003arp4ti8wolkwg	Silver	9.99	Unlock exclusive photos & behind-the-scenes	["All Free benefits", "Exclusive photo sets", "Behind-the-scenes content", "Direct messages"]	2	t	2026-02-28 09:59:45.661	2026-02-28 09:59:45.661
cmm65ghdp0002rp8azjlyj3dh	cmm63fxz4003arp4ti8wolkwg	Gold VIP	29.99	Full access to everything + private content	["All Silver benefits", "Private photoshoots", "Weekly live Q&A access", "Custom content requests", "Priority DM replies"]	3	t	2026-02-28 09:59:45.661	2026-02-28 09:59:45.661
cmm6df07w008jrp5uq33quzat	cmm63fxzi004erp4t158tuuka	Basic	19.99	Here you can place additional information about your package	"[\\"Public posts only\\",\\"Occasional behind-the-scenes content\\",\\"Behind the scene Content\\"]"	0	t	2026-02-28 13:42:33.693	2026-02-28 13:42:33.693
cmm6df07w008lrp5uovc58vyb	cmm63fxzi004erp4t158tuuka	Premium	29.99	Here you can place additional information about your package	"[\\"Public posts only\\",\\"Full Length Cooking Toturials\\",\\"Private Chat With me\\"]"	0	t	2026-02-28 13:42:33.693	2026-02-28 13:42:33.693
cmm6df07x008nrp5u0ukgwcwl	cmm63fxzi004erp4t158tuuka	VIP	49.98999999999999	Here you can place additional information about your package	"[\\"Public posts only\\",\\"One-to-one Video Stream\\",\\"Access to private live stream\\"]"	0	t	2026-02-28 13:42:33.693	2026-02-28 13:42:33.693
cmm6df07x008prp5uavg0pfzw	cmm63fxzj004hrp4ts8x1hphz	Basic	14.99	Here you can place additional information about your package	"[\\"Public posts only\\",\\"Occasional behind-the-scenes content\\",\\"Behind the scene Content\\"]"	0	t	2026-02-28 13:42:33.694	2026-02-28 13:42:33.694
cmm6df07x008rrp5udacjwzqb	cmm63fxzj004hrp4ts8x1hphz	Premium	24.99	Here you can place additional information about your package	"[\\"Public posts only\\",\\"Full Length Cooking Toturials\\",\\"Private Chat With me\\"]"	0	t	2026-02-28 13:42:33.694	2026-02-28 13:42:33.694
cmm6df07y008trp5uabl0k6do	cmm63fxzj004hrp4ts8x1hphz	VIP	44.99	Here you can place additional information about your package	"[\\"Public posts only\\",\\"One-to-one Video Stream\\",\\"Access to private live stream\\"]"	0	t	2026-02-28 13:42:33.694	2026-02-28 13:42:33.694
\.


--
-- Data for Name: SupportTicket; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."SupportTicket" (id, "userId", title, description, "photoUrl", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Tip; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Tip" (id, "senderId", "receiverId", amount, "postId", "messageId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Transaction" (id, "walletId", type, amount, description, "referenceId", status, "createdAt") FROM stdin;
cmm6h4pkk00dcrpktw1h0v0bt	cmm63fy5q0085rp4twy39rd97	DEPOSIT	500	Purchased 500 coins|€10.00	#11223345	COMPLETED	2026-02-26 15:26:31.796
cmm6h4pkl00derpktn1g4a6vz	cmm63fy5q0085rp4twy39rd97	DEPOSIT	500	Purchased 500 coins|€26.00	#12356667	COMPLETED	2026-01-29 15:26:31.796
cmm6h4pkl00dgrpktsoesmatd	cmm63fy5q0085rp4twy39rd97	DEPOSIT	200	Purchased 200 coins|€5.00	#12890012	COMPLETED	2026-01-14 15:26:31.796
cmm6h4pkl00dirpkt3ifqwx8a	cmm63fy5q0085rp4twy39rd97	DEPOSIT	300	Purchased 300 coins|€8.00	#13445566	COMPLETED	2025-12-30 15:26:31.796
cmm6h4pkm00dkrpkt2i9bb0qs	cmm63fy5q0085rp4twy39rd97	TIP_SENT	500	Jassica Joy|Tip	\N	COMPLETED	2026-02-26 15:26:31.796
cmm6h4pkm00dmrpkteywa769m	cmm63fy5q0085rp4twy39rd97	TIP_SENT	100	Jassica Joy|Tip	\N	COMPLETED	2026-01-29 15:26:31.796
cmm6h4pkn00dorpkts5wk1e40	cmm63fy5q0085rp4twy39rd97	SUBSCRIPTION	50	Sarah Jones|Subscription	\N	COMPLETED	2026-02-13 15:26:31.796
cmm6h4px700hzrpkt3d3tule3	cmm63fyi900bnrp4thjd38g8l	TIP_RECEIVED	25	Tip from fan123	\N	COMPLETED	2026-02-26 15:26:32.251
cmm6h4px700i1rpktfjcjxrh1	cmm63fyi900bnrp4thjd38g8l	TIP_RECEIVED	50	Tip from superfan_mike	\N	COMPLETED	2026-02-23 15:26:32.251
cmm6h4px700i3rpktr59e6o3r	cmm63fyi900bnrp4thjd38g8l	TIP_RECEIVED	15	Tip from newbie_jane	\N	COMPLETED	2026-02-20 15:26:32.251
cmm6h4px800i5rpktp0r6b5d3	cmm63fyi900bnrp4thjd38g8l	TIP_RECEIVED	100	Tip from big_spender_99	\N	COMPLETED	2026-02-16 15:26:32.251
cmm6h4px800i7rpktdc53xtcn	cmm63fyi900bnrp4thjd38g8l	TIP_RECEIVED	30	Tip from loyal_viewer	\N	COMPLETED	2026-02-13 15:26:32.251
cmm6h4px800i9rpktxky48fza	cmm63fyi900bnrp4thjd38g8l	SUBSCRIPTION	15	Subscription from fan123	\N	COMPLETED	2026-02-25 15:26:32.251
cmm6h4px800ibrpktqioq1um4	cmm63fyi900bnrp4thjd38g8l	SUBSCRIPTION	55	Subscription from premium_user	\N	COMPLETED	2026-02-18 15:26:32.251
cmm6h4px900idrpktybeuo656	cmm63fyi900bnrp4thjd38g8l	SUBSCRIPTION	15	Subscription from new_subscriber	\N	COMPLETED	2026-02-08 15:26:32.251
cmm6h4px900ifrpktlcjwgmt3	cmm63fyi900bnrp4thjd38g8l	WITHDRAWAL	-500	Withdrawal to bank account	\N	COMPLETED	2026-02-21 15:26:32.251
cmm6h4px900ihrpktzujkfqtj	cmm63fyi900bnrp4thjd38g8l	WITHDRAWAL	-200	Withdrawal to PayPal	\N	COMPLETED	2026-02-14 15:26:32.251
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."User" (id, email, username, "displayName", "passwordHash", role, status, avatar, cover, bio, location, website, "firstName", "lastName", "mobileNumber", "secondaryEmail", gender, country, category, "dateOfBirth", age, region, "profileType", "aboutMe", timezone, "socialLinks", "blockedCountries", "referralCode", "bankCountry", "bankDetails", "idDocumentUrl", "selfieUrl", "introVideoUrl", "isVerified", "statusText", "twoFactorSecret", "twoFactorEnabled", "onboardingStep", "emailVerified", "createdAt", "updatedAt", "emailVerifyToken", "notifSettings", "passwordResetExpiry", "passwordResetToken", "privacySettings") FROM stdin;
cmm63fxxg0000rp4tjjjphnms	admin@fansbook.com	admin	Fansbook Admin	$2b$12$AvALKTeCD6YvQHDzLoA9T.IpRv5FzLi0D9S6DhtzAa3xeXVkUudB.	ADMIN	ACTIVE	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	\N	\N	f	0	t	2026-02-28 09:03:21.22	2026-02-28 09:03:21.22	\N	{}	\N	\N	{}
cmm63fy5n0083rp4tigxuimhy	fan@test.com	testfan	Test Fan	$2b$12$xg/LHa.flYQ5r3ZYOwavWuWNg9IXetF9fNcwQecfHPsUV4F/NxPby	FAN	ACTIVE	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	\N	\N	f	0	t	2026-02-28 09:03:21.516	2026-02-28 09:03:21.516	\N	{}	\N	\N	{}
cmm63fxyd000xrp4twpluerek	joneymeo@fansbook.com	joneymeo	Honey Meow	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator6.webp	/icons/dashboard/story-bg-1.webp	Stand-up clips.	\N	\N	\N	\N	\N	\N	MALE	United States	Comedian	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Send me a tip	\N	f	0	t	2026-02-28 09:03:21.253	2026-02-28 15:26:31.465	\N	{}	\N	\N	{}
cmm63fxyf0012rp4tazcntitx	alexfit@fansbook.com	alexfit	Alexa Fit	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator7.webp	/icons/dashboard/story-bg-2.webp	HIIT workouts.	\N	\N	\N	\N	\N	\N	MALE	Germany	Personal Trainer	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	New content daily	\N	f	0	t	2026-02-28 09:03:21.255	2026-02-28 15:26:31.466	\N	{}	\N	\N	{}
cmm63fxyg0017rp4tsc8sjank	lunastyle@fansbook.com	lunastyle	Luna Styles	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator8.webp	/icons/dashboard/story-bg-3.webp	High fashion model.	\N	\N	\N	\N	\N	\N	FEMALE	United Kingdom	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Booking shoots	\N	f	0	t	2026-02-28 09:03:21.257	2026-02-28 15:26:31.468	\N	{}	\N	\N	{}
cmm63fxyi001crp4tomcevcuq	djmarcus@fansbook.com	djmarcus	DJ Marcella	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator9.webp	/icons/dashboard/story-bg-4.webp	Electronic music producer.	\N	\N	\N	\N	\N	\N	MALE	Canada	Musician	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Live sets every Friday	\N	f	0	t	2026-02-28 09:03:21.259	2026-02-28 15:26:31.469	\N	{}	\N	\N	{}
cmm63fxyk001hrp4tu5axt1o9	chefmaria@fansbook.com	chefmaria	Chef Mariana	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator10.webp	/icons/dashboard/story-bg-5.webp	Mediterranean cuisine.	\N	\N	\N	\N	\N	\N	FEMALE	Australia	Chef	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	New recipe dropping soon	\N	f	0	t	2026-02-28 09:03:21.26	2026-02-28 15:26:31.471	\N	{}	\N	\N	{}
cmm63fxza003prp4tjpc5uyiy	emma1@fansbook.com	emma_joens_1	Emma Rose	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/story-avatar-1.webp	\N	Lifestyle & beauty creator	\N	\N	\N	\N	\N	\N	Female	USA	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Online	\N	f	0	t	2026-02-28 09:03:21.286	2026-02-28 15:26:31.536	\N	{}	\N	\N	{}
cmm63fxzb003srp4td3k99ui9	emma2@fansbook.com	emma_joens_2	Riley James	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/story-avatar-2.webp	\N	Yoga instructor & wellness coach	\N	\N	\N	\N	\N	\N	Female	UK	Personal Trainer	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Namaste	\N	f	0	t	2026-02-28 09:03:21.288	2026-02-28 15:26:31.538	\N	{}	\N	\N	{}
cmm63fxy7000irp4tgmz2ke1e	sappie@fansbook.com	sappie	Sapphire	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator3.webp	/icons/dashboard/story-bg-3.webp	Exclusive content.	\N	\N	\N	\N	\N	\N	FEMALE	Canada	Adult Creator	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	DM's open	\N	f	0	t	2026-02-28 09:03:21.247	2026-02-28 15:26:31.459	\N	{}	\N	\N	{}
cmm63fxz6003drp4t141xl6pe	noriarose@fansbook.com	NoriaRose	Noria Rose	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator2.webp	\N	Abstract art & nude photography	\N	\N	\N	\N	\N	\N	Female	Netherlands	Artist	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Creating art	\N	f	0	t	2026-02-28 09:03:21.282	2026-02-28 09:59:45.642	\N	{}	\N	\N	{}
cmm63fxzd003yrp4tbyym15ea	emma4@fansbook.com	emma_joens_4	Ivy Storm	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/story-avatar-4.webp	\N	Alt model & content creator	\N	\N	\N	\N	\N	\N	Female	Norway	Adult Creator	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	New set uploaded	\N	f	0	t	2026-02-28 09:03:21.29	2026-02-28 15:26:31.54	\N	{}	\N	\N	{}
cmm63fxzi004erp4t158tuuka	olivia_hart@fansbook.com	olivia_hart	Olivia Hart	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator8.webp	/icons/dashboard/story-bg-2.webp	Dance queen & choreographer	\N	\N	\N	\N	\N	\N	Female	USA	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Style tips daily	\N	f	0	t	2026-02-28 09:03:21.294	2026-02-28 15:26:31.545	\N	{}	\N	\N	{}
cmm63fxzj004hrp4ts8x1hphz	chloe_reign@fansbook.com	chloe_reign	Chloe Reign	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator9.webp	/icons/dashboard/story-bg-3.webp	Dance queen & choreographer	\N	\N	\N	\N	\N	\N	Female	UK	Artist	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Dance video up	\N	f	0	t	2026-02-28 09:03:21.296	2026-02-28 15:26:31.546	\N	{}	\N	\N	{}
cmm63fxzk004krp4toewa8dbx	evilia1@fansbook.com	evilia_1	Valentina	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/model-1.webp	\N	Latin beauty & dance content 💃	\N	\N	\N	\N	\N	\N	Female	Argentina	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Online now	\N	f	0	t	2026-02-28 09:03:21.297	2026-02-28 15:26:31.547	\N	{}	\N	\N	{}
cmm63fxzm004nrp4t5tsvj8qd	evilia2@fansbook.com	evilia_2	Natasha Belle	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/model-2.webp	\N	Fitness model & bikini competitor	\N	\N	\N	\N	\N	\N	Female	Russia	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	New photos!	\N	f	0	t	2026-02-28 09:03:21.298	2026-02-28 15:26:31.549	\N	{}	\N	\N	{}
cmm63fy5r0086rp4tcz6umk4m	jimmy_fox@fansbook.com	jimmy_fox	Jamie Fox	$2b$12$xg/LHa.flYQ5r3ZYOwavWuWNg9IXetF9fNcwQecfHPsUV4F/NxPby	CREATOR	ACTIVE	/images/creators/creator9.webp	\N	Content creator & streamer	\N	\N	\N	\N	\N	\N	Female	USA	Adult Creator	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Going live soon	\N	f	0	t	2026-02-28 09:03:21.52	2026-02-28 09:59:45.658	\N	{}	\N	\N	{}
cmm63fxzc003vrp4tcn85cvxu	emma3@fansbook.com	emma_joens_3	Zara Moon	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/story-avatar-3.webp	\N	Pole dancer & fitness enthusiast	\N	\N	\N	\N	\N	\N	Female	Sweden	Personal Trainer	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Class tonight	\N	f	0	t	2026-02-28 09:03:21.289	2026-02-28 15:26:31.539	\N	{}	\N	\N	{}
cmm63fxzp004wrp4t3iqtl0lm	evilia5@fansbook.com	evilia_5	Scarlett Fox	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/model-5.webp	\N	Redhead goddess | ASMR queen 🎧	\N	\N	\N	\N	\N	\N	Female	Canada	Adult Creator	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	New ASMR posted	\N	f	0	t	2026-02-28 09:03:21.302	2026-02-28 15:26:31.551	\N	{}	\N	\N	{}
cmm63fxzr004zrp4tgb7nj925	evilia6@fansbook.com	evilia_6	Cleo Midnight	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/model-6.webp	\N	Night owl | Dark aesthetic content	\N	\N	\N	\N	\N	\N	Female	Germany	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Online late nights	\N	f	0	t	2026-02-28 09:03:21.303	2026-02-28 15:26:31.552	\N	{}	\N	\N	{}
cmm63fxy4000drp4tmz6ic0ed	kiasyap@fansbook.com	kiasyap	Kia Syap	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator2.webp	/icons/dashboard/story-bg-2.webp	Fashion model.	\N	\N	\N	\N	\N	\N	FEMALE	United Kingdom	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Available for call	\N	f	0	t	2026-02-28 09:03:21.245	2026-02-28 15:26:31.457	\N	{}	\N	\N	{}
cmm63fxzo004trp4t3rwxfunq	evilia4@fansbook.com	evilia_4	Bella Diamond	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/model-4.webp	\N	Luxury lifestyle & travel content	\N	\N	\N	\N	\N	\N	Female	Monaco	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Traveling now	\N	f	0	t	2026-02-28 09:03:21.301	2026-02-28 15:26:31.55	\N	{}	\N	\N	{}
cmm63fxz7003grp4trm4zibt9	miracosplay@fansbook.com	MiraCosplay	Mira Cosplay	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator3.webp	\N	Anime cosplayer | Costume designer	\N	\N	\N	\N	\N	\N	Female	South Korea	Artist	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Next con soon	\N	f	0	t	2026-02-28 09:03:21.283	2026-02-28 09:59:45.643	\N	{}	\N	\N	{}
cmm63fyit00derp4t2r3wme7o	referral1@fansbook.com	referral_user1	Alex Referred	$2b$12$rCaL0aVnesd3n.BV6tf2VeTEg.NgpakcbdnFxEwh9J8FG5LcnRqW.	FAN	ACTIVE	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	\N	\N	f	0	t	2026-02-28 09:03:21.99	2026-02-28 09:03:21.99	\N	{}	\N	\N	{}
cmm63fyiv00dhrp4t8urx6yal	referral2@fansbook.com	referral_user2	Jordan Referred	$2b$12$rCaL0aVnesd3n.BV6tf2VeTEg.NgpakcbdnFxEwh9J8FG5LcnRqW.	FAN	ACTIVE	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	\N	\N	f	0	t	2026-02-28 09:03:21.992	2026-02-28 09:03:21.992	\N	{}	\N	\N	{}
cmm63fxxz0008rp4tqn1g2m71	miamokala@fansbook.com	miamokala	Mia Mokala	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator1.webp	/icons/dashboard/story-bg-1.webp	Digital artist and painter.	\N	\N	\N	\N	\N	\N	FEMALE	United States	Artist	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Available now	\N	f	0	t	2026-02-28 09:03:21.239	2026-02-28 15:26:31.451	\N	{}	\N	\N	{}
cmm63fxzf0041rp4tvr2thuej	emma5@fansbook.com	emma_joens_5	Dahlia Ray	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/story-avatar-5.webp	\N	Singer & songwriter | Indie vibes	\N	\N	\N	\N	\N	\N	Female	Ireland	Musician	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	New song out	\N	f	0	t	2026-02-28 09:03:21.291	2026-02-28 15:26:31.541	\N	{}	\N	\N	{}
cmm63fy5u0089rp4t68jeguo8	sarah_jones@fansbook.com	sarah_jones	Sarah Jones	$2b$12$xg/LHa.flYQ5r3ZYOwavWuWNg9IXetF9fNcwQecfHPsUV4F/NxPby	CREATOR	ACTIVE	/images/creators/creator1.webp	\N	Photographer & visual storyteller	\N	\N	\N	\N	\N	\N	Female	USA	Artist	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Shooting today	\N	f	0	t	2026-02-28 09:03:21.523	2026-02-28 09:59:45.653	\N	{}	\N	\N	{}
cmm63fy5y008crp4tnz3updpb	robert_zak@fansbook.com	robert_zak	Roberta Zak	$2b$12$xg/LHa.flYQ5r3ZYOwavWuWNg9IXetF9fNcwQecfHPsUV4F/NxPby	CREATOR	ACTIVE	/images/creators/creator2.webp	\N	Glamour model & brand ambassador	\N	\N	\N	\N	\N	\N	Female	Poland	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Available	\N	f	0	t	2026-02-28 09:03:21.526	2026-02-28 09:59:45.654	\N	{}	\N	\N	{}
cmm63fybx009rrp4t5k7xu9xh	emma_joens@fansbook.com	emma_jones	Emma Wild	$2b$12$2f3HGhoKlyZotyxhqHyj9.prIeqyjBNd.DjYvBDezDGAse3f3VAKe	CREATOR	ACTIVE	/images/creators/creator4.webp	\N	Adventure & outdoor content	\N	\N	\N	\N	\N	\N	Female	New Zealand	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Exploring	\N	f	0	t	2026-02-28 09:03:21.742	2026-02-28 09:59:45.654	\N	{}	\N	\N	{}
cmm63fyc0009urp4tg3oo6gpb	kaly_joens@fansbook.com	kaly_joens	Kaly Quinn	$2b$12$2f3HGhoKlyZotyxhqHyj9.prIeqyjBNd.DjYvBDezDGAse3f3VAKe	CREATOR	ACTIVE	/images/creators/creator6.webp	\N	Burlesque performer & dancer	\N	\N	\N	\N	\N	\N	Female	France	Artist	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Show tonight	\N	f	0	t	2026-02-28 09:03:21.745	2026-02-28 09:59:45.655	\N	{}	\N	\N	{}
cmm63fyc3009xrp4t3748n9t1	fort_benny@fansbook.com	fort_benny	Fortuna Belle	$2b$12$2f3HGhoKlyZotyxhqHyj9.prIeqyjBNd.DjYvBDezDGAse3f3VAKe	CREATOR	ACTIVE	/images/creators/creator3.webp	\N	Pin-up model & retro vibes	\N	\N	\N	\N	\N	\N	Female	Italy	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Vintage shoot done	\N	f	0	t	2026-02-28 09:03:21.747	2026-02-28 09:59:45.656	\N	{}	\N	\N	{}
cmm63fyc500a0rp4t0qmwqz7l	fily_joens@fansbook.com	fily_joens	Filly Jones	$2b$12$2f3HGhoKlyZotyxhqHyj9.prIeqyjBNd.DjYvBDezDGAse3f3VAKe	CREATOR	ACTIVE	/images/creators/creator5.webp	\N	Swimwear model & beach lover 🏖	\N	\N	\N	\N	\N	\N	Female	Australia	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Beach day	\N	f	0	t	2026-02-28 09:03:21.75	2026-02-28 09:59:45.656	\N	{}	\N	\N	{}
cmm63fyc800a3rp4tlulunw58	jassica_joy@fansbook.com	jassica_joy	Jessica Joy	$2b$12$2f3HGhoKlyZotyxhqHyj9.prIeqyjBNd.DjYvBDezDGAse3f3VAKe	CREATOR	ACTIVE	/images/creators/creator7.webp	\N	Pilates instructor & wellness	\N	\N	\N	\N	\N	\N	Female	Canada	Personal Trainer	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Class available	\N	f	0	t	2026-02-28 09:03:21.752	2026-02-28 09:59:45.657	\N	{}	\N	\N	{}
cmm63fyca00a6rp4tv122und9	john_doe@fansbook.com	john_doe	Joanna Doe	$2b$12$2f3HGhoKlyZotyxhqHyj9.prIeqyjBNd.DjYvBDezDGAse3f3VAKe	CREATOR	ACTIVE	/images/creators/creator8.webp	\N	Professional model & influencer	\N	\N	\N	\N	\N	\N	Female	Germany	Model	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Booking open	\N	f	0	t	2026-02-28 09:03:21.754	2026-02-28 09:59:45.657	\N	{}	\N	\N	{}
cmm63fxz4003arp4ti8wolkwg	sofialove@fansbook.com	SofiaLove	Sofia Love	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator1.webp	/images/landing/hero-bg.webp	Professional glamour & boudoir model from Medellín 📸 | 200K+ followers | Subscribe for exclusive behind-the-scenes content, personal photoshoots & live Q&A sessions every Friday 💋	Miami, FL	https://sofialove.com	\N	\N	\N	\N	Female	Colombia	Model	2001-08-15 00:00:00	24	North America	PREMIUM	Hey loves! I'm Sofia, a 24-year-old Colombian model based in Miami. I started my journey as a fashion model 5 years ago and quickly fell in love with boudoir & glamour photography. My content includes professional photoshoots, workout routines, travel vlogs, and exclusive private content for my top-tier subscribers. I post new content every day and go live every Friday night! Subscribe to join my private world 🌹	America/New_York	{"twitter": "https://twitter.com/sofialove", "facebook": "https://facebook.com/sofialoveofficial", "instagram": "https://instagram.com/sofialove"}	[]	\N	\N	\N	\N	\N	\N	t	Online now 🟢	\N	f	0	t	2026-02-28 09:03:21.28	2026-02-28 09:59:45.659	\N	{}	\N	\N	{}
cmm63fxzn004qrp4tac9r6192	evilia3@fansbook.com	evilia_3	Ariana Veil	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/model-3.webp	\N	Mystery & seduction | Exclusive access	\N	\N	\N	\N	\N	\N	Female	UAE	Adult Creator	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Subscribe for more	\N	f	0	t	2026-02-28 09:03:21.299	2026-02-28 15:26:31.55	\N	{}	\N	\N	{}
cmm63fxzs0052rp4tfqiij0p6	evilia7@fansbook.com	evilia_7	Jade Phoenix	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/icons/dashboard/model-7.webp	\N	Tattoo model & body art	\N	\N	\N	\N	\N	\N	Female	Thailand	Artist	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	New ink content	\N	f	0	t	2026-02-28 09:03:21.304	2026-02-28 15:26:31.553	\N	{}	\N	\N	{}
cmm63fyi600blrp4tbrmdxkiz	creator@test.com	testcreator	Sarah Creative	$2b$12$rCaL0aVnesd3n.BV6tf2VeTEg.NgpakcbdnFxEwh9J8FG5LcnRqW.	CREATOR	ACTIVE	/icons/dashboard/user-avatar-olivia.webp	/icons/dashboard/story-bg-1.webp	Professional content creator | 🎨 Art & Lifestyle | Subscribe for exclusive content	Los Angeles, CA	\N	Sarah	Creative	\N	\N	Female	US	Creator	\N	\N	North America	Premium	Hey there! I'm Sarah, a professional content creator specializing in lifestyle, fashion, and art photography. Subscribe to get access to my exclusive behind-the-scenes content!	\N	"[{\\"platform\\":\\"Instagram\\",\\"url\\":\\"https://instagram.com/sarahcreative\\"},{\\"platform\\":\\"Twitter\\",\\"url\\":\\"https://twitter.com/sarahcreative\\"}]"	"[]"	SARAH2024	\N	\N	\N	\N	\N	t	\N	\N	f	0	t	2026-02-28 09:03:21.966	2026-02-28 15:26:32.227	\N	{}	\N	\N	{}
cmm63fxy9000nrp4tgpr7j6ob	jourty@fansbook.com	jourty	Jordan Tyler	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator4.webp	/icons/dashboard/story-bg-4.webp	Fitness coach.	\N	\N	\N	\N	\N	\N	MALE	Australia	Personal Trainer	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	f	Available for custom videos.	\N	f	0	t	2026-02-28 09:03:21.249	2026-02-28 15:26:31.46	\N	{}	\N	\N	{}
cmm63fxyb000srp4tufgce1ck	olicvia@fansbook.com	olicvia	Olivia Grace	$2b$12$0bxmDVwwx2jLUYElHP.S2eh5zVmWSnwW1RXY112YeWQeBtYKkwETO	CREATOR	ACTIVE	/images/creators/creator5.webp	/icons/dashboard/story-bg-5.webp	Watercolor & illustration.	\N	\N	\N	\N	\N	\N	FEMALE	United States	Artist	\N	\N	\N	\N	\N	\N	[]	[]	\N	\N	\N	\N	\N	\N	t	Available now	\N	f	0	t	2026-02-28 09:03:21.251	2026-02-28 15:26:31.462	\N	{}	\N	\N	{}
\.


--
-- Data for Name: UserBadge; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."UserBadge" (id, "userId", "badgeId", "earnedAt") FROM stdin;
\.


--
-- Data for Name: VideoCall; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."VideoCall" (id, "callerId", "calleeId", "vonageSessionId", status, duration, "startedAt", "endedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Wallet; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Wallet" (id, "userId", balance, "pendingBalance", "totalEarned", "totalSpent", "createdAt", "updatedAt") FROM stdin;
cmm63fxxp0002rp4trei63h2p	cmm63fxxg0000rp4tjjjphnms	0	0	0	0	2026-02-28 09:03:21.229	2026-02-28 09:03:21.229
cmm63fxy1000arp4t7mmt3eze	cmm63fxxz0008rp4tqn1g2m71	0	0	0	0	2026-02-28 09:03:21.241	2026-02-28 09:03:21.241
cmm63fxy5000frp4tv6wrlpan	cmm63fxy4000drp4tmz6ic0ed	0	0	0	0	2026-02-28 09:03:21.246	2026-02-28 09:03:21.246
cmm63fxy8000krp4t9xi8or9p	cmm63fxy7000irp4tgmz2ke1e	0	0	0	0	2026-02-28 09:03:21.248	2026-02-28 09:03:21.248
cmm63fxya000prp4tmd32yj8e	cmm63fxy9000nrp4tgpr7j6ob	0	0	0	0	2026-02-28 09:03:21.25	2026-02-28 09:03:21.25
cmm63fxyc000urp4tia1lhsrb	cmm63fxyb000srp4tufgce1ck	0	0	0	0	2026-02-28 09:03:21.252	2026-02-28 09:03:21.252
cmm63fxyd000zrp4tm74tc92n	cmm63fxyd000xrp4twpluerek	0	0	0	0	2026-02-28 09:03:21.254	2026-02-28 09:03:21.254
cmm63fxyf0014rp4tvgfw4i0i	cmm63fxyf0012rp4tazcntitx	0	0	0	0	2026-02-28 09:03:21.256	2026-02-28 09:03:21.256
cmm63fxyh0019rp4tseg0rqbc	cmm63fxyg0017rp4tsc8sjank	0	0	0	0	2026-02-28 09:03:21.257	2026-02-28 09:03:21.257
cmm63fxyj001erp4tuvk0dwc6	cmm63fxyi001crp4tomcevcuq	0	0	0	0	2026-02-28 09:03:21.259	2026-02-28 09:03:21.259
cmm63fxyk001jrp4t8p96crke	cmm63fxyk001hrp4tu5axt1o9	0	0	0	0	2026-02-28 09:03:21.261	2026-02-28 09:03:21.261
cmm63fxz5003crp4tp9bs7cjb	cmm63fxz4003arp4ti8wolkwg	0	0	0	0	2026-02-28 09:03:21.281	2026-02-28 09:03:21.281
cmm63fxz6003frp4tg5ly113r	cmm63fxz6003drp4t141xl6pe	0	0	0	0	2026-02-28 09:03:21.283	2026-02-28 09:03:21.283
cmm63fxz8003irp4tfakbvd37	cmm63fxz7003grp4trm4zibt9	0	0	0	0	2026-02-28 09:03:21.284	2026-02-28 09:03:21.284
cmm63fxza003rrp4tkrhccld0	cmm63fxza003prp4tjpc5uyiy	0	0	0	0	2026-02-28 09:03:21.287	2026-02-28 09:03:21.287
cmm63fxzc003urp4t8dd0ion5	cmm63fxzb003srp4td3k99ui9	0	0	0	0	2026-02-28 09:03:21.288	2026-02-28 09:03:21.288
cmm63fxzd003xrp4tjm5gqp3w	cmm63fxzc003vrp4tcn85cvxu	0	0	0	0	2026-02-28 09:03:21.289	2026-02-28 09:03:21.289
cmm63fxze0040rp4tjp7v5bf0	cmm63fxzd003yrp4tbyym15ea	0	0	0	0	2026-02-28 09:03:21.29	2026-02-28 09:03:21.29
cmm63fxzf0043rp4tp7yn84rv	cmm63fxzf0041rp4tvr2thuej	0	0	0	0	2026-02-28 09:03:21.292	2026-02-28 09:03:21.292
cmm63fxzi004grp4tprdv2pt4	cmm63fxzi004erp4t158tuuka	0	0	0	0	2026-02-28 09:03:21.295	2026-02-28 09:03:21.295
cmm63fxzk004jrp4t4gl61tuv	cmm63fxzj004hrp4ts8x1hphz	0	0	0	0	2026-02-28 09:03:21.296	2026-02-28 09:03:21.296
cmm63fxzl004mrp4tizz9x1ay	cmm63fxzk004krp4toewa8dbx	0	0	0	0	2026-02-28 09:03:21.297	2026-02-28 09:03:21.297
cmm63fxzm004prp4tpxyqkbda	cmm63fxzm004nrp4t5tsvj8qd	0	0	0	0	2026-02-28 09:03:21.299	2026-02-28 09:03:21.299
cmm63fxzo004srp4t52s9dsy3	cmm63fxzn004qrp4tac9r6192	0	0	0	0	2026-02-28 09:03:21.3	2026-02-28 09:03:21.3
cmm63fxzp004vrp4tio6tm5gp	cmm63fxzo004trp4t3rwxfunq	0	0	0	0	2026-02-28 09:03:21.301	2026-02-28 09:03:21.301
cmm63fxzq004yrp4tjkc6grhe	cmm63fxzp004wrp4t3iqtl0lm	0	0	0	0	2026-02-28 09:03:21.302	2026-02-28 09:03:21.302
cmm63fxzr0051rp4t70kia7a6	cmm63fxzr004zrp4tgb7nj925	0	0	0	0	2026-02-28 09:03:21.304	2026-02-28 09:03:21.304
cmm63fxzs0054rp4tvse1vhgj	cmm63fxzs0052rp4tfqiij0p6	0	0	0	0	2026-02-28 09:03:21.305	2026-02-28 09:03:21.305
cmm63fy5t0088rp4t440zv71a	cmm63fy5r0086rp4tcz6umk4m	0	0	0	0	2026-02-28 09:03:21.521	2026-02-28 09:03:21.521
cmm63fy5w008brp4txgtwen78	cmm63fy5u0089rp4t68jeguo8	0	0	0	0	2026-02-28 09:03:21.525	2026-02-28 09:03:21.525
cmm63fy5z008erp4tr3jyanja	cmm63fy5y008crp4tnz3updpb	0	0	0	0	2026-02-28 09:03:21.527	2026-02-28 09:03:21.527
cmm63fybz009trp4tw4agpiv8	cmm63fybx009rrp4t5k7xu9xh	0	0	0	0	2026-02-28 09:03:21.744	2026-02-28 09:03:21.744
cmm63fyc2009wrp4tk1x6cxje	cmm63fyc0009urp4tg3oo6gpb	0	0	0	0	2026-02-28 09:03:21.746	2026-02-28 09:03:21.746
cmm63fyc4009zrp4twn68ux2g	cmm63fyc3009xrp4t3748n9t1	0	0	0	0	2026-02-28 09:03:21.749	2026-02-28 09:03:21.749
cmm63fyc700a2rp4te3u8rpup	cmm63fyc500a0rp4t0qmwqz7l	0	0	0	0	2026-02-28 09:03:21.751	2026-02-28 09:03:21.751
cmm63fyc900a5rp4t061betd6	cmm63fyc800a3rp4tlulunw58	0	0	0	0	2026-02-28 09:03:21.753	2026-02-28 09:03:21.753
cmm63fyca00a8rp4tyqzjjszs	cmm63fyca00a6rp4tv122und9	0	0	0	0	2026-02-28 09:03:21.755	2026-02-28 09:03:21.755
cmm63fyiu00dgrp4tlja4v232	cmm63fyit00derp4t2r3wme7o	0	0	0	0	2026-02-28 09:03:21.991	2026-02-28 09:03:21.991
cmm63fyiw00djrp4t0knuqt3k	cmm63fyiv00dhrp4t8urx6yal	0	0	0	0	2026-02-28 09:03:21.992	2026-02-28 09:03:21.992
cmm63fy5q0085rp4twy39rd97	cmm63fy5n0083rp4tigxuimhy	350	0	1000	650	2026-02-28 09:03:21.518	2026-02-28 15:26:31.794
cmm63fyi900bnrp4thjd38g8l	cmm63fyi600blrp4tbrmdxkiz	2450	350	8750	0	2026-02-28 09:03:21.969	2026-02-28 15:26:32.23
\.


--
-- Data for Name: Withdrawal; Type: TABLE DATA; Schema: public; Owner: aqsa
--

COPY public."Withdrawal" (id, "creatorId", amount, "paymentMethod", status, "processedAt", "rejectionReason", "createdAt", "updatedAt") FROM stdin;
cmm6h4pxa00ijrpkthia0msne	cmm63fyi600blrp4tbrmdxkiz	500	Bank Transfer	COMPLETED	2026-02-21 15:26:32.254	\N	2026-02-18 15:26:32.254	2026-02-28 15:26:32.255
cmm6h4pxb00ilrpktvidokwdq	cmm63fyi600blrp4tbrmdxkiz	200	Bank Transfer	PENDING	\N	\N	2026-02-26 15:26:32.254	2026-02-28 15:26:32.255
cmm6h4pxb00inrpktt5718jtr	cmm63fyi600blrp4tbrmdxkiz	350	PayPal	PROCESSING	\N	\N	2026-02-27 15:26:32.254	2026-02-28 15:26:32.255
\.


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Badge Badge_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Badge"
    ADD CONSTRAINT "Badge_pkey" PRIMARY KEY (id);


--
-- Name: Bid Bid_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Bid"
    ADD CONSTRAINT "Bid_pkey" PRIMARY KEY (id);


--
-- Name: Block Block_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "Block_pkey" PRIMARY KEY (id);


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: Bookmark Bookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_pkey" PRIMARY KEY (id);


--
-- Name: CommentLike CommentLike_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Conversation Conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY (id);


--
-- Name: Faq Faq_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Faq"
    ADD CONSTRAINT "Faq_pkey" PRIMARY KEY (id);


--
-- Name: Follow Follow_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_pkey" PRIMARY KEY (id);


--
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- Name: LiveSession LiveSession_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."LiveSession"
    ADD CONSTRAINT "LiveSession_pkey" PRIMARY KEY (id);


--
-- Name: MarketplaceListing MarketplaceListing_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."MarketplaceListing"
    ADD CONSTRAINT "MarketplaceListing_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: NotificationPreference NotificationPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."NotificationPreference"
    ADD CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OtpCode OtpCode_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."OtpCode"
    ADD CONSTRAINT "OtpCode_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PostMedia PostMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."PostMedia"
    ADD CONSTRAINT "PostMedia_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: PpvPurchase PpvPurchase_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."PpvPurchase"
    ADD CONSTRAINT "PpvPurchase_pkey" PRIMARY KEY (id);


--
-- Name: Referral Referral_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_pkey" PRIMARY KEY (id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- Name: Report Report_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: StoryView StoryView_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."StoryView"
    ADD CONSTRAINT "StoryView_pkey" PRIMARY KEY (id);


--
-- Name: Story Story_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Story"
    ADD CONSTRAINT "Story_pkey" PRIMARY KEY (id);


--
-- Name: SubscriptionTier SubscriptionTier_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."SubscriptionTier"
    ADD CONSTRAINT "SubscriptionTier_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: SupportTicket SupportTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_pkey" PRIMARY KEY (id);


--
-- Name: Tip Tip_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Tip"
    ADD CONSTRAINT "Tip_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: UserBadge UserBadge_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VideoCall VideoCall_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."VideoCall"
    ADD CONSTRAINT "VideoCall_pkey" PRIMARY KEY (id);


--
-- Name: Wallet Wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY (id);


--
-- Name: Withdrawal Withdrawal_pkey; Type: CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Withdrawal"
    ADD CONSTRAINT "Withdrawal_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog_action_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "AuditLog_action_idx" ON public."AuditLog" USING btree (action);


--
-- Name: AuditLog_adminId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "AuditLog_adminId_idx" ON public."AuditLog" USING btree ("adminId");


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: Badge_name_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "Badge_name_key" ON public."Badge" USING btree (name);


--
-- Name: Bid_bidderId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Bid_bidderId_idx" ON public."Bid" USING btree ("bidderId");


--
-- Name: Bid_listingId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Bid_listingId_idx" ON public."Bid" USING btree ("listingId");


--
-- Name: Block_blockedId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Block_blockedId_idx" ON public."Block" USING btree ("blockedId");


--
-- Name: Block_blockerId_blockedId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "Block_blockerId_blockedId_key" ON public."Block" USING btree ("blockerId", "blockedId");


--
-- Name: Block_blockerId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Block_blockerId_idx" ON public."Block" USING btree ("blockerId");


--
-- Name: Booking_creatorId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Booking_creatorId_idx" ON public."Booking" USING btree ("creatorId");


--
-- Name: Booking_fanId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Booking_fanId_idx" ON public."Booking" USING btree ("fanId");


--
-- Name: Booking_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Booking_status_idx" ON public."Booking" USING btree (status);


--
-- Name: Bookmark_postId_userId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "Bookmark_postId_userId_key" ON public."Bookmark" USING btree ("postId", "userId");


--
-- Name: Bookmark_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Bookmark_userId_idx" ON public."Bookmark" USING btree ("userId");


--
-- Name: CommentLike_commentId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "CommentLike_commentId_idx" ON public."CommentLike" USING btree ("commentId");


--
-- Name: CommentLike_commentId_userId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "CommentLike_commentId_userId_key" ON public."CommentLike" USING btree ("commentId", "userId");


--
-- Name: CommentLike_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "CommentLike_userId_idx" ON public."CommentLike" USING btree ("userId");


--
-- Name: Comment_authorId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Comment_authorId_idx" ON public."Comment" USING btree ("authorId");


--
-- Name: Comment_parentId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Comment_parentId_idx" ON public."Comment" USING btree ("parentId");


--
-- Name: Comment_postId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Comment_postId_idx" ON public."Comment" USING btree ("postId");


--
-- Name: Conversation_lastMessageAt_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Conversation_lastMessageAt_idx" ON public."Conversation" USING btree ("lastMessageAt");


--
-- Name: Conversation_participant1Id_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Conversation_participant1Id_idx" ON public."Conversation" USING btree ("participant1Id");


--
-- Name: Conversation_participant1Id_participant2Id_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "Conversation_participant1Id_participant2Id_key" ON public."Conversation" USING btree ("participant1Id", "participant2Id");


--
-- Name: Conversation_participant2Id_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Conversation_participant2Id_idx" ON public."Conversation" USING btree ("participant2Id");


--
-- Name: Follow_followerId_followingId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON public."Follow" USING btree ("followerId", "followingId");


--
-- Name: Follow_followerId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Follow_followerId_idx" ON public."Follow" USING btree ("followerId");


--
-- Name: Follow_followingId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Follow_followingId_idx" ON public."Follow" USING btree ("followingId");


--
-- Name: Like_postId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Like_postId_idx" ON public."Like" USING btree ("postId");


--
-- Name: Like_postId_userId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "Like_postId_userId_key" ON public."Like" USING btree ("postId", "userId");


--
-- Name: Like_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Like_userId_idx" ON public."Like" USING btree ("userId");


--
-- Name: LiveSession_creatorId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "LiveSession_creatorId_idx" ON public."LiveSession" USING btree ("creatorId");


--
-- Name: LiveSession_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "LiveSession_status_idx" ON public."LiveSession" USING btree (status);


--
-- Name: LiveSession_streamKey_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "LiveSession_streamKey_key" ON public."LiveSession" USING btree ("streamKey");


--
-- Name: MarketplaceListing_category_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "MarketplaceListing_category_idx" ON public."MarketplaceListing" USING btree (category);


--
-- Name: MarketplaceListing_sellerId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "MarketplaceListing_sellerId_idx" ON public."MarketplaceListing" USING btree ("sellerId");


--
-- Name: MarketplaceListing_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "MarketplaceListing_status_idx" ON public."MarketplaceListing" USING btree (status);


--
-- Name: Message_conversationId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Message_conversationId_idx" ON public."Message" USING btree ("conversationId");


--
-- Name: Message_createdAt_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Message_createdAt_idx" ON public."Message" USING btree ("createdAt");


--
-- Name: Message_senderId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Message_senderId_idx" ON public."Message" USING btree ("senderId");


--
-- Name: NotificationPreference_userId_type_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "NotificationPreference_userId_type_key" ON public."NotificationPreference" USING btree ("userId", type);


--
-- Name: Notification_createdAt_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Notification_createdAt_idx" ON public."Notification" USING btree ("createdAt");


--
-- Name: Notification_read_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Notification_read_idx" ON public."Notification" USING btree (read);


--
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- Name: OtpCode_code_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "OtpCode_code_idx" ON public."OtpCode" USING btree (code);


--
-- Name: OtpCode_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "OtpCode_userId_idx" ON public."OtpCode" USING btree ("userId");


--
-- Name: Payment_gateway_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Payment_gateway_idx" ON public."Payment" USING btree (gateway);


--
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- Name: Payment_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Payment_userId_idx" ON public."Payment" USING btree ("userId");


--
-- Name: PostMedia_postId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "PostMedia_postId_idx" ON public."PostMedia" USING btree ("postId");


--
-- Name: Post_authorId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Post_authorId_idx" ON public."Post" USING btree ("authorId");


--
-- Name: Post_createdAt_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Post_createdAt_idx" ON public."Post" USING btree ("createdAt");


--
-- Name: Post_visibility_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Post_visibility_idx" ON public."Post" USING btree (visibility);


--
-- Name: PpvPurchase_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "PpvPurchase_userId_idx" ON public."PpvPurchase" USING btree ("userId");


--
-- Name: PpvPurchase_userId_postId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "PpvPurchase_userId_postId_key" ON public."PpvPurchase" USING btree ("userId", "postId");


--
-- Name: Referral_referredId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Referral_referredId_idx" ON public."Referral" USING btree ("referredId");


--
-- Name: Referral_referrerId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Referral_referrerId_idx" ON public."Referral" USING btree ("referrerId");


--
-- Name: Referral_referrerId_referredId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "Referral_referrerId_referredId_key" ON public."Referral" USING btree ("referrerId", "referredId");


--
-- Name: RefreshToken_token_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "RefreshToken_token_idx" ON public."RefreshToken" USING btree (token);


--
-- Name: RefreshToken_token_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "RefreshToken_token_key" ON public."RefreshToken" USING btree (token);


--
-- Name: RefreshToken_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "RefreshToken_userId_idx" ON public."RefreshToken" USING btree ("userId");


--
-- Name: Report_reporterId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Report_reporterId_idx" ON public."Report" USING btree ("reporterId");


--
-- Name: Report_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Report_status_idx" ON public."Report" USING btree (status);


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: StoryView_storyId_viewerId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "StoryView_storyId_viewerId_key" ON public."StoryView" USING btree ("storyId", "viewerId");


--
-- Name: Story_authorId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Story_authorId_idx" ON public."Story" USING btree ("authorId");


--
-- Name: Story_expiresAt_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Story_expiresAt_idx" ON public."Story" USING btree ("expiresAt");


--
-- Name: SubscriptionTier_creatorId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "SubscriptionTier_creatorId_idx" ON public."SubscriptionTier" USING btree ("creatorId");


--
-- Name: Subscription_creatorId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Subscription_creatorId_idx" ON public."Subscription" USING btree ("creatorId");


--
-- Name: Subscription_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Subscription_status_idx" ON public."Subscription" USING btree (status);


--
-- Name: Subscription_subscriberId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Subscription_subscriberId_idx" ON public."Subscription" USING btree ("subscriberId");


--
-- Name: Tip_receiverId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Tip_receiverId_idx" ON public."Tip" USING btree ("receiverId");


--
-- Name: Tip_senderId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Tip_senderId_idx" ON public."Tip" USING btree ("senderId");


--
-- Name: Transaction_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Transaction_status_idx" ON public."Transaction" USING btree (status);


--
-- Name: Transaction_type_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Transaction_type_idx" ON public."Transaction" USING btree (type);


--
-- Name: Transaction_walletId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Transaction_walletId_idx" ON public."Transaction" USING btree ("walletId");


--
-- Name: UserBadge_userId_badgeId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON public."UserBadge" USING btree ("userId", "badgeId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_referralCode_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "User_referralCode_key" ON public."User" USING btree ("referralCode");


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: User_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "User_status_idx" ON public."User" USING btree (status);


--
-- Name: User_username_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "User_username_idx" ON public."User" USING btree (username);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: VideoCall_calleeId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "VideoCall_calleeId_idx" ON public."VideoCall" USING btree ("calleeId");


--
-- Name: VideoCall_callerId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "VideoCall_callerId_idx" ON public."VideoCall" USING btree ("callerId");


--
-- Name: Wallet_userId_key; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE UNIQUE INDEX "Wallet_userId_key" ON public."Wallet" USING btree ("userId");


--
-- Name: Withdrawal_creatorId_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Withdrawal_creatorId_idx" ON public."Withdrawal" USING btree ("creatorId");


--
-- Name: Withdrawal_status_idx; Type: INDEX; Schema: public; Owner: aqsa
--

CREATE INDEX "Withdrawal_status_idx" ON public."Withdrawal" USING btree (status);


--
-- Name: AuditLog AuditLog_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Bid Bid_bidderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Bid"
    ADD CONSTRAINT "Bid_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Bid Bid_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Bid"
    ADD CONSTRAINT "Bid_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."MarketplaceListing"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Block Block_blockedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "Block_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Block Block_blockerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "Block_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Booking Booking_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Booking Booking_fanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Bookmark Bookmark_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Bookmark Bookmark_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommentLike CommentLike_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommentLike CommentLike_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Conversation Conversation_participant1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Conversation Conversation_participant2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follow Follow_followerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follow Follow_followingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Like Like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Like Like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LiveSession LiveSession_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."LiveSession"
    ADD CONSTRAINT "LiveSession_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MarketplaceListing MarketplaceListing_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."MarketplaceListing"
    ADD CONSTRAINT "MarketplaceListing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NotificationPreference NotificationPreference_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."NotificationPreference"
    ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OtpCode OtpCode_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."OtpCode"
    ADD CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payment Payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostMedia PostMedia_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."PostMedia"
    ADD CONSTRAINT "PostMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PpvPurchase PpvPurchase_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."PpvPurchase"
    ADD CONSTRAINT "PpvPurchase_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PpvPurchase PpvPurchase_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."PpvPurchase"
    ADD CONSTRAINT "PpvPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Referral Referral_referredId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Referral Referral_referrerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RefreshToken RefreshToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Report Report_reportedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Report Report_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StoryView StoryView_storyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."StoryView"
    ADD CONSTRAINT "StoryView_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES public."Story"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StoryView StoryView_viewerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."StoryView"
    ADD CONSTRAINT "StoryView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Story Story_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Story"
    ADD CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SubscriptionTier SubscriptionTier_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."SubscriptionTier"
    ADD CONSTRAINT "SubscriptionTier_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subscription Subscription_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subscription Subscription_subscriberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subscription Subscription_tierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES public."SubscriptionTier"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SupportTicket SupportTicket_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tip Tip_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Tip"
    ADD CONSTRAINT "Tip_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tip Tip_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Tip"
    ADD CONSTRAINT "Tip_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tip Tip_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Tip"
    ADD CONSTRAINT "Tip_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tip Tip_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Tip"
    ADD CONSTRAINT "Tip_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transaction Transaction_walletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES public."Wallet"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserBadge UserBadge_badgeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES public."Badge"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserBadge UserBadge_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VideoCall VideoCall_calleeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."VideoCall"
    ADD CONSTRAINT "VideoCall_calleeId_fkey" FOREIGN KEY ("calleeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VideoCall VideoCall_callerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."VideoCall"
    ADD CONSTRAINT "VideoCall_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Wallet Wallet_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Withdrawal Withdrawal_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aqsa
--

ALTER TABLE ONLY public."Withdrawal"
    ADD CONSTRAINT "Withdrawal_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: aqsa
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict zHYzQtov3kH66c6czD2SUDrJQrBEVoJgfE1RsJyupheIi4bTnsFboeXnf21sK1r

