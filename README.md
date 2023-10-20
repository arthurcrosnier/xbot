# XBot
![XBot Logo](https://github.com/arthurcrosnier/xbot/blob/main/assets/dalle-xbot.png)
XBot is an automation robot designed to integrate seamlessly with Twitter and the Ghost content management system.

## Description
The bot is capable of fetching tweets from specified Twitter accounts, utilizing the capabilities of GPT-4 to generate new tweets and articles, and subsequently publishing these articles to a Ghost-based website. Moreover, it harnesses the power of Tesseract for image processing and Jimp for image manipulation.

## Features
- **Fetch Tweets:** Gathers tweets from designated Twitter accounts.
- **Generate Content:** Produces tweets and articles based on previously fetched tweets using the GPT-4 model.
- **Publish to Ghost:** Posts the generated articles directly to a Ghost CMS platform.

## Usage
1. **Setup:** Ensure you have the required dependencies by checking the `package.json` and installing them via npm.
2. **Environment Variables:** Configure your `.env` file with the necessary API keys and credentials.
3. **Run the Bot:** Utilize the npm scripts provided:
   - Fetch Tweets: `npm run getTweets`
   - Generate a Tweet: `npm run generateTweet`
   - Generate an Article: `npm run generateArticle`
   - Test the Setup: `npm run test`

## Database Structure
The bot uses a SQL table with the following columns to manage and track the tweets:
```
CREATE TABLE tweets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tweet_id VARCHAR(255) NOT NULL,
    tweet_text TEXT NOT NULL,
    usedForCreateTweet BOOLEAN DEFAULT FALSE,
    usedForCreateArticle BOOLEAN DEFAULT FALSE,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Configuration

Before running XBot, ensure you set up a `.env` file at the root of your project with the necessary configurations. Below are the environment variables you'll need to define:

```ini
DB_CONNECTION=mysql
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_DATABASE=your_db_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

GHOST_API_URL=your_ghost_api_url
GHOST_API_KEY=your_ghost_api_key
GHOST_API_VERSION=your_ghost_api_version

TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

OPENAI_APIKEY=your_openai_api_key

GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX=your_google_cx
```

## Contributing
Feel free to fork the project, make some updates, and submit pull requests. Feedback is always welcome.
