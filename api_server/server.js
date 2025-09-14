import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paths
const PROJECT_ROOT = path.join(__dirname, '..');
const INPUT_FILES_DIR = path.join(PROJECT_ROOT, 'InputFiles');
const OUTPUT_FILES_DIR = path.join(PROJECT_ROOT, 'OutputFiles');
const CLOUD_DIR = path.join(PROJECT_ROOT, 'cloud');

// Ensure directories exist
await fs.ensureDir(INPUT_FILES_DIR);
await fs.ensureDir(OUTPUT_FILES_DIR);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, INPUT_FILES_DIR);
  },
  filename: (req, file, cb) => {
    // Keep original filename with timestamp prefix to avoid conflicts
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common study file types
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('text/')) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  }
});

// Routes

// Get study materials from OutputFiles
app.get('/api/study-materials', async (req, res) => {
  try {
    const materials = {};
    
    // Read summarization file
    const summarizationPath = path.join(OUTPUT_FILES_DIR, 'summarization.txt');
    if (await fs.pathExists(summarizationPath)) {
      materials.summarization = await fs.readFile(summarizationPath, 'utf8');
    }
    
    // Read questions file
    const questionsPath = path.join(OUTPUT_FILES_DIR, 'questions.txt');
    if (await fs.pathExists(questionsPath)) {
      materials.questions = await fs.readFile(questionsPath, 'utf8');
    }
    
    // Read answers file
    const answersPath = path.join(OUTPUT_FILES_DIR, 'answers.txt');
    if (await fs.pathExists(answersPath)) {
      materials.answers = await fs.readFile(answersPath, 'utf8');
    }
    
    // Get last modified time
    if (await fs.pathExists(summarizationPath)) {
      const stats = await fs.stat(summarizationPath);
      materials.lastUpdated = stats.mtime.toISOString().split('T')[0];
    }
    
    if (Object.keys(materials).length === 1) { // Only lastUpdated
      return res.status(404).json({ message: 'No study materials found' });
    }
    
    res.json(materials);
  } catch (error) {
    console.error('Error reading study materials:', error);
    res.status(500).json({ message: 'Error reading study materials' });
  }
});

// Upload files and trigger processing
app.post('/api/upload-files', upload.array('files'), async (req, res) => {
  try {
    const uploadedFiles = req.files;
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    console.log(`Uploaded ${uploadedFiles.length} files:`, uploadedFiles.map(f => f.filename));
    
    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      }))
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Error uploading files' });
  }
});

// Process files with Python script
app.post('/api/process-files', async (req, res) => {
  try {
    console.log('Starting file processing...');
    
    // Use the virtual environment Python on Windows
    const pythonPath = process.platform === 'win32' ?
      path.join(PROJECT_ROOT, 'venv', 'Scripts', 'python.exe') :
      'python3';

    const pythonProcess = spawn(pythonPath, ['summarize.py'], {
      cwd: PROJECT_ROOT,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('Python output:', data.toString());
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      console.error('Python error:', data.toString());
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('File processing completed successfully');
        res.json({ 
          message: 'Files processed successfully',
          output: output
        });
      } else {
        console.error('Python script failed with code:', code);
        res.status(500).json({ 
          message: 'Error processing files',
          error: error,
          code: code
        });
      }
    });
    
    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python process:', err);
      res.status(500).json({ 
        message: 'Failed to start file processing',
        error: err.message
      });
    });
    
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ message: 'Error processing files' });
  }
});

// Get uploaded files list
app.get('/api/input-files', async (req, res) => {
  try {
    const files = await fs.readdir(INPUT_FILES_DIR);
    const fileDetails = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(INPUT_FILES_DIR, filename);
        const stats = await fs.stat(filePath);
        return {
          name: filename,
          size: stats.size,
          lastModified: stats.mtime,
          type: path.extname(filename)
        };
      })
    );
    
    res.json(fileDetails);
  } catch (error) {
    console.error('Error reading input files:', error);
    res.status(500).json({ message: 'Error reading input files' });
  }
});

// Delete uploaded file
app.delete('/api/input-files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(INPUT_FILES_DIR, filename);
    
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Get cloud files list
app.get('/api/cloud-files', async (req, res) => {
  try {
    const AWS = await import('@aws-sdk/client-s3');
    const { S3Client, ListObjectsV2Command } = AWS;

    const client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      Prefix: 'uploads/',
    });

    const response = await client.send(command);
    const files = (response.Contents || []).map(file => ({
      name: file.Key.replace('uploads/', ''),
      size: file.Size,
      lastModified: file.LastModified,
      url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com/${file.Key}`
    }));

    res.json(files);
  } catch (error) {
    console.error('Error listing cloud files:', error);
    res.status(500).json({ message: 'Error listing cloud files' });
  }
});

// Get user scores for scoreboard
app.get('/api/user-scores', async (req, res) => {
  try {
    const scoresPath = path.join(PROJECT_ROOT, 'user_scores.txt');

    if (!(await fs.pathExists(scoresPath))) {
      return res.json([]);
    }

    const scoresData = await fs.readFile(scoresPath, 'utf8');
    const scores = scoresData.trim().split('\n')
      .filter(line => line.trim()) // Remove empty lines
      .map(line => {
        const parts = line.split('|');
        if (parts.length !== 4) {
          console.warn('Malformed score line:', line);
          return null; // Skip malformed lines
        }
        const [name, points, avgScore, lastPlayed] = parts;

        // Handle both timestamp formats
        let dateISO;
        try {
          const date = new Date(lastPlayed.trim());
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
          }
          dateISO = date.toISOString();
        } catch (error) {
          console.warn('Invalid date format for user:', name, 'date:', lastPlayed);
          dateISO = new Date().toISOString(); // Use current date as fallback
        }

        return {
          name: name.trim(),
          points: parseInt(points) || 0,
          avgScore: parseFloat(avgScore) || 0,
          lastPlayed: dateISO
        };
      })
      .filter(score => score !== null); // Remove null entries

    // Sort by points descending
    scores.sort((a, b) => b.points - a.points);

    res.json(scores);
  } catch (error) {
    console.error('Error reading user scores:', error);
    res.status(500).json({ message: 'Error reading user scores' });
  }
});

// Save user score
app.post('/api/save-score', async (req, res) => {
  try {
    const { name, score, total, elapsedSeconds } = req.body;

    if (!name || typeof score !== 'number' || typeof total !== 'number') {
      return res.status(400).json({ message: 'Invalid score data' });
    }

    const points = Math.max(0, Math.round((score / total) * 1000 + (total * 100) - (elapsedSeconds * 2)));
    const avgScore = (score / total) * 5; // Convert to 5-point scale
    const timestamp = new Date().toISOString();

    const scoresPath = path.join(PROJECT_ROOT, 'user_scores.txt');
    const newScoreLine = `${name}|${points}|${avgScore.toFixed(1)}|${timestamp}\n`;

    await fs.appendFile(scoresPath, newScoreLine);

    res.json({
      message: 'Score saved successfully',
      points,
      avgScore: avgScore.toFixed(1)
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ message: 'Error saving score' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Finals Review API server running on port ${PORT}`);
  console.log(`Project root: ${PROJECT_ROOT}`);
  console.log(`Input files: ${INPUT_FILES_DIR}`);
  console.log(`Output files: ${OUTPUT_FILES_DIR}`);
});