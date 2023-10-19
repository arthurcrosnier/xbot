# XBot

XBot is an automation bot designed to seamlessly integrate with Twitter, the Ghost content management system, and OpenAI's GPT-4 model. 

## Description
The bot is capable of fetching tweets from specified Twitter accounts, utilizing the capabilities of GPT-4 to generate new tweets and articles, and subsequently publishing these articles to a Ghost-based website. Moreover, it harnesses the power of Tesseract for image processing and Jimp for image manipulation.

## Features
- **Fetch Tweets:** Gathers tweets from designated Twitter accounts.
- **Generate Content:** Produces tweets and articles based on previously fetched tweets using the GPT-4 model.
- **Publish to Ghost:** Posts the generated articles directly to a Ghost CMS platform.

## Database Structure
The bot uses a SQL table with the following columns to manage and track the tweets:
- `id`: Unique identifier for each entry.
- `tweet_id`: Identifier of the fetched tweet.
- `tweet_text`: The actual content of the fetched tweet.
- `usedForCreateTweet`: Flag indicating if the tweet was used for generating new tweets.
- `usedForCreateArticle`: Flag indicating if the tweet was used for generating articles.
- `date_added`: Timestamp of when the tweet was added to the database.
- `date_updated`: Timestamp of the last update on the tweet entry.

- `CREATE TABLE tweets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tweet_id VARCHAR(255) NOT NULL,
    tweet_text TEXT NOT NULL,
    usedForCreateTweet BOOLEAN DEFAULT FALSE,
    usedForCreateArticle BOOLEAN DEFAULT FALSE,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`


## Usage
1. **Setup:** Ensure you have the required dependencies by checking the `package.json` and installing them via npm.
2. **Environment Variables:** Configure your `.env` file with the necessary API keys and credentials.
3. **Run the Bot:** Utilize the npm scripts provided:
   - Fetch Tweets: `npm run getTweets`
   - Generate a Tweet: `npm run generateTweet`
   - Generate an Article: `npm run generateArticle`
   - Test the Setup: `npm run test`

## Contributing
Feel free to fork the project, make some updates, and submit pull requests. Feedback is always welcome.
