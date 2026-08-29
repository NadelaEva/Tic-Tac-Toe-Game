let boxes = document.querySelectorAll(".box"); //semua html yg memiliki class box di pindahkan ke variabel boxes
let msg = document.querySelector("#msg"); //mencari elemen html id="msg"
let newBtn = document.querySelector("#new-btn");
let resetBtn = document.querySelector("#reset");
let turnText = document.querySelector("#turn");
let scoreX = document.querySelector("#score-x"); //socreX menunjuk ke elemen HTML tempat angka itu ditampilkan
let scoreO = document.querySelector("#score-o");
let historyList = document.querySelector("#history-list");

let turnO = false;
let gameOver = false;
let xScore = 0; //xScore menyimpan angka score di JavaScript.
let oScore = 0;
let moveNumber = 0;
let roundNumber = 1; //perhitungan round

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

const cekWinner = () => {
    for (let pattern of winPatterns) { 
        let pos1 = pattern[0]; //[0, 4, 8] mengecek apakah ada kotak berisi tanda yg sama
        let pos2 = pattern[1];
        let pos3 = pattern[2];

        let val1 = boxes[pos1].innerText; //vall itu value
        let val2 = boxes[pos2].innerText; //kalau val1, val2, dan val3 sama, berarti ada pemenang
        let val3 = boxes[pos3].innerText; 

        if (val1 !== "" && val1 === val2 && val2 === val3) { //val1 !== "" artinya val1 tidak kosong
         console.log("Winner!", val1); //return digunakan untuk menghentikan fungsi yang sedang berjalan
         msg.innerText = `Winner : ${val1}`; //Masukkan tulisan Winner : lalu masukkan isi val1 ke dalam elemen msg
         msg.classList.remove("hide");
         gameOver = true;

         if (val1 === "X") {
            xScore++;
            scoreX.innerText = xScore;
         } else {
            oScore++;
            scoreO.innerText = oScore;
         }
         
         let historyItem = document.createElement("p");
         historyItem.innerText = `Ronde ${roundNumber} selesai — ${val1} menang`;
         historyList.appendChild(historyItem);

         return;
        }
    }  
};

const cekDraw = () => { //mencari hasil seri
    let semuaTerisi = true;

    boxes.forEach((box) => { //memeriksa kotak satu persatu
        if (box.innerText === "") { //mengecek apakah semua kotak sudah terisi atau belum
            semuaTerisi = false;
        }
    });

    if (semuaTerisi && !gameOver) { //kalau semua kotak sudah terisi DAN game belum selesai karena winner
        msg.innerText = "SERIII Draw!"; //output !Draw
        msg.classList.remove("hide"); 
        gameOver = true; 
    }
};

const resetGame = () => {
    turnO = false;
    gameOver = false;
    moveNumber = 0;
    roundNumber++; // di taruh disini krn permainan yang tadi sudah selesai, sekarang kita mulai ronde berikutnya

    turnText.innerText = "Next Turn : X";

    boxes.forEach((box) => { //mengosongkan semua kotak
        box.innerText = "";
        box.disabled = false;
        box.classList.remove("x", "o");
    });

    msg.classList.add("hide");
};

const newGame = () => {
    resetGame();

    roundNumber = 1;

    xScore = 0; //digunakan untuk menghapus score
    oScore = 0;

    scoreX.innerText = xScore; //angka yang terlihat di layar
    scoreO.innerText = oScore;

    historyList.innerHTML = "<p>Go to game start</p>"; //membuat game baru 
};

resetBtn.addEventListener ("click", resetGame);
newBtn.addEventListener ("click", newGame);

//POSISI BOX
boxes.forEach((box, index) => { //boc : kotak yg di proses, index : nomor index dr kotak tsb
    box.addEventListener ("click", () => { //saat kotak di click, akan menjalankan kode
        if (gameOver) {
            return;
        }
        
        if (turnO) {
          box.innerText = "O";
          box.classList.add("o"); //Misalnya O masuk ke kotak #4 => <button class="box 0">O</button> . begitu juga sebaliknya
          turnO = false;
          turnText.innerText = "Next Turn : X"; //history
        } else {
          box.innerText = "X";
          box.classList.add("x");
          turnO = true;
          turnText.innerText = "Next Turn : O";
        }

        moveNumber++; //setiap pemain melakukan langkah, angka bertambah

        box.disabled = true; //digunakan untuk mengunci jawaban

        if (moveNumber === 1) {
         let roundItem = document.createElement("p");
         roundItem.innerText = `Ronde ${roundNumber}`;
         historyList.appendChild(roundItem);
        }

        let historyItem = document.createElement("p"); //membuat <p></p>
        historyItem.innerText = `${moveNumber}. ${box.innerText} >> #${index + 1}`;
        historyList.appendChild(historyItem);
        historyList.scrollTop = historyList.scrollHeight; //scroll otomatis ke bawah 

        cekWinner();
        cekDraw();
    });
});

