export default class View {
  _data;
  _parent;

  constructor(selector) {
    this._parent = document.querySelector(selector);
  }

  render(data) {
    this._data = data;
    this._parent.innerHTML = this._generateMarkup();
  }

  _escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  _generateMarkup() {
    throw new Error('Child views must implement _generateMarkup()');
  }
}
