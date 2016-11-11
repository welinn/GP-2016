function makeBackground(backgroundCount, width, height, b){
  var background = new THREE.Object3D();

  for (var i = 0; i < backgroundCount; i++){
    var tmp = new THREE.Mesh (new THREE.PlaneGeometry (width, height), b);
    tmp.position.y = height * 0.4;
    tmp.position.x = (i + 0.5) * width;
    background.add(tmp);
  }
  return background;
}

function makeGround(){
  var g = new THREE.Object3D();
  var theta = Math.atan(0.1);
  var tenTheta = Math.tan(theta);
  var met = new THREE.MeshBasicMaterial({color: 0x226622});
  var geo = new THREE.Geometry();
  geo.vertices.push(new THREE.Vector3(totalLen * 2 /  5, totalLen / 75, 0));
  geo.vertices.push(new THREE.Vector3(totalLen * 4 / 15, 0, 0));
  geo.vertices.push(new THREE.Vector3(totalLen * 2 /  5, 0, 0));
  geo.vertices.push(new THREE.Vector3(totalLen * 7 / 15, totalLen / 75, 0));
  geo.vertices.push(new THREE.Vector3(totalLen * 7 / 15, 0, 0));
  geo.vertices.push(new THREE.Vector3(totalLen * 3 /  5, 0, 0));
  geo.faces.push(new THREE.Face3(0, 1, 2));
  geo.faces.push(new THREE.Face3(0, 2, 3));
  geo.faces.push(new THREE.Face3(3, 2, 4));
  geo.faces.push(new THREE.Face3(3, 4, 5));

  var mesh1 = new THREE.Mesh(new THREE.PlaneGeometry(totalLen / 10, window.innerHeight * 0.1), met);
  var mesh2 = new THREE.Mesh(new THREE.PlaneGeometry(totalLen / 10, window.innerHeight * 0.2), met);
  var mesh3 = new THREE.Mesh(new THREE.PlaneGeometry(totalLen / 15, window.innerHeight * 0.1), met);
  var mesh4 = new THREE.Mesh(new THREE.PlaneGeometry(totalLen * 1 / 3, window.innerHeight * 0.1), met);
  var mesh6 = new THREE.Mesh(geo, met);
  var mesh9 = new THREE.Mesh(new THREE.PlaneGeometry(totalLen / 15, window.innerHeight * 0.15), met);
  var mesh10 = new THREE.Mesh(new THREE.PlaneGeometry(totalLen / 15, window.innerHeight * 0.2), met);
  var mesh11 = new THREE.Mesh(new THREE.PlaneGeometry(totalLen / 15, window.innerHeight * 0.25), met);

  mesh1.position.set(totalLen / 20, -window.innerHeight * 0.05, 0);
  mesh2.position.set(totalLen * 3 / 20, 0, 0);
  mesh3.position.set(totalLen * 7 / 30, -window.innerHeight * 0.05, 0);
  mesh4.position.set(totalLen * 13 / 30, -window.innerHeight * 0.05, 0);
  var mesh7 = mesh2.clone();
  var mesh8 = mesh1.clone();
  mesh7.position.x = totalLen * 13 / 20;
  mesh8.position.x = totalLen * 15 / 20;
  mesh9.position.set(totalLen * 5 / 6, -window.innerHeight * 0.025, 0);
  mesh10.position.set(totalLen * 9 / 10, 0, 0);
  mesh11.position.set(totalLen * 29 / 30, window.innerHeight * 0.025, 0); 

  g.add(mesh1);
  g.add(mesh2);
  g.add(mesh3);
  g.add(mesh4);
  g.add(mesh6);
  g.add(mesh7);
  g.add(mesh8);
  g.add(mesh9);
  g.add(mesh10);
  g.add(mesh11);

  return g;
}

function groundHight(x, block){
  if(x < totalLen / 10){
    if(block) return [0, 1];
    return 0;
  } else if(x < totalLen / 5){
    if(block) return [window.innerHeight * 0.1, 2];
    return window.innerHeight * 0.1;
  } else if(x < totalLen * 4 / 15){
    if(block) return [0, 3];
    return 0;
  } else if(x < totalLen * 2 / 5){
    var input = (x - totalLen * 4 / 15);
    if(block) return [input * 0.1, 3];
    return input * 0.1;
  } else if(x < totalLen * 7 / 15){
    if(block) return [totalLen / 75, 3];
    return totalLen / 75;
  } else if(x < totalLen * 3 / 5){
    var input = (x - totalLen * 7 / 15);
    var coef = totalLen / 75;
    if(block) return [-input * coef / (totalLen * 2 / 15) + coef, 3];
    return -input * coef / (totalLen * 2 / 15) + coef;
  } else if(x < totalLen * 7 / 10){
    if(block) return [window.innerHeight * 0.1, 4];
    return window.innerHeight * 0.1;
  } else if(x < totalLen * 4 / 5){
    if(block) return [0, 5];
    return 0;
  } else if(x < totalLen * 13 / 15){
    if(block) return [window.innerHeight * 0.05, 6];
    return window.innerHeight * 0.05;
  } else if(x < totalLen * 14 / 15){
    if(block) return [window.innerHeight * 0.1, 7];
    return window.innerHeight * 0.1;
  } else {
    if(block) return [window.innerHeight * 0.15, 8];
    return window.innerHeight * 0.15;
  }
}

function wall(xh, xm, y){
  var head = groundHight(xh, true);
  var mid = groundHight(xm, true);
  if(head[1] !== mid[1] && head[0] > mid[0] && y < head[0] + catY){
    vel.x *= -.1;
    back = true;
  }
}

