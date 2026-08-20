const API_BASE = 'http://localhost:5000/api';
const { useState } = React;

const colleges = [
  { id: 1, name: 'AIIMS Ranchi', state: 'Jharkhand', seats: 100, rank: 1 },
  { id: 2, name: 'Rajendra Institute of Medical Sciences', state: 'Jharkhand', seats: 85, rank: 2 },
  { id: 3, name: 'National Institute of Medical Sciences', state: 'Rajasthan', seats: 150, rank: 3 },
  { id: 4, name: 'GMC Chandigarh', state: 'Chandigarh', seats: 120, rank: 4 },
  { id: 5, name: 'PGIMER Chandigarh', state: 'Chandigarh', seats: 110, rank: 5 },
  { id: 6, name: 'Delhi Medical College', state: 'Delhi', seats: 130, rank: 6 },
  { id: 7, name: 'Christian Medical College', state: 'Tamil Nadu', seats: 140, rank: 7 },
  { id: 8, name: 'JIPMER Puducherry', state: 'Puducherry', seats: 135, rank: 8 },
];

function Header() {
  return (
    <header>
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">JCB</div>
          <div className="header-title">
            <h1>Jharkhand Combined Entrance Board</h1>
            <p>Online Counselling for M.B.B.S./B.D.S. Admissions - 2026</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: 'Registration' },
    { num: 2, label: 'NEET Details' },
    { num: 3, label: 'Documents' },
    { num: 4, label: 'Payment 1' },
    { num: 5, label: 'College Choice' },
    { num: 6, label: 'Payment 2' },
  ];

  return (
    <div className="steps">
      {steps.map((step) => (
        <div key={step.num} className={`step ${currentStep >= step.num ? 'completed' : ''} ${currentStep === step.num ? 'active' : ''}`}>
          <div className="step-number">{step.num}</div>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
}

function RegistrationStep({ onNext }) {
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !dob) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, dob })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userPhone', phone);
        onNext();
      } else {
        setError(data.message || 'Error during registration');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>📝 New Registration</h2>
        <p>Enter your phone number and date of birth</p>
      </div>
      {error && <div className="alert alert-error">❌ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone Number *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" pattern="[0-9]{10}" required />
        </div>
        <div className="form-group">
          <label>Date of Birth *</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </div>
        <div className="button-group">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Processing...' : 'Continue to NEET Details'}
          </button>
        </div>
      </form>
    </div>
  );
}

function NEETStep({ onNext, onPrev }) {
  const [neetRoll, setNeetRoll] = useState('');
  const [neetScore, setNeetScore] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const phone = localStorage.getItem('userPhone');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!neetRoll || !neetScore || !category) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/update-neet/${phone}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ neetRoll, neetScore, category })
      });
      if (response.ok) {
        onNext();
      } else {
        setError('Error saving NEET details');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>📊 NEET Examination Details</h2>
        <p>Enter your NEET result information</p>
      </div>
      {error && <div className="alert alert-error">❌ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>NEET Roll Number *</label>
          <input type="text" value={neetRoll} onChange={(e) => setNeetRoll(e.target.value)} placeholder="Your NEET roll number" required />
        </div>
        <div className="form-group">
          <label>NEET Score (out of 720) *</label>
          <input type="number" value={neetScore} onChange={(e) => setNeetScore(e.target.value)} placeholder="Your NEET score" min="0" max="720" required />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">-- Select Category --</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>
        <div className="button-group">
          <button type="button" className="btn-cancel" onClick={onPrev}>← Back</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : 'Continue to Documents'}
          </button>
        </div>
      </form>
    </div>
  );
}

