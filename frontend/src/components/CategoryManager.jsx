import { useState } from 'react'
import { ApiError, createCategory, deleteCategory, updateCategory } from '../services/api'
import { getToken } from '../services/session'

function CategoryManager({ categories, onCategoryCreated, onCategoryUpdated, onCategoryDeleted }) {
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  function getError(error, operation = 'create') {
    if (error instanceof ApiError && error.status === 422) {
      if (operation === 'delete') return 'Não é possível excluir uma categoria que possui itens vinculados. Remova ou mova os itens antes de tentar novamente.'
      return operation === 'update' ? 'Já existe uma categoria com esse nome.' : 'Já existe uma categoria com esse nome.'
    }
    return error instanceof ApiError ? error.message : 'Não foi possível concluir a operação. Tente novamente.'
  }

  function startEditing(category) {
    setEditingId(category.id)
    setName(category.name)
    setMessage(null)
  }

  function cancelEditing() {
    setEditingId(null)
    setName('')
    setMessage(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting || !name.trim()) return
    setIsSubmitting(true)
    setMessage(null)
    try {
      const saved = editingId
        ? await updateCategory(getToken(), editingId, { name: name.trim() })
        : await createCategory(getToken(), { name: name.trim() })
      const successText = editingId ? 'Categoria atualizada.' : 'Categoria criada.'
      if (editingId) onCategoryUpdated(saved)
      else onCategoryCreated(saved)
      cancelEditing()
      setMessage({ type: 'success', text: successText })
    } catch (error) {
      setMessage({ type: 'error', text: getError(error, editingId ? 'update' : 'create') })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!categoryToDelete || deletingId) return
    const category = categoryToDelete
    setDeletingId(category.id)
    setMessage(null)
    try {
      await deleteCategory(getToken(), category.id)
      onCategoryDeleted(category.id)
      setMessage({ type: 'success', text: 'Categoria excluída.' })
      setCategoryToDelete(null)
    } catch (error) {
      setMessage({ type: 'error', text: getError(error, 'delete') })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="dashboard-panel category-manager" aria-labelledby="categories-title">
      <div className="panel-heading">
        <div><p className="eyebrow">Organização</p><h2 id="categories-title">Gerenciar categorias</h2></div>
        <span className="panel-count">{categories.length}</span>
      </div>
      <p className="dashboard-intro category-manager-intro">Organize seus itens e mantenha o inventário fácil de encontrar.</p>
      <form className="category-manager-form" onSubmit={handleSubmit}>
        <label>
          {editingId ? 'Renomear categoria' : 'Nova categoria'}
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Eletrônicos" required />
        </label>
        <div className="item-footer-actions">
          <button className="cta-button" type="submit" disabled={isSubmitting || !name.trim()}>{isSubmitting ? 'Salvando...' : editingId ? 'Salvar alteração' : 'Criar categoria'}</button>
          {editingId && <button className="secondary-button" type="button" onClick={cancelEditing}>Cancelar</button>}
        </div>
      </form>
      {message && <output className={`form-message form-${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</output>}
      {categories.length === 0 ? <div className="empty-state-card"><p className="empty-state-title">Nenhuma categoria cadastrada.</p><p className="empty-state-subtitle">Crie uma categoria para começar a organizar seus itens.</p></div> : (
        <div className="category-manager-grid">
          {categories.map((category) => (
            <article className="category-manager-card" key={category.id}>
              <span className="category-manager-icon">#</span>
              <strong>{category.name}</strong>
              <div className="item-footer-actions">
                <button className="secondary-button" type="button" onClick={() => startEditing(category)}>Editar</button>
                <button className="destructive-button" type="button" onClick={() => setCategoryToDelete(category)} disabled={deletingId === category.id}>{deletingId === category.id ? 'Excluindo...' : 'Excluir'}</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {editingId && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-category-title" onClick={cancelEditing}>
          <section className="dashboard-panel form-panel modal-form-panel category-edit-modal" onClick={(event) => event.stopPropagation()}>
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Organização</p>
                <h2 id="edit-category-title">Editar categoria</h2>
              </div>
              <button className="inline-action" type="button" onClick={cancelEditing}>Fechar</button>
            </div>
            <form className="dashboard-form" onSubmit={handleSubmit}>
              <label>
                Nome da categoria
                <input value={name} onChange={(event) => setName(event.target.value)} autoFocus required />
              </label>
              {message && <output className={`form-message form-${message.type}`} role="alert">{message.text}</output>}
              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={cancelEditing}>Cancelar</button>
                <button className="cta-button" type="submit" disabled={isSubmitting || !name.trim()}>{isSubmitting ? 'Salvando...' : 'Salvar alteração'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
      {categoryToDelete && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-category-title" onClick={() => setCategoryToDelete(null)}>
          <div className="modal-dialog" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">Confirmação de exclusão</p>
            <h3 id="delete-category-title">Excluir «{categoryToDelete.name}»?</h3>
            <p>
              Esta ação é permanente. A categoria só pode ser excluída se não houver itens vinculados a ela.
              Os itens vinculados não são excluídos automaticamente.
            </p>
            {message?.type === 'error' && <output className="form-message form-error" role="alert">{message.text}</output>}
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setCategoryToDelete(null)} disabled={Boolean(deletingId)}>Cancelar</button>
              <button className="destructive-button destructive-button--fill" type="button" onClick={confirmDelete} disabled={Boolean(deletingId)}>
                {deletingId ? 'Excluindo...' : 'Confirmar exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CategoryManager
