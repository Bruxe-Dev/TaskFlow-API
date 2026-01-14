const express = require('express')
const router = express.Router();
const Task = require('../models/Task')

router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, project } = req.body
    } catch (error) {

    }
})