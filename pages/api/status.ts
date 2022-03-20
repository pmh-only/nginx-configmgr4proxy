import { NextApiHandler, NextApiRequest } from 'next'
import { verifyJWT } from '../../utils/crypto'
import { addReverseProxyPort, changeReverseProxyIP, getReverseProxies, removeReverseProxyPort } from '../../utils/nginx'
import { isServiceActive, reloadService, setServiceActive } from '../../utils/systemd'

const StatusApiGET: NextApiHandler = async (req, res) => {
  if (!verifyJWT(req.cookies.TOKEN)) {
    res.send({
      success: false,
      reason: 'Session invalid (you need to relogin before continuing app)'
    })
    return
  }

  res.send({
    success: true,
    reason: 'Session token is correct and successed to collect data',
    data: {
      status: await isServiceActive('nginx'),
      proxies: await getReverseProxies()
    }
  })
}

const StatusApiPOST: NextApiHandler = async (req, res) => {
  if (!verifyJWT(req.cookies.TOKEN)) {
    res.send({
      success: false,
      reason: 'Session invalid (you need to relogin before continuing app)'
    })
    return
  }

  if (req.body.port !== undefined) {
    await addReverseProxyPort(req.body.port)
    await reloadService('nginx')
  }

  res.send({
    success: true,
    reason: 'all requested jobs have been resolved'
  })
}

const StatusApiPUT: NextApiHandler = async (req, res) => {
  if (!verifyJWT(req.cookies.TOKEN)) {
    res.send({
      success: false,
      reason: 'Session invalid (you need to relogin before continuing app)'
    })
    return
  }

  if (req.body.status !== undefined) {
    await setServiceActive('nginx', req.body.status === true)
  }

  if (req.body.ip !== undefined) {
    await changeReverseProxyIP(req.body.ip)
    await reloadService('nginx')
  }

  res.send({
    success: true,
    reason: 'all requested jobs have been resolved'
  })
}

const StatusApiDELETE: NextApiHandler = async (req, res) => {
  if (!verifyJWT(req.cookies.TOKEN)) {
    res.send({
      success: false,
      reason: 'Session invalid (you need to relogin before continuing app)'
    })
    return
  }

  if (req.body.port !== undefined) {
    await removeReverseProxyPort(req.body.port)
    await reloadService('nginx')
  }

  res.send({
    success: true,
    reason: 'all requested jobs have been resolved'
  })
}

// ---

const StatusApiList: {[method: string]: NextApiHandler} = {
  GET: StatusApiGET,
  POST: StatusApiPOST,
  PUT: StatusApiPUT,
  DELETE: StatusApiDELETE
}

const StatusApi: NextApiHandler = (req, res) =>
  StatusApiList[req.method!](req, res)

export default StatusApi
