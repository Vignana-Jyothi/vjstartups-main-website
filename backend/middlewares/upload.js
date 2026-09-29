const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Startup files (cover image, logo, pitch deck, one-pager) go to Cloudinary. They used to be
// written to the container's uploads/ folder, which every deploy rebuilds from scratch, so each
// deploy deleted them. Files are held in memory only long enough to be sent on.
const IMAGE_FIELDS = ['coverImage', 'logo'];
const DOC_FIELDS = ['pitchDeck', 'onePager'];
const DOC_TYPES = new Set([
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (IMAGE_FIELDS.includes(file.fieldname)) {
      return file.mimetype.startsWith('image/')
        ? cb(null, true)
        : cb(new Error('Only image files are allowed for cover image and logo'));
    }
    if (DOC_FIELDS.includes(file.fieldname)) {
      return DOC_TYPES.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Only PDF, PPT, or DOC files are allowed for documents'));
    }
    return cb(new Error('Unexpected field'));
  },
});

function sendToCloudinary(file, folder) {
  return new Promise((resolve, reject) => {
    const isDoc = DOC_FIELDS.includes(file.fieldname);
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        // Documents are stored as-is ("raw"), keeping their name and extension for download.
        resource_type: isDoc ? 'raw' : 'image',
        use_filename: true,
        unique_filename: true,
        filename_override: file.originalname,
      },
      (error, result) => (error ? reject(error) : resolve(result.secure_url))
    );
    stream.end(file.buffer);
  });
}

/** Uploads the first file of each multer field; returns { fieldName: url }. */
async function storeUploads(files = {}, folder = 'startups') {
  const stored = {};
  for (const [field, list] of Object.entries(files)) {
    if (list && list[0]) stored[field] = await sendToCloudinary(list[0], folder);
  }
  return stored;
}

module.exports = upload;
module.exports.storeUploads = storeUploads;
