import { useEffect, useState } from 'react'
import { ApiError, getCategories, getCurrentUser, getItems } from '../services/api'
import { clearToken, getToken } from '../services/session'
import { routes } from '../routes/appRoutes'

function UserPage({ onNavigate }) {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      onNavigate(routes.login)
      return
    }

    Promise.all([getCurrentUser(token), getItems(token), getCategories(token)])
      .then(([currentUser, userItems, userCategories]) => {
        setUser(currentUser)
        setItems(userItems)
        setCategories(userCategories)
      })
      .catch((error) => {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearToken()
          onNavigate(routes.login)
          return
        }
        setErrorMessage('Não foi possível carregar seus dados. Tente novamente.')
      })
  }, [onNavigate])

  function handleLogout() {
    clearToken()
    onNavigate(routes.login)
  }

  if (errorMessage) {
    return <main className="user-main"><p className="form-message form-error" role="alert">{errorMessage}</p></main>
  }

  if (!user) {
    return <main className="user-main"><p className="user-loading" role="status">Carregando seus dados...</p></main>
  }

  const availableItems = items.filter((item) => item.status === 'AVAILABLE')
  const soldItems = items.filter((item) => item.status === 'SOLD')
  const totalProfit = soldItems.reduce((total, item) => total + Number(item.profit || 0), 0)
  const totalInvested = items.reduce((total, item) => total + Number(item.buyPrice || 0), 0)
  const totalLoss = soldItems.reduce((total, item) => {
    const profit = Number(item.profit || 0)
    return total + (profit < 0 ? Math.abs(profit) : 0)
  }, 0)
  const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`
  const formatDate = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR') : 'Sem data'

  return (
    <main className="user-main dashboard-main">
      <div className="dashboard-shell">
        <section className="dashboard-header" aria-labelledby="user-title">
          <div>
            <p className="eyebrow">Painel de controle</p>
            <h1 id="user-title">Olá, {user.username}.</h1>
            <p className="dashboard-intro">Acompanhe o movimento da sua operação em um só lugar.</p>
          </div>
          <button className="secondary-button" type="button" onClick={handleLogout}>Sair</button>
        </section>

        <section className="metric-grid" aria-label="Resumo financeiro">
          <article className="metric-card metric-card-highlight">
            <span className="user-label">Saldo acumulado</span>
            <strong>{formatCurrency(user.balance)}</strong>
            <span className="metric-detail">Resultado atual</span>
          </article>
          <article className="metric-card">
            <span className="user-label">Lucro realizado</span>
            <strong className="metric-profit">{formatCurrency(totalProfit)}</strong>
            <span className="metric-detail">{soldItems.length} {soldItems.length === 1 ? 'venda concluída' : 'vendas concluídas'}</span>
          </article>
          <article className="metric-card">
            <span className="user-label">Prejuízo</span>
            <strong className="metric-loss">{formatCurrency(totalLoss)}</strong>
            <span className="metric-detail">Nas vendas abaixo do custo</span>
          </article>
          <article className="metric-card">
            <span className="user-label">Capital em estoque</span>
            <strong>{formatCurrency(totalInvested)}</strong>
            <span className="metric-detail">{items.length} {items.length === 1 ? 'item cadastrado' : 'itens cadastrados'}</span>
          </article>
        </section>

        <div className="dashboard-columns">
          <section className="dashboard-panel" aria-labelledby="available-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Estoque ativo</p>
                <h2 id="available-title">Itens à venda</h2>
              </div>
              <span className="panel-count">{availableItems.length}</span>
            </div>
            {availableItems.length === 0 ? (
              <p className="empty-state">Nenhum item disponível para venda.</p>
            ) : (
              <div className="item-list">
                {availableItems.slice(0, 5).map((item) => (
                  <article className="item-row" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.category?.name || 'Sem categoria'}</span>
                    </div>
                    <strong>{formatCurrency(item.buyPrice)}</strong>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-panel" aria-labelledby="activity-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Histórico</p>
                <h2 id="activity-title">Últimas vendas</h2>
              </div>
              <span className="panel-count">{soldItems.length}</span>
            </div>
            {soldItems.length === 0 ? (
              <p className="empty-state">Suas vendas concluídas aparecerão aqui.</p>
            ) : (
              <div className="item-list">
                {soldItems.slice(-5).reverse().map((item) => (
                  <article className="item-row" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{formatDate(item.sellDate)}</span>
                    </div>
                    <strong className={Number(item.profit) >= 0 ? 'metric-profit' : 'metric-loss'}>
                      {formatCurrency(item.profit)}
                    </strong>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="dashboard-footer" aria-label="Resumo da conta">
          <span><strong>{categories.length}</strong> {categories.length === 1 ? 'categoria criada' : 'categorias criadas'}</span>
          <span><strong>{availableItems.length}</strong> {availableItems.length === 1 ? 'item aguardando venda' : 'itens aguardando venda'}</span>
        </section>
      </div>
    </main>
  )
}

export default UserPage