import express from "express";
import {Router} from "express"
const router = Router();

import facade from "../facades/DummyDB-Facade";
import { IFriend } from '../interfaces/IFriend';
const Joi = require('joi');

router.use(express.json());

router.get("/", async (req, res) => {
    const friends = await facade.getAllFriends();
    res.json(friends);
});

router.get("/:email", async (req, res) => {
    const friend = await facade.getFriend(req.params.email);
    if (!friend) return res.status(404).send('The friend with the given EMAIL was not found');
    res.json(friend);
});

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