import {useEffect, useState} from 'react'
import {ApiError, deleteItem, getCategories, getCurrentUser, getItems, sellItem, updateItem} from '../services/api'
import {clearToken, getToken} from '../services/session'
import {routes} from '../routes/appRoutes'
import CategoryForm from '../components/CategoryForm'
import ItemForm from '../components/ItemForm'
import ItemList from '../components/ItemList'
import ResultBadge from '../components/ResultBadge'

function getFormErrorMessage(error) {
    if (error instanceof ApiError) {
        if (/sell date.*before.*buy date/i.test(error.message) || (/sell date/i.test(error.message) && /buy date/i.test(error.message))) {
            return 'A data de venda não pode ser anterior à data de compra.'
        }
        if (/buy date.*future/i.test(error.message)) {
            return 'A data de compra não pode ser futura.'
        }
        if (/sell date.*future/i.test(error.message)) {
            return 'A data de venda não pode ser futura.'
        }
        return error.message
    }
    return 'Não foi possível concluir a operação. Tente novamente.'
}

function parseDateInput(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) return null

    const [, year, month, day] = match
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null

    return value
}

function formatCurrency(value) {
    return `R$ ${Number(value).toFixed(2).replace('.', ',')}`
}

function formatDate(date) {
    return date ? new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR') : 'Sem data'
}

function validateItemFormInput({ name, buyPrice, buyDate, categoryId, status, sellPrice, sellDate }) {
    const today = new Date().toISOString().slice(0, 10)

    const parsedBuyDate = parseDateInput(buyDate)
    if (!parsedBuyDate) {
        return { error: 'Digite uma data válida no formato DD/MM/AAAA.' }
    }
    if (parsedBuyDate > today) {
        return { error: 'A data de compra não pode ser futura.' }
    }
    if (!Number.isFinite(buyPrice) || buyPrice <= 0) {
        return { error: 'Preço de compra deve ser maior que zero.' }
    }
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return { error: 'Selecione uma categoria.' }
    }

    let parsedSellDate = null
    let parsedSellPrice = null

    if (status === 'SOLD') {
        parsedSellPrice = Number(sellPrice)
        if (!Number.isFinite(parsedSellPrice) || parsedSellPrice <= 0) {
            return { error: 'Preço de venda deve ser maior que zero.' }
        }

        parsedSellDate = parseDateInput(sellDate)
        if (!parsedSellDate) {
            return { error: 'Digite uma data válida no formato DD/MM/AAAA.' }
        }
        if (parsedSellDate > today) {
            return { error: 'A data de venda não pode ser futura.' }
        }
        if (parsedSellDate < parsedBuyDate) {
            return { error: 'A data de venda não pode ser anterior à data de compra.' }
        }
    }

    return {
        data: {
            name: name.trim(),
            buyPrice,
            buyDate: parsedBuyDate,
            categoryId,
            status,
            sellPrice: status === 'SOLD' ? parsedSellPrice : null,
            sellDate: status === 'SOLD' ? parsedSellDate : null,
        }
    }
}

function SellItemPanel({
    sellingItem,
    sellPrice,
    sellDate,
    isSelling,
    sellMessage,
    onClose,
    onSubmit,
    onPriceChange,
    onDateChange,
}) {
    const today = new Date().toISOString().slice(0, 10)

    return (
        <section className="dashboard-panel form-panel" aria-labelledby="sell-item-title">
            <div className="panel-heading">
                <div>
                    <p className="eyebrow">Registrar venda</p>
                    <h2 id="sell-item-title">Vender «{sellingItem.name}»</h2>
                </div>
                <button className="inline-action" type="button" onClick={onClose}>Cancelar</button>
            </div>
            <form className="dashboard-form" onSubmit={onSubmit}>
                <label>
                    <span>Preço de compra</span>
                    <strong className="sell-readonly">{formatCurrency(sellingItem.buyPrice)}</strong>
                </label>
                <div className="form-grid">
                    <label>
                        <span>Preço de venda</span>
                        <input
                            name="sellPrice"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0,00"
                            value={sellPrice}
                            onChange={onPriceChange}
                            required
                        />
                    </label>
                    <label>
                        <span>Data da venda</span>
                        <input
                            name="sellDate"
                            type="date"
                            lang="pt-BR"
                            min={sellingItem.buyDate || undefined}
                            max={today}
                            value={sellDate}
                            onChange={onDateChange}
                            required
                        />
                    </label>
                </div>
                {sellMessage && (
                    <output
                        className={`form-message form-${sellMessage.type}`}
                        role={sellMessage.type === 'error' ? 'alert' : undefined}
                    >
                        {sellMessage.text}
                    </output>
                )}
                <button
                    className="cta-button"
                    type="submit"
                    disabled={isSelling || !sellPrice || !sellDate}
                >
                    {isSelling ? 'Registrando...' : 'Registrar venda'}
                </button>
            </form>
        </section>
    )
}

