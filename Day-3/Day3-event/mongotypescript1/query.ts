import { MongoClient, Db, Collection } from "mongodb"
import connect from "./connect";
import setupTestData from "./setupTestData"

(async function Tester() {
    const client = await connect();
    const db = client.db("day1ex1")
    const collection = db.collection("inventory")
    const status = await setupTestData(collection)

    //Add your play-around code here

    // Select All Documents in a Collection
    // SELECT * FROM inventory
    const result = collection.find({})
    const asArr = await result.toArray();
    console.log('##### All Documents in a Collection #####')
    console.log(asArr);

    // Specify Equality Condition
    // SELECT * FROM inventory WHERE status = "D"
    const result2 = collection.find({ status: "D" })
    const asArr2 = await result2.toArray();
    console.log('##### Where the status equals "D" #####')
    console.log(asArr2);

    // Specify Conditions Using Query Operators
    // SELECT * FROM inventory WHERE status in ("A", "D")
    const result3 = collection.find({ status: { $in: ["A", "D"] } })
    const asArr3 = await result3.toArray();
    console.log('##### where status equals either "A" or "D" #####')
    console.log(asArr3);

    // Specify AND Conditions
    // SELECT * FROM inventory WHERE status = "A" AND qty < 30
    const result4 = collection.find({ status: "A", qty: { $lt: 30 } })
    const asArr4 = await result4.toArray();
    console.log('##### where the status equals "A" and qty is less than ($lt) 30 #####')
    console.log(asArr4);

    // Specify OR Conditions
    // SELECT * FROM inventory WHERE status = "A" OR qty < 30
    const result5 = collection.find({ $or: [{ status: "A" }, { qty: { $lt: 30 } }] })
    const asArr5 = await result5.toArray();
    console.log('##### where the status equals "A" or qty is less than ($lt) 30 #####')
    console.log(asArr5);

    // Specify AND as well as OR Conditions 
    // SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
    const result6 = collection.find({
        status: "A",
        $or: [{ qty: { $lt: 30 } }, { item: /^p/ }]
    })
    const asArr6 = await result6.toArray();
    console.log('##### where the status equals "A" and either qty is less than ($lt) 30 or item starts with the character p #####')
    console.log(asArr6);

    // Specify single field
    // SELECT item FROM inventory WHERE status = "A"
    const result7 = collection.find({ status: "A" },
        { projection: { item: 1, _id: 0 } }
    )
    const asArr7 = await result7.toArray();
    console.log('##### Show "item" where status equals "A" #####')
    console.log(asArr7);

    // Specify multiple fields
    // SELECT item, qty FROM inventory
    const result8 = collection.find({},
        { projection: { item: 1, qty: 1, _id: 0 } }
    )
    const asArr8 = await result8.toArray();
    console.log('##### Show "item" and "qty" from all documents in a collection #####')
    console.log(asArr8);

    // Select All Documents in a Collection and limit to 3 
    // SELECT item FROM inventory LIMIT 3
    const result9 = collection.find({},
        { projection: { item: 1, _id: 0 } }
    ).limit(3)
    const asArr9 = await result9.toArray();
    console.log('##### Show "item" from all documents in a collection and limit to 3 #####')
    console.log(asArr9);

    client.close()
})()
