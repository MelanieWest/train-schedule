
//name the data coming from the database
var trainData = firebase.database();

//send new 'trains' to the database. 
function submitTrain(){

    console.log("Clicked!");

    //extract information from the form
    var trainName = document.getElementById("trainName");
    var dest = document.getElementById("dest");
    var departureTime = document.getElementById("departureTime");
    var freq = document.getElementById("frequency");
    
    var newTrain = {
        name: trainName.value,
        destination: dest.value,
        firstTrain: departureTime.value,
        frequency: freq.value
      };
    
      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.firstTrain);
      console.log(newTrain.frequency);

    //right now auth is disabled
   
    //enter new train object to db
    trainData.ref().push(newTrain);

    //clear input boxes
    trainName.value = " ";
    dest.value = " ";
    departureTime.value = " ";
    freq.value = " ";

} 

//get the 'table' from the document and create some usable parts
const trainTable = document.getElementById("trainTable");

//get train data from the database:
//create Firebase event for adding trains to the page

trainData.ref().on("child_added", function(childSnapshot,prevChildKey){

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;

    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
    
    //If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {

      // Calculate the minutes until arrival using hardcore math
      // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
      // and find the modulus between the difference and the frequency.
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      // To calculate the arrival time, add the tMinutes to the currrent time
      tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
      console.log("tMinutes:", tMinutes);
      console.log("tArrival:", tArrival);

      // Add each train's data into the table

      var row =trainTable.insertRow(1);
      var cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);
      var cell4 = row.insertCell(4);

      cell0.innerHTML = tName;
      cell1.innerHTML = tDestination;
      cell2.innerHTML = tFrequency;
      cell3.innerHTML = tArrival;
      cell4.innerHTML = tMinutes;
      
});
