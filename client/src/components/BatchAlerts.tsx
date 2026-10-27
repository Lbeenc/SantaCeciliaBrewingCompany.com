import { useState, type FormEvent } from 'react'
import { api } from '../api'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; added: boolean } | { kind: 'error'; message: string }

export function BatchAlerts() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus({ kind: 'sending' })
    try {
      const { added } = await api.subscribe(email)
      setStatus({ kind: 'done', added })
      setEmail('')
    } catch (err) {
      setStatus({ kind: 'error', message: (err as Error).message })
    }
  }

  return (
    <section id="alerts" className="alerts">
      <div className="wrap alerts-inner">
        <div className="alerts-copy">
          <h2 className="display">Batch alerts</h2>
          <p>Get an email when a new batch is ready, or when we're pouring at an event.</p>
        </div>
        <form className="alerts-form" onSubmit={submit} noValidate>
          <div className="alerts-field">
            <label htmlFor="alert-email" className="visually-hidden">Email address</label>
            <input
              id="alert-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={status.kind === 'error'}
              aria-describedby="alert-msg"
            />
            <button type="submit" className="btn btn-solid" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Signing up…' : 'Sign up'}
            </button>
          </div>
          <p id="alert-msg" role="status" className={`form-msg ${status.kind === 'error' ? 'error' : ''}`}>
            {status.kind === 'done' && (status.added ? "You're on the list." : "You're already on the list.")}
            {status.kind === 'error' && status.message}
          </p>
        </form>
      </div>
    </section>
  )
}
