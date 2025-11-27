// src/config/data-source.ts
// Este archivo es usado por la CLI de TypeORM para migraciones
// La configuración debe coincidir con database.module.ts

import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos (debe coincidir con configuration.ts)
const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'agentes_db',
    synchronize: false, // Siempre false para migraciones
    logging: true,
    // Rutas para desarrollo (archivos .ts)
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
};

const AppDataSource = new DataSource(config);

export default AppDataSource;