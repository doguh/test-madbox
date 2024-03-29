const THREE = require('three');
const createUI = require('./createUI');
const Keyboard = require('./keyboard');
const Api = require('./api');
const Space = require('./physics/space');
const { Ball, Poutre } = require('./game/gameobject');

function App(rootElement, width, height) {
  let WIDTH = width;
  let HEIGHT = height;

  const ui = createUI(rootElement);
  Keyboard.listen();

  let started = false;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0, 1);
  rootElement.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.01, 10);
  camera.position.z = 1;
  scene.add(camera);

  const mouse = new THREE.Vector2(0, 0);

  const space = new Space();
  const ball = new Ball();
  scene.add(ball.sprite);
  space.add(ball.body);

  let selectedItem = null;
  let items = [];

  loadState();

  ui.addButton.onclick = () => addItem();
  ui.clearButton.onclick = () => clearItems();
  ui.saveButton.onclick = () => saveState();

  /**
   * on resize, update camera and renderer
   */
  window.addEventListener('resize', () => {
    WIDTH = rootElement.offsetWidth;
    HEIGHT = rootElement.offsetHeight;
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
  });

  /**
   * on click on an item, select it
   */
  renderer.domElement.addEventListener('click', e => {
    const raycaster = new THREE.Raycaster();
    mouse.x = 2 * (e.clientX / WIDTH) - 1;
    mouse.y = 1 - 2 * (e.clientY / HEIGHT);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(items.map(i => i.sprite));
    if (intersects && intersects.length) {
      setSelectedItem(intersects[intersects.length - 1].object.userData.item);
    }
  });

  /**
   * on mouse move, register mouse position
   */
  renderer.domElement.addEventListener('mousemove', e => {
    mouse.x = 2 * (e.clientX / WIDTH) - 1;
    mouse.y = 1 - 2 * (e.clientY / HEIGHT);
  });

  /**
   * on mouse leave, set it to 0,0 so the camera stops
   */
  renderer.domElement.addEventListener('mouseleave', e => {
    mouse.x = 0;
    mouse.y = 0;
  });

  /**
   * on press delete, remove selected item
   */
  Keyboard.on('delete', isDown => {
    if (isDown && selectedItem) {
      removeItem(selectedItem);
    }
  });

  /**
   * on press space, start the game
   */
  Keyboard.on('start', isDown => {
    if (isDown) {
      started = !started;
      if (!started) {
        // reset ball state
        ball.body.position.x = 0;
        ball.body.position.y = 0;
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;
        // reset camera position
        camera.position.set(0, 0, 1);
      }
    }
  });

  /**
   * creates and adds an item
   * @param {*} itemInfo { x, y, w, h, r }
   */
  function addItem(itemInfo) {
    const rect = new Poutre(itemInfo);
    items.push(rect);
    scene.add(rect.sprite);
    space.add(rect.body);
    setSelectedItem(rect);
  }

  /**
   * removes the given GameObject
   * @param {*} item
   */
  function removeItem(item) {
    const index = items.indexOf(item);
    if (~index) {
      if (item === selectedItem) {
        setSelectedItem(null);
      }
      items.splice(index, 1);
      scene.remove(item.sprite);
      space.remove(item.body);
    }
  }

  /**
   * removes all items
   */
  function clearItems() {
    items.forEach(item => {
      scene.remove(item.sprite);
      space.remove(item.body);
    });
    items = [];
    setSelectedItem(null);
  }

  /**
   * saves level design to the server
   */
  function saveState() {
    const state = {
      items: items.map(item => ({
        x: item.body.position.x,
        y: item.body.position.y,
        w: item.body.shape.width,
        h: item.body.shape.height,
        r: item.body.rotation,
      })),
    };
    console.log('saving state:', state);
    Api.post('ld', state);
  }

  /**
   * load saved state from the server
   */
  async function loadState() {
    const state = await Api.get('ld');
    console.log('loaded state:', state);
    items = [];
    state && state.items.forEach(item => addItem(item));
    setSelectedItem(null);
  }

  /**
   * set the selected item
   * @param {*} item
   */
  function setSelectedItem(item) {
    console.log('setSelectedItem', item);
    if (selectedItem) {
      selectedItem.sprite.material.color.setHex(0xffffff);
    }
    if (item) {
      item.sprite.material.color.setHex(0x00ff00);
    }
    selectedItem = item;
  }

  let lastFrameTime = Date.now();

  /**
   * main loop
   */
  function render() {
    requestAnimationFrame(render);
    const now = Date.now();
    const elapsed = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (started) {
      /**
       * si la simulation est lancée
       */
      space.step(elapsed);

      // camera follows ball
      camera.position.x = ball.body.position.x;
      camera.position.y = ball.body.position.y;
    } else {
      /**
       * sinon on est en mode editor
       */
      // move camera if near borders
      if (mouse.x < -0.9) {
        camera.position.x -= elapsed;
      } else if (mouse.x > 0.9) {
        camera.position.x += elapsed;
      }
      if (mouse.y < -0.9) {
        camera.position.y -= elapsed;
      } else if (mouse.y > 0.9) {
        camera.position.y += elapsed;
      }

      // move/rotate selected item if key is pressed
      if (selectedItem) {
        if (Keyboard.up) {
          selectedItem.body.position.y += 0.5 * elapsed;
        }
        if (Keyboard.down) {
          selectedItem.body.position.y -= 0.5 * elapsed;
        }
        if (Keyboard.left) {
          selectedItem.body.position.x -= 0.5 * elapsed;
        }
        if (Keyboard.right) {
          selectedItem.body.position.x += 0.5 * elapsed;
        }
        if (Keyboard.rotate) {
          selectedItem.body.rotation += 1 * elapsed;
        }
      }
    }

    ball.update();
    items.forEach(item => {
      item.update();
    });

    renderer.render(scene, camera);
  }
  render();
}

module.exports = App;
