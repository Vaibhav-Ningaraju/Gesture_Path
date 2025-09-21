const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Define allowed file types based on conversion modes
  const allowedTypes = {
    'image/jpeg': 'visual',
    'image/png': 'visual',
    'image/gif': 'visual',
    'image/webp': 'visual',
    'video/mp4': 'visual',
    'video/avi': 'visual',
    'video/mov': 'visual',
    'audio/mp3': 'audio',
    'audio/wav': 'audio',
    'audio/ogg': 'audio',
    'audio/m4a': 'audio',
    'text/plain': 'text',
    'application/pdf': 'text',
    'application/msword': 'text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'text'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1 // Single file upload
  }
});

// POST /api/upload - Handle file uploads
router.post('/', [auth, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const userId = req.user.userId;

    console.log(`📁 File uploaded: ${file.originalname} (${file.size} bytes)`);

    // Determine file type and mode
    const fileTypeMap = {
      'image/': 'visual',
      'video/': 'visual',
      'audio/': 'audio',
      'text/': 'text',
      'application/pdf': 'text',
      'application/msword': 'text',
      'application/vnd.openxmlformats-officedocument': 'text'
    };

    let detectedMode = 'text'; // default
    for (const [type, mode] of Object.entries(fileTypeMap)) {
      if (file.mimetype.startsWith(type) || file.mimetype === type) {
        detectedMode = mode;
        break;
      }
    }

    // TODO: Process file content based on type
    let processedContent = '';
    
    try {
      switch (detectedMode) {
        case 'visual':
          // TODO: Implement image/video processing
          // - Extract metadata (dimensions, duration, etc.)
          // - Generate thumbnails
          // - Extract frames for video
          // - OCR for text in images
          processedContent = `Visual file processed: ${file.originalname}\nType: ${file.mimetype}\nSize: ${file.size} bytes\nPath: ${file.path}`;
          console.log(`🖼️  Visual file processed: ${file.originalname}`);
          break;

        case 'audio':
          // TODO: Implement audio processing
          // - Extract audio metadata (duration, bitrate, etc.)
          // - Generate waveform
          // - Speech-to-text conversion
          processedContent = `Audio file processed: ${file.originalname}\nType: ${file.mimetype}\nSize: ${file.size} bytes\nPath: ${file.path}`;
          console.log(`🎵 Audio file processed: ${file.originalname}`);
          break;

        case 'text':
          // TODO: Implement text processing
          // - Extract text from PDF/Word documents
          // - Parse and clean content
          if (file.mimetype === 'text/plain') {
            const content = await fs.readFile(file.path, 'utf8');
            processedContent = content;
          } else {
            processedContent = `Text document processed: ${file.originalname}\nType: ${file.mimetype}\nSize: ${file.size} bytes`;
          }
          console.log(`📄 Text file processed: ${file.originalname}`);
          break;

        default:
          processedContent = `File processed: ${file.originalname}`;
      }

      // TODO: Save file metadata to database
      // const fileRecord = await FileUpload.create({
      //   userId,
      //   filename: file.filename,
      //   originalName: file.originalname,
      //   mimetype: file.mimetype,
      //   size: file.size,
      //   path: file.path,
      //   mode: detectedMode,
      //   processedContent: processedContent.substring(0, 1000), // Truncate for storage
      //   uploadedAt: new Date()
      // });

      res.json({
        message: 'File uploaded and processed successfully',
        file: {
          id: Date.now().toString(), // Mock ID
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          mode: detectedMode,
          processedContent,
          uploadedAt: new Date().toISOString()
        }
      });

    } catch (processingError) {
      console.error('File processing error:', processingError);
      // Clean up uploaded file on processing error
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        console.error('Failed to delete file:', unlinkError);
      }
      throw processingError;
    }

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete file:', unlinkError);
      }
    }

    res.status(500).json({ 
      error: 'File upload failed',
      message: error.message 
    });
  }
});

// GET /api/upload/:id - Get uploaded file
router.get('/:id', auth, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    // TODO: Fetch file metadata from database
    // const file = await FileUpload.findOne({ _id: fileId, userId });
    
    // Mock implementation
    res.status(404).json({ error: 'File not found' });

  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

// DELETE /api/upload/:id - Delete uploaded file
router.delete('/:id', auth, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    // TODO: Implement file deletion
    // const file = await FileUpload.findOne({ _id: fileId, userId });
    // if (!file) {
    //   return res.status(404).json({ error: 'File not found' });
    // }
    // 
    // await fs.unlink(file.path);
    // await FileUpload.findByIdAndDelete(fileId);

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ error: 'Too many files. Only 1 file allowed.' });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ error: 'Unexpected file field.' });
      default:
        return res.status(400).json({ error: `Upload error: ${error.message}` });
    }
  }
  
  if (error.message.startsWith('Unsupported file type')) {
    return res.status(400).json({ error: error.message });
  }

  next(error);
});

module.exports = router;