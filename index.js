/*
*  Copyright Hinell@github.com 2015. All right reserved.
*  Description:
*  Incredibly simple and incredibly fast Promise implemetations.
*  Just for fun!
* */


void function () {
  var debug    = false ? console.log.bind(console,'|'): function(){};
  "use strict";
  function oath (fn) {
      var args = [].slice.call(arguments)
      if (args.length === 1)
        return oath.Promise.defer(fn);
      if (args.length > 1) {
        debug('several function case',args);
        return oath.Promise.when.apply({},args)
        }
  }

  (typeof window === 'object')?(window.oath = oath):(module.exports = oath);
  /*
  * Entry point here
  * @param {Function} Callback. The callback function presents a resolve argument which deserves to be called when
  *                   target (generally async, but not only) function will have ended up its own evaluation.
  *                   The resolve function also able to get several  parameters: error - for Error object,
  *                   always have first place in order of arguments, and data - may be have arbitrary order. Order of data is ensured.
  *                   If target function doesn't has error, you always should specify error parameter
  *                   as undefined, i.e.: resolve(void 0, 'my data here')
  *@return {Promise} Promise object
  * */
  oath.Promise = function () {
        /* Callbacks collections */
    var errListeners      = this[':error' ] = [],
        thenListeners     = this[':then'  ] = [],
        progressListeners = this[':during'] = [];

        /* Here is assignation script to an apply method for each of the errListeners, thenListeners and progressListeners callback's collection.*/
        /*
        * @param {IntevalId} progressIntrvl
        * @private
        * */
        progressListeners.apply = function (progressIntrvl) {
          (progressListeners.length === 1) && progressListeners[0].call({},progressIntrvl);
          progressListeners.forEach(function (progressCallback) {
            progressCallback.call({},progressIntrvl);
          })
        };
        /*
         * @method callbacks.apply applyes error and data argumets for each of the registered callback of the callbacs collections.
         * @param {arguments} [err,data] - These arguments are come from resolve function:
         *         Error passed from resolve public function as first argument.
         *         Data  passed from resolve in arbitrary order after error argument.
         * @private
         * */
        thenListeners.apply =
        errListeners .apply =
        function () {
          var deferredCall = function (args,waitCallback,i) {
            setTimeout(function () {
              waitCallback.apply({},args)
              waitCallback.called = true;
              }, i);
            }
          if (this.length === 1)
            deferredCall(arguments,this[0])
          else
            this.forEach(deferredCall.bind({},arguments))
        }
    this.state = {}
    /*
     * @method Resolve
     * @param  {Error}
     * @param  {Object [,Object]}
     * @return {Undefined}*/
    this.resolve = function (err,data) {
      this.resolved  = true;
      var arg = [].slice.call(arguments)
      debug('resolved:arg',arg);
      if (arg[0] instanceof Error) {
        debug('resolved:err',arg)
        this.state.error = arg[0];
        errListeners.apply.apply (errListeners,arg)
      } else {
        this.state.ok   = true;
        debug('resolved:ok',arg)
        thenListeners.apply.apply(thenListeners,arg)
      }
      this.done = true;
    }

    /*
    * @method then Register callback to be called after target function calls resolve method.
    * @pablic
    * @param  {Function}  Called after the async functin will be resolved.
    * @return {oath.Promise instance}    Instance of Promise*/
    this.then     = function (cb) { thenListeners.push(cb); return this}

    /*
    * @method error Register callback to be called after target function calls resolve method.
    * @pablic
    * @param  {Function}  Called after the async functin will be resolved.
    * @return {oath.Promise instance}    Instance of Promise*/
    this.error    = function (cb) { errListeners.push(cb); return this}
    this.catch    = this.ifError = this.error

    /*
    * Method was deprecated!
    * @method during,progress  Register callback to be called after target function calls resolve method.
    * @pablic
    * @param  {Function}  Called after the async functin will be resolved.
    * @return {oath.Promise instance}    Instance of Promise*/
    //this.during   = function (cb) { progressListeners.push(cb); return this}
  }


  /*
  * @method defer target async (or not) function
  * @param {Function}
  * @return {Object} Promise instance
  * */
  oath.Promise.defer = function (targetObj) {
    if(typeof targetObj !== 'function') {targetObj = function (resolve) { resolve(targetObj)  }}
    var promise = new oath.Promise()
        targetObj(promise.resolve.bind(promise),promise)
        return promise

  }

  /*
  * An promise class method is able to accept several deferred to handle objects
  * @param {Function|[,Function,Objects]}
  * @return {oath.Promise instance}
  * */
  oath.Promise.when = function () {
        /* An When instance is an representative  promise instance for .#then(), #catch() and #during() interfaces.*/
    var whenPromise = this.whenPromise  = new oath.Promise;
        //whenPromise.catch = whenPromise.error = void 0;
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

        /* Handles an each target function of creation When(func,func,func) object. */
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
  }
}();
