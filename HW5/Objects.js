var Bomb = function(halfWidth, bodyLen, headLen, initPos) {
  
  THREE.Object3D.call(this);

  var material = new THREE.MeshLambertMaterial({color: 0x009922});
  var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(halfWidth, halfWidth, bodyLen - headLen, 32),
    material);
  var meshHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0, halfWidth, headLen, 32),
    material);
  meshHead.position.y = bodyLen * 0.5;
  mesh.add(meshHead);
  mesh.position.y = (bodyLen - headLen) * 0.5;

  this.add(mesh);
  this.pos = new THREE.Vector3();
//  this.initPos = new THREE.Vector3();
  this.vel = new THREE.Vector3();
  this.force = new THREE.Vector3();
  this.target = new THREE.Vector3();
  this.blockForce = new THREE.Vector3();
  this.maxSpeed = 60;
  this.maxForce = 60;
  this.halfWidth = halfWidth;
  this.bodyLen = bodyLen;
  this.seek = false;
  
  if(initPos){
    this.pos.copy(initPos);
//    this.initPos.copy(initPos);
  }
}

Bomb.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {

  constructor: Bomb,
  
  init: function(target){
    this.target.copy(target);
//    this.position.copy(this.pos);
	this.vel.y = 60;
  },

  checkNearBlock: function(blocks){

    var blockForce = new THREE.Vector3();
    var tmp = new THREE.Vector3();
    var tmpProj, repulsion;
    var totalBlock = blocks.length;

    for(var i = 0; i < totalBlock; i++){
      tmp = blocks[i].pos.clone().sub(this.pos);


      if(tmp.clone().dot(this.vel) > 0){  // in front

        tmpProj = tmp.clone().projectOnVector(this.vel);
        var dist = this.pos.clone().sub(blocks[i].pos).length();
        if(dist < blocks[i].r * 3.5){  // close enough

          repulsion = tmpProj.clone().sub(tmp);
          blockForce.add(repulsion.setLength(100));

        }
      }
    }

    this.blockForce.copy(blockForce);
  },

  update: function(dt, height) {

    if(this.position.y > height || this.seek){
      this.seek = true;

      // compute force
      this.force = this.target.clone().sub(this.pos).setLength(this.maxSpeed).sub(this.vel).add(this.blockForce);

      // force clamping
      if (this.force.length() > this.maxForce)
        this.force.setLength(this.maxForce);
      this.vel.add(this.force.clone().multiplyScalar(dt));
    }

    else{
      var len = this.vel.length();
      this.vel = this.localToWorld(new THREE.Vector3(0, 1, 0)).sub(this.localToWorld(new THREE.Vector3())).normalize().setLength(len);	
    }
	
    // velocity clamping
    if (this.vel.length() > this.maxSpeed)
      this.vel.setLength(this.maxSpeed);
    this.pos.add(this.vel.clone().multiplyScalar(dt));

    this.position.copy(this.pos);

    var quaternion = new THREE.Quaternion();
    var localDir = new THREE.Vector3(0,1,0);
    var angle = localDir.angleTo (this.vel);
    var axis = new THREE.Vector3();
    axis.crossVectors (localDir, this.vel).normalize();
    quaternion.setFromAxisAngle (axis,angle);
    this.quaternion.copy (quaternion);

  },

});

var Car = function(bomb, halfWidth, bodyLen){

  THREE.Object3D.call(this);

  var ball_r = 3;
  var material = new THREE.MeshLambertMaterial({color: 0x123456});
  var mesh = new THREE.Mesh(
    new THREE.BoxGeometry(halfWidth * 2 + 4, bodyLen, 5),
    material);
  var mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(2, bodyLen, 5),
    material);
  var mesh3 = mesh2.clone();
  var mesh4 = new THREE.Mesh(
    new THREE.BoxGeometry(halfWidth * 2, 5, 5),
    material);
  var mesh_ball = new THREE.Mesh(
    new THREE.SphereGeometry(ball_r, 32, 32),
    material);

  mesh2.position.set( halfWidth + 1, 0, 5);
  mesh3.position.set(-halfWidth - 1, 0, 5);
  mesh4.position.set(0, -bodyLen * 0.5 + 2.5, 5);
  
  mesh.add(mesh2);
  mesh.add(mesh3);
  mesh.add(mesh4);
  this.add(mesh_ball);
  
  mesh.position.z -= halfWidth * 0.5;
  mesh.position.y = bodyLen * 0.5;

  this.position.copy(bomb.pos);
  this.position.y += ball_r;
  this.shoot = false;
  
  bomb.position.y += 5;
  bomb.position.z += halfWidth;
  this.bomb = bomb;
  this.add(bomb);
  this.add(mesh);

}

Car.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
  constructor: Car,
  shooting: function(){
    this.shoot = true;
    this.bomb.pos = this.localToWorld(this.bomb.position);
    this.bomb.position.copy(this.bomb.pos);
    this.remove(this.bomb);
  }
});

var ABM = function(){
  THREE.Object3D.call(this);

  var body = new THREE.Mesh(
    new THREE.ParametricGeometry(THREE.ParametricGeometries.klein, 10, 20),
    new THREE.MeshLambertMaterial( { color: 0xaaff00 } )
  );
  body.geometry.scale(2, 2, 3);
  body.rotation.z = Math.PI * 0.5;

  this.add(body);

}

ABM.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
  constructor: ABM,
  

//dt = bomb.pos.sub(this.position) / this.vel.sub(bomb.vel)

});

var Block = function(r, p, m){
  this.r = r;
  this.pos = p;
  this.mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 32, 32),
    m
  );
  this.mesh.position.copy(p);
}
