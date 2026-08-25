import { useState } from 'react'
import { ApiError, createCategory, createItem } from '../services/api'
import { getToken } from '../services/session'

function getFormErrorMessage(error) {
  if (error instanceof ApiError) return error.message
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

function ItemForm({ categories, onItemCreated, onCategoryCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState(null)
  const [quickCategoryOpen, setQuickCategoryOpen] = useState(false)
  const [quickCategoryName, setQuickCategoryName] = useState('')
  const [itemCategory, setItemCategory] = useState('')
  const [buyDate, setBuyDate] = useState('')

  async function handleQuickCategorySubmit() {
    if (isSubmitting) return

    setIsSubmitting(true)
    setFormMessage(null)
    try {
      const category = await createCategory(getToken(), { name: quickCategoryName.trim() })
      onCategoryCreated(category)
      setItemCategory(String(category.id))
      setQuickCategoryName('')
      setQuickCategoryOpen(false)
      setFormMessage({ type: 'success', text: 'Categoria criada e selecionada.' })
    } catch (error) {
      setFormMessage({
        type: 'error',
        text: error instanceof ApiError && error.status === 422
          ? 'Já existe uma categoria com esse nome.'
          : getFormErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const parsedBuyDate = parseDateInput(buyDate)
    const today = new Date().toISOString().slice(0, 10)
    if (!parsedBuyDate || parsedBuyDate > today) {
      setFormMessage({ type: 'error', text: parsedBuyDate ? 'A data não pode ser futura.' : 'Digite uma data válida no formato DD/MM/AAAA.' })
      return
    }

    const buyPrice = Number(formData.get('buyPrice'))
    if (!Number.isFinite(buyPrice) || buyPrice <= 0) {
      setFormMessage({ type: 'error', text: 'Preço de compra deve ser maior que zero.' })
      return
    }

    const item = {
      name: formData.get('name').trim(),
      buyPrice,
      buyDate: parsedBuyDate,
      categoryId: Number(formData.get('categoryId')),
    }
    const imgUrl = formData.get('imgUrl').trim()
    if (imgUrl) item.imgUrl = imgUrl

    setIsSubmitting(true)
    setFormMessage(null)
    try {
      const newItem = await createItem(getToken(), item)
      onItemCreated(newItem)
      setFormMessage({ type: 'success', text: 'Item adicionado ao estoque.' })
      form.reset()
      setItemCategory('')
      setBuyDate('')
    } catch (error) {
      setFormMessage({ type: 'error', text: getFormErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="dashboard-panel form-panel" aria-labelledby="new-item-title">
      <div className="panel-heading"><div><p className="eyebrow">Estoque</p><h2 id="new-item-title">Adicionar item</h2></div></div>
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label>Nome do item<input name="name" placeholder="Ex.: Jaqueta jeans" required /></label>
        <div className="form-grid">
          <label>Preço de compra<input name="buyPrice" type="number" min="0.01" step="0.01" placeholder="0,00" required /></label>
          <label>Data da compra<input name="buyDate" type="date" lang="pt-BR" max={new Date().toISOString().slice(0, 10)} value={buyDate} onChange={(event) => { setBuyDate(event.target.value); setFormMessage(null) }} required /></label>
        </div>
        <label>Imagem <span className="optional-label">(opcional)</span><input name="imgUrl" type="url" placeholder="https://..." /></label>
        <label>Categoria
          <div className="category-select-row">
            <select name="categoryId" value={itemCategory} onChange={(event) => setItemCategory(event.target.value)} required>
              <option value="" disabled>Selecione uma categoria</option>
              {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
            </select>
            <button className="inline-action" type="button" onClick={() => setQuickCategoryOpen((open) => !open)}>{quickCategoryOpen ? 'Fechar' : '+ Nova categoria'}</button>
          </div>
        </label>
        {quickCategoryOpen && <div className="quick-category"><label>Nome da nova categoria<input value={quickCategoryName} onChange={(event) => setQuickCategoryName(event.target.value)} placeholder="Ex.: Calçados" required /></label><button className="secondary-button" type="button" onClick={handleQuickCategorySubmit} disabled={isSubmitting || !quickCategoryName.trim()}>Criar categoria</button></div>}
        {formMessage && <output className={`form-message form-${formMessage.type}`} role={formMessage.type === 'error' ? 'alert' : undefined}>{formMessage.text}</output>}
        <button className="cta-button" type="submit" disabled={isSubmitting || categories.length === 0}>{isSubmitting ? 'Salvando...' : 'Adicionar ao estoque'}</button>
        {categories.length === 0 && <p className="form-hint">Crie uma categoria antes de adicionar um item.</p>}
      </form>
    </section>
  )
}

export default ItemForm
