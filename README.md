# Gift List
## Installation
This project requires [Node.js](https://nodejs.org/en/) and [PostgreSQL](http://www.postgresqltutorial.com/install-postgresql/) server instance.

**Step 1:**
Install or verify that both Node.js and PostgreSQL server are installed for your system. PostgreSQL server needs to be running for this application

**Step 2:**
Clone or download the project

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
# Database connection
process.env.DATABASE_URL = "postgres://localhost:5432"
# Front page access token for simple authentication:
process.env.ACCESS_TOKEN = "demo"
```
