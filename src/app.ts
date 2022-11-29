import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import { config } from './config/config'
import Logging from './library/Logging'
const routes = require("./routes")

const router = express()

// connect to the database
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info('Connected to mongoDB')
    startServer()
  })
  .catch((err) => {
    Logging.error('Unable to connect: ')
    Logging.error(err)
  })

// Only start the server if the database connection is established
const startServer = () => {
  router.use((req, res, next) => {
    // Log the request
    Logging.info(`Incomming -> Method: [${req.method}] - url: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

    res.on('finish', () => {
      Logging.info(`Incomming -> Method: [${req.method}] - url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`)
    })

    next()
  })

  router.use(express.urlencoded({ extended: true }))
  router.use(express.json())

  // rules of api
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET')
      return res.status(200).json({})
    }

    next()
  })

  // routes
  router.use(routes)

  // health checks
  router.get('/', (req, res, next) => res.status(200).json({ message: "Express Mongoose TS, Support by muchamadagush" }))

  // error handling
  router.use((req, res, next) => {
    const error = new Error('not found')
    Logging.error(error)

    return res.status(404).json({ message: error.message })
  })

  http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`))
}