class NormalViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.canvas = document.createElement('canvas');
        this.shadowRoot.appendChild(this.canvas);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.z = 5;

        this.loader = new THREE.GLTFLoader();
        this.animate();
    }

    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src' && newValue) {
            this.loadModel(newValue);
        }
    }

    loadModel(url) {
        this.loader.load(url, (gltf) => {
            const model = gltf.scene;
            this.scene.add(model);

            // 法线可视化
            const normalHelper = new THREE.VertexNormalsHelper(model, 0.5, 0xff0000, 1);
            this.scene.add(normalHelper);

            // 添加光源
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(5, 5, 5).normalize();
            this.scene.add(light);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.setSize(this.clientWidth, this.clientHeight);
        this.renderer.render(this.scene, this.camera);
    }

    connectedCallback() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.renderer.setSize(this.clientWidth, this.clientHeight);
        this.camera.aspect = this.clientWidth / this.clientHeight;
        this.camera.updateProjectionMatrix();
    }
}

customElements.define('normal-viewer', NormalViewer);