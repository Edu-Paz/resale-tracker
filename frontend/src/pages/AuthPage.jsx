import AuthForm from '../components/AuthForm'

const authContent = {
  login: {
    eyebrow: 'Acesso',
    title: 'Acesse sua conta',
    intro: 'Continue acompanhando suas compras, vendas e resultados.',
  },
  register: {
    eyebrow: 'Novo cadastro',
    title: 'Crie sua conta',
    intro: 'Comece a organizar suas revendas em poucos passos.',
  },
}

function AuthPage({ type, onNavigate }) {
  const content = authContent[type]

  return (
    <main className="auth-main">
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">Resale Tracker / {content.eyebrow}</p>
        <h1 id="auth-title">{content.title}</h1>
        <p className="auth-intro">{content.intro}</p>
        <AuthForm type={type} onNavigate={onNavigate} />
      </section>
    </main>
  )
}

export default AuthPage
