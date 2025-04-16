import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { accountsApi } from '../api/accounts';
import { MTProto } from '@mtproto/core';
import { Buffer } from 'buffer';

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [pendingAccount, setPendingAccount] = useState(null);
  const [mtproto, setMtproto] = useState(null);

  const initializeMTProto = (apiId, apiHash) => {
    return new MTProto({
      api_id: apiId,
      api_hash: apiHash,
      test: false,
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await accountsApi.getAll();
      setAccounts(data.map((account, index) => ({
        ...account,
        accountNumber: index + 1
      })));
    } catch (err) {
      setError('Ошибка при загрузке аккаунтов');
    }
  };

  const [open, setOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    phone: '',
    apiId: '',
    apiHash: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewAccount({ phone: '', apiId: '', apiHash: '' });
  };

  const handleInputChange = (e) => {
    setNewAccount({
      ...newAccount,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAccount = async () => {
    setLoading(true);
    setError('');
    try {
      const mtprotoInstance = initializeMTProto(newAccount.apiId, newAccount.apiHash);
      setMtproto(mtprotoInstance);

      const { phone_code_hash } = await mtprotoInstance.call('auth.sendCode', {
        phone_number: newAccount.phone,
        settings: {
          _: 'codeSettings'
        }
      });

      setPendingAccount({ ...newAccount, phone_code_hash });
      setShowVerification(true);
    } catch (err) {
      setError(err.message || 'Ошибка при добавлении аккаунта');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    setLoading(true);
    setError('');
    try {
      const { user } = await mtproto.call('auth.signIn', {
        phone_number: pendingAccount.phone,
        phone_code_hash: pendingAccount.phone_code_hash,
        phone_code: verificationCode
      });

      await accountsApi.add({
        ...pendingAccount,
        userId: user.id,
        accessHash: user.access_hash
      });

      await fetchAccounts();
      setShowVerification(false);
      setPendingAccount(null);
      setVerificationCode('');
      setMtproto(null);
      handleClose();
    } catch (err) {
      setError(err.message || 'Ошибка при верификации');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await accountsApi.delete(id);
      await fetchAccounts();
    } catch (err) {
      setError('Ошибка при удалении аккаунта');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Управление аккаунтами Telegram</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Добавить аккаунт
        </Button>
      </Stack>

      <Paper elevation={1} sx={{ p: 2 }}>
        <List>
          {accounts.map((account) => (
            <ListItem key={account.id} divider>
              <ListItemText
                primary={
                  <Typography sx={{
                    color: `hsl(${account.accountNumber * 137.5 % 360}, 70%, 45%)`
                  }}>
                    {`${account.accountNumber} ${account.phone}`}
                  </Typography>
                }
                secondary={
                  <Chip
                    size="small"
                    label={account.isActive ? 'Активен' : 'Неактивен'}
                    color={account.isActive ? 'success' : 'default'}
                    sx={{ mt: 1 }}
                  />
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteAccount(account.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {showVerification ? 'Подтверждение аккаунта' : 'Добавить новый аккаунт Telegram'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {showVerification ? (
            <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
              <Typography>Введите код подтверждения, отправленный на указанный номер телефона</Typography>
              <TextField
                fullWidth
                label="Код подтверждения"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="12345"
              />
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
              <TextField
                fullWidth
                label="Номер телефона"
                name="phone"
                value={newAccount.phone}
                onChange={handleInputChange}
                placeholder="+7 XXX XXX XX XX"
              />
              <TextField
                fullWidth
                label="API ID"
                name="apiId"
                value={newAccount.apiId}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="API Hash"
                name="apiHash"
                value={newAccount.apiHash}
                onChange={handleInputChange}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Отмена</Button>
          <Button
            onClick={showVerification ? handleVerification : handleAddAccount}
            variant="contained"
            disabled={loading || (showVerification ? !verificationCode : !newAccount.phone || !newAccount.apiId || !newAccount.apiHash)}
          >
            {loading ? <CircularProgress size={24} /> : (showVerification ? 'Подтвердить' : 'Добавить')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountManager;