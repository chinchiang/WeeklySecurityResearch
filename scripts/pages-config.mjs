export function pagesConfig(env = process.env) {
  const repository = env.GITHUB_REPOSITORY || "chinchiang/WeeklySecurityResearch";
  const [owner, repo] = repository.split("/");
  if (!owner || !repo) throw new Error("GITHUB_REPOSITORY must be owner/repository");
  const base = env.NEXT_PUBLIC_BASE_PATH ?? (repo.toLowerCase() === `${owner.toLowerCase()}.github.io` ? "" : `/${repo}`);
  const site = env.NEXT_PUBLIC_SITE_URL ?? `https://${owner}.github.io${base}`;
  return { base, site: site.replace(/\/$/, "") };
}
