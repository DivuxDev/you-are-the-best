import { useState } from 'react'
import './App.css'

const HEARTS = ['\u{1F496}', '\u{1F495}', '\u{1F97A}', '\u{1F970}', '\u{1F60D}', '\u{1F618}', '\u2728', '\u{1F31F}', '\u{1F380}', '\u{1F338}', '\u{1F984}', '\u{1F308}']

const THEMES = [
  { id: 'rosa',   name: 'Rosa',
    ask: 'linear-gradient(135deg, #ffc2d9 0%, #ffb3c6 40%, #ff85a1 100%)',
    yes: 'linear-gradient(135deg, #ffe0ed 0%, #ffb3cc 50%, #ff80aa 100%)',
    text: '#8b1a4a',
    btnPrimary: 'linear-gradient(135deg, #ff4d85, #ff1a6c)', btnPrimaryShadow: 'rgba(255,26,108,0.45)',
    btnSecBg: '#fff0f5', btnSecColor: '#c0527a', btnSecBorder: '#f9b8d0', btnSecShadow: 'rgba(192,82,122,0.2)',
  },
  { id: 'morado', name: 'Morado',
    ask: 'linear-gradient(135deg, #e2c2ff 0%, #c9a0f5 40%, #a855f7 100%)',
    yes: 'linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 50%, #a855f7 100%)',
    text: '#3b0764',
    btnPrimary: 'linear-gradient(135deg, #a855f7, #7c3aed)', btnPrimaryShadow: 'rgba(124,58,237,0.45)',
    btnSecBg: '#f5f0ff', btnSecColor: '#7c3aed', btnSecBorder: '#d8b4fe', btnSecShadow: 'rgba(124,58,237,0.2)',
  },
  { id: 'azul',   name: 'Azul',
    ask: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 40%, #3b82f6 100%)',
    yes: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #60a5fa 100%)',
    text: '#1e3a8a',
    btnPrimary: 'linear-gradient(135deg, #3b82f6, #2563eb)', btnPrimaryShadow: 'rgba(37,99,235,0.45)',
    btnSecBg: '#eff6ff', btnSecColor: '#2563eb', btnSecBorder: '#bfdbfe', btnSecShadow: 'rgba(37,99,235,0.2)',
  },
  { id: 'verde',  name: 'Verde',
    ask: 'linear-gradient(135deg, #bbf7d0 0%, #86efac 40%, #22c55e 100%)',
    yes: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #4ade80 100%)',
    text: '#14532d',
    btnPrimary: 'linear-gradient(135deg, #22c55e, #16a34a)', btnPrimaryShadow: 'rgba(22,163,74,0.45)',
    btnSecBg: '#f0fdf4', btnSecColor: '#16a34a', btnSecBorder: '#bbf7d0', btnSecShadow: 'rgba(22,163,74,0.2)',
  },
  { id: 'oscuro', name: 'Oscuro',
    ask: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
    yes: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #6d28d9 100%)',
    text: '#e0d0ff',
    btnPrimary: 'linear-gradient(135deg, #6d28d9, #4c1d95)', btnPrimaryShadow: 'rgba(109,40,217,0.45)',
    btnSecBg: 'rgba(255,255,255,0.12)', btnSecColor: '#c4b5fd', btnSecBorder: '#4338ca', btnSecShadow: 'rgba(109,40,217,0.3)',
  },
]

const DEFAULTS = {
  question:   '\u00bfMe Quieres?',
  yesMessage: '\u00a1\u00a1Eres lo mejor!!',
  themeId:    'rosa',
  heartEmoji: '\u{1F496}',
}

function loadConfig() {
  try {
    const saved = localStorage.getItem('yatb-config')
    if (saved) return { ...DEFAULTS, ...JSON.parse(saved) }
  } catch {}
  return { ...DEFAULTS }
}

function saveConfig(cfg) {
  localStorage.setItem('yatb-config', JSON.stringify(cfg))
}

function getTheme(themeId) {
  return THEMES.find(t => t.id === themeId) ?? THEMES[0]
}

function FloatingHeart({ heart, style }) {
  return <span className="floating-heart" style={style}>{heart}</span>
}

function YesScreen({ config }) {
  const theme = getTheme(config.themeId)
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    heart: config.heartEmoji,
    style: {
      left: `${10 + (i * 7.5) % 80}%`,
      animationDuration: `${2 + (i % 3)}s`,
      animationDelay: `${(i * 0.3) % 2}s`,
      fontSize: `${1.5 + (i % 3) * 0.5}rem`,
    },
  }))

  return (
    <div className="screen yes-screen" style={{ background: theme.yes }}>
      {hearts.map(({ id, heart, style }) => (
        <FloatingHeart key={id} heart={heart} style={style} />
      ))}
      <div className="yes-content">
        <div className="yes-emoji">{config.heartEmoji}</div>
        <h1 className="yes-message" style={{ color: theme.text }}>{config.yesMessage}</h1>
        <div className="yes-emoji">{config.heartEmoji}</div>
      </div>
    </div>
  )
}

