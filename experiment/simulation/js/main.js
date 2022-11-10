// import * as THREE from 'three';
import { OrbitControls } from './orbit.js'
import * as THREE from './three.js'
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
  select_Region,
  changeCurrentLatticePrev,
  changeCurrentLatticeNext,
  createLattice,
} from './utils.js'

var container = document.getElementById('canvas-main')
//  init camera
var camera = new THREE.PerspectiveCamera(
  75, //FOV
  container.clientWidth / container.clientHeight, //aspect ratio
  0.1,
  1000,
)
camera.position.set(50, 50, 50)

// init the renderer and the scene

var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor('#000000')
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// document.body.appendChild(renderer.domElement);
container.appendChild(renderer.domElement)

// console.log(window);
// initialize the axes
var axesHelper = new THREE.AxesHelper(container.clientHeight)
scene.add(axesHelper)

// add light to the  system
const lights = AddLight()
for (let i = 0; i < lights.length; i++) {
  scene.add(lights[i])
}
// init the orbit controls
var controls = new OrbitControls(camera, renderer.domElement)
controls.update()
controls.autoRotate = true
controls.autoRotateSpeed = 0
controls.enablePan = false
controls.enableDamping = true

// to check the current object which keyboard points to
let INTERSECTED

function getMouseCoords(event) {
  var mouse = new THREE.Vector2()
  mouse.x =
    ((event.clientX - renderer.domElement.offsetLeft) /
      renderer.domElement.clientWidth) *
      2 -
    1
  mouse.y =
    -(
      (event.clientY - renderer.domElement.offsetTop) /
      renderer.domElement.clientHeight
    ) *
      2 +
    1
  // mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
  // mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;
  // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // console.log(mouse);
  return mouse
}
var mouse = new THREE.Vector2()
//  detect mouse click
let drag = false
document.addEventListener('mousedown', function (event) {
  drag = false
  mouse = getMouseCoords(event)
})
document.addEventListener('mousemove', function (event) {
  drag = true
  mouse = getMouseCoords(event)
})

document.addEventListener('keydown', function (event) {
  var keyCode = event.key
  if (keyCode == 'd') {
    DeleteObject(mouse, camera, scene, atomList, INTERSECTED)
  }
})

let action = ''

// create a list of atoms in scene
var atomList = []

var SelectAtomList = []
var BoundaryAtomList = []
var HullMeshList = []
var curr_latticeID = 0
// var currentatom = document.getElementById("atomtype");
// var atomtype = currentatom.options[currentatom.selectedIndex].text;

// select region enclosed between the atoms
const selectRegion = document.getElementById('SelectRegion')
selectRegion.addEventListener('click', function () {
  let vals = select_Region(SelectAtomList, atomList)
  let hullmesh = vals.mesh
  let arr = vals.selectarray
  for (let i = 0; i < arr.length; i++) {
    SelectAtomList.push(arr[i])
  }
  console.log(hullmesh)
  scene.add(hullmesh)
  HullMeshList.push(hullmesh)
})

// respond to click addAtom
// const addSphereButton = document.getElementById("AddAtom");
// addSphereButton.addEventListener("click", function () {
//     console.log("adding atom mode");
//     if (action != "addAtom") {
//         action = "addAtom";
//     } else {
//         action = "";
//     }
// });

// respond to select a bunch of atoms
const addSelectList = document.getElementById('SelectAtom')
addSelectList.addEventListener('click', function () {
  console.log('Selecting atom mode')
  if (action != 'selectAtom') {
    action = 'selectAtom'
  } else {
    action = ''
    SelectAtomList = []
  }
})
let currentAtomList = createLattice(0)
for (let i = 0; i < currentAtomList.length; i++) {
  console.log(currentAtomList[i])
  scene.add(currentAtomList[i])
  atomList.push(currentAtomList[i])
}
// respond to prev/next lattice buttons
const PrevButton = document.getElementById('prev-btn')
PrevButton.addEventListener('click', function () {
  console.log('Prev Button clicked')
  let latticeID = changeCurrentLatticePrev()
  curr_latticeID = latticeID
  for (let i = 0; i < currentAtomList.length; i++) {
    scene.remove(currentAtomList[i])
  }
  for (let i = 0; i < HullMeshList.length; i++) {
    scene.remove(HullMeshList[i])
  }
  atomList = []
  currentAtomList = createLattice(latticeID)

  for (let i = 0; i < currentAtomList.length; i++) {
    console.log(currentAtomList[i])
    scene.add(currentAtomList[i])
    atomList.push(currentAtomList[i])
  }
})
const NextButton = document.getElementById('next-btn')
NextButton.addEventListener('click', function () {
  console.log('Next Button clicked')
  let latticeID = changeCurrentLatticeNext()
  curr_latticeID = latticeID
  for (let i = 0; i < currentAtomList.length; i++) {
    scene.remove(currentAtomList[i])
  }
  for (let i = 0; i < HullMeshList.length; i++) {
    scene.remove(HullMeshList[i])
  }
  currentAtomList = createLattice(latticeID)
  atomList = []
  for (let i = 0; i < currentAtomList.length; i++) {
    console.log(currentAtomList[i])
    scene.add(currentAtomList[i])
    atomList.push(currentAtomList[i])
  }
})

