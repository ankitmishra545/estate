import express from 'express'
import { verifyToken } from '../utilis/verifyUser.js';
import { createListing } from '../controllers/listing.controller.js'

const router = express.Router();

router.post('/create', verifyToken, createListing)

export default router;