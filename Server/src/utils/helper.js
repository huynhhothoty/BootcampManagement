const deepCopy = (target) => {
    return JSON.parse(JSON.stringify(target));
};

const filterObject = (obj, ...allowField) => {
    const newObject = {};

    Object.keys(obj).forEach((ele) => {
        if (allowField.includes(ele)) newObject[ele] = obj[ele];
    });
    return newObject;
};

const filterExcludeObject = (obj, ...excludeField) => {
    const newObject = deepCopy(obj);
    excludeField.forEach((ele) => delete newObject[ele]);
    return newObject;
};

const checkTypeOfData = (value) => {
    const temp = Object.prototype.toString.call(value);
    const format = temp.slice(0, -1).split(' ')[1];
    if (format === 'Number' && isNaN(value)) return 'NaN';
    return format;
};

const formatDay = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    return formattedDate;
};

module.exports = {
    filterObject,
    filterExcludeObject,
    deepCopy,
    checkTypeOfData,
    formatDay,
};
