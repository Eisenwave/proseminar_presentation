let container, renderer, scene, camera, controls, hoverElement;

function init() {
    // Set the scene size.
    const WIDTH = 960;
    const HEIGHT = 600;

    // Set some camera attributes.
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;
    const ORTO_W = 1, ORTO_H = 1;

    // Get the DOM element to attach to
    container = document.getElementById('rendererContainer');

    // Create a WebGL renderer, camera
    // and a scene
    renderer = new THREE.WebGLRenderer({antialias: true});
    camera = new THREE.OrthographicCamera(-ORTO_W, ORTO_W, ORTO_H, -ORTO_H, NEAR, FAR);

    scene = new THREE.Scene();

    // Add the camera to the scene.
    scene.add(camera);

    // Start the renderer.
    renderer.setSize(WIDTH, HEIGHT);

    // Attach the renderer-supplied
    // DOM element.
    container.appendChild(renderer.domElement);
    initControls();
}

function onKeyDown(event) {
    if (hoverElement !== renderer.domElement)
        return;

    switch (event.key) {
        case 'o':
            camera.position.x = 0 - 0.5;
            camera.position.y = 1 + 0.5;
            camera.position.z = 1 + 0.5;
            break;

        case 'x':
            camera.position.x = -1;
            camera.position.y = 0.5;
            camera.position.z = 0.5;
            break;

        case 'y':
            camera.position.x = 0.5;
            camera.position.y = -1;
            camera.position.z = 0.5;
            break;

        case 'z':
            camera.position.x = 0.5;
            camera.position.y = 0.5;
            camera.position.z = 2;
            break;
    }
}

function initControls() {
    document.addEventListener('mouseover', e => {
        hoverElement = e.target;
    });

    window.addEventListener('keydown', onKeyDown, false);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function setup() {
    //scene.background = new THREE.Color(0.95, 0.95, 0.95);
    scene.background = new THREE.Color(1, 1, 1);

    camera.position.x = 0 - 0.5;
    camera.position.y = 1 + 0.5;
    camera.position.z = 1 + 0.5;

    controls = new THREE.OrbitControls(camera, container);
    controls.target = new THREE.Vector3(0.5, 0.5, 0.5);
    controls.update();

    setupAxes();
    setupGround();
    setupContent();
}

function setupAxes() {
    let mat = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2});
    let axisXMat = mat.clone();
    let axisYMat = mat.clone();
    let axisZMat = mat.clone();

    axisXMat.color = new THREE.Color(0xFF0000);
    axisYMat.color = new THREE.Color(0x00FF00);
    axisZMat.color = new THREE.Color(0x0000FF);

    let lineX = createLine(new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 1), axisXMat);
    let lineY = createLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), axisYMat);
    let lineZ = createLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), axisZMat);

    scene.add(lineX);
    scene.add(lineY);
    scene.add(lineZ);
}

function setupGround() {
    const LINE_COUNT = 10;
    const LINE_STEP = 0.01;

    /*let material = new THREE.LineDashedMaterial({
        color: 0x404040,
        linewidth: 1,
        scale: 1,
        dashSize: 1,
        gapSize: 10,
    });*/
    let mat = new THREE.PointsMaterial({color: 0x404040, size: 1, sizeAttenuation: false});

    let geo = new THREE.Geometry();
    let vertices = geo.vertices;

    for (let x = 0.0; x <= 1; x += 1 / LINE_COUNT) {
        for (let z = 0.0; z < 1; z += LINE_STEP) {
            vertices.push(new THREE.Vector3(x, 0, z));
        }
    }
    for (let x = 0.0; x <= 1; x += LINE_STEP) {
        for (let z = 0.0; z < 1; z += 1 / LINE_COUNT) {
            vertices.push(new THREE.Vector3(x, 0, z));
        }
    }
    for (let y = 0.0; y <= 1; y += 1 / LINE_COUNT) {
        for (let x = 0.0; x < 1; x += LINE_STEP) {
            vertices.push(new THREE.Vector3(x, y, 0));
        }
    }
    for (let y = 0.0; y <= 1; y += LINE_STEP) {
        for (let x = 1 / LINE_COUNT; x < 1; x += 1 / LINE_COUNT) {
            vertices.push(new THREE.Vector3(x, y, 0));
        }
    }
    for (let z = 0.0; z <= 1; z += 1 / LINE_COUNT) {
        for (let y = 0.0; y < 1; y += LINE_STEP) {
            vertices.push(new THREE.Vector3(1, y, z));
        }
    }
    for (let z = 0.0; z <= 1; z += LINE_STEP) {
        for (let y = 0.0; y < 1; y += 1 / LINE_COUNT) {
            vertices.push(new THREE.Vector3(1, y, z));
        }
    }

    scene.add(new THREE.Points(geo, mat));
}

function setupContent() {
    //const POINTS_CUTOFF = Math.pow(2, 16);
    const POINTS_MAX = 2147483648;
    const POINTS_COUNT = 100000;
    const STEP = Math.max(1, POINTS_MAX / POINTS_COUNT);

    let mat = new THREE.PointsMaterial({color: 0x202020, size: 2, sizeAttenuation: true});

    let geo = new THREE.Geometry();
    let vertices = geo.vertices;


    for (let x = 0; x < POINTS_MAX; x += STEP) {
        let y = randu(Math.floor(x));
        let z = randu(y);

        vertices.push(new THREE.Vector3(x, y, z).multiplyScalar(1.0 / POINTS_MAX));
    }

    scene.add(new THREE.Points(geo, mat));
}

function createDot(loc, color) {
    let geo = new THREE.Geometry();
    geo.vertices.push(loc);

    return new THREE.Points(geo, new THREE.PointsMaterial({size: 1, sizeAttenuation: false}))
}

function createDashedLine(start, end, material) {
    let geo = new THREE.Geometry();
    geo.vertices.push(start, end);
    //geo = new THREE.EdgesGeometry(geo);

    let line = new THREE.LineSegments(geo, material);
    line.computeLineDistances();

    return line;
}

function createLine(start, end, material) {
    //const mat = new THREE.LineBasicMaterial({color: color, linewidth: 2});
    let geo = new THREE.Geometry();

    geo.vertices.push(start, end);

    return new THREE.Line(geo, material);
}

init();
setup();
animate();
