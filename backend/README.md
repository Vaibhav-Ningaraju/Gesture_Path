# Gesture Path Backend API

A Node.js/Express backend for the Gesture Path multimodal AI conversion platform.

## Features

- 🔐 JWT-based authentication
- 💬 Chat management
- 🔄 Multimodal conversion (Text ↔ Visual ↔ Audio)
- 📁 File upload handling
- ⚡ Instant conversion mode
- 🛡️ Security middleware (Helmet, CORS, rate limiting)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Chat Management
- `GET /api/chat` - Get user's chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/:id` - Get specific chat
- `DELETE /api/chat/:id` - Delete chat
- `POST /api/chat/:id/messages` - Add message to chat

### Conversion
- `POST /api/convert` - Main conversion endpoint
- `POST /api/convert/instant` - Instant conversion
- `GET /api/convert/history` - Conversion history

### File Upload
- `POST /api/upload` - Upload files
- `GET /api/upload/:id` - Get uploaded file
- `DELETE /api/upload/:id` - Delete uploaded file

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required Environment Variables**
   - `JWT_SECRET` - Secret key for JWT tokens
   - `OPENAI_API_KEY` - For GPT, DALL-E, Whisper integration
   - `MONGODB_URI` - Database connection string

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Implementation TODO

### Database Models
Create these models in your chosen database (MongoDB/PostgreSQL):

```javascript
// User Model
{
  id: String,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}

// Chat Model
{
  id: String,
  title: String,
  userId: String (foreign key),
  inputMode: String (enum: visual, audio, text),
  outputMode: String (enum: visual, audio, text),
  createdAt: Date,
  updatedAt: Date
}

// Message Model
{
  id: String,
  chatId: String (foreign key),
  content: String,
  role: String (enum: user, assistant),
  type: String (enum: text, audio, visual),
  metadata: Object,
  timestamp: Date
}

// FileUpload Model
{
  id: String,
  userId: String (foreign key),
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  path: String,
  mode: String (enum: visual, audio, text),
  processedContent: String,
  uploadedAt: Date
}

// ConversionHistory Model
{
  id: String,
  userId: String (foreign key),
  inputMode: String,
  outputMode: String,
  inputContent: String,
  outputContent: String,
  processingTime: Number,
  timestamp: Date
}
```

### AI Integration Points

1. **Text to Visual** (`routes/conversion.js:45`)
   - Integrate DALL-E, Midjourney, or Stable Diffusion
   - Generate images from text descriptions

2. **Text to Audio** (`routes/conversion.js:52`)
   - Integrate OpenAI TTS or ElevenLabs
   - Convert text to natural speech

3. **Visual to Text** (`routes/conversion.js:59`)
   - Integrate GPT-4 Vision or Google Vision API
   - Describe images, extract text (OCR)

4. **Visual to Audio** (`routes/conversion.js:68`)
   - Generate audio descriptions
   - Create music based on visual content

5. **Audio to Text** (`routes/conversion.js:75`)
   - Integrate Whisper or Google STT
   - Transcribe speech to text

6. **Audio to Visual** (`routes/conversion.js:82`)
   - Generate visualizations from audio
   - Create waveforms, spectrograms

### File Processing

1. **Image Processing** (`routes/upload.js:85`)
   - Image resizing, format conversion
   - Metadata extraction
   - OCR for text in images

2. **Audio Processing** (`routes/upload.js:95`)
   - Audio format conversion
   - Metadata extraction (duration, bitrate)
   - Speech-to-text preprocessing

3. **Text Processing** (`routes/upload.js:105`)
   - PDF text extraction
   - Document parsing
   - Content cleaning and formatting

### Security & Performance

1. **Database Integration**
   - Replace mock data with actual database operations
   - Add proper indexing and relationships

2. **Caching**
   - Implement Redis for conversion results
   - Cache frequently accessed data

3. **File Storage**
   - Integrate with cloud storage (AWS S3, Google Cloud Storage)
   - Implement file cleanup and lifecycle management

4. **Monitoring & Logging**
   - Add proper logging with Winston
   - Implement error tracking (Sentry)
   - Add API monitoring and metrics

## Error Handling

The API includes comprehensive error handling:
- Input validation with express-validator
- File upload error handling
- Authentication errors
- Rate limiting
- Database connection errors

## Security Features

- JWT token-based authentication
- Input sanitization and validation
- File type restrictions
- Rate limiting
- CORS configuration
- Helmet security headers

## Development vs Production

### Development
- Uses mock data for quick testing
- Detailed error messages
- File storage in local uploads directory

### Production
- Replace with actual database
- Implement proper error logging
- Use cloud storage for files
- Enable all security features
- Set up proper environment variables