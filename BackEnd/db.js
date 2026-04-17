import mongoose from "mongoose";
import { configDotenv } from "dotenv";


export async function connect() {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ MongoDB connesso')
    } catch (err) {
        console.error('errore nella connessione al DB:', err)
    }

}
