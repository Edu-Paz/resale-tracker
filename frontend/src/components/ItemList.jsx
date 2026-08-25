import { useMemo, useState } from 'react'
import ResultBadge from './ResultBadge'

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '—'
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`
}

function formatDate(date) {
  if (!date) return 'Sem data'
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function ItemList({ items = [], categories = [], onEdit, onSell, onDelete, onAddNew }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'AVAILABLE' | 'SOLD'
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('recent') // 'recent' | 'oldest' | 'price-desc' | 'profit-desc'

  const availableCount = items.filter((item) => item.status === 'AVAILABLE').length
  const soldCount = items.filter((item) => item.status === 'SOLD').length
  const totalInvestedInStock = items
    .filter((item) => item.status === 'AVAILABLE')
    .reduce((acc, item) => acc + Number(item.buyPrice || 0), 0)
  const totalProfitRealized = items
    .filter((item) => item.status === 'SOLD')
    .reduce((acc, item) => acc + Number(item.profit || 0), 0)

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Status filter
        if (statusFilter === 'AVAILABLE' && item.status !== 'AVAILABLE') return false
        if (statusFilter === 'SOLD' && item.status !== 'SOLD') return false

        // Category filter
        if (categoryFilter && String(item.category?.id) !== String(categoryFilter)) {
          return false
        }

        // Search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim()
          const nameMatch = item.name?.toLowerCase().includes(term)
          const categoryMatch = item.category?.name?.toLowerCase().includes(term)
          if (!nameMatch && !categoryMatch) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return (a.buyDate || '').localeCompare(b.buyDate || '')
        }
        if (sortBy === 'price-desc') {
          return Number(b.buyPrice || 0) - Number(a.buyPrice || 0)
        }
        if (sortBy === 'profit-desc') {
          return Number(b.profit || 0) - Number(a.profit || 0)
        }
        // Default: most recent first (by buyDate, then id)
        const dateDiff = (b.buyDate || '').localeCompare(a.buyDate || '')
        if (dateDiff !== 0) return dateDiff
        return b.id - a.id
      })
  }, [items, statusFilter, categoryFilter, searchTerm, sortBy])

  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'ALL' || categoryFilter !== ''

  function clearFilters() {
    setSearchTerm('')
    setStatusFilter('ALL')
    setCategoryFilter('')
    setSortBy('recent')
  }

  let content
  if (items.length === 0) {
    content = (
      <div className="empty-state-card">
        <p className="empty-state-title">Nenhum item em estoque ainda.</p>
        <p className="empty-state-subtitle">Registre sua primeira compra para começar o controle da sua operação.</p>
        {onAddNew && (
          <button className="cta-button" type="button" onClick={onAddNew}>
            Adicionar primeiro item
          </button>
        )}
      </div>
    )
  } else if (filteredItems.length === 0) {
    content = (
      <div className="empty-state-card">
        <p className="empty-state-title">Nenhum item encontrado.</p>
        <p className="empty-state-subtitle">Tente ajustar ou limpar os filtros de busca aplicados.</p>
        <button className="secondary-button" type="button" onClick={clearFilters}>
          Limpar filtros
        </button>
      </div>
    )
  } else {
    content = (
      <div className="item-card-grid">
        {filteredItems.map((item) => (
          <article className="item-card" key={item.id}>
            {item.imgUrl && (
              <div className="item-card-media">
                <img
                  src={item.imgUrl}
                  alt={item.name}
                  className="item-card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.parentElement.style.display = 'none'
                  }}
                />
              </div>
            )}

            <div className="item-card-header">
              <div className="item-card-title-group">
                <div className="item-badges-row">
                  <span className="category-badge">
                    {item.category?.name || 'Sem categoria'}
                  </span>
                  {item.status === 'AVAILABLE' && (
                    <span className="stock-tag">Em estoque</span>
                  )}
                </div>
                <h3 className="item-name">{item.name}</h3>
              </div>
              {item.status === 'SOLD' && (
                <div className="item-stamp-wrapper">
                  <ResultBadge profit={item.profit} margin={item.margin} />
                </div>
              )}
            </div>

            <dl className="item-card-details">
              <div className="detail-item">
                <dt>Preço de compra</dt>
                <dd>{formatCurrency(item.buyPrice)}</dd>
              </div>
              <div className="detail-item">
                <dt>Data de compra</dt>
                <dd>{formatDate(item.buyDate)}</dd>
              </div>
              {item.status === 'SOLD' && (
                <>
                  <div className="detail-item">
                    <dt>Preço de venda</dt>
                    <dd>{formatCurrency(item.sellPrice)}</dd>
                  </div>
                  <div className="detail-item">
                    <dt>Data da venda</dt>
                    <dd>{formatDate(item.sellDate)}</dd>
                  </div>
                </>
              )}
            </dl>

            <div className="item-card-footer">
              <div className="item-footer-actions">
                {item.status === 'AVAILABLE' && onSell && (
                  <button
                    className="cta-button item-sell-btn"
                    type="button"
                    onClick={() => onSell(item)}
                  >
                    Registrar venda
                  </button>
                )}
                {onEdit && (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label={`Editar ${item.name}`}
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    className="destructive-button"
                    type="button"
                    onClick={() => onDelete(item)}
                    aria-label={`Excluir ${item.name}`}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <section className="dashboard-panel items-panel" aria-labelledby="items-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Inventário de estoque</p>
          <h2 id="items-title">Itens cadastrados</h2>
        </div>
        <div className="panel-heading-actions">
          <span className="panel-count">{items.length}</span>
          {onAddNew && (
            <button className="cta-button items-add-cta" type="button" onClick={onAddNew}>
              + Adicionar item
            </button>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <>
          <div className="inventory-stats-bar" aria-label="Estatísticas do inventário">
            <div className="inventory-stat-card">
              <span className="inventory-stat-label">Total em estoque</span>
              <strong className="inventory-stat-value">{availableCount} {availableCount === 1 ? 'item' : 'itens'}</strong>
              <span className="inventory-stat-detail">{formatCurrency(totalInvestedInStock)} investidos</span>
            </div>
            <div className="inventory-stat-card">
              <span className="inventory-stat-label">Itens vendidos</span>
              <strong className="inventory-stat-value">{soldCount} {soldCount === 1 ? 'venda' : 'vendas'}</strong>
              <span className={`inventory-stat-detail ${totalProfitRealized >= 0 ? 'metric-profit' : 'metric-loss'}`}>
                {totalProfitRealized >= 0 ? '+' : ''}{formatCurrency(totalProfitRealized)} de resultado
              </span>
            </div>
            <div className="inventory-stat-card">
              <span className="inventory-stat-label">Fichas cadastradas</span>
              <strong className="inventory-stat-value">{items.length}</strong>
              <span className="inventory-stat-detail">{categories.length} categorias ativas</span>
            </div>
          </div>

          <div className="inventory-toolbar" role="search" aria-label="Filtros do inventário">
            <div className="inventory-filters">
              <div className="status-filter-pills" role="tablist" aria-label="Filtrar por status">
                <button
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === 'ALL'}
                  className={`status-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  Todos ({items.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === 'AVAILABLE'}
                  className={`status-pill ${statusFilter === 'AVAILABLE' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('AVAILABLE')}
                >
                  Em estoque ({availableCount})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === 'SOLD'}
                  className={`status-pill ${statusFilter === 'SOLD' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('SOLD')}
                >
                  Vendidos ({soldCount})
                </button>
              </div>

              <select
                className="filter-select"
                aria-label="Filtrar por categoria"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                aria-label="Ordenar itens"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="price-desc">Maior valor de compra</option>
                <option value="profit-desc">Maior lucro</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="inline-action"
                  onClick={clearFilters}
                  aria-label="Limpar todos os filtros"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="inventory-search">
              <input
                type="search"
                placeholder="Buscar por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar item por nome"
              />
            </div>
          </div>
        </>
      )}

      {content}
    </section>
  )
}

export default ItemList
