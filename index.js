module.exports = function(object) {
    if (typeof object !== 'object') return object;
    return proxying(object);
}

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