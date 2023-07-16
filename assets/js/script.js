//Group-2 project-1 javascript code here

// Function to fetch flight information based on the selected date and airline
async function getFlightInfo(date, airline) {
    const ident = airline.toLowerCase(); // Get the airline identifier based on the selected airline
    
    const url = `https://flightera-flight-data.p.rapidapi.com/airline/flights?ident=${ident}&time=${date}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3717db3bafmsh3630d39920bf588p1025c6jsnd065f1276f3c',
        'X-RapidAPI-Host': 'flightera-flight-data.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);

      // Extract the flight number from the result (assuming it's in JSON format)
      const flightsData = JSON.parse(result);
      const flightNumber = flightsData[0].flightNumber;
      console.log("Flight Number:", flightNumber);

      // Call the function to fetch flight information using the obtained flight number
      fetchFlightDetails(flightNumber);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to fetch flight details based on the flight number
  async function fetchFlightDetails(flightNumber) {
    const url = `https://flightera-flight-data.p.rapidapi.com/flight/info?flnr=${flightNumber}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3717db3bafmsh3630d39920bf588p1025c6jsnd065f1276f3c',
        'X-RapidAPI-Host': 'flightera-flight-data.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);

      // Process the flight information and update the page
      const selectedRouteDetailsCard = document.querySelector(".card.card-height.shadow-lg");
      selectedRouteDetailsCard.innerHTML = result; // Replace with your logic to handle the flight information
    } catch (error) {
      console.error(error);
    }
  }

  // Event listener for datepicker
  const datepicker = document.getElementById("datepicker");
  datepicker.addEventListener("change", function() {
    const selectedDate = this.value;
    const selectedAirline = document.querySelector("#language-buttons .active").dataset.language;
    getFlightInfo(selectedDate, selectedAirline);
  });

  // Event listener for airline buttons
  const airlineButtons = document.querySelectorAll("#language-buttons button");
  airlineButtons.forEach(button => {
    button.addEventListener("click", function() {
      const selectedDate = datepicker.value;
      const selectedAirline = this.dataset.language;
      getFlightInfo(selectedDate, selectedAirline);
    });
  });