require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db')

const logger = require('./middleware/reqLogger');
const errorHandler = require('./middleware/errorHandler');

connectDB(); //Connecting to DB

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    app.use(logger)
}

const projectRoutes = require('./routes/projectRoute'); //Import Project routes
app.use('/api/projects', projectRoutes) //Use the routes

const taskRoutes = require('./routes/taskRoute');
app.use('/api/tasks', taskRoutes)


app.get('/', (req, res) => {
    res.json({ message: "Welcome to TaskFlow " })
})
app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
