const { GraphQLClient } = require('graphql-request');

const client = new GraphQLClient(process.env.graphQlUrl, {
    headers: {
        "X-Niftory-API-Key": process.env.niftoryApiKey,
        "X-Niftory-Client-Secret": process.env.niftoryClientSecret,
    },
});

module.exports = client;