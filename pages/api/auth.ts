import { NextApiHandler } from 'next'
import { hash512, signJWT } from '../../utils/crypto'

const AuthApi: NextApiHandler = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({
      success: false,
      reason: 'Method Not Allowed'
    })
    return
  }

  if (process.env.PASSWORD_HASH !== hash512(req.body.password)) {
    res.send({
      success: false,
      reason: 'Credential Incorrect'
    })
    return
  }

  const date = new Date()

  date.setTime(date.getTime() + 10 * 60 * 1000)

  res.setHeader('Set-Cookie', `TOKEN=${signJWT()}; expires=${date.toUTCString()}`)
  res.send({
    success: true,
    reason: 'because you typed the right password!'
  })
}

export default AuthApi
