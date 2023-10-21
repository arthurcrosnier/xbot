const { db } = require("../config/config");

const updateTweetDbNotUsedForTweet = async (value) => {
  const query = "UPDATE tweets SET usedForCreateTweet = ?";
  await db.query(query, [value]);
};

const updateTweetDbNotUsedForArticle = async (value) => {
  const query = "UPDATE tweets SET usedForCreateArticle = ?";
  await db.query(query, [value]);
};

const getTweetDbNotUsedForTweet = async () => {
  const [results] = await db.execute(
    "SELECT tweet_text FROM tweets WHERE usedForCreateTweet = false"
  );
  return results;
};

const getTweetDbNotUsedForArticle = async () => {
  const [results] = await db.execute(
    "SELECT tweet_id, tweet_text FROM tweets WHERE usedForCreateArticle = false"
  );

  return results;
};

const getTweetDbById = async (id) => {
  const [results] = await db.execute(
    "SELECT * FROM tweets WHERE tweet_id = ?",
    [id]
  );

  return results;
};

const insertTweetInDb = async (tweetId, tweetText, who, apiResult) => {
  const query =
    "INSERT INTO tweets (tweet_id, tweet_text, usedForCreateTweet, usedForCreateArticle, who, apiResult) VALUES (?, ?, false, false, ?, ?)";
  await db.query(query, [tweetId, tweetText, who, apiResult]);
};

const insertInfoTweetGeneratedInDb = async (tweetText, imagePrompt) => {
  const query =
    "INSERT INTO tweetsGeneratedInfo (tweet_text, image_prompt) VALUES (?, ?)";
  await db.query(query, [tweetText, imagePrompt]);
};

module.exports = {
  updateTweetDbNotUsedForTweet,
  updateTweetDbNotUsedForArticle,
  getTweetDbNotUsedForTweet,
  getTweetDbNotUsedForArticle,
  getTweetDbById,
  insertTweetInDb,
  insertInfoTweetGeneratedInDb,
};
