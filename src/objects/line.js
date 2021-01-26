const THREE = require("../three.js");
const utils = require("../utils/utils.js");
const Objects = require('./objects.js');

function line(obj){

	obj = utils._validate(obj, Objects.prototype._defaults.line);

	// Geometry
    var straightProject = utils.lnglatsToWorld(obj.geometry);
	var normalized = utils.normalizeVertices(straightProject);
    var flattenedArray = utils.flattenVectors(normalized.vertices);
	//console.log('line', normalized.vertices)

	var geometry = new THREE.LineGeometry();
	geometry.setPositions( flattenedArray );

	// Material
	let matLine = new THREE.LineMaterial( {
		color: obj.color,
		linewidth: obj.width, // in pixels
		dashed: false,
		opacity: obj.opacity
	} );
	
	matLine.resolution.set( window.innerWidth, window.innerHeight );
	matLine.isMaterial = true;
	matLine.transparent = true;
	matLine.depthWrite = false;

	// Mesh
	line = new THREE.Line2( geometry, matLine );
	line.position.copy(normalized.position)
	line.computeLineDistances();

	return line
}

module.exports = exports = line;

/**
 * custom line shader by WestLangley, sourced from https://github.com/mrdoob/three.js/tree/master/examples/js/lines
 *
 */

THREE.LineSegmentsGeometry = function () {

	THREE.InstancedBufferGeometry.call(this);

	this.type = 'LineSegmentsGeometry';

	var positions = [- 1, 2, 0, 1, 2, 0, - 1, 1, 0, 1, 1, 0, - 1, 0, 0, 1, 0, 0, - 1, - 1, 0, 1, - 1, 0];
	var uvs = [- 1, 2, 1, 2, - 1, 1, 1, 1, - 1, - 1, 1, - 1, - 1, - 2, 1, - 2];
	var index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];

	this.setIndex(index);
	this.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

};

THREE.LineSegmentsGeometry.prototype = Object.assign(Object.create(THREE.InstancedBufferGeometry.prototype), {

	constructor: THREE.LineSegmentsGeometry,

	isLineSegmentsGeometry: true,

	applyMatrix4: function (matrix) {

		var start = this.attributes.instanceStart;
		var end = this.attributes.instanceEnd;

		if (start !== undefined) {

			start.applyMatrix4(matrix);

			end.applyMatrix4(matrix);

			start.needsUpdate = true;

		}

		if (this.boundingBox !== null) {

			this.computeBoundingBox();

		}

		if (this.boundingSphere !== null) {

			this.computeBoundingSphere();

		}

		return this;

	},

	setPositions: function (array) {

		var lineSegments;

		if (array instanceof Float32Array) {

			lineSegments = array;

		} else if (Array.isArray(array)) {

			lineSegments = new Float32Array(array);

		}

		var instanceBuffer = new THREE.InstancedInterleavedBuffer(lineSegments, 6, 1); // xyz, xyz

		this.setAttribute('instanceStart', new THREE.InterleavedBufferAttribute(instanceBuffer, 3, 0)); // xyz
		this.setAttribute('instanceEnd', new THREE.InterleavedBufferAttribute(instanceBuffer, 3, 3)); // xyz

		//

		this.computeBoundingBox();
		this.computeBoundingSphere();

		return this;

	},

	setColors: function (array) {

		var colors;

		if (array instanceof Float32Array) {

			colors = array;

		} else if (Array.isArray(array)) {

			colors = new Float32Array(array);

		}

		var instanceColorBuffer = new THREE.InstancedInterleavedBuffer(colors, 6, 1); // rgb, rgb

		this.setAttribute('instanceColorStart', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 3, 0)); // rgb
		this.setAttribute('instanceColorEnd', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 3, 3)); // rgb

		return this;

	},

	fromWireframeGeometry: function (geometry) {

		this.setPositions(geometry.attributes.position.array);

		return this;

	},

	fromEdgesGeometry: function (geometry) {

		this.setPositions(geometry.attributes.position.array);

		return this;

	},

	fromMesh: function (mesh) {

		this.fromWireframeGeometry(new THREE.WireframeGeometry(mesh.geometry));

		// set colors, maybe

		return this;

	},

	fromLineSegments: function (lineSegments) {

		var geometry = lineSegments.geometry;

		if (geometry.isGeometry) {

			console.error('THREE.LineSegmentsGeometry no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.');
			return;

		} else if (geometry.isBufferGeometry) {

			this.setPositions(geometry.attributes.position.array); // assumes non-indexed

		}

		// set colors, maybe

		return this;

	},

	computeBoundingBox: function () {

		var box = new THREE.Box3();

		return function computeBoundingBox() {

			if (this.boundingBox === null) {

				this.boundingBox = new THREE.Box3();

			}

			var start = this.attributes.instanceStart;
			var end = this.attributes.instanceEnd;

			if (start !== undefined && end !== undefined) {

				this.boundingBox.setFromBufferAttribute(start);

				box.setFromBufferAttribute(end);

				this.boundingBox.union(box);

			}

		};

	}(),

	computeBoundingSphere: function () {

		var vector = new THREE.Vector3();

		return function computeBoundingSphere() {

			if (this.boundingSphere === null) {

				this.boundingSphere = new THREE.Sphere();

			}

			if (this.boundingBox === null) {

				this.computeBoundingBox();

			}

			var start = this.attributes.instanceStart;
			var end = this.attributes.instanceEnd;

			if (start !== undefined && end !== undefined) {

				var center = this.boundingSphere.center;

				this.boundingBox.getCenter(center);

				var maxRadiusSq = 0;

				for (var i = 0, il = start.count; i < il; i++) {

					vector.fromBufferAttribute(start, i);
					maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));

					vector.fromBufferAttribute(end, i);
					maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));

				}

				this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

				if (isNaN(this.boundingSphere.radius)) {

					console.error('THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.', this);

				}

			}

		};

	}(),

	toJSON: function () {

		// todo

	},

	applyMatrix: function (matrix) {

		console.warn('THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().');

		return this.applyMatrix4(matrix);

	}

});

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

