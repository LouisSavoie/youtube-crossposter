// REQUIRES AND NEW INSTANCES
const cron      = require('node-cron'),
      YouTube   = require('youtube-node'),
      snoowrapp = require('snoowrap'),
      youtube   = new YouTube();

require('dotenv').config();

// SETUP MODULES AND VARIABLES
const youtube.setKey(process.env.YOUTUBE_KEY);
