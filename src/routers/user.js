const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

const router = new express.Router();

// Get user profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// User signup
router.post('/users/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        // await user.save();
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({ user, token });
    } catch (e) {
        console.log(e.name);
        res.status(400).send(e.message);
    }
});

// User Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user , token });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// User logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        console.log(req.user.tokens);
        await req.user.save();
        res.send(req.token);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// User logout from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Update User
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({ error: "Invalid Update", allowedUpdates });
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })
        
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Avatar upload
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return callback(new Error('File must be jpg, jpeg or png'));

        callback(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer();
    
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// Delete Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

// Get avatar of a user
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if(!user || !user.avatar)
            throw new Error('No user or user avatar');
        
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;