function EditItemPanel({
    editingItem,
    categories,
    editItemCategory,
    editBuyDate,
    editStatus,
    editSellPrice,
    editSellDate,
    isEditing,
    editMessage,
    onClose,
    onSubmit,
    onCategoryChange,
    onBuyDateChange,
    onStatusChange,
    onSellPriceChange,
    onSellDateChange,
}) {
    const today = new Date().toISOString().slice(0, 10)

    return (
        <section className="dashboard-panel form-panel" aria-labelledby="edit-item-title">
            <div className="panel-heading">
                <div>
                    <p className="eyebrow">Atualizar estoque</p>
                    <h2 id="edit-item-title">Editar «{editingItem.name}»</h2>
                </div>
                <button className="inline-action" type="button" onClick={onClose}>Cancelar</button>
            </div>
            <form className="dashboard-form" onSubmit={onSubmit}>
                <label>
                    <span>Nome do item</span>
                    <input name="name" defaultValue={editingItem.name} required />
                </label>
                <div className="form-grid">
                    <label>
                        <span>Preço de compra</span>
                        <input
                            name="buyPrice"
                            type="number"
                            min="0.01"
                            step="0.01"
                            defaultValue={editingItem.buyPrice}
                            required
                        />
                    </label>
                    <label>
                        <span>Data da compra</span>
                        <input
                            name="buyDate"
                            type="date"
                            lang="pt-BR"
                            max={today}
                            value={editBuyDate}
                            onChange={onBuyDateChange}
                            required
                        />
                    </label>
                </div>
                <label>
                    <span>Imagem <span className="optional-label">(opcional)</span></span>
                    <input
                        name="imgUrl"
                        type="url"
                        defaultValue={editingItem.imgUrl || ''}
                        placeholder="https://..."
                    />
                </label>
                <label>
                    <span>Categoria</span>
                    <select
                        name="categoryId"
                        value={editItemCategory}
                        onChange={onCategoryChange}
                        required
                    >
                        <option value="" disabled>Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option value={category.id} key={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Status do item</span>
                    <select
                        name="status"
                        value={editStatus}
                        onChange={onStatusChange}
                        required
                    >
                        <option value="AVAILABLE">Em estoque</option>
                        <option value="SOLD">Vendido</option>
                    </select>
                </label>
                {editStatus === 'AVAILABLE' && editingItem.status === 'SOLD' && (
                    <p className="form-hint">
                        Ao reverter o status para «Em estoque», os dados da venda (preço, data, lucro e margem) serão removidos e o saldo atualizado.
                    </p>
                )}
                {editStatus === 'SOLD' && (
                    <div className="form-grid">
                        <label>
                            <span>Preço de venda</span>
                            <input
                                name="sellPrice"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0,00"
                                value={editSellPrice}
                                onChange={onSellPriceChange}
                                required
                            />
                        </label>
                        <label>
                            <span>Data da venda</span>
                            <input
                                name="sellDate"
                                type="date"
                                lang="pt-BR"
                                min={editBuyDate || undefined}
                                max={today}
                                value={editSellDate}
                                onChange={onSellDateChange}
                                required
                            />
                        </label>
                    </div>
                )}
                {editMessage && (
                    <output
                        className={`form-message form-${editMessage.type}`}
                        role={editMessage.type === 'error' ? 'alert' : undefined}
                    >
                        {editMessage.text}
                    </output>
                )}
                <button className="cta-button" type="submit" disabled={isEditing}>
                    {isEditing ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </form>
        </section>
    )
}

function DeleteItemDialog({ item, error, isDeleting, onCancel, onConfirm }) {
    if (!item) return null

    return (
        <dialog open className="modal-backdrop" aria-labelledby="delete-dialog-title">
            <div className="modal-dialog">
                <p className="eyebrow">Confirmação</p>
                <h3 id="delete-dialog-title">Excluir «{item.name}»?</h3>
                <p>
                    Esta ação removerá a ficha do item permanentemente do seu estoque.
                    {item.status === 'SOLD' ? ' Como este item foi registrado como vendido, o saldo acumulado será recalculado.' : ''}
                </p>
                {error && <output className="form-message form-error" role="alert">{error}</output>}
                <div className="modal-actions">
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>
                    <button
                        className="destructive-button destructive-button--fill"
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Excluindo...' : 'Confirmar exclusão'}
                    </button>
                </div>
            </div>
        </dialog>
    )
}

function OverviewTab({
    user,
    items,
    categories,
    availableItems,
    soldItems,
    onEditItem,
    onSellItem,
}) {
    const totalProfit = soldItems.reduce((total, item) => total + Number(item.profit || 0), 0)
    const totalInvested = items.reduce((total, item) => total + Number(item.buyPrice || 0), 0)
    const totalLoss = soldItems.reduce((total, item) => {
        const profit = Number(item.profit || 0)
        return total + (profit < 0 ? Math.abs(profit) : 0)
    }, 0)

    const soldCountLabel = soldItems.length === 1 ? 'venda concluída' : 'vendas concluídas'
    const itemsCountLabel = items.length === 1 ? 'item cadastrado' : 'itens cadastrados'
    const categoriesCountLabel = categories.length === 1 ? 'categoria criada' : 'categorias criadas'
    const availableCountLabel = availableItems.length === 1 ? 'item aguardando venda' : 'itens aguardando venda'

    return (
        <>
            <section className="metric-grid" aria-label="Resumo financeiro">
                <article className="metric-card metric-card-highlight">
                    <span className="user-label">Saldo acumulado</span>
                    <strong>{formatCurrency(user.balance)}</strong>
                    <span className="metric-detail">Resultado atual</span>
                </article>
                <article className="metric-card">
                    <span className="user-label">Lucro realizado</span>
                    <strong className="metric-profit">{formatCurrency(totalProfit)}</strong>
                    <span className="metric-detail">{soldItems.length} {soldCountLabel}</span>
                </article>
                <article className="metric-card">
                    <span className="user-label">Prejuízo</span>
                    <strong className="metric-loss">{formatCurrency(totalLoss)}</strong>
                    <span className="metric-detail">Nas vendas abaixo do custo</span>
                </article>
                <article className="metric-card">
                    <span className="user-label">Capital em estoque</span>
                    <strong>{formatCurrency(totalInvested)}</strong>
                    <span className="metric-detail">{items.length} {itemsCountLabel}</span>
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
                                            <button
                                                className="secondary-button"
                                                type="button"
                                                onClick={() => onEditItem(item)}
                                                aria-label={`Editar ${item.name}`}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="secondary-button"
                                                type="button"
                                                onClick={() => onSellItem(item)}
                                                aria-label={`Vender ${item.name}`}
                                            >
                                                Vender
                                            </button>
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
                                        <button
                                            className="secondary-button"
                                            type="button"
                                            onClick={() => onEditItem(item)}
                                            aria-label={`Editar ${item.name}`}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <section className="dashboard-footer" aria-label="Resumo da conta">
                <span><strong>{categories.length}</strong> {categoriesCountLabel}</span>
                <span><strong>{availableItems.length}</strong> {availableCountLabel}</span>
            </section>
        </>
    )
}

function UserPage({onNavigate}) {
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
    const [editStatus, setEditStatus] = useState('AVAILABLE')
    const [editSellPrice, setEditSellPrice] = useState('')
    const [editSellDate, setEditSellDate] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editMessage, setEditMessage] = useState(null)
    const [deletingItem, setDeletingItem] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState(null)

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

    function handleDeleteItem(item) {
        setDeletingItem(item)
        setDeleteError(null)
    }

    async function confirmDeleteItem() {
        if (!deletingItem || isDeleting) return

        const token = getToken()
        setIsDeleting(true)
        setDeleteError(null)

        try {
            await deleteItem(token, deletingItem.id)
            setItems((currentItems) => currentItems.filter((item) => item.id !== deletingItem.id))
            const currentUser = await getCurrentUser(token)
            setUser(currentUser)
            setDeletingItem(null)
        } catch (error) {
            setDeleteError(getFormErrorMessage(error))
        } finally {
            setIsDeleting(false)
        }
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
        setEditBuyDate(item.buyDate || '')
        setEditStatus(item.status || 'AVAILABLE')
        setEditSellPrice(item.sellPrice != null ? String(item.sellPrice) : '')
        setEditSellDate(item.sellDate || '')
        setEditMessage(null)
        setActiveTab('items')
    }

    function closeEditItem() {
        setEditingItem(null)
        setEditItemCategory('')
        setEditBuyDate('')
        setEditStatus('AVAILABLE')
        setEditSellPrice('')
        setEditSellDate('')
        setEditMessage(null)
    }

    async function handleEditItemSubmit(event) {
        event.preventDefault()
        if (isEditing || !editingItem) return

        const form = event.currentTarget
        const formData = new FormData(form)
        const validation = validateItemFormInput({
            name: formData.get('name'),
            buyPrice: Number(formData.get('buyPrice')),
            buyDate: editBuyDate,
            categoryId: Number(formData.get('categoryId')),
            status: editStatus,
            sellPrice: editSellPrice,
            sellDate: editSellDate,
        })

        if (validation.error) {
            setEditMessage({ type: 'error', text: validation.error })
            return
        }

        const item = validation.data
        const imgUrl = formData.get('imgUrl')?.trim()
        if (imgUrl) item.imgUrl = imgUrl

        setIsEditing(true)
        setEditMessage(null)
        try {
            const token = getToken()
            const updatedItem = await updateItem(token, editingItem.id, item)
            setItems((currentItems) => currentItems.map((currentItem) => (currentItem.id === updatedItem.id ? updatedItem : currentItem)))
            const currentUser = await getCurrentUser(token)
            setUser(currentUser)
            closeEditItem()
        } catch (error) {
            setEditMessage({type: 'error', text: getFormErrorMessage(error)})
        } finally {
            setIsEditing(false)
        }
    }

    async function handleSellSubmit(event) {
        event.preventDefault()
        if (isSelling || !sellingItem) return

        const token = getToken()
        const parsedSellDate = parseDateInput(sellDate)
        const today = new Date().toISOString().slice(0, 10)

        if (!parsedSellDate) {
            setSellMessage({ type: 'error', text: 'Digite uma data válida no formato DD/MM/AAAA.' })
            return
        }
        if (parsedSellDate > today) {
            setSellMessage({ type: 'error', text: 'A data de venda não pode ser futura.' })
            return
        }
        if (sellingItem.buyDate && parsedSellDate < sellingItem.buyDate) {
            setSellMessage({type: 'error', text: 'A data de venda não pode ser anterior à data de compra.'})
            return
        }

        const price = Number(sellPrice)
        if (!Number.isFinite(price) || price <= 0) {
            setSellMessage({type: 'error', text: 'Preço de venda deve ser maior que zero.'})
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
            setSellMessage({type: 'error', text: getFormErrorMessage(error)})
        } finally {
            setIsSelling(false)
        }
    }

    if (errorMessage) {
        return <main className="user-main"><p className="form-message form-error" role="alert">{errorMessage}</p></main>
    }

    if (!user) {
        return <main className="user-main"><output className="user-loading">Carregando seus dados...</output></main>
    }

    const availableItems = items.filter((item) => item.status === 'AVAILABLE')
    const soldItems = items.filter((item) => item.status === 'SOLD')

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
                    <button className={activeTab === 'overview' ? 'dashboard-tab active' : 'dashboard-tab'}
                            type="button" onClick={() => setActiveTab('overview')}>Visão geral
                    </button>
                    <button className={activeTab === 'items' ? 'dashboard-tab active' : 'dashboard-tab'} type="button"
                            onClick={() => setActiveTab('items')}>Itens
                    </button>
                    <button className={activeTab === 'item' ? 'dashboard-tab active' : 'dashboard-tab'} type="button"
                            onClick={() => setActiveTab('item')}>Adicionar item
                    </button>
                    <button className={activeTab === 'category' ? 'dashboard-tab active' : 'dashboard-tab'}
                            type="button" onClick={() => setActiveTab('category')}>Categorias
                    </button>
                </nav>

                {sellingItem && (
                    <SellItemPanel
                        sellingItem={sellingItem}
                        sellPrice={sellPrice}
                        sellDate={sellDate}
                        isSelling={isSelling}
                        sellMessage={sellMessage}
                        onClose={closeSellModal}
                        onSubmit={handleSellSubmit}
                        onPriceChange={(event) => {
                            setSellPrice(event.target.value)
                            setSellMessage(null)
                        }}
                        onDateChange={(event) => {
                            setSellDate(event.target.value)
                            setSellMessage(null)
                        }}
                    />
                )}

                {editingItem && (
                    <EditItemPanel
                        editingItem={editingItem}
                        categories={categories}
                        editItemCategory={editItemCategory}
                        editBuyDate={editBuyDate}
                        editStatus={editStatus}
                        editSellPrice={editSellPrice}
                        editSellDate={editSellDate}
                        isEditing={isEditing}
                        editMessage={editMessage}
                        onClose={closeEditItem}
                        onSubmit={handleEditItemSubmit}
                        onCategoryChange={(event) => {
                            setEditItemCategory(event.target.value)
                            setEditMessage(null)
                        }}
                        onBuyDateChange={(event) => {
                            setEditBuyDate(event.target.value)
                            setEditMessage(null)
                        }}
                        onStatusChange={(event) => {
                            setEditStatus(event.target.value)
                            setEditMessage(null)
                        }}
                        onSellPriceChange={(event) => {
                            setEditSellPrice(event.target.value)
                            setEditMessage(null)
                        }}
                        onSellDateChange={(event) => {
                            setEditSellDate(event.target.value)
                            setEditMessage(null)
                        }}
                    />
                )}

                {activeTab === 'items' && !editingItem && (
                    <ItemList
                        items={items}
                        categories={categories}
                        onEdit={openEditItem}
                        onSell={openSellModal}
                        onDelete={handleDeleteItem}
                        onAddNew={() => setActiveTab('item')}
                    />
                )}

                {activeTab === 'overview' && (
                    <OverviewTab
                        user={user}
                        items={items}
                        categories={categories}
                        availableItems={availableItems}
                        soldItems={soldItems}
                        onEditItem={openEditItem}
                        onSellItem={openSellModal}
                    />
                )}

                {activeTab === 'item' && <ItemForm categories={categories}
                                                   onItemCreated={(item) => setItems((currentItems) => [...currentItems, item])}
                                                   onCategoryCreated={(category) => setCategories((currentCategories) => [...currentCategories, category])}/>}

                {activeTab === 'category' && <CategoryForm categories={categories}
                                                           onCategoryCreated={(category) => setCategories((currentCategories) => [...currentCategories, category])}/>}

                <DeleteItemDialog
                    item={deletingItem}
                    error={deleteError}
                    isDeleting={isDeleting}
                    onCancel={() => {
                        setDeletingItem(null)
                        setDeleteError(null)
                    }}
                    onConfirm={confirmDeleteItem}
                />
            </div>
        </main>
    )
}

export default UserPage
