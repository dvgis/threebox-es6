/**
 * @author peterqliu / https://github.com/peterqliu
 * @author jscastro / https://github.com/jscastro76
 */
const THREE = require("../three.js");
const utils = require("../utils/utils.js");
const ThreeboxConstants = require("../utils/constants.js");

function CameraSync(map, camera, world) {
    //    console.log("CameraSync constructor");
    this.map = map;
    this.camera = camera;
    this.active = true;

    this.camera.matrixAutoUpdate = false; // We're in charge of the camera now!

    // Postion and configure the world group so we can scale it appropriately when the camera zooms
    this.world = world || new THREE.Group();
    this.world.position.x = this.world.position.y = ThreeboxConstants.WORLD_SIZE / 2
    this.world.matrixAutoUpdate = false;

    // set up basic camera state
    this.state = {
        translateCenter: new THREE.Matrix4().makeTranslation(ThreeboxConstants.WORLD_SIZE / 2, -ThreeboxConstants.WORLD_SIZE / 2, 0),
        worldSizeRatio: ThreeboxConstants.TILE_SIZE / ThreeboxConstants.WORLD_SIZE,
        worldSize: ThreeboxConstants.TILE_SIZE * this.map.transform.scale
    };

    // Listen for move events from the map and update the Three.js camera
    let _this = this; // keep the function on _this
    this.map
        .on('move', function () {
            _this.updateCamera();
        })
        .on('resize', function () {
            _this.setupCamera();
        })

    this.setupCamera();
}

CameraSync.prototype = {
    setupCamera: function () {
        //console.log("setupCamera");
        this.state.fov = this.map.transform._fov;
        const t = this.map.transform;
        this.camera.aspect = t.width / t.height; //bug fixed, if aspect is not reset raycast will fail on map resize
        this.camera.updateProjectionMatrix();
        this.halfFov = this.state.fov / 2;
        const offset = { x: t.width / 2, y: t.height / 2 };//t.centerOffset;
        const cameraToCenterDistance = 0.5 / Math.tan(this.halfFov) * t.height;
        const maxPitch = t._maxPitch * Math.PI / 180;
        this.acuteAngle = Math.PI / 2 - maxPitch;

        this.state.cameraToCenterDistance = cameraToCenterDistance;
        this.state.offset = offset;
        this.state.cameraTranslateZ = new THREE.Matrix4().makeTranslation(0, 0, this.state.cameraToCenterDistance);
        this.state.maxFurthestDistance = this.state.cameraToCenterDistance * 0.95 * (Math.cos(this.acuteAngle) * Math.sin(this.halfFov) / Math.sin(Math.max(0.01, Math.min(Math.PI - 0.01, this.acuteAngle - this.halfFov))) + 1);

        this.updateCamera();

    },

    updateCamera: function (ev) {
        if (!this.camera) {
            console.log('nocamera')
            return;
        }

        // Furthest distance optimized by @jscastro76
        const t = this.map.transform;
        const groundAngle = Math.PI / 2 + t._pitch;
        this.cameraToCenterDistance = 0.5 / Math.tan(this.halfFov) * t.height;
        this.state.cameraTranslateZ = new THREE.Matrix4().makeTranslation(0, 0, this.cameraToCenterDistance);
        const topHalfSurfaceDistance = Math.sin(this.halfFov) * this.state.cameraToCenterDistance / Math.sin(Math.PI - groundAngle - this.halfFov);
        const pitchAngle = Math.cos((Math.PI / 2) - t._pitch); //pitch seems to influence heavily the depth calculation and cannot be more than 60 = PI/3

        // Calculate z distance of the farthest fragment that should be rendered. 
        const furthestDistance = pitchAngle * topHalfSurfaceDistance + this.state.cameraToCenterDistance;

        // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
        const farZ = furthestDistance * 1.01;

        // someday @ansis set further near plane to fix precision for deckgl,so we should fix it to use mapbox-gl v1.3+ correctly
        // https://github.com/mapbox/mapbox-gl-js/commit/5cf6e5f523611bea61dae155db19a7cb19eb825c#diff-5dddfe9d7b5b4413ee54284bc1f7966d
        const nz = (t.height / 50); //min near z as coded by @ansis
        const nearZ = Math.max(nz * pitchAngle, nz); //on changes in the pitch nz could be too low

        const h = t.height;
        const w = t.width;
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.projectionMatrix = utils.makeOrthographicMatrix(w / - 2, w / 2, h / 2, h / - 2, nearZ, farZ);
        } else {
            this.camera.projectionMatrix = utils.makePerspectiveMatrix(this.state.fov, w / h, nearZ, farZ);
        }
        // Unlike the Mapbox GL JS camera, separate camera translation and rotation out into its world matrix
        // If this is applied directly to the projection matrix, it will work OK but break raycasting
        let cameraWorldMatrix = this.calcCameraMatrix(t._pitch, t.angle);
        this.camera.matrixWorld.copy(cameraWorldMatrix);

        let zoomPow = t.scale * this.state.worldSizeRatio;
        // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
        let scale = new THREE.Matrix4;
        let translateMap = new THREE.Matrix4;
        let rotateMap = new THREE.Matrix4;

        scale.makeScale(zoomPow, zoomPow, zoomPow);

        let x = t.x || t.point.x;
        let y = t.y || t.point.y;
        translateMap.makeTranslation(-x, y, 0);
        rotateMap.makeRotationZ(Math.PI);

        this.world.matrix = new THREE.Matrix4()
            .premultiply(rotateMap)
            .premultiply(this.state.translateCenter)
            .premultiply(scale)
            .premultiply(translateMap)

    },


    calcCameraMatrix(pitch, angle, trz) {
        const t = this.map.transform;
        const _pitch = (pitch === undefined) ? t._pitch : pitch;
        const _angle = (angle === undefined) ? t.angle : angle;
        const _trz = (trz === undefined) ? this.state.cameraTranslateZ : trz;

        return new THREE.Matrix4()
            .premultiply(_trz)
            .premultiply(new THREE.Matrix4().makeRotationX(_pitch))
            .premultiply(new THREE.Matrix4().makeRotationZ(_angle));
    }
}

module.exports = exports = CameraSync;