const clone = require('clone');


module.exports = {
  mapResponse,
  mapRequest
};


/**
 * @param {Object} options
 * @return {*}
 */
function mapRequest(options) {
  return function(req, res, next) {
    // Prevent sharing state accross requests
    let obj = clone(options);

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = evalObjectValues(obj[key], req, res, req[key]);

        // We want to build values on request
        // object keys to handle multiple calls
        // to middleware
        req[key] = Object.assign(req[key], value); // Assume req.key is object
      }
    }

    next();
  };
};


/**
 * @param {Object} options
 * @return {*}
 */
function mapResponse(options) {
  return function(req, res, next) {
    // Prevent sharing state accross requests
    let obj = clone(options);

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = evalObjectValues(obj[key], req, res);

        res[key] = Object.assign(res[key], value);
      }
    }

    next();
  };
};


/**
 * @param {*} obj
 * @return {Boolean}
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}


/**
 * @param {*} obj
 * @return {Boolean}
 */
function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}


/**
 * @param {*} value
 * @param {*} req
 * @param {*} res
 * @param {*} originValue
 * @return {*}
 */
function evalObjectValues(value, req, res, originValue) {
  // Base case if not object
  if (!isObject(value)) {
    if (isFunction(value)) {
      return value(originValue, req, res);
    } else {
      return value;
    }
  }

  // Recursive case/Reduce the problem
  let result = {};
  for (let key in value) {
    if (value.hasOwnProperty(key)) {
      let newOriginValue = getVal(originValue, key);
      result[key] = evalObjectValues(value[key], req, res, newOriginValue);
    }
  }

  return result;
}


/**
 * @param {*} obj
 * @param {*} key
 * @return {*}
 */
function getVal(obj, key) {
  try {
    return obj[key];
  } catch (e) {
    return undefined;
  }
}
