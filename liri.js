require("dotenv").config();
var Spotify = require('node-spotify-api');
var request = require("request");
// var bandsintown = require('bandsintown')('codingbootcamp');
var moment = require('moment');
var fs = require("fs")
var keys = require("./keys.js")

var spotify = new Spotify(keys.spotify);
//variables
var task = process.argv[2];
var value = process.argv[3];
var songVar = "";
var omdbVar = "";
var bandVar = "";

//conditionals to run functions based on user input or .txt file
if (task === "concert-this") {
    bandsFunction(bandVar)
}
else if (task === "spotify-this-song") {
    spotifyFunction(songVar)
}
else if (task === "movie-this") {
    omdbFunction(omdbVar)
}
else if (task === "do-what-it-says") {
    theWorstFunction()
}
else {
    return console.log("Error!!!")
}

//functions to perform each command



function bandsFunction(bandVar) {
    console.log("Bands in Town")
    if (!value) {
        console.log("NO INPUT???")
    } else {
        for (i = 3; i < process.argv.length; i++) {
            bandVar += process.argv[i];
        }
       
        console.log("Upcoming concerts for: " + bandVar)
    }

    request("https://rest.bandsintown.com/artists/" + bandVar + "/events?app_id=codingbootcamp", function (error, response, body) {

        //this works with drake, nofx, florence and the machine, but NOT with many others...???

        if (!error && response.statusCode === 200) {
            body = JSON.parse(body)
            // console.log(body)
            for (let i = 0; i < body.length; i++) {
                console.log(body[i].venue.city + ", " + body[i].venue.region + " at " + body[i].venue.name + " " + moment(body[i].datetime).format('MM/DD/YYYY'))

            }

            // console.log("Upcoming concerts for " + bandVar + ":")

        }

    })
}

function spotifyFunction(songVar) {
    console.log("spotify")
    if (!value) {
        console.log("no user input")
        songVar = "Ace of Base The Sign"
    } else {

        for (i = 3; i < process.argv.length; i++) {
            songVar += process.argv[i] + " ";
        }
        console.log(songVar)
    }


    spotify.search(
        { type: "track", query: songVar, limit: 1 }, function (error, response) {
            if (error) {
                return console.log(error);
            }


            for (var i = 0; i < response.tracks.items[0].album.artists.length; i++) {
                console.log("Artist: " + response.tracks.items[0].album.artists[i].name);
                console.log("Song name: " + response.tracks.items[0].name);
                console.log("Preview Song: " + response.tracks.items[0].external_urls.spotify);
                console.log("Album: " + response.tracks.items[0].album.name);
            }
        });

}



function omdbFunction(omdbVar) {
    if (!value) {
        omdbVar = "Mr. Nobody";
    
    } else {
        for (var i = 3; i < process.argv.length; i++) {
            omdbVar += process.argv[i] + "+";
        }
    }

    request("http://www.omdbapi.com/?t=" + omdbVar + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {


            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Movie Year: " + JSON.parse(body).Year);
            console.log("Rated: " + JSON.parse(body).Rated);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("The movie " + JSON.parse(body).Title + " was produced in: " + JSON.parse(body).Country);
            console.log("Movie's language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    })
}

function theWorstFunction() {
    console.log('do something')
    fs.readFile("random.txt", "utf8", function (error, data) {
        // console.log(data)
        if (error) {
            return console.log(error)
        } else {
            var dataSplit = data.split(",")
            if (dataSplit[0] === "spotify-this-song") {
                songVar = dataSplit[1]
                value = true;
                spotifyFunction(songVar)
                
            }
        }
    });
}

