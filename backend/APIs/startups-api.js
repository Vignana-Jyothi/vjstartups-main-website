const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const upload = require('../middlewares/upload');
const userAuth = require('../middlewares/userAuth');

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

const creatorName = (user) =>
    !user ? null : ([user.firstName, user.lastName].filter(Boolean).join(' ') || user.displayName || user.email);

// Startup is now a Django/Plane-owned table (see prisma/schema.prisma) - the
// internal field names changed (startupName -> name, stage -> trlStage,
// createdBy email string -> createdById UUID, etc.), but the JSON shape this
// API returns is kept exactly as it was, so the frontend needed zero changes.
// toClientShape does that translation in one place.
const toClientShape = (startup) => {
    if (!startup) return startup;
    const {
        name, trlStage, foundersText, pitchDeckUrl, onePagerUrl,
        problemStatement, solutionStatement, creator, creatorId, createdById,
        ...rest
    } = startup;
    return transformFilePaths({
        ...rest,
        startupName: name,
        stage: trlStage,
        founders: foundersText,
        pitchDeck: pitchDeckUrl,
        onePager: onePagerUrl,
        problemStatement,
        solution: solutionStatement,
        fundingStatus: startup.fundingStatus ? startup.fundingStatus.toLowerCase().replace('_', '-') : '',
        incorporationStatus: startup.incorporationStatus ? startup.incorporationStatus.toLowerCase().replace('_', '-') : '',
        createdBy: creator?.email || null,
        creator: creator ? { name: creatorName(creator), email: creator.email } : undefined,
    });
};

const STARTUP_INCLUDE = {
    creator: { select: { firstName: true, lastName: true, displayName: true, email: true } },
    teamMembers: true,
    milestones: true,
    supportPrograms: true,
};

