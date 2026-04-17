import { Router } from 'express'
import Author from '../MODELS/Author.js'

//definisco una rotta API per recuperare l'elenco di tutti gli utenti dal mio database.
const router = Router()

router.get('/users', async (req, res) => {
    try {
        const users = await Author.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Errore nel recupero degli utenti" });
    }
});