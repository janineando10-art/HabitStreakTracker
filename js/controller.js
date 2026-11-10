import * as model from './model.js';
import habitFormView from './views/HabitFormView.js';
import habitListView from './views/HabitListView.js';
import statsView from './views/StatsView.js';

const renderAll = () => {
  statsView.render(model.computeSummary());
  habitListView.render(model.getHabitsWithStats());
  const editing = model.state.editingId;
  habitFormView.render(editing ? { values: model.getHabit(editing), editing: true } : { values: {} });
};

const controlSubmit = data => {
  const error = model.validateHabit(data);
  if (error) {
    habitFormView.render({ values: data, error, editing: !!model.state.editingId });
    return;
  }
  if (model.state.editingId) model.updateHabit(model.state.editingId, data);
  else model.addHabit(data);
  renderAll();
};

const controlToggle = id => { model.toggleToday(id); renderAll(); };
const controlEdit = id => { model.setEditing(id); renderAll(); };
const controlCancel = () => { model.setEditing(null); renderAll(); };
const controlDelete = id => { model.deleteHabit(id); renderAll(); };

const init = () => {
  model.loadState();
  renderAll();
  habitFormView.addHandlerSubmit(controlSubmit);
  habitFormView.addHandlerCancel(controlCancel);
  habitListView.addHandlerToggle(controlToggle);
  habitListView.addHandlerEdit(controlEdit);
  habitListView.addHandlerDelete(controlDelete);
};

init();
