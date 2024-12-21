// import * as THREE from '../libs/three.js';
// import '../libs/PLYLoader.js'
// import { PLYLoader } from '../libs/PLYLoader.js';
// import { OBJLoader } from '../libs/OBJLoader.js';
// import Stats from '../libs/stats.module.js';
// import { GUI } from '../libs/dat.gui.module.js';
import { OrbitControls } from '../libs/OrbitControls.js';

class ThreeDModel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        const plyFile = this.getAttribute('ply-file');
        const objFile = this.getAttribute('obj-file');
        this.init(plyFile, objFile);
    }

    init(plyFile, objFile) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 1);
        this.container.appendChild(this.renderer.domElement);

        this.controls =  new THREE.OrbitControls(this.camera);
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(2, 2, 2);
        this.scene.add(spotLight);

        this.camera.position.set(2.5, 2.5, 2.5);
        this.camera.lookAt(0, 0, 0);

        this.loadModels(plyFile, objFile);
        this.animate();
    }

    loadModels(plyFile, objFile) {
        const plyLoader = new THREE.PLYLoader();
        plyLoader.load(plyFile, (geometry) => {
            const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
            const points = new THREE.Points(geometry, material);
            this.scene.add(points);
        });

        const objLoader = new THREE.OBJLoader();
        objLoader.load(objFile, (loadedMesh) => {
            const material = new THREE.MeshNormalMaterial();
            loadedMesh.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                }
            });
            this.scene.add(loadedMesh);
        });
    }

    animate() {
        this.stats.update();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }

    disconnectedCallback() {
        this.container.innerHTML = '';
        document.body.removeChild(this.stats.dom);
    }
}

customElements.define('three-d-model', ThreeDModel);