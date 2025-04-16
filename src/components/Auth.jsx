import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Tabs,
  Tab,
  Container,
  Alert,
  Snackbar
} from '@mui/material';
import { authApi } from '../api/auth';

const Auth = ({ onAuth }) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 1) { // Регистрация
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Пароли не совпадают');
        }
        await authApi.register({
          username: formData.username,
          password: formData.password
        });
        setTab(0); // Переключаемся на вкладку входа
      } else { // Вход
        const response = await authApi.login({
          username: formData.username,
          password: formData.password
        });
        onAuth(response);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Telegram Manager
        </Typography>
        
        <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Имя пользователя"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {tab === 1 && (
              <TextField
                fullWidth
                label="Подтвердите пароль"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {tab === 0 ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Stack>
        </Box>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Auth;