import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { camelCaseToSpacedString } from '../utils/StringUtils';
import { CITY_NAMES, STREET_NAMES, CITY_STREETS, PROBLEM_TYPE } from '../utils/ApiUtils';
import { isUserAdmin, getUserEmail } from '../utils/JwtUtils';

function AddReport() {
    const [formData, setFormData] = useState({
      reporterEmail: isUserAdmin() ? '' : getUserEmail(),
      description: '',
      city: '',
      street: '',
      problem: '0',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      if (!isUserAdmin())
      {
        setFormData((prev) => ({ ...prev, reporterEmail: getUserEmail() }));
      }
    }, [isUserAdmin()]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      if (name === 'city')
      {
        setFormData((prev) => ({ ...prev, street: '' }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');

      axios.post('https://smartcity.azurewebsites.net/api/Reports/reportProblem', {
            ReporterEmail: formData.reporterEmail,
            Description: formData.description,
            ProblemAddress: {
            City: CITY_NAMES[formData.city],
            Street: STREET_NAMES[formData.street],
            },
            Problem: parseInt(formData.problem),
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        })
        .then(() => {
          setLoading(false);
          setSuccess('Report submitted successfully!');
          navigate('/');
        })
        .catch(() => {
          setLoading(false);
          setError('Failed to submit the report. Please try again.');
        });
    };

    return (
      <Container className="mt-5">
        <Card className="p-4">
          <h2 className="text-center mb-4">Add Report</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            {isUserAdmin() && (
              <Form.Group controlId="formReporterEmail" className="mt-3">
                <Form.Label>Reporter Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter reporter email"
                  name="reporterEmail"
                  value={formData.reporterEmail}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            <Form.Group controlId="formProblemType" className="mt-3">
              <Form.Label>Problem Type</Form.Label>
              <Form.Select
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                required
              >
                {Object.entries(PROBLEM_TYPE).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formCity" className="mt-3">
              <Form.Label>City</Form.Label>
              <Form.Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select a city</option>
                {Object.keys(CITY_NAMES).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formStreet" className="mt-3">
              <Form.Label>Street</Form.Label>
              <Form.Select
                name="street"
                value={formData.street}
                onChange={handleChange}
                disabled={!formData.city}
                required
              >
                <option value="">Select a street</option>
                {formData.city &&
                  CITY_STREETS[formData.city].map((street) => (
                    <option key={street} value={street}>
                      {camelCaseToSpacedString(street)}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Problem Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe the problem"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="mt-4 w-100"
              disabled={loading}
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                'Submit Report'
              )}
            </Button>
          </Form>
        </Card>
      </Container>
    );
  }

  export default AddReport;