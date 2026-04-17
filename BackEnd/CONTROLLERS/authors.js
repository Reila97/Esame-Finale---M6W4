import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary'
import Author from "../MODELS/Author.js";

// funzione per trovare tutti gli autori
export async function findAll(req, res) {
    try {
        // PAGINAZIONE
        // per la paginazione servono 2 valori dall'URL: page e limit;
        //se page o limit non è valorizzato noi restituiamo tutti gli autori
        const { page, limit } = req.query;

        // chiedo la lista degli autori (senza await perche altrimenti eseguirebbe la query sul database - la query è: ?a=1&b=2&...)
        const authorsQuery = Author.find()

        //se pagina e limite sono impostati 
        //{filtrameli. skippo((tutte le pagine meno una -quella che voglio-) x il limite).limita i rusultati nell pagina(del limite impostato)}
        // es pagine da 10 elementi:
        //page 1 => (1-1)x10 --> non skippa nulla
        //page 2 => (2-1)x10 --> skippa i primi 10 (va a pag 2)
        //pg 3 => (3-1)x10 --> skippa 20 elementi (pg3)
        // ....
        if (page && limit) {
            authorsQuery.skip((page - 1) * limit).limit(limit)
        }

        // chiedo la lista degi autori (con await per interagire con il database)
        const authors = await authorsQuery;

        // se ok (200) allora fammeli vedere
        res.status(200).json(authors)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



//ricerca per id (recupero del singolo)
export async function findId(req, res) {
    try {
        //recupero l'id dai parametri
        const { id } = req.params

        //validazione dell'id, se non esiste (400)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id autore non valido' })
        }

        //cerco l'autore che ha lo stesso Id
        const author = await Author.findById(id)

        // se l'autore non esiste piu rendo l'errore(404)
        if (!author) {
            return res.status(404).json({ message: 'id valido ma non esistente' })
        }

        // se ok (200) allora mostra
        res.status(200).json(author)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



// creazione nuovo autore
export async function createNew(req, res) {
    try {
        //dal corpo della richiesta, destrutturo i dati dell'autore
        const { name, surname, email, birthDate, avatar, password } = req.body

        //creo il nuovo autore
        const author = new Author({ name, surname, email, birthDate, avatar, password })

        //salvo il nuovo autore
        // . save permette di: 
        // 1. validare lo schema
        // 2. attiva il middleware pre.save
        // 3. scrive i dati nel database
        const newAuthor = await author.save()

        // se viene creato rispondo con (201)
        res.status(201).json(newAuthor)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}



// elimino utente
export async function canc(req, res) {
    try {

        //controllo id
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id autore non valido' })
        }

        //elimino l'autore
        const cancAuthor = await Author.findByIdAndDelete(id)

        // verifico l'esistenza dell'autore da cancellare (404 - not found)
        if (!cancAuthor) {
            return res.status(404).json({ message: 'autore non trovato' })
        }

        // se ok, ritorno (200)
        res.status(200).json({ message: 'Autore cancellato' })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




//modifico l'autore
export async function update(req, res) {
    try {
        //controllo id
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id autore non valido' })
        }

        //prendo i parametri del modello
        const { name, surname, email, birthDate, avatar } = req.body

        // modifico i parametri
        const updatedauthor = await Author.findByIdAndUpdate(
            id, //id da aggiornare
            { name, surname, email, birthDate, avatar }, //dati da aggiornare
            { returnDocument: 'after' } //aggiornamento dati
        )

        //se l'autore non esiste rendo l'errore (404)
        if (!updatedauthor) {
            return res.status(404).json({ message: 'autore non trovato' })
        }

        //se ok restituisco (200)
        res.status(200).json(updatedauthor)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



// aggiungo img
export async function updateAvatar(req, res) {
    try {
        //controllo id
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // Se l'ID è sbagliato ma il file è già arrivato, lo eliminiamo subito
            if (req.file) await cloudinary.uploader.destroy(req.file.filename);

            return res.status(400).json({ message: 'id autore non valido,, immagine rimossa dal cloud' })
        }

        //quando l'utente carica l'immagine, se il caricamento va a buon fine Express aggiunge req.file, quindi controllo che questo parametro ci sia, in caso contrario avviso che non c'è
        if (!req.file) {
            return res.status(400).json({ message: 'file non caricato' })
        }

        //colleghiamo il file caricato all'autore, aggiorno il database
        const author = await Author.findByIdAndUpdate(
            id, //id dell'autore
            { avatar: req.file.path }, // percorso del file
            { returnDocument: 'after' }//ritorn il documento modificato
        )

        //se l'id fornito non esiste, elimino l'img e restituisco errore(404)
        if (!author) {
            // L'autore non esiste, dobbiamo cancellare l'immagine dal cloud
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: 'Autore non trovato, immagine rimossa dal cloud' });
        }

        // se ok, restituisco(200)
        res.status(200).json(author)

    } catch (error) {
        // provo a pulire Cloudinary
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cloudinaryError) {
                // Non blocco il flusso e rispondo al client
                console.error("Errore durante la pulizia del file:", cloudinaryError);
            }
        }
        //  rispondo al cliente
        res.status(500).json({
            message: error.message + ', abbiamo tentato di rimuovere l\'immagine dal cloud'
        });
    }
}



