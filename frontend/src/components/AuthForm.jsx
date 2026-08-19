import { routes } from '../routes'

function AuthForm({ isLogin }) {
  return (
    <>
      <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
        {!isLogin && (
          <label>
            Nome de usuário
            <input type="text" name="username" placeholder="como você quer ser chamado" required />
          </label>
        )}
        <label>
          E-mail
          <input type="email" name="email" placeholder="voce@exemplo.com" required />
        </label>
        <label>
          Senha
          <input type="password" name="password" placeholder="mínimo de 8 caracteres" minLength="8" required />
        </label>
        {!isLogin && (
          <label>
            Confirme sua senha
            <input type="password" name="passwordConfirmation" placeholder="repita sua senha" minLength="8" required />
          </label>
        )}
        <button className="cta-button form-submit" type="submit">{isLogin ? 'Entrar' : 'Criar minha conta'}</button>
      </form>

      <p className="auth-switch">
        {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}{' '}
        <a href={isLogin ? routes.register : routes.login}>{isLogin ? 'Criar conta' : 'Acessar minha conta'}</a>
      </p>
    </>
  )
}

export default AuthForm
