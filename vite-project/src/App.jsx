import { useState } from 'react'
import './App.css'

const emails = [
  { score: 95, spam: true },
  { score: 85, spam: true },
  { score: 78, spam: false },
  { score: 72, spam: true },
  { score: 65, spam: false },
  { score: 55, spam: true },
  { score: 45, spam: false },
  { score: 35, spam: true },
  { score: 25, spam: false },
  { score: 15, spam: false },
]

function App() {
  const [answer, setAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [threshold, setThreshold] = useState(50)

  const predictions = emails.map(email => ({
    ...email,
    predicted: email.score >= threshold,
  }))

  const tp = predictions.filter(e => e.spam && e.predicted).length
  const fp = predictions.filter(e => !e.spam && e.predicted).length
  const fn = predictions.filter(e => e.spam && !e.predicted).length
  const tn = predictions.filter(e => !e.spam && !e.predicted).length

  const precision = tp + fp ? Math.round(tp / (tp + fp) * 100) : 0
  const recall = tp + fn ? Math.round(tp / (tp + fn) * 100) : 0
    const chartData = Array.from({ length: 17 }, (_, i) => {
    const t = 10 + i * 5
    const flagged = emails.filter(e => e.score >= t)
    const correct = flagged.filter(e => e.spam).length
    const actualSpam = emails.filter(e => e.spam).length

    return {
      threshold: t,
      precision: flagged.length
        ? (correct / flagged.length) * 100
        : 0,
      recall: actualSpam
        ? (correct / actualSpam) * 100
        : 0,
    }
  })

  const chartX = t => 42 + ((t - 10) / 80) * 350
  const chartY = value => 18 + ((100 - value) / 100) * 145

  const precisionPath = chartData
    .map((d, i) => `${i ? 'L' : 'M'} ${chartX(d.threshold)} ${chartY(d.precision)}`)
    .join(' ')

  const recallPath = chartData
    .map((d, i) => `${i ? 'L' : 'M'} ${chartX(d.threshold)} ${chartY(d.recall)}`)
    .join(' ')

  const currentX = chartX(threshold)

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">🧠 <span>ConceptLab</span></div>
        <p className="menu-label">LEARNING SPACE</p>
        <button className="menu active">✦ Concept Explorer</button>
        <button className="menu" onClick={() => document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' })}>⚗️ Experiment Lab</button>
        <button className="menu" onClick={() => document.getElementById('progress').scrollIntoView({ behavior: 'smooth' })}>📊 My Progress</button>
        <div className="sidebar-bottom">
          <span>✦</span>
          <p>Understand concepts.<br />Don't just memorize.</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="breadcrumb">Learning Space / <b>Concept Explorer</b></span>
          <span className="profile">H</span>
        </header>

        <section className="hero">
          <span className="eyebrow">✦ LEARN BY DISCOVERING</span>
          <h1>Confused between<br /><span>two concepts?</span></h1>
          <p>Explore the difference. Test your understanding.<br />
            Discover the concept instead of memorising it.</p>
        </section>

        <section className="experiment-card">
          <div className="card-heading">
            <div>
              <span className="tag">YOUR FIRST EXPERIMENT</span>
              <h2>Precision vs Recall</h2>
              <p>Explore how a model's decision threshold changes its predictions.</p>
            </div>
            <div className="experiment-icon">⚗</div>
          </div>

          <div className="concepts">
            <div className="concept precision">
              <span className="concept-symbol">P</span>
              <div>
                <h3>Precision</h3>
                <p>Of predicted positives, how many were correct?</p>
              </div>
            </div>
            <div className="versus">VS</div>
            <div className="concept recall">
              <span className="concept-symbol">R</span>
              <div>
                <h3>Recall</h3>
                <p>Of actual positives, how many did we find?</p>
              </div>
            </div>
          </div>

          <div className="question">
            <span className="step">01 — MAKE A PREDICTION</span>
            <h3>A model flags 10 emails as spam. 8 really are spam.</h3>
            <p>What is the model's precision?</p>

            <div className="options">
              {['60%', '80%', '100%'].map(option => (
                <button
                  key={option}
                  className={`option ${answer === option ? 'selected' : ''}`}
                  onClick={() => {
                    setAnswer(option)
                    setShowResult(false)
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              className="primary-button"
              disabled={!answer}
              onClick={() => setShowResult(true)}
            >
              Check my answer <span>→</span>
            </button>

            {showResult && (
              <div className={`feedback ${answer === '80%' ? 'correct' : 'incorrect'}`}>
                <h3>{answer === '80%' ? '🎉 Correct! Great thinking.' : '💡 Not quite — try again!'}</h3>
                <p>Precision = True Positives ÷ All Predicted Positives. Here, 8 ÷ 10 = 80%.</p>
                <p>Precision measures how many positive predictions were correct.</p>
              </div>
            )}
          </div>
        </section>

        <section className="experiment-card simulator" id="simulator">
          <span className="tag">02 — INTERACTIVE EXPERIMENT</span>
          <h2>Spam Detection Simulator</h2>
          <p className="sim-description">
            Move the threshold slider. Observe how the model's predictions,
            precision, and recall change.
          </p>

          <div className="slider-heading">
            <label htmlFor="threshold">Prediction threshold</label>
            <strong>{threshold}%</strong>
          </div>

          <input
            id="threshold"
            className="threshold-slider"
            type="range"
            min="10"
            max="90"
            step="5"
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
          />

          <div className="slider-labels">
            <span>More emails flagged</span>
            <span>Fewer emails flagged</span>
          </div>

          <div className="metrics">
            <div className="metric metric-purple">
              <span>PRECISION</span>
              <strong>{precision}%</strong>
              <small>{tp} correct / {tp + fp} flagged</small>
            </div>
            <div className="metric metric-blue">
              <span>RECALL</span>
              <strong>{recall}%</strong>
              <small>{tp} found / {tp + fn} actual spam</small>
            </div>
          </div>
                    {/* Precision vs Recall Graph */}
          <div className="chart-card">
            <div className="chart-heading">
              <div>
                <span className="tag">LIVE PERFORMANCE</span>
                <h3>Precision vs Recall</h3>
                <p>Move the threshold to compare both metrics.</p>
              </div>
              <span className="chart-threshold">{threshold}%</span>
            </div>

            <div className="chart-legend">
              <span><i className="legend-precision" /> Precision</span>
              <span><i className="legend-recall" /> Recall</span>
            </div>

            <div className="chart-scroll">
              <svg
                viewBox="0 0 420 205"
                className="performance-chart"
                role="img"
                aria-label="Precision and recall across prediction thresholds"
              >
                {[0, 25, 50, 75, 100].map(value => (
                  <g key={value}>
                    <line
                      x1="42"
                      y1={chartY(value)}
                      x2="395"
                      y2={chartY(value)}
                      stroke="#ebe8f3"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="33"
                      y={chartY(value) + 4}
                      textAnchor="end"
                      fill="#89869e"
                      fontSize="10"
                    >
                      {value}%
                    </text>
                  </g>
                ))}

                <line
                  x1={currentX}
                  y1="18"
                  x2={currentX}
                  y2="163"
                  stroke="#a78bfa"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />

                <path
                  d={precisionPath}
                  fill="none"
                  stroke="#8056db"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d={recallPath}
                  fill="none"
                  stroke="#3985e8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx={currentX}
                  cy={chartY(precision)}
                  r="5"
                  fill="#8056db"
                  stroke="white"
                  strokeWidth="2"
                />

                <circle
                  cx={currentX}
                  cy={chartY(recall)}
                  r="5"
                  fill="#3985e8"
                  stroke="white"
                  strokeWidth="2"
                />

                {[10, 30, 50, 70, 90].map(t => (
                  <text
                    key={t}
                    x={chartX(t)}
                    y="185"
                    textAnchor="middle"
                    fill="#89869e"
                    fontSize="10"
                  >
                    {t}
                  </text>
                ))}

                <text
                  x="218"
                  y="202"
                  textAnchor="middle"
                  fill="#77748f"
                  fontSize="10"
                >
                  Prediction threshold (%)
                </text>
              </svg>
            </div>

            <div className="chart-insight">
              <strong>Current threshold: {threshold}%</strong>
              <p>Precision: {precision}% · Recall: {recall}%</p>
              <p>
                Compare both lines while moving the slider.
                A higher threshold may reduce false alarms but can
                also miss actual spam.
              </p>
            </div>
          </div>

          <div className="counts">
            <div><span className="dot green" /> True positives <b>{tp}</b></div>
            <div><span className="dot orange" /> False positives <b>{fp}</b></div>
            <div><span className="dot blue" /> True negatives <b>{tn}</b></div>
            <div><span className="dot red" /> False negatives <b>{fn}</b></div>
          </div>

          <div className="email-results">
            <h3>📩 Email-by-email results</h3>
            <div className="email-grid">
              {predictions.map((email, index) => (
                <div className="email-item" key={index}>
                  <span>Email {index + 1}</span>
                  <b>{email.score}%</b>
                  <small>{email.spam ? 'Actually spam' : 'Not spam'}</small>
                  <em className={email.predicted ? 'flagged' : 'not-flagged'}>
                    {email.predicted ? 'Flagged as spam' : 'Not flagged'}
                  </em>
                </div>
              ))}
            </div>
          </div>

          <div className="insight">
            <h3>💡 What does this tell you?</h3>
            {threshold >= 70
              ? 'A high threshold makes the model more selective. It may reduce false alarms, but miss some real spam.'
              : threshold <= 35
                ? 'A low threshold flags more emails. It may catch more real spam, but also flag legitimate emails.'
                : 'Try raising and lowering the threshold. Notice how precision and recall respond to the model’s decisions.'}
          </div>
        </section>

        <section className="experiment-card" id="progress">
          <span className="tag">03 — TEST YOUR UNDERSTANDING</span>
          <h2>Experiment challenge</h2>
          <p className="sim-description">
            If missing real spam is the biggest concern, which metric should you focus on?
          </p>
          <div className="options">
            <button className="option" onClick={e => {
              e.currentTarget.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'))
              e.currentTarget.classList.add('selected')
              document.getElementById('challenge-feedback').textContent =
                'Not quite. Precision measures how many flagged emails were actually spam.'
              document.getElementById('challenge-feedback').className = 'feedback incorrect'
            }}>Precision</button>
            <button className="option" onClick={e => {
              e.currentTarget.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'))
              e.currentTarget.classList.add('selected')
              document.getElementById('challenge-feedback').textContent =
                '🎉 Correct! Recall measures how many actual spam emails the model successfully finds.'
              document.getElementById('challenge-feedback').className = 'feedback correct'
            }}>Recall</button>
          </div>
          <div id="challenge-feedback" aria-live="polite" />
        </section>

        <footer>CONCEPT COLLISION LAB <span>•</span> Learn through discovery ✨</footer>
      </main>
    </div>
  )
}

export default App