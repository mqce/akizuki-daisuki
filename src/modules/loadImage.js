function loadImage(url) {
  return new Promise(resolve => {
    const img = new Image;
    
    img.onload = () => resolve(img);
    img.src = url;
  });
};

async function getImageSize(url){
  const img = await loadImage(url);
  return {
    width: img.naturalWidth,
    height: img.naturalHeight
  }
}

export {loadImage, getImageSize}