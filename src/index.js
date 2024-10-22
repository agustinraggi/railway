import express from "express";
import cors from 'cors';
import path from 'path'; // Importar para manejo de archivos
import { fileURLToPath } from 'url'; // Para obtener __dirname
import { dirname } from 'path'; // Para obtener __dirname

import customerRoutes from "./routes/customer.routes.js";
import filmRoutes from "./routes/film.routes.js";
import movieTheaterRoutes from "./routes/movieTheare.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import seatsRoutes from "./routes/seats.routes.js";
import mercadoPagoRoutes from "./mercadoPago.js";

// crear usuario admin
import { createAdmin } from "../src/createUser/createAdmin.js";

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ignorar solicitud de favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Servir archivos estáticos (si decides agregar un favicon)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(customerRoutes);
app.use(filmRoutes);
app.use(movieTheaterRoutes);
app.use(ticketRoutes);
app.use(seatsRoutes);
app.use(mercadoPagoRoutes);

const startServer = async () => {
    try {
        // Inicializar la base de datos
        await createAdmin();
        // Iniciar el servidor después de la inicialización de la base de datos
        app.listen(process.env.PORT_BACK_URL, () => {
            console.log("Server on port", process.env.PORT_BACK_URL);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

startServer();
