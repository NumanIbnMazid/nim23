import { NextResponse } from "next/server";
import { fetchGithub, getOldStats, getGithubStarsAndForks } from "@/lib/github";

export async function GET() {
  try {
    const { public_repos: repos, public_gists: gists, followers } = await fetchGithub();
    const { githubStars, forks } = await getGithubStarsAndForks();

    // ✅ If API limit is exceeded, return cached stats
    if (repos === undefined && gists === undefined) {
      const { public_repos, public_gists, followers } = getOldStats();
      return NextResponse.json({
        repos: public_repos,
        gists: public_gists,
        followers,
        githubStars,
        forks,
      }, { status: 200 });
    }

    return NextResponse.json({ repos, gists, followers, githubStars, forks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return NextResponse.json({
      repos: 0,
      gists: 0,
      followers: 0,
      githubStars: 0,
      forks: 0,
    }, { status: 500 });
  }
}
