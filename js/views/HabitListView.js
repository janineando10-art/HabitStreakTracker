import View from './View.js';

class HabitListView extends View {
  constructor() { super('.habit-list'); }

  _generateMarkup() {
    if (!this._data.length) return '<p class="empty">No habits yet. Add your first one above.</p>';
    return `<h2>Your habits</h2>${this._data.map(h => `
      <div class="habit">
        <div class="habit-top">
          <div>
            <strong>${this._escape(h.name)}</strong><br>
            🔥 ${h.streak}-day streak · ${h.weekCount}/${h.goal} this week
          </div>
          <div class="actions">
            <button class="${h.doneToday ? 'done' : ''}" data-action="toggle" data-id="${h.id}">${h.doneToday ? '✓ Done' : 'Check in'}</button>
            <button class="secondary" data-action="edit" data-id="${h.id}">Edit</button>
            <button class="danger" data-action="delete" data-id="${h.id}">Delete</button>
          </div>
        </div>
        <div class="bar"><span style="width:${Math.round(h.rate * 100)}%"></span></div>
      </div>`).join('')}`;
  }

  _addHandler(action, handler) {
    this._parent.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (btn?.dataset.action === action) handler(btn.dataset.id);
    });
  }

  addHandlerToggle(handler) { this._addHandler('toggle', handler); }
  addHandlerEdit(handler) { this._addHandler('edit', handler); }
  addHandlerDelete(handler) { this._addHandler('delete', handler); }
}

export default new HabitListView();
