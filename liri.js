require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);


//vars
// all arguments typed after liri.js will be stored in this variable
var consoleArg = '';

function gatherConsoleArgs () {
  if(process.argv.length >= 4) {
    for(i=3; i<process.argv.length-1; i++) {
      consoleArg +=  process.argv[i] + '%20';
    }
    consoleArg += process.argv[process.argv.length-1];
  }
  else {
    consoleArg = '';
  }
}

function callBandsInTown () {
  // console.log("bands in town was called");
  // console.log("consoleArg:" +consoleArg);
  axios.get("https://rest.bandsintown.com/artists/"+consoleArg+"/events?app_id=codingbootcamp").then(
  function(response) {
    // console.log(response.data);
    for(i=0; i<response.data.length; i++) {
      console.log("City/Country: " + response.data[i].venue.city+ "/"+response.data[i].venue.country);
     
      console.log("Venue Name: " + response.data[i].venue.name);
      
      // use moment js to manipulate date
      var a = moment(response.data[i].datetime.split("T")[0]);
      var b = a.format('MM/ DD/ YYYY');
      console.log("Event Date (MM/DD/YYYY): " + b);
      console.log("*****************************");
    }
    
  })
  .catch(function(error) {
    console.log(error);
  });
}

function callSpotify() {
  console.log("spoify was called");
 
  
 if (consoleArg == '') {
   consoleArg = 'The%20Sign%20by%20Ace%20base';
 } 
 console.log("consoleArg:" +consoleArg);
 
  spotify.search({ type: 'track', query: consoleArg.split('%20').join(' ') },     function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      

        for(i=0; i<data.tracks.items.length; i++) {
          var artists = data.tracks.items[i].artists;
          var artistName = '';
          for(j=0; j<artists.length; j++) {
            artistName +=  artists[j].name + ' ';
          }
          console.log("Artisty Name(s):" + artistName);
        
          // console.log("Artist(s): " + JSON.stringify(data.tracks.items[i].artists)); 
          console.log("Song Name: " + data.tracks.items[i].name); 
          console.log("Preview Song on Spotify: " + data.tracks.items[i].external_urls.spotify); 
          console.log("Album Name: " + data.tracks.items[i].album.name); 
          console.log("===========================");
          console.log("***************************");
        }
  });
}

function callOMDB() {
  if (consoleArg == '') {
    consoleArg = 'Mr.%20Nobody';
  } 
  axios.get("http://www.omdbapi.com/?apikey=trilogy&t="+consoleArg).then(
    function(response) {
        var response = response.data;
    //   var movies = response.data.Search;
    //   for (i=0; i<= movies.length; i++) {
        console.log(" Movie Title: " + response.Title);
        console.log("\n Year Released:  " + response.Year);
        console.log("\n IMDB Rating:  " + response.imdbRating);
        console.log("\n Rotten Tomaoes Rating:  " + response.Ratings[1].Value);
        console.log("\n Produced in :  " + response.Country);
        console.log("\n Language:  " + response.Language);
        console.log("\n Plot:  " + response.Plot);
        console.log("\n Actors:  " + response.Actors);
      // }
      
    })
    .catch(function(error) {
      console.log(error);
    });
}

//takes switcher as as callback function to execute sychronously
function readFile(callback) {
  console.log("read file was called");
  fs.readFile("./random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // We will then print the contents of data
    console.log(data);
  
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
  
    // We will then re-display the content as an array for later use.
    console.log(dataArr);
    process.argv[2] = String('spotify-this-song');
    process.argv[3] = 'I want it that way';
    for(i=2; i<process.argv.length; i++) {
      console.log(process.argv[i]);
    }
    callback();
  });
  
}





function switcher() {
  console.log("switcher was called");
  if(process.argv[2] == 'concert-this') {
    gatherConsoleArgs();
    callBandsInTown();
  } else if (process.argv[2] == String('spotify-this-song')) {
    gatherConsoleArgs();
    callSpotify()
  }else if (process.argv[2] == 'movie-this') {
    gatherConsoleArgs();
    callOMDB();
  }
}

if (process.argv[2] == 'do-what-it-says') {
  readFile(switcher);
  } else {
    switcher();
  }
