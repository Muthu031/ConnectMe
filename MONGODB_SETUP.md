# MongoDB Installation Guide for Windows

## Quick MongoDB Setup

### Option 1: Install MongoDB Community Server (Recommended)

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download and run the installer

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Keep default data directory: `C:\Program Files\MongoDB\Server\7.0\`

3. **Verify Installation:**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service:**
   ```powershell
   net start MongoDB
   ```

### Option 2: Install via Chocolatey (If you have Chocolatey)

```powershell
choco install mongodb
```

### Option 3: Use MongoDB Atlas (Cloud - No Installation)

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connectme
   ```

## Starting MongoDB

### If installed as Windows Service:
```powershell
# Start
net start MongoDB

# Stop
net stop MongoDB

# Check status
Get-Service MongoDB
```

### If installed manually:
```powershell
# Create data directory
mkdir C:\data\db

# Start MongoDB
mongod --dbpath C:\data\db
```

## Connection Test

```powershell
# Connect to MongoDB shell
mongosh

# In MongoDB shell:
show dbs
use connectme
db.users.find()
```

## Troubleshooting

### Error: "net start MongoDB" fails
- Run PowerShell as Administrator
- Or install manually without service

### Error: "mongod not found"
- Add to PATH: `C:\Program Files\MongoDB\Server\7.0\bin`
- Restart terminal

### Port 27017 already in use
```powershell
# Find process using port 27017
Get-Process -Id (Get-NetTCPConnection -LocalPort 27017).OwningProcess

# Kill if needed
Stop-Process -Id <PID> -Force
```

## Current Status

✅ Backend .env created with MongoDB config
✅ Backend dependencies installed
❌ MongoDB not running yet

## Next Steps

1. Install MongoDB using one of the options above
2. Start MongoDB service
3. Run: `npm run dev` from ConnectMe root directory
