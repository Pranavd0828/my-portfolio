# Deployment & Custom Domain Guide: Cinematic Calm Portfolio

This guide outlines the precise steps required to deploy the Next.js portfolio and bind it to your custom domain: **`deopranav.com`**.

## Architecture Recommendation: Vercel

Since this project leverages the **Next.js App Router**, **Vercel** is the absolute best hosting provider. It guarantees:
- Zero-config deployment directly from GitHub.
- Edge network caching for blazing fast 100/100 Lighthouse performance.
- Native Next.js Image Optimization and Server-Side Rendering support out of the box.

---

## Step 1: Deploying the Code to Vercel

1. Go to [Vercel.com](https://vercel.com/) and create a free account (if you don't have one) using your GitHub account.
2. Click **"Add New..." > "Project"**.
3. Import your GitHub repository: `Pranavd0828/my-portfolio`.
4. Leave all settings exactly as default:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click **Deploy**. Vercel will build your site and immediately give you a staging URL (e.g., `my-portfolio-pranav.vercel.app`).

---

## Step 2: Binding `deopranav.com`

Once the site is successfully deployed to the staging URL, you must wire your custom domain:

1. In the Vercel dashboard for your project, go to **Settings > Domains**.
2. Enter `deopranav.com` and click **Add**.
3. Vercel will prompt you to add `www.deopranav.com` as well. Accept this and set it to naturally redirect to the root `deopranav.com`.

### DNS Configuration (Your Domain Registrar)

Log into whoever you purchased `deopranav.com` from (e.g., GoDaddy, Namecheap, Google Domains/Squarespace, Route53) and navigate to the **DNS Settings / Zone Editor**. You need to add these two exact records:

#### 1. The A-Record (For the apex/root domain)
This points `deopranav.com` directly to Vercel's global IP.
- **Type:** `A`
- **Name/Host:** `@` (or leave blank if `@` is not allowed)
- **Value/Points To:** `76.76.21.21`
- **TTL:** Auto / 3600

#### 2. The CNAME Record (For the www subdomain)
This ensures `www.deopranav.com` routes correctly.
- **Type:** `CNAME`
- **Name/Host:** `www`
- **Value/Points To:** `cname.vercel-dns.com`
- **TTL:** Auto / 3600

---

## SSL / HTTPS

Vercel will automatically provision and continuously renew an SSL certificate (Let's Encrypt) for `deopranav.com` as soon as the DNS propagation completes. No manual certificate generation is required.

## Next Steps
Until you are ready to flip the switch, the code is fully prepared. Whenever you're ready, simply click "Deploy" on Vercel and input the DNS records above. The transition take less than 5 minutes.
