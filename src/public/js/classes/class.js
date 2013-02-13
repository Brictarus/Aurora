var Class = function() {};

Class.extend = function (initParameters) {
    var hidden = ['initialize', '__super'];
    var SubClass = function() {
        if (!this.__initializingPrototype && this.initialize) {
            this.initialize.apply(this, arguments);
        }
    }
    this.prototype.__initializingPrototype = true;
    SubClass.prototype = new this();
    this.prototype.__initializingPrototype = false;
    SubClass.prototype.__super__ = this.prototype;

    if (initParameters && typeof initParameters  === 'object') {
        for (var property in initParameters) {
            SubClass.prototype[property] = initParameters[property];
        }
    }
    SubClass.prototype.constructor = SubClass;
    SubClass.extend = this.extend;
    return SubClass;
}

var BaseClass = Class.extend({
    test : 'test', 
    message : 'default A class message',
    _eventToListeners : {},

    on : function (event, callback, context) {
        if (!this._eventToListeners.hasOwnProperty(event)) {
            this._eventToListeners[event] = [];
        }
        this._eventToListeners[event].push({ callback : callback, context : context });
    },

    trigger : function (event, args) {
        if (this._eventToListeners.hasOwnProperty(event)) {
            for (var i = 0; i < this._eventToListeners[event].length; ++i) {
               try {
                    var handler = this._eventToListeners[event][i];
                    handler.callback.call(handler.context || this || window, args);
               } catch (e) {
                   if (console) {
                        if (console.error) console.error(e);
                        else if (console.log) console.log(e);
                   }
               }
            }
        }
    }
});