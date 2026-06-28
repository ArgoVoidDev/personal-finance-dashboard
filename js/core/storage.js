function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
  try {
    const data = localStorage.getItem(key);

    if (data === null) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

function removeData(key) {
  localStorage.removeItem(key);
}
