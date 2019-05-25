function createUI(rootElement) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.padding = '20px';

  const addButton = createButton('+ Add', container);
  const clearButton = createButton('Clear all', container);
  const saveButton = createButton('Save', container);

  rootElement.appendChild(container);
  return { addButton, clearButton, saveButton };
}

function createButton(label, container) {
  const btn = document.createElement('button');
  btn.innerHTML = label;
  container.appendChild(btn);
  return btn;
}

module.exports = createUI;
