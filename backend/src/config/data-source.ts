import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  // 1. Prioridad a la URL de Railway
  url: process.env.DATABASE_URL,

  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'agentes_db',

  // 2. IMPORTANTE: En Prod (Railway) queremos que cree las tablas automáticamente si no usas migraciones aún.
  // Cambia esto a 'false' cuando ya tengas datos reales y uses migraciones estrictas.
  synchronize: true,

  logging: true,

  // 3. FIX CRÍTICO DE RUTAS: Busca en 'src' (ts) o en 'dist' (js) según el entorno
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],

  // 4. SSL: Requerido por Railway/Neon
  extra: {
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : null,
  },
};

const AppDataSource = new DataSource(config);

export default AppDataSource;
