var Objects = require('./objects.js');
var utils = require("../utils/utils.js");

function Object3D(options) {
	options = utils._validate(options, Objects.prototype._defaults.Object3D);

	// [jscastro] full refactor of Object3D to behave exactly like 3D Models loadObj
	var obj = options.obj;
	var projScaleGroup = new THREE.Group();
	projScaleGroup.add(obj);
	var userScaleGroup = Objects.prototype._makeGroup(projScaleGroup, options);

	userScaleGroup.model = options.obj;

	Objects.prototype._addMethods(userScaleGroup);

	// [jscastro] if center must be adjusted
	let center = options.adjustment;
	if (center) {
		let size = userScaleGroup.getSize();
		obj.position.set(size.x * center.x, size.y * center.y, size.z * center.z)
	}

	// [jscastro] after adding methods create the bounding box at userScaleGroup but add it to its children for positioning
	let boxGrid = userScaleGroup.drawBoundingBox();
	projScaleGroup.add(boxGrid);

	// [jscastro] we add by default a tooltip that can be override later or hide it with threebox `enableTooltips`
	userScaleGroup.addTooltip(userScaleGroup.uuid, true, center);

	userScaleGroup.visibility = true;

	return userScaleGroup
}


module.exports = exports = Object3D;