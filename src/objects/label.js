const utils = require("../Utils/Utils.js");
const Objects = require('./objects.js');
const CSS2D = require('./CSS2DRenderer.js');

function Label(obj) {

	obj = utils._validate(obj, Objects.prototype._defaults.label);

	let div = document.createElement('div');
	div.className += obj.cssClass;
	// [jscastro] create a div [TODO] analize if must be moved
	if (typeof (obj.htmlElement) == 'string') {
		div.innerHTML = obj.htmlElement;
	} else {
		div.innerHTML = obj.htmlElement.outerHTML;
	}
	if (obj.bottomMargin) div.style.marginTop = '-' + obj.bottomMargin + 'em';
	let label = new CSS2D.CSS2DObject(div);
	label.visible = obj.alwaysVisible;
	label.alwaysVisible = obj.alwaysVisible;

	var userScaleGroup = Objects.prototype._makeGroup(label, obj);
	Objects.prototype._addMethods(userScaleGroup);
	userScaleGroup.label = label;

	return userScaleGroup;
}


module.exports = exports = Label;