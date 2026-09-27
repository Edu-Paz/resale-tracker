export function getItemExpensesTotal(item) {
  return Number(item.expensesTotal || 0)
}

export function getItemNetProfit(item) {
  if (item.sellPrice === null || item.sellPrice === undefined) return null
  return Number(item.sellPrice) - Number(item.buyPrice || 0) - getItemExpensesTotal(item)
}

export function getItemNetMargin(item) {
  const profit = getItemNetProfit(item)
  if (profit === null || !Number(item.sellPrice)) return null
  return (profit / Number(item.sellPrice)) * 100
}
