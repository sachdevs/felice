# felice
A bunch of data for your Spotify music library <br>
Quick description of approach: <br>
Rest api written in express js, node, mongoose and a few miscellaneous libs <br>
Front end written in backbone and sass
##Installation instructions
Make sure you have mongodb installed. <br>
In one terminal window run: (if on windows make sure your mongodb directory is in you path)
```
$mongod
```
In another window, run:
```
$npm install
$npm start
```
Currently its going to start in dev mode with nodemon, so make sure you have that insstalled with the command:
```
$npm install -g nodemon
```
Otherwise just modify package.json to your liking and ask me any questions about setting it up in case I forgot something. <br>
<h2>TODO</h2>
https://trello.com/b/3UpXCtuq/felice
no longer managing todo on readme, starting to get too complicated.

##Authentication Flow
Since there is a need to validate all api calls in the app, my current solution to see if requests to api are authorized is:<br>
1. In the client side, the user goes through the Spotify Web Api authorization flow, returning a refresh-able access token. <br>
2. Using this, the client side sends two things to the Felice api: the user profile and the access token <br>
3. The Felice api ensures that the token is valid by verifying that the client side user profile is the same as one obtained by the token via this spotify api endpoint: https://developer.spotify.com/web-api/get-current-users-profile/ <br>
4. If the profiles do not match, 401 is issued <br>
5. If they do match however, a local auth token is generated giving the user access to make calls to specific parts of the api. <br>
6. Users with elevated api access (admins) are (in a nutshell) supported through a list of white listed user profiles <br>
7. Hopefully this does not have any major vulnerabilities. :crying_cat_face:
