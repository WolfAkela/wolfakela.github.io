function start() {
    let divLeaderboard = document.getElementById("div-leaderboard");

    getJSON("GetWinners", data => {
        if (!data.IsSuccessful) {
            alert(data.Message);
            return;
        }

        if (data.Data.length) {
            divLeaderboard.innerHTML = "";
            for (let i = 0; i < data.Data.length; i++) {
                let winner = data.Data[i];
                divLeaderboard.innerHTML += `<div class="col-md-12"><h6>Խաղ ${i} (${winner.GameName}) - պատասխանը՝ «${winner.Answer}» | հաղթողը՝ «${winner.WinnerName}»</h6></div>`;
            }
        }
        else {
            divLeaderboard.innerHTML = '<div class="col-md-12"><h3>Հաղթողների ցուցակը կհայտնվի այստեղ, երբ խաղում գոնե մեկ հաղթող լինի։</h3></div>';
        }
    });
}
