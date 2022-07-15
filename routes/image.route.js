import express from 'express';
import uploads from '../helpers/multer.js'
import auth from '../middlewares/auth.js'

import {deleteImage,getImages,createImage, getImageByName} from '../controllers/image.controller.js'
const router = express.Router();

router.post('',uploads.single('file'),createImage);
router.get('',getImages);
router.get('/:filename',getImageByName);
router.delete('/files/:id',deleteImage)
export default router;