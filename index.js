const express = require('express'); // IMPORTA LA LIBRERÍA "EXPRESS"
const app = express();

app.use(express.json()); // PERMITE LEER LOS JSON

app.get('/', (req, res) => {
    res.send('Hola');
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Prueba exitosa' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
