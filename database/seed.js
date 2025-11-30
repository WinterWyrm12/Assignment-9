const bcrypt = require('bcryptjs');
const { db, User, Project, Task } = require('./setup');

async function seedDatabase() {
    try {
        // Force sync to reset database
        await db.sync({ force: true });
        console.log('Database reset successfully.');

        // Create sample users
        const hashedPassword = await bcrypt.hash("password123", 10);
        
        const users = await User.bulkCreate([
            {
                name: 'John Employee',
                email: 'john@company.com',
                password: hashedPassword,
                // TODO: Add role: 'employee'
                role: 'employee'
            },
            {
                name: 'Sarah Manager',
                email: 'sarah@company.com',
                password: hashedPassword,
                // TODO: Add role: 'manager'
                role: 'manager'
            },
            {
                name: 'Mike Admin',
                email: 'mike@company.com',
                password: hashedPassword,
                // TODO: Add role: 'admin'
                role: 'admin'
            }
        ]);

        // Create sample projects
        const projects = await Project.bulkCreate([
            {
                name: 'Website Redesign',
                description: 'Complete overhaul of company website',
                managerId: users[1].id, // Sarah Manager
                status: 'active'
            },
            {
                name: 'Mobile App Development',
                description: 'New mobile app for customers',
                managerId: users[1].id, // Sarah Manager
                status: 'active'
            },
            {
                name: 'Database Migration',
                description: 'Migrate legacy database to new system',
                managerId: users[2].id, // Mike Admin
                status: 'planning'
            }
        ]);

        // Create sample tasks
        await Task.bulkCreate([
            {
                title: 'Design homepage mockup',
                description: 'Create wireframes and mockups for new homepage',
                projectId: projects[0].id,
                assignedUserId: users[0].id, // John Employee
                status: 'in-progress',
                priority: 'high'
            },
            {
                title: 'Set up development environment',
                description: 'Configure local development setup',
                projectId: projects[1].id,
                assignedUserId: users[0].id, // John Employee
                status: 'completed',
                priority: 'medium'
            },
            {
                title: 'Review database schema',
                description: 'Analyze current database structure',
                projectId: projects[2].id,
                assignedUserId: users[1].id, // Sarah Manager
                status: 'pending',
                priority: 'high'
            }
        ]);

        console.log('Database seeded successfully!');
        console.log('Sample users created:');
        console.log('- john@company.com (Employee)');
        console.log('- sarah@company.com (Manager)');
        console.log('- mike@company.com (Admin)');
        console.log('All passwords: password123');
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await db.close();
    }
}

seedDatabase();