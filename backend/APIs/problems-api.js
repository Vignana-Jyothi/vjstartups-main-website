const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");
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
      { folder: "problems" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// -------------------- ROUTES --------------------

// POST create problem with image upload
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
    const maxProblem = await prisma.problem.findFirst({
      orderBy: { problemId: 'desc' },
      select: { problemId: true }
    });
    
    const nextId = maxProblem ? (parseInt(maxProblem.problemId) + 1) : 1;

    // Ensure tags is always an array
    const formattedTags = tags ? (Array.isArray(tags) ? tags : [tags]) : [];

    // Process and validate collaborators
    let formattedCollaborators = [];
    if (collaborators) {
      const collabArray = Array.isArray(collaborators) ? collaborators : [collaborators];
      formattedCollaborators = collabArray
        .filter(email => email && email.trim())
        .map(email => email.trim())
        .filter(email => email.endsWith('@vnrvjiet.in'));
    }

    // Create problem with collaborators in transaction
    const problem = await prisma.$transaction(async (tx) => {
      const newProblem = await tx.problem.create({
        data: {
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
          background,
          scalability,
          addedByName,
          addedByEmail,
          tags: formattedTags
        }
      });

      // Create collaborators if any
      if (formattedCollaborators.length > 0) {
        await tx.problemCollaborator.createMany({
          data: formattedCollaborators.map(email => ({
            problemId: newProblem.id,
            email
          }))
        });
      }

      return newProblem;
    });

    // Fetch with relations for response
    const problemWithRelations = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: {
        collaborators: true,
        upvotedBy: true,
        comments: {
          include: {
            replies: true,
            likedBy: true
          }
        }
      }
    });

    res.status(201).json(problemWithRelations);

  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ message: "Problem creation failed" });
  }
});

// GET all problems with pagination
router.get("/problems", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Get problems with pagination
    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          collaborators: true,
          upvotedBy: true,
          comments: {
            include: {
              replies: true
            }
          }
        }
      }),
      prisma.problem.count()
    ]);
    
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

// GET a single problem by problemId
router.get("/problems/:id", async (req, res) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { problemId: req.params.id },
      include: {
        collaborators: true,
        upvotedBy: true,
        comments: {
          include: {
            replies: {
              include: {
                likedBy: true
              }
            },
            likedBy: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

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

// POST toggle upvote a problem
router.post("/problem/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const problem = await prisma.problem.findUnique({
      where: { problemId: id },
      include: {
        upvotedBy: true
      }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user already upvoted
    const existingUpvote = await prisma.problemUpvote.findUnique({
      where: {
        problemId_userEmail: {
          problemId: problem.id,
          userEmail: email
        }
      }
    });

    if (existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.problemUpvote.delete({
          where: { id: existingUpvote.id }
        }),
        prisma.problem.update({
          where: { id: problem.id },
          data: { upvotes: { decrement: 1 } }
        })
      ]);
    } else {
      // Add upvote
      await prisma.$transaction([
        prisma.problemUpvote.create({
          data: {
            problemId: problem.id,
            userEmail: email
          }
        }),
        prisma.problem.update({
          where: { id: problem.id },
          data: { upvotes: { increment: 1 } }
        })
      ]);
    }

    // Fetch updated problem
    const updatedProblem = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: {
        upvotedBy: true,
        collaborators: true,
        comments: {
          include: {
            replies: true,
            likedBy: true
          }
        }
      }
    });

    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error("Error toggling upvote:", error);
    res.status(500).json({ message: "Failed to toggle upvote" });
  }
});

