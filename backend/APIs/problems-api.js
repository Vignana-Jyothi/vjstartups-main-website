const express = require("express");
const router = express.Router();
const Problem = require("../models/Problems");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// -------------------- MULTER (memory storage) --------------------
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// -------------------- Cloudinary Config --------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: promisify cloudinary upload_stream
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "problems" }, // Folder in Cloudinary
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// -------------------- ROUTES --------------------
router.post("/problem", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      briefparagraph,
      description,
      marketSize,
      existingSolutions,
      currentGaps,
      targetCustomers,
      background,
      scalability,
      addedByName,
      addedByEmail,
      collaborators,
      tags,
    } = req.body;

    let imageUrl = null;

    // If image uploaded → send to Cloudinary
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Generate unique problemId by finding the maximum existing ID
    // Use aggregation to properly sort problemId as numbers
    const maxProblemResult = await Problem.aggregate([
      {
        $addFields: {
          problemIdNum: { $toInt: "$problemId" }
        }
      },
      {
        $sort: { problemIdNum: -1 }
      },
      {
        $limit: 1
      }
    ]);
    
    const maxProblem = maxProblemResult.length > 0 ? maxProblemResult[0] : null;
    const nextId = maxProblem ? (parseInt(maxProblem.problemId) + 1) : 1;

    // Ensure tags is always an array
    const formattedTags = tags ? (Array.isArray(tags) ? tags : [tags]) : [];

    // Process and validate collaborators
    let formattedCollaborators = [];
    if (collaborators) {
      const collabArray = Array.isArray(collaborators) ? collaborators : [collaborators];
      // Filter out empty strings and validate @vnrvjiet.in suffix
      formattedCollaborators = collabArray
        .filter(email => email && email.trim())
        .map(email => email.trim())
        .filter(email => email.endsWith('@vnrvjiet.in'));
    }

    // Create problemx
    const problem = new Problem({
      problemId: nextId.toString(),
      title,
      briefparagraph,
      description,
      marketSize,
      existingSolutions,
      currentGaps,
      targetCustomers,
      image: imageUrl,
      upvotes: 0,
      comments: [],
      background,
      scalability,
      addedByName,
      addedByEmail,
      collaborators: formattedCollaborators,
      tags: formattedTags,
      createdAt: new Date(),
    });

    await problem.save();
    res.status(201).json(problem);

  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ message: "Problem creation failed" });
  }
});

// ✅ Get all problems with pagination
router.get("/problems", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Get problems with pagination
    const problems = await Problem.find()
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);
    
    // If no problems in database, return mock data
    if (problems.length === 0) {
      const mockProblems = require('../data/mockProblems');
      return res.status(200).json({
        problems: mockProblems,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: mockProblems.length,
          itemsPerPage: mockProblems.length,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }
    
    // Get total count for pagination info
    const total = await Problem.countDocuments();
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      problems,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Failed to fetch problems" });
  }
});

// ✅ Get a single problem by problemId
router.get("/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.id });

    if (!problem) {
      // Check mock data if not found in database
      const mockProblems = require('../data/mockProblems');
      const mockProblem = mockProblems.find(p => p.problemId === req.params.id);
      
      if (mockProblem) {
        return res.status(200).json(mockProblem);
      }
      
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ message: "Failed to fetch problem" });
  }
});

// ✅ Delete a single problem by problemId
// router.delete("/problems/:id", async (req, res) => {
//   try {
//     const deletedProblem = await Problem.findOneAndDelete({ problemId: req.params.id });

//     if (!deletedProblem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     res.status(200).json({ message: "Problem deleted successfully", problem: deletedProblem });
//   } catch (error) {
//     console.error("Error deleting problem:", error);
//     res.status(500).json({ message: "Failed to delete problem" });
//   }
// });


// ✅ Toggle Upvote a problem
router.post("/problem/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body; // user email coming from frontend

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const problem = await Problem.findOne({ problemId: id });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user already upvoted
    const alreadyUpvoted = problem.upvotedBy.includes(email);

    if (alreadyUpvoted) {
      // Remove upvote
      problem.upvotedBy = problem.upvotedBy.filter((user) => user !== email);
      problem.upvotes -= 1;
    } else {
      // Add upvote
      problem.upvotedBy.push(email);
      problem.upvotes += 1;
    }

    await problem.save();

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error toggling upvote:", error);
    res.status(500).json({ message: "Failed to toggle upvote" });
  }
});


// ✅ Add a comment to a problem
router.post("/problem/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, name, email } = req.body;

    if (!comment || !name || !email) {
      return res.status(400).json({ message: "Comment, name, and email are required" });
    }

    const newComment = {
      commentId: Date.now().toString(), // generate unique ID using current timestamp
      text: comment,
      name,
      email,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    const problem = await Problem.findOneAndUpdate(
      { problemId: id },
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error commenting on problem:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});


// GET /problem-api/problem/:id/comments
router.get("/problem/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findOne({ problemId: id });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json({ comments: problem.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// POST /problem-api/problem/:id/comment/:commentId/reply
router.post("/problem/:id/comment/:commentId/reply", async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { reply, name, email } = req.body;

    if (!reply || !name || !email) {
      return res.status(400).json({ message: "Reply, name, and email are required" });
    }

    const newReply = {
      replyId: Date.now().toString(),
      text: reply,
      name,
      email,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
    };

    const problem = await Problem.findOneAndUpdate(
      { problemId: id, "comments.commentId": commentId },
      { $push: { "comments.$.replies": newReply } },
      { new: true }
    );

    if (!problem) return res.status(404).json({ message: "Problem or comment not found" });

// Return all comments of the problem
res.status(200).json({ comments: problem.comments });


  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ message: "Failed to add reply" });
  }
});



