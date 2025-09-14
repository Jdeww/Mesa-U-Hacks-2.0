# Nimbus Notes

**AI-Powered Study Platform with OCR and Competitive Learning**

Nimbus Notes is a comprehensive study platform that transforms your uploaded documents into interactive study materials using AI. Upload text files, PDFs, or handwritten notes seamlessly to the cloud, and get AI-generated summaries, flashcards, quizzes, and competitive scoreboards. Ever wanted to see which one of your friends is the smartest? Well now you have the perfect chance to get bragging rights. It takes multiple users and combines all their notes to make a master summary to help you with your education.

##Link to demo video: https://drive.google.com/file/d/1bDneAJv2Zd1_IKepUBEivc18ERxa-7R7/view?usp=sharing 

Contributors:
-Ace Maharjan
-Jason Wilaysono
-Kyle Le
-Darien Chau
## 🚀 Features

### 📚 Study Material Generation
- **Smart OCR**: Process handwritten notes and images using Google Cloud Vision API
- **PDF Processing**: Extract text from PDFs with advanced parsing
- **AI Summarization**: Generate comprehensive study guides with proper sectioning
- **Multiple Format Support**: Text files, PDFs, images (JPG, PNG)

### 🎯 Interactive Learning
- **Flashcard Review**: Interactive card-flipping interface with progress tracking
- **Quiz Mode**: Multiple-choice questions with explanations
- **Beautiful UI**: Modern, responsive design with smooth animations

### 🏆 Competitive Learning
- **Real-time Scoreboard**: Compare your quiz scores with friends
- **Points System**: Smart scoring based on accuracy, speed, and difficulty
- **Leaderboard Rankings**: See where you stand among your study group
- **Achievement Recognition**: Special badges for top performers

### ☁️ Cloud Integration
- **File Management**: Upload and manage study files in the cloud
- **AWS S3 Storage**: Reliable cloud storage for your documents
- **Document Browser**: View and download your uploaded files

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **Multer** for file uploads
- **AWS S3** for cloud storage
- **Python** for AI processing

### AI & Processing
- **OpenAI GPT-4** for text summarization
- **Google Cloud Vision API** for OCR
- **pdfplumber** for PDF text extraction
- **Pillow** for image processing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Google Cloud Vision API credentials
- OpenAI API key
- AWS S3 bucket (optional, for cloud storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Mesa-U-Hacks-2.0.git
   cd Mesa-U-Hacks-2.0
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials.json
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-2
   S3_BUCKET=your_s3_bucket_name
   ```

4. **Start the application**
   ```bash
   ./start.sh
   ```

   Or manually:
   ```bash
   # Terminal 1: Start API server
   cd api_server
   npm install
   npm start

   # Terminal 2: Start frontend
   cd integrated_frontend
   npm install
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - API Server: http://localhost:3001

## 📖 Usage Guide

### 1. Upload Study Materials
- Navigate to the Home page
- Drag and drop files or click "Choose Files"
- Supported formats: PDF, TXT, JPG, PNG
- Click "Generate Study Materials" to process

### 2. Review with Flashcards
- Go to Study Session → Review Mode
- Click through flashcards to review content
- Mark cards as "known" to track progress
- Complete review to unlock quiz

### 3. Take Competitive Quizzes
- After completing flashcard review, enter your name
- Answer multiple-choice questions with timer
- Get immediate feedback with explanations
- View your ranking on the leaderboard

### 4. Manage Cloud Files
- Use the Documents page to view uploaded files
- Download or manage your study materials
- Files are stored securely in AWS S3

## 🏗️ Project Structure

```
Mesa-U-Hacks-2.0/
├── api_server/                 # Express.js API server
│   ├── server.js              # Main server file
│   └── package.json           # API dependencies
├── integrated_frontend/       # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── main.tsx          # Entry point
│   └── package.json          # Frontend dependencies
├── InputFiles/               # Uploaded files storage
├── OutputFiles/             # Generated study materials
├── summarize.py             # AI processing script
├── user_scores.txt          # Leaderboard data
├── requirements.txt         # Python dependencies
└── start.sh                # Quick start script
```

## 🎨 Key Components

### FlashcardViewer
Interactive flashcard interface with 3D flip animations and progress tracking.

### Quiz
Timed multiple-choice quiz system with immediate feedback and explanations.

### Scoreboard
Competitive leaderboard showing real-time rankings and points.

### DocumentsPage
Cloud file management interface with download capabilities.

## 🔧 Configuration

### Points Calculation
```javascript
points = (accuracy × 1000) + (questions × 100) - (time × 2)
```

### File Upload Limits
- Maximum file size: 50MB
- Supported types: PDF, TXT, JPG, JPEG, PNG, DOC, DOCX

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project may be liscensed in the future, but for now go ahead and use it as you see fit.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Google Cloud for Vision API
- React team for the amazing framework
- All contributors and hackathon participants

## 🐛 Troubleshooting

### Common Issues
**Generate summary not working?**
-Ensure your frontend is correctly connected to your api and your api is running properly
-Ensure that your .env file is setup with a working OPENAI API key
**OCR not working?**
- Ensure Google Cloud Vision API credentials are properly set
- Check that the JSON credentials file exists
- Verify API quotas and billing

**File uploads failing?**
- Check file size limits (50MB max)
- Ensure supported file formats
- Verify upload directories exist

**Quiz not loading?**
- Ensure study materials have been generated
- Check that questions.txt exists in OutputFiles
- Verify AI processing completed successfully

For more help, contact ace.maharjan@csueastbay.edu :)
