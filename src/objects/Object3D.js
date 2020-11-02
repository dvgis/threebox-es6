var Objects = require('./objects.js');
var utils = require("../utils/utils.js");

function Object3D(opt) {
	opt = utils._validate(opt, Objects.prototype._defaults.Object3D);

	// [jscastro] full refactor of Object3D to behave exactly like 3D Models loadObj
	var obj = opt.obj;
	obj.name = "model";
	var projScaleGroup = new THREE.Group();
	projScaleGroup.add(obj);
	projScaleGroup.name = "scaleGroup";
	var userScaleGroup = Objects.prototype._makeGroup(projScaleGroup, opt);
	opt.obj.name = "model";
	Objects.prototype._addMethods(userScaleGroup);
	//[jscastro] calculate automatically the pivotal center of the object
	userScaleGroup.setAnchor(opt.anchor);
	//[jscastro] override the center calculated if the object has adjustments
	userScaleGroup.setCenter(opt.adjustment);
	userScaleGroup.visibility = true;

	return userScaleGroup
}


module.exports = exports = Object3D;