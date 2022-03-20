import { Component } from 'react'

const Container: Component = ({ children }) =>
  <div className="flex justify-center">
    <div className="container max-w-lg px-5 py-10">
      {children}
    </div>
  </div>

export default Container
