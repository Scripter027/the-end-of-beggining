var targetDate = new Date(2027, 1, 22, 15, 30, 00).getTime();
var alertTimeout = null;
var currentScreen = "game"; 

var interfaceUi = {
    ru: { btn: "ВВОД", placeholder: "Ваш ответ..." },
    en: { btn: "ENTER", placeholder: "Your answer..." }
};

var currentLang = "ru";
var currentText = "";

var startTexts = {
    ru: "Введите Пароль",
    en: "Enter Password"
};

var wrongTexts = {
    ru: "НЕВЕРНО",
    en: "WRONG"
};

var archiveTexts = {
    ru: "СТАТУС: ДОСТУП РАЗРЕШЕН // АРХИВ №027\n\n[ЗАПИСЬ ЗАБЛОКИРОВАНА]\n\nВы успешно проникли в базу данных. Система безопасности временно отключена, однако файлы логов зашифрованы главным счетчиком времени.\n\nВернитесь к терминалу через таймер в углу экрана, если готовы продолжить поиски.",
    en: "STATUS: ACCESS GRANTED // ARCHIVE #027\n\n[RECORD LOCKED]\n\nYou have successfully breached the database. The security system is offline, but the logs are encrypted by the main countdown clock.\n\nReturn to the terminal using the timer in the corner if you are ready to continue."
};

var gameLevels = [
    {
        passwords: ["что это за место", "what is this place"],
        ru: "Не важно, важно то, что ты здесь забыл! А что именно ты тут забыл - без понятия.",
        en: "It doesn't matter, what matters is that you're here! And what exactly you're here forgot – I have no idea."
    },
    {
        passwords: ["пароль", "password"],
        ru: "Таких глупых мы еще не встречали. Ты правда думаешь, что этот секрет можно узнать, всего лишь написав *Пароль*?",
        en: "We've never met such stupid people. Do you really think this secret can be found out just by typing *Password*?"
    },
    {
        passwords: ["кто ты", "who are you"],
        ru: "Терминал, отвечающий на твои глупые вопросы, в надежде на то, что ты найдешь его!",
        en: "A terminal that answers your stupid questions, in the hope that you'll find it!"
    },
    {
        passwords: ["а какой пароль", "what is the password"],
        ru: "Ты мне скажи.",
        en: "You tell me."
    },
    {
        passwords: ["keeper entertainment", "keeper entertainment"],
        ru: "Новая Эра Грядет.",
        en: "A New Era is Coming."
    },
    {
        passwords: ["новая эра", "new era"],
        ru: "Новая Эра Грядет.",
        en: "A New Era is Coming."
    },
    {
        passwords: ["финал", "final"],
        ru: "Поздравляю! Ты прошел ARG до самого конца. Секретов больше нет.",
        en: "Congratulations! You completed the ARG. No more secrets."
    }
];

function updateDisplay() {
    var screen = document.getElementById("text");
    var archiveScreenText = document.getElementById("archiveText");
    var inputField = document.getElementById("userAnswer");
    var submitBtn = document.getElementById("submitBtn");

    if (submitBtn) { submitBtn.innerText = interfaceUi[currentLang].btn; }
    if (inputField) { inputField.placeholder = interfaceUi[currentLang].placeholder; }

    if (screen) {
        if (currentText === "") {
            screen.innerText = startTexts[currentLang];
        } else {
            screen.innerText = currentText;
        }
    }

    if (archiveScreenText) {
        archiveScreenText.innerText = archiveTexts[currentLang];
    }
}

function changeLanguage(langCode) {
    currentLang = langCode;

    if (currentText === startTexts['ru'] || currentText === startTexts['en'] || currentText === "") {
        currentText = startTexts[currentLang];
    } else if (currentText === wrongTexts['ru'] || currentText === wrongTexts['en']) {
        currentText = wrongTexts[currentLang];
    } else {
        var screen = document.getElementById("text");
        if (screen) {
            for (var i = 0; i < gameLevels.length; i++) {
                if (screen.innerText === gameLevels[i]['ru'] || screen.innerText === gameLevels[i]['en']) {
                    currentText = gameLevels[i][currentLang];
                    break;
                }
            }
        }
    }
    updateDisplay();
}

function checkCode() {
    var inputField = document.getElementById("userAnswer");
    if (!inputField) return;

    var input = inputField.value.toLowerCase().trim();
    var found = false;

    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }

    for (var i = 0; i < gameLevels.length; i++) {
        if (gameLevels[i].passwords.includes(input)) {
            currentText = gameLevels[i][currentLang];
            found = true;
            document.body.classList.remove("error-alert");
            break;
        }
    }

    if (!found) {
        currentText = wrongTexts[currentLang];
        document.body.classList.add("error-alert");

        alertTimeout = setTimeout(function() {
            document.body.classList.remove("error-alert");
            currentText = startTexts[currentLang];
            updateDisplay();
        }, 5000);
    }

    inputField.value = "";
    updateDisplay();
}

function toggleScreens() {
    var gameEl = document.getElementById("gameScreen");
    var archiveEl = document.getElementById("archiveScreen");

    if (currentScreen === "game") {
        gameEl.style.display = "none";
        archiveEl.style.display = "inline-block";
        currentScreen = "archive";
    } else {
        archiveEl.style.display = "none";
        gameEl.style.display = "inline-block";
        currentScreen = "game";
    }
}

window.onload = function () {
    var timerElement = document.getElementById("countdownTimer");

    var inputField = document.getElementById("userAnswer");
    if (inputField) {
        inputField.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                checkCode();
            }
        });
    }

    var timerInterval = setInterval(function () {
        var now = new Date().getTime();
        var distance = targetDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        days = days < 10 ? "0" + days : days;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (timerElement) {
            if (distance > 0) {
                timerElement.innerText = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
            } else {
                clearInterval(timerInterval);
                timerElement.innerText = currentLang === "ru" ? "[ВРЕМЯ ИСТЕКЛО]" : "[TIME IS UP]";
            }
        }
    }, 1000);

    updateDisplay();
};
