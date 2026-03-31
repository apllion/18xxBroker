// Currency formatting utility.

export function formatCurrency(amount, format = '$') {
  return `${format}${amount}`
}
