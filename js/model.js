const STORAGE_KEY = 'habit-streak-tracker';

export const state = {
  habits: [],      // { id, name, goal (days per week), log: ['YYYY-MM-DD', ...] }
  editingId: null  // id of the habit being edited
};

const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits));

export const loadState = () => {
  try {
    state.habits = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    state.habits = [];
  }
  return state;
};

// Local-date key like "2026-11-10" for today minus n days
const daysAgo = n => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const [y, m, day] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const validateHabit = ({ name, goal }) => {
  if (!name.trim()) return 'Habit name is required.';
  if (!(Number.isInteger(+goal) && goal >= 1 && goal <= 7)) return 'Weekly goal must be a whole number from 1 to 7.';
  return '';
};

export const getHabit = id => state.habits.find(h => h.id === id);

export const addHabit = ({ name, goal }) => {
  state.habits.push({ id: Date.now().toString(), name: name.trim(), goal: +goal, log: [] });
  save();
};

export const updateHabit = (id, { name, goal }) => {
  Object.assign(getHabit(id), { name: name.trim(), goal: +goal });
  state.editingId = null;
  save();
};

export const deleteHabit = id => {
  state.habits = state.habits.filter(h => h.id !== id);
  if (state.editingId === id) state.editingId = null;
  save();
};

// Check in (or undo) for today
export const toggleToday = id => {
  const habit = getHabit(id);
  const today = daysAgo(0);
  habit.log = habit.log.includes(today) ? habit.log.filter(d => d !== today) : [...habit.log, today];
  save();
};

export const setEditing = id => { state.editingId = id; };

// Consecutive days ending today (or yesterday if today is not checked yet)
const streakOf = habit => {
  let i = habit.log.includes(daysAgo(0)) ? 0 : 1;
  let streak = 0;
  while (habit.log.includes(daysAgo(i))) { streak++; i++; }
  return streak;
};

// Derived values per habit: streak, done today, last-7-days count, completion rate
export const getHabitsWithStats = () =>
  state.habits.map(h => {
    const weekCount = [0, 1, 2, 3, 4, 5, 6].filter(i => h.log.includes(daysAgo(i))).length;
    return {
      ...h,
      streak: streakOf(h),
      doneToday: h.log.includes(daysAgo(0)),
      weekCount,
      rate: Math.min(weekCount / h.goal, 1)
    };
  });

// Derived values for the whole app
export const computeSummary = () => {
  const habits = getHabitsWithStats();
  const total = habits.length;
  return {
    total,
    doneToday: habits.filter(h => h.doneToday).length,
    bestStreak: Math.max(0, ...habits.map(h => h.streak)),
    avgRate: total ? habits.reduce((sum, h) => sum + h.rate, 0) / total : 0
  };
};
