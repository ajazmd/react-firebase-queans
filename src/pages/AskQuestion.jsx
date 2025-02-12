
import { useState,useEffect } from 'react';
import { db, auth, storage } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaExclamationCircle } from "react-icons/fa";
import { BsUpload } from "react-icons/bs"; // Import the Upload icon
import { toast, ToastContainer } from 'react-toastify';

const AskQuestion = () => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null); // Store the uploaded image file
  const [imageUrl, setImageUrl] = useState(''); // Store the image URL
  const [error, setError] = useState(''); // Store validation errors

  // Use useEffect to clear the error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Clear the error message
      }, 3000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on unmount or error change
    }
  }, [error]); // Run this effect whenever `error` changes

  

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      setError('Please log in to ask a question.');
      return;
    }

    // Validate that either text or image is provided
    if (!text && !imageFile) {
      setError('Please enter a question or upload an image.');
      return;
    }
      

    try {
      let uploadedImageUrl = null;

      // Upload image to Firebase Storage if an image is selected
      if (imageFile) {
        const storageRef = ref(storage, `question-images/${auth.currentUser.uid}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      // Save question to Firestore
      await addDoc(collection(db, 'questions'), {
        text: text || null, // Save text if provided, otherwise null
        imageUrl: uploadedImageUrl || null, // Save image URL if provided, otherwise null
        askedBy: auth.currentUser.email,
        createdAt: new Date(),
      });

      toast.success('Your question is submitted successfully!');
      setText(''); // Clear the question input
      setImageFile(null); // Clear the uploaded image
      setImageUrl(''); // Clear the image URL
      setError(''); // Clear any errors
    } catch (error) {
      console.error('Error submitting question: ', error);
      toast.error('Error submitting question. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the uploaded image file
      setImageUrl(URL.createObjectURL(file)); // Display the image preview
      setError(''); // Clear any errors when an image is uploaded
    }
  };

  return (
    <Form>
      <ToastContainer />
      <Form.Group controlId="question">
        <Form.Label className="text-center w-100">
          <h3 className="fw-bold">What can I help you?</h3>
        </Form.Label>
        {error &&  !auth.currentUser && (
              <Alert variant="danger" className="custom-alert text-center">
                <FaExclamationCircle className="me-2" /> {/* Add icon */}
                <span className="d-inline-block">{error}</span> {/* Ensure text wraps */}
              </Alert>
            )}
        <div
          style={{
            border: '1px solid #ced4da',
            borderRadius: '4px',
            padding: '10px',
            position: 'relative',
          }}
        >
          {/* Textarea for the question */}
          <Form.Control
            as="textarea"
            rows={4}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(''); // Clear any errors when text is entered
            }}
            placeholder="Type your question here..."
            style={{ border: 'none', paddingRight: '40px' }} // Remove border and add padding for the icon
          />
          {/* Upload icon inside the question box */}
          <label
            htmlFor="imageUpload"
            style={{
              position: 'absolute',
              right: '10px',
              bottom: '10px',
              cursor: 'pointer',
            }}
          >
            <span style={{ pointerEvents: 'none', opacity: 0.5 }}>
            <BsUpload size={24} color='blue'/>
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }} // Hide the file input
            id="imageUpload"
            disabled
          />
          {/* Display image preview inside the question box */}
          {imageUrl && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={imageUrl}
                alt="Uploaded"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }}
              />
            </div>
          )}
        </div>
        {/* Display validation error */}
        { auth.currentUser && error && <p className="text-danger fw-semibold mt-2"><span className="text-danger me-1">*</span>{error}</p>}
      </Form.Group>

      <div className="text-center">
        <Button variant="primary" onClick={handleSubmit} className="w-50 mt-3">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default AskQuestion;