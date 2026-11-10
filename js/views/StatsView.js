import View from './View.js';

class StatsView extends View {
  constructor() { super('.stats'); }

  _generateMarkup() {
    const { total, doneToday, bestStreak, avgRate } = this._data;
    return `
      <div class="stat-grid">
        <div><p class="big">${doneToday}/${total}</p><p>Done today</p></div>
        <div><p class="big">🔥 ${bestStreak}</p><p>Best streak</p></div>
        <div><p class="big">${Math.round(avgRate * 100)}%</p><p>Weekly goal rate</p></div>
      </div>`;
  }
}

export default new StatsView();
