import { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col, Nav, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePasswordChange = () => {
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      setError('Please fill in all password fields');
      return false;
    }

    if (passwordData.new_password.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordChange()) {
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const { success, error } = await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });

      if (success) {
        setSuccess('Password updated successfully');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        setError(error || 'Failed to update password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="profile-content">
            <div className="content-header">
              <h2 className="content-title">Personal Information</h2>
              <Button 
                variant="primary" 
                className="edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                <i className="bi bi-pencil me-2"></i>
                Edit Information
              </Button>
            </div>

            {error && <Alert variant="danger" className="profile-alert">{error}</Alert>}
            {success && <Alert variant="success" className="profile-alert">{success}</Alert>}

            {isEditing ? (
              <div className="edit-form">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="profile-label">Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={user?.username || ''}
                          className="profile-input"
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="profile-label">Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={user?.email || ''}
                          className="profile-input"
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h4 className="section-subtitle">Change Password</h4>
                  
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="profile-label">Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="current_password"
                          value={passwordData.current_password}
                          onChange={handlePasswordChange}
                          className="profile-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="profile-label">New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          className="profile-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="profile-label">Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          className="profile-input"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="form-actions">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setIsEditing(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      className="save-btn"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            ) : (
              <div className="info-display">
                <Row>
                  <Col md={6}>
                    <div className="info-field">
                      <label className="info-label">Username</label>
                      <div className="info-value">{user?.username}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="info-field">
                      <label className="info-label">Email Address</label>
                      <div className="info-value">{user?.email}</div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div className="info-field">
                      <label className="info-label">Member Since</label>
                      <div className="info-value">January 2024</div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <Container fluid className="profile-container">
        <Row className="justify-content-center">
          <Col xl={10} lg={11}>
            <Card className="profile-card">
              {/* Profile Header */}
              <div className="profile-header">
                <div className="avatar-section">
                  <div className="user-avatar">
                    {getUserInitial()}
                  </div>
                  <div className="user-info">
                    <h1 className="user-name">{user?.username || 'User'}</h1>
                    <p className="user-email">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="profile-nav-container">
                <Nav className="profile-nav">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'personal'}
                      onClick={() => setActiveTab('personal')}
                      className="profile-nav-link"
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      Personal Information
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              {/* Content Area */}
              <Card.Body className="profile-body">
                {renderTabContent()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile; 