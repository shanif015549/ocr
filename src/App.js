
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null); // For storing the uploaded image
  const [ocrResults, setOcrResults] = useState([]); // For storing the OCR results
  const [loading, setLoading] = useState(false); // For displaying loading state

  // Handle image upload
  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle form submission to upload the image and get OCR results
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    // Create a form data object to send the image to the server
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://127.0.0.1:5000/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOcrResults(response.data.results); // Set the OCR results from the API response
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Upload an Image for OCR</h1>
      
      {/* Image Upload Form */}
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageUpload} required />
        <button type="submit">Upload and Recognize</button>
      </form>

      {/* Show loading spinner */}
      {loading && <p>Loading...</p>}

      {/* Display OCR Results */}
      {ocrResults.length > 0 && (
        <div>
          <h2>OCR Results:</h2>
          <ul>
            {ocrResults.map((result, index) => (
              <li key={index}>
                <strong>Text:</strong> {result.text} <br />
                <strong>Confidence:</strong> {result.confidence.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

