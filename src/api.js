const config = require("../config/config");

const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function askTweetToGpt(tweetsText) {
  const askToGpt = await config.openai.chat.completions.create(
    {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: config.promptGptTweet + " " + tweetsText + " ",
        },
      ],
      temperature: config.openAiParams.temperature,
      max_tokens: config.openAiParams.max_tokens_tweet,
      top_p: config.openAiParams.top_p,
      frequency_penalty: config.openAiParams.frequency_penalty,
      presence_penalty: config.openAiParams.presence_penalty,
    },
    { timeout: config.openAiParams.timeout }
  );

  return askToGpt;
}

async function askArticleToGpt(tweetsText) {
  const askToGpt = await config.openai.chat.completions.create(
    {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: config.promptGptArticle + " " + tweetsText,
        },
      ],
      temperature: config.openAiParams.temperature,
      max_tokens: config.openAiParams.max_tokens_article,
      top_p: config.openAiParams.top_p,
      frequency_penalty: config.openAiParams.frequency_penalty,
      presence_penalty: config.openAiParams.presence_penalty,
    },
    { timeout: config.openAiParams.timeout }
  );

  return askToGpt;
}

async function askTweetIdToGpt(tweetsText, article_title) {
  const prompt = config.promptGptGetIdTweet.replace(
    "{article_title}",
    article_title
  );

  const askToGpt = await config.openai.chat.completions.create(
    {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt + " " + tweetsText,
        },
      ],
      temperature: config.openAiParams.temperature,
      max_tokens: config.openAiParams.max_tokens_tweet,
      top_p: config.openAiParams.top_p,
      frequency_penalty: config.openAiParams.frequency_penalty,
      presence_penalty: config.openAiParams.presence_penalty,
    },
    { timeout: config.openAiParams.timeout }
  );

  return askToGpt;
}

async function getTweetsFromAccountId(accountId) {
  const tweets = await config.twitterApi.v2.userTimeline(
    accountId,
    config.userTimelineTweetsParams
  );
  return tweets;
}

async function uploadMediaTwitter(media) {
  const mediaId = await config.twitterApi.v1.uploadMedia(media);

  return mediaId;
}

async function createTweet(tweetText, mediaId) {
  let tweetParams = {
    text: tweetText,
  };

  if (mediaId) {
    tweetParams.media = { media_ids: [mediaId] };
  }

  await config.rwTwitterApi.v2.tweet(tweetParams);
}

async function searchGoogleImage(search) {
  const response = await axios.get(
    "https://www.googleapis.com/customsearch/v1",
    {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CX,
        q: search,
        searchType: config.googleSearchParams.searchType,
        dateRestrict: config.googleSearchParams.dateRestrict,
        imgSize: config.googleSearchParams.imgSize,
        gl: config.googleSearchParams.gl,
        safe: config.googleSearchParams.safe,
      },
    }
  );
  if (response.data.items.length === 0) {
    return false;
  }

  return response.data.items;
}

async function saveImgUrl(imageUrl) {
  const responseImage = await axios.get(imageUrl, {
    responseType: "stream",
  });
  const imagePath = path.resolve(__dirname, "tmpImg.jpg");
  const writer = fs.createWriteStream(imagePath);
  responseImage.data.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
  return imagePath;
}

async function createGhostArticle(
  articleTitle,
  articleFeaturedImage,
  articleHtml
) {
  console.log("create ghost article...");
  mobiledoc = JSON.stringify({
    version: "0.3.1",
    markups: [],
    atoms: [],
    cards: [["html", { cardName: "html", html: articleHtml }]],
    sections: [[10, 0]],
  });
  const postData = {
    title: articleTitle,
    mobiledoc: mobiledoc,
    status: "published",
    feature_image: articleFeaturedImage,
  };

  config.ghostApi.posts
    .add(postData)
    .then((response) => {
      console.log("Post created !");
    })
    .catch((error) => {
      console.error("Error creating post:", error);
    });
}

module.exports = {
  askTweetToGpt,
  askArticleToGpt,
  askTweetIdToGpt,
  getTweetsFromAccountId,
  searchGoogleImage,
  saveImgUrl,
  uploadMediaTwitter,
  createTweet,
  createGhostArticle,
};
