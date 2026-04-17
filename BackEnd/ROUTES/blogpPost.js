import express from 'express'

import {findAll, findId, canc, createNew, update, updateCover } from '../CONTROLLERS/blogPosts.js'
import cloudinaryUploadImg from '../MIDDLEWARES/cloudinary.js'
import { authentication } from '../MIDDLEWARES/authentication.js'

const blogRouter = express.Router()

blogRouter.get('/', findAll ) 
blogRouter.get('/:id', findId)

blogRouter.post('/', authentication, createNew) 
blogRouter.delete('/:id', authentication, canc) 
blogRouter.put('/:id', authentication, update) 
blogRouter.patch('/:id/cover', authentication, cloudinaryUploadImg.single('cover'), updateCover)
// ✅ Prima controllo chi sei, poi scarico il file


export default blogRouter
