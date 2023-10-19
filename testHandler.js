const { getImage } = require("./utils");

const {
  getTweetDbNotUsedForArticle,
  updateTweetDbNotUsedForArticle,
} = require("./databaseQueries");

class TestHandler {
  async testImg(search = "cat") {
    const image = await getImage(search, true);
    console.log(image);
  }
}

module.exports = TestHandler;
