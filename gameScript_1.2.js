function main(){
	var canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");
	var cx = canvas.width/2;
	var cy = canvas.height/2; 
	var keypressed = "none";

	function Player(ship) {
		this.name = "Player1";
		this.ship = ship;
		this.exp = 0;

		this.addEnemyExp = function(enemy) {
			var enemyExp = enemy.level*100;
			this.exp += enemyExp;
		}

		this.draw = function(ctx) {
			ctx.font = "15px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "left";
			ctx.fillText("Exp: " + this.exp, 10, 30);
			ctx.fillText("shipX: " + this.ship.x, 10, 60);
			ctx.fillText("shipY: " + this.ship.y, 10, 90);
			ctx.fillText("mapW: " + map.img.width, 10, 120);
			ctx.fillText("mapH: " + map.img.height, 10, 150);
			ctx.fillText("Key pressed: " + keypressed, 10, 180);
			ctx.fillText("Nearest object: " + this.ship.idNearestObject, 10, 210);
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
	    this.idNearestObject = -1;
	    this.inventoryObjects = [];

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

    	this.nearObjects = function(objects) {
    		var nearObjects = [];
    		var nearestObject;
    		var hip1;

			for(var i = 0; i < objects.length; i++){
				if(Math.abs(this.x - objects[i].x) < 100 && Math.abs(this.y - objects[i].y) < 100){
					if(nearestObject == null){
						nearestObject = objects[i];
						hip1 = Math.sqrt(Math.pow(nearestObject.x, 2) + Math.pow(nearestObject.y, 2));
						this.idNearestObject = i;
					} else {
						var hip2 = Math.sqrt(Math.pow(objects[i].x, 2) + Math.pow(objects[i].y, 2));
						if(hip2 < hip1) {
							objects[this.idNearestObject].interacting = 0;
							hip1 = hip2;
							nearestObject = nearObjects[i];
						} else {
							objects[i].interacting = 0;
						}
					}
				} else {
					objects[i].interacting = 0;
				}
			}
				
			if(nearestObject != null)
				nearestObject.interact(cx, cy, this);
			else
				this.idNearestObject = -1;
    	}

    	this.addInventoryObject = function() {
    		if(this.idNearestObject >= 0) {
    			this.inventoryObjects[this.inventoryObjects.length] = new Object("ruby", 10, "ruby.png");
    		}
    	}

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
    		this.calculateAngle(mouseX, mouseY, cx, cy);
			this.calculatePos();
			for(var i = 0; i < enemies.length; i++){
				enemies[i].collideBullets(this);
			}
			this.moveBullets(cx, cy);
			this.nearObjects(objects);
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
	    this.isMoving = 0;

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

				this.isMoving = 1;
    		} else {
	    		if(this.bulletCount == 100) {
					this.bullets.push(new Bullet(this.x - this.img.width/2, this.y - this.img.height/2, this.ang));
					this.bulletCount = 0;
				} else 
					this.bulletCount++;

				this.isMoving = 0;
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

	function Bullet(x, y, ang) {
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

	function Object(name, value, src) {
		this.name = name;
		this.value = value;
		this.img = new Image(); 
    	this.img.src = src;
    	this.img.width = 50;
    	this.img.height = 40;
	}

	function DeadEnemy(x, y, ang, vel) {
		this.x = x;
		this.y = y;
		this.ang = ang;
		this.vel = vel;
		this.img = new Image();
		this.img.src = "nave-1-dead.png";
		this.img.width = 40;
		this.img.height = 40;
		this.interactX = 0;
		this.interactY = 0;
		this.interacting = 0;
		this.objects = [];

		this.generateObjects = function() {
			var numObjects = Math.floor((Math.random() * 3) + 1);
			for(var i = 0; i < numObjects; i++) {
				this.objects[i] = new Object("ruby", 100, "ruby.png");
			}
		}

		this.calculatePos = function() {
    		if(this.vel > 0){
    			this.vel -= 0.01;
    		}
    		if(this.vel<=0){
    			this.vel = 0;
    		}

    		if(vel>0) {
			    var movX = Math.cos(this.ang)*this.vel;
				var movY = Math.sin(this.ang)*this.vel;

				this.x += movX;
				this.y += movY;
			}
    	};

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
				ctx.font = "italic 30px Roboto";
				ctx.fillStyle = "white";
				ctx.fillText("Loot", cx + (this.x - ship.x), cy + (this.y - ship.y));
			}
		}

		this.update = function() {
			if(this.objects.length == 0)
				this.generateObjects();

			if(this.vel != 0)
				this.calculatePos();
		}
	}

	function Mapa() {
		this.minWidth = 0;
		this.minHeight = 0;
		this.maxWidth = 6000;
		this.maxHeight = 1918;
		this.img = new Image();
		this.img.src = "chunk.jpg";
		this.colorIds = [];
		this.chunkSize = 200;

		this.generateColorIds = function() {
			var k = 0;
			for(var i = 0; i < this.maxWidth; i+=this.chunkSize) {
		    	for(var j = 0; j < this.maxHeight; j+=this.chunkSize) {
		    		this.colorIds[k] = this.getRandomColor();
		    		k++;
		    	}
		    }
		}

		this.getRandomColor = function() {
			var letters = '0123456789ABCDEF';
			var color = '#';
			for (var i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}

		this.draw = function(ctx, cx, cy, ship, enemies) {
		    //ctx.drawImage(this.img, cx - ship.x, cy - ship.y);

			var k = 0;
		    for(var i = 0; i < this.maxWidth; i+=this.chunkSize) {
		    	for(var j = 0; j < this.maxHeight; j+=this.chunkSize) {
		    		ctx.beginPath();
		    		//ctx.rect(i - cx - ship.x, j - cy - ship.y, i + 200 - ship.x, j + 200 - ship.y);
		    		ctx.drawImage(this.img, i - cx - ship.x, j - cy - ship.y);
		    		ctx.fillStyle = this.colorIds[k];
					ctx.fill();
					ctx.closePath();
					k++;
		    	}
		    }
		    

		    ship.draw(ctx, cx, cy);

		    for(var i = 0; i < numberOfEnemies; i++){
				this.drawEnemies(ctx, cx, cy, ship, enemies[i]);
			}

			for(var i = 0; i < deadEnemies.length; i++) {
				deadEnemies[i].draw(ctx, cx + (deadEnemies[i].x - ship.x),  cy + (deadEnemies[i].y - ship.y));
			}

		    for(var i = 0; i < ship.bullets.length; i++){
		    	ship.bullets[i].draw(ctx, cx + (ship.bullets[i].x - ship.x), cy + (ship.bullets[i].y - ship.y));
		    }

		    for(var j = 0; j < enemies.length; j++){
		    	for(var i = 0; i < enemies[j].bullets.length; i++){
					enemies[j].bullets[i].draw(ctx, cx + (enemies[j].bullets[i].x - ship.x) + enemies[j].img.width/2, cy + (enemies[j].bullets[i].y - ship.y) + enemies[j].img.height/2);
				}
			}

			this.drawMiniMap(ship, enemies);

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

    	this.drawMiniMap = function(ship, enemies) {
    		var mapInitX = (cx*2) - (cx/4);
    		var mapInitY = 10;
    		var mapFinalX = cx/4 - 10;
    		var mapFinalY = cy/4;

    		ctx.beginPath();
    		ctx.rect(mapInitX, mapInitY, mapFinalX, mapFinalY);
    		ctx.fillStyle = "#000000";
			ctx.fill();
			ctx.closePath();

			var maxMapWidth = mapInitX - mapFinalX;
			var maxMapHeight = mapFinalY - mapInitY;

			var relationX = maxMapWidth/(this.maxWidth*6 + cx*3);		// NO IDEA HOW THIS WORKS
			var relationY = maxMapHeight/(this.maxHeight - cy/2);		// BUT IT WORKS

			var shipLocX = ship.x*relationX;
			var shipLocY = ship.y*relationY;

			ctx.beginPath();
			ctx.arc(mapInitX + shipLocX, mapInitY + shipLocY, 3, 0, 2 * Math.PI);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.closePath();

			for(var i = 0; i < enemies.length; i++){
				var shipLocX = enemies[i].x*relationX;
				var shipLocY = enemies[i].y*relationY;

				ctx.beginPath();
				ctx.arc(mapInitX + shipLocX, mapInitY + shipLocY, 3, 0, 2 * Math.PI);
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.closePath();
			}

			for(var i = 0; i < deadEnemies.length; i++){
				var shipLocX = deadEnemies[i].x*relationX;
				var shipLocY = deadEnemies[i].y*relationY;

				ctx.beginPath();
				ctx.arc(mapInitX + shipLocX, mapInitY + shipLocY, 3, 0, 2 * Math.PI);
				ctx.fillStyle = "green";
				ctx.fill();
				ctx.closePath();
			}

			ctx.beginPath();
			ctx.lineWidth = 2;
    		ctx.rect(mapInitX, mapInitY, mapFinalX, mapFinalY);
    		ctx.strokeStyle = "#ffffff";
			ctx.stroke();
			ctx.closePath();
    	}
	}

	function Menu() {
		this.isSelected = 0;
		this.numCampos = 4;
		this.nameCampos = ["SPACESHIP", "MISSIONS", "OPTIONS"];
		this.drawOption = 1;
		this.menuInitX = cx/2;
		this.menuInitY = cy/2;
		this.menuFinalX = cx;
		this.menuFinalY = cy;
		this.ship = new Menu_ShipOption();

		this.calculateClick = function(posX, posY) {
			var i = 0;
			if(posY < this.menuInitY + this.menuFinalY/12) {
				for(i = 0; i < this.numCampos; i++){
			    	if(posX > this.menuInitX + (this.menuFinalX/4*i) 
			    		&& posY > this.menuInitY 
			    		&& posX < this.menuInitX + (this.menuFinalX/4*i) + this.menuFinalX/4 
			    		&& posY < this.menuInitY + this.menuFinalY/12){
			    		if(this.drawOption != i + 1) {
			    			this.drawOption = i + 1;
			    			this.ship.drawOption = 1;
			    		}
			    	} 
				} 
			} else 
				this.ship.calculateClick(posX, posY);
		}

		this.draw = function(ctx) {
			if(this.isSelected) {
	    		ctx.globalAlpha = 0.7;
	    		ctx.beginPath();
	    		ctx.rect(this.menuInitX, this.menuInitY, this.menuFinalX, this.menuFinalY);
	    		ctx.fillStyle = "#ffffff";
				ctx.fill();
				ctx.closePath();
				ctx.globalAlpha = 1;

				ctx.lineWidth = 1;
				ctx.strokeStyle = "#000000";
				ctx.font = "15px Arial";
				ctx.fillStyle = "#000000";
				ctx.textAlign = "center";

				var i = 0;
				var j = 1;
				for(i = 0; i < this.numCampos; i++, j+=2){
					ctx.beginPath();
					ctx.rect(this.menuInitX + (this.menuFinalX/4*i), this.menuInitY, this.menuFinalX/4, this.menuFinalY/12);
					ctx.fillStyle = "#ffffff";
					ctx.fill();
					ctx.rect(this.menuInitX + (this.menuFinalX/4*i), this.menuInitY, this.menuFinalX/4, this.menuFinalY/12); 		
					ctx.stroke();
					ctx.closePath();
					ctx.fillStyle = "#000000";
					if(this.drawOption == i + 1) {
						ctx.font = "bold 15px Arial";
						ctx.fillStyle = "#DF013A";
					}
					ctx.fillText(this.nameCampos[i], this.menuInitX + (this.menuFinalX/8*j), this.menuInitY + this.menuFinalY/18);
					ctx.font = "15px Arial";
					ctx.fillStyle = "#000000";
				}

				ctx.beginPath();
				ctx.lineWidth = 1;
	    		ctx.rect(this.menuInitX, this.menuInitY, this.menuFinalX, this.menuFinalY);
	    		ctx.strokeStyle = "#000000";
				ctx.stroke();
				ctx.closePath();
				//ctx.fillText(this.drawOption, cx, cy);

				if(this.drawOption == 1) 
					this.ship.draw();
			}
		}
	}

	function Menu_ShipOption() {
		this.menuInitX = cx/2 + 10;
		this.menuInitY = (cy/2 + cy/12) + 10;
		this.menuOptionHeight = cy/12;
		this.menuFinalX = cx/4 - 20;
		this.numCampos = 10;
		this.nameCampos = ["statistics", "armament", "appearance", "inventory", "crew"];
		this.drawOption = 1;
		this.showCaseInitX = cx/2 + 10 + cx/4;
		this.showCaseInitY = (cy/2 + cy/12) + 10;
		this.showCaseFinalX = cx - 20 - cx/2 + cx/4;
		this.showCaseFinalY = (cy - 10 - (cy/2 + cy/12) + 10) * 2;
		this.inventory = new Menu_ShipInventory();

		this.calculateClick = function(posX, posY) {
			var i = 0;
			for(i = 0; i < this.numCampos; i++){
		    	if(posX > this.menuInitX 
		    		&& posY > this.menuInitY + this.menuOptionHeight*i 
		    		&& posX < this.menuInitX + this.menuFinalX 
		    		&& posY < this.menuInitY + this.menuOptionHeight*i + this.menuOptionHeight){
		    		this.drawOption = i + 1;
		    	}
			}
		}

		this.draw = function() {
			var i = 0;
			var j = 1;
			for(i = 0; i < this.numCampos; i++, j+=2){
				ctx.beginPath();
		    	ctx.rect(this.menuInitX, this.menuInitY + this.menuOptionHeight*i, this.menuFinalX, this.menuOptionHeight);
		    	ctx.fillStyle = "#ffffff";
				ctx.fill();
				ctx.rect(this.menuInitX, this.menuInitY + this.menuOptionHeight*i, this.menuFinalX, this.menuOptionHeight); 		
				ctx.stroke();
				ctx.closePath();
				ctx.fillStyle = "#000000";
				if(this.drawOption == i + 1) {
					ctx.font = "bold 15px Arial";
					ctx.fillStyle = "#DF013A";
				}
				ctx.fillText(this.nameCampos[i], this.menuInitX + this.menuFinalX/2, this.menuInitY + this.menuOptionHeight/2*j + 5);
				ctx.font = "15px Arial";
				ctx.fillStyle = "#000000";
			}

			ctx.beginPath();
			ctx.rect(this.showCaseInitX, this.showCaseInitY, this.showCaseFinalX, this.showCaseFinalY); 		
			ctx.stroke();
			ctx.closePath();

			if(this.drawOption == 4)
				this.inventory.draw();
		}
	}

	function Menu_ShipInventory() {
		this.menuInitX = cx/2 + 10 + cx/4 + 15;
		this.menuInitY = (cy/2 + cy/12) + 20;
		this.menuOptionWidth = cy/8;
		this.menuOptionHeight = cy/8;
		this.numSlotsX = 9;
		this.numSlotsY = 5;

		this.draw = function() {
			var i = 0;
			var j = 0;
			var numObject = 0;
			for(i = 0; i < this.numSlotsX; i++){
				for(j = 0; j < this.numSlotsY; j++) {
					ctx.beginPath();
					ctx.rect(this.menuInitX + (this.menuOptionWidth + 10)*i, this.menuInitY + (this.menuOptionHeight + 10)*j, this.menuOptionWidth, this.menuOptionHeight); 		
					ctx.stroke();
					ctx.closePath();
					if(player.ship.inventoryObjects[numObject]) {
						var invImg = player.ship.inventoryObjects[numObject].img;
						ctx.drawImage(invImg, this.menuInitX + (this.menuOptionWidth + 10)*i, this.menuInitY + (this.menuOptionHeight + 10)*j, invImg.width, invImg.height);
					}
					numObject++;
				}
			}
		}
	}

	var map = new Mapa();
	map.generateColorIds();
	var menu = new Menu();
	var ship = new SpaceShip(map.maxWidth/2, map.maxHeight/2, "nave-1.png", 5, 100);
	var player = new Player(ship);
	var enemies = [];
	var numberOfEnemies = 5;
	var deadEnemies = [];

	for(var i = 0; i < numberOfEnemies; i++){
    	var randomWidth = Math.floor(Math.random() * map.maxWidth*2);
    	var randomHeight = Math.floor(Math.random() * map.maxHeight*2);
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
		if(!menu.isSelected)
			player.ship.bullets.push(new Bullet(ship.x, ship.y, ship.ang));
		else{
			menu.calculateClick(e.clientX, e.clientY);
		}
	}

	document.addEventListener("keydown", keydownHandler, false);
	function keydownHandler(e){
		if(e.keyCode == 87){
			player.ship.wIsPressed = 1;
			keypressed = "W";
		} 

		if(e.keyCode == 82){
			player.ship.addInventoryObject();
			keypressed = "R";
		} 

		if(e.keyCode == 69){
			if(!menu.isSelected)
				menu.isSelected++;
			else
				menu.isSelected--;

			keypressed = "E";
		}
	}

	function draw() {
		ctx.clearRect(0, 0, cx*2, cy*2);
		map.draw(ctx, cx, cy, player.ship, enemies);
		player.draw(ctx);
		menu.draw(ctx);
	}

	function update(){
		player.ship.update(mouseX, mouseY, cx, cy, enemies, deadEnemies);
		for(var i = 0; i < numberOfEnemies; i++) {
			enemies[i].update(player.ship);
			if(enemies[i].isDead()) {
				player.addEnemyExp(enemies[i]);
				if(enemies[i].isMoving == 0)
					enemies[i].vel = 0;
				deadEnemies.push(new DeadEnemy(enemies[i].x, enemies[i].y, enemies[i].ang, enemies[i].vel));
				enemies.splice(i, 1);
				numberOfEnemies--;
			}
		}

		for(var i = 0; i < deadEnemies.length; i++) {
			deadEnemies[i].update();
		}

		draw();
	}

	var refreshIntervalId = setInterval(update, 10);
}			