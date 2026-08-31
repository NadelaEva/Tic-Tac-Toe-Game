let boxes = document.querySelectorAll(".box"); //semua html yg memiliki class box di pindahkan ke variabel boxes
let msg = document.querySelector("#msg"); //mencari elemen html id="msg"
let newBtn = document.querySelector("#new-btn");
let resetBtn = document.querySelector("#reset");
let turnText = document.querySelector("#turn");
let scoreX = document.querySelector("#score-x"); //scoreX menunjuk ke elemen HTML tempat angka itu ditampilkan
let scoreO = document.querySelector("#score-o");
let historyList = document.querySelector("#history-list");

let turnO = false;
let gameOver = false;
let xScore = 0; //xScore menyimpan angka score di JavaScript.
let oScore = 0;
let moveNumber = 0;
let roundNumber = 1; //perhitungan round
let historyStates = []; //menyimpan keadaan game di setiap langkah

let winPatterns = [
    [0, 1, 2], // win samping
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], //win lurus kebawah
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], //win miring
    [2, 4, 6]
];


// MENYIMPAN KEADAAN GAME
const saveGameState = () => {
    return {
        board: Array.from(boxes).map((box) => box.innerText),
        turnO: turnO,
        gameOver: gameOver,
        xScore: xScore,
        oScore: oScore,
        moveNumber: moveNumber,
        roundNumber: roundNumber
    };
};

// kembali ke history yang di klik
const goToHistory = (index) => {
    let state = historyStates[index];

    if (!state) {
        return;
    }
    // kembalikan isi papan
    boxes.forEach((box, i) => {
        box.innerText = state.board[i];

        box.classList.remove("x", "o");

        if (state.board[i] === "X") {
            box.classList.add("x");
        } else if (state.board[i] === "O") {
            box.classList.add("o");
        }

        // kotak yang sudah terisi dikunci
        box.disabled = state.board[i] !== "";
    });

    // kembalikan semua data di game
    turnO = state.turnO;
    gameOver = state.gameOver;
    xScore = state.xScore;
    oScore = state.oScore;
    moveNumber = state.moveNumber;
    roundNumber = state.roundNumber;

    // kembalikan score yang tampilkan
    scoreX.innerText = xScore;
    scoreO.innerText = oScore;

    // kembalikan tulisan next turn
    turnText.innerText = `Next Turn : ${turnO ? "O" : "X"}`;

    // kembalikan pesan winner atau draw
    if (state.result === "win") {
        msg.innerText = `Winner : ${state.winner}`;
        msg.classList.remove("hide");
    } else if (state.result === "draw") {
        msg.innerText = "SERIII Draw!";
        msg.classList.remove("hide");
    } else {
        msg.classList.add("hide"); 
    }

    // Buang semua history setelah langkah yang dipilih
    historyStates = historyStates.slice(0, index + 1);

    renderHistory();
};

// MENAMPILKAN HISTORY
const renderHistory = () => {
    historyList.innerHTML = "";
    // dari go to game start
    let startItem = document.createElement("p");
    startItem.innerText = "Go to game start";
    startItem.style.cursor = "pointer";

    startItem.addEventListener("click", () => {
        goToHistory(0);
    });

    historyList.appendChild(startItem);
    let lastRound = null;
    historyStates.forEach((state, index) => {
        // state pertama adalah kondisi awal game
        if (index === 0) {
            return;
        }

        // MENAMPILKAN RONDE
        if (state.roundNumber !== lastRound) {
            let roundItem = document.createElement("p"); //<p></p>
            roundItem.innerText = `Ronde ${state.roundNumber}`;

            historyList.appendChild(roundItem);

            lastRound = state.roundNumber;
        }
        // penanda awal ronde 
        if (state.isRoundStart) {
            return;
        }

        // MENAMPILKAN LANGKAH
        let historyItem = document.createElement("p");

        historyItem.innerText =
            `${state.moveNumber}. ${state.player} >> #${state.boxIndex + 1}`;

        historyItem.style.cursor = "pointer";
        // saat langkah diklik, kembali ke langkah tersebut
        historyItem.addEventListener("click", () => {
            goToHistory(index);
        });

        historyList.appendChild(historyItem);

        // MENAMPILKAN HASIL MENANG
        if (state.result === "win") {
            let finishItem = document.createElement("p");

            finishItem.innerText =
                `Ronde ${state.roundNumber} selesai — ${state.winner} menang`;

            finishItem.style.cursor = "pointer";
            finishItem.addEventListener("click", () => {
                goToHistory(index);
            });

            historyList.appendChild(finishItem);
        }

        // MENAMPILKAN HASIL DRAW
        if (state.result === "draw") {
            let finishItem = document.createElement("p");

            finishItem.innerText =
                `Ronde ${state.roundNumber} selesai — Draw`;
            finishItem.style.cursor = "pointer";
            finishItem.addEventListener("click", () => {
                goToHistory(index);
            });

            historyList.appendChild(finishItem);
        }
    });

    historyList.scrollTop = historyList.scrollHeight;
};

