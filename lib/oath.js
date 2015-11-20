void function () {
  /* Handy promise implementation provided by a flavored oop concept in very concise form.
   * copyright hinell@github.com 2015.
   * Todo: add polyfills of Array.forEach(),.map(),.reduce(),func.bind() to be supported by old browsers
   */
  /*Err for undefined or required variables
   * @class
   * */
  var Err = function (m){
       var err = new Error(m);
           err.throw = function () { throw this };
    return err
  };
  "use strict";
  /*
   * @param {function} target callback. accepts two arguments:
   *                   // targetfunction(resolve,reject){}
   *
   *                   1) resolve - function - intended to be called inside of the target function
   *                      with some result retrieved by of an any successful asynchronous (but not only) evaluation.
   *                      it also fires a callback added by a then method.
   *
   *                   2) reject  - function - alike resolve, but for non-successful reason.
   *                      it also fires a callback added by a catch method.
   *@return {promise} promise object
   * */
  (typeof window === 'object')?(window.Oath = Promise):(module.exports = Promise);
  /* Accepts one sync or async object
   * @class
   * @return {promise} */
  function Promise () {
    /*@prop {object} promise._fail.handler  - to be used as rejection handler */
    this._fail        = {handler :void 0};
    /*@prop {object} promise._okay.handlers - handlers for resolving*/
    this._okay        = {handlers:[]};
    /* Fires first handler with resolved (or rejected)
     * value passed in,
     * takes and stores returned value of into a buffer,
     * calls next handler with buffered value.
     * @param {buffer}  - buffer for result of each onokayhandler calls
     * */
    this._okay.call   = function (buffer) {
      this.handlers.length == 1 ? (buffer = [this.handlers[0].apply({},buffer)])
        :this.handlers.forEach(function(onOkayHandler){ buffer=[onOkayHandler.apply({},buffer)] })
    };
    this.resolved     = false;
    this.rejected     = false;
    /*@prop {object} promise.done - true only if promise is resolved or rejected */
    this.done         = false;
    /* @prop {object} promise.target        - target container
     * @prop {object} promise.target.return - buffer for returned value of target and each handler invocation*/
    this.target         = {};
    this.target.return  = void 0;
    /* Fires the "then" handler early provided by an promise.then() method
     * method not allowed to be called more than once
     * @method promise.resolve
     * @param  {object [,object]}*/
    this.resolve   = function () {
      /* if promise has been resolved or rejected - method does nothing */
      if(this.resolved || this.rejected){ return }
      this.resolved       = true;
      this.value          = [].slice.call(arguments);
      this._okay.call(this.target.return = this.value);
      this.done           = true;
    };
    /* Alike promise.resolve() but with exception - fires handler appended by a promise.catch() method
     * method not allowed to be called more than once
     * @method promise.reject
     * @param  {object [,object]}*/
    this.reject    = function () {
      /* if promise has been resolved or rejected - method does nothing */
      if(this.resolved || this.rejected){ return }
      this.rejected       = true;
      this.value          = [].slice.call(arguments);
      this.target.return  = [this._fail.handler.apply({},this.value)];
      this._okay.call(this.target.return);
      this.done           = true;
    };
    /*
     * @method then accepts a callback to be called after resolve callback is called inside of the target function.
     * @public
     * @param  {function}  - called after the async function will be resolved.
     * @return {promise}   - the same instance of promise
     * */
    this.then      = function (cb) {
      this._fail.handler && (this._okay.handlers = []);
      this._okay.handlers.push(cb);
      return this
    };
    /*
     * Catch accepts a callback to be called after reject callback is called inside of the target function
     * @method promise.catch
     * @param  {function}  - called after the async function will be resolved.
     * @return {promise}   - the same instance of promise
     * */
    this.catch     = function (cb) {
      this._fail.handler = cb;
      return this
    };
    /* @prop {object} promise.target.obj   - target itself
     * @prop {object} promise.target.delay - only for sync objects - delay before target is resolved */
    this.target.obj   = arguments[0];
    this.target.delay = 5;
    /*
     * Enables non-functional (sync) object to be async
     * @method promise.target.asynchronize*/
    this.target.asynchronize   = function () {
      var target      = this.obj;
      var isfunction  = typeof target === 'function';
      if( isfunction) return;
      this.obj = function (res,rej) {
        setTimeout(res.bind(this,target),this.delay);
      }.bind(this);
    };
    /* Asynchronizes (if needed) and calls the target object

     * @method promise.target.init*/
    this.target.init = function () {
      this.target.obj(
        this.resolve.bind(this)
        ,this.reject.bind(this)
      )
    }.bind(this);
    if (this.target.obj) {
      this.target.asynchronize();
      this.target.init()
    }
  }
  /*Provides interface to access a group of promises
   * @class
   * @param  {Promises[]} - Array of promises
   * @return {reconciler} */
  function Reconciler (promises,listener) {
    promises.length < 2 && new Err('Expected at least two Promises are required!: new Reconciler([promise x 2])').throw();
    /*@prop reconciler.promises - pool of promises*/
    this.promises     = []
    /*Indicates state of each promise in pool
     * @method reconciler.done*/
    this.done         = function () {
      return this.promises.reduce(function (previous,promise) {
        return previous ? (promise.resolved || promise.rejected) : previous;
      },true)
    };
    /*@method reconciler.results
     * @return {Array} - Resolved and rejected values of each promise */
    this.results      = function () {
      return this.promises.reduce(function (results,promise) {
        return results = results.concat(promise.value)
      },[])
    };
    /*Method intended to be implemetend in user-class;
     * Used to be added into each promise resolution or rejection handlers
     * @param {object} - accepts any of resolved or rejected values
     * @method reconciler.listener*/
    this.listener     = listener;
    this.coefficient  = 2;
    this.promises     = promises;
    this.promises.forEach(function(promise){
             promise
              .then (this.listener)
              .catch(this.listener);
             promise.target.delay  = ~~((++this.coefficient/Math.E)*10);
      typeof promise.target.obj === 'undefined' && new Err('Each promise has to have a target object!: promise.target.obj').throw();
    },this);

    /*Initialize each promise in pool
    * @method reconciler.reconcile*/
    this.reconcile    = function () {
      this.listener || new Err('Expected a promises listener to be defined!: reconciler.listener').throw();
      this.promises.forEach(function (promise) {
        promise.target.asynchronize();
        promise.target.init();
      });
    };
  }
  /*Provides Promise object for multiple sync or async objects
  * @class
  * Accepts {object [,object]}
  * @return {promise}  */
  function Visor () {
    arguments.length < 2 && new Err('Expected at least two async or sync objects!').throw();
    Promise.call(this);
    this.catch    = function () { new Err('cathc() method is not allowed to catch results of many async|sync rejections, please, use then()').throw() };
    this.promises = [].slice.call(arguments).map(function(target){
         var promise = new Promise();
      return promise.target.obj = target,promise
    },this);
    this.listener = function () {
      this.promises.done() && this.resolve.apply(this,this.promises.results())
    }.bind(this);
    this.promises = new Reconciler(this.promises,this.listener);
    this.promises.reconcile()
  }
  Promise.Visor = Visor;
  /* Accepts several deferred (async|sync) objects
   * @return {promise}*/
  Promise.all = function () {
       var args = [].slice.call(arguments);
       var BindedVisor = Visor.bind(null,args.shift());
           args.forEach(function (obj) { BindedVisor = BindedVisor.bind(null,obj); });
    return new BindedVisor
  };
  /*Provides Promise object for multiple sync or async objects
  * @class
  * Accepts {object [,object]}
  * @return {promise}  */
  function Visor () {
    arguments.length < 2 && new Err('Expected at least two async or sync objects!').throw();
    Promise.call(this);
    this.catch    = function () { new Err('cathc() method is not allowed to catch results of many async|sync rejections, please, use then()').throw() };
    this.visor    = true;
    this.promises = [].slice.call(arguments).map(function(target){
         var promise = new Promise();
      return promise.target.obj = target,promise
    },this);
    this.listener = function (arg) {
      this.promises.done() && this.resolve.apply(this,this.promises.results())
    }.bind(this);
    this.promises = new Reconciler(this.promises,this.listener);
    this.promises.reconcile()
  };
  Promise.Visor = Visor;
  /* Accepts several deferred (async|sync) objects
   * @return {promise}*/
  Promise.all = function () {
       var args = [].slice.call(arguments);
       var BindedVisor = Visor.bind(null,args.shift());
           args.forEach(function (obj) { BindedVisor = BindedVisor.bind(null,obj); })
    return new BindedVisor
  };
}();
