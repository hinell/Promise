/*
*  Copyright Hinell@github.com 2015. All right reserved.
*  Description:
*  Incredibly simple and incredibly fast Promise implemetations.
*  Just for fun!
* */


void function () {
  function oath (fn) {return oath.Promise.deferr(fn);}
  (typeof window === 'object')?(window.oath = oath):(module.exports = oath);
  /*
  * Entry poin here
  * @param {Function} Callback. The callback presents a resolve callback function to be called when
  *                   target (generally async, but not only) function ended up its own evaluation.
  *                   The resolve function also able to get a few parameters: error - for error, always first in order
  *                   and data - in arbitrary order. Order of data ensured.
  *                   of your some async evaluation as first and second pararmeter respectively.
  *                   If target function doesn't has error, you always should specify error parameter
  *                   as undefined, i.e.: resolve(void 0, 'my data here')
  *@return {Promise} Promise object
  * */
  oath.Promise = function () {
    var cbserr = this['.error    callbacks'] = [],
        cbsgod = this['.good     callbacks'] = [],
        cbsprg = this['.progress callbacks'] = [];

        /*
        * Here method for each of cbserr,cbsgod, cbsprg callback collections.
        * @method callbacks.aplly applyed error and data for each registered callback
        * @param err  {Error} Should come always first
        * @param data {*}     May be exposed in arbitrary order
        * */
        [cbserr,cbsgod,cbsprg].forEach(function (cbs) {
          cbs.apply = function (progress,arg) {
            this.forEach((function (cb) {
              setTimeout(function () { cb.apply({},arg); clearInterval(progress) }, 0)
            }).bind(this))
          }
        })


    /*
     * @method Resolve
     * @param {Error, *}
     * @return {Undefined}*/
    this.resolve = function (err,data) {
        var progress = setInterval(function () {
            cbsprg.apply()
        },500)
        if (err) cbserr.apply(progress,arguments)
        else     cbsgod.apply(progress,arguments)
    }

    /*
    * @method Then
    * @param  {Function}  Called after the async functin will be resolved.
    * @return {Object}    Instance of Promise*/
    this.then     = function (cb) { cbsgod.push(cb); return this}

    /*
    * @method Error
    * @param  {Function}  Called after the async functin will be resolved.
    * @return {Object}    Instance of Promise*/
    this.error    = function (cb) { cbserr.push(cb); return this}

    /*
    * @method During
    * @param  {Function}  Called after the async functin will be resolved.
    * @return {Object}    Instance of Promise*/
    this.during   = function (cb) { cbsprg.push(cb); return this}
  }

  /*
  * @method deferr for targe async function
  * @param {Function}
  * @return {Object} Promise instance
  * */
  oath.Promise.deferr = function (fn) {
    var promise = new oath.Promise()
        fn(function () {
          promise.resolve.apply(promise,arguments)
        });
        return promise

  }
  oath.When = function () {
    var When = function (targets) {
      this.states   = [];
      this.results  = [];
      this.cbs      = [];
      this.emit     = emit;
      this.then     = function (result) {
        this.cbs.push(result)
      };
      this.prepare = function () {
        targets.forEach((function (targetCb, i) {
          this.results.push([, ,]);
          var state = {
            ready: false
          }
          this.states.push(state);
          var resolve = function (err, data) {
            state.ready = 'resolved';
            this.results[i] = [err, data];
            this.emit()
          }
          setTimeout(targetCb.bind({},
                                   resolve.bind(this)),
                     0)
        }).bind(this));
      };
      setTimeout(this.prepare.bind(this),
                 0);
      function emit () {
        var allResolved = this.states.reduce(function (result, state) {
          if (!state.ready) result = false
          return result
        }, true)
        console.log('allResolved',
                    allResolved,
                    this.states);
        if (allResolved) {
          cbs = this.cbs;
          this.cbs.forEach((function (thenCb) {
            thenCb.apply && thenCb.apply({},
                                         this.results)
          }).bind(this));
        }
        ;
      }
    }
    var when = new When([].slice.apply(arguments));
    return when;
  }

}();
