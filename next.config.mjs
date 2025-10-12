const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.NEXT_PUBLIC_REPOSITORY_NAME || '';
const basePath = isGitHubPages && repositoryName ? `/${repositoryName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: basePath || undefined,
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
