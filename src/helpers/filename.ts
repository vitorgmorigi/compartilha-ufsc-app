export function getFilename(imageUri: string) {
    const uriSplitted = imageUri.split("/");

    return uriSplitted[uriSplitted.length-1];
}