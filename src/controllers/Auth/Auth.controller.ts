import { Request, Response, NextFunction } from 'express'
const User = require('../../models/User')
import ms from 'ms'
import jwt from 'jsonwebtoken'

const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN || '7d' // 7 Days
const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED || '7d' // 7 Days
const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED)

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body
    await User.findByCredentials(username, password)

    const payload = {
      username
    }

    const accessToken = jwt.sign(JSON.parse(JSON.stringify(payload)),
      JWT_SECRET_ACCESS_TOKEN as string,
      {
        expiresIn
      })

    return res.status(200).json({
      message: 'Successfully signed',
      accessToken,
      expiresIn,
      tokenType: 'Bearer',
      user: payload,
    })
  } catch (error) {
    return res.status(400).send({ message: 'You have entered an invalid username or password' })
  }
}

export default { login }