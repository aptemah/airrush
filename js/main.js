$(function(){
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var canvasEl = document.getElementById('c');
  canvasEl.width = w;
  canvasEl.height = h;
  var canvas = new fabric.Canvas('c');  
})