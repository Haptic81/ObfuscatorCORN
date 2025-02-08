const { parse } = require('querystring');

// Simple in-memory storage for user data
const scriptStore = {};

exports.handler = async function(event, context) {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const { userCode, userId } = body;

        // Save the script code under a unique user ID (could be a database)
        scriptStore[userId] = userCode;

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Script saved successfully' })
        };
    }

    // Return the saved script if the user is authorized
    if (event.httpMethod === 'GET') {
        const { userId } = event.queryStringParameters;
        const cookies = event.headers.cookie || '';
        const userCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('user_id='));

        if (!userCookie || !userCookie.includes(userId)) {
            return {
                statusCode: 404,
                body: 'Not authorized'
            };
        }

        const userScript = scriptStore[userId];
        if (userScript) {
            return {
                statusCode: 200,
                body: userScript
            };
        }

        return {
            statusCode: 404,
            body: 'Script not found'
        };
    }

    return {
        statusCode: 405,
        body: 'Method Not Allowed'
    };
};