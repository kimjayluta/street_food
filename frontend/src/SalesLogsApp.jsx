import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Filter, Store, User, Package, ChevronDown } from 'lucide-react';
import {
  TextField,
  Select,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  FormControl,
  InputLabel,
  Box,
  Alert,
  MenuItem,
  Avatar,
  Tooltip,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { Inter } from '@fontsource/inter';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default function SalesLogsApp() {
  const [showModal, setShowModal] = useState(false);
  const [pwestoList, setPwestoList] = useState([]);
  const [tinderaList, setTinderaList] = useState([]);
  const [panindaList, setPanindaList] = useState([]);
  const [salesLogs, setSalesLogs] = useState([]);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    tindera_id: '',
    pwesto_id: '',
    paninda_id: '',
    quantity: '',
    leftover: '',
    total_sales: '',
    date: '',
    filter_pwesto: '',
    filter_startDate: '',
    filter_endDate: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemPrices, setItemPrices] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
  });

  useEffect(() => {
    fetchAll();
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://192.168.254.173:3000/expenses');
      setExpenses(response.data);
    } catch (error) {
      showToast('Error fetching expenses', 'error');
    }
  };

  const handleExpenseChange = (e) => {
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      description: '',
      amount: '',
    });
    setEditingExpenseId(null);
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount || !form.filter_pwesto) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const submitData = {
        ...expenseForm,
        pwesto_id: form.filter_pwesto,
        expense_date: editingExpenseId ? expenseForm.expense_date : new Date().toISOString().split('T')[0],
      };

      if (editingExpenseId) {
        await axios.put(`http://192.168.254.173:3000/expenses/${editingExpenseId}`, submitData);
        showToast('Expense updated successfully!');
      } else {
        await axios.post('http://192.168.254.173:3000/expenses', submitData);
        showToast('Expense added successfully!');
      }

      resetExpenseForm();
      setShowExpenseModal(false);
      fetchExpenses();
    } catch (error) {
      showToast('Error saving expense', 'error');
    }
  };

  const handleExpenseEdit = (expense) => {
    setExpenseForm({
      description: expense.description,
      amount: expense.amount,
      expense_date: new Date(expense.expense_date).toISOString().split('T')[0],
    });
    setEditingExpenseId(expense.id);
    setShowExpenseModal(true);
  };

  const handleExpenseDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    try {
      await axios.delete(`http://192.168.254.173:3000/expenses/${id}`);
      showToast('Expense deleted successfully!');
      fetchExpenses();
    } catch (error) {
      showToast('Error deleting expense', 'error');
    }
  };

  const handleExpenseModalClose = () => {
    setShowExpenseModal(false);
    resetExpenseForm();
  };

  // --- Optimization: Move filteredLogs and filteredExpenses outside of render, and memoize paninda lookup ---

  // Memoize paninda lookup map for fast access
  const panindaMap = useMemo(() => {
    const map = {};
    panindaList.forEach((p) => { map[p.id] = p; });
    return map;
  }, [panindaList]);

  // --- Revert: Restore original filteredLogs and filteredExpenses logic ---

  const filteredExpenses = useMemo(() => {
    if (!form.filter_pwesto) return [];

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    return expenses.filter((expense) => {
      if (expense.pwesto_id != form.filter_pwesto) {
        return false;
      }

      if (!expense.expense_date) return false;
      const expenseDate = new Date(expense.expense_date);
      const expenseDateStr = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}-${String(
        expenseDate.getDate()
      ).padStart(2, '0')}`;

      // If no filter date is selected, show only today's expenses
      if (!form.filter_startDate && !form.filter_endDate) {
        return expenseDateStr === todayStr;
      }

      if (form.filter_startDate && expenseDateStr < form.filter_startDate) {
        return false;
      }

      if (form.filter_endDate && expenseDateStr > form.filter_endDate) {
        return false;
      }

      return true;
    });
  }, [expenses, form.filter_pwesto, form.filter_startDate, form.filter_endDate]);

  const filteredLogs = useMemo(() => {
    if (!form.filter_pwesto) return [];

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    return salesLogs.filter((log) => {
      if (log.pwesto_id != form.filter_pwesto) {
        return false;
      }
      if (!log.date) return false;
      const logDate = new Date(log.date);
      const logDateStr = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(
        logDate.getDate()
      ).padStart(2, '0')}`;

      if (!form.filter_startDate && !form.filter_endDate) {
        return logDateStr === todayStr;
      }
      if (form.filter_startDate) {
        if (logDateStr < form.filter_startDate) return false;
      }
      if (form.filter_endDate) {
        if (logDateStr > form.filter_endDate) return false;
      }
      return true;
    });
  }, [salesLogs, form.filter_pwesto, form.filter_startDate, form.filter_endDate]);

  useEffect(() => {
    if (form.paninda_id && itemPrices[form.paninda_id]) {
      const quantitySold = parseFloat(form.quantity) || 0;
      const leftovers = parseFloat(form.leftover) || 0;
      const netQuantity = quantitySold - leftovers;

      const selectedItem = panindaList.find((p) => p.id == form.paninda_id);
      const isFishball = selectedItem && selectedItem.item_name && selectedItem.item_name.toLowerCase() === 'fishball';
      const isKikiam = selectedItem && selectedItem.item_name && selectedItem.item_name.toLowerCase() === 'kikiam';

      if (netQuantity >= 0) {
        let total;
        if (isFishball) {
          total = Math.floor(netQuantity / 6) * 5;
        } else if (isKikiam) {
          total = Math.floor(netQuantity / 3) * 5;
        } else {
          total = netQuantity * itemPrices[form.paninda_id];
        }
        setForm((prev) => ({ ...prev, total_sales: total.toFixed(2) }));
      } else {
        setForm((prev) => ({ ...prev, total_sales: '0.00' }));
      }
    } else {
      setForm((prev) => ({ ...prev, total_sales: '' }));
    }
  }, [form.quantity, form.leftover, form.paninda_id, itemPrices, panindaList]);

  useEffect(() => {
    if (form.pwesto_id && showModal) {
      const pwesto = pwestoList.find((p) => p.id == form.pwesto_id);
      let tinderaIds = [];
      if (pwesto && pwesto.tindera_id) {
        tinderaIds = Array.isArray(pwesto.tindera_id) ? pwesto.tindera_id : [pwesto.tindera_id];
      } else {
        tinderaIds = [...new Set(salesLogs.filter((log) => log.pwesto_id == form.pwesto_id).map((log) => log.tindera_id))];
      }
      if (tinderaIds.length === 1) {
        setForm((prev) => ({ ...prev, tindera_id: tinderaIds[0] }));
      } else if (tinderaIds.length === 0) {
        setForm((prev) => ({ ...prev, tindera_id: tinderaList[0]?.id || '' }));
      } else {
        setForm((prev) => ({ ...prev, tindera_id: '' }));
      }
    } else if (!form.pwesto_id) {
      setForm((prev) => ({ ...prev, tindera_id: '' }));
    }
  }, [form.pwesto_id, showModal, salesLogs, tinderaList, pwestoList]);

  useEffect(() => {
    if (showModal && !editingId && form.filter_pwesto && !form.pwesto_id) {
      setForm((prev) => ({ ...prev, pwesto_id: prev.filter_pwesto }));
    }
    if (showModal && !editingId && !form.filter_pwesto && form.pwesto_id) {
      setForm((prev) => ({ ...prev, pwesto_id: '' }));
    }
  }, [showModal, editingId, form.filter_pwesto, form.pwesto_id]);

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [pwesto, tindera, paninda, sales] = await Promise.all([
        axios.get('http://192.168.254.173:3000/pwesto'),
        axios.get('http://192.168.254.173:3000/tindera'),
        axios.get('http://192.168.254.173:3000/paninda'),
        axios.get('http://192.168.254.173:3000/sales_logs'),
      ]);

      setPwestoList(pwesto.data);
      setTinderaList(tindera.data);
      setPanindaList(paninda.data);
      setSalesLogs(sales.data);

      const prices = paninda.data.reduce((acc, item) => {
        acc[item.id] = parseFloat(item.price);
        return acc;
      }, {});
      setItemPrices(prices);
    } catch (error) {
      showToast('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      tindera_id: '',
      pwesto_id: '',
      paninda_id: '',
      quantity: '',
      total_sales: '',
      leftover: '',
      date: '',
      filter_pwesto: form.filter_pwesto,
      filter_startDate: form.filter_startDate,
      filter_endDate: form.filter_endDate,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tindera_id || !form.pwesto_id || !form.paninda_id || !form.quantity) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        tindera_id: form.tindera_id,
        pwesto_id: form.pwesto_id,
        paninda_id: form.paninda_id,
        quantity: form.quantity,
        leftover: form.leftover === '' || form.leftover === undefined || form.leftover === null ? 0 : form.leftover,
        total_sales: form.total_sales,
        date: editingId ? form.date : new Date().toISOString().split('T')[0],
      };

      if (editingId) {
        await axios.put(`http://192.168.254.173:3000/sales_logs/${editingId}`, submitData);
        showToast('Sales log updated successfully!');
      } else {
        await axios.post('http://192.168.254.173:3000/sales_logs', submitData);
        showToast('Sales log added successfully!');
      }

      resetForm();
      setShowModal(false);
      fetchAll();
    } catch (error) {
      showToast('Error saving sales log', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (log) => {
    setForm({
      ...form,
      tindera_id: log.tindera_id,
      pwesto_id: log.pwesto_id,
      paninda_id: log.paninda_id,
      quantity: log.quantity,
      total_sales: log.total_sales,
      leftover: log.leftover || 0,
      date: log.date,
    });
    setEditingId(log.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sales log?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://192.168.254.173:3000/sales_logs/${id}`);
      showToast('Sales log deleted successfully!');
      fetchAll();
    } catch (error) {
      showToast('Error deleting sales log', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const selectedPwestoInfo = form.filter_pwesto
    ? (() => {
        const logs = salesLogs.filter((log) => log.pwesto_id == form.filter_pwesto);
        const uniqueTindera = [...new Set(logs.map((log) => log.tindera_id))];
        const tinderaNames = uniqueTindera.map((id) => tinderaList.find((t) => t.id == id)?.name).filter(Boolean);
        const pwestoName = pwestoList.find((p) => p.id == form.filter_pwesto)?.location;
        return { pwestoName, tinderaNames };
      })()
    : null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Liit Fishbolan
          </Typography>
          <Avatar>
            <User />
          </Avatar>
        </Box>

        <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                {/* <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                  Pwesto
                </Typography> */}
              </Box>
              <FormControl fullWidth sx={{ minWidth: { xs: 220, md: 350 } }}>
                <InputLabel sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' } }}>Select Pwesto</InputLabel>
                <Select
                  name="filter_pwesto"
                  value={form.filter_pwesto}
                  onChange={handleChange}
                  label="Filter by Stall"
                  IconComponent={ChevronDown}
                  sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' }, height: 56, minHeight: 56, minWidth: { xs: 220, md: 350 } }}
                  MenuProps={{ PaperProps: { sx: { fontSize: { xs: '1.05rem', md: '1.15rem' }, minWidth: { xs: 220, md: 350 } } } }}
                  inputProps={{ sx: { padding: '16.5px 14px' } }}
                >
                  <MenuItem value="" sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' } }}>
                    <em>None</em>
                  </MenuItem>
                  {pwestoList.map((p) => (
                    <MenuItem key={p.id} value={p.id} sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' }, whiteSpace: 'normal' }}>
                      {p.location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                name="filter_startDate"
                label="Start Date"
                type="date"
                value={form.filter_startDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' }, height: 56, minHeight: 56 }}
                inputProps={{
                  sx: { padding: '16.5px 14px', fontSize: { xs: '1.05rem', md: '1.15rem' } },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                name="filter_endDate"
                label="End Date"
                type="date"
                value={form.filter_endDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' }, height: 56, minHeight: 56 }}
                inputProps={{
                  min: form.filter_startDate || undefined,
                  sx: { padding: '16.5px 14px', fontSize: { xs: '1.05rem', md: '1.15rem' } },
                }}
              />
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 1, height: 56, minWidth: 56 }}
                onClick={() => setForm((prev) => ({
                  ...prev,
                  filter_pwesto: '',
                  filter_startDate: '',
                  filter_endDate: '',
                }))}
                disabled={
                  !form.filter_pwesto && !form.filter_startDate && !form.filter_endDate
                }
              >
                Clear
              </Button>
            </Grid>
            {/* Removed Add Log button from filter row, now moved to Sales Log table header */}
          </Grid>
        </Paper>


        {selectedPwestoInfo && (
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {selectedPwestoInfo.pwestoName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vendor: {selectedPwestoInfo.tinderaNames.join(', ') || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ ml: 2, flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography
                variant="h3"
                sx={{ color: 'green', fontWeight: 700, textAlign: 'right', fontSize: { xs: '2rem', md: '2.8rem' } }}
              >
                Total Sales: ₱
                {(
                  filteredLogs.reduce((sum, log) => sum + parseFloat(log.total_sales), 0) -
                  filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
                ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ width: '100%' }}>
          <Paper elevation={0} sx={{ p: 3, mb: 4, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Sales Log
              </Typography>
              <Button
                onClick={() => setShowModal(true)}
                variant="contained"
                startIcon={<Plus />}
                disabled={!form.filter_pwesto || !!form.filter_startDate || !!form.filter_endDate}
              >
                Add
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Dara</TableCell>
                    <TableCell>Tada</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{panindaMap[log.paninda_id]?.item_name}</TableCell>
                        <TableCell>{log.quantity}</TableCell>
                        <TableCell>{log.leftover || 0}</TableCell>
                        <TableCell>₱{parseFloat(log.total_sales).toFixed(2)}</TableCell>
                        <TableCell>
                          {new Date(log.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <Button size="small" onClick={() => handleEdit(log)}>
                              <Edit size={18} />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button size="small" onClick={() => handleDelete(log.id)} color="error">
                              <Trash2 size={18} />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">No sales logs found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Paper elevation={0} sx={{ p: 3, mb: 4, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Expenses</Typography>
              <Button
                onClick={() => setShowExpenseModal(true)}
                variant="contained"
                startIcon={<Plus />}
                disabled={!form.filter_pwesto || !!form.filter_startDate || !!form.filter_endDate}
              >
                Add
              </Button>
            </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>₱{parseFloat(expense.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        {expense.expense_date ?
                          new Date(expense.expense_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <Button size="small" onClick={() => handleExpenseEdit(expense)}>
                            <Edit size={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button size="small" onClick={() => handleExpenseDelete(expense.id)} color="error">
                            <Trash2 size={18} />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">No expenses found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          </Paper>
        </Box>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Total Sales</Typography>
                <Typography>
                  ₱
                  {filteredLogs
                    .reduce((sum, log) => sum + parseFloat(log.total_sales), 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              {/* Calculate total expenses based on what is displayed in the Expenses table (today's expenses) */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Total Expenses</Typography>
                <Typography>
                  - ₱
                  {filteredExpenses
                    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography variant="h6">Net Income</Typography>
                <Typography variant="h6">
                  ₱
                  {(
                    filteredLogs.reduce((sum, log) => sum + parseFloat(log.total_sales), 0) -
                    filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        {/* End of main content */}

        <Dialog open={showModal} onClose={handleModalClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingId ? 'Edit Sales Log' : 'Add New Sales Log'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Stall</InputLabel>
                <Select name="pwesto_id" value={form.pwesto_id} onChange={handleChange} label="Stall" disabled>
                  {pwestoList.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Vendor</InputLabel>
                <Select name="tindera_id" value={form.tindera_id} onChange={handleChange} label="Vendor" disabled>
                  {tinderaList.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Item</InputLabel>
                <Select name="paninda_id" value={form.paninda_id} onChange={handleChange} label="Item">
                  {panindaList.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.item_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Conditional fields for Mix/Palamig */}
              {(() => {
                const selectedItem = panindaList.find((p) => p.id == form.paninda_id);
                const isMixOrPalamig = selectedItem && (selectedItem.item_name === 'Mix' || selectedItem.item_name === 'Palamig');
                if (isMixOrPalamig) {
                  // Set quantity and leftover to zero if not already
                  if (form.quantity !== '0' || form.leftover !== '0') {
                    setTimeout(() => {
                      if (form.quantity !== '0' || form.leftover !== '0') {
                        setForm((prev) => ({ ...prev, quantity: '0', leftover: '0' }));
                      }
                    }, 0);
                  }
                  return (
                    <TextField
                      name="total_sales"
                      label="Total Sales"
                      value={form.total_sales}
                      onChange={handleChange}
                      fullWidth
                      // Make editable
                    />
                  );
                } else {
                  return (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            name="quantity"
                            label="Dara"
                            type="number"
                            value={form.quantity}
                            onChange={handleChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            name="leftover"
                            label="Tada"
                            type="number"
                            value={form.leftover}
                            onChange={handleChange}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        name="total_sales"
                        label="Total Amount"
                        value={form.total_sales}
                        fullWidth
                        disabled
                      />
                      {/* Computation explanation below Total Sales */}
                      {form.paninda_id && form.quantity !== '' && (
                        <Box sx={{ color: 'text.secondary', fontSize: 14, mt: -2 }}>
                          {(() => {
                            const selectedItem = panindaList.find((p) => p.id == form.paninda_id);
                            const isFishball = selectedItem && selectedItem.item_name && selectedItem.item_name.toLowerCase() === 'fishball';
                            const isKikiam = selectedItem && selectedItem.item_name && selectedItem.item_name.toLowerCase() === 'kikiam';
                            const quantitySold = parseFloat(form.quantity) || 0;
                            const leftovers = parseFloat(form.leftover) || 0;
                            const netQuantity = quantitySold - leftovers;
                            if (!selectedItem) return null;
                            if (isFishball) {
                              return `Fishball: ((${quantitySold} - ${leftovers}) / 6) x 5 = ₱${form.total_sales}`;
                            } else if (isKikiam) {
                              return `Kikiam: ((${quantitySold} - ${leftovers}) / 3) x 5 = ₱${form.total_sales}`;
                            } else {
                              return `${selectedItem.item_name}: (${quantitySold} - ${leftovers}) x ₱${selectedItem.price} = ₱${form.total_sales}`;
                            }
                          })()}
                        </Box>
                      )}
                    </>
                  );
                }
              })()}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showExpenseModal} onClose={handleExpenseModalClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingExpenseId ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleExpenseSubmit} sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                name="description"
                label="Description"
                value={expenseForm.description}
                onChange={handleExpenseChange}
                fullWidth
                required
              />
              <TextField
                name="amount"
                label="Amount"
                type="number"
                value={expenseForm.amount}
                onChange={handleExpenseChange}
                fullWidth
                required
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleExpenseModalClose}>Cancel</Button>
            <Button onClick={handleExpenseSubmit} variant="contained">
              {editingExpenseId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={toast?.open} autoHideDuration={4000} onClose={hideToast}>
          <Alert onClose={hideToast} severity={toast?.type} sx={{ width: '100%' }}>
            {toast?.message}
          </Alert>
        </Snackbar>
      {/* End of Container */}
    </Container>
  </ThemeProvider>
  );
}
