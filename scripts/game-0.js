function start() {
    let txtUsername = document.getElementById("txt-username");
    let btnSave = document.getElementById("btn-save");
    let divNoName = document.getElementById("div-no-name");
    let divGame = document.getElementById("div-game");
    let divQuestions = document.getElementById("div-questions");
    let divAnswer = document.getElementById("div-answer");
    let txtAnswer = document.getElementById("txt-answer");
    let btnAnswer = document.getElementById("btn-answer");

    function setName() {
        if (txtUsername.value.length < 3 || txtUsername.value.length > 32) {
            alert("Անունի երկարությունը պետք է լինի [3, 32] միջակայքում։");
            return;
        }

        postJSON(`SetMemberName?name=${txtUsername.value}`, null, data => {
            if (!data.IsSuccessful) {
                alert(data.Message);
                return;
            }

            location.reload();
        });
    }

    txtUsername.addEventListener("keydown", e => {
        if (e.key != "Enter") {
            return;
        }

        setName();
    });

    btnSave.addEventListener("click", setName);

    txtUsername.value = user.name;

    if (!user.name) {
        divNoName.classList.remove("d-none");
        return;
    }

    getJSON("GetCurrentGame", data => {
        if (!data.IsSuccessful) {
            alert(data.Message);
            return;
        }

        divGame.classList.remove("d-none");

        for (let i = 1; i <= data.Data.Questions.length; i++) {
            let question = data.Data.Questions[i - 1];
            let leftPart = question.Answer 
                ? `<input type="text" class="form-control bg-light" readonly value="${question.Answer}" />` 
                : '<input type="text" class="form-control" />';
            let rightPart = question.Answer
                ? question.IsCurrentUserAnsweredCorrectly
                    ? '<span class="input-group-text text-success">Ճիշտ է ✔️</span>'
                    : ''
                : '<button class="btn btn-secondary" type="button">Ուղարկել</button>';

            divQuestions.innerHTML += `
                <div class="div-question mb-2" data-id="${question.ID}">
                    <h6 class="div-question-text">${i}. ${question.Text}</h6>
                    <div class="div-question-answer input-group mb-3">${leftPart}${rightPart}</div>
                </div>
            `;
        }

        let buttons = divQuestions.querySelectorAll("button");
        for (let button of buttons) {
            button.addEventListener("click", () => {
                let input = button.closest("div").querySelector("input[type='text']");

                if (!input.value) {
                    alert("Պատասխանի տեքստը պարտադիր է։");
                    return;
                }

                postJSON("AnswerQuestion", {
                    "QuestionID": input.closest(".div-question").dataset.id,
                    "Text": input.value
                }, data => {
                    if (!data.IsSuccessful) {
                        alert(data.Message);
                        return;
                    }

                    !data.Data && alert(`❌ Սխալ է: Կրկին փորձեք ${minutesUntilNextAnswer} րոպեից։`);

                    if (data.Data) {
                        input.value = input.value.toLowerCase();
                        input.readOnly = true;
                        input.classList.add("bg-light");

                        button.outerHTML = '<span class="input-group-text text-success" title="Դուք ճիշտ եք պատասխանել այս հարցին">Ճիշտ է ✔️</span>';
                    }
                });
            });
        }

        let name = data.Data.Name;
        if (data.Data.WinnerName) {
            txtAnswer.value = txtAnswer.value.toLowerCase();
            txtAnswer.readOnly = true;
            txtAnswer.classList.add("bg-light");
            txtAnswer.value = data.Data.Questions.map(q => q.Answer[0]).join("");

            btnAnswer.outerHTML = data.Data.IsCurrentUserWinner
                ? '<span class="input-group-text text-success">Ճիշտ է ✔️</span>'
                : '';

            let divWinner = document.createElement("div");
            divAnswer.appendChild(divWinner);
            divWinner.outerHTML = `<div class="mb-3"><h6>Հաղթողը՝ «${data.Data.WinnerName}»</h6></div>`;
        }
        else {
            btnAnswer.addEventListener("click", () => {
                if (!txtAnswer.value) {
                    alert("Պատասխանի տեքստը պարտադիր է։");
                    return;
                }

                postJSON(`AnswerGame?text=${txtAnswer.value}`, null, data => {
                    if (!data.IsSuccessful) {
                        alert(data.Message);
                        return;
                    }

                    !data.Data && alert(`❌ Սխալ է: Կրկին փորձեք ${minutesUntilNextAnswer} րոպեից։`);

                    if (data.Data) {
                        txtAnswer.value = txtAnswer.value.toLowerCase();
                        txtAnswer.readOnly = true;
                        txtAnswer.classList.add("bg-light");

                        btnAnswer.outerHTML = '<span class="input-group-text text-success">Ճիշտ է ✔️</span>';

                        setTimeout(() => {
                            alert(`✔️ Շնորհավորում ենք, Դուք դարձել եք «${name}» խաղի հաղթողը։ Մրցանակը ստանալու համար կապվեք կայքի ադմինիստրացիային։`);

                            location.reload();
                        }, 100);
                    }
                });
            });
        }
    });
}
