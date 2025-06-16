// Jogo Simples: "Colhe & Entrega"

//comentários
let player;
let items = []; // mistura frutas e obstáculos
let points = 0;
let connection = 100;
let showNextLevel = false;
let showVictory = false;
let continueButton;
let level = 1;
let gameOver = false;

function setup() {
  createCanvas(800, 400);
  player = new Player();
  spawnItems();
  continueButton = createButton("Continuar");
  continueButton.position(width / 2 - 40, height / 2 + 20);
  continueButton.mousePressed(nextLevel);
  continueButton.hide();
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  if (gameOver) {
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("VOCÊ PERDEU!", width / 2, height / 2);
    setTimeout(() => location.reload(), 2000);
    return;
  }

  background(200, 255, 200);

  if (showVictory) {
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("VOCÊ VENCEU!", width / 2, height / 2);
    return;
  }

  if (showNextLevel) {
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("VOCÊ PASSOU!", width / 2, height / 2 - 20);
    continueButton.show();
    return;
  } else {
    continueButton.hide();
  }

  drawZones();
  player.update();
  player.display();

  for (let item of items) {
    item.update();
    item.display();
    if (!item.touched && player.hits(item)) {
      item.touched = true;
      if (item.type === 'fruit') {
        player.carrying++;
      } else if (item.type === 'obstacle') {
        gameOver = true;
      }
    }
  }

  drawMarket();
  if (player.x + player.size > 760 && player.y > 150 && player.y < 250 && player.carrying > 0) {
    points += player.carrying;
    connection = min(100, connection + player.carrying * 5);
    player.carrying = 0;

    if (points >= 30) {
      showVictory = true;
    } else {
      showNextLevel = true;
    }
  }

  drawUI();
}

function nextLevel() {
  showNextLevel = false;
  level++;
  spawnItems();
  player.x = 50;
  player.y = 200;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) player.move(-1, 0);
  if (keyCode === RIGHT_ARROW) player.move(1, 0);
  if (keyCode === UP_ARROW) player.move(0, -1);
  if (keyCode === DOWN_ARROW) player.move(0, 1);
}

function drawZones() {
  fill(120, 200, 120); 
  rect(0, 0, width, height); // Apenas o campo verde claro
}

function drawMarket() {
  fill(139, 69, 19); // marrom
  rect(760, 150, 30, 100);
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("MERCADO", 775, 145);
}

function drawUI() {
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text(`Pontos: ${points}`, 10, 20);
  text(`Frutas: ${player.carrying}`, 10, 40);
  text(`Fase: ${level}`, width - 100, 20);
  fill(0, 200, 0);
  rect(10, 60, connection * 2, 15);
  noFill();
  stroke(0);
  rect(10, 60, 200, 15);
  noStroke();
}

function spawnItems() {
  items = [];
  let fruitCount = floor(random(4, 8));
  let obstacleCount = min(3 + (level - 1), 6);

  for (let i = 0; i < fruitCount; i++) {
    let x = random(30, 520);
    let y = random(50, 350);
    items.push(new Item(x, y, 'fruit'));
  }

  for (let i = 0; i < obstacleCount; i++) {
    let x = random(30, 520);
    let y = random(50, 350);
    items.push(new Item(x, y, 'obstacle'));
  }
}

class Player {
  constructor() {
    this.x = 50;
    this.y = 200;
    this.size = 30;
    this.carrying = 0;
  }
  update() {
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }
  move(dx, dy) {
    this.x += dx * 10;
    this.y += dy * 10;
  }
  display() {
    textSize(24);
    text('👨🏿‍🌾', this.x, this.y);
  }
  hits(obj) {
    return (
      this.x < obj.x + obj.size &&
      this.x + this.size > obj.x &&
      this.y < obj.y + obj.size &&
      this.y + this.size > obj.y
    );
  }
}

class Item {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.type = type; // 'fruit' ou 'obstacle'
    this.touched = false;
    if (type === 'obstacle') {
      this.vx = random([-1, 1]) * random(1, 2);
      this.vy = random([-1, 1]) * random(1, 2);
    }
  }
  update() {
    if (this.type === 'obstacle') {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width - this.size) this.vx *= -1;
      if (this.y < 0 || this.y > height - this.size) this.vy *= -1;
    }
  }
  display() {
    if (!this.touched) {
      textSize(24);
      if (this.type === 'fruit') {
        text('🍎', this.x, this.y);
      } else {
        text('🪳', this.x, this.y);
      }
    }
  }
}

// FIM DO JOGO