import { DataSource } from 'typeorm';
import { Agent } from '../modules/agents/entities/agent.entity';
import { User } from '../modules/users/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'agentes_db',
    synchronize: false,
    logging: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});

async function checkAgents() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established\n');

        const agentRepository = AppDataSource.getRepository(Agent);
        const userRepository = AppDataSource.getRepository(User);

        const agents = await agentRepository.find({ relations: ['user'] });

        console.log(`Found ${agents.length} agents:\n`);

        for (const agent of agents) {
            console.log('─'.repeat(60));
            console.log(`ID: ${agent.id}`);
            console.log(`Agency Name: ${agent.agencyName}`);
            console.log(`Slug: ${agent.slug}`);
            console.log(`Plan: ${agent.plan}`);
            console.log(`Status: ${agent.status}`);
            console.log(`User Email: ${agent.user?.email || 'N/A'}`);
            console.log(`User Role: ${agent.user?.role || 'N/A'}`);
            console.log(`Created: ${agent.createdAt}`);
        }
        console.log('─'.repeat(60));

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAgents();
