import { config } from '../config/wagmi'

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
