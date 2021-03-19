import express from "express";
import { Router } from "express"
const router = Router();
import { ApiError } from "../errors/apiError"
import facade from "../facades/DummyDB-Facade";
import { IFriend } from '../interfaces/IFriend';
const Joi = require('joi');
import authMiddleware from "../middleware/basic-auth";
router.use(authMiddleware)

router.use(express.json());

router.get("/", async (req, res) => {
    const friends = await facade.getAllFriends();
    const friendsDTO = friends.map(friend => {
        const { firstName, lastName, email } = friend; // destructuring object
        return { firstName: firstName, lastName, email }; // return new object
    });
    res.json(friendsDTO);
});


router.get("/:email", async (req, res, next) => {
    const emailId = req.params.email;
    try {
        const friend = await facade.getFriend(emailId);

        if (friend == null) {
            return next(new ApiError(`user: ${emailId} was not found`, 404))
        }

        const { firstName, lastName, email } = friend;
        const friendDTO = { firstName, lastName, email }
        res.json(friendDTO);
    } catch (err) {
        next(err)
    }
})


//Secure login for user
router.get("/user/me", async (req:any, res, next) => {
    const emailId = req.credentials.userName;
    try {
        const friend = await facade.getFriend(emailId);

        if (friend == null) {
            return next(new ApiError(`user: ${emailId} was not found`, 404))
        }

        const { firstName, lastName, email } = friend;
        const friendDTO = { firstName, lastName, email }
        res.json(friendDTO);
    } catch (err) {
        next(err)
    }
})


router.post("/", async (req, res) => {
    const friends = await facade.getAllFriends();

    const { error } = validateFriend(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const friend = {
        id: "id" + (friends.length + 1),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };
    const f = await facade.addFriend(friend);
    res.json(f);
});

router.put("/:id", async (req, res) => {
    const friend = await facade.updateFriend(req.params.id);
    if (!friend) return res.status(404).send('The friend with the given ID was not found');

    const { error } = validateFriend(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    friend.firstName = req.body.firstName;
    friend.lastName = req.body.lastName;
    friend.email = req.body.email;
    friend.password = req.body.password;
    res.send(friend);
});

router.delete("/:email", async (req, res) => {
    const friends = await facade.getAllFriends();
    const friend = await facade.deleteFriend(req.params.email);
    if (!friend) return res.status(404).send('The friend with the given EMAIL was not found');

    const index = friends.indexOf(friend);
    friends.splice(index, 1);

    res.json(friend);
});

// For validating POST and PUT
function validateFriend(friend: IFriend) {
    const schema = {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(6).required()
    };

    return Joi.validate(friend, schema);
}

export default router;