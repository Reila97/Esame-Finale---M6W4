import mongoose from "mongoose";
import bcrypt from 'bcrypt';

// definisco lo schema dell'autore
const AuthorSchema = new mongoose.Schema({
    name: String, 
    surname:String,
    email: {
        type: String,
        unique: true
    },
    birthDate:String, 
    avatar: String,
    password:String,
})

// .pre(save...) mongoose esegue la funzione prima di salvare un documento nel database
AuthorSchema.pre('save', async function () {

    // dico a mongoose che se l'utente sta aggiornando i dati ma non la psw non deve ricriptare
    if (!this.isModified('password')) {
        return;
    }
    // se la psw è nuova, genero il sale
    const salt = await bcrypt.genSalt(10)
    //metto l'hash al posto della psw
    this.password = await bcrypt.hash(this.password, salt)
})

const Author = mongoose.model('Author', AuthorSchema)

export default Author