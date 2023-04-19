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

// init container
var container = document.getElementById('canvas-main')

// init the renderer and the scene
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor('#171717')
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
container.appendChild(renderer.domElement)

// init perspective camera
var camera_distance = 50
var perspective_camera = new THREE.PerspectiveCamera(
  camera_distance, //FOV
  container.clientWidth / container.clientHeight, //aspect ratio
  0.1,
  1000,
)
var orthographic_camera = new THREE.OrthographicCamera(
  camera_distance / -2,
  camera_distance / 2,
  camera_distance / 2,
  camera_distance / -2,
  1,
  1000,
)
var camera = perspective_camera
var cam_pos = 0
// init the orbit controls
var controls = new OrbitControls(camera, renderer.domElement)
controls.update()
controls.autoRotate = true
controls.autoRotateSpeed = 0
controls.enablePan = false
controls.enableDamping = true
camera.position.set(25, 25, 25)

// initialize the axes
var axesHelper = new THREE.AxesHelper(container.clientHeight)
scene.add(axesHelper)

// add light to the  system
const lights = AddLight()
for (let i = 0; i < lights.length; i++) {
  scene.add(lights[i])
}

let Checked = document.getElementById('ToggleCamera')
Checked.addEventListener('click', function () {
  console.log('Clicked camera toggle')
  if (Checked.checked) {
    camera = orthographic_camera
    controls = new OrbitControls(camera, renderer.domElement)
    cam_pos = 1
  } else {
    camera = perspective_camera
    controls = new OrbitControls(camera, renderer.domElement)
    cam_pos = 0
  }
  controls.update()
  controls.autoRotate = true
  controls.autoRotateSpeed = 0
  controls.enablePan = false
  controls.enableDamping = true
  camera.position.set(30, 30, 30)
})

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
var VectorList = []
var SelectAtomList = []
var BoundaryAtomList = []
var HullMeshList = []
var curr_latticeID = 0

// respond to select a bunch of atoms
let toggleselectbutton = document.getElementById('ToggleSelect')
toggleselectbutton.addEventListener('click', function () {
  if (action != 'selectAtom') {
    action = 'selectAtom'
  } else {
    action = ''
    // SelectAtomList = []
  }
})

const Slider = document.getElementById('radiiSlider')
const sliderval = document.getElementById('radiisliderval')
sliderval.innerHTML = Slider.valueAsNumber
var currentradii = Slider.valueAsNumber

Slider.oninput = function () {
  currentradii = Slider.valueAsNumber
  sliderval.innerHTML = Slider.valueAsNumber
  var newatomlist = []

  for (let i = 0; i < atomList.length; i++) {
    var pos = atomList[i].position
    let atom = addSphereAtCoordinate(pos, 'Y')
    scene.remove(atomList[i])
    scene.add(atom)
    newatomlist.push(atom)
  }
  atomList = newatomlist
  var newSelectAtomList = []
  for (let i = 0; i < SelectAtomList.length; i++) {
    var pos1 = SelectAtomList[i].position
    for (let j = 0; j < atomList.length; j++) {
      var pos2 = atomList[j].position
      if (JSON.stringify(pos1) === JSON.stringify(pos2)) {
        newSelectAtomList.push(atomList[j])
      }
    }
  }
  SelectAtomList = newSelectAtomList
}

const LatticeList = [
  'Square Lattice',
  'Rectangular Lattice',
  'Cubic Lattice',
  'BCC Lattice',
  'FCC Lattice',
  'Honeycomb Lattice',
]

var currentLatticeElement = document.getElementById('LatticeList')
var currentLattice =
  currentLatticeElement.options[currentLatticeElement.selectedIndex].text

let currentAtomList = createLattice(LatticeList.indexOf(currentLattice))
for (let i = 0; i < currentAtomList.length; i++) {
  scene.add(currentAtomList[i])
  atomList.push(currentAtomList[i])
}
currentLatticeElement.addEventListener('click', function () {
  currentLattice =
    currentLatticeElement.options[currentLatticeElement.selectedIndex].text
  for (let i = 0; i < currentAtomList.length; i++) {
    scene.remove(atomList[i])
  }
  atomList = []
  for (let i = 0; i < HullMeshList.length; i++) {
    scene.remove(HullMeshList[i])
  }
  HullMeshList = []

  currentAtomList = createLattice(LatticeList.indexOf(currentLattice))

  for (let i = 0; i < currentAtomList.length; i++) {
    scene.add(currentAtomList[i])
    atomList.push(currentAtomList[i])
  }
})

const ClearLattice = document.getElementById('ClearSelection')
ClearLattice.addEventListener('click', function () {
  console.log('Clear selection clicked')
  SelectAtomList = []
  for (let i = 0; i < VectorList.length; i++) {
    scene.remove(VectorList[i])
  }
  VectorList = []
  //add vector removal here
})

