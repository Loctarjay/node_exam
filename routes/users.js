const express = require("express");
const router = express.Router();
const User = require("../models/users")

// Get single user
router.get("/:id", getUser, (req, res) => {
    res.send( res.user.name );
});

// Create new user
router.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400);
    }
});

// Update certain user info
router.patch("/:id", getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json( {message: error.message} );
    }
});

// Delete certain user
router.delete("/:id", getUser, async (req, res, next) => {
    try {
        await res.user.remove();
        res.json( { message: "Deleted User" } );
    } catch (error) {
        res.status(500).json( { message: error.message } );
    }
});


async function getUser(req, res, next) {
    try {
        user = await User.findById(req.params.id);
        if ( user == null ) {
            return res.status(404).json( {message: "Cannot find user"} );
        }
    } catch (error) {
        return res.status(500).json( {message: error.message} )
    }
    res.user = user;
    next();
};

module.exports = router;