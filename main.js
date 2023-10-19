require("dotenv").config();
const { db } = require("./config");
const TwitterHandler = require("./twitterHandler");
const ArticleHandler = require("./articleHandler");
const TestHandler = require("./testHandler");

async function main() {
  const twitterHandler = new TwitterHandler();
  const articleHandler = new ArticleHandler();
  const testHandler = new TestHandler();

  const actions = {
    getTweets: async () => await twitterHandler.getTweets(),
    generateTweet: async () => await twitterHandler.generateTweet(),
    generateArticle: async () => await articleHandler.createGhostArticle(),
    test: async () =>
      await testHandler.testImg(
        "FIFA à Paris : Un paradis fiscal sur-mesure envisagé"
      ),
  };

  const arg1 = process.argv[2];

  if (actions[arg1]) {
    await actions[arg1]();
  } else {
    console.log("Invalid argument");
  }

  db.end(); // close connection to database
}

// Exécution de la fonction principale
main().catch((error) => console.error(error));
