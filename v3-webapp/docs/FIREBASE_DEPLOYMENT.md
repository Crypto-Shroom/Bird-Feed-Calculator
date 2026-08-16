# Firebase Deployment Guide

This guide outlines how to deploy the Multi-Bird Seed Mix Calculator to Firebase Hosting.

## Prerequisites
1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to your Firebase account:
   ```bash
   firebase login
   ```

## Initialization & Build
1. Build the production application:
   ```bash
   pnpm build
   ```
2. Initialize Firebase in the project directory (if not already initialized):
   ```bash
   firebase init hosting
   ```
   - Select your existing Firebase project.
   - Public directory: `dist/public`
   - Configure as a single-page app (rewrite all urls to /index.html): `Yes`

## Deployment
Deploy your production build to Firebase:
```bash
firebase deploy --only hosting
```
