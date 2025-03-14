import { prisma } from "@/lib/prisma";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";
import { USER_DEFAULT_IMAGE_PATH } from "@/lib/constants";
import staticData from "@/content/StaticData";

/**
 * Fetch user profile info, ensuring Cloudinary images and valid types.
 */
export async function getProfileInfo() {
  const profile = await prisma.users_user.findFirst({
    where: { is_portfolio_user: true },
    select: {
      id: true,
      name: true,
      username: true,
      slug: true,
      email: true,
      image: true,
      nickname: true,
      gender: true,
      dob: true,
      website: true,
      contact: true,
      contact_email: true,
      linkedin: true,
      github: true,
      resume_link: true,
      address: true,
      about: true,
      date_joined: true,
      last_login: true,
      updated_at: true,
    },
  });

  await prisma.$disconnect(); // ✅ Close connection after fetching data

  return {
    id: profile ? Number(profile.id) : 0, // ✅ Convert `bigint` to `number`
    image: profile?.image ? getCloudinaryUrl(profile.image) : USER_DEFAULT_IMAGE_PATH, // ✅ Use Cloudinary if available
    dob: profile?.dob ? profile.dob.toISOString() : "", // ✅ Convert Date to string
    date_joined: profile?.date_joined ? profile.date_joined.toISOString() : new Date().toISOString(),
    last_login: profile?.last_login ? profile.last_login.toISOString() : "",
    updated_at: profile?.updated_at ? profile.updated_at.toISOString() : new Date().toISOString(),
    name: profile?.name ?? staticData.personal.name,
    email: profile?.email ?? "",
    username: profile?.username ?? "",
    slug: profile?.slug ?? "",
    nickname: profile?.nickname ?? staticData.personal.nickname,
    gender: profile?.gender ?? "",
    website: profile?.website ?? "",
    contact: profile?.contact ?? "",
    contact_email: profile?.contact_email ?? "",
    linkedin: profile?.linkedin ?? "",
    github: profile?.github ?? "",
    resume_link: profile?.resume_link ?? "",
    address: profile?.address ?? "",
    about: profile?.about ?? staticData.personal.about,
  };
}
