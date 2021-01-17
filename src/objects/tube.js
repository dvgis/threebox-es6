/**
 * @author peterqliu / https://github.com/peterqliu
 * @author jscastro / https://github.com/jscastro76
*/
const utils = require("../utils/utils.js");
const material = require("../utils/material.js");
const Objects = require('./objects.js');
const THREE = require("../three.js");
const Object3D = require('./Object3D.js');

function tube(opt, world){

	// validate and prep input geometry
	opt = utils._validate(opt, Objects.prototype._defaults.tube);
    let straightProject = utils.lnglatsToWorld(opt.geometry);
	let normalized = utils.normalizeVertices(straightProject);
	let crossSection = tube.prototype.defineCrossSection(opt);
	let vertices = tube.prototype.buildVertices(crossSection, normalized.vertices, world);
	let geom = tube.prototype.buildFaces(vertices, normalized.vertices, opt);
	let mat = material(opt);
	let obj = new THREE.Mesh(geom, mat);
	//[jscastro] we convert it in Object3D to add methods, bounding box, model, tooltip...
	return new Object3D({ obj: obj, units: opt.units, anchor: opt.anchor, adjustment: opt.adjustment, bbox: opt.bbox, tooltip: opt.tooltip, raycasted: opt.raycasted });
}

tube.prototype = {

	buildVertices: function (crossSection, spine, world){

		//create reusable plane for intersection calculations
		var geometry = new THREE.PlaneBufferGeometry(99999999999, 9999999999);
		var m = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
		m.opacity = 0
		var plane = new THREE.Mesh( geometry, m );
		// world.add( plane );

		var geom = new THREE.Geometry(); 
		var lastElbow = false;


		// BUILD VERTICES: iterate through points in spine and position each vertex in cross section


		// get normalized vectors for each spine segment
		var spineSegments = [spine[0].clone().normalize()];

		for (i in spine) {

			i = parseFloat(i);

			var segment;

			if (spine[i+1]){
				segment = new THREE.Vector3()
					.subVectors( spine[i+1], spine[i])
					.normalize();

			}

			spineSegments.push(segment);
		}

		spineSegments.push(new THREE.Vector3());

		for (i in spine) {

			i = parseFloat(i);
			var lineVertex = spine[i];

			// ROTATE cross section

			var humerus = spineSegments[i]

			var forearm = spineSegments[i+1]

			var midpointToLookAt = humerus.clone()
				.add(forearm)
				.normalize();

			if (i === 0) midpointToLookAt = forearm;
			
			else if (i === spine.length - 1) midpointToLookAt = humerus;

						
			// if first point in input line, rotate and translate it to position
			if (!lastElbow) {

				let elbow = crossSection.clone();

				elbow
					.lookAt(midpointToLookAt)

				elbow.vertices.forEach(function(vertex){
					geom.vertices
						.push(vertex.add(lineVertex));
				})

				lastElbow = elbow.vertices;

			}

			else {

				let elbow = [];
				plane.position.copy(lineVertex);
				plane.lookAt(midpointToLookAt.clone().add(lineVertex));
				plane.updateMatrixWorld();

				lastElbow.forEach(function(v3){

					let raycaster = new THREE.Raycaster(v3, humerus);

					let intersection = raycaster
						.intersectObject(plane)[0];

					if (intersection) {
						geom.vertices.push(intersection.point);
						elbow.push(intersection.point);
					}

					else console.error('Tube geometry failed at vertex '+i+'. Consider reducing tube radius, or smoothening out the sharp angle at this vertex')
				})

				lastElbow = elbow
			}

		}

		world.remove(plane);

		return geom
	},

	defineCrossSection: function(obj){
        let crossSection = new THREE.Geometry();
        let count = obj.sides;

        for ( let i = 0; i < count; i ++ ) {

            let l = obj.radius;
            let a = (i+0.5) / count * Math.PI;

            crossSection.vertices.push( 
            	new THREE.Vector3 ( 
            		-Math.sin( 2 * a ), 
            		Math.cos( 2 * a ),
            		0
            	)
            	.multiplyScalar(l)
            );
        }

        return crossSection
	},

	//build faces between vertices

	buildFaces: function(geom, spine, obj){

		for (let i in spine) {

			i = parseFloat(i);
			let vertex = spine[i];

			if (i < spine.length - 1) {

				for (let p = 0; p < obj.sides; p++) {

					let b1 = i * obj.sides + p;
					let b2 = i * obj.sides + (p+1) % obj.sides
					let t1 = b1 + obj.sides
					let t2 = b2 + obj.sides;

					let triangle1 = new THREE.Face3(t1, b1, b2);
					let triangle2 = new THREE.Face3(t1, b2, t2);
					geom.faces.push(triangle1, triangle2)
				}				
			}
		}

		//add endcaps
		let v = geom.vertices.length;

		for (let c = 0; c+2<obj.sides; c++) {
			let tri1 = new THREE.Face3(0, c+2, c+1);
			let tri2 = new THREE.Face3(v-1, v-1-(c+2), v-1-(c+1))
			geom.faces.push(tri1, tri2)
		}

		//compute normals to get shading to work properly
		geom.computeFaceNormals();

		let bufferGeom = new THREE.BufferGeometry().fromGeometry(geom);
		return geom
	}
}

module.exports = exports = tube;

