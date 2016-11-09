function birdArray() {
  var addX = 1/7;
  var addY = 1/3;
  for(var y = 1; y > 0; y -= addY){
    for(var x = 0, i = 0; i < 7; x += addX, i++){
      birdPointArr.push([
        [new THREE.Vector2(x, y), new THREE.Vector2(x, y - addY), new THREE.Vector2(x + addX, y)],
        [new THREE.Vector2(x, y - addY), new THREE.Vector2(x + addX, y - addY), new THREE.Vector2(x + addX, y)],
      ]);
    }
  }
}

function addBird(geo, met, birdNo){
  bird = [];
  for(var i = 0; i < birdNo; i ++){
    var birdPos = new THREE.Vector3(
      Math.random() * (totalLen - window.innerWidth * 0.5) + window.innerWidth * 0.25,
      Math.random() * window.innerHeight * 2 / 3,
      0);
    birdPos.y += (window.innerHeight * 7 / 30 - catY * 2 / 3);
    bird.push(new THREE.Mesh(geo, met));
    bird[i].position.copy(birdPos);
    scene.add(bird[i]);
  }
}

function birdSprite(nowBird){
  for(var i = 0; i < bird[0].geometry.faceVertexUvs[0].length; i++)
    for(var j = 0; j < 3; j++)
      bird[0].geometry.faceVertexUvs[0][i][j].copy(birdPointArr[nowBird][i][j]);
  bird[0].geometry.uvsNeedUpdate = true;
  return (nowBird + 1) % 21;
}
