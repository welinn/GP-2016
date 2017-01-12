// forward kinematics
function fk(q, joints) {
  // joint[0]: shoulder
  // joint[1]: elbow
  // joint[2]: hand
  //	joints[0] = new THREE.Vector3(0,0,0);
  var m = new THREE.Matrix4();

  // from home plate
  var localzero = new THREE.Vector3(0, 0, 0);
  m.makeTranslation(0, 0, -15);
  //m.multiply(new THREE.Matrix4().makeRotationY(torsoTurn));
  m.multiply(new THREE.Matrix4().makeTranslation(-25, 100, 0));
  localzero.applyMatrix4(m);
  joints[0].copy(localzero);

  m.multiply(new THREE.Matrix4().makeRotationZ(q[0])); // 'ZXY'
  m.multiply(new THREE.Matrix4().makeRotationX(q[1]));
  m.multiply(new THREE.Matrix4().makeRotationY(q[2]));
  m.multiply(new THREE.Matrix4().makeTranslation(0, -40, 0));
  localzero.set(0, 0, 0);
  localzero.applyMatrix4(m);
  joints[1].copy(localzero);

  m.multiply(new THREE.Matrix4().makeRotationX(q[3]));
  m.multiply(new THREE.Matrix4().makeTranslation(0, -40, 0));
  localzero.set(0, 0, 0);
  localzero.applyMatrix4(m);
  joints[2].copy(localzero);
}

// joint axis setup
//
function setarm() {
  var axis = new CCD_axis(new THREE.Vector3(0, 0, 1), 0);
  axis.limits = new THREE.Vector2(-6, 0);
  axes.push(axis);
  var axis = new CCD_axis(new THREE.Vector3(1, 0, 0), 0);
  axis.limits = new THREE.Vector2(-2.5, 2.5);
  axes.push(axis);
  var axis = new CCD_axis(new THREE.Vector3(0, 1, 0), 0);
  axis.limits = new THREE.Vector2(.3, .30); //,2.5); 
  axes.push(axis);
  var axis = new CCD_axis(new THREE.Vector3(1, 0, 0), 1);
  axis.limits = new THREE.Vector2(-2.7, -0.01);
  axes.push(axis);
}


function linearTween(s, b, e) {
  var pos = [];
  for (var i = 0; i < 3; i++) {
    pos.push((1 - s) * b[i] + s * e[i]);
  }
  return pos;
}

function keyframeInterpolate(t) {

  if (ts === undefined)
    return;

  var s = (t - ts) / T;
  if (s > 1) { // return end frame
    target.set(keys[1][1][0], keys[1][1][1], keys[1][1][2])
  } else {
    var pos = linearTween(s, keys[0][1], keys[1][1]);
    target.set(pos[0], pos[1], pos[2]);
  }
}


