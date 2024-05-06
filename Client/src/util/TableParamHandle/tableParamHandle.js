export const objectToQueryString = (obj) => {
    return Object.keys(obj)
      .filter((key) => obj[key] !== undefined && obj[key] !== null && obj[key] !== '')
      .map(key => `${key}=${obj[key]}`)
      .join('&');
}

const keyMap = {
    current: 'page',
    pageSize: 'limit'
};

export const copyObjectWithKeyRename = (originalObj) => {
    const newObj = {};
    for (const key in originalObj) {
      if (Object.hasOwnProperty.call(originalObj, key)) {
        const newKey = keyMap[key] || key;
        newObj[newKey] = originalObj[key];
      }
    }
    return newObj;
}