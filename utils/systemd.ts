import { exec } from 'child_process'

const isServiceActive = (serviceName: string) =>
  new Promise((resolve, reject) =>
    exec(`systemctl status ${serviceName} | grep "inactive"`)
      .once('exit', (n) => resolve(n !== 0))
      .once('error', reject))

const setServiceActive = (serviceName: string, active: boolean) =>
  new Promise((resolve, reject) =>
    exec(`systemctl ${active ? 'start' : 'stop'} ${serviceName}`)
      .once('exit', resolve)
      .once('error', reject))

const reloadService = (serviceName: string) =>
  new Promise((resolve, reject) =>
    exec(`systemctl reload ${serviceName}`)
      .once('exit', resolve)
      .once('error', reject))

export { isServiceActive, setServiceActive, reloadService }
