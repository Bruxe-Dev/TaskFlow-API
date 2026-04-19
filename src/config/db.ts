import express from 'express'
import mongoose from 'mongoose'
import { promises } from 'node:dns';

const dbConnect = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI

        if (!mongoUri) {
            throw new Error("Database URI not provided in the .env file")
        }
        await mongoose.connect(mongoUri)
        console.log("MongoDB connected Successfully")
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("MongoDB failed to connect successfully", error.message)
        } else {
            console.error("MongoDB failed to connect sucessfully", error)
        }

        process.exit(1)
    }
};

export default dbConnect;