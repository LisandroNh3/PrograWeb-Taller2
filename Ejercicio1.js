const express = require('express');
const app = express();
const PORT = 3000;

// Ruta con parámetro URL
app.get('/api/calcular/:monto', (req, res) => {
    const param = req.params.monto;
    const monto = parseFloat(param);

    // Validación: si no es numérico, es 0 o es negativo
    if (isNaN(monto) || monto <= 0) {
        return res.status(400).json({
            "error": "El salario debe ser un número mayor a cero"
        });
    }

    // Cálculos según valores de El Salvador (13% IVA y 10% Renta)
    const iva = monto * 0.13;
    const renta = monto * 0.10;

    // Respuesta JSON
    return res.json({
        "monto": monto,
        "iva": iva,
        "renta": renta
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});