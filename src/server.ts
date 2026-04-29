import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Check:');
console.log('PORT:', process.env.PORT);
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('---');

import express, { Application, Request, Response } from 'express';
import dbConnect from './config/db';
import requestLogger from './middleware/reqLogger'
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoute'
import taskRoutes from './routes/taskRoute'
import teamRoutes from './routes/teamRoutes'
import organizationRoutes from './routes/organizationRoutes'
import fieldRoutes from './routes/fieldRoutes'

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Database
dbConnect();

// Middleware
app.use(express.json());

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