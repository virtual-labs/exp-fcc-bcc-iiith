import * as THREE from "./three.js";
import { ConvexGeometry } from "./convex.js"
import { ConvexHull } from "./hull.js"

var trueTypeOf = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()

var radius_scale = 1/100;
var atomDetails = {
    Zn: {
    radius: 135,
    color: "#a9a9a9"
    },
    Cl: {
    radius: 100,
    color: "#cfe942"
    },
    Cs: {
    radius: 260,
    color: "#ffd700"
    },
    S: {
    radius: 100,
    color: "#ffff00"
    },
    Na:{
    radius: 180,
    color: "#fcfcfc"
    },
    C:{
    radius: 70,
    color: "#8fce00"
    }
    }

export function addSphere(mouse, atomname, camera, scene) {
    var intersectionPoint = new THREE.Vector3();
    var planeNormal = new THREE.Vector3();
    var plane = new THREE.Plane();
    var raycaster = new THREE.Raycaster();
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    // console.log(atomDetails[atomname]);
    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(atomDetails[atomname].radius * radius_scale, 20, 20),
        new THREE.MeshStandardMaterial({
            color: atomDetails[atomname].color,
            name: "sphere",
            roughness: 5,
        })
    );
    sphereMesh.position.copy(intersectionPoint);
    // sphereMesh.material.emissive.setHex(0xff44ff);
    return sphereMesh;
}

export function addSphereAtCoordinate(AddVec, atomname, atomtype = "default") {
    var atomcolor = atomDetails[atomname].color;
    var atomopacity = 1.0;
    if (atomtype == "dummy") {
        atomcolor = 0x746c70;
        atomopacity = 0.3;
    }
    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(atomDetails[atomname].radius * radius_scale, 20, 20),
        new THREE.MeshStandardMaterial({
            color: atomcolor,
            name: "sphere",
            roughness: 5,
            transparent: true,
            opacity: atomopacity,
        })
    );
    sphereMesh.position.copy(AddVec);
    return sphereMesh;
}

export function CheckHover(mouse, camera, atomList, INTERSECTED) {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(atomList, false);
    var pink = 0xff44ff;
    var blue = 0x00ffff;
    var black = 0x000000;
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) {
                INTERSECTED.material.emissive.setHex(black);
            }

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = blue;
            INTERSECTED.material.emissive.setHex(pink);
        }
        INTERSECTED.material.emissive.setHex(pink);
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(black);
        INTERSECTED = null;
    }
    return INTERSECTED;
}

export function DeleteObject(mouse, camera, scene, atomList, INTERSECTED) {
    INTERSECTED = CheckHover(mouse, camera, atomList, INTERSECTED);
    scene.remove(INTERSECTED);
    // atomList.remove(INTERSECTED);
    const index = atomList.indexOf(INTERSECTED);
    if (index > -1) {
        atomList.splice(index, 1);
    }
}

export function AddLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100, 100, 50);
    light.castShadow = true;
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-100, 100, -50);
    light2.castShadow = true;
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(0, 100, 0);
    light3.castShadow = true;

    return [light, light2, light3];
}

export function RepeatPattern(SelectAtomList, repeatVec) {
    var newAtoms = [];
    for (let i = 0; i < SelectAtomList.length; i++) {
        var curAtom = SelectAtomList[i];
        var newpos = curAtom.position.clone();
        // var translateVec = new THREE.Vector3(1, 1, 1);
        // console.log("SIII");
        // console.log(curAtom);
        newpos.add(repeatVec);
        var sphereMesh = curAtom.clone();
        console.log(sphereMesh);
   
        sphereMesh.position.copy(newpos);
        newAtoms.push(sphereMesh);
    }
    return newAtoms;
}

