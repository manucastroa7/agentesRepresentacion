import AppDataSource from '../config/data-source';
import { User, UserRole } from '../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established');

        const userRepository = AppDataSource.getRepository(User);

        // Check if superadmin exists
        const superAdminEmail = 'agentesrepresentacion@gmail.com';
        let superAdmin = await userRepository.findOne({
            where: { email: superAdminEmail },
        });

        if (superAdmin) {
            console.log('✅ Superadmin user already exists');

            // Update role if not superadmin
            if (superAdmin.role !== UserRole.SUPERADMIN) {
                superAdmin.role = UserRole.SUPERADMIN;
                await userRepository.save(superAdmin);
                console.log('✅ Updated user role to SUPERADMIN');
            }
        } else {
            // Create superadmin user
            const hashedPassword = await bcrypt.hash('Admin123!', 10);
            superAdmin = userRepository.create({
                email: superAdminEmail,
                passwordHash: hashedPassword,
                role: UserRole.SUPERADMIN,
            });
            await userRepository.save(superAdmin);
            console.log('✅ Superadmin user created');
        }

        console.log('🎉 Seed completed successfully!');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed();
