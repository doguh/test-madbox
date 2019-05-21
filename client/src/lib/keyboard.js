const MAP_KEYS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  r: 'rotate',
  R: 'rotate',
  Backspace: 'delete',
};

const Keyboard = {
  up: false,
  down: false,
  left: false,
  right: false,
  rotate: false,
  delete: false,

  listen: function() {
    document.addEventListener('keydown', e => {
      if (MAP_KEYS[e.key]) {
        this[MAP_KEYS[e.key]] = true;
      }
      if (e.key !== 'F12') {
        e.preventDefault();
      }
      if (this._listeners[e.key]) {
        this._listeners[e.key](true);
      }
    });
    document.addEventListener('keyup', e => {
      if (MAP_KEYS[e.key]) {
        this[MAP_KEYS[e.key]] = false;
      }
      e.preventDefault();
      if (this._listeners[e.key]) {
        this._listeners[e.key](false);
      }
    });
  },

  on: function(name, callback) {
    const keys = Object.keys(MAP_KEYS).filter(k => MAP_KEYS[k] === name);
    keys.forEach(key => {
      this._listeners[key] = callback;
    });
  },

  _listeners: {},
};

module.exports = Keyboard;
