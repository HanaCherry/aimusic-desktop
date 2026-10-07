'use strict';
const { nativeImage } = require('electron');
function localProfile(value = {}) {
  const nickname = typeof value.nickname === 'string' ? value.nickname.trim().slice(0,40) : '';
  let photo = null;
  if (typeof value.photo === 'string' && value.photo.length <= 2000000 && /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value.photo)) {
    const image = nativeImage.createFromDataURL(value.photo);
    const size = image.getSize();
    if (!image.isEmpty() && size.width > 0 && size.height > 0 && size.width <= 2048 && size.height <= 2048) photo = image.resize({width:256,height:256}).toDataURL();
  }
  return { nickname, photo };
}
module.exports = { localProfile };
