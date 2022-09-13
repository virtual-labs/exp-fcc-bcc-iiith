// import * as THREE from 'three';
import { OrbitControls } from "threeOC";
import {
    AddLight,
    addSphere,
    addSphereAtCoordinate,
    CheckHover,
    DeleteObject,
    RepeatPattern,
    TranslatePattern,
    updateButtonCSS,
    highlightSelectList,
    moveSelectList,
    checkSCP,
} from "./utils.js";

// import { RectAreaLightHelper } from 'threeRectAreaLightHelper';
// import { RectAreaLightUniformsLib } from 'threeRectAreaLightUniformsLib';
//  init camera
var camera = new THREE.PerspectiveCamera(
    75, //FOV
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1,
    1000
);
camera.position.set(10, 10, 20);

// init the renderer and the scene
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// initialize the axes
var axesHelper = new THREE.AxesHelper(window.innerHeight);
scene.add(axesHelper);

// add light to the  system
const lights = AddLight();
for (let i = 0; i < lights.length; i++) {
    scene.add(lights[i]);
}
// init the orbit controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.update();
controls.autoRotate = true;
controls.autoRotateSpeed = 0;
controls.enablePan = false;
controls.enableDamping = true;

// to check the current object which keyboard points to
let INTERSECTED;

function getMouseCoords(event) {
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return mouse;
}
var mouse = new THREE.Vector2();
//  detect mouse click
let drag = false;
document.addEventListener("mousedown", function (event) {
    drag = false;
    mouse = getMouseCoords(event);
});
document.addEventListener("mousemove", function (event) {
    drag = true;
    mouse = getMouseCoords(event);
});

document.addEventListener("keydown", function (event) {
    var keyCode = event.key;
    if (keyCode == "d") {
        DeleteObject(mouse, camera, scene, atomList, INTERSECTED);
    }
});

let action = "";

// create a list of atoms in scene
var atomList = [];

var SelectAtomList = [];
// listen to the mouse up
document.addEventListener("mouseup", function (event) {
    if (drag == false) {
        // if the action is add atom
        if (action == "addAtom") {
            var newSphere = addSphere(mouse, camera, scene);
            scene.add(newSphere);
            atomList.push(newSphere);
        }
        else if (action == "selectAtom") {
            INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED);
            if (INTERSECTED) {
                SelectAtomList.push(INTERSECTED);
            }
        }
        else if(action == "selectAll"){
            SelectAtomList = [];
            for (let i = 0 ; i < atomList.length; i++){
                SelectAtomList.push(atomList[i])
            }
        }
    
    }
});

// respond to click addAtom
const addSphereButton = document.getElementById("AddAtom");
addSphereButton.addEventListener("click", function () {
    console.log("adding atom mode");
    if (action != "addAtom") {
        action = "addAtom";
    } else {
        action = "";
    }
});

// respond to select a bunch of atoms
const addSelectList = document.getElementById("SelectAtom");
addSelectList.addEventListener("click", function () {
    console.log("selecting atom mode");
    if (action != "selectAtom") {
        action = "selectAtom";
    } else {
        action = "";
        SelectAtomList = [];
    }
});

// respond to select all atoms
const addSelectAll = document.getElementById("SelectAll");
addSelectAll.addEventListener("click", function () {
    if (action != "selectAll") {
        action = "selectAll";
    } else {
        action = "";
        SelectAtomList = [];
    }
});

// respond to check for SCP

const addCheckSC = document.getElementById("CheckSC");
addCheckSC.addEventListener("click", function () {
    console.log("checking SCP packing");
    var checkresult = checkSCP(SelectAtomList);
    alert(checkresult);
});

// respond to add atom by coordinate

const formAdd = document.getElementById("addatom");
formAdd.addEventListener("submit", function () {
    console.log("adding atom");
    var vec = formAdd.elements;
    var AddVec = new THREE.Vector3(
        parseFloat(vec[0].value),
        parseFloat(vec[1].value),
        parseFloat(vec[2].value)
    );
    var addedatom = addSphereAtCoordinate(AddVec);
    console.log(AddVec,addedatom);
    scene.add(addedatom);
    atomList.push(addedatom);
});

// respond to repeat
const formRepeat = document.getElementById("repeat");
formRepeat.addEventListener("submit", function () {
    console.log("repeating");
    var vec = formRepeat.elements;
    var repeatVec = new THREE.Vector3(
        parseFloat(vec[0].value),
        parseFloat(vec[1].value),
        parseFloat(vec[2].value)
    );
    var newAtoms = RepeatPattern(SelectAtomList, repeatVec);
    console.log(repeatVec, newAtoms);
    for (let i = 0; i < newAtoms.length; i++) {
        scene.add(newAtoms[i]);
        atomList.push(newAtoms[i]);
    }
    SelectAtomList = newAtoms;
});

// respond to translate
const formTranslate = document.getElementById("translate");
formTranslate.addEventListener("submit", function () {
    console.log("translating");
    var vec = formTranslate.elements;
    var translateVec = new THREE.Vector3(
        parseFloat(vec[0].value),
        parseFloat(vec[1].value),
        parseFloat(vec[2].value)
    );
    var count = parseFloat(vec[3].value);
    var newAtoms = TranslatePattern(SelectAtomList, translateVec, count);
    console.log(translateVec, newAtoms);
    for (let i = 0; i < newAtoms.length; i++) {
        scene.add(newAtoms[i]);
        atomList.push(newAtoms[i]);
    }
    SelectAtomList = newAtoms;
});

// respond to move
const formMove = document.getElementById("move");
formMove.addEventListener("submit", function () {
    console.log("moving");
    var vec = formMove.elements;
    var moveVector = new THREE.Vector3(
        parseFloat(vec[0].value),
        parseFloat(vec[1].value),
        parseFloat(vec[2].value)
    );
    moveSelectList(SelectAtomList, moveVector);
    console.log(moveVector, SelectAtomList);
});
// const translateList = document.getElementById("TranslatePattern");
// translateList.addEventListener("click", function () {});

// make the window responsive
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// render the scene and animate
var render = function () {
    console.log(action,atomList, SelectAtomList, scene.children);
    highlightSelectList(SelectAtomList, atomList);
    updateButtonCSS(action);
    INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED);
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};

render();
