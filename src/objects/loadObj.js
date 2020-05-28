var utils = require("../utils/utils.js");
var Objects = require('./objects.js');
const OBJLoader = require("./loaders/OBJLoader.js");
const MTLLoader = require("./loaders/MTLLoader.js");
const FBXLoader = require("./loaders/FBXLoader.js");
const GLTFLoader = require("./loaders/GLTFLoader.js");
const ColladaLoader = require("./loaders/ColladaLoader.js");
const objLoader = new OBJLoader();
const materialLoader = new MTLLoader();
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const daeLoader = new ColladaLoader();

function loadObj(options, cb) {

	if (options === undefined) return console.error("Invalid options provided to loadObj()");

	this.loaded = false;
	//console.time('loadObj Start ');
	const modelComplete = (m) => {
		console.log("Model complete!", m);

		if (--remaining === 0) this.loaded = true;
	}
	var loader;
	if (!options.type) { options.type = 'mtl'; };
	//[jscastro] support other models
	switch (options.type) {
		case "mtl":
			// TODO: Support formats other than OBJ/MTL
			loader = objLoader;
			break;
		case "gltf":
			// [jscastro] Support for GLTF
			loader = gltfLoader;
			break;
		case "fbx":
			loader = fbxLoader;
			break;
		case "dae":
			loader = daeLoader;
			break;
	}

	materialLoader.load(options.mtl, loadObject, () => (null), error => {
		console.warn("No material file found for SymbolLayer3D model " + m);
	});

	function loadObject(materials) {

		if (materials && options.type == "mtl") {
			materials.preload();
			loader.setMaterials(materials);
		}

		loader.load(options.obj, obj => {

			//[jscastro] MTL/GLTF/FBX models have a different structure
			let animations;
			switch (options.type) {
				case "mtl":
					obj = obj.children[0];
					break;
				case "gltf":
				case "dae":
					animations = obj.animations;
					obj = obj.scene;
					break;
				case "fbx":
					animations = obj.animations;
					break;
			}

			let oSize = new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3(0, 0, 0));
			// [jscastro] options.rotation was wrongly used
			var r = utils.types.rotation(options.rotation, [0, 0, 0]);
			var s = utils.types.scale(options.scale, [1, 1, 1]);
			obj.rotation.set(r[0], r[1], r[2]);
			obj.scale.set(s[0], s[1], s[2]);
			// [jscastro] normalize specular/metalness/shininess from meshes in FBX and GLB model as it would need 5 lights to illuminate them properly
			if (options.normalize) { normalizeSpecular(obj); }

			var projScaleGroup = new THREE.Group();
			projScaleGroup.add(obj)
			var userScaleGroup = Objects.prototype._makeGroup(projScaleGroup, options);
			userScaleGroup.model = obj;
			//[jscastro] assign the animations to the userScaleGroup before enrolling it in AnimationsManager through _addMethods
			userScaleGroup.animations = animations;

			Objects.prototype._addMethods(userScaleGroup);

			//[jscastro] if the object options have an adjustment to center the 3D Object
			let adj = options.adjustment;
			if (adj) {
				let size = userScaleGroup.getSize();
				obj.position.set(size.x * adj.x, size.y * adj.y, size.z * adj.z)
			}

			// [jscastro] after adding methods create the bounding box at userScaleGroup but add it to its children for positioning
			let boxGrid = userScaleGroup.drawBoundingBox();
			projScaleGroup.add(boxGrid);

			cb(userScaleGroup);

			// [jscastro] initialize the default animation to avoid issues with position
			userScaleGroup.idle();

		}, () => (null), error => {
			console.error("Could not load model file. " + error.stack);
		});

	};

	//[jscastro] some FBX/GLTF models have too much specular effects for mapbox
	function normalizeSpecular(model) {
		model.traverse(function (c) {

			if (c.isMesh) {
				//c.castShadow = true;
				let specularColor;
				if (c.material.type == 'MeshStandardMaterial') {

					if (c.material.metalness) { c.material.metalness *= 0.1; }
					if (c.material.glossiness) { c.material.glossiness *= 0.25; }
					specularColor = new THREE.Color(12, 12, 12);

				} else if (c.material.type == 'MeshPhongMaterial') {
					c.material.shininess = 0.1;
					specularColor = new THREE.Color(20, 20, 20);
				}
				if (c.material.specular && c.material.specular.isColor) {
					c.material.specular = specularColor;
				}
				//c.material.needsUpdate = true;

			}

		});
	}

	//[jscastro] new added cache for 3D Objects
	function cache(obj) {
		let found = false;
		objectsCache.forEach(function (c) {
			if (c.userData.obj == obj.userData.obj) {
				found = true;
				return;
			}
		});
		if (!found) {
			objectsCache.push(obj);
		}
		return found;
	};

	//[jscastro] new added cache for 3D Objects
	function getFromCache(objUrl) {
		let dup = null;
		objectsCache.forEach(function (c) {
			if (c.userData.obj == objUrl) {
				dup = c.duplicate();
			}
		});
		return dup;
	};

}


module.exports = exports = loadObj;