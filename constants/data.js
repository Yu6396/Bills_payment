
const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
}

const NETWORK_PROVIDERS = {
  MTN: 'mtn',
  GLO: 'glo',
  AIRTEL: 'airtel',
  ETISALAT: '9mobile'
}
const TRANSACTION_TYPE = {
  FUND: 'fund',
  WITHDRAW: 'withdraw'
}

module.exports = { TRANSACTION_STATUS, NETWORK_PROVIDERS, TRANSACTION_TYPE }