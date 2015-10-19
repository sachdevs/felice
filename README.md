# [felice](http://feliceapp.herokuapp.com/)\
### If the site gives an error, its on free heroku, it is likely asleep.
A bunch of data for your Spotify music library <br>
Quick description of approach: <br>
Rest api written in express js, node, mongoose and a few miscellaneous libs <br>
Front end written in backbone, jQuery, and templating done in handlebars
##Installation instructions
Make sure you have mongodb installed. <br>
In one terminal window run: (if on windows make sure your mongodb directory is in you path)
Supports only chrome as of now.

```
$mongod
```
In another window, run:
```
$npm install
$npm start
```
Currently its going to start in dev mode with nodemon, so make sure you have that installed with the command:
```
$npm install -g nodemon
```
Otherwise just modify package.json to your liking and ask me any questions about setting it up in case I forgot something. <br>
<h2>TODO</h2>
https://trello.com/b/3UpXCtuq/felice
no longer managing todo on readme, starting to get too complicated.

##Authentication Flow
Since there is a need to validate all api calls in the app, my current solution to see if requests to api are authorized is:<br>
1. In the client side, the user goes through the Spotify Web Api authorization flow, returning a authorization code. <br>
2. Using this, the client side sends two things to the Felice api: the spotify access token and the local access token (if the  auth token is valid)<br>
4. If invalid, 401 is issued <br>
5. Users with elevated api access (admins) are (in a nutshell) supported through a list of white listed user profiles <br>
6. Hopefully this does not have any major vulnerabilities. :crying_cat_face:

##API Documentation

| Endpoint  | HTTP Req  | Auth required  | Result  |
|---|---|---|---|
|{root}/api/artists   |GET   |Standard   |List of artists   |
|{root}/api/artists/:artistId   |GET   |Standard   |Get artist    |
|   |PUT   |Standard   |Update/Create artist   |
|   |DELETE   |Admin   |Delete artist   |
|{root}/api/users   |GET   |Standard   |List of users   |
|{root}/api/artists/:userId   |GET   |Standart   |Get user    |
|   |PUT   |Standard   |Update/Create user   |
|   |DELETE   |Admin   |Delete user   |
|{root}/api/tracks   |GET   |Standard   |List of tracks   |
|{root}/api/artists/:trackId   |GET   |Standard   |Get track    |
|   |PUT   |Standard   |Update/Create track   |
|   |DELETE   |Admin   |Delete track   |
|{root}/authenticate   |POST w/ authentication code   |Standard   |Returns jwt  |

Standard Auth: felice issued JSON web token, all requests must contain jwt in body in the property 'token' in order to be authenticated.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/sachdevs/felice/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