function DocumentsStep({ onNext, onPrev }) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const phone = localStorage.getItem('userPhone');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (documents.length + files.length > 5) {
      setError('Maximum 5 documents allowed');
      return;
    }
    setDocuments([...documents, ...files]);
  };

  const removeDocument = (idx) => {
    setDocuments(documents.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (documents.length === 0) {
      setError('Please upload at least one document');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      documents.forEach(doc => formData.append('documents', doc));
      const response = await fetch(`${API_BASE}/upload-documents/${phone}`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        onNext();
      } else {
        setError('Error uploading documents');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>📄 Document Upload</h2>
        <p>Upload required documents (Medical Certificate, ID Proof, etc.)</p>
      </div>
      {error && <div className="alert alert-error">❌ {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Upload Documents *</label>
          <div className="file-upload" onClick={() => document.getElementById('fileInput').click()}>
            <p>📁 Click to select documents or drag & drop</p>
            <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>PDF, JPG, PNG (Max 5 files)</p>
            <input id="fileInput" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
          </div>
        </div>
        {documents.length > 0 && (
          <div className="file-list">
            <label>Selected Documents ({documents.length}):</label>
            {documents.map((doc, idx) => (
              <div key={idx} className="file-item">
                <span>✓ {doc.name}</span>
                <button type="button" onClick={() => removeDocument(idx)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <div className="button-group">
          <button type="button" className="btn-cancel" onClick={onPrev}>← Back</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Payment500Step({ onNext, onPrev }) {
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const phone = localStorage.getItem('userPhone');

  const handlePaymentVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/payment-500/${phone}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setPaymentDone(true);
        setTimeout(() => onNext(), 2000);
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>💳 Registration Fee Payment</h2>
        <p>Complete the payment to proceed</p>
      </div>
      {error && <div className="alert alert-error">❌ {error}</div>}
      {paymentDone && <div className="alert alert-success">✓ Payment successful! Proceeding...</div>}
      <div className="payment-section">
        <h3>Scan QR Code to Pay</h3>
        <div className="payment-amount">₹500</div>
        <div className="qr-code">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=neet@bank&pn=NEET%20Counselling&am=500&tn=Registration" alt="Payment QR" />
        </div>
        <p className="payment-instruction">📱 Scan with your phone<br/>Click button after transferring ₹500</p>
        <button type="button" className="btn-submit" onClick={handlePaymentVerify} disabled={loading || paymentDone} style={{ marginTop: '20px' }}>
          {loading ? 'Verifying...' : '✓ Payment Complete'}
        </button>
      </div>
      <div className="button-group" style={{ marginTop: '20px' }}>
        <button type="button" className="btn-cancel" onClick={onPrev}>← Back</button>
      </div>
    </div>
  );
}

function CollegeChoiceStep({ onNext, onPrev }) {
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const phone = localStorage.getItem('userPhone');

  const toggleCollege = (collegeId) => {
    if (selectedColleges.includes(collegeId)) {
      setSelectedColleges(selectedColleges.filter(id => id !== collegeId));
    } else {
      if (selectedColleges.length < 5) {
        setSelectedColleges([...selectedColleges, collegeId]);
      } else {
        setError('Maximum 5 colleges can be selected');
      }
    }
  };

  const handleLockChoices = async () => {
    if (selectedColleges.length === 0) {
      setError('Please select at least one college');
      return;
    }
    setLoading(true);
    try {
      await fetch(`${API_BASE}/college-preferences/${phone}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: selectedColleges })
      });
      await fetch(`${API_BASE}/lock-choices/${phone}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      onNext();
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>🎓 Select College Preferences</h2>
        <p>Choose up to 5 colleges in order of preference</p>
      </div>
      {error && <div className="alert alert-error">❌ {error}</div>}
      <div className="alert alert-info">ℹ️ You have selected {selectedColleges.length} out of 5 colleges</div>
      <div className="college-list">
        {colleges.map(college => (
          <div key={college.id} className={`college-card ${selectedColleges.includes(college.id) ? 'selected' : ''}`} onClick={() => toggleCollege(college.id)}>
            <div className="checkbox-custom"></div>
            <div className="college-rank">Rank #{college.rank}</div>
            <div className="college-name">{college.name}</div>
            <div className="college-info">📍 {college.state}<br/>👥 Seats: {college.seats}</div>
          </div>
        ))}
      </div>
      <div className="button-group" style={{ marginTop: '30px' }}>
        <button type="button" className="btn-cancel" onClick={onPrev}>← Back</button>
        <button type="button" className="btn-submit" onClick={handleLockChoices} disabled={loading}>
          {loading ? 'Locking...' : 'Lock Choices & Continue'}
        </button>
      </div>
    </div>
  );
}

function Payment20000Step({ onNext, onPrev }) {
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const phone = localStorage.getItem('userPhone');

  const handlePaymentVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/payment-20000/${phone}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setPaymentDone(true);
        setTimeout(() => {
          localStorage.setItem('applicationComplete', 'true');
          onNext();
        }, 2000);
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>💳 Final Payment - Choice Filling Fee</h2>
        <p>Complete this payment to finalize your college choices</p>
      </div>
      {error && <div className="alert alert-error">❌ {error}</div>}
      {paymentDone && <div className="alert alert-success">✓ Payment successful! Your application is complete!</div>}
      <div className="payment-section">
        <h3>Scan QR Code to Pay Final Amount</h3>
        <div className="payment-amount">₹20,000</div>
        <div className="qr-code">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=neet@bank&pn=NEET%20Counselling&am=20000&tn=Choice%20Filling%20Fee" alt="Payment QR" />
        </div>
        <p className="payment-instruction">📱 Scan with your phone<br/>Click button after transferring ₹20,000</p>
        <button type="button" className="btn-submit" onClick={handlePaymentVerify} disabled={loading || paymentDone} style={{ marginTop: '20px' }}>
          {loading ? 'Verifying...' : '✓ Payment Complete'}
        </button>
      </div>
      <div className="button-group" style={{ marginTop: '20px' }}>
        <button type="button" className="btn-cancel" onClick={onPrev}>← Back</button>
      </div>
    </div>
  );
}

function CompletionStep() {
  return (
    <div className="card">
      <div className="card-header">
        <h2 style={{ color: '#4caf50', fontSize: '32px' }}>🎉 Application Complete!</h2>
        <p>Your NEET counselling application has been successfully submitted</p>
      </div>
      <div className="alert alert-success">✓ Your application is complete and all payments have been received.</div>
      <div className="dashboard-grid" style={{ marginTop: '30px' }}>
        <div className="status-card completed"><h3>Registration</h3><p>✓</p></div>
        <div className="status-card completed"><h3>NEET Details</h3><p>✓</p></div>
        <div className="status-card completed"><h3>Documents</h3><p>✓</p></div>
        <div className="status-card completed"><h3>Payment 1</h3><p>₹500</p></div>
        <div className="status-card completed"><h3>College Choice</h3><p>✓</p></div>
        <div className="status-card completed"><h3>Payment 2</h3><p>₹20K</p></div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>You will receive an email confirmation with your registration details.<br/>Please keep your phone number and credentials safe.</p>
        <button className="btn-submit" onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '12px 35px' }}>Start New Registration</button>
      </div>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const steps_list = [
    <RegistrationStep onNext={() => setStep(1)} />,
    <NEETStep onNext={() => setStep(2)} onPrev={() => setStep(0)} />,
    <DocumentsStep onNext={() => setStep(3)} onPrev={() => setStep(1)} />,
    <Payment500Step onNext={() => setStep(4)} onPrev={() => setStep(2)} />,
    <CollegeChoiceStep onNext={() => setStep(5)} onPrev={() => setStep(3)} />,
    <Payment20000Step onNext={() => setStep(6)} onPrev={() => setStep(4)} />,
    <CompletionStep />,
  ];

  return (
    <>
      <Header />
      <div className="container">
        <StepIndicator currentStep={step + 1} />
        {steps_list[step]}
      </div>
      <footer>
        <p>© Jharkhand Combined Entrance Competitive Examination Board. All Rights Reserved.</p>
        <p>Technical Support: +91-9266333546 | jcecebhelpdesk@gmail.com</p>
      </footer>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
