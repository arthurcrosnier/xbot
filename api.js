const {
  ghostApi,
  twitterApi,
  rwTwitterApi,
  openai,
  promptGpt,
  promptGptArticle,
  openAiParams,
  userTimelineTweetsParams,
  googleSearchParams,
} = require("./config");

const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function askTweetToGpt(tweetsText) {
  const askToGpt = await openai.chat.completions.create(
    {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: promptGpt + " " + tweetsText + " ",
        },
      ],
      temperature: openAiParams.temperature,
      max_tokens: openAiParams.max_tokens_tweet,
      top_p: openAiParams.top_p,
      frequency_penalty: openAiParams.frequency_penalty,
      presence_penalty: openAiParams.presence_penalty,
    },
    { timeout: openAiParams.timeout }
  );

  return askToGpt;
}

async function askArticleToGpt(tweetsText) {
  const askToGpt = await openai.chat.completions.create(
    {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content:
            promptGptArticle +
            " " +
            tweetsText +
            " n'oublie pas de selectionner un tweet_id dans les data ci-dessus et de le mettre dans la clé 'id_tweet' ",
        },
      ],
      temperature: openAiParams.temperature,
      max_tokens: openAiParams.max_tokens_article,
      top_p: openAiParams.top_p,
      frequency_penalty: openAiParams.frequency_penalty,
      presence_penalty: openAiParams.presence_penalty,
    },
    { timeout: openAiParams.timeout }
  );

  return askToGpt;
}

async function getTweetsFromAccountId(accountId) {
  const tweets = await twitterApi.v2.userTimeline(
    accountId,
    userTimelineTweetsParams
  );
  return tweets;
}

async function uploadMediaTwitter(media) {
  const mediaId = await twitterApi.v1.uploadMedia(media);

  return mediaId;
}

async function createTweet(tweetText, mediaId) {
  let tweetParams = {
    text: tweetText,
  };

  if (mediaId) {
    tweetParams.media = { media_ids: [mediaId] };
  }

  await rwTwitterApi.v2.tweet(tweetParams);
}

async function searchGoogleImage(search) {
  const response = await axios.get(
    "https://www.googleapis.com/customsearch/v1",
    {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CX,
        q: search,
        searchType: googleSearchParams.searchType,
        dateRestrict: googleSearchParams.dateRestrict,
        imgSize: googleSearchParams.imgSize,
        gl: googleSearchParams.gl,
        safe: googleSearchParams.safe,
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

  ghostApi.posts
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
  getTweetsFromAccountId,
  searchGoogleImage,
  saveImgUrl,
  uploadMediaTwitter,
  createTweet,
  createGhostArticle,
};
