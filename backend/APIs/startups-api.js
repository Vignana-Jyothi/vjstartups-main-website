const express = require('express');
const router = express.Router();
const Startup = require('../models/Startup');
const Ideas = require('../models/Ideas');
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
        const query = {};
        if (req.query.minStage) {
            const minStage = parseInt(req.query.minStage, 10);
            if (!Number.isNaN(minStage)) {
                query.stage = { $gte: minStage };
            }
        }

        const startups = await Startup.find(query)
            .select('startupName tagline description stage fundingStatus upvotes views coverImage logo website createdAt createdBy ideaId')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        const transformedStartups = startups.map(startup => {
            const startupObj = startup.toObject();
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
        const startups = await Startup.find({ createdBy: req.params.userId })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(startups);
    } catch (error) {
        console.error('Error fetching user startups:', error);
        res.status(500).json({ message: 'Error fetching user startups', error: error.message });
    }
});

// GET startups by stage (must be before /:id)
router.get('/stage/:stage', async (req, res) => {
    try {
        const stage = parseInt(req.params.stage, 10);
        const startups = await Startup.find({ stage })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(startups);
    } catch (error) {
        console.error('Error fetching startups by stage:', error);
        res.status(500).json({ message: 'Error fetching startups by stage', error: error.message });
    }
});

// GET startup by ID
router.get('/:id', async (req, res) => {
    try {
        const startup = await Startup.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('ideaId');
        
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Increment view count
        startup.views += 1;
        await startup.save();
        
        // Transform file paths for frontend consumption
        const startupObj = startup.toObject();
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
            milestones,
            problemStatement,
            solution,
            targetAudience,
            competitiveAdvantage,
            createdBy,
            ideaId
        } = req.body;

        // Parse array fields from JSON strings
        const parsedKeyFeatures = keyFeatures ? JSON.parse(keyFeatures) : [];
        const parsedTechnologyStack = technologyStack ? JSON.parse(technologyStack) : [];
        const parsedSupportPrograms = supportPrograms ? JSON.parse(supportPrograms) : [];
        const parsedMilestones = milestones ? JSON.parse(milestones) : [];

        // Handle file uploads - convert absolute paths to relative URLs
        const files = req.files || {};
        const coverImageUrl = files.coverImage ? files.coverImage[0].path.replace(/.*\/uploads\//, '/uploads/') : '';
        const logoUrl = files.logo ? files.logo[0].path.replace(/.*\/uploads\//, '/uploads/') : '';
        const pitchDeckUrl = files.pitchDeck ? files.pitchDeck[0].path.replace(/.*\/uploads\//, '/uploads/') : '';
        const onePagerUrl = files.onePager ? files.onePager[0].path.replace(/.*\/uploads\//, '/uploads/') : '';

        const startup = new Startup({
            startupName,
            tagline,
            description,
            founders,
            stage: parseInt(stage),
            fundingStatus,
            fundingAmount,
            revenue,
            customers,
            markets,
            incorporationStatus,
            website,
            coverImage: coverImageUrl,
            logo: logoUrl,
            businessModel,
            keyFeatures: parsedKeyFeatures,
            technologyStack: parsedTechnologyStack,
            marketSize,
            annualGrowthRate,
            targetUsers,
            supportPrograms: parsedSupportPrograms,
            teamSize: teamSize ? parseInt(teamSize) : undefined,
            milestones: parsedMilestones,
            pitchDeck: pitchDeckUrl,
            onePager: onePagerUrl,
            problemStatement,
            solution,
            targetAudience,
            competitiveAdvantage,
            createdBy: createdBy || 'anonymous', // Always provide a fallback
            ...(ideaId && { ideaId }) // Only add ideaId if it exists
        });

        const savedStartup = await startup.save();
        await savedStartup.populate('createdBy', 'name email');
        
        // If this startup is based on an idea, update the idea's startup status
        if (ideaId) {
            try {
                await Ideas.findOneAndUpdate(
                    { ideaId: ideaId },
                    { 
                        'startupStatus.hasStartupCreated': true,
                        'startupStatus.evaluatedAt': new Date()
                    }
                );
                console.log(`Updated idea ${ideaId} startup status to hasStartupCreated: true`);
            } catch (updateError) {
                console.error('Error updating idea startup status:', updateError);
                // Don't fail the startup creation if idea update fails
            }
        }
        
        res.status(201).json(savedStartup);
    } catch (error) {
        console.error('Error creating startup:', error);
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
        const startup = await Startup.findById(req.params.id);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Update fields from request body
        Object.keys(req.body).forEach(key => {
            if (key === 'keyFeatures' || key === 'technologyStack' || key === 'supportPrograms' || key === 'milestones') {
                startup[key] = JSON.parse(req.body[key]);
            } else if (key === 'stage' || key === 'teamSize') {
                const parsedValue = parseInt(req.body[key]);
                startup[key] = parsedValue;
            } else {
                startup[key] = req.body[key];
            }
        });

        // Handle file uploads - convert absolute paths to relative URLs
        const files = req.files || {};
        if (files.coverImage) startup.coverImage = files.coverImage[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.logo) startup.logo = files.logo[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.pitchDeck) startup.pitchDeck = files.pitchDeck[0].path.replace(/.*\/uploads\//, '/uploads/');
        if (files.onePager) startup.onePager = files.onePager[0].path.replace(/.*\/uploads\//, '/uploads/');

        const updatedStartup = await startup.save();
        await updatedStartup.populate('createdBy', 'name email');
        
        res.json(updatedStartup);
    } catch (error) {
        console.error('Error updating startup:', error);
        res.status(500).json({ message: 'Error updating startup', error: error.message });
    }
});

// DELETE startup
router.delete('/:id', async (req, res) => {
    try {
        const startup = await Startup.findByIdAndDelete(req.params.id);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        
        res.json({ message: 'Startup deleted successfully' });
    } catch (error) {
        console.error('Error deleting startup:', error);
        res.status(500).json({ message: 'Error deleting startup', error: error.message });
    }
});

// POST upvote startup
router.post('/:id/upvote', async (req, res) => {
    try {
        const startup = await Startup.findById(req.params.id);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        startup.upvotes += 1;
        await startup.save();
        
        res.json({ upvotes: startup.upvotes });
    } catch (error) {
        console.error('Error upvoting startup:', error);
        res.status(500).json({ message: 'Error upvoting startup', error: error.message });
    }
});

// Download document endpoint
router.get('/:id/download/:docType', async (req, res) => {
    try {
        const { id, docType } = req.params;
        const startup = await Startup.findById(id);
        
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
