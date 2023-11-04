const isLocal = location.origin == "file://";
const baseURL = isLocal
    ? "https://localhost:44377/api/Data"
    : "https://akela.somee.com/api/Data";
const user = {};
const minutesUntilNextAnswer = 15;

const divNavbar = document.getElementById("navbarCollapse");
const divLoading = document.getElementById("div-loading");

function searchToObject() {
    var search = location.search.substring(1);
    return search && JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') || {};
}

function getJSON(path, callback) {
    if (path != "GetAllGames") {
        divLoading.classList.remove("d-none");
    }

    fetch(`${baseURL}/${path}`)
        .then(resp => resp.json())
        .then(data => {
            if (path != "GetAllGames") {
                divLoading.classList.add("d-none");
            }

            callback && callback(data);
        });
}

function postJSON(path, data, callback) {
    if (path != "Sync") {
        divLoading.classList.remove("d-none");
    }

    $.ajax({
        url: `${baseURL}/${path}`,
        type: "POST",
        data: data,
        success: data => {
            if (path != "Sync") {
                divLoading.classList.add("d-none");
            }

            callback && callback(data);
        }
    });
}

function buildMenu() {
    let ddlGames = document.getElementById("ddl-games");

    let li = document.createElement("li");
    li.id = "li-id";
    li.innerHTML = '<a class="dropdown-item">Սպասեք...</a>';

    ddlGames.prepend(li);

    getJSON("GetAllGames", data => {
        if (!data) {
            console.warn("Unable to build menu.");
            return;
        }

        if (!data.IsSuccessful) {
            console.warn(data.Message);
            return;
        }

        document.getElementById("li-id").remove();
        for (let i = data.Data.length - 1; i >= 0; i--) {
            let game = data.Data[i];
            
            li = document.createElement("li");
            li.innerHTML = `<a class="dropdown-item" href="game.html?number=${i}&id=${game.ID}">🎮 Խաղ ${i} (${game.Name})</a>`;

            ddlGames.prepend(li);
        }
        
        let searchObject = searchToObject();
        if (typeof searchObject.number !== undefined) {
            ddlGames.children[searchObject.number].querySelector("a").classList.add("active");
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

buildMenu();
sync();
