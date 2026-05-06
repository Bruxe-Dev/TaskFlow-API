require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { existsSync } from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import logger from './middleware/reqLogger';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import organizationRoutes from './routes/organizationRoutes';
import fieldRoutes from './routes/fieldRoutes';
import teamRoutes from './routes/teamRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import submissionRoutes from './routes/submissionRoutes';
import notificationRoutes from './routes/notificationRoutes';
import problemReportRoutes from './routes/problemReportRoutes';
import accessRequestRoutes from './routes/accessRequestRoutes';
import aiRoutes from './routes/aiRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();
const frontendDir = path.resolve(__dirname, '..', 'frontend', 'dist');

// Security middleware
app.use(helmet());

// CORS
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());

// Logger middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.use(logger);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', problemReportRoutes);
app.use('/api/access-requests', accessRequestRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
});
if (existsSync(frontendDir)) {
    app.use('/app', express.static(frontendDir));
    app.get(/^\/app(\/.*)?$/, (req, res) => {
        res.sendFile(path.join(frontendDir, 'index.html'));
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Basic test route
app.get('/', (req, res) => {
    res.json({
        message: 'TaskFlow Enterprise API',
        version: '1.0.0',
        status: 'Running',
        docs: '/api-docs',
        frontend: '/app'
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
