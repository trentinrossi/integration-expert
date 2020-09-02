<h1>
  Integration Expert Test
</h1>

# Technical test project by Rodrigo Rossi

<p>
  <a href="https://www.linkedin.com/in/rodrigorossi/" rel="nofollow noreferrer">
    <img src="https://i.stack.imgur.com/gVE0j.png" alt="linkedin"> LinkedIn
  </a> &nbsp;
  <a href="https://github.com/trentinrossi" rel="nofollow noreferrer">
    <img src="https://i.stack.imgur.com/tskMh.png" alt="github"> Github
  </a>
</p>

## Requirements

- **Axios** - Promise based HTTP client for the browser and node.js
- **Express** - Fast, unopinionated, minimalist web framework
- **Mongoose** - Mongoose MongoDB ODM
- **Node Cron** - A simple cron-like task scheduler for Node.js
- **Xmlbuilder2** - An XML builder for node.js

## Getting started

1. First you need to have `node` and `yarn` installed on your machine. Then, you need to get API_TOKEN from Pipedrive and Bling.
2. Create a MongoDB Database Collection to store data, you can to choose:

- Create an account in [MongoDB Atlas](https://cloud.mongodb.com).
- Run inside a Docker, then run the following command `docker run --name mongo-integration-expert -p 27017:27017 -d -t mongo`
- Add the created connection string in src/database.index.js.

3. Run the following commands inside the project folder: `yarn start`

## Endpoints

| Path         | Method | Headers                         | Body                                                                                      | Description                                                            |
| ------------ | ------ | ------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| /start       | POST   | bling_token<br> pipedrive_token | domain (Pipedrive domain)<br> interval (Seconds to run the scheduled job for integration) | Start a scheduled job for integration                                  |
| /stop        | POST   |                                 |                                                                                           | Stop the current job                                                   |
| /status      | GET    |                                 |                                                                                           | Get a status of the current job                                        |
| /opportunity | GET    |                                 |                                                                                           | Get a aggregated opportunities stored in Bling by day and total amount |
