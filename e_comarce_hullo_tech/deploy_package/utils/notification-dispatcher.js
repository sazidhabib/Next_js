

/**
 * Dispatcher for Order Notifications (WhatsApp / Facebook Messenger)
 */
const sendOrderNotification = async (order) => {
  try {
    const provider = process.env.NOTIFICATION_PROVIDER || 'log';
    
    // Format the message template
    const formattedDate = new Date(order.createdAt || new Date()).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    
    const messageText = `🔔 *New Order Received!*
----------------------------------
*Order ID:* #HT-${order.id}
*Date:* ${formattedDate}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Email:* ${order.customerEmail}
*Address:* ${order.shippingAddress}
*Payment Method:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}
*Total Amount:* ৳${Math.round(order.totalAmount).toLocaleString()}
----------------------------------
_Please check the admin panel for details._`;

    console.log(`[Notification Dispatcher] Triggered notification for Order #${order.id} using provider: ${provider}`);

    if (provider === 'log') {
      console.log('--- Mock Notification Message ---');
      console.log(messageText);
      console.log('---------------------------------');
      return true;
    }

    if (provider === 'whatsapp') {
      const whatsappProvider = process.env.WHATSAPP_PROVIDER || 'ultramsg';
      
      if (whatsappProvider === 'ultramsg') {
        const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
        const token = process.env.ULTRAMSG_TOKEN;
        const recipient = process.env.ULTRAMSG_TO; // e.g. +88017... or group ID

        if (!instanceId || !token || !recipient) {
          console.warn('⚠️ UltraMsg credentials missing in environment variables.');
          return false;
        }

        const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;
        const payload = {
          token: token,
          to: recipient,
          body: messageText,
          priority: 10
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.sent === 'true' || data.success) {
          console.log('✅ WhatsApp notification sent via UltraMsg.');
          return true;
        }
        console.error('❌ UltraMsg failed to send message:', data);
        return false;
      }

      if (whatsappProvider === 'twilio') {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155238886
        const toNumber = process.env.TWILIO_WHATSAPP_TO; // e.g. whatsapp:+88017...

        if (!accountSid || !authToken || !fromNumber || !toNumber) {
          console.warn('⚠️ Twilio credentials missing in environment variables.');
          return false;
        }

        // Basic Auth for Twilio API
        const authString = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        
        // Twilio expects application/x-www-form-urlencoded
        const bodyParams = new URLSearchParams();
        bodyParams.append('From', fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`);
        bodyParams.append('To', toNumber.startsWith('whatsapp:') ? toNumber : `whatsapp:${toNumber}`);
        bodyParams.append('Body', messageText);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyParams
        });
        const data = await response.json();
        if (response.ok) {
          console.log('✅ WhatsApp notification sent via Twilio.');
          return true;
        }
        console.error('❌ Twilio failed to send message:', data);
        return false;
      }
    }

    if (provider === 'messenger') {
      const pageAccessToken = process.env.MESSENGER_PAGE_ACCESS_TOKEN;
      const recipientId = process.env.MESSENGER_RECIPIENT_ID; // PSID of the admin

      if (!pageAccessToken || !recipientId) {
        console.warn('⚠️ Facebook Messenger credentials missing in environment variables.');
        return false;
      }

      const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${pageAccessToken}`;
      const payload = {
        recipient: { id: recipientId },
        message: { text: messageText },
        messaging_type: 'MESSAGE_TAG',
        tag: 'ACCOUNT_UPDATE' // standard meta tag for transaction updates
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.message_id) {
        console.log('✅ Messenger notification sent via Meta Send API.');
        return true;
      }
      console.error('❌ Facebook Messenger Send API failed:', data);
      return false;
    }

  } catch (error) {
    // Catch-all to ensure payment/order flows NEVER crash on notification dispatcher error
    console.error('❌ Error in notification-dispatcher:', error.message);
  }
  return false;
};

module.exports = {
  sendOrderNotification
};
