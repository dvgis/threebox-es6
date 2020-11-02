const utils = require("../utils/utils.js");
const Objects = require('./objects.js');
const CSS2D = require('./CSS2DRenderer.js');
var THREE = require("../three.js");

function Label(obj) {

	obj = utils._validate(obj, Objects.prototype._defaults.label);

	let div = Objects.prototype.drawLabelHTML(obj.htmlElement, obj.cssClass);

	let label = new CSS2D.CSS2DObject(div);
	label.name = "label";
	label.visible = obj.alwaysVisible;
	label.alwaysVisible = obj.alwaysVisible;
	var projScaleGroup = new THREE.Group();
	projScaleGroup.name = "scaleGroup";
	projScaleGroup.add(label);
	var userScaleGroup = Objects.prototype._makeGroup(projScaleGroup, obj);
	Objects.prototype._addMethods(userScaleGroup);
	userScaleGroup.visibility = obj.alwaysVisible;

	return userScaleGroup;
}


module.exports = exports = Label;