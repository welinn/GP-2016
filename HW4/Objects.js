var Agent = function(mesh, initPos, h) {
  this.pos = new THREE.Vector3();
  if (initPos) this.pos.copy(initPos);

  this.vel = new THREE.Vector3();
  this.force = new THREE.Vector3();
  this.target = new THREE.Vector3();
  this.angle = 0;
  this.mesh = mesh;
  this.maxSpeed = 60;
  this.maxForce = 60;
  this.halfWidth = h;

  this.setTarget = function(target) {
    this.target.copy(target);
  }

  this.update = function(dt, blockForce) {
    // compute force
    this.force = this.target.clone().sub(this.pos).setLength(this.maxSpeed).sub(this.vel).add(blockForce);

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
  }
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
