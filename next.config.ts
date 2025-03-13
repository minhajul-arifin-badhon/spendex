import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn-icons-png.flaticon.com",
				pathname: "/**", // Matches all images from this domain
			},
		],
	},
};

export default nextConfig;
