const baseURL = "https://html.somee.com/api";

function getJSON(path, callback){
    fetch(`${baseURL}/${path}`)
        .then(resp => resp.json())
        .then(data => {
            callback(data);
        });
}

getJSON("Data", data => {});
