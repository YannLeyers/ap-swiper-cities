import './style.css'
import Swiper from 'swiper';
import './script.js'

import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

new Swiper('.swiper', {
  modules: [Navigation, Pagination],
  direction: 'horizontal',
  loop: true,

  pagination: {
    el: '.swiper-pagination',
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

// main.js
import * as THREE from 'three';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.globe-container').appendChild(renderer.domElement);

let textureLoader = new THREE.TextureLoader();
let earthTexture = textureLoader.load('img/earthTexture.jpg');

let geometry = new THREE.SphereGeometry(5, 32, 32);
let material = new THREE.MeshBasicMaterial({ map: earthTexture });
let globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Position markers with colors
let markers = [
  { name: 'Mexico', latitude: 19.4326, longitude: -99.1332, color: 0xFF0000 },
  { name: 'Ukraine', latitude: 48.3794, longitude: 31.1656, color: 0x00FF00 },
  { name: 'Georgia', latitude: 42.3154, longitude: 43.3569, color: 0x0000FF },
  { name: 'Morocco', latitude: 31.7917, longitude: -7.0926, color: 0xFFFF00 },
  { name: 'Chile', latitude: -35.6751, longitude: -71.543, color: 0xFF00FF },
];

// Add pins with colors for each marker
markers.forEach(marker => {
  let pinGeometry = new THREE.CylinderGeometry(0.05, 0.2, 1, 8);
  let pinMaterial = new THREE.MeshBasicMaterial({ color: marker.color });
  let pin = new THREE.Mesh(pinGeometry, pinMaterial);
  updatePinPosition(pin, marker.latitude, marker.longitude);
  globe.add(pin);
});

camera.position.z = 10;

let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove);

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
}

function onMouseUp() {
  isDragging = false;
}

function onMouseMove(event) {
  if (!isDragging) return;

  let deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y
  };

  globe.rotation.y += deltaMove.x * 0.01;
  globe.rotation.x += deltaMove.y * 0.01;

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Function to update pin position based on latitude and longitude
function updatePinPosition(pin, latitude, longitude) {
  let pinPosition = latLongToVector3(latitude, longitude, 5.1); // Adjust the radius accordingly

  // Position the pin at the surface of the globe
  pin.position.copy(pinPosition);

  // Rotate the pin so its base is flat on the surface and flip it to stand upright
  pin.lookAt(globe.position);
  pin.rotateX(Math.PI / 2);
  pin.rotateZ(Math.PI);
}

// Function to convert latitude and longitude to 3D coordinates
function latLongToVector3(lat, lon, radius) {
  let phi = (lat * Math.PI) / 180;
  let theta = ((lon - 180) * Math.PI) / 180;

  let x = -(radius * Math.cos(phi) * Math.cos(theta));
  let y = radius * Math.sin(phi);
  let z = radius * Math.cos(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}