# FINN Platform - Quick Start Guide for Developers

This guide will help you set up and run the FINN Healthcare Compliance Platform locally.

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Java Runtime Environment (JRE) 11+ (for Firebase Data Connect emulator)
- Firebase CLI (`npm install -g firebase-tools`)
- Git

---

## 1. Initial Setup

### Clone and Install Dependencies

```bash
# Navigate to project directory
cd /Volumes/4TB-Z/programming/CPA_app_FINN

# Install root dependencies
npm install

# Install web app dependencies
cd web
npm install
cd ..

# Install cloud functions dependencies
cd functions
npm install
cd ..
```

### Verify Java Installation

Firebase Data Connect requires Java:

```bash
# Check Java version (should be 11+)
java -version

# If not installed, on macOS:
brew install openjdk@21
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
```

---

## 2. Start Firebase Emulators

The Firebase emulators provide a local development environment with PostgreSQL, Auth, Functions, and Storage.

### Start Emulators

```bash
# From project root
npx firebase emulators:start
```

You should see:

```
✔  All emulators ready! It is now safe to connect your app.
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators started, it is safe to connect.           │
├─────────────────────────────────────────────────────────────┤
│ Emulator Hub running at localhost:4400                      │
│ Emulator UI available at localhost:4000                     │
├─────────────────────────────────────────────────────────────┤
│ Auth Emulator:           localhost:9099                     │
│ Functions Emulator:      localhost:5001                     │
│ Data Connect Emulator:   localhost:9399                     │
│ Storage Emulator:        localhost:9199                     │
└─────────────────────────────────────────────────────────────┘
```

### Access Emulator UI

Open your browser to `http://localhost:4000` to access the Firebase Emulator UI where you can:
- View and manage emulated Auth users
- Browse the PostgreSQL database
- Test Cloud Functions
- Inspect storage files

---

## 3. Seed the Database

The database needs to be seeded with state compliance data.

### Method 1: Via Data Connect Console

1. Open Data Connect console: `http://localhost:4000/dataconnect`
2. Select the `example` connector
3. Navigate to the "Operations" tab
4. Find and run `SeedStates` mutation
5. Verify 16 states were created

### Method 2: Via GraphQL (manual)

The seed data is already defined in `/dataconnect/example/seed.gql`. You can execute it via the Data Connect Explorer or any GraphQL client.

### Verify Seeded Data

Run the `ListStates` query:

```graphql
query ListStates {
  states {
    stateCode
    stateName
    fpaAvailable
    cpaRequired
  }
}
```

You should see 16 states (AK, DC, NH, OR, RI, UT, WY, CT, IL, MA, MI, NJ, VT, WI, TX, CA).

---

## 4. Start the Web Application

### Development Mode

```bash
# In a new terminal
cd web
npm run dev
```

The app will start at `http://localhost:3000`

### Test Pages

Navigate to:
- `http://localhost:3000/login` - Login page
- `http://localhost:3000/register` - Registration
- `http://localhost:3000/dashboard` - Dashboard (requires login)

---

## 5. Create Test Users

### Method 1: Via Register Page

1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - Name: `John Doe`
   - Email: `john@test.com`
   - Password: `password123`
   - Role: `Nurse Practitioner` or `Physician`
3. Click "Sign up"
4. You'll be redirected to the dashboard

### Method 2: Via Auth Emulator UI

1. Go to `http://localhost:4000/auth`
2. Click "Add user"
3. Enter email and password
4. The user will be created in Firebase Auth
5. On first login, they'll need to complete their profile

### Recommended Test Users

Create these for testing different workflows:

**Nurse Practitioner:**
- Email: `np@test.com`
- Password: `password123`
- Role: `NP`

**Physician:**
- Email: `physician@test.com`
- Password: `password123`
- Role: `PHYSICIAN`

---

## 6. Test Key Features

### Test License Management

1. Login as NP user
2. Navigate to `/dashboard/licenses`
3. Click "Add License"
4. Select a state (e.g., Connecticut)
5. Enter license details
6. Submit form
7. Verify license appears in list

### Test Provider Directory

1. Login as Physician user
2. Navigate to `/dashboard/directory/profile`
3. Create a physician profile:
   - Select states (e.g., CT, MA)
   - Choose specialty
   - Set max NPs (e.g., 5)
