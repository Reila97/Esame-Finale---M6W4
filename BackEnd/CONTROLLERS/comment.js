import mongoose from "mongoose"
import BlogPost from "../MODELS/BlogPost.js"


// i commenti sono all' interno di blogpost


export async function findAll(req, res) {
    try {
        // recupero l'id  del blogpost (il padre) e controllo che l' id sia valido
        const { blogPostId } = req.params
        if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
            return res.status(400).json({ message: 'id blog post non valido' })
        }
        // cerco il blog post che contiene i commenti
        const post = await BlogPost.findById(blogPostId).populate("comments.author", "nome cognome avatar email");;

        // controllo che esista
        if (!post) {
            return res.status(404).json({ message: 'id valido ma non esistente' })
        }

        // se ok ritorna (200) e il singolo commento
        res.status(200).json(post.comments)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}



export async function findId(req, res) {
    try {
        // recupero l' id del commento e del blogpost
        const { blogPostId, id } = req.params;

        // controllo entrambi gli id
        if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
            return res.status(400).json({ message: 'id blog post non valido' })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id del commento non valido' })
        }

        // per trovare il commentro embeddato in blogpost cerco il blogpost (padre)
        const blogPost = await BlogPost.findById(blogPostId)

        if (!blogPost) {
            return res.status(404).json({ message: 'id blog post valido ma non esistente' })
        }

        //prendo il commento tramite il post.comment (embeddato), .id permette di scandagliare l'array commenti e restituire quello con lo stesso id
        const comment = blogPost.comments.id(id);
        if (!comment) {
            return res.status(404).json({ message: 'id commento valido ma non esistente' })
        }

        // se ok restituisco (200)
        res.status(200).json(comment)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export async function createNew(req, res) {
    try {
        const { blogPostId } = req.params
        if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
            return res.status(400).json({ message: 'id blog post non valido' })
        }

        //recupero i dati dello chema del commento
        const { text } = req.body;


        // CORREZIONE: Usiamo req.authUser (caricato dal tuo middleware)
        // Se non c'è authUser, l'autore viene preso dal body (opzionale)
        const authorId = req.authUser ? req.authUser._id : req.body.author;

        if (!authorId) {
            return res.status(401).json({ message: "Devi essere loggato per commentare" });
        }


        // cerco il padre nel database
        const post = await BlogPost.findById(blogPostId);
        if (!post) {
            return res.status(404).json({ message: 'id blogpost valido ma non esistente' })
        }

        //aggiungo il commento nell'array dei commenti
        const newComment = { text, author: authorId };
        post.comments.push(newComment);
        //salvo e restituisco(201)
        await post.save()

        // FONDAMENTALE: Ricarichiamo il post popolando l'autore del nuovo commento
        // altrimenti il frontend riceve solo un ID stringa e non vede i dati
        const updatedPost = await BlogPost.findById(blogPostId).populate("comments.author");

        // Restituiamo l'ultimo commento (quello appena creato) completo di dati autore
        res.status(201).json(post.comments[post.comments.length - 1])
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export async function canc(req, res) {
    try {
        //prendo e valido id
        const { blogPostId, id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
            return res.status(400).json({ message: 'id blog post non valido' })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id commento non valido' })
        }

        // cerco post e commento
        const blogPost = await BlogPost.findById(blogPostId)
        if (!blogPost) {
            return res.status(404).json({ message: 'id blog post valido ma non esistente' })
        }
        //prendo il commento
        const comment = blogPost.comments.id(id)
        if (!comment) {
            return res.status(404).json({ message: 'id commento valido ma non esistente' })
        }

        //cancello il commento, salvo restituisco(200)
        comment.deleteOne();
        await blogPost.save()
        res.status(200).json({ message: 'il commento è stato cancellato' })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export async function update(req, res) {
    try {
        //recupero id e dati
        const { blogPostId, id } = req.params;
        const { text } = req.body
        if (!mongoose.Types.ObjectId.isValid(blogPostId)) {
            return res.status(400).json({ message: 'id blogpost non valido' })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id commento non valido' })
        }

        //cerco il post e prendo il commento
        const blogPost = await BlogPost.findById(blogPostId)
        if (!blogPost) {
            return res.status(404).json({ message: 'id blog post valido ma non esistente' })
        }

        const comment = blogPost.comments.id(id)
        if (!comment) {
            return res.status(404).json({ message: 'id commento valido ma non esistente' })
        }

        // Check sicurezza: solo l'autore può modificare (opzionale ma consigliato)
        if (comment.author.toString() !== req.authUser._id.toString()) {
            return res.status(403).json({ message: "Non sei autorizzato" });
        }

        //modifico i campo salvo e restutuisco(200)
        comment.text = text;
        await blogPost.save()
        // Restituiamo il commento aggiornato popolato
        const finalPost = await BlogPost.findById(blogPostId).populate("comments.author");
        res.status(200).json(finalPost.comments.id(id));

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}
