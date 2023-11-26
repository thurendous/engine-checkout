import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

export const Form = () => {
  const elements = useElements()
  const stripe = useStripe()

  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [message, setMessage] = useState('')

  const onClick = async () => {
    if (!stripe || !elements) {
      return
    }

    // set loading state
    setIsLoading(true)

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'http://localhost:3000/',
        },
        redirect: 'if_required',
      })
      if (error) {
        throw error.message
      }
      if (paymentIntent.status === 'succeeded') {
        setIsComplete(true)
        setMessage('Payment Received')
      }
    } catch (error) {
      alert('there is an error!')
    }
    setIsLoading(false)
  }

  return (
    <>
      {!isComplete ? (
        <>
          <PaymentElement />
          <button
            style={{
              padding: '1rem',
              marginTop: '1rem',
              borderRadius: '10px',
              backgroundColor: '#000',
              color: '#fff',
              cursor: 'pointer',
              width: '100%',
            }}
            disabled={isLoading || !stripe || !elements}
            onClick={onClick}
          >
            {isComplete ? 'Payment Received' : isLoading ? 'Loading...' : 'Pay Now'}
          </button>
        </>
      ) : (
        <>
          <p>{message}</p>
        </>
      )}
    </>
  )
}