4. Submit profile
5. Login as NP user
6. Navigate to `/dashboard/directory`
7. Search for physicians
8. Verify physician profile appears

### Test Messaging

1. Login as NP user
2. Navigate to `/dashboard/messages`
3. Start a conversation with a physician
4. Send a message with a phone number (e.g., "My number is 555-1234")
5. Verify the contact info is blocked (no active CPA)
6. Check audit log in Firebase console

### Test CPA Workflow

1. Create a CPA between NP and Physician:
   - Navigate to `/dashboard/agreements`
   - Click "Create New CPA"
   - Select state and participants
2. Both parties sign the CPA:
   - Navigate to `/dashboard/agreements/[id]/sign`
   - Draw signature on canvas
   - Submit signature
3. Verify CPA status changes to "Active"
4. Send a message with contact info
5. Verify contact info is no longer blocked

### Test Compliance Tracking

1. With an active CPA, navigate to `/dashboard/compliance`
2. Click "Submit Chart Review"
3. Fill in the chart review form
4. Submit
5. Verify it appears in compliance dashboard
6. Schedule a QA meeting
7. Verify it appears in upcoming meetings

---

## 7. Development Workflow

### File Structure

```
/Volumes/4TB-Z/programming/CPA_app_FINN/
├── web/                          # Next.js web application
│   ├── src/
│   │   ├── app/                  # App router pages
│   │   │   ├── (auth)/          # Login/register pages
│   │   │   └── dashboard/        # Protected dashboard pages
│   │   ├── components/           # Reusable React components
│   │   ├── lib/                  # Utility functions and Firebase setup
│   │   └── providers/            # React context providers
│   └── package.json
├── functions/                    # Cloud Functions
│   ├── src/
│   │   ├── index.ts             # Main entry point
│   │   ├── fpa-calculator.ts     # FPA eligibility calculator
│   │   ├── message-filter.ts     # HIPAA message filtering
│   │   ├── capacity-tracker.ts   # Physician capacity management
│   │   └── genkit-sample.ts      # CPA document generator
│   └── package.json
├── dataconnect/                  # Firebase Data Connect
│   ├── schema/
│   │   └── schema.gql           # PostgreSQL schema (24 entities)
│   ├── example/
│   │   ├── queries.gql          # GraphQL queries (23 queries)
│   │   ├── mutations.gql        # GraphQL mutations (23 mutations)
│   │   └── seed.gql             # State seed data
│   └── dataconnect.yaml
└── firebase.json                 # Firebase configuration
```

### Making Changes

**To add a new page:**
1. Create a new file in `web/src/app/dashboard/[pagename]/page.tsx`
2. Use the Data Connect SDK for data fetching
3. Follow existing page patterns

**To add a new GraphQL operation:**
1. Add query/mutation to `dataconnect/example/queries.gql` or `mutations.gql`
2. SDK is auto-generated on emulator restart
3. Import from `@dataconnect/generated` in your components

**To add a new Cloud Function:**
1. Create a new file in `functions/src/[functionname].ts`
2. Export the function in `functions/src/index.ts`
3. Deploy with `firebase deploy --only functions:[functionname]`

**To modify the database schema:**
1. Edit `dataconnect/schema/schema.gql`
2. Restart Data Connect emulator
3. Schema changes are automatically migrated

### Build and Test

```bash
# Build web app
cd web
npm run build

# Build cloud functions
cd functions
npm run build

# Run linter
cd web
npm run lint

# Type check
npm run type-check
```

---

## 8. Debugging

### View Logs

**Emulator Logs:**
```bash
# View all emulator logs
firebase emulators:start

# Logs appear in terminal
```

**Function Logs:**
```bash
# In Emulator UI at localhost:4000
# Navigate to Functions tab
# Select a function to view logs
```

**Database Queries:**
```bash
# In Data Connect Explorer (localhost:4000/dataconnect)
# Use the Operations tab to test queries
# View execution logs in the console
```

### Common Issues

**Issue: "Cannot connect to Data Connect emulator"**
```bash
# Solution: Check Java is installed
java -version

# Restart emulators
firebase emulators:stop
firebase emulators:start
```

**Issue: "Module not found: @dataconnect/generated"**
```bash
# Solution: Regenerate SDK
cd web
npm run build

# Or restart Data Connect emulator
```

