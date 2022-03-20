import { NginxConfFile } from 'nginx-conf'

const getReverseProxies = () =>
  new Promise((resolve, reject) =>
    NginxConfFile.create(process.env.NGINX_CONFIG_PATH!, (err, conf) => {
      if (err || !conf) return reject(err || 'config is empty')

      resolve(conf.nginx.stream?.[0]?.server?.map((v) => ({
        port: v.listen?.[0]?._value,
        ip: v.proxy_pass?.[0]?._value
          .toString().replace(`:${v.listen?.[0]?._value}`, '')
      })) || [])
    }))

const changeReverseProxyIP = (ip: string) =>
  new Promise((resolve, reject) =>
    NginxConfFile.create(process.env.NGINX_CONFIG_PATH!, (err, conf) => {
      if (err || !conf) return reject(err || 'config is dead')

      for (const serverIndex in conf.nginx.stream?.[0].server || []) {
        const server = conf.nginx.stream?.[0].server?.[serverIndex]
        if (!server) continue

        const port = server.listen?.[0]._value

        if (!server.proxy_pass) continue
        server.proxy_pass[0]._value = `${ip}:${port}`
      }

      resolve(true)
    }))

const addReverseProxyPort = (port: number) =>
  new Promise((resolve, reject) =>
    NginxConfFile.create(process.env.NGINX_CONFIG_PATH!, (err, conf) => {
      if (err || !conf) return reject(err || 'config is dead')

      const lastIndex = conf.nginx.stream?.[0].server?.length || 1
      const firstServer = conf.nginx.stream?.[0]?.server?.[0]

      const ip = firstServer?.proxy_pass?.[0]?._value
        .toString().replace(`:${firstServer.listen?.[0]?._value}`, '')

      const proxyPass = `${ip}:${port}`

      conf.nginx.stream?.[0]._add('server')
      conf.nginx.stream?.[0].server?.[lastIndex]?._add('listen', port.toString())
      conf.nginx.stream?.[0].server?.[lastIndex]?._add('proxy_pass', proxyPass)

      resolve(true)
    }))

const removeReverseProxyPort = (port: string) =>
  new Promise((resolve, reject) =>
    NginxConfFile.create(process.env.NGINX_CONFIG_PATH!, (err, conf) => {
      if (err || !conf) return reject(err || 'config is dead')

      for (const serverIndex in conf.nginx.stream?.[0].server || []) {
        const server = conf.nginx.stream?.[0].server?.[serverIndex]
        if (!server) continue

        const serverPort = server.listen?.[0]._value

        if (serverPort !== port) continue
        conf.nginx.stream?.[0]._remove('server', parseInt(serverIndex))
      }

      resolve(true)
    }))

export {
  getReverseProxies,
  changeReverseProxyIP,
  addReverseProxyPort,
  removeReverseProxyPort
}
