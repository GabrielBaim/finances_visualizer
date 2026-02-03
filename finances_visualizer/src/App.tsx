import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
          Visualizador de Finanças
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Minhas finanças nunca foram tão bonitas
        </p>
        <div className="card p-6 bg-slate-800 rounded-lg shadow-xl">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-md transition-colors"
          >
            count is {count}
          </button>
          <p className="mt-4 text-sm text-gray-400">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
