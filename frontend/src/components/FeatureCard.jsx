function FeatureCard({ index, title, description }) {
  return (
    <article className="rounded-md border border-line bg-surface p-6 transition-[border-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-neon hover:shadow-[0_12px_28px_-16px_rgba(34,197,94,0.35)]">
      <span className="font-mono text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-mint">
        {index}
      </span>
      <h3 className="mt-4 mb-2 font-sans text-[1.125rem] font-semibold text-text">{title}</h3>
      <p className="m-0 text-[0.9375rem] text-muted">{description}</p>
    </article>
  )
}

export default FeatureCard
