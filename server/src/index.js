require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDb } = require('../config/db');
const healthRoutes = require('../routes/health.routes');
const authRoutes = require('../routes/auth.routes');
const projectRoutes = require('../routes/project.routes');
const skillRoutes = require('../routes/skill.routes');
const blogRoutes = require('../routes/blog.routes');
const resumeRoutes = require('../routes/resume.routes');
const { ensureSeedAdmin } = require('../controllers/auth.controller');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('API running'));
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    ensureSeedAdmin().catch(console.error);
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });

// index.js server entry 
