/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'loremflickr.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '**',
            }
        ],
    },
};

export default nextConfig;
