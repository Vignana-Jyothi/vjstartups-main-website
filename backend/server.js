// server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();
const app = express();

// Enable CORS if frontend runs on a different port
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://hub.vjstartup.com'
  ],
  credentials: true // allow cookies if needed
}));

app.use(express.json());

// Connect to MongoDB
console.log("URI:", JSON.stringify(process.env.MONGO_URI));
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ DB Connection Failed:', err);
        process.exit(1);
    });


// Routes
app.use('/problem-api', require('./APIs/problems-api'));
app.use('/idea-api', require('./APIs/ideas-api'));
app.use('/questionnaire-api', require('./APIs/questionnaire-api'));
app.use('/startup-api', require('./APIs/startups-api'));
app.use('/auth', require('./APIs/auth-api'));
app.use('/notification-api', require('./APIs/notifications-api'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));