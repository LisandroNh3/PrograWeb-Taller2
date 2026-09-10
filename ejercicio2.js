const express = require("express");

const app = express();
const PORT = 3000;

// Objeto con las tarifas por país
const tarifas = {
    elsalvador: 1.50,
    guatemala: 2.00,
    honduras: 2.25,
    nicaragua: 2.50,
    costarica: 3.00,
    panama: 3.50
};

// Función para normalizar el nombre del país
function NormalizarPais(pais) {
    return pais
        .toLowerCase()
        .replace(/\s+/g, "");
}

// Función para calcular el costo de envío
function CalcularEnvio(pais, peso) {

    const paisNormalizado = NormalizarPais(pais);
    const tarifa = tarifas[paisNormalizado];

    if (tarifa === undefined) {
        throw new Error(
            "País no permitido. Los países disponibles son: El Salvador, Guatemala, Honduras, Nicaragua, Costa Rica y Panama."
        );
    }

    const costo_base = peso * tarifa;

    let descuento = 0;
    let recargo = 0;

    // Descuento del 10% si pesa más de 20 kg
    if (peso > 20) {
        descuento = costo_base * 0.10;
    }

    // Recargo de $5 si pesa menos de 1 kg
    if (peso < 1) {
        recargo = 5;
    }

    const total = costo_base - descuento + recargo;

    return {
        pais: paisNormalizado,
        peso: peso,
        tarifaPorKg: tarifa,
        costoBase: costo_base,
        descuento: descuento,
        recargo: recargo,
        total: total
    };
}

// Ruta principal
app.get("/api/envio/:pais/:peso", (req, res) => {

    try {

        const { pais, peso } = req.params;

        // Validar que exista el país
        if (!pais) {
            return res.status(400).json({
                error: "Debe ingresar un país."
            });
        }

        // Convertir peso a número
        const pesoNumerico = Number(peso);

        // Validar peso numérico
        if (isNaN(pesoNumerico)) {
            return res.status(400).json({
                error: "El peso debe ser un valor numérico."
            });
        }

        // Validar peso positivo
        if (pesoNumerico <= 0) {
            return res.status(400).json({
                error: "El peso debe ser mayor a 0 kg."
            });
        }

        const resultado = CalcularEnvio(pais, pesoNumerico);

        res.json(resultado);

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});