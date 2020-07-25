## 2.0.4

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- Update to *Mapbox GL* v1.11..
- [**#13**](https://github.com/jscastro76/threebox/issues/13) Refactored `tube` and `Object3D` including now all the events, behaviors, `.tooltip` `.boundingBox` and `.boundingBoxShadow` and behave like 3D models loaded through `tb.loadObj`
- [**#15**](https://github.com/jscastro76/threebox/issues/15) Removed modules from the solution. 
- [**#17**](https://github.com/jscastro76/threebox/issues/17) 3D models and Objects3D have a new config param `anchor` as string, that will be used to calculate dynamically the position of the object pivotal anchor to the coords it's positioned. This could have the following values `top`, `bottom`, `left`, `right`, `center`, `top-left`, `top-right`, `bottom-left`, `bottom-right`. Default value is `bottom-left` for precison on positioning.
- [**#17**](https://github.com/jscastro76/threebox/issues/17) 3D models and Objects3D `adjustment` param will override `anchor` automatic calculation to allow fully custom positioning for a pivotal center and altitude.  
- 3DObject has now a new method `obj.setAnchor` to define the positional and pivotal center based on a string value.
- 3DObject has now a new method `obj.setCenter` to allows to define positional and pivotal center based on an {x,y,z} value in units.
- [**#18**](https://github.com/jscastro76/threebox/issues/18) `obj.addTooltip` and `obj.addLabel` receive a new param `anchor` that is by default `obj.anchor`, so it'll be calculated dynamically to `bottom-left` position. 
- [**#19**](https://github.com/jscastro76/threebox/issues/19) Removed version logs from `ColladaLoader` and `FBXLoader` 
- [**#20**](https://github.com/jscastro76/threebox/issues/20) 3D model url returned at `loadObj` error if there's an exception
- [**#21**](https://github.com/jscastro76/threebox/issues/21) Added new example with [Statue of Liberty and Eiffel Tower](https://github.com/jscastro76/threebox/blob/master/examples/eiffel.html) insipred by this [StackOverflow question](https://stackoverflow.com/questions/46701072/how-to-put-threejs-building-on-mapbox-to-its-real-place/46705447#)
- [**#22**](https://github.com/jscastro76/threebox/issues/22) All the examples updated to *Mapbox GL* v1.11.1.
- Threebox initialization params are now validated at the beginning. 
- Preparation for including post-effects  

#### :beetle: Bug fixes
- [**#16**](https://github.com/jscastro76/threebox/issues/16) Bug in `obj.duplicate()` method. It was a *Three.js* bug [**19900**](https://github.com/mrdoob/three.js/issues/19900) but it was resolved here through the addition of a copy constructor.


<br>

- - - 

## 2.0.3

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- Update *Three.js* to v117 (WARNING: v118 breaks compatibility)
- Update *ColladaLoader.js*, *FBXLoader.js*, *GLTFLoader.js*, *MTLLoader.js* and *OBJLoader.js* to v.118
- Change in `obj.setCoords` method to use `min_height` value from default fill-extrusions coming from composite-building data.
- Change in `getObjectHeightOnFloor` to change use of `model.modelHeight` cosidering always `height=0` use `min_height` value from default fill-extrusions coming from composite-building data.
- Added `enableSelectingFeatures` to `Threebox` object default options, this allows to activate built-in raycasting over custom or default composite layer fill-extrusions. 
- Added `enableSelectingObjects` to `Threebox` object default options, this allows to activate built-in raycasting over Threebox 3D objects.  
- Added `enableDraggingObjects` to `Threebox` object default options, this allows to drag&drop Threebox 3D objects when selected to move them. 
- Added `enableRotatingObjects` to `Threebox` object default options, this allows to drag&drop Threebox 3D objects when selected to rotate them. 
- Added `enableTooltips` to `Threebox` object default options, this creates default tooltips on Objects3D and fill-extrusions.
- Added default tooltips to 3D objects and fill-extrusion features that can be overriden, so far always top centered.
- Added a new example *3Dbuildings.html* showing the built-in raycast behavior and tooltips on top of the 3D Buildings fill-extrusions composite layer.
- Updated samples *raycaster.html*, *mercator.html*, *animation.html*, *mercator.html*, *basic.html*, *logistics.html*.
- Refactored `sphere` and `Object3D` including now all the events, behaviors, `.tooltip` `.boundingBox` and `.boundingBoxShadow` and behave like 3D models loaded through `tb.loadObj`
- Refactored `t.loadObj` to validate options format.
- Added `toolbox.css` that supports generic styles for tooltips mapbox-like.

#### :beetle: Bug fixes

- Bug fixed in `THREE.MTLLoader` with url undefined. (Pending decouple MTLLoader unless it's a `.obj` model)
- Bug fixed in `addTooltip(f, map)` method when a fill-extrusion has no name or id.
- Bug fixed in `Utils.getFeatureCenter` that was not considering geoJson `MultiPolygon` type.

<br>

- - - 

## 2.0.2

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- New example added for alignment test check.
- Label and Tooltip are now dynamic objects in Threebox.
- Label and Tooltip objects support extrusions and include Altitude.
- Label and Tooltip calculate by default the center of the object.
- Tooltip has now a new param to match Mapbox styles
- obj.modelHeight is not anymore needed as a param to create a Label at obj.drawLabelHTML
- obj.addLabel does not need anymore bottomMargin cab be changed by styles through cssClass parameter
- Refactoring of HTML creation for Label and Tooltip
- Server.js script added for server execution.

#### :beetle: Bug fixes
- Bug fixed, Camera aspect ratio was not properly updated on map resize.
- Bug fixed on unselect Object and unselect Feature, now both work the same
- Bug fixed to support default fill-extrusion layers using composite and building data.

<br>

- - - 

## 2.0.1

This is the new version created with this [fork]((https://github.com/jscastro76/threebox)) by [@jscastro76](https://github.com/jscastro76) and it's a major update. 

#### :sparkles: Enhancements

- Update to *Three.js* v114.
- Update to *Mapbox GL* v1.10.0.
- All the examples updated, and one more example added with new features.
- Support for multiple format objects (FBX, GLTF/GLB, Collada + OBJ/MTL).
- Support for CSS2DLabels supporting rich HTML controls through a new LabelManager.
- Support for tooltips/title browser-like.
- Support for Objects3D bounding box and floor projection.
- Support for built-in Raycaster in loaded Objects3D and fill-extrusions together.
- Support for built-in MouseOver/Mouseout, Selected, Drag&Drop, Drag&Rotate, Wireframe in loadedObjects including events.
- Support for GeoJson standard features format import and export in different layers.
- Support for Objects3D embedded animations, and combined animations on AnimationManager (i.e. translate + embedded).
- Support for multi-floor design of spaces.
- Support for Non-AABB Non Axes Aligned Bounding Box and real model size. 
- Support for wireframing on Objects3D, removing them from the raycast.
- Support for setLayerZoomRange and setLayoutProperty on Custom Layers (not available in Mapbox).
- Support for full dispose of Mapbox, Three and Threebox resources.
- Optimization of Camera perspective to have Raycast with pixel-precision level.
- Adjusted positioning for Objects3D to set center and rotation axes by config.

<br>

- - - 

## 0.3.0

#### Enhancements

- Add an Object class: convenience methods to produce lines, spheres, tubes, and imported OBJ/MTL meshes, as well as a method to bring in THREE.Object3D's produced elsewhere with vanilla Three.js. Most of these are moveable, and have methods to move/rotate/rescale

- No need to call `tb.update()` after putting it in the custom layer's `render()` function.

#### Bug fixes

- Automatically adjust for viewport size (https://github.com/peterqliu/threebox/issues/43)

#### Deprecated (but still functional)
- `.setupDefaultLights()` has moved to an optional `defaultLights` parameter, in the third argument for Threebox().
- `tb.addAtCoordinate()` and `tb.moveToCoordinate()` have been deprecated. `tb.add(Object)` and `Object.setCoords()` replace them