function obfuscateCode() {
    let code = document.getElementById("luaCode").value;
    let randomCode = generateRandomString();
    let obfuscatedCode = createLoadstring(tripleObfuscateLuaCode(code));

    // Set cookie to track user
    document.cookie = "user_id=" + randomCode + "; path=/; max-age=31536000"; // 1 year expiration

    // Simulate saving the code to backend (e.g., Netlify Function) and returning the unique URL
    fetch('/.netlify/functions/save-script', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userCode: obfuscatedCode, userId: randomCode })
    })
    .then(response => response.json())
    .then(data => {
        let rawUrl = window.location.origin + "/raw/" + randomCode;
        document.getElementById("obfuscatedCode").textContent = `loadstring(game:HttpGet("${rawUrl}",true))()`;
        document.getElementById("outputContainer").style.display = "block";
    })
    .catch(error => console.error('Error saving script:', error));
}

// Triple obfuscation process
function tripleObfuscateLuaCode(code) {
    let obf1 = obfuscateLuaCode(code);
    let obf2 = obfuscateLuaCode(obf1);
    let obf3 = obfuscateLuaCode(obf2);
    return obf3;
}

function obfuscateLuaCode(code) {
    // Rename variables with random names using gsub-like regex
    code = code.replace(/\b(\w+)\b/g, function(match) {
        return '_' + generateRandomString(8);
    });

    // Encode strings in a complex way
    code = code.replace(/"([^"]*)"/g, function(match, p1) {
        return '"' + encodeString(p1) + '"';
    });

    return code;
}

function encodeString(str) {
    let encoded = "";
    for (let i = 0; i < str.length; i++) {
        encoded += "\\" + str.charCodeAt(i);
    }
    return encoded;
}

// Generate a random string for the URL path
function generateRandomString(length = 14) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}