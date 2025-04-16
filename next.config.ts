import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn-icons-png.flaticon.com",
				pathname: "/**" // Matches all images from this domain
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**" // Matches all images from this domain
			},
			{
				protocol: "https",
				hostname: "i.ibb.co",
				pathname: "/**" // Matches all images from this domain
			}
		]
	},
	eslint: {
		ignoreDuringBuilds: true
	}
};

export default nextConfig;
