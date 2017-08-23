module.exports = function(object1, object2, options) {
    if (typeof object1 !== 'object') return object1;
    if (!object2) return proxying(object1);
    if (!!object2 && typeof object2 !== 'object') return proxying(object1);
    if(!!object1 && !!object2 && typeof object1 === 'object' && typeof object2 === 'object') {
        return rightJoin(object1, object2, options)
    }
    return proxying(object1);
}

function rightJoin(object1, object2, options) {
    var result = object1;
    var compare = typeof options.condition === 'function' ? options.condition : objectsAreSame
    if (Array.isArray(object1) && Array.isArray(object2)) {
        var result = [];
        if (object1.length) {
            object2.forEach((b) => {
                object1.forEach((a) => {
                    if (compare(a, b)) { 
                        result.push(b); 
                    } else {
                        result.push(a);
                    }
                });
            });
        } else {
            result = object2;
        }
    } else if(typeof object1 === 'object' && typeof object2 === 'object') {
        if (compare(object1, object2)) result = object2;
    };

    return options.disableProxy ? result : proxying(result);
};

function proxying(object) {
    return new Proxy(Object.assign(object, { [Symbol.for(object)]: true }), { 
        get: (target, prop) => {
            if (typeof target[prop] === 'object' && target[prop] !== null) {
                return proxying(target[prop]);
            } else return target[prop];
        },
        set: (target, prop) => {
            if (typeof target[prop] === 'object' && target[prop] !== null) {
                proxying(target[prop]);
            }
            return true;
        }
    });
};

function objectsAreSame(object1, object2) {
    var result = true;
    for(var propertyName in object1) {
        if (!object1.hasOwnPropery(propertyName) || !object2.hasOwnPropery(propertyName)) {
            result = false;
            break;
        }
        if(object1[propertyName] !== object2[propertyName]) {
            result = false;
            break;
        }
    }
    return result;
 }

 module.exports.rightJoin = (object1, object2, options) => {
    return rightJoin(object1, object2, Object.assign(options, { disableProxy: true }));
 }