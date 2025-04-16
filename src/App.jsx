import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Tabs, Tab } from '@mui/material';
import MessageManager from './components/MessageManager';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Auth from './components/Auth';
import AccountManager from './components/AccountManager';
import theme from './theme';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  const renderContent = () => {
    switch(currentTab) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
              <ChatList 
                onSelectChat={handleSelectChat} 
                selectedChatId={selectedChat?.id} 
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <ChatWindow selectedChat={selectedChat} />
            </Box>
          </Box>
        );
      case 1:
        return <AccountManager />;
      case 2:
        return <MessageManager />;
      default:
        return null;
    }
  };

  const handleAuth = (formData) => {
    // В реальном приложении здесь будет API-запрос
    console.log('Auth data:', formData);
    setIsAuthenticated(true);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth onAuth={handleAuth} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
            >
              <Tab label="Чаты" />
              <Tab label="Аккаунты" />
              <Tab label="Сообщения" />
            </Tabs>
          </Toolbar>
        </AppBar>

        {renderContent()}
      </Box>
    </ThemeProvider>
  );
}

export default App;