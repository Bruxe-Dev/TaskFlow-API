require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db')

connectDB();//Connecting to DB

app.use(express.json());

const projectRoutes = require('./routes/projectRoute'); //Import Project routes
app.use('/api/projects', projectRoutes) //Use the routes


app.get('/', (req, res) => {
    res.json({ message: "Welcome to the TaskFlow API" })
})
app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
