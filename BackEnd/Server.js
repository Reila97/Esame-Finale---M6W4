// server per caricare le variabili da .env
import dotenv from "dotenv";
// leggo le variabili da .env e le rendo disponibili tramite 'process.env.***'
dotenv.config()

// framework per creare il server
import express from "express";
//libreria che permette di parlare con mongoDB
import mongoose from "mongoose";
//middleware che permette di far comunicare il back con il front
import cors from 'cors';
// permette di gestire l'autenticazione tramite social (oAuth)
import passport from "passport";
//importo la strategy
import "./STRATEGY/googleStrategy.js"
//importo la funzione connect da db.js
import { connect } from './db.js'
//routes
import authorRouter from "./ROUTES/authors.js";
import blogRouter from "./ROUTES/blogpPost.js";
import commentRouter from "./ROUTES/comment.js";
import loginRouter from "./ROUTES/login.js";




//creo la variabile app che da ora sarà il nome del mio server (invece che express)
const app = express()

// --- MIDDLEWARES ---

// permetto al server di leggere il formato JSON (nei body delle richieste)
app.use(express.json())
//chiedo al server di usare cors per comunicare con altri domini
app.use(cors())
//connetto a passport (fondamentale per il google login)
app.use(passport.initialize())

// --- CONNESSIONE DATABASE ---

connect() // da db.js, connette mongoDB

// --- AVVIO SERVER --- 

//ora metto in 'ascolto' il server (app) su una porta -definita in .env-, solo dopo che il DB è pronto
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server in ascolto sulla porta ${process.env.PORT}`)

})

// --- ROTTE ---

// autori
app.use('/authors',authorRouter)
//blogpost
app.use('/blogPosts', blogRouter)
//commenti
app.use('/', commentRouter)
//login
app.use('/auth', loginRouter)

// definisco la rotta ('/' -> definisce la rotta base, tipo home)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Benvenuto nel tuo API' })
})
