const scripts = {}; // In-memory storage (Use a database for permanent storage)

exports.handler = async function(event) {
    if (event.httpMethod === "POST") {
        const { script, id } = JSON.parse(event.body);

        if (!script || !id) {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: "Invalid data" }) };
        }

        scripts[id] = script;
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    if (event.httpMethod === "GET") {
        const urlParts = event.path.split("/");
        const scriptId = urlParts[urlParts.length - 1];

        const cookies = event.headers.cookie || '';
        const userCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('user_id='));

        if (!userCookie || !userCookie.includes(scriptId) || !scripts[scriptId]) {
            return { statusCode: 404, body: "Not authorized or script not found." };
        }

        return { statusCode: 200, body: scripts[scriptId] };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
};
