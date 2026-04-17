import express from 'express'

import cloudinaryUploadImg from '../MIDDLEWARES/cloudinary.js'
import { findAll, findId, canc, createNew, update, updateAvatar } from '../CONTROLLERS/authors.js'
import { authentication } from '../MIDDLEWARES/authentication.js'

//creo un sottomodulo di express per gestire le rotte
const authorRouter = express.Router()

// definisco le rotte

authorRouter.get('/', findAll) //get di tutti
authorRouter.get('/:id', findId) // get del singolo
authorRouter.post('/', createNew) // elemento nuovo

authorRouter.delete('/:id', authentication, canc) // elimino elemento
authorRouter.put('/:id', authentication, update) //modifica elemento
authorRouter.patch('/:id/avatar', authentication, cloudinaryUploadImg.single('avatar'), updateAvatar); // upload dell'avatar

export default authorRouter