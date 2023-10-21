const { getImage } = require("../utils/utils");
const { askTweetIdToGpt, getPopularHashtags } = require("./api");
const { getTweetDbNotUsedForArticle } = require("./databaseQueries");
class TestHandler {
  async testImg(search = "cat") {
    const image = await getImage(search, true);
    console.log(image);
  }

  async testGetIdTweetFromGpt(title) {
    let tweets = await getTweetDbNotUsedForArticle();
    if (tweets.length === 0) {
      console.log("no tweets in db");
      return;
    }

    tweets = tweets.map((tweet) => ({
      tweet_id: tweet.tweet_id,
      text: tweet.tweet_text,
    }));
    console.log("ask to GPT-4 to get tweet_id...");
    const articleTweetId = await askTweetIdToGpt(JSON.stringify(tweets), title);
    if (articleTweetId.choices.length === 0) {
      console.log("no tweet id found");
    }

    const tweet_id = articleTweetId.choices[0].message.content;
    console.log(tweet_id);
  }

  async testGetHashTag() {
    const hashtags = await getPopularHashtags(5, 23424819);
    console.log(hashtags);
  }
}

module.exports = TestHandler;
