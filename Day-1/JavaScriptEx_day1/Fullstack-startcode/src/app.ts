const Joi = require('joi'); // Only for solution without facade
import express from "express";
import dotenv from "dotenv";
import path from "path";
import friendRoutes from "./routes/FriendRoutes";
import { IFriend } from './interfaces/IFriend'; // Only for solution without facade

/* Dummy DB for solution without Facade */
const friends: Array<IFriend> = [
    { id: "id1", firstName: "Peter2", lastName: "Pan2", email: "pp@b.dk", password: "secret" },
    { id: "id2", firstName: "Donald2", lastName: "Duck2", email: "dd@b.dk", password: "secret" }
]

dotenv.config()
const app = express()

app.use(express.static(path.join(process.cwd(), "public")))
app.use("/api/friends",friendRoutes)
app.use(express.json()); // Only for solution without facade


app.get("/demo", (req, res) => {
    res.send("Server is up");
})



/**
 * Solution without Facade
 */
app.get("/api/friends2", (req, res) => {
    res.send(friends);
});

app.get("/api/friends2/:email", (req, res) => {
    const friend = friends.find(f => f.email === req.params.email);
    if (!friend) return res.status(404).send('The friend with the given EMAIL was not found');
    res.send(friend);
});

app.post("/api/friends2", (req, res) => {
    console.log(req.body);
    const { error } = validateFriend(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const friend = {
        id: "id" + (friends.length + 1),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };
    friends.push(friend);
    res.send(friend);
});

app.put("/api/friends2/:id", (req, res) => {
    const friend = friends.find(f => f.id === req.params.id);
    if (!friend) return res.status(404).send('The friend with the given ID was not found');

    const { error } = validateFriend(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    friend.firstName = req.body.firstName;
    friend.lastName = req.body.lastName;
    friend.email = req.body.email;
    friend.password = req.body.password;
    res.send(friend);
});

app.delete("/api/friends2/:email", (req, res) => {
    const friend = friends.find(f => f.email === req.params.email);
    if (!friend) return res.status(404).send('The friend with the given EMAIL was not found');

    const index = friends.indexOf(friend);
    friends.splice(index, 1);

    res.send(friend);
});

function validateFriend(friend: IFriend) {
    const schema = {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(6).required()
    };

    return Joi.validate(friend, schema);
}


export default app;

