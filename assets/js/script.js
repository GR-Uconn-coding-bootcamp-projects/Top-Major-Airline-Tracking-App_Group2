// Group-2 project-1 javascript code here

// Function to fetch flight information based on the selected date and airline
function getFlightInfo(date, airline) {
  var ident = airline.toLowerCase();

  var url =
    "https://flightera-flight-data.p.rapidapi.com/airline/flights?ident=" +
    ident +
    "&time=" +
    date;
  var options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "3717db3bafmsh3630d39920bf588p1025c6jsnd065f1276f3c",
      "X-RapidAPI-Host": "flightera-flight-data.p.rapidapi.com",
    },
  };

  return fetch(url, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log("API response:", result); // Log the API response

      // Process the flight information and return the data
      return result.flights; // Return the "flights" property from the result object
    })
    .catch(function (error) {
      console.error(error);
      throw error;
    });
}

function displayFlightData(flightData, flightTableElement) {
  // Clear any existing flight data
  flightTableElement.innerHTML = "";

  if (flightData && flightData.length > 0) {
    // Create the flight table
    var flightTable = document.createElement("table");
    flightTable.classList.add("table"); // Add the "table" class for Bootstrap styling

    // Create the table headers
    var tableHeaders = document.createElement("tr");
    tableHeaders.innerHTML =
      '<th>Flight#</th><th>Date</th><th>Departure</th><th>Destination</th><th>Status</th>';
    flightTable.appendChild(tableHeaders);

    // Populate the table rows with flight information
    flightData.forEach(function (flight) {
      var flightRow = document.createElement("tr");
      flightRow.innerHTML =
        "<td>" +
        flight.flnr +
        "</td><td>" +
        flight.date +
        "</td><td>" +
        flight.departure_ident +
        "</td><td>" +
        flight.arrival_ident +
        "</td><td>" +
        flight.status +
        "</td>";
      flightTable.appendChild(flightRow);
    });

    // Append the flight table to the flightTableElement
    flightTableElement.appendChild(flightTable);
  } else {
    // If no flight data available, display a message within the table
    flightTableElement.innerHTML = '<p class="text-center">No flight information available.</p>';
  }
}

// Function to handle button click event
function handleButtonClick() {
  var selectedDate = datetimepicker.value;
  var selectedAirline = this.dataset.language;

  // Update the selected button style
  airlineButtons.forEach(function (button) {
    button.classList.remove("selected");
  });
  this.classList.add("selected");

  // Find the flight table element
  var flightTableElement = document.getElementById("flightTable");

  // Clear any existing flight data
  flightTableElement.innerHTML = "";

  // Display loading message while fetching flight data
  flightTableElement.innerHTML = '<p class="text-center">Loading flight information...</p>';

  // Fetch flight data and display it
  getFlightInfo(selectedDate, selectedAirline)
    .then(function (flightData) {
      // Display the flight data
      displayFlightData(flightData, flightTableElement); // Pass flightData directly to displayFlightData
    })
    .catch(function (error) {
      console.error(error);
      flightTableElement.innerHTML = '<p class="text-center">Failed to fetch flight information.</p>'; // Display error message
    });
}

// Event listener for airline buttons
var airlineButtons = document.querySelectorAll("#language-buttons button");

airlineButtons.forEach(function (button) {
  button.addEventListener("click", handleButtonClick);
});
