'use strict'
$(function(){
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var canvasEl = document.getElementById('c');
	canvasEl.width = w;
	canvasEl.height = h;

	var canvas = new fabric.Canvas('c');
	canvas.selection = false;

	var grassImgWidth = 299;
	var grassImgHeight = 168;
	var horizontalAmount = Math.ceil(w / grassImgWidth);
	var verticalAmount = Math.ceil(h / grassImgHeight) + 1;
	console.log(verticalAmount);
	console.log(horizontalAmount);

	var grass = document.getElementById('grass');
	var grassObject = [];
	for (var i = 0; i < verticalAmount; i++) {
		grassObject.push([]);
		for (var j = 0; j < horizontalAmount; j++) {
			var newImage = new  fabric.Image(grass, {
				top: - grassImgHeight + (i * grassImgHeight),
				left: 0 + (j * grassImgWidth),
				selectable : false
			});
			grassObject[i].push(newImage)
			canvas.add(grassObject[i][j]);
		}
	}

		function grassMooving() {
			if (grassObject[0][0].top > -10) {
				var lastRow = grassObject[verticalAmount - 1];
				grassObject.splice(verticalAmount - 1, 1);
				grassObject.unshift(lastRow);
				grassObject[0].forEach(function(item){
					item.top = - grassImgHeight;
				})
			};
			
			var key;
			grassObject.forEach(function(innerArray){
				innerArray.forEach(function(item){
					item.top+=2;
				})
			})
			canvas.renderAll();
		};

		(function animation(){
			grassMooving();
			fabric.util.requestAnimFrame(animation);
		})();

	var plane = document.getElementById('plane');

	var planeProperies = {};
		planeProperies.width = 100,
		planeProperies.height = planeProperies.width * 0.8, //image proporions
		planeProperies.top = h - planeProperies.height - 20,
		planeProperies.left = w / 2 - planeProperies.width//100 is a width
		planeProperies.transformMatrix = [1,.30,0,1,0,0];

	var planeInstance = new fabric.Image(plane, planeProperies);
	canvas.add(planeInstance);

})