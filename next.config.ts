import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Firebase
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      // Imgur
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      // Cloudinary
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Google Drive (formato direto /uc?export=view&id=...)
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // GitHub raw
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      // Wikimedia / Wikipedia
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // Sites usados anteriormente
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      // Curinga para qualquer outro domínio (fallback)
    ],
    // Permite qualquer domínio como fallback para não bloquear links externos
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
};

export default nextConfig;
