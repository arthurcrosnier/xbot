const mysql = require("mysql2/promise");
const GhostAdminAPI = require("@tryghost/admin-api");
const OpenAI = require("openai");
const { TwitterApi } = require("twitter-api-v2");

const userTimelineTweetsParams = {
  max_results: "5",
  exclude: "retweets,replies",
};

const openAiParams = {
  temperature: 1,
  max_tokens_tweet: 280,
  max_tokens_article: 4096,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  timeout: 120000, // 2 minutes
};

const googleSearchParams = {
  searchType: "image",
  dateRestrict: "1d",
  imgSize: "xlarge",
  gl: "fr",
  safe: "off",
};

const accountsToParse = {
  user1: "1214315619031478272",
  user2: "1233151236154761217",
  user3: "8350912",
  user4: "472852289",
  user5: "971820228",
};

const promptGpt =
  "Les tweets suivants concernent des événements récents en France ou ailleurs. \
Génère un tweet neutre et informatif en français résumant un événement important parmi eux. \
Si plusieurs tweets traitent du même sujet, c'est le sujet le plus important. \
Ajoute un ou deux hashtags si possible et des emojis si approprié. \
Retourne un texte sous forme de JSON avec une clé 'tweet' et une clé 'image', où 'image' est une description précise du tweet ou un titre d'article à utiliser pour la recherche d'image sur Google. \
La valeur de la clé 'tweet' ne doit pas dépasser 280 caractères :";

const promptGptArticle =
  "Les tweets suivants concernent des événements récents en France ou ailleurs. \
Génère un article neutre et informatif en français résumant un événement important parmi eux. \
 Si plusieurs tweets traitent du même sujet, c'est le sujet le plus important.\
 Ajoute un ou deux hashtags si possible et des emojis si approprié.\
Retourne uniquement un texte sous forme de JSON avec une clé 'titre',  'html', 'id_tweet',  et une clé 'image',où 'id_tweet' est un id_tweet que tu auras selectionner parmis les data ci-dessous et 'image' est une description précise de l'article ou le titre de l'article à utiliser pour la recherche d'image sur Google, retourne seulement le resultat. \
Voici le format HTML à utiliser pour l'article:\
<p><strong>Text intro</strong></p><h2>Title first paragraph</h2><p>Text first paragraph</p><h2>Title Second paragraph</h2><p>Text Second paragraph</p><p>Conclusion</p>";

const ghostApi = new GhostAdminAPI({
  url: process.env.GHOST_API_URL,
  version: process.env.GHOST_API_VERSION,
  key: process.env.GHOST_API_KEY,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
const twitterApi = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
});
const rwTwitterApi = twitterApi.readWrite;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY,
});

module.exports = {
  ghostApi,
  db: pool,
  twitterApi,
  rwTwitterApi,
  openai,
  promptGpt,
  promptGptArticle,
  accountsToParse,
  userTimelineTweetsParams,
  openAiParams,
  googleSearchParams,
};
