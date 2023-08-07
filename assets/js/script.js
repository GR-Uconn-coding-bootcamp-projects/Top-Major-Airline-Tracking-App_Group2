// Group-2 project-1 javascript code here

// Function to fetch airport information based on airport identifier
function getAirportInfo(arrival_ident) {
  // const apiKey = 'a320bbe97dmsh564ceed6c7f475dp1e974cjsn74528ca1271f';
  const url = `https://flightera-flight-data.p.rapidapi.com/airport/info?ident=${encodeURIComponent(arrival_ident)}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'a320bbe97dmsh564ceed6c7f475dp1e974cjsn74528ca1271f',
      'X-RapidAPI-Host': 'flightera-flight-data.p.rapidapi.com'
    }
  };

  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Extract the name, city, and country from the first entry in the result array
      const name = data[0].name;
      const city = data[0].city;
      const country = data[0].country;

      // Return an object with the name, city, and country properties
      return { name, city, country };
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

// Function to fetch flight information based on the selected date and airline
function getFlightInfo(date, airline, limit = 15) {
  var ident = airline.toLowerCase();

  var url =
    "https://flightera-flight-data.p.rapidapi.com/airline/flights?time=" +
    date +
    "&ident=" +
    ident +
    "&limit=" + limit;
  var options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "a320bbe97dmsh564ceed6c7f475dp1e974cjsn74528ca1271f",
      "X-RapidAPI-Host": "flightera-flight-data.p.rapidapi.com",
    },
  };

  return fetch(url, options)
    .then(response => response.json())
    .then(async result => {
      console.log("API response:", result); // Log the API response

      // Process the flight information and replace identifiers with names
      const flightsWithAirportNames = await Promise.all(
        result.flights.slice(0, limit).map(async flight => {
          const departureInfo = await getAirportInfo(flight.departure_ident);
          const destinationInfo = await getAirportInfo(flight.arrival_ident);
          return {
            ...flight,
            departure_ident: departureInfo.name,
            departure_city: departureInfo.city,
            departure_country: departureInfo.country,
            arrival_ident: destinationInfo.name,
            arrival_city: destinationInfo.city,
            arrival_country: destinationInfo.country,
          };
        })
      );

      // Return the data with airport names
      return flightsWithAirportNames;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

function displayFlightData(flightData, flightTableElement, airlineName) {
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
      '<p class="text-center">No flight information available for ' + airlineName + '.</p>';
  }
}

async function getWeatherInfo(cityName, countryCode) {
  const apiKey = 'fe4b0b9029bdf3ee27d36bbdc8d8bf37';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Extract the desired weather information
    const temperatureKelvin = data.main.temp;
    const temperatureFahrenheit = Math.round((temperatureKelvin - 273.15) * 9 / 5 + 32);
    const humidity = data.main.humidity;
    const windSpeedMetersPerSec = data.wind.speed;
    const windSpeedMph = Math.round(windSpeedMetersPerSec * 2.237);
    const feelsLikeKelvin = data.main.feels_like;
    const feelsLikeFahrenheit = Math.round((feelsLikeKelvin - 273.15) * 9 / 5 + 32);
    const weatherIcon = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;

    // Return an object with the weather data, including the temperature in Fahrenheit
    return {
      temperature: temperatureFahrenheit,
      humidity,
      windSpeed: windSpeedMph,
      feelsLike: feelsLikeFahrenheit,
      weatherIcon,
      weatherDescription,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to display selected flight details in the "Selected Flight Destination Details" card
function displaySelectedFlightDetails(selectedFlight, selectedAirline) {
  document.getElementById('selectedAirlineName').innerText = selectedAirline;
  document.getElementById('selectedFlightName').innerText = selectedFlight.flnr;
  document.getElementById('selectedAirportName').innerText = selectedFlight.arrival_ident;
  document.getElementById('selectedFlightCity').innerText = selectedFlight.arrival_city;
  document.getElementById('selectedFlightCountry').innerText = selectedFlight.arrival_country;

  // Fetch weather information and display it
  getWeatherInfo(selectedFlight.arrival_city, selectedFlight.arrival_country)
    .then(weatherInfo => {
      // Display weather information
      document.getElementById('selectedFlightTemperature').innerText = weatherInfo.temperature + ' °F';
      document.getElementById('selectedFlightHumidity').innerText = weatherInfo.humidity + ' %';
      document.getElementById('selectedFlightWindSpeed').innerText = weatherInfo.windSpeed + ' mph';
      document.getElementById('selectedFlightFeelsLike').innerText = weatherInfo.feelsLike + ' °F';
      document.getElementById('selectedFlightWeatherIcon').src = 'http://openweathermap.org/img/w/' + weatherInfo.weatherIcon + '.png';
      document.getElementById('selectedFlightWeatherDescription').innerText = weatherInfo.weatherDescription;

      // Ensure the data is saved in local storage
      localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
    })
    .catch(error => {
      console.error(error);
      document.getElementById('selectedFlightTemperature').innerText = 'N/A';
      document.getElementById('selectedFlightHumidity').innerText = 'N/A';
      document.getElementById('selectedFlightWindSpeed').innerText = 'N/A';
      document.getElementById('selectedFlightFeelsLike').innerText = 'N/A';
      document.getElementById('selectedFlightWeatherIcon').src = '';
      document.getElementById('selectedFlightWeatherDescription').innerText = 'N/A';
    });
}

// Function to save the selected flight data to localStorage
function saveSelectedFlightData(selectedFlight) {
  localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
}

// Function to retrieve the last selected flight data from localStorage on page load
function getStoredFlightData() {
  const storedFlightData = localStorage.getItem('selectedFlight');
  return storedFlightData ? JSON.parse(storedFlightData) : null;
}

// Function to handle button click event
function handleButtonClick(airlineName) {
  var selectedDate = datetimepicker.value;
  var selectedAirline = this.dataset.language;

  // Update the selected button style
  airlineButtons.forEach(function (button) {
    button.classList.remove("selected");
  });
  this.classList.add("selected");

  // Find the flight table element
  var flightTableElement = document.getElementById("flightTable");

  // Find the routes card-content element
  var routesCardContent = document.querySelector(".card.mb-4.p-4 .card-content");

  // Clear any existing flight data and previous airline title
  flightTableElement.innerHTML = "";
  var previousAirlineTitle = routesCardContent.querySelector("h6");
  if (previousAirlineTitle) {
    routesCardContent.removeChild(previousAirlineTitle);
  }

  // Display the airline name as an h6 title within the routes card-content
  var airlineTitle = document.createElement("h6");
  airlineTitle.innerText = "Flights for " + airlineName;
  airlineTitle.classList.add("airline-title"); // Add the custom CSS class

  // Check if the routes card-content exists before inserting the title
  if (routesCardContent) {
    // Insert the airline title at the beginning of the routes card-content
    routesCardContent.insertBefore(airlineTitle, routesCardContent.firstChild);
  }

  // Display loading message while fetching flight data
  flightTableElement.innerHTML =
    '<p class="text-center">Loading flight information for ' + airlineName + '...</p>';

  // Fetch flight data and display it
  getFlightInfo(selectedDate, selectedAirline)
    .then(function (flightData) {
      // Display the flight data
      displayFlightData(flightData, flightTableElement, airlineName);
      // Add click event listener to flnr links
      const flnrLinks = document.querySelectorAll('a[href="#"]');
      flnrLinks.forEach(link => {
        link.addEventListener('click', function (event) {
          event.preventDefault();
          const flnr = this.innerText;

          // Find the selected flight from the flightData
          const selectedFlight = flightData.find(flight => flight.flnr === flnr);
          if (selectedFlight) {
            // Call the displaySelectedFlightDetails function with airlineName
            displaySelectedFlightDetails(selectedFlight, airlineName);

            // Save the selected flight data to localStorage
            saveSelectedFlightData(selectedFlight);
          }
        });
      });
    })
    .catch(function (error) {
      console.error(error);
      flightTableElement.innerHTML =
        '<p class="text-center">Failed to fetch flight information.</p>';
    });

  // Load stored flight data on page load
  document.addEventListener('DOMContentLoaded', function () {
    const storedFlightData = getStoredFlightData();
    if (storedFlightData) {
      // Call the displaySelectedFlightDetails function with airlineName
      displaySelectedFlightDetails(storedFlightData, airlineName);
    }
  });
}

// Event listener for airline buttons
var airlineButtons = document.querySelectorAll("#language-buttons button");

airlineButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    handleButtonClick.call(this, button.innerText);
  });
});