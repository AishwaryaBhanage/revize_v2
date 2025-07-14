import { useState, useEffect, useContext } from 'react';
import { Card, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getTodaysTopics } from '../../services/api';
import { RefreshContext } from '../dashboard/ModernDashboard';

const TodaysLearningList = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { refreshTrigger } = useContext(RefreshContext);

  useEffect(() => {
    if (user) {
      fetchTodaysTopics();
    }
  }, [user, refreshTrigger]);

  const fetchTodaysTopics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getTodaysTopics();
      setTopics(response.data || []);
    } catch (err) {
      setError('Failed to fetch today\'s topics');
      console.error('Error fetching today\'s topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="h-100">
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-book me-2"></i>
            Today's Learning
          </h5>
        </Card.Header>
        <Card.Body className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100">
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-book me-2"></i>
          Today's Learning
          {topics.length > 0 && (
            <Badge bg="primary" className="ms-2">
              {topics.length}
            </Badge>
          )}
        </h5>
      </Card.Header>
      <Card.Body className="p-0">
        {error && (
          <Alert variant="danger" className="m-3 mb-0">
            {error}
          </Alert>
        )}
        
        {topics.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-journal-plus display-4 text-muted mb-3"></i>
            <p className="text-muted mb-0">No topics added today</p>
            <small className="text-muted">Add your first topic to get started!</small>
          </div>
        ) : (
          <ListGroup variant="flush">
            {topics.map((topic) => (
              <ListGroup.Item key={topic.id} className="border-0">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold">{topic.title}</h6>
                    <p className="mb-1 text-muted small" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {topic.content}
                    </p>
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>
                      Added: {formatDate(topic.created_at)}
                    </small>
                  </div>
                  <Badge bg="success" className="ms-2">
                    New
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default TodaysLearningList; 