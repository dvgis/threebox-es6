/**
 * @author peterqliu / https://github.com/peterqliu
 * @author jscastro / https://github.com/jscastro76
 */
const Objects = require('./objects.js');
const utils = require("../utils/utils.js");

function Object3D(opt) {
	opt = utils._validate(opt, Objects.prototype._defaults.Object3D);

	// [jscastro] full refactor of Object3D to behave exactly like 3D Models loadObj
	let obj = opt.obj;
	obj.name = "model";
	let userScaleGroup = Objects.prototype._makeGroup(obj, opt);
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