// MENCARI PEMENANG
const cekWinner = () => {
    for (let pattern of winPatterns) {
        let pos1 = pattern[0];
        let pos2 = pattern[1];
        let pos3 = pattern[2];

        let val1 = boxes[pos1].innerText;
        let val2 = boxes[pos2].innerText;
        let val3 = boxes[pos3].innerText;

        if (val1 !== "" && val1 === val2 && val2 === val3) {
            console.log("Winner!", val1);

            msg.innerText = `Winner : ${val1}`;
            msg.classList.remove("hide");

            gameOver = true;

            if (val1 === "X") {
                xScore++;
                scoreX.innerText = xScore;
            } else {
                oScore++;
                scoreO.innerText = oScore;
            }
            // mengembalikan siapa pemenangnya
            return val1;
        }
    }

    return null;
};


// MENCARI HASIL SERI
const cekDraw = () => {
    let semuaTerisi = true;

    boxes.forEach((box) => {
        if (box.innerText === "") {
            semuaTerisi = false;
        }
    });

    if (semuaTerisi && !gameOver) {
        msg.innerText = "SERIII Draw!";
        msg.classList.remove("hide");

        gameOver = true;

        return true;
    }

    return false;
};

// RESET GAME
const resetGame = () => {
    turnO = false;
    gameOver = false;
    moveNumber = 0;
    roundNumber++; //permainan berikutnya masuk ronde baru

    turnText.innerText = "Next Turn : X";

    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
        box.classList.remove("x", "o");
    });

    msg.classList.add("hide");


    // Simpan kondisi awal ronde baru
    let newRoundState = saveGameState();
    newRoundState.isRoundStart = true;
    historyStates.push(newRoundState);
    renderHistory();
};


// NEW GAME
const newGame = () => {
    // Mengembalikan semua data seperti game baru
    turnO = false;
    gameOver = false;
    moveNumber = 0;
    roundNumber = 1;

    xScore = 0;
    oScore = 0;

    scoreX.innerText = xScore;
    scoreO.innerText = oScore;

    turnText.innerText = "Next Turn : X";

    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
        box.classList.remove("x", "o");
    });

    msg.classList.add("hide");

    // Hapus seluruh history lama
    historyStates = [];

    // Simpan kondisi awal game
    historyStates.push(saveGameState());

    renderHistory();
};

resetBtn.addEventListener("click", resetGame);
newBtn.addEventListener("click", newGame);

// POSISI BOX
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {

        if (gameOver) {
            return;
        }

        let currentPlayer;


        if (turnO) {
            box.innerText = "O";
            box.classList.add("o");
            currentPlayer = "O";

            turnO = false;
            turnText.innerText = "Next Turn : X";

        } else {
            box.innerText = "X";
            box.classList.add("x");
            currentPlayer = "X";

            turnO = true;
            turnText.innerText = "Next Turn : O";
        }

        moveNumber++;

        box.disabled = true;
        // Cek apakah ada pemenang
        let winner = cekWinner();

        // Cek apakah hasilnya draw
        let draw = cekDraw();


        // Simpan keadaan game setelah langkah dilakukan
        let currentState = saveGameState();

        currentState.player = currentPlayer;
        currentState.boxIndex = index;

        // Kalau menang
        if (winner) {
            currentState.result = "win";
            currentState.winner = winner;
        }

        // Kalau draw
        if (draw) {
            currentState.result = "draw";
        }
 
        // Simpan history
        historyStates.push(currentState);

        renderHistory();
    });
});

// MENYIMPAN KONDISI AWAL GAME
historyStates.push(saveGameState());

renderHistory();