const storageKey = 'apian-packing-list-v1';

// Storage can be unavailable in private/restricted browsing; keep the list usable.
export function createChecklistStore(getStorage) {
  let memory = new Set();
  let memoryOnly = false;
  return {
    load(validKeys) {
      if (!memoryOnly) try {
        const saved = JSON.parse(getStorage().getItem(storageKey) ?? '[]');
        memory = new Set(Array.isArray(saved) ? saved.filter(key => typeof key === 'string') : []);
      } catch { memoryOnly = true; }
      memory = new Set([...memory].filter(key => validKeys.includes(key)));
      return { checked: new Set(memory), persisted: !memoryOnly };
    },
    save(keys) {
      memory = new Set(keys);
      try {
        getStorage().setItem(storageKey, JSON.stringify([...memory]));
        memoryOnly = false;
        return true;
      } catch { memoryOnly = true; return false; }
    }
  };
}

const store = createChecklistStore(() => window.localStorage);

export function checklistToolbar() {
  return `<aside class="checklist-tools" aria-label="Taşınma listesi ilerlemesi">
    <div><strong class="checklist-progress" role="status" aria-live="polite"></strong>
    <p class="checklist-storage"></p></div>
    <button type="button" class="checklist-reset">İşaretleri temizle</button>
  </aside>`;
}

export function mountChecklist(root) {
  const inputs = [...root.querySelectorAll('input[data-checklist-key]')];
  if (!inputs.length) return;
  const state = store.load(inputs.map(input => input.dataset.checklistKey));
  inputs.forEach(input => { input.checked = state.checked.has(input.dataset.checklistKey); });
  const reset = root.querySelector('.checklist-reset');
  const refresh = persisted => {
    const checked = inputs.filter(input => input.checked);
    root.querySelector('.checklist-progress').textContent = `${checked.length} / ${inputs.length} tamamlandı`;
    root.querySelector('.checklist-storage').textContent = persisted
      ? 'İşaretlerin bu tarayıcıda saklanır.'
      : 'Tarayıcın kaydetmeye izin vermiyor; işaretlerin yalnızca bu oturumda kalır.';
    reset.disabled = checked.length === 0;
  };
  const save = () => refresh(store.save(inputs.filter(input => input.checked).map(input => input.dataset.checklistKey)));
  inputs.forEach(input => input.addEventListener('change', save));
  reset.addEventListener('click', () => {
    inputs.forEach(input => { input.checked = false; });
    save();
  });
  refresh(state.persisted);
}
