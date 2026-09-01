import net from 'net';
import { Restaurant, InvoiceTemplate } from './sequelize';

// ESC/POS commands helper constants
const ESC = '\x1b';
const GS = '\x1d';
const CLEAN = ESC + '@'; // Initialize printer

const ALIGN_LEFT = ESC + 'a\x00';
const ALIGN_CENTER = ESC + 'a\x01';
const ALIGN_RIGHT = ESC + 'a\x02';

const DOUBLE_SIZE_ON = GS + '!\x11'; // Double height and width
const DOUBLE_SIZE_OFF = GS + '!\x00';

const BOLD_ON = ESC + 'E\x01';
const BOLD_OFF = ESC + 'E\x00';

const CUT_PAPER = GS + 'V\x41\x03'; // Partial cut with feed

export async function autoPrintKitchenReceipt(order) {
  try {
    if (!order || !order.restaurantId) return;

    // Fetch restaurant printer settings
    const restaurant = await Restaurant.findOne({
      where: { id: order.restaurantId },
      attributes: ['kitchenPrinterIp', 'kitchenPrinterPort', 'activeKitchenTemplateId', 'name'],
    });

    if (!restaurant || !restaurant.kitchenPrinterIp) {
      console.log(`ℹ️ [Printer Service] Auto-print skipped: No kitchen printer IP configured for restaurant ${order.restaurantId}`);
      return;
    }

    const { kitchenPrinterIp, kitchenPrinterPort, activeKitchenTemplateId } = restaurant;
    const testPort = kitchenPrinterPort || 9100;

    // Fetch active template configuration
    let templateConfig = {
      header: true,
      onPremiseNumber: true,
      orderDetails: true,
      clientComment: true,
      items: true,
      isPaid: true,
      packagingStationQualityControl: false,
      ticketHolderSpace: true,
    };

    if (activeKitchenTemplateId) {
      const template = await InvoiceTemplate.findOne({
        where: { id: activeKitchenTemplateId },
      });
      if (template && template.config) {
        templateConfig = { ...templateConfig, ...JSON.parse(template.config) };
      }
    }

    // Build the raw ESC/POS payload
    let data = CLEAN;

    // 1. Ticket Holder Space
    if (templateConfig.ticketHolderSpace) {
      data += '\n\n\n';
    }

    // 2. Header Banner
    if (templateConfig.header) {
      data += ALIGN_CENTER + BOLD_ON + DOUBLE_SIZE_ON;
      data += `${order.orderType || 'ORDER'}\n`;
      data += DOUBLE_SIZE_OFF;
      data += `ASAP (Prep time: ${order.prepMinutes || 25} min)\n`;
      data += `Time: ${new Date(order.createdAt || Date.now()).toLocaleTimeString()}\n`;
      data += BOLD_OFF + '\n' + ALIGN_LEFT;
      data += '------------------------------------------------\n';
    }

    // 3. On-Premise Order Number
    if (templateConfig.onPremiseNumber) {
      data += ALIGN_CENTER + BOLD_ON + DOUBLE_SIZE_ON;
      data += `${order.orderNumber || '#1'}\n`;
      data += DOUBLE_SIZE_OFF + BOLD_OFF + ALIGN_LEFT;
      data += '------------------------------------------------\n';
    }

    // 4. Order Details Meta
    if (templateConfig.orderDetails) {
      data += BOLD_ON + 'Order details:\n' + BOLD_OFF;
      data += `Customer: ${order.customerName}\n`;
      data += `Phone: ${order.customerPhone}\n`;
      if (order.deliveryAddress) {
        data += `Address: ${order.deliveryAddress}\n`;
      }
      data += '------------------------------------------------\n';
    }

    // 5. Client Comment
    if (templateConfig.clientComment && order.specialNotes) {
      data += BOLD_ON + '💬 Note: ' + order.specialNotes + '\n' + BOLD_OFF;
      data += '------------------------------------------------\n';
    }

    // 6. Order Items Listing with Checkboxes
    if (templateConfig.items && order.items && order.items.length > 0) {
      data += BOLD_ON + 'Items:\n' + BOLD_OFF;
      for (const item of order.items) {
        const qty = item.quantity || 1;
        const name = item.name || 'Item';
        data += `[ ] ${qty}x ${name}\n`;
        
        // Options
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          for (const opt of item.selectedOptions) {
            data += `    - ${opt.optionName || opt.OptionItem?.name || 'Option'}\n`;
          }
        }
        data += '\n';
      }
      data += '------------------------------------------------\n';
    }

    // 7. Is Paid
    if (templateConfig.isPaid) {
      data += ALIGN_CENTER + BOLD_ON;
      data += `[ ] PAID    [X] NOT PAID\n`;
      data += BOLD_OFF + ALIGN_LEFT;
      data += '------------------------------------------------\n';
    }

    // 8. Packaging Station QC Box
    if (templateConfig.packagingStationQualityControl) {
      data += BOLD_ON + 'Packaging Station Check:\n' + BOLD_OFF;
      data += `[ ] Boxes     [ ] Sauces     [ ] Utensils\n`;
      data += '------------------------------------------------\n';
    }

    // Final feed lines and partial cut command
    data += '\n\n\n' + CUT_PAPER;

    // Send print payload over network TCP socket
    const socket = new net.Socket();
    socket.setTimeout(3000); // 3-second connect timeout

    socket.connect(testPort, kitchenPrinterIp, () => {
      console.log(`🔌 [Printer Service] Printing order ${order.orderNumber} to ${kitchenPrinterIp}:${testPort}`);
      socket.write(data, 'binary', () => {
        socket.destroy();
        console.log(`✅ [Printer Service] Print command sent successfully.`);
      });
    });

    socket.on('error', (err) => {
      console.error(`❌ [Printer Service] Socket connection failed to ${kitchenPrinterIp}:${testPort} - ${err.message}`);
    });

    socket.on('timeout', () => {
      socket.destroy();
      console.error(`❌ [Printer Service] Socket connection timeout to ${kitchenPrinterIp}:${testPort}`);
    });

  } catch (error) {
    console.error('❌ [Printer Service] Unexpected printing error:', error);
  }
}
