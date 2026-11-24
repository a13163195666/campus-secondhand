export const acceptedImageTypes = 'image/jpeg,image/png,image/webp'

export function isSupportedImage(file) {
  return acceptedImageTypes.split(',').includes(file.type)
}

export function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
