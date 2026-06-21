const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const authRouter = require('./auth-router');
const settingRouter = require('./setting-router');
const categoryRouter = require('./category-router');
const productRouter = require('./product-router');

// Health Check Route
router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running successfully' });
});

// Raw Multipart Image Upload Endpoint
router.post('/upload', (req, res) => {
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('multipart/form-data')) {
    return res.status(400).json({ success: false, message: 'Invalid Content-Type' });
  }

  const boundaryMatch = contentType.match(/boundary=(.+)/);
  if (!boundaryMatch) {
    return res.status(400).json({ success: false, message: 'Boundary not found in request headers' });
  }
  const boundary = boundaryMatch[1];

  let rawData = [];
  req.on('data', chunk => {
    rawData.push(chunk);
  });

  req.on('end', () => {
    try {
      const buffer = Buffer.concat(rawData);
      const boundaryBuffer = Buffer.from(`--${boundary}`);
      const firstBoundaryIndex = buffer.indexOf(boundaryBuffer);
      if (firstBoundaryIndex === -1) {
        return res.status(400).json({ success: false, message: 'Multipart structure invalid' });
      }

      const headersStartIndex = firstBoundaryIndex + boundaryBuffer.length + 2;
      const headersEndIndex = buffer.indexOf(Buffer.from('\r\n\r\n'), headersStartIndex);
      if (headersEndIndex === -1) {
        return res.status(400).json({ success: false, message: 'Headers not terminated' });
      }

      const headersText = buffer.slice(headersStartIndex, headersEndIndex).toString('latin1');
      const filenameMatch = headersText.match(/filename="([^"]+)"/);
      if (!filenameMatch) {
        return res.status(400).json({ success: false, message: 'Filename not found' });
      }
      
      const filename = filenameMatch[1];
      const safeFilename = Date.now() + '_' + filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const dataStartIndex = headersEndIndex + 4;
      
      const closingBoundaryBuffer = Buffer.from(`\r\n--${boundary}`);
      const dataEndIndex = buffer.indexOf(closingBoundaryBuffer, dataStartIndex);
      if (dataEndIndex === -1) {
        return res.status(400).json({ success: false, message: 'Closing boundary not found' });
      }

      const fileData = buffer.slice(dataStartIndex, dataEndIndex);
      const uploadPath = path.join(process.cwd(), 'uploads', safeFilename);
      
      // Ensure directory exists (fallback check)
      const uploadDir = path.dirname(uploadPath);
      if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(uploadPath, fileData);
      
      const fileUrl = `/uploads/${safeFilename}`;
      return res.json({ success: true, url: fileUrl });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });
});

// List all uploaded images
router.get('/images', (req, res) => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    return res.json({ success: true, data: [] });
  }

  try {
    const files = fs.readdirSync(uploadDir);
    const images = files.map(file => {
      const filePath = path.join(uploadDir, file);
      const stat = fs.statSync(filePath);
      return {
        name: file,
        url: `/uploads/${file}`,
        size: stat.size,
        createdAt: stat.birthtime
      };
    }).sort((a, b) => b.createdAt - a.createdAt); // newest first

    return res.json({ success: true, data: images });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Delete an uploaded image
router.delete('/images/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.use('/auth', authRouter);
router.use('/settings', settingRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);

module.exports = router;
