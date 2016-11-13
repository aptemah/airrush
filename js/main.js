'use strict'
$(function(){
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var canvasEl = document.getElementById('c');
  canvasEl.width = w;
  canvasEl.height = h;

  var canvas = new fabric.Canvas('c');

  var grassImgWidth = 299;
  var grassImgHeight = 168;
  var horizontalAmount = Math.ceil(w / grassImgWidth);
  var verticalAmount = Math.ceil(h / grassImgHeight);
  console.log(verticalAmount);
  console.log(horizontalAmount);

  var grass = document.getElementById('grass');
  var grassObject = {};
  for (var i = 0; i < horizontalAmount; i++) {
    for (var j = 0; j < verticalAmount; j++) {
      var keyName = i + '' + j;
      console.log(keyName);
      grassObject[keyName] = new fabric.Image(grass, {
        top: 0 + (j * grassImgHeight),
        left: 0 + (i * grassImgWidth),
      });
      canvas.add(grassObject[keyName]);
    }
  }
  setTimeout(function(){
    (function animate() {
      var key;
      for (key in grassObject) {
        console.log(grassObject[key])
        grassObject[key].top+=1;
      }
      canvas.renderAll();
      fabric.util.requestAnimFrame(animate);
    })();
  },3000)

  var plane = document.getElementById('plane');
  var planeInstance = new fabric.Image(plane, {
    left: 100,
    top: 100,
    angle: 30,
    opacity: 0.85
  });
  canvas.add(planeInstance);

})