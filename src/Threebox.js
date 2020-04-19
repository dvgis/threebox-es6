var THREE = require("./three.js");
var CameraSync = require("./camera/CameraSync.js");
var utils = require("./utils/utils.js");
var AnimationManager = require("./animation/AnimationManager.js");
var ThreeboxConstants = require("./utils/constants.js");

var Objects = require("./objects/objects.js");
var material = require("./utils/material.js");
var sphere = require("./objects/sphere.js");
var loadObj = require("./objects/loadObj.js");
var Object3D = require("./objects/Object3D.js");
var line = require("./objects/line.js");
var tube = require("./objects/tube.js");
var CSS2D = require("./objects/CSS2DRenderer.js");

function Threebox(map, glContext, options){

    this.init(map, glContext, options);

};

Threebox.prototype = {

	repaint: function () {
		this.map.repaint = true;
	},

	init: function (map, glContext, options) {

		this.map = map;
		this.map.tb = this; //[jscastro] needed if we want to queryRenderedFeatures from map.onload

		// Set up a THREE.js scene
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: map.getCanvas(),
			context: glContext
		});

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(map.getCanvas().clientWidth, map.getCanvas().clientHeight);
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		//this.renderer.shadowMap.enabled = true;
		this.renderer.autoClear = false;

		// [jscastro] set labelRendered
		this.labelRenderer = new CSS2D.CSS2DRenderer();
		//this.labelRenderer.autoClear = false;
		this.labelRenderer.setSize(map.getCanvas().clientWidth, map.getCanvas().clientHeight);
		this.labelRenderer.domElement.style.position = 'absolute';
		this.labelRenderer.domElement.id = 'labelCanvas'; //TODO: this value must come by parameter
		this.labelRenderer.domElement.style.top = 0;
		this.map.getCanvasContainer().appendChild(this.labelRenderer.domElement);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(36.86989764584402, map.getCanvas().clientWidth / map.getCanvas().clientHeight, 1, 1e21);
		this.camera.layers.enable(1);

		// The CameraSync object will keep the Mapbox and THREE.js camera movements in sync.
		// It requires a world group to scale as we zoom in. Rotation is handled in the camera's
		// projection matrix itself (as is field of view and near/far clipping)
		// It automatically registers to listen for move events on the map so we don't need to do that here
		this.world = new THREE.Group();
		this.scene.add(this.world);

		this.objectsCache = [];

		this.cameraSync = new CameraSync(this.map, this.camera, this.world);

		//raycaster for mouse events
		this.raycaster = new THREE.Raycaster();
		//this.raycaster.params.Points.threshold = 100;

		// apply starter options

		this.options = utils._validate(options || {}, defaultOptions);
		if (this.options.defaultLights) this.defaultLights();

		//[jscastro] new event map on load
		this.map.on('load', function () {

			//[jscastro] new fields to manage events on map
			let selectedObject; //selected object through click
			let draggedObject; //dragged object through mousedown + mousemove
			let draggedAction; //dragged action to notify frontend
			let overedObject; //overed object through mouseover

			let canvas = this.getCanvasContainer();
			this.getCanvasContainer().style.cursor = 'default';
			// Variable to hold the starting xy coordinates
			// when 'mousedown' occured.
			let start;
			let rotationStep = 10;// degrees step size for rotation
			let gridStep = 6;// decimals to adjust the lnglat

			//when object selected
			let startCoords = [];

			// Variable to hold the current xy coordinates
			// when 'mousemove' or 'mouseup' occurs.
			let current;

			// Variable for the draw box element.
			let box;

			let lngDiff; // difference between cursor and model left corner
			let latDiff; // difference between cursor and model bottom corner

			// Return the xy coordinates of the mouse position
			function mousePos(e) {
				var rect = canvas.getBoundingClientRect();
				return new mapboxgl.Point(
					e.originalEvent.clientX - rect.left - canvas.clientLeft,
					e.originalEvent.clientY - rect.top - canvas.clientTop
				);
			}

			//listener to the events
			this.on('contextmenu', onContextMenu);
			this.on('click', onClick);
			this.on('mousemove', onMouseMove);
			this.on('mousedown', onMouseDown);

			function onContextMenu(e) {
				alert('contextMenu');
			}

			// onclick function
			function onClick(e) {
				let intersects = this.tb.queryRenderedFeatures(e.point);
				let intersectionExists = typeof intersects[0] == 'object';
				// if intersect exists, highlight it
				if (intersectionExists) {
					let nearestObject = Threebox.prototype.findParent3DObject(intersects[0]);

					if (!selectedObject) {
						selectedObject = nearestObject;
						selectedObject.selected = true;
					}
					else if (selectedObject.uuid != nearestObject.uuid) {
						//it's a different object, restore the previous and select the new one
						selectedObject.selected = false;
						nearestObject.selected = true;
						selectedObject = nearestObject;

					} else if (selectedObject.uuid == nearestObject.uuid) {
						//deselect, reset and return
						selectedObject.selected = false;
						selectedObject = null;
						return;
					}

					// change the wireButton firing the Wireframed event
					selectedObject.dispatchEvent(new CustomEvent('Wireframed', { detail: selectedObject, bubbles: true, cancelable: true }));
					selectedObject.dispatchEvent(new CustomEvent('IsPlayingChanged', { detail: selectedObject, bubbles: true, cancelable: true }));

					this.repaint = true;

				}

			}

			function onMouseMove(e) {
				// Capture the ongoing xy coordinates
				let current = mousePos(e);

				this.getCanvasContainer().style.cursor = 'default';

				if (e.originalEvent.altKey && draggedObject) {
					draggedAction = 'rotate';
					// Set a UI indicator for dragging.
					this.getCanvasContainer().style.cursor = 'move';
					var minX = Math.min(start.x, current.x),
						maxX = Math.max(start.x, current.x),
						minY = Math.min(start.y, current.y),
						maxY = Math.max(start.y, current.y);
					//set the movement fluid we rotate only every 10px moved, in steps of 10 degrees up to 360
					let rotation = { x: 0, y: 0, z: 360 + ((~~((current.x - start.x) / rotationStep) % 360 * rotationStep) % 360) };
					//now rotate the model depending the axis
					draggedObject.setRotation(rotation);
					//draggedObject.setRotationAxis(rotation);
				}

				if (e.originalEvent.shiftKey && draggedObject) {
					draggedAction = 'translate';
					// Set a UI indicator for dragging.
					this.getCanvasContainer().style.cursor = 'move';
					// Capture the first xy coordinates, height must be the same to move on the same plane
					let coords = e.lngLat;
					let options = [Number((coords.lng + lngDiff).toFixed(gridStep)), Number((coords.lat + latDiff).toFixed(gridStep)), draggedObject.modelHeight];
					draggedObject.setCoords(options);

					//[jscastro] option with translate
					//startCoords = draggedObject.coordinates;
					//let options = [Number((coords.lng - startCoords[0]).toFixed(gridStep)), Number((coords.lat - startCoords[1]).toFixed(gridStep)), 0];
					//draggedObject.setTranslate(options);

				}

				// calculate objects intersecting the picking ray
				let intersects = this.tb.queryRenderedFeatures(e.point);
				let intersectionExists = typeof intersects[0] == 'object';
				// if intersect exists, highlight it
				if (intersectionExists) {
					this.getCanvasContainer().style.cursor = 'pointer';

					let nearestObject = Threebox.prototype.findParent3DObject(intersects[0]);
					if (!selectedObject || nearestObject.uuid != selectedObject.uuid) {
						if (overedObject) {
							overedObject.over = false;
							overedObject = null;
						}
						nearestObject.over = true;
						overedObject = nearestObject;
					}
					this.repaint = true;
				} else {
					//clean the object overed
					if (overedObject) { overedObject.over = false; overedObject = null; }
				}

			}

			function onMouseDown(e) {

				// Continue the rest of the function shiftkey or altkey are pressed, and if object is selected
				if (!((e.originalEvent.shiftKey || e.originalEvent.altKey) && e.originalEvent.button === 0 && selectedObject)) return;

				e.preventDefault();

				map.getCanvasContainer().style.cursor = 'move';

				// Disable default drag zooming when the shift key is held down.
				//map.dragPan.disable();

				// Call functions for the following events
				map.once('mouseup', onMouseUp);
				map.once('mouseout', onMouseUp);

				// move the selected object
				draggedObject = selectedObject;

				// Capture the first xy coordinates
				start = mousePos(e);
				startCoords = draggedObject.coordinates;
				lngDiff = startCoords[0] - e.lngLat.lng;
				latDiff = startCoords[1] - e.lngLat.lat;
			}

			function onMouseUp(e) {

				// Set a UI indicator for dragging.
				this.getCanvasContainer().style.cursor = 'default';

				// Remove these events now that finish has been called.
				//map.off('mousemove', onMouseMove);
				this.off('mouseup', onMouseUp);
				this.off('mouseout', onMouseUp);
				this.dragPan.enable();

				if (draggedObject) {
					draggedObject.dispatchEvent(new CustomEvent('ObjectDragged', { detail: { draggedObject: draggedObject, draggedAction: draggedAction }, bubbles: true, cancelable: true }));

					draggedObject = null;
					draggedAction = null;
				};
			}

		});
	},

	// Objects

	objects: new Objects(AnimationManager),

	sphere: sphere,

	line: line,

	tube: function (obj) {
		return tube(obj, this.world)
	},

	Object3D: function (obj, o) {
		return Object3D(obj, o)
	},

	loadObj: loadObj,

	// Material

	material: function (o) {
		return material(o)
	},

	utils: utils,

	projectToWorld: function (coords) {
		return this.utils.projectToWorld(coords)
	},

	unprojectFromWorld: function (v3) {
		return this.utils.unprojectFromWorld(v3)
	},

	projectedUnitsPerMeter: function (lat) {
		return this.utils.projectedUnitsPerMeter(lat)
	},

	queryRenderedFeatures: function (point) {

		var mouse = new THREE.Vector2();

		// // scale mouse pixel position to a percentage of the screen's width and height
		mouse.x = (point.x / this.map.transform.width) * 2 - 1;
		mouse.y = 1 - (point.y / this.map.transform.height) * 2;

		this.raycaster.setFromCamera(mouse, this.camera);

		// calculate objects intersecting the picking ray
		var intersects = this.raycaster.intersectObjects(this.world.children, true);

		return intersects
	},

	//[jscastro] find 3D object of a mesh
	findParent3DObject: function (mesh) {
		//find the Parent Object3D of the mesh captured by Raytracer
		var result;
		mesh.object.traverseAncestors(function (m) {
			if (m.parent)
				if (m.parent.type == "Group" && m.userData.obj) {
					result = m;
				}
		});
		return result;
	},

	update: function () {

		if (this.map.repaint) this.map.repaint = false

		var timestamp = Date.now();

		// Update any animations
		this.objects.animationManager.update(timestamp);

		this.renderer.state.reset();

		// Render the scene and repaint the map
		this.renderer.render(this.scene, this.camera);

		// [jscastro] Reset state to keep the pattern TODO: is empty
		this.labelRenderer.state.reset();

		// [jscastro] Render any label
		this.labelRenderer.render(this.scene, this.camera);

		if (this.options.passiveRendering === false) this.map.triggerRepaint();
	},

	add: function (obj) {
		this.world.add(obj);
	},

	remove: function (obj) {
		//[jscastro] remove also the label if exists dispatching the event removed to fire CSS2DRenderer "removed" listener
		if (obj.label) { obj.label.dispatchEvent({ type: "removed" }) };
		this.world.remove(obj);
	},

	defaultLights: function () {

		let ambientLight = new THREE.AmbientLight(new THREE.Color('hsl(0, 0%, 100%)'), 0.75);
		this.scene.add(ambientLight);

		let directionalLightBack = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 100%)'), 0.25);
		directionalLightBack.position.set(10, 100, 100);
		this.scene.add(directionalLightBack);

		let directionalLightFront = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 100%)'), 0.25);
		directionalLightFront.position.set(-10, -100, 100);
		this.scene.add(directionalLightFront);

	},

	memory: function () { return this.renderer.info.memory },

	version: '1.0.0',

}

var defaultOptions = {
    defaultLights: false,
    passiveRendering: true
}
module.exports = exports = Threebox;

