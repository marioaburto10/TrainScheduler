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
  var firstTrain = $('#firsttraintimeinput').val().trim();
  var frequency = $('#frequencyinput').val().trim();

  // First Train (pushed back 1 year to make sure it comes before current time)
  var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);
  // Minute Until Train
  var minutesAway = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesAway);
  // Next Train
  var nextTrain = moment().add(minutesAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"))

  //Code for push
  dataRef.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    nextTrain: nextTrain,
    minutesAway: minutesAway
  });
  // Don't refresh the page!
  return false;

});

//Firebase watcher + initial loader
dataRef.ref().on("child_added", function(childSnapshot) {

  $("#trainTable > tbody").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + childSnapshot.val().nextTrain + "</td><td>" + childSnapshot.val().minutesAway + "</td></tr>");

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code)
});

dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
  // Change the HTML to reflect
   $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");
})