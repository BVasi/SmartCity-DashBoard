import React, { useState } from 'react';
import { Card, Container, Row, Col, Dropdown, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { isUserAdmin } from '../utils/JwtUtils';
import { FaTrash } from 'react-icons/fa';

function Home({ auth }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const CITY_NAMES = {
    Timisoara: 0,
    Bucharest: 1,
  };

  const STREET_NAMES = {
    BulevardulMihaiViteazu: 0,
    StradaFeldioara: 1,
    StradaCluj: 2,
    BulevardulLiviuRebreanu: 3,
    BulevardulMirceaEliade: 4,
    BulevardulPrimaverii: 5,
    StradaRacari: 6,
    CaleaDorobantilor: 7,
    BulevardulCamilRessu: 8
  }

  const formatStreetName = (streetName) => {
    return streetName.replace(/([A-Z])/g, ' $1').trim();
  }

  const convertApiAddressToString = (apiAddress) => {
    const city = Object.entries(CITY_NAMES).find(([key, value]) => value === apiAddress.city)?.[0];
    const street = formatStreetName(Object.entries(STREET_NAMES).find(([key, value]) => value === apiAddress.street)?.[0]);
    return `${city}, ${street}`;
  }

  const convertApiProblemStatusToString = (apiProblemStatus) => {
    const PROBLEM_STATUS = {
        0: 'New',
        1: 'Fixing',
        2: 'Fixed'
    };
    return PROBLEM_STATUS[apiProblemStatus] || 'Unknown';
  }

  const convertApiProblemTypeToString = (apiProblemType) => {
    const PROBLEM_TYPE = {
        0: 'Broken Road',
        1: 'Falling Roof',
        2: 'Pothole',
        3: 'Water Leak',
        4: 'Power Outage',
        5: 'Street Light Not Working',
        6: 'Illegal Dumping',
        7: 'Noise Complaint',
        8: 'Vandalism',
        9: 'Traffic Signal Malfunction',
        10: 'Blocked Drain',
        11: 'Fallen Tree',
        12: 'Graffiti',
        13: 'Unsafe Building',
        14: 'Animal Control',
        15: 'Public Safety Concern',
        16: 'Playground Damage',
        17: 'Flooding',
        18: 'Littering',
        19: 'Other'
    };
    return PROBLEM_TYPE[apiProblemType] || 'Unknown';
  }

  const handleCityChange = (cityName) => {
    const cityNumber = CITY_NAMES[cityName]
    setSelectedCity(cityName);
    setLoading(true);
    setError('');

    axios.get(`https://smartcity.azurewebsites.net/api/Reports/city/${cityNumber}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
    .then(response => {
      setReports(response.data);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
      setError('Failed to fetch reports');
    });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const changeProblemStatus = (problemId, newStatus) => {
    const apiRecognizedStatus = parseInt(newStatus);
    axios.patch(`https://smartcity.azurewebsites.net/api/Reports/city/${selectedCity}/problem/${problemId}`, {
        NewStatus: apiRecognizedStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      })
      .then(() => {
        setReports(prevReports =>
            prevReports.map(report =>
                report.id === problemId
                ? { ...report, status: apiRecognizedStatus}
                : report
            )
        );
        setError('');
        alert('Status updated successfully!');
      })
      .catch(() => {
        setError('Failed to update report.');
      });
  };

  const deleteReport = (problemId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this report?');
    if (confirmDelete)
    {
      axios.delete(`https://smartcity.azurewebsites.net/api/Reports/city/${selectedCity}/problem/${problemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      .then(() => {
        setReports(prevReports => prevReports.filter(report => report.id !== problemId));
        alert('Report deleted successfully!');
      })
      .catch(() => {
        setError('Failed to delete report.');
      });
    }
  };

  const filteredReports = selectedStatus && selectedStatus !== 'All'
    ? reports.filter(report => convertApiProblemStatusToString(report.status) === selectedStatus)
    : reports;

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Your Dashboard</h1>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="text-center">Filters</Card.Title>
          <Row className="d-flex justify-content-center">
            <Col xs="auto" className="mb-3">
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {selectedCity || "Select a city"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleCityChange("Timisoara")}>Timisoara</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCityChange("Bucharest")}>Bucharest</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs="auto" className="mb-3">
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-status">
                  {selectedStatus || 'Select a status'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleStatusChange('All')}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange('New')}>New</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange('Fixing')}>Fixing</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange('Fixed')}>Fixed</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="mb-5">
          {filteredReports.length > 0 ? (
            filteredReports.map(report => (
                <Card key={report.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{convertApiProblemTypeToString(report.problem)}</Card.Title>
                  <Card.Text>
                    <strong>Address:</strong> {convertApiAddressToString(report.problemAddress)}
                    <br />
                    <strong>Description:</strong> {report.description}
                    <br />
                    <strong>Reported by:</strong> {report.reporterEmail}
                    <br />
                    <strong>Report Date:</strong> {new Date(report.reportDate).toLocaleString()}
                    <br />
                    <strong>Status:</strong> {isUserAdmin() ? (
                      <Dropdown className="d-inline" onSelect={(eventKey) => changeProblemStatus(report.id, eventKey)}>
                        <Dropdown.Toggle variant="secondary" id={`dropdown-status-${report.id}`}>
                          {convertApiProblemStatusToString(report.status)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item eventKey="0">New</Dropdown.Item>
                          <Dropdown.Item eventKey="1">Fixing</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Fixed</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      <span>{convertApiProblemStatusToString(report.status)}</span>
                    )}
                  </Card.Text>
                  {isUserAdmin() && (
                    <FaTrash
                      style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
                      onClick={() => {
                        deleteReport(report.id);
                      }}
                    />
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No reports found with current filters.</Alert>
          )}
        </div>
      )}
    </Container>
  );
}

export default Home;
