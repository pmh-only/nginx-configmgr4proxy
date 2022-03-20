import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import Container from '../components/Container'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const AppPage: NextPage = () => {
  const [ip, setIP] = useState<string|null>(null)
  const [isChangeMode, setChangeMode] = useState(false)
  const { data, error, mutate } = useSWR('/api/status', fetcher, {
    refreshInterval: 1000,
    onSuccess: (data) => data.success && !ip && setIP(data.data.proxies?.[0].ip)
  })

  async function runService () {
    await fetch('/api/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: true
      })
    })
    mutate()
  }

  async function stopService () {
    await fetch('/api/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: false
      })
    })
    mutate()
  }

  async function onClickChangeBtn () {
    if (!isChangeMode) {
      setChangeMode(true)
      return
    }

    setChangeMode(false)

    await fetch('/api/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ip
      })
    }).then((res) => res.json())

    setIP(null)
    mutate()
  }

  async function onClickAddBtn () {
    const portPmt = prompt('Please input origin\'s port (0~65535)')
    const port = parseInt(portPmt!)

    if (Number.isNaN(port) || port < 0 || port > 65535) {
      alert(`Port ${port} is invalid`)
      return
    }

    await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        port
      })
    })

    mutate()
  }

  async function onClickPort (port: number) {
    if (!confirm(`Really want to delete port: ${port}?`)) return

    await fetch('/api/status', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        port
      })
    })

    mutate()
  }

  return (
    <Container>
      {(!error && !data) && (
        <div className="font-bold text-center text-gray-500 ">
          loading...
        </div>
      )}

      {(error || (data && !data.success)) && (
        <div className="flex flex-col items-start p-1 border border-red-300 gap-1">
          Error has been occurred:
          <div className="px-3 py-2 font-mono text-xs bg-gray-200">
            {(error || data.reason).toString()}
          </div>
          <Link href="/" passHref>
            <button className="px-3 py-2 font-bold text-white bg-red-400 shadow hover:bg-red-500 transition-colors">
              Relogin
            </button>
          </Link>
        </div>
      )}

      {(!error && data && data.success) && (
        <div className="flex flex-col items-center gap-5">
          <div>
            Status:&nbsp;
            <span className={data.data.status ? 'font-bold text-green-400' : 'font-bold text-red-400'}>
              {data.data.status ? 'Running' : 'Stopped'}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              className="px-3 py-2 font-bold text-white bg-green-400 shadow hover:bg-green-500"
              onClick={runService}>

              Run

            </button>
            <button
              className="px-3 py-2 font-bold text-white bg-red-400 shadow hover:bg-red-500"
              onClick={stopService}>

              Stop

            </button>
          </div>

          <div className="flex shadow">
            <input
              type="text"
              value={ip || 'Loading...'}
              className={`px-3 text-center ${isChangeMode ? 'bg-white' : 'bg-gray-200'}`}
              placeholder="IP"
              onChange={(e) => setIP(e.target.value)}
              disabled={!isChangeMode} />

            <button onClick={onClickChangeBtn} className="px-5 py-2 font-bold text-white bg-blue-500 transition-colors hover:bg-blue-600">
              {isChangeMode ? 'Submit' : 'Change'}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {data.data.proxies.sort((a: any, b: any) => a.port - b.port).map((v: any, i: number) => (
              <button
                onClick={() => onClickPort(v.port)}
                key={i}
                className="px-10 py-3 bg-white bg-gray-100 shadow hover:bg-red-500 hover:text-white transition-colors duration-1000">
                {v.port}
              </button>
            ))}

            <button onClick={onClickAddBtn} className="px-10 py-3 font-bold text-white bg-gray-500 shadow hover:bg-gray-600">
              Add
            </button>
          </div>
        </div>
      )}
    </Container>
  )
}

export default AppPage
