import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Backend API URL - Update this when deploying to Hugging Face Spaces
const API_BASE_URL = 'https://rayen96-medtech-image-processor.hf.space';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState('arterial');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setError(null);
      setProcessedImage(null);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, etc.)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhaseChange = (event) => {
    setSelectedPhase(event.target.value);
  };

  const processImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target.result;

        try {
          const response = await axios.post(`${API_BASE_URL}/process`, {
            image: base64Image,
            phase: selectedPhase
          });

          if (response.data.success) {
            setProcessedImage(response.data.processed_image);
          } else {
            setError('Failed to process image');
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          setError(`Failed to process image: ${apiError.response?.data?.error || apiError.message}`);
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing the image');
      setLoading(false);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Medical Phase Simulator</h1>
      </header>

      <main className="App-main">
        <div className="control-panel">
          <div className="file-input-section">
            <label htmlFor="image-upload" className="file-input-label">
              <span className="file-input-text">Choose File</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
            {selectedImage && (
              <span className="selected-file-name">{selectedImage.name}</span>
            )}
          </div>

          <div className="phase-selection">
            <label className="phase-option">
              <input
                type="radio"
                value="arterial"
                checked={selectedPhase === 'arterial'}
                onChange={handlePhaseChange}
              />
              <span className="phase-label">Arterial</span>
            </label>
            <label className="phase-option">
              <input
                type="radio"
                value="venous"
                checked={selectedPhase === 'venous'}
                onChange={handlePhaseChange}
              />
              <span className="phase-label">Venous</span>
            </label>
          </div>

          <button
            onClick={processImage}
            disabled={!selectedImage || loading}
            className="process-button"
          >
            {loading ? 'Processing...' : 'Process Image'}
          </button>
        </div>

        <div className="image-display">
          <div className="image-section">
            <h3>Original</h3>
            {originalImage ? (
              <img src={originalImage} alt="Original" className="display-image" />
            ) : (
              <div className="placeholder-image">
                <p>No image selected</p>
              </div>
            )}
          </div>

          <div className="image-section">
            <h3>Processed</h3>
            {processedImage ? (
              <img src={processedImage} alt="Processed" className="display-image" />
            ) : (
              <div className="placeholder-image">
                <p>Process image to see results</p>
              </div>
            )}
          </div>
        </div>

        {processedImage && (
          <div className="status-message">
            <span className="status-icon">✓</span>
            <span className="status-text">Processing completed</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}
      </main>

 
    </div>
  );
}

export default App;
