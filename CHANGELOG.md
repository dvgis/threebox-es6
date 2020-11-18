## 2.0.9

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- [**#12**](https://github.com/jscastro76/threebox/issues/12) rotationStep, gridStep and altitudeStep must be configurable
- [**#44**](https://github.com/jscastro76/threebox/issues/44) disable or enable dirLightHelper for realSunlight.
- [**#89**](https://github.com/jscastro76/threebox/issues/89) Allow drag an Object3D on altitude.
- [**#90**](https://github.com/jscastro76/threebox/issues/90) When dragging/rotating objects add a label that shows the current values 
- [**#91**](https://github.com/jscastro76/threebox/issues/91) An object rotated twice, starts again from 0 degrees not from its original position  
- [**#92**](https://github.com/jscastro76/threebox/issues/92) Refactor `obj.addLabel`, `obj.addTooltip` and add `obj.addHelp` 

<br>

- - - 

## 2.0.8

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- [**#73**](https://github.com/jscastro76/threebox/issues/73) `tb.dispose` must clean `tb.objectsCache`
- [**#74**](https://github.com/jscastro76/threebox/issues/74) Question: Why is this library not available on npm ?
- [**#75**](https://github.com/jscastro76/threebox/issues/75) Publish in npm 
- [**#76**](https://github.com/jscastro76/threebox/issues/76) Refactor Objects.prototype._makeGroup
- [**#78**](https://github.com/jscastro76/threebox/issues/78) refactor var to const and let 
- [**#80**](https://github.com/jscastro76/threebox/issues/80) Update example [15-performance.html](https://github.com/jscastro76/threebox/blob/master/examples/15-performance.html) Add built-in animation to example 15-performance.html windmill.
- [**#82**](https://github.com/jscastro76/threebox/issues/82) Add a method `tb.getSunTimes`
- [**#85**](https://github.com/jscastro76/threebox/issues/85) We need an object compare method
- [**#87**](https://github.com/jscastro76/threebox/issues/87) Change `tb.getSunPosition` to accept lnglat coords instead of two params 
- [**#88**](https://github.com/jscastro76/threebox/issues/88) Add night style change in 12-add3dmodel.html and 13-eiffel.html examples during night hours 

#### :beetle: Bug fixes

- [**#42**](https://github.com/jscastro76/threebox/issues/42) #42 Angular and Threebox. Solved an issue using a `mapboxgl.Point`line
- [**#77**](https://github.com/jscastro76/threebox/issues/77) #77 example 05-logistics raises an error removing the line
- [**#79**](https://github.com/jscastro76/threebox/issues/79) #79 Some examples are not using `renderingMode: 3d` in the layer creation 
- [**#86**](https://github.com/jscastro76/threebox/issues/86) #86 After #56 the feature that comes in userData is not being updated. 

<br>

- - - 


## 2.0.7

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- [**#24**](https://github.com/jscastro76/threebox/issues/24) Refactor `obj.deepCopy`, these members must be properties found by name
- [**#54**](https://github.com/jscastro76/threebox/issues/54) vue and threebox,map not defined.
- [**#63**](https://github.com/jscastro76/threebox/issues/63) `CSS2DObject` is not disposing properly.
- [**#66**](https://github.com/jscastro76/threebox/issues/66) `tb.dispose` must now call `tb.clear` and return the async value
- [**#68**](https://github.com/jscastro76/threebox/issues/68) add new methods to remove label & tooltip
- [**#71**](https://github.com/jscastro76/threebox/issues/71) Defer default boundingBox and tooltip creation.
- Update example [15-performance.html](https://github.com/jscastro76/threebox/blob/master/examples/15-performance.html) to avoid dupplicated calls when dragging the count GUI control.

#### :beetle: Bug fixes
- [**#61**](https://github.com/jscastro76/threebox/issues/61) `.userData` not refreshed properly on `obj.duplicate`.
- [**#62**](https://github.com/jscastro76/threebox/issues/62) Memory Leak on `tb.remove()`. Tested
- [**#64**](https://github.com/jscastro76/threebox/issues/64) Cache instance of a loaded model is disposed when the world children is.
- [**#65**](https://github.com/jscastro76/threebox/issues/65) addTooltip and addLabel don't remove previous objects.
- [**#67**](https://github.com/jscastro76/threebox/issues/67) clones have `boundingBoxShadow` line in white.
- [**#69**](https://github.com/jscastro76/threebox/issues/69) After #56 the labels and tooltips are wrongly positioned.
- [**#70**](https://github.com/jscastro76/threebox/issues/70) After #56 object boundingBox has the original cached size.
- [**#72**](https://github.com/jscastro76/threebox/issues/72) After #56 animations are not being cloned.

<br>

- - - 


## 2.0.6

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- [**#43**](https://github.com/jscastro76/threebox/issues/43) Threebox new method `tb.removeLayer` that removes the 3D objects of a layer, apart from removing the layer itself with `map.removeLayer`
- [**#56**](https://github.com/jscastro76/threebox/issues/56) Objects cache at `tb.loadObj`
  - `tb.loadObj` now is 100% async and in the first call to an object load by url, then caches the returned object for the sucessive calls to return a clone of the object through `obj.duplicate()`
  - Closes [**#51**](https://github.com/jscastro76/threebox/issues/51), [**#55**](https://github.com/jscastro76/threebox/issues/55)
- [**#57**](https://github.com/jscastro76/threebox/issues/57) Add a new sample to measure performance
  - Added new example to demonstrate add thousands of objects and measure performance [Threebox Performance](https://github.com/jscastro76/threebox/blob/master/examples/15-performance.html).
- [**#58**](https://github.com/jscastro76/threebox/issues/58) Refactor `tb.remove`
- [**#59**](https://github.com/jscastro76/threebox/issues/59) Refactor `tb.clear` to add `layerId`.
- [**#60**](https://github.com/jscastro76/threebox/issues/58) Refactor `tb.dispose`
- All the examples reviewed and updated and added to the [Examples list](https://github.com/jscastro76/threebox/tree/master/examples)

<br>

- - - 

## 2.0.5

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- [**#28**](https://github.com/jscastro76/threebox/issues/28) Create a realistic illumination at any given lnglat, date and time
  - Added [SunCalc](https://github.com/mourner/suncalc) for sun position calculations
  - Threebox can receive now a new param `realSunlight : true` at instantiation
  - Threebox new method `tb.realSunlight` that sets the lights for the scene with default map center position and current datetime.
  - Threebox new method `tb.getSunPosition(date, lng, lat)` that allows to get sun altitude and azimuth from [SunCalc](https://github.com/mourner/suncalc)
  - Threebox new method `tb.setBuildingShadows(options)` that instantiates a new `BuildingShadows` class.
  - Threebox new method `tb.setSunlight (newDate = new Date(), coords)` that calculates real Sun light position at a given datetime and lnglat calling `tb.getSunPosition(date, lng, lat)`.
  - Added `this.lights` to enable access to lights configured for the scene through `defaultLights` or `realSunLight`. 
  - Light Helpers (if any) are now updated on `tb.update` calling `this.updateLightHelper()`, useful to see the sun direction on animations.
- [**#30**](https://github.com/jscastro76/threebox/issues/30) Shadow examples
  - Added new example to demonstrate how to change style [Change map style for Eiffel Tower](https://github.com/jscastro76/threebox/blob/master/examples/stylechange.html).
  - Added new example boosting @andrewharvey original sample but with real sunlight and built-in shadows [Add a 3D model](https://github.com/jscastro76/threebox/blob/master/examples/add-3d-model.html).
  - Added new example to show default fill extrusion buildings shadow [Building Sun light and shadows](https://github.com/jscastro76/threebox/blob/master/examples/buildingshadow.html). 
  - Improved Eiffel example with real sun light slider and shadows on 3D models and Buildings extrusions [Statue of Liberty and Eiffel Tower with Shadows](https://github.com/jscastro76/threebox/blob/master/examples/eiffel.html)
- `tb.Constants` are now accessible through instance (usefull for HTML/js side calculations)
- [**#31**](https://github.com/jscastro76/threebox/issues/31) Create/Remove the shadow plane automatically on `obj.castShadow`
- [**#33**](https://github.com/jscastro76/threebox/issues/33) Refactored methods `òbj.add` and `obj.remove` to enable add an object to them (honestly this never worked as it was referring to root which is the function.)
- [**#34**](https://github.com/jscastro76/threebox/issues/34) Added shadows for fill extrusion layers
  - Synced with Custom Layers `tb.setSunLight` through `tb.setBuildingShadows(options)`
  - Added new example on fill-extrusion shadows.
- [**#36**](https://github.com/jscastro76/threebox/issues/36) Clean up after use. Implemented a new method `tb.clear(dispose)` that removes all the children from `tb.children`
- [**#37**](https://github.com/jscastro76/threebox/issues/37) Anchor options. Implement the option `'auto'` that won't do anything to position the anchor, so the 3D Object will use it's default anchor defined in the model itself.

#### :beetle: Bug fixes
- [**#32**](https://github.com/jscastro76/threebox/issues/32) Hide PlaneGeometry used for shadow from raycaster.
- [**#35**](https://github.com/jscastro76/threebox/issues/35) Refresh of map after map style change creating a new `tb.setStyle` that replicates `map.setStyle` and calls a new method `tb.clear`

<br>

- - - 

## 2.0.4

Minor version by [@jscastro76](https://github.com/jscastro76), some enhancements and bugs. 

#### :sparkles: Enhancements

- Update to *Mapbox GL* v1.11.1.
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
- [**#23**](https://github.com/jscastro76/threebox/issues/23) Updated sample [mercator.html](https://github.com/jscastro76/threebox/blob/master/examples/mercator.html) to test the changes in `obj.duplicate()` method comparing duplication with new instances creation.
- Preparation for including post-effects  

#### :beetle: Bug fixes
- [**#16**](https://github.com/jscastro76/threebox/issues/16) Bug in `obj.duplicate()` method. It was a *Three.js* bug [**19900**](https://github.com/mrdoob/three.js/issues/19900) but it was resolved here through the addition of a copy constructor.
- [**#23**](https://github.com/jscastro76/threebox/issues/23) Bug in `obj.duplicate()` method. It's not cloning properly all the members of a Threebox Object3D such as `obj.animations`, `obj.boundingBox`, `obj.boundingBoxShadow`, `obj.anchor`, etc...


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
- Bug fixed in `utils.getFeatureCenter` that was not considering geoJson `MultiPolygon` type.

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