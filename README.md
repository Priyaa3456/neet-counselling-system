# NEET Counselling Registration System

A complete full-stack web application for NEET counselling registration with multi-step form, document upload, and payment integration.

## 🎯 Features

### 6-Step Registration Process
1. **Registration** - Phone Number & Date of Birth
2. **NEET Details** - NEET Roll, Score & Category
3. **Documents** - Upload Medical Certificate, ID Proof, etc.
4. **Payment 1** - ₹500 Registration Fee via QR Code
5. **College Selection** - Choose up to 5 colleges
6. **Payment 2** - ₹20,000 Choice Filling Fee via QR Code

## 📋 Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: React.js + HTML/CSS
- **File Upload**: Multer
- **Payment**: QR Code Integration

## 🚀 Installation & Setup

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Priyaa3456/neet-counselling-system.git
cd neet-counselling-system

# 2. Install dependencies
npm install

# 3. Start MongoDB (if local)
mongod

# 4. Run server
npm start

# 5. Open browser
http://localhost:5000
```

## 📁 File Structure

```
neet-counselling-system/
├── server.js              # Express backend
├── package.json           # Dependencies
├── .env                   # Environment variables
└── public/
    ├── index.html         # Main HTML
    ├── style.css          # Styling
    ├── app.js             # React components
    └── uploads/           # Uploaded documents
```

## 🔗 API Endpoints

- `POST /api/register` - New registration
- `POST /api/update-neet/:phone` - Update NEET details
- `POST /api/upload-documents/:phone` - Upload documents
- `POST /api/payment-500/:phone` - Process ₹500 payment
- `POST /api/payment-20000/:phone` - Process ₹20,000 payment
- `POST /api/college-preferences/:phone` - Save preferences
- `POST /api/lock-choices/:phone` - Lock choices
- `GET /api/dashboard/:phone` - Get application status

## 🌐 Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

## 📞 Support

For technical issues:
- Phone: +91-9266333546
- Email: jcecebhelpdesk@gmail.com

## 📄 License

MIT License - Educational Purpose
