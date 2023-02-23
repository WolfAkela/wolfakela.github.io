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
    $.ajax({
        url: `${baseURL}/${path}`,
        type: "POST",
        data: data,
        success: data => {
            callback && callback(data);
        }
    });
}

function track() {
    postJSON("Track", null, data => { });
}

track();