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
  Container
} from '@mui/material';

const Auth = ({ onAuth }) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // В реальном приложении здесь будет API-запрос
    onAuth(formData);
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
              sx={{ mt: 2 }}
            >
              {tab === 0 ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;