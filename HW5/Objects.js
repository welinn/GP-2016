var Bomb = function(halfWidth, bodyLen, headLen) {
  
  THREE.Object3D.call(this);

  var material = new THREE.MeshLambertMaterial({
    color: 0x009922,
    transparent: true
  });
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
  this.mesh = mesh;
  this.pos = new THREE.Vector3();
  this.vel = new THREE.Vector3();
  this.posNdtVel = new THREE.Vector3();
  this.force = new THREE.Vector3();
  this.target = new THREE.Vector3();
  this.blockForce = new THREE.Vector3();
  this.maxSpeed = 60;
  this.maxForce = 60;
  this.halfWidth = halfWidth;
  this.bodyLen = bodyLen;
  this.seek;
  this.seekDist;
  this.time;
  this.disappear;
  this.hit;

}

Bomb.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {

  constructor: Bomb,
  
  init: function(target, seekDist, time, initPos){
    this.target.copy(target);
    this.seek = false;
    this.seekDist = seekDist;
    this.time = time;
	this.vel.y = 60;
    this.disappear = false;
    this.hit = false;
    if(initPos){
      this.pos.copy(initPos);
    }
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
        if(dist < blocks[i].r * 3){  // close enough
          this.seek = true;
          repulsion = tmpProj.clone().sub(tmp);
          blockForce.add(repulsion.setLength(100));

        }
      }
    }

    this.blockForce.copy(blockForce);
  },

  update: function(dt, height) {

    this.force = this.blockForce;

    if(this.position.y > height || this.seek){
      this.seek = true;

      // compute force
      this.force.add(this.target.clone().sub(this.pos).setLength(this.maxSpeed).sub(this.vel));

      // force clamping
      if (this.force.length() > this.maxForce)
        this.force.setLength(this.maxForce);
      this.vel.add(this.force.clone().multiplyScalar(dt));
    }

    else{
      if (this.force.length() > this.maxForce)
        this.force.setLength(this.maxForce);

      var len = this.vel.length();
      this.vel = this.localToWorld(new THREE.Vector3(0, 1, 0)).sub(this.localToWorld(new THREE.Vector3())).normalize().setLength(len).add(this.force.clone().multiplyScalar(dt));
    }
	
    // velocity clamping
    if (this.vel.length() > this.maxSpeed)
      this.vel.setLength(this.maxSpeed);
    
    this.posNdtVel.copy(this.pos);
    this.posNdtVel.add(this.vel.clone().multiplyScalar(dt * 100));
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
  this.rotation.reorder('YXZ');

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
  
  var material = new THREE.MeshLambertMaterial({
    color: 0xaaff00,
    transparent: true,
  });

  var body = new THREE.Mesh(
    new THREE.ParametricGeometry(THREE.ParametricGeometries.klein, 10, 20),
    material
  );
  body.geometry.scale(2, 2, 3);
  body.rotation.z = Math.PI * 0.5;

  var fly = new THREE.Mesh(
    new THREE.BoxGeometry(3, 48, 10),
    material
  );
  body.add(fly);

  this.add(body);
  this.halfLen = 24;
  this.vel = new THREE.Vector3(1, 1, 1).setLength(60);
  this.fly = false;
  this.force = new THREE.Vector3();
  this.maxSpeed = 80;
  this.maxForce = 80;
  this.rotation.reorder('YXZ');
  this.p0;
  this.p1;
  this.p2;
  this.rotationMinR = 250;
}

ABM.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
  constructor: ABM,

  update: function(dt, headPos, bomb){

    this.force = bomb.posNdtVel.clone().sub(this.position).setLength(this.maxForce).sub(this.vel);

    if (this.force.length() > this.maxForce)
      this.force.setLength(this.maxForce);
    this.vel.add(this.force.clone().multiplyScalar(dt));
    
    if (this.vel.length() > this.maxSpeed)
      this.vel.setLength(this.maxSpeed);
    this.position.add(this.vel.clone().multiplyScalar(dt));


    var oldZ = this.rotation.z;

    this.p2 = this.p1;
    this.p1 = this.p0;
    this.p0 = this.position.clone();

    var abmCenter = this.localToWorld(new THREE.Vector3());
    var axisX = this.localToWorld(new THREE.Vector3(0, 0, 1)).clone().cross(this.vel).normalize();
    var axisZ = this.vel.clone().normalize();
    var axisY = axisX.clone().cross(axisZ);
    var m = new THREE.Matrix4();
    m.makeBasis(axisX, axisY, axisZ);
    this.rotation.setFromRotationMatrix(m);
    this.rotation.z = this.rolling(oldZ);
  },

  rolling: function(oldZ){

    if(this.p2 !== undefined){

      var q0 = this.p0.clone().add(this.p1).divideScalar(2);
      var q1 = this.p1.clone().add(this.p2).divideScalar(2);
      var p0p1 = this.p0.clone().sub(this.p1);
      var p1p2 = this.p1.clone().sub(this.p2);
      var n = p0p1.clone().cross(p1p2);
      var v0 = n.clone().cross(p0p1);
      var v1 = n.clone().cross(p1p2);
      var q1q0 = q1.clone().sub(q0);
      var s = -p0p1.clone().dot(q1q0) / p0p1.clone().dot(v1);
      var c = q1.clone().add(v1.clone().multiplyScalar(s));
      var r = c.clone().sub(this.p0).length();

      if(r <= this.rotationMinR){
        var multi = (this.rotationMinR - r) / this.rotationMinR;
        return multi * Math.PI * 0.5;
      }
    }
    return oldZ;
  },

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
