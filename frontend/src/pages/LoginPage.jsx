import AuthForm from '../components/AuthForm'

function LoginPage() {
  return (
    <main className="auth-main">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">Resale Tracker / Acesso</p>
        <h1 id="login-title">Acesse sua conta</h1>
        <p className="auth-intro">Continue acompanhando suas compras, vendas e resultados.</p>
        <AuthForm isLogin />
      </section>
    </main>
  )
}

export default LoginPage
