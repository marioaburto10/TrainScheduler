 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCdqCM6U9nemfghtlDZrpfiqVLjeN52ysU",
    authDomain: "train-scheduler-dc5da.firebaseapp.com",
    databaseURL: "https://train-scheduler-dc5da.firebaseio.com",
    storageBucket: "train-scheduler-dc5da.appspot.com",
    messagingSenderId: "410956871071"
  };
  firebase.initializeApp(config);

var dataRef = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = 0;
var nextTrain = "";
var minutesAway = 0;

// Capture Button Click
$("#addTrain").on("click", function() {

  // Getting the value from user input
  var trainName = $('#traininput').val().trim();
  var destination = $('#destinationinput').val().trim();
  var firstTrain = moment($('#firsttraintimeinput').val().trim(), "HH:mm").subtract(1,"years").format("X");
  var frequency = $('#frequencyinput').val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name:  trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  }

  // Uploads train data to the database
  dataRef.ref().push(newTrain);

  // Clears all of the text-boxes
  $("#traininput").val("");
  $("#destinationinput").val("");
  $("#firsttraintimeinput").val("");
  $("#frequencyinput").val("");


  // Don't refresh the page!
  return false;

});

// Function that adds trains to database
dataRef.ref().on("child_added", function(childSnapshot, prevChildKey) {

  //Create variables to store information
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  // Calculating minutes until arrival

  // Difference between the times
  var diffTime = moment().diff(moment.unix(tFirstTrain), "minutes");
   // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  // Minute Until Train
  var minutesAway = tFrequency - tRemainder;
  // Next Train
  var nextTrain = moment().add(minutesAway, "m").format("hh:mm A");

  console.log("DIFFERENCE IN TIME: " + diffTime);
  console.log(tRemainder);
  console.log("MINUTES TILL TRAIN: " + minutesAway);
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"))

  $("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code)
});
