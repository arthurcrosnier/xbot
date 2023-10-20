const { getImage, validateAndRepairJSON } = require("../utils/utils");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { jsonrepair } = require("jsonrepair");
const {
  askArticleToGpt,
  createGhostArticle,
  askTweetIdToGpt,
} = require("./api");

const {
  getTweetDbNotUsedForArticle,
  updateTweetDbNotUsedForArticle,
} = require("./databaseQueries");

class ArticleHandler {
  async createGhostArticle() {
    let tweets = await getTweetDbNotUsedForArticle();
    if (tweets.length === 0) {
      console.log("no tweets in db");
      return;
    }

    tweets = tweets.map((tweet) => ({
      tweet_id: tweet.tweet_id,
      text: tweet.tweet_text,
    }));
    //await updateTweetDbNotUsedForArticle(true);
    console.log("ask to GPT-4...");
    const response = await askArticleToGpt(JSON.stringify(tweets));
    if (response.choices.length === 0) {
      console.log("no article generated");
      return;
    }
    console.log("GPT-4 answer !");

    try {
      const validArticle = await validateAndRepairJSON(
        response.choices[0].message.content
      );
      let articleHtml = validArticle.html;
      const articleImage = validArticle.image;
      const articleTitle = validArticle.titre;
      console.log(validArticle);

      // get url image
      const articleFeaturedImage = await getImage(articleImage, true);
      // ADD EMBED TWEET IN THE ARTICLE
      console.log("ask to GPT-4 to get tweet_id...");
      const articleTweetId = await askTweetIdToGpt(
        JSON.stringify(tweets),
        articleTitle
      );
      if (articleTweetId.choices.length === 0) {
        console.log("no tweet id found");
      }

      let tweet_id = articleTweetId.choices[0].message.content;
      tweet_id = tweet_id.replace(/[^0-9]/g, "");
      if (tweet_id) {
        console.log("add embed tweet in article...");
        console.log(tweet_id);
        const dom = new JSDOM(articleHtml);
        const document = dom.window.document;
        let article = document.querySelectorAll("p");
        let secondLastParagraph = article[article.length - 2];
        let textToAdd =
          '<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/' +
          tweet_id +
          '"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
        secondLastParagraph.insertAdjacentHTML("afterend", textToAdd);
        articleHtml = dom.serialize();
      }

      await createGhostArticle(articleTitle, articleFeaturedImage, articleHtml);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = ArticleHandler;