// POST /problem-api/problem/:id/comment/:commentId/like
router.post("/problem/:id/comment/:commentId/like", async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { email, replyId } = req.body; // if replyId exists, like a reply

    const problem = await Problem.findOne({ problemId: id });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Check if replyId is a valid non-null value
    if (replyId && replyId !== 'null' && replyId !== null) {
      // Like/unlike a reply
      const comment = problem.comments.find(c => c.commentId === commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });

      const reply = comment.replies.find(r => r.replyId === replyId);
      if (!reply) return res.status(404).json({ message: "Reply not found" });

      reply.likedBy = reply.likedBy || [];

      if (reply.likedBy.includes(email)) {
        // Unlike
        reply.likedBy = reply.likedBy.filter(e => e !== email);
      } else {
        // Like
        reply.likedBy.push(email);
      }

      // Update likes count based on length of likedBy array
      reply.likes = reply.likedBy.length;
      
      // Mark the comments array as modified so MongoDB knows to save it
      problem.markModified('comments');

    } else {
      // Like/unlike a comment
      const comment = problem.comments.find(c => c.commentId === commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });

      comment.likedBy = comment.likedBy || [];

      if (comment.likedBy.includes(email)) {
        // Unlike
        comment.likedBy = comment.likedBy.filter(e => e !== email);
      } else {
        // Like
        comment.likedBy.push(email);
      }

      // Update likes count based on length of likedBy array
      comment.likes = comment.likedBy.length;
      
      // Mark the comments array as modified so MongoDB knows to save it
      problem.markModified('comments');
    }

    await problem.save();
    res.status(200).json(problem);
  } catch (err) {
    console.error("Error liking comment/reply:", err);
    res.status(500).json({ message: "Failed to like comment/reply" });
  }
});

// ✅ Delete a single problem by problemId (only owner can delete)
// ✅ Delete a single problem by problemId (only owner can delete)
router.delete("/problems/:problemId", async (req, res) => {
  try {
    const { problemId } = req.params;
    const { email } = req.body; // email from request body

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the problem (problemId is stored as string in DB)
    const problem = await Problem.findOne({ problemId: problemId });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user is owner or collaborator
    const isOwner = problem.addedByEmail === email;
    const isCollaborator = problem.collaborators && problem.collaborators.includes(email);
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "You are not allowed to delete this problem" });
    }

    // Delete problem
    await Problem.deleteOne({ problemId: problemId });

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// ✅ Update a problem by problemId (only owner can update)
router.put("/problems/:id/:email", upload.single("image"), async (req, res) => {
  try {
    const { id, email } = req.params; // email comes from route now

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const problem = await Problem.findOne({ problemId: id });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user is owner or collaborator
    const isOwner = problem.addedByEmail === email;
    const isCollaborator = problem.collaborators && problem.collaborators.includes(email);
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "You are not allowed to edit this problem" });
    }

    // Handle image upload if provided
    let imageUrl = problem.image;
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Process and validate collaborators if provided
    let formattedCollaborators = problem.collaborators;
    if (req.body.collaborators !== undefined) {
      const collabArray = Array.isArray(req.body.collaborators) ? req.body.collaborators : [req.body.collaborators];
      formattedCollaborators = collabArray
        .filter(email => email && email.trim())
        .map(email => email.trim())
        .filter(email => email.endsWith('@vnrvjiet.in'));
    }

    // Update fields
    const updatedData = {
      title: req.body.title || problem.title,
      briefparagraph: req.body.briefparagraph || problem.briefparagraph,
      description: req.body.description || problem.description,
      marketSize: req.body.marketSize || problem.marketSize,
      existingSolutions: req.body.existingSolutions || problem.existingSolutions,
      currentGaps: req.body.currentGaps || problem.currentGaps,
      targetCustomers: req.body.targetCustomers || problem.targetCustomers,
      background: req.body.background || problem.background,
      scalability: req.body.scalability || problem.scalability,
      collaborators: formattedCollaborators,
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : problem.tags,
      image: imageUrl
    };

    const updatedProblem = await Problem.findOneAndUpdate(
      { problemId: id },
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: "Failed to update problem" });
  }
});

// -------------------- DUPLICATE DETECTION HELPERS --------------------

