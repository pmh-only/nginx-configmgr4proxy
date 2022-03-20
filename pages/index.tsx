import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import Container from '../components/Container'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isWrong, setIsWrong] = useState(false)

  async function onSubmit (e: FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    }).then((res) => res.json())

    if (res.success) {
      router.push('/app')
      return
    }

    setIsWrong(true)
    setPassword('')
    setTimeout(() => {
      setIsWrong(false)
    }, 1000)
  }

  return (
    <Container>
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl font-bold border-b-4">
          configmgr4proxy
        </h1>

        <p>please provide the password for security</p>

        <form className="flex flex-col items-start gap-5" onSubmit={onSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`px-5 py-3 shadow outline-none focus:bg-gray-50 transition-colors ${isWrong ? 'shadow-red-300' : ''}`}
            placeholder={isWrong ? 'wrong password!' : 'click here to enter password'} />

          <button
            type="submit"
            className="px-5 py-3 font-bold text-white bg-green-400 shadow hover:bg-green-500 transition-colors">
            Login
          </button>
        </form>
      </div>
    </Container>
  )
}

export default IndexPage
