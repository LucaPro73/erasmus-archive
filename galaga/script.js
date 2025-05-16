const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function playSound({ frequency = 440, type = "square", duration = 0.1, volume = 0.1 }) {
    const ctxAudio = new (window.AudioContext || window.AudioContext)();
    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctxAudio.destination);
    osc.start();
    osc.stop(ctxAudio.currentTime + duration);
}

let player, enemies, enemyBullets, explosions;
let stage, formationDirection, score, highScore, lastEnemyShot, gameOver;
let breakLoop

function spawnEnemies() {
    enemies = [];
    const cols = 6, rows = 4;
    const spacingX = 60, spacingY = 50;
    const offsetX = 60, offsetY = 60;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let hp = 1, color = 'lime';
            if (row === 0) {
                hp = 3;
                color = 'yellow';
            } else if (row === 1) {
                hp = 2;
                color = 'blue';
            }
            enemies.push({
                x: offsetX + col * spacingX,
                y: offsetY + row * spacingY,
                width: 30,
                height: 30,
                alive: true,
                hp,
                color
            });
        }
    }
}

function shoot() {
    if (!player.lastShot || Date.now() - player.lastShot > 300) {
        player.bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 7
        });
        player.lastShot = Date.now();
        playSound({ frequency: 800, type: "square", duration: 0.05, volume: 0.2 });
    }
}

function enemyShot() {
    const alive = enemies.filter(e => e.alive);
    if (!alive.length) return;
    const e = alive[Math.floor(Math.random() * alive.length)];
    enemyBullets.push({
        x: e.x + e.width / 2 - 2,
        y: e.y + e.height,
        width: 4,
        height: 10,
        speed: 4
    });
}

const playerAfterImages = []

function update() {
    if (gameOver) return;

    if ((keys["ShiftLeft"] || keys["ShiftRight"]) && Date.now() - player.lastDash > 1200) {
        player.speed = 18
        player.lastDash = Date.now()
    }
    if (player.speed > 4) {
        player.speed = Math.max(player.speed * 0.87, 4)
        playerAfterImages.push({ x: player.x, y: player.y, width: player.width, height: player.height })
    }
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    if (playerAfterImages.length > 6 || player.speed === 4) playerAfterImages.shift()

    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    if (keys["Space"]) shoot();

    player.bullets.forEach(b => b.y -= b.speed);
    player.bullets = player.bullets.filter(b => b.y > 0);

    let moveAmt = 0.5 + stage * 0.05;
    let shouldReverse = false;

    enemies.forEach(e => {
        if (e.alive) {
            e.x += moveAmt * formationDirection;
            if (e.x < 0 || e.x + e.width > canvas.width) shouldReverse = true;
        }
    });
    if (shouldReverse) {
        formationDirection *= -1;
        enemies.forEach(e => e.y += 10);
    }

    player.bullets.forEach(bullet => {
        enemies.forEach(e => {
            if (e.alive &&
                bullet.x < e.x + e.width &&
                bullet.x + bullet.width > e.x &&
                bullet.y < e.y + e.height &&
                bullet.y + bullet.height > e.y) {
                e.hp -= 1;
                bullet.hit = true;
                if (e.hp <= 0) {
                    e.alive = false;
                    score += 100;
                    explosions.push({
                        x: e.x + e.width / 2,
                        y: e.y + e.height / 2,
                        radius: 0,
                        createdAt: Date.now()
                    });
                    playSound({ frequency: 200, type: "sawtooth", duration: 0.15, volume: 0.3 });
                } else {
                    playSound({ frequency: 440, type: "triangle", duration: 0.1, volume: 0.2 });
                }
            }
        });
    });
    player.bullets = player.bullets.filter(b => !b.hit);

    const interval = Math.max(150, 1000 - stage * 100);
    if (Date.now() - lastEnemyShot > interval) {
        enemyShot();
        lastEnemyShot = Date.now();
    }

    enemyBullets.forEach(b => b.y += b.speed);
    enemyBullets = enemyBullets.filter(b => b.y < canvas.height);

    enemyBullets.forEach(b => {
        if (
            b.x < player.x + player.width &&
            b.x + b.width > player.x &&
            b.y < player.y + player.height &&
            b.y + b.height > player.y
        ) {
            player.alive = false;
            gameOver = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }
            document.getElementById("restart").style.display = "block";
        }
    });

    explosions = explosions.filter(ex => Date.now() - ex.createdAt < 300);
    explosions.forEach(ex => ex.radius += 1.5);

    if (enemies.every(e => !e.alive)) {
        stage++;
        spawnEnemies();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 50);
        breakLoop = true
        return;
    }

    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    playerAfterImages.forEach(i => {
        ctx.fillRect(i.x, i.y, i.width, i.height);
    })

    ctx.fillStyle = "red";
    player.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    ctx.fillStyle = "orange";
    enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    enemies.forEach(e => {
        if (e.alive) {
            ctx.fillStyle = e.color;
            ctx.fillRect(e.x, e.y, e.width, e.height);
        }
    });

    explosions.forEach(ex => {
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
    });

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Stage: ${stage}`, 10, 20);
    ctx.fillText(`Score: ${score}`, 10, 40);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

function loop() {
    update();
    draw();
    if (!breakLoop) requestAnimationFrame(loop);
}

function startGame() {
    player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 40,
        width: 30,
        height: 20,
        speed: 4,
        bullets: [],
        alive: true,
        lastDash: 0
    };
    score = 0;
    stage = 1;
    enemies = [];
    enemyBullets = [];
    explosions = [];
    formationDirection = 1;
    lastEnemyShot = Date.now();
    gameOver = false;
    highScore = parseInt(localStorage.getItem("highScore")) || 0;
    document.getElementById("restart").style.display = "none";
    spawnEnemies();
    breakLoop = false
    loop();
}

document.getElementById("restart").addEventListener("click", startGame);
startGame();
