async function obfuscateAndSave() {
    let luaCode = document.getElementById("luaCode").value;
    if (!luaCode.trim()) {
        alert("Please enter a Lua script.");
        return;
    }

    let obfuscatedCode = tripleObfuscateLuaCode(luaCode);
    let randomId = generateRandomString(14);

    document.cookie = "user_id=" + randomId + "; path=/; max-age=31536000"; // Store user cookie for 1 year

    let response = await fetch('/.netlify/functions/save-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: obfuscatedCode, id: randomId })
    });

    let data = await response.json();
    if (data.success) {
        let rawUrl = window.location.origin + "/raw/" + randomId;
        document.getElementById("outputBox").innerHTML = `Your script:<br><code>loadstring(game:HttpGet("${rawUrl}",true))()</code>`;
        document.getElementById("outputBox").style.display = "block";
    } else {
        alert("Error saving script.");
    }
}

function tripleObfuscateLuaCode(code) {
    return obfuscateLuaCode(obfuscateLuaCode(obfuscateLuaCode(code)));
}

function obfuscateLuaCode(code) {
    return code.replace(/\b(\w+)\b/g, match => "_" + generateRandomString(6))
               .replace(/"([^"]*)"/g, (match, p1) => '"' + encodeString(p1) + '"');
}

function encodeString(str) {
    return str.split("").map(char => "\\" + char.charCodeAt(0)).join("");
}

function generateRandomString(length = 14) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}
