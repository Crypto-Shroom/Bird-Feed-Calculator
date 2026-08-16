# Firebase Deployment Guide (Bird Feed Calculator)

This guide covers deploying the Pigeon Seed Mix Calculator to **Firebase Hosting** with backend in-app issue reporting powered by **Firebase Cloud Functions (2nd gen)** and secure **Firebase Secrets**.

---

## Prerequisites

1. **Firebase CLI installed**: `npm install -g firebase-tools`
2. **Authenticated**: `firebase login`

---

## 1. Select your Firebase Project

Link your local repository to your Firebase project:

```bash
firebase use bird-food-calculator-25e6d
```

---

## 2. Store the GitHub App Private Key as a Firebase Secret

For secure in-app reporting without exposing credentials, store your GitHub App private key in Firebase Secret Manager:

```bash
firebase functions:secrets:set GITHUB_APP_PRIVATE_KEY
```
When prompted, paste the contents of your `github-app.pem` file.

---

## 3. Build and Deploy

To build the React frontend and Cloud Functions, then deploy Hosting and Functions in one step:

```bash
pnpm build
firebase deploy
```

- **Hosting URL**: Serves the static React frontend and rewrites `/api/submit-issue` requests directly to the `submitIssue` Cloud Function.
- **Security**: The private key is injected securely into the Cloud Function container at runtime via Firebase Secrets and never touches the client browser or repository.
