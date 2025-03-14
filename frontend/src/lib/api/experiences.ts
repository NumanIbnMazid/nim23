import { prisma } from "@/lib/prisma";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";
import { COMPANY_DEFAULT_IMAGE_PATH } from "@/lib/constants";
import { getDuration, getDurationInDays } from '@/utils/date';

/**
 * Fetch work experiences from the database with optional limit support.
 */
export async function getAllExperiences(limit?: number) {
  try {
    const experiences = await prisma.professional_experience.findMany({
      orderBy: [
        { present: "desc" }, // ✅ Present = true comes first
        { start_date: "desc" }, // ✅ Then order by start_date (latest first)
      ],
      ...(limit ? { take: limit } : {}), // ✅ Apply limit if provided
    });

    await prisma.$disconnect(); // ✅ Close connection after fetching data

    return experiences.map((exp) => {
      const startDate = new Date(exp.start_date);
      const endDate = exp.end_date ? new Date(exp.end_date) : null;
      const isPresent = exp.present;

      // ✅ Calculate duration like Django’s `get_duration()`
      const duration = getDuration(startDate, endDate, isPresent);

      // ✅ Calculate duration in days like Django’s `get_duration_in_days()`
      const durationInDays = getDurationInDays(startDate, endDate, isPresent);

      return {
        ...exp,
        id: Number(exp.id),
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : null,
        created_at: exp.created_at.toISOString(),
        updated_at: exp.updated_at.toISOString(),
        company_image: exp.company_image ? getCloudinaryUrl(exp.company_image) : COMPANY_DEFAULT_IMAGE_PATH,
        duration,
        duration_in_days: durationInDays,
        currently_working: isPresent ? "Yes" : "No",
      };
    });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}
