require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

    .then(() => {
        console.log("MongoDB connected Succesfully")
    })
    .catch((err) => {
        console.error("MongoDB failed to connect successfully", err)
    })

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the TaskFlow API" })
})
app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
