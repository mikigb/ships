function main(){
	var canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");
	var cx = canvas.width/2;
	var cy = canvas.height/2;  

	function SpaceShip(x, y, src, vel) {
		this.x = x/2;
		this.y = y/2;
	    this.img = new Image(); 
    	this.img.src = src;
    	this.img.width = 100;
    	this.img.height = 100;
	    this.vel = vel;
	    this.ang = 0;
	    this.bullets = [];

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

    	this.draw = function(ctx, x, y) {
    		ctx.save();
			ctx.translate(x, y);
			ctx.rotate(this.ang + Math.PI/2);
			ctx.translate(-x, -y);
			ctx.drawImage(this.img, x - this.img.width/2, y - this.img.height/2, this.img.width, this.img.height);
			ctx.restore();
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
	var ship = new SpaceShip(map.maxWidth/2, map.maxHeight/2, "nave-1.png", 10);
	var enemy = new SpaceShip(map.maxWidth/2 + 200, map.maxHeight/2 + 200, "nave-1.png", 0.5);

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

		draw();
	}

	var refreshIntervalId = setInterval(update, 10);
}
			