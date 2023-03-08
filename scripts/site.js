const isLocal = location.origin == "file://";
const baseURL = isLocal
    ? "https://localhost:44377/api/Data"
    : "https://akela.somee.com/api/Data";

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

function sync() {
    postJSON("Sync", null, data => { });
}

sync();
