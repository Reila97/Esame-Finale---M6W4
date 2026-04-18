import mongoose from "mongoose";
import Author from "./Author.js";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,

        minLength: 1,
        maxLength: 300
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author"
    }
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
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author",
            required: true
        },
        content: String,
        comments: [commentSchema] //embedding di commenti
    })

const BlogPost = mongoose.model("BlogPost", BlogPostSchema)

export default BlogPost