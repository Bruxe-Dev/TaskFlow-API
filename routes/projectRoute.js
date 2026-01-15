const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandlewrapp')


//Create a new project

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body
        const project = new Project({
            name,
            description
        });

        await project.save()

        res.status(201).json({
            success: true,
            data: project
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            data: error.message
        });
    }
});

//Get all current Projects

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

//Getting only one project

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                error: "Project not found"
            });
        }
        res.status(200).json({
            sucess: true,
            data: project
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Updating a Project

router.put('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, //Returns the updated Document
                runValidator: true //Makes sure that schema rules are cvalidated
            }
        );
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            })
        }
        res.status(200).json({
            success: truq,
            data: project
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

//Delete a Project

router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            res.status(404).json({
                success: false,
                error: 'No Project found'
            })
        }
        res.status(200).json({
            success: true,
            data: {},
            message: 'Project deleted Successfully'
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: message.error
        })
    }
})

module.exports = router;
