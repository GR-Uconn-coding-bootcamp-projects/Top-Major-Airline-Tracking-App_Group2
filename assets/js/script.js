// Group-2 project-1 javascript code here
// Function to fetch flight information based on the selected date and airline

async function getFlightInfo(date, airline) {
    const iata = airline.toLowerCase();

    const url = `https://flightera-flight-data.p.rapidapi.com/airline/search?iata=${iata}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3717db3bafmsh3630d39920bf588p1025c6jsnd065f1276f3c',
            'X-RapidAPI-Host': 'flightera-flight-data.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        // Check if result.data has at least one element
        if (result.data && result.data.length > 0) {
            // Extract the airline identifier from the result
            const ident = result.data[0].ident;
            console.log("Airline Identifier:", ident);

            fetchFlightDetails(ident);
        } else {
            console.log("No airline data found.");
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to fetch flight details based on the ident code
const datetimepicker = document.getElementById("datetimepicker");

async function getFlightInfo(date, airline) {
    const ident = airline.toLowerCase();

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
        // Process the flight information and update the page
        const selectedRouteDetailsCard = document.querySelector(".card.card-height.shadow-lg");
        selectedRouteDetailsCard.innerHTML = result; // Replace with your logic to handle the flight information
    } catch (error) {
        console.error(error);
    }
}

// Event listener for datetimepicker
datetimepicker.addEventListener("change", function () {
    const selectedDate = this.value;
    const selectedAirline = document.querySelector("#language-buttons button.selected")?.dataset.language;
    if (selectedAirline) {
      getFlightInfo(selectedDate, selectedAirline);
    }
  });
  
  // Event listener for airline buttons
  const airlineButtons = document.querySelectorAll("#language-buttons button");
  airlineButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove the "selected" class from all buttons
      airlineButtons.forEach((btn) => btn.classList.remove("selected"));
  
      // Add the "selected" class to the clicked button
      this.classList.add("selected");
  
      const selectedDate = datetimepicker.value;
      const selectedAirline = this.dataset.language;
      getFlightInfo(selectedDate, selectedAirline);
    });
  });
  