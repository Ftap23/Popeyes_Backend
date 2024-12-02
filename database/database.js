// CONEXIÓN CON BASE DE DATOS INTERNA EN RENDER
import { Sequelize } from 'sequelize';

// URL interna proporcionada por Render
const INTERNAL_DATABASE_URL = "postgresql://db_popeyes_user:MiG4hQRUDcBkRZUWWzAMB5WEseDzZsP2@dpg-ct6j8o2j1k6c73aeo2p0-a/db_popeyes";

export const sequelize = new Sequelize(INTERNAL_DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Render requiere esta configuración para conexiones internas seguras
        }
    }
});
