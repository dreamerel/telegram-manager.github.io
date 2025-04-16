import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Slider, TextField, Typography, LinearProgress, Divider } from '@mui/material';

const MessageManager = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [messageDelay, setMessageDelay] = useState(1200); // 20 minutes default
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalMessages: 0,
    sentMessages: 0,
    failedMessages: 0,
    estimatedTimeRemaining: 0
  });

  useEffect(() => {
    // Load contacts and accounts from backend
    fetchContacts();
    fetchAccounts();
    // Start polling for stats
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/message-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      const data = await response.json();
      setAccounts(data.filter(account => account.is_active));
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContacts(prev => {
      if (prev.includes(contact)) {
        return prev.filter(c => c !== contact);
      }
      return [...prev, contact];
    });
  };

  const handleAccountSelect = (account) => {
    setSelectedAccounts(prev => {
      if (prev.includes(account)) {
        return prev.filter(a => a !== account);
      }
      return [...prev, account];
    });
  };

  const handleDelayChange = (event, newValue) => {
    setMessageDelay(newValue);
  };

  const handleSendMessage = async () => {
    if (!selectedContacts.length || !selectedAccounts.length || !message) {
      alert('Please select contacts, accounts and enter a message');
      return;
    }

    try {
      const response = await fetch('/api/schedule-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_ids: selectedAccounts.map(a => a.id),
          contact_usernames: selectedContacts.map(c => c.username),
          message,
          delay: messageDelay
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Messages scheduled successfully');
        setMessage('');
        setSelectedContacts([]);
      } else {
        alert('Failed to schedule messages: ' + result.error);
      }
    } catch (error) {
      console.error('Error scheduling messages:', error);
      alert('Failed to schedule messages');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Сообщения</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Контакты</Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {contacts.map(contact => (
                  <FormControlLabel
                    key={contact.id}
                    control={
                      <Checkbox
                        checked={selectedContacts.includes(contact)}
                        onChange={() => handleContactSelect(contact)}
                      />
                    }
                    label={`${contact.username} ${contact.phone ? `(${contact.phone})` : ''}`}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Аккаунты</Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {accounts.map(account => (
                  <FormControlLabel
                    key={account.id}
                    control={
                      <Checkbox
                        checked={selectedAccounts.includes(account)}
                        onChange={() => handleAccountSelect(account)}
                      />
                    }
                    label={account.phone}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Настройки отправки</Typography>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography gutterBottom>Задержка между сообщениями (секунды)</Typography>
                <Slider
                  value={messageDelay}
                  onChange={handleDelayChange}
                  min={60}
                  max={3600}
                  step={60}
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => `${value} сек`}
                />
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Сообщение"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!selectedContacts.length || !selectedAccounts.length || !message}
                >
                  Отправить сообщения
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Статистика отправки</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Прогресс отправки: {stats.sentMessages} из {stats.totalMessages} сообщений
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.sentMessages / Math.max(stats.totalMessages, 1)) * 100} 
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Отправлено успешно</Typography>
                  <Typography variant="h6">{stats.sentMessages}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Ошибки отправки</Typography>
                  <Typography variant="h6">{stats.failedMessages}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Осталось времени</Typography>
                  <Typography variant="h6">
                    {Math.round(stats.estimatedTimeRemaining / 60)} мин
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessageManager;