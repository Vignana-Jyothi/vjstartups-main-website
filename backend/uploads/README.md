# Uploads Directory

This directory contains user-uploaded files including:
- Cover images and logos for startups
- Pitch decks and one-pager documents
- Other user-generated content

## Security Notes

⚠️ **Important**: This directory is excluded from git for security reasons:
- Contains sensitive business documents
- May include personal information
- Should not be committed to version control

## Directory Structure

```
uploads/
├── images/          # Cover images, logos, etc.
├── documents/       # Pitch decks, one-pagers, etc.
└── .gitkeep        # Maintains directory structure
```

## File Access

Files are served via Express static middleware:
- Images accessible at: `http://localhost:6220/uploads/images/filename`
- Documents downloadable via: `http://localhost:6220/startup-api/:id/download/:docType`

## Backup Considerations

Ensure this directory is included in your backup strategy but excluded from public repositories.