const express = require('express');
const app = express();
const PORT = 3000;

const impuestosPorPais = {
    "elsalvador": { porcentajeIVA: 0.13, porcentajeRenta: 0.10, labelIVA: "13%", labelRenta: "10%" },
    "guatemala": { porcentajeIVA: 0.12, porcentajeRenta: 0.07, labelIVA: "12%", labelRenta: "7%" },
    "costarica": { porcentajeIVA: 0.13, porcentajeRenta: 0.15, labelIVA: "13%", labelRenta: "15%" },
    "honduras": { porcentajeIVA: 0.15, porcentajeRenta: 0.12, labelIVA: "15%", labelRenta: "12%" }, // Ajustado por formato de ejemplo
    "panama": { porcentajeIVA: 0.07, porcentajeRenta: 0.10, labelIVA: "7%", labelRenta: "10%" },
    "nicaragua": { porcentajeIVA: 0.15, porcentajeRenta: 0.10, labelIVA: "15%", labelRenta: "10%" }
};

function calcularImpuestos(salarioBruto, tasas) {
    let iva = salarioBruto * tasas.porcentajeIVA;
    let renta = salarioBruto * tasas.porcentajeRenta;
    let salarioNeto = salarioBruto - (iva + renta);
    return { iva, renta, salarioNeto };
}

app.get('/api/impuestos/:pais/:salario', (req, res) => {
    try {
        let paisIngresado = req.params.pais.toLowerCase().trim();
        let salarioBruto = Number(req.params.monto || req.params.salario);

        if (!impuestosPorPais.hasOwnProperty(paisIngresado)) {
            return res.status(400).json({
                error: "El país ingresado no es válido o no está permitido. Países permitidos: El Salvador, Guatemala, Costa Rica, Honduras, Panama, Nicaragua."
            });
        }

        if (isNaN(salarioBruto) || salarioBruto <= 0) {
            return res.status(400).json({
                error: "El salario debe ser un número válido mayor a cero."
            });
        }

        let tasas = impuestosPorPais[paisIngresado];
        let calculo = calcularImpuestos(salarioBruto, tasas);

        res.json({
            pais: paisIngresado,
            salarioBruto: salarioBruto,
            porcentajeIVA: tasas.labelIVA,
            porcentajeRenta: tasas.labelRenta,
            iva: calculo.iva,
            renta: calculo.renta,
            salarioNeto: calculo.salarioNeto
        });

    } catch (error) {
        res.status(500).json({
            error: "Ocurrió un error interno en el servidor",
            detalle: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});