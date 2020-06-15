const utils = require("../Utils/Utils.js");
const Objects = require('./objects.js');
const CSS2D = require('./CSS2DRenderer.js');

function Tooltip(obj) {

	obj = utils._validate(obj, Objects.prototype._defaults.tooltip);

	if (obj.text) {
		let span = document.createElement(obj.htmlElement);
		span.className += obj.cssClass;
		span.innerHTML = obj.text;

		let tooltip = new CSS2D.CSS2DObject(span);
		tooltip.visible = obj.alwaysVisible;

		var userScaleGroup = Objects.prototype._makeGroup(tooltip, obj);
		Objects.prototype._addMethods(userScaleGroup);

		return userScaleGroup;
	}

}

module.exports = exports = Tooltip;