(function () {
    window.onload = setMaxNumber();
//    window.onload = generateLinks();
})();


function createCssLink(href) {
    var newLink = document.createElement("link");
    newLink.setAttribute("id", "css-loader");
    newLink.setAttribute("rel", "stylesheet");
    newLink.setAttribute("type", "text/css");
    newLink.setAttribute("href", href);
    return newLink;
}

function changeTheme() {
    var oldCssLink = document.getElementById('css-loader');
    var currentCss = oldCssLink.getAttribute("href");
    if (currentCss == 'css/numguessstyle.css') {
        var newLink = createCssLink('css/customStyle.css');
        document.getElementsByTagName("head").item(0).replaceChild(newLink, oldCssLink);
    }
    else {
        var newLink = createCssLink('css/numguessstyle.css');
        document.getElementsByTagName("head").item(0).replaceChild(newLink, oldCssLink);
    }
}

function selectTheme() {
    var oldCssLink = document.getElementById('css-loader');
    var selectedTheme = document.getElementById('theme-select').value;
    switch (selectedTheme) {
        case 'Default Theme':
            var newLink = createCssLink('css/numguessstyle.css');
            break;
        case 'Coca-Cola Theme':
            var newLink = createCssLink('css/customStyle.css');
            break;
        case 'Pepsi Theme':
            var newLink = createCssLink('css/pepsiTheme.css');
            break;
    }
    document.getElementsByTagName("head").item(0).replaceChild(newLink, oldCssLink);
}

function reset() {
    document.getElementById("serverResponse").innerText = "";
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = callback;
    var url = "NumGenServlet" + "?requestRestartGame=1";
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function guess() {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = callback;
    var url = "NumGenServlet" + "?requestGuessNumber=" + document.getElementById("number").value;
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function guessLink(givenValue) {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = callback;
    var url = "NumGenServlet" + "?requestGuessNumber=" + givenValue;
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function setMaxNumber(){
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = callback;
    var url = "NumGenServlet" + "?requestMaxNumber=" + document.getElementById("maxNumber").value;
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}


function callback() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var jSonMessage = JSON.parse(xmlHttp.responseText);
        var keyRestartGame = jSonMessage.keyRestartGame;
        if (keyRestartGame !== undefined && keyRestartGame.length > 0) {
            alert("The game has been successfully restarted.");
            document.getElementById("number").value = "";
            return;
        }

        var keyError = jSonMessage.keyError;
        if (keyError !== undefined && keyError.length > 0) {
            alert("Please enter a valid number!");
            return;
        }
        var keySuccess = jSonMessage.keySuccess;
        var keyHint = jSonMessage.keyHint;
        var keyNrGuesses = jSonMessage.keyNrGuesses;

        if (keySuccess == "false") {
            if (keyHint == "higher")
                document.getElementById("serverResponse").innerHTML = "WRONG, Try a Higher one!";
            else if (keyHint == "lower")
                document.getElementById("serverResponse").innerHTML = "WRONG, Try a Lower one!";
        }
        else if (keySuccess == "true") {
            document.getElementById("serverResponse").innerHTML = "Congrats, you guessed the number " + document.getElementById("number").value + " after " + keyNrGuesses + " guesses.";
        }

        generateLinks(jSonMessage);
    }
}

function clearNodeContent(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
}

function generateLinks(jSonMessage) {
    var maxNumber = document.getElementById("maxNumber").value;
    var keyMaxNumberError = jSonMessage.keyMaxNumberError;
    if (keyMaxNumberError !== undefined && keyMaxNumberError.length > 0) {
        var keyMinAllowed = jSonMessage.keyMinAllowed;
        var keyMaxAllowed = jSonMessage.keyMaxAllowed;
        alert("Please enter an integer number between " + keyMinAllowed + " and " + keyMaxAllowed + ".");
        return;
    }
    var navigationBlock = document.getElementById("navigation");
    var postcontentBlock = document.getElementById('postcontent');

    clearNodeContent(navigationBlock);
    clearNodeContent(postcontentBlock);


    function appendLink(parent, number) {
        var lineBreak = document.createElement('br');
        var guessLink = document.createElement('a');
        guessLink.text = 'It could be ' + number;
        guessLink.href = 'javascript:guessLink(' + number + ')';
        guessLink.className = 'guess-link';
        guessLink.name = number;
        parent.appendChild(guessLink);
        parent.appendChild(lineBreak);
    }

    var median = Math.ceil(maxNumber / 2);

    for (var i = 1; i <= median; i++) {
        appendLink(navigationBlock, i);
    }

    for (var j = median + 1; j <= maxNumber; j++) {
        appendLink(postcontentBlock, j);
    }
}


(function () {
    function useLinkValue(guessLink) {
        guessLink.onclick = function () {
            document.getElementById("number").value = guessLink.name;
        };
    }

    var links = document.getElementsByClassName("guess-link");
    for (var i = 0; i < links.length; i++) {
        useLinkValue(links[i]);
    }
})();

