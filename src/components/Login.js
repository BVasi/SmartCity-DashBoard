import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    axios.post('https://smartcity.azurewebsites.net/api/Users/login', { Email: email, Password: password })
      .then(response => {
        setLoading(false);
        localStorage.setItem('authToken', response.data.token);
        setAuth(true);
        navigate('/');
      })
      .catch(error => {
        setLoading(false);
        if (error.response && error.response.status === 401)
        {
          setError('Invalid email or password.');
          return;
        }
        setError('Failed to login, please try again.');
      });
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              isInvalid={error}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              isInvalid={error}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="mt-4 w-100"
            disabled={loading}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Login'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;
