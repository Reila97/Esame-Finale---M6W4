import express from 'express'
import passport from 'passport'

import { login } from '../CONTROLLERS/login.js'
import { googleCallback } from '../MIDDLEWARES/authentication.js'
import { authentication } from '../MIDDLEWARES/authentication.js'


const loginRouter = express.Router()

//login normale
loginRouter.post('/login', login)

//rotta di inizializzazione login con goggle
loginRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// rotta di ritorno da google 
// Passport preleva il codice dall'URL, contatta Google e mette il risultato in req.user
loginRouter.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback)

//CHI SONO IO?
// uso il token per trovare l'utente. lo aggiungo in postman e mando get
loginRouter.get('/me', authentication, (req, res) => {
    // req.authUser viene popolato dal tuo middleware di autenticazione
    res.json(req.authUser);
});

export default loginRouter