import { NextPageContext } from 'next'
import { AppType } from 'next/dist/shared/lib/utils'
import '../styles/globals.css'

const App: AppType =
  ({ Component, pageProps }) =>
    <Component {...pageProps} />

export default App
