# `threebox`

A three.js plugin for Mapbox GL JS, using the custom layer feature. Provides convenient methods to manage objects in lnglat coordinates, and to synchronize the map and scene cameras.

<img alt="threebox" src="docs/gallery.jpg">

### Compatibility/Dependencies

- Mapbox v.0.50.0 and later (for custom layer support)
- Three.r114 (already bundled into the Threebox build). If desired, other versions can be swapped in and rebuilt [here](https://github.com/peterqliu/threebox/blob/master/src/three.js), though compatibility is not guaranteed.

### Getting started

Download the bundle from [`dist/threebox.js`](dist/threebox.js) and add include it in a `<script>` tag on your page.

Several introductory examples are [here](https://github.com/peterqliu/threebox/tree/master/examples). To run them, create a `config.js` file with your Mapbox access token, alongside and in the format of [the template](https://github.com/peterqliu/threebox/blob/master/examples/config_template.js).

[Documentation lives here](docs/Threebox.md).

### Contributing

From scratch for Visual Studio 2017s:
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
Build the library with `npm run build`, or `npm run dev` to rebuild continuously as you develop. Both commands will output a bundle in `/dist/threebox.js`.

Tests live [here](tests/) -- run `index.html` and check the console for test results.


