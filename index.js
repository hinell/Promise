/*
* Handy Promise implementation provided by a flavored oop concept in very neat and concise form.
* Copyright Hinell@github.com 2015.
*
*/
/* Todo: eslint  */
void function () {
  var debug    = false ? console.log.bind(console,'|'): function(){};
  "use strict";
  function oath (fn) {
      var args = [].slice.call(arguments)
   /* Entry point here.
      If we have only one target object passed into this function then we call #defer() (see below) method,
      otherwise we call #when().*/
      if (args.length === 1)
        return oath.Promise.defer(fn);
      if (args.length > 1) {
        debug('several function case',args);
        return oath.Promise.when.apply({},args)
        }
  }
  (typeof window === 'object')?(window.oath = oath):(module.exports = oath);
  /*
  * @param {Function} Target callback. Accepts two arguments:
  *                   // targetFunction(resolve,reject){}
  *
  *                   1) resolve - function - intended to be called inside of the target function
  *                      with some result retrieved by of an any successful asynchronous (but not only) evaluation.
  *                      It also fires a callback added by a then method (see below).
  *
  *                   2) reject  - function - alike resolve, but for non-successful reason.
  *                      It also fires a callback added by a catch method (see below).
  *@return {Promise} Promise object
  * */
  oath.Promise = function (/* targeted objects*/) {
    var  onOkayHandler  = this['[fail]'], /* To be used as resolve handler */
         onFailHandler  = this['[okay]']; /* To be used as reject handler */

    this.resolved       = false;
    this.rejected       = false;
    this.done           = false;           /* becomes true only after resolving or rejection */


    /*
    * @method then accepts callback to be called after resolve callback is called inside of the target function.
    * @public
    * @param  {Function}  Called after the async function will be resolved.
    * @return {oath.Promise instance}    Instance of Promise
    * */
    this.then      = function (cb) {
          if(this.resolved || this.rejected) this.targetResult = cb(this.targetResult);
          else onOkayHandler = cb;
      return this
    };
    /*
    * @method catch accepts callback to be called after reject callback is called inside of the target function.
    * @public
    * @param  {Function}  Called after the async function will be resolved.
    * @return {oath.Promise instance}    Instance of Promise
    * */
    this.catch     = function (cb) {
             this.rejected || (onFailHandler = cb);
      return this
    };

    /*
     * Fires the "then" callback early provided an then() method (see below)
     * Method not allowed to be called more than once
     * @method resolve
     * @param  {Object [,Object]}
     * @return {Undefined} */
    this.resolve   = function () {
      /* If promise has been resolved or rejected - method does nothing */
      if(!this.resolved && !this.rejected){
        debug('resolve:arg',arguments);
        this.resolved       = true;
        this.targetResult   = onOkayHandler.apply({},arguments);
        this.done           = true;
      }
    };
    /*
     * Like resolve() but with one exception - it fires handler appended only by a catch() method
     * Method not allowed to be called more than once
     * @method reject
     * @param  {Object [,Object]}
     * @return {Undefined} */
    this.reject    = function () {
      /* If promise has been resolved or rejected - method does nothing */
      if(!this.resolved && !this.rejected){
        debug('reject:arg',arguments);
        this.rejected       = true;
        this.targetResult   = onFailHandler.apply({},arguments);
        this.done           = true;
      }
    };

    this.targets                = [].slice.call(arguments);
    this.targets.asynchronize   = function () {
      return this.targets.map(function (object,i) {
        var isFunction  = typeof object === 'function';
        if( isFunction) return object;
        var counter     = this.targets.counter || 2;
        var delay       = ~~((counter/Math.E)*10);
        if(!isFunction) return function (res,rej) {
          setTimeout(res.bind(this,object),delay);
          this.targets.counter  = ++counter;
        }.bind(this);
      })
    }.bind(this)

    this.targets.length === 1 && function () {
      /* Todo: designate a target handler */
      this.targets.asynchronize();
      this.target(
         this.resolve.bind(this)
        ,this.reject.bind(this)
        )

    }.call(this)
  };
  /*
  * @method defer Accepts as target an async (or sync) function
  * @param {Function}
  * @return {Object} Promise instance
  * */
  oath.Promise.defer = function (targetObj) {
   /* Todo: rewrite*/
    if(typeof targetObj !== 'function') {targetObj = function (resolve) { resolve(targetObj)  }}
    var promise = new oath.Promise();
        targetObj(promise.resolve.bind(promise),promise);
        return promise
  };
  /*
  * The promise class method accepts several deferred object to handle them as deferred
  * @param {Function|[,Function,Objects]}
  * @return {oath.Promise instance}
  * */
  oath.Promise.when = function () {
     /*Todo: rewrite when*/
     /* An When instance is an representative  promise instance for .#then(), #catch() and #during() interfaces.*/
    var whenPromise   = this.whenPromise  = new oath.Promise;
    var thenListeners = whenPromise[':then'  ]
        whenPromise.resolve = function () {
          this.state.ok   = true;
          debug('resolved:ok',arguments)
          thenListeners.apply.apply(thenListeners,arguments)
        }

    var promises    = whenPromise.promises    = [];
        promises.areResolved  = [].reduce.bind(promises,function (resolved,promise) {
          resolved && promise.done || (resolved = false)
          return resolved
        },true);
        promises.extractData  = function () {
            return this.reduce(function (data,promise) {
              if (promise.args.length === 1) {promise.args = promise.args[0]}
              return data.push(promise.args),data
            },[])
        };

        /* Handles each target function of created When(func,func,func) object. */
        [].slice.call(arguments)
          .map(function (targetObj,i) {
                 if (typeof targetObj === 'function') return targetObj;
                 /* Wraps each non-function object to IIFE */
                 else return function(resolve) { setTimeout(function () { resolve(targetObj) },i*5)}

               })
          .map(function (targetObj) {
            var targetPromise = new oath.Promise,
                listener      = function () {
                  debug('listener:arg',arguments)
                  targetPromise.args || (targetPromise.args = [].slice.call(arguments));
                  promises.areResolved() && setTimeout(function () {
                    debug('promises.extractData()')
                    debug( promises.extractData())
                    whenPromise.resolve.apply(whenPromise,promises.extractData())
                    //whenPromise.resolve.apply(whenPromise,promises.extractData())
                  },0)
                };
                targetPromise.then (listener);
                targetPromise.catch(listener);
                promises.push(targetPromise)
                return targetObj.bind({},targetPromise.resolve.bind(targetPromise))
          })
          .forEach(function (target) { target() });
      return whenPromise
  };
}();
