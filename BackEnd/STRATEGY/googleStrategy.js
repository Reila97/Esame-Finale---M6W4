import dotenv from "dotenv"
dotenv.config()

import passport from "passport"
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'


const googleStrategy = new GoogleStrategy ({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done)=>{ 
    done(null,profile)}
)

passport.use("google", googleStrategy)

export default googleStrategy


//Questo file è il "cuore" dell'integrazione con Google. Qui stai configurando la Strategia, ovvero le regole che il tuo server deve seguire per parlare con i server di Google e capire chi è l'utente che sta cercando di loggarsi.