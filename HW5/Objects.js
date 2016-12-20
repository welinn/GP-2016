var Bomb = function(mesh, targetHalfWidth, h, bodyLen, headLen, initPos) {

  this.pos = new THREE.Vector3();
  this.headPos = new THREE.Vector3(0, bodyLen * 0.5 + headLen, 0);
  this.initPos = new THREE.Vector3();

  if (initPos){
    this.pos.copy(initPos);
    this.headPos.add(initPos);
    this.initPos.copy(initPos);
  }

  this.vel = new THREE.Vector3();
  this.force = new THREE.Vector3();
  this.target = new THREE.Vector3();
  this.targetHalfWidth = targetHalfWidth;
  this.blockForce = new THREE.Vector3();
  this.mesh = mesh;
  this.maxSpeed = 60;
  this.maxForce = 60;
  this.halfWidth = h;
//  this.bodyLen = bodyLen;
  this.seek = false;

}

Bomb.prototype = {

  init: function(target){
    this.target.copy(target);
    this.mesh.position.copy(this.pos);
  },

  checkNearBlock: function(agent, blocks){

    var blockForce = new THREE.Vector3();
    var tmp = new THREE.Vector3();
    var tmpProj, repulsion;
    var totalBlock = blocks.length;

    for(var i = 0; i < totalBlock; i++){
      tmp = blocks[i].pos.clone().sub(agent.pos);
      if(tmp.clone().dot(agent.vel) > 0){  // in front

        tmpProj = tmp.clone().projectOnVector(agent.vel);

        if(tmpProj.length() < blocks[i].r * 2.5){  // close enough

          repulsion = tmpProj.clone().sub(tmp);
          blockForce.add(repulsion.setLength(200));

        }
      }
    }

    this.blockForce.copy(blockForce);
  },

  update: function(dt) {

    if(this.mesh.position.y > 200 || this.seek){
      this.seek = true;

      // compute force
      this.force = this.target.clone().sub(this.pos).setLength(this.maxSpeed).sub(this.vel).add(this.blockForce);

      // force clamping
      if (this.force.length() > this.maxForce)
        this.force.setLength(this.maxForce);
      this.vel.add(this.force.clone().multiplyScalar(dt));

      // velocity clamping
      if (this.vel.length() > this.maxSpeed)
        this.vel.setLength(this.maxSpeed);
      this.pos.add(this.vel.clone().multiplyScalar(dt));

      if (this.vel.length() > 0.001) {
        var angleZ = Math.atan2(-this.vel.z, this.vel.x);
        var angleX = Math.atan2(-this.vel.z, this.vel.y);

      }
      this.mesh.position.copy(this.pos);

      this.mesh.rotation.z = -angleZ;
      this.mesh.rotation.x = -angleX;
/*
      // catch handling
      if (this.pos.distanceTo(this.target) < this.bodyLen) {
        return true;
      }
*/
    }
    else{
      this.vel = this.mesh.localToWorld(new THREE.Vector3(0, 1, 0)).normalize()
      this.vel.sub(this.mesh.localToWorld(new THREE.Vector3(0, 0, 0)).normalize()).multiplyScalar(10000);

      this.pos.add(this.vel.clone().multiplyScalar(dt));
      this.mesh.position.copy(this.pos);
    }
//    return false;
  },

}


var Block = function(r, p, m){
  this.r = r;
  this.pos = p;
  this.mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 32, 32),
    m
  );
  this.mesh.position.copy(p);
}
