# Documentation
---
## Background

Threebox works by adding a *Three.js* scene to *Mapbox GL*, creating a new *Mapbox GL* custom layer that implements [CustomLayerInterface](https://docs.mapbox.com/mapbox-gl-js/api/properties/#customlayerinterface)
. The custom layer API takes a fair amount of finessing to be useful, and Threebox tackles several hurdles to getting *Three.js* and *Mapbox GL* to work together. 

---

## Threebox Constructor

```js
var tb = new Threebox(map, mapboxGLContext [, options])
```
The instance of Threebox will be used normally across the full page, so it's recommended to be created at `window` level.

Sets up a threebox scene inside a [*Mapbox GL* custom layer's onAdd function](https://www.mapbox.com/mapbox-gl-js/api/#customlayerinterface), which provides both inputs for this method. Automatically synchronizes the camera movement and events between *Three.js* and *Mapbox GL* JS. 

| option | required | default | type   | purpose                                                                                  |
|-----------|----------|---------|--------|----------------------------------------------------------------------------------------------|
| `defaultLights`    | no       | false      | boolean | Whether to add some default lighting to the scene. If no lighting added, most objects in the scene will render as black |
| `passiveRendering`     | no       | true   | boolean  | Color of line. Unlike other Threebox objects, this color will render on screen precisely as specified, regardless of scene lighting |

The setup will require to call recursively to `tb.update();` to render the Threebox scene. This 
[CustomLayerInterface#render](https://docs.mapbox.com/mapbox-gl-js/api/properties/#customlayerinterface#render)

Rerender the threebox scene. Fired in the custom layer's `render` function.
                                                              

The `mapboxGLContext` instance can be obtained in different ways. The most usual one is to get the context from the instance of the member [`onAdd(map, gl)`](https://docs.mapbox.com/mapbox-gl-js/api/properties/#customlayerinterface#onadd), but that implies that it's created in every call to the method [`addLayer(layer[, beforeId])`](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer)
```js
map.addLayer({
	id: 'custom_layer',
	type: 'custom',
	renderingMode: '3d',
	onAdd: function (map, gl) {

		window.tb = new Threebox(
			map,
			gl, //get the context from Mapbox
			{ defaultLights: true }
		);
		...
		...
	},
	render: function (gl, matrix) {
		tb.update(); //update Threebox scene
	}
	
}
```
The second way is to the context from the canvas of the *Mapbox GL* map [`map.getCanvas().getContext('webgl')`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext). In this way the creation of the Threebox can be instantiated separately from the `addLayer` method.

```js
window.tb = new Threebox(
	map,
	map.getCanvas().getContext('webgl'), //get the context from the map canvas
	{ defaultLights: true }
);
```
- - -

## Threebox Dispose
```js
tb.dispose()
```
If Threebox is being used as a part of a web application, it's recommended to dispose explicitely the instance of Threebox whenever its instance is not going to be used anymore or before navigating to another page that does not include Threebox, otherwise it's likely that you will face memory leaks issues not only due to Threebox, but also due to the internal use of *Mapbox GL* and *Three.js* instances needed to manage the objects.<br>
<br>
To dispose completely all the resources and memory Threebox can acumulate, including the internal resources from *Three.js* and *Mapbox GL*, it's needed to invoke the `dispose` method. <br>
<br>
This will go through the scene created to dispose every object, geometry, material and texture in *Three.js*, then it will dispose all the resources from *Mapbox GL*, including the `WebGLRenderingContext` and itselft the Threebox instance.<br>
<br>
After calling to this method, Threebox and *Mapbox GL* map instances will be fully disposed so it's only recommended before navigating to other pages. 
<br>

# Objects

Threebox offers convenience functions to construct meshes of various *Three.js* meshes, as well asl . Under the hood, they invoke a subclass of [THREE.Object3D](https://threejs.org/docs/#api/en/core/Object3D). 

Objects in Threebox fall under two broad varieties. *Static objects* don't move or change once they're placed, and used usually to display background or geographical features. They may have complex internal geometry, which are expressed primarily in lnglat coordinates. 

In contrast, *dynamic objects* can move around the map, positioned by a single lnglat point. Their internal geometries are produced mainly in local scene units, whether through external obj files, or these convenience methods below.

## Static objects

### Line 

```js
tb.line(options);
```

Adds a line to the map, in full 3D space. Color renders independently of scene lighting. Internally, calls a [custom line shader](https://threejs.org/examples/?q=line#webgl_lines_fat).


| option | required | default | type   | purpose                                                                                  |
|-----------|----------|---------|--------|----------------------------------------------------------------------------------------------|
| `geometry`    | yes       | NA      | lineGeometry | Array of lnglat coordinates to draw the line |
| `color`     | no       | black   | color  | Color of line. Unlike other Threebox objects, this color will render on screen precisely as specified, regardless of scene lighting |
| `width`     | no       | 1   | number  | Line width. Unlike other Threebox objects, this width is in units of display pixels, rather than meters or scene units. |
| `opacity`     | no       | 1   | Number  | Line opacity |                                                                       


<br>

### Tube

```js
tb.tube(options);
```

Extrude a tube along a specific lineGeometry, with an equilateral polygon as cross section. Internally uses a custom tube geometry generator.


| option | required | default | type   | description                                                                                  |
|-----------|----------|---------|--------|----------|
| `geometry`    | yes       | NA      | lineGeometry | Line coordinates forming the tube backbone |
| `radius`    | no       | 20      | number | Radius of the tube cross section, or half of tube width.|
| `sides`  | no       | 8       | number | Number of facets along the tube. The higher, the more closely the tube will approximate a smooth cylinder. |
| `material`     | no       | MeshLambertMaterial   | threeMaterial  | [THREE material](https://github.com/mrdoob/three.js/tree/master/src/materials) to use. Can be invoked with a text string, or a predefined material object via THREE itself.|   
| `color`     | no       | black   | color  | Tube color. Ignored if `material` is a predefined `THREE.Material` object.  |
| `opacity`     | no       | 1   | Number  | Tube opacity |                                                                                                                                                   


<br>

## Dynamic objects

<br>

### Sphere

```js
tb.sphere(options);
```

Add a sphere to the map. Internally, calls `THREE.Mesh` with a `THREE.SphereGeometry`.


| option | required | default | type   | description                                                                                  |
|-----------|----------|---------|--------|-------|
| `radius`    | no       | 50      | number | Radius of sphere. |
| `units`    | no       | scene      | string ("scene" or "meters") | Units with which to interpret `radius`. If meters, Threebox will also rescale the object with changes in latitude, to appear to scale with objects and geography nearby.|
| sides  | no       | 8       | number | Number of width and height segments. The higher the number, the smoother the sphere. |
| color     | no       | black   | color  | Color of sphere.                                                                             
| `material`     | no       | MeshLambertMaterial   | threeMaterial  | [THREE material](https://github.com/mrdoob/three.js/tree/master/src/materials) to use. Can be invoked with a text string, or a predefined material object via THREE itself.|   

<br>

### Loading a 3D model

```js
tb.loadObj(options, callback(obj));
```

This method Loads a 3D model of in different formats from its respective files. 
Note that unlike all the other object classes, this is asynchronous, and returns the object as an argument of the callback function. 
Internally, uses [`THREE.OBJLoader`](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/OBJLoader.js), [`THREE.FBXLoader`](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/FBXLoader.js), [`THREE.GLTFLoader`](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/GLTFLoader.js) or [`THREE.ColladaLoader`](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/ColladaLoader.js) respectively to fetch the  assets to each 3D format. [`THREE.FBXLoader`](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/FBXLoader.js) also dependes on [Zlib](https://github.com/imaya/zlib.js) to open compressed files which this format is based on.

Once the object is loaded and added to Threebox instance, it is by default **selectable**, **draggable** and **rotable** (over the z axis) with the mouse.

- To **drag** an object you have to select the object and then press **SHIFT** key and move the mouse.
- To **rotate** and object you have to select the object and then press **ALT** key and move the mouse.

*[jscastro]* **IMPORTANT**: There are breaking changes in this release regarding the attributes below comparing to [@peterqliu original Threebox](https://github.com/peterqliu/threebox/). 

| option | required | default | type   | description                                                                                  |
|-----------|----------|---------|--------|----------|
| `type`  | yes       | "mtl"       | string (`"mtl"`, `"gltf"`, `"fbx"`, `"dae"`) | **BREAKING CHANGE**: Type is now required |
| `obj`  | yes       | NA       | string | **BREAKING CHANGE**: URL path to asset's .obj, .glb, .gltf, .fbx, .dae file. |
| `bin`  | no       | NA       | string | URL path to asset's .bin or .mtl files needed for GLTF or OBJ models respectively|
| `units`    | no       | scene      | string (`"scene"` or `"meters"`) | "meters" is recommended for precision. Units with which to interpret the object's vertices. If meters, Threebox will also rescale the object with changes in latitude, to appear to scale with objects and geography nearby.|
| `rotation`     | no       | 0   | number or {x, y, z}  | Rotation of the object along the three axes, to align it to desired orientation before future rotations. Note that future rotations apply atop this transformation, and do not overwrite it. `rotate` attribute must be provided in number or per axis ((i.e. for an object rotated 90 degrees over the x axis `rotation: {x: 90, y: 0, z: 0}`|
| `scale`     | no       | 1   | number or {x, y, z}  | Scale of the object along the three axes, to size it appropriately before future transformations. Note that future scaling applies atop this transformation, rather than overwriting it. `scale` attribute must be provided in number or per axis ((i.e. for an object transformed to 3 times higher than it's default size  `scale: {x: 1, y: 1, z: 3}`|
| `adjustment`     | no       | 1   | {x, y, z}  | 3D models are often not centered in their axes so the object positions and rotates wrongly. `adjustment` param must be provided in units per axis (i.e. `adjustment: {x: 0.5, y: 0.5, z: 0}`), so the model will correct the center position of the object |
| `normalize`     | no       | 1   | bool  | This param allows to normalize specular values from some 3D models |
| `feature`     | no       | 1   | [*GeoJson*](https://geojson.org/) feature  | [*GeoJson*](https://geojson.org/) feature instance. `properties` object of the *GeoJson* standard feature could be used to store relavant data to load and paint many different objects such as camera position, zoom, pitch or bearing, apart from the attributes already usually used by [*Mapbox GL* examples](https://docs.mapbox.com/mapbox-gl-js/examples/) such as `height`, `base_height`, `color`|
| `callback`     | yes       | NA   | function  | A function to run after the object loads. The first argument will be the successfully loaded object, and this is normally used to finish the configuration of the model and add it to Threebox scene through `tb.add()` method. 


```js
map.addLayer({
	id: 'custom_layer',
	type: 'custom',
	renderingMode: '3d',
	onAdd: function (map, gl) {

		window.tb = new Threebox(
			map,
			gl,
			{ defaultLights: true }
		);

		var options = {
			obj: '/3D/soldier/soldier.glb', //the model url, relative path to the page 
			type: 'gltf', //type enum, glb format is
			scale: 20, //20x the original size
			units: 'meters', //everything will be converted to meters in setCoords method				
			rotation: { x: 90, y: 0, z: 0 }, //default rotation
			adjustment: { x: 0, y: 0, z: 0 } // model center is displaced
			feature: geoJsonFeature // a valid GeoJson feature
		}

		tb.loadObj(options, function (model) {
			//this wil position the soldier at the GeoJson feature coordinates 
			soldier = model.setCoords(feature.geometry.coordinates);
			tb.add(soldier);
		})

	},
	render: function (gl, matrix) {
		tb.update();
	}
});
```
*[jscastro]* After the callback is initiated, the object returned will have the following events already available to listen taht enable the UI to behave and react to those. You can add these lines below:

```js
	tb.loadObj(options, function (model) {

		soldier = model.setCoords(origin);

		soldier.addEventListener('SelectedChange', onSelectedChange, false);
		soldier.addEventListener('Wireframed', onWireframed, false);
		soldier.addEventListener('IsPlayingChanged', onIsPlayingChanged, false);
		soldier.addEventListener('ObjectDragged', onDraggedObject, false);
		soldier.addEventListener('ObjectMouseOver', onObjectMouseOver, false);
		soldier.addEventListener('ObjectMouseOut', onObjectMouseOut, false);

		tb.add(soldier);
	})
```

In this way you'll be able to manage in you UI through a function once these events are fired. See below an example for `onSelectedChange` to use the method [`map.flyTo(options[, eventData])`](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto) from *Mapbox GL*:

```js
// method to activate/deactivate a UI button.
// this example uses jQuery 
// this example requires a GeoJson feature included in the options of the tb.loadObj(options) 
function onSelectedChange(e) {
	let selected = e.detail.selected; //we get if the object is selected after the event
	$('#deleteButton')[0].disabled = !selected; //we find the delete button with jquery

	//if selected
	if (selected) {
		selectedObject = e.detail; //
		//we fly smoothly to the object selected
		map.flyTo({
			center: selectedObject.userData.feature.properties.camera,
			zoom: selectedObject.userData.feature.properties.zoom,
			pitch: selectedObject.userData.feature.properties.pitch,
			bearing: selectedObject.userData.feature.properties.bearing
		});
	}
	tb.update();
	map.repaint = true;
}
```
<br>

**IMPORTANT NOTE:** Most of the popular 3D formats extensions (.glb, .gltf, .fbx, .dae, ...) are not standard [MIME TYPES](https://www.iana.org/assignments/media-types/media-types.xhtml), so you will need to configure your web server engine to accept this extensions, otherwise you'll receive different HTTP errors downloading them. 
<br>
If you are using **IIS** server, add these extensions to your *web.config* file *ASP.Net*, add the xml lines below in the `</system.webServer>` node:
```xml
<system.webServer>
	  ...
	  <staticContent>
		  <remove fileExtension=".mtl" />
		  <mimeMap fileExtension=".mtl" mimeType="model/mtl" />
		  <remove fileExtension=".obj" />
		  <mimeMap fileExtension=".obj" mimeType="model/obj" />
		  <remove fileExtension=".glb" />
		  <mimeMap fileExtension=".glb" mimeType="model/gltf-binary" />
		  <remove fileExtension=".gltf" />
		  <mimeMap fileExtension=".gltf" mimeType="model/gltf+json" />
		  <remove fileExtension=".fbx" />
		  <mimeMap fileExtension=".fbx" mimeType="application/octet-stream" />
	  </staticContent>
</system.webServer>
```
If you are using an **nginx** server, add the following lines to the *nginx.conf* file in the `http` object:
```json
http {
	include /etc/nginx/mime.types;
	types {
		model/mtl mtl;
		model/obj obj;
		model/gltf+json gltf;
		model/gltf-binary glb;
		application/octet-stream fbx;
	}
	...
}
```
If you are using an **Apache** server, add the following lines to the *mime.types* file:
```json
model/mtl mtl
model/obj obj
model/gltf+json gltf
model/gltf-binary glb
application/octet-stream fbx
```


---

### Object3D

```js
tb.Object3D(obj)
```

Add a `THREE.Object3D` instantiated elsewhere in *Three.js*, to empower it with Threebox methods below. Unnecessary for objects instantiated with any methods above.

| option | required | default | type   | description                                                                                  |
|-----------|----------|---------|--------|------------|
| `units`    | no       | scene      | string ("scene" or "meters") | Units with which to interpret the object's vertices. If meters, Threebox will also rescale the object with changes in latitude, to appear to scale with objects and geography nearby.|

<br>

---

### Shared methods between dynamic objects

#### set
```js
obj.set(options)
```

Broad method to update object's position, rotation, and scale. Check out the Threebox Types section below for details

Options

| option | required | default | type   | description                                                                                  |
|-----------|----------|---------|--------|------------|
| `coords`    | no       | NA      | `lnglat` | Position to which to move the object |
| `rotation`    | no       | NA      | `rotationTransform` | Rotation(s) to set the object, in units of degrees |
| `scale`    | no       | NA      | `scaleTransform` | Scale(s) to set the object, where 1 is the default scale |

#### setCoords
```js
obj.setCoords(lnglat)
```

Positions the object at the desired coordinate, and resizes it appropriately if it was instantiated with `units: "meters"`. Can be called before adding object to the map.

#### setRotation
```js
obj.setRotation(xyz)
```

Rotates the object over its defined center in the 3 axes, the value must be provided in degrees and could be a number (it will apply the rotation to the 3 axes) or as an {x, y, z} object. 
This rotation is applied on top of the rotation provided through loadObj(options).
and resizes it appropriately if it was instantiated with `units: "meters"`. Can be called before adding object to the map.

#### followPath
```js
obj.followPath(options [, callback] )
```

Translate object along a specified path. Optional callback function to execute when animation finishes

| option | required | default | type   | description                                                                                  |
|-----------|----------|---------|--------|------------|
| `path`    | yes       | NA      | lineGeometry | Path for the object to follow |
| `duration`    | no       | 1000      | number | Duration to travel the path, in milliseconds |
| `trackHeading`    | no       | true      | boolean | Rotate the object so that it stays aligned with the direction of travel, throughout the animation |


```js
obj.stop()
```

Stops all of object's current animations.

```js
obj.duplicate()
```

Returns a clone of the object. Greatly improves performance when handling many identical objects, by reusing materials and geometries.

<br>

## Utilities

`tb.projectToWorld(lnglat)`

Calculate the corresponding `Vector3` for a given lnglat.


`tb.unprojectFromWorld(Vector3)`

Calculate the corresponding lnglat for a given `Vector3`.


`tb.queryRenderedFeatures({x: number, y: number})`

Takes an input of `xy` as an object with values representing screen coordinates (as returned by mapboxgl mouse events as `e.point`). Returns an array of threebox objects at that screen position.

<br>

## Threebox types

<b>pointGeometry</b> `[longitude, latitude(, meters altitude)]`

An array of 2-3 numbers representing longitude, latitude, and optionally altitude (in meters). When altitude is omitted, it is assumed to be 0. When populating this from a GeoJSON Point, this array can be accessed at `point.geometry.coordinates`.  

While altitude is not standardized in the GeoJSON specification, Threebox will accept it as such to position objects along the z-axis.   

<br>

#### lineGeometry

`[pointGeometry, pointGeometry ... pointGeometry]`

An array of at least two lnglat's, forming a line. When populating this from a GeoJSON Linestring, this array can be accessed at `linestring.geometry.coordinates`. 

<br>

#### rotationTransform

`number` or `{x: number, y: number, z: number}`

Angle(s) in degrees to rotate object. Can be expressed as either an object or number. 

The object form takes three optional parameters along the three major axes: x is parallel to the equator, y parallel to longitudinal lines, and z perpendicular to the ground plane.

The number form rotates along the z axis, and equivalent to `{z: number}`.

<br>

#### scaleTransform

`number ` or `{x: number, y: number, z: number}`

Amount to scale the object, where 1 is the default size. Can be expressed as either an object or number.

The three axes are identical to those of `rotationTransform`. However, expressing as number form scales all three axes by that amount.

#### threeMaterial

`string` or instance of `THREE.Material()`

Denotes the material used for an object. This can usually be customized further with `color` and `opacity` parameters in the same 


Can be expressed as a string to the corresponding material type (e.g. `"MeshPhysicalMaterial"` for `THREE.MeshPhysicalMaterial()`), or a prebuilt THREE material directly.

## Using vanilla *Three.js* in Threebox

Threebox implements many small affordances to make mapping run in *Three.js* quickly and precisely on a global scale. Whenever possible, use threebox methods to add, change, manage, and remove elements of the scene. Otherwise, here are some best practices:

- Use `threebox.Object3D` to add custom objects to the scene
- If you must interact directly with the THREE scene, add all objects to `threebox.world`.
- `tb.projectToWorld` to convert lnglat to the corresponding `Vector3()`


# Performance considerations

- Use `obj.clone()` when adding many identical objects. If your object contains other objects not in the `obj.children` collection, then those objects need to be cloned too.`
