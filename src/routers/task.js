const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

// Get all tasks
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20 ---> third page
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if(req.query.completed) 
        match.completed = req.query.completed === 'true';

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        const sortCategory = parts[0];
        const sortDir = parts[1];
        sort[sortCategory] = sortDir === 'desc' ? -1 : 1;
    }

    try {        
        // Pagination and sorting is done in options
        await req.user.populate({ 
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
})

// Get Single task
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id });
        
        if(!task) 
            return res.status(404).send();
        
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})

// Create new task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate)
        return res.status(400).send({ error: "Invalid Update", allowedUpdates });

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task) 
            return res.status(404).send();

        updates.forEach((update) => task[update] = req.body[updates]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if(!task)
            return res.status(404).send();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
