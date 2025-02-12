import { useState, useEffect } from 'react';
import { db, auth, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, sendEmailVerification, updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Form, Card, Container, Spinner, Row, Col, Image } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setPhotoURL(currentUser.photoURL || '');

        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName || currentUser.displayName || '');
          setPhotoURL(userData.photoURL || currentUser.photoURL || '');
        }
      }
    };

    fetchUserData();
  }, []);

  // Handle profile picture upload
  const handleImageUpload = async () => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `profile-pictures/${user.uid}`);
    await uploadBytes(imageRef, imageUpload);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedPhotoURL = photoURL;

      // Upload new profile picture if selected
      if (imageUpload) {
        updatedPhotoURL = await handleImageUpload();
      }

      // Update Firebase Authentication profile
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: updatedPhotoURL,
      });

      // Update Firestore user document
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL: updatedPhotoURL,
      });

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (!newPassword) {
      toast.error('Please enter a new password.');
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Password updated successfully!');
      setNewPassword('');
    } catch (error) {
      toast.error('Error updating password: ' + error.message);
    }
  };

  // Handle email verification
  const handleEmailVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      toast.info('Verification email sent. Please check your inbox.');
    } catch (error) {
      toast.error('Error sending verification email: ' + error.message);
    }
  };

  return (
    <Container className="mt-2">
      <ToastContainer />
      <Row>
        {/* Left Side: Profile Display */}
        <Col md={4}>
          <Card className="profile-card mt-1">
            <Card.Body className="text-center">
              <Image
                src={photoURL || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=='}
                roundedCircle
                fluid
                style={{ width: '150px', height: '150px' }}
              />
              <Card.Title className="mt-3">{displayName || 'No Display Name'}</Card.Title>
              <Card.Text>{user?.email}</Card.Text>
              {user?.emailVerified ? (
                <Card.Text className="text-success">Email Verified</Card.Text>
              ) : (
                <Card.Text className="text-danger">Email Not Verified</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side: Profile Update Forms */}
        <Col md={8}>
          <Card className="profile-card mt-1">
            <Card.Body>
              <Card.Title className='text-primary'>Update Profile</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setImageUpload(e.target.files[0])}
                    accept="image/*"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Update Profile'}
                </Button>
              </Form>

              <hr style={{ borderTop: '2px solid black' }} />

              <Form.Group className="mb-3">
                <Form.Label>Update Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button variant="warning" onClick={handlePasswordUpdate} className="mt-2">
                  Update Password
                </Button>
              </Form.Group>

              {!user?.emailVerified && (
                <Button variant="info" onClick={handleEmailVerification}>
                  Send Verification Email
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;