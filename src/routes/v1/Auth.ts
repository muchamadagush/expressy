import express from 'express'
import AuthController from '../../controllers/Auth/Auth.controller'

const router = express.Router()

router.post('/login', AuthController.login)

export = router