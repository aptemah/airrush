'use strict'
var Airrush = function() {
	this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	this.viewportHeigth = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	this.grassImgWidth = 299; //see doc.txt
	this.grassImgHeight = 168; //see doc.txt
	this.horizontalAmount = Math.ceil(this.viewportWidth / this.grassImgWidth);
	this.verticalAmount = Math.ceil(this.viewportHeigth / this.grassImgHeight) + 1;

	this.stateOfSwing = 0;
		this.planeStates = [
			[ 1, 0, 0, 1, 0, 0 ],
			[ 0.99, 0.01, 0, 1, 0, 0 ],
			[ 0.98, 0.02, 0, 1, 1, 0 ],
			[ 0.97, 0.03, 0, 1, 3, 0 ],
			[ 0.96, 0.04, 0, 1, 6, 0 ],
			[ 0.95, 0.05, 0, 1, 10, 0 ],
			[ 0.96, 0.04, 0, 1, 15, 0 ],
			[ 0.97, 0.03, 0, 1, 18, 0 ],
			[ 0.98, 0.02, 0, 1, 20, 0 ],
			[ 0.99, 0.01, 0, 1, 21, 0 ],
			[ 1, 0, 0, 1, 22, 0 ],
			[ 0.99, -0.01, 0, 1, 22, 0 ],
			[ 0.98, -0.02, 0, 1, 21, 0 ],
			[ 0.97, -0.03, 0, 1, 18, 0 ],
			[ 0.96, -0.04, 0, 1, 15, 0 ],
			[ 0.95, -0.05, 0, 1, 10, 0 ],
			[ 0.96, -0.04, 0, 1, 6, 0 ],
			[ 0.97, -0.03, 0, 1, 3, 0 ],
			[ 0.98, -0.02, 0, 1, 1, 0 ],
			[ 0.99, -0.01, 0, 1, 0, 0 ],
		];

};

Airrush.prototype.init = function() {
	this.canvasEl = document.getElementById('c');
	this.canvasEl.width = this.viewportWidth;
	this.canvasEl.height = this.viewportHeigth;

	this.canvas = new fabric.Canvas('c');
	this.canvas.selection = false;

	this.addGrass();
	this.addPlane();
	this.animation();
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

Airrush.prototype.addPlane = function() {
	var plane = document.getElementById('plane');

	var planeProperies = {};
		planeProperies.width = 100,
		planeProperies.height = planeProperies.width * 0.8, //image proporions, see doc.txt
		planeProperies.top = this.viewportHeigth - planeProperies.height - 20,
		planeProperies.left = this.viewportWidth / 2 - planeProperies.width//100 is a width
		//planeProperies.transformMatrix = [1,.30,0,1,0,0];

	this.planeInstance = new fabric.Image(plane, planeProperies);
	this.canvas.add(this.planeInstance);
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
				if (self.stateOfSwing < 20) {
					self.stateOfSwing++;
					self.planeSwingDivider = 3;
				} else { self.stateOfSwing = 0 };
			} else {
				self.planeSwingDivider--
			}
		}
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