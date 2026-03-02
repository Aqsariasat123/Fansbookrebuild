# API Reference

Base URL: `/api`

All endpoints return JSON. Authenticated endpoints require a `Bearer <token>` header unless noted otherwise.

Interactive Swagger docs: `/api/docs` (when the server is running).

---

## Health

| Method | Path      | Auth | Description         |
| ------ | --------- | ---- | ------------------- |
| GET    | `/health` | No   | Server health check |

---

## Auth

| Method | Path                    | Auth   | Description                             |
| ------ | ----------------------- | ------ | --------------------------------------- |
| POST   | `/auth/register`        | No     | Register a new user                     |
| POST   | `/auth/login`           | No     | Login (returns access + refresh tokens) |
| POST   | `/auth/refresh`         | Cookie | Refresh the access token                |
| POST   | `/auth/logout`          | Yes    | Invalidate the refresh token            |
| GET    | `/auth/me`              | Yes    | Get current user profile                |
| POST   | `/auth/forgot-password` | No     | Request password reset email            |
| POST   | `/auth/reset-password`  | No     | Reset password with token               |
| POST   | `/auth/become-creator`  | Yes    | Upgrade fan account to creator          |

### Two-Factor Authentication

| Method | Path                 | Auth | Description                     |
| ------ | -------------------- | ---- | ------------------------------- |
| POST   | `/auth/2fa/enable`   | Yes  | Generate 2FA secret and QR code |
| POST   | `/auth/2fa/verify`   | Yes  | Verify and activate 2FA         |
| POST   | `/auth/2fa/disable`  | Yes  | Disable 2FA                     |
| POST   | `/auth/2fa/validate` | No   | Validate 2FA token during login |

---

## Feed

| Method | Path                   | Auth | Description                |
| ------ | ---------------------- | ---- | -------------------------- |
| GET    | `/feed`                | Yes  | Get paginated feed posts   |
| GET    | `/feed/stories`        | Yes  | Get active stories         |
| GET    | `/feed/popular-models` | Yes  | Get popular model creators |

---

## Posts

| Method | Path                  | Auth | Description                |
| ------ | --------------------- | ---- | -------------------------- |
| GET    | `/posts`              | Yes  | List posts (paginated)     |
| POST   | `/posts`              | Yes  | Create a new post          |
| GET    | `/posts/:id`          | Yes  | Get single post            |
| PUT    | `/posts/:id`          | Yes  | Update a post              |
| DELETE | `/posts/:id`          | Yes  | Delete a post              |
| POST   | `/posts/:id/like`     | Yes  | Like/unlike a post         |
| POST   | `/posts/:id/comment`  | Yes  | Add a comment              |
| GET    | `/posts/:id/comments` | Yes  | List comments              |
| POST   | `/posts/:id/bookmark` | Yes  | Bookmark/unbookmark a post |
| GET    | `/posts/bookmarks`    | Yes  | List bookmarked posts      |
| POST   | `/posts/:id/share`    | Yes  | Share a post               |
| POST   | `/posts/:id/report`   | Yes  | Report a post              |
| POST   | `/posts/:id/purchase` | Yes  | Purchase pay-per-view post |

---

## Stories

| Method | Path                    | Auth | Description          |
| ------ | ----------------------- | ---- | -------------------- |
| GET    | `/stories`              | Yes  | Get stories feed     |
| POST   | `/stories`              | Yes  | Create a story       |
| DELETE | `/stories/:id`          | Yes  | Delete a story       |
| POST   | `/stories/:id/view`     | Yes  | Mark story as viewed |
| GET    | `/story-highlights`     | Yes  | List highlights      |
| POST   | `/story-highlights`     | Yes  | Create a highlight   |
| PUT    | `/story-highlights/:id` | Yes  | Update a highlight   |
| DELETE | `/story-highlights/:id` | Yes  | Delete a highlight   |

---

## Profile

| Method | Path                       | Auth | Description            |
| ------ | -------------------------- | ---- | ---------------------- |
| GET    | `/profile`                 | Yes  | Get own profile        |
| PUT    | `/profile`                 | Yes  | Update profile fields  |
| PUT    | `/profile/avatar`          | Yes  | Upload avatar          |
| PUT    | `/profile/cover`           | Yes  | Upload cover image     |
| PUT    | `/profile/change-password` | Yes  | Change password        |
| GET    | `/profile/onboarding`      | Yes  | Get onboarding status  |
| PUT    | `/profile/onboarding`      | Yes  | Update onboarding step |

---

## Creator Profile (Public)

| Method | Path                               | Auth | Description                |
| ------ | ---------------------------------- | ---- | -------------------------- |
| GET    | `/creator-profile/:username`       | Yes  | Get creator public profile |
| GET    | `/creator-profile/:username/posts` | Yes  | Get creator's posts        |

---

## Creator Settings (Creator Only)