// respond to check selected lattice
const CheckLattice = document.getElementById('CheckLattice')
CheckLattice.addEventListener('click', function () {
  console.log('Check Lattice Clicked')
  curr_latticeID = LatticeList.indexOf(currentLattice);
  if(curr_latticeID == 0) {
    var vectorList = []
    var dist = []
    if(SelectAtomList.length != 4) {
      console.log("Please select correct number of atoms")
      document.getElementById("output").innerHTML = "<span style='color: red;'>Please select correct number of atoms</span>";
      SelectAtomList = []
    }
    for (let i = 0; i < 2; i++) {
      var atom1 = SelectAtomList[(2*i)]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[(2*i) + 1]
      var pos2 = atom2.position.clone()
      var neg = pos2.clone().multiplyScalar(-1);
      var res = pos1.clone().add(neg);
      var mag = res.length();
      dist.push(mag);
      var unit = res.clone().normalize();
      vectorList.push(unit);
    }
    var cos_ang = vectorList[0].dot(vectorList[1]) / (vectorList[0].length() * vectorList[1].length())
    if(cos_ang == 0 && dist[0] == 2 && dist[1] == 2) {
      console.log('Correct choice')
      document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
    }
    else {
      console.log('Try again')
      document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
      SelectAtomList = []
    }
  } else if (curr_latticeID == 1) {
    var vectorList = []
    var dist = []
    if(SelectAtomList.length != 4) {
      console.log("Please select correct number of atoms")
      document.getElementById("output").innerHTML = "<span style='color: red;'>Please select correct number of atoms</span>";
      SelectAtomList = []
    }
    for (let i = 0; i < 2; i++) {
      var atom1 = SelectAtomList[(2*i)]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[(2*i) + 1]
      var pos2 = atom2.position.clone()
      var neg = pos2.clone().multiplyScalar(-1);
      var res = pos1.clone().add(neg);
      var mag = res.length();
      dist.push(mag);
      var unit = res.clone().normalize();
      vectorList.push(unit);
    }
    var cos_ang = vectorList[0].dot(vectorList[1]) / (vectorList[0].length() * vectorList[1].length())
    var check = 0;
    if(dist[0] == 5 && dist[1] == 2 || dist[0] == 2 && dist[1] == 5) {
      check = 1;
    }
    if(cos_ang == 0 && check == 1) {
      console.log('Correct choice')
      document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
    }
    else {
      console.log('Try again')
      document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
      SelectAtomList = []
    }
  } else if (curr_latticeID == 2) {
    var vectorList = []
    var dist = []
    if(SelectAtomList.length != 6) {
      console.log("Please select correct number of atoms")
      document.getElementById("output").innerHTML = "<span style='color: red;'>Please select correct number of atoms</span>";
      SelectAtomList = []
    }
    for (let i = 0; i < 3; i++) {
      var atom1 = SelectAtomList[(2*i)]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[(2*i) + 1]
      var pos2 = atom2.position.clone()
      var neg = pos2.clone().multiplyScalar(-1);
      var res = pos1.clone().add(neg);
      var mag = res.length();
      dist.push(mag);
      var unit = res.clone().normalize();
      vectorList.push(unit);
    }
    var cos_ang1 = vectorList[0].dot(vectorList[1]) / (vectorList[0].length() * vectorList[1].length())
    var cos_ang2 = vectorList[0].dot(vectorList[2]) / (vectorList[0].length() * vectorList[2].length())
    var cos_ang3 = vectorList[2].dot(vectorList[1]) / (vectorList[2].length() * vectorList[1].length())    
    if(cos_ang1 == 0 && cos_ang2 == 0 && cos_ang3 == 0 && dist[0] == 2 && dist[1] == 2 && dist[2] == 2) {
      console.log('Correct choice')
      document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
    }
    else {
      console.log('Try again')
      document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
      SelectAtomList = []
    }

  } else if (curr_latticeID == 3) {
    var vectorList = []
    var dist = []
    if(SelectAtomList.length != 6) {
      console.log("Please select correct number of atoms")
      document.getElementById("output").innerHTML = "<span style='color: red;'>Please select correct number of atoms</span>";
      SelectAtomList = []
    }
    for (let i = 0; i < 3; i++) {
      var atom1 = SelectAtomList[(2*i)]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[(2*i) + 1]
      var pos2 = atom2.position.clone()
      var neg = pos2.clone().multiplyScalar(-1);
      var res = pos1.clone().add(neg);
      var mag = res.length();
      dist.push(mag);
      var unit = res.clone().normalize();
      vectorList.push(unit);
    }
    var cos_ang1 = vectorList[0].dot(vectorList[1]) / (vectorList[0].length() * vectorList[1].length())
    var cos_ang2 = vectorList[0].dot(vectorList[2]) / (vectorList[0].length() * vectorList[2].length())
    var cos_ang3 = vectorList[2].dot(vectorList[1]) / (vectorList[2].length() * vectorList[1].length())
    if(cos_ang1 == 0 && Math.abs(cos_ang2) == 1/Math.sqrt(3) && Math.abs(cos_ang3) == 1/Math.sqrt(3)) {
      if(dist[0] == 4 && dist[1] == 4 && dist[2] == 2*Math.sqrt(3)) {
        console.log("correct choice")
        document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
      }
      else {
        console.log("try again")
        document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
        SelectAtomList = []
      }
    } else if (cos_ang2 == 0 && Math.abs(cos_ang1) == 1/Math.sqrt(3) && Math.abs(cos_ang3) == 1/Math.sqrt(3) ) {
      if(dist[0] == 4 && dist[2] == 4 && dist[1] == 2*Math.sqrt(3)) {
        console.log("correct choice")
        document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
      }
      else {
        console.log("try again")
        document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
        SelectAtomList = []
      }
    } else if (cos_ang3 == 0 && Math.abs(cos_ang2) == 1/Math.sqrt(3) && Math.abs(cos_ang1) == 1/Math.sqrt(3)) {
      if(dist[2] == 4 && dist[1] == 4 && dist[0] == 2*Math.sqrt(3)) {
        console.log("correct choice")
        document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
      }
      else {
        console.log("try again")
        document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
        SelectAtomList = []
      }
    } else {
      console.log("try again")
      document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
      SelectAtomList = []
    }  
  } else if (curr_latticeID == 4) {
    var vectorList = []
    var dist = []
    if(SelectAtomList.length != 6) {
      console.log("Please select correct number of atoms")
      document.getElementById("output").innerHTML = "<span style='color: red;'>Please select correct number of atoms</span>";
      SelectAtomList = []
    }
    for (let i = 0; i < 3; i++) {
      var atom1 = SelectAtomList[(2*i)]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[(2*i) + 1]
      var pos2 = atom2.position.clone()
      var neg = pos2.clone().multiplyScalar(-1);
      var res = pos1.clone().add(neg);
      var mag = res.length();
      dist.push(mag);
      var unit = res.clone().normalize();
      vectorList.push(unit);
    }
    var cos_ang1 = vectorList[0].dot(vectorList[1]) / (vectorList[0].length() * vectorList[1].length())
    var cos_ang2 = vectorList[0].dot(vectorList[2]) / (vectorList[0].length() * vectorList[2].length())
    var cos_ang3 = vectorList[2].dot(vectorList[1]) / (vectorList[2].length() * vectorList[1].length())
    cos_ang1 = Math.round(cos_ang1 / 0.5) * 0.5;
    cos_ang2 = Math.round(cos_ang2 / 0.5) * 0.5;
    cos_ang3 = Math.round(cos_ang3 / 0.5) * 0.5;
    if(Math.abs(cos_ang1) == 0.5 && Math.abs(cos_ang2) == 0.5 && Math.abs(cos_ang3) == 0.5) {
      if(dist[0] == 3/Math.sqrt(2) && dist[1] == 3/Math.sqrt(2) && dist[2] == 3/Math.sqrt(2)) {
        console.log("correct choice")
        document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
      }
      else {
        console.log("try again")
        document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
        SelectAtomList = []
      }
    } else if (Math.abs(cos_ang2) == 0.5 && Math.abs(cos_ang1) == 0.5 && Math.abs(cos_ang3) == 0.5) {
      if(dist[0] == 3/Math.sqrt(2) && dist[2] == 3/Math.sqrt(2) && dist[1] == 3/Math.sqrt(2)) {
        console.log("correct choice")
        document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
      }
      else {
        console.log("try again")
        document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
        SelectAtomList = [];
      }
    } else if (Math.abs(cos_ang3) == 0 && Math.abs(cos_ang2) == 0.5 && Math.abs(cos_ang1) == 0.5) {
      if(dist[2] == 3/Math.sqrt(2) && dist[1] == 3/Math.sqrt(2) && dist[0] == 3/Math.sqrt(2)) {
        console.log("correct choice")
        document.getElementById("output").innerHTML = "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>";
      }
      else {
        console.log("try again")
        document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
        SelectAtomList = []
      }
    } else {
        console.log("try again")
        document.getElementById("output").innerHTML = "<span style='color: red;'>Wrong selection, please try again</span>"
        SelectAtomList = []
    }
  } else if (curr_latticeID == 5) {
    if(SelectAtomList.length != 4) {
      console.log("Please select correct number of atoms")
      document.getElementById("output").innerHTML = "<span style='color: red;'>Please select correct number of atoms</span>";
      SelectAtomList = []
    }
    else{
      document.getElementById("output").innerHTML = "<span style='color: yellow;'>The selected atoms do not create primitive vectors for this lattice!</span>";
    }
  }
})