// POST add a comment to a problem
router.post("/problem/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, name, email } = req.body;

    if (!comment || !name || !email) {
      return res.status(400).json({ message: "Comment, name, and email are required" });
    }

    const problem = await prisma.problem.findUnique({
      where: { problemId: id }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Create comment
    await prisma.problemComment.create({
      data: {
        commentId: Date.now().toString(),
        problemId: problem.id,
        text: comment,
        name,
        email,
        likes: 0
      }
    });

    // Fetch updated problem with comments
    const updatedProblem = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: {
        upvotedBy: true,
        collaborators: true,
        comments: {
          include: {
            replies: {
              include: {
                likedBy: true
              }
            },
            likedBy: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error("Error commenting on problem:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// GET comments for a problem
router.get("/problem/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    
    const problem = await prisma.problem.findUnique({
      where: { problemId: id },
      include: {
        comments: {
          include: {
            replies: {
              include: {
                likedBy: true
              },
              orderBy: { createdAt: 'asc' }
            },
            likedBy: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ comments: problem.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// POST add a reply to a comment
router.post("/problem/:id/comment/:commentId/reply", async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { reply, name, email } = req.body;

    if (!reply || !name || !email) {
      return res.status(400).json({ message: "Reply, name, and email are required" });
    }

    // Find the comment
    const comment = await prisma.problemComment.findUnique({
      where: { commentId }
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Create reply
    await prisma.problemCommentReply.create({
      data: {
        replyId: Date.now().toString(),
        commentId: comment.id,
        text: reply,
        name,
        email,
        likes: 0
      }
    });

    // Fetch updated problem with all comments
    const problem = await prisma.problem.findUnique({
      where: { problemId: id },
      include: {
        comments: {
          include: {
            replies: {
              include: {
                likedBy: true
              },
              orderBy: { createdAt: 'asc' }
            },
            likedBy: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ comments: problem.comments });

  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ message: "Failed to add reply" });
  }
});

// POST toggle like on comment or reply
router.post("/problem/:id/comment/:commentId/like", async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { email, replyId } = req.body;

    const problem = await prisma.problem.findUnique({
      where: { problemId: id }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if replyId is a valid non-null value
    if (replyId && replyId !== 'null' && replyId !== null) {
      // Like/unlike a reply
      const reply = await prisma.problemCommentReply.findUnique({
        where: { replyId },
        include: { likedBy: true }
      });

      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }

      const existingLike = await prisma.problemReplyLike.findUnique({
        where: {
          replyId_userEmail: {
            replyId: reply.id,
            userEmail: email
          }
        }
      });

      if (existingLike) {
        // Unlike
        await prisma.$transaction([
          prisma.problemReplyLike.delete({
            where: { id: existingLike.id }
          }),
          prisma.problemCommentReply.update({
            where: { id: reply.id },
            data: { likes: { decrement: 1 } }
          })
        ]);
      } else {
        // Like
        await prisma.$transaction([
          prisma.problemReplyLike.create({
            data: {
              replyId: reply.id,
              userEmail: email
            }
          }),
          prisma.problemCommentReply.update({
            where: { id: reply.id },
            data: { likes: { increment: 1 } }
          })
        ]);
      }

    } else {
      // Like/unlike a comment
      const comment = await prisma.problemComment.findUnique({
        where: { commentId },
        include: { likedBy: true }
      });

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const existingLike = await prisma.problemCommentLike.findUnique({
        where: {
          commentId_userEmail: {
            commentId: comment.id,
            userEmail: email
          }
        }
      });

      if (existingLike) {
        // Unlike
        await prisma.$transaction([
          prisma.problemCommentLike.delete({
            where: { id: existingLike.id }
          }),
          prisma.problemComment.update({
            where: { id: comment.id },
            data: { likes: { decrement: 1 } }
          })
        ]);
      } else {
        // Like
        await prisma.$transaction([
          prisma.problemCommentLike.create({
            data: {
              commentId: comment.id,
              userEmail: email
            }
          }),
          prisma.problemComment.update({
            where: { id: comment.id },
            data: { likes: { increment: 1 } }
          })
        ]);
      }
    }

    // Fetch updated problem
    const updatedProblem = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: {
        upvotedBy: true,
        collaborators: true,
        comments: {
          include: {
            replies: {
              include: {
                likedBy: true
              },
              orderBy: { createdAt: 'asc' }
            },
            likedBy: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.status(200).json(updatedProblem);
  } catch (err) {
    console.error("Error liking comment/reply:", err);
    res.status(500).json({ message: "Failed to like comment/reply" });
  }
});

// DELETE a problem (only owner or collaborator can delete)
router.delete("/problems/:problemId", async (req, res) => {
  try {
    const { problemId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const problem = await prisma.problem.findUnique({
      where: { problemId: problemId },
      include: {
        collaborators: true
      }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user is owner or collaborator
    const isOwner = problem.addedByEmail === email;
    const isCollaborator = problem.collaborators.some(c => c.email === email);
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "You are not allowed to delete this problem" });
    }

    // Delete problem (cascade will handle related records)
    await prisma.problem.delete({
      where: { id: problem.id }
    });

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update a problem (only owner or collaborator can update)
router.put("/problems/:id/:email", upload.single("image"), async (req, res) => {
  try {
    const { id, email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const problem = await prisma.problem.findUnique({
      where: { problemId: id },
      include: {
        collaborators: true
      }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user is owner or collaborator
    const isOwner = problem.addedByEmail === email;
    const isCollaborator = problem.collaborators.some(c => c.email === email);
    
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
    let formattedCollaborators = null;
    if (req.body.collaborators !== undefined) {
      const collabArray = Array.isArray(req.body.collaborators) ? req.body.collaborators : [req.body.collaborators];
      formattedCollaborators = collabArray
        .filter(email => email && email.trim())
        .map(email => email.trim())
        .filter(email => email.endsWith('@vnrvjiet.in'));
    }

    // Update in transaction
    await prisma.$transaction(async (tx) => {
      // Update problem fields
      const updateData = {
        title: req.body.title || problem.title,
        briefparagraph: req.body.briefparagraph || problem.briefparagraph,
        description: req.body.description || problem.description,
        marketSize: req.body.marketSize || problem.marketSize,
        existingSolutions: req.body.existingSolutions || problem.existingSolutions,
        currentGaps: req.body.currentGaps || problem.currentGaps,
        targetCustomers: req.body.targetCustomers || problem.targetCustomers,
        background: req.body.background || problem.background,
        scalability: req.body.scalability || problem.scalability,
        tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : problem.tags,
        image: imageUrl
      };

      await tx.problem.update({
        where: { id: problem.id },
        data: updateData
      });

      // Update collaborators if provided
      if (formattedCollaborators !== null) {
        // Delete existing collaborators
        await tx.problemCollaborator.deleteMany({
          where: { problemId: problem.id }
        });

        // Create new collaborators
        if (formattedCollaborators.length > 0) {
          await tx.problemCollaborator.createMany({
            data: formattedCollaborators.map(email => ({
              problemId: problem.id,
              email
            }))
          });
        }
      }
    });

    // Fetch updated problem with relations
    const updatedProblem = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: {
        collaborators: true,
        upvotedBy: true,
        comments: {
          include: {
            replies: {
              include: {
                likedBy: true
              }
            },
            likedBy: true
          }
        }
      }
    });

    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: "Failed to update problem" });
  }
});

// -------------------- DUPLICATE DETECTION HELPERS --------------------

// Advanced text similarity using multiple algorithms
function calculateAdvancedSimilarity(text1, text2) {
  const normalize = (text) => text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const norm1 = normalize(text1);
  const norm2 = normalize(text2);
  
  const jaccardScore = calculateJaccardSimilarity(norm1, norm2);
  const cosineScore = calculateCosineSimilarity(norm1, norm2);
  const levenshteinScore = calculateLevenshteinSimilarity(norm1, norm2);
  
  const finalScore = Math.max(jaccardScore, cosineScore, levenshteinScore);
  
  return Math.round(finalScore * 100) / 100;
}

function calculateTitleDescriptionSimilarity(title1, brief1, title2, brief2) {
  const titleSimilarity = calculateAdvancedSimilarity(title1, title2);
  const descSimilarity = calculateAdvancedSimilarity(brief1, brief2);
  return Math.max(titleSimilarity, descSimilarity);
}

function calculateJaccardSimilarity(text1, text2) {
  const getWords = (text) => {
    return new Set(
      text.split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['that', 'this', 'with', 'from', 'they', 'have', 'been', 'were'].includes(word))
    );
  };
  
  const words1 = getWords(text1);
  const words2 = getWords(text2);
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

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

function calculateLevenshteinSimilarity(text1, text2) {
  const matrix = [];
  const len1 = text1.length;
  const len2 = text2.length;
  
  if (len1 === 0 || len2 === 0) return 0;
  
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (text2.charAt(i - 1) === text1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const distance = matrix[len2][len1];
  const maxLength = Math.max(len1, len2);
  
  return (maxLength - distance) / maxLength;
}

// -------------------- DUPLICATE DETECTION API --------------------

// POST check for duplicate problems
router.post("/check-duplicates", async (req, res) => {
  try {
    const { title, briefparagraph } = req.body;
    
    if (!title || !briefparagraph) {
      return res.status(400).json({ message: "Title and brief paragraph are required" });
    }
    
    console.log(`🔍 Checking duplicates for: "${title.substring(0, 50)}..."`);
    const startTime = Date.now();
    
    // Get all problems (only fields needed for comparison)
    const allProblems = await prisma.problem.findMany({
      select: {
        problemId: true,
        title: true,
        briefparagraph: true,
        addedByName: true,
        createdAt: true,
        upvotes: true
      }
    });
    
    console.log(`📊 Comparing against ${allProblems.length} existing problems...`);
    
    // Calculate similarities
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
          : problem.briefparagraph,
        addedByName: problem.addedByName,
        createdAt: problem.createdAt,
        upvotes: problem.upvotes,
        similarity: Math.round(similarity * 100)
      };
    })
    .filter(item => item.similarity >= 60)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
    
    const endTime = Date.now();
    console.log(`⚡ Duplicate check completed in ${endTime - startTime}ms`);
    console.log(`🎯 Found ${similarities.length} potential duplicates (60%+ similarity)`);
    
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
