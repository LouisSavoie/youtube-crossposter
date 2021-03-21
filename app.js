// REQUIRES AND NEW INSTANCES

const cron      = require('node-cron'),
      YouTube   = require('youtube-node'),
      snoowrap = require('snoowrap'),
      youtube   = new YouTube();
      CONFIG = require('./config.json');

require('dotenv').config();

// SETUP MODULES AND VARIABLES

// setup youtube
youtube.setKey(process.env.YOUTUBE_KEY);
let youtubeSearchParams = CONFIG.youtubeSearchParams,
    videoTitle = "",
    videoURL = "https://www.youtube.com/watch?v=";

// setup reddit with Token
// const reddit = new snoowrap({
//     userAgent: 'put your user-agent string here',
//     clientId: 'put your client id here',
//     clientSecret: 'put your client secret here',
//     refreshToken: 'put your refresh token here'
//   });

// setup reddit with account credentials
const reddit = new snoowrap({
    userAgent: process.env.REDDIT_USERAGENT,
    clientId: process.env.REDDIT_CLIENTID,
    clientSecret: process.env.REDDIT_CLIENTSECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
});
let subreddit = CONFIG.subreddit;

// YOUTUBE SEARCH REQUEST
function getYoutube(){
    console.log("Searching YouTube.");
    youtube.search('', 1, youtubeSearchParams, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            videoTitle = res.items[0].snippet.title;
            videoURL += res.items[0].id.videoId;
        }
    });
};

// REDDIT SUBMIT LINK REQUEST
function postReddit(){
    console.log("Submitting to reddit.");
    reddit.getSubreddit(subreddit).submitLink({
        title: videoTitle,
        url: videoURL
    });
};

// Cron Scheduling
cron.schedule(CONFIG.cronYoutube, () => {
    console.log("Running GET YouTube Task.");
    getYoutube();
});

cron.schedule(CONFIG.cronReddit, () => {
    console.log("Running POST Reddit Task.");
    postReddit();
});
