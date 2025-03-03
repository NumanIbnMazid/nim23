import { prisma } from '@/lib/prisma';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { INTEREST_DEFAULT_IMAGE_PATH } from '@/lib/constants';

/**
 * Fetch all interests, ensuring icons are correctly handled.
 */
export async function getAllInterests() {
  try {
    const interests = await prisma.interest.findMany({
      orderBy: { order: 'asc' },
    });

    return interests.map((interest) => ({
      ...interest,
      id: Number(interest.id),
      icon: interest.icon ? getCloudinaryUrl(interest.icon) : INTEREST_DEFAULT_IMAGE_PATH,
      created_at: interest.created_at.toISOString(),
      updated_at: interest.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching interests:', error);
    return [];
  }
}
