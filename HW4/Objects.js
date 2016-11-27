var Agent = function(mesh, initPos, h, l, n) {
  this.pos = new THREE.Vector3();
  if (initPos) this.pos.copy(initPos);

  this.vel = new THREE.Vector3();
  this.force = new THREE.Vector3();
  this.target = new THREE.Vector3();
  this.blockForce = new THREE.Vector3();
  this.neighborForce = new THREE.Vector3();
  this.angle = 0;
  this.mesh = mesh;
  this.maxSpeed = 60;
  this.maxForce = 60;
  this.halfWidth = h;
  this.bodyLen = l;
  this.status;
  this.neighbor = [];
  this.neighborClose = n;

}

Agent.prototype = {
  setTarget: function(target) {
    this.target.copy(target);
  },

  checkNearBlock: function(agent, blocks){

    var blockForce = new THREE.Vector3();
    var tmp = new THREE.Vector3();
    var tmpProj, repulsion;

    for(var i = 0; i < totalBlock; i++){
      tmp = blocks[i].pos.clone().sub(agent.pos);
      if(tmp.clone().dot(agent.vel) > 0){  // in front

        tmpProj = tmp.clone().projectOnVector(agent.vel);

        if(tmpProj.length() < blocks[i].r * 2){  // close enough

          repulsion = tmpProj.clone().sub(tmp);
          var dist = blocks[i].r + agent.halfWidth;
          if(repulsion.length() < dist) blockForce.copy(repulsion.setLength(100));
        }
      }
    }
    blockForce.y = 0;
    if(blockForce.length() > 0) this.status = 'collision avoidance';
    else this.status = undefined;
    this.blockForce.copy(blockForce);
  },

  checkDist: function(){
    var dist = this.target.clone().sub(this.pos).length();
    var len = this.vel.length();
    if(this.status !== 'collision avoidance' && dist < 30){
      this.vel.setLength(len * 0.95);
      this.status = 'arrivial';
    }
    else if(this.status !== 'collision avoidance'){
      this.status = 'seek';
    }
  },

  neighborCheck: function(otherAgent){
    var vector = this.pos.clone().sub(otherAgent.pos);
    var dist = vector.length();
    if(dist < this.neighborClose){
      this.neighbor.push(otherAgent);
    }
  },

  groupSteer: function(){

    //separation
    var force = new THREE.Vector3();
    for(var i = 0; i < this.neighbor.length; i++){
      var vector = this.pos.clone().sub(this.neighbor[i].pos);
      var dist = vector.length();
      force.add(vector.setLength(this.neighborClose - dist));
    }
    this.neighborForce = force.multiplyScalar(40);

    // cohesion, alignment




  },

  update: function(dt, steering) {

    this.checkDist();//console.log(this.status);
    // compute force
    this.force = this.target.clone().sub(this.pos).setLength(this.maxSpeed).sub(this.vel).add(this.blockForce);
    if(steering) this.force.add(this.neighborForce);
    // force clamping
    if (this.force.length() > this.maxForce)
      this.force.setLength(this.maxForce);
    this.vel.add(this.force.clone().multiplyScalar(dt));

    // velocity clamping
    if (this.vel.length() > this.maxSpeed)
      this.vel.setLength(this.maxSpeed);
    this.pos.add(this.vel.clone().multiplyScalar(dt));

    if (this.vel.length() > 0.001) {
      this.angle = Math.atan2(-this.vel.z, this.vel.x);
    }
    this.mesh.position.copy(this.pos);
    this.mesh.rotation.y = this.angle;

    // catch handling
    if (this.pos.distanceTo(this.target) < 2) {
      return true;
    }
    return false;
  },

}


var Block = function(r, p){
  this.r = r;
  this.pos = p;
  this.mesh = new THREE.Mesh(
    new THREE.CircleGeometry(r, 32),
    new THREE.MeshBasicMaterial()
  );
  this.mesh.position.copy(p);
  this.mesh.rotation.x = -Math.PI * 0.5;
}