**Issue: "Firebase Auth not working"**
```bash
# Solution: Check emulator is running
curl http://localhost:9099

# Verify firebase.ts configuration
# Ensure FIREBASE_AUTH_EMULATOR_HOST is set
```

**Issue: "GraphQL operation returns 404"**
```bash
# Solution: Verify operation exists in queries.gql or mutations.gql
# Restart Data Connect emulator to regenerate SDK
# Check operation name matches import
```

---

## 9. Environment Variables

### Web Application (.env.local)

Create a `.env.local` file in the `web/` directory:

```bash
# Firebase Project (use emulator values for local dev)
NEXT_PUBLIC_FIREBASE_API_KEY="demo-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="localhost"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="demo-project"

# Emulator settings
NEXT_PUBLIC_USE_EMULATOR=true
```

For production, use actual Firebase project credentials.

### Cloud Functions (.env)

Create a `.env` file in the `functions/` directory:

```bash
# Database connection (set by Firebase)
DATA_CONNECT_INSTANCE="projects/demo-project/locations/us-central1/services/example"
```

---

## 10. GraphQL Operations Quick Reference

### Most Common Queries

```graphql
# Get current user profile
query GetMyProfile {
  user(key: { id_expr: "auth.uid" }) {
    displayName
    email
    role
  }
}

# List user's licenses
query GetMyLicenses {
  licenses(where: { user: { id: { eq_expr: "auth.uid" } } }) {
    id
    licenseNumber
    state {
      stateCode
      stateName
    }
  }
}

# Get all states
query ListStates {
  states {
    stateCode
    stateName
    fpaAvailable
    cpaRequired
  }
}
```

### Most Common Mutations

```graphql
# Create a license
mutation CreateLicense($stateId: UUID!, $licenseNumber: String!) {
  license_insert(data: {
    userId_expr: "auth.uid"
    stateId: $stateId
    licenseNumber: $licenseNumber
    licenseType: "NP"
    verificationStatus: "pending"
  })
}

# Send a message
mutation SendMessage($conversationId: UUID!, $messageBody: String!) {
  message_insert(data: {
    conversationId: $conversationId
    senderId_expr: "auth.uid"
    messageBody: $messageBody
  })
}
```

---

## 11. Testing Checklist

Before committing changes, verify:

- [ ] Web app builds successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors (warnings are okay)
- [ ] All new pages accessible
- [ ] GraphQL operations work via Data Connect Explorer
- [ ] Firebase emulators running
- [ ] Test user flow works end-to-end
- [ ] No console errors in browser

---

## 12. Deployment

### To Staging

```bash
# Use staging Firebase project
firebase use staging

# Deploy Data Connect schema
firebase deploy --only dataconnect

# Deploy Cloud Functions
cd functions
npm run build
firebase deploy --only functions

# Deploy web app
cd web
npm run build
firebase deploy --only hosting
```

### To Production

```bash
# Use production Firebase project
firebase use production

# Deploy all components
firebase deploy

# Monitor deployment
firebase functions:log --limit 50
```

---

## 13. Support and Resources

### Documentation
- [Firebase Data Connect Docs](https://firebase.google.com/docs/data-connect)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)

### Internal Resources
- Validation Report: `/VALIDATION_REPORT.md`
- Implementation Plan: `~/.claude/plans/floofy-swimming-hickey.md`
- Schema Definition: `/dataconnect/schema/schema.gql`

### Getting Help
- Check Firebase Emulator UI logs
- Review console errors in browser DevTools
- Verify GraphQL operations in Data Connect Explorer
- Check this Quick Start guide

---

## Quick Reference Commands

```bash
# Start everything
firebase emulators:start              # Start Firebase emulators
cd web && npm run dev                 # Start web app (separate terminal)

# Build and test
cd web && npm run build              # Build web app
cd functions && npm run build        # Build cloud functions
cd web && npm run lint               # Lint code

# Firebase commands
firebase emulators:start --only functions,dataconnect,auth    # Start specific emulators
firebase deploy --only functions     # Deploy only functions
firebase deploy --only dataconnect   # Deploy only schema
firebase deploy                      # Deploy everything

# Debugging
firebase emulators:export ./backup   # Export emulator data
firebase emulators:import ./backup   # Import emulator data
```

---

**Last Updated:** December 18, 2025
**Version:** 1.0.0-MVP
**Maintainer:** FINN Development Team
