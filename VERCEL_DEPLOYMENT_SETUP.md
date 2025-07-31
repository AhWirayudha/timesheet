# Vercel Deployment Setup Guide

This guide will help you deploy your Timesheet AI Assistant to Vercel with all the necessary environment variables.

## 🚀 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Database**: PostgreSQL database (e.g., Supabase, Neon, Railway)
4. **API Keys**: Gemini API key and other required services

## 📋 Step-by-Step Setup

### 1. **Prepare Your Environment Variables**

Create a `.env.local` file locally with all your environment variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"

# Stripe (if using payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Optional: Other services
# Add any other environment variables your app needs
```

### 2. **Set Up Vercel Project**

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel

# Follow the prompts to set up your project
```

### 3. **Configure Environment Variables in Vercel**

#### Via Vercel Dashboard:
1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
| `JWT_SECRET` | `your-secret-here` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `your-nextauth-secret` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production |
| `GEMINI_API_KEY` | `your-gemini-key` | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production, Preview, Development |

#### Via Vercel CLI:
```bash
# Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GEMINI_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET

# Pull environment variables to local .env.local
vercel env pull .env.local
```

### 4. **Set Up GitHub Secrets**

Add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `NEXTAUTH_SECRET` | NextAuth.js secret |
| `NEXTAUTH_URL` | Your production URL |
| `GEMINI_API_KEY` | Google Gemini API key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |

### 5. **Get Vercel Credentials**

#### Get Vercel Token:
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token

#### Get Project Details:
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login and link your project
vercel login
vercel link

# This will show your project details including:
# - Project ID
# - Organization ID
```

### 6. **Database Setup**

#### For PostgreSQL (Recommended):

**Option A: Supabase (Free tier available)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from Settings → Database
4. Run your database migrations:
   ```bash
   pnpm run db:generate
   pnpm run db:migrate
   ```

**Option B: Neon (Free tier available)**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Get your connection string
4. Run migrations

**Option C: Railway**
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Get your connection string
4. Run migrations

### 7. **Test Your Deployment**

#### Manual Deployment:
```bash
# Deploy manually to test
vercel --prod
```

#### Via GitHub Actions:
1. Create a git tag to trigger deployment:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Check the GitHub Actions tab to monitor deployment

### 8. **Post-Deployment Setup**

#### Run Database Migrations:
```bash
# Connect to your production database and run migrations
pnpm run db:migrate
```

#### Seed Data (if needed):
```bash
# Only if you need initial data
pnpm run db:seed
```

## 🔧 Configuration Files

### `vercel.json`
The deployment workflow will create this automatically, but you can also create it manually:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url",
    "GEMINI_API_KEY": "@gemini_api_key",
    "STRIPE_SECRET_KEY": "@stripe_secret_key",
    "STRIPE_WEBHOOK_SECRET": "@stripe_webhook_secret"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "public": true
}
```

## 🚨 Important Notes

### Environment Variables:
- **Never commit sensitive data** to your repository
- Use Vercel's environment variable system for production
- Use `.env.local` for local development only

### Database:
- Ensure your database is accessible from Vercel's servers
- Use connection pooling for better performance
- Consider using Vercel's edge functions for database operations

### Security:
- Generate strong secrets for JWT and NextAuth
- Use HTTPS in production
- Regularly rotate your API keys

### Performance:
- Vercel functions have a 10-second timeout (free tier)
- Upgrade to Pro for longer timeouts
- Use edge functions for better performance

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure `pnpm-lock.yaml` is committed
   - Verify build command in Vercel settings

2. **Environment Variables**:
   - Double-check all variables are set in Vercel
   - Ensure variable names match exactly
   - Check for typos in values

3. **Database Connection**:
   - Verify DATABASE_URL is correct
   - Check database is accessible from Vercel
   - Ensure SSL is properly configured

4. **API Routes**:
   - Check function timeout settings
   - Verify API routes are in the correct location
   - Test endpoints locally first

### Debug Commands:
```bash
# Check Vercel project status
vercel ls

# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Pull latest environment
vercel env pull .env.local
```

## 📞 Support

If you encounter issues:
1. Check Vercel's [documentation](https://vercel.com/docs)
2. Review deployment logs in Vercel dashboard
3. Check GitHub Actions logs for CI/CD issues
4. Verify all environment variables are set correctly

## 🎉 Success!

Once deployed, your application will be available at:
`https://your-project-name.vercel.app`

The CI/CD pipeline will automatically deploy new versions when you:
- Push tags (e.g., `v1.0.0`)
- Merge to main branch (if configured)

Your Timesheet AI Assistant is now live! 🚀 