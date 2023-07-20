// Group-2 project-1 javascript code here

// Function to fetch airport information based on airport identifier
async function getAirportInfo(ident) {
  var url = 'https://flightera-flight-data.p.rapidapi.com/airport/info?ident=' + ident;
  var options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f7d877680dmsha7feb8c863ba1bbp1af32djsn15b6469abb35',
      'X-RapidAPI-Host': 'flightera-flight-data.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    // Return only the name of the airport from the first entry in the result array
    return result[0].name;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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
    .then(async function (result) {
      console.log("API response:", result); // Log the API response

      // Process the flight information and replace identifiers with names
      const flightsWithAirportNames = await Promise.all(
        result.flights.map(async (flight) => {
          const departureName = await getAirportInfo(flight.departure_ident);
          const destinationName = await getAirportInfo(flight.arrival_ident);
          return {
            ...flight,
            departure_ident: departureName,
            arrival_ident: destinationName,
          };
        })
      );

      // Return the data with airport names
      return flightsWithAirportNames;
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
    flightTable.classList.add("table"); 

    // Create the table headers
    var tableHeaders = document.createElement("tr");
    tableHeaders.innerHTML =
      "<th>Flight#</th><th>Date</th><th>Departure</th><th>Destination</th><th>Status</th>";
    flightTable.appendChild(tableHeaders);

    // Populate the table rows with flight information
    flightData.forEach(function (flight) {
      var flightRow = document.createElement("tr");
      flightRow.innerHTML =
        "<td><a href='#'>" +
        flight.flnr +
        "</a></td><td>" +
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
    flightTableElement.innerHTML =
      '<p class="text-center">No flight information available.</p>';
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
  flightTableElement.innerHTML =
    '<p class="text-center">Loading flight information...</p>';
  // API for weather
  function getWeather(cityName) {
    var url =
      "https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid={API key}";
  }

  // Fetch flight data and display it
  getFlightInfo(selectedDate, selectedAirline)
    .then(function (flightData) {
      // Display the flight data
      displayFlightData(flightData, flightTableElement); // Pass flightData directly to displayFlightData
    })
    .catch(function (error) {
      console.error(error);
      flightTableElement.innerHTML =
        '<p class="text-center">Failed to fetch flight information.</p>'; // Display error message
    });
}

// Event listener for airline buttons
var airlineButtons = document.querySelectorAll("#language-buttons button");

airlineButtons.forEach(function (button) {
  button.addEventListener("click", handleButtonClick);
});