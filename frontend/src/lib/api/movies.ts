import { prisma } from "@/lib/prisma";
import { MOVIE_DEFAULT_IMAGE_PATH } from "@/lib/constants";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";

/**
 * Fetch all movies from the database.
 */
export async function getAllMovies() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { updated_at: "desc" },
    });

    await prisma.$disconnect(); // ✅ Close connection after fetching data
    
    return movies.map((movie) => ({
      ...movie,
      id: Number(movie.id),
      image: movie.image ? getCloudinaryUrl(movie.image) : MOVIE_DEFAULT_IMAGE_PATH,
      url: movie.url ?? undefined,
      year: movie.year ?? undefined,
      rating: movie.rating ?? undefined,
      created_at: movie.created_at.toISOString(),
      updated_at: movie.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}