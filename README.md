# Gift List

Gift list is a easy to use application to manage the reservation of gifts for different occations (weddings, graduations etc). The idea is that guest can reserve the gift of their choosing without the fear of buying something that someone else has already bought. The app is intendended to be run in a web server.

The stack of this project is as follows:
  - Typescript for the server and the client
  - Node.js + Express.js for the server
  - Socket.io for "realtime" reservations
  - PostgreSQL for data storage
  - Vue 2+ for the client
  - Webpack 3+ to manage build processes

### To Do:
* Support for multiple languages
* Admin tools (add, remove, edit gifts from the site)
* Unit tests, more documentation

## Installation
This project requires [Node.js](https://nodejs.org/en/) and [PostgreSQL](http://www.postgresqltutorial.com/install-postgresql/) server instance.

**Step 1:**
Install or verify that both Node.js and PostgreSQL server are installed for your system. PostgreSQL server needs to be running for this application. Use DATABASE_URL environment variable for setting the connection url and auth, default values are already set to launch:dev npm task.

**Step 2:**
Clone or download the project. Edit the gifts you wish to have in the application by editing **/src/server/configuration/content.json** directly.

**Step 3:**
Run these commands:

```sh
# Install dependencies:
$ npm i

# Build the project:
$ npm run build

# Launch the app:
$ npm run launch
```
**Step 4:**
Navigate to [localhost:3000](localhost:3000). Default password is "demo".


### Other scripts

```sh
# Watch for changes in both client and server code and rebuild automatically:
$ npm run watch

# Build a production version of the app. This minifies code and packs it with gzip
$ npm run build:prod
```
### Environment variables with associated default values
These can be provided when launching the production version of the app:
```sh
ACCESS_TOKEN=my_token DATABASE_URL=my_url node ./dist/server.js
```
```sh
# Database connection string. Development database connection string can also be edited directly to launch:dev npm task
process.env.DATABASE_URL = "postgres://localhost:5432"
# Front page access token for simple authentication
process.env.ACCESS_TOKEN = "demo"
```
