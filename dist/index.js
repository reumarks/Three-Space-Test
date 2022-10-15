import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
const canvas = document.querySelector('canvas.webgl');

// Scene
let camera, scene, renderer, clock;

const raycaster = new THREE.Raycaster();

let elapsedTime = 0;

let width, height;

let mouse = {
    x: 0,
    y: 0,
    three: new THREE.Vector2()
}

const textureLoader = new THREE.TextureLoader();
const moonRock = textureLoader.load('moonRock.jpg');
const moonRockMaterial = new THREE.MeshBasicMaterial({
    map: moonRock
});
const moonRockSelected = textureLoader.load('moonRockSelected.jpg');
const moonRockSelectedMaterial = new THREE.MeshBasicMaterial({
    map: moonRockSelected
});

const boxGeometry = new THREE.BoxBufferGeometry();

setup();
animate();

function setup() {
    width = window.innerWidth;
    height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 500);
    camera.position.z = 50;
    
    scene = new THREE.Scene();

    clock = new THREE.Clock();
    
    for (let i = 0; i < 1000; i++) {
        const object = new THREE.Mesh(boxGeometry, moonRockMaterial);
        object.position.x = Math.random() * 80 - 40;
        object.position.y = Math.random() * 80 - 40;
        object.position.z = Math.random() * 80 - 40;
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        scene.add(object);
    }

    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true 
    });
    renderer.setSize(width, height);

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('wheel', onMouseWheel, false);
    document.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('resize', onResize, false);
}

function animate(){
    var delta = clock.getDelta();
    elapsedTime += delta;
    requestAnimationFrame(animate);
    updateObjects(scene, delta);
    render();
}

function render() {
    camera.rotation.x = (1 + mouse.three.y) * 0.5;
    camera.rotation.y = (1 - mouse.three.x) * 0.5;
    sendRaycaster(scene, camera);

    renderer.render(scene, camera);
}

function updateObjects(scene, delta){
    for(let i = 0; i < scene.children.length; i++){
        scene.children[i].rotation.x += delta * Math.sin(scene.children[i].position.x * 100);
        scene.children[i].rotation.y += delta * Math.sin(scene.children[i].position.y * 100);
        scene.children[i].rotation.z += delta * Math.sin(scene.children[i].position.z * 100);
    }
}

function onMouseMove(event) {
    event.preventDefault();
    let rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left + width/2,
    mouse.y = event.clientY - rect.top + width/2,
    mouse.three.x = (mouse.x / width);
    mouse.three.y = -(mouse.y / width);
}

function onMouseWheel(event) {
    camera.position.z += event.deltaY * 0.1;
}

function onMouseDown(event){
    //console.log("mouse position: (" + mouse.x + ", "+ mouse.y + ")");
    sendRaycaster(scene, camera);
 }

function onResize(event) {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

function sendRaycaster(scene, camera) {
    camera.updateMatrixWorld();
    raycaster.setFromCamera(new THREE.Vector2(mouse.x/width, 0), camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if(intersects.length > 0){
        intersects[0].object.material = moonRockSelectedMaterial;
    }
}