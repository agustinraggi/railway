const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

const userRoutes = require("./user/createUser");
const initDatabaseUser = require("./user/init-bd-user");

const filmRoutes = require("./film/createFilm");
const initDatabaseFilm = require("./film/init-bd-film");

const ticketRoutes = require("./ticket/createTicket");
const initDatabaseTicket = require("./ticket/init-bd-ticket");

const movieTheaterRoutes = require ("./movieTheater/createMovieTheater")
const initMovieTheater = require("./movieTheater/init-bd-movieTheater")

const mercadoPagoRoutes = require("./mercadoPago");

const app = express();

app.use(cors());
app.use(express.json());

// Conexión principal a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");

    // Crear la base de datos cine-aurora si no existe
    db.query("CREATE DATABASE IF NOT EXISTS `cine-aurora`", (err, result) => {
        if (err) {
            console.error("Error al crear la base de datos cine-aurora:", err);
            db.end();
            return;
        }
        console.log("Base de datos cine-aurora creada o ya existía.");

        // Inicializar las bases de datos
        initDatabaseUser();
        initDatabaseFilm();
        initDatabaseTicket();
        initMovieTheater();

        const dbCineAurora = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        dbCineAurora.connect((err) => {
            if (err) {
                console.error("Error al conectar a la base de datos cine-aurora:", err);
                db.end();
                return;
            }
            console.log("Conectado a la base de datos cine-aurora");

            // Configurar las rutas
            app.use(userRoutes);
            app.use(filmRoutes);
            app.use(ticketRoutes);
            app.use(movieTheaterRoutes)
            app.use(mercadoPagoRoutes);

            // Iniciar el servidor
            const PORT = process.env.PORT || 3001;
            app.listen(PORT, () => {
                console.log(`Servidor corriendo en el puerto ${PORT}`);
            });
        });
    });
});
