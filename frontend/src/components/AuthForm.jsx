import { useState } from 'react'
import { routes } from '../routes/appRoutes'
import { ApiError, login, register } from '../services/api'
import AppLink from './AppLink'

function getErrorMessage(error, isLogin) {
  if (error instanceof ApiError) {
    if (error.status === 400) return error.message
    if (error.status === 403 && isLogin) return error.message || 'Usuário ou senha inválidos.'
    if (error.status === 404) return 'Serviço de autenticação não encontrado.'
    if (error.status >= 500) return 'O servidor está indisponível no momento.'
    return error.message
  }

  return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
}

function setValidationMessage(event) {
  const input = event.currentTarget

  if (input.validity.valueMissing) {
    input.setCustomValidity('Este campo é obrigatório.')
  } else if (input.validity.tooShort) {
    input.setCustomValidity(`Digite pelo menos ${input.minLength} caracteres.`)
  } else if (input.validity.tooLong) {
    input.setCustomValidity(`Digite no máximo ${input.maxLength} caracteres.`)
  } else {
    input.setCustomValidity('')
  }
}

function AuthForm({ type, onNavigate, onAuthSuccess }) {
  const isLogin = type === 'login'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  function handlePasswordInput(event) {
    const form = event.currentTarget.form
    const passwordsAreDifferent = form.password.value !== form.passwordConfirmation.value

    setPasswordMismatch(passwordsAreDifferent)
    if (!passwordsAreDifferent) setErrorMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const username = formData.get('username').trim()
    const password = formData.get('password')
    const passwordConfirmation = formData.get('passwordConfirmation')

    setErrorMessage('')
    setSuccessMessage('')

    if (!isLogin && password !== passwordConfirmation) {
      setPasswordMismatch(true)
      setErrorMessage('As senhas precisam ser iguais.')
      return
    }

    setPasswordMismatch(false)

    setIsSubmitting(true)
    try {
      if (isLogin) {
        const response = await login({ username, password })
        onAuthSuccess(response.token)
      } else {
        await register({ username, password, passwordConfirmation })
        setSuccessMessage('Conta criada. Agora você já pode acessar sua conta.')
        form.reset()
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, isLogin))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Nome de usuário
          <input type="text" name="username" placeholder="Usuario" minLength="3" maxLength="20" required onInvalid={setValidationMessage} onInput={setValidationMessage} />
        </label>
        <label>
          Senha
          <input type="password" name="password" placeholder="Mínimo 6 caractéres" minLength="6" required aria-invalid={!isLogin && passwordMismatch} className={!isLogin && passwordMismatch ? 'input-error' : ''} onInvalid={setValidationMessage} onInput={(event) => { setValidationMessage(event); handlePasswordInput(event) }} />
        </label>
        {!isLogin && (
          <label>
            Confirme sua senha
            <input type="password" name="passwordConfirmation" placeholder="Repita sua senha" minLength="6" required aria-invalid={passwordMismatch} className={passwordMismatch ? 'input-error' : ''} onInvalid={setValidationMessage} onInput={(event) => { setValidationMessage(event); handlePasswordInput(event) }} />
          </label>
        )}
        {errorMessage && <p className="form-message form-error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="form-message form-success" role="status">{successMessage}</p>}
        <button className="cta-button form-submit" type="submit">
          {isSubmitting ? 'Enviando...' : isLogin ? 'Entrar' : 'Criar minha conta'}
        </button>
      </form>

      <p className="auth-switch">
        {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}{' '}
        <AppLink href={isLogin ? routes.register : routes.login} onNavigate={onNavigate}>
          {isLogin ? 'Criar conta' : 'Acessar minha conta'}
        </AppLink>
      </p>
    </>
  )
}

export default AuthForm