export function TranslatePattern(SelectAtomList, translateVec, count) {
    var allNewAtoms = [];
    while (--count) {
        var newAtoms = [];
        for (let i = 0; i < SelectAtomList.length; i++) {
            var curAtom = SelectAtomList[i];
            var newpos = curAtom.position.clone();
            // var translateVec = new THREE.Vector3(1, 1, 1);
            translateVec.multiplyScalar(count);
            newpos.add(translateVec);

            var sphereMesh = curAtom.clone();
          
            sphereMesh.position.copy(newpos);
            newAtoms.push(sphereMesh);
            translateVec.multiplyScalar(1 / count);
        }
        for (let i = 0; i < newAtoms.length; i++) {
            allNewAtoms.push(newAtoms[i]);
        }
    }
    return allNewAtoms;
}

export function updateButtonCSS(action) {
    // if (action == "addAtom") {
    //     document.getElementById("AddAtom").style =
    //         "background-color:  #f14668; color: #000000 ";
    //     document.getElementById("SelectAtom").style =
    //         "color:  #f14668; background: transparent; outline: 1px solid  #f14668; border: 0px;padding: 5px 10px;cursor: pointer;";
    // } else if (action == "selectAtom") {
    //     document.getElementById("SelectAtom").style =
    //         "background-color:  #f14668; ; color: #000000 ";
    //     document.getElementById("AddAtom").style =
    //         "color:  #f14668; ;background: transparent; outline: 1px solid  #f14668; ;border: 0px;padding: 5px 10px;cursor: pointer;";
    // } else {
    //     document.getElementById("AddAtom").style =
    //         "color:  #f14668;background: transparent; outline: 1px solid  #f14668; border: 0px;padding: 5px 10px;cursor: pointer;";
    //     document.getElementById("SelectAtom").style =
    //         "color:  #f14668; background: transparent; outline: 1px solid  #f14668; border: 0px;padding: 5px 10px;cursor: pointer;";
    // }
}
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}
export function highlightSelectList(SelectAtomList, atomList) {
    for (let j = 0; j < atomList.length; j++) {
        var atom = atomList[j];
        var pink = 0xff44ff;
        var blue = 0x00ffff;
        var black = 0x000000;
        if (containsObject(atom, SelectAtomList)) {
            var a = atom.material.emissive.getHex();
            // atom.currentHex = blue;
            atom.material.emissive.setHex(pink);
        } else {
            // var a = atom.material.emissive.getHex();
            // atom.currentHex = blue;
            atom.material.emissive.setHex(black);
        }
    }
}

export function moveSelectList(SelectAtomList, moveVector) {
    for (let i = 0; i < SelectAtomList.length; i++) {
        var currpos = SelectAtomList[i].position.clone();
        //if(i==0) console.log(currpos.y);
        currpos.add(moveVector);
        //if(i==0) console.log(currpos.y);
        SelectAtomList[i].position.copy(currpos);
    }
}

export function checkSCP(SelectAtomList) {
    if (SelectAtomList.length != 8) return false;
    for (let i = 0; i < SelectAtomList.length - 1; i++) {
        for (let j = i + 1; j < SelectAtomList.length; j++) {
            var dist = SelectAtomList[i].position.distanceToSquared(
                SelectAtomList[j].position
            );
            if (dist == 4 || dist == 8 || dist == 12) continue;
            else return false;
        }
    }
    return true;
}

export function select_Region(SelectAtomList, atomList) {
    let posarray = [];
    var pos = new THREE.Vector3();
    for(let i=0;i<SelectAtomList.length;i++) {
        pos = SelectAtomList[i].position.clone();
        posarray.push(pos);
    }
    let selectarray = []
    var convexHull = new ConvexHull().setFromPoints(posarray);
    for (let i=0;i<atomList.length;i++) {
        pos = atomList[i].position.clone();
        if(convexHull.containsPoint(pos)) {
            selectarray.push(atomList[i]);
        }
    }
    const geometry = new ConvexGeometry( posarray );
    const material = new THREE.MeshStandardMaterial({
        color: 0xff44ff,
        roughness: 5,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh( geometry, material );
    return {mesh,selectarray};
}