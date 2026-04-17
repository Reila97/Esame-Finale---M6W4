import jwt from 'jsonwebtoken'
import Author from '../MODELS/Author.js'


//MIDDLEWARE DI AUTENTICAZIONE
export function authentication(req, res, next) {
    //verifico se l'header esista e inizi con Bearer
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token mancante o errato' })
    }

    // 'bearer ---' splitto dove c'è lo spazio e prendo il token
    const jwtToken = authHeader.split(' ')[1]

    //verifico il jwt JWT_SECRET lo invento io
    jwt.verify(jwtToken, process.env.JWT_SECRET, async function (err, payload) {
        //gestione dell'errore
        if (err) return res.status(401).json({ message: 'Token non valido o scaduto' });

        try {
            // tolgo la psw per evitare che 'vada in giro'
            const author = await Author.findById(payload.id).select('-password');
            //verifico che ci sia
            if (!author) return res.status(401).json({ message: 'Autore non trovato' });
            // salvo e metto i dati dove sono accessibili a tutti
            req.authUser = author;
            // vado avanti
            next()
        } catch (error) {
            res.status(500).json({ message: 'Errore interno del server' });
        }
    })
}

// GOOGLE CALLBACK
export async function googleCallback(req, res) {
    try {
      // 1. Estrai l'email dai dati che Passport ha ricevuto da Google
        // Passport mette tutto in req.user
        const email = req.user.emails[0].value; 
        const displayName = req.user.displayName;

        // A. Cerchiamo se l'utente esiste già nel DB
        let author = await Author.findOne({ email });

        // B. Se NON esiste, lo creiamo (Logica "Create")
        if (!author) {
            author = new Author({
                nome: displayName,
                email: email,
                googleId: req.user.id, // Utile per collegare l'account Google
                // psw non serve per account social
            });
            await author.save();
        }

        // C. In entrambi i casi (sia trovato che creato), generiamo il JWT
        jwt.sign(
            { id: author._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, jwtToken) => {
                if (err) return res.status(500).json({ message: "Errore firma token" });

                // Unica risposta finale
                res.json({ token: jwtToken });
            }
        );
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

