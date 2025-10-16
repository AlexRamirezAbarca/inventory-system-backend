const express = require('express');
const router = express.Router();

// Datos de prueba en memoria
let products = [
  { id: 1, name: "Producto A", stock: 10, price: 15.5 },
  { id: 2, name: "Producto B", stock: 5, price: 25.0 },
];

// GET /products → lista todos los productos
router.get('/', (req, res) => {
  res.json(products);
});

// GET /products/:id → devuelve un producto por id
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
});

// POST /products → agregar un producto
router.post('/', (req, res) => {
  const { name, stock, price } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    stock,
    price
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

module.exports = router;
