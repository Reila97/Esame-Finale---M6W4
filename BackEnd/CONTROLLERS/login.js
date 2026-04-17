import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Author from '../MODELS/Author.js'

export async function login(req, res) {

    try {
        //recupero mail e psw
        const { email, password } = req.body

        // verifico che l'utente esista
        const author = await Author.findOne({ email }).select('+password');
        if (!author) {
            return res.status(401).json({ message: 'credenziali errate' })
        }

        // verifico la password 
        const isPswCorrect = await bcrypt.compare(password, author.password)
        if (!isPswCorrect) {
            return res.status(401).json({ message: 'credenziali errate' })
        }

        //se mail e psw sono corretti, creo il jwt
        jwt.sign(
            { id: author._id },       // 1. Payload (senza tonda qui!)
            process.env.JWT_SECRET,   // 2. Segreto
            { expiresIn: '24h' },     // 3. Opzioni
            (err, jwtToken) => {      // 4. Callback
                if (err) {
                    console.log(err); // Utile per il debug
                    return res.status(500).json({ message: 'errore nella creazione del token' });
                }
                // invio il token al frontend
                res.json({ token: jwtToken });
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}