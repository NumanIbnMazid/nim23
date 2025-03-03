import { fetchGithub, getOldStats, getGithubStarsAndForks } from '@/lib/github'

/**
 * Fetch GitHub statistics.
 */
export async function getGithubStats() {
  try {
    const { public_repos: repos, public_gists: gists, followers } = await fetchGithub()
    const { githubStars, forks } = await getGithubStarsAndForks()

    // If API is exhausted, return old cached stats
    if (repos === undefined && gists === undefined) {
      const { public_repos, public_gists, followers } = getOldStats()
      return {
        repos: public_repos,
        gists: public_gists,
        followers,
        githubStars,
        forks,
      }
    }

    return { repos, gists, followers, githubStars, forks }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return { repos: 0, gists: 0, followers: 0, githubStars: 0, forks: 0 }
  }
}
