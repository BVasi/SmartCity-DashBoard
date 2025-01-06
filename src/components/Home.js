import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function Home({ auth }) {
  const navigate = useNavigate();

  const handleSeeReports = () => {
    navigate('/seeReports');
  };

  const handleAddReport = () => {
    navigate('/addReport');
  };

  return (
    <Container className="mt-5 text-center">
      <h1 className="mb-4">Welcome to the Dashboard</h1>
      <Row className="justify-content-center">
        <Col xs="auto" className="mb-3">
          <Button variant="success" size="lg" onClick={handleAddReport}>
            Add Report
          </Button>
        </Col>
        <Col xs="auto" className="mb-3">
          <Button variant="primary" size="lg" onClick={handleSeeReports}>
            See Reports
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
