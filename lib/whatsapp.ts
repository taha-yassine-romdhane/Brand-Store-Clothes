import { fetch } from 'node-fetch'

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    // For now, just log the message and return success
    console.log('Would send WhatsApp message to:', phoneNumber);
    console.log('Message content:', message);
    
    // In the future, implement actual WhatsApp integration here
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}
