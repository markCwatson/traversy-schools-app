import express from 'express'

import { checkToken } from '../middleware/auth.js'

import {
    registerUser,
    deleteUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword
} from "../controllers/auth.js"

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/:id').delete(checkToken, deleteUser)
router.route('/me').get(checkToken, getCurrentUser)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:token').put(resetPassword)

export { router }