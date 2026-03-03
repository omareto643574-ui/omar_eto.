const field = document.getElementById("field");
const player = document.getElementById("player");
const ai = document.getElementById("ai");
const ball = document.getElementById("ball");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");
const timerEl = document.getElementById("timer");

let playerScore = 0;
let aiScore = 0;
let time = 240;
let timerInterval;
let ballPos = {x: field.clientWidth/2, y: field.clientHeight/2};
let ballSpeed = {x:3, y:2};

// ===== بدء الماتش =====
function startMatch(){
    clearInterval(timerInterval);
    time = 240;
    timerInterval = setInterval(()=>{
        if(time>0){
            time--;
            let m=Math.floor(time/60);
            let s=time%60;
            timerEl.innerText=`${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
        }else{
            clearInterval(timerInterval);
            alert("انتهى الوقت! النتيجة: 🔴 "+playerScore+" - 🔵 "+aiScore);
        }
    },1000);

    requestAnimationFrame(update);
}

// ===== تحديث الحركة =====
function update(){
    // حركة الكرة
    ballPos.x += ballSpeed.x;
    ballPos.y += ballSpeed.y;

    if(ballPos.y<=0 || ballPos.y>=field.clientHeight-ball.offsetHeight) ballSpeed.y*=-1;

    let playerRect = player.getBoundingClientRect();
    let ballRect = ball.getBoundingClientRect();
    let aiRect = ai.getBoundingClientRect();

    if(checkCollision(ballRect,playerRect)){
        ballSpeed.x = Math.abs(ballSpeed.x);
    }
    if(checkCollision(ballRect,aiRect)){
        ballSpeed.x = -Math.abs(ballSpeed.x);
    }

    // AI يتبع الكرة
    let aiCenterY = ai.offsetTop + ai.offsetHeight/2;
    let ballCenterY = ballPos.y + ball.offsetHeight/2;
    if(aiCenterY<ballCenterY) ai.style.top = Math.min(ai.offsetTop+2, field.clientHeight-ai.offsetHeight)+"px";
    else ai.style.top = Math.max(ai.offsetTop-2,0)+"px";

    // تحديث الكرة
    ball.style.left=ballPos.x+"px";
    ball.style.top=ballPos.y+"px";

    // تسجيل جول
    if(ballPos.x<=0){
        playerScore++;
        playerScoreEl.innerText=playerScore;
        resetBall();
    }else if(ballPos.x>=field.clientWidth-ball.offsetWidth){
        aiScore++;
        aiScoreEl.innerText=aiScore;
        resetBall();
    }

    requestAnimationFrame(update);
}

// ===== إعادة الكرة =====
function resetBall(){
    ballPos.x = field.clientWidth/2;
    ballPos.y = field.clientHeight/2;
    ballSpeed.x *= -1;
    ballSpeed.y = 2*(Math.random()>0.5?1:-1);
}

// ===== تصادم =====
function checkCollision(a,b){
    return !(a.right<b.left || a.left>b.right || a.bottom<b.top || a.top>b.bottom);
}

// ===== تحريك اللاعب =====
let keys = {};
document.addEventListener("keydown", (e)=>{ keys[e.key]=true; movePlayer(); });
document.addEventListener("keyup", (e)=>{ keys[e.key]=false; });

function movePlayer(){
    let x = player.offsetLeft;
    let y = player.offsetTop;

    if(keys["ArrowUp"]) y=Math.max(y-5,0);
    if(keys["ArrowDown"]) y=Math.min(y+5,field.clientHeight-player.offsetHeight);
    if(keys["ArrowLeft"]) x=Math.max(x-5,0);
    if(keys["ArrowRight"]) x=Math.min(x+5,field.clientWidth/2-player.offsetWidth);

    player.style.top=y+"px";
    player.style.left=x+"px";
}

// ===== تحريك اللاعب باللمس على الموبايل =====
let touchStart={x:0,y:0};
player.addEventListener("touchstart",(e)=>{ 
    touchStart.x=e.touches[0].clientX;
    touchStart.y=e.touches[0].clientY;
});
player.addEventListener("touchmove",(e)=>{
    e.preventDefault();
    let dx = e.touches[0].clientX - touchStart.x;
    let dy = e.touches[0].clientY - touchStart.y;
    let newX = Math.min(Math.max(player.offsetLeft+dx,0),field.clientWidth/2-player.offsetWidth);
    let newY = Math.min(Math.max(player.offsetTop+dy,0),field.clientHeight-player.offsetHeight);
    player.style.left=newX+"px";
    player.style.top=newY+"px";
    touchStart.x = e.touches[0].clientX;
    touchStart.y = e.touches[0].clientY;
});

// ===== Reset =====
function resetGame(){
    playerScore=0;
    aiScore=0;
    playerScoreEl.innerText=playerScore;
    aiScoreEl.innerText=aiScore;
    resetBall();
}
