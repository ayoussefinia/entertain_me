require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);

// `node liri.js concert-this <artist/band name `
//vars
// all arguments typed after liri.js will be stored in this variable
var consoleArg = '';

function gatherConsoleArgs () {
  if(process.argv.length >= 5) {
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
 
spotify.search({ type: 'track', query: consoleArg.split('%20').join(' ') }, function(err, data) {
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

if(process.argv[2] == 'concert-this') {
  gatherConsoleArgs();
  callBandsInTown();
} else if (process.argv[2] == 'spotify-this-song') {
  gatherConsoleArgs();
  callSpotify()
}