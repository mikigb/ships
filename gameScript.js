function main(){
	var canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");
	var cx = canvas.width/2;
	var cy = canvas.height/2;  

	function SpaceShip(x, y, src, vel, life) {
		this.x = x/2;
		this.y = y/2;
	    this.img = new Image(); 
    	this.img.src = src;
    	this.img.width = 100;
    	this.img.height = 100;
	    this.vel = vel;
	    this.ang = 0;
	    this.bullets = [];
	    this.life = life;
	    this.wIsPressed = 0;

	    this.isDead = function() {
	    	if(this.life <= 0)
	    		return 1;
	    	return 0;
	    }

	    this.calculateAngle = function(objX, objY, curX, curY) {
	    	var difX = objX - curX;
		    var difY = objY - curY;

		    this.ang = Math.atan(difY/difX);

		    if(objX<curX)
		    	this.ang += Math.PI;
    	};

    	this.calculatePos = function() {
    		if(!this.wIsPressed && this.vel > 0)
    			this.vel -= 0.05;
    		if(this.wIsPressed == 1)
    			this.vel = 10;
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
    	}

    	this.collideBullets = function(ship){
    		for(var i = 0; i < this.bullets.length; i++){
    			if(!this.bullets[i].hitted)
				    this.bullets[i].collide(ship);
				if(this.bullets[i].isDead())
					this.bullets.splice(i, 1);
			}
    	}

    	this.hit = function(){
    		this.life-=10;
    		if(this.life <= 0)
    			return 1;
    		return 0;
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
				ctx.moveTo(((x - this.img.width/2)-10)+this.life, y - this.img.height/2);
				ctx.lineTo(((x - this.img.width/2)-10)+100, y - this.img.height/2);
				ctx.lineWidth = 4;
				ctx.strokeStyle = "red";
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo((x - this.img.width/2)-10, y - this.img.height/2);
				ctx.lineTo(((x - this.img.width/2)-10)+this.life, y - this.img.height/2);
				ctx.lineWidth = 4;
				ctx.strokeStyle = "green";
				ctx.stroke();
				ctx.closePath();
			}
    	};
	}

	function Enemy(x, y, src, vel, life) {
		this.x = x/2;
		this.y = y/2;
	    this.img = new Image(); 
    	this.img.src = src;
    	this.img.width = 50;
    	this.img.height = 50;
	    this.vel = vel;
	    this.ang = 0;
	    this.bullets = [];
	    this.life = life;

	    this.isDead = function() {
	    	if(this.life <= 0)
	    		return 1;
	    	return 0;
	    }

	    this.calculateAngle = function(objX, objY, curX, curY) {
	    	var difX = objX - curX;
		    var difY = objY - curY;

		    this.ang = Math.atan(difY/difX);

		    if(objX<curX)
		    	this.ang += Math.PI;
    	};

    	this.calculatePos = function() {
		    var movX = Math.cos(this.ang)*this.vel;
			var movY = Math.sin(this.ang)*this.vel;

			this.x += movX;
			this.y += movY;
    	};

    	this.moveBullets = function(cx, cy) {
    		for(var i = 0; i < this.bullets.length; i++){
			    this.bullets[i].calculatePos();
			    if((this.bullets[i].x > this.x + cx) || (this.bullets[i].x < this.x - cx) 
			    	|| (this.bullets[i].y > this.y + cy) || (this.bullets[i].y < this.y - cy)){
			    	this.bullets.splice(i, 1);
			    }
			}
    	}

    	this.collideBullets = function(ship){
    		for(var i = 0; i < this.bullets.length; i++){
    			if(!this.bullets[i].hitted)
				    this.bullets[i].collide(ship);
				if(this.bullets[i].isDead())
					this.bullets.splice(i, 1);
			}
    	}

    	this.hit = function(){
    		this.life-=10;
    		if(this.life <= 0)
    			return 1;
    		return 0;
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
				ctx.lineTo(((x - this.img.width/2)-10)+50, y - this.img.height/2);
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
	}

	function Bullet(x, y, ang){
		this.x = x;
		this.y = y;
		this.ang = ang;
		this.vel = 10;
		this.img = new Image();
		this.img.width = 256;
		this.img.height = 256; 
		this.explosion = [];
	    this.explosionCount = 0;
	    this.hitted = 0;
	    this.explosionFrames = 45;

	    this.isDead = function() {
	    	if(this.explosionCount == this.explosionFrames)
	    		return 1;
	    	return 0;
	    }

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
    	}

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
				ctx.arc(x, y, 4, 0, 2 * Math.PI);
			    ctx.fillStyle = "#ffffff";
			    ctx.fill();
			    ctx.closePath();
    		}
    	};
	}

	function Mapa(){
		this.minWidth = 0;
		this.minHeight = 0;
		this.maxWidth = 5000;
		this.maxHeight = 3000;
		this.img = new Image();
		this.img.src = "universe.jpg"

		this.draw = function(ctx, cx, cy) {

			var minx = 0;
			var miny = 0;
			var maxx = 0;
			var maxy = 0;

			if(ship.x < cx){
				minx = cx - ship.x;
			}

			if(ship.y < cy){
				miny = cy - ship.y;
			}

			/*ctx.beginPath();
			ctx.rect(minx, miny, this.maxWidth - (ship.x + cx), this.maxHeight - (ship.y + cy));
		    ctx.fillStyle = "#ffffff";
		    ctx.fill();
		    ctx.closePath();*/
		    ctx.drawImage(this.img, cx - ship.x, cy - ship.y, this.maxWidth - (ship.x + cx), this.maxHeight - (ship.y + cy));

		    ship.draw(ctx, cx, cy);

		    for(var i = 0; i < numberOfEnemies; i++){
				this.drawEnemies(ctx, cx, cy, ship, enemies[i]);
			}

		    for(var i = 0; i < ship.bullets.length; i++){
		    	ship.bullets[i].draw(ctx, cx + (ship.bullets[i].x - ship.x), cy + (ship.bullets[i].y - ship.y));
		    }

		    ctx.font = "30px Arial";
			ctx.fillStyle = "red";
			ctx.textAlign = "center";
			ctx.fillText(ship.bullets.length, 10, 50);
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
    	}
	}

	var map = new Mapa();
	var ship = new SpaceShip(map.maxWidth/2, map.maxHeight/2, "nave-1.png", 10, 100);
	var enemies = [];
	var numberOfEnemies = 1;

	for(var i = 0; i < numberOfEnemies; i++){
		enemies[i] = new Enemy(map.maxWidth/2 + 200, map.maxHeight/2 + 200, "nave-1.png", 2, 100);
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
		ship.bullets.push(new Bullet(ship.x, ship.y, ship.ang, ship.vel));
	}

	document.addEventListener("keydown", keydownHandler, false);
	function keydownHandler(e){
		if(e.keyCode == 87){
			ship.wIsPressed = 1;
		}
	}

	function draw() {
		ctx.clearRect(0, 0, cx*2, cy*2);
		map.draw(ctx, cx, cy);
	}

	function update(){
		ship.calculateAngle(mouseX, mouseY, cx, cy);
		ship.calculatePos();
		ship.moveBullets(cx, cy);
		for(var i = 0; i < numberOfEnemies; i++) {
			enemies[i].calculateAngle(ship.x, ship.y, enemies[i].x, enemies[i].y);
			enemies[i].calculatePos();
			ship.collideBullets(enemies[i]);
			if(enemies[i].isDead()) {
				enemies.splice(i, 1);
				numberOfEnemies--;
			}
		}
		draw();
	}

	var refreshIntervalId = setInterval(update, 10);
}
			