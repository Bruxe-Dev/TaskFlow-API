const express = require('express');
const { default: mongoose } = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected Successfully")
    }
    catch (error) {
        console.error("MongoDB failed to connect successfully", error)
        process.exit(1)
    }
};

module.exports = dbConnect;