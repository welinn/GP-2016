function createArray() {
  var addX = .5;
  var addY = .25;
  for(var y = 1; y > 0; y -= addY){
    for(var x = 0; x < 1; x += addX){
      pointArr.push([
        [new THREE.Vector2(x, y), new THREE.Vector2(x, y - addY), new THREE.Vector2(x + addX, y)],
        [new THREE.Vector2(x, y - addY), new THREE.Vector2(x + addX, y - addY), new THREE.Vector2(x + addX, y)],
      ]);
    }
  }
}

function spriteAnimate(nowPicture){
  for (var i = 0; i < cat.geometry.faceVertexUvs[0].length; i++)  //三角形(面)的個數
    for (var j = 0; j < 3; j++)  //一個面3個點
      cat.geometry.faceVertexUvs[0][i][j].copy(pointArr[nowPicture][i][j]);
  cat.geometry.uvsNeedUpdate = true;
  return (nowPicture + 1) % 8;  //貓貓有8張圖
}
