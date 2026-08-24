function ResultBadge({ profit, margin }) {
  const isProfit = Number(profit) >= 0
  const label = isProfit ? 'LUCRO' : 'PREJUÍZO'
  const value = Number(Math.abs(profit)).toFixed(2).replace('.', ',')
  const marginValue = Number(Math.abs(margin)).toFixed(1).replace('.', ',')

  return (
    <span
      className={`result-badge ${isProfit ? 'result-badge--profit' : 'result-badge--loss'}`}
      role="status"
      aria-label={`${label} de R$ ${value}`}
    >
      <span className="result-badge__label">{label}</span>
      <span className="result-badge__value">{isProfit ? '+' : '−'}R$ {value}</span>
      <span className="result-badge__margin">({marginValue}%)</span>
    </span>
  )
}

export default ResultBadge