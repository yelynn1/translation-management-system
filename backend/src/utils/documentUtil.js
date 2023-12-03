function setValuesToNull(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      setValuesToNull(obj[key]);
    } else {
      obj[key] = null;
    }
  }
}

// function to copy keys from one object to another if they don't exist
// if second object don't have key from first object, add it to second object with null value
function copyKeysIfNotExists(sourceObj, destinationObj) {
  for (let key in sourceObj) {
    if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null) {
      if (!destinationObj[key]) {
        destinationObj[key] = {};
      }
      copyKeysIfNotExists(sourceObj[key], destinationObj[key]);
    } else {
      if (!destinationObj[key]) {
        destinationObj[key] = null;
      }

    }
  }
}

// function to delete keys from object if exists
// if object have key that first object doen't exist, remove it from second object
function deleteKeysIfExists(sourceObj, objectToBeUpdated) {
  for (let key in objectToBeUpdated) {
    if (typeof objectToBeUpdated[key] === 'object' && objectToBeUpdated[key] !== null) {
      if (!sourceObj[key]) {
        delete objectToBeUpdated[key];
      }
      deleteKeysIfExists(sourceObj[key], objectToBeUpdated[key]);
    } else {
      if (!sourceObj[key]) {
        delete objectToBeUpdated[key];
      }
    }
  }
}

module.exports = {
  setValuesToNull,
  copyKeysIfNotExists
}