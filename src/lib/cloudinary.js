export async function search(options = {}) {
  const params = {
    ...options
  }

  const paramString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');

  const results = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/search?${paramString}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY + ':' + process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET).toString('base64')}`
    }
  }).then(r => r.json());

  return results;
}

export function mapImageResources(resources) {
  return resources.map(resource => {
    const { width, height } = resource;
    return {
      id: resource.asset_id,
      image: resource.secure_url,
      width,
      height
    }
  });
}