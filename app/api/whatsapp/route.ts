import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { phoneNumber, message } = await req.json()

    const response = await fetch(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "text",
          text: {
            body: message
          }
        })
      }
    )

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      const error = await response.json()
      console.error('WhatsApp API error:', error)
      return NextResponse.json({ success: false, error }, { status: 500 })
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
