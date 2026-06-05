import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends a WhatsApp message using the official Meta Cloud API.
 * 
 * If WHATSAPP_TOKEN or WHATSAPP_PHONE_ID are missing, it falls back
 * to a Development Test Mode and logs the message to the console instead of crashing.
 * 
 * @param {string} toPhoneNumber - The recipient's phone number (with country code, no +)
 * @param {string} messageText - The message to send
 */
export const sendWhatsAppNotification = async (toPhoneNumber, messageText) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  // Format phone number to ensure it has country code but no + sign
  // Assuming India (91) if 10 digits are provided
  let formattedNumber = String(toPhoneNumber).replace(/\D/g, '');
  if (formattedNumber.length === 10) {
    formattedNumber = `91${formattedNumber}`;
  }

  // DEVELOPMENT TEST MODE
  if (!token || !phoneId || token.includes('placeholder')) {
    console.log('\n=========================================');
    console.log('[MOCK WHATSAPP MESSAGE]');
    console.log(`To: +${formattedNumber}`);
    console.log('Message:');
    console.log(messageText);
    console.log('=========================================\n');
    return { sent: false, mock: true, to: formattedNumber };
  }

  // PRODUCTION MODE (Real API Call)
  try {
    const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: messageText
      }
    };

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(url, payload, { headers });
    return { sent: true, mock: false, to: formattedNumber, data: response.data };
  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    // Don't throw the error so that the main application (like checkout) doesn't crash
    return { sent: false, mock: false, to: formattedNumber, error: error.response?.data || error.message };
  }
};
