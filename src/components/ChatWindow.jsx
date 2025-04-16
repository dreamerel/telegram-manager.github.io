import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const mockMessages = {
  1: [
    { id: 1, text: 'Привет! Как дела?', sender: 'user', time: '10:30' },
    { id: 2, text: 'Привет! Все хорошо, спасибо!', sender: 'me', time: '10:31' },
    { id: 3, text: 'Что нового?', sender: 'user', time: '10:32' }
  ],
  2: [
    { id: 1, text: 'Встречаемся завтра в 15:00', sender: 'user', time: '09:45' },
    { id: 2, text: 'Хорошо, буду на месте', sender: 'me', time: '09:46' }
  ],
  3: [
    { id: 1, text: 'Новые задачи на этот спринт', sender: 'user', time: '12:00' },
    { id: 2, text: 'Посмотрю сегодня вечером', sender: 'me', time: '12:05' }
  ],
  4: [
    { id: 1, text: 'Купи, пожалуйста, хлеб', sender: 'user', time: '15:20' },
    { id: 2, text: 'Уже купил', sender: 'me', time: '15:25' }
  ]
};

const Message = ({ text, sender, time, isUnread }) => (
  <Box
    sx={{
      maxWidth: '70%',
      alignSelf: sender === 'me' ? 'flex-end' : 'flex-start',
      mb: 2,
      position: 'relative',
      '&:hover': {
        '& .message-time': {
          opacity: 1
        }
      }
    }}
  >
    <Paper
      elevation={2}
      sx={{
        p: 2,
        bgcolor: sender === 'me' ? 'primary.main' : 'background.paper',
        color: sender === 'me' ? 'white' : 'text.primary',
        borderRadius: sender === 'me' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: 3
        },
        '&::before': isUnread && sender !== 'me' ? {
          content: '""',
          position: 'absolute',
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'error.main',
          boxShadow: '0 0 0 3px rgba(211, 47, 47, 0.2)'
        } : {}
      }}
    >
      <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{text}</Typography>
      <Typography 
        variant="caption" 
        className="message-time"
        sx={{ 
          display: 'block', 
          textAlign: 'right',
          mt: 0.5,
          opacity: 0.8,
          transition: 'opacity 0.2s ease-in-out',
          color: sender === 'me' ? 'white' : 'text.secondary'
        }}
      >
        {time}
      </Typography>
    </Paper>
  </Box>
);

const ChatWindow = ({ selectedChat }) => {
  const [newMessage, setNewMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState([]);

  const handleSend = () => {
    if (newMessage.trim()) {
      // В реальном приложении здесь был бы API-запрос
      console.log('Отправка сообщения:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          {selectedChat ? selectedChat.name : 'Выберите чат'}
        </Typography>
        {selectedChat && (
          <Typography variant="subtitle2" color="text.secondary">
            {selectedChat.account}
          </Typography>
        )}
      </Box>

      <Box sx={{ 
        flex: 1, 
        p: 3, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: 'grey.50'
      }}>
        {selectedChat && mockMessages[selectedChat.id]?.map((message) => (
          <Message
            key={message.id}
            text={message.text}
            sender={message.sender}
            time={message.time}
            isUnread={unreadMessages.includes(message.id)}
          />
        ))}
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            variant="outlined"
            size="small"
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatWindow;