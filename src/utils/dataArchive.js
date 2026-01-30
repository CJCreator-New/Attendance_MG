export const archiveData = (month, year, data) => {
  const key = `archive_${month}_${year}`;
  localStorage.setItem(key, JSON.stringify(data));
  return { success: true, key };
};

export const loadArchive = (month, year) => {
  const key = `archive_${month}_${year}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const listArchives = () => {
  const archives = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('archive_')) {
      const [, month, year] = key.split('_');
      archives.push({ month, year, key });
    }
  }
  return archives;
};

export const deleteArchive = (key) => {
  localStorage.removeItem(key);
  return { success: true };
};
