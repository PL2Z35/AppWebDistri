# AppWebDistri
Web application using csv file from google drive, and performing database replication with Mysql

Public file link: https://docs.google.com/spreadsheets/d/1oC0UWEcWEsViyPTg-CsL5GfYJpu6nZ1CGAgBG3kkE1Y/edit?usp=sharing


Database replication configuration:
  |--https://blog.clicko.es/tutorial-replicacion-de-base-de-datos-mysql-master-to-slave/
  |--https://rm-rf.es/replicacion-mysql-maestro-esclavo/

Configuration:

|--src
  |--db
  |--|--database.js -> database configuration
  |--|--keys.js -> database connection keys
  |--public
  |--|--css
  |--|--styles.css -> page styles
  |--|--js
  |--|--script.js -> table lookup configuration and password button creation
  |--routes
  |--|--credentials.json -> credentials for connection with public CSV file
  |--|--login.js -> routes of the /login page and connection with google api
  |--|--search.js -> routes of the /search and /person page and connection with google api
  |--views
  |--|--main.hbs -> main view configuration with handlebars
  |--pages
  |--|--login.hbs -> login view
  |--|--person.hbs -> view after login
  |--|--search.hbs -> people list view
  |--partials
  |--|--modals.hbs -> user creation views
  |--|--navigation.hbs -> page navigation
  |--index.js -> server initialization and handlebars configuration
  

   
    
