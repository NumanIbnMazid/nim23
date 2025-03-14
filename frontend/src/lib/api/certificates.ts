import { prisma } from "@/lib/prisma";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";
import { CERTIFICATE_DEFAULT_IMAGE_PATH } from "@/lib/constants";

/**
 * ✅ Format date
 */
function formatDate(date: Date | null): string {
  if (!date) return "Not Specified";
  return new Date(date).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }); // e.g., "20 March, 2023"
}

/**
 * ✅ Format expiration date like Django’s `get_expiration_date()`
 */
function getExpirationDate(expirationDate: Date | null, doesNotExpire: boolean): string {
  if (doesNotExpire) {
    return "Does not expire";
  }
  return formatDate(expirationDate);
}

/**
 * ✅ Fetch all certificates, ensuring Prisma data matches Django’s serializer.
 */
export async function getAllCertificates() {
  try {
    const certificates = await prisma.certification.findMany({
      orderBy: { issue_date: "desc" },
      include: { certification_media: true }, // ✅ Ensure media is included
    });

    await prisma.$disconnect(); // ✅ Close connection after fetching data

    return certificates.map((cert) => ({
      id: String(cert.id),
      title: cert.title,
      slug: cert.slug,
      organization: cert.organization,
      address: cert.address ?? undefined, // ✅ Convert null to undefined
      image: cert.image ? getCloudinaryUrl(cert.image) : CERTIFICATE_DEFAULT_IMAGE_PATH, // ✅ Fetch from Cloudinary or default
      issue_date: formatDate(cert.issue_date), // ✅ Format issue date
      expiration_date: getExpirationDate(cert.expiration_date, cert.does_not_expire), // ✅ Format expiration date
      credential_id: cert.credential_id ?? undefined, // ✅ Convert null to undefined
      credential_url: cert.credential_url ?? undefined, // ✅ Convert null to undefined
      description: cert.description ?? undefined, // ✅ Convert null to undefined
      created_at: cert.created_at.toISOString(),
      updated_at: cert.updated_at.toISOString(),
      certification_media: cert.certification_media.map((media) => ({
        id: Number(media.id),
        title: media.title,
        slug: media.slug,
        description: media.description ?? "",
        file: media.file ? getCloudinaryUrl(media.file) : "",
        created_at: new Date(media.created_at).toISOString(),
        updated_at: new Date(media.updated_at).toISOString(),
      })),
    }));
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}
