import { useState } from 'react'
import './App.css'

const HEARTS = ['💖', '💕', '💗', '💓', '💞', '💝', '🌸', '✨']

function FloatingHeart({ heart, style }) {
  return (
    <span className="floating-heart" style={style}>
      {heart}
    </span>
  )
}

function YesScreen() {
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    heart: HEARTS[i % HEARTS.length],
    style: {
      left: `${10 + (i * 7.5) % 80}%`,
      animationDuration: `${2 + (i % 3)}s`,
      animationDelay: `${(i * 0.3) % 2}s`,
      fontSize: `${1.5 + (i % 3) * 0.5}rem`,
    },
  }))

  return (
    <div className="screen yes-screen">
      {hearts.map(({ id, heart, style }) => (
        <FloatingHeart key={id} heart={heart} style={style} />
      ))}
      <div className="yes-content">
        <div className="yes-emoji">💖</div>
        <h1 className="yes-message">¡¡Eres lo mejor!!</h1>
        <div className="yes-emoji">💖</div>
      </div>
    </div>
  )
}

function AskScreen({ onYes }) {
  const [noClicks, setNoClicks] = useState(0)

  const siScale = 1 + noClicks * 0.65
  const noScale = Math.max(0.25, 1 - noClicks * 0.14)

  const noLabels = [
    'No',
    '¿Estás seguro/a?',
    'Piénsalo bien…',
    '¡Nooo!',
    'Última oportunidad…',
    'Por favor no 😢',
    'Te lo ruego 🥺',
    'Okay… 😭',
  ]
  const noLabel = noLabels[Math.min(noClicks, noLabels.length - 1)]

  return (
    <div className="screen ask-screen">
      <h1 className="question">¿Quieres salir conmigo?</h1>
      <div className="buttons-row">
        <button
          className="btn btn-si"
          style={{
            transform: `scale(${siScale})`,
            transformOrigin: 'center center',
          }}
          onClick={onYes}
        >
          Sí 💖
        </button>
        <button
          className="btn btn-no"
          style={{
            transform: `scale(${noScale})`,
            transformOrigin: 'center center',
          }}
          onClick={() => setNoClicks((n) => n + 1)}
        >
          {noLabel}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [saidYes, setSaidYes] = useState(false)

  return saidYes ? <YesScreen /> : <AskScreen onYes={() => setSaidYes(true)} />
}
