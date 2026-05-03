import dotenv from 'dotenv';
dotenv.config();
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import cors from 'cors'

console.log('Environment Check:');
console.log('PORT:', process.env.PORT);
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('---');

import express, { Application, Request, Response } from 'express';
import dbConnect from './config/db';
import requestLogger from './middleware/reqLogger'
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import taskRoutes from './routes/taskRoutes'
import teamRoutes from './routes/teamRoutes'
import organizationRoutes from './routes/organizationRoutes'
import fieldRoutes from './routes/fieldRoutes'
import workspaceRoutes from './routes/workspaceRoutes'
import submissionRoutes from './routes/submissionRoutes'
import notificationRoutes from './routes/notificationRoutes'
import problemReportRoutes from './routes/problemReportRoutes'
import accessRequestRoutes from './routes/accessRequestRoutes'
import aiRoutes from './routes/aiRoutes'
import dashboardRoutes from './routes/dashboardRoutes'

const app: Application = express();

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Database
dbConnect();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

if (process.env.NODE_ENV !== 'production') {
    app.use(requestLogger);
}

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/fields', fieldRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/reports', problemReportRoutes)
app.use('/api/access-requests', accessRequestRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check
app.get('/', (req: Request, res: Response): void => {
    res.json({ message: "Welcome to TaskFlow" });
});

// Error Handler (must be last)
app.use(errorHandler);

app.listen(PORT, (): void => {
    console.log(`App listening on port ${PORT}`);
});

export default app;