// GET all startups
router.get('/', async (req, res) => {
    try {
        const where = { deletedAt: null };
        if (req.query.minStage) {
            const minStage = parseInt(req.query.minStage, 10);
            if (!Number.isNaN(minStage)) {
                where.trlStage = { gte: minStage };
            }
        }

        const startups = await prisma.startup.findMany({
            where,
            select: {
                id: true,
                name: true,
                tagline: true,
                description: true,
                trlStage: true,
                fundingStatus: true,
                upvotes: true,
                views: true,
                coverImage: true,
                logo: true,
                website: true,
                createdAt: true,
                ideaId: true,
                creator: { select: { firstName: true, lastName: true, displayName: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(startups.map(toClientShape));
    } catch (error) {
        console.error('Error fetching startups:', error);
        res.status(500).json({ message: 'Error fetching startups', error: error.message });
    }
});

// GET startups by user (must be before /:id) - userId can be email or user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const param = req.params.userId;
        const user = await prisma.user.findFirst({
            where: param.includes('@') ? { email: param.toLowerCase() } : { id: param }
        });
        if (!user) {
            return res.json([]);
        }

        const startups = await prisma.startup.findMany({
            where: { createdById: user.id, deletedAt: null },
            include: STARTUP_INCLUDE,
            orderBy: { createdAt: 'desc' }
        });

        res.json(startups.map(toClientShape));
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
            where: { trlStage: stage, deletedAt: null },
            include: { creator: { select: { firstName: true, lastName: true, displayName: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });

        res.json(startups.map(toClientShape));
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
            include: STARTUP_INCLUDE
        });

        if (!startup || startup.deletedAt) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Increment view count
        await prisma.startup.update({
            where: { id: req.params.id },
            data: { views: { increment: 1 } }
        });

        // No formal Prisma relation to Idea any more (see schema.prisma) - look
        // it up manually if this startup came from one.
        const idea = startup.ideaId
            ? await prisma.idea.findUnique({ where: { ideaId: startup.ideaId } })
            : null;

        res.json({
            ...toClientShape({ ...startup, views: startup.views + 1 }),
            ideaId: idea, // preserves the old response shape (the linked idea object, not just its id)
        });
    } catch (error) {
        console.error('Error fetching startup:', error);
        res.status(500).json({ message: 'Error fetching startup', error: error.message });
    }
});

// POST create new startup with file uploads
router.post('/', userAuth, upload.fields([
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
            ideaId
        } = req.body;

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

        const financialNotes = [
            fundingAmount ? `Funding amount: ${fundingAmount}` : null,
            revenue ? `Revenue: ${revenue}` : null,
        ].filter(Boolean).join('\n');

        const savedStartup = await prisma.$transaction(async (tx) => {
            const startup = await tx.startup.create({
                data: {
                    name: startupName,
                    tagline,
                    description,
                    foundersText: founders || '',
                    trlStage: parseInt(stage),
                    fundingStatus: fundingStatus ? fundingStatus.toUpperCase().replace('-', '_') : '',
                    financialNotes,
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
                    pitchDeckUrl,
                    onePagerUrl,
                    problemStatement,
                    solutionStatement: solution,
                    targetAudience,
                    competitiveAdvantage,
                    createdById: req.user.id,
                    updatedById: req.user.id,
                    ideaId: ideaId || null
                }
            });

            if (parsedTeam.length > 0) {
                await tx.startupTeamMember.createMany({
                    data: parsedTeam.map(member => ({
                        startupId: startup.id,
                        name: member.name,
                        role: member.role,
                        avatar: member.avatar || '',
                        createdById: req.user.id,
                    }))
                });
            }

            if (parsedMilestones.length > 0) {
                await tx.milestone.createMany({
                    data: parsedMilestones.map(milestone => ({
                        startupId: startup.id,
                        title: milestone.title,
                        type: 'manual',
                        achievedAt: milestone.completed ? new Date(milestone.date) : null,
                        description: milestone.completed ? '' : `Target date: ${milestone.date}`,
                        createdById: req.user.id,
                    }))
                });
            }

            if (parsedSupportPrograms.length > 0) {
                await tx.startupSupportProgram.createMany({
                    data: parsedSupportPrograms.map(program => ({
                        startupId: startup.id,
                        program: program,
                        createdById: req.user.id,
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
                } catch (updateError) {
                    console.error('Error updating idea startup status:', updateError);
                    // Don't fail the startup creation if idea update fails
                }
            }

            return startup;
        });

        const startupWithRelations = await prisma.startup.findUnique({
            where: { id: savedStartup.id },
            include: STARTUP_INCLUDE
        });

        // Prisma just wrote this Startup directly into Django's vj_startups
        // table, so Django's own post_save signal (which normally provisions
        // the Plane project - see signals.py) never fired for it. Ask Django
        // to do it explicitly instead. Best-effort: the startup itself is
        // already saved and returned to the user regardless of whether this
        // succeeds - see InternalProvisionStartupEndpoint on the Plane side
        // for why a retry later is safe (it's idempotent).
        try {
            const provisionResponse = await fetch(`${process.env.PLANE_API_URL}/api/vj-startups/internal/provision-startup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Internal-Token': process.env.PLANE_INTERNAL_TOKEN,
                },
                body: JSON.stringify({ startup_id: savedStartup.id }),
            });
            if (!provisionResponse.ok) {
                console.error('Startup provisioning failed:', provisionResponse.status, await provisionResponse.text());
            }
        } catch (provisionError) {
            console.error('Startup provisioning request failed:', provisionError);
        }

        res.status(201).json(toClientShape(startupWithRelations));
    } catch (error) {
        console.error('Error creating startup:', error);
        res.status(500).json({ message: 'Error creating startup', error: error.message });
    }
});

// PUT update startup
router.put('/:id', userAuth, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'pitchDeck', maxCount: 1 },
    { name: 'onePager', maxCount: 1 }
]), async (req, res) => {
    try {
        const startup = await prisma.startup.findUnique({
            where: { id: req.params.id },
            include: { creator: true }
        });

        if (!startup || startup.deletedAt) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Check authorization against the verified session, not a client-supplied email
        if (!startup.creator || startup.creator.email.toLowerCase() !== req.user.email.toLowerCase()) {
            return res.status(403).json({ message: 'You are not authorized to edit this startup.' });
        }

        const updateData = { updatedById: req.user.id };

        const FIELD_MAP = {
            startupName: 'name',
            tagline: 'tagline',
            description: 'description',
            founders: 'foundersText',
            website: 'website',
            customers: 'customers',
            markets: 'markets',
            businessModel: 'businessModel',
            marketSize: 'marketSize',
            annualGrowthRate: 'annualGrowthRate',
            targetUsers: 'targetUsers',
            problemStatement: 'problemStatement',
            solution: 'solutionStatement',
            targetAudience: 'targetAudience',
            competitiveAdvantage: 'competitiveAdvantage',
        };

        Object.entries(FIELD_MAP).forEach(([clientField, dbField]) => {
            if (req.body[clientField] !== undefined) {
                updateData[dbField] = req.body[clientField];
            }
        });

        if (req.body.fundingAmount !== undefined || req.body.revenue !== undefined) {
            updateData.financialNotes = [
                req.body.fundingAmount ? `Funding amount: ${req.body.fundingAmount}` : null,
                req.body.revenue ? `Revenue: ${req.body.revenue}` : null,
            ].filter(Boolean).join('\n');
        }

        if (req.body.stage !== undefined) updateData.trlStage = parseInt(req.body.stage);
        if (req.body.teamSize !== undefined) updateData.teamSize = parseInt(req.body.teamSize);

        if (req.body.fundingStatus) {
            updateData.fundingStatus = req.body.fundingStatus.toUpperCase().replace('-', '_');
        }
        if (req.body.incorporationStatus) {
            updateData.incorporationStatus = req.body.incorporationStatus.toUpperCase().replace('-', '_');
        }

        if (req.body.keyFeatures) updateData.keyFeatures = JSON.parse(req.body.keyFeatures);
        if (req.body.technologyStack) updateData.technologyStack = JSON.parse(req.body.technologyStack);

        const files = req.files || {};
        if (files.coverImage) updateData.coverImage = files.coverImage[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.logo) updateData.logo = files.logo[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.pitchDeck) updateData.pitchDeckUrl = files.pitchDeck[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.onePager) updateData.onePagerUrl = files.onePager[0].path.replace(/.*\/uploads\//, '/uploads/');

        await prisma.$transaction(async (tx) => {
            await tx.startup.update({
                where: { id: req.params.id },
                data: updateData
            });

            if (req.body.team) {
                const parsedTeam = JSON.parse(req.body.team);
                await tx.startupTeamMember.deleteMany({ where: { startupId: req.params.id } });
                if (parsedTeam.length > 0) {
                    await tx.startupTeamMember.createMany({
                        data: parsedTeam.map(member => ({
                            startupId: req.params.id,
                            name: member.name,
                            role: member.role,
                            avatar: member.avatar || '',
                            createdById: req.user.id,
                        }))
                    });
                }
            }

            if (req.body.milestones) {
                const parsedMilestones = JSON.parse(req.body.milestones);
                await tx.milestone.deleteMany({ where: { startupId: req.params.id } });
                if (parsedMilestones.length > 0) {
                    await tx.milestone.createMany({
                        data: parsedMilestones.map(milestone => ({
                            startupId: req.params.id,
                            title: milestone.title,
                            type: 'manual',
                            achievedAt: milestone.completed ? new Date(milestone.date) : null,
                            description: milestone.completed ? '' : `Target date: ${milestone.date}`,
                            createdById: req.user.id,
                        }))
                    });
                }
            }

            if (req.body.supportPrograms) {
                const parsedPrograms = JSON.parse(req.body.supportPrograms);
                await tx.startupSupportProgram.deleteMany({ where: { startupId: req.params.id } });
                if (parsedPrograms.length > 0) {
                    await tx.startupSupportProgram.createMany({
                        data: parsedPrograms.map(program => ({
                            startupId: req.params.id,
                            program: program,
                            createdById: req.user.id,
                        }))
                    });
                }
            }
        });

        const updatedStartup = await prisma.startup.findUnique({
            where: { id: req.params.id },
            include: STARTUP_INCLUDE
        });

        res.json(toClientShape(updatedStartup));
    } catch (error) {
        console.error('Error updating startup:', error);
        res.status(500).json({ message: 'Error updating startup', error: error.message });
    }
});

// DELETE startup
router.delete('/:id', userAuth, async (req, res) => {
    try {
        const startup = await prisma.startup.findUnique({
            where: { id: req.params.id },
            include: { creator: true }
        });

        if (!startup || startup.deletedAt) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Check authorization against the verified session, not a client-supplied email
        if (!startup.creator || startup.creator.email.toLowerCase() !== req.user.email.toLowerCase()) {
            return res.status(403).json({ message: 'You are not authorized to delete this startup.' });
        }

        // Soft delete, matching Django's convention for this table - a hard
        // delete would cascade against team members/milestones/support
        // programs (fine, those are FK'd with onDelete: Cascade) but this
        // is safer and reversible.
        await prisma.startup.update({
            where: { id: req.params.id },
            data: { deletedAt: new Date(), updatedById: req.user.id }
        });

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
                name: true,
                pitchDeckUrl: true,
                onePagerUrl: true
            }
        });

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        let filePath;
        let fileName;

        if (docType === 'pitchDeck' && startup.pitchDeckUrl) {
            filePath = startup.pitchDeckUrl.startsWith('/home/')
                ? startup.pitchDeckUrl
                : startup.pitchDeckUrl.replace(/^\/uploads\//, './uploads/');
            fileName = `${startup.name}_PitchDeck.pptx`;
        } else if (docType === 'onePager' && startup.onePagerUrl) {
            filePath = startup.onePagerUrl.startsWith('/home/')
                ? startup.onePagerUrl
                : startup.onePagerUrl.replace(/^\/uploads\//, './uploads/');
            fileName = `${startup.name}_OnePager.pdf`;
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
