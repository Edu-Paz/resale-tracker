import { useEffect, useState } from 'react'
import { ApiError, getCategories, getCurrentUser, getItems, sellItem, updateItem } from '../services/api'
import { clearToken, getToken } from '../services/session'
import { routes } from '../routes/appRoutes'
import CategoryForm from '../components/CategoryForm'
import ItemForm from '../components/ItemForm'
import ResultBadge from '../components/ResultBadge'

function getFormErrorMessage(error) {
  if (error instanceof ApiError) return error.message
  return 'Não foi possível concluir a operação. Tente novamente.'
}

function formatDateInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function parseBrazilianDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return null

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null

  return `${year}-${month}-${day}`
}

function validateBrazilianDateInput(event) {
  const input = event.currentTarget
  const value = input.value

  if (!value) {
    input.setCustomValidity('Informe a data da compra.')
  } else if (!parseBrazilianDate(value)) {
    input.setCustomValidity('Digite uma data válida no formato DD/MM/AAAA.')
  } else {
    input.setCustomValidity('')
  }
}

function UserPage({ onNavigate }) {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [sellingItem, setSellingItem] = useState(null)
  const [sellPrice, setSellPrice] = useState('')
  const [sellDate, setSellDate] = useState('')
  const [isSelling, setIsSelling] = useState(false)
  const [sellMessage, setSellMessage] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [editItemCategory, setEditItemCategory] = useState('')
  const [editBuyDate, setEditBuyDate] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editMessage, setEditMessage] = useState(null)

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

  function openSellModal(item) {
    setSellingItem(item)
    setSellPrice('')
    setSellDate('')
  }

  function closeSellModal() {
    setSellingItem(null)
    setSellPrice('')
    setSellDate('')
    setSellMessage(null)
  }

  function openEditItem(item) {
    setEditingItem(item)
    setEditItemCategory(item.category?.id ? String(item.category.id) : '')
    setEditBuyDate(item.buyDate ? formatDateInput(item.buyDate.replace(/-/g, '')) : '')
    setEditMessage(null)
  }

  function closeEditItem() {
    setEditingItem(null)
    setEditItemCategory('')
    setEditBuyDate('')
    setEditMessage(null)
  }

  async function handleEditItemSubmit(event) {
    event.preventDefault()
    if (isEditing || !editingItem) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const parsedBuyDate = parseBrazilianDate(editBuyDate)
    const today = new Date().toISOString().slice(0, 10)
    if (!parsedBuyDate || parsedBuyDate > today) {
      setEditMessage({ type: 'error', text: parsedBuyDate ? 'A data não pode ser futura.' : 'Digite uma data válida no formato DD/MM/AAAA.' })
      return
    }

    const buyPrice = Number(formData.get('buyPrice'))
    const categoryId = Number(formData.get('categoryId'))
    if (!Number.isFinite(buyPrice) || buyPrice <= 0) {
      setEditMessage({ type: 'error', text: 'Preço de compra deve ser maior que zero.' })
      return
    }
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setEditMessage({ type: 'error', text: 'Selecione uma categoria.' })
      return
    }

    const item = {
      name: formData.get('name').trim(),
      buyPrice,
      buyDate: parsedBuyDate,
      categoryId,
    }
    const imgUrl = formData.get('imgUrl').trim()
    if (imgUrl) item.imgUrl = imgUrl

    setIsEditing(true)
    setEditMessage(null)
    try {
      const updatedItem = await updateItem(getToken(), editingItem.id, item)
      setItems((currentItems) => currentItems.map((currentItem) => (currentItem.id === updatedItem.id ? updatedItem : currentItem)))
      closeEditItem()
    } catch (error) {
      setEditMessage({ type: 'error', text: getFormErrorMessage(error) })
    } finally {
      setIsEditing(false)
    }
  }

  async function handleSellSubmit(event) {
    event.preventDefault()
    if (isSelling || !sellingItem) return

    const token = getToken()
    const parsedSellDate = parseBrazilianDate(sellDate)
    const today = new Date().toISOString().slice(0, 10)

    if (!parsedSellDate || parsedSellDate > today) {
      setSellMessage({ type: 'error', text: 'Data de venda inválida ou futura.' })
      return
    }

    const price = Number(sellPrice)
    if (!Number.isFinite(price) || price <= 0) {
      setSellMessage({ type: 'error', text: 'Preço de venda deve ser maior que zero.' })
      return
    }

    setIsSelling(true)
    setSellMessage(null)

    try {
      const updatedItem = await sellItem(token, sellingItem.id, {
        sellPrice: price,
        sellDate: parsedSellDate,
      })
      setItems((currentItems) => currentItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
      const currentUser = await getCurrentUser(token)
      setUser(currentUser)
      closeSellModal()
    } catch (error) {
      setSellMessage({ type: 'error', text: getFormErrorMessage(error) })
    } finally {
      setIsSelling(false)
    }
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

        <nav className="dashboard-tabs" aria-label="Navegação do painel">
          <button className={activeTab === 'overview' ? 'dashboard-tab active' : 'dashboard-tab'} type="button" onClick={() => setActiveTab('overview')}>Visão geral</button>
          <button className={activeTab === 'item' ? 'dashboard-tab active' : 'dashboard-tab'} type="button" onClick={() => setActiveTab('item')}>Adicionar item</button>
          <button className={activeTab === 'category' ? 'dashboard-tab active' : 'dashboard-tab'} type="button" onClick={() => setActiveTab('category')}>Categorias</button>
        </nav>

        {sellingItem && (
          <section className="dashboard-panel form-panel" aria-labelledby="sell-item-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Registrar venda</p>
                <h2 id="sell-item-title">Vender «{sellingItem.name}»</h2>
              </div>
              <button className="inline-action" type="button" onClick={closeSellModal}>Cancelar</button>
            </div>
            <form className="dashboard-form" onSubmit={handleSellSubmit}>
              <label>Preço de compra<strong className="sell-readonly">{formatCurrency(sellingItem.buyPrice)}</strong></label>
              <div className="form-grid">
                <label>Preço de venda<input name="sellPrice" type="number" min="0.01" step="0.01" placeholder="0,00" value={sellPrice} onChange={(event) => { setSellPrice(event.target.value); setSellMessage(null) }} required /></label>
                <label>Data da venda<input name="sellDate" type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={sellDate} onChange={(event) => { setSellDate(formatDateInput(event.target.value)); setSellMessage(null) }} onInvalid={validateBrazilianDateInput} maxLength="10" required /></label>
              </div>
              {sellMessage && <p className={`form-message form-${sellMessage.type}`} role={sellMessage.type === 'error' ? 'alert' : 'status'}>{sellMessage.text}</p>}
              <button className="cta-button" type="submit" disabled={isSelling || !sellPrice || !sellDate}>{isSelling ? 'Registrando...' : 'Registrar venda'}</button>
            </form>
          </section>
        )}

        {editingItem && (
          <section className="dashboard-panel form-panel" aria-labelledby="edit-item-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Atualizar estoque</p>
                <h2 id="edit-item-title">Editar «{editingItem.name}»</h2>
              </div>
              <button className="inline-action" type="button" onClick={closeEditItem}>Cancelar</button>
            </div>
            <form className="dashboard-form" onSubmit={handleEditItemSubmit}>
              <label>Nome do item<input name="name" defaultValue={editingItem.name} required /></label>
              <div className="form-grid">
                <label>Preço de compra<input name="buyPrice" type="number" min="0.01" step="0.01" defaultValue={editingItem.buyPrice} required /></label>
                <label>Data da compra<input name="buyDate" type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={editBuyDate} onChange={(event) => { setEditBuyDate(formatDateInput(event.target.value)); setEditMessage(null) }} maxLength="10" required /></label>
              </div>
              <label>Imagem <span className="optional-label">(opcional)</span><input name="imgUrl" type="url" defaultValue={editingItem.imgUrl || ''} placeholder="https://..." /></label>
              <label>Categoria
                <select name="categoryId" value={editItemCategory} onChange={(event) => { setEditItemCategory(event.target.value); setEditMessage(null) }} required>
                  <option value="" disabled>Selecione uma categoria</option>
                  {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
                </select>
              </label>
              {editMessage && <p className={`form-message form-${editMessage.type}`} role="alert">{editMessage.text}</p>}
              <button className="cta-button" type="submit" disabled={isEditing}>{isEditing ? 'Salvando...' : 'Salvar alterações'}</button>
            </form>
          </section>
        )}

        {activeTab === 'overview' && <section className="metric-grid" aria-label="Resumo financeiro">
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
        </section>}

        {activeTab === 'item' && <ItemForm categories={categories} onItemCreated={(item) => setItems((currentItems) => [...currentItems, item])} onCategoryCreated={(category) => setCategories((currentCategories) => [...currentCategories, category])} />}

        {activeTab === 'category' && <CategoryForm categories={categories} onCategoryCreated={(category) => setCategories((currentCategories) => [...currentCategories, category])} />}

        {activeTab === 'overview' && <div className="dashboard-columns">
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
              <ul className="item-list">
                {availableItems.slice(0, 5).map((item) => (
                  <li className="item-row available" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.category?.name || 'Sem categoria'}</span>
                    </div>
                    <div className="item-actions">
                      <strong>{formatCurrency(item.buyPrice)}</strong>
                      <span className="stock-tag">Em estoque</span>
                      <div className="item-actions-buttons">
                        <button className="secondary-button" onClick={() => openEditItem(item)} aria-label={`Editar ${item.name}`}>Editar</button>
                        <button className="secondary-button" onClick={() => openSellModal(item)} aria-label={`Vender ${item.name}`}>Vender</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
                  <article className="item-row sold" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>Compra: {formatCurrency(item.buyPrice)} · Venda: {formatCurrency(item.sellPrice)}</span>
                      <span>{formatDate(item.sellDate)}</span>
                    </div>
                    <div className="item-actions-buttons">
                      <ResultBadge profit={item.profit} margin={item.margin} />
                      <button className="secondary-button" onClick={() => openEditItem(item)} aria-label={`Editar ${item.name}`}>Editar</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>}

        {activeTab === 'overview' && <section className="dashboard-footer" aria-label="Resumo da conta">
          <span><strong>{categories.length}</strong> {categories.length === 1 ? 'categoria criada' : 'categorias criadas'}</span>
          <span><strong>{availableItems.length}</strong> {availableItems.length === 1 ? 'item aguardando venda' : 'itens aguardando venda'}</span>
        </section>}
      </div>
    </main>
  )
}

export default UserPage