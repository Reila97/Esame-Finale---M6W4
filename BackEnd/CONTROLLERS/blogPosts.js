import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

import BlogPost from "../MODELS/BlogPost.js";


export async function findAll(req, res) {
    try {
        const { page, limit } = req.query;
        const blogPostsQuery = BlogPost.find()

        if (page && limit) {
            authorsQuery.skip((page - 1) * limit).limit(limit)
        }

        const blogPosts = await blogPostsQuery;

        res.status(200).json(blogPosts)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export async function findId(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id blog post non valido' })
        }

        const blogPost = await BlogPost.findById(id)

        if (!blogPost) {
            return res.status(404).json({ message: 'id valido ma non esistente' })
        }
        return res.status(200).json(blogPost)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export async function createNew(req, res) {
    try {
        const { category, title, cover, readTime, author, content } = req.body
        const blogPost = new BlogPost({ category, title, cover, readTime, author, content })

        const newBlogPost = await blogPost.save()
        res.status(201).json(newBlogPost)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export async function canc(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id blog post non valido' })
        }

        const deletedBlogPost = await BlogPost.findByIdAndDelete(id)

        if (!deletedBlogPost) {
            return res.status(404).json({ message: 'blog post non trovato' })
        }
        res.status(200).json({ message: 'blog post cancellato' })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function update(req, res) {
    try {

        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id blog post non valido' })
        }

        const { category, title, cover, readTime, author, content } = req.body
        const uptadedBlogPost = await BlogPost.findByIdAndUpdate(id, { category, title, cover, readTime, author, content }, { returnDocument: 'after' })

        if (!uptadedBlogPost) {
            return res.status(404).json({ message: ' blog post non trovato' })
        }
        res.status(200).json(uptadedBlogPost)

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}



export async function updateCover(req, res) {
    try {

        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.file) await cloudinary.uploader.destroy(req.file.filename);
            return res.status(400).json({ message: 'id blog post non valido, immagine rimossa dal cloud' })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'file non caricato' })
        }

        const blogPost = await BlogPost.findByIdAndUpdate(
            id,
            { cover: req.file.path },
            { returnDocument: 'after' })

        if (!blogPost) {
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: ' blog post non trovato, immagine rimossa dal cloud' })
        }

        res.status(200).json(blogPost)

    } catch (error) {
        
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cloudinaryError) {
                console.error("Errore durante la pulizia del file:", cloudinaryError);
            }
        }
        res.status(500).json({
            message: error.message + ', abbiamo tentato di rimuovere l\'immagine dal cloud'
        });
    }
}
