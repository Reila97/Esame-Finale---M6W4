import express from 'express'

import { canc, createNew, findAll, findId, update } from '../CONTROLLERS/comment.js'
import { authentication } from '../MIDDLEWARES/authentication.js'

const commentRouter = express.Router()

commentRouter.get('/blogPosts/:blogPostId/comments', findAll ) 
commentRouter.get('/blogPosts/:blogPostId/comments/:id', findId) 

commentRouter.post('/blogPosts/:blogPostId/comments', authentication, createNew) 
commentRouter.delete('/blogPosts/:blogPostId/comment/:id', authentication, canc) 
commentRouter.put('/blogPosts/:blogPostId/comments/:id', authentication, update) 

export default commentRouter