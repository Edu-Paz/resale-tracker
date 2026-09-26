export function getItemExpensesTotal(item) {
  return Number(item.expensesTotal || 0)
}

export function getItemNetProfit(item) {
  if (item.profit === null || item.profit === undefined) return null
  return Number(item.profit) - getItemExpensesTotal(item)
}

export function getItemNetMargin(item) {
  const profit = getItemNetProfit(item)
  if (profit === null || !Number(item.sellPrice)) return null
  return (profit / Number(item.sellPrice)) * 100
}
