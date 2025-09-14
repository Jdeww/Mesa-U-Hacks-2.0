# Finals Review Portal - Integrated System

This integrated system combines the beautiful UI from `frontend_bolt` with the functionality from `frontend_test` and cloud processing capabilities.

## Features

- **Beautiful UI**: Polished interface with Tailwind CSS styling and animations
- **File Upload**: Drag and drop file upload with cloud storage integration
- **AI Processing**: Automatic summarization, question generation, and answer extraction
- **Interactive Study Tools**: 
  - Flashcard review system with progress tracking
  - Interactive quiz with timer and explanations
  - Study material display with organized sections

## System Architecture

```
┌─────────────────────────────────────────────┐
│                Frontend                     │
│  (integrated_frontend - React + Tailwind)  │
├─────────────────────────────────────────────┤
│                  API Server                 │
│       (Node.js + Express + Multer)         │
├─────────────────────────────────────────────┤
│              File Processing                │
│         (summarize.py - AI powered)        │
├─────────────────────────────────────────────┤
│               Cloud Storage                 │
│      (S3 integration via cloud folder)     │
└─────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Install Dependencies

#### Frontend:
```bash
cd integrated_frontend
npm install
```

#### API Server:
```bash
cd api_server
npm install
```

#### Python Dependencies:
```bash
cd ..
pip install -r cloud/requirements.txt
pip install openai pdfplumber python-dotenv google-cloud-vision pillow glob2
```

### 2. Environment Setup

Create a `.env` file in the project root with:
```
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials.json
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-2
S3_BUCKET=your_s3_bucket_name
```

### 3. Start the System

#### Terminal 1 - API Server:
```bash
cd api_server
npm start
```

#### Terminal 2 - Frontend:
```bash
cd integrated_frontend
npm run dev
```

The system will be available at:
- Frontend: http://localhost:5173
- API Server: http://localhost:3001

## Usage Flow

1. **Upload Files**: 
   - Go to the homepage
   - Drag and drop study materials (PDFs, text files, images)
   - Files are automatically uploaded to `InputFiles/` directory

2. **Process Files**:
   - Click "Generate Study Materials" button
   - AI processes files and generates:
     - Summarization (saved to `OutputFiles/summarization.txt`)
     - Questions (saved to `OutputFiles/questions.txt`)  
     - Answers (saved to `OutputFiles/answers.txt`)

3. **Study**:
   - Navigate to "Study Session" tab
   - Review flashcards in "Review Mode"
   - Take quizzes in "Quiz Mode"
   - Track progress and scores

## File Structure

```
Mesa-U-Hacks-2.0/
├── integrated_frontend/          # Main React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── types.ts             # TypeScript definitions
│   │   └── ...
├── api_server/                   # Express.js API server
│   ├── server.js               # Main server file
│   └── package.json
├── cloud/                       # Cloud integration
│   ├── cloud_init.py          # S3 setup and utilities
│   ├── FileInput.py           # File input handling
│   └── FileOutput.py          # File output handling
├── InputFiles/                  # User uploaded files
├── OutputFiles/                # AI generated study materials
├── summarize.py               # AI processing script (fixed)
└── INTEGRATION_README.md      # This file
```

## Key Integration Points

1. **File Upload Flow**:
   - Frontend → API Server → InputFiles directory
   - API triggers Python processing script
   - Python script reads from InputFiles, outputs to OutputFiles

2. **Study Material Display**:
   - API serves content from OutputFiles
   - Frontend displays organized study materials
   - Real-time updates when new materials are generated

3. **Cloud Integration**:
   - S3 storage configured via `cloud_init.py`
   - Files can be uploaded to cloud storage
   - Supports various file types (PDF, TXT, images)

## Features Integrated

### From frontend_bolt:
- ✅ Beautiful Tailwind CSS styling
- ✅ Drag and drop file upload interface
- ✅ Responsive design with glass morphism effects
- ✅ Smooth animations and transitions
- ✅ Professional navigation

### From frontend_test:
- ✅ Flashcard review functionality
- ✅ Interactive quiz system with timer
- ✅ Question and answer management
- ✅ Score tracking and progress monitoring

### New Integration Features:
- ✅ API server for backend operations
- ✅ Real file upload and processing
- ✅ AI-powered content generation
- ✅ Cloud storage integration
- ✅ Unified user interface

## Troubleshooting

1. **API Connection Issues**: Ensure API server is running on port 3001
2. **File Processing Errors**: Check Python dependencies and API keys
3. **Upload Issues**: Verify file types are supported (PDF, TXT, images)
4. **Study Materials Not Loading**: Check OutputFiles directory has content

## Next Steps

- Add user authentication
- Implement cloud file synchronization  
- Add more question types and study modes
- Implement progress persistence
- Add collaborative study features