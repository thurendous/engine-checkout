import { Elements } from '@stripe/react-stripe-js'
import { Appearance, StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import {
  ConnectWallet,
  MediaRenderer,
  useAddress,
  useContract,
  useNFT,
  useTotalCirculatingSupply,
} from '@thirdweb-dev/react'
import React, { useState } from 'react'
import { Form } from './Form'

function ClaimPage() {
  const address = useAddress()
  const [clientSecret, setClientSecret] = useState('')
  const { contract } = useContract(process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS)

  const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  const appearance: Appearance = {
    theme: 'night',
    labels: 'floating',
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  }

  const { data: nft } = useNFT(contract, 0) // we are using erc1155 so we purchase the same NFT again and again
  console.log(nft)

  const { data: totalSupply } = useTotalCirculatingSupply(contract, 0)
  console.log(address)

  const onClick = async () => {
    const response = await fetch('/api/stripe_intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    })
    if (response.ok) {
      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <ConnectWallet />
        <MediaRenderer src={nft?.metadata?.image} style={{ borderRadius: '10px' }} />
        <p>Total Claimed: {totalSupply?.toNumber()}</p>
        {address && (
          <>
            {clientSecret ? (
              <Elements options={options} stripe={stripe}>
                <Form />
              </Elements>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:opacity-50"
                onClick={onClick}
                disabled={!address}
              >
                Buy with credit card
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ClaimPage