// respond to select all atoms
// const addSelectAll = document.getElementById("SelectAll");
// addSelectAll.addEventListener("click", function () {
//     if (action != "selectAll") {
//         action = "selectAll";
//     } else {
//         action = "";
//         SelectAtomList = [];
//     }
// });

// respond to check for SCP
// const addCheckSC = document.getElementById("CheckSC");
// addCheckSC.addEventListener("click", function () {
//     console.log("checking SCP packing");
//     var checkresult = checkSCP(SelectAtomList);
//     alert(checkresult);
// });

// respond to add atom by coordinate
// const formAdd = document.getElementById("addatom");
// formAdd.addEventListener("submit", function () {
//     console.log("adding atom");
//     var vec = formAdd.elements;
//     var AddVec = new THREE.Vector3(
//         parseFloat(vec[0].value),
//         parseFloat(vec[1].value),
//         parseFloat(vec[2].value)
//     );
//     var addedatom = addSphereAtCoordinate(AddVec, atomtype);
//     console.log(AddVec, addedatom);
//     scene.add(addedatom);
//     atomList.push(addedatom);
// });

// respond to add dummy atom by coordinate
// const formAdddummy = document.getElementById("adddummyatom");
// formAdddummy.addEventListener("submit", function () {
//     console.log("adding dummy atom");
//     var vec = formAdddummy.elements;
//     var AddVec = new THREE.Vector3(
//         parseFloat(vec[0].value),
//         parseFloat(vec[1].value),
//         parseFloat(vec[2].value)
//     );
//     var addedatom = addSphereAtCoordinate(AddVec, "dummy");
//     console.log(AddVec, addedatom);
//     scene.add(addedatom);
//     atomList.push(addedatom);
// });

