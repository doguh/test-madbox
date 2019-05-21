const THREE = require('three');
const createUI = require('./createUI');
const Keyboard = require('./keyboard');

function App(rootElement, width, height) {
  const ui = createUI(rootElement);
  Keyboard.listen();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0, 1);
  rootElement.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 1;
  scene.add(camera);

  const ball = new THREE.Mesh(
    new THREE.CircleGeometry(0.05, 32),
    new THREE.MeshBasicMaterial()
  );
  scene.add(ball);

  let selectedItem = null;
  let items = [];

  ui.addButton.onclick = addItem;
  ui.clearButton.onclick = clearItems;
  ui.saveButton.onclick = saveItems;

  renderer.domElement.addEventListener('click', e => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = 2 * (e.clientX / width) - 1;
    mouse.y = 1 - 2 * (e.clientY / height);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(items);
    if (intersects && intersects.length) {
      setSelectedItem(intersects[intersects.length - 1].object);
    }
  });

  Keyboard.on('delete', isDown => {
    if (isDown && selectedItem) {
      removeItem(selectedItem);
    }
  });

  function addItem() {
    const rect = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.02),
      new THREE.MeshBasicMaterial()
    );
    rect.position.y = -0.1;
    items.push(rect);
    scene.add(rect);
    setSelectedItem(rect);
  }

  function removeItem(item) {
    const index = items.indexOf(item);
    if (~index) {
      if (item === selectedItem) {
        setSelectedItem(null);
      }
      items.splice(index, 1);
      scene.remove(item);
    }
  }

  function clearItems() {
    items.forEach(item => {
      scene.remove(item);
    });
    items = [];
    setSelectedItem(null);
  }

  function saveItems() {
    const state = items.map(item => ({
      x: item.position.x,
      y: item.position.y,
      w: item.geometry.parameters.width,
      h: item.geometry.parameters.height,
      r: item.rotation.z,
    }));
    console.log(state);
  }

  function setSelectedItem(item) {
    if (selectedItem) {
      selectedItem.material.color.setHex(0xffffff);
    }
    if (item) {
      item.material.color.setHex(0x00ff00);
    }
    selectedItem = item;
  }

  let lastFrameTime = Date.now();

  function render() {
    requestAnimationFrame(render);
    const now = Date.now();
    const elapsed = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (selectedItem) {
      if (Keyboard.up) {
        selectedItem.position.y += 0.5 * elapsed;
      }
      if (Keyboard.down) {
        selectedItem.position.y -= 0.5 * elapsed;
      }
      if (Keyboard.left) {
        selectedItem.position.x -= 0.5 * elapsed;
      }
      if (Keyboard.right) {
        selectedItem.position.x += 0.5 * elapsed;
      }
      if (Keyboard.rotate) {
        selectedItem.rotation.z += 1 * elapsed;
      }
    }

    renderer.render(scene, camera);
  }
  render();
}

module.exports = App;
