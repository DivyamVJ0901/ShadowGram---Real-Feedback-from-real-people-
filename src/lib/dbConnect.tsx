/*IMPORTANT
 --> Next.js me cheeze continuosly running nahi hoti , usme jaise jaise 
     request aati hai , vaise vaise connection establish hota hai so therefore
     it is completely diffrent from other backend applications , in backend applications
     , the database is remain connected all the time but this is not possible in 
     Next.js , So we have to check before hitting any request we have to check such that 
     there is no other DB connected right now.
*/

import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number,
}

const connection : ConnectionObject = {}

// IMPORTANT : Always check about prior connection 
async function dbConnect() : Promise<void>{
    if(connection.isConnected)
    {
        console.log("Already connected to DB")
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URL || "" , {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected Successfully");
    }
    catch(error){
        process.exit(1);
    }
}

export default dbConnect;