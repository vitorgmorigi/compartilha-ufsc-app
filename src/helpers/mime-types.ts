export function getImageExtensionFile(imageUri: string): string {
    const uriSplitted = imageUri.split(".");

    return uriSplitted[uriSplitted.length-1];
}

export function getImageMimeType(extension: string) {
    switch(extension) {
        case "jpg":
            return "image/jpeg";
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/png"
        default:
            return "image/png"
    }
}