// lib/paystack.ts
export const verifyPayment = async (reference: string) => {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })
  return res.json()
}