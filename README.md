#node-start

Starting point for nodejs application. Simply make a copy-> npm install-> bower install and begin your nodejs application.
Logging is included via the [node-bunyan](https://github.com/trentm/node-bunyan) logging library, and settings for logging etc. are accessable in the config.js. Application uses the [expressjs](http://expressjs.com/) framework. A viewer is included for the log files and leverages the AngularJS 1.4 framework.

##Getting Started

0. Modify settings in the config.js file

    * forks (int) - number of forks to create of the application (you should probably keep this at or below the number of cpu cores on      the machine. Remove to use all cpu cores)
    * forkRecoveryAttempts (int) - number of times to try restarting crashed forks
    * port (int) - port which application is to listen on
    * requestLogging (boolean) - if you want the application to log each request received
    * uppercaseQueries (boolean) - if you want queries on the URL to be uppercased when received
    * allowCors (boolean) - to allow cross site request (necessary if you host services in a seperate application from the view)
    * logging (object) - these setting are for readying the bunyan logging library, refer to [node-bunyan](https://github.com/trentm/node-bunyan) site for configuration options
    * logging.directory (string) - where log files will be written so user must have write permissions to this directory
    * logging.getLogFiles (string) - rest enpoint where the log view can request the available log files
    * logging.getLogFile (string) - rest endpoint where the log view can request a particular log file by name. **Must have a /:filename parameter in url path**

0. Modify settings in ./www/js/settings.js
    
    * localserver (string) - just points to the local machine and correct port (eg: http://localhost:[port])
    * getLogFiles (string) - matches the enpoint of same name from the config.js file
    * getLogFile (string) - matches the endpoint of same name from the config.js file

0. Start the app (type 'node server' in a terminal from within your base directory)


THAT'S IT! You are now running a nodejs application. To verify it is up and running you can navigate to http://[yourIp]:[port]/logs and you should see the log viewer!
