function SORT_PARAMS_TRANSFORM(order = {}) {
  const sorters = [];
  try {
    Object.keys(order).forEach((fieldName) => {
      sorters.push({
        fieldSort: {
          fieldName,
          order: order[fieldName],
        },
      });
    });
  } catch (e) {
    console.warn(e);
  }
  return sorters;
}

exports.SORT_PARAMS_TRANSFORM = SORT_PARAMS_TRANSFORM;