// Advanced text similarity using multiple algorithms
function calculateAdvancedSimilarity(text1, text2) {
  // Normalize texts
  const normalize = (text) => text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const norm1 = normalize(text1);
  const norm2 = normalize(text2);
  
  // Algorithm 1: Jaccard Similarity (word overlap)
  const jaccardScore = calculateJaccardSimilarity(norm1, norm2);
  
  // Algorithm 2: Cosine Similarity (TF-IDF like)
  const cosineScore = calculateCosineSimilarity(norm1, norm2);
  
  // Algorithm 3: Levenshtein Distance (character level)
  const levenshteinScore = calculateLevenshteinSimilarity(norm1, norm2);
  
  // Use MAX instead of weighted average for better duplicate detection
  const finalScore = Math.max(jaccardScore, cosineScore, levenshteinScore);
  
  return Math.round(finalScore * 100) / 100;
}

// Calculate separate scores for title and description, then take MAX
function calculateTitleDescriptionSimilarity(title1, brief1, title2, brief2) {
  // Calculate title similarity
  const titleSimilarity = calculateAdvancedSimilarity(title1, title2);
  
  // Calculate description similarity
  const descSimilarity = calculateAdvancedSimilarity(brief1, brief2);
  
  // Return the MAXIMUM of the two scores
  return Math.max(titleSimilarity, descSimilarity);
}

// Jaccard Similarity: Good for keyword overlap
function calculateJaccardSimilarity(text1, text2) {
  const getWords = (text) => {
    return new Set(
      text.split(/\s+/)
        .filter(word => word.length > 3) // Filter short words
        .filter(word => !['that', 'this', 'with', 'from', 'they', 'have', 'been', 'were'].includes(word)) // Common stopwords
    );
  };
  
  const words1 = getWords(text1);
  const words2 = getWords(text2);
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Cosine Similarity: Good for semantic similarity
function calculateCosineSimilarity(text1, text2) {
  const getWordFreq = (text) => {
    const words = text.split(/\s+/).filter(word => word.length > 2);
    const freq = {};
    words.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });
    return freq;
  };
  
  const freq1 = getWordFreq(text1);
  const freq2 = getWordFreq(text2);
  
  const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  allWords.forEach(word => {
    const f1 = freq1[word] || 0;
    const f2 = freq2[word] || 0;
    
    dotProduct += f1 * f2;
    norm1 += f1 * f1;
    norm2 += f2 * f2;
  });
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Levenshtein Distance: Good for typos and variations
function calculateLevenshteinSimilarity(text1, text2) {
  const matrix = [];
  const len1 = text1.length;
  const len2 = text2.length;
  
  // If one string is empty, return 0
  if (len1 === 0 || len2 === 0) return 0;
  
  // Create matrix
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (text2.charAt(i - 1) === text1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  const distance = matrix[len2][len1];
  const maxLength = Math.max(len1, len2);
  
  return (maxLength - distance) / maxLength;
}

// -------------------- DUPLICATE DETECTION API --------------------

// ✅ Check for duplicate problems
router.post("/check-duplicates", async (req, res) => {
  try {
    const { title, briefparagraph } = req.body;
    
    if (!title || !briefparagraph) {
      return res.status(400).json({ message: "Title and brief paragraph are required" });
    }
    
    console.log(`🔍 Checking duplicates for: "${title.substring(0, 50)}..."`);
    const startTime = Date.now();
    
    // Get all problems (only fields needed for comparison)
    const allProblems = await Problem.find({}, {
      problemId: 1,
      title: 1,
      briefparagraph: 1,
      addedByName: 1,
      createdAt: 1,
      upvotes: 1
    });
    
    console.log(`📊 Comparing against ${allProblems.length} existing problems...`);
    
    // Calculate similarities using separate title and description comparison
    const similarities = allProblems.map(problem => {
      const similarity = calculateTitleDescriptionSimilarity(
        title, briefparagraph,
        problem.title, problem.briefparagraph
      );
      
      return {
        problemId: problem.problemId,
        title: problem.title,
        briefparagraph: problem.briefparagraph.length > 150 
          ? problem.briefparagraph.substring(0, 150) + '...' 
          : problem.briefparagraph, // Don't add ... if it's already short
        addedByName: problem.addedByName,
        createdAt: problem.createdAt,
        upvotes: problem.upvotes,
        similarity: Math.round(similarity * 100) // Convert to percentage
      };
    })
    .filter(item => item.similarity >= 60) // Only show 60%+ matches
    .sort((a, b) => b.similarity - a.similarity) // Sort by highest similarity
    .slice(0, 3); // Top 3 matches
    
    const endTime = Date.now();
    console.log(`⚡ Duplicate check completed in ${endTime - startTime}ms`);
    console.log(`🎯 Found ${similarities.length} potential duplicates (60%+ similarity)`);
    
    // Debug: Log the similarity scores
    if (similarities.length > 0) {
      console.log(`📋 Duplicate details:`);
      similarities.forEach((item, index) => {
        console.log(`  ${index + 1}. "${item.title}" - ${item.similarity}% match`);
      });
    }
    
    res.status(200).json({
      duplicates: similarities,
      stats: {
        totalProblems: allProblems.length,
        processingTime: endTime - startTime,
        threshold: 60
      }
    });
    
  } catch (error) {
    console.error("❌ Error checking duplicates:", error);
    res.status(500).json({ message: "Failed to check duplicates" });
  }
});


module.exports = router;
