const supabase = require('./config/supabase');

async function testConnection() {
  console.log('Probando conexión a Supabase...');
  console.log(`URL de Supabase: ${process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL}`);
  
  try {
    // Intentamos consultar una tabla ficticia. Si responde, significa que la API de Supabase está accesible
    // y autenticando correctamente las credenciales (si la tabla no existe, devolverá un error de base de datos,
    // lo cual está bien ya que confirma que se comunicó con Supabase).
    const { data, error, status } = await supabase
      .from('_connection_test_')
      .select('*')
      .limit(1);

    if (error) {
      // Si el código de error es PGRST104 o similar de que la relación no existe, la conexión es correcta
      if (error.code === 'PGRST104' || error.code === 'PGRST205' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('\x1b[32m%s\x1b[0m', '¡Conexión exitosa a Supabase!');
        console.log('Detalles: Las credenciales son válidas y el endpoint respondió correctamente.');
        console.log('Mensaje esperado de la base de datos:', error.message);
      } else {
        console.log('\x1b[31m%s\x1b[0m', 'Error al conectar a Supabase:');
        console.error(error);
      }
    } else {
      console.log('\x1b[32m%s\x1b[0m', '¡Conexión exitosa a Supabase!');
      console.log('Datos devueltos (vacío o de tabla existente):', data);
    }
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Error inesperado durante la prueba de conexión:', err);
  }
}

testConnection();
