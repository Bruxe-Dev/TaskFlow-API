require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();

app.middleware(express.json());

mongoose.connect(process.env.MONGO_URI)

    .then(() => {
        console.log("MongoDB connected Succesfully")
    })
    .catch(() +> {

    })
