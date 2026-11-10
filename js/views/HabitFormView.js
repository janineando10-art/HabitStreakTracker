import View from './View.js';

class HabitFormView extends View {
  constructor() { super('.form-box'); }

  _generateMarkup() {
    const { values = {}, error = '', editing = false } = this._data;
    return `
      <h2>${editing ? 'Edit habit' : 'New habit'}</h2>
      <form>
        <input name="name" placeholder="Habit (e.g. Read 10 pages)" value="${this._escape(values.name ?? '')}">
        <input name="goal" type="number" step="1" placeholder="Goal: days per week (1-7)" value="${values.goal ?? ''}">
        ${error ? `<p class="error">${this._escape(error)}</p>` : ''}
        <button type="submit">${editing ? 'Save changes' : 'Add habit'}</button>
        ${editing ? '<button type="button" class="secondary" data-action="cancel">Cancel</button>' : ''}
      </form>`;
  }

  addHandlerSubmit(handler) {
    this._parent.addEventListener('submit', e => {
      e.preventDefault();
      handler(Object.fromEntries(new FormData(e.target)));
    });
  }

  addHandlerCancel(handler) {
    this._parent.addEventListener('click', e => {
      if (e.target.dataset.action === 'cancel') handler();
    });
  }
}

export default new HabitFormView();
