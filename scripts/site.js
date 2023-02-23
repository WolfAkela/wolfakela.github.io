const isLocal = location.origin == "file://";
const baseURL = isLocal
    ? "http://localhost:30287/api/Data"
    : "https://html.somee.com/api/Data";

function getJSON(path, callback) {
    fetch(`${baseURL}/${path}`)
        .then(resp => resp.json())
        .then(data => {
            callback && callback(data);
        });
}

function postJSON(path, data, callback) {
    const url = `${baseURL}/${path}`;

    if (isLocal) {
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            success: data => {
                callback && callback(data);
            }
        });

        return;
    }

    fetch(url, {
        method: 'POST',
        //mode: 'cors',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(resp => resp.json())
        .then(data => {
            callback && callback(data);
        });
}

function track() {
    postJSON("Track", null, data => { });
    //postJSON("Test", { test: 1 }, data => { });
}

if (isLocal) {
    let script = document.createElement('script');
    script.onload = function () {
        track();
    };
    script.integrity = "sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=";
    script.crossOrigin = "anonymous";
    script.src = "https://code.jquery.com/jquery-3.6.3.min.js";
    document.head.appendChild(script);
}
else {
    track();
}