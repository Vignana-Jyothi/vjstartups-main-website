const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const upload = require('../middlewares/upload');

router.use(express.json());

// Helper function to convert absolute file paths to relative URLs
const transformFilePaths = (startup) => {
    if (startup.coverImage && startup.coverImage.includes('/home/')) {
        startup.coverImage = startup.coverImage.replace(/.*\/uploads\//, '/uploads/');
    }
    if (startup.logo && startup.logo.includes('/home/')) {
        startup.logo = startup.logo.replace(/.*\/uploads\//, '/uploads/');
    }
    if (startup.pitchDeck && startup.pitchDeck.includes('/home/')) {
        startup.pitchDeck = startup.pitchDeck.replace(/.*\/uploads\//, '/uploads/');
    }
    if (startup.onePager && startup.onePager.includes('/home/')) {
        startup.onePager = startup.onePager.replace(/.*\/uploads\//, '/uploads/');
    }
    return startup;
};

// GET all startups
router.get('/', async (req, res) => {
    try {
        const where = {};
        if (req.query.minStage) {
            const minStage = parseInt(req.query.minStage, 10);
            if (!Number.isNaN(minStage)) {
                where.stage = { gte: minStage };
            }
        }

        const startups = await prisma.startup.findMany({
            where,
            select: {
                id: true,
                startupName: true,
                tagline: true,
                description: true,
                stage: true,
                fundingStatus: true,
                upvotes: true,
                views: true,
                coverImage: true,
                logo: true,
                website: true,
                createdAt: true,
                createdBy: true,
                ideaId: true,
                creator: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        const transformedStartups = startups.map(startup => {
            const startupObj = {
                ...startup,
                fundingStatus: startup.fundingStatus.toLowerCase().replace('_', '-'), // SEEKING_FUNDING → seeking-funding
                incorporationStatus: startup.incorporationStatus?.toLowerCase().replace('_', '-')
            };
            return transformFilePaths(startupObj);
        });
        
        res.json(transformedStartups);
    } catch (error) {
        console.error('Error fetching startups:', error);
        res.status(500).json({ message: 'Error fetching startups', error: error.message });
    }
});

// GET startups by user (must be before /:id)
router.get('/user/:userId', async (req, res) => {
    try {
        // userId can be email or user ID
        const startups = await prisma.startup.findMany({
            where: { createdBy: req.params.userId },
            include: {
                creator: {
                    select: { name: true, email: true }
                },
                teamMembers: true,
                milestones: true,
                supportPrograms: true
            },
            orderBy: { createdAt: 'desc' }
        });
        
        // Convert enums to lowercase for frontend
        const startupsFormatted = startups.map(s => ({
            ...s,
            fundingStatus: s.fundingStatus.toLowerCase().replace('_', '-'),
            incorporationStatus: s.incorporationStatus.toLowerCase().replace('_', '-')
        }));
        
        res.json(startupsFormatted);
    } catch (error) {
        console.error('Error fetching user startups:', error);
        res.status(500).json({ message: 'Error fetching user startups', error: error.message });
    }
});

// GET startups by stage (must be before /:id)
router.get('/stage/:stage', async (req, res) => {
    try {
        const stage = parseInt(req.params.stage, 10);
        const startups = await prisma.startup.findMany({
            where: { stage },
            include: {
                creator: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        // Convert enums to lowercase for frontend
        const startupsFormatted = startups.map(s => ({
            ...s,
            fundingStatus: s.fundingStatus.toLowerCase().replace('_', '-'),
            incorporationStatus: s.incorporationStatus.toLowerCase().replace('_', '-')
        }));
        
        res.json(startupsFormatted);
    } catch (error) {
        console.error('Error fetching startups by stage:', error);
        res.status(500).json({ message: 'Error fetching startups by stage', error: error.message });
    }
});

// GET startup by ID
router.get('/:id', async (req, res) => {
    try {
        const startup = await prisma.startup.findUnique({
            where: { id: req.params.id },
            include: {
                creator: {
                    select: { name: true, email: true }
                },
                teamMembers: true,
                milestones: {
                    orderBy: { date: 'asc' }
                },
                supportPrograms: true,
                idea: true
            }
        });
        
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Increment view count
        await prisma.startup.update({
            where: { id: req.params.id },
            data: { views: { increment: 1 } }
        });
        
        // Transform file paths for frontend consumption and convert enums
        const startupObj = {
            ...startup,
            views: startup.views + 1, // Reflect the increment
            fundingStatus: startup.fundingStatus.toLowerCase().replace('_', '-'),
            incorporationStatus: startup.incorporationStatus.toLowerCase().replace('_', '-'),
            ideaId: startup.idea // Rename for frontend compatibility
        };
        const transformedStartup = transformFilePaths(startupObj);
        
        res.json(transformedStartup);
    } catch (error) {
        console.error('Error fetching startup:', error);
        res.status(500).json({ message: 'Error fetching startup', error: error.message });
    }
});

// POST create new startup with file uploads
router.post('/', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'pitchDeck', maxCount: 1 },
    { name: 'onePager', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            startupName,
            tagline,
            description,
            founders,
            stage,
            fundingStatus,
            fundingAmount,
            revenue,
            customers,
            markets,
            incorporationStatus,
            website,
            businessModel,
            keyFeatures,
            technologyStack,
            marketSize,
            annualGrowthRate,
            targetUsers,
            supportPrograms,
            teamSize,
            team,
            milestones,
            problemStatement,
            solution,
            targetAudience,
            competitiveAdvantage,
            createdBy,
            ideaId
        } = req.body;

        console.log('🚀 POST /startup-api - Creating startup');
        console.log('📧 createdBy:', createdBy);
        console.log('📧 Type:', typeof createdBy);

        if (!createdBy || createdBy === 'anonymous') {
            return res.status(401).json({ message: 'You must be logged in to add a startup.' });
        }

        // CRITICAL FIX: Ensure user exists in database before creating startup
        // This prevents foreign key constraint violation
        const userEmail = createdBy.toLowerCase().trim();
        
        console.log('🔍 Checking if user exists:', userEmail);
        let user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            console.log('⚠️ User not found in database, creating user record');
            // User doesn't exist - this shouldn't happen after Google login,
            // but we'll create it to prevent foreign key errors
            user = await prisma.user.create({
                data: {
                    email: userEmail,
                    name: founders || 'Startup Creator', // Use founders as fallback name
                    role: 'STUDENT'
                }
            });
            console.log('✅ User created:', user.email);
        } else {
            console.log('✅ User exists:', user.email);
        }

        // Parse array fields from JSON strings
        const parsedKeyFeatures = keyFeatures ? JSON.parse(keyFeatures) : [];
        const parsedTechnologyStack = technologyStack ? JSON.parse(technologyStack) : [];
        const parsedSupportPrograms = supportPrograms ? JSON.parse(supportPrograms) : [];
        const parsedMilestones = milestones ? JSON.parse(milestones) : [];
        const parsedTeam = team ? JSON.parse(team) : [];

        // Handle file uploads - convert absolute paths to relative URLs
        const files = req.files || {};
        const coverImageUrl = files.coverImage ? files.coverImage[0].path.replace(/.*\/uploads\//, '/uploads/') : '';
        const logoUrl = files.logo ? files.logo[0].path.replace(/.*\/uploads\//, '/uploads/') : '';
        const pitchDeckUrl = files.pitchDeck ? files.pitchDeck[0].path.replace(/.*\/uploads\//, '/uploads/') : '';
        const onePagerUrl = files.onePager ? files.onePager[0].path.replace(/.*\/uploads\//, '/uploads/') : '';

        console.log('💾 Creating startup with transaction');
        // Create startup with related records in transaction
        const savedStartup = await prisma.$transaction(async (tx) => {
            const startup = await tx.startup.create({
                data: {
                    startupName,
                    tagline,
                    description,
                    founders,
                    stage: parseInt(stage),
                    fundingStatus: fundingStatus.toUpperCase().replace('-', '_'), // Convert to enum
                    fundingAmount,
                    revenue,
                    customers,
                    markets,
                    incorporationStatus: incorporationStatus ? incorporationStatus.toUpperCase().replace('-', '_') : 'NOT_INCORPORATED',
                    website,
                    coverImage: coverImageUrl,
                    logo: logoUrl,
                    businessModel,
                    keyFeatures: parsedKeyFeatures,
                    technologyStack: parsedTechnologyStack,
                    marketSize,
                    annualGrowthRate,
                    targetUsers,
                    teamSize: teamSize ? parseInt(teamSize) : 1,
                    pitchDeck: pitchDeckUrl,
                    onePager: onePagerUrl,
                    problemStatement,
                    solution,
                    targetAudience,
                    competitiveAdvantage,
                    createdBy: userEmail, // Use normalized email
                    ideaId: ideaId || null
                }
            });
            console.log('✅ Startup created:', startup.id);

            // Create team members if provided
            if (parsedTeam.length > 0) {
                await tx.startupTeamMember.createMany({
                    data: parsedTeam.map(member => ({
                        startupId: startup.id,
                        name: member.name,
                        role: member.role,
                        avatar: member.avatar || null
                    }))
                });
            }

            // Create milestones if provided
            if (parsedMilestones.length > 0) {
                await tx.startupMilestone.createMany({
                    data: parsedMilestones.map(milestone => ({
                        startupId: startup.id,
                        title: milestone.title,
                        date: new Date(milestone.date),
                        completed: milestone.completed || false
                    }))
                });
            }

            // Create support programs if provided
            if (parsedSupportPrograms.length > 0) {
                await tx.startupSupportProgram.createMany({
                    data: parsedSupportPrograms.map(program => ({
                        startupId: startup.id,
                        program: program
                    }))
                });
            }

            // If this startup is based on an idea, update the idea's startup status
            if (ideaId) {
                try {
                    await tx.idea.update({
                        where: { ideaId: ideaId },
                        data: { 
                            hasStartupCreated: true,
                            evaluatedAt: new Date()
                        }
                    });
                    console.log(`Updated idea ${ideaId} startup status to hasStartupCreated: true`);
                } catch (updateError) {
                    console.error('Error updating idea startup status:', updateError);
                    // Don't fail the startup creation if idea update fails
                }
            }

            return startup;
        });

        console.log('✅ Startup creation transaction completed');
        // Fetch with relations for response
        const startupWithRelations = await prisma.startup.findUnique({
            where: { id: savedStartup.id },
            include: {
                creator: {
                    select: { name: true, email: true }
                },
                teamMembers: true,
                milestones: true,
                supportPrograms: true
            }
        });

        // Convert enums to lowercase for frontend
        const startupFormatted = {
            ...startupWithRelations,
            fundingStatus: startupWithRelations.fundingStatus.toLowerCase().replace('_', '-'),
            incorporationStatus: startupWithRelations.incorporationStatus.toLowerCase().replace('_', '-')
        };
        
        console.log('🎉 Startup created successfully:', startupFormatted.id);
        res.status(201).json(startupFormatted);
    } catch (error) {
        console.error('❌ Error creating startup:', error);
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        });
        res.status(500).json({ message: 'Error creating startup', error: error.message });
    }
});

// PUT update startup
router.put('/:id', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'pitchDeck', maxCount: 1 },
    { name: 'onePager', maxCount: 1 }
]), async (req, res) => {
    try {
        const startup = await prisma.startup.findUnique({
            where: { id: req.params.id },
            include: {
                creator: true
            }
        });

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const requestingUserEmail = req.body.requestingUserEmail;
        if (!requestingUserEmail) {
            return res.status(401).json({ message: 'You must be logged in to edit a startup.' });
        }

        // Check authorization - createdBy is email in our schema
        if (startup.createdBy.toLowerCase() !== requestingUserEmail.toLowerCase()) {
            return res.status(403).json({ message: 'You are not authorized to edit this startup.' });
        }

        // Build update data
        const updateData = {};
        
        // Handle simple fields
        const simpleFields = [
            'startupName', 'tagline', 'description', 'founders', 'website',
            'fundingAmount', 'revenue', 'customers', 'markets',
            'businessModel', 'marketSize', 'annualGrowthRate', 'targetUsers',
            'problemStatement', 'solution', 'targetAudience', 'competitiveAdvantage'
        ];

        simpleFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Handle numeric fields
        if (req.body.stage !== undefined) updateData.stage = parseInt(req.body.stage);
        if (req.body.teamSize !== undefined) updateData.teamSize = parseInt(req.body.teamSize);

        // Handle enum fields
        if (req.body.fundingStatus) {
            updateData.fundingStatus = req.body.fundingStatus.toUpperCase().replace('-', '_');
        }
        if (req.body.incorporationStatus) {
            updateData.incorporationStatus = req.body.incorporationStatus.toUpperCase().replace('-', '_');
        }

        // Handle array fields
        if (req.body.keyFeatures) updateData.keyFeatures = JSON.parse(req.body.keyFeatures);
        if (req.body.technologyStack) updateData.technologyStack = JSON.parse(req.body.technologyStack);

        // Handle file uploads - convert absolute paths to relative URLs
        const files = req.files || {};
        if (files.coverImage) updateData.coverImage = files.coverImage[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.logo) updateData.logo = files.logo[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.pitchDeck) updateData.pitchDeck = files.pitchDeck[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.onePager) updateData.onePager = files.onePager[0].path.replace(/.*\/uploads\//, '/uploads/');

        // Update startup and related records in transaction
        await prisma.$transaction(async (tx) => {
            // Update main startup record
            await tx.startup.update({
                where: { id: req.params.id },
                data: updateData
            });

            // Update team members if provided
            if (req.body.team) {
                const parsedTeam = JSON.parse(req.body.team);
                // Delete existing and recreate
                await tx.startupTeamMember.deleteMany({
                    where: { startupId: req.params.id }
                });
                if (parsedTeam.length > 0) {
                    await tx.startupTeamMember.createMany({
                        data: parsedTeam.map(member => ({
                            startupId: req.params.id,
                            name: member.name,
                            role: member.role,
                            avatar: member.avatar || null
                        }))
                    });
                }
            }

            // Update milestones if provided
            if (req.body.milestones) {
                const parsedMilestones = JSON.parse(req.body.milestones);
                // Delete existing and recreate
                await tx.startupMilestone.deleteMany({
                    where: { startupId: req.params.id }
                });
                if (parsedMilestones.length > 0) {
                    await tx.startupMilestone.createMany({
                        data: parsedMilestones.map(milestone => ({
                            startupId: req.params.id,
                            title: milestone.title,
                            date: new Date(milestone.date),
                            completed: milestone.completed || false
                        }))
                    });
                }
            }

            // Update support programs if provided
            if (req.body.supportPrograms) {
                const parsedPrograms = JSON.parse(req.body.supportPrograms);
                // Delete existing and recreate
                await tx.startupSupportProgram.deleteMany({
                    where: { startupId: req.params.id }
                });
                if (parsedPrograms.length > 0) {
                    await tx.startupSupportProgram.createMany({
                        data: parsedPrograms.map(program => ({
                            startupId: req.params.id,
                            program: program
                        }))
                    });
                }
            }
        });

        // Fetch updated startup with relations
        const updatedStartup = await prisma.startup.findUnique({
            where: { id: req.params.id },
            include: {
                creator: {
                    select: { name: true, email: true }
                },
                teamMembers: true,
                milestones: true,
                supportPrograms: true
            }
        });

        // Convert enums to lowercase for frontend
        const startupFormatted = {
            ...updatedStartup,
            fundingStatus: updatedStartup.fundingStatus.toLowerCase().replace('_', '-'),
            incorporationStatus: updatedStartup.incorporationStatus.toLowerCase().replace('_', '-')
        };
        
        res.json(startupFormatted);
    } catch (error) {
        console.error('Error updating startup:', error);
        res.status(500).json({ message: 'Error updating startup', error: error.message });
    }
});

// DELETE startup
router.delete('/:id', async (req, res) => {
    try {
        const startup = await prisma.startup.findUnique({
            where: { id: req.params.id }
        });

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        const requestingUserEmail = req.body.requestingUserEmail;
        if (!requestingUserEmail) {
            return res.status(401).json({ message: 'You must be logged in to delete a startup.' });
        }

        // Check authorization - createdBy is email in our schema
        if (startup.createdBy.toLowerCase() !== requestingUserEmail.toLowerCase()) {
            return res.status(403).json({ message: 'You are not authorized to delete this startup.' });
        }

        await prisma.startup.delete({
            where: { id: req.params.id }
        });
        // Related records (team, milestones, programs) are cascade deleted
        
        res.json({ message: 'Startup deleted successfully' });
    } catch (error) {
        console.error('Error deleting startup:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Startup not found' });
        }
        res.status(500).json({ message: 'Error deleting startup', error: error.message });
    }
});

// POST upvote startup
router.post('/:id/upvote', async (req, res) => {
    try {
        const startup = await prisma.startup.update({
            where: { id: req.params.id },
            data: {
                upvotes: { increment: 1 }
            },
            select: { upvotes: true }
        });
        
        res.json({ upvotes: startup.upvotes });
    } catch (error) {
        console.error('Error upvoting startup:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Startup not found' });
        }
        res.status(500).json({ message: 'Error upvoting startup', error: error.message });
    }
});

// Download document endpoint
router.get('/:id/download/:docType', async (req, res) => {
    try {
        const { id, docType } = req.params;
        const startup = await prisma.startup.findUnique({
            where: { id },
            select: {
                startupName: true,
                pitchDeck: true,
                onePager: true
            }
        });
        
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        
        let filePath;
        let fileName;
        
        if (docType === 'pitchDeck' && startup.pitchDeck) {
            // Handle both old absolute paths and new relative paths
            if (startup.pitchDeck.startsWith('/home/')) {
                filePath = startup.pitchDeck; // Use absolute path directly
            } else {
                filePath = startup.pitchDeck.replace(/^\/uploads\//, './uploads/');
            }
            fileName = `${startup.startupName}_PitchDeck.pptx`;
        } else if (docType === 'onePager' && startup.onePager) {
            // Handle both old absolute paths and new relative paths
            if (startup.onePager.startsWith('/home/')) {
                filePath = startup.onePager; // Use absolute path directly
            } else {
                filePath = startup.onePager.replace(/^\/uploads\//, './uploads/');
            }
            fileName = `${startup.startupName}_OnePager.pdf`;
        } else {
            return res.status(404).json({ message: 'Document not found' });
        }
        
        res.download(filePath, fileName);
    } catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({ message: 'Error downloading document', error: error.message });
    }
});

module.exports = router;