| Method | Path                                 | Auth    | Description              |
| ------ | ------------------------------------ | ------- | ------------------------ |
| PUT    | `/creator/profile/basic`             | Creator | Update basic info        |
| PUT    | `/creator/profile/stats`             | Creator | Update stats/details     |
| PUT    | `/creator/profile/social-links`      | Creator | Update social links      |
| PUT    | `/creator/profile/bank`              | Creator | Update bank details      |
| PUT    | `/creator/profile/blocked-countries` | Creator | Update blocked countries |
| PUT    | `/creator/profile/deactivate`        | Creator | Deactivate account       |

---

## Creator Dashboard

| Method | Path                                 | Auth    | Description              |
| ------ | ------------------------------------ | ------- | ------------------------ |
| GET    | `/creator/dashboard/stats`           | Creator | Dashboard overview stats |
| GET    | `/creator/dashboard/recent-activity` | Creator | Recent activity feed     |

---

## Creator Wallet

| Method | Path                          | Auth    | Description             |
| ------ | ----------------------------- | ------- | ----------------------- |
| GET    | `/creator/wallet/balance`     | Creator | Get wallet balance      |
| GET    | `/creator/wallet/withdrawals` | Creator | List withdrawal history |
| POST   | `/creator/wallet/withdraw`    | Creator | Request a withdrawal    |

---

## Creator Earnings

| Method | Path                | Auth    | Description                              |
| ------ | ------------------- | ------- | ---------------------------------------- |
| GET    | `/creator/earnings` | Creator | Earnings list (filterable by date, type) |

---

## Creator Subscription Tiers

| Method | Path                 | Auth    | Description             |
| ------ | -------------------- | ------- | ----------------------- |
| GET    | `/creator/tiers`     | Creator | List subscription tiers |
| POST   | `/creator/tiers`     | Creator | Create a tier           |
| PUT    | `/creator/tiers/:id` | Creator | Update a tier           |
| DELETE | `/creator/tiers/:id` | Creator | Delete a tier           |

---

## Creator Bookings

| Method | Path                           | Auth    | Description                          |
| ------ | ------------------------------ | ------- | ------------------------------------ |
| GET    | `/creator/bookings`            | Creator | List bookings (filterable by status) |
| PUT    | `/creator/bookings/:id/status` | Creator | Accept/reject a booking              |

---

## Creator Referrals

| Method | Path                      | Auth    | Description           |
| ------ | ------------------------- | ------- | --------------------- |
| GET    | `/creator/referrals`      | Creator | List referral history |
| GET    | `/creator/referrals/code` | Creator | Get referral code     |

---

## Fan Wallet

| Method | Path                   | Auth | Description        |
| ------ | ---------------------- | ---- | ------------------ |
| GET    | `/wallet/balance`      | Yes  | Get wallet balance |
| POST   | `/wallet/deposit`      | Yes  | Add funds          |
| GET    | `/wallet/transactions` | Yes  | List transactions  |

---

## Subscriptions

| Method | Path                 | Auth | Description               |
| ------ | -------------------- | ---- | ------------------------- |
| GET    | `/subscriptions`     | Yes  | List active subscriptions |
| POST   | `/subscriptions`     | Yes  | Subscribe to a creator    |
| DELETE | `/subscriptions/:id` | Yes  | Cancel subscription       |

---

## Tips

| Method | Path    | Auth | Description             |
| ------ | ------- | ---- | ----------------------- |
| POST   | `/tips` | Yes  | Send a tip to a creator |

---

## Payments

| Method | Path                       | Auth | Description             |
| ------ | -------------------------- | ---- | ----------------------- |
| POST   | `/payments/create-intent`  | Yes  | Create a payment intent |
| GET    | `/payments/methods`        | Yes  | List payment methods    |
| POST   | `/payments/webhook/stripe` | No   | Stripe webhook handler  |

---

## Messages

| Method | Path                      | Auth | Description                    |
| ------ | ------------------------- | ---- | ------------------------------ |
| GET    | `/messages/conversations` | Yes  | List conversations             |
| GET    | `/messages/:id`           | Yes  | Get messages in a conversation |
| POST   | `/messages/:id`           | Yes  | Send a message                 |
| PUT    | `/messages/:id/read`      | Yes  | Mark messages as read          |

---

## Followers / Social

| Method | Path                           | Auth | Description               |
| ------ | ------------------------------ | ---- | ------------------------- |
| POST   | `/followers/:userId/follow`    | Yes  | Follow a user             |
| DELETE | `/followers/:userId/unfollow`  | Yes  | Unfollow a user           |
| GET    | `/followers/:userId/followers` | Yes  | List followers            |
| GET    | `/followers/:userId/following` | Yes  | List following            |
| GET    | `/social/suggestions`          | Yes  | Suggested users to follow |

---

## Notifications

| Method | Path                          | Auth | Description               |
| ------ | ----------------------------- | ---- | ------------------------- |
| GET    | `/notifications`              | Yes  | List notifications        |
| PUT    | `/notifications/:id/read`     | Yes  | Mark as read              |
| PUT    | `/notifications/read-all`     | Yes  | Mark all as read          |
| GET    | `/notifications/unread-count` | Yes  | Unread notification count |

