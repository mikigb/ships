function main(){
	var canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");
	var cx = canvas.width/2;
	var cy = canvas.height/2; 

	function Player(ship) {
		this.name = "Player1";
		this.ship = ship;
		this.exp = 0;

		this.addEnemyExp = function(enemy) {
			var enemyExp = enemy.level*100;
			this.exp += enemyExp;
		}

		this.draw = function(ctx) {
			ctx.font = "30px Arial";
			ctx.fillStyle = "red";
			ctx.fillText("Exp: " + this.exp, 10, 50);
		}
	}

	function SpaceShip(x, y, src, vel, life) {
		this.x = x/2;
		this.y = y/2;
	    this.img = new Image(); 
    	this.img.src = src;
    	this.img.width = 50;
    	this.img.height = 50;
	    this.vel = 0;
	    this.maxVel = vel;
	    this.ang = 0;
	    this.bullets = [];
	    this.life = life;
	    this.maxLife = life;
	    this.wIsPressed = 0;

	    this.isDead = function() {
	    	if(this.life <= 0)
	    		return 1;
	    	return 0;
	    };

	    this.calculateAngle = function(objX, objY, curX, curY) {
	    	var difX = objX - curX;
		    var difY = objY - curY;

		    this.ang = Math.atan(difY/difX);

		    if(objX<curX)
		    	this.ang += Math.PI;
    	};

    	this.calculatePos = function() {
    		if(!this.wIsPressed && this.vel > 0){
    			this.vel -= 0.05;
    		}
    		if(this.vel<0){
    			this.vel = 0;
    		}
    		if(this.wIsPressed == 1){
    			this.vel = this.maxVel;
    		}
    		this.wIsPressed = 0;

    		if(vel) {
			    var movX = Math.cos(this.ang)*this.vel;
				var movY = Math.sin(this.ang)*this.vel;

				this.x += movX;
				this.y += movY;
			}
    	};

    	this.moveBullets = function(cx, cy) {
    		for(var i = 0; i < this.bullets.length; i++){
			    this.bullets[i].calculatePos();
			    if((this.bullets[i].x > this.x + cx) || (this.bullets[i].x < this.x - cx) 
			    	|| (this.bullets[i].y > this.y + cy) || (this.bullets[i].y < this.y - cy)){
			    	this.bullets.splice(i, 1);
			    }
			}
    	};

    	this.collideBullets = function(ship){
    		for(var i = 0; i < this.bullets.length; i++){
    			if(!this.bullets[i].hitted)
				    this.bullets[i].collide(ship);
				if(this.bullets[i].isDead())
					this.bullets.splice(i, 1);
			}
    	};

    	this.hit = function(){
    		this.life-=10;
    		if(this.life <= 0)
    			return 1;
    		return 0;
    	};

    	this.draw = function(ctx, x, y) {
		    ctx.save();
			ctx.translate(x, y);
			ctx.rotate(this.ang + Math.PI/2);
			ctx.translate(-x, -y);
			ctx.drawImage(this.img, x - this.img.width/2, y - this.img.height/2, this.img.width, this.img.height);
			ctx.restore();

			if(this.life > 0){
				ctx.beginPath();
				ctx.moveTo(((x - this.img.width/2)-10)+this.life/2, y - this.img.height/2);
				ctx.lineTo(((x - this.img.width/2)-10)+this.maxLife/2, y - this.img.height/2);
				ctx.lineWidth = 4;
				ctx.strokeStyle = "red";
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo((x - this.img.width/2)-10, y - this.img.height/2);
				ctx.lineTo(((x - this.img.width/2)-10)+this.life/2, y - this.img.height/2);
				ctx.lineWidth = 4;
				ctx.strokeStyle = "green";
				ctx.stroke();
				ctx.closePath();
			}
    	};

    	this.update = function(mouseX, mouseY, cx, cy, enemies, objects){
    		ship.calculateAngle(mouseX, mouseY, cx, cy);
			ship.calculatePos();
			for(var i = 0; i < enemies.length; i++){
				enemies[i].collideBullets(this);
			}
			ship.moveBullets(cx, cy);

			for(var i = 0; i < objects.length; i++){
				if(Math.abs(this.x - objects[i].x) < 100 && Math.abs(this.y - objects[i].y) < 100)
					objects[i].interact(cx, cy, this);
				else {
					objects[i].interacting = 0;
				}
			}
    	};
	}

	function Enemy(x, y, src, vel, life, level) {
		this.x = x/2;
		this.y = y/2;
	    this.img = new Image(); 
    	this.img.src = src;
    	this.img.width = 40;
    	this.img.height = 40;
	    this.vel = vel;
	    this.ang = 0;
	    this.bullets = [];
	    this.life = life;
	    this.maxLife = life;
	    this.bulletCount = 0;
	    this.level = level;

	    this.isDead = function() {
	    	if(this.life <= 0)
	    		return 1;
	    	return 0;
	    };

	    this.calculateAngle = function(objX, objY, curX, curY) {
	    	var difX = objX - curX;
		    var difY = objY - curY;

		    this.ang = Math.atan(difY/difX);

		    if(objX<curX)
		    	this.ang += Math.PI;
    	};

    	this.calculatePos = function(ship) {
    		if((Math.abs(ship.x - this.x) > 200 || Math.abs(ship.y - this.y) > 200)
    			&& (Math.abs(ship.x - this.x) < cx && Math.abs(ship.y - this.y) < cy)){
    			var movX = Math.cos(this.ang)*this.vel;
				var movY = Math.sin(this.ang)*this.vel;

				this.x += movX;
				this.y += movY;
    		} else {
	    		if(this.bulletCount == 100) {
					this.bullets.push(new Bullet(this.x - this.img.width/2, this.y - this.img.height/2, this.ang));
					this.bulletCount = 0;
				} else 
					this.bulletCount++;
    		}   
    	};

    	this.moveBullets = function(cx, cy, ship) {
    		for(var i = 0; i < this.bullets.length; i++){
			    this.bullets[i].calculatePos();
			    if((this.bullets[i].x > ship.x + cx) || (this.bullets[i].x < ship.x - cx) 
			    	|| (this.bullets[i].y > ship.y + cy) || (this.bullets[i].y < ship.y - cy)){
			    	this.bullets.splice(i, 1);
			    }
			}
    	};

    	this.collideBullets = function(ship){
    		for(var i = 0; i < this.bullets.length; i++){
    			if(!this.bullets[i].hitted)
				    this.bullets[i].collideEnemy(ship);
				if(this.bullets[i].isDead())
					this.bullets.splice(i, 1);
			}
    	};

    	this.hit = function(){
    		this.life-=10;
    		if(this.life <= 0)
    			return 1;
    		return 0;
    	};

    	this.draw = function(ctx, x, y) {
		    ctx.save();
			ctx.translate(x, y);
			ctx.rotate(this.ang + Math.PI/2);
			ctx.translate(-x, -y);
			ctx.drawImage(this.img, x - this.img.width/2, y - this.img.height/2, this.img.width, this.img.height);
			ctx.restore();

			if(this.life > 0){
				ctx.beginPath();
				ctx.moveTo(((x - this.img.width/2)-10)+this.life/2, y - this.img.height/2);
				ctx.lineTo(((x - this.img.width/2)-10)+this.maxLife/2*10, y - this.img.height/2);
				ctx.lineWidth = 4;
				ctx.strokeStyle = "red";
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo((x - this.img.width/2)-10, y - this.img.height/2);
				ctx.lineTo(((x - this.img.width/2)-10)+this.life/2*10, y - this.img.height/2);
				ctx.lineWidth = 4;
				ctx.strokeStyle = "green";
				ctx.stroke();
				ctx.closePath();
			}
    	};

    	this.update = function(ship) {
    		this.calculateAngle(ship.x, ship.y, this.x, this.y);
			this.calculatePos(ship);
			ship.collideBullets(this);
			this.moveBullets(cx, cy, ship);
    	};
	}

	function Bullet(x, y, ang){
		this.x = x;
		this.y = y;
		this.ang = ang;
		this.vel = 10;
		this.img = new Image();
		this.img.width = 128;
		this.img.height = 128; 
		this.explosion = [];
	    this.explosionCount = 0;
	    this.hitted = 0;
	    this.explosionFrames = 45;

	    this.isDead = function() {
	    	if(this.explosionCount == this.explosionFrames)
	    		return 1;
	    	return 0;
	    };

		this.calculatePos = function() {
			if(this.hitted == 0){
		    	var movX = Math.cos(this.ang)*this.vel;
			    var movY = Math.sin(this.ang)*this.vel;
			    this.x += movX;
			    this.y += movY;
			}
    	};

    	this.collide = function(obj) {
    		if((this.x < obj.x + obj.img.width/2 && this.x > obj.x - obj.img.width/2)
    			&& (this.y < obj.y + obj.img.height/2 && this.y > obj.y - obj.img.height/2)){
	    		for(var i = 0, j = 0; i < 15; i++) {
	    			this.explosion[j] = "explosion/explosion_" + i + ".png";
	    			this.explosion[j+1] = "explosion/explosion_" + i + ".png";
	    			this.explosion[j+2] = "explosion/explosion_" + i + ".png";
	    			j+=3;
	    		}
	    		this.hitted++;
	    		obj.hit();
    		}
    	};

    	this.collideEnemy = function(obj) {
    		if((this.x < obj.x + obj.img.width/2 && this.x > obj.x - obj.img.width)
    			&& (this.y < obj.y + obj.img.height/2 && this.y > obj.y - obj.img.height)){
	    		for(var i = 0, j = 0; i < 15; i++) {
	    			this.explosion[j] = "explosion/explosion_" + i + ".png";
	    			this.explosion[j+1] = "explosion/explosion_" + i + ".png";
	    			this.explosion[j+2] = "explosion/explosion_" + i + ".png";
	    			j+=3;
	    		}
	    		this.hitted++;
	    		obj.hit();
    		}
    	};

    	this.draw = function(ctx, x, y) {
    		if(this.hitted){
    			if(this.explosionCount < this.explosionFrames) {
		    		this.img.src = this.explosion[this.explosionCount];
					this.explosionCount++;

			    	ctx.save();
					ctx.translate(x, y);
					ctx.rotate(this.ang + Math.PI/2);
					ctx.translate(-x, -y);
					ctx.drawImage(this.img, x - this.img.width/2, y - this.img.height/2, this.img.width, this.img.height);
					ctx.restore();
				}
    		} else {
    			ctx.beginPath();
				ctx.arc(x, y, 3, 0, 2 * Math.PI);
			    ctx.fillStyle = "#ffffff";
			    ctx.fill();
			    ctx.closePath();
    		}
    	};
	}

	function Object(x, y, ang) {
		this.x = x;
		this.y = y;
		this.ang = ang;
		this.img = new Image();
		this.img.src = "nave-1-dead.png";
		this.img.width = 40;
		this.img.height = 40;
		this.interactX = 0;
		this.interactY = 0;
		this.interacting = 0;

		this.interact = function(cx, cy, ship) {
			this.interactX = cx + (this.x - ship.x);
			this.interactY = cy + (this.y - ship.y);
			this.interacting = 1;
			
		}

		this.draw = function(ctx, x, y) {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(this.ang + Math.PI/2);
			ctx.translate(-x, -y);
			ctx.drawImage(this.img, x - this.img.width/2, y - this.img.height/2, this.img.width, this.img.height);
			ctx.restore();

			if(this.interacting){
				ctx.font = "30px Arial";
				ctx.fillStyle = "red";
				ctx.fillText("Hello", cx + (this.x - ship.x), cy + (this.y - ship.y));
			}
		}
	}

	function Mapa(){
		this.minWidth = 0;
		this.minHeight = 0;
		this.maxWidth = 5000;
		this.maxHeight = 3000;
		this.img = new Image();
		this.img.src = "universe.jpg";

		this.draw = function(ctx, cx, cy, ship) {
		    ctx.drawImage(this.img, cx - ship.x, cy - ship.y);

		    ship.draw(ctx, cx, cy);

		    for(var i = 0; i < numberOfEnemies; i++){
				this.drawEnemies(ctx, cx, cy, ship, enemies[i]);
			}

			for(var i = 0; i < objects.length; i++) {
				objects[i].draw(ctx, cx + (objects[i].x - ship.x),  cy + (objects[i].y - ship.y));
			}

		    for(var i = 0; i < ship.bullets.length; i++){
		    	ship.bullets[i].draw(ctx, cx + (ship.bullets[i].x - ship.x), cy + (ship.bullets[i].y - ship.y));
		    }

		    for(var j = 0; j < enemies.length; j++){
		    	for(var i = 0; i < enemies[j].bullets.length; i++){
					enemies[j].bullets[i].draw(ctx, cx + (enemies[j].bullets[i].x - ship.x) + enemies[j].img.width/2, cy + (enemies[j].bullets[i].y - ship.y) + enemies[j].img.height/2);
				}
			}

    	};

    	this.drawEnemies = function(ctx, cx, cy, ship, enemy) {
    		if((enemy.x < ship.x + cx) && (enemy.x > ship.x)){
		    	if((enemy.y < ship.y + cy) && (enemy.y > ship.y)){
		    		enemy.draw(ctx, cx + (enemy.x - ship.x), cy + (enemy.y - ship.y));
		    	}
		    	else if((enemy.y < ship.y) && (enemy.y > ship.y - cy)){
		    		enemy.draw(ctx, cx + (enemy.x - ship.x), cy -(ship.y - enemy.y));
		    	}
		    }

		    else if((enemy.x < ship.x) && (enemy.x > ship.x - cx)){
		    	if((enemy.y < ship.y + cy) && (enemy.y > ship.y)){
		    		enemy.draw(ctx, cx - (ship.x - enemy.x), cy + (enemy.y - ship.y));
		    	}
		    	else if((enemy.y < ship.y) && (enemy.y > ship.y - cy)){
		    		enemy.draw(ctx, cx - (ship.x - enemy.x), cy - (ship.y - enemy.y));
		    	}
		    }
    	};
	}

	var map = new Mapa();
	var ship = new SpaceShip(map.maxWidth/2, map.maxHeight/2, "nave-1.png", 5, 100);
	var player = new Player(ship);
	var enemies = [];
	var numberOfEnemies = 5;
	var objects = [];

	for(var i = 0; i < numberOfEnemies; i++){
    	var randomWidth =Math.floor(Math.random() * map.maxWidth);
    	var randomHeight =Math.floor(Math.random() * map.maxHeight);
		enemies[i] = new Enemy(randomWidth, randomHeight, "nave-1.png", 2, 10, 1);
	}

	var mouseX = 0;
	var mouseY = 0;
	document.addEventListener("mousemove", mousemoveHandler, false);
	function mousemoveHandler(e){
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	document.addEventListener("click", mouseclickHandler, false);
	function mouseclickHandler(e){
		player.ship.bullets.push(new Bullet(ship.x, ship.y, ship.ang));
	}

	document.addEventListener("keydown", keydownHandler, false);
	function keydownHandler(e){
		if(e.keyCode == 87){
			player.ship.wIsPressed = 1;
		}
	}

	function draw() {
		ctx.clearRect(0, 0, cx*2, cy*2);
		map.draw(ctx, cx, cy, player.ship);
		player.draw(ctx);
	}

	function update(){
		player.ship.update(mouseX, mouseY, cx, cy, enemies, objects);
		for(var i = 0; i < numberOfEnemies; i++) {
			enemies[i].update(player.ship);
			if(enemies[i].isDead()) {
				player.addEnemyExp(enemies[i]);
				objects.push(new Object(enemies[i].x, enemies[i].y, enemies[i].ang));
				enemies.splice(i, 1);
				numberOfEnemies--;
			}
		}
		draw();
	}

	var refreshIntervalId = setInterval(update, 10);
}			