// REQUIRES AND NEW INSTANCES

const cron      = require('node-cron'),
      YouTube   = require('youtube-node'),
      snoowrap  = require('snoowrap'),
      youtube   = new YouTube(),
      CONFIG    = require('./config.json'),
      fs        = require('fs');

require('dotenv').config();

// SETUP MODULES AND VARIABLES

// setup youtube
youtube.setKey(process.env.YOUTUBE_KEY);
let youtubeSearchParams = CONFIG.youtubeSearchParams,
    videoUrlPrefix = CONFIG.videoUrlPrefix;

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

// FS FUNCTIONS

// FS Read

// FS Write
function writeVideoInfo(title, url) {
    // create string from object to write
    let info = JSON.stringify({
            title: title,
            url: url
        }
    );
    // write info to file
    fs.writeFile('./videoInfo.json', info, err => {
        if (err) {
            console.log("Error writing videoInfo file", err)
        } else {
            console.log("videoInfo.json file updated.")
        }
    });
};

// YOUTUBE SEARCH REQUEST
function getYoutube(){
    console.log("Searching YouTube.");
    // search youtube channel for video title and id
    youtube.search('', 1, youtubeSearchParams, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            // write video title and url (from prefix and id) to file
            writeVideoInfo(res.items[0].snippet.title, videoUrlPrefix += res.items[0].id.videoId);
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
