'use strict'
var Airrush = function() {
	this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	this.viewportHeigth = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	this.grassImgWidth = 299; //see doc.txt
	this.grassImgHeight = 168; //see doc.txt
	this.horizontalAmount = Math.ceil(this.viewportWidth / this.grassImgWidth);
	this.verticalAmount = Math.ceil(this.viewportHeigth / this.grassImgHeight) + 1;

	this.dangerZone = {};

	this.stateOfSwing = 0;
	this.planeStates = [
		[ 1,    0,     0, 1, -11,  0 ],
		[ 0.99, 0.01,  0, 1, -11,  0 ],
		[ 0.98, 0.02,  0, 1, -10,  0 ],
		[ 0.97, 0.03,  0, 1, -8,  0 ],
		[ 0.96, 0.04,  0, 1, -5,  0 ],
		[ 0.95, 0.05,  0, 1, -1, 0 ],
		[ 0.96, 0.04,  0, 1, 4, 0 ],
		[ 0.97, 0.03,  0, 1, 7, 0 ],
		[ 0.98, 0.02,  0, 1, 9, 0 ],
		[ 0.99, 0.01,  0, 1, 10, 0 ],
		[ 1,    0,     0, 1, 11, 0 ],
		[ 0.99, -0.01, 0, 1, 11, 0 ],
		[ 0.98, -0.02, 0, 1, 10, 0 ],
		[ 0.97, -0.03, 0, 1, 9, 0 ],
		[ 0.96, -0.04, 0, 1, 7, 0 ],
		[ 0.95, -0.05, 0, 1, 4, 0 ],
		[ 0.96, -0.04, 0, 1, -1,  0 ],
		[ 0.97, -0.03, 0, 1, -5,  0 ],
		[ 0.98, -0.02, 0, 1, -8,  0 ],
		[ 0.99, -0.01, 0, 1, -10,  0 ],
	];

	this.level = {
		'enemies' : [
			{'type' : 'heli', 'time' : 1000},
			{'type' : 'heli', 'time' : 3000},
		]
	}

};

Airrush.prototype.init = function() {
	this.canvasEl = document.getElementById('c');
	this.canvasEl.width = this.viewportWidth;
	this.canvasEl.height = this.viewportHeigth;

	this.canvas = new fabric.Canvas('c');
	this.canvas.selection = false;

	this.addGrass();
	this.addPlane();
	this.addShots();
	this.animation();
	this.levelBuild();
};

Airrush.prototype.levelBuild = function() {
	var self = this;
	for (var enemy in this.level.enemies) {
		switch(self.level.enemies[enemy].type) {
		case('heli'):
			setTimeout(function(){self.addHeli()}, self.level.enemies[enemy].time);
		break;
		}
	}
	
};

Airrush.prototype.addGrass = function() {
	var grass = document.getElementById('grass');
	this.grassObject = [];
	for (var i = 0; i < this.verticalAmount; i++) {
		this.grassObject.push([]);
		for (var j = 0; j < this.horizontalAmount; j++) {
			var newImage = new  fabric.Image(grass, {
				top: - this.grassImgHeight + (i * this.grassImgHeight),
				left: 0 + (j * this.grassImgWidth),
				selectable : false
			});
			this.grassObject[i].push(newImage)
			this.canvas.add(this.grassObject[i][j]);
		}
	}
};

Airrush.prototype.addShots = function() {
	var self = this;
	this.shots = [];
	var i = 0,
			left = true;

	var intervalID = setInterval(function(){

		if (i < 10) {
			self.shots[i] = new fabric.Rect({
				width: 3,
				height: 5,
				fill: '#ffffff',
				top: self.planeInstance.top,
				left: left ? self.planeInstance.left : self.planeInstance.left + self.planeInstance.width
			});
			self.canvas.add(self.shots[i]);
			i++, left = !left
		} else {
			var lastShot = self.shots[0];
			self.shots.splice(0, 1);
			self.shots.push(lastShot);
			self.shots[0].top = self.planeInstance.top;
			self.shots[0].left = left ? self.planeInstance.left : self.planeInstance.left + self.planeInstance.width;
			left = !left;
		}

	},500);

};

Airrush.prototype.addPlane = function() {
	var plane = document.getElementById('plane');

	var planeStatesAverangeOffset = this.planeStates[this.planeStates.length / 2][4] / 2;

	this.planeProperies = {};
		this.planeProperies.width = 100,
		this.planeProperies.height = this.planeProperies.width, //images should be square
		this.planeProperies.top = this.viewportHeigth - this.planeProperies.height - 20,
		this.planeProperies.left = this.viewportWidth / 2 - this.planeProperies.width / 2;
		this.planeProperies.hasBorders = false;
		this.planeProperies.hasControls = false;

	this.planeInstance = new fabric.Image(plane, this.planeProperies);
	this.canvas.add(this.planeInstance);

};

Airrush.prototype.addHeli = function() {
	var heli = document.getElementById('heli');

	this.heliProperies = {};
		this.heliProperies.width = 100,
		this.heliProperies.height = this.heliProperies.width, //images should be square
		this.heliProperies.top = 100,
		this.heliProperies.angle = 180,
		this.heliProperies.transformMatrix = [ 1,0,0,1,-100,0 ],//alignment after angle
		this.heliProperies.left = this.viewportWidth / 2 - this.heliProperies.width / 2;
		this.heliProperies.selectable = false;

	this.heliInstance = new fabric.Image(heli, this.heliProperies);
	this.canvas.add(this.heliInstance);

};

Airrush.prototype.animation = function() {
	var self = this;
	var movingObjects = {};

	movingObjects.grassMooving = function(){
		if (self.grassObject[0][0].top > -10) {
			var lastRow = self.grassObject[self.verticalAmount - 1];
			self.grassObject.splice(self.verticalAmount - 1, 1);
			self.grassObject.unshift(lastRow);
			self.grassObject[0].forEach(function(item){
				item.top = - self.grassImgHeight;
			})
		};
		
		var key;
		self.grassObject.forEach(function(innerArray){
			innerArray.forEach(function(item){
				item.top+=2;
			})
		})
	};

	movingObjects.planeSwing = function() {
		if (typeof self.planeSwingDivider == "undefined") {
			self.planeSwingDivider = 5
		} else {
			if (self.planeSwingDivider == 0) {
				self.planeInstance.transformMatrix = self.planeStates[self.stateOfSwing];
				if (self.stateOfSwing < 19) {
					self.stateOfSwing++;
					self.planeSwingDivider = 3;
				} else { self.stateOfSwing = 0 };
			} else {
				self.planeSwingDivider--
			}
		}
	};

	movingObjects.shotsMoving = function(){
		//if (self.shots[0] )
		self.shots.forEach(function(item){
			item.top-=3;
		})
	};

	movingObjects.test = function() {
		//self.dangerZone.heli = [
		//	self.heliInstance.left,
		//	self.heliInstance.left + self.heliProperies.width,
		//	self.heliInstance.top,
		//	self.heliInstance.top + self.heliProperies.height,
		//]
		//console.log(self.dangerZone.heli)
	};

	(function animate() {
		for (var key in movingObjects) {
			if (!movingObjects.hasOwnProperty(key)) continue;
			movingObjects[key]();
		}
		fabric.util.requestAnimFrame(animate);
		self.canvas.renderAll();
	})();
};