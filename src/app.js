require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('Sistema de Inventario - Backend funcionando!');
});

app.use('/products', productRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
