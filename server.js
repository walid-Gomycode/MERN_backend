const express = require('express');
require('dotenv').config()
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

/// Middlewares
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // create folder "uploads" for handling multipart/form-data
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      try {
        const host = new URL(origin).hostname;
        if (host.endsWith("netlify.app")) return callback(null, true);
      } catch (e) {}

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
const connectDB = require('./config/connectDB');
const seedRoles = require('./config/seed/seedRoles');
const seedAdmin = require('./config/seed/seedAdmin');
connectDB().then(async () => {
    try {
        await seedRoles();

        // Seed admin user after roles are seeded
        await seedAdmin();
    } catch (error) {
        console.error('Error while seeding roles :', error.message);
    }
});

/// Routes 

//// Auth Route
app.use('/api/auth', require('./routes/auth.route'));

///users Route
app.use('/api/users', require('./routes/user.route'));

////role Route
app.use('/api/roles', require('./routes/role.route'));


app.use((req, res) => {
  res.json("api is running!!!");
});

//---------------------------- Fin de page -----------------------------//
const PORT = process.env.PORT || 4500;
app.listen(PORT, (err) => {
  err
    ? console.log(err)
    : console.log(`👌👌 Server is running on http://localhost:${PORT} 👌👌`);
});


