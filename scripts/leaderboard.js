function start() {
    let divLeaderboard = document.getElementById("div-leaderboard");

    getJSON("GetWinners", data => {
        if (!data.IsSuccessful) {
            alert(data.Message);
            return;
        }

        if (data.Data.length) {
            for (let i = 0; i < data.Data.length; i++) {
                let winner = data.Data[i];
                divLeaderboard.innerHTML += `<div class="col-md-12"><h6>Խաղ ${i} (${winner.GameName}) - պատասխանը՝ «${winner.Answer}» | հաղթողը՝ «${winner.WinnerName}»</h6></div>`;
            }
        }
        else {
            divLeaderboard.innerHTML = '<div class="col-md-12"><h3>Շուտով․․․</h3></div>';
        }
    });
}
