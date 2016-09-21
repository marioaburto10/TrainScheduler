// Initialize Firebase
var config = {
    apiKey: "AIzaSyCdqCM6U9nemfghtlDZrpfiqVLjeN52ysU",
    authDomain: "train-scheduler-dc5da.firebaseapp.com",
    databaseURL: "https://train-scheduler-dc5da.firebaseio.com",
    storageBucket: "",
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
  var firstTrain = moment($('#firsttraintimeinput').val().trim(), "HH:mm").subtract(1,"years").format("HH:mm");
  var frequency = $('#frequencyinput').val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name:  trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  }

  // Uploads train data to the database
  trainData.ref().push(newTrain);

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
  var diffTime = moment().diff(moment(tFirstTrain), "minutes");
   // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  // Minute Until Train
  var minutesAway = tfrequency - tRemainder;
  // Next Train
  var nextTrain = moment().add(minutesAway, "minutes").format("HH:mm");

  console.log("DIFFERENCE IN TIME: " + diffTime);
  console.log(tRemainder);
  console.log("MINUTES TILL TRAIN: " + minutesAway);
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"))

  $("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tdestination + "</td><td>" + tfrequency + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code)
});
