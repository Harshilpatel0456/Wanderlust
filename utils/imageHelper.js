const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60";

function resolveImageValue(listing) {
    let imageValue;
    if (listing?.url) {
        imageValue = listing.url;
    } else if (typeof listing?.image === "string" && listing.image) {
        imageValue = listing.image;
    } else if (listing?.image?.url) {
        imageValue = listing.image.url;
    }
    if (!imageValue) return PLACEHOLDER_IMAGE;
    try {
        const parsed = new URL(imageValue);
        const { hostname, pathname } = parsed;
        if (/\bunsplash\.com$/i.test(hostname) && pathname.startsWith("/photos/")) {
            const photoId = pathname.split("/").pop();
            if (photoId) {
                return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=80`;
            }
        }
        if (/\bimages\.unsplash\.com$/i.test(hostname)) {
            return imageValue;
        }
        if (/\.(jpe?g|png|gif|webp|svg)$/i.test(pathname)) {
            return imageValue;
        }
        if (parsed.searchParams.has('auto') || parsed.searchParams.has('fm') || parsed.searchParams.has('w')) {
            return imageValue;
        }
    } catch (err) {
        // ignore invalid URLs and fall back to placeholder
    }
    return PLACEHOLDER_IMAGE;
}

module.exports = {
    PLACEHOLDER_IMAGE,
    resolveImageValue
};
