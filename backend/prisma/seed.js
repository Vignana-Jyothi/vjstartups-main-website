const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users
  console.log('Creating users...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vnrvjiet.in' },
    update: {},
    create: {
      email: 'admin@vnrvjiet.in',
      name: 'Admin User',
      role: 'ADMIN',
      picture: 'https://via.placeholder.com/150'
    }
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@vnrvjiet.in' },
    update: {},
    create: {
      email: 'student@vnrvjiet.in',
      name: 'Demo Student',
      role: 'STUDENT',
      picture: 'https://via.placeholder.com/150'
    }
  });

  console.log('✅ Users created');

  // Create demo problems
  console.log('Creating problems...');
  const problem1 = await prisma.problem.create({
    data: {
      problemId: '1',
      title: 'Student Mental Health Support',
      briefparagraph: 'Many students struggle with mental health issues but lack easy access to support resources.',
      description: 'Students face increasing academic pressure, social challenges, and mental health concerns. Current support systems are either inaccessible, stigmatized, or insufficient.',
      marketSize: 'The student mental health market is valued at billions globally',
      targetCustomers: 'College and university students aged 18-25',
      upvotes: 0,
      addedByName: student.name,
      addedByEmail: student.email,
      tags: ['mental-health', 'education', 'wellness']
    }
  });

  const problem2 = await prisma.problem.create({
    data: {
      problemId: '2',
      title: 'Food Waste in College Campuses',
      briefparagraph: 'College cafeterias generate massive food waste daily while many students face food insecurity.',
      description: 'Campus dining halls throw away large quantities of edible food while students skip meals due to financial constraints or meal plan limitations.',
      marketSize: 'Food waste management market worth $40B+ globally',
      targetCustomers: 'College administrators, students, food service providers',
      upvotes: 0,
      addedByName: student.name,
      addedByEmail: student.email,
      tags: ['sustainability', 'food', 'social-impact']
    }
  });

  console.log('✅ Problems created');

  // Create demo ideas
  console.log('Creating ideas...');
  const idea1 = await prisma.idea.create({
    data: {
      ideaId: uuidv4(),
      title: 'PeerSupport - Anonymous Mental Health Platform',
      description: 'A mobile app connecting students anonymously with peer supporters and professional counselors, available 24/7.',
      stage: 2,
      relatedProblemId: problem1.problemId,
      upvotes: 0,
      addedByName: student.name,
      addedByEmail: student.email,
      tags: ['app', 'mental-health', 'peer-support'],
      teamMembers: {
        create: [
          {
            name: student.name,
            email: student.email,
            role: 'Founder & Developer'
          }
        ]
      }
    }
  });

  const idea2 = await prisma.idea.create({
    data: {
      ideaId: uuidv4(),
      title: 'FoodShare - Campus Food Redistribution Network',
      description: 'A platform connecting campus dining halls with students to redistribute surplus food before it goes to waste.',
      stage: 3,
      relatedProblemId: problem2.problemId,
      upvotes: 0,
      addedByName: student.name,
      addedByEmail: student.email,
      tags: ['sustainability', 'marketplace', 'food-tech'],
      teamMembers: {
        create: [
          {
            name: student.name,
            email: student.email,
            role: 'Founder'
          }
        ]
      }
    }
  });

  console.log('✅ Ideas created');

  // Create demo project
  console.log('Creating project...');
  const project = await prisma.project.create({
    data: {
      name: 'VJ Startups Platform',
      description: 'Development and maintenance of the VJ Startups platform',
      color: '#7c3aed',
      emoji: '🚀',
      status: 'ACTIVE',
      createdBy: admin.email,
      members: {
        create: [
          {
            userId: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'LEAD'
          },
          {
            userId: student.id,
            name: student.name,
            email: student.email,
            role: 'MEMBER'
          }
        ]
      }
    }
  });

  console.log('✅ Project created');

  // Create demo tasks
  console.log('Creating tasks...');
  await prisma.task.createMany({
    data: [
      {
        title: 'Setup PostgreSQL database',
        description: 'Migrate from MongoDB to PostgreSQL',
        status: 'DONE',
        priority: 'HIGH',
        projectId: project.id,
        createdByUserId: admin.id,
        createdByName: admin.name,
        order: 0
      },
      {
        title: 'Update API documentation',
        description: 'Document all API endpoints with new Prisma queries',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: project.id,
        assigneeUserId: student.id,
        assigneeName: student.name,
        createdByUserId: admin.id,
        createdByName: admin.name,
        order: 1
      },
      {
        title: 'Test authentication flow',
        description: 'Ensure Google OAuth works correctly with PostgreSQL',
        status: 'TODO',
        priority: 'HIGH',
        projectId: project.id,
        createdByUserId: admin.id,
        createdByName: admin.name,
        order: 0
      }
    ]
  });

  console.log('✅ Tasks created');

  // Create demo announcement
  console.log('Creating announcement...');
  await prisma.announcement.create({
    data: {
      title: 'Welcome to VJ Startups Platform!',
      content: 'We are excited to launch the new VJ Startups platform powered by PostgreSQL and Prisma. Share your ideas, collaborate with peers, and build amazing startups!',
      postedByName: admin.name,
      postedByEmail: admin.email,
      isActive: true
    }
  });

  console.log('✅ Announcement created');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Demo Data Summary:');
  console.log('   - 2 Users (admin@vnrvjiet.in, student@vnrvjiet.in)');
  console.log('   - 2 Problems');
  console.log('   - 2 Ideas');
  console.log('   - 1 Project with 3 Tasks');
  console.log('   - 1 Announcement');
  console.log('');
  console.log('🔑 Login Credentials:');
  console.log('   Use Google OAuth with @vnrvjiet.in emails');
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
