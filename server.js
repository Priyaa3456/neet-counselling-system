import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({ dest: 'uploads/' });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-counselling')
  .then(() => console.log('\n✓ MongoDB Connected'))
  .catch(err => console.log('✗ MongoDB Error:', err.message));

// Registration Schema
const registrationSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  neetRoll: String,
  neetScore: Number,
  category: String,
  documents: [String],
  payment500: { status: String, transactionId: String, timestamp: Date },
  collegePrefences: [{ type: String }],
  choicesLocked: { type: Boolean, default: false },
  payment20000: { status: String, transactionId: String, timestamp: Date },
  applicationStatus: { type: String, default: 'Incomplete' },
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Routes

// 1. New Registration
app.post('/api/register', async (req, res) => {
  try {
    const { phone, dob } = req.body;
    const existing = await Registration.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Phone already registered' });
    }
    const registration = new Registration({ phone, dob });
    await registration.save();
    res.json({ message: 'Registration successful', id: registration._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Registration by Phone
app.get('/api/registration/:phone', async (req, res) => {
  try {
    const registration = await Registration.findOne({ phone: req.params.phone });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update NEET Results
app.post('/api/update-neet/:phone', async (req, res) => {
  try {
    const { neetRoll, neetScore, category } = req.body;
    await Registration.updateOne({ phone: req.params.phone }, { neetRoll, neetScore, category });
    res.json({ message: 'NEET details updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Upload Documents
app.post('/api/upload-documents/:phone', upload.array('documents', 5), async (req, res) => {
  try {
    const filePaths = req.files ? req.files.map(f => f.path) : [];
    await Registration.updateOne({ phone: req.params.phone }, { documents: filePaths });
    res.json({ message: 'Documents uploaded', files: filePaths });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Process Payment 500
app.post('/api/payment-500/:phone', async (req, res) => {
  try {
    const transactionId = 'TXN_' + Date.now();
    await Registration.updateOne(
      { phone: req.params.phone },
      {
        'payment500': {
          status: 'Completed',
          transactionId: transactionId,
          timestamp: new Date()
        }
      }
    );
    res.json({ message: 'Payment processed', transactionId, amount: 500 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Update College Preferences
app.post('/api/college-preferences/:phone', async (req, res) => {
  try {
    const { preferences } = req.body;
    await Registration.updateOne({ phone: req.params.phone }, { collegePrefences: preferences });
    res.json({ message: 'College preferences saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Lock Choices
app.post('/api/lock-choices/:phone', async (req, res) => {
  try {
    await Registration.updateOne({ phone: req.params.phone }, { choicesLocked: true });
    res.json({ message: 'Choices locked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Process Payment 20000
app.post('/api/payment-20000/:phone', async (req, res) => {
  try {
    const transactionId = 'TXN_' + Date.now();
    await Registration.updateOne(
      { phone: req.params.phone },
      {
        'payment20000': {
          status: 'Completed',
          transactionId: transactionId,
          timestamp: new Date()
        },
        applicationStatus: 'Complete'
      }
    );
    res.json({ message: 'Final payment processed', transactionId, amount: 20000 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Get Dashboard Data
app.get('/api/dashboard/:phone', async (req, res) => {
  try {
    const registration = await Registration.findOne({ phone: req.params.phone });
    if (!registration) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════╗`);
  console.log(`║   NEET Counselling System Started        ║`);
  console.log(`║   http://localhost:${PORT}                    ║`);
  console.log(`╚════════════════════════════════════════════╝\n`);
});
