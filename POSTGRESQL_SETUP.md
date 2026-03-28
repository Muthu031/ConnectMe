# PostgreSQL Setup Guide for ConnectMe

## 🗄️ PostgreSQL Installation

### Windows

**Option 1: Download Official Installer (Recommended)**
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer (PostgreSQL 15 or higher recommended)
3. During installation:
   - Set password for postgres user (remember this!)
   - Default port: 5432
   - Install pgAdmin 4 (GUI tool - optional but helpful)
4. Add PostgreSQL to PATH (installer usually does this)

**Option 2: Using Docker**
```powershell
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name connectme-postgres `
  -e POSTGRES_PASSWORD=yourpassword `
  -e POSTGRES_DB=connectme `
  -p 5432:5432 `
  -d postgres:15

# Verify it's running
docker ps
```

### macOS

**Using Homebrew:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Using Docker:**
```bash
docker run --name connectme-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=connectme \
  -p 5432:5432 \
  -d postgres:15
```

### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 📊 Database Setup

### Create Database

**Method 1: Command Line**
```powershell
# Windows - Access psql
psql -U postgres

# Create database
CREATE DATABASE connectme;

# List databases to verify
\l

# Exit
\q
```

**Method 2: Using psql directly**
```powershell
psql -U postgres -c "CREATE DATABASE connectme;"
```

**Method 3: Using pgAdmin (GUI)**
1. Open pgAdmin 4
2. Connect to PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `connectme`
5. Click "Save"

## ⚙️ Configure ConnectMe

### 1. Update `.env` File

Edit `backend/.env`:
```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=connectme
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
DB_SSL=false
```

### 2. Install Dependencies

```powershell
cd backend
npm install
```

### 3. Initialize Database Schema

```powershell
# This will create all tables
node init-db.js
```

Expected output:
```
🔄 Connecting to PostgreSQL database...
✅ Database connection established successfully
🔄 Creating database tables...
✅ All tables created successfully
📊 Database schema initialized!
```

## 🚀 Start the Application

```powershell
cd backend
npm run dev
```

## 🔍 Verify Installation

### Check PostgreSQL is Running

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Or check the port
Get-NetTCPConnection -LocalPort 5432
```

**Docker:**
```powershell
docker ps | findstr postgres
```

### Test Database Connection

```powershell
# Connect to PostgreSQL
psql -U postgres -d connectme

# List all tables
\dt

# Check users table structure
\d users

# Exit
\q
```

## 🛠️ Common Issues & Solutions

### Issue 1: "password authentication failed"
**Solution:**
- Check password in `.env` matches PostgreSQL password
- Reset PostgreSQL password:
  ```powershell
  psql -U postgres
  ALTER USER postgres PASSWORD 'newpassword';
  ```

### Issue 2: "could not connect to server"
**Solution:**
- Verify PostgreSQL is running: `Get-Service postgresql*`
- Start if stopped: `Start-Service postgresql-x64-15`
- Check port 5432 is not in use by another app

### Issue 3: "database does not exist"
**Solution:**
```powershell
psql -U postgres -c "CREATE DATABASE connectme;"
```

### Issue 4: "relation does not exist"
**Solution:**
- Run database initialization: `node init-db.js`
- Or sync models: Set `DB_ALTER_SYNC=true` in `.env` and restart server

## 📦 Database Management Tools

### pgAdmin 4 (GUI)
- Comes with PostgreSQL installer
- Access: http://localhost:5432
- Visual database management

### TablePlus (Recommended)
- Download: https://tableplus.com/
- Modern GUI for multiple databases
- Great for development

### DBeaver (Free & Open Source)
- Download: https://dbeaver.io/
- Supports multiple databases
- Rich feature set

## 🔄 Migration from MongoDB

If you're migrating data from MongoDB:

1. **Export MongoDB data**
```bash
mongoexport --db connectme --collection users --out users.json
```

2. **Convert and import to PostgreSQL**
- Create a migration script
- Parse JSON data
- Insert into PostgreSQL using Sequelize

## 📚 PostgreSQL vs MongoDB Differences

| Feature | MongoDB | PostgreSQL |
|---------|---------|------------|
| Type | NoSQL (Document) | SQL (Relational) |
| Schema | Flexible | Strict |
| IDs | ObjectId (24 chars) | UUID (36 chars) |
| Arrays | Native support | JSON/JSONB columns |
| Relationships | References | Foreign Keys |
| Transactions | Limited | Full ACID |

## 🎯 Next Steps

1. ✅ PostgreSQL installed and running
2. ✅ Database `connectme` created
3. ✅ Tables initialized via `init-db.js`
4. ✅ Backend configured and running
5. 🚀 Test API endpoints
6. 🧪 Run tests: `npm test`

## 💡 Pro Tips

1. **Use pgAdmin or TablePlus** for visual database management
2. **Enable query logging** in development for debugging
3. **Create database backups**:
   ```powershell
   pg_dump -U postgres connectme > backup.sql
   ```
4. **Use database indexes** (already defined in models) for performance
5. **Monitor query performance** using `EXPLAIN ANALYZE`

## 📞 Support

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Sequelize Docs: https://sequelize.org/docs/v6/
- ConnectMe Issues: [Create an issue on GitHub]

---

✨ **Happy coding with PostgreSQL!**