function AskScreen({ config, onYes, onConfig }) {
  const [noClicks, setNoClicks] = useState(0)
  const theme = getTheme(config.themeId)

  const siScale = 1 + noClicks * 0.65
  const noScale = Math.max(0.25, 1 - noClicks * 0.14)

  const noLabels = [
    'No',
    '\u00bfEst\u00e1s seguro/a?',
    'Pi\u00e9nsalo bien\u2026',
    '\u00a1Nooo!',
    '\u00daltima oportunidad\u2026',
    'Por favor no \u{1F622}',
    'Te lo ruego \u{1F97A}',
    'Okay\u2026 \u{1F62D}',
  ]
  const noLabel = noLabels[Math.min(noClicks, noLabels.length - 1)]

  return (
    <div className="screen ask-screen" style={{ background: theme.ask }}>
      <h1 className="question" style={{ color: theme.text }}>{config.question}</h1>
      <div className="buttons-row">
        <button
          className="btn btn-si"
          style={{ transform: `scale(${siScale})`, transformOrigin: 'center center', background: theme.btnPrimary, '--btn-shadow': theme.btnPrimaryShadow }}
          onClick={onYes}
        >
          Si
        </button>
        <button
          className="btn btn-no"
          style={{ transform: `scale(${noScale})`, transformOrigin: 'center center', background: theme.btnSecBg, color: theme.btnSecColor, borderColor: theme.btnSecBorder, boxShadow: `0 3px 10px ${theme.btnSecShadow}` }}
          onClick={() => setNoClicks((n) => n + 1)}
        >
          {noLabel}
        </button>
      </div>
      <button className="config-link" onClick={onConfig} aria-label="Configuración">Config</button>
    </div>
  )
}

function ConfigScreen({ config, onSave, onBack }) {
  const [form, setForm] = useState({ ...config })
  const theme = getTheme(form.themeId)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleReset() {
    setForm({ ...DEFAULTS })
  }

  function handleSave(e) {
    e.preventDefault()
    saveConfig(form)
    onSave(form)
  }

  return (
    <div className="screen config-screen" style={{ background: theme.ask }}>
      <h2 className="config-title">Configuración</h2>
      <form className="config-form" onSubmit={handleSave}>
        <label className="config-label">
          Pregunta inicial
          <input className="config-input" name="question" value={form.question} onChange={handleChange} />
        </label>
        <label className="config-label">
          Mensaje al decir &quot;Sí&quot;
          <input className="config-input" name="yesMessage" value={form.yesMessage} onChange={handleChange} />
        </label>
        <fieldset className="config-fieldset">
          <span className="config-span">Tema</span>
          <div className="theme-grid">
            {THEMES.map(t => (
              <label
                key={t.id}
                className={`theme-option${form.themeId === t.id ? ' selected' : ''}`}
                style={{ background: t.ask }}
              >
                <input type="radio" name="themeId" value={t.id} checked={form.themeId === t.id} onChange={handleChange} />
                <span style={{ color: t.text }}>{t.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="config-fieldset">
          <span className="config-span">Emoji de corazón</span>
          <div className="heart-grid">
            {HEARTS.map(h => (
              <label key={h} className={`heart-option${form.heartEmoji === h ? ' selected' : ''}`}>
                <input type="radio" name="heartEmoji" value={h} checked={form.heartEmoji === h} onChange={handleChange} />
                <span>{h}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="config-actions">
          <button type="button" className="btn-cfg btn-cfg-reset" style={{ background: theme.btnSecBg, color: theme.btnSecColor, borderColor: theme.btnSecBorder }} onClick={handleReset}>Restablecer</button>
          <button type="button" className="btn-cfg btn-cfg-back" style={{ background: theme.btnSecBg, color: theme.btnSecColor, borderColor: theme.btnSecBorder }} onClick={onBack}>Volver</button>
          <button type="submit" className="btn-cfg btn-cfg-save" style={{ background: theme.btnPrimary, '--btn-shadow': theme.btnPrimaryShadow }}>Guardar</button>
        </div>
      </form>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('ask')
  const [config, setConfig] = useState(loadConfig)

  if (screen === 'yes')
    return <YesScreen config={config} />
  if (screen === 'config')
    return <ConfigScreen config={config} onSave={cfg => { setConfig(cfg); setScreen('ask') }} onBack={() => setScreen('ask')} />
  return <AskScreen config={config} onYes={() => setScreen('yes')} onConfig={() => setScreen('config')} />
}