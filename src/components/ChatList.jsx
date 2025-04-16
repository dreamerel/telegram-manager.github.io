import React, { useState, useMemo } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Divider, Box, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Badge } from '@mui/material';

// Функция для форматирования номера аккаунта
const formatAccountNumber = (account, index) => {
  const accountNumber = index + 1;
  return {
    number: accountNumber,
    color: `hsl(${accountNumber * 137.5 % 360}, 70%, 45%)`
  };
};

const mockChats = [
  {
    id: 1,
    name: 'Иван Петров',
    lastMessage: 'Привет! Как дела?',
    time: '10:30',
    avatar: 'I',
    account: '+7 999 123-45-67',
    unread: true
  },
  {
    id: 2,
    name: 'Анна Сидорова',
    lastMessage: 'Встречаемся завтра в 15:00',
    time: '09:45',
    avatar: 'A',
    account: '+7 999 123-45-67'
  },
  {
    id: 3,
    name: 'Рабочий чат',
    lastMessage: 'Новые задачи на этот спринт',
    time: 'Вчера',
    avatar: 'Р',
    account: '+7 999 765-43-21'
  },
  {
    id: 4,
    name: 'Семья',
    lastMessage: 'Купи, пожалуйста, хлеб',
    time: 'Вчера',
    avatar: 'С',
    account: '+7 999 765-43-21'
  }
];

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [unreadFilter, setUnreadFilter] = useState(false);
  const [sortType, setSortType] = useState('time'); // 'time', 'unread', 'account'

  const accounts = useMemo(() => {
    const uniqueAccounts = [...new Set(mockChats.map(chat => chat.account))];
    return ['all', ...uniqueAccounts];
  }, []);

  const filteredChats = useMemo(() => {
    let filtered = mockChats.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAccount = selectedAccount === 'all' || chat.account === selectedAccount;
      const matchesUnread = !unreadFilter || chat.unread;
      return matchesSearch && matchesAccount && matchesUnread;
    });

    // Сортировка чатов
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'time':
          return a.time < b.time ? 1 : -1;
        case 'unread':
          return (b.unread ? 1 : 0) - (a.unread ? 1 : 0);
        case 'account':
          return a.account.localeCompare(b.account);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedAccount, unreadFilter, sortType]);

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', borderRight: 1, borderColor: 'divider' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Поиск чатов"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton
            size="small"
            color={unreadFilter ? 'primary' : 'default'}
            onClick={() => setUnreadFilter(!unreadFilter)}
            sx={{ bgcolor: unreadFilter ? 'primary.light' : 'grey.100' }}
          >
            <Badge />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Аккаунт</InputLabel>
            <Select
              value={selectedAccount}
              label="Аккаунт"
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <MenuItem value="all">Все аккаунты</MenuItem>
              {accounts.filter(acc => acc !== 'all').map((account, index) => (
                <MenuItem key={account} value={account}>{formatAccountNumber(account, index)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={sortType}
              label="Сортировка"
              onChange={(e) => setSortType(e.target.value)}
            >
              <MenuItem value="time">По времени</MenuItem>
              <MenuItem value="unread">По непрочитанным</MenuItem>
              <MenuItem value="account">По аккаунту</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <List sx={{ flex: 1, overflow: 'auto' }}>
      {filteredChats.map((chat, index) => (
        <React.Fragment key={chat.id}>
          <ListItem 
            alignItems="flex-start"
            button
            selected={selectedChatId === chat.id}
            onClick={() => onSelectChat(chat)}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
              },
              borderRadius: 2,
              position: 'relative',
              ...(chat.unread && {
                bgcolor: 'primary.light',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                }
              })
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                borderRadius: '15px',
                width: 40,
                height: 40
              }}>{chat.avatar}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <React.Fragment>
                  {chat.name}
                  {(() => {
                    const accountInfo = formatAccountNumber(chat.account, accounts.findIndex(acc => acc === chat.account) - 1);
                    return (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ ml: 1, color: accountInfo.color }}
                      >
                        {accountInfo.number}
                      </Typography>
                    );
                  })()}
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {chat.lastMessage}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ float: 'right', mt: 1 }}
                  >
                    {chat.time}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {index < filteredChats.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
      </List>
    </Box>
  );
};

export default ChatList;