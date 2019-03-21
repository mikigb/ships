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
	    this.explosion = [];
	    this.explosionFlag = 0;
	    this.hitted = 0;

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
			    if(this.bullets[i].collide(ship)) {
			    	this.bullets.splice(i, 1);
			    }
			}
    	}

    	this.hit = function(){
    		this.life-=10;
    		if(this.life <= 0 && !this.hitted){
    			for(var i = 0, j = 0; i < 15; i++) {
    				this.explosion[j] = new Image();
    				this.explosion[j].src = "explosion/explosion_" + i + ".png";
    				this.explosion[j+1] = new Image();
    				this.explosion[j+1].src = "explosion/explosion_" + i + ".png";
    				this.explosion[j+2] = new Image();
    				this.explosion[j+2].src = "explosion/explosion_" + i + ".png";
    				this.explosion[j+3] = new Image();
    				this.explosion[j+3].src = "explosion/explosion_" + i + ".png";
    				j+=4;
    			}
    			this.img.width = 128;
			    this.img.height = 128; 
    			this.hitted++;
    		}
    	}

    	this.draw = function(ctx, x, y) {
    		if(this.explosionFlag < 60) {
	    		if(this.life <= 0){
	    			this.img = this.explosion[this.explosionFlag];
				    this.explosionFlag++;
	    		} 

		    	ctx.save();
				ctx.translate(x, y);
				ctx.rotate(this.ang + Math.PI/2);
				ctx.translate(-x, -y);
				ctx.drawImage(this.img, x - this.img.width/2, y - this.img.height/2, this.img.width, this.img.height);
				ctx.restore();

				if(this.life > 0){
					ctx.beginPath();
					ctx.moveTo((x - this.img.width/2)-10, y - this.img.height/2);
					ctx.lineTo(((x - this.img.width/2)-10)+this.life, y - this.img.height/2);
					ctx.strokeStyle = "green";
					ctx.stroke();
					ctx.closePath();
				}
			}
    	};
	}

	function Bullet(x, y, ang, vel){
		this.x = x;
		this.y = y;
		this.ang = ang;
		this.vel = vel;

		this.calculatePos = function() {
	    	var movX = Math.cos(this.ang)*this.vel;
		    var movY = Math.sin(this.ang)*this.vel;

		    this.x += movX;
		    this.y += movY;
    	};

    	this.collide = function(obj) {
    		if((this.x < obj.x + obj.img.width/2 && this.x > obj.x - obj.img.width/2)
    			&& (this.y < obj.y + obj.img.height/2 && this.y > obj.y - obj.img.height/2)){
    			obj.hit();
    			return 1;
    		}
    		return 0;	
    	}

    	this.draw = function(ctx, x, y) {
			ctx.beginPath();
			ctx.arc(x, y, 2, 0, 2 * Math.PI);
		    ctx.fillStyle = "#000000";
		    ctx.fill();
		    ctx.closePath();
    	};
	}

	function Mapa(){
		this.minWidth = 0;
		this.minHeight = 0;
		this.maxWidth = 5000;
		this.maxHeight = 3000;

		this.draw = function(ctx, cx, cy) {

			var minx = 0;
			var miny = 0;

			if(ship.x < cx){
				minx = cx - ship.x;
			}

			if(ship.y < cy){
				miny = cy - ship.y;
			}

			ctx.beginPath();
			ctx.rect(minx, miny, this.maxWidth - (ship.x + cx), this.maxHeight - (ship.y + cy));
		    ctx.fillStyle = "#ffffff";
		    ctx.fill();
		    ctx.closePath();

		    ship.draw(ctx, cx, cy);

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

		    for(var i = 0; i < ship.bullets.length; i++){
		    	ship.bullets[i].draw(ctx, cx + (ship.bullets[i].x - ship.x), cy + (ship.bullets[i].y - ship.y));
		    }

		    /*ctx.font = "30px Arial";
			ctx.fillStyle = "red";
			ctx.textAlign = "center";
			ctx.fillText(ship.bullets.length, 10, 50);*/
    	}; 	
	}

	var map = new Mapa();
	var ship = new SpaceShip(map.maxWidth/2, map.maxHeight/2, "nave-1.png", 10, 100);
	var enemy = new SpaceShip(map.maxWidth/2 + 200, map.maxHeight/2 + 200, "nave-1.png", 0.5, 100);

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
			ship.calculatePos();
		}
	}

	function draw() {
		ctx.clearRect(0, 0, cx*2, cy*2);
		map.draw(ctx, cx, cy);
	}

	function update(){
		ship.calculateAngle(mouseX, mouseY, cx, cy);
		enemy.calculateAngle(ship.x, ship.y, enemy.x, enemy.y);
		enemy.calculatePos();
		ship.moveBullets(cx, cy);
		ship.collideBullets(enemy);


		draw();
	}

	var refreshIntervalId = setInterval(update, 10);
}
			