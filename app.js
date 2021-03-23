// REQUIRES AND NEW INSTANCES

const { resolve } = require('path');

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
let videoInfo = {};

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

let post = false;

// FS FUNCTIONS

// FS Read
function readVideoInfo() {
    // read json string from videoInfo.json file
    fs.readFile('./videoInfo.json', (err, jsonString) => {
        if (err) {
            console.log("Error reading file videoInfo.json:", err);
        }
        try {
            // parse json string and save to global constant
            videoInfo = JSON.parse(jsonString);
            console.log("videoInfo read from videoInfo.json file.");
        } catch (err) {
            console.log("Error parsing JSON string from videoInfo.json:", err);
        }
    });
};

// FS Write
function writeVideoInfo(title, url) {
    // create string from object to write
    let info = JSON.stringify({
            title: title,
            url: url
        }
    );
    // write info to videoInfo.json file
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
            // read video info from videoInfo.json and compare to change post flag
            if (videoUrlPrefix + res.items[0].id.videoId == videoInfo.url) {
                console.log("No new video yet, videoInfo will not be updated.");
                post = false;
            } else {
                // write video title and url (from prefix and id) to file and variables
                console.log("New video found.")
                writeVideoInfo(res.items[0].snippet.title, videoUrlPrefix += res.items[0].id.videoId);
                videoInfo.title = res.items[0].snippet.title;
                videoInfo.url = videoUrlPrefix += res.items[0].id.videoId;
                post = true;
            }
        }
    });
};

// REDDIT SUBMIT LINK REQUEST
function postReddit(){
    console.log("Posting new video (" + videoInfo.title + ") to r/" + CONFIG.subreddit + ".");
    reddit.getSubreddit(subreddit).submitLink({
        title: videoInfo.title,
        url: videoInfo.url
    });
};

// Cron Scheduling
cron.schedule(CONFIG.cronYoutube, () => {
    console.log("Running GET YouTube Task.");
    getYoutube();
});

cron.schedule(CONFIG.cronReddit, () => {
    console.log("Running POST reddit Task.");
    if (post) {
        postReddit();
    } else {
        console.log("No new video to post to reddit.");
    }
});

// RUN
readVideoInfo();
console.log("YouTube Crossposter now running.")