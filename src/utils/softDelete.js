// Soft delete utilities

export const softDelete = (item) => {
  return {
    ...item,
    deleted: true,
    deletedAt: new Date().toISOString()
  };
};

export const restore = (item) => {
  const { deleted, deletedAt, ...restored } = item;
  return restored;
};

export const filterActive = (items) => {
  return items.filter(item => !item.deleted);
};

export const filterDeleted = (items) => {
  return items.filter(item => item.deleted);
};

export const permanentDelete = (items, id) => {
  return items.filter(item => item.id !== id);
};

export const useSoftDelete = (initialData) => {
  const [data, setData] = React.useState(initialData);

  const remove = (id) => {
    setData(prev => prev.map(item => 
      item.id === id ? softDelete(item) : item
    ));
  };

  const restoreItem = (id) => {
    setData(prev => prev.map(item => 
      item.id === id ? restore(item) : item
    ));
  };

  const permanentlyDelete = (id) => {
    setData(prev => permanentDelete(prev, id));
  };

  const activeItems = filterActive(data);
  const deletedItems = filterDeleted(data);

  return {
    data,
    activeItems,
    deletedItems,
    remove,
    restore: restoreItem,
    permanentlyDelete
  };
};
