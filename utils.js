const { createWorker, PSM } = require("tesseract.js");
const { searchGoogleImage, saveImgUrl } = require("./api");
const Jimp = require("jimp");

async function getImageWithoutText(response) {
  const urlsImg = [];

  for (let i = 0; i < response.length; i++) {
    const url = response[i].link;
    if (!isImage(url)) {
      continue;
    }

    try {
      // use jitp to get image buffer
      const image = await Jimp.read(url);

      // resize image if too big
      if (image.bitmap.width > 2000 || image.bitmap.height > 2000) {
        image.resize(2000, Jimp.AUTO);
      }

      // Convert image to buffer
      const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

      const worker = await createWorker("eng");
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_LINE,
      });

      // use tesseract to get text from image
      const {
        data: { text },
      } = await worker.recognize(buffer);

      if (text.trim().length < 10) {
        urlsImg.push(url);
      }

      await worker.terminate();
    } catch (error) {
      console.error(`Error with Tesseract at URL :  ${url}:`, error);
    }
  }

  // return random url
  return urlsImg.length > 0
    ? urlsImg[Math.floor(Math.random() * urlsImg.length)]
    : false;
}

async function getImage(search, url = false) {
  console.log("search images on google..");
  try {
    const response = await searchGoogleImage(search);
    if (!response) {
      console.log("no images found on google");
      return;
    }
    console.log("images found on google !");
    console.log("try to get one image without text from response...");
    const imageTweet = await getImageWithoutText(response);

    if (!imageTweet) {
      console.log("no image without text found but continue without image.");
      console.log(response);
      return;
    }
    console.log("image without text found : " + imageTweet);
    if (url) {
      return imageTweet;
    }
    // return img path (need for tweet)
    const imagePath = await saveImgUrl(imageTweet);
    return imagePath;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image:", error);
  }
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

module.exports = {
  getImageWithoutText,
  getImage,
};
