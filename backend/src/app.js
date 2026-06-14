const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to OrderFlow API' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Route to test Supabase connection
app.get('/api/test-supabase', async (req, res, next) => {
  try {
    const supabase = require('./config/supabase');
    const { data, error } = await supabase.from('_connection_test_').select('*').limit(1);
    
    // PGRST205 is "table not found", meaning connection works but table does not exist
    if (error && error.code !== 'PGRST205') {
      return res.status(500).json({
        status: 'error',
        message: 'Error al conectar con Supabase',
        error: error
      });
    }
    
    res.json({
      status: 'success',
      message: 'Conexión a Supabase establecida correctamente',
      details: error ? error.message : 'Tabla consultada con éxito',
      data: data || []
    });
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
