# Deploying Mahira Select to Render (render.com)

This guide provides instructions to deploy the full-stack **Mahira Select** application to [Render](https://render.com) with high reliability and zero downtime.

---

## ⚡ Option 1: Automatic Blueprint Deploy (Recommended)

Render will automatically detect the included `render.yaml` file in your repository:

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Select your connected repository.
5. Render reads `render.yaml` and sets up the Web Service automatically with:
   - **Runtime**: Node.js
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check**: `/healthz`
6. Click **Apply** to deploy.

---

## 🛠️ Option 2: Manual Web Service Setup

If you prefer configuring the Web Service manually in Render:

1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the following fields:

| Setting | Value |
| :--- | :--- |
| **Name** | `mahira-select` |
| **Language / Runtime** | `Node` |
| **Region** | `Singapore (Southeast Asia)` or closest to your customers |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or Starter for 24/7 always-on) |

4. Under **Advanced Settings**:
   - **Health Check Path**: `/healthz`
   - **Auto-Deploy**: `Yes`
   - **Environment Variables**:
     - `NODE_ENV` = `production`

5. Click **Create Web Service**. Render will install dependencies, bundle the Vite client, bundle the Express server, and start the app on port 10000.

---

## 🔐 Store Owner Portal & Credentials

Once deployed on your Render URL (e.g., `https://mahira-select.onrender.com`):

- **Owner Login**:
  - Phone: `8536943389`  
  - Or Email: `debrajdutta200de@gmail.com`
  - Secret Owner Password: `debrajdutta0192837465`
- **Settlement Account**:
  - Bank: **Punjab National Bank (PNB)**
  - Account Number: `2072001501047083`
  - IFSC: `PUNB0207200`
  - Beneficiary: **Debraj Dutta**
  - UPI ID: `8536943389@pnb` / `8536943389@upi`
  - WhatsApp Dispatch: `+91 8536943389`

---

## 🔍 Verification Commands

Before deploying, you can test the production build locally:

```bash
# 1. Run unit tests
npm test

# 2. Build production client & server
npm run build

# 3. Test production start
npm start
```
