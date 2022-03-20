import { sign, verify } from 'jsonwebtoken'
import { sha512 as Sha512 } from 'sha.js'

const signJWT = () =>
  sign({}, process.env.JWT_TOKEN!, {
    expiresIn: '10m',
    subject: 'me!'
  })

const verifyJWT = (token: string) => {
  try {
    verify(token, process.env.JWT_TOKEN!)
    return true
  } catch (_) {
    return false
  }
}

const hash512 = (plain: string) =>
  new Sha512().update(plain).digest('hex')

export { signJWT, verifyJWT, hash512 }
