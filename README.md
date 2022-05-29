# Weather Dashboard

This app allows a user to retrieve the current forcast and 5-day forcast for any city in the world. The app saves the previous 3 searches the user has made, adding the most recent search to the top of the list.

![Alt text](assets/images/weatherAppMockup.png?raw=true "App Mockup")

# API Calls
* https://api.openweathermap.org/data/2.5/weather
* https://api.openweathermap.org/data/2.5/forecast
* https://api.openweathermap.org/data/2.5/onecall
* http://openweathermap.org/img/w/

# Resources
* UV Index Source https://www.epa.gov/sites/default/files/documents/uviguide.pdf

# Future Enhancements 
* Only store and present sucessful search results as previous searches
* Display forcast for most recent search or current location on app open or where a given search request is invalid
* refactor the code so less is managed with click event and so less code is repeated for new and previous search buttons
* Use modals instead of alerts to display errors.
* find prettier images
* improve the wrap for 5-day forcast by transforming daily cards so they are wider when displayed on smaller viewports.

