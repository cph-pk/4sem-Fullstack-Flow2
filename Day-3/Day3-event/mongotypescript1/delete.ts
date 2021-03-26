import { MongoClient, Db, Collection } from "mongodb"
import connect from "./connect";
import setupTestData from "./setupTestData"

(async function Tester() {
    const client = await connect();
    const db = client.db("day1ex1")
    const collection = db.collection("inventory")
    const status = await setupTestData(collection)

    //Add your play-around code here

    //-- Delete All Documents in a collection
    //await collection.deleteMany({})

    //-- Delete All Documents that Match a Condition
    //await collection.deleteMany({ status : "A" })

    //-- Deletes the first document where status is "D"
    await collection.deleteOne( { status: "D" } )


    client.close()
})()
