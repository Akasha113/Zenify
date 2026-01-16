# MongoDB Atlas Setup (Cloud MongoDB - No Download Needed)

## ✅ Best for Your FYP

Using MongoDB Atlas (cloud) is **recommended** because:
- ✅ No installation required
- ✅ FREE tier (512MB storage)
- ✅ Professional setup
- ✅ Easier to deploy later
- ✅ Works from anywhere
- ✅ Automatic backups

---

## 📝 Step-by-Step Setup (5 minutes)

### Step 1: Sign Up
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"**
3. Fill in email, password, name
4. Click **"Create your account"**
5. Verify your email

### Step 2: Create a Project
1. Click **"Create a Project"**
2. Name it: `mindful-journal`
3. Click **"Next"**
4. Click **"Create Project"**

### Step 3: Create a Cluster
1. Click **"Build a Database"**
2. Choose **"FREE"** tier (M0)
3. Select a region close to you (or default)
4. Click **"Create Deployment"**
5. **Wait 2-3 minutes** for cluster to create

### Step 4: Create Database User
When cluster is ready:
1. Click **"Security" → "Database Access"**
2. Click **"Add New Database User"**
3. Set username: `mongouser`
4. Set password: `your-strong-password` (save this!)
5. Click **"Add User"**

### Step 5: Get Connection String
1. Click **"Databases" → "Overview"**
2. Click **"Connect"**
3. Choose **"Drivers"**
4. Select **"Node.js"** and version **"4.0 or later"**
5. **Copy the connection string:**
   ```
   mongodb+srv://mongouser:your-password@cluster0.xxxxx.mongodb.net/mindful-journal?retryWrites=true&w=majority
   ```

### Step 6: Whitelist Your IP (IMPORTANT!)
1. Click **"Security" → "Network Access"**
2. Click **"Add IP Address"**
3. Choose one:
   - **"Allow access from anywhere"** (easier for development)
   - OR add your computer's IP manually
4. Click **"Confirm"**

### Step 7: Create Database
1. Go back to cluster
2. Click **"Collections"**
3. Click **"Create Database"**
4. Database name: `mindful-journal`
5. Collection name: `users`
6. Click **"Create"**

---

## 🔧 Update Your Backend .env

Replace:
```env
MONGODB_URI=mongodb+srv://mongouser:your-password@cluster0.xxxxx.mongodb.net/mindful-journal?retryWrites=true&w=majority
```

**Important:** Replace:
- `mongouser` with your username
- `your-password` with your password
- `cluster0.xxxxx` with your actual cluster name

---

## ✅ Test Connection

Run your backend:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:3001
```

If not, check:
1. Credentials are correct in `.env`
2. IP whitelist includes your address
3. Database user is created

---

## 💡 Tips

- **Free tier limits:**
  - 512 MB storage (plenty for FYP)
  - 512 MB data transfer/day
  - 3 concurrent connections

- **Connection issues?**
  - Check IP whitelist (must allow your IP)
  - Verify username/password in connection string
  - Test in MongoDB Compass (desktop app)

- **Scale later:**
  - Can upgrade to paid tier for production
  - Cluster can handle thousands of users

---

## 🚀 Your Connection String Format

```
mongodb+srv://[username]:[password]@[cluster-name].mongodb.net/[database]?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://mongouser:SecurePass123@cluster0.ab1cd2ef.mongodb.net/mindful-journal?retryWrites=true&w=majority
```

---

## ✅ No More "mongod" Terminal Needed!

With MongoDB Atlas:
- ✅ No installation on your PC
- ✅ No `mongod` command needed
- ✅ Just use the connection string
- ✅ Backend connects to cloud automatically

**Perfect for your FYP!**

