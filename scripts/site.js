const isLocal = location.origin == "file://";
const baseURL = isLocal
    ? "https://localhost:44377/api/Data"
    : "https://akela.somee.com/api/Data";
const user = {};
const minutesUntilNextAnswer = 15;

const divNavbar = document.getElementById("navbarCollapse");
const divLoading = document.getElementById("div-loading");

function getJSON(path, callback) {
    divLoading.classList.remove("d-none");

    fetch(`${baseURL}/${path}`)
        .then(resp => resp.json())
        .then(data => {
            divLoading.classList.add("d-none");

            callback && callback(data);
        });
}

function postJSON(path, data, callback) {
    divLoading.classList.remove("d-none");

    $.ajax({
        url: `${baseURL}/${path}`,
        type: "POST",
        data: data,
        success: data => {
            divLoading.classList.add("d-none");

            callback && callback(data);
        }
    });
}

function sync() {
    postJSON("Sync", null, data => {
        if (!data) {
            console.warn("Unable to sync user.");
            return;
        }

        if (!data.IsSuccessful) {
            console.warn(data.Message);
            return;
        }

        user.name = data.Data;
        if (user.name) {
            var divUser = document.createElement("div");
            divUser.innerText = `Բարև ${user.name}`;
            divUser.classList.add("text-light");
            divNavbar.appendChild(divUser);
        }

        typeof start === 'function' && start();
    });
}

sync();
