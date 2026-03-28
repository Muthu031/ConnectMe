# Migration Guide: MongoDB to PostgreSQL

This guide documents the migration of ConnectMe from MongoDB to PostgreSQL.

## 🔄 What Changed

### Database System
- **Before:** MongoDB (NoSQL, document-based)
- **After:** PostgreSQL (SQL, relational)

### ORM/ODM
- **Before:** Mongoose
- **After:** Sequelize

### ID System
- **Before:** MongoDB ObjectId (24-character hex string)
- **After:** PostgreSQL UUID (36-character UUID v4)

## 📊 Schema Changes

### Data Type Mappings

| MongoDB/Mongoose | PostgreSQL/Sequelize |
|------------------|----------------------|
| ObjectId | UUID |
| String | STRING / TEXT |
| Number | INTEGER / FLOAT |
| Boolean | BOOLEAN |
| Date | DATE / DATETIME |
| Array of ObjectIds | JSON array |
| Embedded documents | JSON / JSONB |
| Mixed | JSON |

### Model Changes

#### 1. User Model
**Before (Mongoose):**
```javascript
followers: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}]
```

**After (Sequelize):**
```javascript
// Separate junction table created
User.belongsToMany(User, { 
  through: 'user_followers',
  as: 'followers'
});
```

#### 2. Field Name Conventions
- **Foreign Keys:** Changed from `user` to `userId`
- **References:** Changed from ObjectId references to UUID foreign keys
- **Timestamps:** Still `createdAt` and `updatedAt`

## 🛠️ Code Changes Required

### 1. Model Imports

**Before:**
```javascript
const User = require('./models/User.model');
const Post = require('./models/Post.model');
```

**After:**
```javascript
// Import from models/index.js for proper relationships
const { User, Post } = require('./models');
```

### 2. Querying Data

**Before (Mongoose):**
```javascript
// Find user by ID
const user = await User.findById(userId);

// Find with populate
const post = await Post.findById(postId).populate('user');

// Create
const newUser = await User.create({ username, email, password });
```

**After (Sequelize):**
```javascript
// Find user by ID
const user = await User.findByPk(userId);

// Find with include (like populate)
const post = await Post.findByPk(postId, {
  include: [{ model: User, as: 'user' }]
});

// Create
const newUser = await User.create({ username, email, password });
```

### 3. Array Fields

**Before (Mongoose):**
```javascript
// Add to array
user.followers.push(followerId);
await user.save();

// Check array contains
if (user.followers.includes(userId)) { }
```

**After (Sequelize with Junction Tables):**
```javascript
// Add follower (many-to-many)
await user.addFollower(followerUser);

// Check if following
const isFollowing = await user.hasFollower(followerUser);

// Get all followers
const followers = await user.getFollowers();
```

### 4. Validation

**Before (Mongoose):**
```javascript
username: {
  type: String,
  required: [true, 'Username is required'],
  minlength: 3,
  maxlength: 30
}
```

**After (Sequelize):**
```javascript
username: {
  type: DataTypes.STRING(30),
  allowNull: false,
  validate: {
    notEmpty: { msg: 'Username is required' },
    len: {
      args: [3, 30],
      msg: 'Username must be between 3 and 30 characters'
    }
  }
}
```

## 📝 Controller Updates

### Example: Get User Posts

**Before (Mongoose):**
```javascript
const posts = await Post.find({ user: userId })
  .populate('user', 'username profilePicture')
  .sort({ createdAt: -1 })
  .limit(20);
```

**After (Sequelize):**
```javascript
const posts = await Post.findAll({
  where: { userId },
  include: [{
    model: User,
    as: 'user',
    attributes: ['username', 'profilePicture']
  }],
  order: [['createdAt', 'DESC']],
  limit: 20
});
```

## 🔧 Environment Variables

Update your `.env` file:

**Before:**
```env
MONGODB_URI=mongodb://localhost:27017/connectme
```

**After:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=connectme
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
```

## 📦 Dependencies

### Remove
```bash
npm uninstall mongoose express-mongo-sanitize
```

### Install
```bash
npm install sequelize pg pg-hstore
```

## 🚀 Migration Steps

### 1. Setup PostgreSQL
```bash
# Install PostgreSQL (see POSTGRESQL_SETUP.md)
psql -U postgres -c "CREATE DATABASE connectme;"
```

### 2. Update Dependencies
```bash
cd backend
npm install
```

### 3. Initialize Database
```bash
node init-db.js
```

### 4. Test Connection
```bash
npm run dev
```

## 📊 Data Migration (if needed)

If you have existing MongoDB data to migrate:

### Step 1: Export MongoDB Data
```bash
# Export each collection
mongoexport --db connectme --collection users --out users.json
mongoexport --db connectme --collection posts --out posts.json
```

### Step 2: Convert IDs
Create a script to convert ObjectIds to UUIDs and update references.

### Step 3: Import to PostgreSQL
Use Sequelize's bulk create methods to import data.

## ✅ Testing Checklist

- [ ] Database connection works
- [ ] All tables created
- [ ] User registration works
- [ ] Authentication works (JWT)
- [ ] CRUD operations work for all models
- [ ] Relationships work (includes/joins)
- [ ] File uploads work
- [ ] Socket.io still works
- [ ] API endpoints return correct data
- [ ] Mobile app connects successfully

## 🐛 Common Issues

### Issue: "relation does not exist"
**Solution:** Run `node init-db.js` to create tables

### Issue: Can't connect to PostgreSQL
**Solution:** Check PostgreSQL is running and credentials in `.env` are correct

### Issue: Foreign key constraint errors
**Solution:** Ensure related records exist before creating relationships

### Issue: JSON field errors
**Solution:** PostgreSQL uses JSONB - ensure data is properly JSON formatted

## 📚 Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Mongoose to Sequelize Guide](https://sequelize.org/docs/v6/other-topics/migrations/)

## 💡 Benefits of PostgreSQL

1. **ACID Compliance:** Full transaction support
2. **Better Performance:** Optimized for complex queries
3. **Data Integrity:** Strong foreign key constraints
4. **JSON Support:** JSONB type for flexible data
5. **Advanced Features:** Full-text search, window functions
6. **Scaling:** Better support for read replicas
7. **Tooling:** Excellent GUI tools (pgAdmin, TablePlus)

---

✨ **Migration Complete! You're now running on PostgreSQL!**
