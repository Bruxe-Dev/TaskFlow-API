require('dotenv').config();
console.log('Environment Check:');
console.log('PORT:', process.env.PORT);
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('---');
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

const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoute'); //Import Project routes
const taskRoutes = require('./routes/taskRoute');

app.use('/api/projects', projectRoutes) //Use the routes
app.use('/api/tasks', taskRoutes)
app.use('/api/auth', authRoutes)


app.get('/', (req, res) => {
    res.json({ message: "Welcome to TaskFlow " })
})

app.use(errorHandler)
app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
