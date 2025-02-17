export default async function convertFile(file, format) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const convertedBlob = new Blob([file], { type: `image/${format}` });
        const url = URL.createObjectURL(convertedBlob);
        resolve(url);
      }, 2000);
    });
  }
  