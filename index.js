void function () {
  function oath (fn) {
    var r = new oath.Promise();
    fn(function (err) {
      r.emit(err)
    });
    return r
  }
  (typeof window === 'object')?(window.oath = oath):(module.exports = oath);


  oath.Promise = function () {
    var Promise = [];
    Promise.err = function (fn) {
      this.push({ ok: false, cb: fn });
      return this
    }
    Promise.then = function (fn) {
      this.push({ ok: true,cb: fn });
      return this
    }
    Promise.emit = function (err) {
      this.forEach(function (cb) {
        if (err && !cb.ok) cb.cb(err);
        if (!err && cb.ok) cb.cb();
      })
    };
    return Promise
  };
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
