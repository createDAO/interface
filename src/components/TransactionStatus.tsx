import { TransactionState } from '@/types/transaction'
import { getExplorerUrl } from '@/config/networks'
import styles from './TransactionStatus.module.css'

interface TransactionStatusProps {
  state: TransactionState
  chainId: number
  messages?: {
    waitingForSignature?: string
    submitting?: string
    waitingForConfirmation?: string
    success?: string
    error?: string
  }
  className?: string
}

export function TransactionStatus({ 
  state, 
  chainId,
  messages = {},
  className = ''
}: TransactionStatusProps) {
  const defaultMessages = {
    waitingForSignature: 'Please sign the transaction...',
    submitting: 'Submitting transaction...',
    waitingForConfirmation: 'Waiting for confirmation...',
    success: 'Transaction successful!',
    error: 'Transaction failed',
    ...messages
  }

  if (state.isIdle) return null

  return (
    <div className={`${styles.container} ${className}`}>
      {state.isWaitingForSignature && (
        <div className={styles.status}>
          <div className={styles.spinner} />
          <p>{defaultMessages.waitingForSignature}</p>
        </div>
      )}

      {state.isSubmitting && !state.isWaitingForConfirmation && (
        <div className={styles.status}>
          <div className={styles.spinner} />
          <p>{defaultMessages.submitting}</p>
        </div>
      )}

      {state.isWaitingForConfirmation && (
        <div className={styles.status}>
          <div className={styles.spinner} />
          <p>{defaultMessages.waitingForConfirmation}</p>
          {state.hash && (
            <a 
              href={`${getExplorerUrl(chainId)}/tx/${state.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              View on Explorer
            </a>
          )}
        </div>
      )}

      {state.isSuccess && (
        <div className={`${styles.status} ${styles.success}`}>
          <div className={styles.icon}>✓</div>
          <p>{defaultMessages.success}</p>
          {state.hash && (
            <a 
              href={`${getExplorerUrl(chainId)}/tx/${state.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              View on Explorer
            </a>
          )}
        </div>
      )}

      {state.isError && (
        <div className={`${styles.status} ${styles.error}`}>
          <div className={styles.icon}>✕</div>
          <p>{state.error?.shortMessage || defaultMessages.error}</p>
          {state.error?.details && (
            <p className={styles.details}>{state.error.details}</p>
          )}
          {state.hash && (
            <a 
              href={`${getExplorerUrl(chainId)}/tx/${state.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              View on Explorer
            </a>
          )}
        </div>
      )}
    </div>
  )
}
