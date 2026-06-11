/**
 * Utility functions for generating and handling URL slugs for ideas
 */

/**
 * Generate a URL-friendly slug from an idea title and ID
 * @param title - The idea title
 * @param ideaId - The unique idea ID
 * @returns A URL-friendly slug
 */
export const generateIdeaSlug = (title: string, ideaId: string): string => {
  // Clean and normalize the title
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Limit length and append ID for uniqueness
  const maxLength = 50;
  const truncatedTitle = cleanTitle.length > maxLength 
    ? cleanTitle.substring(0, maxLength).replace(/-[^-]*$/, '') // Remove partial word at end
    : cleanTitle;

  return `${truncatedTitle}-${ideaId}`;
};

/**
 * Extract the idea ID from a slug
 * @param slug - The URL slug
 * @returns The idea ID or null if not found
 */
export const extractIdeaIdFromSlug = (slug: string): string | null => {
  if (!slug) return null;
  
  // Look for UUID pattern (8-4-4-4-12 format) or simple alphanumeric ID at the end
  const uuidPattern = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i;
  const uuidMatch = slug.match(uuidPattern);
  
  if (uuidMatch) {
    return uuidMatch[1];
  }
  
  // Fallback: The ID is the last part after the final hyphen (for simple IDs)
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Validate that the last part looks like an ID (alphanumeric)
  if (lastPart && /^[a-zA-Z0-9]+$/.test(lastPart)) {
    return lastPart;
  }
  
  return null;
};

/**
 * Check if a slug is valid (contains an extractable ID)
 * @param slug - The URL slug to validate
 * @returns True if the slug is valid
 */
export const isValidIdeaSlug = (slug: string): boolean => {
  return extractIdeaIdFromSlug(slug) !== null;
};

/**
 * Generate a slug for navigation purposes
 * @param idea - The idea object with title and ideaId
 * @returns A navigation-ready slug
 */
export const getIdeaNavigationSlug = (idea: { title: string; ideaId: string }): string => {
  return generateIdeaSlug(idea.title, idea.ideaId);
};
