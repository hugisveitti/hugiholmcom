import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loadIsland = (scene) => {
  const loader = new GLTFLoader();
  const fn = "island/models/island.glb";
  const path =
    window.location.hostname === "localhost" ? "http://localhost:80/" + fn : fn;
  loader.load(path, (gltf) => {
    scene.add(gltf.scene);
    console.log("scene", gltf.scene);
    for (let item of gltf.scene.children) {
      console.log(item);
      if (item.type === "Mesh") {
        // scene.add(item);
        item.castShadow = true;
        item.receiveShadow = true;
        item.material = item.material.clone();
      }
    }
  });
};

const addLights = (scene) => {
  const pLigth = new THREE.PointLight(0xffffff, 1, 10, 0);
  pLigth.castShadow = true;
  pLigth.shadow.bias = 0.01;
  pLigth.position.set(0, 500, 0);
  pLigth.shadow.camera.fov = 2000;
  window.addEventListener("keypress", (e) => {
    const y = pLigth.position.y;
    console.log("y", y);
    if (e.key === "a") {
      pLigth.position.setY(y + 10);
    } else if (e.key === "d") {
      pLigth.position.setY(y - 10);
    }
  });
  scene.add(pLigth);

  const pLigth2 = new THREE.PointLight(0xffffff, 1, 10, 0);
  pLigth2.castShadow = true;
  pLigth2.shadow.bias = 0.01;
  pLigth2.position.set(-50, 500, -50);
  pLigth2.shadow.camera.fov = 2000;
  scene.add(pLigth2);

  const aLigth = new THREE.AmbientLight(0x404040, 1);

  aLigth.position.set(50, 50, 50);
  scene.add(aLigth);
};

let shiftDown = false;
//let lemon
let renderer;
let scene;
/**
 * @type {THREE.PerspectiveCamera} camera
 */
let camera;
/**
 * @type {THREE.Raycaster} raycaster
 */
let raycaster;
/**
 * @type {OrbitControls} controls
 */
let controls;

/**
 * @type {Vector3} lookAtPos
 */
let lookAtPos = new THREE.Vector3(0, 0, 0);
const mouse = new THREE.Vector2();
let INTERSECTED;
let width, height;
let moveCamera = true;
let theta = 0;
export const createIslandCanvas = () => {
  width = window.innerWidth;
  width = Math.min(window.innerWidth, width);
  height = 800;
  height = Math.min(window.innerHeight * 0.8, height);
  height = window.innerHeight;
  camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 2000);
  camera.position.z = 0;
  camera.position.x = 0;
  camera.position.y = 320;
  camera.lookAt(lookAtPos);
  camera.updateProjectionMatrix();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff, 0);

  raycaster = new THREE.Raycaster();

  controls = new OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);
  renderer.setAnimationLoop(animation);
  scene = new THREE.Scene();
  scene.add(camera);

  addLights(scene);
  loadIsland(scene);

  window.addEventListener("resize", () => handleResize());
  document.addEventListener("mousemove", onDocumentMouseMove);
  // controls.mouseButtons = {
  //   //  LEFT: THREE.MOUSE.ROTATE,
  //   //   MIDDLE: THREE.MOUSE.DOLLY,
  //   RIGHT: THREE.TOUCH.DOLLY_PAN,
  // };

  renderer.domElement.addEventListener("click", () => {
    moveCamera = false;
  });
  renderer.domElement.addEventListener("mousedown", () => handleClick(true));
  renderer.domElement.addEventListener("mouseup", () => handleClick(false));
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  const offSet = 200;
  function animation(time) {
    if (moveCamera) {
      theta += 0.005;
      camera.position.setX(offSet * Math.cos(theta));
      camera.position.setZ(offSet * Math.sin(theta));
      const y = camera.position.y;
      if (y > 100) {
        camera.position.setY(y - (y - 100) * 0.01);
      }

      camera.lookAt(lookAtPos);
      camera.updateMatrixWorld();
    }

    if (camera.position.y < 10) {
      camera.position.setY(10);
    }

    checkIntersection();
    renderer.render(scene, camera);
  }

  return renderer.domElement;
};

let mousedown = false;
const handleClick = (down) => {
  mousedown = down;
};

/**
 *
 * @param {KeyboardEvent} e
 */
const handleKeyUp = (e) => {
  if (e.shiftKey) {
    shiftDown = false;
  }
};
/**
 *
 * @param {KeyboardEvent} e
 */
const handleKeyDown = (e) => {
  if (e.shiftKey) {
    shiftDown = false;
  }
};

/**
 * @param {THREE.Object3D} obj
 */
const turnOffHighlight = (obj) => {
  if (!obj) return;
  setNameText("");

  INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
  INTERSECTED.material.color.setHex(INTERSECTED.currentColor);
  INTERSECTED = null;
};

/**
 * @param {THREE.Object3D} obj
 */
const turnOnHighlight = (obj) => {
  setNameText(obj.name);
  INTERSECTED = obj;
  INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();

  INTERSECTED.currentColor = INTERSECTED.material.color.getHex();

  INTERSECTED.material.color.setHex(0xff0000);

  INTERSECTED.material.emissive.setHex(0xff0000);
};

const checkIntersection = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    if (intersect.object.name.toLowerCase() === "ísland") {
      turnOffHighlight(INTERSECTED);
    } else if (INTERSECTED !== intersect.object) {
      turnOffHighlight(INTERSECTED);
      turnOnHighlight(intersect.object);
    }
  } else {
    turnOffHighlight(INTERSECTED);
  }
};

const handleResize = () => {
  width = window.innerWidth;
  width = Math.min(window.innerWidth, width);
  height = 800;
  height = Math.min(window.innerHeight * 0.8, height);

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

const getPointOfClick = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    console.log(intersects[0]);
    return intersects[0].point;
  }
};

function onDocumentMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / width) * 2 - 1;
  mouse.y = -(event.clientY / height) * 2 + 1;

  if (mousedown && shiftDown) {
    const point = getPointOfClick();
    if (point) {
      controls.target = point;
      lookAtPos = point;
    }
  }
}

export const destroyCanvas = () => {
  window.removeEventListener("resize", () => handleResize());
  // document.body.removeChild(renderer.domElement);
  scene = undefined;
  renderer.setAnimationLoop(null);
  renderer = undefined;
  camera = undefined;
};

const nameDiv = document.createElement("div");
nameDiv.classList.add("name-div");
document.body.appendChild(nameDiv);
nameDiv.classList.add("hide");

const setNameText = (t) => {
  if (t === "") {
    nameDiv.classList.add("hide");
  } else {
    nameDiv.classList.remove("hide");
  }
  nameDiv.textContent = t;
};
