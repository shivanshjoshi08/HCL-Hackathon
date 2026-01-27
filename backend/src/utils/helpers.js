export function generateAccountNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return timestamp.slice(-6) + random;
}

export function formatCurrency(amount) {
  return parseFloat(amount).toFixed(2);
}
