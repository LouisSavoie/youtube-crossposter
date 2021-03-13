// REQUIRES AND NEW INSTANCES

const cron      = require('node-cron'),
      YouTube   = require('youtube-node'),
      snoowrap = require('snoowrap'),
      youtube   = new YouTube();

require('dotenv').config();

// SETUP MODULES AND VARIABLES

// setup for youtube
const youtube.setKey(process.env.YOUTUBE_KEY);
let youtubeSearchParams = {part: "snippet", channelId: "UC47EhkMV18WlRqV3VhUH3yg", order: "date", type: "video", safeSearch: "none"},
    videoTitle = "",
    videoURL = "https://www.youtube.com/watch?v=";

// setup for reddit with OAuth
// const reddit = new snoowrap({
//     userAgent: 'put your user-agent string here',
//     clientId: 'put your client id here',
//     clientSecret: 'put your client secret here',
//     refreshToken: 'put your refresh token here'
//   });

// setup for reddit with user account credentials
const otherRequester = new snoowrap({
    userAgent: process.env.REDDIT_USERAGENT,
    clientId: process.env.REDDIT_CLIENTID,
    clientSecret: process.env.REDDIT_CLIENTSECRETE,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
  });

// YOUTUBE SEARCH REQUEST

// REDDIT SUBMIT LINK REQUEST
