import { text } from "express";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        
        minLength: 1,
        maxLength: 300
    },
     author: String
}, {
    timestamps: true
})

const BlogPostSchema = new
    mongoose.Schema({
        category: { type: String, required: true },
        title: { type: String, required: true },
        cover: String,
        readTime: {
            value: Number,
            unit: String
        },
        author: { type: String, required: true },
        content: String,
        comments: [commentSchema] //embedding di commenti
    })

const BlogPost = mongoose.model("BlogPost", BlogPostSchema)

export default BlogPost