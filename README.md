# `threebox`

A three.js plugin for Mapbox GL JS, using the custom layer feature. Provides convenient methods to manage objects in lnglat coordinates, and to synchronize the map and scene cameras.

<img alt="threebox" src="docs/gallery.jpg">

### ONLY in this fork

Only in this fork, there is a list of new features implemented on top of the amazing work of [@peterqliu](https://github.com/peterqliu/threebox/):
- Update to Three.js v114
- Update to Mapbox v1.10.0 
- Support for multiple format objects (FBX, GLTF/GLB, Collada)
- Support for CSS2DLabels supporting rich HTML controls.
- Support for tooltips browser-like.
- Support for Objects3D bounding box and floor projection.
- Support for built-in Raycaster in loaded Objects3D and fill-extrusions together.
- Support for built-in MouseOver/Mouseout, Selected, Drag&Drop, Drag&Rotate, Wireframe in loadedObjects including events.
- Support for GeoJson standard features format import and export in different layers.
- Support for Objects3D embedded animations, and combined animations on AnimationManager (i.e. translate + embedded).
- Support for multi-floor design of spaces.
- Support for setLayerZoomRange and setLayoutProperty on Custom Layers not available in Mapbox.
- Support for full dispose of Mapbox, Three and Threebox resources.
- Optimization of Camera perspective to have Raycast with pixel-precision level.
- Adjusted positioning for Objects3D to set center and rotation axises by config.

<img alt="threebox" src="docs/soldieranimation.jpg">

### Compatibility/Dependencies

- Mapbox v.0.50.0 and later (for custom layer support)
- Three.r114 (already bundled into the Threebox build). If desired, other versions can be swapped in and rebuilt [here](https://github.com/jscastro/threebox/blob/master/src/three.js), though compatibility is not guaranteed.

### Getting started

Download the bundle from [`dist/threebox.js`](dist/threebox.js) and add include it in a `<script>` tag on your page.

Several introductory examples are [here](https://github.com/jscastro/threebox/tree/master/examples). To run them, create a `config.js` file with your Mapbox access token, alongside and in the format of [the template](https://github.com/jscastro/threebox/blob/master/examples/config_template.js).

[Documentation lives here](docs/Threebox.md).

### Contributing

Build the library with `npm run build`, or `npm run dev` to rebuild continuously as you develop. Both commands will output a bundle in `/dist/threebox.js`.

### Sample to build the project in Visual Studio
Sample to get a full build from scratch for Visual Studio:
- Install [Node.js](https://nodejs.org/en/) 
- Clone the repo and open a new Project using main.js
- Update the packages @turf, tape, uglyfy, watchify
- Right click on the project at the Solution Explorer > Open Node.js Interactive Window:
- execute `.npm [ProjectName] init -y`
- execute `.npm [ProjectName] install`
- execute `.npm [ProjectName] i`
- execute `.npm [ProjectName] [LocalPath] install azure@4.2.3`
- execute `.npm [ProjectName] run dev` or `.npm run build
`

Tests live [here](tests/) -- run `index.html` and check the console for test results.


