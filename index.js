module.exports = function(object1, object2, compCondition) {
    if (typeof object1 !== 'object') return object1;
    if (!object2) return proxying(object1);
    if (!!object2 && typeof object2 !== 'object') return proxying(object1);
    if(!!object1 && !!object2 && typeof object1 === 'object' && typeof object2 === 'object') {
        return rightJoin(object1, object2, compCondition)
    }
    return proxying(object1);
}

function rightJoin(object1, object2, compCondition) {
    var result = object1;
    var compare = typeof compCondition === 'function' ? compCondition : objectsAreSame
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

    return proxying(result);
};

function proxying(object) {
    return new Proxy(object, { 
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