---

## Search

| Method | Path                | Auth | Description                   |
| ------ | ------------------- | ---- | ----------------------------- |
| GET    | `/search?q=<query>` | Yes  | Search users, posts, hashtags |

---

## Hashtags

| Method | Path                   | Auth | Description       |
| ------ | ---------------------- | ---- | ----------------- |
| GET    | `/hashtags/trending`   | Yes  | Trending hashtags |
| GET    | `/hashtags/:tag/posts` | Yes  | Posts by hashtag  |

---

## Live Streams

| Method | Path          | Auth    | Description              |
| ------ | ------------- | ------- | ------------------------ |
| GET    | `/live`       | Yes     | List active live streams |
| POST   | `/live/start` | Creator | Start a live stream      |
| POST   | `/live/stop`  | Creator | Stop a live stream       |
| GET    | `/live/:id`   | Yes     | Get stream details       |

---

## Marketplace

| Method | Path                              | Auth    | Description               |
| ------ | --------------------------------- | ------- | ------------------------- |
| GET    | `/marketplace`                    | Yes     | List marketplace items    |
| POST   | `/marketplace`                    | Creator | Create a listing          |
| GET    | `/marketplace/:id`                | Yes     | Get listing details       |
| PUT    | `/marketplace/:id`                | Creator | Update a listing          |
| DELETE | `/marketplace/:id`                | Creator | Delete a listing          |
| POST   | `/marketplace/:id/purchase`       | Yes     | Purchase a listing        |
| GET    | `/marketplace-reviews/:listingId` | Yes     | Get reviews for a listing |
| POST   | `/marketplace-reviews/:listingId` | Yes     | Leave a review            |

---

## Leaderboard / Gamification

| Method | Path           | Auth | Description              |
| ------ | -------------- | ---- | ------------------------ |
| GET    | `/leaderboard` | Yes  | Get leaderboard rankings |
| GET    | `/badges`      | Yes  | List available badges    |
| GET    | `/badges/mine` | Yes  | Get user's earned badges |

---

## Uploads

| Method | Path             | Auth | Description     |
| ------ | ---------------- | ---- | --------------- |
| POST   | `/uploads/image` | Yes  | Upload an image |
| POST   | `/uploads/video` | Yes  | Upload a video  |

---

## Settings

| Method | Path                | Auth | Description             |
| ------ | ------------------- | ---- | ----------------------- |
| GET    | `/settings`         | Yes  | Get user settings       |
| PUT    | `/settings`         | Yes  | Update user settings    |
| GET    | `/settings/privacy` | Yes  | Get privacy settings    |
| PUT    | `/settings/privacy` | Yes  | Update privacy settings |

---

## Support

| Method | Path               | Auth | Description             |
| ------ | ------------------ | ---- | ----------------------- |
| POST   | `/support/ticket`  | Yes  | Create a support ticket |
| GET    | `/support/tickets` | Yes  | List user's tickets     |

---

## Contact

| Method | Path       | Auth | Description         |
| ------ | ---------- | ---- | ------------------- |
| POST   | `/contact` | No   | Submit contact form |

---

## Announcements

| Method | Path             | Auth | Description        |
| ------ | ---------------- | ---- | ------------------ |
| GET    | `/announcements` | Yes  | List announcements |

---

## Push Notifications

| Method | Path              | Auth | Description                  |
| ------ | ----------------- | ---- | ---------------------------- |
| POST   | `/push/subscribe` | Yes  | Register push subscription   |
| DELETE | `/push/subscribe` | Yes  | Unregister push subscription |

---

## Admin (Admin Only)

All admin routes require the `ADMIN` role.

| Method | Path                       | Description                    |
| ------ | -------------------------- | ------------------------------ |
| GET    | `/admin/users`             | List all users                 |
| GET    | `/admin/users/:id`         | Get user details               |
| PUT    | `/admin/users/:id`         | Update user (ban, role change) |
| DELETE | `/admin/users/:id`         | Delete user                    |
| GET    | `/admin/posts`             | List all posts                 |
| DELETE | `/admin/posts/:id`         | Remove a post                  |
| GET    | `/admin/reports`           | List reported content          |
| PUT    | `/admin/reports/:id`       | Resolve a report               |
| GET    | `/admin/stats`             | Platform statistics            |
| GET    | `/admin/announcements`     | List announcements             |
| POST   | `/admin/announcements`     | Create announcement            |
| PUT    | `/admin/announcements/:id` | Update announcement            |
| DELETE | `/admin/announcements/:id` | Delete announcement            |

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Short error code",
  "message": "Human-readable description"
}
```

Common HTTP status codes:

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 400  | Bad Request (validation error)       |
| 401  | Unauthorized (missing/expired token) |
| 403  | Forbidden (insufficient role)        |
| 404  | Not Found                            |
| 409  | Conflict (duplicate resource)        |
| 429  | Too Many Requests (rate limited)     |
| 500  | Internal Server Error                |