THREE.LineGeometry = function () {

	THREE.LineSegmentsGeometry.call(this);

	this.type = 'LineGeometry';

};

THREE.LineGeometry.prototype = Object.assign(Object.create(THREE.LineSegmentsGeometry.prototype), {

	constructor: THREE.LineGeometry,

	isLineGeometry: true,

	setPositions: function (array) {

		// converts [ x1, y1, z1,  x2, y2, z2, ... ] to pairs format

		var length = array.length - 3;
		var points = new Float32Array(2 * length);

		for (var i = 0; i < length; i += 3) {

			points[2 * i] = array[i];
			points[2 * i + 1] = array[i + 1];
			points[2 * i + 2] = array[i + 2];

			points[2 * i + 3] = array[i + 3];
			points[2 * i + 4] = array[i + 4];
			points[2 * i + 5] = array[i + 5];

		}

		THREE.LineSegmentsGeometry.prototype.setPositions.call(this, points);

		return this;

	},

	setColors: function (array) {

		// converts [ r1, g1, b1,  r2, g2, b2, ... ] to pairs format

		var length = array.length - 3;
		var colors = new Float32Array(2 * length);

		for (var i = 0; i < length; i += 3) {

			colors[2 * i] = array[i];
			colors[2 * i + 1] = array[i + 1];
			colors[2 * i + 2] = array[i + 2];

			colors[2 * i + 3] = array[i + 3];
			colors[2 * i + 4] = array[i + 4];
			colors[2 * i + 5] = array[i + 5];

		}

		THREE.LineSegmentsGeometry.prototype.setColors.call(this, colors);

		return this;

	},

	fromLine: function (line) {

		var geometry = line.geometry;

		if (geometry.isGeometry) {

			console.error('THREE.LineGeometry no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.');
			return;

		} else if (geometry.isBufferGeometry) {

			this.setPositions(geometry.attributes.position.array); // assumes non-indexed

		}

		// set colors, maybe

		return this;

	},

	copy: function ( /* source */) {

		// todo

		return this;

	}

});

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

THREE.WireframeGeometry2 = function (geometry) {

	THREE.LineSegmentsGeometry.call(this);

	this.type = 'WireframeGeometry2';

	this.fromWireframeGeometry(new THREE.WireframeGeometry(geometry));

	// set colors, maybe

};

