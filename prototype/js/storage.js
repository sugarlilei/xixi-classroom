(function (global) {
  const KEYS = {
    age: "enl.ageFilter",
    progress: "enl.progress",
    resources: "enl.resources"
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getAgeFilter() {
    return localStorage.getItem(KEYS.age) || "all";
  }

  function setAgeFilter(id) {
    localStorage.setItem(KEYS.age, id);
  }

  function getAllProgress() {
    return read(KEYS.progress, {});
  }

  function getProgress(seriesId) {
    const all = getAllProgress();
    return (
      all[seriesId] || {
        seriesId,
        status: "todo",
        favorite: false,
        lastWatchedAt: null,
        note: ""
      }
    );
  }

  function setProgress(seriesId, patch) {
    const all = getAllProgress();
    const current = getProgress(seriesId);
    all[seriesId] = Object.assign({}, current, patch, { seriesId });
    write(KEYS.progress, all);
    return all[seriesId];
  }

  function getResources(seriesId) {
    const all = read(KEYS.resources, {});
    return all[seriesId] || [];
  }

  function setResources(seriesId, list) {
    const all = read(KEYS.resources, {});
    all[seriesId] = list;
    write(KEYS.resources, all);
  }

  function addResource(seriesId, item) {
    const list = getResources(seriesId).slice();
    list.push(item);
    list.sort((a, b) => a.priority - b.priority);
    setResources(seriesId, list);
    return list;
  }

  function removeResource(seriesId, resourceId) {
    const list = getResources(seriesId).filter((r) => r.id !== resourceId);
    setResources(seriesId, list);
    return list;
  }

  function uid(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  global.ENL_STORE = {
    KEYS,
    getAgeFilter,
    setAgeFilter,
    getAllProgress,
    getProgress,
    setProgress,
    getResources,
    setResources,
    addResource,
    removeResource,
    uid
  };
})(window);
