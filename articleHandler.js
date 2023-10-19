const { getImage } = require("./utils");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { jsonrepair } = require("jsonrepair");
const { askArticleToGpt, createGhostArticle } = require("./api");

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
    await updateTweetDbNotUsedForArticle(true);
    console.log("ask to GPT-4...");
    const response = await askArticleToGpt(JSON.stringify(tweets));
    if (response.choices.length === 0) {
      console.log("no article generated");
      return;
    }
    console.log("GPT-4 answer !");
    console.log(response.choices[0].message.content);
    let generatedArticle = jsonrepair(response.choices[0].message.content);
    generatedArticle = JSON.parse(generatedArticle);

    let articleHtml = generatedArticle.html;
    const articleImage = generatedArticle.image;
    const articleTitle = generatedArticle.titre;
    const articleTweetId = generatedArticle.id_tweet;
    // get url image
    const articleFeaturedImage = await getImage(articleImage, true);
    // ADD EMBED TWEET IN THE ARTICLE
    if (articleTweetId) {
      console.log("add embed tweet in article...");
      const dom = new JSDOM(articleHtml);
      const document = dom.window.document;
      let article = document.querySelectorAll("p");
      let secondLastParagraph = article[article.length - 2];
      let textToAdd =
        '<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/' +
        articleTweetId +
        '"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
      secondLastParagraph.insertAdjacentHTML("afterend", textToAdd);
      articleHtml = dom.serialize();
    }

    await createGhostArticle(articleTitle, articleFeaturedImage, articleHtml);
  }
}

module.exports = ArticleHandler;
