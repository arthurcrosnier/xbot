const { accountsToParse } = require("./config");
const { getImage } = require("./utils");
const {
  askTweetToGpt,
  getTweetsFromAccountId,
  uploadMediaTwitter,
  createTweet,
} = require("./api");

const {
  updateTweetDbNotUsedForTweet,
  getTweetDbNotUsedForTweet,
  getTweetDbById,
  insertTweetInDb,
} = require("./databaseQueries");

class TwitterHandler {
  async getTweets() {
    try {
      for (const [name, id] of Object.entries(accountsToParse)) {
        const tweets = await getTweetsFromAccountId(id);

        const tweetObject = tweets._realData.data[0];
        const tweetText = tweetObject.text;
        const tweetId = tweetObject.id;
        const tweetIsInDb = await getTweetDbById(tweetId);

        if (tweetIsInDb.length === 0) {
          await insertTweetInDb(tweetId, tweetText);
          console.log("insert last tweet from " + name + " in db !");
        } else {
          console.log("tweet already in db");
        }
      }
    } catch (error) {
      console.error("Error when fetching tweets:", error);
    }
  }

  async generateTweet() {
    try {
      let tweets = await getTweetDbNotUsedForTweet();
      if (tweets.length === 0) {
        console.log("no tweets in db");
        return;
      }
      await updateTweetDbNotUsedForTweet(true); // if error after we want recent tweet
      tweets = tweets.map((tweet) => tweet.tweet_text);
      console.log("ask to GPT-4...");
      const response = await askTweetToGpt(JSON.stringify(tweets));
      if (response.choices.length === 0) {
        console.log("no tweet generated");
        return;
      }
      console.log("GPT-4 answer !");
      let generatedTweet = JSON.parse(response.choices[0].message.content);
      const tweetText = generatedTweet.tweet;
      const tweetImage = generatedTweet.image;

      const image = await getImage(tweetImage);

      await this.postTweet(tweetText, image);
    } catch (error) {
      console.error("Erreur lors de la génération du tweet:", error);
    }
  }

  async postTweet(tweetText, tweetImage) {
    let mediaId = null;
    try {
      if (tweetImage) {
        console.log("uploadMedia...");
        mediaId = await uploadMediaTwitter(tweetImage);
      }
      console.log("post tweet...");
      //add mediaId if exist
      await createTweet(tweetText, mediaId);
      console.log("Tweet post successfully.");
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = TwitterHandler;
