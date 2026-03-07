import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { PaperWrapper } from './components/PaperWrapper/index.jsx'
import './App.css'
import './res/icons/style.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
	<PaperWrapper />

    </>
  )
}

export default App
