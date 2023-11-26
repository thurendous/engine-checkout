'use client'

import { ThirdwebProvider, embeddedWallet } from '@thirdweb-dev/react'
import ClaimPage from './components/Claim'

export default function Home() {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      supportedWallets={[embeddedWallet()]}
    >
      <ClaimPage />
    </ThirdwebProvider>
  )
}
