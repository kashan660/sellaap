
export const appConfig = {
  images: {
    // If true, the system will check for a local image file in the public directory before using the remote URL.
    preferLocal: true,
    // The directory in the public folder where product images are stored.
    // e.g., "/images/products" means "public/images/products"
    localPath: "/images/products",
    // Supported extensions to check for.
    extensions: ["jpg", "jpeg", "png", "webp", "svg"],
  },
};