// let CameraMode = document.getElementById('ToggleCamera')
// CameraMode.addEventListener('click', function() {
//   console.log('Clicked camera toggle')
//   if(CameraMode.checked) {
//     console.log("yes")
//   }
// })
// respond to check selected lattice
const CheckLattice = document.getElementById('CheckLattice')
CheckLattice.addEventListener('click', function () {
  console.log('Check Lattice Clicked')
  curr_latticeID = LatticeList.indexOf(currentLattice)

  if (curr_latticeID == 0) {
    var vectorList = []
    if (SelectAtomList.length != 4) {
      console.log('Please select correct number of atoms')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Please select correct number of atoms</span>"
    }
    for (let i = 0; i < 2; i++) {
      var atom1 = SelectAtomList[2 * i]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[2 * i + 1]
      var pos2 = atom2.position.clone()
      var neg = pos1.clone().multiplyScalar(-1)
      var res = pos2.clone().add(neg)
      vectorList.push(res)
    }
    console.log(vectorList)
    const latticeConstant = 2;
    const determinant = vectorList[0].x * vectorList[1].z - vectorList[0].z * vectorList[1].x;
    const latticeConstantSq = latticeConstant * latticeConstant;

    //const crossProduct = new THREE.Vector3().crossVectors(vectorList[0], vectorList[1]);
    if(Math.abs(Math.abs(determinant) - latticeConstantSq) < Number.EPSILON) {
      console.log('Correct choice')
      document.getElementById('output').innerHTML =
        "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>"
    } else {
      console.log('Try again')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Wrong selection, please try again</span>"
    }

  } else if (curr_latticeID == 1) {
    var vectorList = []
    if (SelectAtomList.length != 4) {
      console.log('Please select correct number of atoms')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Please select correct number of atoms</span>"
    }
    for (let i = 0; i < 2; i++) {
      var atom1 = SelectAtomList[2 * i]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[2 * i + 1]
      var pos2 = atom2.position.clone()
      var neg = pos1.clone().multiplyScalar(-1)
      var res = pos2.clone().add(neg)
      vectorList.push(res)
    }
    //console.log(vectorList)
    const determinant = vectorList[0].x * vectorList[1].z - vectorList[0].z * vectorList[1].x;
    const latticeConstantSq = 10
    if(Math.abs(Math.abs(determinant) - latticeConstantSq) < Number.EPSILON) {
      console.log('Correct choice')
      document.getElementById('output').innerHTML =
        "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>"
    } else {
      console.log('Try again')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Wrong selection, please try again</span>"
    }
  } else if (curr_latticeID == 2) {
    var vectorList = []
    var dist = []
    if (SelectAtomList.length != 6) {
      console.log('Please select correct number of atoms')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Please select correct number of atoms</span>"
    }
    for (let i = 0; i < 3; i++) {
      var atom1 = SelectAtomList[2 * i]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[2 * i + 1]
      var pos2 = atom2.position.clone()
      var neg = pos1.clone().multiplyScalar(-1)
      var res = pos2.clone().add(neg)
      vectorList.push(res)
    }
    const determinant = vectorList[0].dot(vectorList[1].cross(vectorList[2]));
    const latticeConstantSq = 8
    if(Math.abs(Math.abs(determinant) - latticeConstantSq) < Number.EPSILON) {
      console.log('Correct choice')
      document.getElementById('output').innerHTML =
        "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>"
    } else {
      console.log('Try again')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Wrong selection, please try again</span>"
    }
  } else if (curr_latticeID == 3) {
    var vectorList = []
    var dist = []
    if (SelectAtomList.length != 6) {
      console.log('Please select correct number of atoms')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Please select correct number of atoms</span>"
    }
    for (let i = 0; i < 3; i++) {
      var atom1 = SelectAtomList[2 * i]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[2 * i + 1]
      var pos2 = atom2.position.clone()
      var neg = pos2.clone().multiplyScalar(-1)
      var res = pos1.clone().add(neg)
      var mag = res.length()
      dist.push(mag)
      var unit = res.clone().normalize()
      vectorList.push(unit)
    }
    const latticeConstant = 4
    const V = Math.abs(vectorList[0].dot(vectorList[1].clone().cross(vectorList[2])))
    if(Math.abs(V - Math.pow(latticeConstant, 3) / (2 * Math.sqrt(2))) < Number.EPSILON) {
      console.log('Correct choice')
      document.getElementById('output').innerHTML =
        "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>"
    } else {
      console.log('Try again')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Wrong selection, please try again</span>"
    }
  } else if (curr_latticeID == 4) {
    var vectorList = []
    var dist = []
    if (SelectAtomList.length != 6) {
      console.log('Please select correct number of atoms')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Please select correct number of atoms</span>"
    }
    for (let i = 0; i < 3; i++) {
      var atom1 = SelectAtomList[2 * i]
      var pos1 = atom1.position.clone()
      var atom2 = SelectAtomList[2 * i + 1]
      var pos2 = atom2.position.clone()
      var neg = pos1.clone().multiplyScalar(-1)
      var res = pos2.clone().add(neg)
      vectorList.push(res)
    }
    //console.log(vectorList)
    const latticeConstant = 3
    const V = Math.abs(vectorList[0].dot(vectorList[1].clone().cross(vectorList[2])))
    if(Math.abs(V - Math.pow(latticeConstant, 3) / 4) < Number.EPSILON) {
      console.log('Correct choice')
      document.getElementById('output').innerHTML =
        "<span style='color: green;'>Correct choice of atoms! Please proceed to the next lattice</span>"
    } else {
      console.log('Try again')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Wrong selection, please try again</span>"
    }
  } else if (curr_latticeID == 5) {
    if (SelectAtomList.length != 4) {
      console.log('Please select correct number of atoms')
      document.getElementById('output').innerHTML =
        "<span style='color: red;'>Please select correct number of atoms</span>"
      SelectAtomList = []
    } else {
      document.getElementById('output').innerHTML =
        "<span style='color: yellow;'>The selected atoms do not create primitive vectors for this lattice!</span>"
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
  var pressType = event.button // 2 for right click, 0 for left clickl
  if (drag == false) {
    // if the action is add atom
    if (action == 'selectAtom') {
      INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED)
      //console.log(INTERSECTED)
      if (SelectAtomList.includes(INTERSECTED) && pressType == 2) {
        var ind = SelectAtomList.indexOf(INTERSECTED)
        if (ind > -1 && ind == SelectAtomList.length - 1 && ind % 2 == 0) {
          SelectAtomList.splice(ind, 1)
        } else if (ind > -1 && ind % 2 == 1) {
          var target_ind = (ind - 1) / 2
          var arrow_to_remove = VectorList[target_ind]
          scene.remove(arrow_to_remove)
          VectorList.splice(target_ind, 1)
          SelectAtomList.splice(ind, 1)
        } else if (ind > -1 && ind % 2 == 0) {
          console.log('here')
          var target_ind = ind / 2
          var arrow_to_remove = VectorList[target_ind]
          scene.remove(arrow_to_remove)
          VectorList.splice(target_ind, 1)
          SelectAtomList.splice(ind, 1)
        }
      } else if (INTERSECTED && pressType == 0) {
        SelectAtomList.push(INTERSECTED)
        if (SelectAtomList.length % 2 == 0) {
          console.log('yes')
          var tail = SelectAtomList[SelectAtomList.length - 2]
          var head = SelectAtomList[SelectAtomList.length - 1]
          var tail_pos = tail.position.clone()
          var head_pos = head.position.clone()
          console.log(tail_pos, head_pos)
          var dir = new THREE.Vector3()
          dir.subVectors(head_pos, tail_pos).normalize()
          const arrow = new THREE.ArrowHelper(
            dir,
            tail_pos,
            head_pos.distanceTo(tail_pos),
            0xffffff,
            0.3 * head_pos.distanceTo(tail_pos),
            0.2 * head_pos.distanceTo(tail_pos),
          )
          VectorList.push(arrow)
          scene.add(arrow)
        }
      }
    }
  }
})
//delete atom
document.addEventListener('keydown', function (event) {
  var keyCode = event.key
  if (keyCode == 'd') {
    // DeleteObject(mouse, camera, scene, atomList, SelectAtomList, INTERSECTED)
    INTERSECTED = CheckHover(mouse, camera, atomList)
    if (INTERSECTED) {
      var index = atomList.indexOf(INTERSECTED)
      if (index > -1) {
        atomList.splice(index, 1)
      }
      var index = SelectAtomList.indexOf(INTERSECTED)
      if (index > -1) {
        SelectAtomList.splice(index, 1)
      }
      scene.remove(INTERSECTED)
    }
  }
})
// render the scene and animate
var render = function () {
  highlightSelectList(SelectAtomList, atomList)
  // updateButtonCSS(action);

  //   currentLatticeElement = document.getElementById('LatticeList')
  //   currentLattice =
  //     currentLatticeElement.options[currentLatticeElement.selectedIndex].text

  //   console.log(currentLattice)
  INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED)
  requestAnimationFrame(render)
  controls.update()
  renderer.render(scene, camera)
}

render()
