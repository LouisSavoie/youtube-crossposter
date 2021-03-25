# YouTube Crossposter

YouTube Crossposter is a Node.js server app that searches a given YouTube channel for videos and crossposts the most recent upload to other social media sites, currently only reddit, on a schedule.

## How to Use

1. Clone the repo
2. Create a `.env` file and add the following enviromental variables (env vars) to it:

    `YOUTUBE_KEY=`

    `REDDIT_USERAGENT=`

    `REDDIT_CLIENTID=`

    `REDDIT_CLIENTSECRET=`

    `REDDIT_USERNAME=`

    `REDDIT_PASSWORD=`

3. Obtain a YouTube Data API key [HERE](https://console.cloud.google.com/apis/credentials?pli=1&project=utility-grin-307317&folder=&organizationId=), and add to above env vars.
4. create a reddit app for, clientID, client secret [HERE](https://www.reddit.com/prefs/apps), and add to above env vars.

    You should create a script type reddit app for these types of credentials to work.

    Otherwise you will need OAuth credentials and will have to modify the code to use them:

    in app.js uncomment the section titled `setup reddit with Token` and comment out the section titled `setup reddit with account credentials`, then add your OAuth token to the env vars ans to app.js along with the others.

5. Add reddit useragent to above env vars in the following format:

    `<platform>:<app ID>:<version string> (by /u/<reddit username>)`

    Example: `User-Agent: android:com.example.myredditapp:v1.2.3 (by /u/kemitche)`

6. In the config.json fill out the following:

    - channelId: the id of the channel you want to get video data from.
    - subreddit: the name of the subreddit you want to post to, without the r/.
    - cronYoutube: the timing of when you want the app to search YouTube for a new video. (Default: first second of the first minute of every hour.)
    - cronReddit: the timing of when you want the app to post to reddit. (Default: second second of the first minute of every hour.)

    Make sure to leave atleast 1 second between when the YouTube search and the reddit post goes off to allow the search data to come back and be writen to variables and to file. The API calls have been left non-blocking to reduce complexity since task scheduling can account for the delays anyway.

7. Install on your server or run locally and start app with `npm start`.