THREE.WireframeGeometry2.prototype = Object.assign(Object.create(THREE.LineSegmentsGeometry.prototype), {

	constructor: THREE.WireframeGeometry2,

	isWireframeGeometry2: true

});

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  color: <hex>,
 *  linewidth: <float>,
 *  dashed: <boolean>,
 *  dashScale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>,
 *  resolution: <Vector2>, // to be set by renderer
 * }
 */

/**
 * parameters = {
 *  color: <hex>,
 *  linewidth: <float>,
 *  dashed: <boolean>,
 *  dashScale: <float>,
 *  dashSize: <float>,
 *  dashOffset: <float>,
 *  gapSize: <float>,
 *  resolution: <Vector2>, // to be set by renderer
 * }
 */

THREE.UniformsLib.line = {

	linewidth: { value: 1 },
	resolution: { value: new THREE.Vector2(1, 1) },
	dashScale: { value: 1 },
	dashSize: { value: 1 },
	dashOffset: { value: 0 },
	gapSize: { value: 1 }, // todo FIX - maybe change to totalSize
	opacity: { value: 1 }

};

THREE.ShaderLib['line'] = {

	uniforms: THREE.UniformsUtils.merge([
		THREE.UniformsLib.common,
		THREE.UniformsLib.fog,
		THREE.UniformsLib.line
	]),

	vertexShader:
		`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		varying vec2 vUv;

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			vUv = uv;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec2 ndcStart = clipStart.xy / clipStart.w;
			vec2 ndcEnd = clipEnd.xy / clipEnd.w;

			// direction
			vec2 dir = ndcEnd - ndcStart;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			// perpendicular to dir
			vec2 offset = vec2( dir.y, - dir.x );

			// undo aspect ratio adjustment
			dir.x /= aspect;
			offset.x /= aspect;

			// sign flip
			if ( position.x < 0.0 ) offset *= - 1.0;

			// endcaps
			if ( position.y < 0.0 ) {

				offset += - dir;

			} else if ( position.y > 1.0 ) {

				offset += dir;

			}

			// adjust for linewidth
			offset *= linewidth;

			// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
			offset /= resolution.y;

			// select end
			vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

			// back to clip space
			offset *= clip.w;

			clip.xy += offset;

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,

	fragmentShader:
		`
		uniform vec3 diffuse;
		uniform float opacity;

		#ifdef USE_DASH

			uniform float dashSize;
			uniform float dashOffset;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		varying vec2 vUv;

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			if ( abs( vUv.y ) > 1.0 ) {

				float a = vUv.x;
				float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
				float len2 = a * a + b * b;

				if ( len2 > 1.0 ) discard;

			}

			vec4 diffuseColor = vec4( diffuse, opacity );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, diffuseColor.a );

			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`
};

THREE.LineMaterial = function (parameters) {

	THREE.ShaderMaterial.call(this, {

		type: 'LineMaterial',

		uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib['line'].uniforms),

		vertexShader: THREE.ShaderLib['line'].vertexShader,
		fragmentShader: THREE.ShaderLib['line'].fragmentShader,

		clipping: true // required for clipping support

	});

	this.dashed = false;

	Object.defineProperties(this, {

		color: {

			enumerable: true,

			get: function () {

				return this.uniforms.diffuse.value;

			},

			set: function (value) {

				this.uniforms.diffuse.value = value;

			}

		},

		linewidth: {

			enumerable: true,

			get: function () {

				return this.uniforms.linewidth.value;

			},

			set: function (value) {

				this.uniforms.linewidth.value = value;

			}

		},

		dashScale: {

			enumerable: true,

			get: function () {

				return this.uniforms.dashScale.value;

			},

			set: function (value) {

				this.uniforms.dashScale.value = value;

			}

		},

		dashSize: {

			enumerable: true,

			get: function () {

				return this.uniforms.dashSize.value;

			},

			set: function (value) {

				this.uniforms.dashSize.value = value;

			}

		},

		dashOffset: {

			enumerable: true,

			get: function () {

				return this.uniforms.dashOffset.value;

			},

			set: function (value) {

				this.uniforms.dashOffset.value = value;

			}

		},

		gapSize: {

			enumerable: true,

			get: function () {

				return this.uniforms.gapSize.value;

			},

			set: function (value) {

				this.uniforms.gapSize.value = value;

			}

		},

		opacity: {

			enumerable: true,

			get: function () {

				return this.uniforms.opacity.value;

			},

			set: function (value) {

				this.uniforms.opacity.value = value;

			}

		},

		resolution: {

			enumerable: true,

			get: function () {

				return this.uniforms.resolution.value;

			},

			set: function (value) {

				this.uniforms.resolution.value.copy(value);

			}

		}

	});

	this.setValues(parameters);

};

THREE.LineMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
THREE.LineMaterial.prototype.constructor = THREE.LineMaterial;

THREE.LineMaterial.prototype.isLineMaterial = true;

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

THREE.LineSegments2 = function (geometry, material) {

	if (geometry === undefined) geometry = new THREE.LineSegmentsGeometry();
	if (material === undefined) material = new THREE.LineMaterial({ color: Math.random() * 0xffffff });

	THREE.Mesh.call(this, geometry, material);

	this.type = 'LineSegments2';

};

THREE.LineSegments2.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {

	constructor: THREE.LineSegments2,

	isLineSegments2: true,

	computeLineDistances: (function () { // for backwards-compatability, but could be a method of LineSegmentsGeometry...

		var start = new THREE.Vector3();
		var end = new THREE.Vector3();

		return function computeLineDistances() {

			var geometry = this.geometry;

			var instanceStart = geometry.attributes.instanceStart;
			var instanceEnd = geometry.attributes.instanceEnd;
			var lineDistances = new Float32Array(2 * instanceStart.data.count);

			for (var i = 0, j = 0, l = instanceStart.data.count; i < l; i++, j += 2) {

				start.fromBufferAttribute(instanceStart, i);
				end.fromBufferAttribute(instanceEnd, i);

				lineDistances[j] = (j === 0) ? 0 : lineDistances[j - 1];
				lineDistances[j + 1] = lineDistances[j] + start.distanceTo(end);

			}

			var instanceDistanceBuffer = new THREE.InstancedInterleavedBuffer(lineDistances, 2, 1); // d0, d1

			geometry.setAttribute('instanceDistanceStart', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)); // d0
			geometry.setAttribute('instanceDistanceEnd', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)); // d1

			return this;

		};

	}()),

	raycast: (function () {

		var start = new THREE.Vector4();
		var end = new THREE.Vector4();

		var ssOrigin = new THREE.Vector4();
		var ssOrigin3 = new THREE.Vector3();
		var mvMatrix = new THREE.Matrix4();
		var line = new THREE.Line3();
		var closestPoint = new THREE.Vector3();

		return function raycast(raycaster, intersects) {

			if (raycaster.camera === null) {

				console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2.');

			}

			var threshold = (raycaster.params.Line2 !== undefined) ? raycaster.params.Line2.threshold || 0 : 0;

			var ray = raycaster.ray;
			var camera = raycaster.camera;
			var projectionMatrix = camera.projectionMatrix;

			var geometry = this.geometry;
			var material = this.material;
			var resolution = material.resolution;
			var lineWidth = material.linewidth + threshold;

			var instanceStart = geometry.attributes.instanceStart;
			var instanceEnd = geometry.attributes.instanceEnd;

			// camera forward is negative
			var near = - camera.near;

			// pick a point 1 unit out along the ray to avoid the ray origin
			// sitting at the camera origin which will cause "w" to be 0 when
			// applying the projection matrix.
			ray.at(1, ssOrigin);

			// ndc space [ - 1.0, 1.0 ]
			ssOrigin.w = 1;
			ssOrigin.applyMatrix4(camera.matrixWorldInverse);
			ssOrigin.applyMatrix4(projectionMatrix);
			ssOrigin.multiplyScalar(1 / ssOrigin.w);

			// screen space
			ssOrigin.x *= resolution.x / 2;
			ssOrigin.y *= resolution.y / 2;
			ssOrigin.z = 0;

			ssOrigin3.copy(ssOrigin);

			var matrixWorld = this.matrixWorld;
			mvMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);

			for (var i = 0, l = instanceStart.count; i < l; i++) {

				start.fromBufferAttribute(instanceStart, i);
				end.fromBufferAttribute(instanceEnd, i);

				start.w = 1;
				end.w = 1;

				// camera space
				start.applyMatrix4(mvMatrix);
				end.applyMatrix4(mvMatrix);

				// skip the segment if it's entirely behind the camera
				var isBehindCameraNear = start.z > near && end.z > near;
				if (isBehindCameraNear) {

					continue;

				}

				// trim the segment if it extends behind camera near
				if (start.z > near) {

					const deltaDist = start.z - end.z;
					const t = (start.z - near) / deltaDist;
					start.lerp(end, t);

				} else if (end.z > near) {

					const deltaDist = end.z - start.z;
					const t = (end.z - near) / deltaDist;
					end.lerp(start, t);

				}

				// clip space
				start.applyMatrix4(projectionMatrix);
				end.applyMatrix4(projectionMatrix);

				// ndc space [ - 1.0, 1.0 ]
				start.multiplyScalar(1 / start.w);
				end.multiplyScalar(1 / end.w);

				// screen space
				start.x *= resolution.x / 2;
				start.y *= resolution.y / 2;

				end.x *= resolution.x / 2;
				end.y *= resolution.y / 2;

				// create 2d segment
				line.start.copy(start);
				line.start.z = 0;

				line.end.copy(end);
				line.end.z = 0;

				// get closest point on ray to segment
				var param = line.closestPointToPointParameter(ssOrigin3, true);
				line.at(param, closestPoint);

				// check if the intersection point is within clip space
				var zPos = THREE.MathUtils.lerp(start.z, end.z, param);
				var isInClipSpace = zPos >= - 1 && zPos <= 1;

				var isInside = ssOrigin3.distanceTo(closestPoint) < lineWidth * 0.5;

				if (isInClipSpace && isInside) {

					line.start.fromBufferAttribute(instanceStart, i);
					line.end.fromBufferAttribute(instanceEnd, i);

					line.start.applyMatrix4(matrixWorld);
					line.end.applyMatrix4(matrixWorld);

					var pointOnLine = new THREE.Vector3();
					var point = new THREE.Vector3();

					ray.distanceSqToSegment(line.start, line.end, point, pointOnLine);

					intersects.push({

						point: point,
						pointOnLine: pointOnLine,
						distance: ray.origin.distanceTo(point),

						object: this,
						face: null,
						faceIndex: i,
						uv: null,
						uv2: null,

					});

				}

			}

		};

	}())

});

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

THREE.Line2 = function (geometry, material) {

	if (geometry === undefined) geometry = new THREE.LineGeometry();
	if (material === undefined) material = new THREE.LineMaterial({ color: Math.random() * 0xffffff });

	THREE.LineSegments2.call(this, geometry, material);

	this.type = 'Line2';

};

THREE.Line2.prototype = Object.assign(Object.create(THREE.LineSegments2.prototype), {

	constructor: THREE.Line2,

	isLine2: true

});

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

THREE.Wireframe = function (geometry, material) {

	THREE.Mesh.call(this);

	this.type = 'Wireframe';

	this.geometry = geometry !== undefined ? geometry : new THREE.LineSegmentsGeometry();
	this.material = material !== undefined ? material : new THREE.LineMaterial({ color: Math.random() * 0xffffff });

};

THREE.Wireframe.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {

	constructor: THREE.Wireframe,

	isWireframe: true,

	computeLineDistances: (function () { // for backwards-compatability, but could be a method of LineSegmentsGeometry...

		var start = new THREE.Vector3();
		var end = new THREE.Vector3();

		return function computeLineDistances() {

			var geometry = this.geometry;

			var instanceStart = geometry.attributes.instanceStart;
			var instanceEnd = geometry.attributes.instanceEnd;
			var lineDistances = new Float32Array(2 * instanceStart.data.count);

			for (var i = 0, j = 0, l = instanceStart.data.count; i < l; i++, j += 2) {

				start.fromBufferAttribute(instanceStart, i);
				end.fromBufferAttribute(instanceEnd, i);

				lineDistances[j] = (j === 0) ? 0 : lineDistances[j - 1];
				lineDistances[j + 1] = lineDistances[j] + start.distanceTo(end);

			}

			var instanceDistanceBuffer = new THREE.InstancedInterleavedBuffer(lineDistances, 2, 1); // d0, d1

			geometry.setAttribute('instanceDistanceStart', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)); // d0
			geometry.setAttribute('instanceDistanceEnd', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)); // d1

			return this;

		};

	}())

});