// respond to repeat
// const formRepeat = document.getElementById("repeat");
// formRepeat.addEventListener("submit", function () {
//     console.log("repeating");
//     var vec = formRepeat.elements;
//     var repeatVec = new THREE.Vector3(
//         parseFloat(vec[0].value),
//         parseFloat(vec[1].value),
//         parseFloat(vec[2].value)
//     );
//     var newAtoms = RepeatPattern(SelectAtomList, repeatVec);
//     console.log(repeatVec, newAtoms);
//     for (let i = 0; i < newAtoms.length; i++) {
//         scene.add(newAtoms[i]);
//         atomList.push(newAtoms[i]);
//     }
//     SelectAtomList = newAtoms;
// });

// respond to translate
// const formTranslate = document.getElementById("translate");
// formTranslate.addEventListener("submit", function () {
//     console.log("translating");
//     var vec = formTranslate.elements;
//     var translateVec = new THREE.Vector3(
//         parseFloat(vec[0].value),
//         parseFloat(vec[1].value),
//         parseFloat(vec[2].value)
//     );
//     var count = parseFloat(vec[3].value);
//     var newAtoms = TranslatePattern(SelectAtomList, translateVec, count);
//     console.log(translateVec, newAtoms);
//     for (let i = 0; i < newAtoms.length; i++) {
//         scene.add(newAtoms[i]);
//         atomList.push(newAtoms[i]);
//     }
//     SelectAtomList = newAtoms;
// });

// respond to move
// const formMove = document.getElementById("move");
// formMove.addEventListener("submit", function () {
//     console.log("moving");
//     var vec = formMove.elements;
//     var moveVector = new THREE.Vector3(
//         parseFloat(vec[0].value),
//         parseFloat(vec[1].value),
//         parseFloat(vec[2].value)
//     );
//     moveSelectList(SelectAtomList, moveVector);
//     console.log(moveVector, SelectAtomList);
// });

// const translateList = document.getElementById("TranslatePattern");
// translateList.addEventListener("click", function () {});

// make the window responsive
// window.addEventListener("resize", () => {
//     renderer.setSize(container.clientWidth, container.clientHeight);
//     camera.aspect = container.clientWidth / container.clientHeight;
//     camera.updateProjectionMatrix();
// });

document.addEventListener('mouseup', function (event) {
  if (drag == false) {
    // if the action is add atom
    if (action == 'selectAtom') {
      INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED)
      if (INTERSECTED) {
        SelectAtomList.push(INTERSECTED)
      }
    }
  }
})

// render the scene and animate
var render = function () {
  highlightSelectList(SelectAtomList, atomList)
  // updateButtonCSS(action);
  INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED)
  requestAnimationFrame(render)
  controls.update()
  renderer.render(scene, camera)
}

render()

