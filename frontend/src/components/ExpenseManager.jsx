import { useEffect, useState } from 'react'
import { ApiError, createExpense, deleteExpense, getExpensesByItem, updateExpense } from '../services/api'
import { getToken } from '../services/session'

function formatCurrency(value) {
  return `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`
}

function errorMessage(error) {
  return error instanceof ApiError ? error.message : 'Não foi possível concluir a operação. Tente novamente.'
}

function ExpenseManager({ item, onClose, onExpensesChanged }) {
  const [expenses, setExpenses] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    getExpensesByItem(getToken(), item.id)
      .then((data) => {
        if (active) {
          setExpenses(data)
          onExpensesChanged?.(data.reduce((sum, expense) => sum + Number(expense.amount || 0), 0), data)
        }
      })
      .catch((error) => {
        if (active) setMessage({ type: 'error', text: errorMessage(error) })
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => { active = false }
  }, [item.id, onExpensesChanged])

  function resetForm() {
    setName('')
    setAmount('')
    setEditingId(null)
  }

  function editExpense(expense) {
    setEditingId(expense.id)
    setName(expense.name)
    setAmount(String(expense.amount))
    setMessage(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return
    const trimmedName = name.trim()
    const parsedAmount = Number(amount)
    if (!trimmedName || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setMessage({ type: 'error', text: 'Informe uma descrição e um valor maior que zero.' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)
    try {
      const token = getToken()
      const saved = editingId
        ? await updateExpense(token, editingId, { name: trimmedName, amount: parsedAmount })
        : await createExpense(token, { name: trimmedName, amount: parsedAmount, itemId: item.id })
      setExpenses((current) => {
        const nextExpenses = editingId
          ? current.map((expense) => expense.id === saved.id ? saved : expense)
          : [...current, saved]
        onExpensesChanged?.(nextExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0), nextExpenses)
        return nextExpenses
      })
      resetForm()
      setMessage({ type: 'success', text: editingId ? 'Gasto atualizado.' : 'Gasto adicionado ao item.' })
    } catch (error) {
      setMessage({ type: 'error', text: errorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(expense) {
    if (!window.confirm(`Excluir o gasto "${expense.name}"?`)) return
    try {
      await deleteExpense(getToken(), expense.id)
      setExpenses((current) => {
        const nextExpenses = current.filter((currentExpense) => currentExpense.id !== expense.id)
        onExpensesChanged?.(nextExpenses.reduce((sum, currentExpense) => sum + Number(currentExpense.amount || 0), 0), nextExpenses)
        return nextExpenses
      })
      if (editingId === expense.id) resetForm()
    } catch (error) {
      setMessage({ type: 'error', text: errorMessage(error) })
    }
  }

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="expense-manager-title" onClick={onClose} onKeyDown={(event) => event.key === 'Escape' && onClose()}>
      <section className="dashboard-panel form-panel modal-form-panel expense-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Custos do item</p>
            <h2 id="expense-manager-title">Gastos de «{item.name}»</h2>
          </div>
          <button className="inline-action" type="button" onClick={onClose}>Fechar</button>
        </div>
        <p className="expense-total">Total de gastos: <strong>{formatCurrency(total)}</strong></p>
        <form className="dashboard-form expense-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>Descrição<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Frete" required /></label>
            <label>Valor<input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0.01" step="0.01" placeholder="0,00" required /></label>
          </div>
          {message && <output className={`form-message form-${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</output>}
          <div className="modal-actions">
            {editingId && <button className="secondary-button" type="button" onClick={resetForm}>Cancelar edição</button>}
            <button className="cta-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : editingId ? 'Salvar gasto' : 'Adicionar gasto'}</button>
          </div>
        </form>
        {isLoading ? <p className="user-loading">Carregando gastos...</p> : expenses.length === 0 ? (
          <p className="empty-state">Nenhum gasto vinculado a este item.</p>
        ) : (
          <ul className="expense-list">
            {expenses.map((expense) => (
              <li className="expense-row" key={expense.id}>
                <div><strong>{expense.name}</strong><span>{formatCurrency(expense.amount)}</span></div>
                <div className="item-actions-buttons">
                  <button className="secondary-button" type="button" onClick={() => editExpense(expense)}>Editar</button>
                  <button className="destructive-button" type="button" onClick={() => handleDelete(expense)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default ExpenseManager
