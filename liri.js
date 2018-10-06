require("dotenv").config();
var Spotify = require('node-spotify-api');
var request = require("request");
var bandsintown = require('bandsintown')('codingbootcamp');
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
    bandsFunction()
    bandsFunctionTwo(bandVar)
}
else if (task === "spotify-this-song") {
    spotifyFunction()
    spotifyFunctionTwo(songVar)
}
else if (task === "movie-this") {
    omdbFunction()
    omdbFunctionTwo(omdbVar)

}
else if (task === "do-what-it-says") {
    theWorstFunction()
}
else {
    return console.log("Error!!!")
}

//functions to perform each command


function bandsFunction() {
    console.log("Bands in Town")
    if (!value) {
        console.log("NO INPUT???")
    } else {

        for (i = 3; i < process.argv.length; i++) {
            bandVar += process.argv[i] + " ";
        }
        // console.log("BANDVAR IS: " + bandVar)
    }
}
function bandsFunctionTwo(bandVar) {
    bandsintown
        .getArtistEventList(value)
        .then(function (events) {
            //this works with drake, nofx, florence and the machine, but NOT with many others...???

            console.log("Upcoming concerts for " + bandVar + ":")
            console.log(events[0].venue.city + ", " + events[0].venue.region + " at " + events[0].venue.name + " " + moment(events[0].datetime).format('MM/DD/YYYY'))
        });

}

function spotifyFunction() {
    console.log("spotify")
    if (!value) {
        songVar = "Ace of Base The Sign"
    } else {

        for (i = 3; i < process.argv.length; i++) {
            songVar += process.argv[i] + " ";
        }
        console.log(songVar)
    }
}

function spotifyFunctionTwo(songVar) {

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

};

function omdbFunction() {
    if (!value) {
        omdbVar = "Mr. Nobody";

    } else {
        for (var i = 3; i < process.argv.length; i++) {
            omdbVar += process.argv[i] + "+";
        }
    }

}

function omdbFunctionTwo(omdbVar) {

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
            // console.log(dataSplit)

            if (dataSplit[0] === "spotify-this-song") {
                songVar = dataSplit[1]
                spotifyFunctionTwo(songVar)
            }
        }
    });



}

