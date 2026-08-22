function FeatureCard({ index, title, description }) {
  return (
    <article className="feature-card">
      <span className="feature-index">{index}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export default FeatureCard
