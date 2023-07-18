// Group-2 project-1 javascript code here
// Function to fetch flight information based on the selected date and airline

function getFlightInfo(date, airline) {
    var ident = airline.toLowerCase();

    var url = 'https://flightera-flight-data.p.rapidapi.com/airline/flights?ident=' + ident + '&time=' + date;
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3717db3bafmsh3630d39920bf588p1025c6jsnd065f1276f3c',
            'X-RapidAPI-Host': 'flightera-flight-data.p.rapidapi.com'
        }
    };

    try {
        fetch(url, options).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);

            // Process the flight information and update the page
            var flightData = result.data;

            var flightTable = document.createElement('table');
            flightTable.classList.add('flight-table');

            // Create the table headers
            var tableHeaders = document.createElement('tr');
            tableHeaders.innerHTML = '<th>Flight#</th><th>Date</th><th>Departure</th><th>Destination</th><th>Status</th>';
            flightTable.appendChild(tableHeaders);

            // Populate the table rows with flight information
            flightData.forEach(function (flight) {
                var flightRow = document.createElement('tr');
                flightRow.innerHTML = '<td>' + flight.ident + '</td><td>' + flight.date + '</td><td>' + flight.departure + '</td><td>' + flight.destination + '</td><td>' + flight.status + '</td>';
                flightTable.appendChild(flightRow);
            });

            // Find the "Routes" div card-body element
            var routesDiv = document.querySelector('.card-body h6:contains("Routes")');
            
            // Append the flight table to the routesDiv
            routesDiv.appendChild(flightTable);
        }).catch(function (error) {
            console.error(error);
        });
    } catch (error) {
        console.error(error);
    }
}

// Function to fetch flight details based on the ident code
var datetimepicker = document.getElementById("datetimepicker");

function getFlightInfo(date, airline) {
    var ident = airline.toLowerCase();

    var url = 'https://flightera-flight-data.p.rapidapi.com/airline/flights?ident=' + ident + '&time=' + date;
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3717db3bafmsh3630d39920bf588p1025c6jsnd065f1276f3c',
            'X-RapidAPI-Host': 'flightera-flight-data.p.rapidapi.com'
        }
    };

    try {
        fetch(url, options).then(function (response) {
            return response.text();
        }).then(function (result) {
            console.log(result);
            // Processes the flight information and updates the page
            var selectedRouteDetailsCard = document.querySelector(".card.card-height.shadow-lg");
            selectedRouteDetailsCard.innerHTML = result; 
        }).catch(function (error) {
            console.error(error);
        });
    } catch (error) {
        console.error(error);
    }
}

// Event listener for datetimepicker
datetimepicker.addEventListener("change", function () {
    var selectedDate = this.value;
    var selectedAirline = document.querySelector("#language-buttons button.selected")?.dataset.language;
    if (selectedAirline) {
        getFlightInfo(selectedDate, selectedAirline);
    }
});

// Event listener for airline buttons
var airlineButtons = document.querySelectorAll("#language-buttons button");
airlineButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        airlineButtons.forEach(function (btn) {
            return btn.classList.remove("selected");
        });
        this.classList.add("selected");

        var selectedDate = datetimepicker.value;
        var selectedAirline = this.dataset.language;
        getFlightInfo(selectedDate, selectedAirline);
    });
});
