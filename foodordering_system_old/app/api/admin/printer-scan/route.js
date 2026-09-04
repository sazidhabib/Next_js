import { NextResponse } from 'next/server';
import os from 'os';
import net from 'net';

// Helper to get local IP subnet IPs to scan
function getSubnetIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // We only want IPv4 and non-internal (loopback) interfaces
      if (iface.family === 'IPv4' && !iface.internal) {
        const ipParts = iface.address.split('.').map(Number);
        const maskParts = iface.netmask.split('.').map(Number);
        
        // Ensure it's a standard /24 subnet (255.255.255.0) for simplicity and speed
        if (maskParts[0] === 255 && maskParts[1] === 255 && maskParts[2] === 255) {
          const prefix = ipParts.slice(0, 3).join('.');
          for (let i = 1; i <= 254; i++) {
            ips.push(`${prefix}.${i}`);
          }
        }
      }
    }
  }

  // Fallback if no network interface matched /24 subnet structure
  if (ips.length === 0) {
    for (let i = 1; i <= 254; i++) {
      ips.push(`192.168.1.${i}`);
    }
  }

  return ips;
}

// Check if port 9100 is open on a given IP
function checkPrinter(ip, port = 9100, timeout = 250) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;

    socket.setTimeout(timeout);

    socket.connect(port, ip, () => {
      status = true;
      socket.destroy();
    });

    socket.on('error', () => {
      resolve(null);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(null);
    });

    socket.on('close', () => {
      if (status) {
        resolve(ip);
      } else {
        resolve(null);
      }
    });
  });
}

export async function GET(request) {
  try {
    const ips = getSubnetIPs();
    
    // Scan all IPs in parallel
    console.log(`🔍 [Printer Scan] Scanning ${ips.length} IPs on port 9100...`);
    const results = await Promise.all(ips.map(ip => checkPrinter(ip, 9100, 200)));
    
    const printers = results.filter(ip => ip !== null).map(ip => ({
      ip,
      port: 9100,
      name: `ESC/POS Printer (${ip})`,
    }));

    console.log(`✅ [Printer Scan] Found ${printers.length} network printers.`);
    return NextResponse.json({ success: true, printers });
  } catch (error) {
    console.error('Error scanning for printers:', error);
    return NextResponse.json({ success: false, error: 'Failed to scan local network' }, { status: 500 });
  }
}

// POST endpoint to verify a specific printer IP and port manually
export async function POST(request) {
  try {
    const body = await request.json();
    const { ip, port } = body;
    
    if (!ip) {
      return NextResponse.json({ success: false, error: 'IP address is required' }, { status: 400 });
    }

    const testPort = port ? parseInt(port) : 9100;
    const result = await checkPrinter(ip, testPort, 1500); // longer timeout for manual check

    if (result) {
      return NextResponse.json({ success: true, message: 'Printer connected successfully!' });
    } else {
      return NextResponse.json({ success: false, error: 'Could not connect to printer at ' + ip + ':' + testPort });
    }
  } catch (error) {
    console.error('Error checking printer:', error);
    return NextResponse.json({ success: false, error: 'Connection test failed' }, { status: 500 });
  }
}
