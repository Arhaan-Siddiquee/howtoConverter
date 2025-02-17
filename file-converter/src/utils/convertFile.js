export default async function convertFile(file, format) {
  return new Promise((resolve, reject) => {
    // Check if file is a valid image
    if (!file || !file.type.startsWith('image/')) {
      reject('The provided file is not an image');
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject('Error reading the file');
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        },
        `image/${format}`
      );
    };

    reader.readAsDataURL(file);
  });
}
