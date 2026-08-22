import AuthForm from '../components/AuthForm'

function RegisterPage() {
  return (
    <main className="auth-main">
      <section className="auth-card" aria-labelledby="register-title">
        <p className="eyebrow">Resale Tracker / Novo cadastro</p>
        <h1 id="register-title">Crie sua conta</h1>
        <p className="auth-intro">Comece a organizar suas revendas em poucos passos.</p>
        <AuthForm isLogin={false} />
      </section>
    </main>
  )
}

export default RegisterPage
