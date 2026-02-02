// Placeholder image constant
export const PLACEHOLDER_IMAGE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><rect width="400" height="400" fill="#f3f4f6"/><text x="200" y="190" font-size="16" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif">No Image Available</text></svg>`;

// Convert SVG string to data URI
export const getSvgDataUri = (svgString) => {
  const svg = svgString.trim();
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
};

// Get first available image or placeholder
export const getProductImage = (product) => {
  if (!product) return getSvgDataUri(PLACEHOLDER_IMAGE);
  
  // Try to use first available image (imageUrl1 is primary)
  if (product.imageUrl1) return product.imageUrl1;
  if (product.imageUrl2) return product.imageUrl2;
  if (product.imageUrl3) return product.imageUrl3;
  
  // Fallback to placeholder
  return getSvgDataUri(PLACEHOLDER_IMAGE);
};

// Get all available product images
export const getProductImages = (product) => {
  const images = [];
  if (product.imageUrl1) images.push(product.imageUrl1);
  if (product.imageUrl2) images.push(product.imageUrl2);
  if (product.imageUrl3) images.push(product.imageUrl3);
  
  if (images.length === 0) {
    images.push(getSvgDataUri(PLACEHOLDER_IMAGE));
  }
  
  return images;
};
