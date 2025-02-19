import { prisma } from '@/lib/prisma';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { SKILL_DEFAULT_IMAGE_PATH } from '@/lib/constants';

/**
 * Fetch all skills.
 */
export async function getAllSkills() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });

    return skills.map((skill) => ({
      ...skill,
      id: Number(skill.id),
      image: skill.image ? getCloudinaryUrl(skill.image) : SKILL_DEFAULT_IMAGE_PATH,
      level: skill.level ?? null,
      created_at: skill.created_at.toISOString(),
      updated_at: skill.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}
