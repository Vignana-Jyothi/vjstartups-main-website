const __vite__mapDeps = (i, m=__vite__mapDeps, d=(m.f || (m.f = ["assets/coming-soon-DxlMNWFt.js", "assets/spanner-top-CUjKwzDG.js", "assets/index-Bj15PNX4.js"]))) => i.map(i => d[i]);
(function() {
    const a = document.createElement("link").relList;
    if (a && a.supports && a.supports("modulepreload"))
        return;
    for (const u of document.querySelectorAll('link[rel="modulepreload"]'))
        o(u);
    new MutationObserver(u => {
        for (const f of u)
            if (f.type === "childList")
                for (const h of f.addedNodes)
                    h.tagName === "LINK" && h.rel === "modulepreload" && o(h)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function s(u) {
        const f = {};
        return u.integrity && (f.integrity = u.integrity),
        u.referrerPolicy && (f.referrerPolicy = u.referrerPolicy),
        u.crossOrigin === "use-credentials" ? f.credentials = "include" : u.crossOrigin === "anonymous" ? f.credentials = "omit" : f.credentials = "same-origin",
        f
    }
    function o(u) {
        if (u.ep)
            return;
        u.ep = !0;
        const f = s(u);
        fetch(u.href, f)
    }
}
)();
function m3(n) {
    return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n
}
var Ec = {
    exports: {}
}
  , js = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var c0;
function p3() {
    if (c0)
        return js;
    c0 = 1;
    var n = Symbol.for("react.transitional.element")
      , a = Symbol.for("react.fragment");
    function s(o, u, f) {
        var h = null;
        if (f !== void 0 && (h = "" + f),
        u.key !== void 0 && (h = "" + u.key),
        "key" in u) {
            f = {};
            for (var p in u)
                p !== "key" && (f[p] = u[p])
        } else
            f = u;
        return u = f.ref,
        {
            $$typeof: n,
            type: o,
            key: h,
            ref: u !== void 0 ? u : null,
            props: f
        }
    }
    return js.Fragment = a,
    js.jsx = s,
    js.jsxs = s,
    js
}
var f0;
function y3() {
    return f0 || (f0 = 1,
    Ec.exports = p3()),
    Ec.exports
}
var X = y3()
  , _c = {
    exports: {}
}
  , ut = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h0;
function v3() {
    if (h0)
        return ut;
    h0 = 1;
    var n = Symbol.for("react.transitional.element")
      , a = Symbol.for("react.portal")
      , s = Symbol.for("react.fragment")
      , o = Symbol.for("react.strict_mode")
      , u = Symbol.for("react.profiler")
      , f = Symbol.for("react.consumer")
      , h = Symbol.for("react.context")
      , p = Symbol.for("react.forward_ref")
      , d = Symbol.for("react.suspense")
      , m = Symbol.for("react.memo")
      , y = Symbol.for("react.lazy")
      , g = Symbol.iterator;
    function S(R) {
        return R === null || typeof R != "object" ? null : (R = g && R[g] || R["@@iterator"],
        typeof R == "function" ? R : null)
    }
    var T = {
        isMounted: function() {
            return !1
        },
        enqueueForceUpdate: function() {},
        enqueueReplaceState: function() {},
        enqueueSetState: function() {}
    }
      , C = Object.assign
      , E = {};
    function A(R, Y, J) {
        this.props = R,
        this.context = Y,
        this.refs = E,
        this.updater = J || T
    }
    A.prototype.isReactComponent = {},
    A.prototype.setState = function(R, Y) {
        if (typeof R != "object" && typeof R != "function" && R != null)
            throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, R, Y, "setState")
    }
    ,
    A.prototype.forceUpdate = function(R) {
        this.updater.enqueueForceUpdate(this, R, "forceUpdate")
    }
    ;
    function V() {}
    V.prototype = A.prototype;
    function q(R, Y, J) {
        this.props = R,
        this.context = Y,
        this.refs = E,
        this.updater = J || T
    }
    var B = q.prototype = new V;
    B.constructor = q,
    C(B, A.prototype),
    B.isPureReactComponent = !0;
    var G = Array.isArray
      , j = {
        H: null,
        A: null,
        T: null,
        S: null,
        V: null
    }
      , Z = Object.prototype.hasOwnProperty;
    function Q(R, Y, J, $, nt, yt) {
        return J = yt.ref,
        {
            $$typeof: n,
            type: R,
            key: Y,
            ref: J !== void 0 ? J : null,
            props: yt
        }
    }
    function K(R, Y) {
        return Q(R.type, Y, void 0, void 0, void 0, R.props)
    }
    function tt(R) {
        return typeof R == "object" && R !== null && R.$$typeof === n
    }
    function F(R) {
        var Y = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + R.replace(/[=:]/g, function(J) {
            return Y[J]
        })
    }
    var rt = /\/+/g;
    function ft(R, Y) {
        return typeof R == "object" && R !== null && R.key != null ? F("" + R.key) : Y.toString(36)
    }
    function Gt() {}
    function _t(R) {
        switch (R.status) {
        case "fulfilled":
            return R.value;
        case "rejected":
            throw R.reason;
        default:
            switch (typeof R.status == "string" ? R.then(Gt, Gt) : (R.status = "pending",
            R.then(function(Y) {
                R.status === "pending" && (R.status = "fulfilled",
                R.value = Y)
            }, function(Y) {
                R.status === "pending" && (R.status = "rejected",
                R.reason = Y)
            })),
            R.status) {
            case "fulfilled":
                return R.value;
            case "rejected":
                throw R.reason
            }
        }
        throw R
    }
    function Lt(R, Y, J, $, nt) {
        var yt = typeof R;
        (yt === "undefined" || yt === "boolean") && (R = null);
        var ot = !1;
        if (R === null)
            ot = !0;
        else
            switch (yt) {
            case "bigint":
            case "string":
            case "number":
                ot = !0;
                break;
            case "object":
                switch (R.$$typeof) {
                case n:
                case a:
                    ot = !0;
                    break;
                case y:
                    return ot = R._init,
                    Lt(ot(R._payload), Y, J, $, nt)
                }
            }
        if (ot)
            return nt = nt(R),
            ot = $ === "" ? "." + ft(R, 0) : $,
            G(nt) ? (J = "",
            ot != null && (J = ot.replace(rt, "$&/") + "/"),
            Lt(nt, Y, J, "", function(se) {
                return se
            })) : nt != null && (tt(nt) && (nt = K(nt, J + (nt.key == null || R && R.key === nt.key ? "" : ("" + nt.key).replace(rt, "$&/") + "/") + ot)),
            Y.push(nt)),
            1;
        ot = 0;
        var ae = $ === "" ? "." : $ + ":";
        if (G(R))
            for (var bt = 0; bt < R.length; bt++)
                $ = R[bt],
                yt = ae + ft($, bt),
                ot += Lt($, Y, J, yt, nt);
        else if (bt = S(R),
        typeof bt == "function")
            for (R = bt.call(R),
            bt = 0; !($ = R.next()).done; )
                $ = $.value,
                yt = ae + ft($, bt++),
                ot += Lt($, Y, J, yt, nt);
        else if (yt === "object") {
            if (typeof R.then == "function")
                return Lt(_t(R), Y, J, $, nt);
            throw Y = String(R),
            Error("Objects are not valid as a React child (found: " + (Y === "[object Object]" ? "object with keys {" + Object.keys(R).join(", ") + "}" : Y) + "). If you meant to render a collection of children, use an array instead.")
        }
        return ot
    }
    function z(R, Y, J) {
        if (R == null)
            return R;
        var $ = []
          , nt = 0;
        return Lt(R, $, "", "", function(yt) {
            return Y.call(J, yt, nt++)
        }),
        $
    }
    function k(R) {
        if (R._status === -1) {
            var Y = R._result;
            Y = Y(),
            Y.then(function(J) {
                (R._status === 0 || R._status === -1) && (R._status = 1,
                R._result = J)
            }, function(J) {
                (R._status === 0 || R._status === -1) && (R._status = 2,
                R._result = J)
            }),
            R._status === -1 && (R._status = 0,
            R._result = Y)
        }
        if (R._status === 1)
            return R._result.default;
        throw R._result
    }
    var W = typeof reportError == "function" ? reportError : function(R) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var Y = new window.ErrorEvent("error",{
                bubbles: !0,
                cancelable: !0,
                message: typeof R == "object" && R !== null && typeof R.message == "string" ? String(R.message) : String(R),
                error: R
            });
            if (!window.dispatchEvent(Y))
                return
        } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", R);
            return
        }
        console.error(R)
    }
    ;
    function dt() {}
    return ut.Children = {
        map: z,
        forEach: function(R, Y, J) {
            z(R, function() {
                Y.apply(this, arguments)
            }, J)
        },
        count: function(R) {
            var Y = 0;
            return z(R, function() {
                Y++
            }),
            Y
        },
        toArray: function(R) {
            return z(R, function(Y) {
                return Y
            }) || []
        },
        only: function(R) {
            if (!tt(R))
                throw Error("React.Children.only expected to receive a single React element child.");
            return R
        }
    },
    ut.Component = A,
    ut.Fragment = s,
    ut.Profiler = u,
    ut.PureComponent = q,
    ut.StrictMode = o,
    ut.Suspense = d,
    ut.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = j,
    ut.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(R) {
            return j.H.useMemoCache(R)
        }
    },
    ut.cache = function(R) {
        return function() {
            return R.apply(null, arguments)
        }
    }
    ,
    ut.cloneElement = function(R, Y, J) {
        if (R == null)
            throw Error("The argument must be a React element, but you passed " + R + ".");
        var $ = C({}, R.props)
          , nt = R.key
          , yt = void 0;
        if (Y != null)
            for (ot in Y.ref !== void 0 && (yt = void 0),
            Y.key !== void 0 && (nt = "" + Y.key),
            Y)
                !Z.call(Y, ot) || ot === "key" || ot === "__self" || ot === "__source" || ot === "ref" && Y.ref === void 0 || ($[ot] = Y[ot]);
        var ot = arguments.length - 2;
        if (ot === 1)
            $.children = J;
        else if (1 < ot) {
            for (var ae = Array(ot), bt = 0; bt < ot; bt++)
                ae[bt] = arguments[bt + 2];
            $.children = ae
        }
        return Q(R.type, nt, void 0, void 0, yt, $)
    }
    ,
    ut.createContext = function(R) {
        return R = {
            $$typeof: h,
            _currentValue: R,
            _currentValue2: R,
            _threadCount: 0,
            Provider: null,
            Consumer: null
        },
        R.Provider = R,
        R.Consumer = {
            $$typeof: f,
            _context: R
        },
        R
    }
    ,
    ut.createElement = function(R, Y, J) {
        var $, nt = {}, yt = null;
        if (Y != null)
            for ($ in Y.key !== void 0 && (yt = "" + Y.key),
            Y)
                Z.call(Y, $) && $ !== "key" && $ !== "__self" && $ !== "__source" && (nt[$] = Y[$]);
        var ot = arguments.length - 2;
        if (ot === 1)
            nt.children = J;
        else if (1 < ot) {
            for (var ae = Array(ot), bt = 0; bt < ot; bt++)
                ae[bt] = arguments[bt + 2];
            nt.children = ae
        }
        if (R && R.defaultProps)
            for ($ in ot = R.defaultProps,
            ot)
                nt[$] === void 0 && (nt[$] = ot[$]);
        return Q(R, yt, void 0, void 0, null, nt)
    }
    ,
    ut.createRef = function() {
        return {
            current: null
        }
    }
    ,
    ut.forwardRef = function(R) {
        return {
            $$typeof: p,
            render: R
        }
    }
    ,
    ut.isValidElement = tt,
    ut.lazy = function(R) {
        return {
            $$typeof: y,
            _payload: {
                _status: -1,
                _result: R
            },
            _init: k
        }
    }
    ,
    ut.memo = function(R, Y) {
        return {
            $$typeof: m,
            type: R,
            compare: Y === void 0 ? null : Y
        }
    }
    ,
    ut.startTransition = function(R) {
        var Y = j.T
          , J = {};
        j.T = J;
        try {
            var $ = R()
              , nt = j.S;
            nt !== null && nt(J, $),
            typeof $ == "object" && $ !== null && typeof $.then == "function" && $.then(dt, W)
        } catch (yt) {
            W(yt)
        } finally {
            j.T = Y
        }
    }
    ,
    ut.unstable_useCacheRefresh = function() {
        return j.H.useCacheRefresh()
    }
    ,
    ut.use = function(R) {
        return j.H.use(R)
    }
    ,
    ut.useActionState = function(R, Y, J) {
        return j.H.useActionState(R, Y, J)
    }
    ,
    ut.useCallback = function(R, Y) {
        return j.H.useCallback(R, Y)
    }
    ,
    ut.useContext = function(R) {
        return j.H.useContext(R)
    }
    ,
    ut.useDebugValue = function() {}
    ,
    ut.useDeferredValue = function(R, Y) {
        return j.H.useDeferredValue(R, Y)
    }
    ,
    ut.useEffect = function(R, Y, J) {
        var $ = j.H;
        if (typeof J == "function")
            throw Error("useEffect CRUD overload is not enabled in this build of React.");
        return $.useEffect(R, Y)
    }
    ,
    ut.useId = function() {
        return j.H.useId()
    }
    ,
    ut.useImperativeHandle = function(R, Y, J) {
        return j.H.useImperativeHandle(R, Y, J)
    }
    ,
    ut.useInsertionEffect = function(R, Y) {
        return j.H.useInsertionEffect(R, Y)
    }
    ,
    ut.useLayoutEffect = function(R, Y) {
        return j.H.useLayoutEffect(R, Y)
    }
    ,
    ut.useMemo = function(R, Y) {
        return j.H.useMemo(R, Y)
    }
    ,
    ut.useOptimistic = function(R, Y) {
        return j.H.useOptimistic(R, Y)
    }
    ,
    ut.useReducer = function(R, Y, J) {
        return j.H.useReducer(R, Y, J)
    }
    ,
    ut.useRef = function(R) {
        return j.H.useRef(R)
    }
    ,
    ut.useState = function(R) {
        return j.H.useState(R)
    }
    ,
    ut.useSyncExternalStore = function(R, Y, J) {
        return j.H.useSyncExternalStore(R, Y, J)
    }
    ,
    ut.useTransition = function() {
        return j.H.useTransition()
    }
    ,
    ut.version = "19.1.1",
    ut
}
var d0;
function rl() {
    return d0 || (d0 = 1,
    _c.exports = v3()),
    _c.exports
}
var H = rl();
const tl = m3(H);
var Ac = {
    exports: {}
}
  , Ps = {}
  , Dc = {
    exports: {}
}
  , Lc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var m0;
function g3() {
    return m0 || (m0 = 1,
    (function(n) {
        function a(z, k) {
            var W = z.length;
            z.push(k);
            t: for (; 0 < W; ) {
                var dt = W - 1 >>> 1
                  , R = z[dt];
                if (0 < u(R, k))
                    z[dt] = k,
                    z[W] = R,
                    W = dt;
                else
                    break t
            }
        }
        function s(z) {
            return z.length === 0 ? null : z[0]
        }
        function o(z) {
            if (z.length === 0)
                return null;
            var k = z[0]
              , W = z.pop();
            if (W !== k) {
                z[0] = W;
                t: for (var dt = 0, R = z.length, Y = R >>> 1; dt < Y; ) {
                    var J = 2 * (dt + 1) - 1
                      , $ = z[J]
                      , nt = J + 1
                      , yt = z[nt];
                    if (0 > u($, W))
                        nt < R && 0 > u(yt, $) ? (z[dt] = yt,
                        z[nt] = W,
                        dt = nt) : (z[dt] = $,
                        z[J] = W,
                        dt = J);
                    else if (nt < R && 0 > u(yt, W))
                        z[dt] = yt,
                        z[nt] = W,
                        dt = nt;
                    else
                        break t
                }
            }
            return k
        }
        function u(z, k) {
            var W = z.sortIndex - k.sortIndex;
            return W !== 0 ? W : z.id - k.id
        }
        if (n.unstable_now = void 0,
        typeof performance == "object" && typeof performance.now == "function") {
            var f = performance;
            n.unstable_now = function() {
                return f.now()
            }
        } else {
            var h = Date
              , p = h.now();
            n.unstable_now = function() {
                return h.now() - p
            }
        }
        var d = []
          , m = []
          , y = 1
          , g = null
          , S = 3
          , T = !1
          , C = !1
          , E = !1
          , A = !1
          , V = typeof setTimeout == "function" ? setTimeout : null
          , q = typeof clearTimeout == "function" ? clearTimeout : null
          , B = typeof setImmediate < "u" ? setImmediate : null;
        function G(z) {
            for (var k = s(m); k !== null; ) {
                if (k.callback === null)
                    o(m);
                else if (k.startTime <= z)
                    o(m),
                    k.sortIndex = k.expirationTime,
                    a(d, k);
                else
                    break;
                k = s(m)
            }
        }
        function j(z) {
            if (E = !1,
            G(z),
            !C)
                if (s(d) !== null)
                    C = !0,
                    Z || (Z = !0,
                    ft());
                else {
                    var k = s(m);
                    k !== null && Lt(j, k.startTime - z)
                }
        }
        var Z = !1
          , Q = -1
          , K = 5
          , tt = -1;
        function F() {
            return A ? !0 : !(n.unstable_now() - tt < K)
        }
        function rt() {
            if (A = !1,
            Z) {
                var z = n.unstable_now();
                tt = z;
                var k = !0;
                try {
                    t: {
                        C = !1,
                        E && (E = !1,
                        q(Q),
                        Q = -1),
                        T = !0;
                        var W = S;
                        try {
                            e: {
                                for (G(z),
                                g = s(d); g !== null && !(g.expirationTime > z && F()); ) {
                                    var dt = g.callback;
                                    if (typeof dt == "function") {
                                        g.callback = null,
                                        S = g.priorityLevel;
                                        var R = dt(g.expirationTime <= z);
                                        if (z = n.unstable_now(),
                                        typeof R == "function") {
                                            g.callback = R,
                                            G(z),
                                            k = !0;
                                            break e
                                        }
                                        g === s(d) && o(d),
                                        G(z)
                                    } else
                                        o(d);
                                    g = s(d)
                                }
                                if (g !== null)
                                    k = !0;
                                else {
                                    var Y = s(m);
                                    Y !== null && Lt(j, Y.startTime - z),
                                    k = !1
                                }
                            }
                            break t
                        } finally {
                            g = null,
                            S = W,
                            T = !1
                        }
                        k = void 0
                    }
                } finally {
                    k ? ft() : Z = !1
                }
            }
        }
        var ft;
        if (typeof B == "function")
            ft = function() {
                B(rt)
            }
            ;
        else if (typeof MessageChannel < "u") {
            var Gt = new MessageChannel
              , _t = Gt.port2;
            Gt.port1.onmessage = rt,
            ft = function() {
                _t.postMessage(null)
            }
        } else
            ft = function() {
                V(rt, 0)
            }
            ;
        function Lt(z, k) {
            Q = V(function() {
                z(n.unstable_now())
            }, k)
        }
        n.unstable_IdlePriority = 5,
        n.unstable_ImmediatePriority = 1,
        n.unstable_LowPriority = 4,
        n.unstable_NormalPriority = 3,
        n.unstable_Profiling = null,
        n.unstable_UserBlockingPriority = 2,
        n.unstable_cancelCallback = function(z) {
            z.callback = null
        }
        ,
        n.unstable_forceFrameRate = function(z) {
            0 > z || 125 < z ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : K = 0 < z ? Math.floor(1e3 / z) : 5
        }
        ,
        n.unstable_getCurrentPriorityLevel = function() {
            return S
        }
        ,
        n.unstable_next = function(z) {
            switch (S) {
            case 1:
            case 2:
            case 3:
                var k = 3;
                break;
            default:
                k = S
            }
            var W = S;
            S = k;
            try {
                return z()
            } finally {
                S = W
            }
        }
        ,
        n.unstable_requestPaint = function() {
            A = !0
        }
        ,
        n.unstable_runWithPriority = function(z, k) {
            switch (z) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            default:
                z = 3
            }
            var W = S;
            S = z;
            try {
                return k()
            } finally {
                S = W
            }
        }
        ,
        n.unstable_scheduleCallback = function(z, k, W) {
            var dt = n.unstable_now();
            switch (typeof W == "object" && W !== null ? (W = W.delay,
            W = typeof W == "number" && 0 < W ? dt + W : dt) : W = dt,
            z) {
            case 1:
                var R = -1;
                break;
            case 2:
                R = 250;
                break;
            case 5:
                R = 1073741823;
                break;
            case 4:
                R = 1e4;
                break;
            default:
                R = 5e3
            }
            return R = W + R,
            z = {
                id: y++,
                callback: k,
                priorityLevel: z,
                startTime: W,
                expirationTime: R,
                sortIndex: -1
            },
            W > dt ? (z.sortIndex = W,
            a(m, z),
            s(d) === null && z === s(m) && (E ? (q(Q),
            Q = -1) : E = !0,
            Lt(j, W - dt))) : (z.sortIndex = R,
            a(d, z),
            C || T || (C = !0,
            Z || (Z = !0,
            ft()))),
            z
        }
        ,
        n.unstable_shouldYield = F,
        n.unstable_wrapCallback = function(z) {
            var k = S;
            return function() {
                var W = S;
                S = k;
                try {
                    return z.apply(this, arguments)
                } finally {
                    S = W
                }
            }
        }
    }
    )(Lc)),
    Lc
}
var p0;
function S3() {
    return p0 || (p0 = 1,
    Dc.exports = g3()),
    Dc.exports
}
var Oc = {
    exports: {}
}
  , re = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var y0;
function b3() {
    if (y0)
        return re;
    y0 = 1;
    var n = rl();
    function a(d) {
        var m = "https://react.dev/errors/" + d;
        if (1 < arguments.length) {
            m += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var y = 2; y < arguments.length; y++)
                m += "&args[]=" + encodeURIComponent(arguments[y])
        }
        return "Minified React error #" + d + "; visit " + m + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }
    function s() {}
    var o = {
        d: {
            f: s,
            r: function() {
                throw Error(a(522))
            },
            D: s,
            C: s,
            L: s,
            m: s,
            X: s,
            S: s,
            M: s
        },
        p: 0,
        findDOMNode: null
    }
      , u = Symbol.for("react.portal");
    function f(d, m, y) {
        var g = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
        return {
            $$typeof: u,
            key: g == null ? null : "" + g,
            children: d,
            containerInfo: m,
            implementation: y
        }
    }
    var h = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function p(d, m) {
        if (d === "font")
            return "";
        if (typeof m == "string")
            return m === "use-credentials" ? m : ""
    }
    return re.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o,
    re.createPortal = function(d, m) {
        var y = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!m || m.nodeType !== 1 && m.nodeType !== 9 && m.nodeType !== 11)
            throw Error(a(299));
        return f(d, m, null, y)
    }
    ,
    re.flushSync = function(d) {
        var m = h.T
          , y = o.p;
        try {
            if (h.T = null,
            o.p = 2,
            d)
                return d()
        } finally {
            h.T = m,
            o.p = y,
            o.d.f()
        }
    }
    ,
    re.preconnect = function(d, m) {
        typeof d == "string" && (m ? (m = m.crossOrigin,
        m = typeof m == "string" ? m === "use-credentials" ? m : "" : void 0) : m = null,
        o.d.C(d, m))
    }
    ,
    re.prefetchDNS = function(d) {
        typeof d == "string" && o.d.D(d)
    }
    ,
    re.preinit = function(d, m) {
        if (typeof d == "string" && m && typeof m.as == "string") {
            var y = m.as
              , g = p(y, m.crossOrigin)
              , S = typeof m.integrity == "string" ? m.integrity : void 0
              , T = typeof m.fetchPriority == "string" ? m.fetchPriority : void 0;
            y === "style" ? o.d.S(d, typeof m.precedence == "string" ? m.precedence : void 0, {
                crossOrigin: g,
                integrity: S,
                fetchPriority: T
            }) : y === "script" && o.d.X(d, {
                crossOrigin: g,
                integrity: S,
                fetchPriority: T,
                nonce: typeof m.nonce == "string" ? m.nonce : void 0
            })
        }
    }
    ,
    re.preinitModule = function(d, m) {
        if (typeof d == "string")
            if (typeof m == "object" && m !== null) {
                if (m.as == null || m.as === "script") {
                    var y = p(m.as, m.crossOrigin);
                    o.d.M(d, {
                        crossOrigin: y,
                        integrity: typeof m.integrity == "string" ? m.integrity : void 0,
                        nonce: typeof m.nonce == "string" ? m.nonce : void 0
                    })
                }
            } else
                m == null && o.d.M(d)
    }
    ,
    re.preload = function(d, m) {
        if (typeof d == "string" && typeof m == "object" && m !== null && typeof m.as == "string") {
            var y = m.as
              , g = p(y, m.crossOrigin);
            o.d.L(d, y, {
                crossOrigin: g,
                integrity: typeof m.integrity == "string" ? m.integrity : void 0,
                nonce: typeof m.nonce == "string" ? m.nonce : void 0,
                type: typeof m.type == "string" ? m.type : void 0,
                fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0,
                referrerPolicy: typeof m.referrerPolicy == "string" ? m.referrerPolicy : void 0,
                imageSrcSet: typeof m.imageSrcSet == "string" ? m.imageSrcSet : void 0,
                imageSizes: typeof m.imageSizes == "string" ? m.imageSizes : void 0,
                media: typeof m.media == "string" ? m.media : void 0
            })
        }
    }
    ,
    re.preloadModule = function(d, m) {
        if (typeof d == "string")
            if (m) {
                var y = p(m.as, m.crossOrigin);
                o.d.m(d, {
                    as: typeof m.as == "string" && m.as !== "script" ? m.as : void 0,
                    crossOrigin: y,
                    integrity: typeof m.integrity == "string" ? m.integrity : void 0
                })
            } else
                o.d.m(d)
    }
    ,
    re.requestFormReset = function(d) {
        o.d.r(d)
    }
    ,
    re.unstable_batchedUpdates = function(d, m) {
        return d(m)
    }
    ,
    re.useFormState = function(d, m, y) {
        return h.H.useFormState(d, m, y)
    }
    ,
    re.useFormStatus = function() {
        return h.H.useHostTransitionStatus()
    }
    ,
    re.version = "19.1.1",
    re
}
var v0;
function ty() {
    if (v0)
        return Oc.exports;
    v0 = 1;
    function n() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)
            } catch (a) {
                console.error(a)
            }
    }
    return n(),
    Oc.exports = b3(),
    Oc.exports
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var g0;
function T3() {
    if (g0)
        return Ps;
    g0 = 1;
    var n = S3()
      , a = rl()
      , s = ty();
    function o(t) {
        var e = "https://react.dev/errors/" + t;
        if (1 < arguments.length) {
            e += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var i = 2; i < arguments.length; i++)
                e += "&args[]=" + encodeURIComponent(arguments[i])
        }
        return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }
    function u(t) {
        return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)
    }
    function f(t) {
        var e = t
          , i = t;
        if (t.alternate)
            for (; e.return; )
                e = e.return;
        else {
            t = e;
            do
                e = t,
                (e.flags & 4098) !== 0 && (i = e.return),
                t = e.return;
            while (t)
        }
        return e.tag === 3 ? i : null
    }
    function h(t) {
        if (t.tag === 13) {
            var e = t.memoizedState;
            if (e === null && (t = t.alternate,
            t !== null && (e = t.memoizedState)),
            e !== null)
                return e.dehydrated
        }
        return null
    }
    function p(t) {
        if (f(t) !== t)
            throw Error(o(188))
    }
    function d(t) {
        var e = t.alternate;
        if (!e) {
            if (e = f(t),
            e === null)
                throw Error(o(188));
            return e !== t ? null : t
        }
        for (var i = t, l = e; ; ) {
            var r = i.return;
            if (r === null)
                break;
            var c = r.alternate;
            if (c === null) {
                if (l = r.return,
                l !== null) {
                    i = l;
                    continue
                }
                break
            }
            if (r.child === c.child) {
                for (c = r.child; c; ) {
                    if (c === i)
                        return p(r),
                        t;
                    if (c === l)
                        return p(r),
                        e;
                    c = c.sibling
                }
                throw Error(o(188))
            }
            if (i.return !== l.return)
                i = r,
                l = c;
            else {
                for (var v = !1, b = r.child; b; ) {
                    if (b === i) {
                        v = !0,
                        i = r,
                        l = c;
                        break
                    }
                    if (b === l) {
                        v = !0,
                        l = r,
                        i = c;
                        break
                    }
                    b = b.sibling
                }
                if (!v) {
                    for (b = c.child; b; ) {
                        if (b === i) {
                            v = !0,
                            i = c,
                            l = r;
                            break
                        }
                        if (b === l) {
                            v = !0,
                            l = c,
                            i = r;
                            break
                        }
                        b = b.sibling
                    }
                    if (!v)
                        throw Error(o(189))
                }
            }
            if (i.alternate !== l)
                throw Error(o(190))
        }
        if (i.tag !== 3)
            throw Error(o(188));
        return i.stateNode.current === i ? t : e
    }
    function m(t) {
        var e = t.tag;
        if (e === 5 || e === 26 || e === 27 || e === 6)
            return t;
        for (t = t.child; t !== null; ) {
            if (e = m(t),
            e !== null)
                return e;
            t = t.sibling
        }
        return null
    }
    var y = Object.assign
      , g = Symbol.for("react.element")
      , S = Symbol.for("react.transitional.element")
      , T = Symbol.for("react.portal")
      , C = Symbol.for("react.fragment")
      , E = Symbol.for("react.strict_mode")
      , A = Symbol.for("react.profiler")
      , V = Symbol.for("react.provider")
      , q = Symbol.for("react.consumer")
      , B = Symbol.for("react.context")
      , G = Symbol.for("react.forward_ref")
      , j = Symbol.for("react.suspense")
      , Z = Symbol.for("react.suspense_list")
      , Q = Symbol.for("react.memo")
      , K = Symbol.for("react.lazy")
      , tt = Symbol.for("react.activity")
      , F = Symbol.for("react.memo_cache_sentinel")
      , rt = Symbol.iterator;
    function ft(t) {
        return t === null || typeof t != "object" ? null : (t = rt && t[rt] || t["@@iterator"],
        typeof t == "function" ? t : null)
    }
    var Gt = Symbol.for("react.client.reference");
    function _t(t) {
        if (t == null)
            return null;
        if (typeof t == "function")
            return t.$$typeof === Gt ? null : t.displayName || t.name || null;
        if (typeof t == "string")
            return t;
        switch (t) {
        case C:
            return "Fragment";
        case A:
            return "Profiler";
        case E:
            return "StrictMode";
        case j:
            return "Suspense";
        case Z:
            return "SuspenseList";
        case tt:
            return "Activity"
        }
        if (typeof t == "object")
            switch (t.$$typeof) {
            case T:
                return "Portal";
            case B:
                return (t.displayName || "Context") + ".Provider";
            case q:
                return (t._context.displayName || "Context") + ".Consumer";
            case G:
                var e = t.render;
                return t = t.displayName,
                t || (t = e.displayName || e.name || "",
                t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"),
                t;
            case Q:
                return e = t.displayName || null,
                e !== null ? e : _t(t.type) || "Memo";
            case K:
                e = t._payload,
                t = t._init;
                try {
                    return _t(t(e))
                } catch {}
            }
        return null
    }
    var Lt = Array.isArray
      , z = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
      , k = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
      , W = {
        pending: !1,
        data: null,
        method: null,
        action: null
    }
      , dt = []
      , R = -1;
    function Y(t) {
        return {
            current: t
        }
    }
    function J(t) {
        0 > R || (t.current = dt[R],
        dt[R] = null,
        R--)
    }
    function $(t, e) {
        R++,
        dt[R] = t.current,
        t.current = e
    }
    var nt = Y(null)
      , yt = Y(null)
      , ot = Y(null)
      , ae = Y(null);
    function bt(t, e) {
        switch ($(ot, e),
        $(yt, t),
        $(nt, null),
        e.nodeType) {
        case 9:
        case 11:
            t = (t = e.documentElement) && (t = t.namespaceURI) ? jp(t) : 0;
            break;
        default:
            if (t = e.tagName,
            e = e.namespaceURI)
                e = jp(e),
                t = Pp(e, t);
            else
                switch (t) {
                case "svg":
                    t = 1;
                    break;
                case "math":
                    t = 2;
                    break;
                default:
                    t = 0
                }
        }
        J(nt),
        $(nt, t)
    }
    function se() {
        J(nt),
        J(yt),
        J(ot)
    }
    function si(t) {
        t.memoizedState !== null && $(ae, t);
        var e = nt.current
          , i = Pp(e, t.type);
        e !== i && ($(yt, t),
        $(nt, i))
    }
    function ke(t) {
        yt.current === t && (J(nt),
        J(yt)),
        ae.current === t && (J(ae),
        ws._currentValue = W)
    }
    var li = Object.prototype.hasOwnProperty
      , oi = n.unstable_scheduleCallback
      , Xe = n.unstable_cancelCallback
      , hr = n.unstable_shouldYield
      , dr = n.unstable_requestPaint
      , Se = n.unstable_now
      , mr = n.unstable_getCurrentPriorityLevel
      , dl = n.unstable_ImmediatePriority
      , ml = n.unstable_UserBlockingPriority
      , on = n.unstable_NormalPriority
      , Ni = n.unstable_LowPriority
      , qa = n.unstable_IdlePriority
      , pl = n.log
      , Dt = n.unstable_setDisableYieldValue
      , kt = null
      , Ut = null;
    function rn(t) {
        if (typeof pl == "function" && Dt(t),
        Ut && typeof Ut.setStrictMode == "function")
            try {
                Ut.setStrictMode(kt, t)
            } catch {}
    }
    var be = Math.clz32 ? Math.clz32 : tg
      , Wv = Math.log
      , Iv = Math.LN2;
    function tg(t) {
        return t >>>= 0,
        t === 0 ? 32 : 31 - (Wv(t) / Iv | 0) | 0
    }
    var yl = 256
      , vl = 4194304;
    function ri(t) {
        var e = t & 42;
        if (e !== 0)
            return e;
        switch (t & -t) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 4;
        case 8:
            return 8;
        case 16:
            return 16;
        case 32:
            return 32;
        case 64:
            return 64;
        case 128:
            return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return t & 4194048;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return t & 62914560;
        case 67108864:
            return 67108864;
        case 134217728:
            return 134217728;
        case 268435456:
            return 268435456;
        case 536870912:
            return 536870912;
        case 1073741824:
            return 0;
        default:
            return t
        }
    }
    function gl(t, e, i) {
        var l = t.pendingLanes;
        if (l === 0)
            return 0;
        var r = 0
          , c = t.suspendedLanes
          , v = t.pingedLanes;
        t = t.warmLanes;
        var b = l & 134217727;
        return b !== 0 ? (l = b & ~c,
        l !== 0 ? r = ri(l) : (v &= b,
        v !== 0 ? r = ri(v) : i || (i = b & ~t,
        i !== 0 && (r = ri(i))))) : (b = l & ~c,
        b !== 0 ? r = ri(b) : v !== 0 ? r = ri(v) : i || (i = l & ~t,
        i !== 0 && (r = ri(i)))),
        r === 0 ? 0 : e !== 0 && e !== r && (e & c) === 0 && (c = r & -r,
        i = e & -e,
        c >= i || c === 32 && (i & 4194048) !== 0) ? e : r
    }
    function Ya(t, e) {
        return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0
    }
    function eg(t, e) {
        switch (t) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
            return e + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return e + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
            return -1;
        default:
            return -1
        }
    }
    function Th() {
        var t = yl;
        return yl <<= 1,
        (yl & 4194048) === 0 && (yl = 256),
        t
    }
    function Ch() {
        var t = vl;
        return vl <<= 1,
        (vl & 62914560) === 0 && (vl = 4194304),
        t
    }
    function pr(t) {
        for (var e = [], i = 0; 31 > i; i++)
            e.push(t);
        return e
    }
    function Ga(t, e) {
        t.pendingLanes |= e,
        e !== 268435456 && (t.suspendedLanes = 0,
        t.pingedLanes = 0,
        t.warmLanes = 0)
    }
    function ng(t, e, i, l, r, c) {
        var v = t.pendingLanes;
        t.pendingLanes = i,
        t.suspendedLanes = 0,
        t.pingedLanes = 0,
        t.warmLanes = 0,
        t.expiredLanes &= i,
        t.entangledLanes &= i,
        t.errorRecoveryDisabledLanes &= i,
        t.shellSuspendCounter = 0;
        var b = t.entanglements
          , x = t.expirationTimes
          , L = t.hiddenUpdates;
        for (i = v & ~i; 0 < i; ) {
            var U = 31 - be(i)
              , P = 1 << U;
            b[U] = 0,
            x[U] = -1;
            var O = L[U];
            if (O !== null)
                for (L[U] = null,
                U = 0; U < O.length; U++) {
                    var w = O[U];
                    w !== null && (w.lane &= -536870913)
                }
            i &= ~P
        }
        l !== 0 && xh(t, l, 0),
        c !== 0 && r === 0 && t.tag !== 0 && (t.suspendedLanes |= c & ~(v & ~e))
    }
    function xh(t, e, i) {
        t.pendingLanes |= e,
        t.suspendedLanes &= ~e;
        var l = 31 - be(e);
        t.entangledLanes |= e,
        t.entanglements[l] = t.entanglements[l] | 1073741824 | i & 4194090
    }
    function Rh(t, e) {
        var i = t.entangledLanes |= e;
        for (t = t.entanglements; i; ) {
            var l = 31 - be(i)
              , r = 1 << l;
            r & e | t[l] & e && (t[l] |= e),
            i &= ~r
        }
    }
    function yr(t) {
        switch (t) {
        case 2:
            t = 1;
            break;
        case 8:
            t = 4;
            break;
        case 32:
            t = 16;
            break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            t = 128;
            break;
        case 268435456:
            t = 134217728;
            break;
        default:
            t = 0
        }
        return t
    }
    function vr(t) {
        return t &= -t,
        2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2
    }
    function Mh() {
        var t = k.p;
        return t !== 0 ? t : (t = window.event,
        t === void 0 ? 32 : a0(t.type))
    }
    function ig(t, e) {
        var i = k.p;
        try {
            return k.p = t,
            e()
        } finally {
            k.p = i
        }
    }
    var Dn = Math.random().toString(36).slice(2)
      , le = "__reactFiber$" + Dn
      , de = "__reactProps$" + Dn
      , ji = "__reactContainer$" + Dn
      , gr = "__reactEvents$" + Dn
      , ag = "__reactListeners$" + Dn
      , sg = "__reactHandles$" + Dn
      , Eh = "__reactResources$" + Dn
      , ka = "__reactMarker$" + Dn;
    function Sr(t) {
        delete t[le],
        delete t[de],
        delete t[gr],
        delete t[ag],
        delete t[sg]
    }
    function Pi(t) {
        var e = t[le];
        if (e)
            return e;
        for (var i = t.parentNode; i; ) {
            if (e = i[ji] || i[le]) {
                if (i = e.alternate,
                e.child !== null || i !== null && i.child !== null)
                    for (t = Gp(t); t !== null; ) {
                        if (i = t[le])
                            return i;
                        t = Gp(t)
                    }
                return e
            }
            t = i,
            i = t.parentNode
        }
        return null
    }
    function Hi(t) {
        if (t = t[le] || t[ji]) {
            var e = t.tag;
            if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
                return t
        }
        return null
    }
    function Xa(t) {
        var e = t.tag;
        if (e === 5 || e === 26 || e === 27 || e === 6)
            return t.stateNode;
        throw Error(o(33))
    }
    function qi(t) {
        var e = t[Eh];
        return e || (e = t[Eh] = {
            hoistableStyles: new Map,
            hoistableScripts: new Map
        }),
        e
    }
    function $t(t) {
        t[ka] = !0
    }
    var _h = new Set
      , Ah = {};
    function ui(t, e) {
        Yi(t, e),
        Yi(t + "Capture", e)
    }
    function Yi(t, e) {
        for (Ah[t] = e,
        t = 0; t < e.length; t++)
            _h.add(e[t])
    }
    var lg = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$")
      , Dh = {}
      , Lh = {};
    function og(t) {
        return li.call(Lh, t) ? !0 : li.call(Dh, t) ? !1 : lg.test(t) ? Lh[t] = !0 : (Dh[t] = !0,
        !1)
    }
    function Sl(t, e, i) {
        if (og(e))
            if (i === null)
                t.removeAttribute(e);
            else {
                switch (typeof i) {
                case "undefined":
                case "function":
                case "symbol":
                    t.removeAttribute(e);
                    return;
                case "boolean":
                    var l = e.toLowerCase().slice(0, 5);
                    if (l !== "data-" && l !== "aria-") {
                        t.removeAttribute(e);
                        return
                    }
                }
                t.setAttribute(e, "" + i)
            }
    }
    function bl(t, e, i) {
        if (i === null)
            t.removeAttribute(e);
        else {
            switch (typeof i) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                t.removeAttribute(e);
                return
            }
            t.setAttribute(e, "" + i)
        }
    }
    function un(t, e, i, l) {
        if (l === null)
            t.removeAttribute(i);
        else {
            switch (typeof l) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                t.removeAttribute(i);
                return
            }
            t.setAttributeNS(e, i, "" + l)
        }
    }
    var br, Oh;
    function Gi(t) {
        if (br === void 0)
            try {
                throw Error()
            } catch (i) {
                var e = i.stack.trim().match(/\n( *(at )?)/);
                br = e && e[1] || "",
                Oh = -1 < i.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < i.stack.indexOf("@") ? "@unknown:0:0" : ""
            }
        return `
` + br + t + Oh
    }
    var Tr = !1;
    function Cr(t, e) {
        if (!t || Tr)
            return "";
        Tr = !0;
        var i = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
            var l = {
                DetermineComponentFrameRoot: function() {
                    try {
                        if (e) {
                            var P = function() {
                                throw Error()
                            };
                            if (Object.defineProperty(P.prototype, "props", {
                                set: function() {
                                    throw Error()
                                }
                            }),
                            typeof Reflect == "object" && Reflect.construct) {
                                try {
                                    Reflect.construct(P, [])
                                } catch (w) {
                                    var O = w
                                }
                                Reflect.construct(t, [], P)
                            } else {
                                try {
                                    P.call()
                                } catch (w) {
                                    O = w
                                }
                                t.call(P.prototype)
                            }
                        } else {
                            try {
                                throw Error()
                            } catch (w) {
                                O = w
                            }
                            (P = t()) && typeof P.catch == "function" && P.catch(function() {})
                        }
                    } catch (w) {
                        if (w && O && typeof w.stack == "string")
                            return [w.stack, O.stack]
                    }
                    return [null, null]
                }
            };
            l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
            var r = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, "name");
            r && r.configurable && Object.defineProperty(l.DetermineComponentFrameRoot, "name", {
                value: "DetermineComponentFrameRoot"
            });
            var c = l.DetermineComponentFrameRoot()
              , v = c[0]
              , b = c[1];
            if (v && b) {
                var x = v.split(`
`)
                  , L = b.split(`
`);
                for (r = l = 0; l < x.length && !x[l].includes("DetermineComponentFrameRoot"); )
                    l++;
                for (; r < L.length && !L[r].includes("DetermineComponentFrameRoot"); )
                    r++;
                if (l === x.length || r === L.length)
                    for (l = x.length - 1,
                    r = L.length - 1; 1 <= l && 0 <= r && x[l] !== L[r]; )
                        r--;
                for (; 1 <= l && 0 <= r; l--,
                r--)
                    if (x[l] !== L[r]) {
                        if (l !== 1 || r !== 1)
                            do
                                if (l--,
                                r--,
                                0 > r || x[l] !== L[r]) {
                                    var U = `
` + x[l].replace(" at new ", " at ");
                                    return t.displayName && U.includes("<anonymous>") && (U = U.replace("<anonymous>", t.displayName)),
                                    U
                                }
                            while (1 <= l && 0 <= r);
                        break
                    }
            }
        } finally {
            Tr = !1,
            Error.prepareStackTrace = i
        }
        return (i = t ? t.displayName || t.name : "") ? Gi(i) : ""
    }
    function rg(t) {
        switch (t.tag) {
        case 26:
        case 27:
        case 5:
            return Gi(t.type);
        case 16:
            return Gi("Lazy");
        case 13:
            return Gi("Suspense");
        case 19:
            return Gi("SuspenseList");
        case 0:
        case 15:
            return Cr(t.type, !1);
        case 11:
            return Cr(t.type.render, !1);
        case 1:
            return Cr(t.type, !0);
        case 31:
            return Gi("Activity");
        default:
            return ""
        }
    }
    function Vh(t) {
        try {
            var e = "";
            do
                e += rg(t),
                t = t.return;
            while (t);
            return e
        } catch (i) {
            return `
Error generating stack: ` + i.message + `
` + i.stack
        }
    }
    function De(t) {
        switch (typeof t) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
            return t;
        case "object":
            return t;
        default:
            return ""
        }
    }
    function wh(t) {
        var e = t.type;
        return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio")
    }
    function ug(t) {
        var e = wh(t) ? "checked" : "value"
          , i = Object.getOwnPropertyDescriptor(t.constructor.prototype, e)
          , l = "" + t[e];
        if (!t.hasOwnProperty(e) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
            var r = i.get
              , c = i.set;
            return Object.defineProperty(t, e, {
                configurable: !0,
                get: function() {
                    return r.call(this)
                },
                set: function(v) {
                    l = "" + v,
                    c.call(this, v)
                }
            }),
            Object.defineProperty(t, e, {
                enumerable: i.enumerable
            }),
            {
                getValue: function() {
                    return l
                },
                setValue: function(v) {
                    l = "" + v
                },
                stopTracking: function() {
                    t._valueTracker = null,
                    delete t[e]
                }
            }
        }
    }
    function Tl(t) {
        t._valueTracker || (t._valueTracker = ug(t))
    }
    function zh(t) {
        if (!t)
            return !1;
        var e = t._valueTracker;
        if (!e)
            return !0;
        var i = e.getValue()
          , l = "";
        return t && (l = wh(t) ? t.checked ? "true" : "false" : t.value),
        t = l,
        t !== i ? (e.setValue(t),
        !0) : !1
    }
    function Cl(t) {
        if (t = t || (typeof document < "u" ? document : void 0),
        typeof t > "u")
            return null;
        try {
            return t.activeElement || t.body
        } catch {
            return t.body
        }
    }
    var cg = /[\n"\\]/g;
    function Le(t) {
        return t.replace(cg, function(e) {
            return "\\" + e.charCodeAt(0).toString(16) + " "
        })
    }
    function xr(t, e, i, l, r, c, v, b) {
        t.name = "",
        v != null && typeof v != "function" && typeof v != "symbol" && typeof v != "boolean" ? t.type = v : t.removeAttribute("type"),
        e != null ? v === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + De(e)) : t.value !== "" + De(e) && (t.value = "" + De(e)) : v !== "submit" && v !== "reset" || t.removeAttribute("value"),
        e != null ? Rr(t, v, De(e)) : i != null ? Rr(t, v, De(i)) : l != null && t.removeAttribute("value"),
        r == null && c != null && (t.defaultChecked = !!c),
        r != null && (t.checked = r && typeof r != "function" && typeof r != "symbol"),
        b != null && typeof b != "function" && typeof b != "symbol" && typeof b != "boolean" ? t.name = "" + De(b) : t.removeAttribute("name")
    }
    function Bh(t, e, i, l, r, c, v, b) {
        if (c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.type = c),
        e != null || i != null) {
            if (!(c !== "submit" && c !== "reset" || e != null))
                return;
            i = i != null ? "" + De(i) : "",
            e = e != null ? "" + De(e) : i,
            b || e === t.value || (t.value = e),
            t.defaultValue = e
        }
        l = l ?? r,
        l = typeof l != "function" && typeof l != "symbol" && !!l,
        t.checked = b ? t.checked : !!l,
        t.defaultChecked = !!l,
        v != null && typeof v != "function" && typeof v != "symbol" && typeof v != "boolean" && (t.name = v)
    }
    function Rr(t, e, i) {
        e === "number" && Cl(t.ownerDocument) === t || t.defaultValue === "" + i || (t.defaultValue = "" + i)
    }
    function ki(t, e, i, l) {
        if (t = t.options,
        e) {
            e = {};
            for (var r = 0; r < i.length; r++)
                e["$" + i[r]] = !0;
            for (i = 0; i < t.length; i++)
                r = e.hasOwnProperty("$" + t[i].value),
                t[i].selected !== r && (t[i].selected = r),
                r && l && (t[i].defaultSelected = !0)
        } else {
            for (i = "" + De(i),
            e = null,
            r = 0; r < t.length; r++) {
                if (t[r].value === i) {
                    t[r].selected = !0,
                    l && (t[r].defaultSelected = !0);
                    return
                }
                e !== null || t[r].disabled || (e = t[r])
            }
            e !== null && (e.selected = !0)
        }
    }
    function Uh(t, e, i) {
        if (e != null && (e = "" + De(e),
        e !== t.value && (t.value = e),
        i == null)) {
            t.defaultValue !== e && (t.defaultValue = e);
            return
        }
        t.defaultValue = i != null ? "" + De(i) : ""
    }
    function Nh(t, e, i, l) {
        if (e == null) {
            if (l != null) {
                if (i != null)
                    throw Error(o(92));
                if (Lt(l)) {
                    if (1 < l.length)
                        throw Error(o(93));
                    l = l[0]
                }
                i = l
            }
            i == null && (i = ""),
            e = i
        }
        i = De(e),
        t.defaultValue = i,
        l = t.textContent,
        l === i && l !== "" && l !== null && (t.value = l)
    }
    function Xi(t, e) {
        if (e) {
            var i = t.firstChild;
            if (i && i === t.lastChild && i.nodeType === 3) {
                i.nodeValue = e;
                return
            }
        }
        t.textContent = e
    }
    var fg = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function jh(t, e, i) {
        var l = e.indexOf("--") === 0;
        i == null || typeof i == "boolean" || i === "" ? l ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : l ? t.setProperty(e, i) : typeof i != "number" || i === 0 || fg.has(e) ? e === "float" ? t.cssFloat = i : t[e] = ("" + i).trim() : t[e] = i + "px"
    }
    function Ph(t, e, i) {
        if (e != null && typeof e != "object")
            throw Error(o(62));
        if (t = t.style,
        i != null) {
            for (var l in i)
                !i.hasOwnProperty(l) || e != null && e.hasOwnProperty(l) || (l.indexOf("--") === 0 ? t.setProperty(l, "") : l === "float" ? t.cssFloat = "" : t[l] = "");
            for (var r in e)
                l = e[r],
                e.hasOwnProperty(r) && i[r] !== l && jh(t, r, l)
        } else
            for (var c in e)
                e.hasOwnProperty(c) && jh(t, c, e[c])
    }
    function Mr(t) {
        if (t.indexOf("-") === -1)
            return !1;
        switch (t) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return !1;
        default:
            return !0
        }
    }
    var hg = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]])
      , dg = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function xl(t) {
        return dg.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t
    }
    var Er = null;
    function _r(t) {
        return t = t.target || t.srcElement || window,
        t.correspondingUseElement && (t = t.correspondingUseElement),
        t.nodeType === 3 ? t.parentNode : t
    }
    var Ki = null
      , Zi = null;
    function Hh(t) {
        var e = Hi(t);
        if (e && (t = e.stateNode)) {
            var i = t[de] || null;
            t: switch (t = e.stateNode,
            e.type) {
            case "input":
                if (xr(t, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name),
                e = i.name,
                i.type === "radio" && e != null) {
                    for (i = t; i.parentNode; )
                        i = i.parentNode;
                    for (i = i.querySelectorAll('input[name="' + Le("" + e) + '"][type="radio"]'),
                    e = 0; e < i.length; e++) {
                        var l = i[e];
                        if (l !== t && l.form === t.form) {
                            var r = l[de] || null;
                            if (!r)
                                throw Error(o(90));
                            xr(l, r.value, r.defaultValue, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name)
                        }
                    }
                    for (e = 0; e < i.length; e++)
                        l = i[e],
                        l.form === t.form && zh(l)
                }
                break t;
            case "textarea":
                Uh(t, i.value, i.defaultValue);
                break t;
            case "select":
                e = i.value,
                e != null && ki(t, !!i.multiple, e, !1)
            }
        }
    }
    var Ar = !1;
    function qh(t, e, i) {
        if (Ar)
            return t(e, i);
        Ar = !0;
        try {
            var l = t(e);
            return l
        } finally {
            if (Ar = !1,
            (Ki !== null || Zi !== null) && (ro(),
            Ki && (e = Ki,
            t = Zi,
            Zi = Ki = null,
            Hh(e),
            t)))
                for (e = 0; e < t.length; e++)
                    Hh(t[e])
        }
    }
    function Ka(t, e) {
        var i = t.stateNode;
        if (i === null)
            return null;
        var l = i[de] || null;
        if (l === null)
            return null;
        i = l[e];
        t: switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            (l = !l.disabled) || (t = t.type,
            l = !(t === "button" || t === "input" || t === "select" || t === "textarea")),
            t = !l;
            break t;
        default:
            t = !1
        }
        if (t)
            return null;
        if (i && typeof i != "function")
            throw Error(o(231, e, typeof i));
        return i
    }
    var cn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u")
      , Dr = !1;
    if (cn)
        try {
            var Za = {};
            Object.defineProperty(Za, "passive", {
                get: function() {
                    Dr = !0
                }
            }),
            window.addEventListener("test", Za, Za),
            window.removeEventListener("test", Za, Za)
        } catch {
            Dr = !1
        }
    var Ln = null
      , Lr = null
      , Rl = null;
    function Yh() {
        if (Rl)
            return Rl;
        var t, e = Lr, i = e.length, l, r = "value" in Ln ? Ln.value : Ln.textContent, c = r.length;
        for (t = 0; t < i && e[t] === r[t]; t++)
            ;
        var v = i - t;
        for (l = 1; l <= v && e[i - l] === r[c - l]; l++)
            ;
        return Rl = r.slice(t, 1 < l ? 1 - l : void 0)
    }
    function Ml(t) {
        var e = t.keyCode;
        return "charCode" in t ? (t = t.charCode,
        t === 0 && e === 13 && (t = 13)) : t = e,
        t === 10 && (t = 13),
        32 <= t || t === 13 ? t : 0
    }
    function El() {
        return !0
    }
    function Gh() {
        return !1
    }
    function me(t) {
        function e(i, l, r, c, v) {
            this._reactName = i,
            this._targetInst = r,
            this.type = l,
            this.nativeEvent = c,
            this.target = v,
            this.currentTarget = null;
            for (var b in t)
                t.hasOwnProperty(b) && (i = t[b],
                this[b] = i ? i(c) : c[b]);
            return this.isDefaultPrevented = (c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1) ? El : Gh,
            this.isPropagationStopped = Gh,
            this
        }
        return y(e.prototype, {
            preventDefault: function() {
                this.defaultPrevented = !0;
                var i = this.nativeEvent;
                i && (i.preventDefault ? i.preventDefault() : typeof i.returnValue != "unknown" && (i.returnValue = !1),
                this.isDefaultPrevented = El)
            },
            stopPropagation: function() {
                var i = this.nativeEvent;
                i && (i.stopPropagation ? i.stopPropagation() : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0),
                this.isPropagationStopped = El)
            },
            persist: function() {},
            isPersistent: El
        }),
        e
    }
    var ci = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(t) {
            return t.timeStamp || Date.now()
        },
        defaultPrevented: 0,
        isTrusted: 0
    }, _l = me(ci), Qa = y({}, ci, {
        view: 0,
        detail: 0
    }), mg = me(Qa), Or, Vr, Fa, Al = y({}, Qa, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: zr,
        button: 0,
        buttons: 0,
        relatedTarget: function(t) {
            return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget
        },
        movementX: function(t) {
            return "movementX" in t ? t.movementX : (t !== Fa && (Fa && t.type === "mousemove" ? (Or = t.screenX - Fa.screenX,
            Vr = t.screenY - Fa.screenY) : Vr = Or = 0,
            Fa = t),
            Or)
        },
        movementY: function(t) {
            return "movementY" in t ? t.movementY : Vr
        }
    }), kh = me(Al), pg = y({}, Al, {
        dataTransfer: 0
    }), yg = me(pg), vg = y({}, Qa, {
        relatedTarget: 0
    }), wr = me(vg), gg = y({}, ci, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }), Sg = me(gg), bg = y({}, ci, {
        clipboardData: function(t) {
            return "clipboardData" in t ? t.clipboardData : window.clipboardData
        }
    }), Tg = me(bg), Cg = y({}, ci, {
        data: 0
    }), Xh = me(Cg), xg = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, Rg = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    }, Mg = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };
    function Eg(t) {
        var e = this.nativeEvent;
        return e.getModifierState ? e.getModifierState(t) : (t = Mg[t]) ? !!e[t] : !1
    }
    function zr() {
        return Eg
    }
    var _g = y({}, Qa, {
        key: function(t) {
            if (t.key) {
                var e = xg[t.key] || t.key;
                if (e !== "Unidentified")
                    return e
            }
            return t.type === "keypress" ? (t = Ml(t),
            t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Rg[t.keyCode] || "Unidentified" : ""
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: zr,
        charCode: function(t) {
            return t.type === "keypress" ? Ml(t) : 0
        },
        keyCode: function(t) {
            return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0
        },
        which: function(t) {
            return t.type === "keypress" ? Ml(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0
        }
    })
      , Ag = me(_g)
      , Dg = y({}, Al, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    })
      , Kh = me(Dg)
      , Lg = y({}, Qa, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: zr
    })
      , Og = me(Lg)
      , Vg = y({}, ci, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    })
      , wg = me(Vg)
      , zg = y({}, Al, {
        deltaX: function(t) {
            return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0
        },
        deltaY: function(t) {
            return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0
        },
        deltaZ: 0,
        deltaMode: 0
    })
      , Bg = me(zg)
      , Ug = y({}, ci, {
        newState: 0,
        oldState: 0
    })
      , Ng = me(Ug)
      , jg = [9, 13, 27, 32]
      , Br = cn && "CompositionEvent" in window
      , $a = null;
    cn && "documentMode" in document && ($a = document.documentMode);
    var Pg = cn && "TextEvent" in window && !$a
      , Zh = cn && (!Br || $a && 8 < $a && 11 >= $a)
      , Qh = " "
      , Fh = !1;
    function $h(t, e) {
        switch (t) {
        case "keyup":
            return jg.indexOf(e.keyCode) !== -1;
        case "keydown":
            return e.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
            return !0;
        default:
            return !1
        }
    }
    function Jh(t) {
        return t = t.detail,
        typeof t == "object" && "data" in t ? t.data : null
    }
    var Qi = !1;
    function Hg(t, e) {
        switch (t) {
        case "compositionend":
            return Jh(e);
        case "keypress":
            return e.which !== 32 ? null : (Fh = !0,
            Qh);
        case "textInput":
            return t = e.data,
            t === Qh && Fh ? null : t;
        default:
            return null
        }
    }
    function qg(t, e) {
        if (Qi)
            return t === "compositionend" || !Br && $h(t, e) ? (t = Yh(),
            Rl = Lr = Ln = null,
            Qi = !1,
            t) : null;
        switch (t) {
        case "paste":
            return null;
        case "keypress":
            if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
                if (e.char && 1 < e.char.length)
                    return e.char;
                if (e.which)
                    return String.fromCharCode(e.which)
            }
            return null;
        case "compositionend":
            return Zh && e.locale !== "ko" ? null : e.data;
        default:
            return null
        }
    }
    var Yg = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0
    };
    function Wh(t) {
        var e = t && t.nodeName && t.nodeName.toLowerCase();
        return e === "input" ? !!Yg[t.type] : e === "textarea"
    }
    function Ih(t, e, i, l) {
        Ki ? Zi ? Zi.push(l) : Zi = [l] : Ki = l,
        e = po(e, "onChange"),
        0 < e.length && (i = new _l("onChange","change",null,i,l),
        t.push({
            event: i,
            listeners: e
        }))
    }
    var Ja = null
      , Wa = null;
    function Gg(t) {
        wp(t, 0)
    }
    function Dl(t) {
        var e = Xa(t);
        if (zh(e))
            return t
    }
    function td(t, e) {
        if (t === "change")
            return e
    }
    var ed = !1;
    if (cn) {
        var Ur;
        if (cn) {
            var Nr = "oninput" in document;
            if (!Nr) {
                var nd = document.createElement("div");
                nd.setAttribute("oninput", "return;"),
                Nr = typeof nd.oninput == "function"
            }
            Ur = Nr
        } else
            Ur = !1;
        ed = Ur && (!document.documentMode || 9 < document.documentMode)
    }
    function id() {
        Ja && (Ja.detachEvent("onpropertychange", ad),
        Wa = Ja = null)
    }
    function ad(t) {
        if (t.propertyName === "value" && Dl(Wa)) {
            var e = [];
            Ih(e, Wa, t, _r(t)),
            qh(Gg, e)
        }
    }
    function kg(t, e, i) {
        t === "focusin" ? (id(),
        Ja = e,
        Wa = i,
        Ja.attachEvent("onpropertychange", ad)) : t === "focusout" && id()
    }
    function Xg(t) {
        if (t === "selectionchange" || t === "keyup" || t === "keydown")
            return Dl(Wa)
    }
    function Kg(t, e) {
        if (t === "click")
            return Dl(e)
    }
    function Zg(t, e) {
        if (t === "input" || t === "change")
            return Dl(e)
    }
    function Qg(t, e) {
        return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e
    }
    var Te = typeof Object.is == "function" ? Object.is : Qg;
    function Ia(t, e) {
        if (Te(t, e))
            return !0;
        if (typeof t != "object" || t === null || typeof e != "object" || e === null)
            return !1;
        var i = Object.keys(t)
          , l = Object.keys(e);
        if (i.length !== l.length)
            return !1;
        for (l = 0; l < i.length; l++) {
            var r = i[l];
            if (!li.call(e, r) || !Te(t[r], e[r]))
                return !1
        }
        return !0
    }
    function sd(t) {
        for (; t && t.firstChild; )
            t = t.firstChild;
        return t
    }
    function ld(t, e) {
        var i = sd(t);
        t = 0;
        for (var l; i; ) {
            if (i.nodeType === 3) {
                if (l = t + i.textContent.length,
                t <= e && l >= e)
                    return {
                        node: i,
                        offset: e - t
                    };
                t = l
            }
            t: {
                for (; i; ) {
                    if (i.nextSibling) {
                        i = i.nextSibling;
                        break t
                    }
                    i = i.parentNode
                }
                i = void 0
            }
            i = sd(i)
        }
    }
    function od(t, e) {
        return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? od(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1
    }
    function rd(t) {
        t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
        for (var e = Cl(t.document); e instanceof t.HTMLIFrameElement; ) {
            try {
                var i = typeof e.contentWindow.location.href == "string"
            } catch {
                i = !1
            }
            if (i)
                t = e.contentWindow;
            else
                break;
            e = Cl(t.document)
        }
        return e
    }
    function jr(t) {
        var e = t && t.nodeName && t.nodeName.toLowerCase();
        return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true")
    }
    var Fg = cn && "documentMode" in document && 11 >= document.documentMode
      , Fi = null
      , Pr = null
      , ts = null
      , Hr = !1;
    function ud(t, e, i) {
        var l = i.window === i ? i.document : i.nodeType === 9 ? i : i.ownerDocument;
        Hr || Fi == null || Fi !== Cl(l) || (l = Fi,
        "selectionStart" in l && jr(l) ? l = {
            start: l.selectionStart,
            end: l.selectionEnd
        } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(),
        l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset
        }),
        ts && Ia(ts, l) || (ts = l,
        l = po(Pr, "onSelect"),
        0 < l.length && (e = new _l("onSelect","select",null,e,i),
        t.push({
            event: e,
            listeners: l
        }),
        e.target = Fi)))
    }
    function fi(t, e) {
        var i = {};
        return i[t.toLowerCase()] = e.toLowerCase(),
        i["Webkit" + t] = "webkit" + e,
        i["Moz" + t] = "moz" + e,
        i
    }
    var $i = {
        animationend: fi("Animation", "AnimationEnd"),
        animationiteration: fi("Animation", "AnimationIteration"),
        animationstart: fi("Animation", "AnimationStart"),
        transitionrun: fi("Transition", "TransitionRun"),
        transitionstart: fi("Transition", "TransitionStart"),
        transitioncancel: fi("Transition", "TransitionCancel"),
        transitionend: fi("Transition", "TransitionEnd")
    }
      , qr = {}
      , cd = {};
    cn && (cd = document.createElement("div").style,
    "AnimationEvent" in window || (delete $i.animationend.animation,
    delete $i.animationiteration.animation,
    delete $i.animationstart.animation),
    "TransitionEvent" in window || delete $i.transitionend.transition);
    function hi(t) {
        if (qr[t])
            return qr[t];
        if (!$i[t])
            return t;
        var e = $i[t], i;
        for (i in e)
            if (e.hasOwnProperty(i) && i in cd)
                return qr[t] = e[i];
        return t
    }
    var fd = hi("animationend")
      , hd = hi("animationiteration")
      , dd = hi("animationstart")
      , $g = hi("transitionrun")
      , Jg = hi("transitionstart")
      , Wg = hi("transitioncancel")
      , md = hi("transitionend")
      , pd = new Map
      , Yr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    Yr.push("scrollEnd");
    function Ke(t, e) {
        pd.set(t, e),
        ui(e, [t])
    }
    var yd = new WeakMap;
    function Oe(t, e) {
        if (typeof t == "object" && t !== null) {
            var i = yd.get(t);
            return i !== void 0 ? i : (e = {
                value: t,
                source: e,
                stack: Vh(e)
            },
            yd.set(t, e),
            e)
        }
        return {
            value: t,
            source: e,
            stack: Vh(e)
        }
    }
    var Ve = []
      , Ji = 0
      , Gr = 0;
    function Ll() {
        for (var t = Ji, e = Gr = Ji = 0; e < t; ) {
            var i = Ve[e];
            Ve[e++] = null;
            var l = Ve[e];
            Ve[e++] = null;
            var r = Ve[e];
            Ve[e++] = null;
            var c = Ve[e];
            if (Ve[e++] = null,
            l !== null && r !== null) {
                var v = l.pending;
                v === null ? r.next = r : (r.next = v.next,
                v.next = r),
                l.pending = r
            }
            c !== 0 && vd(i, r, c)
        }
    }
    function Ol(t, e, i, l) {
        Ve[Ji++] = t,
        Ve[Ji++] = e,
        Ve[Ji++] = i,
        Ve[Ji++] = l,
        Gr |= l,
        t.lanes |= l,
        t = t.alternate,
        t !== null && (t.lanes |= l)
    }
    function kr(t, e, i, l) {
        return Ol(t, e, i, l),
        Vl(t)
    }
    function Wi(t, e) {
        return Ol(t, null, null, e),
        Vl(t)
    }
    function vd(t, e, i) {
        t.lanes |= i;
        var l = t.alternate;
        l !== null && (l.lanes |= i);
        for (var r = !1, c = t.return; c !== null; )
            c.childLanes |= i,
            l = c.alternate,
            l !== null && (l.childLanes |= i),
            c.tag === 22 && (t = c.stateNode,
            t === null || t._visibility & 1 || (r = !0)),
            t = c,
            c = c.return;
        return t.tag === 3 ? (c = t.stateNode,
        r && e !== null && (r = 31 - be(i),
        t = c.hiddenUpdates,
        l = t[r],
        l === null ? t[r] = [e] : l.push(e),
        e.lane = i | 536870912),
        c) : null
    }
    function Vl(t) {
        if (50 < Ms)
            throw Ms = 0,
            $u = null,
            Error(o(185));
        for (var e = t.return; e !== null; )
            t = e,
            e = t.return;
        return t.tag === 3 ? t.stateNode : null
    }
    var Ii = {};
    function Ig(t, e, i, l) {
        this.tag = t,
        this.key = i,
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null,
        this.index = 0,
        this.refCleanup = this.ref = null,
        this.pendingProps = e,
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null,
        this.mode = l,
        this.subtreeFlags = this.flags = 0,
        this.deletions = null,
        this.childLanes = this.lanes = 0,
        this.alternate = null
    }
    function Ce(t, e, i, l) {
        return new Ig(t,e,i,l)
    }
    function Xr(t) {
        return t = t.prototype,
        !(!t || !t.isReactComponent)
    }
    function fn(t, e) {
        var i = t.alternate;
        return i === null ? (i = Ce(t.tag, e, t.key, t.mode),
        i.elementType = t.elementType,
        i.type = t.type,
        i.stateNode = t.stateNode,
        i.alternate = t,
        t.alternate = i) : (i.pendingProps = e,
        i.type = t.type,
        i.flags = 0,
        i.subtreeFlags = 0,
        i.deletions = null),
        i.flags = t.flags & 65011712,
        i.childLanes = t.childLanes,
        i.lanes = t.lanes,
        i.child = t.child,
        i.memoizedProps = t.memoizedProps,
        i.memoizedState = t.memoizedState,
        i.updateQueue = t.updateQueue,
        e = t.dependencies,
        i.dependencies = e === null ? null : {
            lanes: e.lanes,
            firstContext: e.firstContext
        },
        i.sibling = t.sibling,
        i.index = t.index,
        i.ref = t.ref,
        i.refCleanup = t.refCleanup,
        i
    }
    function gd(t, e) {
        t.flags &= 65011714;
        var i = t.alternate;
        return i === null ? (t.childLanes = 0,
        t.lanes = e,
        t.child = null,
        t.subtreeFlags = 0,
        t.memoizedProps = null,
        t.memoizedState = null,
        t.updateQueue = null,
        t.dependencies = null,
        t.stateNode = null) : (t.childLanes = i.childLanes,
        t.lanes = i.lanes,
        t.child = i.child,
        t.subtreeFlags = 0,
        t.deletions = null,
        t.memoizedProps = i.memoizedProps,
        t.memoizedState = i.memoizedState,
        t.updateQueue = i.updateQueue,
        t.type = i.type,
        e = i.dependencies,
        t.dependencies = e === null ? null : {
            lanes: e.lanes,
            firstContext: e.firstContext
        }),
        t
    }
    function wl(t, e, i, l, r, c) {
        var v = 0;
        if (l = t,
        typeof t == "function")
            Xr(t) && (v = 1);
        else if (typeof t == "string")
            v = e3(t, i, nt.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
        else
            t: switch (t) {
            case tt:
                return t = Ce(31, i, e, r),
                t.elementType = tt,
                t.lanes = c,
                t;
            case C:
                return di(i.children, r, c, e);
            case E:
                v = 8,
                r |= 24;
                break;
            case A:
                return t = Ce(12, i, e, r | 2),
                t.elementType = A,
                t.lanes = c,
                t;
            case j:
                return t = Ce(13, i, e, r),
                t.elementType = j,
                t.lanes = c,
                t;
            case Z:
                return t = Ce(19, i, e, r),
                t.elementType = Z,
                t.lanes = c,
                t;
            default:
                if (typeof t == "object" && t !== null)
                    switch (t.$$typeof) {
                    case V:
                    case B:
                        v = 10;
                        break t;
                    case q:
                        v = 9;
                        break t;
                    case G:
                        v = 11;
                        break t;
                    case Q:
                        v = 14;
                        break t;
                    case K:
                        v = 16,
                        l = null;
                        break t
                    }
                v = 29,
                i = Error(o(130, t === null ? "null" : typeof t, "")),
                l = null
            }
        return e = Ce(v, i, e, r),
        e.elementType = t,
        e.type = l,
        e.lanes = c,
        e
    }
    function di(t, e, i, l) {
        return t = Ce(7, t, l, e),
        t.lanes = i,
        t
    }
    function Kr(t, e, i) {
        return t = Ce(6, t, null, e),
        t.lanes = i,
        t
    }
    function Zr(t, e, i) {
        return e = Ce(4, t.children !== null ? t.children : [], t.key, e),
        e.lanes = i,
        e.stateNode = {
            containerInfo: t.containerInfo,
            pendingChildren: null,
            implementation: t.implementation
        },
        e
    }
    var ta = []
      , ea = 0
      , zl = null
      , Bl = 0
      , we = []
      , ze = 0
      , mi = null
      , hn = 1
      , dn = "";
    function pi(t, e) {
        ta[ea++] = Bl,
        ta[ea++] = zl,
        zl = t,
        Bl = e
    }
    function Sd(t, e, i) {
        we[ze++] = hn,
        we[ze++] = dn,
        we[ze++] = mi,
        mi = t;
        var l = hn;
        t = dn;
        var r = 32 - be(l) - 1;
        l &= ~(1 << r),
        i += 1;
        var c = 32 - be(e) + r;
        if (30 < c) {
            var v = r - r % 5;
            c = (l & (1 << v) - 1).toString(32),
            l >>= v,
            r -= v,
            hn = 1 << 32 - be(e) + r | i << r | l,
            dn = c + t
        } else
            hn = 1 << c | i << r | l,
            dn = t
    }
    function Qr(t) {
        t.return !== null && (pi(t, 1),
        Sd(t, 1, 0))
    }
    function Fr(t) {
        for (; t === zl; )
            zl = ta[--ea],
            ta[ea] = null,
            Bl = ta[--ea],
            ta[ea] = null;
        for (; t === mi; )
            mi = we[--ze],
            we[ze] = null,
            dn = we[--ze],
            we[ze] = null,
            hn = we[--ze],
            we[ze] = null
    }
    var fe = null
      , Nt = null
      , St = !1
      , yi = null
      , Je = !1
      , $r = Error(o(519));
    function vi(t) {
        var e = Error(o(418, ""));
        throw is(Oe(e, t)),
        $r
    }
    function bd(t) {
        var e = t.stateNode
          , i = t.type
          , l = t.memoizedProps;
        switch (e[le] = t,
        e[de] = l,
        i) {
        case "dialog":
            pt("cancel", e),
            pt("close", e);
            break;
        case "iframe":
        case "object":
        case "embed":
            pt("load", e);
            break;
        case "video":
        case "audio":
            for (i = 0; i < _s.length; i++)
                pt(_s[i], e);
            break;
        case "source":
            pt("error", e);
            break;
        case "img":
        case "image":
        case "link":
            pt("error", e),
            pt("load", e);
            break;
        case "details":
            pt("toggle", e);
            break;
        case "input":
            pt("invalid", e),
            Bh(e, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0),
            Tl(e);
            break;
        case "select":
            pt("invalid", e);
            break;
        case "textarea":
            pt("invalid", e),
            Nh(e, l.value, l.defaultValue, l.children),
            Tl(e)
        }
        i = l.children,
        typeof i != "string" && typeof i != "number" && typeof i != "bigint" || e.textContent === "" + i || l.suppressHydrationWarning === !0 || Np(e.textContent, i) ? (l.popover != null && (pt("beforetoggle", e),
        pt("toggle", e)),
        l.onScroll != null && pt("scroll", e),
        l.onScrollEnd != null && pt("scrollend", e),
        l.onClick != null && (e.onclick = yo),
        e = !0) : e = !1,
        e || vi(t)
    }
    function Td(t) {
        for (fe = t.return; fe; )
            switch (fe.tag) {
            case 5:
            case 13:
                Je = !1;
                return;
            case 27:
            case 3:
                Je = !0;
                return;
            default:
                fe = fe.return
            }
    }
    function es(t) {
        if (t !== fe)
            return !1;
        if (!St)
            return Td(t),
            St = !0,
            !1;
        var e = t.tag, i;
        if ((i = e !== 3 && e !== 27) && ((i = e === 5) && (i = t.type,
        i = !(i !== "form" && i !== "button") || hc(t.type, t.memoizedProps)),
        i = !i),
        i && Nt && vi(t),
        Td(t),
        e === 13) {
            if (t = t.memoizedState,
            t = t !== null ? t.dehydrated : null,
            !t)
                throw Error(o(317));
            t: {
                for (t = t.nextSibling,
                e = 0; t; ) {
                    if (t.nodeType === 8)
                        if (i = t.data,
                        i === "/$") {
                            if (e === 0) {
                                Nt = Qe(t.nextSibling);
                                break t
                            }
                            e--
                        } else
                            i !== "$" && i !== "$!" && i !== "$?" || e++;
                    t = t.nextSibling
                }
                Nt = null
            }
        } else
            e === 27 ? (e = Nt,
            Kn(t.type) ? (t = yc,
            yc = null,
            Nt = t) : Nt = e) : Nt = fe ? Qe(t.stateNode.nextSibling) : null;
        return !0
    }
    function ns() {
        Nt = fe = null,
        St = !1
    }
    function Cd() {
        var t = yi;
        return t !== null && (ve === null ? ve = t : ve.push.apply(ve, t),
        yi = null),
        t
    }
    function is(t) {
        yi === null ? yi = [t] : yi.push(t)
    }
    var Jr = Y(null)
      , gi = null
      , mn = null;
    function On(t, e, i) {
        $(Jr, e._currentValue),
        e._currentValue = i
    }
    function pn(t) {
        t._currentValue = Jr.current,
        J(Jr)
    }
    function Wr(t, e, i) {
        for (; t !== null; ) {
            var l = t.alternate;
            if ((t.childLanes & e) !== e ? (t.childLanes |= e,
            l !== null && (l.childLanes |= e)) : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e),
            t === i)
                break;
            t = t.return
        }
    }
    function Ir(t, e, i, l) {
        var r = t.child;
        for (r !== null && (r.return = t); r !== null; ) {
            var c = r.dependencies;
            if (c !== null) {
                var v = r.child;
                c = c.firstContext;
                t: for (; c !== null; ) {
                    var b = c;
                    c = r;
                    for (var x = 0; x < e.length; x++)
                        if (b.context === e[x]) {
                            c.lanes |= i,
                            b = c.alternate,
                            b !== null && (b.lanes |= i),
                            Wr(c.return, i, t),
                            l || (v = null);
                            break t
                        }
                    c = b.next
                }
            } else if (r.tag === 18) {
                if (v = r.return,
                v === null)
                    throw Error(o(341));
                v.lanes |= i,
                c = v.alternate,
                c !== null && (c.lanes |= i),
                Wr(v, i, t),
                v = null
            } else
                v = r.child;
            if (v !== null)
                v.return = r;
            else
                for (v = r; v !== null; ) {
                    if (v === t) {
                        v = null;
                        break
                    }
                    if (r = v.sibling,
                    r !== null) {
                        r.return = v.return,
                        v = r;
                        break
                    }
                    v = v.return
                }
            r = v
        }
    }
    function as(t, e, i, l) {
        t = null;
        for (var r = e, c = !1; r !== null; ) {
            if (!c) {
                if ((r.flags & 524288) !== 0)
                    c = !0;
                else if ((r.flags & 262144) !== 0)
                    break
            }
            if (r.tag === 10) {
                var v = r.alternate;
                if (v === null)
                    throw Error(o(387));
                if (v = v.memoizedProps,
                v !== null) {
                    var b = r.type;
                    Te(r.pendingProps.value, v.value) || (t !== null ? t.push(b) : t = [b])
                }
            } else if (r === ae.current) {
                if (v = r.alternate,
                v === null)
                    throw Error(o(387));
                v.memoizedState.memoizedState !== r.memoizedState.memoizedState && (t !== null ? t.push(ws) : t = [ws])
            }
            r = r.return
        }
        t !== null && Ir(e, t, i, l),
        e.flags |= 262144
    }
    function Ul(t) {
        for (t = t.firstContext; t !== null; ) {
            if (!Te(t.context._currentValue, t.memoizedValue))
                return !0;
            t = t.next
        }
        return !1
    }
    function Si(t) {
        gi = t,
        mn = null,
        t = t.dependencies,
        t !== null && (t.firstContext = null)
    }
    function oe(t) {
        return xd(gi, t)
    }
    function Nl(t, e) {
        return gi === null && Si(t),
        xd(t, e)
    }
    function xd(t, e) {
        var i = e._currentValue;
        if (e = {
            context: e,
            memoizedValue: i,
            next: null
        },
        mn === null) {
            if (t === null)
                throw Error(o(308));
            mn = e,
            t.dependencies = {
                lanes: 0,
                firstContext: e
            },
            t.flags |= 524288
        } else
            mn = mn.next = e;
        return i
    }
    var t2 = typeof AbortController < "u" ? AbortController : function() {
        var t = []
          , e = this.signal = {
            aborted: !1,
            addEventListener: function(i, l) {
                t.push(l)
            }
        };
        this.abort = function() {
            e.aborted = !0,
            t.forEach(function(i) {
                return i()
            })
        }
    }
      , e2 = n.unstable_scheduleCallback
      , n2 = n.unstable_NormalPriority
      , Qt = {
        $$typeof: B,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0
    };
    function tu() {
        return {
            controller: new t2,
            data: new Map,
            refCount: 0
        }
    }
    function ss(t) {
        t.refCount--,
        t.refCount === 0 && e2(n2, function() {
            t.controller.abort()
        })
    }
    var ls = null
      , eu = 0
      , na = 0
      , ia = null;
    function i2(t, e) {
        if (ls === null) {
            var i = ls = [];
            eu = 0,
            na = ic(),
            ia = {
                status: "pending",
                value: void 0,
                then: function(l) {
                    i.push(l)
                }
            }
        }
        return eu++,
        e.then(Rd, Rd),
        e
    }
    function Rd() {
        if (--eu === 0 && ls !== null) {
            ia !== null && (ia.status = "fulfilled");
            var t = ls;
            ls = null,
            na = 0,
            ia = null;
            for (var e = 0; e < t.length; e++)
                (0,
                t[e])()
        }
    }
    function a2(t, e) {
        var i = []
          , l = {
            status: "pending",
            value: null,
            reason: null,
            then: function(r) {
                i.push(r)
            }
        };
        return t.then(function() {
            l.status = "fulfilled",
            l.value = e;
            for (var r = 0; r < i.length; r++)
                (0,
                i[r])(e)
        }, function(r) {
            for (l.status = "rejected",
            l.reason = r,
            r = 0; r < i.length; r++)
                (0,
                i[r])(void 0)
        }),
        l
    }
    var Md = z.S;
    z.S = function(t, e) {
        typeof e == "object" && e !== null && typeof e.then == "function" && i2(t, e),
        Md !== null && Md(t, e)
    }
    ;
    var bi = Y(null);
    function nu() {
        var t = bi.current;
        return t !== null ? t : At.pooledCache
    }
    function jl(t, e) {
        e === null ? $(bi, bi.current) : $(bi, e.pool)
    }
    function Ed() {
        var t = nu();
        return t === null ? null : {
            parent: Qt._currentValue,
            pool: t
        }
    }
    var os = Error(o(460))
      , _d = Error(o(474))
      , Pl = Error(o(542))
      , iu = {
        then: function() {}
    };
    function Ad(t) {
        return t = t.status,
        t === "fulfilled" || t === "rejected"
    }
    function Hl() {}
    function Dd(t, e, i) {
        switch (i = t[i],
        i === void 0 ? t.push(e) : i !== e && (e.then(Hl, Hl),
        e = i),
        e.status) {
        case "fulfilled":
            return e.value;
        case "rejected":
            throw t = e.reason,
            Od(t),
            t;
        default:
            if (typeof e.status == "string")
                e.then(Hl, Hl);
            else {
                if (t = At,
                t !== null && 100 < t.shellSuspendCounter)
                    throw Error(o(482));
                t = e,
                t.status = "pending",
                t.then(function(l) {
                    if (e.status === "pending") {
                        var r = e;
                        r.status = "fulfilled",
                        r.value = l
                    }
                }, function(l) {
                    if (e.status === "pending") {
                        var r = e;
                        r.status = "rejected",
                        r.reason = l
                    }
                })
            }
            switch (e.status) {
            case "fulfilled":
                return e.value;
            case "rejected":
                throw t = e.reason,
                Od(t),
                t
            }
            throw rs = e,
            os
        }
    }
    var rs = null;
    function Ld() {
        if (rs === null)
            throw Error(o(459));
        var t = rs;
        return rs = null,
        t
    }
    function Od(t) {
        if (t === os || t === Pl)
            throw Error(o(483))
    }
    var Vn = !1;
    function au(t) {
        t.updateQueue = {
            baseState: t.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: {
                pending: null,
                lanes: 0,
                hiddenCallbacks: null
            },
            callbacks: null
        }
    }
    function su(t, e) {
        t = t.updateQueue,
        e.updateQueue === t && (e.updateQueue = {
            baseState: t.baseState,
            firstBaseUpdate: t.firstBaseUpdate,
            lastBaseUpdate: t.lastBaseUpdate,
            shared: t.shared,
            callbacks: null
        })
    }
    function wn(t) {
        return {
            lane: t,
            tag: 0,
            payload: null,
            callback: null,
            next: null
        }
    }
    function zn(t, e, i) {
        var l = t.updateQueue;
        if (l === null)
            return null;
        if (l = l.shared,
        (Tt & 2) !== 0) {
            var r = l.pending;
            return r === null ? e.next = e : (e.next = r.next,
            r.next = e),
            l.pending = e,
            e = Vl(t),
            vd(t, null, i),
            e
        }
        return Ol(t, l, e, i),
        Vl(t)
    }
    function us(t, e, i) {
        if (e = e.updateQueue,
        e !== null && (e = e.shared,
        (i & 4194048) !== 0)) {
            var l = e.lanes;
            l &= t.pendingLanes,
            i |= l,
            e.lanes = i,
            Rh(t, i)
        }
    }
    function lu(t, e) {
        var i = t.updateQueue
          , l = t.alternate;
        if (l !== null && (l = l.updateQueue,
        i === l)) {
            var r = null
              , c = null;
            if (i = i.firstBaseUpdate,
            i !== null) {
                do {
                    var v = {
                        lane: i.lane,
                        tag: i.tag,
                        payload: i.payload,
                        callback: null,
                        next: null
                    };
                    c === null ? r = c = v : c = c.next = v,
                    i = i.next
                } while (i !== null);
                c === null ? r = c = e : c = c.next = e
            } else
                r = c = e;
            i = {
                baseState: l.baseState,
                firstBaseUpdate: r,
                lastBaseUpdate: c,
                shared: l.shared,
                callbacks: l.callbacks
            },
            t.updateQueue = i;
            return
        }
        t = i.lastBaseUpdate,
        t === null ? i.firstBaseUpdate = e : t.next = e,
        i.lastBaseUpdate = e
    }
    var ou = !1;
    function cs() {
        if (ou) {
            var t = ia;
            if (t !== null)
                throw t
        }
    }
    function fs(t, e, i, l) {
        ou = !1;
        var r = t.updateQueue;
        Vn = !1;
        var c = r.firstBaseUpdate
          , v = r.lastBaseUpdate
          , b = r.shared.pending;
        if (b !== null) {
            r.shared.pending = null;
            var x = b
              , L = x.next;
            x.next = null,
            v === null ? c = L : v.next = L,
            v = x;
            var U = t.alternate;
            U !== null && (U = U.updateQueue,
            b = U.lastBaseUpdate,
            b !== v && (b === null ? U.firstBaseUpdate = L : b.next = L,
            U.lastBaseUpdate = x))
        }
        if (c !== null) {
            var P = r.baseState;
            v = 0,
            U = L = x = null,
            b = c;
            do {
                var O = b.lane & -536870913
                  , w = O !== b.lane;
                if (w ? (vt & O) === O : (l & O) === O) {
                    O !== 0 && O === na && (ou = !0),
                    U !== null && (U = U.next = {
                        lane: 0,
                        tag: b.tag,
                        payload: b.payload,
                        callback: null,
                        next: null
                    });
                    t: {
                        var st = t
                          , it = b;
                        O = e;
                        var Mt = i;
                        switch (it.tag) {
                        case 1:
                            if (st = it.payload,
                            typeof st == "function") {
                                P = st.call(Mt, P, O);
                                break t
                            }
                            P = st;
                            break t;
                        case 3:
                            st.flags = st.flags & -65537 | 128;
                        case 0:
                            if (st = it.payload,
                            O = typeof st == "function" ? st.call(Mt, P, O) : st,
                            O == null)
                                break t;
                            P = y({}, P, O);
                            break t;
                        case 2:
                            Vn = !0
                        }
                    }
                    O = b.callback,
                    O !== null && (t.flags |= 64,
                    w && (t.flags |= 8192),
                    w = r.callbacks,
                    w === null ? r.callbacks = [O] : w.push(O))
                } else
                    w = {
                        lane: O,
                        tag: b.tag,
                        payload: b.payload,
                        callback: b.callback,
                        next: null
                    },
                    U === null ? (L = U = w,
                    x = P) : U = U.next = w,
                    v |= O;
                if (b = b.next,
                b === null) {
                    if (b = r.shared.pending,
                    b === null)
                        break;
                    w = b,
                    b = w.next,
                    w.next = null,
                    r.lastBaseUpdate = w,
                    r.shared.pending = null
                }
            } while (!0);
            U === null && (x = P),
            r.baseState = x,
            r.firstBaseUpdate = L,
            r.lastBaseUpdate = U,
            c === null && (r.shared.lanes = 0),
            Yn |= v,
            t.lanes = v,
            t.memoizedState = P
        }
    }
    function Vd(t, e) {
        if (typeof t != "function")
            throw Error(o(191, t));
        t.call(e)
    }
    function wd(t, e) {
        var i = t.callbacks;
        if (i !== null)
            for (t.callbacks = null,
            t = 0; t < i.length; t++)
                Vd(i[t], e)
    }
    var aa = Y(null)
      , ql = Y(0);
    function zd(t, e) {
        t = Cn,
        $(ql, t),
        $(aa, e),
        Cn = t | e.baseLanes
    }
    function ru() {
        $(ql, Cn),
        $(aa, aa.current)
    }
    function uu() {
        Cn = ql.current,
        J(aa),
        J(ql)
    }
    var Bn = 0
      , ct = null
      , xt = null
      , Xt = null
      , Yl = !1
      , sa = !1
      , Ti = !1
      , Gl = 0
      , hs = 0
      , la = null
      , s2 = 0;
    function Ht() {
        throw Error(o(321))
    }
    function cu(t, e) {
        if (e === null)
            return !1;
        for (var i = 0; i < e.length && i < t.length; i++)
            if (!Te(t[i], e[i]))
                return !1;
        return !0
    }
    function fu(t, e, i, l, r, c) {
        return Bn = c,
        ct = e,
        e.memoizedState = null,
        e.updateQueue = null,
        e.lanes = 0,
        z.H = t === null || t.memoizedState === null ? vm : gm,
        Ti = !1,
        c = i(l, r),
        Ti = !1,
        sa && (c = Ud(e, i, l, r)),
        Bd(t),
        c
    }
    function Bd(t) {
        z.H = Fl;
        var e = xt !== null && xt.next !== null;
        if (Bn = 0,
        Xt = xt = ct = null,
        Yl = !1,
        hs = 0,
        la = null,
        e)
            throw Error(o(300));
        t === null || Jt || (t = t.dependencies,
        t !== null && Ul(t) && (Jt = !0))
    }
    function Ud(t, e, i, l) {
        ct = t;
        var r = 0;
        do {
            if (sa && (la = null),
            hs = 0,
            sa = !1,
            25 <= r)
                throw Error(o(301));
            if (r += 1,
            Xt = xt = null,
            t.updateQueue != null) {
                var c = t.updateQueue;
                c.lastEffect = null,
                c.events = null,
                c.stores = null,
                c.memoCache != null && (c.memoCache.index = 0)
            }
            z.H = h2,
            c = e(i, l)
        } while (sa);
        return c
    }
    function l2() {
        var t = z.H
          , e = t.useState()[0];
        return e = typeof e.then == "function" ? ds(e) : e,
        t = t.useState()[0],
        (xt !== null ? xt.memoizedState : null) !== t && (ct.flags |= 1024),
        e
    }
    function hu() {
        var t = Gl !== 0;
        return Gl = 0,
        t
    }
    function du(t, e, i) {
        e.updateQueue = t.updateQueue,
        e.flags &= -2053,
        t.lanes &= ~i
    }
    function mu(t) {
        if (Yl) {
            for (t = t.memoizedState; t !== null; ) {
                var e = t.queue;
                e !== null && (e.pending = null),
                t = t.next
            }
            Yl = !1
        }
        Bn = 0,
        Xt = xt = ct = null,
        sa = !1,
        hs = Gl = 0,
        la = null
    }
    function pe() {
        var t = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null
        };
        return Xt === null ? ct.memoizedState = Xt = t : Xt = Xt.next = t,
        Xt
    }
    function Kt() {
        if (xt === null) {
            var t = ct.alternate;
            t = t !== null ? t.memoizedState : null
        } else
            t = xt.next;
        var e = Xt === null ? ct.memoizedState : Xt.next;
        if (e !== null)
            Xt = e,
            xt = t;
        else {
            if (t === null)
                throw ct.alternate === null ? Error(o(467)) : Error(o(310));
            xt = t,
            t = {
                memoizedState: xt.memoizedState,
                baseState: xt.baseState,
                baseQueue: xt.baseQueue,
                queue: xt.queue,
                next: null
            },
            Xt === null ? ct.memoizedState = Xt = t : Xt = Xt.next = t
        }
        return Xt
    }
    function pu() {
        return {
            lastEffect: null,
            events: null,
            stores: null,
            memoCache: null
        }
    }
    function ds(t) {
        var e = hs;
        return hs += 1,
        la === null && (la = []),
        t = Dd(la, t, e),
        e = ct,
        (Xt === null ? e.memoizedState : Xt.next) === null && (e = e.alternate,
        z.H = e === null || e.memoizedState === null ? vm : gm),
        t
    }
    function kl(t) {
        if (t !== null && typeof t == "object") {
            if (typeof t.then == "function")
                return ds(t);
            if (t.$$typeof === B)
                return oe(t)
        }
        throw Error(o(438, String(t)))
    }
    function yu(t) {
        var e = null
          , i = ct.updateQueue;
        if (i !== null && (e = i.memoCache),
        e == null) {
            var l = ct.alternate;
            l !== null && (l = l.updateQueue,
            l !== null && (l = l.memoCache,
            l != null && (e = {
                data: l.data.map(function(r) {
                    return r.slice()
                }),
                index: 0
            })))
        }
        if (e == null && (e = {
            data: [],
            index: 0
        }),
        i === null && (i = pu(),
        ct.updateQueue = i),
        i.memoCache = e,
        i = e.data[e.index],
        i === void 0)
            for (i = e.data[e.index] = Array(t),
            l = 0; l < t; l++)
                i[l] = F;
        return e.index++,
        i
    }
    function yn(t, e) {
        return typeof e == "function" ? e(t) : e
    }
    function Xl(t) {
        var e = Kt();
        return vu(e, xt, t)
    }
    function vu(t, e, i) {
        var l = t.queue;
        if (l === null)
            throw Error(o(311));
        l.lastRenderedReducer = i;
        var r = t.baseQueue
          , c = l.pending;
        if (c !== null) {
            if (r !== null) {
                var v = r.next;
                r.next = c.next,
                c.next = v
            }
            e.baseQueue = r = c,
            l.pending = null
        }
        if (c = t.baseState,
        r === null)
            t.memoizedState = c;
        else {
            e = r.next;
            var b = v = null
              , x = null
              , L = e
              , U = !1;
            do {
                var P = L.lane & -536870913;
                if (P !== L.lane ? (vt & P) === P : (Bn & P) === P) {
                    var O = L.revertLane;
                    if (O === 0)
                        x !== null && (x = x.next = {
                            lane: 0,
                            revertLane: 0,
                            action: L.action,
                            hasEagerState: L.hasEagerState,
                            eagerState: L.eagerState,
                            next: null
                        }),
                        P === na && (U = !0);
                    else if ((Bn & O) === O) {
                        L = L.next,
                        O === na && (U = !0);
                        continue
                    } else
                        P = {
                            lane: 0,
                            revertLane: L.revertLane,
                            action: L.action,
                            hasEagerState: L.hasEagerState,
                            eagerState: L.eagerState,
                            next: null
                        },
                        x === null ? (b = x = P,
                        v = c) : x = x.next = P,
                        ct.lanes |= O,
                        Yn |= O;
                    P = L.action,
                    Ti && i(c, P),
                    c = L.hasEagerState ? L.eagerState : i(c, P)
                } else
                    O = {
                        lane: P,
                        revertLane: L.revertLane,
                        action: L.action,
                        hasEagerState: L.hasEagerState,
                        eagerState: L.eagerState,
                        next: null
                    },
                    x === null ? (b = x = O,
                    v = c) : x = x.next = O,
                    ct.lanes |= P,
                    Yn |= P;
                L = L.next
            } while (L !== null && L !== e);
            if (x === null ? v = c : x.next = b,
            !Te(c, t.memoizedState) && (Jt = !0,
            U && (i = ia,
            i !== null)))
                throw i;
            t.memoizedState = c,
            t.baseState = v,
            t.baseQueue = x,
            l.lastRenderedState = c
        }
        return r === null && (l.lanes = 0),
        [t.memoizedState, l.dispatch]
    }
    function gu(t) {
        var e = Kt()
          , i = e.queue;
        if (i === null)
            throw Error(o(311));
        i.lastRenderedReducer = t;
        var l = i.dispatch
          , r = i.pending
          , c = e.memoizedState;
        if (r !== null) {
            i.pending = null;
            var v = r = r.next;
            do
                c = t(c, v.action),
                v = v.next;
            while (v !== r);
            Te(c, e.memoizedState) || (Jt = !0),
            e.memoizedState = c,
            e.baseQueue === null && (e.baseState = c),
            i.lastRenderedState = c
        }
        return [c, l]
    }
    function Nd(t, e, i) {
        var l = ct
          , r = Kt()
          , c = St;
        if (c) {
            if (i === void 0)
                throw Error(o(407));
            i = i()
        } else
            i = e();
        var v = !Te((xt || r).memoizedState, i);
        v && (r.memoizedState = i,
        Jt = !0),
        r = r.queue;
        var b = Hd.bind(null, l, r, t);
        if (ms(2048, 8, b, [t]),
        r.getSnapshot !== e || v || Xt !== null && Xt.memoizedState.tag & 1) {
            if (l.flags |= 2048,
            oa(9, Kl(), Pd.bind(null, l, r, i, e), null),
            At === null)
                throw Error(o(349));
            c || (Bn & 124) !== 0 || jd(l, e, i)
        }
        return i
    }
    function jd(t, e, i) {
        t.flags |= 16384,
        t = {
            getSnapshot: e,
            value: i
        },
        e = ct.updateQueue,
        e === null ? (e = pu(),
        ct.updateQueue = e,
        e.stores = [t]) : (i = e.stores,
        i === null ? e.stores = [t] : i.push(t))
    }
    function Pd(t, e, i, l) {
        e.value = i,
        e.getSnapshot = l,
        qd(e) && Yd(t)
    }
    function Hd(t, e, i) {
        return i(function() {
            qd(e) && Yd(t)
        })
    }
    function qd(t) {
        var e = t.getSnapshot;
        t = t.value;
        try {
            var i = e();
            return !Te(t, i)
        } catch {
            return !0
        }
    }
    function Yd(t) {
        var e = Wi(t, 2);
        e !== null && _e(e, t, 2)
    }
    function Su(t) {
        var e = pe();
        if (typeof t == "function") {
            var i = t;
            if (t = i(),
            Ti) {
                rn(!0);
                try {
                    i()
                } finally {
                    rn(!1)
                }
            }
        }
        return e.memoizedState = e.baseState = t,
        e.queue = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: yn,
            lastRenderedState: t
        },
        e
    }
    function Gd(t, e, i, l) {
        return t.baseState = i,
        vu(t, xt, typeof l == "function" ? l : yn)
    }
    function o2(t, e, i, l, r) {
        if (Ql(t))
            throw Error(o(485));
        if (t = e.action,
        t !== null) {
            var c = {
                payload: r,
                action: t,
                next: null,
                isTransition: !0,
                status: "pending",
                value: null,
                reason: null,
                listeners: [],
                then: function(v) {
                    c.listeners.push(v)
                }
            };
            z.T !== null ? i(!0) : c.isTransition = !1,
            l(c),
            i = e.pending,
            i === null ? (c.next = e.pending = c,
            kd(e, c)) : (c.next = i.next,
            e.pending = i.next = c)
        }
    }
    function kd(t, e) {
        var i = e.action
          , l = e.payload
          , r = t.state;
        if (e.isTransition) {
            var c = z.T
              , v = {};
            z.T = v;
            try {
                var b = i(r, l)
                  , x = z.S;
                x !== null && x(v, b),
                Xd(t, e, b)
            } catch (L) {
                bu(t, e, L)
            } finally {
                z.T = c
            }
        } else
            try {
                c = i(r, l),
                Xd(t, e, c)
            } catch (L) {
                bu(t, e, L)
            }
    }
    function Xd(t, e, i) {
        i !== null && typeof i == "object" && typeof i.then == "function" ? i.then(function(l) {
            Kd(t, e, l)
        }, function(l) {
            return bu(t, e, l)
        }) : Kd(t, e, i)
    }
    function Kd(t, e, i) {
        e.status = "fulfilled",
        e.value = i,
        Zd(e),
        t.state = i,
        e = t.pending,
        e !== null && (i = e.next,
        i === e ? t.pending = null : (i = i.next,
        e.next = i,
        kd(t, i)))
    }
    function bu(t, e, i) {
        var l = t.pending;
        if (t.pending = null,
        l !== null) {
            l = l.next;
            do
                e.status = "rejected",
                e.reason = i,
                Zd(e),
                e = e.next;
            while (e !== l)
        }
        t.action = null
    }
    function Zd(t) {
        t = t.listeners;
        for (var e = 0; e < t.length; e++)
            (0,
            t[e])()
    }
    function Qd(t, e) {
        return e
    }
    function Fd(t, e) {
        if (St) {
            var i = At.formState;
            if (i !== null) {
                t: {
                    var l = ct;
                    if (St) {
                        if (Nt) {
                            e: {
                                for (var r = Nt, c = Je; r.nodeType !== 8; ) {
                                    if (!c) {
                                        r = null;
                                        break e
                                    }
                                    if (r = Qe(r.nextSibling),
                                    r === null) {
                                        r = null;
                                        break e
                                    }
                                }
                                c = r.data,
                                r = c === "F!" || c === "F" ? r : null
                            }
                            if (r) {
                                Nt = Qe(r.nextSibling),
                                l = r.data === "F!";
                                break t
                            }
                        }
                        vi(l)
                    }
                    l = !1
                }
                l && (e = i[0])
            }
        }
        return i = pe(),
        i.memoizedState = i.baseState = e,
        l = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Qd,
            lastRenderedState: e
        },
        i.queue = l,
        i = mm.bind(null, ct, l),
        l.dispatch = i,
        l = Su(!1),
        c = Mu.bind(null, ct, !1, l.queue),
        l = pe(),
        r = {
            state: e,
            dispatch: null,
            action: t,
            pending: null
        },
        l.queue = r,
        i = o2.bind(null, ct, r, c, i),
        r.dispatch = i,
        l.memoizedState = t,
        [e, i, !1]
    }
    function $d(t) {
        var e = Kt();
        return Jd(e, xt, t)
    }
    function Jd(t, e, i) {
        if (e = vu(t, e, Qd)[0],
        t = Xl(yn)[0],
        typeof e == "object" && e !== null && typeof e.then == "function")
            try {
                var l = ds(e)
            } catch (v) {
                throw v === os ? Pl : v
            }
        else
            l = e;
        e = Kt();
        var r = e.queue
          , c = r.dispatch;
        return i !== e.memoizedState && (ct.flags |= 2048,
        oa(9, Kl(), r2.bind(null, r, i), null)),
        [l, c, t]
    }
    function r2(t, e) {
        t.action = e
    }
    function Wd(t) {
        var e = Kt()
          , i = xt;
        if (i !== null)
            return Jd(e, i, t);
        Kt(),
        e = e.memoizedState,
        i = Kt();
        var l = i.queue.dispatch;
        return i.memoizedState = t,
        [e, l, !1]
    }
    function oa(t, e, i, l) {
        return t = {
            tag: t,
            create: i,
            deps: l,
            inst: e,
            next: null
        },
        e = ct.updateQueue,
        e === null && (e = pu(),
        ct.updateQueue = e),
        i = e.lastEffect,
        i === null ? e.lastEffect = t.next = t : (l = i.next,
        i.next = t,
        t.next = l,
        e.lastEffect = t),
        t
    }
    function Kl() {
        return {
            destroy: void 0,
            resource: void 0
        }
    }
    function Id() {
        return Kt().memoizedState
    }
    function Zl(t, e, i, l) {
        var r = pe();
        l = l === void 0 ? null : l,
        ct.flags |= t,
        r.memoizedState = oa(1 | e, Kl(), i, l)
    }
    function ms(t, e, i, l) {
        var r = Kt();
        l = l === void 0 ? null : l;
        var c = r.memoizedState.inst;
        xt !== null && l !== null && cu(l, xt.memoizedState.deps) ? r.memoizedState = oa(e, c, i, l) : (ct.flags |= t,
        r.memoizedState = oa(1 | e, c, i, l))
    }
    function tm(t, e) {
        Zl(8390656, 8, t, e)
    }
    function em(t, e) {
        ms(2048, 8, t, e)
    }
    function nm(t, e) {
        return ms(4, 2, t, e)
    }
    function im(t, e) {
        return ms(4, 4, t, e)
    }
    function am(t, e) {
        if (typeof e == "function") {
            t = t();
            var i = e(t);
            return function() {
                typeof i == "function" ? i() : e(null)
            }
        }
        if (e != null)
            return t = t(),
            e.current = t,
            function() {
                e.current = null
            }
    }
    function sm(t, e, i) {
        i = i != null ? i.concat([t]) : null,
        ms(4, 4, am.bind(null, e, t), i)
    }
    function Tu() {}
    function lm(t, e) {
        var i = Kt();
        e = e === void 0 ? null : e;
        var l = i.memoizedState;
        return e !== null && cu(e, l[1]) ? l[0] : (i.memoizedState = [t, e],
        t)
    }
    function om(t, e) {
        var i = Kt();
        e = e === void 0 ? null : e;
        var l = i.memoizedState;
        if (e !== null && cu(e, l[1]))
            return l[0];
        if (l = t(),
        Ti) {
            rn(!0);
            try {
                t()
            } finally {
                rn(!1)
            }
        }
        return i.memoizedState = [l, e],
        l
    }
    function Cu(t, e, i) {
        return i === void 0 || (Bn & 1073741824) !== 0 ? t.memoizedState = e : (t.memoizedState = i,
        t = cp(),
        ct.lanes |= t,
        Yn |= t,
        i)
    }
    function rm(t, e, i, l) {
        return Te(i, e) ? i : aa.current !== null ? (t = Cu(t, i, l),
        Te(t, e) || (Jt = !0),
        t) : (Bn & 42) === 0 ? (Jt = !0,
        t.memoizedState = i) : (t = cp(),
        ct.lanes |= t,
        Yn |= t,
        e)
    }
    function um(t, e, i, l, r) {
        var c = k.p;
        k.p = c !== 0 && 8 > c ? c : 8;
        var v = z.T
          , b = {};
        z.T = b,
        Mu(t, !1, e, i);
        try {
            var x = r()
              , L = z.S;
            if (L !== null && L(b, x),
            x !== null && typeof x == "object" && typeof x.then == "function") {
                var U = a2(x, l);
                ps(t, e, U, Ee(t))
            } else
                ps(t, e, l, Ee(t))
        } catch (P) {
            ps(t, e, {
                then: function() {},
                status: "rejected",
                reason: P
            }, Ee())
        } finally {
            k.p = c,
            z.T = v
        }
    }
    function u2() {}
    function xu(t, e, i, l) {
        if (t.tag !== 5)
            throw Error(o(476));
        var r = cm(t).queue;
        um(t, r, e, W, i === null ? u2 : function() {
            return fm(t),
            i(l)
        }
        )
    }
    function cm(t) {
        var e = t.memoizedState;
        if (e !== null)
            return e;
        e = {
            memoizedState: W,
            baseState: W,
            baseQueue: null,
            queue: {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: yn,
                lastRenderedState: W
            },
            next: null
        };
        var i = {};
        return e.next = {
            memoizedState: i,
            baseState: i,
            baseQueue: null,
            queue: {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: yn,
                lastRenderedState: i
            },
            next: null
        },
        t.memoizedState = e,
        t = t.alternate,
        t !== null && (t.memoizedState = e),
        e
    }
    function fm(t) {
        var e = cm(t).next.queue;
        ps(t, e, {}, Ee())
    }
    function Ru() {
        return oe(ws)
    }
    function hm() {
        return Kt().memoizedState
    }
    function dm() {
        return Kt().memoizedState
    }
    function c2(t) {
        for (var e = t.return; e !== null; ) {
            switch (e.tag) {
            case 24:
            case 3:
                var i = Ee();
                t = wn(i);
                var l = zn(e, t, i);
                l !== null && (_e(l, e, i),
                us(l, e, i)),
                e = {
                    cache: tu()
                },
                t.payload = e;
                return
            }
            e = e.return
        }
    }
    function f2(t, e, i) {
        var l = Ee();
        i = {
            lane: l,
            revertLane: 0,
            action: i,
            hasEagerState: !1,
            eagerState: null,
            next: null
        },
        Ql(t) ? pm(e, i) : (i = kr(t, e, i, l),
        i !== null && (_e(i, t, l),
        ym(i, e, l)))
    }
    function mm(t, e, i) {
        var l = Ee();
        ps(t, e, i, l)
    }
    function ps(t, e, i, l) {
        var r = {
            lane: l,
            revertLane: 0,
            action: i,
            hasEagerState: !1,
            eagerState: null,
            next: null
        };
        if (Ql(t))
            pm(e, r);
        else {
            var c = t.alternate;
            if (t.lanes === 0 && (c === null || c.lanes === 0) && (c = e.lastRenderedReducer,
            c !== null))
                try {
                    var v = e.lastRenderedState
                      , b = c(v, i);
                    if (r.hasEagerState = !0,
                    r.eagerState = b,
                    Te(b, v))
                        return Ol(t, e, r, 0),
                        At === null && Ll(),
                        !1
                } catch {} finally {}
            if (i = kr(t, e, r, l),
            i !== null)
                return _e(i, t, l),
                ym(i, e, l),
                !0
        }
        return !1
    }
    function Mu(t, e, i, l) {
        if (l = {
            lane: 2,
            revertLane: ic(),
            action: l,
            hasEagerState: !1,
            eagerState: null,
            next: null
        },
        Ql(t)) {
            if (e)
                throw Error(o(479))
        } else
            e = kr(t, i, l, 2),
            e !== null && _e(e, t, 2)
    }
    function Ql(t) {
        var e = t.alternate;
        return t === ct || e !== null && e === ct
    }
    function pm(t, e) {
        sa = Yl = !0;
        var i = t.pending;
        i === null ? e.next = e : (e.next = i.next,
        i.next = e),
        t.pending = e
    }
    function ym(t, e, i) {
        if ((i & 4194048) !== 0) {
            var l = e.lanes;
            l &= t.pendingLanes,
            i |= l,
            e.lanes = i,
            Rh(t, i)
        }
    }
    var Fl = {
        readContext: oe,
        use: kl,
        useCallback: Ht,
        useContext: Ht,
        useEffect: Ht,
        useImperativeHandle: Ht,
        useLayoutEffect: Ht,
        useInsertionEffect: Ht,
        useMemo: Ht,
        useReducer: Ht,
        useRef: Ht,
        useState: Ht,
        useDebugValue: Ht,
        useDeferredValue: Ht,
        useTransition: Ht,
        useSyncExternalStore: Ht,
        useId: Ht,
        useHostTransitionStatus: Ht,
        useFormState: Ht,
        useActionState: Ht,
        useOptimistic: Ht,
        useMemoCache: Ht,
        useCacheRefresh: Ht
    }
      , vm = {
        readContext: oe,
        use: kl,
        useCallback: function(t, e) {
            return pe().memoizedState = [t, e === void 0 ? null : e],
            t
        },
        useContext: oe,
        useEffect: tm,
        useImperativeHandle: function(t, e, i) {
            i = i != null ? i.concat([t]) : null,
            Zl(4194308, 4, am.bind(null, e, t), i)
        },
        useLayoutEffect: function(t, e) {
            return Zl(4194308, 4, t, e)
        },
        useInsertionEffect: function(t, e) {
            Zl(4, 2, t, e)
        },
        useMemo: function(t, e) {
            var i = pe();
            e = e === void 0 ? null : e;
            var l = t();
            if (Ti) {
                rn(!0);
                try {
                    t()
                } finally {
                    rn(!1)
                }
            }
            return i.memoizedState = [l, e],
            l
        },
        useReducer: function(t, e, i) {
            var l = pe();
            if (i !== void 0) {
                var r = i(e);
                if (Ti) {
                    rn(!0);
                    try {
                        i(e)
                    } finally {
                        rn(!1)
                    }
                }
            } else
                r = e;
            return l.memoizedState = l.baseState = r,
            t = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: t,
                lastRenderedState: r
            },
            l.queue = t,
            t = t.dispatch = f2.bind(null, ct, t),
            [l.memoizedState, t]
        },
        useRef: function(t) {
            var e = pe();
            return t = {
                current: t
            },
            e.memoizedState = t
        },
        useState: function(t) {
            t = Su(t);
            var e = t.queue
              , i = mm.bind(null, ct, e);
            return e.dispatch = i,
            [t.memoizedState, i]
        },
        useDebugValue: Tu,
        useDeferredValue: function(t, e) {
            var i = pe();
            return Cu(i, t, e)
        },
        useTransition: function() {
            var t = Su(!1);
            return t = um.bind(null, ct, t.queue, !0, !1),
            pe().memoizedState = t,
            [!1, t]
        },
        useSyncExternalStore: function(t, e, i) {
            var l = ct
              , r = pe();
            if (St) {
                if (i === void 0)
                    throw Error(o(407));
                i = i()
            } else {
                if (i = e(),
                At === null)
                    throw Error(o(349));
                (vt & 124) !== 0 || jd(l, e, i)
            }
            r.memoizedState = i;
            var c = {
                value: i,
                getSnapshot: e
            };
            return r.queue = c,
            tm(Hd.bind(null, l, c, t), [t]),
            l.flags |= 2048,
            oa(9, Kl(), Pd.bind(null, l, c, i, e), null),
            i
        },
        useId: function() {
            var t = pe()
              , e = At.identifierPrefix;
            if (St) {
                var i = dn
                  , l = hn;
                i = (l & ~(1 << 32 - be(l) - 1)).toString(32) + i,
                e = "«" + e + "R" + i,
                i = Gl++,
                0 < i && (e += "H" + i.toString(32)),
                e += "»"
            } else
                i = s2++,
                e = "«" + e + "r" + i.toString(32) + "»";
            return t.memoizedState = e
        },
        useHostTransitionStatus: Ru,
        useFormState: Fd,
        useActionState: Fd,
        useOptimistic: function(t) {
            var e = pe();
            e.memoizedState = e.baseState = t;
            var i = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: null,
                lastRenderedState: null
            };
            return e.queue = i,
            e = Mu.bind(null, ct, !0, i),
            i.dispatch = e,
            [t, e]
        },
        useMemoCache: yu,
        useCacheRefresh: function() {
            return pe().memoizedState = c2.bind(null, ct)
        }
    }
      , gm = {
        readContext: oe,
        use: kl,
        useCallback: lm,
        useContext: oe,
        useEffect: em,
        useImperativeHandle: sm,
        useInsertionEffect: nm,
        useLayoutEffect: im,
        useMemo: om,
        useReducer: Xl,
        useRef: Id,
        useState: function() {
            return Xl(yn)
        },
        useDebugValue: Tu,
        useDeferredValue: function(t, e) {
            var i = Kt();
            return rm(i, xt.memoizedState, t, e)
        },
        useTransition: function() {
            var t = Xl(yn)[0]
              , e = Kt().memoizedState;
            return [typeof t == "boolean" ? t : ds(t), e]
        },
        useSyncExternalStore: Nd,
        useId: hm,
        useHostTransitionStatus: Ru,
        useFormState: $d,
        useActionState: $d,
        useOptimistic: function(t, e) {
            var i = Kt();
            return Gd(i, xt, t, e)
        },
        useMemoCache: yu,
        useCacheRefresh: dm
    }
      , h2 = {
        readContext: oe,
        use: kl,
        useCallback: lm,
        useContext: oe,
        useEffect: em,
        useImperativeHandle: sm,
        useInsertionEffect: nm,
        useLayoutEffect: im,
        useMemo: om,
        useReducer: gu,
        useRef: Id,
        useState: function() {
            return gu(yn)
        },
        useDebugValue: Tu,
        useDeferredValue: function(t, e) {
            var i = Kt();
            return xt === null ? Cu(i, t, e) : rm(i, xt.memoizedState, t, e)
        },
        useTransition: function() {
            var t = gu(yn)[0]
              , e = Kt().memoizedState;
            return [typeof t == "boolean" ? t : ds(t), e]
        },
        useSyncExternalStore: Nd,
        useId: hm,
        useHostTransitionStatus: Ru,
        useFormState: Wd,
        useActionState: Wd,
        useOptimistic: function(t, e) {
            var i = Kt();
            return xt !== null ? Gd(i, xt, t, e) : (i.baseState = t,
            [t, i.queue.dispatch])
        },
        useMemoCache: yu,
        useCacheRefresh: dm
    }
      , ra = null
      , ys = 0;
    function $l(t) {
        var e = ys;
        return ys += 1,
        ra === null && (ra = []),
        Dd(ra, t, e)
    }
    function vs(t, e) {
        e = e.props.ref,
        t.ref = e !== void 0 ? e : null
    }
    function Jl(t, e) {
        throw e.$$typeof === g ? Error(o(525)) : (t = Object.prototype.toString.call(e),
        Error(o(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t)))
    }
    function Sm(t) {
        var e = t._init;
        return e(t._payload)
    }
    function bm(t) {
        function e(_, M) {
            if (t) {
                var D = _.deletions;
                D === null ? (_.deletions = [M],
                _.flags |= 16) : D.push(M)
            }
        }
        function i(_, M) {
            if (!t)
                return null;
            for (; M !== null; )
                e(_, M),
                M = M.sibling;
            return null
        }
        function l(_) {
            for (var M = new Map; _ !== null; )
                _.key !== null ? M.set(_.key, _) : M.set(_.index, _),
                _ = _.sibling;
            return M
        }
        function r(_, M) {
            return _ = fn(_, M),
            _.index = 0,
            _.sibling = null,
            _
        }
        function c(_, M, D) {
            return _.index = D,
            t ? (D = _.alternate,
            D !== null ? (D = D.index,
            D < M ? (_.flags |= 67108866,
            M) : D) : (_.flags |= 67108866,
            M)) : (_.flags |= 1048576,
            M)
        }
        function v(_) {
            return t && _.alternate === null && (_.flags |= 67108866),
            _
        }
        function b(_, M, D, N) {
            return M === null || M.tag !== 6 ? (M = Kr(D, _.mode, N),
            M.return = _,
            M) : (M = r(M, D),
            M.return = _,
            M)
        }
        function x(_, M, D, N) {
            var I = D.type;
            return I === C ? U(_, M, D.props.children, N, D.key) : M !== null && (M.elementType === I || typeof I == "object" && I !== null && I.$$typeof === K && Sm(I) === M.type) ? (M = r(M, D.props),
            vs(M, D),
            M.return = _,
            M) : (M = wl(D.type, D.key, D.props, null, _.mode, N),
            vs(M, D),
            M.return = _,
            M)
        }
        function L(_, M, D, N) {
            return M === null || M.tag !== 4 || M.stateNode.containerInfo !== D.containerInfo || M.stateNode.implementation !== D.implementation ? (M = Zr(D, _.mode, N),
            M.return = _,
            M) : (M = r(M, D.children || []),
            M.return = _,
            M)
        }
        function U(_, M, D, N, I) {
            return M === null || M.tag !== 7 ? (M = di(D, _.mode, N, I),
            M.return = _,
            M) : (M = r(M, D),
            M.return = _,
            M)
        }
        function P(_, M, D) {
            if (typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint")
                return M = Kr("" + M, _.mode, D),
                M.return = _,
                M;
            if (typeof M == "object" && M !== null) {
                switch (M.$$typeof) {
                case S:
                    return D = wl(M.type, M.key, M.props, null, _.mode, D),
                    vs(D, M),
                    D.return = _,
                    D;
                case T:
                    return M = Zr(M, _.mode, D),
                    M.return = _,
                    M;
                case K:
                    var N = M._init;
                    return M = N(M._payload),
                    P(_, M, D)
                }
                if (Lt(M) || ft(M))
                    return M = di(M, _.mode, D, null),
                    M.return = _,
                    M;
                if (typeof M.then == "function")
                    return P(_, $l(M), D);
                if (M.$$typeof === B)
                    return P(_, Nl(_, M), D);
                Jl(_, M)
            }
            return null
        }
        function O(_, M, D, N) {
            var I = M !== null ? M.key : null;
            if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint")
                return I !== null ? null : b(_, M, "" + D, N);
            if (typeof D == "object" && D !== null) {
                switch (D.$$typeof) {
                case S:
                    return D.key === I ? x(_, M, D, N) : null;
                case T:
                    return D.key === I ? L(_, M, D, N) : null;
                case K:
                    return I = D._init,
                    D = I(D._payload),
                    O(_, M, D, N)
                }
                if (Lt(D) || ft(D))
                    return I !== null ? null : U(_, M, D, N, null);
                if (typeof D.then == "function")
                    return O(_, M, $l(D), N);
                if (D.$$typeof === B)
                    return O(_, M, Nl(_, D), N);
                Jl(_, D)
            }
            return null
        }
        function w(_, M, D, N, I) {
            if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
                return _ = _.get(D) || null,
                b(M, _, "" + N, I);
            if (typeof N == "object" && N !== null) {
                switch (N.$$typeof) {
                case S:
                    return _ = _.get(N.key === null ? D : N.key) || null,
                    x(M, _, N, I);
                case T:
                    return _ = _.get(N.key === null ? D : N.key) || null,
                    L(M, _, N, I);
                case K:
                    var ht = N._init;
                    return N = ht(N._payload),
                    w(_, M, D, N, I)
                }
                if (Lt(N) || ft(N))
                    return _ = _.get(D) || null,
                    U(M, _, N, I, null);
                if (typeof N.then == "function")
                    return w(_, M, D, $l(N), I);
                if (N.$$typeof === B)
                    return w(_, M, D, Nl(M, N), I);
                Jl(M, N)
            }
            return null
        }
        function st(_, M, D, N) {
            for (var I = null, ht = null, et = M, at = M = 0, It = null; et !== null && at < D.length; at++) {
                et.index > at ? (It = et,
                et = null) : It = et.sibling;
                var gt = O(_, et, D[at], N);
                if (gt === null) {
                    et === null && (et = It);
                    break
                }
                t && et && gt.alternate === null && e(_, et),
                M = c(gt, M, at),
                ht === null ? I = gt : ht.sibling = gt,
                ht = gt,
                et = It
            }
            if (at === D.length)
                return i(_, et),
                St && pi(_, at),
                I;
            if (et === null) {
                for (; at < D.length; at++)
                    et = P(_, D[at], N),
                    et !== null && (M = c(et, M, at),
                    ht === null ? I = et : ht.sibling = et,
                    ht = et);
                return St && pi(_, at),
                I
            }
            for (et = l(et); at < D.length; at++)
                It = w(et, _, at, D[at], N),
                It !== null && (t && It.alternate !== null && et.delete(It.key === null ? at : It.key),
                M = c(It, M, at),
                ht === null ? I = It : ht.sibling = It,
                ht = It);
            return t && et.forEach(function(Jn) {
                return e(_, Jn)
            }),
            St && pi(_, at),
            I
        }
        function it(_, M, D, N) {
            if (D == null)
                throw Error(o(151));
            for (var I = null, ht = null, et = M, at = M = 0, It = null, gt = D.next(); et !== null && !gt.done; at++,
            gt = D.next()) {
                et.index > at ? (It = et,
                et = null) : It = et.sibling;
                var Jn = O(_, et, gt.value, N);
                if (Jn === null) {
                    et === null && (et = It);
                    break
                }
                t && et && Jn.alternate === null && e(_, et),
                M = c(Jn, M, at),
                ht === null ? I = Jn : ht.sibling = Jn,
                ht = Jn,
                et = It
            }
            if (gt.done)
                return i(_, et),
                St && pi(_, at),
                I;
            if (et === null) {
                for (; !gt.done; at++,
                gt = D.next())
                    gt = P(_, gt.value, N),
                    gt !== null && (M = c(gt, M, at),
                    ht === null ? I = gt : ht.sibling = gt,
                    ht = gt);
                return St && pi(_, at),
                I
            }
            for (et = l(et); !gt.done; at++,
            gt = D.next())
                gt = w(et, _, at, gt.value, N),
                gt !== null && (t && gt.alternate !== null && et.delete(gt.key === null ? at : gt.key),
                M = c(gt, M, at),
                ht === null ? I = gt : ht.sibling = gt,
                ht = gt);
            return t && et.forEach(function(d3) {
                return e(_, d3)
            }),
            St && pi(_, at),
            I
        }
        function Mt(_, M, D, N) {
            if (typeof D == "object" && D !== null && D.type === C && D.key === null && (D = D.props.children),
            typeof D == "object" && D !== null) {
                switch (D.$$typeof) {
                case S:
                    t: {
                        for (var I = D.key; M !== null; ) {
                            if (M.key === I) {
                                if (I = D.type,
                                I === C) {
                                    if (M.tag === 7) {
                                        i(_, M.sibling),
                                        N = r(M, D.props.children),
                                        N.return = _,
                                        _ = N;
                                        break t
                                    }
                                } else if (M.elementType === I || typeof I == "object" && I !== null && I.$$typeof === K && Sm(I) === M.type) {
                                    i(_, M.sibling),
                                    N = r(M, D.props),
                                    vs(N, D),
                                    N.return = _,
                                    _ = N;
                                    break t
                                }
                                i(_, M);
                                break
                            } else
                                e(_, M);
                            M = M.sibling
                        }
                        D.type === C ? (N = di(D.props.children, _.mode, N, D.key),
                        N.return = _,
                        _ = N) : (N = wl(D.type, D.key, D.props, null, _.mode, N),
                        vs(N, D),
                        N.return = _,
                        _ = N)
                    }
                    return v(_);
                case T:
                    t: {
                        for (I = D.key; M !== null; ) {
                            if (M.key === I)
                                if (M.tag === 4 && M.stateNode.containerInfo === D.containerInfo && M.stateNode.implementation === D.implementation) {
                                    i(_, M.sibling),
                                    N = r(M, D.children || []),
                                    N.return = _,
                                    _ = N;
                                    break t
                                } else {
                                    i(_, M);
                                    break
                                }
                            else
                                e(_, M);
                            M = M.sibling
                        }
                        N = Zr(D, _.mode, N),
                        N.return = _,
                        _ = N
                    }
                    return v(_);
                case K:
                    return I = D._init,
                    D = I(D._payload),
                    Mt(_, M, D, N)
                }
                if (Lt(D))
                    return st(_, M, D, N);
                if (ft(D)) {
                    if (I = ft(D),
                    typeof I != "function")
                        throw Error(o(150));
                    return D = I.call(D),
                    it(_, M, D, N)
                }
                if (typeof D.then == "function")
                    return Mt(_, M, $l(D), N);
                if (D.$$typeof === B)
                    return Mt(_, M, Nl(_, D), N);
                Jl(_, D)
            }
            return typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint" ? (D = "" + D,
            M !== null && M.tag === 6 ? (i(_, M.sibling),
            N = r(M, D),
            N.return = _,
            _ = N) : (i(_, M),
            N = Kr(D, _.mode, N),
            N.return = _,
            _ = N),
            v(_)) : i(_, M)
        }
        return function(_, M, D, N) {
            try {
                ys = 0;
                var I = Mt(_, M, D, N);
                return ra = null,
                I
            } catch (et) {
                if (et === os || et === Pl)
                    throw et;
                var ht = Ce(29, et, null, _.mode);
                return ht.lanes = N,
                ht.return = _,
                ht
            } finally {}
        }
    }
    var ua = bm(!0)
      , Tm = bm(!1)
      , Be = Y(null)
      , We = null;
    function Un(t) {
        var e = t.alternate;
        $(Ft, Ft.current & 1),
        $(Be, t),
        We === null && (e === null || aa.current !== null || e.memoizedState !== null) && (We = t)
    }
    function Cm(t) {
        if (t.tag === 22) {
            if ($(Ft, Ft.current),
            $(Be, t),
            We === null) {
                var e = t.alternate;
                e !== null && e.memoizedState !== null && (We = t)
            }
        } else
            Nn()
    }
    function Nn() {
        $(Ft, Ft.current),
        $(Be, Be.current)
    }
    function vn(t) {
        J(Be),
        We === t && (We = null),
        J(Ft)
    }
    var Ft = Y(0);
    function Wl(t) {
        for (var e = t; e !== null; ) {
            if (e.tag === 13) {
                var i = e.memoizedState;
                if (i !== null && (i = i.dehydrated,
                i === null || i.data === "$?" || pc(i)))
                    return e
            } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
                if ((e.flags & 128) !== 0)
                    return e
            } else if (e.child !== null) {
                e.child.return = e,
                e = e.child;
                continue
            }
            if (e === t)
                break;
            for (; e.sibling === null; ) {
                if (e.return === null || e.return === t)
                    return null;
                e = e.return
            }
            e.sibling.return = e.return,
            e = e.sibling
        }
        return null
    }
    function Eu(t, e, i, l) {
        e = t.memoizedState,
        i = i(l, e),
        i = i == null ? e : y({}, e, i),
        t.memoizedState = i,
        t.lanes === 0 && (t.updateQueue.baseState = i)
    }
    var _u = {
        enqueueSetState: function(t, e, i) {
            t = t._reactInternals;
            var l = Ee()
              , r = wn(l);
            r.payload = e,
            i != null && (r.callback = i),
            e = zn(t, r, l),
            e !== null && (_e(e, t, l),
            us(e, t, l))
        },
        enqueueReplaceState: function(t, e, i) {
            t = t._reactInternals;
            var l = Ee()
              , r = wn(l);
            r.tag = 1,
            r.payload = e,
            i != null && (r.callback = i),
            e = zn(t, r, l),
            e !== null && (_e(e, t, l),
            us(e, t, l))
        },
        enqueueForceUpdate: function(t, e) {
            t = t._reactInternals;
            var i = Ee()
              , l = wn(i);
            l.tag = 2,
            e != null && (l.callback = e),
            e = zn(t, l, i),
            e !== null && (_e(e, t, i),
            us(e, t, i))
        }
    };
    function xm(t, e, i, l, r, c, v) {
        return t = t.stateNode,
        typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(l, c, v) : e.prototype && e.prototype.isPureReactComponent ? !Ia(i, l) || !Ia(r, c) : !0
    }
    function Rm(t, e, i, l) {
        t = e.state,
        typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(i, l),
        typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(i, l),
        e.state !== t && _u.enqueueReplaceState(e, e.state, null)
    }
    function Ci(t, e) {
        var i = e;
        if ("ref" in e) {
            i = {};
            for (var l in e)
                l !== "ref" && (i[l] = e[l])
        }
        if (t = t.defaultProps) {
            i === e && (i = y({}, i));
            for (var r in t)
                i[r] === void 0 && (i[r] = t[r])
        }
        return i
    }
    var Il = typeof reportError == "function" ? reportError : function(t) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var e = new window.ErrorEvent("error",{
                bubbles: !0,
                cancelable: !0,
                message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
                error: t
            });
            if (!window.dispatchEvent(e))
                return
        } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", t);
            return
        }
        console.error(t)
    }
    ;
    function Mm(t) {
        Il(t)
    }
    function Em(t) {
        console.error(t)
    }
    function _m(t) {
        Il(t)
    }
    function to(t, e) {
        try {
            var i = t.onUncaughtError;
            i(e.value, {
                componentStack: e.stack
            })
        } catch (l) {
            setTimeout(function() {
                throw l
            })
        }
    }
    function Am(t, e, i) {
        try {
            var l = t.onCaughtError;
            l(i.value, {
                componentStack: i.stack,
                errorBoundary: e.tag === 1 ? e.stateNode : null
            })
        } catch (r) {
            setTimeout(function() {
                throw r
            })
        }
    }
    function Au(t, e, i) {
        return i = wn(i),
        i.tag = 3,
        i.payload = {
            element: null
        },
        i.callback = function() {
            to(t, e)
        }
        ,
        i
    }
    function Dm(t) {
        return t = wn(t),
        t.tag = 3,
        t
    }
    function Lm(t, e, i, l) {
        var r = i.type.getDerivedStateFromError;
        if (typeof r == "function") {
            var c = l.value;
            t.payload = function() {
                return r(c)
            }
            ,
            t.callback = function() {
                Am(e, i, l)
            }
        }
        var v = i.stateNode;
        v !== null && typeof v.componentDidCatch == "function" && (t.callback = function() {
            Am(e, i, l),
            typeof r != "function" && (Gn === null ? Gn = new Set([this]) : Gn.add(this));
            var b = l.stack;
            this.componentDidCatch(l.value, {
                componentStack: b !== null ? b : ""
            })
        }
        )
    }
    function d2(t, e, i, l, r) {
        if (i.flags |= 32768,
        l !== null && typeof l == "object" && typeof l.then == "function") {
            if (e = i.alternate,
            e !== null && as(e, i, r, !0),
            i = Be.current,
            i !== null) {
                switch (i.tag) {
                case 13:
                    return We === null ? Wu() : i.alternate === null && jt === 0 && (jt = 3),
                    i.flags &= -257,
                    i.flags |= 65536,
                    i.lanes = r,
                    l === iu ? i.flags |= 16384 : (e = i.updateQueue,
                    e === null ? i.updateQueue = new Set([l]) : e.add(l),
                    tc(t, l, r)),
                    !1;
                case 22:
                    return i.flags |= 65536,
                    l === iu ? i.flags |= 16384 : (e = i.updateQueue,
                    e === null ? (e = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([l])
                    },
                    i.updateQueue = e) : (i = e.retryQueue,
                    i === null ? e.retryQueue = new Set([l]) : i.add(l)),
                    tc(t, l, r)),
                    !1
                }
                throw Error(o(435, i.tag))
            }
            return tc(t, l, r),
            Wu(),
            !1
        }
        if (St)
            return e = Be.current,
            e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            e.flags |= 65536,
            e.lanes = r,
            l !== $r && (t = Error(o(422), {
                cause: l
            }),
            is(Oe(t, i)))) : (l !== $r && (e = Error(o(423), {
                cause: l
            }),
            is(Oe(e, i))),
            t = t.current.alternate,
            t.flags |= 65536,
            r &= -r,
            t.lanes |= r,
            l = Oe(l, i),
            r = Au(t.stateNode, l, r),
            lu(t, r),
            jt !== 4 && (jt = 2)),
            !1;
        var c = Error(o(520), {
            cause: l
        });
        if (c = Oe(c, i),
        Rs === null ? Rs = [c] : Rs.push(c),
        jt !== 4 && (jt = 2),
        e === null)
            return !0;
        l = Oe(l, i),
        i = e;
        do {
            switch (i.tag) {
            case 3:
                return i.flags |= 65536,
                t = r & -r,
                i.lanes |= t,
                t = Au(i.stateNode, l, t),
                lu(i, t),
                !1;
            case 1:
                if (e = i.type,
                c = i.stateNode,
                (i.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (Gn === null || !Gn.has(c))))
                    return i.flags |= 65536,
                    r &= -r,
                    i.lanes |= r,
                    r = Dm(r),
                    Lm(r, t, i, l),
                    lu(i, r),
                    !1
            }
            i = i.return
        } while (i !== null);
        return !1
    }
    var Om = Error(o(461))
      , Jt = !1;
    function te(t, e, i, l) {
        e.child = t === null ? Tm(e, null, i, l) : ua(e, t.child, i, l)
    }
    function Vm(t, e, i, l, r) {
        i = i.render;
        var c = e.ref;
        if ("ref" in l) {
            var v = {};
            for (var b in l)
                b !== "ref" && (v[b] = l[b])
        } else
            v = l;
        return Si(e),
        l = fu(t, e, i, v, c, r),
        b = hu(),
        t !== null && !Jt ? (du(t, e, r),
        gn(t, e, r)) : (St && b && Qr(e),
        e.flags |= 1,
        te(t, e, l, r),
        e.child)
    }
    function wm(t, e, i, l, r) {
        if (t === null) {
            var c = i.type;
            return typeof c == "function" && !Xr(c) && c.defaultProps === void 0 && i.compare === null ? (e.tag = 15,
            e.type = c,
            zm(t, e, c, l, r)) : (t = wl(i.type, null, l, e, e.mode, r),
            t.ref = e.ref,
            t.return = e,
            e.child = t)
        }
        if (c = t.child,
        !Uu(t, r)) {
            var v = c.memoizedProps;
            if (i = i.compare,
            i = i !== null ? i : Ia,
            i(v, l) && t.ref === e.ref)
                return gn(t, e, r)
        }
        return e.flags |= 1,
        t = fn(c, l),
        t.ref = e.ref,
        t.return = e,
        e.child = t
    }
    function zm(t, e, i, l, r) {
        if (t !== null) {
            var c = t.memoizedProps;
            if (Ia(c, l) && t.ref === e.ref)
                if (Jt = !1,
                e.pendingProps = l = c,
                Uu(t, r))
                    (t.flags & 131072) !== 0 && (Jt = !0);
                else
                    return e.lanes = t.lanes,
                    gn(t, e, r)
        }
        return Du(t, e, i, l, r)
    }
    function Bm(t, e, i) {
        var l = e.pendingProps
          , r = l.children
          , c = t !== null ? t.memoizedState : null;
        if (l.mode === "hidden") {
            if ((e.flags & 128) !== 0) {
                if (l = c !== null ? c.baseLanes | i : i,
                t !== null) {
                    for (r = e.child = t.child,
                    c = 0; r !== null; )
                        c = c | r.lanes | r.childLanes,
                        r = r.sibling;
                    e.childLanes = c & ~l
                } else
                    e.childLanes = 0,
                    e.child = null;
                return Um(t, e, l, i)
            }
            if ((i & 536870912) !== 0)
                e.memoizedState = {
                    baseLanes: 0,
                    cachePool: null
                },
                t !== null && jl(e, c !== null ? c.cachePool : null),
                c !== null ? zd(e, c) : ru(),
                Cm(e);
            else
                return e.lanes = e.childLanes = 536870912,
                Um(t, e, c !== null ? c.baseLanes | i : i, i)
        } else
            c !== null ? (jl(e, c.cachePool),
            zd(e, c),
            Nn(),
            e.memoizedState = null) : (t !== null && jl(e, null),
            ru(),
            Nn());
        return te(t, e, r, i),
        e.child
    }
    function Um(t, e, i, l) {
        var r = nu();
        return r = r === null ? null : {
            parent: Qt._currentValue,
            pool: r
        },
        e.memoizedState = {
            baseLanes: i,
            cachePool: r
        },
        t !== null && jl(e, null),
        ru(),
        Cm(e),
        t !== null && as(t, e, l, !0),
        null
    }
    function eo(t, e) {
        var i = e.ref;
        if (i === null)
            t !== null && t.ref !== null && (e.flags |= 4194816);
        else {
            if (typeof i != "function" && typeof i != "object")
                throw Error(o(284));
            (t === null || t.ref !== i) && (e.flags |= 4194816)
        }
    }
    function Du(t, e, i, l, r) {
        return Si(e),
        i = fu(t, e, i, l, void 0, r),
        l = hu(),
        t !== null && !Jt ? (du(t, e, r),
        gn(t, e, r)) : (St && l && Qr(e),
        e.flags |= 1,
        te(t, e, i, r),
        e.child)
    }
    function Nm(t, e, i, l, r, c) {
        return Si(e),
        e.updateQueue = null,
        i = Ud(e, l, i, r),
        Bd(t),
        l = hu(),
        t !== null && !Jt ? (du(t, e, c),
        gn(t, e, c)) : (St && l && Qr(e),
        e.flags |= 1,
        te(t, e, i, c),
        e.child)
    }
    function jm(t, e, i, l, r) {
        if (Si(e),
        e.stateNode === null) {
            var c = Ii
              , v = i.contextType;
            typeof v == "object" && v !== null && (c = oe(v)),
            c = new i(l,c),
            e.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null,
            c.updater = _u,
            e.stateNode = c,
            c._reactInternals = e,
            c = e.stateNode,
            c.props = l,
            c.state = e.memoizedState,
            c.refs = {},
            au(e),
            v = i.contextType,
            c.context = typeof v == "object" && v !== null ? oe(v) : Ii,
            c.state = e.memoizedState,
            v = i.getDerivedStateFromProps,
            typeof v == "function" && (Eu(e, i, v, l),
            c.state = e.memoizedState),
            typeof i.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (v = c.state,
            typeof c.componentWillMount == "function" && c.componentWillMount(),
            typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(),
            v !== c.state && _u.enqueueReplaceState(c, c.state, null),
            fs(e, l, c, r),
            cs(),
            c.state = e.memoizedState),
            typeof c.componentDidMount == "function" && (e.flags |= 4194308),
            l = !0
        } else if (t === null) {
            c = e.stateNode;
            var b = e.memoizedProps
              , x = Ci(i, b);
            c.props = x;
            var L = c.context
              , U = i.contextType;
            v = Ii,
            typeof U == "object" && U !== null && (v = oe(U));
            var P = i.getDerivedStateFromProps;
            U = typeof P == "function" || typeof c.getSnapshotBeforeUpdate == "function",
            b = e.pendingProps !== b,
            U || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (b || L !== v) && Rm(e, c, l, v),
            Vn = !1;
            var O = e.memoizedState;
            c.state = O,
            fs(e, l, c, r),
            cs(),
            L = e.memoizedState,
            b || O !== L || Vn ? (typeof P == "function" && (Eu(e, i, P, l),
            L = e.memoizedState),
            (x = Vn || xm(e, i, x, l, O, L, v)) ? (U || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(),
            typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()),
            typeof c.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (e.flags |= 4194308),
            e.memoizedProps = l,
            e.memoizedState = L),
            c.props = l,
            c.state = L,
            c.context = v,
            l = x) : (typeof c.componentDidMount == "function" && (e.flags |= 4194308),
            l = !1)
        } else {
            c = e.stateNode,
            su(t, e),
            v = e.memoizedProps,
            U = Ci(i, v),
            c.props = U,
            P = e.pendingProps,
            O = c.context,
            L = i.contextType,
            x = Ii,
            typeof L == "object" && L !== null && (x = oe(L)),
            b = i.getDerivedStateFromProps,
            (L = typeof b == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (v !== P || O !== x) && Rm(e, c, l, x),
            Vn = !1,
            O = e.memoizedState,
            c.state = O,
            fs(e, l, c, r),
            cs();
            var w = e.memoizedState;
            v !== P || O !== w || Vn || t !== null && t.dependencies !== null && Ul(t.dependencies) ? (typeof b == "function" && (Eu(e, i, b, l),
            w = e.memoizedState),
            (U = Vn || xm(e, i, U, l, O, w, x) || t !== null && t.dependencies !== null && Ul(t.dependencies)) ? (L || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(l, w, x),
            typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(l, w, x)),
            typeof c.componentDidUpdate == "function" && (e.flags |= 4),
            typeof c.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || v === t.memoizedProps && O === t.memoizedState || (e.flags |= 4),
            typeof c.getSnapshotBeforeUpdate != "function" || v === t.memoizedProps && O === t.memoizedState || (e.flags |= 1024),
            e.memoizedProps = l,
            e.memoizedState = w),
            c.props = l,
            c.state = w,
            c.context = x,
            l = U) : (typeof c.componentDidUpdate != "function" || v === t.memoizedProps && O === t.memoizedState || (e.flags |= 4),
            typeof c.getSnapshotBeforeUpdate != "function" || v === t.memoizedProps && O === t.memoizedState || (e.flags |= 1024),
            l = !1)
        }
        return c = l,
        eo(t, e),
        l = (e.flags & 128) !== 0,
        c || l ? (c = e.stateNode,
        i = l && typeof i.getDerivedStateFromError != "function" ? null : c.render(),
        e.flags |= 1,
        t !== null && l ? (e.child = ua(e, t.child, null, r),
        e.child = ua(e, null, i, r)) : te(t, e, i, r),
        e.memoizedState = c.state,
        t = e.child) : t = gn(t, e, r),
        t
    }
    function Pm(t, e, i, l) {
        return ns(),
        e.flags |= 256,
        te(t, e, i, l),
        e.child
    }
    var Lu = {
        dehydrated: null,
        treeContext: null,
        retryLane: 0,
        hydrationErrors: null
    };
    function Ou(t) {
        return {
            baseLanes: t,
            cachePool: Ed()
        }
    }
    function Vu(t, e, i) {
        return t = t !== null ? t.childLanes & ~i : 0,
        e && (t |= Ue),
        t
    }
    function Hm(t, e, i) {
        var l = e.pendingProps, r = !1, c = (e.flags & 128) !== 0, v;
        if ((v = c) || (v = t !== null && t.memoizedState === null ? !1 : (Ft.current & 2) !== 0),
        v && (r = !0,
        e.flags &= -129),
        v = (e.flags & 32) !== 0,
        e.flags &= -33,
        t === null) {
            if (St) {
                if (r ? Un(e) : Nn(),
                St) {
                    var b = Nt, x;
                    if (x = b) {
                        t: {
                            for (x = b,
                            b = Je; x.nodeType !== 8; ) {
                                if (!b) {
                                    b = null;
                                    break t
                                }
                                if (x = Qe(x.nextSibling),
                                x === null) {
                                    b = null;
                                    break t
                                }
                            }
                            b = x
                        }
                        b !== null ? (e.memoizedState = {
                            dehydrated: b,
                            treeContext: mi !== null ? {
                                id: hn,
                                overflow: dn
                            } : null,
                            retryLane: 536870912,
                            hydrationErrors: null
                        },
                        x = Ce(18, null, null, 0),
                        x.stateNode = b,
                        x.return = e,
                        e.child = x,
                        fe = e,
                        Nt = null,
                        x = !0) : x = !1
                    }
                    x || vi(e)
                }
                if (b = e.memoizedState,
                b !== null && (b = b.dehydrated,
                b !== null))
                    return pc(b) ? e.lanes = 32 : e.lanes = 536870912,
                    null;
                vn(e)
            }
            return b = l.children,
            l = l.fallback,
            r ? (Nn(),
            r = e.mode,
            b = no({
                mode: "hidden",
                children: b
            }, r),
            l = di(l, r, i, null),
            b.return = e,
            l.return = e,
            b.sibling = l,
            e.child = b,
            r = e.child,
            r.memoizedState = Ou(i),
            r.childLanes = Vu(t, v, i),
            e.memoizedState = Lu,
            l) : (Un(e),
            wu(e, b))
        }
        if (x = t.memoizedState,
        x !== null && (b = x.dehydrated,
        b !== null)) {
            if (c)
                e.flags & 256 ? (Un(e),
                e.flags &= -257,
                e = zu(t, e, i)) : e.memoizedState !== null ? (Nn(),
                e.child = t.child,
                e.flags |= 128,
                e = null) : (Nn(),
                r = l.fallback,
                b = e.mode,
                l = no({
                    mode: "visible",
                    children: l.children
                }, b),
                r = di(r, b, i, null),
                r.flags |= 2,
                l.return = e,
                r.return = e,
                l.sibling = r,
                e.child = l,
                ua(e, t.child, null, i),
                l = e.child,
                l.memoizedState = Ou(i),
                l.childLanes = Vu(t, v, i),
                e.memoizedState = Lu,
                e = r);
            else if (Un(e),
            pc(b)) {
                if (v = b.nextSibling && b.nextSibling.dataset,
                v)
                    var L = v.dgst;
                v = L,
                l = Error(o(419)),
                l.stack = "",
                l.digest = v,
                is({
                    value: l,
                    source: null,
                    stack: null
                }),
                e = zu(t, e, i)
            } else if (Jt || as(t, e, i, !1),
            v = (i & t.childLanes) !== 0,
            Jt || v) {
                if (v = At,
                v !== null && (l = i & -i,
                l = (l & 42) !== 0 ? 1 : yr(l),
                l = (l & (v.suspendedLanes | i)) !== 0 ? 0 : l,
                l !== 0 && l !== x.retryLane))
                    throw x.retryLane = l,
                    Wi(t, l),
                    _e(v, t, l),
                    Om;
                b.data === "$?" || Wu(),
                e = zu(t, e, i)
            } else
                b.data === "$?" ? (e.flags |= 192,
                e.child = t.child,
                e = null) : (t = x.treeContext,
                Nt = Qe(b.nextSibling),
                fe = e,
                St = !0,
                yi = null,
                Je = !1,
                t !== null && (we[ze++] = hn,
                we[ze++] = dn,
                we[ze++] = mi,
                hn = t.id,
                dn = t.overflow,
                mi = e),
                e = wu(e, l.children),
                e.flags |= 4096);
            return e
        }
        return r ? (Nn(),
        r = l.fallback,
        b = e.mode,
        x = t.child,
        L = x.sibling,
        l = fn(x, {
            mode: "hidden",
            children: l.children
        }),
        l.subtreeFlags = x.subtreeFlags & 65011712,
        L !== null ? r = fn(L, r) : (r = di(r, b, i, null),
        r.flags |= 2),
        r.return = e,
        l.return = e,
        l.sibling = r,
        e.child = l,
        l = r,
        r = e.child,
        b = t.child.memoizedState,
        b === null ? b = Ou(i) : (x = b.cachePool,
        x !== null ? (L = Qt._currentValue,
        x = x.parent !== L ? {
            parent: L,
            pool: L
        } : x) : x = Ed(),
        b = {
            baseLanes: b.baseLanes | i,
            cachePool: x
        }),
        r.memoizedState = b,
        r.childLanes = Vu(t, v, i),
        e.memoizedState = Lu,
        l) : (Un(e),
        i = t.child,
        t = i.sibling,
        i = fn(i, {
            mode: "visible",
            children: l.children
        }),
        i.return = e,
        i.sibling = null,
        t !== null && (v = e.deletions,
        v === null ? (e.deletions = [t],
        e.flags |= 16) : v.push(t)),
        e.child = i,
        e.memoizedState = null,
        i)
    }
    function wu(t, e) {
        return e = no({
            mode: "visible",
            children: e
        }, t.mode),
        e.return = t,
        t.child = e
    }
    function no(t, e) {
        return t = Ce(22, t, null, e),
        t.lanes = 0,
        t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null
        },
        t
    }
    function zu(t, e, i) {
        return ua(e, t.child, null, i),
        t = wu(e, e.pendingProps.children),
        t.flags |= 2,
        e.memoizedState = null,
        t
    }
    function qm(t, e, i) {
        t.lanes |= e;
        var l = t.alternate;
        l !== null && (l.lanes |= e),
        Wr(t.return, e, i)
    }
    function Bu(t, e, i, l, r) {
        var c = t.memoizedState;
        c === null ? t.memoizedState = {
            isBackwards: e,
            rendering: null,
            renderingStartTime: 0,
            last: l,
            tail: i,
            tailMode: r
        } : (c.isBackwards = e,
        c.rendering = null,
        c.renderingStartTime = 0,
        c.last = l,
        c.tail = i,
        c.tailMode = r)
    }
    function Ym(t, e, i) {
        var l = e.pendingProps
          , r = l.revealOrder
          , c = l.tail;
        if (te(t, e, l.children, i),
        l = Ft.current,
        (l & 2) !== 0)
            l = l & 1 | 2,
            e.flags |= 128;
        else {
            if (t !== null && (t.flags & 128) !== 0)
                t: for (t = e.child; t !== null; ) {
                    if (t.tag === 13)
                        t.memoizedState !== null && qm(t, i, e);
                    else if (t.tag === 19)
                        qm(t, i, e);
                    else if (t.child !== null) {
                        t.child.return = t,
                        t = t.child;
                        continue
                    }
                    if (t === e)
                        break t;
                    for (; t.sibling === null; ) {
                        if (t.return === null || t.return === e)
                            break t;
                        t = t.return
                    }
                    t.sibling.return = t.return,
                    t = t.sibling
                }
            l &= 1
        }
        switch ($(Ft, l),
        r) {
        case "forwards":
            for (i = e.child,
            r = null; i !== null; )
                t = i.alternate,
                t !== null && Wl(t) === null && (r = i),
                i = i.sibling;
            i = r,
            i === null ? (r = e.child,
            e.child = null) : (r = i.sibling,
            i.sibling = null),
            Bu(e, !1, r, i, c);
            break;
        case "backwards":
            for (i = null,
            r = e.child,
            e.child = null; r !== null; ) {
                if (t = r.alternate,
                t !== null && Wl(t) === null) {
                    e.child = r;
                    break
                }
                t = r.sibling,
                r.sibling = i,
                i = r,
                r = t
            }
            Bu(e, !0, i, null, c);
            break;
        case "together":
            Bu(e, !1, null, null, void 0);
            break;
        default:
            e.memoizedState = null
        }
        return e.child
    }
    function gn(t, e, i) {
        if (t !== null && (e.dependencies = t.dependencies),
        Yn |= e.lanes,
        (i & e.childLanes) === 0)
            if (t !== null) {
                if (as(t, e, i, !1),
                (i & e.childLanes) === 0)
                    return null
            } else
                return null;
        if (t !== null && e.child !== t.child)
            throw Error(o(153));
        if (e.child !== null) {
            for (t = e.child,
            i = fn(t, t.pendingProps),
            e.child = i,
            i.return = e; t.sibling !== null; )
                t = t.sibling,
                i = i.sibling = fn(t, t.pendingProps),
                i.return = e;
            i.sibling = null
        }
        return e.child
    }
    function Uu(t, e) {
        return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies,
        !!(t !== null && Ul(t)))
    }
    function m2(t, e, i) {
        switch (e.tag) {
        case 3:
            bt(e, e.stateNode.containerInfo),
            On(e, Qt, t.memoizedState.cache),
            ns();
            break;
        case 27:
        case 5:
            si(e);
            break;
        case 4:
            bt(e, e.stateNode.containerInfo);
            break;
        case 10:
            On(e, e.type, e.memoizedProps.value);
            break;
        case 13:
            var l = e.memoizedState;
            if (l !== null)
                return l.dehydrated !== null ? (Un(e),
                e.flags |= 128,
                null) : (i & e.child.childLanes) !== 0 ? Hm(t, e, i) : (Un(e),
                t = gn(t, e, i),
                t !== null ? t.sibling : null);
            Un(e);
            break;
        case 19:
            var r = (t.flags & 128) !== 0;
            if (l = (i & e.childLanes) !== 0,
            l || (as(t, e, i, !1),
            l = (i & e.childLanes) !== 0),
            r) {
                if (l)
                    return Ym(t, e, i);
                e.flags |= 128
            }
            if (r = e.memoizedState,
            r !== null && (r.rendering = null,
            r.tail = null,
            r.lastEffect = null),
            $(Ft, Ft.current),
            l)
                break;
            return null;
        case 22:
        case 23:
            return e.lanes = 0,
            Bm(t, e, i);
        case 24:
            On(e, Qt, t.memoizedState.cache)
        }
        return gn(t, e, i)
    }
    function Gm(t, e, i) {
        if (t !== null)
            if (t.memoizedProps !== e.pendingProps)
                Jt = !0;
            else {
                if (!Uu(t, i) && (e.flags & 128) === 0)
                    return Jt = !1,
                    m2(t, e, i);
                Jt = (t.flags & 131072) !== 0
            }
        else
            Jt = !1,
            St && (e.flags & 1048576) !== 0 && Sd(e, Bl, e.index);
        switch (e.lanes = 0,
        e.tag) {
        case 16:
            t: {
                t = e.pendingProps;
                var l = e.elementType
                  , r = l._init;
                if (l = r(l._payload),
                e.type = l,
                typeof l == "function")
                    Xr(l) ? (t = Ci(l, t),
                    e.tag = 1,
                    e = jm(null, e, l, t, i)) : (e.tag = 0,
                    e = Du(null, e, l, t, i));
                else {
                    if (l != null) {
                        if (r = l.$$typeof,
                        r === G) {
                            e.tag = 11,
                            e = Vm(null, e, l, t, i);
                            break t
                        } else if (r === Q) {
                            e.tag = 14,
                            e = wm(null, e, l, t, i);
                            break t
                        }
                    }
                    throw e = _t(l) || l,
                    Error(o(306, e, ""))
                }
            }
            return e;
        case 0:
            return Du(t, e, e.type, e.pendingProps, i);
        case 1:
            return l = e.type,
            r = Ci(l, e.pendingProps),
            jm(t, e, l, r, i);
        case 3:
            t: {
                if (bt(e, e.stateNode.containerInfo),
                t === null)
                    throw Error(o(387));
                l = e.pendingProps;
                var c = e.memoizedState;
                r = c.element,
                su(t, e),
                fs(e, l, null, i);
                var v = e.memoizedState;
                if (l = v.cache,
                On(e, Qt, l),
                l !== c.cache && Ir(e, [Qt], i, !0),
                cs(),
                l = v.element,
                c.isDehydrated)
                    if (c = {
                        element: l,
                        isDehydrated: !1,
                        cache: v.cache
                    },
                    e.updateQueue.baseState = c,
                    e.memoizedState = c,
                    e.flags & 256) {
                        e = Pm(t, e, l, i);
                        break t
                    } else if (l !== r) {
                        r = Oe(Error(o(424)), e),
                        is(r),
                        e = Pm(t, e, l, i);
                        break t
                    } else {
                        switch (t = e.stateNode.containerInfo,
                        t.nodeType) {
                        case 9:
                            t = t.body;
                            break;
                        default:
                            t = t.nodeName === "HTML" ? t.ownerDocument.body : t
                        }
                        for (Nt = Qe(t.firstChild),
                        fe = e,
                        St = !0,
                        yi = null,
                        Je = !0,
                        i = Tm(e, null, l, i),
                        e.child = i; i; )
                            i.flags = i.flags & -3 | 4096,
                            i = i.sibling
                    }
                else {
                    if (ns(),
                    l === r) {
                        e = gn(t, e, i);
                        break t
                    }
                    te(t, e, l, i)
                }
                e = e.child
            }
            return e;
        case 26:
            return eo(t, e),
            t === null ? (i = Zp(e.type, null, e.pendingProps, null)) ? e.memoizedState = i : St || (i = e.type,
            t = e.pendingProps,
            l = vo(ot.current).createElement(i),
            l[le] = e,
            l[de] = t,
            ne(l, i, t),
            $t(l),
            e.stateNode = l) : e.memoizedState = Zp(e.type, t.memoizedProps, e.pendingProps, t.memoizedState),
            null;
        case 27:
            return si(e),
            t === null && St && (l = e.stateNode = kp(e.type, e.pendingProps, ot.current),
            fe = e,
            Je = !0,
            r = Nt,
            Kn(e.type) ? (yc = r,
            Nt = Qe(l.firstChild)) : Nt = r),
            te(t, e, e.pendingProps.children, i),
            eo(t, e),
            t === null && (e.flags |= 4194304),
            e.child;
        case 5:
            return t === null && St && ((r = l = Nt) && (l = Y2(l, e.type, e.pendingProps, Je),
            l !== null ? (e.stateNode = l,
            fe = e,
            Nt = Qe(l.firstChild),
            Je = !1,
            r = !0) : r = !1),
            r || vi(e)),
            si(e),
            r = e.type,
            c = e.pendingProps,
            v = t !== null ? t.memoizedProps : null,
            l = c.children,
            hc(r, c) ? l = null : v !== null && hc(r, v) && (e.flags |= 32),
            e.memoizedState !== null && (r = fu(t, e, l2, null, null, i),
            ws._currentValue = r),
            eo(t, e),
            te(t, e, l, i),
            e.child;
        case 6:
            return t === null && St && ((t = i = Nt) && (i = G2(i, e.pendingProps, Je),
            i !== null ? (e.stateNode = i,
            fe = e,
            Nt = null,
            t = !0) : t = !1),
            t || vi(e)),
            null;
        case 13:
            return Hm(t, e, i);
        case 4:
            return bt(e, e.stateNode.containerInfo),
            l = e.pendingProps,
            t === null ? e.child = ua(e, null, l, i) : te(t, e, l, i),
            e.child;
        case 11:
            return Vm(t, e, e.type, e.pendingProps, i);
        case 7:
            return te(t, e, e.pendingProps, i),
            e.child;
        case 8:
            return te(t, e, e.pendingProps.children, i),
            e.child;
        case 12:
            return te(t, e, e.pendingProps.children, i),
            e.child;
        case 10:
            return l = e.pendingProps,
            On(e, e.type, l.value),
            te(t, e, l.children, i),
            e.child;
        case 9:
            return r = e.type._context,
            l = e.pendingProps.children,
            Si(e),
            r = oe(r),
            l = l(r),
            e.flags |= 1,
            te(t, e, l, i),
            e.child;
        case 14:
            return wm(t, e, e.type, e.pendingProps, i);
        case 15:
            return zm(t, e, e.type, e.pendingProps, i);
        case 19:
            return Ym(t, e, i);
        case 31:
            return l = e.pendingProps,
            i = e.mode,
            l = {
                mode: l.mode,
                children: l.children
            },
            t === null ? (i = no(l, i),
            i.ref = e.ref,
            e.child = i,
            i.return = e,
            e = i) : (i = fn(t.child, l),
            i.ref = e.ref,
            e.child = i,
            i.return = e,
            e = i),
            e;
        case 22:
            return Bm(t, e, i);
        case 24:
            return Si(e),
            l = oe(Qt),
            t === null ? (r = nu(),
            r === null && (r = At,
            c = tu(),
            r.pooledCache = c,
            c.refCount++,
            c !== null && (r.pooledCacheLanes |= i),
            r = c),
            e.memoizedState = {
                parent: l,
                cache: r
            },
            au(e),
            On(e, Qt, r)) : ((t.lanes & i) !== 0 && (su(t, e),
            fs(e, null, null, i),
            cs()),
            r = t.memoizedState,
            c = e.memoizedState,
            r.parent !== l ? (r = {
                parent: l,
                cache: l
            },
            e.memoizedState = r,
            e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = r),
            On(e, Qt, l)) : (l = c.cache,
            On(e, Qt, l),
            l !== r.cache && Ir(e, [Qt], i, !0))),
            te(t, e, e.pendingProps.children, i),
            e.child;
        case 29:
            throw e.pendingProps
        }
        throw Error(o(156, e.tag))
    }
    function Sn(t) {
        t.flags |= 4
    }
    function km(t, e) {
        if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
            t.flags &= -16777217;
        else if (t.flags |= 16777216,
        !Wp(e)) {
            if (e = Be.current,
            e !== null && ((vt & 4194048) === vt ? We !== null : (vt & 62914560) !== vt && (vt & 536870912) === 0 || e !== We))
                throw rs = iu,
                _d;
            t.flags |= 8192
        }
    }
    function io(t, e) {
        e !== null && (t.flags |= 4),
        t.flags & 16384 && (e = t.tag !== 22 ? Ch() : 536870912,
        t.lanes |= e,
        da |= e)
    }
    function gs(t, e) {
        if (!St)
            switch (t.tailMode) {
            case "hidden":
                e = t.tail;
                for (var i = null; e !== null; )
                    e.alternate !== null && (i = e),
                    e = e.sibling;
                i === null ? t.tail = null : i.sibling = null;
                break;
            case "collapsed":
                i = t.tail;
                for (var l = null; i !== null; )
                    i.alternate !== null && (l = i),
                    i = i.sibling;
                l === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : l.sibling = null
            }
    }
    function wt(t) {
        var e = t.alternate !== null && t.alternate.child === t.child
          , i = 0
          , l = 0;
        if (e)
            for (var r = t.child; r !== null; )
                i |= r.lanes | r.childLanes,
                l |= r.subtreeFlags & 65011712,
                l |= r.flags & 65011712,
                r.return = t,
                r = r.sibling;
        else
            for (r = t.child; r !== null; )
                i |= r.lanes | r.childLanes,
                l |= r.subtreeFlags,
                l |= r.flags,
                r.return = t,
                r = r.sibling;
        return t.subtreeFlags |= l,
        t.childLanes = i,
        e
    }
    function p2(t, e, i) {
        var l = e.pendingProps;
        switch (Fr(e),
        e.tag) {
        case 31:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return wt(e),
            null;
        case 1:
            return wt(e),
            null;
        case 3:
            return i = e.stateNode,
            l = null,
            t !== null && (l = t.memoizedState.cache),
            e.memoizedState.cache !== l && (e.flags |= 2048),
            pn(Qt),
            se(),
            i.pendingContext && (i.context = i.pendingContext,
            i.pendingContext = null),
            (t === null || t.child === null) && (es(e) ? Sn(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024,
            Cd())),
            wt(e),
            null;
        case 26:
            return i = e.memoizedState,
            t === null ? (Sn(e),
            i !== null ? (wt(e),
            km(e, i)) : (wt(e),
            e.flags &= -16777217)) : i ? i !== t.memoizedState ? (Sn(e),
            wt(e),
            km(e, i)) : (wt(e),
            e.flags &= -16777217) : (t.memoizedProps !== l && Sn(e),
            wt(e),
            e.flags &= -16777217),
            null;
        case 27:
            ke(e),
            i = ot.current;
            var r = e.type;
            if (t !== null && e.stateNode != null)
                t.memoizedProps !== l && Sn(e);
            else {
                if (!l) {
                    if (e.stateNode === null)
                        throw Error(o(166));
                    return wt(e),
                    null
                }
                t = nt.current,
                es(e) ? bd(e) : (t = kp(r, l, i),
                e.stateNode = t,
                Sn(e))
            }
            return wt(e),
            null;
        case 5:
            if (ke(e),
            i = e.type,
            t !== null && e.stateNode != null)
                t.memoizedProps !== l && Sn(e);
            else {
                if (!l) {
                    if (e.stateNode === null)
                        throw Error(o(166));
                    return wt(e),
                    null
                }
                if (t = nt.current,
                es(e))
                    bd(e);
                else {
                    switch (r = vo(ot.current),
                    t) {
                    case 1:
                        t = r.createElementNS("http://www.w3.org/2000/svg", i);
                        break;
                    case 2:
                        t = r.createElementNS("http://www.w3.org/1998/Math/MathML", i);
                        break;
                    default:
                        switch (i) {
                        case "svg":
                            t = r.createElementNS("http://www.w3.org/2000/svg", i);
                            break;
                        case "math":
                            t = r.createElementNS("http://www.w3.org/1998/Math/MathML", i);
                            break;
                        case "script":
                            t = r.createElement("div"),
                            t.innerHTML = "<script><\/script>",
                            t = t.removeChild(t.firstChild);
                            break;
                        case "select":
                            t = typeof l.is == "string" ? r.createElement("select", {
                                is: l.is
                            }) : r.createElement("select"),
                            l.multiple ? t.multiple = !0 : l.size && (t.size = l.size);
                            break;
                        default:
                            t = typeof l.is == "string" ? r.createElement(i, {
                                is: l.is
                            }) : r.createElement(i)
                        }
                    }
                    t[le] = e,
                    t[de] = l;
                    t: for (r = e.child; r !== null; ) {
                        if (r.tag === 5 || r.tag === 6)
                            t.appendChild(r.stateNode);
                        else if (r.tag !== 4 && r.tag !== 27 && r.child !== null) {
                            r.child.return = r,
                            r = r.child;
                            continue
                        }
                        if (r === e)
                            break t;
                        for (; r.sibling === null; ) {
                            if (r.return === null || r.return === e)
                                break t;
                            r = r.return
                        }
                        r.sibling.return = r.return,
                        r = r.sibling
                    }
                    e.stateNode = t;
                    t: switch (ne(t, i, l),
                    i) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                        t = !!l.autoFocus;
                        break t;
                    case "img":
                        t = !0;
                        break t;
                    default:
                        t = !1
                    }
                    t && Sn(e)
                }
            }
            return wt(e),
            e.flags &= -16777217,
            null;
        case 6:
            if (t && e.stateNode != null)
                t.memoizedProps !== l && Sn(e);
            else {
                if (typeof l != "string" && e.stateNode === null)
                    throw Error(o(166));
                if (t = ot.current,
                es(e)) {
                    if (t = e.stateNode,
                    i = e.memoizedProps,
                    l = null,
                    r = fe,
                    r !== null)
                        switch (r.tag) {
                        case 27:
                        case 5:
                            l = r.memoizedProps
                        }
                    t[le] = e,
                    t = !!(t.nodeValue === i || l !== null && l.suppressHydrationWarning === !0 || Np(t.nodeValue, i)),
                    t || vi(e)
                } else
                    t = vo(t).createTextNode(l),
                    t[le] = e,
                    e.stateNode = t
            }
            return wt(e),
            null;
        case 13:
            if (l = e.memoizedState,
            t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
                if (r = es(e),
                l !== null && l.dehydrated !== null) {
                    if (t === null) {
                        if (!r)
                            throw Error(o(318));
                        if (r = e.memoizedState,
                        r = r !== null ? r.dehydrated : null,
                        !r)
                            throw Error(o(317));
                        r[le] = e
                    } else
                        ns(),
                        (e.flags & 128) === 0 && (e.memoizedState = null),
                        e.flags |= 4;
                    wt(e),
                    r = !1
                } else
                    r = Cd(),
                    t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = r),
                    r = !0;
                if (!r)
                    return e.flags & 256 ? (vn(e),
                    e) : (vn(e),
                    null)
            }
            if (vn(e),
            (e.flags & 128) !== 0)
                return e.lanes = i,
                e;
            if (i = l !== null,
            t = t !== null && t.memoizedState !== null,
            i) {
                l = e.child,
                r = null,
                l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (r = l.alternate.memoizedState.cachePool.pool);
                var c = null;
                l.memoizedState !== null && l.memoizedState.cachePool !== null && (c = l.memoizedState.cachePool.pool),
                c !== r && (l.flags |= 2048)
            }
            return i !== t && i && (e.child.flags |= 8192),
            io(e, e.updateQueue),
            wt(e),
            null;
        case 4:
            return se(),
            t === null && oc(e.stateNode.containerInfo),
            wt(e),
            null;
        case 10:
            return pn(e.type),
            wt(e),
            null;
        case 19:
            if (J(Ft),
            r = e.memoizedState,
            r === null)
                return wt(e),
                null;
            if (l = (e.flags & 128) !== 0,
            c = r.rendering,
            c === null)
                if (l)
                    gs(r, !1);
                else {
                    if (jt !== 0 || t !== null && (t.flags & 128) !== 0)
                        for (t = e.child; t !== null; ) {
                            if (c = Wl(t),
                            c !== null) {
                                for (e.flags |= 128,
                                gs(r, !1),
                                t = c.updateQueue,
                                e.updateQueue = t,
                                io(e, t),
                                e.subtreeFlags = 0,
                                t = i,
                                i = e.child; i !== null; )
                                    gd(i, t),
                                    i = i.sibling;
                                return $(Ft, Ft.current & 1 | 2),
                                e.child
                            }
                            t = t.sibling
                        }
                    r.tail !== null && Se() > lo && (e.flags |= 128,
                    l = !0,
                    gs(r, !1),
                    e.lanes = 4194304)
                }
            else {
                if (!l)
                    if (t = Wl(c),
                    t !== null) {
                        if (e.flags |= 128,
                        l = !0,
                        t = t.updateQueue,
                        e.updateQueue = t,
                        io(e, t),
                        gs(r, !0),
                        r.tail === null && r.tailMode === "hidden" && !c.alternate && !St)
                            return wt(e),
                            null
                    } else
                        2 * Se() - r.renderingStartTime > lo && i !== 536870912 && (e.flags |= 128,
                        l = !0,
                        gs(r, !1),
                        e.lanes = 4194304);
                r.isBackwards ? (c.sibling = e.child,
                e.child = c) : (t = r.last,
                t !== null ? t.sibling = c : e.child = c,
                r.last = c)
            }
            return r.tail !== null ? (e = r.tail,
            r.rendering = e,
            r.tail = e.sibling,
            r.renderingStartTime = Se(),
            e.sibling = null,
            t = Ft.current,
            $(Ft, l ? t & 1 | 2 : t & 1),
            e) : (wt(e),
            null);
        case 22:
        case 23:
            return vn(e),
            uu(),
            l = e.memoizedState !== null,
            t !== null ? t.memoizedState !== null !== l && (e.flags |= 8192) : l && (e.flags |= 8192),
            l ? (i & 536870912) !== 0 && (e.flags & 128) === 0 && (wt(e),
            e.subtreeFlags & 6 && (e.flags |= 8192)) : wt(e),
            i = e.updateQueue,
            i !== null && io(e, i.retryQueue),
            i = null,
            t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (i = t.memoizedState.cachePool.pool),
            l = null,
            e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool),
            l !== i && (e.flags |= 2048),
            t !== null && J(bi),
            null;
        case 24:
            return i = null,
            t !== null && (i = t.memoizedState.cache),
            e.memoizedState.cache !== i && (e.flags |= 2048),
            pn(Qt),
            wt(e),
            null;
        case 25:
            return null;
        case 30:
            return null
        }
        throw Error(o(156, e.tag))
    }
    function y2(t, e) {
        switch (Fr(e),
        e.tag) {
        case 1:
            return t = e.flags,
            t & 65536 ? (e.flags = t & -65537 | 128,
            e) : null;
        case 3:
            return pn(Qt),
            se(),
            t = e.flags,
            (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128,
            e) : null;
        case 26:
        case 27:
        case 5:
            return ke(e),
            null;
        case 13:
            if (vn(e),
            t = e.memoizedState,
            t !== null && t.dehydrated !== null) {
                if (e.alternate === null)
                    throw Error(o(340));
                ns()
            }
            return t = e.flags,
            t & 65536 ? (e.flags = t & -65537 | 128,
            e) : null;
        case 19:
            return J(Ft),
            null;
        case 4:
            return se(),
            null;
        case 10:
            return pn(e.type),
            null;
        case 22:
        case 23:
            return vn(e),
            uu(),
            t !== null && J(bi),
            t = e.flags,
            t & 65536 ? (e.flags = t & -65537 | 128,
            e) : null;
        case 24:
            return pn(Qt),
            null;
        case 25:
            return null;
        default:
            return null
        }
    }
    function Xm(t, e) {
        switch (Fr(e),
        e.tag) {
        case 3:
            pn(Qt),
            se();
            break;
        case 26:
        case 27:
        case 5:
            ke(e);
            break;
        case 4:
            se();
            break;
        case 13:
            vn(e);
            break;
        case 19:
            J(Ft);
            break;
        case 10:
            pn(e.type);
            break;
        case 22:
        case 23:
            vn(e),
            uu(),
            t !== null && J(bi);
            break;
        case 24:
            pn(Qt)
        }
    }
    function Ss(t, e) {
        try {
            var i = e.updateQueue
              , l = i !== null ? i.lastEffect : null;
            if (l !== null) {
                var r = l.next;
                i = r;
                do {
                    if ((i.tag & t) === t) {
                        l = void 0;
                        var c = i.create
                          , v = i.inst;
                        l = c(),
                        v.destroy = l
                    }
                    i = i.next
                } while (i !== r)
            }
        } catch (b) {
            Et(e, e.return, b)
        }
    }
    function jn(t, e, i) {
        try {
            var l = e.updateQueue
              , r = l !== null ? l.lastEffect : null;
            if (r !== null) {
                var c = r.next;
                l = c;
                do {
                    if ((l.tag & t) === t) {
                        var v = l.inst
                          , b = v.destroy;
                        if (b !== void 0) {
                            v.destroy = void 0,
                            r = e;
                            var x = i
                              , L = b;
                            try {
                                L()
                            } catch (U) {
                                Et(r, x, U)
                            }
                        }
                    }
                    l = l.next
                } while (l !== c)
            }
        } catch (U) {
            Et(e, e.return, U)
        }
    }
    function Km(t) {
        var e = t.updateQueue;
        if (e !== null) {
            var i = t.stateNode;
            try {
                wd(e, i)
            } catch (l) {
                Et(t, t.return, l)
            }
        }
    }
    function Zm(t, e, i) {
        i.props = Ci(t.type, t.memoizedProps),
        i.state = t.memoizedState;
        try {
            i.componentWillUnmount()
        } catch (l) {
            Et(t, e, l)
        }
    }
    function bs(t, e) {
        try {
            var i = t.ref;
            if (i !== null) {
                switch (t.tag) {
                case 26:
                case 27:
                case 5:
                    var l = t.stateNode;
                    break;
                case 30:
                    l = t.stateNode;
                    break;
                default:
                    l = t.stateNode
                }
                typeof i == "function" ? t.refCleanup = i(l) : i.current = l
            }
        } catch (r) {
            Et(t, e, r)
        }
    }
    function Ie(t, e) {
        var i = t.ref
          , l = t.refCleanup;
        if (i !== null)
            if (typeof l == "function")
                try {
                    l()
                } catch (r) {
                    Et(t, e, r)
                } finally {
                    t.refCleanup = null,
                    t = t.alternate,
                    t != null && (t.refCleanup = null)
                }
            else if (typeof i == "function")
                try {
                    i(null)
                } catch (r) {
                    Et(t, e, r)
                }
            else
                i.current = null
    }
    function Qm(t) {
        var e = t.type
          , i = t.memoizedProps
          , l = t.stateNode;
        try {
            t: switch (e) {
            case "button":
            case "input":
            case "select":
            case "textarea":
                i.autoFocus && l.focus();
                break t;
            case "img":
                i.src ? l.src = i.src : i.srcSet && (l.srcset = i.srcSet)
            }
        } catch (r) {
            Et(t, t.return, r)
        }
    }
    function Nu(t, e, i) {
        try {
            var l = t.stateNode;
            N2(l, t.type, i, e),
            l[de] = e
        } catch (r) {
            Et(t, t.return, r)
        }
    }
    function Fm(t) {
        return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Kn(t.type) || t.tag === 4
    }
    function ju(t) {
        t: for (; ; ) {
            for (; t.sibling === null; ) {
                if (t.return === null || Fm(t.return))
                    return null;
                t = t.return
            }
            for (t.sibling.return = t.return,
            t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
                if (t.tag === 27 && Kn(t.type) || t.flags & 2 || t.child === null || t.tag === 4)
                    continue t;
                t.child.return = t,
                t = t.child
            }
            if (!(t.flags & 2))
                return t.stateNode
        }
    }
    function Pu(t, e, i) {
        var l = t.tag;
        if (l === 5 || l === 6)
            t = t.stateNode,
            e ? (i.nodeType === 9 ? i.body : i.nodeName === "HTML" ? i.ownerDocument.body : i).insertBefore(t, e) : (e = i.nodeType === 9 ? i.body : i.nodeName === "HTML" ? i.ownerDocument.body : i,
            e.appendChild(t),
            i = i._reactRootContainer,
            i != null || e.onclick !== null || (e.onclick = yo));
        else if (l !== 4 && (l === 27 && Kn(t.type) && (i = t.stateNode,
        e = null),
        t = t.child,
        t !== null))
            for (Pu(t, e, i),
            t = t.sibling; t !== null; )
                Pu(t, e, i),
                t = t.sibling
    }
    function ao(t, e, i) {
        var l = t.tag;
        if (l === 5 || l === 6)
            t = t.stateNode,
            e ? i.insertBefore(t, e) : i.appendChild(t);
        else if (l !== 4 && (l === 27 && Kn(t.type) && (i = t.stateNode),
        t = t.child,
        t !== null))
            for (ao(t, e, i),
            t = t.sibling; t !== null; )
                ao(t, e, i),
                t = t.sibling
    }
    function $m(t) {
        var e = t.stateNode
          , i = t.memoizedProps;
        try {
            for (var l = t.type, r = e.attributes; r.length; )
                e.removeAttributeNode(r[0]);
            ne(e, l, i),
            e[le] = t,
            e[de] = i
        } catch (c) {
            Et(t, t.return, c)
        }
    }
    var bn = !1
      , qt = !1
      , Hu = !1
      , Jm = typeof WeakSet == "function" ? WeakSet : Set
      , Wt = null;
    function v2(t, e) {
        if (t = t.containerInfo,
        cc = xo,
        t = rd(t),
        jr(t)) {
            if ("selectionStart" in t)
                var i = {
                    start: t.selectionStart,
                    end: t.selectionEnd
                };
            else
                t: {
                    i = (i = t.ownerDocument) && i.defaultView || window;
                    var l = i.getSelection && i.getSelection();
                    if (l && l.rangeCount !== 0) {
                        i = l.anchorNode;
                        var r = l.anchorOffset
                          , c = l.focusNode;
                        l = l.focusOffset;
                        try {
                            i.nodeType,
                            c.nodeType
                        } catch {
                            i = null;
                            break t
                        }
                        var v = 0
                          , b = -1
                          , x = -1
                          , L = 0
                          , U = 0
                          , P = t
                          , O = null;
                        e: for (; ; ) {
                            for (var w; P !== i || r !== 0 && P.nodeType !== 3 || (b = v + r),
                            P !== c || l !== 0 && P.nodeType !== 3 || (x = v + l),
                            P.nodeType === 3 && (v += P.nodeValue.length),
                            (w = P.firstChild) !== null; )
                                O = P,
                                P = w;
                            for (; ; ) {
                                if (P === t)
                                    break e;
                                if (O === i && ++L === r && (b = v),
                                O === c && ++U === l && (x = v),
                                (w = P.nextSibling) !== null)
                                    break;
                                P = O,
                                O = P.parentNode
                            }
                            P = w
                        }
                        i = b === -1 || x === -1 ? null : {
                            start: b,
                            end: x
                        }
                    } else
                        i = null
                }
            i = i || {
                start: 0,
                end: 0
            }
        } else
            i = null;
        for (fc = {
            focusedElem: t,
            selectionRange: i
        },
        xo = !1,
        Wt = e; Wt !== null; )
            if (e = Wt,
            t = e.child,
            (e.subtreeFlags & 1024) !== 0 && t !== null)
                t.return = e,
                Wt = t;
            else
                for (; Wt !== null; ) {
                    switch (e = Wt,
                    c = e.alternate,
                    t = e.flags,
                    e.tag) {
                    case 0:
                        break;
                    case 11:
                    case 15:
                        break;
                    case 1:
                        if ((t & 1024) !== 0 && c !== null) {
                            t = void 0,
                            i = e,
                            r = c.memoizedProps,
                            c = c.memoizedState,
                            l = i.stateNode;
                            try {
                                var st = Ci(i.type, r, i.elementType === i.type);
                                t = l.getSnapshotBeforeUpdate(st, c),
                                l.__reactInternalSnapshotBeforeUpdate = t
                            } catch (it) {
                                Et(i, i.return, it)
                            }
                        }
                        break;
                    case 3:
                        if ((t & 1024) !== 0) {
                            if (t = e.stateNode.containerInfo,
                            i = t.nodeType,
                            i === 9)
                                mc(t);
                            else if (i === 1)
                                switch (t.nodeName) {
                                case "HEAD":
                                case "HTML":
                                case "BODY":
                                    mc(t);
                                    break;
                                default:
                                    t.textContent = ""
                                }
                        }
                        break;
                    case 5:
                    case 26:
                    case 27:
                    case 6:
                    case 4:
                    case 17:
                        break;
                    default:
                        if ((t & 1024) !== 0)
                            throw Error(o(163))
                    }
                    if (t = e.sibling,
                    t !== null) {
                        t.return = e.return,
                        Wt = t;
                        break
                    }
                    Wt = e.return
                }
    }
    function Wm(t, e, i) {
        var l = i.flags;
        switch (i.tag) {
        case 0:
        case 11:
        case 15:
            Pn(t, i),
            l & 4 && Ss(5, i);
            break;
        case 1:
            if (Pn(t, i),
            l & 4)
                if (t = i.stateNode,
                e === null)
                    try {
                        t.componentDidMount()
                    } catch (v) {
                        Et(i, i.return, v)
                    }
                else {
                    var r = Ci(i.type, e.memoizedProps);
                    e = e.memoizedState;
                    try {
                        t.componentDidUpdate(r, e, t.__reactInternalSnapshotBeforeUpdate)
                    } catch (v) {
                        Et(i, i.return, v)
                    }
                }
            l & 64 && Km(i),
            l & 512 && bs(i, i.return);
            break;
        case 3:
            if (Pn(t, i),
            l & 64 && (t = i.updateQueue,
            t !== null)) {
                if (e = null,
                i.child !== null)
                    switch (i.child.tag) {
                    case 27:
                    case 5:
                        e = i.child.stateNode;
                        break;
                    case 1:
                        e = i.child.stateNode
                    }
                try {
                    wd(t, e)
                } catch (v) {
                    Et(i, i.return, v)
                }
            }
            break;
        case 27:
            e === null && l & 4 && $m(i);
        case 26:
        case 5:
            Pn(t, i),
            e === null && l & 4 && Qm(i),
            l & 512 && bs(i, i.return);
            break;
        case 12:
            Pn(t, i);
            break;
        case 13:
            Pn(t, i),
            l & 4 && ep(t, i),
            l & 64 && (t = i.memoizedState,
            t !== null && (t = t.dehydrated,
            t !== null && (i = E2.bind(null, i),
            k2(t, i))));
            break;
        case 22:
            if (l = i.memoizedState !== null || bn,
            !l) {
                e = e !== null && e.memoizedState !== null || qt,
                r = bn;
                var c = qt;
                bn = l,
                (qt = e) && !c ? Hn(t, i, (i.subtreeFlags & 8772) !== 0) : Pn(t, i),
                bn = r,
                qt = c
            }
            break;
        case 30:
            break;
        default:
            Pn(t, i)
        }
    }
    function Im(t) {
        var e = t.alternate;
        e !== null && (t.alternate = null,
        Im(e)),
        t.child = null,
        t.deletions = null,
        t.sibling = null,
        t.tag === 5 && (e = t.stateNode,
        e !== null && Sr(e)),
        t.stateNode = null,
        t.return = null,
        t.dependencies = null,
        t.memoizedProps = null,
        t.memoizedState = null,
        t.pendingProps = null,
        t.stateNode = null,
        t.updateQueue = null
    }
    var Ot = null
      , ye = !1;
    function Tn(t, e, i) {
        for (i = i.child; i !== null; )
            tp(t, e, i),
            i = i.sibling
    }
    function tp(t, e, i) {
        if (Ut && typeof Ut.onCommitFiberUnmount == "function")
            try {
                Ut.onCommitFiberUnmount(kt, i)
            } catch {}
        switch (i.tag) {
        case 26:
            qt || Ie(i, e),
            Tn(t, e, i),
            i.memoizedState ? i.memoizedState.count-- : i.stateNode && (i = i.stateNode,
            i.parentNode.removeChild(i));
            break;
        case 27:
            qt || Ie(i, e);
            var l = Ot
              , r = ye;
            Kn(i.type) && (Ot = i.stateNode,
            ye = !1),
            Tn(t, e, i),
            Ds(i.stateNode),
            Ot = l,
            ye = r;
            break;
        case 5:
            qt || Ie(i, e);
        case 6:
            if (l = Ot,
            r = ye,
            Ot = null,
            Tn(t, e, i),
            Ot = l,
            ye = r,
            Ot !== null)
                if (ye)
                    try {
                        (Ot.nodeType === 9 ? Ot.body : Ot.nodeName === "HTML" ? Ot.ownerDocument.body : Ot).removeChild(i.stateNode)
                    } catch (c) {
                        Et(i, e, c)
                    }
                else
                    try {
                        Ot.removeChild(i.stateNode)
                    } catch (c) {
                        Et(i, e, c)
                    }
            break;
        case 18:
            Ot !== null && (ye ? (t = Ot,
            Yp(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, i.stateNode),
            Ns(t)) : Yp(Ot, i.stateNode));
            break;
        case 4:
            l = Ot,
            r = ye,
            Ot = i.stateNode.containerInfo,
            ye = !0,
            Tn(t, e, i),
            Ot = l,
            ye = r;
            break;
        case 0:
        case 11:
        case 14:
        case 15:
            qt || jn(2, i, e),
            qt || jn(4, i, e),
            Tn(t, e, i);
            break;
        case 1:
            qt || (Ie(i, e),
            l = i.stateNode,
            typeof l.componentWillUnmount == "function" && Zm(i, e, l)),
            Tn(t, e, i);
            break;
        case 21:
            Tn(t, e, i);
            break;
        case 22:
            qt = (l = qt) || i.memoizedState !== null,
            Tn(t, e, i),
            qt = l;
            break;
        default:
            Tn(t, e, i)
        }
    }
    function ep(t, e) {
        if (e.memoizedState === null && (t = e.alternate,
        t !== null && (t = t.memoizedState,
        t !== null && (t = t.dehydrated,
        t !== null))))
            try {
                Ns(t)
            } catch (i) {
                Et(e, e.return, i)
            }
    }
    function g2(t) {
        switch (t.tag) {
        case 13:
        case 19:
            var e = t.stateNode;
            return e === null && (e = t.stateNode = new Jm),
            e;
        case 22:
            return t = t.stateNode,
            e = t._retryCache,
            e === null && (e = t._retryCache = new Jm),
            e;
        default:
            throw Error(o(435, t.tag))
        }
    }
    function qu(t, e) {
        var i = g2(t);
        e.forEach(function(l) {
            var r = _2.bind(null, t, l);
            i.has(l) || (i.add(l),
            l.then(r, r))
        })
    }
    function xe(t, e) {
        var i = e.deletions;
        if (i !== null)
            for (var l = 0; l < i.length; l++) {
                var r = i[l]
                  , c = t
                  , v = e
                  , b = v;
                t: for (; b !== null; ) {
                    switch (b.tag) {
                    case 27:
                        if (Kn(b.type)) {
                            Ot = b.stateNode,
                            ye = !1;
                            break t
                        }
                        break;
                    case 5:
                        Ot = b.stateNode,
                        ye = !1;
                        break t;
                    case 3:
                    case 4:
                        Ot = b.stateNode.containerInfo,
                        ye = !0;
                        break t
                    }
                    b = b.return
                }
                if (Ot === null)
                    throw Error(o(160));
                tp(c, v, r),
                Ot = null,
                ye = !1,
                c = r.alternate,
                c !== null && (c.return = null),
                r.return = null
            }
        if (e.subtreeFlags & 13878)
            for (e = e.child; e !== null; )
                np(e, t),
                e = e.sibling
    }
    var Ze = null;
    function np(t, e) {
        var i = t.alternate
          , l = t.flags;
        switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            xe(e, t),
            Re(t),
            l & 4 && (jn(3, t, t.return),
            Ss(3, t),
            jn(5, t, t.return));
            break;
        case 1:
            xe(e, t),
            Re(t),
            l & 512 && (qt || i === null || Ie(i, i.return)),
            l & 64 && bn && (t = t.updateQueue,
            t !== null && (l = t.callbacks,
            l !== null && (i = t.shared.hiddenCallbacks,
            t.shared.hiddenCallbacks = i === null ? l : i.concat(l))));
            break;
        case 26:
            var r = Ze;
            if (xe(e, t),
            Re(t),
            l & 512 && (qt || i === null || Ie(i, i.return)),
            l & 4) {
                var c = i !== null ? i.memoizedState : null;
                if (l = t.memoizedState,
                i === null)
                    if (l === null)
                        if (t.stateNode === null) {
                            t: {
                                l = t.type,
                                i = t.memoizedProps,
                                r = r.ownerDocument || r;
                                e: switch (l) {
                                case "title":
                                    c = r.getElementsByTagName("title")[0],
                                    (!c || c[ka] || c[le] || c.namespaceURI === "http://www.w3.org/2000/svg" || c.hasAttribute("itemprop")) && (c = r.createElement(l),
                                    r.head.insertBefore(c, r.querySelector("head > title"))),
                                    ne(c, l, i),
                                    c[le] = t,
                                    $t(c),
                                    l = c;
                                    break t;
                                case "link":
                                    var v = $p("link", "href", r).get(l + (i.href || ""));
                                    if (v) {
                                        for (var b = 0; b < v.length; b++)
                                            if (c = v[b],
                                            c.getAttribute("href") === (i.href == null || i.href === "" ? null : i.href) && c.getAttribute("rel") === (i.rel == null ? null : i.rel) && c.getAttribute("title") === (i.title == null ? null : i.title) && c.getAttribute("crossorigin") === (i.crossOrigin == null ? null : i.crossOrigin)) {
                                                v.splice(b, 1);
                                                break e
                                            }
                                    }
                                    c = r.createElement(l),
                                    ne(c, l, i),
                                    r.head.appendChild(c);
                                    break;
                                case "meta":
                                    if (v = $p("meta", "content", r).get(l + (i.content || ""))) {
                                        for (b = 0; b < v.length; b++)
                                            if (c = v[b],
                                            c.getAttribute("content") === (i.content == null ? null : "" + i.content) && c.getAttribute("name") === (i.name == null ? null : i.name) && c.getAttribute("property") === (i.property == null ? null : i.property) && c.getAttribute("http-equiv") === (i.httpEquiv == null ? null : i.httpEquiv) && c.getAttribute("charset") === (i.charSet == null ? null : i.charSet)) {
                                                v.splice(b, 1);
                                                break e
                                            }
                                    }
                                    c = r.createElement(l),
                                    ne(c, l, i),
                                    r.head.appendChild(c);
                                    break;
                                default:
                                    throw Error(o(468, l))
                                }
                                c[le] = t,
                                $t(c),
                                l = c
                            }
                            t.stateNode = l
                        } else
                            Jp(r, t.type, t.stateNode);
                    else
                        t.stateNode = Fp(r, l, t.memoizedProps);
                else
                    c !== l ? (c === null ? i.stateNode !== null && (i = i.stateNode,
                    i.parentNode.removeChild(i)) : c.count--,
                    l === null ? Jp(r, t.type, t.stateNode) : Fp(r, l, t.memoizedProps)) : l === null && t.stateNode !== null && Nu(t, t.memoizedProps, i.memoizedProps)
            }
            break;
        case 27:
            xe(e, t),
            Re(t),
            l & 512 && (qt || i === null || Ie(i, i.return)),
            i !== null && l & 4 && Nu(t, t.memoizedProps, i.memoizedProps);
            break;
        case 5:
            if (xe(e, t),
            Re(t),
            l & 512 && (qt || i === null || Ie(i, i.return)),
            t.flags & 32) {
                r = t.stateNode;
                try {
                    Xi(r, "")
                } catch (w) {
                    Et(t, t.return, w)
                }
            }
            l & 4 && t.stateNode != null && (r = t.memoizedProps,
            Nu(t, r, i !== null ? i.memoizedProps : r)),
            l & 1024 && (Hu = !0);
            break;
        case 6:
            if (xe(e, t),
            Re(t),
            l & 4) {
                if (t.stateNode === null)
                    throw Error(o(162));
                l = t.memoizedProps,
                i = t.stateNode;
                try {
                    i.nodeValue = l
                } catch (w) {
                    Et(t, t.return, w)
                }
            }
            break;
        case 3:
            if (bo = null,
            r = Ze,
            Ze = go(e.containerInfo),
            xe(e, t),
            Ze = r,
            Re(t),
            l & 4 && i !== null && i.memoizedState.isDehydrated)
                try {
                    Ns(e.containerInfo)
                } catch (w) {
                    Et(t, t.return, w)
                }
            Hu && (Hu = !1,
            ip(t));
            break;
        case 4:
            l = Ze,
            Ze = go(t.stateNode.containerInfo),
            xe(e, t),
            Re(t),
            Ze = l;
            break;
        case 12:
            xe(e, t),
            Re(t);
            break;
        case 13:
            xe(e, t),
            Re(t),
            t.child.flags & 8192 && t.memoizedState !== null != (i !== null && i.memoizedState !== null) && (Zu = Se()),
            l & 4 && (l = t.updateQueue,
            l !== null && (t.updateQueue = null,
            qu(t, l)));
            break;
        case 22:
            r = t.memoizedState !== null;
            var x = i !== null && i.memoizedState !== null
              , L = bn
              , U = qt;
            if (bn = L || r,
            qt = U || x,
            xe(e, t),
            qt = U,
            bn = L,
            Re(t),
            l & 8192)
                t: for (e = t.stateNode,
                e._visibility = r ? e._visibility & -2 : e._visibility | 1,
                r && (i === null || x || bn || qt || xi(t)),
                i = null,
                e = t; ; ) {
                    if (e.tag === 5 || e.tag === 26) {
                        if (i === null) {
                            x = i = e;
                            try {
                                if (c = x.stateNode,
                                r)
                                    v = c.style,
                                    typeof v.setProperty == "function" ? v.setProperty("display", "none", "important") : v.display = "none";
                                else {
                                    b = x.stateNode;
                                    var P = x.memoizedProps.style
                                      , O = P != null && P.hasOwnProperty("display") ? P.display : null;
                                    b.style.display = O == null || typeof O == "boolean" ? "" : ("" + O).trim()
                                }
                            } catch (w) {
                                Et(x, x.return, w)
                            }
                        }
                    } else if (e.tag === 6) {
                        if (i === null) {
                            x = e;
                            try {
                                x.stateNode.nodeValue = r ? "" : x.memoizedProps
                            } catch (w) {
                                Et(x, x.return, w)
                            }
                        }
                    } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
                        e.child.return = e,
                        e = e.child;
                        continue
                    }
                    if (e === t)
                        break t;
                    for (; e.sibling === null; ) {
                        if (e.return === null || e.return === t)
                            break t;
                        i === e && (i = null),
                        e = e.return
                    }
                    i === e && (i = null),
                    e.sibling.return = e.return,
                    e = e.sibling
                }
            l & 4 && (l = t.updateQueue,
            l !== null && (i = l.retryQueue,
            i !== null && (l.retryQueue = null,
            qu(t, i))));
            break;
        case 19:
            xe(e, t),
            Re(t),
            l & 4 && (l = t.updateQueue,
            l !== null && (t.updateQueue = null,
            qu(t, l)));
            break;
        case 30:
            break;
        case 21:
            break;
        default:
            xe(e, t),
            Re(t)
        }
    }
    function Re(t) {
        var e = t.flags;
        if (e & 2) {
            try {
                for (var i, l = t.return; l !== null; ) {
                    if (Fm(l)) {
                        i = l;
                        break
                    }
                    l = l.return
                }
                if (i == null)
                    throw Error(o(160));
                switch (i.tag) {
                case 27:
                    var r = i.stateNode
                      , c = ju(t);
                    ao(t, c, r);
                    break;
                case 5:
                    var v = i.stateNode;
                    i.flags & 32 && (Xi(v, ""),
                    i.flags &= -33);
                    var b = ju(t);
                    ao(t, b, v);
                    break;
                case 3:
                case 4:
                    var x = i.stateNode.containerInfo
                      , L = ju(t);
                    Pu(t, L, x);
                    break;
                default:
                    throw Error(o(161))
                }
            } catch (U) {
                Et(t, t.return, U)
            }
            t.flags &= -3
        }
        e & 4096 && (t.flags &= -4097)
    }
    function ip(t) {
        if (t.subtreeFlags & 1024)
            for (t = t.child; t !== null; ) {
                var e = t;
                ip(e),
                e.tag === 5 && e.flags & 1024 && e.stateNode.reset(),
                t = t.sibling
            }
    }
    function Pn(t, e) {
        if (e.subtreeFlags & 8772)
            for (e = e.child; e !== null; )
                Wm(t, e.alternate, e),
                e = e.sibling
    }
    function xi(t) {
        for (t = t.child; t !== null; ) {
            var e = t;
            switch (e.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
                jn(4, e, e.return),
                xi(e);
                break;
            case 1:
                Ie(e, e.return);
                var i = e.stateNode;
                typeof i.componentWillUnmount == "function" && Zm(e, e.return, i),
                xi(e);
                break;
            case 27:
                Ds(e.stateNode);
            case 26:
            case 5:
                Ie(e, e.return),
                xi(e);
                break;
            case 22:
                e.memoizedState === null && xi(e);
                break;
            case 30:
                xi(e);
                break;
            default:
                xi(e)
            }
            t = t.sibling
        }
    }
    function Hn(t, e, i) {
        for (i = i && (e.subtreeFlags & 8772) !== 0,
        e = e.child; e !== null; ) {
            var l = e.alternate
              , r = t
              , c = e
              , v = c.flags;
            switch (c.tag) {
            case 0:
            case 11:
            case 15:
                Hn(r, c, i),
                Ss(4, c);
                break;
            case 1:
                if (Hn(r, c, i),
                l = c,
                r = l.stateNode,
                typeof r.componentDidMount == "function")
                    try {
                        r.componentDidMount()
                    } catch (L) {
                        Et(l, l.return, L)
                    }
                if (l = c,
                r = l.updateQueue,
                r !== null) {
                    var b = l.stateNode;
                    try {
                        var x = r.shared.hiddenCallbacks;
                        if (x !== null)
                            for (r.shared.hiddenCallbacks = null,
                            r = 0; r < x.length; r++)
                                Vd(x[r], b)
                    } catch (L) {
                        Et(l, l.return, L)
                    }
                }
                i && v & 64 && Km(c),
                bs(c, c.return);
                break;
            case 27:
                $m(c);
            case 26:
            case 5:
                Hn(r, c, i),
                i && l === null && v & 4 && Qm(c),
                bs(c, c.return);
                break;
            case 12:
                Hn(r, c, i);
                break;
            case 13:
                Hn(r, c, i),
                i && v & 4 && ep(r, c);
                break;
            case 22:
                c.memoizedState === null && Hn(r, c, i),
                bs(c, c.return);
                break;
            case 30:
                break;
            default:
                Hn(r, c, i)
            }
            e = e.sibling
        }
    }
    function Yu(t, e) {
        var i = null;
        t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (i = t.memoizedState.cachePool.pool),
        t = null,
        e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool),
        t !== i && (t != null && t.refCount++,
        i != null && ss(i))
    }
    function Gu(t, e) {
        t = null,
        e.alternate !== null && (t = e.alternate.memoizedState.cache),
        e = e.memoizedState.cache,
        e !== t && (e.refCount++,
        t != null && ss(t))
    }
    function tn(t, e, i, l) {
        if (e.subtreeFlags & 10256)
            for (e = e.child; e !== null; )
                ap(t, e, i, l),
                e = e.sibling
    }
    function ap(t, e, i, l) {
        var r = e.flags;
        switch (e.tag) {
        case 0:
        case 11:
        case 15:
            tn(t, e, i, l),
            r & 2048 && Ss(9, e);
            break;
        case 1:
            tn(t, e, i, l);
            break;
        case 3:
            tn(t, e, i, l),
            r & 2048 && (t = null,
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            e = e.memoizedState.cache,
            e !== t && (e.refCount++,
            t != null && ss(t)));
            break;
        case 12:
            if (r & 2048) {
                tn(t, e, i, l),
                t = e.stateNode;
                try {
                    var c = e.memoizedProps
                      , v = c.id
                      , b = c.onPostCommit;
                    typeof b == "function" && b(v, e.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0)
                } catch (x) {
                    Et(e, e.return, x)
                }
            } else
                tn(t, e, i, l);
            break;
        case 13:
            tn(t, e, i, l);
            break;
        case 23:
            break;
        case 22:
            c = e.stateNode,
            v = e.alternate,
            e.memoizedState !== null ? c._visibility & 2 ? tn(t, e, i, l) : Ts(t, e) : c._visibility & 2 ? tn(t, e, i, l) : (c._visibility |= 2,
            ca(t, e, i, l, (e.subtreeFlags & 10256) !== 0)),
            r & 2048 && Yu(v, e);
            break;
        case 24:
            tn(t, e, i, l),
            r & 2048 && Gu(e.alternate, e);
            break;
        default:
            tn(t, e, i, l)
        }
    }
    function ca(t, e, i, l, r) {
        for (r = r && (e.subtreeFlags & 10256) !== 0,
        e = e.child; e !== null; ) {
            var c = t
              , v = e
              , b = i
              , x = l
              , L = v.flags;
            switch (v.tag) {
            case 0:
            case 11:
            case 15:
                ca(c, v, b, x, r),
                Ss(8, v);
                break;
            case 23:
                break;
            case 22:
                var U = v.stateNode;
                v.memoizedState !== null ? U._visibility & 2 ? ca(c, v, b, x, r) : Ts(c, v) : (U._visibility |= 2,
                ca(c, v, b, x, r)),
                r && L & 2048 && Yu(v.alternate, v);
                break;
            case 24:
                ca(c, v, b, x, r),
                r && L & 2048 && Gu(v.alternate, v);
                break;
            default:
                ca(c, v, b, x, r)
            }
            e = e.sibling
        }
    }
    function Ts(t, e) {
        if (e.subtreeFlags & 10256)
            for (e = e.child; e !== null; ) {
                var i = t
                  , l = e
                  , r = l.flags;
                switch (l.tag) {
                case 22:
                    Ts(i, l),
                    r & 2048 && Yu(l.alternate, l);
                    break;
                case 24:
                    Ts(i, l),
                    r & 2048 && Gu(l.alternate, l);
                    break;
                default:
                    Ts(i, l)
                }
                e = e.sibling
            }
    }
    var Cs = 8192;
    function fa(t) {
        if (t.subtreeFlags & Cs)
            for (t = t.child; t !== null; )
                sp(t),
                t = t.sibling
    }
    function sp(t) {
        switch (t.tag) {
        case 26:
            fa(t),
            t.flags & Cs && t.memoizedState !== null && i3(Ze, t.memoizedState, t.memoizedProps);
            break;
        case 5:
            fa(t);
            break;
        case 3:
        case 4:
            var e = Ze;
            Ze = go(t.stateNode.containerInfo),
            fa(t),
            Ze = e;
            break;
        case 22:
            t.memoizedState === null && (e = t.alternate,
            e !== null && e.memoizedState !== null ? (e = Cs,
            Cs = 16777216,
            fa(t),
            Cs = e) : fa(t));
            break;
        default:
            fa(t)
        }
    }
    function lp(t) {
        var e = t.alternate;
        if (e !== null && (t = e.child,
        t !== null)) {
            e.child = null;
            do
                e = t.sibling,
                t.sibling = null,
                t = e;
            while (t !== null)
        }
    }
    function xs(t) {
        var e = t.deletions;
        if ((t.flags & 16) !== 0) {
            if (e !== null)
                for (var i = 0; i < e.length; i++) {
                    var l = e[i];
                    Wt = l,
                    rp(l, t)
                }
            lp(t)
        }
        if (t.subtreeFlags & 10256)
            for (t = t.child; t !== null; )
                op(t),
                t = t.sibling
    }
    function op(t) {
        switch (t.tag) {
        case 0:
        case 11:
        case 15:
            xs(t),
            t.flags & 2048 && jn(9, t, t.return);
            break;
        case 3:
            xs(t);
            break;
        case 12:
            xs(t);
            break;
        case 22:
            var e = t.stateNode;
            t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3,
            so(t)) : xs(t);
            break;
        default:
            xs(t)
        }
    }
    function so(t) {
        var e = t.deletions;
        if ((t.flags & 16) !== 0) {
            if (e !== null)
                for (var i = 0; i < e.length; i++) {
                    var l = e[i];
                    Wt = l,
                    rp(l, t)
                }
            lp(t)
        }
        for (t = t.child; t !== null; ) {
            switch (e = t,
            e.tag) {
            case 0:
            case 11:
            case 15:
                jn(8, e, e.return),
                so(e);
                break;
            case 22:
                i = e.stateNode,
                i._visibility & 2 && (i._visibility &= -3,
                so(e));
                break;
            default:
                so(e)
            }
            t = t.sibling
        }
    }
    function rp(t, e) {
        for (; Wt !== null; ) {
            var i = Wt;
            switch (i.tag) {
            case 0:
            case 11:
            case 15:
                jn(8, i, e);
                break;
            case 23:
            case 22:
                if (i.memoizedState !== null && i.memoizedState.cachePool !== null) {
                    var l = i.memoizedState.cachePool.pool;
                    l != null && l.refCount++
                }
                break;
            case 24:
                ss(i.memoizedState.cache)
            }
            if (l = i.child,
            l !== null)
                l.return = i,
                Wt = l;
            else
                t: for (i = t; Wt !== null; ) {
                    l = Wt;
                    var r = l.sibling
                      , c = l.return;
                    if (Im(l),
                    l === i) {
                        Wt = null;
                        break t
                    }
                    if (r !== null) {
                        r.return = c,
                        Wt = r;
                        break t
                    }
                    Wt = c
                }
        }
    }
    var S2 = {
        getCacheForType: function(t) {
            var e = oe(Qt)
              , i = e.data.get(t);
            return i === void 0 && (i = t(),
            e.data.set(t, i)),
            i
        }
    }
      , b2 = typeof WeakMap == "function" ? WeakMap : Map
      , Tt = 0
      , At = null
      , mt = null
      , vt = 0
      , Ct = 0
      , Me = null
      , qn = !1
      , ha = !1
      , ku = !1
      , Cn = 0
      , jt = 0
      , Yn = 0
      , Ri = 0
      , Xu = 0
      , Ue = 0
      , da = 0
      , Rs = null
      , ve = null
      , Ku = !1
      , Zu = 0
      , lo = 1 / 0
      , oo = null
      , Gn = null
      , ee = 0
      , kn = null
      , ma = null
      , pa = 0
      , Qu = 0
      , Fu = null
      , up = null
      , Ms = 0
      , $u = null;
    function Ee() {
        if ((Tt & 2) !== 0 && vt !== 0)
            return vt & -vt;
        if (z.T !== null) {
            var t = na;
            return t !== 0 ? t : ic()
        }
        return Mh()
    }
    function cp() {
        Ue === 0 && (Ue = (vt & 536870912) === 0 || St ? Th() : 536870912);
        var t = Be.current;
        return t !== null && (t.flags |= 32),
        Ue
    }
    function _e(t, e, i) {
        (t === At && (Ct === 2 || Ct === 9) || t.cancelPendingCommit !== null) && (ya(t, 0),
        Xn(t, vt, Ue, !1)),
        Ga(t, i),
        ((Tt & 2) === 0 || t !== At) && (t === At && ((Tt & 2) === 0 && (Ri |= i),
        jt === 4 && Xn(t, vt, Ue, !1)),
        en(t))
    }
    function fp(t, e, i) {
        if ((Tt & 6) !== 0)
            throw Error(o(327));
        var l = !i && (e & 124) === 0 && (e & t.expiredLanes) === 0 || Ya(t, e)
          , r = l ? x2(t, e) : Iu(t, e, !0)
          , c = l;
        do {
            if (r === 0) {
                ha && !l && Xn(t, e, 0, !1);
                break
            } else {
                if (i = t.current.alternate,
                c && !T2(i)) {
                    r = Iu(t, e, !1),
                    c = !1;
                    continue
                }
                if (r === 2) {
                    if (c = e,
                    t.errorRecoveryDisabledLanes & c)
                        var v = 0;
                    else
                        v = t.pendingLanes & -536870913,
                        v = v !== 0 ? v : v & 536870912 ? 536870912 : 0;
                    if (v !== 0) {
                        e = v;
                        t: {
                            var b = t;
                            r = Rs;
                            var x = b.current.memoizedState.isDehydrated;
                            if (x && (ya(b, v).flags |= 256),
                            v = Iu(b, v, !1),
                            v !== 2) {
                                if (ku && !x) {
                                    b.errorRecoveryDisabledLanes |= c,
                                    Ri |= c,
                                    r = 4;
                                    break t
                                }
                                c = ve,
                                ve = r,
                                c !== null && (ve === null ? ve = c : ve.push.apply(ve, c))
                            }
                            r = v
                        }
                        if (c = !1,
                        r !== 2)
                            continue
                    }
                }
                if (r === 1) {
                    ya(t, 0),
                    Xn(t, e, 0, !0);
                    break
                }
                t: {
                    switch (l = t,
                    c = r,
                    c) {
                    case 0:
                    case 1:
                        throw Error(o(345));
                    case 4:
                        if ((e & 4194048) !== e)
                            break;
                    case 6:
                        Xn(l, e, Ue, !qn);
                        break t;
                    case 2:
                        ve = null;
                        break;
                    case 3:
                    case 5:
                        break;
                    default:
                        throw Error(o(329))
                    }
                    if ((e & 62914560) === e && (r = Zu + 300 - Se(),
                    10 < r)) {
                        if (Xn(l, e, Ue, !qn),
                        gl(l, 0, !0) !== 0)
                            break t;
                        l.timeoutHandle = Hp(hp.bind(null, l, i, ve, oo, Ku, e, Ue, Ri, da, qn, c, 2, -0, 0), r);
                        break t
                    }
                    hp(l, i, ve, oo, Ku, e, Ue, Ri, da, qn, c, 0, -0, 0)
                }
            }
            break
        } while (!0);
        en(t)
    }
    function hp(t, e, i, l, r, c, v, b, x, L, U, P, O, w) {
        if (t.timeoutHandle = -1,
        P = e.subtreeFlags,
        (P & 8192 || (P & 16785408) === 16785408) && (Vs = {
            stylesheets: null,
            count: 0,
            unsuspend: n3
        },
        sp(e),
        P = a3(),
        P !== null)) {
            t.cancelPendingCommit = P(Sp.bind(null, t, e, c, i, l, r, v, b, x, U, 1, O, w)),
            Xn(t, c, v, !L);
            return
        }
        Sp(t, e, c, i, l, r, v, b, x)
    }
    function T2(t) {
        for (var e = t; ; ) {
            var i = e.tag;
            if ((i === 0 || i === 11 || i === 15) && e.flags & 16384 && (i = e.updateQueue,
            i !== null && (i = i.stores,
            i !== null)))
                for (var l = 0; l < i.length; l++) {
                    var r = i[l]
                      , c = r.getSnapshot;
                    r = r.value;
                    try {
                        if (!Te(c(), r))
                            return !1
                    } catch {
                        return !1
                    }
                }
            if (i = e.child,
            e.subtreeFlags & 16384 && i !== null)
                i.return = e,
                e = i;
            else {
                if (e === t)
                    break;
                for (; e.sibling === null; ) {
                    if (e.return === null || e.return === t)
                        return !0;
                    e = e.return
                }
                e.sibling.return = e.return,
                e = e.sibling
            }
        }
        return !0
    }
    function Xn(t, e, i, l) {
        e &= ~Xu,
        e &= ~Ri,
        t.suspendedLanes |= e,
        t.pingedLanes &= ~e,
        l && (t.warmLanes |= e),
        l = t.expirationTimes;
        for (var r = e; 0 < r; ) {
            var c = 31 - be(r)
              , v = 1 << c;
            l[c] = -1,
            r &= ~v
        }
        i !== 0 && xh(t, i, e)
    }
    function ro() {
        return (Tt & 6) === 0 ? (Es(0),
        !1) : !0
    }
    function Ju() {
        if (mt !== null) {
            if (Ct === 0)
                var t = mt.return;
            else
                t = mt,
                mn = gi = null,
                mu(t),
                ra = null,
                ys = 0,
                t = mt;
            for (; t !== null; )
                Xm(t.alternate, t),
                t = t.return;
            mt = null
        }
    }
    function ya(t, e) {
        var i = t.timeoutHandle;
        i !== -1 && (t.timeoutHandle = -1,
        P2(i)),
        i = t.cancelPendingCommit,
        i !== null && (t.cancelPendingCommit = null,
        i()),
        Ju(),
        At = t,
        mt = i = fn(t.current, null),
        vt = e,
        Ct = 0,
        Me = null,
        qn = !1,
        ha = Ya(t, e),
        ku = !1,
        da = Ue = Xu = Ri = Yn = jt = 0,
        ve = Rs = null,
        Ku = !1,
        (e & 8) !== 0 && (e |= e & 32);
        var l = t.entangledLanes;
        if (l !== 0)
            for (t = t.entanglements,
            l &= e; 0 < l; ) {
                var r = 31 - be(l)
                  , c = 1 << r;
                e |= t[r],
                l &= ~c
            }
        return Cn = e,
        Ll(),
        i
    }
    function dp(t, e) {
        ct = null,
        z.H = Fl,
        e === os || e === Pl ? (e = Ld(),
        Ct = 3) : e === _d ? (e = Ld(),
        Ct = 4) : Ct = e === Om ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1,
        Me = e,
        mt === null && (jt = 1,
        to(t, Oe(e, t.current)))
    }
    function mp() {
        var t = z.H;
        return z.H = Fl,
        t === null ? Fl : t
    }
    function pp() {
        var t = z.A;
        return z.A = S2,
        t
    }
    function Wu() {
        jt = 4,
        qn || (vt & 4194048) !== vt && Be.current !== null || (ha = !0),
        (Yn & 134217727) === 0 && (Ri & 134217727) === 0 || At === null || Xn(At, vt, Ue, !1)
    }
    function Iu(t, e, i) {
        var l = Tt;
        Tt |= 2;
        var r = mp()
          , c = pp();
        (At !== t || vt !== e) && (oo = null,
        ya(t, e)),
        e = !1;
        var v = jt;
        t: do
            try {
                if (Ct !== 0 && mt !== null) {
                    var b = mt
                      , x = Me;
                    switch (Ct) {
                    case 8:
                        Ju(),
                        v = 6;
                        break t;
                    case 3:
                    case 2:
                    case 9:
                    case 6:
                        Be.current === null && (e = !0);
                        var L = Ct;
                        if (Ct = 0,
                        Me = null,
                        va(t, b, x, L),
                        i && ha) {
                            v = 0;
                            break t
                        }
                        break;
                    default:
                        L = Ct,
                        Ct = 0,
                        Me = null,
                        va(t, b, x, L)
                    }
                }
                C2(),
                v = jt;
                break
            } catch (U) {
                dp(t, U)
            }
        while (!0);
        return e && t.shellSuspendCounter++,
        mn = gi = null,
        Tt = l,
        z.H = r,
        z.A = c,
        mt === null && (At = null,
        vt = 0,
        Ll()),
        v
    }
    function C2() {
        for (; mt !== null; )
            yp(mt)
    }
    function x2(t, e) {
        var i = Tt;
        Tt |= 2;
        var l = mp()
          , r = pp();
        At !== t || vt !== e ? (oo = null,
        lo = Se() + 500,
        ya(t, e)) : ha = Ya(t, e);
        t: do
            try {
                if (Ct !== 0 && mt !== null) {
                    e = mt;
                    var c = Me;
                    e: switch (Ct) {
                    case 1:
                        Ct = 0,
                        Me = null,
                        va(t, e, c, 1);
                        break;
                    case 2:
                    case 9:
                        if (Ad(c)) {
                            Ct = 0,
                            Me = null,
                            vp(e);
                            break
                        }
                        e = function() {
                            Ct !== 2 && Ct !== 9 || At !== t || (Ct = 7),
                            en(t)
                        }
                        ,
                        c.then(e, e);
                        break t;
                    case 3:
                        Ct = 7;
                        break t;
                    case 4:
                        Ct = 5;
                        break t;
                    case 7:
                        Ad(c) ? (Ct = 0,
                        Me = null,
                        vp(e)) : (Ct = 0,
                        Me = null,
                        va(t, e, c, 7));
                        break;
                    case 5:
                        var v = null;
                        switch (mt.tag) {
                        case 26:
                            v = mt.memoizedState;
                        case 5:
                        case 27:
                            var b = mt;
                            if (!v || Wp(v)) {
                                Ct = 0,
                                Me = null;
                                var x = b.sibling;
                                if (x !== null)
                                    mt = x;
                                else {
                                    var L = b.return;
                                    L !== null ? (mt = L,
                                    uo(L)) : mt = null
                                }
                                break e
                            }
                        }
                        Ct = 0,
                        Me = null,
                        va(t, e, c, 5);
                        break;
                    case 6:
                        Ct = 0,
                        Me = null,
                        va(t, e, c, 6);
                        break;
                    case 8:
                        Ju(),
                        jt = 6;
                        break t;
                    default:
                        throw Error(o(462))
                    }
                }
                R2();
                break
            } catch (U) {
                dp(t, U)
            }
        while (!0);
        return mn = gi = null,
        z.H = l,
        z.A = r,
        Tt = i,
        mt !== null ? 0 : (At = null,
        vt = 0,
        Ll(),
        jt)
    }
    function R2() {
        for (; mt !== null && !hr(); )
            yp(mt)
    }
    function yp(t) {
        var e = Gm(t.alternate, t, Cn);
        t.memoizedProps = t.pendingProps,
        e === null ? uo(t) : mt = e
    }
    function vp(t) {
        var e = t
          , i = e.alternate;
        switch (e.tag) {
        case 15:
        case 0:
            e = Nm(i, e, e.pendingProps, e.type, void 0, vt);
            break;
        case 11:
            e = Nm(i, e, e.pendingProps, e.type.render, e.ref, vt);
            break;
        case 5:
            mu(e);
        default:
            Xm(i, e),
            e = mt = gd(e, Cn),
            e = Gm(i, e, Cn)
        }
        t.memoizedProps = t.pendingProps,
        e === null ? uo(t) : mt = e
    }
    function va(t, e, i, l) {
        mn = gi = null,
        mu(e),
        ra = null,
        ys = 0;
        var r = e.return;
        try {
            if (d2(t, r, e, i, vt)) {
                jt = 1,
                to(t, Oe(i, t.current)),
                mt = null;
                return
            }
        } catch (c) {
            if (r !== null)
                throw mt = r,
                c;
            jt = 1,
            to(t, Oe(i, t.current)),
            mt = null;
            return
        }
        e.flags & 32768 ? (St || l === 1 ? t = !0 : ha || (vt & 536870912) !== 0 ? t = !1 : (qn = t = !0,
        (l === 2 || l === 9 || l === 3 || l === 6) && (l = Be.current,
        l !== null && l.tag === 13 && (l.flags |= 16384))),
        gp(e, t)) : uo(e)
    }
    function uo(t) {
        var e = t;
        do {
            if ((e.flags & 32768) !== 0) {
                gp(e, qn);
                return
            }
            t = e.return;
            var i = p2(e.alternate, e, Cn);
            if (i !== null) {
                mt = i;
                return
            }
            if (e = e.sibling,
            e !== null) {
                mt = e;
                return
            }
            mt = e = t
        } while (e !== null);
        jt === 0 && (jt = 5)
    }
    function gp(t, e) {
        do {
            var i = y2(t.alternate, t);
            if (i !== null) {
                i.flags &= 32767,
                mt = i;
                return
            }
            if (i = t.return,
            i !== null && (i.flags |= 32768,
            i.subtreeFlags = 0,
            i.deletions = null),
            !e && (t = t.sibling,
            t !== null)) {
                mt = t;
                return
            }
            mt = t = i
        } while (t !== null);
        jt = 6,
        mt = null
    }
    function Sp(t, e, i, l, r, c, v, b, x) {
        t.cancelPendingCommit = null;
        do
            co();
        while (ee !== 0);
        if ((Tt & 6) !== 0)
            throw Error(o(327));
        if (e !== null) {
            if (e === t.current)
                throw Error(o(177));
            if (c = e.lanes | e.childLanes,
            c |= Gr,
            ng(t, i, c, v, b, x),
            t === At && (mt = At = null,
            vt = 0),
            ma = e,
            kn = t,
            pa = i,
            Qu = c,
            Fu = r,
            up = l,
            (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (t.callbackNode = null,
            t.callbackPriority = 0,
            A2(on, function() {
                return Rp(),
                null
            })) : (t.callbackNode = null,
            t.callbackPriority = 0),
            l = (e.flags & 13878) !== 0,
            (e.subtreeFlags & 13878) !== 0 || l) {
                l = z.T,
                z.T = null,
                r = k.p,
                k.p = 2,
                v = Tt,
                Tt |= 4;
                try {
                    v2(t, e, i)
                } finally {
                    Tt = v,
                    k.p = r,
                    z.T = l
                }
            }
            ee = 1,
            bp(),
            Tp(),
            Cp()
        }
    }
    function bp() {
        if (ee === 1) {
            ee = 0;
            var t = kn
              , e = ma
              , i = (e.flags & 13878) !== 0;
            if ((e.subtreeFlags & 13878) !== 0 || i) {
                i = z.T,
                z.T = null;
                var l = k.p;
                k.p = 2;
                var r = Tt;
                Tt |= 4;
                try {
                    np(e, t);
                    var c = fc
                      , v = rd(t.containerInfo)
                      , b = c.focusedElem
                      , x = c.selectionRange;
                    if (v !== b && b && b.ownerDocument && od(b.ownerDocument.documentElement, b)) {
                        if (x !== null && jr(b)) {
                            var L = x.start
                              , U = x.end;
                            if (U === void 0 && (U = L),
                            "selectionStart" in b)
                                b.selectionStart = L,
                                b.selectionEnd = Math.min(U, b.value.length);
                            else {
                                var P = b.ownerDocument || document
                                  , O = P && P.defaultView || window;
                                if (O.getSelection) {
                                    var w = O.getSelection()
                                      , st = b.textContent.length
                                      , it = Math.min(x.start, st)
                                      , Mt = x.end === void 0 ? it : Math.min(x.end, st);
                                    !w.extend && it > Mt && (v = Mt,
                                    Mt = it,
                                    it = v);
                                    var _ = ld(b, it)
                                      , M = ld(b, Mt);
                                    if (_ && M && (w.rangeCount !== 1 || w.anchorNode !== _.node || w.anchorOffset !== _.offset || w.focusNode !== M.node || w.focusOffset !== M.offset)) {
                                        var D = P.createRange();
                                        D.setStart(_.node, _.offset),
                                        w.removeAllRanges(),
                                        it > Mt ? (w.addRange(D),
                                        w.extend(M.node, M.offset)) : (D.setEnd(M.node, M.offset),
                                        w.addRange(D))
                                    }
                                }
                            }
                        }
                        for (P = [],
                        w = b; w = w.parentNode; )
                            w.nodeType === 1 && P.push({
                                element: w,
                                left: w.scrollLeft,
                                top: w.scrollTop
                            });
                        for (typeof b.focus == "function" && b.focus(),
                        b = 0; b < P.length; b++) {
                            var N = P[b];
                            N.element.scrollLeft = N.left,
                            N.element.scrollTop = N.top
                        }
                    }
                    xo = !!cc,
                    fc = cc = null
                } finally {
                    Tt = r,
                    k.p = l,
                    z.T = i
                }
            }
            t.current = e,
            ee = 2
        }
    }
    function Tp() {
        if (ee === 2) {
            ee = 0;
            var t = kn
              , e = ma
              , i = (e.flags & 8772) !== 0;
            if ((e.subtreeFlags & 8772) !== 0 || i) {
                i = z.T,
                z.T = null;
                var l = k.p;
                k.p = 2;
                var r = Tt;
                Tt |= 4;
                try {
                    Wm(t, e.alternate, e)
                } finally {
                    Tt = r,
                    k.p = l,
                    z.T = i
                }
            }
            ee = 3
        }
    }
    function Cp() {
        if (ee === 4 || ee === 3) {
            ee = 0,
            dr();
            var t = kn
              , e = ma
              , i = pa
              , l = up;
            (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? ee = 5 : (ee = 0,
            ma = kn = null,
            xp(t, t.pendingLanes));
            var r = t.pendingLanes;
            if (r === 0 && (Gn = null),
            vr(i),
            e = e.stateNode,
            Ut && typeof Ut.onCommitFiberRoot == "function")
                try {
                    Ut.onCommitFiberRoot(kt, e, void 0, (e.current.flags & 128) === 128)
                } catch {}
            if (l !== null) {
                e = z.T,
                r = k.p,
                k.p = 2,
                z.T = null;
                try {
                    for (var c = t.onRecoverableError, v = 0; v < l.length; v++) {
                        var b = l[v];
                        c(b.value, {
                            componentStack: b.stack
                        })
                    }
                } finally {
                    z.T = e,
                    k.p = r
                }
            }
            (pa & 3) !== 0 && co(),
            en(t),
            r = t.pendingLanes,
            (i & 4194090) !== 0 && (r & 42) !== 0 ? t === $u ? Ms++ : (Ms = 0,
            $u = t) : Ms = 0,
            Es(0)
        }
    }
    function xp(t, e) {
        (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache,
        e != null && (t.pooledCache = null,
        ss(e)))
    }
    function co(t) {
        return bp(),
        Tp(),
        Cp(),
        Rp()
    }
    function Rp() {
        if (ee !== 5)
            return !1;
        var t = kn
          , e = Qu;
        Qu = 0;
        var i = vr(pa)
          , l = z.T
          , r = k.p;
        try {
            k.p = 32 > i ? 32 : i,
            z.T = null,
            i = Fu,
            Fu = null;
            var c = kn
              , v = pa;
            if (ee = 0,
            ma = kn = null,
            pa = 0,
            (Tt & 6) !== 0)
                throw Error(o(331));
            var b = Tt;
            if (Tt |= 4,
            op(c.current),
            ap(c, c.current, v, i),
            Tt = b,
            Es(0, !1),
            Ut && typeof Ut.onPostCommitFiberRoot == "function")
                try {
                    Ut.onPostCommitFiberRoot(kt, c)
                } catch {}
            return !0
        } finally {
            k.p = r,
            z.T = l,
            xp(t, e)
        }
    }
    function Mp(t, e, i) {
        e = Oe(i, e),
        e = Au(t.stateNode, e, 2),
        t = zn(t, e, 2),
        t !== null && (Ga(t, 2),
        en(t))
    }
    function Et(t, e, i) {
        if (t.tag === 3)
            Mp(t, t, i);
        else
            for (; e !== null; ) {
                if (e.tag === 3) {
                    Mp(e, t, i);
                    break
                } else if (e.tag === 1) {
                    var l = e.stateNode;
                    if (typeof e.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (Gn === null || !Gn.has(l))) {
                        t = Oe(i, t),
                        i = Dm(2),
                        l = zn(e, i, 2),
                        l !== null && (Lm(i, l, e, t),
                        Ga(l, 2),
                        en(l));
                        break
                    }
                }
                e = e.return
            }
    }
    function tc(t, e, i) {
        var l = t.pingCache;
        if (l === null) {
            l = t.pingCache = new b2;
            var r = new Set;
            l.set(e, r)
        } else
            r = l.get(e),
            r === void 0 && (r = new Set,
            l.set(e, r));
        r.has(i) || (ku = !0,
        r.add(i),
        t = M2.bind(null, t, e, i),
        e.then(t, t))
    }
    function M2(t, e, i) {
        var l = t.pingCache;
        l !== null && l.delete(e),
        t.pingedLanes |= t.suspendedLanes & i,
        t.warmLanes &= ~i,
        At === t && (vt & i) === i && (jt === 4 || jt === 3 && (vt & 62914560) === vt && 300 > Se() - Zu ? (Tt & 2) === 0 && ya(t, 0) : Xu |= i,
        da === vt && (da = 0)),
        en(t)
    }
    function Ep(t, e) {
        e === 0 && (e = Ch()),
        t = Wi(t, e),
        t !== null && (Ga(t, e),
        en(t))
    }
    function E2(t) {
        var e = t.memoizedState
          , i = 0;
        e !== null && (i = e.retryLane),
        Ep(t, i)
    }
    function _2(t, e) {
        var i = 0;
        switch (t.tag) {
        case 13:
            var l = t.stateNode
              , r = t.memoizedState;
            r !== null && (i = r.retryLane);
            break;
        case 19:
            l = t.stateNode;
            break;
        case 22:
            l = t.stateNode._retryCache;
            break;
        default:
            throw Error(o(314))
        }
        l !== null && l.delete(e),
        Ep(t, i)
    }
    function A2(t, e) {
        return oi(t, e)
    }
    var fo = null
      , ga = null
      , ec = !1
      , ho = !1
      , nc = !1
      , Mi = 0;
    function en(t) {
        t !== ga && t.next === null && (ga === null ? fo = ga = t : ga = ga.next = t),
        ho = !0,
        ec || (ec = !0,
        L2())
    }
    function Es(t, e) {
        if (!nc && ho) {
            nc = !0;
            do
                for (var i = !1, l = fo; l !== null; ) {
                    if (t !== 0) {
                        var r = l.pendingLanes;
                        if (r === 0)
                            var c = 0;
                        else {
                            var v = l.suspendedLanes
                              , b = l.pingedLanes;
                            c = (1 << 31 - be(42 | t) + 1) - 1,
                            c &= r & ~(v & ~b),
                            c = c & 201326741 ? c & 201326741 | 1 : c ? c | 2 : 0
                        }
                        c !== 0 && (i = !0,
                        Lp(l, c))
                    } else
                        c = vt,
                        c = gl(l, l === At ? c : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1),
                        (c & 3) === 0 || Ya(l, c) || (i = !0,
                        Lp(l, c));
                    l = l.next
                }
            while (i);
            nc = !1
        }
    }
    function D2() {
        _p()
    }
    function _p() {
        ho = ec = !1;
        var t = 0;
        Mi !== 0 && (j2() && (t = Mi),
        Mi = 0);
        for (var e = Se(), i = null, l = fo; l !== null; ) {
            var r = l.next
              , c = Ap(l, e);
            c === 0 ? (l.next = null,
            i === null ? fo = r : i.next = r,
            r === null && (ga = i)) : (i = l,
            (t !== 0 || (c & 3) !== 0) && (ho = !0)),
            l = r
        }
        Es(t)
    }
    function Ap(t, e) {
        for (var i = t.suspendedLanes, l = t.pingedLanes, r = t.expirationTimes, c = t.pendingLanes & -62914561; 0 < c; ) {
            var v = 31 - be(c)
              , b = 1 << v
              , x = r[v];
            x === -1 ? ((b & i) === 0 || (b & l) !== 0) && (r[v] = eg(b, e)) : x <= e && (t.expiredLanes |= b),
            c &= ~b
        }
        if (e = At,
        i = vt,
        i = gl(t, t === e ? i : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1),
        l = t.callbackNode,
        i === 0 || t === e && (Ct === 2 || Ct === 9) || t.cancelPendingCommit !== null)
            return l !== null && l !== null && Xe(l),
            t.callbackNode = null,
            t.callbackPriority = 0;
        if ((i & 3) === 0 || Ya(t, i)) {
            if (e = i & -i,
            e === t.callbackPriority)
                return e;
            switch (l !== null && Xe(l),
            vr(i)) {
            case 2:
            case 8:
                i = ml;
                break;
            case 32:
                i = on;
                break;
            case 268435456:
                i = qa;
                break;
            default:
                i = on
            }
            return l = Dp.bind(null, t),
            i = oi(i, l),
            t.callbackPriority = e,
            t.callbackNode = i,
            e
        }
        return l !== null && l !== null && Xe(l),
        t.callbackPriority = 2,
        t.callbackNode = null,
        2
    }
    function Dp(t, e) {
        if (ee !== 0 && ee !== 5)
            return t.callbackNode = null,
            t.callbackPriority = 0,
            null;
        var i = t.callbackNode;
        if (co() && t.callbackNode !== i)
            return null;
        var l = vt;
        return l = gl(t, t === At ? l : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1),
        l === 0 ? null : (fp(t, l, e),
        Ap(t, Se()),
        t.callbackNode != null && t.callbackNode === i ? Dp.bind(null, t) : null)
    }
    function Lp(t, e) {
        if (co())
            return null;
        fp(t, e, !0)
    }
    function L2() {
        H2(function() {
            (Tt & 6) !== 0 ? oi(dl, D2) : _p()
        })
    }
    function ic() {
        return Mi === 0 && (Mi = Th()),
        Mi
    }
    function Op(t) {
        return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : xl("" + t)
    }
    function Vp(t, e) {
        var i = e.ownerDocument.createElement("input");
        return i.name = e.name,
        i.value = e.value,
        t.id && i.setAttribute("form", t.id),
        e.parentNode.insertBefore(i, e),
        t = new FormData(t),
        i.parentNode.removeChild(i),
        t
    }
    function O2(t, e, i, l, r) {
        if (e === "submit" && i && i.stateNode === r) {
            var c = Op((r[de] || null).action)
              , v = l.submitter;
            v && (e = (e = v[de] || null) ? Op(e.formAction) : v.getAttribute("formAction"),
            e !== null && (c = e,
            v = null));
            var b = new _l("action","action",null,l,r);
            t.push({
                event: b,
                listeners: [{
                    instance: null,
                    listener: function() {
                        if (l.defaultPrevented) {
                            if (Mi !== 0) {
                                var x = v ? Vp(r, v) : new FormData(r);
                                xu(i, {
                                    pending: !0,
                                    data: x,
                                    method: r.method,
                                    action: c
                                }, null, x)
                            }
                        } else
                            typeof c == "function" && (b.preventDefault(),
                            x = v ? Vp(r, v) : new FormData(r),
                            xu(i, {
                                pending: !0,
                                data: x,
                                method: r.method,
                                action: c
                            }, c, x))
                    },
                    currentTarget: r
                }]
            })
        }
    }
    for (var ac = 0; ac < Yr.length; ac++) {
        var sc = Yr[ac]
          , V2 = sc.toLowerCase()
          , w2 = sc[0].toUpperCase() + sc.slice(1);
        Ke(V2, "on" + w2)
    }
    Ke(fd, "onAnimationEnd"),
    Ke(hd, "onAnimationIteration"),
    Ke(dd, "onAnimationStart"),
    Ke("dblclick", "onDoubleClick"),
    Ke("focusin", "onFocus"),
    Ke("focusout", "onBlur"),
    Ke($g, "onTransitionRun"),
    Ke(Jg, "onTransitionStart"),
    Ke(Wg, "onTransitionCancel"),
    Ke(md, "onTransitionEnd"),
    Yi("onMouseEnter", ["mouseout", "mouseover"]),
    Yi("onMouseLeave", ["mouseout", "mouseover"]),
    Yi("onPointerEnter", ["pointerout", "pointerover"]),
    Yi("onPointerLeave", ["pointerout", "pointerover"]),
    ui("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    ui("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
    ui("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    ui("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    ui("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
    ui("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var _s = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ")
      , z2 = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(_s));
    function wp(t, e) {
        e = (e & 4) !== 0;
        for (var i = 0; i < t.length; i++) {
            var l = t[i]
              , r = l.event;
            l = l.listeners;
            t: {
                var c = void 0;
                if (e)
                    for (var v = l.length - 1; 0 <= v; v--) {
                        var b = l[v]
                          , x = b.instance
                          , L = b.currentTarget;
                        if (b = b.listener,
                        x !== c && r.isPropagationStopped())
                            break t;
                        c = b,
                        r.currentTarget = L;
                        try {
                            c(r)
                        } catch (U) {
                            Il(U)
                        }
                        r.currentTarget = null,
                        c = x
                    }
                else
                    for (v = 0; v < l.length; v++) {
                        if (b = l[v],
                        x = b.instance,
                        L = b.currentTarget,
                        b = b.listener,
                        x !== c && r.isPropagationStopped())
                            break t;
                        c = b,
                        r.currentTarget = L;
                        try {
                            c(r)
                        } catch (U) {
                            Il(U)
                        }
                        r.currentTarget = null,
                        c = x
                    }
            }
        }
    }
    function pt(t, e) {
        var i = e[gr];
        i === void 0 && (i = e[gr] = new Set);
        var l = t + "__bubble";
        i.has(l) || (zp(e, t, 2, !1),
        i.add(l))
    }
    function lc(t, e, i) {
        var l = 0;
        e && (l |= 4),
        zp(i, t, l, e)
    }
    var mo = "_reactListening" + Math.random().toString(36).slice(2);
    function oc(t) {
        if (!t[mo]) {
            t[mo] = !0,
            _h.forEach(function(i) {
                i !== "selectionchange" && (z2.has(i) || lc(i, !1, t),
                lc(i, !0, t))
            });
            var e = t.nodeType === 9 ? t : t.ownerDocument;
            e === null || e[mo] || (e[mo] = !0,
            lc("selectionchange", !1, e))
        }
    }
    function zp(t, e, i, l) {
        switch (a0(e)) {
        case 2:
            var r = o3;
            break;
        case 8:
            r = r3;
            break;
        default:
            r = Tc
        }
        i = r.bind(null, e, i, t),
        r = void 0,
        !Dr || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (r = !0),
        l ? r !== void 0 ? t.addEventListener(e, i, {
            capture: !0,
            passive: r
        }) : t.addEventListener(e, i, !0) : r !== void 0 ? t.addEventListener(e, i, {
            passive: r
        }) : t.addEventListener(e, i, !1)
    }
    function rc(t, e, i, l, r) {
        var c = l;
        if ((e & 1) === 0 && (e & 2) === 0 && l !== null)
            t: for (; ; ) {
                if (l === null)
                    return;
                var v = l.tag;
                if (v === 3 || v === 4) {
                    var b = l.stateNode.containerInfo;
                    if (b === r)
                        break;
                    if (v === 4)
                        for (v = l.return; v !== null; ) {
                            var x = v.tag;
                            if ((x === 3 || x === 4) && v.stateNode.containerInfo === r)
                                return;
                            v = v.return
                        }
                    for (; b !== null; ) {
                        if (v = Pi(b),
                        v === null)
                            return;
                        if (x = v.tag,
                        x === 5 || x === 6 || x === 26 || x === 27) {
                            l = c = v;
                            continue t
                        }
                        b = b.parentNode
                    }
                }
                l = l.return
            }
        qh(function() {
            var L = c
              , U = _r(i)
              , P = [];
            t: {
                var O = pd.get(t);
                if (O !== void 0) {
                    var w = _l
                      , st = t;
                    switch (t) {
                    case "keypress":
                        if (Ml(i) === 0)
                            break t;
                    case "keydown":
                    case "keyup":
                        w = Ag;
                        break;
                    case "focusin":
                        st = "focus",
                        w = wr;
                        break;
                    case "focusout":
                        st = "blur",
                        w = wr;
                        break;
                    case "beforeblur":
                    case "afterblur":
                        w = wr;
                        break;
                    case "click":
                        if (i.button === 2)
                            break t;
                    case "auxclick":
                    case "dblclick":
                    case "mousedown":
                    case "mousemove":
                    case "mouseup":
                    case "mouseout":
                    case "mouseover":
                    case "contextmenu":
                        w = kh;
                        break;
                    case "drag":
                    case "dragend":
                    case "dragenter":
                    case "dragexit":
                    case "dragleave":
                    case "dragover":
                    case "dragstart":
                    case "drop":
                        w = yg;
                        break;
                    case "touchcancel":
                    case "touchend":
                    case "touchmove":
                    case "touchstart":
                        w = Og;
                        break;
                    case fd:
                    case hd:
                    case dd:
                        w = Sg;
                        break;
                    case md:
                        w = wg;
                        break;
                    case "scroll":
                    case "scrollend":
                        w = mg;
                        break;
                    case "wheel":
                        w = Bg;
                        break;
                    case "copy":
                    case "cut":
                    case "paste":
                        w = Tg;
                        break;
                    case "gotpointercapture":
                    case "lostpointercapture":
                    case "pointercancel":
                    case "pointerdown":
                    case "pointermove":
                    case "pointerout":
                    case "pointerover":
                    case "pointerup":
                        w = Kh;
                        break;
                    case "toggle":
                    case "beforetoggle":
                        w = Ng
                    }
                    var it = (e & 4) !== 0
                      , Mt = !it && (t === "scroll" || t === "scrollend")
                      , _ = it ? O !== null ? O + "Capture" : null : O;
                    it = [];
                    for (var M = L, D; M !== null; ) {
                        var N = M;
                        if (D = N.stateNode,
                        N = N.tag,
                        N !== 5 && N !== 26 && N !== 27 || D === null || _ === null || (N = Ka(M, _),
                        N != null && it.push(As(M, N, D))),
                        Mt)
                            break;
                        M = M.return
                    }
                    0 < it.length && (O = new w(O,st,null,i,U),
                    P.push({
                        event: O,
                        listeners: it
                    }))
                }
            }
            if ((e & 7) === 0) {
                t: {
                    if (O = t === "mouseover" || t === "pointerover",
                    w = t === "mouseout" || t === "pointerout",
                    O && i !== Er && (st = i.relatedTarget || i.fromElement) && (Pi(st) || st[ji]))
                        break t;
                    if ((w || O) && (O = U.window === U ? U : (O = U.ownerDocument) ? O.defaultView || O.parentWindow : window,
                    w ? (st = i.relatedTarget || i.toElement,
                    w = L,
                    st = st ? Pi(st) : null,
                    st !== null && (Mt = f(st),
                    it = st.tag,
                    st !== Mt || it !== 5 && it !== 27 && it !== 6) && (st = null)) : (w = null,
                    st = L),
                    w !== st)) {
                        if (it = kh,
                        N = "onMouseLeave",
                        _ = "onMouseEnter",
                        M = "mouse",
                        (t === "pointerout" || t === "pointerover") && (it = Kh,
                        N = "onPointerLeave",
                        _ = "onPointerEnter",
                        M = "pointer"),
                        Mt = w == null ? O : Xa(w),
                        D = st == null ? O : Xa(st),
                        O = new it(N,M + "leave",w,i,U),
                        O.target = Mt,
                        O.relatedTarget = D,
                        N = null,
                        Pi(U) === L && (it = new it(_,M + "enter",st,i,U),
                        it.target = D,
                        it.relatedTarget = Mt,
                        N = it),
                        Mt = N,
                        w && st)
                            e: {
                                for (it = w,
                                _ = st,
                                M = 0,
                                D = it; D; D = Sa(D))
                                    M++;
                                for (D = 0,
                                N = _; N; N = Sa(N))
                                    D++;
                                for (; 0 < M - D; )
                                    it = Sa(it),
                                    M--;
                                for (; 0 < D - M; )
                                    _ = Sa(_),
                                    D--;
                                for (; M--; ) {
                                    if (it === _ || _ !== null && it === _.alternate)
                                        break e;
                                    it = Sa(it),
                                    _ = Sa(_)
                                }
                                it = null
                            }
                        else
                            it = null;
                        w !== null && Bp(P, O, w, it, !1),
                        st !== null && Mt !== null && Bp(P, Mt, st, it, !0)
                    }
                }
                t: {
                    if (O = L ? Xa(L) : window,
                    w = O.nodeName && O.nodeName.toLowerCase(),
                    w === "select" || w === "input" && O.type === "file")
                        var I = td;
                    else if (Wh(O))
                        if (ed)
                            I = Zg;
                        else {
                            I = Xg;
                            var ht = kg
                        }
                    else
                        w = O.nodeName,
                        !w || w.toLowerCase() !== "input" || O.type !== "checkbox" && O.type !== "radio" ? L && Mr(L.elementType) && (I = td) : I = Kg;
                    if (I && (I = I(t, L))) {
                        Ih(P, I, i, U);
                        break t
                    }
                    ht && ht(t, O, L),
                    t === "focusout" && L && O.type === "number" && L.memoizedProps.value != null && Rr(O, "number", O.value)
                }
                switch (ht = L ? Xa(L) : window,
                t) {
                case "focusin":
                    (Wh(ht) || ht.contentEditable === "true") && (Fi = ht,
                    Pr = L,
                    ts = null);
                    break;
                case "focusout":
                    ts = Pr = Fi = null;
                    break;
                case "mousedown":
                    Hr = !0;
                    break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                    Hr = !1,
                    ud(P, i, U);
                    break;
                case "selectionchange":
                    if (Fg)
                        break;
                case "keydown":
                case "keyup":
                    ud(P, i, U)
                }
                var et;
                if (Br)
                    t: {
                        switch (t) {
                        case "compositionstart":
                            var at = "onCompositionStart";
                            break t;
                        case "compositionend":
                            at = "onCompositionEnd";
                            break t;
                        case "compositionupdate":
                            at = "onCompositionUpdate";
                            break t
                        }
                        at = void 0
                    }
                else
                    Qi ? $h(t, i) && (at = "onCompositionEnd") : t === "keydown" && i.keyCode === 229 && (at = "onCompositionStart");
                at && (Zh && i.locale !== "ko" && (Qi || at !== "onCompositionStart" ? at === "onCompositionEnd" && Qi && (et = Yh()) : (Ln = U,
                Lr = "value" in Ln ? Ln.value : Ln.textContent,
                Qi = !0)),
                ht = po(L, at),
                0 < ht.length && (at = new Xh(at,t,null,i,U),
                P.push({
                    event: at,
                    listeners: ht
                }),
                et ? at.data = et : (et = Jh(i),
                et !== null && (at.data = et)))),
                (et = Pg ? Hg(t, i) : qg(t, i)) && (at = po(L, "onBeforeInput"),
                0 < at.length && (ht = new Xh("onBeforeInput","beforeinput",null,i,U),
                P.push({
                    event: ht,
                    listeners: at
                }),
                ht.data = et)),
                O2(P, t, L, i, U)
            }
            wp(P, e)
        })
    }
    function As(t, e, i) {
        return {
            instance: t,
            listener: e,
            currentTarget: i
        }
    }
    function po(t, e) {
        for (var i = e + "Capture", l = []; t !== null; ) {
            var r = t
              , c = r.stateNode;
            if (r = r.tag,
            r !== 5 && r !== 26 && r !== 27 || c === null || (r = Ka(t, i),
            r != null && l.unshift(As(t, r, c)),
            r = Ka(t, e),
            r != null && l.push(As(t, r, c))),
            t.tag === 3)
                return l;
            t = t.return
        }
        return []
    }
    function Sa(t) {
        if (t === null)
            return null;
        do
            t = t.return;
        while (t && t.tag !== 5 && t.tag !== 27);
        return t || null
    }
    function Bp(t, e, i, l, r) {
        for (var c = e._reactName, v = []; i !== null && i !== l; ) {
            var b = i
              , x = b.alternate
              , L = b.stateNode;
            if (b = b.tag,
            x !== null && x === l)
                break;
            b !== 5 && b !== 26 && b !== 27 || L === null || (x = L,
            r ? (L = Ka(i, c),
            L != null && v.unshift(As(i, L, x))) : r || (L = Ka(i, c),
            L != null && v.push(As(i, L, x)))),
            i = i.return
        }
        v.length !== 0 && t.push({
            event: e,
            listeners: v
        })
    }
    var B2 = /\r\n?/g
      , U2 = /\u0000|\uFFFD/g;
    function Up(t) {
        return (typeof t == "string" ? t : "" + t).replace(B2, `
`).replace(U2, "")
    }
    function Np(t, e) {
        return e = Up(e),
        Up(t) === e
    }
    function yo() {}
    function Rt(t, e, i, l, r, c) {
        switch (i) {
        case "children":
            typeof l == "string" ? e === "body" || e === "textarea" && l === "" || Xi(t, l) : (typeof l == "number" || typeof l == "bigint") && e !== "body" && Xi(t, "" + l);
            break;
        case "className":
            bl(t, "class", l);
            break;
        case "tabIndex":
            bl(t, "tabindex", l);
            break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
            bl(t, i, l);
            break;
        case "style":
            Ph(t, l, c);
            break;
        case "data":
            if (e !== "object") {
                bl(t, "data", l);
                break
            }
        case "src":
        case "href":
            if (l === "" && (e !== "a" || i !== "href")) {
                t.removeAttribute(i);
                break
            }
            if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
                t.removeAttribute(i);
                break
            }
            l = xl("" + l),
            t.setAttribute(i, l);
            break;
        case "action":
        case "formAction":
            if (typeof l == "function") {
                t.setAttribute(i, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
                break
            } else
                typeof c == "function" && (i === "formAction" ? (e !== "input" && Rt(t, e, "name", r.name, r, null),
                Rt(t, e, "formEncType", r.formEncType, r, null),
                Rt(t, e, "formMethod", r.formMethod, r, null),
                Rt(t, e, "formTarget", r.formTarget, r, null)) : (Rt(t, e, "encType", r.encType, r, null),
                Rt(t, e, "method", r.method, r, null),
                Rt(t, e, "target", r.target, r, null)));
            if (l == null || typeof l == "symbol" || typeof l == "boolean") {
                t.removeAttribute(i);
                break
            }
            l = xl("" + l),
            t.setAttribute(i, l);
            break;
        case "onClick":
            l != null && (t.onclick = yo);
            break;
        case "onScroll":
            l != null && pt("scroll", t);
            break;
        case "onScrollEnd":
            l != null && pt("scrollend", t);
            break;
        case "dangerouslySetInnerHTML":
            if (l != null) {
                if (typeof l != "object" || !("__html" in l))
                    throw Error(o(61));
                if (i = l.__html,
                i != null) {
                    if (r.children != null)
                        throw Error(o(60));
                    t.innerHTML = i
                }
            }
            break;
        case "multiple":
            t.multiple = l && typeof l != "function" && typeof l != "symbol";
            break;
        case "muted":
            t.muted = l && typeof l != "function" && typeof l != "symbol";
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
            break;
        case "autoFocus":
            break;
        case "xlinkHref":
            if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
                t.removeAttribute("xlink:href");
                break
            }
            i = xl("" + l),
            t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", i);
            break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
            l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(i, "" + l) : t.removeAttribute(i);
            break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
            l && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(i, "") : t.removeAttribute(i);
            break;
        case "capture":
        case "download":
            l === !0 ? t.setAttribute(i, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(i, l) : t.removeAttribute(i);
            break;
        case "cols":
        case "rows":
        case "size":
        case "span":
            l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? t.setAttribute(i, l) : t.removeAttribute(i);
            break;
        case "rowSpan":
        case "start":
            l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? t.removeAttribute(i) : t.setAttribute(i, l);
            break;
        case "popover":
            pt("beforetoggle", t),
            pt("toggle", t),
            Sl(t, "popover", l);
            break;
        case "xlinkActuate":
            un(t, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
            break;
        case "xlinkArcrole":
            un(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
            break;
        case "xlinkRole":
            un(t, "http://www.w3.org/1999/xlink", "xlink:role", l);
            break;
        case "xlinkShow":
            un(t, "http://www.w3.org/1999/xlink", "xlink:show", l);
            break;
        case "xlinkTitle":
            un(t, "http://www.w3.org/1999/xlink", "xlink:title", l);
            break;
        case "xlinkType":
            un(t, "http://www.w3.org/1999/xlink", "xlink:type", l);
            break;
        case "xmlBase":
            un(t, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
            break;
        case "xmlLang":
            un(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
            break;
        case "xmlSpace":
            un(t, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
            break;
        case "is":
            Sl(t, "is", l);
            break;
        case "innerText":
        case "textContent":
            break;
        default:
            (!(2 < i.length) || i[0] !== "o" && i[0] !== "O" || i[1] !== "n" && i[1] !== "N") && (i = hg.get(i) || i,
            Sl(t, i, l))
        }
    }
    function uc(t, e, i, l, r, c) {
        switch (i) {
        case "style":
            Ph(t, l, c);
            break;
        case "dangerouslySetInnerHTML":
            if (l != null) {
                if (typeof l != "object" || !("__html" in l))
                    throw Error(o(61));
                if (i = l.__html,
                i != null) {
                    if (r.children != null)
                        throw Error(o(60));
                    t.innerHTML = i
                }
            }
            break;
        case "children":
            typeof l == "string" ? Xi(t, l) : (typeof l == "number" || typeof l == "bigint") && Xi(t, "" + l);
            break;
        case "onScroll":
            l != null && pt("scroll", t);
            break;
        case "onScrollEnd":
            l != null && pt("scrollend", t);
            break;
        case "onClick":
            l != null && (t.onclick = yo);
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
            break;
        case "innerText":
        case "textContent":
            break;
        default:
            if (!Ah.hasOwnProperty(i))
                t: {
                    if (i[0] === "o" && i[1] === "n" && (r = i.endsWith("Capture"),
                    e = i.slice(2, r ? i.length - 7 : void 0),
                    c = t[de] || null,
                    c = c != null ? c[i] : null,
                    typeof c == "function" && t.removeEventListener(e, c, r),
                    typeof l == "function")) {
                        typeof c != "function" && c !== null && (i in t ? t[i] = null : t.hasAttribute(i) && t.removeAttribute(i)),
                        t.addEventListener(e, l, r);
                        break t
                    }
                    i in t ? t[i] = l : l === !0 ? t.setAttribute(i, "") : Sl(t, i, l)
                }
        }
    }
    function ne(t, e, i) {
        switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "img":
            pt("error", t),
            pt("load", t);
            var l = !1, r = !1, c;
            for (c in i)
                if (i.hasOwnProperty(c)) {
                    var v = i[c];
                    if (v != null)
                        switch (c) {
                        case "src":
                            l = !0;
                            break;
                        case "srcSet":
                            r = !0;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            throw Error(o(137, e));
                        default:
                            Rt(t, e, c, v, i, null)
                        }
                }
            r && Rt(t, e, "srcSet", i.srcSet, i, null),
            l && Rt(t, e, "src", i.src, i, null);
            return;
        case "input":
            pt("invalid", t);
            var b = c = v = r = null
              , x = null
              , L = null;
            for (l in i)
                if (i.hasOwnProperty(l)) {
                    var U = i[l];
                    if (U != null)
                        switch (l) {
                        case "name":
                            r = U;
                            break;
                        case "type":
                            v = U;
                            break;
                        case "checked":
                            x = U;
                            break;
                        case "defaultChecked":
                            L = U;
                            break;
                        case "value":
                            c = U;
                            break;
                        case "defaultValue":
                            b = U;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            if (U != null)
                                throw Error(o(137, e));
                            break;
                        default:
                            Rt(t, e, l, U, i, null)
                        }
                }
            Bh(t, c, b, x, L, v, r, !1),
            Tl(t);
            return;
        case "select":
            pt("invalid", t),
            l = v = c = null;
            for (r in i)
                if (i.hasOwnProperty(r) && (b = i[r],
                b != null))
                    switch (r) {
                    case "value":
                        c = b;
                        break;
                    case "defaultValue":
                        v = b;
                        break;
                    case "multiple":
                        l = b;
                    default:
                        Rt(t, e, r, b, i, null)
                    }
            e = c,
            i = v,
            t.multiple = !!l,
            e != null ? ki(t, !!l, e, !1) : i != null && ki(t, !!l, i, !0);
            return;
        case "textarea":
            pt("invalid", t),
            c = r = l = null;
            for (v in i)
                if (i.hasOwnProperty(v) && (b = i[v],
                b != null))
                    switch (v) {
                    case "value":
                        l = b;
                        break;
                    case "defaultValue":
                        r = b;
                        break;
                    case "children":
                        c = b;
                        break;
                    case "dangerouslySetInnerHTML":
                        if (b != null)
                            throw Error(o(91));
                        break;
                    default:
                        Rt(t, e, v, b, i, null)
                    }
            Nh(t, l, r, c),
            Tl(t);
            return;
        case "option":
            for (x in i)
                if (i.hasOwnProperty(x) && (l = i[x],
                l != null))
                    switch (x) {
                    case "selected":
                        t.selected = l && typeof l != "function" && typeof l != "symbol";
                        break;
                    default:
                        Rt(t, e, x, l, i, null)
                    }
            return;
        case "dialog":
            pt("beforetoggle", t),
            pt("toggle", t),
            pt("cancel", t),
            pt("close", t);
            break;
        case "iframe":
        case "object":
            pt("load", t);
            break;
        case "video":
        case "audio":
            for (l = 0; l < _s.length; l++)
                pt(_s[l], t);
            break;
        case "image":
            pt("error", t),
            pt("load", t);
            break;
        case "details":
            pt("toggle", t);
            break;
        case "embed":
        case "source":
        case "link":
            pt("error", t),
            pt("load", t);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
            for (L in i)
                if (i.hasOwnProperty(L) && (l = i[L],
                l != null))
                    switch (L) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                        throw Error(o(137, e));
                    default:
                        Rt(t, e, L, l, i, null)
                    }
            return;
        default:
            if (Mr(e)) {
                for (U in i)
                    i.hasOwnProperty(U) && (l = i[U],
                    l !== void 0 && uc(t, e, U, l, i, void 0));
                return
            }
        }
        for (b in i)
            i.hasOwnProperty(b) && (l = i[b],
            l != null && Rt(t, e, b, l, i, null))
    }
    function N2(t, e, i, l) {
        switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "input":
            var r = null
              , c = null
              , v = null
              , b = null
              , x = null
              , L = null
              , U = null;
            for (w in i) {
                var P = i[w];
                if (i.hasOwnProperty(w) && P != null)
                    switch (w) {
                    case "checked":
                        break;
                    case "value":
                        break;
                    case "defaultValue":
                        x = P;
                    default:
                        l.hasOwnProperty(w) || Rt(t, e, w, null, l, P)
                    }
            }
            for (var O in l) {
                var w = l[O];
                if (P = i[O],
                l.hasOwnProperty(O) && (w != null || P != null))
                    switch (O) {
                    case "type":
                        c = w;
                        break;
                    case "name":
                        r = w;
                        break;
                    case "checked":
                        L = w;
                        break;
                    case "defaultChecked":
                        U = w;
                        break;
                    case "value":
                        v = w;
                        break;
                    case "defaultValue":
                        b = w;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (w != null)
                            throw Error(o(137, e));
                        break;
                    default:
                        w !== P && Rt(t, e, O, w, l, P)
                    }
            }
            xr(t, v, b, x, L, U, c, r);
            return;
        case "select":
            w = v = b = O = null;
            for (c in i)
                if (x = i[c],
                i.hasOwnProperty(c) && x != null)
                    switch (c) {
                    case "value":
                        break;
                    case "multiple":
                        w = x;
                    default:
                        l.hasOwnProperty(c) || Rt(t, e, c, null, l, x)
                    }
            for (r in l)
                if (c = l[r],
                x = i[r],
                l.hasOwnProperty(r) && (c != null || x != null))
                    switch (r) {
                    case "value":
                        O = c;
                        break;
                    case "defaultValue":
                        b = c;
                        break;
                    case "multiple":
                        v = c;
                    default:
                        c !== x && Rt(t, e, r, c, l, x)
                    }
            e = b,
            i = v,
            l = w,
            O != null ? ki(t, !!i, O, !1) : !!l != !!i && (e != null ? ki(t, !!i, e, !0) : ki(t, !!i, i ? [] : "", !1));
            return;
        case "textarea":
            w = O = null;
            for (b in i)
                if (r = i[b],
                i.hasOwnProperty(b) && r != null && !l.hasOwnProperty(b))
                    switch (b) {
                    case "value":
                        break;
                    case "children":
                        break;
                    default:
                        Rt(t, e, b, null, l, r)
                    }
            for (v in l)
                if (r = l[v],
                c = i[v],
                l.hasOwnProperty(v) && (r != null || c != null))
                    switch (v) {
                    case "value":
                        O = r;
                        break;
                    case "defaultValue":
                        w = r;
                        break;
                    case "children":
                        break;
                    case "dangerouslySetInnerHTML":
                        if (r != null)
                            throw Error(o(91));
                        break;
                    default:
                        r !== c && Rt(t, e, v, r, l, c)
                    }
            Uh(t, O, w);
            return;
        case "option":
            for (var st in i)
                if (O = i[st],
                i.hasOwnProperty(st) && O != null && !l.hasOwnProperty(st))
                    switch (st) {
                    case "selected":
                        t.selected = !1;
                        break;
                    default:
                        Rt(t, e, st, null, l, O)
                    }
            for (x in l)
                if (O = l[x],
                w = i[x],
                l.hasOwnProperty(x) && O !== w && (O != null || w != null))
                    switch (x) {
                    case "selected":
                        t.selected = O && typeof O != "function" && typeof O != "symbol";
                        break;
                    default:
                        Rt(t, e, x, O, l, w)
                    }
            return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
            for (var it in i)
                O = i[it],
                i.hasOwnProperty(it) && O != null && !l.hasOwnProperty(it) && Rt(t, e, it, null, l, O);
            for (L in l)
                if (O = l[L],
                w = i[L],
                l.hasOwnProperty(L) && O !== w && (O != null || w != null))
                    switch (L) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (O != null)
                            throw Error(o(137, e));
                        break;
                    default:
                        Rt(t, e, L, O, l, w)
                    }
            return;
        default:
            if (Mr(e)) {
                for (var Mt in i)
                    O = i[Mt],
                    i.hasOwnProperty(Mt) && O !== void 0 && !l.hasOwnProperty(Mt) && uc(t, e, Mt, void 0, l, O);
                for (U in l)
                    O = l[U],
                    w = i[U],
                    !l.hasOwnProperty(U) || O === w || O === void 0 && w === void 0 || uc(t, e, U, O, l, w);
                return
            }
        }
        for (var _ in i)
            O = i[_],
            i.hasOwnProperty(_) && O != null && !l.hasOwnProperty(_) && Rt(t, e, _, null, l, O);
        for (P in l)
            O = l[P],
            w = i[P],
            !l.hasOwnProperty(P) || O === w || O == null && w == null || Rt(t, e, P, O, l, w)
    }
    var cc = null
      , fc = null;
    function vo(t) {
        return t.nodeType === 9 ? t : t.ownerDocument
    }
    function jp(t) {
        switch (t) {
        case "http://www.w3.org/2000/svg":
            return 1;
        case "http://www.w3.org/1998/Math/MathML":
            return 2;
        default:
            return 0
        }
    }
    function Pp(t, e) {
        if (t === 0)
            switch (e) {
            case "svg":
                return 1;
            case "math":
                return 2;
            default:
                return 0
            }
        return t === 1 && e === "foreignObject" ? 0 : t
    }
    function hc(t, e) {
        return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null
    }
    var dc = null;
    function j2() {
        var t = window.event;
        return t && t.type === "popstate" ? t === dc ? !1 : (dc = t,
        !0) : (dc = null,
        !1)
    }
    var Hp = typeof setTimeout == "function" ? setTimeout : void 0
      , P2 = typeof clearTimeout == "function" ? clearTimeout : void 0
      , qp = typeof Promise == "function" ? Promise : void 0
      , H2 = typeof queueMicrotask == "function" ? queueMicrotask : typeof qp < "u" ? function(t) {
        return qp.resolve(null).then(t).catch(q2)
    }
    : Hp;
    function q2(t) {
        setTimeout(function() {
            throw t
        })
    }
    function Kn(t) {
        return t === "head"
    }
    function Yp(t, e) {
        var i = e
          , l = 0
          , r = 0;
        do {
            var c = i.nextSibling;
            if (t.removeChild(i),
            c && c.nodeType === 8)
                if (i = c.data,
                i === "/$") {
                    if (0 < l && 8 > l) {
                        i = l;
                        var v = t.ownerDocument;
                        if (i & 1 && Ds(v.documentElement),
                        i & 2 && Ds(v.body),
                        i & 4)
                            for (i = v.head,
                            Ds(i),
                            v = i.firstChild; v; ) {
                                var b = v.nextSibling
                                  , x = v.nodeName;
                                v[ka] || x === "SCRIPT" || x === "STYLE" || x === "LINK" && v.rel.toLowerCase() === "stylesheet" || i.removeChild(v),
                                v = b
                            }
                    }
                    if (r === 0) {
                        t.removeChild(c),
                        Ns(e);
                        return
                    }
                    r--
                } else
                    i === "$" || i === "$?" || i === "$!" ? r++ : l = i.charCodeAt(0) - 48;
            else
                l = 0;
            i = c
        } while (i);
        Ns(e)
    }
    function mc(t) {
        var e = t.firstChild;
        for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
            var i = e;
            switch (e = e.nextSibling,
            i.nodeName) {
            case "HTML":
            case "HEAD":
            case "BODY":
                mc(i),
                Sr(i);
                continue;
            case "SCRIPT":
            case "STYLE":
                continue;
            case "LINK":
                if (i.rel.toLowerCase() === "stylesheet")
                    continue
            }
            t.removeChild(i)
        }
    }
    function Y2(t, e, i, l) {
        for (; t.nodeType === 1; ) {
            var r = i;
            if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
                if (!l && (t.nodeName !== "INPUT" || t.type !== "hidden"))
                    break
            } else if (l) {
                if (!t[ka])
                    switch (e) {
                    case "meta":
                        if (!t.hasAttribute("itemprop"))
                            break;
                        return t;
                    case "link":
                        if (c = t.getAttribute("rel"),
                        c === "stylesheet" && t.hasAttribute("data-precedence"))
                            break;
                        if (c !== r.rel || t.getAttribute("href") !== (r.href == null || r.href === "" ? null : r.href) || t.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin) || t.getAttribute("title") !== (r.title == null ? null : r.title))
                            break;
                        return t;
                    case "style":
                        if (t.hasAttribute("data-precedence"))
                            break;
                        return t;
                    case "script":
                        if (c = t.getAttribute("src"),
                        (c !== (r.src == null ? null : r.src) || t.getAttribute("type") !== (r.type == null ? null : r.type) || t.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin)) && c && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                            break;
                        return t;
                    default:
                        return t
                    }
            } else if (e === "input" && t.type === "hidden") {
                var c = r.name == null ? null : "" + r.name;
                if (r.type === "hidden" && t.getAttribute("name") === c)
                    return t
            } else
                return t;
            if (t = Qe(t.nextSibling),
            t === null)
                break
        }
        return null
    }
    function G2(t, e, i) {
        if (e === "")
            return null;
        for (; t.nodeType !== 3; )
            if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !i || (t = Qe(t.nextSibling),
            t === null))
                return null;
        return t
    }
    function pc(t) {
        return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState === "complete"
    }
    function k2(t, e) {
        var i = t.ownerDocument;
        if (t.data !== "$?" || i.readyState === "complete")
            e();
        else {
            var l = function() {
                e(),
                i.removeEventListener("DOMContentLoaded", l)
            };
            i.addEventListener("DOMContentLoaded", l),
            t._reactRetry = l
        }
    }
    function Qe(t) {
        for (; t != null; t = t.nextSibling) {
            var e = t.nodeType;
            if (e === 1 || e === 3)
                break;
            if (e === 8) {
                if (e = t.data,
                e === "$" || e === "$!" || e === "$?" || e === "F!" || e === "F")
                    break;
                if (e === "/$")
                    return null
            }
        }
        return t
    }
    var yc = null;
    function Gp(t) {
        t = t.previousSibling;
        for (var e = 0; t; ) {
            if (t.nodeType === 8) {
                var i = t.data;
                if (i === "$" || i === "$!" || i === "$?") {
                    if (e === 0)
                        return t;
                    e--
                } else
                    i === "/$" && e++
            }
            t = t.previousSibling
        }
        return null
    }
    function kp(t, e, i) {
        switch (e = vo(i),
        t) {
        case "html":
            if (t = e.documentElement,
            !t)
                throw Error(o(452));
            return t;
        case "head":
            if (t = e.head,
            !t)
                throw Error(o(453));
            return t;
        case "body":
            if (t = e.body,
            !t)
                throw Error(o(454));
            return t;
        default:
            throw Error(o(451))
        }
    }
    function Ds(t) {
        for (var e = t.attributes; e.length; )
            t.removeAttributeNode(e[0]);
        Sr(t)
    }
    var Ne = new Map
      , Xp = new Set;
    function go(t) {
        return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument
    }
    var xn = k.d;
    k.d = {
        f: X2,
        r: K2,
        D: Z2,
        C: Q2,
        L: F2,
        m: $2,
        X: W2,
        S: J2,
        M: I2
    };
    function X2() {
        var t = xn.f()
          , e = ro();
        return t || e
    }
    function K2(t) {
        var e = Hi(t);
        e !== null && e.tag === 5 && e.type === "form" ? fm(e) : xn.r(t)
    }
    var ba = typeof document > "u" ? null : document;
    function Kp(t, e, i) {
        var l = ba;
        if (l && typeof e == "string" && e) {
            var r = Le(e);
            r = 'link[rel="' + t + '"][href="' + r + '"]',
            typeof i == "string" && (r += '[crossorigin="' + i + '"]'),
            Xp.has(r) || (Xp.add(r),
            t = {
                rel: t,
                crossOrigin: i,
                href: e
            },
            l.querySelector(r) === null && (e = l.createElement("link"),
            ne(e, "link", t),
            $t(e),
            l.head.appendChild(e)))
        }
    }
    function Z2(t) {
        xn.D(t),
        Kp("dns-prefetch", t, null)
    }
    function Q2(t, e) {
        xn.C(t, e),
        Kp("preconnect", t, e)
    }
    function F2(t, e, i) {
        xn.L(t, e, i);
        var l = ba;
        if (l && t && e) {
            var r = 'link[rel="preload"][as="' + Le(e) + '"]';
            e === "image" && i && i.imageSrcSet ? (r += '[imagesrcset="' + Le(i.imageSrcSet) + '"]',
            typeof i.imageSizes == "string" && (r += '[imagesizes="' + Le(i.imageSizes) + '"]')) : r += '[href="' + Le(t) + '"]';
            var c = r;
            switch (e) {
            case "style":
                c = Ta(t);
                break;
            case "script":
                c = Ca(t)
            }
            Ne.has(c) || (t = y({
                rel: "preload",
                href: e === "image" && i && i.imageSrcSet ? void 0 : t,
                as: e
            }, i),
            Ne.set(c, t),
            l.querySelector(r) !== null || e === "style" && l.querySelector(Ls(c)) || e === "script" && l.querySelector(Os(c)) || (e = l.createElement("link"),
            ne(e, "link", t),
            $t(e),
            l.head.appendChild(e)))
        }
    }
    function $2(t, e) {
        xn.m(t, e);
        var i = ba;
        if (i && t) {
            var l = e && typeof e.as == "string" ? e.as : "script"
              , r = 'link[rel="modulepreload"][as="' + Le(l) + '"][href="' + Le(t) + '"]'
              , c = r;
            switch (l) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
                c = Ca(t)
            }
            if (!Ne.has(c) && (t = y({
                rel: "modulepreload",
                href: t
            }, e),
            Ne.set(c, t),
            i.querySelector(r) === null)) {
                switch (l) {
                case "audioworklet":
                case "paintworklet":
                case "serviceworker":
                case "sharedworker":
                case "worker":
                case "script":
                    if (i.querySelector(Os(c)))
                        return
                }
                l = i.createElement("link"),
                ne(l, "link", t),
                $t(l),
                i.head.appendChild(l)
            }
        }
    }
    function J2(t, e, i) {
        xn.S(t, e, i);
        var l = ba;
        if (l && t) {
            var r = qi(l).hoistableStyles
              , c = Ta(t);
            e = e || "default";
            var v = r.get(c);
            if (!v) {
                var b = {
                    loading: 0,
                    preload: null
                };
                if (v = l.querySelector(Ls(c)))
                    b.loading = 5;
                else {
                    t = y({
                        rel: "stylesheet",
                        href: t,
                        "data-precedence": e
                    }, i),
                    (i = Ne.get(c)) && vc(t, i);
                    var x = v = l.createElement("link");
                    $t(x),
                    ne(x, "link", t),
                    x._p = new Promise(function(L, U) {
                        x.onload = L,
                        x.onerror = U
                    }
                    ),
                    x.addEventListener("load", function() {
                        b.loading |= 1
                    }),
                    x.addEventListener("error", function() {
                        b.loading |= 2
                    }),
                    b.loading |= 4,
                    So(v, e, l)
                }
                v = {
                    type: "stylesheet",
                    instance: v,
                    count: 1,
                    state: b
                },
                r.set(c, v)
            }
        }
    }
    function W2(t, e) {
        xn.X(t, e);
        var i = ba;
        if (i && t) {
            var l = qi(i).hoistableScripts
              , r = Ca(t)
              , c = l.get(r);
            c || (c = i.querySelector(Os(r)),
            c || (t = y({
                src: t,
                async: !0
            }, e),
            (e = Ne.get(r)) && gc(t, e),
            c = i.createElement("script"),
            $t(c),
            ne(c, "link", t),
            i.head.appendChild(c)),
            c = {
                type: "script",
                instance: c,
                count: 1,
                state: null
            },
            l.set(r, c))
        }
    }
    function I2(t, e) {
        xn.M(t, e);
        var i = ba;
        if (i && t) {
            var l = qi(i).hoistableScripts
              , r = Ca(t)
              , c = l.get(r);
            c || (c = i.querySelector(Os(r)),
            c || (t = y({
                src: t,
                async: !0,
                type: "module"
            }, e),
            (e = Ne.get(r)) && gc(t, e),
            c = i.createElement("script"),
            $t(c),
            ne(c, "link", t),
            i.head.appendChild(c)),
            c = {
                type: "script",
                instance: c,
                count: 1,
                state: null
            },
            l.set(r, c))
        }
    }
    function Zp(t, e, i, l) {
        var r = (r = ot.current) ? go(r) : null;
        if (!r)
            throw Error(o(446));
        switch (t) {
        case "meta":
        case "title":
            return null;
        case "style":
            return typeof i.precedence == "string" && typeof i.href == "string" ? (e = Ta(i.href),
            i = qi(r).hoistableStyles,
            l = i.get(e),
            l || (l = {
                type: "style",
                instance: null,
                count: 0,
                state: null
            },
            i.set(e, l)),
            l) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        case "link":
            if (i.rel === "stylesheet" && typeof i.href == "string" && typeof i.precedence == "string") {
                t = Ta(i.href);
                var c = qi(r).hoistableStyles
                  , v = c.get(t);
                if (v || (r = r.ownerDocument || r,
                v = {
                    type: "stylesheet",
                    instance: null,
                    count: 0,
                    state: {
                        loading: 0,
                        preload: null
                    }
                },
                c.set(t, v),
                (c = r.querySelector(Ls(t))) && !c._p && (v.instance = c,
                v.state.loading = 5),
                Ne.has(t) || (i = {
                    rel: "preload",
                    as: "style",
                    href: i.href,
                    crossOrigin: i.crossOrigin,
                    integrity: i.integrity,
                    media: i.media,
                    hrefLang: i.hrefLang,
                    referrerPolicy: i.referrerPolicy
                },
                Ne.set(t, i),
                c || t3(r, t, i, v.state))),
                e && l === null)
                    throw Error(o(528, ""));
                return v
            }
            if (e && l !== null)
                throw Error(o(529, ""));
            return null;
        case "script":
            return e = i.async,
            i = i.src,
            typeof i == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = Ca(i),
            i = qi(r).hoistableScripts,
            l = i.get(e),
            l || (l = {
                type: "script",
                instance: null,
                count: 0,
                state: null
            },
            i.set(e, l)),
            l) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        default:
            throw Error(o(444, t))
        }
    }
    function Ta(t) {
        return 'href="' + Le(t) + '"'
    }
    function Ls(t) {
        return 'link[rel="stylesheet"][' + t + "]"
    }
    function Qp(t) {
        return y({}, t, {
            "data-precedence": t.precedence,
            precedence: null
        })
    }
    function t3(t, e, i, l) {
        t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? l.loading = 1 : (e = t.createElement("link"),
        l.preload = e,
        e.addEventListener("load", function() {
            return l.loading |= 1
        }),
        e.addEventListener("error", function() {
            return l.loading |= 2
        }),
        ne(e, "link", i),
        $t(e),
        t.head.appendChild(e))
    }
    function Ca(t) {
        return '[src="' + Le(t) + '"]'
    }
    function Os(t) {
        return "script[async]" + t
    }
    function Fp(t, e, i) {
        if (e.count++,
        e.instance === null)
            switch (e.type) {
            case "style":
                var l = t.querySelector('style[data-href~="' + Le(i.href) + '"]');
                if (l)
                    return e.instance = l,
                    $t(l),
                    l;
                var r = y({}, i, {
                    "data-href": i.href,
                    "data-precedence": i.precedence,
                    href: null,
                    precedence: null
                });
                return l = (t.ownerDocument || t).createElement("style"),
                $t(l),
                ne(l, "style", r),
                So(l, i.precedence, t),
                e.instance = l;
            case "stylesheet":
                r = Ta(i.href);
                var c = t.querySelector(Ls(r));
                if (c)
                    return e.state.loading |= 4,
                    e.instance = c,
                    $t(c),
                    c;
                l = Qp(i),
                (r = Ne.get(r)) && vc(l, r),
                c = (t.ownerDocument || t).createElement("link"),
                $t(c);
                var v = c;
                return v._p = new Promise(function(b, x) {
                    v.onload = b,
                    v.onerror = x
                }
                ),
                ne(c, "link", l),
                e.state.loading |= 4,
                So(c, i.precedence, t),
                e.instance = c;
            case "script":
                return c = Ca(i.src),
                (r = t.querySelector(Os(c))) ? (e.instance = r,
                $t(r),
                r) : (l = i,
                (r = Ne.get(c)) && (l = y({}, i),
                gc(l, r)),
                t = t.ownerDocument || t,
                r = t.createElement("script"),
                $t(r),
                ne(r, "link", l),
                t.head.appendChild(r),
                e.instance = r);
            case "void":
                return null;
            default:
                throw Error(o(443, e.type))
            }
        else
            e.type === "stylesheet" && (e.state.loading & 4) === 0 && (l = e.instance,
            e.state.loading |= 4,
            So(l, i.precedence, t));
        return e.instance
    }
    function So(t, e, i) {
        for (var l = i.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), r = l.length ? l[l.length - 1] : null, c = r, v = 0; v < l.length; v++) {
            var b = l[v];
            if (b.dataset.precedence === e)
                c = b;
            else if (c !== r)
                break
        }
        c ? c.parentNode.insertBefore(t, c.nextSibling) : (e = i.nodeType === 9 ? i.head : i,
        e.insertBefore(t, e.firstChild))
    }
    function vc(t, e) {
        t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
        t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
        t.title == null && (t.title = e.title)
    }
    function gc(t, e) {
        t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
        t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
        t.integrity == null && (t.integrity = e.integrity)
    }
    var bo = null;
    function $p(t, e, i) {
        if (bo === null) {
            var l = new Map
              , r = bo = new Map;
            r.set(i, l)
        } else
            r = bo,
            l = r.get(i),
            l || (l = new Map,
            r.set(i, l));
        if (l.has(t))
            return l;
        for (l.set(t, null),
        i = i.getElementsByTagName(t),
        r = 0; r < i.length; r++) {
            var c = i[r];
            if (!(c[ka] || c[le] || t === "link" && c.getAttribute("rel") === "stylesheet") && c.namespaceURI !== "http://www.w3.org/2000/svg") {
                var v = c.getAttribute(e) || "";
                v = t + v;
                var b = l.get(v);
                b ? b.push(c) : l.set(v, [c])
            }
        }
        return l
    }
    function Jp(t, e, i) {
        t = t.ownerDocument || t,
        t.head.insertBefore(i, e === "title" ? t.querySelector("head > title") : null)
    }
    function e3(t, e, i) {
        if (i === 1 || e.itemProp != null)
            return !1;
        switch (t) {
        case "meta":
        case "title":
            return !0;
        case "style":
            if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
                break;
            return !0;
        case "link":
            if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
                break;
            switch (e.rel) {
            case "stylesheet":
                return t = e.disabled,
                typeof e.precedence == "string" && t == null;
            default:
                return !0
            }
        case "script":
            if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
                return !0
        }
        return !1
    }
    function Wp(t) {
        return !(t.type === "stylesheet" && (t.state.loading & 3) === 0)
    }
    var Vs = null;
    function n3() {}
    function i3(t, e, i) {
        if (Vs === null)
            throw Error(o(475));
        var l = Vs;
        if (e.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== !1) && (e.state.loading & 4) === 0) {
            if (e.instance === null) {
                var r = Ta(i.href)
                  , c = t.querySelector(Ls(r));
                if (c) {
                    t = c._p,
                    t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++,
                    l = To.bind(l),
                    t.then(l, l)),
                    e.state.loading |= 4,
                    e.instance = c,
                    $t(c);
                    return
                }
                c = t.ownerDocument || t,
                i = Qp(i),
                (r = Ne.get(r)) && vc(i, r),
                c = c.createElement("link"),
                $t(c);
                var v = c;
                v._p = new Promise(function(b, x) {
                    v.onload = b,
                    v.onerror = x
                }
                ),
                ne(c, "link", i),
                e.instance = c
            }
            l.stylesheets === null && (l.stylesheets = new Map),
            l.stylesheets.set(e, t),
            (t = e.state.preload) && (e.state.loading & 3) === 0 && (l.count++,
            e = To.bind(l),
            t.addEventListener("load", e),
            t.addEventListener("error", e))
        }
    }
    function a3() {
        if (Vs === null)
            throw Error(o(475));
        var t = Vs;
        return t.stylesheets && t.count === 0 && Sc(t, t.stylesheets),
        0 < t.count ? function(e) {
            var i = setTimeout(function() {
                if (t.stylesheets && Sc(t, t.stylesheets),
                t.unsuspend) {
                    var l = t.unsuspend;
                    t.unsuspend = null,
                    l()
                }
            }, 6e4);
            return t.unsuspend = e,
            function() {
                t.unsuspend = null,
                clearTimeout(i)
            }
        }
        : null
    }
    function To() {
        if (this.count--,
        this.count === 0) {
            if (this.stylesheets)
                Sc(this, this.stylesheets);
            else if (this.unsuspend) {
                var t = this.unsuspend;
                this.unsuspend = null,
                t()
            }
        }
    }
    var Co = null;
    function Sc(t, e) {
        t.stylesheets = null,
        t.unsuspend !== null && (t.count++,
        Co = new Map,
        e.forEach(s3, t),
        Co = null,
        To.call(t))
    }
    function s3(t, e) {
        if (!(e.state.loading & 4)) {
            var i = Co.get(t);
            if (i)
                var l = i.get(null);
            else {
                i = new Map,
                Co.set(t, i);
                for (var r = t.querySelectorAll("link[data-precedence],style[data-precedence]"), c = 0; c < r.length; c++) {
                    var v = r[c];
                    (v.nodeName === "LINK" || v.getAttribute("media") !== "not all") && (i.set(v.dataset.precedence, v),
                    l = v)
                }
                l && i.set(null, l)
            }
            r = e.instance,
            v = r.getAttribute("data-precedence"),
            c = i.get(v) || l,
            c === l && i.set(null, r),
            i.set(v, r),
            this.count++,
            l = To.bind(this),
            r.addEventListener("load", l),
            r.addEventListener("error", l),
            c ? c.parentNode.insertBefore(r, c.nextSibling) : (t = t.nodeType === 9 ? t.head : t,
            t.insertBefore(r, t.firstChild)),
            e.state.loading |= 4
        }
    }
    var ws = {
        $$typeof: B,
        Provider: null,
        Consumer: null,
        _currentValue: W,
        _currentValue2: W,
        _threadCount: 0
    };
    function l3(t, e, i, l, r, c, v, b) {
        this.tag = 1,
        this.containerInfo = t,
        this.pingCache = this.current = this.pendingChildren = null,
        this.timeoutHandle = -1,
        this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null,
        this.callbackPriority = 0,
        this.expirationTimes = pr(-1),
        this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0,
        this.entanglements = pr(0),
        this.hiddenUpdates = pr(null),
        this.identifierPrefix = l,
        this.onUncaughtError = r,
        this.onCaughtError = c,
        this.onRecoverableError = v,
        this.pooledCache = null,
        this.pooledCacheLanes = 0,
        this.formState = b,
        this.incompleteTransitions = new Map
    }
    function Ip(t, e, i, l, r, c, v, b, x, L, U, P) {
        return t = new l3(t,e,i,v,b,x,L,P),
        e = 1,
        c === !0 && (e |= 24),
        c = Ce(3, null, null, e),
        t.current = c,
        c.stateNode = t,
        e = tu(),
        e.refCount++,
        t.pooledCache = e,
        e.refCount++,
        c.memoizedState = {
            element: l,
            isDehydrated: i,
            cache: e
        },
        au(c),
        t
    }
    function t0(t) {
        return t ? (t = Ii,
        t) : Ii
    }
    function e0(t, e, i, l, r, c) {
        r = t0(r),
        l.context === null ? l.context = r : l.pendingContext = r,
        l = wn(e),
        l.payload = {
            element: i
        },
        c = c === void 0 ? null : c,
        c !== null && (l.callback = c),
        i = zn(t, l, e),
        i !== null && (_e(i, t, e),
        us(i, t, e))
    }
    function n0(t, e) {
        if (t = t.memoizedState,
        t !== null && t.dehydrated !== null) {
            var i = t.retryLane;
            t.retryLane = i !== 0 && i < e ? i : e
        }
    }
    function bc(t, e) {
        n0(t, e),
        (t = t.alternate) && n0(t, e)
    }
    function i0(t) {
        if (t.tag === 13) {
            var e = Wi(t, 67108864);
            e !== null && _e(e, t, 67108864),
            bc(t, 67108864)
        }
    }
    var xo = !0;
    function o3(t, e, i, l) {
        var r = z.T;
        z.T = null;
        var c = k.p;
        try {
            k.p = 2,
            Tc(t, e, i, l)
        } finally {
            k.p = c,
            z.T = r
        }
    }
    function r3(t, e, i, l) {
        var r = z.T;
        z.T = null;
        var c = k.p;
        try {
            k.p = 8,
            Tc(t, e, i, l)
        } finally {
            k.p = c,
            z.T = r
        }
    }
    function Tc(t, e, i, l) {
        if (xo) {
            var r = Cc(l);
            if (r === null)
                rc(t, e, l, Ro, i),
                s0(t, l);
            else if (c3(r, t, e, i, l))
                l.stopPropagation();
            else if (s0(t, l),
            e & 4 && -1 < u3.indexOf(t)) {
                for (; r !== null; ) {
                    var c = Hi(r);
                    if (c !== null)
                        switch (c.tag) {
                        case 3:
                            if (c = c.stateNode,
                            c.current.memoizedState.isDehydrated) {
                                var v = ri(c.pendingLanes);
                                if (v !== 0) {
                                    var b = c;
                                    for (b.pendingLanes |= 2,
                                    b.entangledLanes |= 2; v; ) {
                                        var x = 1 << 31 - be(v);
                                        b.entanglements[1] |= x,
                                        v &= ~x
                                    }
                                    en(c),
                                    (Tt & 6) === 0 && (lo = Se() + 500,
                                    Es(0))
                                }
                            }
                            break;
                        case 13:
                            b = Wi(c, 2),
                            b !== null && _e(b, c, 2),
                            ro(),
                            bc(c, 2)
                        }
                    if (c = Cc(l),
                    c === null && rc(t, e, l, Ro, i),
                    c === r)
                        break;
                    r = c
                }
                r !== null && l.stopPropagation()
            } else
                rc(t, e, l, null, i)
        }
    }
    function Cc(t) {
        return t = _r(t),
        xc(t)
    }
    var Ro = null;
    function xc(t) {
        if (Ro = null,
        t = Pi(t),
        t !== null) {
            var e = f(t);
            if (e === null)
                t = null;
            else {
                var i = e.tag;
                if (i === 13) {
                    if (t = h(e),
                    t !== null)
                        return t;
                    t = null
                } else if (i === 3) {
                    if (e.stateNode.current.memoizedState.isDehydrated)
                        return e.tag === 3 ? e.stateNode.containerInfo : null;
                    t = null
                } else
                    e !== t && (t = null)
            }
        }
        return Ro = t,
        null
    }
    function a0(t) {
        switch (t) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
            return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
            return 8;
        case "message":
            switch (mr()) {
            case dl:
                return 2;
            case ml:
                return 8;
            case on:
            case Ni:
                return 32;
            case qa:
                return 268435456;
            default:
                return 32
            }
        default:
            return 32
        }
    }
    var Rc = !1
      , Zn = null
      , Qn = null
      , Fn = null
      , zs = new Map
      , Bs = new Map
      , $n = []
      , u3 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function s0(t, e) {
        switch (t) {
        case "focusin":
        case "focusout":
            Zn = null;
            break;
        case "dragenter":
        case "dragleave":
            Qn = null;
            break;
        case "mouseover":
        case "mouseout":
            Fn = null;
            break;
        case "pointerover":
        case "pointerout":
            zs.delete(e.pointerId);
            break;
        case "gotpointercapture":
        case "lostpointercapture":
            Bs.delete(e.pointerId)
        }
    }
    function Us(t, e, i, l, r, c) {
        return t === null || t.nativeEvent !== c ? (t = {
            blockedOn: e,
            domEventName: i,
            eventSystemFlags: l,
            nativeEvent: c,
            targetContainers: [r]
        },
        e !== null && (e = Hi(e),
        e !== null && i0(e)),
        t) : (t.eventSystemFlags |= l,
        e = t.targetContainers,
        r !== null && e.indexOf(r) === -1 && e.push(r),
        t)
    }
    function c3(t, e, i, l, r) {
        switch (e) {
        case "focusin":
            return Zn = Us(Zn, t, e, i, l, r),
            !0;
        case "dragenter":
            return Qn = Us(Qn, t, e, i, l, r),
            !0;
        case "mouseover":
            return Fn = Us(Fn, t, e, i, l, r),
            !0;
        case "pointerover":
            var c = r.pointerId;
            return zs.set(c, Us(zs.get(c) || null, t, e, i, l, r)),
            !0;
        case "gotpointercapture":
            return c = r.pointerId,
            Bs.set(c, Us(Bs.get(c) || null, t, e, i, l, r)),
            !0
        }
        return !1
    }
    function l0(t) {
        var e = Pi(t.target);
        if (e !== null) {
            var i = f(e);
            if (i !== null) {
                if (e = i.tag,
                e === 13) {
                    if (e = h(i),
                    e !== null) {
                        t.blockedOn = e,
                        ig(t.priority, function() {
                            if (i.tag === 13) {
                                var l = Ee();
                                l = yr(l);
                                var r = Wi(i, l);
                                r !== null && _e(r, i, l),
                                bc(i, l)
                            }
                        });
                        return
                    }
                } else if (e === 3 && i.stateNode.current.memoizedState.isDehydrated) {
                    t.blockedOn = i.tag === 3 ? i.stateNode.containerInfo : null;
                    return
                }
            }
        }
        t.blockedOn = null
    }
    function Mo(t) {
        if (t.blockedOn !== null)
            return !1;
        for (var e = t.targetContainers; 0 < e.length; ) {
            var i = Cc(t.nativeEvent);
            if (i === null) {
                i = t.nativeEvent;
                var l = new i.constructor(i.type,i);
                Er = l,
                i.target.dispatchEvent(l),
                Er = null
            } else
                return e = Hi(i),
                e !== null && i0(e),
                t.blockedOn = i,
                !1;
            e.shift()
        }
        return !0
    }
    function o0(t, e, i) {
        Mo(t) && i.delete(e)
    }
    function f3() {
        Rc = !1,
        Zn !== null && Mo(Zn) && (Zn = null),
        Qn !== null && Mo(Qn) && (Qn = null),
        Fn !== null && Mo(Fn) && (Fn = null),
        zs.forEach(o0),
        Bs.forEach(o0)
    }
    function Eo(t, e) {
        t.blockedOn === e && (t.blockedOn = null,
        Rc || (Rc = !0,
        n.unstable_scheduleCallback(n.unstable_NormalPriority, f3)))
    }
    var _o = null;
    function r0(t) {
        _o !== t && (_o = t,
        n.unstable_scheduleCallback(n.unstable_NormalPriority, function() {
            _o === t && (_o = null);
            for (var e = 0; e < t.length; e += 3) {
                var i = t[e]
                  , l = t[e + 1]
                  , r = t[e + 2];
                if (typeof l != "function") {
                    if (xc(l || i) === null)
                        continue;
                    break
                }
                var c = Hi(i);
                c !== null && (t.splice(e, 3),
                e -= 3,
                xu(c, {
                    pending: !0,
                    data: r,
                    method: i.method,
                    action: l
                }, l, r))
            }
        }))
    }
    function Ns(t) {
        function e(x) {
            return Eo(x, t)
        }
        Zn !== null && Eo(Zn, t),
        Qn !== null && Eo(Qn, t),
        Fn !== null && Eo(Fn, t),
        zs.forEach(e),
        Bs.forEach(e);
        for (var i = 0; i < $n.length; i++) {
            var l = $n[i];
            l.blockedOn === t && (l.blockedOn = null)
        }
        for (; 0 < $n.length && (i = $n[0],
        i.blockedOn === null); )
            l0(i),
            i.blockedOn === null && $n.shift();
        if (i = (t.ownerDocument || t).$$reactFormReplay,
        i != null)
            for (l = 0; l < i.length; l += 3) {
                var r = i[l]
                  , c = i[l + 1]
                  , v = r[de] || null;
                if (typeof c == "function")
                    v || r0(i);
                else if (v) {
                    var b = null;
                    if (c && c.hasAttribute("formAction")) {
                        if (r = c,
                        v = c[de] || null)
                            b = v.formAction;
                        else if (xc(r) !== null)
                            continue
                    } else
                        b = v.action;
                    typeof b == "function" ? i[l + 1] = b : (i.splice(l, 3),
                    l -= 3),
                    r0(i)
                }
            }
    }
    function Mc(t) {
        this._internalRoot = t
    }
    Ao.prototype.render = Mc.prototype.render = function(t) {
        var e = this._internalRoot;
        if (e === null)
            throw Error(o(409));
        var i = e.current
          , l = Ee();
        e0(i, l, t, e, null, null)
    }
    ,
    Ao.prototype.unmount = Mc.prototype.unmount = function() {
        var t = this._internalRoot;
        if (t !== null) {
            this._internalRoot = null;
            var e = t.containerInfo;
            e0(t.current, 2, null, t, null, null),
            ro(),
            e[ji] = null
        }
    }
    ;
    function Ao(t) {
        this._internalRoot = t
    }
    Ao.prototype.unstable_scheduleHydration = function(t) {
        if (t) {
            var e = Mh();
            t = {
                blockedOn: null,
                target: t,
                priority: e
            };
            for (var i = 0; i < $n.length && e !== 0 && e < $n[i].priority; i++)
                ;
            $n.splice(i, 0, t),
            i === 0 && l0(t)
        }
    }
    ;
    var u0 = a.version;
    if (u0 !== "19.1.1")
        throw Error(o(527, u0, "19.1.1"));
    k.findDOMNode = function(t) {
        var e = t._reactInternals;
        if (e === void 0)
            throw typeof t.render == "function" ? Error(o(188)) : (t = Object.keys(t).join(","),
            Error(o(268, t)));
        return t = d(e),
        t = t !== null ? m(t) : null,
        t = t === null ? null : t.stateNode,
        t
    }
    ;
    var h3 = {
        bundleType: 0,
        version: "19.1.1",
        rendererPackageName: "react-dom",
        currentDispatcherRef: z,
        reconcilerVersion: "19.1.1"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
        var Do = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!Do.isDisabled && Do.supportsFiber)
            try {
                kt = Do.inject(h3),
                Ut = Do
            } catch {}
    }
    return Ps.createRoot = function(t, e) {
        if (!u(t))
            throw Error(o(299));
        var i = !1
          , l = ""
          , r = Mm
          , c = Em
          , v = _m
          , b = null;
        return e != null && (e.unstable_strictMode === !0 && (i = !0),
        e.identifierPrefix !== void 0 && (l = e.identifierPrefix),
        e.onUncaughtError !== void 0 && (r = e.onUncaughtError),
        e.onCaughtError !== void 0 && (c = e.onCaughtError),
        e.onRecoverableError !== void 0 && (v = e.onRecoverableError),
        e.unstable_transitionCallbacks !== void 0 && (b = e.unstable_transitionCallbacks)),
        e = Ip(t, 1, !1, null, null, i, l, r, c, v, b, null),
        t[ji] = e.current,
        oc(t),
        new Mc(e)
    }
    ,
    Ps.hydrateRoot = function(t, e, i) {
        if (!u(t))
            throw Error(o(299));
        var l = !1
          , r = ""
          , c = Mm
          , v = Em
          , b = _m
          , x = null
          , L = null;
        return i != null && (i.unstable_strictMode === !0 && (l = !0),
        i.identifierPrefix !== void 0 && (r = i.identifierPrefix),
        i.onUncaughtError !== void 0 && (c = i.onUncaughtError),
        i.onCaughtError !== void 0 && (v = i.onCaughtError),
        i.onRecoverableError !== void 0 && (b = i.onRecoverableError),
        i.unstable_transitionCallbacks !== void 0 && (x = i.unstable_transitionCallbacks),
        i.formState !== void 0 && (L = i.formState)),
        e = Ip(t, 1, !0, e, i ?? null, l, r, c, v, b, x, L),
        e.context = t0(null),
        i = e.current,
        l = Ee(),
        l = yr(l),
        r = wn(l),
        r.callback = null,
        zn(i, r, l),
        i = l,
        e.current.lanes = i,
        Ga(e, i),
        en(e),
        t[ji] = e.current,
        oc(t),
        new Ao(e)
    }
    ,
    Ps.version = "19.1.1",
    Ps
}
var S0;
function C3() {
    if (S0)
        return Ac.exports;
    S0 = 1;
    function n() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)
            } catch (a) {
                console.error(a)
            }
    }
    return n(),
    Ac.exports = T3(),
    Ac.exports
}
var x3 = C3()
  , R3 = "Invariant failed";
function En(n, a) {
    if (!n)
        throw new Error(R3)
}
const Da = new WeakMap
  , jo = new WeakMap
  , ko = {
    current: []
};
let Vc = !1
  , Ks = 0;
const ks = new Set
  , Lo = new Map;
function ey(n) {
    const a = Array.from(n).sort( (s, o) => s instanceof La && s.options.deps.includes(o) ? 1 : o instanceof La && o.options.deps.includes(s) ? -1 : 0);
    for (const s of a) {
        if (ko.current.includes(s))
            continue;
        ko.current.push(s),
        s.recompute();
        const o = jo.get(s);
        if (o)
            for (const u of o) {
                const f = Da.get(u);
                f && ey(f)
            }
    }
}
function M3(n) {
    n.listeners.forEach(a => a({
        prevVal: n.prevState,
        currentVal: n.state
    }))
}
function E3(n) {
    n.listeners.forEach(a => a({
        prevVal: n.prevState,
        currentVal: n.state
    }))
}
function ny(n) {
    if (Ks > 0 && !Lo.has(n) && Lo.set(n, n.prevState),
    ks.add(n),
    !(Ks > 0) && !Vc)
        try {
            for (Vc = !0; ks.size > 0; ) {
                const a = Array.from(ks);
                ks.clear();
                for (const s of a) {
                    const o = Lo.get(s) ?? s.prevState;
                    s.prevState = o,
                    M3(s)
                }
                for (const s of a) {
                    const o = Da.get(s);
                    o && (ko.current.push(s),
                    ey(o))
                }
                for (const s of a) {
                    const o = Da.get(s);
                    if (o)
                        for (const u of o)
                            E3(u)
                }
            }
        } finally {
            Vc = !1,
            ko.current = [],
            Lo.clear()
        }
}
function Zs(n) {
    Ks++;
    try {
        n()
    } finally {
        if (Ks--,
        Ks === 0) {
            const a = Array.from(ks)[0];
            a && ny(a)
        }
    }
}
function _3(n) {
    return typeof n == "function"
}
class sf {
    constructor(a, s) {
        this.listeners = new Set,
        this.subscribe = o => {
            var u, f;
            this.listeners.add(o);
            const h = (f = (u = this.options) == null ? void 0 : u.onSubscribe) == null ? void 0 : f.call(u, o, this);
            return () => {
                this.listeners.delete(o),
                h?.()
            }
        }
        ,
        this.prevState = a,
        this.state = a,
        this.options = s
    }
    setState(a) {
        var s, o, u;
        this.prevState = this.state,
        (s = this.options) != null && s.updateFn ? this.state = this.options.updateFn(this.prevState)(a) : _3(a) ? this.state = a(this.prevState) : this.state = a,
        (u = (o = this.options) == null ? void 0 : o.onUpdate) == null || u.call(o),
        ny(this)
    }
}
class La {
    constructor(a) {
        this.listeners = new Set,
        this._subscriptions = [],
        this.lastSeenDepValues = [],
        this.getDepVals = () => {
            const s = []
              , o = [];
            for (const u of this.options.deps)
                s.push(u.prevState),
                o.push(u.state);
            return this.lastSeenDepValues = o,
            {
                prevDepVals: s,
                currDepVals: o,
                prevVal: this.prevState ?? void 0
            }
        }
        ,
        this.recompute = () => {
            var s, o;
            this.prevState = this.state;
            const {prevDepVals: u, currDepVals: f, prevVal: h} = this.getDepVals();
            this.state = this.options.fn({
                prevDepVals: u,
                currDepVals: f,
                prevVal: h
            }),
            (o = (s = this.options).onUpdate) == null || o.call(s)
        }
        ,
        this.checkIfRecalculationNeededDeeply = () => {
            for (const f of this.options.deps)
                f instanceof La && f.checkIfRecalculationNeededDeeply();
            let s = !1;
            const o = this.lastSeenDepValues
              , {currDepVals: u} = this.getDepVals();
            for (let f = 0; f < u.length; f++)
                if (u[f] !== o[f]) {
                    s = !0;
                    break
                }
            s && this.recompute()
        }
        ,
        this.mount = () => (this.registerOnGraph(),
        this.checkIfRecalculationNeededDeeply(),
        () => {
            this.unregisterFromGraph();
            for (const s of this._subscriptions)
                s()
        }
        ),
        this.subscribe = s => {
            var o, u;
            this.listeners.add(s);
            const f = (u = (o = this.options).onSubscribe) == null ? void 0 : u.call(o, s, this);
            return () => {
                this.listeners.delete(s),
                f?.()
            }
        }
        ,
        this.options = a,
        this.state = a.fn({
            prevDepVals: void 0,
            prevVal: void 0,
            currDepVals: this.getDepVals().currDepVals
        })
    }
    registerOnGraph(a=this.options.deps) {
        for (const s of a)
            if (s instanceof La)
                s.registerOnGraph(),
                this.registerOnGraph(s.options.deps);
            else if (s instanceof sf) {
                let o = Da.get(s);
                o || (o = new Set,
                Da.set(s, o)),
                o.add(this);
                let u = jo.get(this);
                u || (u = new Set,
                jo.set(this, u)),
                u.add(s)
            }
    }
    unregisterFromGraph(a=this.options.deps) {
        for (const s of a)
            if (s instanceof La)
                this.unregisterFromGraph(s.options.deps);
            else if (s instanceof sf) {
                const o = Da.get(s);
                o && o.delete(this);
                const u = jo.get(this);
                u && u.delete(s)
            }
    }
}
const ti = "__TSR_index"
  , b0 = "popstate"
  , T0 = "beforeunload";
function iy(n) {
    let a = n.getLocation();
    const s = new Set
      , o = h => {
        a = n.getLocation(),
        s.forEach(p => p({
            location: a,
            action: h
        }))
    }
      , u = h => {
        n.notifyOnIndexChange ?? !0 ? o(h) : a = n.getLocation()
    }
      , f = async ({task: h, navigateOpts: p, ...d}) => {
        var m, y;
        if (p?.ignoreBlocker ?? !1) {
            h();
            return
        }
        const S = ((m = n.getBlockers) == null ? void 0 : m.call(n)) ?? []
          , T = d.type === "PUSH" || d.type === "REPLACE";
        if (typeof document < "u" && S.length && T)
            for (const C of S) {
                const E = el(d.path, d.state);
                if (await C.blockerFn({
                    currentLocation: a,
                    nextLocation: E,
                    action: d.type
                })) {
                    (y = n.onBlocked) == null || y.call(n);
                    return
                }
            }
        h()
    }
    ;
    return {
        get location() {
            return a
        },
        get length() {
            return n.getLength()
        },
        subscribers: s,
        subscribe: h => (s.add(h),
        () => {
            s.delete(h)
        }
        ),
        push: (h, p, d) => {
            const m = a.state[ti];
            p = lf(m + 1, p),
            f({
                task: () => {
                    n.pushState(h, p),
                    o({
                        type: "PUSH"
                    })
                }
                ,
                navigateOpts: d,
                type: "PUSH",
                path: h,
                state: p
            })
        }
        ,
        replace: (h, p, d) => {
            const m = a.state[ti];
            p = lf(m, p),
            f({
                task: () => {
                    n.replaceState(h, p),
                    o({
                        type: "REPLACE"
                    })
                }
                ,
                navigateOpts: d,
                type: "REPLACE",
                path: h,
                state: p
            })
        }
        ,
        go: (h, p) => {
            f({
                task: () => {
                    n.go(h),
                    u({
                        type: "GO",
                        index: h
                    })
                }
                ,
                navigateOpts: p,
                type: "GO"
            })
        }
        ,
        back: h => {
            f({
                task: () => {
                    n.back(h?.ignoreBlocker ?? !1),
                    u({
                        type: "BACK"
                    })
                }
                ,
                navigateOpts: h,
                type: "BACK"
            })
        }
        ,
        forward: h => {
            f({
                task: () => {
                    n.forward(h?.ignoreBlocker ?? !1),
                    u({
                        type: "FORWARD"
                    })
                }
                ,
                navigateOpts: h,
                type: "FORWARD"
            })
        }
        ,
        canGoBack: () => a.state[ti] !== 0,
        createHref: h => n.createHref(h),
        block: h => {
            var p;
            if (!n.setBlockers)
                return () => {}
                ;
            const d = ((p = n.getBlockers) == null ? void 0 : p.call(n)) ?? [];
            return n.setBlockers([...d, h]),
            () => {
                var m, y;
                const g = ((m = n.getBlockers) == null ? void 0 : m.call(n)) ?? [];
                (y = n.setBlockers) == null || y.call(n, g.filter(S => S !== h))
            }
        }
        ,
        flush: () => {
            var h;
            return (h = n.flush) == null ? void 0 : h.call(n)
        }
        ,
        destroy: () => {
            var h;
            return (h = n.destroy) == null ? void 0 : h.call(n)
        }
        ,
        notify: o
    }
}
function lf(n, a) {
    a || (a = {});
    const s = Of();
    return {
        ...a,
        key: s,
        __TSR_key: s,
        [ti]: n
    }
}
function A3(n) {
    var a, s;
    const o = typeof document < "u" ? window : void 0
      , u = o.history.pushState
      , f = o.history.replaceState;
    let h = [];
    const p = () => h
      , d = F => h = F
      , m = (F => F)
      , y = ( () => el(`${o.location.pathname}${o.location.search}${o.location.hash}`, o.history.state));
    if (!((a = o.history.state) != null && a.__TSR_key) && !((s = o.history.state) != null && s.key)) {
        const F = Of();
        o.history.replaceState({
            [ti]: 0,
            key: F,
            __TSR_key: F
        }, "")
    }
    let g = y(), S, T = !1, C = !1, E = !1, A = !1;
    const V = () => g;
    let q, B;
    const G = () => {
        q && (tt._ignoreSubscribers = !0,
        (q.isPush ? o.history.pushState : o.history.replaceState)(q.state, "", q.href),
        tt._ignoreSubscribers = !1,
        q = void 0,
        B = void 0,
        S = void 0)
    }
      , j = (F, rt, ft) => {
        const Gt = m(rt);
        B || (S = g),
        g = el(rt, ft),
        q = {
            href: Gt,
            state: ft,
            isPush: q?.isPush || F === "push"
        },
        B || (B = Promise.resolve().then( () => G()))
    }
      , Z = F => {
        g = y(),
        tt.notify({
            type: F
        })
    }
      , Q = async () => {
        if (C) {
            C = !1;
            return
        }
        const F = y()
          , rt = F.state[ti] - g.state[ti]
          , ft = rt === 1
          , Gt = rt === -1
          , _t = !ft && !Gt || T;
        T = !1;
        const Lt = _t ? "GO" : Gt ? "BACK" : "FORWARD"
          , z = _t ? {
            type: "GO",
            index: rt
        } : {
            type: Gt ? "BACK" : "FORWARD"
        };
        if (E)
            E = !1;
        else {
            const k = p();
            if (typeof document < "u" && k.length) {
                for (const W of k)
                    if (await W.blockerFn({
                        currentLocation: g,
                        nextLocation: F,
                        action: Lt
                    })) {
                        C = !0,
                        o.history.go(1),
                        tt.notify(z);
                        return
                    }
            }
        }
        g = y(),
        tt.notify(z)
    }
      , K = F => {
        if (A) {
            A = !1;
            return
        }
        let rt = !1;
        const ft = p();
        if (typeof document < "u" && ft.length)
            for (const Gt of ft) {
                const _t = Gt.enableBeforeUnload ?? !0;
                if (_t === !0) {
                    rt = !0;
                    break
                }
                if (typeof _t == "function" && _t() === !0) {
                    rt = !0;
                    break
                }
            }
        if (rt)
            return F.preventDefault(),
            F.returnValue = ""
    }
      , tt = iy({
        getLocation: V,
        getLength: () => o.history.length,
        pushState: (F, rt) => j("push", F, rt),
        replaceState: (F, rt) => j("replace", F, rt),
        back: F => (F && (E = !0),
        A = !0,
        o.history.back()),
        forward: F => {
            F && (E = !0),
            A = !0,
            o.history.forward()
        }
        ,
        go: F => {
            T = !0,
            o.history.go(F)
        }
        ,
        createHref: F => m(F),
        flush: G,
        destroy: () => {
            o.history.pushState = u,
            o.history.replaceState = f,
            o.removeEventListener(T0, K, {
                capture: !0
            }),
            o.removeEventListener(b0, Q)
        }
        ,
        onBlocked: () => {
            S && g !== S && (g = S)
        }
        ,
        getBlockers: p,
        setBlockers: d,
        notifyOnIndexChange: !1
    });
    return o.addEventListener(T0, K, {
        capture: !0
    }),
    o.addEventListener(b0, Q),
    o.history.pushState = function(...F) {
        const rt = u.apply(o.history, F);
        return tt._ignoreSubscribers || Z("PUSH"),
        rt
    }
    ,
    o.history.replaceState = function(...F) {
        const rt = f.apply(o.history, F);
        return tt._ignoreSubscribers || Z("REPLACE"),
        rt
    }
    ,
    tt
}
function D3(n={
    initialEntries: ["/"]
}) {
    const a = n.initialEntries;
    let s = n.initialIndex ? Math.min(Math.max(n.initialIndex, 0), a.length - 1) : a.length - 1;
    const o = a.map( (f, h) => lf(h, void 0));
    return iy({
        getLocation: () => el(a[s], o[s]),
        getLength: () => a.length,
        pushState: (f, h) => {
            s < a.length - 1 && (a.splice(s + 1),
            o.splice(s + 1)),
            o.push(h),
            a.push(f),
            s = Math.max(a.length - 1, 0)
        }
        ,
        replaceState: (f, h) => {
            o[s] = h,
            a[s] = f
        }
        ,
        back: () => {
            s = Math.max(s - 1, 0)
        }
        ,
        forward: () => {
            s = Math.min(s + 1, a.length - 1)
        }
        ,
        go: f => {
            s = Math.min(Math.max(s + f, 0), a.length - 1)
        }
        ,
        createHref: f => f
    })
}
function el(n, a) {
    const s = n.indexOf("#")
      , o = n.indexOf("?")
      , u = Of();
    return {
        href: n,
        pathname: n.substring(0, s > 0 ? o > 0 ? Math.min(s, o) : s : o > 0 ? o : n.length),
        hash: s > -1 ? n.substring(s) : "",
        search: o > -1 ? n.slice(o, s === -1 ? void 0 : s) : "",
        state: a || {
            [ti]: 0,
            key: u,
            __TSR_key: u
        }
    }
}
function Of() {
    return (Math.random() + 1).toString(36).substring(7)
}
function Xo(n) {
    return n[n.length - 1]
}
function L3(n) {
    return typeof n == "function"
}
function Li(n, a) {
    return L3(n) ? n(a) : n
}
function Pe(n, a) {
    if (n === a)
        return n;
    const s = a
      , o = R0(n) && R0(s)
      , u = !o && Ko(n) && Ko(s);
    if (!o && !u)
        return s;
    const f = o ? n : C0(n);
    if (!f)
        return s;
    const h = o ? s : C0(s);
    if (!h)
        return s;
    const p = f.length
      , d = h.length
      , m = o ? new Array(d) : {};
    let y = 0;
    for (let g = 0; g < d; g++) {
        const S = o ? g : h[g]
          , T = n[S];
        if ((o || n.hasOwnProperty(S)) && T === void 0 && s[S] === void 0)
            m[S] = void 0,
            y++;
        else {
            const C = Pe(T, s[S]);
            m[S] = C,
            C === T && T !== void 0 && y++
        }
    }
    return p === d && y === p ? n : m
}
function C0(n) {
    const a = []
      , s = Object.getOwnPropertyNames(n);
    for (const u of s) {
        if (!Object.prototype.propertyIsEnumerable.call(n, u))
            return !1;
        a.push(u)
    }
    const o = Object.getOwnPropertySymbols(n);
    for (const u of o) {
        if (!Object.prototype.propertyIsEnumerable.call(n, u))
            return !1;
        a.push(u)
    }
    return a
}
function Ko(n) {
    if (!x0(n))
        return !1;
    const a = n.constructor;
    if (typeof a > "u")
        return !0;
    const s = a.prototype;
    return !(!x0(s) || !s.hasOwnProperty("isPrototypeOf"))
}
function x0(n) {
    return Object.prototype.toString.call(n) === "[object Object]"
}
function R0(n) {
    return Array.isArray(n) && n.length === Object.keys(n).length
}
function Oi(n, a, s) {
    if (n === a)
        return !0;
    if (typeof n != typeof a)
        return !1;
    if (Array.isArray(n) && Array.isArray(a)) {
        if (n.length !== a.length)
            return !1;
        for (let o = 0, u = n.length; o < u; o++)
            if (!Oi(n[o], a[o], s))
                return !1;
        return !0
    }
    if (Ko(n) && Ko(a)) {
        const o = s?.ignoreUndefined ?? !0;
        if (s?.partial) {
            for (const h in a)
                if ((!o || a[h] !== void 0) && !Oi(n[h], a[h], s))
                    return !1;
            return !0
        }
        let u = 0;
        if (!o)
            u = Object.keys(n).length;
        else
            for (const h in n)
                n[h] !== void 0 && u++;
        let f = 0;
        for (const h in a)
            if ((!o || a[h] !== void 0) && (f++,
            f > u || !Oi(n[h], a[h], s)))
                return !1;
        return u === f
    }
    return !1
}
function Va(n) {
    let a, s;
    const o = new Promise( (u, f) => {
        a = u,
        s = f
    }
    );
    return o.status = "pending",
    o.resolve = u => {
        o.status = "resolved",
        o.value = u,
        a(u),
        n?.(u)
    }
    ,
    o.reject = u => {
        o.status = "rejected",
        s(u)
    }
    ,
    o
}
function O3(n) {
    return typeof n?.message != "string" ? !1 : n.message.startsWith("Failed to fetch dynamically imported module") || n.message.startsWith("error loading dynamically imported module") || n.message.startsWith("Importing a module script failed")
}
function ei(n) {
    return !!(n && typeof n == "object" && typeof n.then == "function")
}
const Rn = 0
  , Bi = 1
  , Ui = 2
  , wa = 3;
function Mn(n) {
    return Vf(n.filter(a => a !== void 0).join("/"))
}
function Vf(n) {
    return n.replace(/\/{2,}/g, "/")
}
function wf(n) {
    return n === "/" ? n : n.replace(/^\/{1,}/, "")
}
function za(n) {
    return n === "/" ? n : n.replace(/\/{1,}$/, "")
}
function wc(n) {
    return za(wf(n))
}
function Zo(n, a) {
    return n?.endsWith("/") && n !== "/" && n !== `${a}/` ? n.slice(0, -1) : n
}
function V3(n, a, s) {
    return Zo(n, s) === Zo(a, s)
}
function w3(n) {
    const {type: a, value: s} = n;
    if (a === Rn)
        return s;
    const {prefixSegment: o, suffixSegment: u} = n;
    if (a === Bi) {
        const f = s.substring(1);
        if (o && u)
            return `${o}{$${f}}${u}`;
        if (o)
            return `${o}{$${f}}`;
        if (u)
            return `{$${f}}${u}`
    }
    if (a === wa) {
        const f = s.substring(1);
        return o && u ? `${o}{-$${f}}${u}` : o ? `${o}{-$${f}}` : u ? `{-$${f}}${u}` : `{-$${f}}`
    }
    if (a === Ui) {
        if (o && u)
            return `${o}{$}${u}`;
        if (o)
            return `${o}{$}`;
        if (u)
            return `{$}${u}`
    }
    return s
}
function z3({basepath: n, base: a, to: s, trailingSlash: o="never", caseSensitive: u, parseCache: f}) {
    var h;
    a = Qo(n, a, u),
    s = Qo(n, s, u);
    let p = Ba(a, f).slice();
    const d = Ba(s, f);
    p.length > 1 && ((h = Xo(p)) == null ? void 0 : h.value) === "/" && p.pop();
    for (let g = 0, S = d.length; g < S; g++) {
        const T = d[g]
          , C = T.value;
        C === "/" ? g ? g === S - 1 && p.push(T) : p = [T] : C === ".." ? p.pop() : C === "." || p.push(T)
    }
    p.length > 1 && (Xo(p).value === "/" ? o === "never" && p.pop() : o === "always" && p.push({
        type: Rn,
        value: "/"
    }));
    const m = p.map(w3);
    return Mn([n, ...m])
}
const Ba = (n, a) => {
    if (!n)
        return [];
    const s = a?.get(n);
    if (s)
        return s;
    const o = H3(n);
    return a?.set(n, o),
    o
}
  , B3 = /^\$.{1,}$/
  , U3 = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/
  , N3 = /^(.*?)\{-(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/
  , j3 = /^\$$/
  , P3 = /^(.*?)\{\$\}(.*)$/;
function H3(n) {
    n = Vf(n);
    const a = [];
    if (n.slice(0, 1) === "/" && (n = n.substring(1),
    a.push({
        type: Rn,
        value: "/"
    })),
    !n)
        return a;
    const s = n.split("/").filter(Boolean);
    return a.push(...s.map(o => {
        const u = o.match(P3);
        if (u) {
            const p = u[1]
              , d = u[2];
            return {
                type: Ui,
                value: "$",
                prefixSegment: p || void 0,
                suffixSegment: d || void 0
            }
        }
        const f = o.match(N3);
        if (f) {
            const p = f[1]
              , d = f[2]
              , m = f[3];
            return {
                type: wa,
                value: d,
                prefixSegment: p || void 0,
                suffixSegment: m || void 0
            }
        }
        const h = o.match(U3);
        if (h) {
            const p = h[1]
              , d = h[2]
              , m = h[3];
            return {
                type: Bi,
                value: "" + d,
                prefixSegment: p || void 0,
                suffixSegment: m || void 0
            }
        }
        if (B3.test(o)) {
            const p = o.substring(1);
            return {
                type: Bi,
                value: "$" + p,
                prefixSegment: void 0,
                suffixSegment: void 0
            }
        }
        return j3.test(o) ? {
            type: Ui,
            value: "$",
            prefixSegment: void 0,
            suffixSegment: void 0
        } : {
            type: Rn,
            value: o.includes("%25") ? o.split("%25").map(p => decodeURI(p)).join("%25") : decodeURI(o)
        }
    }
    )),
    n.slice(-1) === "/" && (n = n.substring(1),
    a.push({
        type: Rn,
        value: "/"
    })),
    a
}
function Oo({path: n, params: a, leaveWildcards: s, leaveParams: o, decodeCharMap: u, parseCache: f}) {
    const h = Ba(n, f);
    function p(g) {
        const S = a[g]
          , T = typeof S == "string";
        return g === "*" || g === "_splat" ? T ? encodeURI(S) : S : T ? q3(S, u) : S
    }
    let d = !1;
    const m = {}
      , y = Mn(h.map(g => {
        if (g.type === Rn)
            return g.value;
        if (g.type === Ui) {
            m._splat = a._splat;
            const S = g.prefixSegment || ""
              , T = g.suffixSegment || "";
            if (!("_splat" in a))
                return d = !0,
                s ? `${S}${g.value}${T}` : S || T ? `${S}${T}` : void 0;
            const C = p("_splat");
            return s ? `${S}${g.value}${C ?? ""}${T}` : `${S}${C}${T}`
        }
        if (g.type === Bi) {
            const S = g.value.substring(1);
            !d && !(S in a) && (d = !0),
            m[S] = a[S];
            const T = g.prefixSegment || ""
              , C = g.suffixSegment || "";
            if (o) {
                const E = p(g.value);
                return `${T}${g.value}${E ?? ""}${C}`
            }
            return `${T}${p(S) ?? "undefined"}${C}`
        }
        if (g.type === wa) {
            const S = g.value.substring(1)
              , T = g.prefixSegment || ""
              , C = g.suffixSegment || "";
            if (!(S in a) || a[S] == null)
                return s ? `${T}${S}${C}` : T || C ? `${T}${C}` : void 0;
            if (m[S] = a[S],
            o) {
                const E = p(g.value);
                return `${T}${g.value}${E ?? ""}${C}`
            }
            return s ? `${T}${S}${p(S) ?? ""}${C}` : `${T}${p(S) ?? ""}${C}`
        }
        return g.value
    }
    ));
    return {
        usedParams: m,
        interpolatedPath: y,
        isMissingParams: d
    }
}
function q3(n, a) {
    let s = encodeURIComponent(n);
    if (a)
        for (const [o,u] of a)
            s = s.replaceAll(o, u);
    return s
}
function of(n, a, s, o) {
    const u = Y3(n, a, s, o);
    if (!(s.to && !u))
        return u ?? {}
}
function Qo(n, a, s=!1) {
    const o = s ? n : n.toLowerCase()
      , u = s ? a : a.toLowerCase();
    switch (!0) {
    case o === "/":
        return a;
    case u === o:
        return "";
    case a.length < n.length:
        return a;
    case u[o.length] !== "/":
        return a;
    case u.startsWith(o):
        return a.slice(n.length);
    default:
        return a
    }
}
function Y3(n, a, {to: s, fuzzy: o, caseSensitive: u}, f) {
    if (n !== "/" && !a.startsWith(n))
        return;
    a = Qo(n, a, u),
    s = Qo(n, `${s ?? "$"}`, u);
    const h = Ba(a.startsWith("/") ? a : `/${a}`, f)
      , p = Ba(s.startsWith("/") ? s : `/${s}`, f)
      , d = {};
    return G3(h, p, d, o, u) ? d : void 0
}
function G3(n, a, s, o, u) {
    var f, h, p;
    let d = 0
      , m = 0;
    for (; d < n.length || m < a.length; ) {
        const y = n[d]
          , g = a[m];
        if (g) {
            if (g.type === Ui) {
                const S = n.slice(d);
                let T;
                if (g.prefixSegment || g.suffixSegment) {
                    if (!y)
                        return !1;
                    const C = g.prefixSegment || ""
                      , E = g.suffixSegment || ""
                      , A = y.value;
                    if ("prefixSegment" in g && !A.startsWith(C) || "suffixSegment" in g && !((f = n[n.length - 1]) != null && f.value.endsWith(E)))
                        return !1;
                    let V = decodeURI(Mn(S.map(q => q.value)));
                    C && V.startsWith(C) && (V = V.slice(C.length)),
                    E && V.endsWith(E) && (V = V.slice(0, V.length - E.length)),
                    T = V
                } else
                    T = decodeURI(Mn(S.map(C => C.value)));
                return s["*"] = T,
                s._splat = T,
                !0
            }
            if (g.type === Rn) {
                if (g.value === "/" && !y?.value) {
                    m++;
                    continue
                }
                if (y) {
                    if (u) {
                        if (g.value !== y.value)
                            return !1
                    } else if (g.value.toLowerCase() !== y.value.toLowerCase())
                        return !1;
                    d++,
                    m++;
                    continue
                } else
                    return !1
            }
            if (g.type === Bi) {
                if (!y || y.value === "/")
                    return !1;
                let S = ""
                  , T = !1;
                if (g.prefixSegment || g.suffixSegment) {
                    const C = g.prefixSegment || ""
                      , E = g.suffixSegment || ""
                      , A = y.value;
                    if (C && !A.startsWith(C) || E && !A.endsWith(E))
                        return !1;
                    let V = A;
                    C && V.startsWith(C) && (V = V.slice(C.length)),
                    E && V.endsWith(E) && (V = V.slice(0, V.length - E.length)),
                    S = decodeURIComponent(V),
                    T = !0
                } else
                    S = decodeURIComponent(y.value),
                    T = !0;
                T && (s[g.value.substring(1)] = S,
                d++),
                m++;
                continue
            }
            if (g.type === wa) {
                if (!y) {
                    m++;
                    continue
                }
                if (y.value === "/") {
                    m++;
                    continue
                }
                let S = ""
                  , T = !1;
                if (g.prefixSegment || g.suffixSegment) {
                    const C = g.prefixSegment || ""
                      , E = g.suffixSegment || ""
                      , A = y.value;
                    if ((!C || A.startsWith(C)) && (!E || A.endsWith(E))) {
                        let V = A;
                        C && V.startsWith(C) && (V = V.slice(C.length)),
                        E && V.endsWith(E) && (V = V.slice(0, V.length - E.length)),
                        S = decodeURIComponent(V),
                        T = !0
                    }
                } else {
                    let C = !0;
                    for (let E = m + 1; E < a.length; E++) {
                        const A = a[E];
                        if (A?.type === Rn && A.value === y.value) {
                            C = !1;
                            break
                        }
                        if (A?.type === Bi || A?.type === Ui) {
                            n.length < a.length && (C = !1);
                            break
                        }
                    }
                    C && (S = decodeURIComponent(y.value),
                    T = !0)
                }
                T && (s[g.value.substring(1)] = S,
                d++),
                m++;
                continue
            }
        }
        if (d < n.length && m >= a.length)
            return s["**"] = Mn(n.slice(d).map(S => S.value)),
            !!o && ((h = a[a.length - 1]) == null ? void 0 : h.value) !== "/";
        if (m < a.length && d >= n.length) {
            for (let S = m; S < a.length; S++)
                if (((p = a[S]) == null ? void 0 : p.type) !== wa)
                    return !1;
            break
        }
        break
    }
    return !0
}
function ln(n) {
    return !!n?.isNotFound
}
function k3() {
    try {
        if (typeof window < "u" && typeof window.sessionStorage == "object")
            return window.sessionStorage
    } catch {}
}
const Fo = "tsr-scroll-restoration-v1_3"
  , X3 = (n, a) => {
    let s;
    return (...o) => {
        s || (s = setTimeout( () => {
            n(...o),
            s = null
        }
        , a))
    }
}
;
function K3() {
    const n = k3();
    if (!n)
        return;
    const a = n.getItem(Fo);
    let s = a ? JSON.parse(a) : {};
    return {
        state: s,
        set: o => (s = Li(o, s) || s,
        n.setItem(Fo, JSON.stringify(s)))
    }
}
const zc = K3()
  , rf = n => n.state.__TSR_key || n.href;
function Z3(n) {
    const a = [];
    let s;
    for (; s = n.parentNode; )
        a.push(`${n.tagName}:nth-child(${Array.prototype.indexOf.call(s.children, n) + 1})`),
        n = s;
    return `${a.reverse().join(" > ")}`.toLowerCase()
}
let $o = !1;
function ay({storageKey: n, key: a, behavior: s, shouldScrollRestoration: o, scrollToTopSelectors: u, location: f}) {
    var h, p;
    let d;
    try {
        d = JSON.parse(sessionStorage.getItem(n) || "{}")
    } catch (g) {
        console.error(g);
        return
    }
    const m = a || ((h = window.history.state) == null ? void 0 : h.key)
      , y = d[m];
    $o = !0;
    t: {
        if (o && y && Object.keys(y).length > 0) {
            for (const T in y) {
                const C = y[T];
                if (T === "window")
                    window.scrollTo({
                        top: C.scrollY,
                        left: C.scrollX,
                        behavior: s
                    });
                else if (T) {
                    const E = document.querySelector(T);
                    E && (E.scrollLeft = C.scrollX,
                    E.scrollTop = C.scrollY)
                }
            }
            break t
        }
        const g = (f ?? window.location).hash.split("#", 2)[1];
        if (g) {
            const T = ((p = window.history.state) == null ? void 0 : p.__hashScrollIntoViewOptions) ?? !0;
            if (T) {
                const C = document.getElementById(g);
                C && C.scrollIntoView(T)
            }
            break t
        }
        const S = {
            top: 0,
            left: 0,
            behavior: s
        };
        if (window.scrollTo(S),
        u)
            for (const T of u) {
                if (T === "window")
                    continue;
                const C = typeof T == "function" ? T() : document.querySelector(T);
                C && C.scrollTo(S)
            }
    }
    $o = !1
}
function Q3(n, a) {
    if (zc === void 0 || ((n.options.scrollRestoration ?? !1) && (n.isScrollRestoring = !0),
    typeof document > "u" || n.isScrollRestorationSetup))
        return;
    n.isScrollRestorationSetup = !0,
    $o = !1;
    const o = n.options.getScrollRestorationKey || rf;
    window.history.scrollRestoration = "manual";
    const u = f => {
        if ($o || !n.isScrollRestoring)
            return;
        let h = "";
        if (f.target === document || f.target === window)
            h = "window";
        else {
            const d = f.target.getAttribute("data-scroll-restoration-id");
            d ? h = `[data-scroll-restoration-id="${d}"]` : h = Z3(f.target)
        }
        const p = o(n.state.location);
        zc.set(d => {
            const m = d[p] || (d[p] = {})
              , y = m[h] || (m[h] = {});
            if (h === "window")
                y.scrollX = window.scrollX || 0,
                y.scrollY = window.scrollY || 0;
            else if (h) {
                const g = document.querySelector(h);
                g && (y.scrollX = g.scrollLeft || 0,
                y.scrollY = g.scrollTop || 0)
            }
            return d
        }
        )
    }
    ;
    typeof document < "u" && document.addEventListener("scroll", X3(u, 100), !0),
    n.subscribe("onRendered", f => {
        const h = o(f.toLocation);
        if (!n.resetNextScroll) {
            n.resetNextScroll = !0;
            return
        }
        ay({
            storageKey: Fo,
            key: h,
            behavior: n.options.scrollRestorationBehavior,
            shouldScrollRestoration: n.isScrollRestoring,
            scrollToTopSelectors: n.options.scrollToTopSelectors,
            location: n.history.location
        }),
        n.isScrollRestoring && zc.set(p => (p[h] || (p[h] = {}),
        p))
    }
    )
}
function F3(n) {
    if (typeof document < "u" && document.querySelector) {
        const a = n.state.location.state.__hashScrollIntoViewOptions ?? !0;
        if (a && n.state.location.hash !== "") {
            const s = document.getElementById(n.state.location.hash);
            s && s.scrollIntoView(a)
        }
    }
}
function $3(n, a=String) {
    const s = new URLSearchParams;
    for (const o in n) {
        const u = n[o];
        u !== void 0 && s.set(o, a(u))
    }
    return s.toString()
}
function Bc(n) {
    return n ? n === "false" ? !1 : n === "true" ? !0 : +n * 0 === 0 && +n + "" === n ? +n : n : ""
}
function J3(n) {
    const a = new URLSearchParams(n)
      , s = {};
    for (const [o,u] of a.entries()) {
        const f = s[o];
        f == null ? s[o] = Bc(u) : Array.isArray(f) ? f.push(Bc(u)) : s[o] = [f, Bc(u)]
    }
    return s
}
const W3 = t4(JSON.parse)
  , I3 = e4(JSON.stringify, JSON.parse);
function t4(n) {
    return a => {
        a[0] === "?" && (a = a.substring(1));
        const s = J3(a);
        for (const o in s) {
            const u = s[o];
            if (typeof u == "string")
                try {
                    s[o] = n(u)
                } catch {}
        }
        return s
    }
}
function e4(n, a) {
    const s = typeof a == "function";
    function o(u) {
        if (typeof u == "object" && u !== null)
            try {
                return n(u)
            } catch {}
        else if (s && typeof u == "string")
            try {
                return a(u),
                n(u)
            } catch {}
        return u
    }
    return u => {
        const f = $3(u, o);
        return f ? `?${f}` : ""
    }
}
const qe = "__root__";
function n4(n) {
    if (n.statusCode = n.statusCode || n.code || 307,
    !n.reloadDocument && typeof n.href == "string")
        try {
            new URL(n.href),
            n.reloadDocument = !0
        } catch {}
    const a = new Headers(n.headers || {});
    n.href && a.get("Location") === null && a.set("Location", n.href);
    const s = new Response(null,{
        status: n.statusCode,
        headers: a
    });
    if (s.options = n,
    n.throw)
        throw s;
    return s
}
function nn(n) {
    return n instanceof Response && !!n.options
}
function i4(n) {
    const a = new Map;
    let s, o;
    const u = f => {
        f.next && (f.prev ? (f.prev.next = f.next,
        f.next.prev = f.prev,
        f.next = void 0,
        o && (o.next = f,
        f.prev = o)) : (f.next.prev = void 0,
        s = f.next,
        f.next = void 0,
        o && (f.prev = o,
        o.next = f)),
        o = f)
    }
    ;
    return {
        get(f) {
            const h = a.get(f);
            if (h)
                return u(h),
                h.value
        },
        set(f, h) {
            if (a.size >= n && s) {
                const d = s;
                a.delete(d.key),
                d.next && (s = d.next,
                d.next.prev = void 0),
                d === o && (o = void 0)
            }
            const p = a.get(f);
            if (p)
                p.value = h,
                u(p);
            else {
                const d = {
                    key: f,
                    value: h,
                    prev: o
                };
                o && (o.next = d),
                o = d,
                s || (s = d),
                a.set(f, d)
            }
        }
    }
}
const Po = n => {
    var a;
    if (!n.rendered)
        return n.rendered = !0,
        (a = n.onReady) == null ? void 0 : a.call(n)
}
  , sr = (n, a) => !!(n.preload && !n.router.state.matches.some(s => s.id === a))
  , sy = (n, a) => {
    var s;
    const o = n.router.routesById[a.routeId ?? ""] ?? n.router.routeTree;
    !o.options.notFoundComponent && ((s = n.router.options) != null && s.defaultNotFoundComponent) && (o.options.notFoundComponent = n.router.options.defaultNotFoundComponent),
    En(o.options.notFoundComponent);
    const u = n.matches.find(f => f.routeId === o.id);
    En(u, "Could not find match for route: " + o.id),
    n.updateMatch(u.id, f => ({
        ...f,
        status: "notFound",
        error: a,
        isFetching: !1
    })),
    a.routerCode === "BEFORE_LOAD" && o.parentRoute && (a.routeId = o.parentRoute.id,
    sy(n, a))
}
  , In = (n, a, s) => {
    var o, u, f;
    if (!(!nn(s) && !ln(s))) {
        if (nn(s) && s.redirectHandled && !s.options.reloadDocument)
            throw s;
        if (a) {
            (o = a._nonReactive.beforeLoadPromise) == null || o.resolve(),
            (u = a._nonReactive.loaderPromise) == null || u.resolve(),
            a._nonReactive.beforeLoadPromise = void 0,
            a._nonReactive.loaderPromise = void 0;
            const h = nn(s) ? "redirected" : "notFound";
            n.updateMatch(a.id, p => ({
                ...p,
                status: h,
                isFetching: !1,
                error: s
            })),
            ln(s) && !s.routeId && (s.routeId = a.routeId),
            (f = a._nonReactive.loadPromise) == null || f.resolve()
        }
        throw nn(s) ? (n.rendered = !0,
        s.options._fromLocation = n.location,
        s.redirectHandled = !0,
        s = n.router.resolveRedirect(s),
        s) : (sy(n, s),
        s)
    }
}
  , ly = (n, a) => {
    const s = n.router.getMatch(a);
    return !!(!n.router.isServer && s._nonReactive.dehydrated || n.router.isServer && s.ssr === !1)
}
  , Hs = (n, a, s, o) => {
    var u, f;
    const {id: h, routeId: p} = n.matches[a]
      , d = n.router.looseRoutesById[p];
    if (s instanceof Promise)
        throw s;
    s.routerCode = o,
    n.firstBadMatchIndex ?? (n.firstBadMatchIndex = a),
    In(n, n.router.getMatch(h), s);
    try {
        (f = (u = d.options).onError) == null || f.call(u, s)
    } catch (m) {
        s = m,
        In(n, n.router.getMatch(h), s)
    }
    n.updateMatch(h, m => {
        var y, g;
        return (y = m._nonReactive.beforeLoadPromise) == null || y.resolve(),
        m._nonReactive.beforeLoadPromise = void 0,
        (g = m._nonReactive.loadPromise) == null || g.resolve(),
        {
            ...m,
            error: s,
            status: "error",
            isFetching: !1,
            updatedAt: Date.now(),
            abortController: new AbortController
        }
    }
    )
}
  , a4 = (n, a, s, o) => {
    var u;
    const f = n.router.getMatch(a)
      , h = (u = n.matches[s - 1]) == null ? void 0 : u.id
      , p = h ? n.router.getMatch(h) : void 0;
    if (n.router.isShell()) {
        f.ssr = a === qe;
        return
    }
    if (p?.ssr === !1) {
        f.ssr = !1;
        return
    }
    const d = C => C === !0 && p?.ssr === "data-only" ? "data-only" : C
      , m = n.router.options.defaultSsr ?? !0;
    if (o.options.ssr === void 0) {
        f.ssr = d(m);
        return
    }
    if (typeof o.options.ssr != "function") {
        f.ssr = d(o.options.ssr);
        return
    }
    const {search: y, params: g} = f
      , S = {
        search: Vo(y, f.searchError),
        params: Vo(g, f.paramsError),
        location: n.location,
        matches: n.matches.map(C => ({
            index: C.index,
            pathname: C.pathname,
            fullPath: C.fullPath,
            staticData: C.staticData,
            id: C.id,
            routeId: C.routeId,
            search: Vo(C.search, C.searchError),
            params: Vo(C.params, C.paramsError),
            ssr: C.ssr
        }))
    }
      , T = o.options.ssr(S);
    if (ei(T))
        return T.then(C => {
            f.ssr = d(C ?? m)
        }
        );
    f.ssr = d(T ?? m)
}
  , oy = (n, a, s, o) => {
    var u;
    if (o._nonReactive.pendingTimeout !== void 0)
        return;
    const f = s.options.pendingMs ?? n.router.options.defaultPendingMs;
    if (!!(n.onReady && !n.router.isServer && !sr(n, a) && (s.options.loader || s.options.beforeLoad || cy(s)) && typeof f == "number" && f !== 1 / 0 && (s.options.pendingComponent ?? ((u = n.router.options) == null ? void 0 : u.defaultPendingComponent)))) {
        const p = setTimeout( () => {
            Po(n)
        }
        , f);
        o._nonReactive.pendingTimeout = p
    }
}
  , s4 = (n, a, s) => {
    const o = n.router.getMatch(a);
    if (!o._nonReactive.beforeLoadPromise && !o._nonReactive.loaderPromise)
        return;
    oy(n, a, s, o);
    const u = () => {
        const f = n.router.getMatch(a);
        f.preload && (f.status === "redirected" || f.status === "notFound") && In(n, f, f.error)
    }
    ;
    return o._nonReactive.beforeLoadPromise ? o._nonReactive.beforeLoadPromise.then(u) : u()
}
  , l4 = (n, a, s, o) => {
    var u;
    const f = n.router.getMatch(a)
      , h = f._nonReactive.loadPromise;
    f._nonReactive.loadPromise = Va( () => {
        h?.resolve()
    }
    );
    const {paramsError: p, searchError: d} = f;
    p && Hs(n, s, p, "PARSE_PARAMS"),
    d && Hs(n, s, d, "VALIDATE_SEARCH"),
    oy(n, a, o, f);
    const m = new AbortController
      , y = (u = n.matches[s - 1]) == null ? void 0 : u.id
      , g = y ? n.router.getMatch(y) : void 0
      , T = {
        ...g?.context ?? n.router.options.context ?? void 0,
        ...f.__routeContext
    };
    let C = !1;
    const E = () => {
        C || (C = !0,
        n.updateMatch(a, K => ({
            ...K,
            isFetching: "beforeLoad",
            fetchCount: K.fetchCount + 1,
            abortController: m,
            context: T
        })))
    }
      , A = () => {
        var K;
        (K = f._nonReactive.beforeLoadPromise) == null || K.resolve(),
        f._nonReactive.beforeLoadPromise = void 0,
        n.updateMatch(a, tt => ({
            ...tt,
            isFetching: !1
        }))
    }
    ;
    if (!o.options.beforeLoad) {
        Zs( () => {
            E(),
            A()
        }
        );
        return
    }
    f._nonReactive.beforeLoadPromise = Va();
    const {search: V, params: q, cause: B} = f
      , G = sr(n, a)
      , j = {
        search: V,
        abortController: m,
        params: q,
        preload: G,
        context: T,
        location: n.location,
        navigate: K => n.router.navigate({
            ...K,
            _fromLocation: n.location
        }),
        buildLocation: n.router.buildLocation,
        cause: G ? "preload" : B,
        matches: n.matches
    }
      , Z = K => {
        if (K === void 0) {
            Zs( () => {
                E(),
                A()
            }
            );
            return
        }
        (nn(K) || ln(K)) && (E(),
        Hs(n, s, K, "BEFORE_LOAD")),
        Zs( () => {
            E(),
            n.updateMatch(a, tt => ({
                ...tt,
                __beforeLoadContext: K,
                context: {
                    ...tt.context,
                    ...K
                }
            })),
            A()
        }
        )
    }
    ;
    let Q;
    try {
        if (Q = o.options.beforeLoad(j),
        ei(Q))
            return E(),
            Q.catch(K => {
                Hs(n, s, K, "BEFORE_LOAD")
            }
            ).then(Z)
    } catch (K) {
        E(),
        Hs(n, s, K, "BEFORE_LOAD")
    }
    Z(Q)
}
  , o4 = (n, a) => {
    const {id: s, routeId: o} = n.matches[a]
      , u = n.router.looseRoutesById[o]
      , f = () => {
        if (n.router.isServer) {
            const d = a4(n, s, a, u);
            if (ei(d))
                return d.then(h)
        }
        return h()
    }
      , h = () => {
        if (ly(n, s))
            return;
        const d = s4(n, s, u);
        return ei(d) ? d.then(p) : p()
    }
      , p = () => l4(n, s, a, u);
    return f()
}
  , Qs = (n, a, s) => {
    var o, u, f, h, p, d;
    const m = n.router.getMatch(a);
    if (!m || !s.options.head && !s.options.scripts && !s.options.headers)
        return;
    const y = {
        matches: n.matches,
        match: m,
        params: m.params,
        loaderData: m.loaderData
    };
    return Promise.all([(u = (o = s.options).head) == null ? void 0 : u.call(o, y), (h = (f = s.options).scripts) == null ? void 0 : h.call(f, y), (d = (p = s.options).headers) == null ? void 0 : d.call(p, y)]).then( ([g,S,T]) => {
        const C = g?.meta
          , E = g?.links
          , A = g?.scripts
          , V = g?.styles;
        return {
            meta: C,
            links: E,
            headScripts: A,
            headers: T,
            scripts: S,
            styles: V
        }
    }
    )
}
  , ry = (n, a, s, o) => {
    const u = n.matchPromises[s - 1]
      , {params: f, loaderDeps: h, abortController: p, context: d, cause: m} = n.router.getMatch(a)
      , y = sr(n, a);
    return {
        params: f,
        deps: h,
        preload: !!y,
        parentMatchPromise: u,
        abortController: p,
        context: d,
        location: n.location,
        navigate: g => n.router.navigate({
            ...g,
            _fromLocation: n.location
        }),
        cause: y ? "preload" : m,
        route: o
    }
}
  , M0 = async (n, a, s, o) => {
    var u, f, h, p;
    try {
        const d = n.router.getMatch(a);
        try {
            (!n.router.isServer || d.ssr === !0) && uy(o);
            const m = (f = (u = o.options).loader) == null ? void 0 : f.call(u, ry(n, a, s, o))
              , y = o.options.loader && ei(m);
            if (!!(y || o._lazyPromise || o._componentsPromise || o.options.head || o.options.scripts || o.options.headers || d._nonReactive.minPendingPromise) && n.updateMatch(a, E => ({
                ...E,
                isFetching: "loader"
            })),
            o.options.loader) {
                const E = y ? await m : m;
                In(n, n.router.getMatch(a), E),
                E !== void 0 && n.updateMatch(a, A => ({
                    ...A,
                    loaderData: E
                }))
            }
            o._lazyPromise && await o._lazyPromise;
            const S = Qs(n, a, o)
              , T = S ? await S : void 0
              , C = d._nonReactive.minPendingPromise;
            C && await C,
            o._componentsPromise && await o._componentsPromise,
            n.updateMatch(a, E => ({
                ...E,
                error: void 0,
                status: "success",
                isFetching: !1,
                updatedAt: Date.now(),
                ...T
            }))
        } catch (m) {
            let y = m;
            const g = d._nonReactive.minPendingPromise;
            g && await g,
            In(n, n.router.getMatch(a), m);
            try {
                (p = (h = o.options).onError) == null || p.call(h, m)
            } catch (C) {
                y = C,
                In(n, n.router.getMatch(a), C)
            }
            const S = Qs(n, a, o)
              , T = S ? await S : void 0;
            n.updateMatch(a, C => ({
                ...C,
                error: y,
                status: "error",
                isFetching: !1,
                ...T
            }))
        }
    } catch (d) {
        const m = n.router.getMatch(a);
        if (m) {
            const y = Qs(n, a, o);
            if (y) {
                const g = await y;
                n.updateMatch(a, S => ({
                    ...S,
                    ...g
                }))
            }
            m._nonReactive.loaderPromise = void 0
        }
        In(n, m, d)
    }
}
  , r4 = async (n, a) => {
    var s, o;
    const {id: u, routeId: f} = n.matches[a];
    let h = !1
      , p = !1;
    const d = n.router.looseRoutesById[f];
    if (ly(n, u)) {
        if (n.router.isServer) {
            const g = Qs(n, u, d);
            if (g) {
                const S = await g;
                n.updateMatch(u, T => ({
                    ...T,
                    ...S
                }))
            }
            return n.router.getMatch(u)
        }
    } else {
        const g = n.router.getMatch(u);
        if (g._nonReactive.loaderPromise) {
            if (g.status === "success" && !n.sync && !g.preload)
                return g;
            await g._nonReactive.loaderPromise;
            const S = n.router.getMatch(u);
            S.error && In(n, S, S.error)
        } else {
            const S = Date.now() - g.updatedAt
              , T = sr(n, u)
              , C = T ? d.options.preloadStaleTime ?? n.router.options.defaultPreloadStaleTime ?? 3e4 : d.options.staleTime ?? n.router.options.defaultStaleTime ?? 0
              , E = d.options.shouldReload
              , A = typeof E == "function" ? E(ry(n, u, a, d)) : E
              , V = !!T && !n.router.state.matches.some(j => j.id === u)
              , q = n.router.getMatch(u);
            q._nonReactive.loaderPromise = Va(),
            V !== q.preload && n.updateMatch(u, j => ({
                ...j,
                preload: V
            }));
            const {status: B, invalid: G} = q;
            if (h = B === "success" && (G || (A ?? S > C)),
            !(T && d.options.preload === !1))
                if (h && !n.sync)
                    p = !0,
                    (async () => {
                        var j, Z;
                        try {
                            await M0(n, u, a, d);
                            const Q = n.router.getMatch(u);
                            (j = Q._nonReactive.loaderPromise) == null || j.resolve(),
                            (Z = Q._nonReactive.loadPromise) == null || Z.resolve(),
                            Q._nonReactive.loaderPromise = void 0
                        } catch (Q) {
                            nn(Q) && await n.router.navigate(Q.options)
                        }
                    }
                    )();
                else if (B !== "success" || h && n.sync)
                    await M0(n, u, a, d);
                else {
                    const j = Qs(n, u, d);
                    if (j) {
                        const Z = await j;
                        n.updateMatch(u, Q => ({
                            ...Q,
                            ...Z
                        }))
                    }
                }
        }
    }
    const m = n.router.getMatch(u);
    p || ((s = m._nonReactive.loaderPromise) == null || s.resolve(),
    (o = m._nonReactive.loadPromise) == null || o.resolve()),
    clearTimeout(m._nonReactive.pendingTimeout),
    m._nonReactive.pendingTimeout = void 0,
    p || (m._nonReactive.loaderPromise = void 0),
    m._nonReactive.dehydrated = void 0;
    const y = p ? m.isFetching : !1;
    return y !== m.isFetching || m.invalid !== !1 ? (n.updateMatch(u, g => ({
        ...g,
        isFetching: y,
        invalid: !1
    })),
    n.router.getMatch(u)) : m
}
;
async function E0(n) {
    const a = Object.assign(n, {
        matchPromises: []
    });
    !a.router.isServer && a.router.state.matches.some(s => s._forcePending) && Po(a);
    try {
        for (let u = 0; u < a.matches.length; u++) {
            const f = o4(a, u);
            ei(f) && await f
        }
        const s = a.firstBadMatchIndex ?? a.matches.length;
        for (let u = 0; u < s; u++)
            a.matchPromises.push(r4(a, u));
        await Promise.all(a.matchPromises);
        const o = Po(a);
        ei(o) && await o
    } catch (s) {
        if (ln(s) && !a.preload) {
            const o = Po(a);
            throw ei(o) && await o,
            s
        }
        if (nn(s))
            throw s
    }
    return a.matches
}
async function uy(n) {
    if (!n._lazyLoaded && n._lazyPromise === void 0 && (n.lazyFn ? n._lazyPromise = n.lazyFn().then(a => {
        const {id: s, ...o} = a.options;
        Object.assign(n.options, o),
        n._lazyLoaded = !0,
        n._lazyPromise = void 0
    }
    ) : n._lazyLoaded = !0),
    !n._componentsLoaded && n._componentsPromise === void 0) {
        const a = () => {
            var s;
            const o = [];
            for (const u of fy) {
                const f = (s = n.options[u]) == null ? void 0 : s.preload;
                f && o.push(f())
            }
            if (o.length)
                return Promise.all(o).then( () => {
                    n._componentsLoaded = !0,
                    n._componentsPromise = void 0
                }
                );
            n._componentsLoaded = !0,
            n._componentsPromise = void 0
        }
        ;
        n._componentsPromise = n._lazyPromise ? n._lazyPromise.then(a) : a()
    }
    return n._componentsPromise
}
function Vo(n, a) {
    return a ? {
        status: "error",
        error: a
    } : {
        status: "success",
        value: n
    }
}
function cy(n) {
    var a;
    for (const s of fy)
        if ((a = n.options[s]) != null && a.preload)
            return !0;
    return !1
}
const fy = ["component", "errorComponent", "pendingComponent", "notFoundComponent"];
function Vi(n) {
    const a = n.resolvedLocation
      , s = n.location
      , o = a?.pathname !== s.pathname
      , u = a?.href !== s.href
      , f = a?.hash !== s.hash;
    return {
        fromLocation: a,
        toLocation: s,
        pathChanged: o,
        hrefChanged: u,
        hashChanged: f
    }
}
class u4 {
    constructor(a) {
        this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`,
        this.resetNextScroll = !0,
        this.shouldViewTransition = void 0,
        this.isViewTransitionTypesSupported = void 0,
        this.subscribers = new Set,
        this.isScrollRestoring = !1,
        this.isScrollRestorationSetup = !1,
        this.startTransition = s => s(),
        this.update = s => {
            var o;
            s.notFoundRoute && console.warn("The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info.");
            const u = this.options;
            this.options = {
                ...this.options,
                ...s
            },
            this.isServer = this.options.isServer ?? typeof document > "u",
            this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters ? new Map(this.options.pathParamsAllowedCharacters.map(f => [encodeURIComponent(f), f])) : void 0,
            (!this.basepath || s.basepath && s.basepath !== u.basepath) && (s.basepath === void 0 || s.basepath === "" || s.basepath === "/" ? this.basepath = "/" : this.basepath = `/${wc(s.basepath)}`),
            (!this.history || this.options.history && this.options.history !== this.history) && (this.history = this.options.history ?? (this.isServer ? D3({
                initialEntries: [this.basepath || "/"]
            }) : A3()),
            this.updateLatestLocation()),
            this.options.routeTree !== this.routeTree && (this.routeTree = this.options.routeTree,
            this.buildRouteTree()),
            this.__store || (this.__store = new sf(f4(this.latestLocation),{
                onUpdate: () => {
                    this.__store.state = {
                        ...this.state,
                        cachedMatches: this.state.cachedMatches.filter(f => !["redirected"].includes(f.status))
                    }
                }
            }),
            Q3(this)),
            typeof window < "u" && "CSS" in window && typeof ((o = window.CSS) == null ? void 0 : o.supports) == "function" && (this.isViewTransitionTypesSupported = window.CSS.supports("selector(:active-view-transition-type(a)"))
        }
        ,
        this.updateLatestLocation = () => {
            this.latestLocation = this.parseLocation(this.history.location, this.latestLocation)
        }
        ,
        this.buildRouteTree = () => {
            const {routesById: s, routesByPath: o, flatRoutes: u} = g4({
                routeTree: this.routeTree,
                initRoute: (h, p) => {
                    h.init({
                        originalIndex: p
                    })
                }
            });
            this.routesById = s,
            this.routesByPath = o,
            this.flatRoutes = u;
            const f = this.options.notFoundRoute;
            f && (f.init({
                originalIndex: 99999999999
            }),
            this.routesById[f.id] = f)
        }
        ,
        this.subscribe = (s, o) => {
            const u = {
                eventType: s,
                fn: o
            };
            return this.subscribers.add(u),
            () => {
                this.subscribers.delete(u)
            }
        }
        ,
        this.emit = s => {
            this.subscribers.forEach(o => {
                o.eventType === s.type && o.fn(s)
            }
            )
        }
        ,
        this.parseLocation = (s, o) => {
            const u = ({pathname: d, search: m, hash: y, state: g}) => {
                const S = this.options.parseSearch(m)
                  , T = this.options.stringifySearch(S);
                return {
                    pathname: d,
                    searchStr: T,
                    search: Pe(o?.search, S),
                    hash: y.split("#").reverse()[0] ?? "",
                    href: `${d}${T}${y}`,
                    state: Pe(o?.state, g)
                }
            }
              , f = u(s)
              , {__tempLocation: h, __tempKey: p} = f.state;
            if (h && (!p || p === this.tempLocationKey)) {
                const d = u(h);
                return d.state.key = f.state.key,
                d.state.__TSR_key = f.state.__TSR_key,
                delete d.state.__tempLocation,
                {
                    ...d,
                    maskedLocation: f
                }
            }
            return f
        }
        ,
        this.resolvePathWithBase = (s, o) => z3({
            basepath: this.basepath,
            base: s,
            to: Vf(o),
            trailingSlash: this.options.trailingSlash,
            caseSensitive: this.options.caseSensitive,
            parseCache: this.parsePathnameCache
        }),
        this.matchRoutes = (s, o, u) => typeof s == "string" ? this.matchRoutesInternal({
            pathname: s,
            search: o
        }, u) : this.matchRoutesInternal(s, o),
        this.parsePathnameCache = i4(1e3),
        this.getMatchedRoutes = (s, o) => S4({
            pathname: s,
            routePathname: o,
            basepath: this.basepath,
            caseSensitive: this.options.caseSensitive,
            routesByPath: this.routesByPath,
            routesById: this.routesById,
            flatRoutes: this.flatRoutes,
            parseCache: this.parsePathnameCache
        }),
        this.cancelMatch = s => {
            const o = this.getMatch(s);
            o && (o.abortController.abort(),
            clearTimeout(o._nonReactive.pendingTimeout),
            o._nonReactive.pendingTimeout = void 0)
        }
        ,
        this.cancelMatches = () => {
            var s;
            (s = this.state.pendingMatches) == null || s.forEach(o => {
                this.cancelMatch(o.id)
            }
            )
        }
        ,
        this.buildLocation = s => {
            const o = (f={}) => {
                var h, p;
                const d = f._fromLocation || this.latestLocation
                  , m = this.matchRoutes(d, {
                    _buildLocation: !0
                })
                  , y = Xo(m);
                f.from;
                const g = f.unsafeRelative === "path" ? d.pathname : f.from ?? y.fullPath
                  , S = this.resolvePathWithBase(g, ".")
                  , T = y.search
                  , C = {
                    ...y.params
                }
                  , E = f.to ? this.resolvePathWithBase(S, `${f.to}`) : this.resolvePathWithBase(S, ".")
                  , A = f.params === !1 || f.params === null ? {} : (f.params ?? !0) === !0 ? C : Object.assign(C, Li(f.params, C))
                  , V = Oo({
                    path: E,
                    params: A,
                    parseCache: this.parsePathnameCache
                }).interpolatedPath
                  , q = this.matchRoutes(V, void 0, {
                    _buildLocation: !0
                }).map(tt => this.looseRoutesById[tt.routeId]);
                if (Object.keys(A).length > 0)
                    for (const tt of q) {
                        const F = ((h = tt.options.params) == null ? void 0 : h.stringify) ?? tt.options.stringifyParams;
                        F && Object.assign(A, F(A))
                    }
                const B = Oo({
                    path: E,
                    params: A,
                    leaveWildcards: !1,
                    leaveParams: s.leaveParams,
                    decodeCharMap: this.pathParamsDecodeCharMap,
                    parseCache: this.parsePathnameCache
                }).interpolatedPath;
                let G = T;
                if (s._includeValidateSearch && ((p = this.options.search) != null && p.strict)) {
                    const tt = {};
                    q.forEach(F => {
                        if (F.options.validateSearch)
                            try {
                                Object.assign(tt, uf(F.options.validateSearch, {
                                    ...tt,
                                    ...G
                                }))
                            } catch {}
                    }
                    ),
                    G = tt
                }
                G = b4({
                    search: G,
                    dest: f,
                    destRoutes: q,
                    _includeValidateSearch: s._includeValidateSearch
                }),
                G = Pe(T, G);
                const j = this.options.stringifySearch(G)
                  , Z = f.hash === !0 ? d.hash : f.hash ? Li(f.hash, d.hash) : void 0
                  , Q = Z ? `#${Z}` : "";
                let K = f.state === !0 ? d.state : f.state ? Li(f.state, d.state) : {};
                return K = Pe(d.state, K),
                {
                    pathname: B,
                    search: G,
                    searchStr: j,
                    state: K,
                    hash: Z ?? "",
                    href: `${B}${j}${Q}`,
                    unmaskOnReload: f.unmaskOnReload
                }
            }
              , u = (f={}, h) => {
                var p;
                const d = o(f);
                let m = h ? o(h) : void 0;
                if (!m) {
                    let y = {};
                    const g = (p = this.options.routeMasks) == null ? void 0 : p.find(S => {
                        const T = of(this.basepath, d.pathname, {
                            to: S.from,
                            caseSensitive: !1,
                            fuzzy: !1
                        }, this.parsePathnameCache);
                        return T ? (y = T,
                        !0) : !1
                    }
                    );
                    if (g) {
                        const {from: S, ...T} = g;
                        h = {
                            from: s.from,
                            ...T,
                            params: y
                        },
                        m = o(h)
                    }
                }
                if (m) {
                    const y = o(h);
                    d.maskedLocation = y
                }
                return d
            }
            ;
            return s.mask ? u(s, {
                from: s.from,
                ...s.mask
            }) : u(s)
        }
        ,
        this.commitLocation = ({viewTransition: s, ignoreBlocker: o, ...u}) => {
            const f = () => {
                const d = ["key", "__TSR_key", "__TSR_index", "__hashScrollIntoViewOptions"];
                d.forEach(y => {
                    u.state[y] = this.latestLocation.state[y]
                }
                );
                const m = Oi(u.state, this.latestLocation.state);
                return d.forEach(y => {
                    delete u.state[y]
                }
                ),
                m
            }
              , h = this.latestLocation.href === u.href
              , p = this.commitLocationPromise;
            if (this.commitLocationPromise = Va( () => {
                p?.resolve()
            }
            ),
            h && f())
                this.load();
            else {
                let {maskedLocation: d, hashScrollIntoView: m, ...y} = u;
                d && (y = {
                    ...d,
                    state: {
                        ...d.state,
                        __tempKey: void 0,
                        __tempLocation: {
                            ...y,
                            search: y.searchStr,
                            state: {
                                ...y.state,
                                __tempKey: void 0,
                                __tempLocation: void 0,
                                __TSR_key: void 0,
                                key: void 0
                            }
                        }
                    }
                },
                (y.unmaskOnReload ?? this.options.unmaskOnReload ?? !1) && (y.state.__tempKey = this.tempLocationKey)),
                y.state.__hashScrollIntoViewOptions = m ?? this.options.defaultHashScrollIntoView ?? !0,
                this.shouldViewTransition = s,
                this.history[u.replace ? "replace" : "push"](y.href, y.state, {
                    ignoreBlocker: o
                })
            }
            return this.resetNextScroll = u.resetScroll ?? !0,
            this.history.subscribers.size || this.load(),
            this.commitLocationPromise
        }
        ,
        this.buildAndCommitLocation = ({replace: s, resetScroll: o, hashScrollIntoView: u, viewTransition: f, ignoreBlocker: h, href: p, ...d}={}) => {
            if (p) {
                const y = this.history.location.state.__TSR_index
                  , g = el(p, {
                    __TSR_index: s ? y : y + 1
                });
                d.to = g.pathname,
                d.search = this.options.parseSearch(g.search),
                d.hash = g.hash.slice(1)
            }
            const m = this.buildLocation({
                ...d,
                _includeValidateSearch: !0
            });
            return this.commitLocation({
                ...m,
                viewTransition: f,
                replace: s,
                resetScroll: o,
                hashScrollIntoView: u,
                ignoreBlocker: h
            })
        }
        ,
        this.navigate = ({to: s, reloadDocument: o, href: u, ...f}) => {
            if (!o && u)
                try {
                    new URL(`${u}`),
                    o = !0
                } catch {}
            if (o) {
                if (!u) {
                    const h = this.buildLocation({
                        to: s,
                        ...f
                    });
                    u = this.history.createHref(h.href)
                }
                return f.replace ? window.location.replace(u) : window.location.href = u,
                Promise.resolve()
            }
            return this.buildAndCommitLocation({
                ...f,
                href: u,
                to: s,
                _isNavigate: !0
            })
        }
        ,
        this.beforeLoad = () => {
            if (this.cancelMatches(),
            this.updateLatestLocation(),
            this.isServer) {
                const o = this.buildLocation({
                    to: this.latestLocation.pathname,
                    search: !0,
                    params: !0,
                    hash: !0,
                    state: !0,
                    _includeValidateSearch: !0
                })
                  , u = f => {
                    try {
                        return encodeURI(decodeURI(f))
                    } catch {
                        return f
                    }
                }
                ;
                if (wc(u(this.latestLocation.href)) !== wc(u(o.href)))
                    throw n4({
                        href: o.href
                    })
            }
            const s = this.matchRoutes(this.latestLocation);
            this.__store.setState(o => ({
                ...o,
                status: "pending",
                statusCode: 200,
                isLoading: !0,
                location: this.latestLocation,
                pendingMatches: s,
                cachedMatches: o.cachedMatches.filter(u => !s.some(f => f.id === u.id))
            }))
        }
        ,
        this.load = async s => {
            let o, u, f;
            for (f = new Promise(h => {
                this.startTransition(async () => {
                    var p;
                    try {
                        this.beforeLoad();
                        const d = this.latestLocation
                          , m = this.state.resolvedLocation;
                        this.state.redirect || this.emit({
                            type: "onBeforeNavigate",
                            ...Vi({
                                resolvedLocation: m,
                                location: d
                            })
                        }),
                        this.emit({
                            type: "onBeforeLoad",
                            ...Vi({
                                resolvedLocation: m,
                                location: d
                            })
                        }),
                        await E0({
                            router: this,
                            sync: s?.sync,
                            matches: this.state.pendingMatches,
                            location: d,
                            updateMatch: this.updateMatch,
                            onReady: async () => {
                                this.startViewTransition(async () => {
                                    let y, g, S;
                                    Zs( () => {
                                        this.__store.setState(T => {
                                            const C = T.matches
                                              , E = T.pendingMatches || T.matches;
                                            return y = C.filter(A => !E.some(V => V.id === A.id)),
                                            g = E.filter(A => !C.some(V => V.id === A.id)),
                                            S = C.filter(A => E.some(V => V.id === A.id)),
                                            {
                                                ...T,
                                                isLoading: !1,
                                                loadedAt: Date.now(),
                                                matches: E,
                                                pendingMatches: void 0,
                                                cachedMatches: [...T.cachedMatches, ...y.filter(A => A.status !== "error")]
                                            }
                                        }
                                        ),
                                        this.clearExpiredCache()
                                    }
                                    ),
                                    [[y, "onLeave"], [g, "onEnter"], [S, "onStay"]].forEach( ([T,C]) => {
                                        T.forEach(E => {
                                            var A, V;
                                            (V = (A = this.looseRoutesById[E.routeId].options)[C]) == null || V.call(A, E)
                                        }
                                        )
                                    }
                                    )
                                }
                                )
                            }
                        })
                    } catch (d) {
                        nn(d) ? (o = d,
                        this.isServer || this.navigate({
                            ...o.options,
                            replace: !0,
                            ignoreBlocker: !0
                        })) : ln(d) && (u = d),
                        this.__store.setState(m => ({
                            ...m,
                            statusCode: o ? o.status : u ? 404 : m.matches.some(y => y.status === "error") ? 500 : 200,
                            redirect: o
                        }))
                    }
                    this.latestLoadPromise === f && ((p = this.commitLocationPromise) == null || p.resolve(),
                    this.latestLoadPromise = void 0,
                    this.commitLocationPromise = void 0),
                    h()
                }
                )
            }
            ),
            this.latestLoadPromise = f,
            await f; this.latestLoadPromise && f !== this.latestLoadPromise; )
                await this.latestLoadPromise;
            this.hasNotFoundMatch() && this.__store.setState(h => ({
                ...h,
                statusCode: 404
            }))
        }
        ,
        this.startViewTransition = s => {
            const o = this.shouldViewTransition ?? this.options.defaultViewTransition;
            if (delete this.shouldViewTransition,
            o && typeof document < "u" && "startViewTransition" in document && typeof document.startViewTransition == "function") {
                let u;
                if (typeof o == "object" && this.isViewTransitionTypesSupported) {
                    const f = this.latestLocation
                      , h = this.state.resolvedLocation
                      , p = typeof o.types == "function" ? o.types(Vi({
                        resolvedLocation: h,
                        location: f
                    })) : o.types;
                    u = {
                        update: s,
                        types: p
                    }
                } else
                    u = s;
                document.startViewTransition(u)
            } else
                s()
        }
        ,
        this.updateMatch = (s, o) => {
            var u;
            const f = (u = this.state.pendingMatches) != null && u.some(h => h.id === s) ? "pendingMatches" : this.state.matches.some(h => h.id === s) ? "matches" : this.state.cachedMatches.some(h => h.id === s) ? "cachedMatches" : "";
            f && this.__store.setState(h => {
                var p;
                return {
                    ...h,
                    [f]: (p = h[f]) == null ? void 0 : p.map(d => d.id === s ? o(d) : d)
                }
            }
            )
        }
        ,
        this.getMatch = s => {
            var o;
            const u = f => f.id === s;
            return this.state.cachedMatches.find(u) ?? ((o = this.state.pendingMatches) == null ? void 0 : o.find(u)) ?? this.state.matches.find(u)
        }
        ,
        this.invalidate = s => {
            const o = u => {
                var f;
                return ((f = s?.filter) == null ? void 0 : f.call(s, u)) ?? !0 ? {
                    ...u,
                    invalid: !0,
                    ...s?.forcePending || u.status === "error" ? {
                        status: "pending",
                        error: void 0
                    } : void 0
                } : u
            }
            ;
            return this.__store.setState(u => {
                var f;
                return {
                    ...u,
                    matches: u.matches.map(o),
                    cachedMatches: u.cachedMatches.map(o),
                    pendingMatches: (f = u.pendingMatches) == null ? void 0 : f.map(o)
                }
            }
            ),
            this.shouldViewTransition = !1,
            this.load({
                sync: s?.sync
            })
        }
        ,
        this.resolveRedirect = s => (s.options.href || (s.options.href = this.buildLocation(s.options).href,
        s.headers.set("Location", s.options.href)),
        s.headers.get("Location") || s.headers.set("Location", s.options.href),
        s),
        this.clearCache = s => {
            const o = s?.filter;
            o !== void 0 ? this.__store.setState(u => ({
                ...u,
                cachedMatches: u.cachedMatches.filter(f => !o(f))
            })) : this.__store.setState(u => ({
                ...u,
                cachedMatches: []
            }))
        }
        ,
        this.clearExpiredCache = () => {
            const s = o => {
                const u = this.looseRoutesById[o.routeId];
                if (!u.options.loader)
                    return !0;
                const f = (o.preload ? u.options.preloadGcTime ?? this.options.defaultPreloadGcTime : u.options.gcTime ?? this.options.defaultGcTime) ?? 300 * 1e3;
                return o.status === "error" ? !0 : Date.now() - o.updatedAt >= f
            }
            ;
            this.clearCache({
                filter: s
            })
        }
        ,
        this.loadRouteChunk = uy,
        this.preloadRoute = async s => {
            const o = this.buildLocation(s);
            let u = this.matchRoutes(o, {
                throwOnError: !0,
                preload: !0,
                dest: s
            });
            const f = new Set([...this.state.matches, ...this.state.pendingMatches ?? []].map(p => p.id))
              , h = new Set([...f, ...this.state.cachedMatches.map(p => p.id)]);
            Zs( () => {
                u.forEach(p => {
                    h.has(p.id) || this.__store.setState(d => ({
                        ...d,
                        cachedMatches: [...d.cachedMatches, p]
                    }))
                }
                )
            }
            );
            try {
                return u = await E0({
                    router: this,
                    matches: u,
                    location: o,
                    preload: !0,
                    updateMatch: (p, d) => {
                        f.has(p) ? u = u.map(m => m.id === p ? d(m) : m) : this.updateMatch(p, d)
                    }
                }),
                u
            } catch (p) {
                if (nn(p))
                    return p.options.reloadDocument ? void 0 : await this.preloadRoute({
                        ...p.options,
                        _fromLocation: o
                    });
                ln(p) || console.error(p);
                return
            }
        }
        ,
        this.matchRoute = (s, o) => {
            const u = {
                ...s,
                to: s.to ? this.resolvePathWithBase(s.from || "", s.to) : void 0,
                params: s.params || {},
                leaveParams: !0
            }
              , f = this.buildLocation(u);
            if (o?.pending && this.state.status !== "pending")
                return !1;
            const p = (o?.pending === void 0 ? !this.state.isLoading : o.pending) ? this.latestLocation : this.state.resolvedLocation || this.state.location
              , d = of(this.basepath, p.pathname, {
                ...o,
                to: f.pathname
            }, this.parsePathnameCache);
            return !d || s.params && !Oi(d, s.params, {
                partial: !0
            }) ? !1 : d && (o?.includeSearch ?? !0) ? Oi(p.search, f.search, {
                partial: !0
            }) ? d : !1 : d
        }
        ,
        this.hasNotFoundMatch = () => this.__store.state.matches.some(s => s.status === "notFound" || s.globalNotFound),
        this.update({
            defaultPreloadDelay: 50,
            defaultPendingMs: 1e3,
            defaultPendingMinMs: 500,
            context: void 0,
            ...a,
            caseSensitive: a.caseSensitive ?? !1,
            notFoundMode: a.notFoundMode ?? "fuzzy",
            stringifySearch: a.stringifySearch ?? I3,
            parseSearch: a.parseSearch ?? W3
        }),
        typeof document < "u" && (self.__TSR_ROUTER__ = this)
    }
    isShell() {
        return !!this.options.isShell
    }
    isPrerendering() {
        return !!this.options.isPrerendering
    }
    get state() {
        return this.__store.state
    }
    get looseRoutesById() {
        return this.routesById
    }
    matchRoutesInternal(a, s) {
        var o;
        const {foundRoute: u, matchedRoutes: f, routeParams: h} = this.getMatchedRoutes(a.pathname, (o = s?.dest) == null ? void 0 : o.to);
        let p = !1;
        (u ? u.path !== "/" && h["**"] : za(a.pathname)) && (this.options.notFoundRoute ? f.push(this.options.notFoundRoute) : p = !0);
        const d = ( () => {
            if (p) {
                if (this.options.notFoundMode !== "root")
                    for (let S = f.length - 1; S >= 0; S--) {
                        const T = f[S];
                        if (T.children)
                            return T.id
                    }
                return qe
            }
        }
        )()
          , m = f.map(S => {
            var T;
            let C;
            const E = ((T = S.options.params) == null ? void 0 : T.parse) ?? S.options.parseParams;
            if (E)
                try {
                    const A = E(h);
                    Object.assign(h, A)
                } catch (A) {
                    if (C = new c4(A.message,{
                        cause: A
                    }),
                    s?.throwOnError)
                        throw C;
                    return C
                }
        }
        )
          , y = []
          , g = S => S?.id ? S.context ?? this.options.context ?? void 0 : this.options.context ?? void 0;
        return f.forEach( (S, T) => {
            var C, E;
            const A = y[T - 1]
              , [V,q,B] = ( () => {
                const _t = A?.search ?? a.search
                  , Lt = A?._strictSearch ?? void 0;
                try {
                    const z = uf(S.options.validateSearch, {
                        ..._t
                    }) ?? void 0;
                    return [{
                        ..._t,
                        ...z
                    }, {
                        ...Lt,
                        ...z
                    }, void 0]
                } catch (z) {
                    let k = z;
                    if (z instanceof Jo || (k = new Jo(z.message,{
                        cause: z
                    })),
                    s?.throwOnError)
                        throw k;
                    return [_t, {}, k]
                }
            }
            )()
              , G = ((E = (C = S.options).loaderDeps) == null ? void 0 : E.call(C, {
                search: V
            })) ?? ""
              , j = G ? JSON.stringify(G) : ""
              , {usedParams: Z, interpolatedPath: Q} = Oo({
                path: S.fullPath,
                params: h,
                decodeCharMap: this.pathParamsDecodeCharMap
            })
              , K = Oo({
                path: S.id,
                params: h,
                leaveWildcards: !0,
                decodeCharMap: this.pathParamsDecodeCharMap,
                parseCache: this.parsePathnameCache
            }).interpolatedPath + j
              , tt = this.getMatch(K)
              , F = this.state.matches.find(_t => _t.routeId === S.id)
              , rt = F ? "stay" : "enter";
            let ft;
            if (tt)
                ft = {
                    ...tt,
                    cause: rt,
                    params: F ? Pe(F.params, h) : h,
                    _strictParams: Z,
                    search: Pe(F ? F.search : tt.search, V),
                    _strictSearch: q
                };
            else {
                const _t = S.options.loader || S.options.beforeLoad || S.lazyFn || cy(S) ? "pending" : "success";
                ft = {
                    id: K,
                    index: T,
                    routeId: S.id,
                    params: F ? Pe(F.params, h) : h,
                    _strictParams: Z,
                    pathname: Mn([this.basepath, Q]),
                    updatedAt: Date.now(),
                    search: F ? Pe(F.search, V) : V,
                    _strictSearch: q,
                    searchError: void 0,
                    status: _t,
                    isFetching: !1,
                    error: void 0,
                    paramsError: m[T],
                    __routeContext: void 0,
                    _nonReactive: {
                        loadPromise: Va()
                    },
                    __beforeLoadContext: void 0,
                    context: {},
                    abortController: new AbortController,
                    fetchCount: 0,
                    cause: rt,
                    loaderDeps: F ? Pe(F.loaderDeps, G) : G,
                    invalid: !1,
                    preload: !1,
                    links: void 0,
                    scripts: void 0,
                    headScripts: void 0,
                    meta: void 0,
                    staticData: S.options.staticData || {},
                    fullPath: S.fullPath
                }
            }
            s?.preload || (ft.globalNotFound = d === S.id),
            ft.searchError = B;
            const Gt = g(A);
            ft.context = {
                ...Gt,
                ...ft.__routeContext,
                ...ft.__beforeLoadContext
            },
            y.push(ft)
        }
        ),
        y.forEach( (S, T) => {
            const C = this.looseRoutesById[S.routeId];
            if (!this.getMatch(S.id) && s?._buildLocation !== !0) {
                const A = y[T - 1]
                  , V = g(A);
                if (C.options.context) {
                    const q = {
                        deps: S.loaderDeps,
                        params: S.params,
                        context: V ?? {},
                        location: a,
                        navigate: B => this.navigate({
                            ...B,
                            _fromLocation: a
                        }),
                        buildLocation: this.buildLocation,
                        cause: S.cause,
                        abortController: S.abortController,
                        preload: !!S.preload,
                        matches: y
                    };
                    S.__routeContext = C.options.context(q) ?? void 0
                }
                S.context = {
                    ...V,
                    ...S.__routeContext,
                    ...S.__beforeLoadContext
                }
            }
        }
        ),
        y
    }
}
class Jo extends Error {
}
class c4 extends Error {
}
function f4(n) {
    return {
        loadedAt: 0,
        isLoading: !1,
        isTransitioning: !1,
        status: "idle",
        resolvedLocation: void 0,
        location: n,
        matches: [],
        pendingMatches: [],
        cachedMatches: [],
        statusCode: 200
    }
}
function uf(n, a) {
    if (n == null)
        return {};
    if ("~standard" in n) {
        const s = n["~standard"].validate(a);
        if (s instanceof Promise)
            throw new Jo("Async validation not supported");
        if (s.issues)
            throw new Jo(JSON.stringify(s.issues, void 0, 2),{
                cause: s
            });
        return s.value
    }
    return "parse" in n ? n.parse(a) : typeof n == "function" ? n(a) : {}
}
const h4 = .5
  , d4 = .4
  , m4 = .25
  , p4 = .05
  , y4 = .02
  , v4 = .01
  , _0 = 2e-4
  , A0 = 1e-4;
function D0(n, a) {
    return n.prefixSegment && n.suffixSegment ? a + p4 + _0 * n.prefixSegment.length + A0 * n.suffixSegment.length : n.prefixSegment ? a + y4 + _0 * n.prefixSegment.length : n.suffixSegment ? a + v4 + A0 * n.suffixSegment.length : a
}
function g4({routeTree: n, initRoute: a}) {
    const s = {}
      , o = {}
      , u = d => {
        d.forEach( (m, y) => {
            a?.(m, y);
            const g = s[m.id];
            if (En(!g, `Duplicate routes found with id: ${String(m.id)}`),
            s[m.id] = m,
            !m.isRoot && m.path) {
                const T = za(m.fullPath);
                (!o[T] || m.fullPath.endsWith("/")) && (o[T] = m)
            }
            const S = m.children;
            S?.length && u(S)
        }
        )
    }
    ;
    u([n]);
    const f = [];
    Object.values(s).forEach( (d, m) => {
        var y;
        if (d.isRoot || !d.path)
            return;
        const g = wf(d.fullPath);
        let S = Ba(g)
          , T = 0;
        for (; S.length > T + 1 && ((y = S[T]) == null ? void 0 : y.value) === "/"; )
            T++;
        T > 0 && (S = S.slice(T));
        let C = 0
          , E = !1;
        const A = S.map( (V, q) => {
            if (V.value === "/")
                return .75;
            let B;
            if (V.type === Bi ? B = h4 : V.type === wa ? (B = d4,
            C++) : V.type === Ui && (B = m4),
            B) {
                for (let G = q + 1; G < S.length; G++) {
                    const j = S[G];
                    if (j.type === Rn && j.value !== "/")
                        return E = !0,
                        D0(V, B + .2)
                }
                return D0(V, B)
            }
            return 1
        }
        );
        f.push({
            child: d,
            trimmed: g,
            parsed: S,
            index: m,
            scores: A,
            optionalParamCount: C,
            hasStaticAfter: E
        })
    }
    );
    const p = f.sort( (d, m) => {
        const y = Math.min(d.scores.length, m.scores.length);
        for (let g = 0; g < y; g++)
            if (d.scores[g] !== m.scores[g])
                return m.scores[g] - d.scores[g];
        if (d.scores.length !== m.scores.length) {
            if (d.optionalParamCount !== m.optionalParamCount) {
                if (d.hasStaticAfter === m.hasStaticAfter)
                    return d.optionalParamCount - m.optionalParamCount;
                if (d.hasStaticAfter && !m.hasStaticAfter)
                    return -1;
                if (!d.hasStaticAfter && m.hasStaticAfter)
                    return 1
            }
            return m.scores.length - d.scores.length
        }
        for (let g = 0; g < y; g++)
            if (d.parsed[g].value !== m.parsed[g].value)
                return d.parsed[g].value > m.parsed[g].value ? 1 : -1;
        return d.index - m.index
    }
    ).map( (d, m) => (d.child.rank = m,
    d.child));
    return {
        routesById: s,
        routesByPath: o,
        flatRoutes: p
    }
}
function S4({pathname: n, routePathname: a, basepath: s, caseSensitive: o, routesByPath: u, routesById: f, flatRoutes: h, parseCache: p}) {
    let d = {};
    const m = za(n)
      , y = C => {
        var E;
        return of(s, m, {
            to: C.fullPath,
            caseSensitive: ((E = C.options) == null ? void 0 : E.caseSensitive) ?? o,
            fuzzy: !0
        }, p)
    }
    ;
    let g = a !== void 0 ? u[a] : void 0;
    if (g)
        d = y(g);
    else {
        let C;
        for (const E of h) {
            const A = y(E);
            if (A)
                if (E.path !== "/" && A["**"])
                    C || (C = {
                        foundRoute: E,
                        routeParams: A
                    });
                else {
                    g = E,
                    d = A;
                    break
                }
        }
        !g && C && (g = C.foundRoute,
        d = C.routeParams)
    }
    let S = g || f[qe];
    const T = [S];
    for (; S.parentRoute; )
        S = S.parentRoute,
        T.push(S);
    return T.reverse(),
    {
        matchedRoutes: T,
        routeParams: d,
        foundRoute: g
    }
}
function b4({search: n, dest: a, destRoutes: s, _includeValidateSearch: o}) {
    const u = s.reduce( (p, d) => {
        var m;
        const y = [];
        if ("search" in d.options)
            (m = d.options.search) != null && m.middlewares && y.push(...d.options.search.middlewares);
        else if (d.options.preSearchFilters || d.options.postSearchFilters) {
            const g = ({search: S, next: T}) => {
                let C = S;
                "preSearchFilters" in d.options && d.options.preSearchFilters && (C = d.options.preSearchFilters.reduce( (A, V) => V(A), S));
                const E = T(C);
                return "postSearchFilters" in d.options && d.options.postSearchFilters ? d.options.postSearchFilters.reduce( (A, V) => V(A), E) : E
            }
            ;
            y.push(g)
        }
        if (o && d.options.validateSearch) {
            const g = ({search: S, next: T}) => {
                const C = T(S);
                try {
                    return {
                        ...C,
                        ...uf(d.options.validateSearch, C) ?? void 0
                    }
                } catch {
                    return C
                }
            }
            ;
            y.push(g)
        }
        return p.concat(y)
    }
    , []) ?? []
      , f = ({search: p}) => a.search ? a.search === !0 ? p : Li(a.search, p) : {};
    u.push(f);
    const h = (p, d) => {
        if (p >= u.length)
            return d;
        const m = u[p];
        return m({
            search: d,
            next: g => h(p + 1, g)
        })
    }
    ;
    return h(0, n)
}
const T4 = "Error preloading route! ☝️";
class hy {
    constructor(a) {
        if (this.init = s => {
            var o, u;
            this.originalIndex = s.originalIndex;
            const f = this.options
              , h = !f?.path && !f?.id;
            this.parentRoute = (u = (o = this.options).getParentRoute) == null ? void 0 : u.call(o),
            h ? this._path = qe : this.parentRoute || En(!1);
            let p = h ? qe : f?.path;
            p && p !== "/" && (p = wf(p));
            const d = f?.id || p;
            let m = h ? qe : Mn([this.parentRoute.id === qe ? "" : this.parentRoute.id, d]);
            p === qe && (p = "/"),
            m !== qe && (m = Mn(["/", m]));
            const y = m === qe ? "/" : Mn([this.parentRoute.fullPath, p]);
            this._path = p,
            this._id = m,
            this._fullPath = y,
            this._to = y
        }
        ,
        this.clone = s => {
            this._path = s._path,
            this._id = s._id,
            this._fullPath = s._fullPath,
            this._to = s._to,
            this.options.getParentRoute = s.options.getParentRoute,
            this.children = s.children
        }
        ,
        this.addChildren = s => this._addFileChildren(s),
        this._addFileChildren = s => (Array.isArray(s) && (this.children = s),
        typeof s == "object" && s !== null && (this.children = Object.values(s)),
        this),
        this._addFileTypes = () => this,
        this.updateLoader = s => (Object.assign(this.options, s),
        this),
        this.update = s => (Object.assign(this.options, s),
        this),
        this.lazy = s => (this.lazyFn = s,
        this),
        this.options = a || {},
        this.isRoot = !a?.getParentRoute,
        a?.id && a?.path)
            throw new Error("Route cannot have both an 'id' and a 'path' option.")
    }
    get to() {
        return this._to
    }
    get id() {
        return this._id
    }
    get path() {
        return this._path
    }
    get fullPath() {
        return this._fullPath
    }
}
class C4 extends hy {
    constructor(a) {
        super(a)
    }
}
function zf(n) {
    const a = n.errorComponent ?? lr;
    return X.jsx(x4, {
        getResetKey: n.getResetKey,
        onCatch: n.onCatch,
        children: ({error: s, reset: o}) => s ? H.createElement(a, {
            error: s,
            reset: o
        }) : n.children
    })
}
class x4 extends H.Component {
    constructor() {
        super(...arguments),
        this.state = {
            error: null
        }
    }
    static getDerivedStateFromProps(a) {
        return {
            resetKey: a.getResetKey()
        }
    }
    static getDerivedStateFromError(a) {
        return {
            error: a
        }
    }
    reset() {
        this.setState({
            error: null
        })
    }
    componentDidUpdate(a, s) {
        s.error && s.resetKey !== this.state.resetKey && this.reset()
    }
    componentDidCatch(a, s) {
        this.props.onCatch && this.props.onCatch(a, s)
    }
    render() {
        return this.props.children({
            error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error,
            reset: () => {
                this.reset()
            }
        })
    }
}
function lr({error: n}) {
    const [a,s] = H.useState(!1);
    return X.jsxs("div", {
        style: {
            padding: ".5rem",
            maxWidth: "100%"
        },
        children: [X.jsxs("div", {
            style: {
                display: "flex",
                alignItems: "center",
                gap: ".5rem"
            },
            children: [X.jsx("strong", {
                style: {
                    fontSize: "1rem"
                },
                children: "Something went wrong!"
            }), X.jsx("button", {
                style: {
                    appearance: "none",
                    fontSize: ".6em",
                    border: "1px solid currentColor",
                    padding: ".1rem .2rem",
                    fontWeight: "bold",
                    borderRadius: ".25rem"
                },
                onClick: () => s(o => !o),
                children: a ? "Hide Error" : "Show Error"
            })]
        }), X.jsx("div", {
            style: {
                height: ".25rem"
            }
        }), a ? X.jsx("div", {
            children: X.jsx("pre", {
                style: {
                    fontSize: ".7em",
                    border: "1px solid red",
                    borderRadius: ".25rem",
                    padding: ".3rem",
                    color: "red",
                    overflow: "auto"
                },
                children: n.message ? X.jsx("code", {
                    children: n.message
                }) : null
            })
        }) : null]
    })
}
function R4({children: n, fallback: a=null}) {
    return M4() ? X.jsx(tl.Fragment, {
        children: n
    }) : X.jsx(tl.Fragment, {
        children: a
    })
}
function M4() {
    return tl.useSyncExternalStore(E4, () => !0, () => !1)
}
function E4() {
    return () => {}
}
var Uc = {
    exports: {}
}
  , Nc = {}
  , jc = {
    exports: {}
}
  , Pc = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var L0;
function _4() {
    if (L0)
        return Pc;
    L0 = 1;
    var n = rl();
    function a(g, S) {
        return g === S && (g !== 0 || 1 / g === 1 / S) || g !== g && S !== S
    }
    var s = typeof Object.is == "function" ? Object.is : a
      , o = n.useState
      , u = n.useEffect
      , f = n.useLayoutEffect
      , h = n.useDebugValue;
    function p(g, S) {
        var T = S()
          , C = o({
            inst: {
                value: T,
                getSnapshot: S
            }
        })
          , E = C[0].inst
          , A = C[1];
        return f(function() {
            E.value = T,
            E.getSnapshot = S,
            d(E) && A({
                inst: E
            })
        }, [g, T, S]),
        u(function() {
            return d(E) && A({
                inst: E
            }),
            g(function() {
                d(E) && A({
                    inst: E
                })
            })
        }, [g]),
        h(T),
        T
    }
    function d(g) {
        var S = g.getSnapshot;
        g = g.value;
        try {
            var T = S();
            return !s(g, T)
        } catch {
            return !0
        }
    }
    function m(g, S) {
        return S()
    }
    var y = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? m : p;
    return Pc.useSyncExternalStore = n.useSyncExternalStore !== void 0 ? n.useSyncExternalStore : y,
    Pc
}
var O0;
function A4() {
    return O0 || (O0 = 1,
    jc.exports = _4()),
    jc.exports
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var V0;
function D4() {
    if (V0)
        return Nc;
    V0 = 1;
    var n = rl()
      , a = A4();
    function s(m, y) {
        return m === y && (m !== 0 || 1 / m === 1 / y) || m !== m && y !== y
    }
    var o = typeof Object.is == "function" ? Object.is : s
      , u = a.useSyncExternalStore
      , f = n.useRef
      , h = n.useEffect
      , p = n.useMemo
      , d = n.useDebugValue;
    return Nc.useSyncExternalStoreWithSelector = function(m, y, g, S, T) {
        var C = f(null);
        if (C.current === null) {
            var E = {
                hasValue: !1,
                value: null
            };
            C.current = E
        } else
            E = C.current;
        C = p(function() {
            function V(Z) {
                if (!q) {
                    if (q = !0,
                    B = Z,
                    Z = S(Z),
                    T !== void 0 && E.hasValue) {
                        var Q = E.value;
                        if (T(Q, Z))
                            return G = Q
                    }
                    return G = Z
                }
                if (Q = G,
                o(B, Z))
                    return Q;
                var K = S(Z);
                return T !== void 0 && T(Q, K) ? (B = Z,
                Q) : (B = Z,
                G = K)
            }
            var q = !1, B, G, j = g === void 0 ? null : g;
            return [function() {
                return V(y())
            }
            , j === null ? void 0 : function() {
                return V(j())
            }
            ]
        }, [y, g, S, T]);
        var A = u(m, C[0], C[1]);
        return h(function() {
            E.hasValue = !0,
            E.value = A
        }, [A]),
        d(A),
        A
    }
    ,
    Nc
}
var w0;
function L4() {
    return w0 || (w0 = 1,
    Uc.exports = D4()),
    Uc.exports
}
var O4 = L4();
function V4(n, a=s => s) {
    return O4.useSyncExternalStoreWithSelector(n.subscribe, () => n.state, () => n.state, a, w4)
}
function w4(n, a) {
    if (Object.is(n, a))
        return !0;
    if (typeof n != "object" || n === null || typeof a != "object" || a === null)
        return !1;
    if (n instanceof Map && a instanceof Map) {
        if (n.size !== a.size)
            return !1;
        for (const [o,u] of n)
            if (!a.has(o) || !Object.is(u, a.get(o)))
                return !1;
        return !0
    }
    if (n instanceof Set && a instanceof Set) {
        if (n.size !== a.size)
            return !1;
        for (const o of n)
            if (!a.has(o))
                return !1;
        return !0
    }
    if (n instanceof Date && a instanceof Date)
        return n.getTime() === a.getTime();
    const s = Object.keys(n);
    if (s.length !== Object.keys(a).length)
        return !1;
    for (let o = 0; o < s.length; o++)
        if (!Object.prototype.hasOwnProperty.call(a, s[o]) || !Object.is(n[s[o]], a[s[o]]))
            return !1;
    return !0
}
const Hc = H.createContext(null);
function dy() {
    return typeof document > "u" ? Hc : window.__TSR_ROUTER_CONTEXT__ ? window.__TSR_ROUTER_CONTEXT__ : (window.__TSR_ROUTER_CONTEXT__ = Hc,
    Hc)
}
function Ae(n) {
    const a = H.useContext(dy());
    return n?.warn,
    a
}
function ce(n) {
    const a = Ae({
        warn: n?.router === void 0
    })
      , s = n?.router || a
      , o = H.useRef(void 0);
    return V4(s.__store, u => {
        if (n?.select) {
            if (n.structuralSharing ?? s.options.defaultStructuralSharing) {
                const f = Pe(o.current, n.select(u));
                return o.current = f,
                f
            }
            return n.select(u)
        }
        return u
    }
    )
}
const or = H.createContext(void 0)
  , z4 = H.createContext(void 0);
function $e(n) {
    const a = H.useContext(n.from ? z4 : or);
    return ce({
        select: o => {
            const u = o.matches.find(f => n.from ? n.from === f.routeId : f.id === a);
            if (En(!((n.shouldThrow ?? !0) && !u), `Could not find ${n.from ? `an active match from "${n.from}"` : "a nearest match!"}`),
            u !== void 0)
                return n.select ? n.select(u) : u
        }
        ,
        structuralSharing: n.structuralSharing
    })
}
function Bf(n) {
    return $e({
        from: n.from,
        strict: n.strict,
        structuralSharing: n.structuralSharing,
        select: a => n.select ? n.select(a.loaderData) : a.loaderData
    })
}
function Uf(n) {
    const {select: a, ...s} = n;
    return $e({
        ...s,
        select: o => a ? a(o.loaderDeps) : o.loaderDeps
    })
}
function Nf(n) {
    return $e({
        from: n.from,
        strict: n.strict,
        shouldThrow: n.shouldThrow,
        structuralSharing: n.structuralSharing,
        select: a => n.select ? n.select(a.params) : a.params
    })
}
function jf(n) {
    return $e({
        from: n.from,
        strict: n.strict,
        shouldThrow: n.shouldThrow,
        structuralSharing: n.structuralSharing,
        select: a => n.select ? n.select(a.search) : a.search
    })
}
const my = n => {
    const a = Ae()
      , s = ce({
        select: m => m.location
    })
      , [o,u] = H.useState(s)
      , [f,h] = H.useState(n);
    H.useEffect( () => {
        u(f ?? s)
    }
    , [s, f]);
    const p = $e({
        strict: !1,
        select: m => m.index
    })
      , d = H.useCallback(m => {
        const y = a.matchRoutes(o, {
            _buildLocation: !1
        })
          , g = Xo(y);
        return m ?? g?.fullPath ?? a.state.matches[p].fullPath
    }
    , [o, p, a]);
    return {
        activeLocation: o,
        getFromPath: d,
        setActiveLocation: h
    }
}
;
function Pf(n) {
    const a = Ae()
      , {getFromPath: s, activeLocation: o} = my();
    return H.useCallback(u => {
        const f = s(u.from ?? n?.from);
        return a.navigate({
            ...u,
            from: f
        })
    }
    , [n?.from, a, s, o])
}
var B4 = ty();
const wo = typeof window < "u" ? H.useLayoutEffect : H.useEffect;
function qc(n) {
    const a = H.useRef({
        value: n,
        prev: null
    })
      , s = a.current.value;
    return n !== s && (a.current = {
        value: n,
        prev: s
    }),
    a.current.prev
}
function U4(n, a, s={}, o={}) {
    H.useEffect( () => {
        if (!n.current || o.disabled || typeof IntersectionObserver != "function")
            return;
        const u = new IntersectionObserver( ([f]) => {
            a(f)
        }
        ,s);
        return u.observe(n.current),
        () => {
            u.disconnect()
        }
    }
    , [a, s, o.disabled, n])
}
function N4(n) {
    const a = H.useRef(null);
    return H.useImperativeHandle(n, () => a.current, []),
    a
}
function j4(n, a) {
    const s = Ae()
      , [o,u] = H.useState(!1)
      , f = H.useRef(!1)
      , h = N4(a)
      , {activeProps: p, inactiveProps: d, activeOptions: m, to: y, preload: g, preloadDelay: S, hashScrollIntoView: T, replace: C, startTransition: E, resetScroll: A, viewTransition: V, children: q, target: B, disabled: G, style: j, className: Z, onClick: Q, onFocus: K, onMouseEnter: tt, onMouseLeave: F, onTouchStart: rt, ignoreBlocker: ft, params: Gt, search: _t, hash: Lt, state: z, mask: k, reloadDocument: W, unsafeRelative: dt, from: R, _fromLocation: Y, ...J} = n
      , $ = H.useMemo( () => {
        try {
            return new URL(y),
            "external"
        } catch {}
        return "internal"
    }
    , [y])
      , nt = ce({
        select: Dt => Dt.location.search,
        structuralSharing: !0
    })
      , yt = ce({
        select: Dt => Dt.location,
        structuralSharing: !0
    })
      , {getFromPath: ot} = my()
      , ae = ot(n.from)
      , bt = H.useMemo( () => ({
        ...n,
        from: ae
    }), [s, yt, nt, ae, n._fromLocation, n.hash, n.to, n.search, n.params, n.state, n.mask, n.unsafeRelative])
      , se = H.useMemo( () => s.buildLocation({
        ...bt
    }), [s, bt])
      , si = $ === "external"
      , ke = n.reloadDocument || si ? !1 : g ?? s.options.defaultPreload
      , li = S ?? s.options.defaultPreloadDelay ?? 0
      , oi = ce({
        select: Dt => {
            if (si)
                return !1;
            if (m?.exact) {
                if (!V3(Dt.location.pathname, se.pathname, s.basepath))
                    return !1
            } else {
                const kt = Zo(Dt.location.pathname, s.basepath)
                  , Ut = Zo(se.pathname, s.basepath);
                if (!(kt.startsWith(Ut) && (kt.length === Ut.length || kt[Ut.length] === "/")))
                    return !1
            }
            return (m?.includeSearch ?? !0) && !Oi(Dt.location.search, se.search, {
                partial: !m?.exact,
                ignoreUndefined: !m?.explicitUndefined
            }) ? !1 : m?.includeHash ? Dt.location.hash === se.hash : !0
        }
    })
      , Xe = H.useCallback( () => {
        s.preloadRoute({
            ...bt
        }).catch(Dt => {
            console.warn(Dt),
            console.warn(T4)
        }
        )
    }
    , [s, bt])
      , hr = H.useCallback(Dt => {
        Dt?.isIntersecting && Xe()
    }
    , [Xe]);
    U4(h, hr, G4, {
        disabled: !!G || ke !== "viewport"
    }),
    H.useEffect( () => {
        f.current || !G && ke === "render" && (Xe(),
        f.current = !0)
    }
    , [G, Xe, ke]);
    const dr = Dt => {
        if (!G && !k4(Dt) && !Dt.defaultPrevented && (!B || B === "_self") && Dt.button === 0) {
            Dt.preventDefault(),
            B4.flushSync( () => {
                u(!0)
            }
            );
            const kt = s.subscribe("onResolved", () => {
                kt(),
                u(!1)
            }
            );
            s.navigate({
                ...bt,
                replace: C,
                resetScroll: A,
                hashScrollIntoView: T,
                startTransition: E,
                viewTransition: V,
                ignoreBlocker: ft
            })
        }
    }
    ;
    if (si)
        return {
            ...J,
            ref: h,
            type: $,
            href: y,
            ...q && {
                children: q
            },
            ...B && {
                target: B
            },
            ...G && {
                disabled: G
            },
            ...j && {
                style: j
            },
            ...Z && {
                className: Z
            },
            ...Q && {
                onClick: Q
            },
            ...K && {
                onFocus: K
            },
            ...tt && {
                onMouseEnter: tt
            },
            ...F && {
                onMouseLeave: F
            },
            ...rt && {
                onTouchStart: rt
            }
        };
    const Se = Dt => {
        G || ke && Xe()
    }
      , mr = Se
      , dl = Dt => {
        if (!(G || !ke))
            if (!li)
                Xe();
            else {
                const kt = Dt.target;
                if (qs.has(kt))
                    return;
                const Ut = setTimeout( () => {
                    qs.delete(kt),
                    Xe()
                }
                , li);
                qs.set(kt, Ut)
            }
    }
      , ml = Dt => {
        if (G || !ke || !li)
            return;
        const kt = Dt.target
          , Ut = qs.get(kt);
        Ut && (clearTimeout(Ut),
        qs.delete(kt))
    }
      , on = oi ? Li(p, {}) ?? P4 : Yc
      , Ni = oi ? Yc : Li(d, {}) ?? Yc
      , qa = [Z, on.className, Ni.className].filter(Boolean).join(" ")
      , pl = (j || on.style || Ni.style) && {
        ...j,
        ...on.style,
        ...Ni.style
    };
    return {
        ...J,
        ...on,
        ...Ni,
        href: G ? void 0 : se.maskedLocation ? s.history.createHref(se.maskedLocation.href) : s.history.createHref(se.href),
        ref: h,
        onClick: Ys([Q, dr]),
        onFocus: Ys([K, Se]),
        onMouseEnter: Ys([tt, dl]),
        onMouseLeave: Ys([F, ml]),
        onTouchStart: Ys([rt, mr]),
        disabled: !!G,
        target: B,
        ...pl && {
            style: pl
        },
        ...qa && {
            className: qa
        },
        ...G && H4,
        ...oi && q4,
        ...o && Y4
    }
}
const Yc = {}
  , P4 = {
    className: "active"
}
  , H4 = {
    role: "link",
    "aria-disabled": !0
}
  , q4 = {
    "data-status": "active",
    "aria-current": "page"
}
  , Y4 = {
    "data-transitioning": "transitioning"
}
  , qs = new WeakMap
  , G4 = {
    rootMargin: "100px"
}
  , Ys = n => a => {
    n.filter(Boolean).forEach(s => {
        a.defaultPrevented || s(a)
    }
    )
}
  , py = H.forwardRef( (n, a) => {
    const {_asChild: s, ...o} = n
      , {type: u, ref: f, ...h} = j4(o, a)
      , p = typeof o.children == "function" ? o.children({
        isActive: h["data-status"] === "active"
    }) : o.children;
    return s === void 0 && delete h.disabled,
    H.createElement(s || "a", {
        ...h,
        ref: f
    }, p)
}
);
function k4(n) {
    return !!(n.metaKey || n.altKey || n.ctrlKey || n.shiftKey)
}
let X4 = class extends hy {
    constructor(a) {
        super(a),
        this.useMatch = s => $e({
            select: s?.select,
            from: this.id,
            structuralSharing: s?.structuralSharing
        }),
        this.useRouteContext = s => $e({
            ...s,
            from: this.id,
            select: o => s?.select ? s.select(o.context) : o.context
        }),
        this.useSearch = s => jf({
            select: s?.select,
            structuralSharing: s?.structuralSharing,
            from: this.id
        }),
        this.useParams = s => Nf({
            select: s?.select,
            structuralSharing: s?.structuralSharing,
            from: this.id
        }),
        this.useLoaderDeps = s => Uf({
            ...s,
            from: this.id
        }),
        this.useLoaderData = s => Bf({
            ...s,
            from: this.id
        }),
        this.useNavigate = () => Pf({
            from: this.fullPath
        }),
        this.Link = tl.forwardRef( (s, o) => X.jsx(py, {
            ref: o,
            from: this.fullPath,
            ...s
        })),
        this.$$typeof = Symbol.for("react.memo")
    }
}
;
function K4(n) {
    return new X4(n)
}
class Z4 extends C4 {
    constructor(a) {
        super(a),
        this.useMatch = s => $e({
            select: s?.select,
            from: this.id,
            structuralSharing: s?.structuralSharing
        }),
        this.useRouteContext = s => $e({
            ...s,
            from: this.id,
            select: o => s?.select ? s.select(o.context) : o.context
        }),
        this.useSearch = s => jf({
            select: s?.select,
            structuralSharing: s?.structuralSharing,
            from: this.id
        }),
        this.useParams = s => Nf({
            select: s?.select,
            structuralSharing: s?.structuralSharing,
            from: this.id
        }),
        this.useLoaderDeps = s => Uf({
            ...s,
            from: this.id
        }),
        this.useLoaderData = s => Bf({
            ...s,
            from: this.id
        }),
        this.useNavigate = () => Pf({
            from: this.fullPath
        }),
        this.Link = tl.forwardRef( (s, o) => X.jsx(py, {
            ref: o,
            from: this.fullPath,
            ...s
        })),
        this.$$typeof = Symbol.for("react.memo")
    }
}
function Q4(n) {
    return new Z4(n)
}
function Wo(n) {
    return typeof n == "object" ? new z0(n,{
        silent: !0
    }).createRoute(n) : new z0(n,{
        silent: !0
    }).createRoute
}
class z0 {
    constructor(a, s) {
        this.path = a,
        this.createRoute = o => {
            this.silent;
            const u = K4(o);
            return u.isRoot = !1,
            u
        }
        ,
        this.silent = s?.silent
    }
}
class B0 {
    constructor(a) {
        this.useMatch = s => $e({
            select: s?.select,
            from: this.options.id,
            structuralSharing: s?.structuralSharing
        }),
        this.useRouteContext = s => $e({
            from: this.options.id,
            select: o => s?.select ? s.select(o.context) : o.context
        }),
        this.useSearch = s => jf({
            select: s?.select,
            structuralSharing: s?.structuralSharing,
            from: this.options.id
        }),
        this.useParams = s => Nf({
            select: s?.select,
            structuralSharing: s?.structuralSharing,
            from: this.options.id
        }),
        this.useLoaderDeps = s => Uf({
            ...s,
            from: this.options.id
        }),
        this.useLoaderData = s => Bf({
            ...s,
            from: this.options.id
        }),
        this.useNavigate = () => {
            const s = Ae();
            return Pf({
                from: s.routesById[this.options.id].fullPath
            })
        }
        ,
        this.options = a,
        this.$$typeof = Symbol.for("react.memo")
    }
}
function U0(n) {
    return typeof n == "object" ? new B0(n) : a => new B0({
        id: n,
        ...a
    })
}
function yy(n, a) {
    let s, o, u, f;
    const h = () => (s || (s = n().then(d => {
        s = void 0,
        o = d[a]
    }
    ).catch(d => {
        if (u = d,
        O3(u) && u instanceof Error && typeof window < "u" && typeof sessionStorage < "u") {
            const m = `tanstack_router_reload:${u.message}`;
            sessionStorage.getItem(m) || (sessionStorage.setItem(m, "1"),
            f = !0)
        }
    }
    )),
    s)
      , p = function(m) {
        if (f)
            throw window.location.reload(),
            new Promise( () => {}
            );
        if (u)
            throw u;
        if (!o)
            throw h();
        return H.createElement(o, m)
    };
    return p.preload = h,
    p
}
function F4() {
    const n = Ae()
      , a = H.useRef({
        router: n,
        mounted: !1
    })
      , [s,o] = H.useState(!1)
      , {hasPendingMatches: u, isLoading: f} = ce({
        select: g => ({
            isLoading: g.isLoading,
            hasPendingMatches: g.matches.some(S => S.status === "pending")
        }),
        structuralSharing: !0
    })
      , h = qc(f)
      , p = f || s || u
      , d = qc(p)
      , m = f || u
      , y = qc(m);
    return n.startTransition = g => {
        o(!0),
        H.startTransition( () => {
            g(),
            o(!1)
        }
        )
    }
    ,
    H.useEffect( () => {
        const g = n.history.subscribe(n.load)
          , S = n.buildLocation({
            to: n.latestLocation.pathname,
            search: !0,
            params: !0,
            hash: !0,
            state: !0,
            _includeValidateSearch: !0
        });
        return za(n.latestLocation.href) !== za(S.href) && n.commitLocation({
            ...S,
            replace: !0
        }),
        () => {
            g()
        }
    }
    , [n, n.history]),
    wo( () => {
        if (typeof window < "u" && n.ssr || a.current.router === n && a.current.mounted)
            return;
        a.current = {
            router: n,
            mounted: !0
        },
        (async () => {
            try {
                await n.load()
            } catch (S) {
                console.error(S)
            }
        }
        )()
    }
    , [n]),
    wo( () => {
        h && !f && n.emit({
            type: "onLoad",
            ...Vi(n.state)
        })
    }
    , [h, n, f]),
    wo( () => {
        y && !m && n.emit({
            type: "onBeforeRouteMount",
            ...Vi(n.state)
        })
    }
    , [m, y, n]),
    wo( () => {
        d && !p && (n.emit({
            type: "onResolved",
            ...Vi(n.state)
        }),
        n.__store.setState(g => ({
            ...g,
            status: "idle",
            resolvedLocation: g.location
        })),
        F3(n))
    }
    , [p, d, n]),
    null
}
function $4(n) {
    const a = ce({
        select: s => `not-found-${s.location.pathname}-${s.status}`
    });
    return X.jsx(zf, {
        getResetKey: () => a,
        onCatch: (s, o) => {
            var u;
            if (ln(s))
                (u = n.onCatch) == null || u.call(n, s, o);
            else
                throw s
        }
        ,
        errorComponent: ({error: s}) => {
            var o;
            if (ln(s))
                return (o = n.fallback) == null ? void 0 : o.call(n, s);
            throw s
        }
        ,
        children: n.children
    })
}
function J4() {
    return X.jsx("p", {
        children: "Not Found"
    })
}
function xa(n) {
    return X.jsx(X.Fragment, {
        children: n.children
    })
}
function vy(n, a, s) {
    return a.options.notFoundComponent ? X.jsx(a.options.notFoundComponent, {
        data: s
    }) : n.options.defaultNotFoundComponent ? X.jsx(n.options.defaultNotFoundComponent, {
        data: s
    }) : X.jsx(J4, {})
}
function W4({children: n}) {
    return typeof document < "u" ? null : X.jsx("script", {
        className: "$tsr",
        dangerouslySetInnerHTML: {
            __html: [n].filter(Boolean).join(`
`)
        }
    })
}
function I4() {
    const n = Ae()
      , s = (n.options.getScrollRestorationKey || rf)(n.latestLocation)
      , o = s !== rf(n.latestLocation) ? s : void 0;
    if (!n.isScrollRestoring || !n.isServer)
        return null;
    const u = {
        storageKey: Fo,
        shouldScrollRestoration: !0
    };
    return o && (u.key = o),
    X.jsx(W4, {
        children: `(${ay.toString()})(${JSON.stringify(u)})`
    })
}
const gy = H.memo(function({matchId: a}) {
    var s, o;
    const u = Ae()
      , f = ce({
        select: B => {
            const G = B.matches.find(j => j.id === a);
            return En(G),
            {
                routeId: G.routeId,
                ssr: G.ssr,
                _displayPending: G._displayPending
            }
        }
        ,
        structuralSharing: !0
    })
      , h = u.routesById[f.routeId]
      , p = h.options.pendingComponent ?? u.options.defaultPendingComponent
      , d = p ? X.jsx(p, {}) : null
      , m = h.options.errorComponent ?? u.options.defaultErrorComponent
      , y = h.options.onCatch ?? u.options.defaultOnCatch
      , g = h.isRoot ? h.options.notFoundComponent ?? ((s = u.options.notFoundRoute) == null ? void 0 : s.options.component) : h.options.notFoundComponent
      , S = f.ssr === !1 || f.ssr === "data-only"
      , T = (!h.isRoot || h.options.wrapInSuspense || S) && (h.options.wrapInSuspense ?? p ?? (((o = h.options.errorComponent) == null ? void 0 : o.preload) || S)) ? H.Suspense : xa
      , C = m ? zf : xa
      , E = g ? $4 : xa
      , A = ce({
        select: B => B.loadedAt
    })
      , V = ce({
        select: B => {
            var G;
            const j = B.matches.findIndex(Z => Z.id === a);
            return (G = B.matches[j - 1]) == null ? void 0 : G.routeId
        }
    })
      , q = h.isRoot ? h.options.shellComponent ?? xa : xa;
    return X.jsxs(q, {
        children: [X.jsx(or.Provider, {
            value: a,
            children: X.jsx(T, {
                fallback: d,
                children: X.jsx(C, {
                    getResetKey: () => A,
                    errorComponent: m || lr,
                    onCatch: (B, G) => {
                        if (ln(B))
                            throw B;
                        y?.(B, G)
                    }
                    ,
                    children: X.jsx(E, {
                        fallback: B => {
                            if (!g || B.routeId && B.routeId !== f.routeId || !B.routeId && !h.isRoot)
                                throw B;
                            return H.createElement(g, B)
                        }
                        ,
                        children: S || f._displayPending ? X.jsx(R4, {
                            fallback: d,
                            children: X.jsx(N0, {
                                matchId: a
                            })
                        }) : X.jsx(N0, {
                            matchId: a
                        })
                    })
                })
            })
        }), V === qe && u.options.scrollRestoration ? X.jsxs(X.Fragment, {
            children: [X.jsx(t5, {}), X.jsx(I4, {})]
        }) : null]
    })
});
function t5() {
    const n = Ae()
      , a = H.useRef(void 0);
    return X.jsx("script", {
        suppressHydrationWarning: !0,
        ref: s => {
            s && (a.current === void 0 || a.current.href !== n.latestLocation.href) && (n.emit({
                type: "onRendered",
                ...Vi(n.state)
            }),
            a.current = n.latestLocation)
        }
    }, n.latestLocation.state.__TSR_key)
}
const N0 = H.memo(function({matchId: a}) {
    var s, o, u, f;
    const h = Ae()
      , {match: p, key: d, routeId: m} = ce({
        select: S => {
            const T = S.matches.find(q => q.id === a)
              , C = T.routeId
              , E = h.routesById[C].options.remountDeps ?? h.options.defaultRemountDeps
              , A = E?.({
                routeId: C,
                loaderDeps: T.loaderDeps,
                params: T._strictParams,
                search: T._strictSearch
            });
            return {
                key: A ? JSON.stringify(A) : void 0,
                routeId: C,
                match: {
                    id: T.id,
                    status: T.status,
                    error: T.error,
                    _forcePending: T._forcePending,
                    _displayPending: T._displayPending
                }
            }
        }
        ,
        structuralSharing: !0
    })
      , y = h.routesById[m]
      , g = H.useMemo( () => {
        const S = y.options.component ?? h.options.defaultComponent;
        return S ? X.jsx(S, {}, d) : X.jsx(Sy, {})
    }
    , [d, y.options.component, h.options.defaultComponent]);
    if (p._displayPending)
        throw (s = h.getMatch(p.id)) == null ? void 0 : s._nonReactive.displayPendingPromise;
    if (p._forcePending)
        throw (o = h.getMatch(p.id)) == null ? void 0 : o._nonReactive.minPendingPromise;
    if (p.status === "pending") {
        const S = y.options.pendingMinMs ?? h.options.defaultPendingMinMs;
        if (S) {
            const T = h.getMatch(p.id);
            if (T && !T._nonReactive.minPendingPromise && !h.isServer) {
                const C = Va();
                T._nonReactive.minPendingPromise = C,
                setTimeout( () => {
                    C.resolve(),
                    T._nonReactive.minPendingPromise = void 0
                }
                , S)
            }
        }
        throw (u = h.getMatch(p.id)) == null ? void 0 : u._nonReactive.loadPromise
    }
    if (p.status === "notFound")
        return En(ln(p.error)),
        vy(h, y, p.error);
    if (p.status === "redirected")
        throw En(nn(p.error)),
        (f = h.getMatch(p.id)) == null ? void 0 : f._nonReactive.loadPromise;
    if (p.status === "error") {
        if (h.isServer) {
            const S = (y.options.errorComponent ?? h.options.defaultErrorComponent) || lr;
            return X.jsx(S, {
                error: p.error,
                reset: void 0,
                info: {
                    componentStack: ""
                }
            })
        }
        throw p.error
    }
    return g
})
  , Sy = H.memo(function() {
    const a = Ae()
      , s = H.useContext(or)
      , o = ce({
        select: m => {
            var y;
            return (y = m.matches.find(g => g.id === s)) == null ? void 0 : y.routeId
        }
    })
      , u = a.routesById[o]
      , f = ce({
        select: m => {
            const g = m.matches.find(S => S.id === s);
            return En(g),
            g.globalNotFound
        }
    })
      , h = ce({
        select: m => {
            var y;
            const g = m.matches
              , S = g.findIndex(T => T.id === s);
            return (y = g[S + 1]) == null ? void 0 : y.id
        }
    })
      , p = a.options.defaultPendingComponent ? X.jsx(a.options.defaultPendingComponent, {}) : null;
    if (f)
        return vy(a, u, void 0);
    if (!h)
        return null;
    const d = X.jsx(gy, {
        matchId: h
    });
    return s === qe ? X.jsx(H.Suspense, {
        fallback: p,
        children: d
    }) : d
});
function e5() {
    const n = Ae()
      , a = n.options.defaultPendingComponent ? X.jsx(n.options.defaultPendingComponent, {}) : null
      , s = n.isServer || typeof document < "u" && n.ssr ? xa : H.Suspense
      , o = X.jsxs(s, {
        fallback: a,
        children: [!n.isServer && X.jsx(F4, {}), X.jsx(n5, {})]
    });
    return n.options.InnerWrap ? X.jsx(n.options.InnerWrap, {
        children: o
    }) : o
}
function n5() {
    const n = Ae()
      , a = ce({
        select: u => {
            var f;
            return (f = u.matches[0]) == null ? void 0 : f.id
        }
    })
      , s = ce({
        select: u => u.loadedAt
    })
      , o = a ? X.jsx(gy, {
        matchId: a
    }) : null;
    return X.jsx(or.Provider, {
        value: a,
        children: n.options.disableGlobalCatchBoundary ? o : X.jsx(zf, {
            getResetKey: () => s,
            errorComponent: lr,
            onCatch: u => {
                u.message || u.toString()
            }
            ,
            children: o
        })
    })
}
const i5 = n => new a5(n);
class a5 extends u4 {
    constructor(a) {
        super(a)
    }
}
typeof globalThis < "u" ? (globalThis.createFileRoute = Wo,
globalThis.createLazyFileRoute = U0) : typeof window < "u" && (window.createFileRoute = Wo,
window.createLazyFileRoute = U0);
function s5({router: n, children: a, ...s}) {
    Object.keys(s).length > 0 && n.update({
        ...n.options,
        ...s,
        context: {
            ...n.options.context,
            ...s.context
        }
    });
    const o = dy()
      , u = X.jsx(o.Provider, {
        value: n,
        children: a
    });
    return n.options.Wrap ? X.jsx(n.options.Wrap, {
        children: u
    }) : u
}
function l5({router: n, ...a}) {
    return X.jsx(s5, {
        router: n,
        ...a,
        children: X.jsx(e5, {})
    })
}
const Hf = H.createContext({});
function qf(n) {
    const a = H.useRef(null);
    return a.current === null && (a.current = n()),
    a.current
}
const Yf = typeof window < "u"
  , by = Yf ? H.useLayoutEffect : H.useEffect
  , rr = H.createContext(null);
function Gf(n, a) {
    n.indexOf(a) === -1 && n.push(a)
}
function kf(n, a) {
    const s = n.indexOf(a);
    s > -1 && n.splice(s, 1)
}
const _n = (n, a, s) => s > a ? a : s < n ? n : s;
let Xf = () => {}
;
const An = {}
  , Ty = n => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n);
function Cy(n) {
    return typeof n == "object" && n !== null
}
const xy = n => /^0[^.\s]+$/u.test(n);
function Kf(n) {
    let a;
    return () => (a === void 0 && (a = n()),
    a)
}
const Ge = n => n
  , o5 = (n, a) => s => a(n(s))
  , ul = (...n) => n.reduce(o5)
  , nl = (n, a, s) => {
    const o = a - n;
    return o === 0 ? 1 : (s - n) / o
}
;
class Zf {
    constructor() {
        this.subscriptions = []
    }
    add(a) {
        return Gf(this.subscriptions, a),
        () => kf(this.subscriptions, a)
    }
    notify(a, s, o) {
        const u = this.subscriptions.length;
        if (u)
            if (u === 1)
                this.subscriptions[0](a, s, o);
            else
                for (let f = 0; f < u; f++) {
                    const h = this.subscriptions[f];
                    h && h(a, s, o)
                }
    }
    getSize() {
        return this.subscriptions.length
    }
    clear() {
        this.subscriptions.length = 0
    }
}
const an = n => n * 1e3
  , Ye = n => n / 1e3;
function Ry(n, a) {
    return a ? n * (1e3 / a) : 0
}
const My = (n, a, s) => (((1 - 3 * s + 3 * a) * n + (3 * s - 6 * a)) * n + 3 * a) * n
  , r5 = 1e-7
  , u5 = 12;
function c5(n, a, s, o, u) {
    let f, h, p = 0;
    do
        h = a + (s - a) / 2,
        f = My(h, o, u) - n,
        f > 0 ? s = h : a = h;
    while (Math.abs(f) > r5 && ++p < u5);
    return h
}
function cl(n, a, s, o) {
    if (n === a && s === o)
        return Ge;
    const u = f => c5(f, 0, 1, n, s);
    return f => f === 0 || f === 1 ? f : My(u(f), a, o)
}
const Ey = n => a => a <= .5 ? n(2 * a) / 2 : (2 - n(2 * (1 - a))) / 2
  , _y = n => a => 1 - n(1 - a)
  , Ay = cl(.33, 1.53, .69, .99)
  , Qf = _y(Ay)
  , Dy = Ey(Qf)
  , Ly = n => (n *= 2) < 1 ? .5 * Qf(n) : .5 * (2 - Math.pow(2, -10 * (n - 1)))
  , Ff = n => 1 - Math.sin(Math.acos(n))
  , Oy = _y(Ff)
  , Vy = Ey(Ff)
  , f5 = cl(.42, 0, 1, 1)
  , h5 = cl(0, 0, .58, 1)
  , Io = cl(.42, 0, .58, 1)
  , d5 = n => Array.isArray(n) && typeof n[0] != "number"
  , wy = n => Array.isArray(n) && typeof n[0] == "number"
  , m5 = {
    linear: Ge,
    easeIn: f5,
    easeInOut: Io,
    easeOut: h5,
    circIn: Ff,
    circInOut: Vy,
    circOut: Oy,
    backIn: Qf,
    backInOut: Dy,
    backOut: Ay,
    anticipate: Ly
}
  , p5 = n => typeof n == "string"
  , j0 = n => {
    if (wy(n)) {
        Xf(n.length === 4);
        const [a,s,o,u] = n;
        return cl(a, s, o, u)
    } else if (p5(n))
        return m5[n];
    return n
}
  , zo = ["setup", "read", "resolveKeyframes", "preUpdate", "update", "preRender", "render", "postRender"];
function y5(n, a) {
    let s = new Set
      , o = new Set
      , u = !1
      , f = !1;
    const h = new WeakSet;
    let p = {
        delta: 0,
        timestamp: 0,
        isProcessing: !1
    };
    function d(y) {
        h.has(y) && (m.schedule(y),
        n()),
        y(p)
    }
    const m = {
        schedule: (y, g=!1, S=!1) => {
            const C = S && u ? s : o;
            return g && h.add(y),
            C.has(y) || C.add(y),
            y
        }
        ,
        cancel: y => {
            o.delete(y),
            h.delete(y)
        }
        ,
        process: y => {
            if (p = y,
            u) {
                f = !0;
                return
            }
            u = !0,
            [s,o] = [o, s],
            s.forEach(d),
            s.clear(),
            u = !1,
            f && (f = !1,
            m.process(y))
        }
    };
    return m
}
const v5 = 40;
function zy(n, a) {
    let s = !1
      , o = !0;
    const u = {
        delta: 0,
        timestamp: 0,
        isProcessing: !1
    }
      , f = () => s = !0
      , h = zo.reduce( (B, G) => (B[G] = y5(f),
    B), {})
      , {setup: p, read: d, resolveKeyframes: m, preUpdate: y, update: g, preRender: S, render: T, postRender: C} = h
      , E = () => {
        const B = An.useManualTiming ? u.timestamp : performance.now();
        s = !1,
        An.useManualTiming || (u.delta = o ? 1e3 / 60 : Math.max(Math.min(B - u.timestamp, v5), 1)),
        u.timestamp = B,
        u.isProcessing = !0,
        p.process(u),
        d.process(u),
        m.process(u),
        y.process(u),
        g.process(u),
        S.process(u),
        T.process(u),
        C.process(u),
        u.isProcessing = !1,
        s && a && (o = !1,
        n(E))
    }
      , A = () => {
        s = !0,
        o = !0,
        u.isProcessing || n(E)
    }
    ;
    return {
        schedule: zo.reduce( (B, G) => {
            const j = h[G];
            return B[G] = (Z, Q=!1, K=!1) => (s || A(),
            j.schedule(Z, Q, K)),
            B
        }
        , {}),
        cancel: B => {
            for (let G = 0; G < zo.length; G++)
                h[zo[G]].cancel(B)
        }
        ,
        state: u,
        steps: h
    }
}
const {schedule: Vt, cancel: ni, state: ie, steps: Gc} = zy(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ge, !0);
let Ho;
function g5() {
    Ho = void 0
}
const ge = {
    now: () => (Ho === void 0 && ge.set(ie.isProcessing || An.useManualTiming ? ie.timestamp : performance.now()),
    Ho),
    set: n => {
        Ho = n,
        queueMicrotask(g5)
    }
}
  , By = n => a => typeof a == "string" && a.startsWith(n)
  , $f = By("--")
  , S5 = By("var(--")
  , Jf = n => S5(n) ? b5.test(n.split("/*")[0].trim()) : !1
  , b5 = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu
  , ja = {
    test: n => typeof n == "number",
    parse: parseFloat,
    transform: n => n
}
  , il = {
    ...ja,
    transform: n => _n(0, 1, n)
}
  , Bo = {
    ...ja,
    default: 1
}
  , Fs = n => Math.round(n * 1e5) / 1e5
  , Wf = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function T5(n) {
    return n == null
}
const C5 = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu
  , If = (n, a) => s => !!(typeof s == "string" && C5.test(s) && s.startsWith(n) || a && !T5(s) && Object.prototype.hasOwnProperty.call(s, a))
  , Uy = (n, a, s) => o => {
    if (typeof o != "string")
        return o;
    const [u,f,h,p] = o.match(Wf);
    return {
        [n]: parseFloat(u),
        [a]: parseFloat(f),
        [s]: parseFloat(h),
        alpha: p !== void 0 ? parseFloat(p) : 1
    }
}
  , x5 = n => _n(0, 255, n)
  , kc = {
    ...ja,
    transform: n => Math.round(x5(n))
}
  , Ai = {
    test: If("rgb", "red"),
    parse: Uy("red", "green", "blue"),
    transform: ({red: n, green: a, blue: s, alpha: o=1}) => "rgba(" + kc.transform(n) + ", " + kc.transform(a) + ", " + kc.transform(s) + ", " + Fs(il.transform(o)) + ")"
};
function R5(n) {
    let a = ""
      , s = ""
      , o = ""
      , u = "";
    return n.length > 5 ? (a = n.substring(1, 3),
    s = n.substring(3, 5),
    o = n.substring(5, 7),
    u = n.substring(7, 9)) : (a = n.substring(1, 2),
    s = n.substring(2, 3),
    o = n.substring(3, 4),
    u = n.substring(4, 5),
    a += a,
    s += s,
    o += o,
    u += u),
    {
        red: parseInt(a, 16),
        green: parseInt(s, 16),
        blue: parseInt(o, 16),
        alpha: u ? parseInt(u, 16) / 255 : 1
    }
}
const cf = {
    test: If("#"),
    parse: R5,
    transform: Ai.transform
}
  , fl = n => ({
    test: a => typeof a == "string" && a.endsWith(n) && a.split(" ").length === 1,
    parse: parseFloat,
    transform: a => `${a}${n}`
})
  , Wn = fl("deg")
  , sn = fl("%")
  , lt = fl("px")
  , M5 = fl("vh")
  , E5 = fl("vw")
  , P0 = {
    ...sn,
    parse: n => sn.parse(n) / 100,
    transform: n => sn.transform(n * 100)
}
  , Ra = {
    test: If("hsl", "hue"),
    parse: Uy("hue", "saturation", "lightness"),
    transform: ({hue: n, saturation: a, lightness: s, alpha: o=1}) => "hsla(" + Math.round(n) + ", " + sn.transform(Fs(a)) + ", " + sn.transform(Fs(s)) + ", " + Fs(il.transform(o)) + ")"
}
  , Zt = {
    test: n => Ai.test(n) || cf.test(n) || Ra.test(n),
    parse: n => Ai.test(n) ? Ai.parse(n) : Ra.test(n) ? Ra.parse(n) : cf.parse(n),
    transform: n => typeof n == "string" ? n : n.hasOwnProperty("red") ? Ai.transform(n) : Ra.transform(n),
    getAnimatableNone: n => {
        const a = Zt.parse(n);
        return a.alpha = 0,
        Zt.transform(a)
    }
}
  , _5 = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function A5(n) {
    return isNaN(n) && typeof n == "string" && (n.match(Wf)?.length || 0) + (n.match(_5)?.length || 0) > 0
}
const Ny = "number"
  , jy = "color"
  , D5 = "var"
  , L5 = "var("
  , H0 = "${}"
  , O5 = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function al(n) {
    const a = n.toString()
      , s = []
      , o = {
        color: [],
        number: [],
        var: []
    }
      , u = [];
    let f = 0;
    const p = a.replace(O5, d => (Zt.test(d) ? (o.color.push(f),
    u.push(jy),
    s.push(Zt.parse(d))) : d.startsWith(L5) ? (o.var.push(f),
    u.push(D5),
    s.push(d)) : (o.number.push(f),
    u.push(Ny),
    s.push(parseFloat(d))),
    ++f,
    H0)).split(H0);
    return {
        values: s,
        split: p,
        indexes: o,
        types: u
    }
}
function Py(n) {
    return al(n).values
}
function Hy(n) {
    const {split: a, types: s} = al(n)
      , o = a.length;
    return u => {
        let f = "";
        for (let h = 0; h < o; h++)
            if (f += a[h],
            u[h] !== void 0) {
                const p = s[h];
                p === Ny ? f += Fs(u[h]) : p === jy ? f += Zt.transform(u[h]) : f += u[h]
            }
        return f
    }
}
const V5 = n => typeof n == "number" ? 0 : Zt.test(n) ? Zt.getAnimatableNone(n) : n;
function w5(n) {
    const a = Py(n);
    return Hy(n)(a.map(V5))
}
const ii = {
    test: A5,
    parse: Py,
    createTransformer: Hy,
    getAnimatableNone: w5
};
function Xc(n, a, s) {
    return s < 0 && (s += 1),
    s > 1 && (s -= 1),
    s < 1 / 6 ? n + (a - n) * 6 * s : s < 1 / 2 ? a : s < 2 / 3 ? n + (a - n) * (2 / 3 - s) * 6 : n
}
function z5({hue: n, saturation: a, lightness: s, alpha: o}) {
    n /= 360,
    a /= 100,
    s /= 100;
    let u = 0
      , f = 0
      , h = 0;
    if (!a)
        u = f = h = s;
    else {
        const p = s < .5 ? s * (1 + a) : s + a - s * a
          , d = 2 * s - p;
        u = Xc(d, p, n + 1 / 3),
        f = Xc(d, p, n),
        h = Xc(d, p, n - 1 / 3)
    }
    return {
        red: Math.round(u * 255),
        green: Math.round(f * 255),
        blue: Math.round(h * 255),
        alpha: o
    }
}
function tr(n, a) {
    return s => s > 0 ? a : n
}
const Bt = (n, a, s) => n + (a - n) * s
  , Kc = (n, a, s) => {
    const o = n * n
      , u = s * (a * a - o) + o;
    return u < 0 ? 0 : Math.sqrt(u)
}
  , B5 = [cf, Ai, Ra]
  , U5 = n => B5.find(a => a.test(n));
function q0(n) {
    const a = U5(n);
    if (!a)
        return !1;
    let s = a.parse(n);
    return a === Ra && (s = z5(s)),
    s
}
const Y0 = (n, a) => {
    const s = q0(n)
      , o = q0(a);
    if (!s || !o)
        return tr(n, a);
    const u = {
        ...s
    };
    return f => (u.red = Kc(s.red, o.red, f),
    u.green = Kc(s.green, o.green, f),
    u.blue = Kc(s.blue, o.blue, f),
    u.alpha = Bt(s.alpha, o.alpha, f),
    Ai.transform(u))
}
  , ff = new Set(["none", "hidden"]);
function N5(n, a) {
    return ff.has(n) ? s => s <= 0 ? n : a : s => s >= 1 ? a : n
}
function j5(n, a) {
    return s => Bt(n, a, s)
}
function th(n) {
    return typeof n == "number" ? j5 : typeof n == "string" ? Jf(n) ? tr : Zt.test(n) ? Y0 : q5 : Array.isArray(n) ? qy : typeof n == "object" ? Zt.test(n) ? Y0 : P5 : tr
}
function qy(n, a) {
    const s = [...n]
      , o = s.length
      , u = n.map( (f, h) => th(f)(f, a[h]));
    return f => {
        for (let h = 0; h < o; h++)
            s[h] = u[h](f);
        return s
    }
}
function P5(n, a) {
    const s = {
        ...n,
        ...a
    }
      , o = {};
    for (const u in s)
        n[u] !== void 0 && a[u] !== void 0 && (o[u] = th(n[u])(n[u], a[u]));
    return u => {
        for (const f in o)
            s[f] = o[f](u);
        return s
    }
}
function H5(n, a) {
    const s = []
      , o = {
        color: 0,
        var: 0,
        number: 0
    };
    for (let u = 0; u < a.values.length; u++) {
        const f = a.types[u]
          , h = n.indexes[f][o[f]]
          , p = n.values[h] ?? 0;
        s[u] = p,
        o[f]++
    }
    return s
}
const q5 = (n, a) => {
    const s = ii.createTransformer(a)
      , o = al(n)
      , u = al(a);
    return o.indexes.var.length === u.indexes.var.length && o.indexes.color.length === u.indexes.color.length && o.indexes.number.length >= u.indexes.number.length ? ff.has(n) && !u.values.length || ff.has(a) && !o.values.length ? N5(n, a) : ul(qy(H5(o, u), u.values), s) : tr(n, a)
}
;
function Yy(n, a, s) {
    return typeof n == "number" && typeof a == "number" && typeof s == "number" ? Bt(n, a, s) : th(n)(n, a)
}
const Y5 = n => {
    const a = ({timestamp: s}) => n(s);
    return {
        start: (s=!0) => Vt.update(a, s),
        stop: () => ni(a),
        now: () => ie.isProcessing ? ie.timestamp : ge.now()
    }
}
  , Gy = (n, a, s=10) => {
    let o = "";
    const u = Math.max(Math.round(a / s), 2);
    for (let f = 0; f < u; f++)
        o += Math.round(n(f / (u - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${o.substring(0, o.length - 2)})`
}
  , er = 2e4;
function eh(n) {
    let a = 0;
    const s = 50;
    let o = n.next(a);
    for (; !o.done && a < er; )
        a += s,
        o = n.next(a);
    return a >= er ? 1 / 0 : a
}
function G5(n, a=100, s) {
    const o = s({
        ...n,
        keyframes: [0, a]
    })
      , u = Math.min(eh(o), er);
    return {
        type: "keyframes",
        ease: f => o.next(u * f).value / a,
        duration: Ye(u)
    }
}
const k5 = 5;
function ky(n, a, s) {
    const o = Math.max(a - k5, 0);
    return Ry(s - n(o), a - o)
}
const Pt = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: .3,
    visualDuration: .3,
    restSpeed: {
        granular: .01,
        default: 2
    },
    restDelta: {
        granular: .005,
        default: .5
    },
    minDuration: .01,
    maxDuration: 10,
    minDamping: .05,
    maxDamping: 1
}
  , Zc = .001;
function X5({duration: n=Pt.duration, bounce: a=Pt.bounce, velocity: s=Pt.velocity, mass: o=Pt.mass}) {
    let u, f, h = 1 - a;
    h = _n(Pt.minDamping, Pt.maxDamping, h),
    n = _n(Pt.minDuration, Pt.maxDuration, Ye(n)),
    h < 1 ? (u = m => {
        const y = m * h
          , g = y * n
          , S = y - s
          , T = hf(m, h)
          , C = Math.exp(-g);
        return Zc - S / T * C
    }
    ,
    f = m => {
        const g = m * h * n
          , S = g * s + s
          , T = Math.pow(h, 2) * Math.pow(m, 2) * n
          , C = Math.exp(-g)
          , E = hf(Math.pow(m, 2), h);
        return (-u(m) + Zc > 0 ? -1 : 1) * ((S - T) * C) / E
    }
    ) : (u = m => {
        const y = Math.exp(-m * n)
          , g = (m - s) * n + 1;
        return -Zc + y * g
    }
    ,
    f = m => {
        const y = Math.exp(-m * n)
          , g = (s - m) * (n * n);
        return y * g
    }
    );
    const p = 5 / n
      , d = Z5(u, f, p);
    if (n = an(n),
    isNaN(d))
        return {
            stiffness: Pt.stiffness,
            damping: Pt.damping,
            duration: n
        };
    {
        const m = Math.pow(d, 2) * o;
        return {
            stiffness: m,
            damping: h * 2 * Math.sqrt(o * m),
            duration: n
        }
    }
}
const K5 = 12;
function Z5(n, a, s) {
    let o = s;
    for (let u = 1; u < K5; u++)
        o = o - n(o) / a(o);
    return o
}
function hf(n, a) {
    return n * Math.sqrt(1 - a * a)
}
const Q5 = ["duration", "bounce"]
  , F5 = ["stiffness", "damping", "mass"];
function G0(n, a) {
    return a.some(s => n[s] !== void 0)
}
function $5(n) {
    let a = {
        velocity: Pt.velocity,
        stiffness: Pt.stiffness,
        damping: Pt.damping,
        mass: Pt.mass,
        isResolvedFromDuration: !1,
        ...n
    };
    if (!G0(n, F5) && G0(n, Q5))
        if (n.visualDuration) {
            const s = n.visualDuration
              , o = 2 * Math.PI / (s * 1.2)
              , u = o * o
              , f = 2 * _n(.05, 1, 1 - (n.bounce || 0)) * Math.sqrt(u);
            a = {
                ...a,
                mass: Pt.mass,
                stiffness: u,
                damping: f
            }
        } else {
            const s = X5(n);
            a = {
                ...a,
                ...s,
                mass: Pt.mass
            },
            a.isResolvedFromDuration = !0
        }
    return a
}
function nr(n=Pt.visualDuration, a=Pt.bounce) {
    const s = typeof n != "object" ? {
        visualDuration: n,
        keyframes: [0, 1],
        bounce: a
    } : n;
    let {restSpeed: o, restDelta: u} = s;
    const f = s.keyframes[0]
      , h = s.keyframes[s.keyframes.length - 1]
      , p = {
        done: !1,
        value: f
    }
      , {stiffness: d, damping: m, mass: y, duration: g, velocity: S, isResolvedFromDuration: T} = $5({
        ...s,
        velocity: -Ye(s.velocity || 0)
    })
      , C = S || 0
      , E = m / (2 * Math.sqrt(d * y))
      , A = h - f
      , V = Ye(Math.sqrt(d / y))
      , q = Math.abs(A) < 5;
    o || (o = q ? Pt.restSpeed.granular : Pt.restSpeed.default),
    u || (u = q ? Pt.restDelta.granular : Pt.restDelta.default);
    let B;
    if (E < 1) {
        const j = hf(V, E);
        B = Z => {
            const Q = Math.exp(-E * V * Z);
            return h - Q * ((C + E * V * A) / j * Math.sin(j * Z) + A * Math.cos(j * Z))
        }
    } else if (E === 1)
        B = j => h - Math.exp(-V * j) * (A + (C + V * A) * j);
    else {
        const j = V * Math.sqrt(E * E - 1);
        B = Z => {
            const Q = Math.exp(-E * V * Z)
              , K = Math.min(j * Z, 300);
            return h - Q * ((C + E * V * A) * Math.sinh(K) + j * A * Math.cosh(K)) / j
        }
    }
    const G = {
        calculatedDuration: T && g || null,
        next: j => {
            const Z = B(j);
            if (T)
                p.done = j >= g;
            else {
                let Q = j === 0 ? C : 0;
                E < 1 && (Q = j === 0 ? an(C) : ky(B, j, Z));
                const K = Math.abs(Q) <= o
                  , tt = Math.abs(h - Z) <= u;
                p.done = K && tt
            }
            return p.value = p.done ? h : Z,
            p
        }
        ,
        toString: () => {
            const j = Math.min(eh(G), er)
              , Z = Gy(Q => G.next(j * Q).value, j, 30);
            return j + "ms " + Z
        }
        ,
        toTransition: () => {}
    };
    return G
}
nr.applyToOptions = n => {
    const a = G5(n, 100, nr);
    return n.ease = a.ease,
    n.duration = an(a.duration),
    n.type = "keyframes",
    n
}
;
function df({keyframes: n, velocity: a=0, power: s=.8, timeConstant: o=325, bounceDamping: u=10, bounceStiffness: f=500, modifyTarget: h, min: p, max: d, restDelta: m=.5, restSpeed: y}) {
    const g = n[0]
      , S = {
        done: !1,
        value: g
    }
      , T = K => p !== void 0 && K < p || d !== void 0 && K > d
      , C = K => p === void 0 ? d : d === void 0 || Math.abs(p - K) < Math.abs(d - K) ? p : d;
    let E = s * a;
    const A = g + E
      , V = h === void 0 ? A : h(A);
    V !== A && (E = V - g);
    const q = K => -E * Math.exp(-K / o)
      , B = K => V + q(K)
      , G = K => {
        const tt = q(K)
          , F = B(K);
        S.done = Math.abs(tt) <= m,
        S.value = S.done ? V : F
    }
    ;
    let j, Z;
    const Q = K => {
        T(S.value) && (j = K,
        Z = nr({
            keyframes: [S.value, C(S.value)],
            velocity: ky(B, K, S.value),
            damping: u,
            stiffness: f,
            restDelta: m,
            restSpeed: y
        }))
    }
    ;
    return Q(0),
    {
        calculatedDuration: null,
        next: K => {
            let tt = !1;
            return !Z && j === void 0 && (tt = !0,
            G(K),
            Q(K)),
            j !== void 0 && K >= j ? Z.next(K - j) : (!tt && G(K),
            S)
        }
    }
}
function J5(n, a, s) {
    const o = []
      , u = s || An.mix || Yy
      , f = n.length - 1;
    for (let h = 0; h < f; h++) {
        let p = u(n[h], n[h + 1]);
        if (a) {
            const d = Array.isArray(a) ? a[h] || Ge : a;
            p = ul(d, p)
        }
        o.push(p)
    }
    return o
}
function W5(n, a, {clamp: s=!0, ease: o, mixer: u}={}) {
    const f = n.length;
    if (Xf(f === a.length),
    f === 1)
        return () => a[0];
    if (f === 2 && a[0] === a[1])
        return () => a[1];
    const h = n[0] === n[1];
    n[0] > n[f - 1] && (n = [...n].reverse(),
    a = [...a].reverse());
    const p = J5(a, o, u)
      , d = p.length
      , m = y => {
        if (h && y < n[0])
            return a[0];
        let g = 0;
        if (d > 1)
            for (; g < n.length - 2 && !(y < n[g + 1]); g++)
                ;
        const S = nl(n[g], n[g + 1], y);
        return p[g](S)
    }
    ;
    return s ? y => m(_n(n[0], n[f - 1], y)) : m
}
function I5(n, a) {
    const s = n[n.length - 1];
    for (let o = 1; o <= a; o++) {
        const u = nl(0, a, o);
        n.push(Bt(s, 1, u))
    }
}
function t6(n) {
    const a = [0];
    return I5(a, n.length - 1),
    a
}
function e6(n, a) {
    return n.map(s => s * a)
}
function n6(n, a) {
    return n.map( () => a || Io).splice(0, n.length - 1)
}
function $s({duration: n=300, keyframes: a, times: s, ease: o="easeInOut"}) {
    const u = d5(o) ? o.map(j0) : j0(o)
      , f = {
        done: !1,
        value: a[0]
    }
      , h = e6(s && s.length === a.length ? s : t6(a), n)
      , p = W5(h, a, {
        ease: Array.isArray(u) ? u : n6(a, u)
    });
    return {
        calculatedDuration: n,
        next: d => (f.value = p(d),
        f.done = d >= n,
        f)
    }
}
const i6 = n => n !== null;
function nh(n, {repeat: a, repeatType: s="loop"}, o, u=1) {
    const f = n.filter(i6)
      , p = u < 0 || a && s !== "loop" && a % 2 === 1 ? 0 : f.length - 1;
    return !p || o === void 0 ? f[p] : o
}
const a6 = {
    decay: df,
    inertia: df,
    tween: $s,
    keyframes: $s,
    spring: nr
};
function Xy(n) {
    typeof n.type == "string" && (n.type = a6[n.type])
}
class ih {
    constructor() {
        this.updateFinished()
    }
    get finished() {
        return this._finished
    }
    updateFinished() {
        this._finished = new Promise(a => {
            this.resolve = a
        }
        )
    }
    notifyFinished() {
        this.resolve()
    }
    then(a, s) {
        return this.finished.then(a, s)
    }
}
const s6 = n => n / 100;
class ah extends ih {
    constructor(a) {
        super(),
        this.state = "idle",
        this.startTime = null,
        this.isStopped = !1,
        this.currentTime = 0,
        this.holdTime = null,
        this.playbackSpeed = 1,
        this.stop = () => {
            const {motionValue: s} = this.options;
            s && s.updatedAt !== ge.now() && this.tick(ge.now()),
            this.isStopped = !0,
            this.state !== "idle" && (this.teardown(),
            this.options.onStop?.())
        }
        ,
        this.options = a,
        this.initAnimation(),
        this.play(),
        a.autoplay === !1 && this.pause()
    }
    initAnimation() {
        const {options: a} = this;
        Xy(a);
        const {type: s=$s, repeat: o=0, repeatDelay: u=0, repeatType: f, velocity: h=0} = a;
        let {keyframes: p} = a;
        const d = s || $s;
        d !== $s && typeof p[0] != "number" && (this.mixKeyframes = ul(s6, Yy(p[0], p[1])),
        p = [0, 100]);
        const m = d({
            ...a,
            keyframes: p
        });
        f === "mirror" && (this.mirroredGenerator = d({
            ...a,
            keyframes: [...p].reverse(),
            velocity: -h
        })),
        m.calculatedDuration === null && (m.calculatedDuration = eh(m));
        const {calculatedDuration: y} = m;
        this.calculatedDuration = y,
        this.resolvedDuration = y + u,
        this.totalDuration = this.resolvedDuration * (o + 1) - u,
        this.generator = m
    }
    updateTime(a) {
        const s = Math.round(a - this.startTime) * this.playbackSpeed;
        this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = s
    }
    tick(a, s=!1) {
        const {generator: o, totalDuration: u, mixKeyframes: f, mirroredGenerator: h, resolvedDuration: p, calculatedDuration: d} = this;
        if (this.startTime === null)
            return o.next(0);
        const {delay: m=0, keyframes: y, repeat: g, repeatType: S, repeatDelay: T, type: C, onUpdate: E, finalKeyframe: A} = this.options;
        this.speed > 0 ? this.startTime = Math.min(this.startTime, a) : this.speed < 0 && (this.startTime = Math.min(a - u / this.speed, this.startTime)),
        s ? this.currentTime = a : this.updateTime(a);
        const V = this.currentTime - m * (this.playbackSpeed >= 0 ? 1 : -1)
          , q = this.playbackSpeed >= 0 ? V < 0 : V > u;
        this.currentTime = Math.max(V, 0),
        this.state === "finished" && this.holdTime === null && (this.currentTime = u);
        let B = this.currentTime
          , G = o;
        if (g) {
            const K = Math.min(this.currentTime, u) / p;
            let tt = Math.floor(K)
              , F = K % 1;
            !F && K >= 1 && (F = 1),
            F === 1 && tt--,
            tt = Math.min(tt, g + 1),
            !!(tt % 2) && (S === "reverse" ? (F = 1 - F,
            T && (F -= T / p)) : S === "mirror" && (G = h)),
            B = _n(0, 1, F) * p
        }
        const j = q ? {
            done: !1,
            value: y[0]
        } : G.next(B);
        f && (j.value = f(j.value));
        let {done: Z} = j;
        !q && d !== null && (Z = this.playbackSpeed >= 0 ? this.currentTime >= u : this.currentTime <= 0);
        const Q = this.holdTime === null && (this.state === "finished" || this.state === "running" && Z);
        return Q && C !== df && (j.value = nh(y, this.options, A, this.speed)),
        E && E(j.value),
        Q && this.finish(),
        j
    }
    then(a, s) {
        return this.finished.then(a, s)
    }
    get duration() {
        return Ye(this.calculatedDuration)
    }
    get iterationDuration() {
        const {delay: a=0} = this.options || {};
        return this.duration + Ye(a)
    }
    get time() {
        return Ye(this.currentTime)
    }
    set time(a) {
        a = an(a),
        this.currentTime = a,
        this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = a : this.driver && (this.startTime = this.driver.now() - a / this.playbackSpeed),
        this.driver?.start(!1)
    }
    get speed() {
        return this.playbackSpeed
    }
    set speed(a) {
        this.updateTime(ge.now());
        const s = this.playbackSpeed !== a;
        this.playbackSpeed = a,
        s && (this.time = Ye(this.currentTime))
    }
    play() {
        if (this.isStopped)
            return;
        const {driver: a=Y5, startTime: s} = this.options;
        this.driver || (this.driver = a(u => this.tick(u))),
        this.options.onPlay?.();
        const o = this.driver.now();
        this.state === "finished" ? (this.updateFinished(),
        this.startTime = o) : this.holdTime !== null ? this.startTime = o - this.holdTime : this.startTime || (this.startTime = s ?? o),
        this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration),
        this.holdTime = null,
        this.state = "running",
        this.driver.start()
    }
    pause() {
        this.state = "paused",
        this.updateTime(ge.now()),
        this.holdTime = this.currentTime
    }
    complete() {
        this.state !== "running" && this.play(),
        this.state = "finished",
        this.holdTime = null
    }
    finish() {
        this.notifyFinished(),
        this.teardown(),
        this.state = "finished",
        this.options.onComplete?.()
    }
    cancel() {
        this.holdTime = null,
        this.startTime = 0,
        this.tick(0),
        this.teardown(),
        this.options.onCancel?.()
    }
    teardown() {
        this.state = "idle",
        this.stopDriver(),
        this.startTime = this.holdTime = null
    }
    stopDriver() {
        this.driver && (this.driver.stop(),
        this.driver = void 0)
    }
    sample(a) {
        return this.startTime = 0,
        this.tick(a, !0)
    }
    attachTimeline(a) {
        return this.options.allowFlatten && (this.options.type = "keyframes",
        this.options.ease = "linear",
        this.initAnimation()),
        this.driver?.stop(),
        a.observe(this)
    }
}
function l6(n) {
    for (let a = 1; a < n.length; a++)
        n[a] ?? (n[a] = n[a - 1])
}
const Di = n => n * 180 / Math.PI
  , mf = n => {
    const a = Di(Math.atan2(n[1], n[0]));
    return pf(a)
}
  , o6 = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: n => (Math.abs(n[0]) + Math.abs(n[3])) / 2,
    rotate: mf,
    rotateZ: mf,
    skewX: n => Di(Math.atan(n[1])),
    skewY: n => Di(Math.atan(n[2])),
    skew: n => (Math.abs(n[1]) + Math.abs(n[2])) / 2
}
  , pf = n => (n = n % 360,
n < 0 && (n += 360),
n)
  , k0 = mf
  , X0 = n => Math.sqrt(n[0] * n[0] + n[1] * n[1])
  , K0 = n => Math.sqrt(n[4] * n[4] + n[5] * n[5])
  , r6 = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: X0,
    scaleY: K0,
    scale: n => (X0(n) + K0(n)) / 2,
    rotateX: n => pf(Di(Math.atan2(n[6], n[5]))),
    rotateY: n => pf(Di(Math.atan2(-n[2], n[0]))),
    rotateZ: k0,
    rotate: k0,
    skewX: n => Di(Math.atan(n[4])),
    skewY: n => Di(Math.atan(n[1])),
    skew: n => (Math.abs(n[1]) + Math.abs(n[4])) / 2
};
function yf(n) {
    return n.includes("scale") ? 1 : 0
}
function vf(n, a) {
    if (!n || n === "none")
        return yf(a);
    const s = n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let o, u;
    if (s)
        o = r6,
        u = s;
    else {
        const p = n.match(/^matrix\(([-\d.e\s,]+)\)$/u);
        o = o6,
        u = p
    }
    if (!u)
        return yf(a);
    const f = o[a]
      , h = u[1].split(",").map(c6);
    return typeof f == "function" ? f(h) : h[f]
}
const u6 = (n, a) => {
    const {transform: s="none"} = getComputedStyle(n);
    return vf(s, a)
}
;
function c6(n) {
    return parseFloat(n.trim())
}
const Pa = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"]
  , Ha = new Set(Pa)
  , Z0 = n => n === ja || n === lt
  , f6 = new Set(["x", "y", "z"])
  , h6 = Pa.filter(n => !f6.has(n));
function d6(n) {
    const a = [];
    return h6.forEach(s => {
        const o = n.getValue(s);
        o !== void 0 && (a.push([s, o.get()]),
        o.set(s.startsWith("scale") ? 1 : 0))
    }
    ),
    a
}
const wi = {
    width: ({x: n}, {paddingLeft: a="0", paddingRight: s="0"}) => n.max - n.min - parseFloat(a) - parseFloat(s),
    height: ({y: n}, {paddingTop: a="0", paddingBottom: s="0"}) => n.max - n.min - parseFloat(a) - parseFloat(s),
    top: (n, {top: a}) => parseFloat(a),
    left: (n, {left: a}) => parseFloat(a),
    bottom: ({y: n}, {top: a}) => parseFloat(a) + (n.max - n.min),
    right: ({x: n}, {left: a}) => parseFloat(a) + (n.max - n.min),
    x: (n, {transform: a}) => vf(a, "x"),
    y: (n, {transform: a}) => vf(a, "y")
};
wi.translateX = wi.x;
wi.translateY = wi.y;
const zi = new Set;
let gf = !1
  , Sf = !1
  , bf = !1;
function Ky() {
    if (Sf) {
        const n = Array.from(zi).filter(o => o.needsMeasurement)
          , a = new Set(n.map(o => o.element))
          , s = new Map;
        a.forEach(o => {
            const u = d6(o);
            u.length && (s.set(o, u),
            o.render())
        }
        ),
        n.forEach(o => o.measureInitialState()),
        a.forEach(o => {
            o.render();
            const u = s.get(o);
            u && u.forEach( ([f,h]) => {
                o.getValue(f)?.set(h)
            }
            )
        }
        ),
        n.forEach(o => o.measureEndState()),
        n.forEach(o => {
            o.suspendedScrollY !== void 0 && window.scrollTo(0, o.suspendedScrollY)
        }
        )
    }
    Sf = !1,
    gf = !1,
    zi.forEach(n => n.complete(bf)),
    zi.clear()
}
function Zy() {
    zi.forEach(n => {
        n.readKeyframes(),
        n.needsMeasurement && (Sf = !0)
    }
    )
}
function m6() {
    bf = !0,
    Zy(),
    Ky(),
    bf = !1
}
class sh {
    constructor(a, s, o, u, f, h=!1) {
        this.state = "pending",
        this.isAsync = !1,
        this.needsMeasurement = !1,
        this.unresolvedKeyframes = [...a],
        this.onComplete = s,
        this.name = o,
        this.motionValue = u,
        this.element = f,
        this.isAsync = h
    }
    scheduleResolve() {
        this.state = "scheduled",
        this.isAsync ? (zi.add(this),
        gf || (gf = !0,
        Vt.read(Zy),
        Vt.resolveKeyframes(Ky))) : (this.readKeyframes(),
        this.complete())
    }
    readKeyframes() {
        const {unresolvedKeyframes: a, name: s, element: o, motionValue: u} = this;
        if (a[0] === null) {
            const f = u?.get()
              , h = a[a.length - 1];
            if (f !== void 0)
                a[0] = f;
            else if (o && s) {
                const p = o.readValue(s, h);
                p != null && (a[0] = p)
            }
            a[0] === void 0 && (a[0] = h),
            u && f === void 0 && u.set(a[0])
        }
        l6(a)
    }
    setFinalKeyframe() {}
    measureInitialState() {}
    renderEndStyles() {}
    measureEndState() {}
    complete(a=!1) {
        this.state = "complete",
        this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, a),
        zi.delete(this)
    }
    cancel() {
        this.state === "scheduled" && (zi.delete(this),
        this.state = "pending")
    }
    resume() {
        this.state === "pending" && this.scheduleResolve()
    }
}
const p6 = n => n.startsWith("--");
function y6(n, a, s) {
    p6(a) ? n.style.setProperty(a, s) : n.style[a] = s
}
const v6 = Kf( () => window.ScrollTimeline !== void 0)
  , g6 = {};
function S6(n, a) {
    const s = Kf(n);
    return () => g6[a] ?? s()
}
const Qy = S6( () => {
    try {
        document.createElement("div").animate({
            opacity: 0
        }, {
            easing: "linear(0, 1)"
        })
    } catch {
        return !1
    }
    return !0
}
, "linearEasing")
  , Xs = ([n,a,s,o]) => `cubic-bezier(${n}, ${a}, ${s}, ${o})`
  , Q0 = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: Xs([0, .65, .55, 1]),
    circOut: Xs([.55, 0, 1, .45]),
    backIn: Xs([.31, .01, .66, -.59]),
    backOut: Xs([.33, 1.53, .69, .99])
};
function Fy(n, a) {
    if (n)
        return typeof n == "function" ? Qy() ? Gy(n, a) : "ease-out" : wy(n) ? Xs(n) : Array.isArray(n) ? n.map(s => Fy(s, a) || Q0.easeOut) : Q0[n]
}
function b6(n, a, s, {delay: o=0, duration: u=300, repeat: f=0, repeatType: h="loop", ease: p="easeOut", times: d}={}, m=void 0) {
    const y = {
        [a]: s
    };
    d && (y.offset = d);
    const g = Fy(p, u);
    Array.isArray(g) && (y.easing = g);
    const S = {
        delay: o,
        duration: u,
        easing: Array.isArray(g) ? "linear" : g,
        fill: "both",
        iterations: f + 1,
        direction: h === "reverse" ? "alternate" : "normal"
    };
    return m && (S.pseudoElement = m),
    n.animate(y, S)
}
function $y(n) {
    return typeof n == "function" && "applyToOptions" in n
}
function T6({type: n, ...a}) {
    return $y(n) && Qy() ? n.applyToOptions(a) : (a.duration ?? (a.duration = 300),
    a.ease ?? (a.ease = "easeOut"),
    a)
}
class C6 extends ih {
    constructor(a) {
        if (super(),
        this.finishedTime = null,
        this.isStopped = !1,
        !a)
            return;
        const {element: s, name: o, keyframes: u, pseudoElement: f, allowFlatten: h=!1, finalKeyframe: p, onComplete: d} = a;
        this.isPseudoElement = !!f,
        this.allowFlatten = h,
        this.options = a,
        Xf(typeof a.type != "string");
        const m = T6(a);
        this.animation = b6(s, o, u, m, f),
        m.autoplay === !1 && this.animation.pause(),
        this.animation.onfinish = () => {
            if (this.finishedTime = this.time,
            !f) {
                const y = nh(u, this.options, p, this.speed);
                this.updateMotionValue ? this.updateMotionValue(y) : y6(s, o, y),
                this.animation.cancel()
            }
            d?.(),
            this.notifyFinished()
        }
    }
    play() {
        this.isStopped || (this.animation.play(),
        this.state === "finished" && this.updateFinished())
    }
    pause() {
        this.animation.pause()
    }
    complete() {
        this.animation.finish?.()
    }
    cancel() {
        try {
            this.animation.cancel()
        } catch {}
    }
    stop() {
        if (this.isStopped)
            return;
        this.isStopped = !0;
        const {state: a} = this;
        a === "idle" || a === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
        this.isPseudoElement || this.cancel())
    }
    commitStyles() {
        this.isPseudoElement || this.animation.commitStyles?.()
    }
    get duration() {
        const a = this.animation.effect?.getComputedTiming?.().duration || 0;
        return Ye(Number(a))
    }
    get iterationDuration() {
        const {delay: a=0} = this.options || {};
        return this.duration + Ye(a)
    }
    get time() {
        return Ye(Number(this.animation.currentTime) || 0)
    }
    set time(a) {
        this.finishedTime = null,
        this.animation.currentTime = an(a)
    }
    get speed() {
        return this.animation.playbackRate
    }
    set speed(a) {
        a < 0 && (this.finishedTime = null),
        this.animation.playbackRate = a
    }
    get state() {
        return this.finishedTime !== null ? "finished" : this.animation.playState
    }
    get startTime() {
        return Number(this.animation.startTime)
    }
    set startTime(a) {
        this.animation.startTime = a
    }
    attachTimeline({timeline: a, observe: s}) {
        return this.allowFlatten && this.animation.effect?.updateTiming({
            easing: "linear"
        }),
        this.animation.onfinish = null,
        a && v6() ? (this.animation.timeline = a,
        Ge) : s(this)
    }
}
const Jy = {
    anticipate: Ly,
    backInOut: Dy,
    circInOut: Vy
};
function x6(n) {
    return n in Jy
}
function R6(n) {
    typeof n.ease == "string" && x6(n.ease) && (n.ease = Jy[n.ease])
}
const F0 = 10;
class M6 extends C6 {
    constructor(a) {
        R6(a),
        Xy(a),
        super(a),
        a.startTime && (this.startTime = a.startTime),
        this.options = a
    }
    updateMotionValue(a) {
        const {motionValue: s, onUpdate: o, onComplete: u, element: f, ...h} = this.options;
        if (!s)
            return;
        if (a !== void 0) {
            s.set(a);
            return
        }
        const p = new ah({
            ...h,
            autoplay: !1
        })
          , d = an(this.finishedTime ?? this.time);
        s.setWithVelocity(p.sample(d - F0).value, p.sample(d).value, F0),
        p.stop()
    }
}
const $0 = (n, a) => a === "zIndex" ? !1 : !!(typeof n == "number" || Array.isArray(n) || typeof n == "string" && (ii.test(n) || n === "0") && !n.startsWith("url("));
function E6(n) {
    const a = n[0];
    if (n.length === 1)
        return !0;
    for (let s = 0; s < n.length; s++)
        if (n[s] !== a)
            return !0
}
function _6(n, a, s, o) {
    const u = n[0];
    if (u === null)
        return !1;
    if (a === "display" || a === "visibility")
        return !0;
    const f = n[n.length - 1]
      , h = $0(u, a)
      , p = $0(f, a);
    return !h || !p ? !1 : E6(n) || (s === "spring" || $y(s)) && o
}
function Tf(n) {
    n.duration = 0,
    n.type = "keyframes"
}
const A6 = new Set(["opacity", "clipPath", "filter", "transform"])
  , D6 = Kf( () => Object.hasOwnProperty.call(Element.prototype, "animate"));
function L6(n) {
    const {motionValue: a, name: s, repeatDelay: o, repeatType: u, damping: f, type: h} = n;
    if (!(a?.owner?.current instanceof HTMLElement))
        return !1;
    const {onUpdate: d, transformTemplate: m} = a.owner.getProps();
    return D6() && s && A6.has(s) && (s !== "transform" || !m) && !d && !o && u !== "mirror" && f !== 0 && h !== "inertia"
}
const O6 = 40;
class V6 extends ih {
    constructor({autoplay: a=!0, delay: s=0, type: o="keyframes", repeat: u=0, repeatDelay: f=0, repeatType: h="loop", keyframes: p, name: d, motionValue: m, element: y, ...g}) {
        super(),
        this.stop = () => {
            this._animation && (this._animation.stop(),
            this.stopTimeline?.()),
            this.keyframeResolver?.cancel()
        }
        ,
        this.createdAt = ge.now();
        const S = {
            autoplay: a,
            delay: s,
            type: o,
            repeat: u,
            repeatDelay: f,
            repeatType: h,
            name: d,
            motionValue: m,
            element: y,
            ...g
        }
          , T = y?.KeyframeResolver || sh;
        this.keyframeResolver = new T(p, (C, E, A) => this.onKeyframesResolved(C, E, S, !A),d,m,y),
        this.keyframeResolver?.scheduleResolve()
    }
    onKeyframesResolved(a, s, o, u) {
        this.keyframeResolver = void 0;
        const {name: f, type: h, velocity: p, delay: d, isHandoff: m, onUpdate: y} = o;
        this.resolvedAt = ge.now(),
        _6(a, f, h, p) || ((An.instantAnimations || !d) && y?.(nh(a, o, s)),
        a[0] = a[a.length - 1],
        Tf(o),
        o.repeat = 0);
        const S = {
            startTime: u ? this.resolvedAt ? this.resolvedAt - this.createdAt > O6 ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
            finalKeyframe: s,
            ...o,
            keyframes: a
        }
          , T = !m && L6(S) ? new M6({
            ...S,
            element: S.motionValue.owner.current
        }) : new ah(S);
        T.finished.then( () => this.notifyFinished()).catch(Ge),
        this.pendingTimeline && (this.stopTimeline = T.attachTimeline(this.pendingTimeline),
        this.pendingTimeline = void 0),
        this._animation = T
    }
    get finished() {
        return this._animation ? this.animation.finished : this._finished
    }
    then(a, s) {
        return this.finished.finally(a).then( () => {}
        )
    }
    get animation() {
        return this._animation || (this.keyframeResolver?.resume(),
        m6()),
        this._animation
    }
    get duration() {
        return this.animation.duration
    }
    get iterationDuration() {
        return this.animation.iterationDuration
    }
    get time() {
        return this.animation.time
    }
    set time(a) {
        this.animation.time = a
    }
    get speed() {
        return this.animation.speed
    }
    get state() {
        return this.animation.state
    }
    set speed(a) {
        this.animation.speed = a
    }
    get startTime() {
        return this.animation.startTime
    }
    attachTimeline(a) {
        return this._animation ? this.stopTimeline = this.animation.attachTimeline(a) : this.pendingTimeline = a,
        () => this.stop()
    }
    play() {
        this.animation.play()
    }
    pause() {
        this.animation.pause()
    }
    complete() {
        this.animation.complete()
    }
    cancel() {
        this._animation && this.animation.cancel(),
        this.keyframeResolver?.cancel()
    }
}
const w6 = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function z6(n) {
    const a = w6.exec(n);
    if (!a)
        return [, ];
    const [,s,o,u] = a;
    return [`--${s ?? o}`, u]
}
function Wy(n, a, s=1) {
    const [o,u] = z6(n);
    if (!o)
        return;
    const f = window.getComputedStyle(a).getPropertyValue(o);
    if (f) {
        const h = f.trim();
        return Ty(h) ? parseFloat(h) : h
    }
    return Jf(u) ? Wy(u, a, s + 1) : u
}
function lh(n, a) {
    return n?.[a] ?? n?.default ?? n
}
const Iy = new Set(["width", "height", "top", "left", "right", "bottom", ...Pa])
  , B6 = {
    test: n => n === "auto",
    parse: n => n
}
  , tv = n => a => a.test(n)
  , ev = [ja, lt, sn, Wn, E5, M5, B6]
  , J0 = n => ev.find(tv(n));
function U6(n) {
    return typeof n == "number" ? n === 0 : n !== null ? n === "none" || n === "0" || xy(n) : !0
}
const N6 = new Set(["brightness", "contrast", "saturate", "opacity"]);
function j6(n) {
    const [a,s] = n.slice(0, -1).split("(");
    if (a === "drop-shadow")
        return n;
    const [o] = s.match(Wf) || [];
    if (!o)
        return n;
    const u = s.replace(o, "");
    let f = N6.has(a) ? 1 : 0;
    return o !== s && (f *= 100),
    a + "(" + f + u + ")"
}
const P6 = /\b([a-z-]*)\(.*?\)/gu
  , Cf = {
    ...ii,
    getAnimatableNone: n => {
        const a = n.match(P6);
        return a ? a.map(j6).join(" ") : n
    }
}
  , W0 = {
    ...ja,
    transform: Math.round
}
  , H6 = {
    rotate: Wn,
    rotateX: Wn,
    rotateY: Wn,
    rotateZ: Wn,
    scale: Bo,
    scaleX: Bo,
    scaleY: Bo,
    scaleZ: Bo,
    skew: Wn,
    skewX: Wn,
    skewY: Wn,
    distance: lt,
    translateX: lt,
    translateY: lt,
    translateZ: lt,
    x: lt,
    y: lt,
    z: lt,
    perspective: lt,
    transformPerspective: lt,
    opacity: il,
    originX: P0,
    originY: P0,
    originZ: lt
}
  , oh = {
    borderWidth: lt,
    borderTopWidth: lt,
    borderRightWidth: lt,
    borderBottomWidth: lt,
    borderLeftWidth: lt,
    borderRadius: lt,
    radius: lt,
    borderTopLeftRadius: lt,
    borderTopRightRadius: lt,
    borderBottomRightRadius: lt,
    borderBottomLeftRadius: lt,
    width: lt,
    maxWidth: lt,
    height: lt,
    maxHeight: lt,
    top: lt,
    right: lt,
    bottom: lt,
    left: lt,
    padding: lt,
    paddingTop: lt,
    paddingRight: lt,
    paddingBottom: lt,
    paddingLeft: lt,
    margin: lt,
    marginTop: lt,
    marginRight: lt,
    marginBottom: lt,
    marginLeft: lt,
    backgroundPositionX: lt,
    backgroundPositionY: lt,
    ...H6,
    zIndex: W0,
    fillOpacity: il,
    strokeOpacity: il,
    numOctaves: W0
}
  , q6 = {
    ...oh,
    color: Zt,
    backgroundColor: Zt,
    outlineColor: Zt,
    fill: Zt,
    stroke: Zt,
    borderColor: Zt,
    borderTopColor: Zt,
    borderRightColor: Zt,
    borderBottomColor: Zt,
    borderLeftColor: Zt,
    filter: Cf,
    WebkitFilter: Cf
}
  , nv = n => q6[n];
function iv(n, a) {
    let s = nv(n);
    return s !== Cf && (s = ii),
    s.getAnimatableNone ? s.getAnimatableNone(a) : void 0
}
const Y6 = new Set(["auto", "none", "0"]);
function G6(n, a, s) {
    let o = 0, u;
    for (; o < n.length && !u; ) {
        const f = n[o];
        typeof f == "string" && !Y6.has(f) && al(f).values.length && (u = n[o]),
        o++
    }
    if (u && s)
        for (const f of a)
            n[f] = iv(s, u)
}
class k6 extends sh {
    constructor(a, s, o, u, f) {
        super(a, s, o, u, f, !0)
    }
    readKeyframes() {
        const {unresolvedKeyframes: a, element: s, name: o} = this;
        if (!s || !s.current)
            return;
        super.readKeyframes();
        for (let d = 0; d < a.length; d++) {
            let m = a[d];
            if (typeof m == "string" && (m = m.trim(),
            Jf(m))) {
                const y = Wy(m, s.current);
                y !== void 0 && (a[d] = y),
                d === a.length - 1 && (this.finalKeyframe = m)
            }
        }
        if (this.resolveNoneKeyframes(),
        !Iy.has(o) || a.length !== 2)
            return;
        const [u,f] = a
          , h = J0(u)
          , p = J0(f);
        if (h !== p)
            if (Z0(h) && Z0(p))
                for (let d = 0; d < a.length; d++) {
                    const m = a[d];
                    typeof m == "string" && (a[d] = parseFloat(m))
                }
            else
                wi[o] && (this.needsMeasurement = !0)
    }
    resolveNoneKeyframes() {
        const {unresolvedKeyframes: a, name: s} = this
          , o = [];
        for (let u = 0; u < a.length; u++)
            (a[u] === null || U6(a[u])) && o.push(u);
        o.length && G6(a, o, s)
    }
    measureInitialState() {
        const {element: a, unresolvedKeyframes: s, name: o} = this;
        if (!a || !a.current)
            return;
        o === "height" && (this.suspendedScrollY = window.pageYOffset),
        this.measuredOrigin = wi[o](a.measureViewportBox(), window.getComputedStyle(a.current)),
        s[0] = this.measuredOrigin;
        const u = s[s.length - 1];
        u !== void 0 && a.getValue(o, u).jump(u, !1)
    }
    measureEndState() {
        const {element: a, name: s, unresolvedKeyframes: o} = this;
        if (!a || !a.current)
            return;
        const u = a.getValue(s);
        u && u.jump(this.measuredOrigin, !1);
        const f = o.length - 1
          , h = o[f];
        o[f] = wi[s](a.measureViewportBox(), window.getComputedStyle(a.current)),
        h !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = h),
        this.removedTransforms?.length && this.removedTransforms.forEach( ([p,d]) => {
            a.getValue(p).set(d)
        }
        ),
        this.resolveNoneKeyframes()
    }
}
function X6(n, a, s) {
    if (n instanceof EventTarget)
        return [n];
    if (typeof n == "string") {
        const u = document.querySelectorAll(n);
        return u ? Array.from(u) : []
    }
    return Array.from(n)
}
const av = (n, a) => a && typeof n == "number" ? a.transform(n) : n;
function sv(n) {
    return Cy(n) && "offsetHeight" in n
}
const I0 = 30
  , K6 = n => !isNaN(parseFloat(n))
  , t1 = {
    current: void 0
};
class Z6 {
    constructor(a, s={}) {
        this.canTrackVelocity = null,
        this.events = {},
        this.updateAndNotify = o => {
            const u = ge.now();
            if (this.updatedAt !== u && this.setPrevFrameValue(),
            this.prev = this.current,
            this.setCurrent(o),
            this.current !== this.prev && (this.events.change?.notify(this.current),
            this.dependents))
                for (const f of this.dependents)
                    f.dirty()
        }
        ,
        this.hasAnimated = !1,
        this.setCurrent(a),
        this.owner = s.owner
    }
    setCurrent(a) {
        this.current = a,
        this.updatedAt = ge.now(),
        this.canTrackVelocity === null && a !== void 0 && (this.canTrackVelocity = K6(this.current))
    }
    setPrevFrameValue(a=this.current) {
        this.prevFrameValue = a,
        this.prevUpdatedAt = this.updatedAt
    }
    onChange(a) {
        return this.on("change", a)
    }
    on(a, s) {
        this.events[a] || (this.events[a] = new Zf);
        const o = this.events[a].add(s);
        return a === "change" ? () => {
            o(),
            Vt.read( () => {
                this.events.change.getSize() || this.stop()
            }
            )
        }
        : o
    }
    clearListeners() {
        for (const a in this.events)
            this.events[a].clear()
    }
    attach(a, s) {
        this.passiveEffect = a,
        this.stopPassiveEffect = s
    }
    set(a) {
        this.passiveEffect ? this.passiveEffect(a, this.updateAndNotify) : this.updateAndNotify(a)
    }
    setWithVelocity(a, s, o) {
        this.set(s),
        this.prev = void 0,
        this.prevFrameValue = a,
        this.prevUpdatedAt = this.updatedAt - o
    }
    jump(a, s=!0) {
        this.updateAndNotify(a),
        this.prev = a,
        this.prevUpdatedAt = this.prevFrameValue = void 0,
        s && this.stop(),
        this.stopPassiveEffect && this.stopPassiveEffect()
    }
    dirty() {
        this.events.change?.notify(this.current)
    }
    addDependent(a) {
        this.dependents || (this.dependents = new Set),
        this.dependents.add(a)
    }
    removeDependent(a) {
        this.dependents && this.dependents.delete(a)
    }
    get() {
        return t1.current && t1.current.push(this),
        this.current
    }
    getPrevious() {
        return this.prev
    }
    getVelocity() {
        const a = ge.now();
        if (!this.canTrackVelocity || this.prevFrameValue === void 0 || a - this.updatedAt > I0)
            return 0;
        const s = Math.min(this.updatedAt - this.prevUpdatedAt, I0);
        return Ry(parseFloat(this.current) - parseFloat(this.prevFrameValue), s)
    }
    start(a) {
        return this.stop(),
        new Promise(s => {
            this.hasAnimated = !0,
            this.animation = a(s),
            this.events.animationStart && this.events.animationStart.notify()
        }
        ).then( () => {
            this.events.animationComplete && this.events.animationComplete.notify(),
            this.clearAnimation()
        }
        )
    }
    stop() {
        this.animation && (this.animation.stop(),
        this.events.animationCancel && this.events.animationCancel.notify()),
        this.clearAnimation()
    }
    isAnimating() {
        return !!this.animation
    }
    clearAnimation() {
        delete this.animation
    }
    destroy() {
        this.dependents?.clear(),
        this.events.destroy?.notify(),
        this.clearListeners(),
        this.stop(),
        this.stopPassiveEffect && this.stopPassiveEffect()
    }
}
function Ua(n, a) {
    return new Z6(n,a)
}
const {schedule: rh} = zy(queueMicrotask, !1)
  , Fe = {
    x: !1,
    y: !1
};
function lv() {
    return Fe.x || Fe.y
}
function Q6(n) {
    return n === "x" || n === "y" ? Fe[n] ? null : (Fe[n] = !0,
    () => {
        Fe[n] = !1
    }
    ) : Fe.x || Fe.y ? null : (Fe.x = Fe.y = !0,
    () => {
        Fe.x = Fe.y = !1
    }
    )
}
function ov(n, a) {
    const s = X6(n)
      , o = new AbortController
      , u = {
        passive: !0,
        ...a,
        signal: o.signal
    };
    return [s, u, () => o.abort()]
}
function e1(n) {
    return !(n.pointerType === "touch" || lv())
}
function F6(n, a, s={}) {
    const [o,u,f] = ov(n, s)
      , h = p => {
        if (!e1(p))
            return;
        const {target: d} = p
          , m = a(d, p);
        if (typeof m != "function" || !d)
            return;
        const y = g => {
            e1(g) && (m(g),
            d.removeEventListener("pointerleave", y))
        }
        ;
        d.addEventListener("pointerleave", y, u)
    }
    ;
    return o.forEach(p => {
        p.addEventListener("pointerenter", h, u)
    }
    ),
    f
}
const rv = (n, a) => a ? n === a ? !0 : rv(n, a.parentElement) : !1
  , uh = n => n.pointerType === "mouse" ? typeof n.button != "number" || n.button <= 0 : n.isPrimary !== !1
  , $6 = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function J6(n) {
    return $6.has(n.tagName) || n.tabIndex !== -1
}
const qo = new WeakSet;
function n1(n) {
    return a => {
        a.key === "Enter" && n(a)
    }
}
function Qc(n, a) {
    n.dispatchEvent(new PointerEvent("pointer" + a,{
        isPrimary: !0,
        bubbles: !0
    }))
}
const W6 = (n, a) => {
    const s = n.currentTarget;
    if (!s)
        return;
    const o = n1( () => {
        if (qo.has(s))
            return;
        Qc(s, "down");
        const u = n1( () => {
            Qc(s, "up")
        }
        )
          , f = () => Qc(s, "cancel");
        s.addEventListener("keyup", u, a),
        s.addEventListener("blur", f, a)
    }
    );
    s.addEventListener("keydown", o, a),
    s.addEventListener("blur", () => s.removeEventListener("keydown", o), a)
}
;
function i1(n) {
    return uh(n) && !lv()
}
function I6(n, a, s={}) {
    const [o,u,f] = ov(n, s)
      , h = p => {
        const d = p.currentTarget;
        if (!i1(p))
            return;
        qo.add(d);
        const m = a(d, p)
          , y = (T, C) => {
            window.removeEventListener("pointerup", g),
            window.removeEventListener("pointercancel", S),
            qo.has(d) && qo.delete(d),
            i1(T) && typeof m == "function" && m(T, {
                success: C
            })
        }
          , g = T => {
            y(T, d === window || d === document || s.useGlobalTarget || rv(d, T.target))
        }
          , S = T => {
            y(T, !1)
        }
        ;
        window.addEventListener("pointerup", g, u),
        window.addEventListener("pointercancel", S, u)
    }
    ;
    return o.forEach(p => {
        (s.useGlobalTarget ? window : p).addEventListener("pointerdown", h, u),
        sv(p) && (p.addEventListener("focus", m => W6(m, u)),
        !J6(p) && !p.hasAttribute("tabindex") && (p.tabIndex = 0))
    }
    ),
    f
}
function uv(n) {
    return Cy(n) && "ownerSVGElement" in n
}
function t7(n) {
    return uv(n) && n.tagName === "svg"
}
const ue = n => !!(n && n.getVelocity)
  , e7 = [...ev, Zt, ii]
  , n7 = n => e7.find(tv(n))
  , ch = H.createContext({
    transformPagePoint: n => n,
    isStatic: !1,
    reducedMotion: "never"
});
function a1(n, a) {
    if (typeof n == "function")
        return n(a);
    n != null && (n.current = a)
}
function i7(...n) {
    return a => {
        let s = !1;
        const o = n.map(u => {
            const f = a1(u, a);
            return !s && typeof f == "function" && (s = !0),
            f
        }
        );
        if (s)
            return () => {
                for (let u = 0; u < o.length; u++) {
                    const f = o[u];
                    typeof f == "function" ? f() : a1(n[u], null)
                }
            }
    }
}
function a7(...n) {
    return H.useCallback(i7(...n), n)
}
class s7 extends H.Component {
    getSnapshotBeforeUpdate(a) {
        const s = this.props.childRef.current;
        if (s && a.isPresent && !this.props.isPresent) {
            const o = s.offsetParent
              , u = sv(o) && o.offsetWidth || 0
              , f = this.props.sizeRef.current;
            f.height = s.offsetHeight || 0,
            f.width = s.offsetWidth || 0,
            f.top = s.offsetTop,
            f.left = s.offsetLeft,
            f.right = u - f.width - f.left
        }
        return null
    }
    componentDidUpdate() {}
    render() {
        return this.props.children
    }
}
function l7({children: n, isPresent: a, anchorX: s, root: o}) {
    const u = H.useId()
      , f = H.useRef(null)
      , h = H.useRef({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0
    })
      , {nonce: p} = H.useContext(ch)
      , d = a7(f, n?.ref);
    return H.useInsertionEffect( () => {
        const {width: m, height: y, top: g, left: S, right: T} = h.current;
        if (a || !f.current || !m || !y)
            return;
        const C = s === "left" ? `left: ${S}` : `right: ${T}`;
        f.current.dataset.motionPopId = u;
        const E = document.createElement("style");
        p && (E.nonce = p);
        const A = o ?? document.head;
        return A.appendChild(E),
        E.sheet && E.sheet.insertRule(`
          [data-motion-pop-id="${u}"] {
            position: absolute !important;
            width: ${m}px !important;
            height: ${y}px !important;
            ${C}px !important;
            top: ${g}px !important;
          }
        `),
        () => {
            A.contains(E) && A.removeChild(E)
        }
    }
    , [a]),
    X.jsx(s7, {
        isPresent: a,
        childRef: f,
        sizeRef: h,
        children: H.cloneElement(n, {
            ref: d
        })
    })
}
const o7 = ({children: n, initial: a, isPresent: s, onExitComplete: o, custom: u, presenceAffectsLayout: f, mode: h, anchorX: p, root: d}) => {
    const m = qf(r7)
      , y = H.useId();
    let g = !0
      , S = H.useMemo( () => (g = !1,
    {
        id: y,
        initial: a,
        isPresent: s,
        custom: u,
        onExitComplete: T => {
            m.set(T, !0);
            for (const C of m.values())
                if (!C)
                    return;
            o && o()
        }
        ,
        register: T => (m.set(T, !1),
        () => m.delete(T))
    }), [s, m, o]);
    return f && g && (S = {
        ...S
    }),
    H.useMemo( () => {
        m.forEach( (T, C) => m.set(C, !1))
    }
    , [s]),
    H.useEffect( () => {
        !s && !m.size && o && o()
    }
    , [s]),
    h === "popLayout" && (n = X.jsx(l7, {
        isPresent: s,
        anchorX: p,
        root: d,
        children: n
    })),
    X.jsx(rr.Provider, {
        value: S,
        children: n
    })
}
;
function r7() {
    return new Map
}
function cv(n=!0) {
    const a = H.useContext(rr);
    if (a === null)
        return [!0, null];
    const {isPresent: s, onExitComplete: o, register: u} = a
      , f = H.useId();
    H.useEffect( () => {
        if (n)
            return u(f)
    }
    , [n]);
    const h = H.useCallback( () => n && o && o(f), [f, o, n]);
    return !s && o ? [!1, h] : [!0]
}
const Uo = n => n.key || "";
function s1(n) {
    const a = [];
    return H.Children.forEach(n, s => {
        H.isValidElement(s) && a.push(s)
    }
    ),
    a
}
const u7 = ({children: n, custom: a, initial: s=!0, onExitComplete: o, presenceAffectsLayout: u=!0, mode: f="sync", propagate: h=!1, anchorX: p="left", root: d}) => {
    const [m,y] = cv(h)
      , g = H.useMemo( () => s1(n), [n])
      , S = h && !m ? [] : g.map(Uo)
      , T = H.useRef(!0)
      , C = H.useRef(g)
      , E = qf( () => new Map)
      , [A,V] = H.useState(g)
      , [q,B] = H.useState(g);
    by( () => {
        T.current = !1,
        C.current = g;
        for (let Z = 0; Z < q.length; Z++) {
            const Q = Uo(q[Z]);
            S.includes(Q) ? E.delete(Q) : E.get(Q) !== !0 && E.set(Q, !1)
        }
    }
    , [q, S.length, S.join("-")]);
    const G = [];
    if (g !== A) {
        let Z = [...g];
        for (let Q = 0; Q < q.length; Q++) {
            const K = q[Q]
              , tt = Uo(K);
            S.includes(tt) || (Z.splice(Q, 0, K),
            G.push(K))
        }
        return f === "wait" && G.length && (Z = G),
        B(s1(Z)),
        V(g),
        null
    }
    const {forceRender: j} = H.useContext(Hf);
    return X.jsx(X.Fragment, {
        children: q.map(Z => {
            const Q = Uo(Z)
              , K = h && !m ? !1 : g === q || S.includes(Q)
              , tt = () => {
                if (E.has(Q))
                    E.set(Q, !0);
                else
                    return;
                let F = !0;
                E.forEach(rt => {
                    rt || (F = !1)
                }
                ),
                F && (j?.(),
                B(C.current),
                h && y?.(),
                o && o())
            }
            ;
            return X.jsx(o7, {
                isPresent: K,
                initial: !T.current || s ? void 0 : !1,
                custom: a,
                presenceAffectsLayout: u,
                mode: f,
                root: d,
                onExitComplete: K ? void 0 : tt,
                anchorX: p,
                children: Z
            }, Q)
        }
        )
    })
}
  , fv = H.createContext({
    strict: !1
})
  , l1 = {
    animation: ["animate", "variants", "whileHover", "whileTap", "exit", "whileInView", "whileFocus", "whileDrag"],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"]
}
  , Na = {};
for (const n in l1)
    Na[n] = {
        isEnabled: a => l1[n].some(s => !!a[s])
    };
function c7(n) {
    for (const a in n)
        Na[a] = {
            ...Na[a],
            ...n[a]
        }
}
const f7 = new Set(["animate", "exit", "variants", "initial", "style", "values", "variants", "transition", "transformTemplate", "custom", "inherit", "onBeforeLayoutMeasure", "onAnimationStart", "onAnimationComplete", "onUpdate", "onDragStart", "onDrag", "onDragEnd", "onMeasureDragConstraints", "onDirectionLock", "onDragTransitionEnd", "_dragX", "_dragY", "onHoverStart", "onHoverEnd", "onViewportEnter", "onViewportLeave", "globalTapTarget", "ignoreStrict", "viewport"]);
function ir(n) {
    return n.startsWith("while") || n.startsWith("drag") && n !== "draggable" || n.startsWith("layout") || n.startsWith("onTap") || n.startsWith("onPan") || n.startsWith("onLayout") || f7.has(n)
}
let hv = n => !ir(n);
function h7(n) {
    typeof n == "function" && (hv = a => a.startsWith("on") ? !ir(a) : n(a))
}
try {
    h7(require("@emotion/is-prop-valid").default)
} catch {}
function d7(n, a, s) {
    const o = {};
    for (const u in n)
        u === "values" && typeof n.values == "object" || (hv(u) || s === !0 && ir(u) || !a && !ir(u) || n.draggable && u.startsWith("onDrag")) && (o[u] = n[u]);
    return o
}
const ur = H.createContext({});
function cr(n) {
    return n !== null && typeof n == "object" && typeof n.start == "function"
}
function sl(n) {
    return typeof n == "string" || Array.isArray(n)
}
const fh = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"]
  , hh = ["initial", ...fh];
function fr(n) {
    return cr(n.animate) || hh.some(a => sl(n[a]))
}
function dv(n) {
    return !!(fr(n) || n.variants)
}
function m7(n, a) {
    if (fr(n)) {
        const {initial: s, animate: o} = n;
        return {
            initial: s === !1 || sl(s) ? s : void 0,
            animate: sl(o) ? o : void 0
        }
    }
    return n.inherit !== !1 ? a : {}
}
function p7(n) {
    const {initial: a, animate: s} = m7(n, H.useContext(ur));
    return H.useMemo( () => ({
        initial: a,
        animate: s
    }), [o1(a), o1(s)])
}
function o1(n) {
    return Array.isArray(n) ? n.join(" ") : n
}
const ll = {};
function y7(n) {
    for (const a in n)
        ll[a] = n[a],
        $f(a) && (ll[a].isCSSVariable = !0)
}
function mv(n, {layout: a, layoutId: s}) {
    return Ha.has(n) || n.startsWith("origin") || (a || s !== void 0) && (!!ll[n] || n === "opacity")
}
const v7 = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
}
  , g7 = Pa.length;
function S7(n, a, s) {
    let o = ""
      , u = !0;
    for (let f = 0; f < g7; f++) {
        const h = Pa[f]
          , p = n[h];
        if (p === void 0)
            continue;
        let d = !0;
        if (typeof p == "number" ? d = p === (h.startsWith("scale") ? 1 : 0) : d = parseFloat(p) === 0,
        !d || s) {
            const m = av(p, oh[h]);
            if (!d) {
                u = !1;
                const y = v7[h] || h;
                o += `${y}(${m}) `
            }
            s && (a[h] = m)
        }
    }
    return o = o.trim(),
    s ? o = s(a, u ? "" : o) : u && (o = "none"),
    o
}
function dh(n, a, s) {
    const {style: o, vars: u, transformOrigin: f} = n;
    let h = !1
      , p = !1;
    for (const d in a) {
        const m = a[d];
        if (Ha.has(d)) {
            h = !0;
            continue
        } else if ($f(d)) {
            u[d] = m;
            continue
        } else {
            const y = av(m, oh[d]);
            d.startsWith("origin") ? (p = !0,
            f[d] = y) : o[d] = y
        }
    }
    if (a.transform || (h || s ? o.transform = S7(a, n.transform, s) : o.transform && (o.transform = "none")),
    p) {
        const {originX: d="50%", originY: m="50%", originZ: y=0} = f;
        o.transformOrigin = `${d} ${m} ${y}`
    }
}
const mh = () => ({
    style: {},
    transform: {},
    transformOrigin: {},
    vars: {}
});
function pv(n, a, s) {
    for (const o in a)
        !ue(a[o]) && !mv(o, s) && (n[o] = a[o])
}
function b7({transformTemplate: n}, a) {
    return H.useMemo( () => {
        const s = mh();
        return dh(s, a, n),
        Object.assign({}, s.vars, s.style)
    }
    , [a])
}
function T7(n, a) {
    const s = n.style || {}
      , o = {};
    return pv(o, s, n),
    Object.assign(o, b7(n, a)),
    o
}
function C7(n, a) {
    const s = {}
      , o = T7(n, a);
    return n.drag && n.dragListener !== !1 && (s.draggable = !1,
    o.userSelect = o.WebkitUserSelect = o.WebkitTouchCallout = "none",
    o.touchAction = n.drag === !0 ? "none" : `pan-${n.drag === "x" ? "y" : "x"}`),
    n.tabIndex === void 0 && (n.onTap || n.onTapStart || n.whileTap) && (s.tabIndex = 0),
    s.style = o,
    s
}
const x7 = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray"
}
  , R7 = {
    offset: "strokeDashoffset",
    array: "strokeDasharray"
};
function M7(n, a, s=1, o=0, u=!0) {
    n.pathLength = 1;
    const f = u ? x7 : R7;
    n[f.offset] = lt.transform(-o);
    const h = lt.transform(a)
      , p = lt.transform(s);
    n[f.array] = `${h} ${p}`
}
function yv(n, {attrX: a, attrY: s, attrScale: o, pathLength: u, pathSpacing: f=1, pathOffset: h=0, ...p}, d, m, y) {
    if (dh(n, p, m),
    d) {
        n.style.viewBox && (n.attrs.viewBox = n.style.viewBox);
        return
    }
    n.attrs = n.style,
    n.style = {};
    const {attrs: g, style: S} = n;
    g.transform && (S.transform = g.transform,
    delete g.transform),
    (S.transform || g.transformOrigin) && (S.transformOrigin = g.transformOrigin ?? "50% 50%",
    delete g.transformOrigin),
    S.transform && (S.transformBox = y?.transformBox ?? "fill-box",
    delete g.transformBox),
    a !== void 0 && (g.x = a),
    s !== void 0 && (g.y = s),
    o !== void 0 && (g.scale = o),
    u !== void 0 && M7(g, u, f, h, !1)
}
const vv = () => ({
    ...mh(),
    attrs: {}
})
  , gv = n => typeof n == "string" && n.toLowerCase() === "svg";
function E7(n, a, s, o) {
    const u = H.useMemo( () => {
        const f = vv();
        return yv(f, a, gv(o), n.transformTemplate, n.style),
        {
            ...f.attrs,
            style: {
                ...f.style
            }
        }
    }
    , [a]);
    if (n.style) {
        const f = {};
        pv(f, n.style, n),
        u.style = {
            ...f,
            ...u.style
        }
    }
    return u
}
const _7 = ["animate", "circle", "defs", "desc", "ellipse", "g", "image", "line", "filter", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline", "rect", "stop", "switch", "symbol", "svg", "text", "tspan", "use", "view"];
function ph(n) {
    return typeof n != "string" || n.includes("-") ? !1 : !!(_7.indexOf(n) > -1 || /[A-Z]/u.test(n))
}
function A7(n, a, s, {latestValues: o}, u, f=!1) {
    const p = (ph(n) ? E7 : C7)(a, o, u, n)
      , d = d7(a, typeof n == "string", f)
      , m = n !== H.Fragment ? {
        ...d,
        ...p,
        ref: s
    } : {}
      , {children: y} = a
      , g = H.useMemo( () => ue(y) ? y.get() : y, [y]);
    return H.createElement(n, {
        ...m,
        children: g
    })
}
function r1(n) {
    const a = [{}, {}];
    return n?.values.forEach( (s, o) => {
        a[0][o] = s.get(),
        a[1][o] = s.getVelocity()
    }
    ),
    a
}
function yh(n, a, s, o) {
    if (typeof a == "function") {
        const [u,f] = r1(o);
        a = a(s !== void 0 ? s : n.custom, u, f)
    }
    if (typeof a == "string" && (a = n.variants && n.variants[a]),
    typeof a == "function") {
        const [u,f] = r1(o);
        a = a(s !== void 0 ? s : n.custom, u, f)
    }
    return a
}
function Yo(n) {
    return ue(n) ? n.get() : n
}
function D7({scrapeMotionValuesFromProps: n, createRenderState: a}, s, o, u) {
    return {
        latestValues: L7(s, o, u, n),
        renderState: a()
    }
}
function L7(n, a, s, o) {
    const u = {}
      , f = o(n, {});
    for (const S in f)
        u[S] = Yo(f[S]);
    let {initial: h, animate: p} = n;
    const d = fr(n)
      , m = dv(n);
    a && m && !d && n.inherit !== !1 && (h === void 0 && (h = a.initial),
    p === void 0 && (p = a.animate));
    let y = s ? s.initial === !1 : !1;
    y = y || h === !1;
    const g = y ? p : h;
    if (g && typeof g != "boolean" && !cr(g)) {
        const S = Array.isArray(g) ? g : [g];
        for (let T = 0; T < S.length; T++) {
            const C = yh(n, S[T]);
            if (C) {
                const {transitionEnd: E, transition: A, ...V} = C;
                for (const q in V) {
                    let B = V[q];
                    if (Array.isArray(B)) {
                        const G = y ? B.length - 1 : 0;
                        B = B[G]
                    }
                    B !== null && (u[q] = B)
                }
                for (const q in E)
                    u[q] = E[q]
            }
        }
    }
    return u
}
const Sv = n => (a, s) => {
    const o = H.useContext(ur)
      , u = H.useContext(rr)
      , f = () => D7(n, a, o, u);
    return s ? f() : qf(f)
}
;
function vh(n, a, s) {
    const {style: o} = n
      , u = {};
    for (const f in o)
        (ue(o[f]) || a.style && ue(a.style[f]) || mv(f, n) || s?.getValue(f)?.liveStyle !== void 0) && (u[f] = o[f]);
    return u
}
const O7 = Sv({
    scrapeMotionValuesFromProps: vh,
    createRenderState: mh
});
function bv(n, a, s) {
    const o = vh(n, a, s);
    for (const u in n)
        if (ue(n[u]) || ue(a[u])) {
            const f = Pa.indexOf(u) !== -1 ? "attr" + u.charAt(0).toUpperCase() + u.substring(1) : u;
            o[f] = n[u]
        }
    return o
}
const V7 = Sv({
    scrapeMotionValuesFromProps: bv,
    createRenderState: vv
})
  , w7 = Symbol.for("motionComponentSymbol");
function Ma(n) {
    return n && typeof n == "object" && Object.prototype.hasOwnProperty.call(n, "current")
}
function z7(n, a, s) {
    return H.useCallback(o => {
        o && n.onMount && n.onMount(o),
        a && (o ? a.mount(o) : a.unmount()),
        s && (typeof s == "function" ? s(o) : Ma(s) && (s.current = o))
    }
    , [a])
}
const gh = n => n.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase()
  , B7 = "framerAppearId"
  , Tv = "data-" + gh(B7)
  , Cv = H.createContext({});
function U7(n, a, s, o, u) {
    const {visualElement: f} = H.useContext(ur)
      , h = H.useContext(fv)
      , p = H.useContext(rr)
      , d = H.useContext(ch).reducedMotion
      , m = H.useRef(null);
    o = o || h.renderer,
    !m.current && o && (m.current = o(n, {
        visualState: a,
        parent: f,
        props: s,
        presenceContext: p,
        blockInitialAnimation: p ? p.initial === !1 : !1,
        reducedMotionConfig: d
    }));
    const y = m.current
      , g = H.useContext(Cv);
    y && !y.projection && u && (y.type === "html" || y.type === "svg") && N7(m.current, s, u, g);
    const S = H.useRef(!1);
    H.useInsertionEffect( () => {
        y && S.current && y.update(s, p)
    }
    );
    const T = s[Tv]
      , C = H.useRef(!!T && !window.MotionHandoffIsComplete?.(T) && window.MotionHasOptimisedAnimation?.(T));
    return by( () => {
        y && (S.current = !0,
        window.MotionIsMounted = !0,
        y.updateFeatures(),
        y.scheduleRenderMicrotask(),
        C.current && y.animationState && y.animationState.animateChanges())
    }
    ),
    H.useEffect( () => {
        y && (!C.current && y.animationState && y.animationState.animateChanges(),
        C.current && (queueMicrotask( () => {
            window.MotionHandoffMarkAsComplete?.(T)
        }
        ),
        C.current = !1),
        y.enteringChildren = void 0)
    }
    ),
    y
}
function N7(n, a, s, o) {
    const {layoutId: u, layout: f, drag: h, dragConstraints: p, layoutScroll: d, layoutRoot: m, layoutCrossfade: y} = a;
    n.projection = new s(n.latestValues,a["data-framer-portal-id"] ? void 0 : xv(n.parent)),
    n.projection.setOptions({
        layoutId: u,
        layout: f,
        alwaysMeasureLayout: !!h || p && Ma(p),
        visualElement: n,
        animationType: typeof f == "string" ? f : "both",
        initialPromotionConfig: o,
        crossfade: y,
        layoutScroll: d,
        layoutRoot: m
    })
}
function xv(n) {
    if (n)
        return n.options.allowProjection !== !1 ? n.projection : xv(n.parent)
}
function Fc(n, {forwardMotionProps: a=!1}={}, s, o) {
    s && c7(s);
    const u = ph(n) ? V7 : O7;
    function f(p, d) {
        let m;
        const y = {
            ...H.useContext(ch),
            ...p,
            layoutId: j7(p)
        }
          , {isStatic: g} = y
          , S = p7(p)
          , T = u(p, g);
        if (!g && Yf) {
            P7();
            const C = H7(y);
            m = C.MeasureLayout,
            S.visualElement = U7(n, T, y, o, C.ProjectionNode)
        }
        return X.jsxs(ur.Provider, {
            value: S,
            children: [m && S.visualElement ? X.jsx(m, {
                visualElement: S.visualElement,
                ...y
            }) : null, A7(n, p, z7(T, S.visualElement, d), T, g, a)]
        })
    }
    f.displayName = `motion.${typeof n == "string" ? n : `create(${n.displayName ?? n.name ?? ""})`}`;
    const h = H.forwardRef(f);
    return h[w7] = n,
    h
}
function j7({layoutId: n}) {
    const a = H.useContext(Hf).id;
    return a && n !== void 0 ? a + "-" + n : n
}
function P7(n, a) {
    H.useContext(fv).strict
}
function H7(n) {
    const {drag: a, layout: s} = Na;
    if (!a && !s)
        return {};
    const o = {
        ...a,
        ...s
    };
    return {
        MeasureLayout: a?.isEnabled(n) || s?.isEnabled(n) ? o.MeasureLayout : void 0,
        ProjectionNode: o.ProjectionNode
    }
}
function q7(n, a) {
    if (typeof Proxy > "u")
        return Fc;
    const s = new Map
      , o = (f, h) => Fc(f, h, n, a)
      , u = (f, h) => o(f, h);
    return new Proxy(u,{
        get: (f, h) => h === "create" ? o : (s.has(h) || s.set(h, Fc(h, void 0, n, a)),
        s.get(h))
    })
}
function Rv({top: n, left: a, right: s, bottom: o}) {
    return {
        x: {
            min: a,
            max: s
        },
        y: {
            min: n,
            max: o
        }
    }
}
function Y7({x: n, y: a}) {
    return {
        top: a.min,
        right: n.max,
        bottom: a.max,
        left: n.min
    }
}
function G7(n, a) {
    if (!a)
        return n;
    const s = a({
        x: n.left,
        y: n.top
    })
      , o = a({
        x: n.right,
        y: n.bottom
    });
    return {
        top: s.y,
        left: s.x,
        bottom: o.y,
        right: o.x
    }
}
function $c(n) {
    return n === void 0 || n === 1
}
function xf({scale: n, scaleX: a, scaleY: s}) {
    return !$c(n) || !$c(a) || !$c(s)
}
function _i(n) {
    return xf(n) || Mv(n) || n.z || n.rotate || n.rotateX || n.rotateY || n.skewX || n.skewY
}
function Mv(n) {
    return u1(n.x) || u1(n.y)
}
function u1(n) {
    return n && n !== "0%"
}
function ar(n, a, s) {
    const o = n - s
      , u = a * o;
    return s + u
}
function c1(n, a, s, o, u) {
    return u !== void 0 && (n = ar(n, u, o)),
    ar(n, s, o) + a
}
function Rf(n, a=0, s=1, o, u) {
    n.min = c1(n.min, a, s, o, u),
    n.max = c1(n.max, a, s, o, u)
}
function Ev(n, {x: a, y: s}) {
    Rf(n.x, a.translate, a.scale, a.originPoint),
    Rf(n.y, s.translate, s.scale, s.originPoint)
}
const f1 = .999999999999
  , h1 = 1.0000000000001;
function k7(n, a, s, o=!1) {
    const u = s.length;
    if (!u)
        return;
    a.x = a.y = 1;
    let f, h;
    for (let p = 0; p < u; p++) {
        f = s[p],
        h = f.projectionDelta;
        const {visualElement: d} = f.options;
        d && d.props.style && d.props.style.display === "contents" || (o && f.options.layoutScroll && f.scroll && f !== f.root && _a(n, {
            x: -f.scroll.offset.x,
            y: -f.scroll.offset.y
        }),
        h && (a.x *= h.x.scale,
        a.y *= h.y.scale,
        Ev(n, h)),
        o && _i(f.latestValues) && _a(n, f.latestValues))
    }
    a.x < h1 && a.x > f1 && (a.x = 1),
    a.y < h1 && a.y > f1 && (a.y = 1)
}
function Ea(n, a) {
    n.min = n.min + a,
    n.max = n.max + a
}
function d1(n, a, s, o, u=.5) {
    const f = Bt(n.min, n.max, u);
    Rf(n, a, s, f, o)
}
function _a(n, a) {
    d1(n.x, a.x, a.scaleX, a.scale, a.originX),
    d1(n.y, a.y, a.scaleY, a.scale, a.originY)
}
function _v(n, a) {
    return Rv(G7(n.getBoundingClientRect(), a))
}
function X7(n, a, s) {
    const o = _v(n, s)
      , {scroll: u} = a;
    return u && (Ea(o.x, u.offset.x),
    Ea(o.y, u.offset.y)),
    o
}
const m1 = () => ({
    translate: 0,
    scale: 1,
    origin: 0,
    originPoint: 0
})
  , Aa = () => ({
    x: m1(),
    y: m1()
})
  , p1 = () => ({
    min: 0,
    max: 0
})
  , Yt = () => ({
    x: p1(),
    y: p1()
})
  , Mf = {
    current: null
}
  , Av = {
    current: !1
};
function K7() {
    if (Av.current = !0,
    !!Yf)
        if (window.matchMedia) {
            const n = window.matchMedia("(prefers-reduced-motion)")
              , a = () => Mf.current = n.matches;
            n.addEventListener("change", a),
            a()
        } else
            Mf.current = !1
}
const Z7 = new WeakMap;
function Q7(n, a, s) {
    for (const o in a) {
        const u = a[o]
          , f = s[o];
        if (ue(u))
            n.addValue(o, u);
        else if (ue(f))
            n.addValue(o, Ua(u, {
                owner: n
            }));
        else if (f !== u)
            if (n.hasValue(o)) {
                const h = n.getValue(o);
                h.liveStyle === !0 ? h.jump(u) : h.hasAnimated || h.set(u)
            } else {
                const h = n.getStaticValue(o);
                n.addValue(o, Ua(h !== void 0 ? h : u, {
                    owner: n
                }))
            }
    }
    for (const o in s)
        a[o] === void 0 && n.removeValue(o);
    return a
}
const y1 = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"];
class F7 {
    scrapeMotionValuesFromProps(a, s, o) {
        return {}
    }
    constructor({parent: a, props: s, presenceContext: o, reducedMotionConfig: u, blockInitialAnimation: f, visualState: h}, p={}) {
        this.current = null,
        this.children = new Set,
        this.isVariantNode = !1,
        this.isControllingVariants = !1,
        this.shouldReduceMotion = null,
        this.values = new Map,
        this.KeyframeResolver = sh,
        this.features = {},
        this.valueSubscriptions = new Map,
        this.prevMotionValues = {},
        this.events = {},
        this.propEventSubscriptions = {},
        this.notifyUpdate = () => this.notify("Update", this.latestValues),
        this.render = () => {
            this.current && (this.triggerBuild(),
            this.renderInstance(this.current, this.renderState, this.props.style, this.projection))
        }
        ,
        this.renderScheduledAt = 0,
        this.scheduleRender = () => {
            const S = ge.now();
            this.renderScheduledAt < S && (this.renderScheduledAt = S,
            Vt.render(this.render, !1, !0))
        }
        ;
        const {latestValues: d, renderState: m} = h;
        this.latestValues = d,
        this.baseTarget = {
            ...d
        },
        this.initialValues = s.initial ? {
            ...d
        } : {},
        this.renderState = m,
        this.parent = a,
        this.props = s,
        this.presenceContext = o,
        this.depth = a ? a.depth + 1 : 0,
        this.reducedMotionConfig = u,
        this.options = p,
        this.blockInitialAnimation = !!f,
        this.isControllingVariants = fr(s),
        this.isVariantNode = dv(s),
        this.isVariantNode && (this.variantChildren = new Set),
        this.manuallyAnimateOnMount = !!(a && a.current);
        const {willChange: y, ...g} = this.scrapeMotionValuesFromProps(s, {}, this);
        for (const S in g) {
            const T = g[S];
            d[S] !== void 0 && ue(T) && T.set(d[S])
        }
    }
    mount(a) {
        this.current = a,
        Z7.set(a, this),
        this.projection && !this.projection.instance && this.projection.mount(a),
        this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)),
        this.values.forEach( (s, o) => this.bindToMotionValue(o, s)),
        Av.current || K7(),
        this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Mf.current,
        this.parent?.addChild(this),
        this.update(this.props, this.presenceContext)
    }
    unmount() {
        this.projection && this.projection.unmount(),
        ni(this.notifyUpdate),
        ni(this.render),
        this.valueSubscriptions.forEach(a => a()),
        this.valueSubscriptions.clear(),
        this.removeFromVariantTree && this.removeFromVariantTree(),
        this.parent?.removeChild(this);
        for (const a in this.events)
            this.events[a].clear();
        for (const a in this.features) {
            const s = this.features[a];
            s && (s.unmount(),
            s.isMounted = !1)
        }
        this.current = null
    }
    addChild(a) {
        this.children.add(a),
        this.enteringChildren ?? (this.enteringChildren = new Set),
        this.enteringChildren.add(a)
    }
    removeChild(a) {
        this.children.delete(a),
        this.enteringChildren && this.enteringChildren.delete(a)
    }
    bindToMotionValue(a, s) {
        this.valueSubscriptions.has(a) && this.valueSubscriptions.get(a)();
        const o = Ha.has(a);
        o && this.onBindTransform && this.onBindTransform();
        const u = s.on("change", h => {
            this.latestValues[a] = h,
            this.props.onUpdate && Vt.preRender(this.notifyUpdate),
            o && this.projection && (this.projection.isTransformDirty = !0),
            this.scheduleRender()
        }
        );
        let f;
        window.MotionCheckAppearSync && (f = window.MotionCheckAppearSync(this, a, s)),
        this.valueSubscriptions.set(a, () => {
            u(),
            f && f(),
            s.owner && s.stop()
        }
        )
    }
    sortNodePosition(a) {
        return !this.current || !this.sortInstanceNodePosition || this.type !== a.type ? 0 : this.sortInstanceNodePosition(this.current, a.current)
    }
    updateFeatures() {
        let a = "animation";
        for (a in Na) {
            const s = Na[a];
            if (!s)
                continue;
            const {isEnabled: o, Feature: u} = s;
            if (!this.features[a] && u && o(this.props) && (this.features[a] = new u(this)),
            this.features[a]) {
                const f = this.features[a];
                f.isMounted ? f.update() : (f.mount(),
                f.isMounted = !0)
            }
        }
    }
    triggerBuild() {
        this.build(this.renderState, this.latestValues, this.props)
    }
    measureViewportBox() {
        return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Yt()
    }
    getStaticValue(a) {
        return this.latestValues[a]
    }
    setStaticValue(a, s) {
        this.latestValues[a] = s
    }
    update(a, s) {
        (a.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
        this.prevProps = this.props,
        this.props = a,
        this.prevPresenceContext = this.presenceContext,
        this.presenceContext = s;
        for (let o = 0; o < y1.length; o++) {
            const u = y1[o];
            this.propEventSubscriptions[u] && (this.propEventSubscriptions[u](),
            delete this.propEventSubscriptions[u]);
            const f = "on" + u
              , h = a[f];
            h && (this.propEventSubscriptions[u] = this.on(u, h))
        }
        this.prevMotionValues = Q7(this, this.scrapeMotionValuesFromProps(a, this.prevProps, this), this.prevMotionValues),
        this.handleChildMotionValue && this.handleChildMotionValue()
    }
    getProps() {
        return this.props
    }
    getVariant(a) {
        return this.props.variants ? this.props.variants[a] : void 0
    }
    getDefaultTransition() {
        return this.props.transition
    }
    getTransformPagePoint() {
        return this.props.transformPagePoint
    }
    getClosestVariantNode() {
        return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0
    }
    addVariantChild(a) {
        const s = this.getClosestVariantNode();
        if (s)
            return s.variantChildren && s.variantChildren.add(a),
            () => s.variantChildren.delete(a)
    }
    addValue(a, s) {
        const o = this.values.get(a);
        s !== o && (o && this.removeValue(a),
        this.bindToMotionValue(a, s),
        this.values.set(a, s),
        this.latestValues[a] = s.get())
    }
    removeValue(a) {
        this.values.delete(a);
        const s = this.valueSubscriptions.get(a);
        s && (s(),
        this.valueSubscriptions.delete(a)),
        delete this.latestValues[a],
        this.removeValueFromRenderState(a, this.renderState)
    }
    hasValue(a) {
        return this.values.has(a)
    }
    getValue(a, s) {
        if (this.props.values && this.props.values[a])
            return this.props.values[a];
        let o = this.values.get(a);
        return o === void 0 && s !== void 0 && (o = Ua(s === null ? void 0 : s, {
            owner: this
        }),
        this.addValue(a, o)),
        o
    }
    readValue(a, s) {
        let o = this.latestValues[a] !== void 0 || !this.current ? this.latestValues[a] : this.getBaseTargetFromProps(this.props, a) ?? this.readValueFromInstance(this.current, a, this.options);
        return o != null && (typeof o == "string" && (Ty(o) || xy(o)) ? o = parseFloat(o) : !n7(o) && ii.test(s) && (o = iv(a, s)),
        this.setBaseTarget(a, ue(o) ? o.get() : o)),
        ue(o) ? o.get() : o
    }
    setBaseTarget(a, s) {
        this.baseTarget[a] = s
    }
    getBaseTarget(a) {
        const {initial: s} = this.props;
        let o;
        if (typeof s == "string" || typeof s == "object") {
            const f = yh(this.props, s, this.presenceContext?.custom);
            f && (o = f[a])
        }
        if (s && o !== void 0)
            return o;
        const u = this.getBaseTargetFromProps(this.props, a);
        return u !== void 0 && !ue(u) ? u : this.initialValues[a] !== void 0 && o === void 0 ? void 0 : this.baseTarget[a]
    }
    on(a, s) {
        return this.events[a] || (this.events[a] = new Zf),
        this.events[a].add(s)
    }
    notify(a, ...s) {
        this.events[a] && this.events[a].notify(...s)
    }
    scheduleRenderMicrotask() {
        rh.render(this.render)
    }
}
class Dv extends F7 {
    constructor() {
        super(...arguments),
        this.KeyframeResolver = k6
    }
    sortInstanceNodePosition(a, s) {
        return a.compareDocumentPosition(s) & 2 ? 1 : -1
    }
    getBaseTargetFromProps(a, s) {
        return a.style ? a.style[s] : void 0
    }
    removeValueFromRenderState(a, {vars: s, style: o}) {
        delete s[a],
        delete o[a]
    }
    handleChildMotionValue() {
        this.childSubscription && (this.childSubscription(),
        delete this.childSubscription);
        const {children: a} = this.props;
        ue(a) && (this.childSubscription = a.on("change", s => {
            this.current && (this.current.textContent = `${s}`)
        }
        ))
    }
}
function Lv(n, {style: a, vars: s}, o, u) {
    const f = n.style;
    let h;
    for (h in a)
        f[h] = a[h];
    u?.applyProjectionStyles(f, o);
    for (h in s)
        f.setProperty(h, s[h])
}
function $7(n) {
    return window.getComputedStyle(n)
}
class J7 extends Dv {
    constructor() {
        super(...arguments),
        this.type = "html",
        this.renderInstance = Lv
    }
    readValueFromInstance(a, s) {
        if (Ha.has(s))
            return this.projection?.isProjecting ? yf(s) : u6(a, s);
        {
            const o = $7(a)
              , u = ($f(s) ? o.getPropertyValue(s) : o[s]) || 0;
            return typeof u == "string" ? u.trim() : u
        }
    }
    measureInstanceViewportBox(a, {transformPagePoint: s}) {
        return _v(a, s)
    }
    build(a, s, o) {
        dh(a, s, o.transformTemplate)
    }
    scrapeMotionValuesFromProps(a, s, o) {
        return vh(a, s, o)
    }
}
const Ov = new Set(["baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust"]);
function W7(n, a, s, o) {
    Lv(n, a, void 0, o);
    for (const u in a.attrs)
        n.setAttribute(Ov.has(u) ? u : gh(u), a.attrs[u])
}
class I7 extends Dv {
    constructor() {
        super(...arguments),
        this.type = "svg",
        this.isSVGTag = !1,
        this.measureInstanceViewportBox = Yt
    }
    getBaseTargetFromProps(a, s) {
        return a[s]
    }
    readValueFromInstance(a, s) {
        if (Ha.has(s)) {
            const o = nv(s);
            return o && o.default || 0
        }
        return s = Ov.has(s) ? s : gh(s),
        a.getAttribute(s)
    }
    scrapeMotionValuesFromProps(a, s, o) {
        return bv(a, s, o)
    }
    build(a, s, o) {
        yv(a, s, this.isSVGTag, o.transformTemplate, o.style)
    }
    renderInstance(a, s, o, u) {
        W7(a, s, o, u)
    }
    mount(a) {
        this.isSVGTag = gv(a.tagName),
        super.mount(a)
    }
}
const tS = (n, a) => ph(n) ? new I7(a) : new J7(a,{
    allowProjection: n !== H.Fragment
});
function Oa(n, a, s) {
    const o = n.getProps();
    return yh(o, a, s !== void 0 ? s : o.custom, n)
}
const Ef = n => Array.isArray(n);
function eS(n, a, s) {
    n.hasValue(a) ? n.getValue(a).set(s) : n.addValue(a, Ua(s))
}
function nS(n) {
    return Ef(n) ? n[n.length - 1] || 0 : n
}
function iS(n, a) {
    const s = Oa(n, a);
    let {transitionEnd: o={}, transition: u={}, ...f} = s || {};
    f = {
        ...f,
        ...o
    };
    for (const h in f) {
        const p = nS(f[h]);
        eS(n, h, p)
    }
}
function aS(n) {
    return !!(ue(n) && n.add)
}
function _f(n, a) {
    const s = n.getValue("willChange");
    if (aS(s))
        return s.add(a);
    if (!s && An.WillChange) {
        const o = new An.WillChange("auto");
        n.addValue("willChange", o),
        o.add(a)
    }
}
function Vv(n) {
    return n.props[Tv]
}
const sS = n => n !== null;
function lS(n, {repeat: a, repeatType: s="loop"}, o) {
    const u = n.filter(sS)
      , f = a && s !== "loop" && a % 2 === 1 ? 0 : u.length - 1;
    return u[f]
}
const oS = {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10
}
  , rS = n => ({
    type: "spring",
    stiffness: 550,
    damping: n === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10
})
  , uS = {
    type: "keyframes",
    duration: .8
}
  , cS = {
    type: "keyframes",
    ease: [.25, .1, .35, 1],
    duration: .3
}
  , fS = (n, {keyframes: a}) => a.length > 2 ? uS : Ha.has(n) ? n.startsWith("scale") ? rS(a[1]) : oS : cS;
function hS({when: n, delay: a, delayChildren: s, staggerChildren: o, staggerDirection: u, repeat: f, repeatType: h, repeatDelay: p, from: d, elapsed: m, ...y}) {
    return !!Object.keys(y).length
}
const Sh = (n, a, s, o={}, u, f) => h => {
    const p = lh(o, n) || {}
      , d = p.delay || o.delay || 0;
    let {elapsed: m=0} = o;
    m = m - an(d);
    const y = {
        keyframes: Array.isArray(s) ? s : [null, s],
        ease: "easeOut",
        velocity: a.getVelocity(),
        ...p,
        delay: -m,
        onUpdate: S => {
            a.set(S),
            p.onUpdate && p.onUpdate(S)
        }
        ,
        onComplete: () => {
            h(),
            p.onComplete && p.onComplete()
        }
        ,
        name: n,
        motionValue: a,
        element: f ? void 0 : u
    };
    hS(p) || Object.assign(y, fS(n, y)),
    y.duration && (y.duration = an(y.duration)),
    y.repeatDelay && (y.repeatDelay = an(y.repeatDelay)),
    y.from !== void 0 && (y.keyframes[0] = y.from);
    let g = !1;
    if ((y.type === !1 || y.duration === 0 && !y.repeatDelay) && (Tf(y),
    y.delay === 0 && (g = !0)),
    (An.instantAnimations || An.skipAnimations) && (g = !0,
    Tf(y),
    y.delay = 0),
    y.allowFlatten = !p.type && !p.ease,
    g && !f && a.get() !== void 0) {
        const S = lS(y.keyframes, p);
        if (S !== void 0) {
            Vt.update( () => {
                y.onUpdate(S),
                y.onComplete()
            }
            );
            return
        }
    }
    return p.isSync ? new ah(y) : new V6(y)
}
;
function dS({protectedKeys: n, needsAnimating: a}, s) {
    const o = n.hasOwnProperty(s) && a[s] !== !0;
    return a[s] = !1,
    o
}
function wv(n, a, {delay: s=0, transitionOverride: o, type: u}={}) {
    let {transition: f=n.getDefaultTransition(), transitionEnd: h, ...p} = a;
    o && (f = o);
    const d = []
      , m = u && n.animationState && n.animationState.getState()[u];
    for (const y in p) {
        const g = n.getValue(y, n.latestValues[y] ?? null)
          , S = p[y];
        if (S === void 0 || m && dS(m, y))
            continue;
        const T = {
            delay: s,
            ...lh(f || {}, y)
        }
          , C = g.get();
        if (C !== void 0 && !g.isAnimating && !Array.isArray(S) && S === C && !T.velocity)
            continue;
        let E = !1;
        if (window.MotionHandoffAnimation) {
            const V = Vv(n);
            if (V) {
                const q = window.MotionHandoffAnimation(V, y, Vt);
                q !== null && (T.startTime = q,
                E = !0)
            }
        }
        _f(n, y),
        g.start(Sh(y, g, S, n.shouldReduceMotion && Iy.has(y) ? {
            type: !1
        } : T, n, E));
        const A = g.animation;
        A && d.push(A)
    }
    return h && Promise.all(d).then( () => {
        Vt.update( () => {
            h && iS(n, h)
        }
        )
    }
    ),
    d
}
function zv(n, a, s, o=0, u=1) {
    const f = Array.from(n).sort( (m, y) => m.sortNodePosition(y)).indexOf(a)
      , h = n.size
      , p = (h - 1) * o;
    return typeof s == "function" ? s(f, h) : u === 1 ? f * o : p - f * o
}
function Af(n, a, s={}) {
    const o = Oa(n, a, s.type === "exit" ? n.presenceContext?.custom : void 0);
    let {transition: u=n.getDefaultTransition() || {}} = o || {};
    s.transitionOverride && (u = s.transitionOverride);
    const f = o ? () => Promise.all(wv(n, o, s)) : () => Promise.resolve()
      , h = n.variantChildren && n.variantChildren.size ? (d=0) => {
        const {delayChildren: m=0, staggerChildren: y, staggerDirection: g} = u;
        return mS(n, a, d, m, y, g, s)
    }
    : () => Promise.resolve()
      , {when: p} = u;
    if (p) {
        const [d,m] = p === "beforeChildren" ? [f, h] : [h, f];
        return d().then( () => m())
    } else
        return Promise.all([f(), h(s.delay)])
}
function mS(n, a, s=0, o=0, u=0, f=1, h) {
    const p = [];
    for (const d of n.variantChildren)
        d.notify("AnimationStart", a),
        p.push(Af(d, a, {
            ...h,
            delay: s + (typeof o == "function" ? 0 : o) + zv(n.variantChildren, d, o, u, f)
        }).then( () => d.notify("AnimationComplete", a)));
    return Promise.all(p)
}
function pS(n, a, s={}) {
    n.notify("AnimationStart", a);
    let o;
    if (Array.isArray(a)) {
        const u = a.map(f => Af(n, f, s));
        o = Promise.all(u)
    } else if (typeof a == "string")
        o = Af(n, a, s);
    else {
        const u = typeof a == "function" ? Oa(n, a, s.custom) : a;
        o = Promise.all(wv(n, u, s))
    }
    return o.then( () => {
        n.notify("AnimationComplete", a)
    }
    )
}
function Bv(n, a) {
    if (!Array.isArray(a))
        return !1;
    const s = a.length;
    if (s !== n.length)
        return !1;
    for (let o = 0; o < s; o++)
        if (a[o] !== n[o])
            return !1;
    return !0
}
const yS = hh.length;
function Uv(n) {
    if (!n)
        return;
    if (!n.isControllingVariants) {
        const s = n.parent ? Uv(n.parent) || {} : {};
        return n.props.initial !== void 0 && (s.initial = n.props.initial),
        s
    }
    const a = {};
    for (let s = 0; s < yS; s++) {
        const o = hh[s]
          , u = n.props[o];
        (sl(u) || u === !1) && (a[o] = u)
    }
    return a
}
const vS = [...fh].reverse()
  , gS = fh.length;
function SS(n) {
    return a => Promise.all(a.map( ({animation: s, options: o}) => pS(n, s, o)))
}
function bS(n) {
    let a = SS(n)
      , s = v1()
      , o = !0;
    const u = d => (m, y) => {
        const g = Oa(n, y, d === "exit" ? n.presenceContext?.custom : void 0);
        if (g) {
            const {transition: S, transitionEnd: T, ...C} = g;
            m = {
                ...m,
                ...C,
                ...T
            }
        }
        return m
    }
    ;
    function f(d) {
        a = d(n)
    }
    function h(d) {
        const {props: m} = n
          , y = Uv(n.parent) || {}
          , g = []
          , S = new Set;
        let T = {}
          , C = 1 / 0;
        for (let A = 0; A < gS; A++) {
            const V = vS[A]
              , q = s[V]
              , B = m[V] !== void 0 ? m[V] : y[V]
              , G = sl(B)
              , j = V === d ? q.isActive : null;
            j === !1 && (C = A);
            let Z = B === y[V] && B !== m[V] && G;
            if (Z && o && n.manuallyAnimateOnMount && (Z = !1),
            q.protectedKeys = {
                ...T
            },
            !q.isActive && j === null || !B && !q.prevProp || cr(B) || typeof B == "boolean")
                continue;
            const Q = TS(q.prevProp, B);
            let K = Q || V === d && q.isActive && !Z && G || A > C && G
              , tt = !1;
            const F = Array.isArray(B) ? B : [B];
            let rt = F.reduce(u(V), {});
            j === !1 && (rt = {});
            const {prevResolvedValues: ft={}} = q
              , Gt = {
                ...ft,
                ...rt
            }
              , _t = k => {
                K = !0,
                S.has(k) && (tt = !0,
                S.delete(k)),
                q.needsAnimating[k] = !0;
                const W = n.getValue(k);
                W && (W.liveStyle = !1)
            }
            ;
            for (const k in Gt) {
                const W = rt[k]
                  , dt = ft[k];
                if (T.hasOwnProperty(k))
                    continue;
                let R = !1;
                Ef(W) && Ef(dt) ? R = !Bv(W, dt) : R = W !== dt,
                R ? W != null ? _t(k) : S.add(k) : W !== void 0 && S.has(k) ? _t(k) : q.protectedKeys[k] = !0
            }
            q.prevProp = B,
            q.prevResolvedValues = rt,
            q.isActive && (T = {
                ...T,
                ...rt
            }),
            o && n.blockInitialAnimation && (K = !1);
            const Lt = Z && Q;
            K && (!Lt || tt) && g.push(...F.map(k => {
                const W = {
                    type: V
                };
                if (typeof k == "string" && o && !Lt && n.manuallyAnimateOnMount && n.parent) {
                    const {parent: dt} = n
                      , R = Oa(dt, k);
                    if (dt.enteringChildren && R) {
                        const {delayChildren: Y} = R.transition || {};
                        W.delay = zv(dt.enteringChildren, n, Y)
                    }
                }
                return {
                    animation: k,
                    options: W
                }
            }
            ))
        }
        if (S.size) {
            const A = {};
            if (typeof m.initial != "boolean") {
                const V = Oa(n, Array.isArray(m.initial) ? m.initial[0] : m.initial);
                V && V.transition && (A.transition = V.transition)
            }
            S.forEach(V => {
                const q = n.getBaseTarget(V)
                  , B = n.getValue(V);
                B && (B.liveStyle = !0),
                A[V] = q ?? null
            }
            ),
            g.push({
                animation: A
            })
        }
        let E = !!g.length;
        return o && (m.initial === !1 || m.initial === m.animate) && !n.manuallyAnimateOnMount && (E = !1),
        o = !1,
        E ? a(g) : Promise.resolve()
    }
    function p(d, m) {
        if (s[d].isActive === m)
            return Promise.resolve();
        n.variantChildren?.forEach(g => g.animationState?.setActive(d, m)),
        s[d].isActive = m;
        const y = h(d);
        for (const g in s)
            s[g].protectedKeys = {};
        return y
    }
    return {
        animateChanges: h,
        setActive: p,
        setAnimateFunction: f,
        getState: () => s,
        reset: () => {
            s = v1(),
            o = !0
        }
    }
}
function TS(n, a) {
    return typeof a == "string" ? a !== n : Array.isArray(a) ? !Bv(a, n) : !1
}
function Ei(n=!1) {
    return {
        isActive: n,
        protectedKeys: {},
        needsAnimating: {},
        prevResolvedValues: {}
    }
}
function v1() {
    return {
        animate: Ei(!0),
        whileInView: Ei(),
        whileHover: Ei(),
        whileTap: Ei(),
        whileDrag: Ei(),
        whileFocus: Ei(),
        exit: Ei()
    }
}
class ai {
    constructor(a) {
        this.isMounted = !1,
        this.node = a
    }
    update() {}
}
class CS extends ai {
    constructor(a) {
        super(a),
        a.animationState || (a.animationState = bS(a))
    }
    updateAnimationControlsSubscription() {
        const {animate: a} = this.node.getProps();
        cr(a) && (this.unmountControls = a.subscribe(this.node))
    }
    mount() {
        this.updateAnimationControlsSubscription()
    }
    update() {
        const {animate: a} = this.node.getProps()
          , {animate: s} = this.node.prevProps || {};
        a !== s && this.updateAnimationControlsSubscription()
    }
    unmount() {
        this.node.animationState.reset(),
        this.unmountControls?.()
    }
}
let xS = 0;
class RS extends ai {
    constructor() {
        super(...arguments),
        this.id = xS++
    }
    update() {
        if (!this.node.presenceContext)
            return;
        const {isPresent: a, onExitComplete: s} = this.node.presenceContext
          , {isPresent: o} = this.node.prevPresenceContext || {};
        if (!this.node.animationState || a === o)
            return;
        const u = this.node.animationState.setActive("exit", !a);
        s && !a && u.then( () => {
            s(this.id)
        }
        )
    }
    mount() {
        const {register: a, onExitComplete: s} = this.node.presenceContext || {};
        s && s(this.id),
        a && (this.unmount = a(this.id))
    }
    unmount() {}
}
const MS = {
    animation: {
        Feature: CS
    },
    exit: {
        Feature: RS
    }
};
function ol(n, a, s, o={
    passive: !0
}) {
    return n.addEventListener(a, s, o),
    () => n.removeEventListener(a, s)
}
function hl(n) {
    return {
        point: {
            x: n.pageX,
            y: n.pageY
        }
    }
}
const ES = n => a => uh(a) && n(a, hl(a));
function Js(n, a, s, o) {
    return ol(n, a, ES(s), o)
}
const Nv = 1e-4
  , _S = 1 - Nv
  , AS = 1 + Nv
  , jv = .01
  , DS = 0 - jv
  , LS = 0 + jv;
function he(n) {
    return n.max - n.min
}
function OS(n, a, s) {
    return Math.abs(n - a) <= s
}
function g1(n, a, s, o=.5) {
    n.origin = o,
    n.originPoint = Bt(a.min, a.max, n.origin),
    n.scale = he(s) / he(a),
    n.translate = Bt(s.min, s.max, n.origin) - n.originPoint,
    (n.scale >= _S && n.scale <= AS || isNaN(n.scale)) && (n.scale = 1),
    (n.translate >= DS && n.translate <= LS || isNaN(n.translate)) && (n.translate = 0)
}
function Ws(n, a, s, o) {
    g1(n.x, a.x, s.x, o ? o.originX : void 0),
    g1(n.y, a.y, s.y, o ? o.originY : void 0)
}
function S1(n, a, s) {
    n.min = s.min + a.min,
    n.max = n.min + he(a)
}
function VS(n, a, s) {
    S1(n.x, a.x, s.x),
    S1(n.y, a.y, s.y)
}
function b1(n, a, s) {
    n.min = a.min - s.min,
    n.max = n.min + he(a)
}
function Is(n, a, s) {
    b1(n.x, a.x, s.x),
    b1(n.y, a.y, s.y)
}
function He(n) {
    return [n("x"), n("y")]
}
const Pv = ({current: n}) => n ? n.ownerDocument.defaultView : null
  , T1 = (n, a) => Math.abs(n - a);
function wS(n, a) {
    const s = T1(n.x, a.x)
      , o = T1(n.y, a.y);
    return Math.sqrt(s ** 2 + o ** 2)
}
class Hv {
    constructor(a, s, {transformPagePoint: o, contextWindow: u=window, dragSnapToOrigin: f=!1, distanceThreshold: h=3}={}) {
        if (this.startEvent = null,
        this.lastMoveEvent = null,
        this.lastMoveEventInfo = null,
        this.handlers = {},
        this.contextWindow = window,
        this.updatePoint = () => {
            if (!(this.lastMoveEvent && this.lastMoveEventInfo))
                return;
            const S = Wc(this.lastMoveEventInfo, this.history)
              , T = this.startEvent !== null
              , C = wS(S.offset, {
                x: 0,
                y: 0
            }) >= this.distanceThreshold;
            if (!T && !C)
                return;
            const {point: E} = S
              , {timestamp: A} = ie;
            this.history.push({
                ...E,
                timestamp: A
            });
            const {onStart: V, onMove: q} = this.handlers;
            T || (V && V(this.lastMoveEvent, S),
            this.startEvent = this.lastMoveEvent),
            q && q(this.lastMoveEvent, S)
        }
        ,
        this.handlePointerMove = (S, T) => {
            this.lastMoveEvent = S,
            this.lastMoveEventInfo = Jc(T, this.transformPagePoint),
            Vt.update(this.updatePoint, !0)
        }
        ,
        this.handlePointerUp = (S, T) => {
            this.end();
            const {onEnd: C, onSessionEnd: E, resumeAnimation: A} = this.handlers;
            if (this.dragSnapToOrigin && A && A(),
            !(this.lastMoveEvent && this.lastMoveEventInfo))
                return;
            const V = Wc(S.type === "pointercancel" ? this.lastMoveEventInfo : Jc(T, this.transformPagePoint), this.history);
            this.startEvent && C && C(S, V),
            E && E(S, V)
        }
        ,
        !uh(a))
            return;
        this.dragSnapToOrigin = f,
        this.handlers = s,
        this.transformPagePoint = o,
        this.distanceThreshold = h,
        this.contextWindow = u || window;
        const p = hl(a)
          , d = Jc(p, this.transformPagePoint)
          , {point: m} = d
          , {timestamp: y} = ie;
        this.history = [{
            ...m,
            timestamp: y
        }];
        const {onSessionStart: g} = s;
        g && g(a, Wc(d, this.history)),
        this.removeListeners = ul(Js(this.contextWindow, "pointermove", this.handlePointerMove), Js(this.contextWindow, "pointerup", this.handlePointerUp), Js(this.contextWindow, "pointercancel", this.handlePointerUp))
    }
    updateHandlers(a) {
        this.handlers = a
    }
    end() {
        this.removeListeners && this.removeListeners(),
        ni(this.updatePoint)
    }
}
function Jc(n, a) {
    return a ? {
        point: a(n.point)
    } : n
}
function C1(n, a) {
    return {
        x: n.x - a.x,
        y: n.y - a.y
    }
}
function Wc({point: n}, a) {
    return {
        point: n,
        delta: C1(n, qv(a)),
        offset: C1(n, zS(a)),
        velocity: BS(a, .1)
    }
}
function zS(n) {
    return n[0]
}
function qv(n) {
    return n[n.length - 1]
}
function BS(n, a) {
    if (n.length < 2)
        return {
            x: 0,
            y: 0
        };
    let s = n.length - 1
      , o = null;
    const u = qv(n);
    for (; s >= 0 && (o = n[s],
    !(u.timestamp - o.timestamp > an(a))); )
        s--;
    if (!o)
        return {
            x: 0,
            y: 0
        };
    const f = Ye(u.timestamp - o.timestamp);
    if (f === 0)
        return {
            x: 0,
            y: 0
        };
    const h = {
        x: (u.x - o.x) / f,
        y: (u.y - o.y) / f
    };
    return h.x === 1 / 0 && (h.x = 0),
    h.y === 1 / 0 && (h.y = 0),
    h
}
function US(n, {min: a, max: s}, o) {
    return a !== void 0 && n < a ? n = o ? Bt(a, n, o.min) : Math.max(n, a) : s !== void 0 && n > s && (n = o ? Bt(s, n, o.max) : Math.min(n, s)),
    n
}
function x1(n, a, s) {
    return {
        min: a !== void 0 ? n.min + a : void 0,
        max: s !== void 0 ? n.max + s - (n.max - n.min) : void 0
    }
}
function NS(n, {top: a, left: s, bottom: o, right: u}) {
    return {
        x: x1(n.x, s, u),
        y: x1(n.y, a, o)
    }
}
function R1(n, a) {
    let s = a.min - n.min
      , o = a.max - n.max;
    return a.max - a.min < n.max - n.min && ([s,o] = [o, s]),
    {
        min: s,
        max: o
    }
}
function jS(n, a) {
    return {
        x: R1(n.x, a.x),
        y: R1(n.y, a.y)
    }
}
function PS(n, a) {
    let s = .5;
    const o = he(n)
      , u = he(a);
    return u > o ? s = nl(a.min, a.max - o, n.min) : o > u && (s = nl(n.min, n.max - u, a.min)),
    _n(0, 1, s)
}
function HS(n, a) {
    const s = {};
    return a.min !== void 0 && (s.min = a.min - n.min),
    a.max !== void 0 && (s.max = a.max - n.min),
    s
}
const Df = .35;
function qS(n=Df) {
    return n === !1 ? n = 0 : n === !0 && (n = Df),
    {
        x: M1(n, "left", "right"),
        y: M1(n, "top", "bottom")
    }
}
function M1(n, a, s) {
    return {
        min: E1(n, a),
        max: E1(n, s)
    }
}
function E1(n, a) {
    return typeof n == "number" ? n : n[a] || 0
}
const YS = new WeakMap;
class GS {
    constructor(a) {
        this.openDragLock = null,
        this.isDragging = !1,
        this.currentDirection = null,
        this.originPoint = {
            x: 0,
            y: 0
        },
        this.constraints = !1,
        this.hasMutatedConstraints = !1,
        this.elastic = Yt(),
        this.latestPointerEvent = null,
        this.latestPanInfo = null,
        this.visualElement = a
    }
    start(a, {snapToCursor: s=!1, distanceThreshold: o}={}) {
        const {presenceContext: u} = this.visualElement;
        if (u && u.isPresent === !1)
            return;
        const f = g => {
            const {dragSnapToOrigin: S} = this.getProps();
            S ? this.pauseAnimation() : this.stopAnimation(),
            s && this.snapToCursor(hl(g).point)
        }
          , h = (g, S) => {
            const {drag: T, dragPropagation: C, onDragStart: E} = this.getProps();
            if (T && !C && (this.openDragLock && this.openDragLock(),
            this.openDragLock = Q6(T),
            !this.openDragLock))
                return;
            this.latestPointerEvent = g,
            this.latestPanInfo = S,
            this.isDragging = !0,
            this.currentDirection = null,
            this.resolveConstraints(),
            this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0,
            this.visualElement.projection.target = void 0),
            He(V => {
                let q = this.getAxisMotionValue(V).get() || 0;
                if (sn.test(q)) {
                    const {projection: B} = this.visualElement;
                    if (B && B.layout) {
                        const G = B.layout.layoutBox[V];
                        G && (q = he(G) * (parseFloat(q) / 100))
                    }
                }
                this.originPoint[V] = q
            }
            ),
            E && Vt.postRender( () => E(g, S)),
            _f(this.visualElement, "transform");
            const {animationState: A} = this.visualElement;
            A && A.setActive("whileDrag", !0)
        }
          , p = (g, S) => {
            this.latestPointerEvent = g,
            this.latestPanInfo = S;
            const {dragPropagation: T, dragDirectionLock: C, onDirectionLock: E, onDrag: A} = this.getProps();
            if (!T && !this.openDragLock)
                return;
            const {offset: V} = S;
            if (C && this.currentDirection === null) {
                this.currentDirection = kS(V),
                this.currentDirection !== null && E && E(this.currentDirection);
                return
            }
            this.updateAxis("x", S.point, V),
            this.updateAxis("y", S.point, V),
            this.visualElement.render(),
            A && A(g, S)
        }
          , d = (g, S) => {
            this.latestPointerEvent = g,
            this.latestPanInfo = S,
            this.stop(g, S),
            this.latestPointerEvent = null,
            this.latestPanInfo = null
        }
          , m = () => He(g => this.getAnimationState(g) === "paused" && this.getAxisMotionValue(g).animation?.play())
          , {dragSnapToOrigin: y} = this.getProps();
        this.panSession = new Hv(a,{
            onSessionStart: f,
            onStart: h,
            onMove: p,
            onSessionEnd: d,
            resumeAnimation: m
        },{
            transformPagePoint: this.visualElement.getTransformPagePoint(),
            dragSnapToOrigin: y,
            distanceThreshold: o,
            contextWindow: Pv(this.visualElement)
        })
    }
    stop(a, s) {
        const o = a || this.latestPointerEvent
          , u = s || this.latestPanInfo
          , f = this.isDragging;
        if (this.cancel(),
        !f || !u || !o)
            return;
        const {velocity: h} = u;
        this.startAnimation(h);
        const {onDragEnd: p} = this.getProps();
        p && Vt.postRender( () => p(o, u))
    }
    cancel() {
        this.isDragging = !1;
        const {projection: a, animationState: s} = this.visualElement;
        a && (a.isAnimationBlocked = !1),
        this.panSession && this.panSession.end(),
        this.panSession = void 0;
        const {dragPropagation: o} = this.getProps();
        !o && this.openDragLock && (this.openDragLock(),
        this.openDragLock = null),
        s && s.setActive("whileDrag", !1)
    }
    updateAxis(a, s, o) {
        const {drag: u} = this.getProps();
        if (!o || !No(a, u, this.currentDirection))
            return;
        const f = this.getAxisMotionValue(a);
        let h = this.originPoint[a] + o[a];
        this.constraints && this.constraints[a] && (h = US(h, this.constraints[a], this.elastic[a])),
        f.set(h)
    }
    resolveConstraints() {
        const {dragConstraints: a, dragElastic: s} = this.getProps()
          , o = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout
          , u = this.constraints;
        a && Ma(a) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : a && o ? this.constraints = NS(o.layoutBox, a) : this.constraints = !1,
        this.elastic = qS(s),
        u !== this.constraints && o && this.constraints && !this.hasMutatedConstraints && He(f => {
            this.constraints !== !1 && this.getAxisMotionValue(f) && (this.constraints[f] = HS(o.layoutBox[f], this.constraints[f]))
        }
        )
    }
    resolveRefConstraints() {
        const {dragConstraints: a, onMeasureDragConstraints: s} = this.getProps();
        if (!a || !Ma(a))
            return !1;
        const o = a.current
          , {projection: u} = this.visualElement;
        if (!u || !u.layout)
            return !1;
        const f = X7(o, u.root, this.visualElement.getTransformPagePoint());
        let h = jS(u.layout.layoutBox, f);
        if (s) {
            const p = s(Y7(h));
            this.hasMutatedConstraints = !!p,
            p && (h = Rv(p))
        }
        return h
    }
    startAnimation(a) {
        const {drag: s, dragMomentum: o, dragElastic: u, dragTransition: f, dragSnapToOrigin: h, onDragTransitionEnd: p} = this.getProps()
          , d = this.constraints || {}
          , m = He(y => {
            if (!No(y, s, this.currentDirection))
                return;
            let g = d && d[y] || {};
            h && (g = {
                min: 0,
                max: 0
            });
            const S = u ? 200 : 1e6
              , T = u ? 40 : 1e7
              , C = {
                type: "inertia",
                velocity: o ? a[y] : 0,
                bounceStiffness: S,
                bounceDamping: T,
                timeConstant: 750,
                restDelta: 1,
                restSpeed: 10,
                ...f,
                ...g
            };
            return this.startAxisValueAnimation(y, C)
        }
        );
        return Promise.all(m).then(p)
    }
    startAxisValueAnimation(a, s) {
        const o = this.getAxisMotionValue(a);
        return _f(this.visualElement, a),
        o.start(Sh(a, o, 0, s, this.visualElement, !1))
    }
    stopAnimation() {
        He(a => this.getAxisMotionValue(a).stop())
    }
    pauseAnimation() {
        He(a => this.getAxisMotionValue(a).animation?.pause())
    }
    getAnimationState(a) {
        return this.getAxisMotionValue(a).animation?.state
    }
    getAxisMotionValue(a) {
        const s = `_drag${a.toUpperCase()}`
          , o = this.visualElement.getProps()
          , u = o[s];
        return u || this.visualElement.getValue(a, (o.initial ? o.initial[a] : void 0) || 0)
    }
    snapToCursor(a) {
        He(s => {
            const {drag: o} = this.getProps();
            if (!No(s, o, this.currentDirection))
                return;
            const {projection: u} = this.visualElement
              , f = this.getAxisMotionValue(s);
            if (u && u.layout) {
                const {min: h, max: p} = u.layout.layoutBox[s];
                f.set(a[s] - Bt(h, p, .5))
            }
        }
        )
    }
    scalePositionWithinConstraints() {
        if (!this.visualElement.current)
            return;
        const {drag: a, dragConstraints: s} = this.getProps()
          , {projection: o} = this.visualElement;
        if (!Ma(s) || !o || !this.constraints)
            return;
        this.stopAnimation();
        const u = {
            x: 0,
            y: 0
        };
        He(h => {
            const p = this.getAxisMotionValue(h);
            if (p && this.constraints !== !1) {
                const d = p.get();
                u[h] = PS({
                    min: d,
                    max: d
                }, this.constraints[h])
            }
        }
        );
        const {transformTemplate: f} = this.visualElement.getProps();
        this.visualElement.current.style.transform = f ? f({}, "") : "none",
        o.root && o.root.updateScroll(),
        o.updateLayout(),
        this.resolveConstraints(),
        He(h => {
            if (!No(h, a, null))
                return;
            const p = this.getAxisMotionValue(h)
              , {min: d, max: m} = this.constraints[h];
            p.set(Bt(d, m, u[h]))
        }
        )
    }
    addListeners() {
        if (!this.visualElement.current)
            return;
        YS.set(this.visualElement, this);
        const a = this.visualElement.current
          , s = Js(a, "pointerdown", d => {
            const {drag: m, dragListener: y=!0} = this.getProps();
            m && y && this.start(d)
        }
        )
          , o = () => {
            const {dragConstraints: d} = this.getProps();
            Ma(d) && d.current && (this.constraints = this.resolveRefConstraints())
        }
          , {projection: u} = this.visualElement
          , f = u.addEventListener("measure", o);
        u && !u.layout && (u.root && u.root.updateScroll(),
        u.updateLayout()),
        Vt.read(o);
        const h = ol(window, "resize", () => this.scalePositionWithinConstraints())
          , p = u.addEventListener("didUpdate", ( ({delta: d, hasLayoutChanged: m}) => {
            this.isDragging && m && (He(y => {
                const g = this.getAxisMotionValue(y);
                g && (this.originPoint[y] += d[y].translate,
                g.set(g.get() + d[y].translate))
            }
            ),
            this.visualElement.render())
        }
        ));
        return () => {
            h(),
            s(),
            f(),
            p && p()
        }
    }
    getProps() {
        const a = this.visualElement.getProps()
          , {drag: s=!1, dragDirectionLock: o=!1, dragPropagation: u=!1, dragConstraints: f=!1, dragElastic: h=Df, dragMomentum: p=!0} = a;
        return {
            ...a,
            drag: s,
            dragDirectionLock: o,
            dragPropagation: u,
            dragConstraints: f,
            dragElastic: h,
            dragMomentum: p
        }
    }
}
function No(n, a, s) {
    return (a === !0 || a === n) && (s === null || s === n)
}
function kS(n, a=10) {
    let s = null;
    return Math.abs(n.y) > a ? s = "y" : Math.abs(n.x) > a && (s = "x"),
    s
}
class XS extends ai {
    constructor(a) {
        super(a),
        this.removeGroupControls = Ge,
        this.removeListeners = Ge,
        this.controls = new GS(a)
    }
    mount() {
        const {dragControls: a} = this.node.getProps();
        a && (this.removeGroupControls = a.subscribe(this.controls)),
        this.removeListeners = this.controls.addListeners() || Ge
    }
    unmount() {
        this.removeGroupControls(),
        this.removeListeners()
    }
}
const _1 = n => (a, s) => {
    n && Vt.postRender( () => n(a, s))
}
;
class KS extends ai {
    constructor() {
        super(...arguments),
        this.removePointerDownListener = Ge
    }
    onPointerDown(a) {
        this.session = new Hv(a,this.createPanHandlers(),{
            transformPagePoint: this.node.getTransformPagePoint(),
            contextWindow: Pv(this.node)
        })
    }
    createPanHandlers() {
        const {onPanSessionStart: a, onPanStart: s, onPan: o, onPanEnd: u} = this.node.getProps();
        return {
            onSessionStart: _1(a),
            onStart: _1(s),
            onMove: o,
            onEnd: (f, h) => {
                delete this.session,
                u && Vt.postRender( () => u(f, h))
            }
        }
    }
    mount() {
        this.removePointerDownListener = Js(this.node.current, "pointerdown", a => this.onPointerDown(a))
    }
    update() {
        this.session && this.session.updateHandlers(this.createPanHandlers())
    }
    unmount() {
        this.removePointerDownListener(),
        this.session && this.session.end()
    }
}
const Go = {
    hasAnimatedSinceResize: !0,
    hasEverUpdated: !1
};
function A1(n, a) {
    return a.max === a.min ? 0 : n / (a.max - a.min) * 100
}
const Gs = {
    correct: (n, a) => {
        if (!a.target)
            return n;
        if (typeof n == "string")
            if (lt.test(n))
                n = parseFloat(n);
            else
                return n;
        const s = A1(n, a.target.x)
          , o = A1(n, a.target.y);
        return `${s}% ${o}%`
    }
}
  , ZS = {
    correct: (n, {treeScale: a, projectionDelta: s}) => {
        const o = n
          , u = ii.parse(n);
        if (u.length > 5)
            return o;
        const f = ii.createTransformer(n)
          , h = typeof u[0] != "number" ? 1 : 0
          , p = s.x.scale * a.x
          , d = s.y.scale * a.y;
        u[0 + h] /= p,
        u[1 + h] /= d;
        const m = Bt(p, d, .5);
        return typeof u[2 + h] == "number" && (u[2 + h] /= m),
        typeof u[3 + h] == "number" && (u[3 + h] /= m),
        f(u)
    }
};
let Ic = !1;
class QS extends H.Component {
    componentDidMount() {
        const {visualElement: a, layoutGroup: s, switchLayoutGroup: o, layoutId: u} = this.props
          , {projection: f} = a;
        y7(FS),
        f && (s.group && s.group.add(f),
        o && o.register && u && o.register(f),
        Ic && f.root.didUpdate(),
        f.addEventListener("animationComplete", () => {
            this.safeToRemove()
        }
        ),
        f.setOptions({
            ...f.options,
            onExitComplete: () => this.safeToRemove()
        })),
        Go.hasEverUpdated = !0
    }
    getSnapshotBeforeUpdate(a) {
        const {layoutDependency: s, visualElement: o, drag: u, isPresent: f} = this.props
          , {projection: h} = o;
        return h && (h.isPresent = f,
        Ic = !0,
        u || a.layoutDependency !== s || s === void 0 || a.isPresent !== f ? h.willUpdate() : this.safeToRemove(),
        a.isPresent !== f && (f ? h.promote() : h.relegate() || Vt.postRender( () => {
            const p = h.getStack();
            (!p || !p.members.length) && this.safeToRemove()
        }
        ))),
        null
    }
    componentDidUpdate() {
        const {projection: a} = this.props.visualElement;
        a && (a.root.didUpdate(),
        rh.postRender( () => {
            !a.currentAnimation && a.isLead() && this.safeToRemove()
        }
        ))
    }
    componentWillUnmount() {
        const {visualElement: a, layoutGroup: s, switchLayoutGroup: o} = this.props
          , {projection: u} = a;
        Ic = !0,
        u && (u.scheduleCheckAfterUnmount(),
        s && s.group && s.group.remove(u),
        o && o.deregister && o.deregister(u))
    }
    safeToRemove() {
        const {safeToRemove: a} = this.props;
        a && a()
    }
    render() {
        return null
    }
}
function Yv(n) {
    const [a,s] = cv()
      , o = H.useContext(Hf);
    return X.jsx(QS, {
        ...n,
        layoutGroup: o,
        switchLayoutGroup: H.useContext(Cv),
        isPresent: a,
        safeToRemove: s
    })
}
const FS = {
    borderRadius: {
        ...Gs,
        applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]
    },
    borderTopLeftRadius: Gs,
    borderTopRightRadius: Gs,
    borderBottomLeftRadius: Gs,
    borderBottomRightRadius: Gs,
    boxShadow: ZS
};
function $S(n, a, s) {
    const o = ue(n) ? n : Ua(n);
    return o.start(Sh("", o, a, s)),
    o.animation
}
const JS = (n, a) => n.depth - a.depth;
class WS {
    constructor() {
        this.children = [],
        this.isDirty = !1
    }
    add(a) {
        Gf(this.children, a),
        this.isDirty = !0
    }
    remove(a) {
        kf(this.children, a),
        this.isDirty = !0
    }
    forEach(a) {
        this.isDirty && this.children.sort(JS),
        this.isDirty = !1,
        this.children.forEach(a)
    }
}
function IS(n, a) {
    const s = ge.now()
      , o = ({timestamp: u}) => {
        const f = u - s;
        f >= a && (ni(o),
        n(f - a))
    }
    ;
    return Vt.setup(o, !0),
    () => ni(o)
}
const Gv = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"]
  , t9 = Gv.length
  , D1 = n => typeof n == "string" ? parseFloat(n) : n
  , L1 = n => typeof n == "number" || lt.test(n);
function e9(n, a, s, o, u, f) {
    u ? (n.opacity = Bt(0, s.opacity ?? 1, n9(o)),
    n.opacityExit = Bt(a.opacity ?? 1, 0, i9(o))) : f && (n.opacity = Bt(a.opacity ?? 1, s.opacity ?? 1, o));
    for (let h = 0; h < t9; h++) {
        const p = `border${Gv[h]}Radius`;
        let d = O1(a, p)
          , m = O1(s, p);
        if (d === void 0 && m === void 0)
            continue;
        d || (d = 0),
        m || (m = 0),
        d === 0 || m === 0 || L1(d) === L1(m) ? (n[p] = Math.max(Bt(D1(d), D1(m), o), 0),
        (sn.test(m) || sn.test(d)) && (n[p] += "%")) : n[p] = m
    }
    (a.rotate || s.rotate) && (n.rotate = Bt(a.rotate || 0, s.rotate || 0, o))
}
function O1(n, a) {
    return n[a] !== void 0 ? n[a] : n.borderRadius
}
const n9 = kv(0, .5, Oy)
  , i9 = kv(.5, .95, Ge);
function kv(n, a, s) {
    return o => o < n ? 0 : o > a ? 1 : s(nl(n, a, o))
}
function V1(n, a) {
    n.min = a.min,
    n.max = a.max
}
function je(n, a) {
    V1(n.x, a.x),
    V1(n.y, a.y)
}
function w1(n, a) {
    n.translate = a.translate,
    n.scale = a.scale,
    n.originPoint = a.originPoint,
    n.origin = a.origin
}
function z1(n, a, s, o, u) {
    return n -= a,
    n = ar(n, 1 / s, o),
    u !== void 0 && (n = ar(n, 1 / u, o)),
    n
}
function a9(n, a=0, s=1, o=.5, u, f=n, h=n) {
    if (sn.test(a) && (a = parseFloat(a),
    a = Bt(h.min, h.max, a / 100) - h.min),
    typeof a != "number")
        return;
    let p = Bt(f.min, f.max, o);
    n === f && (p -= a),
    n.min = z1(n.min, a, s, p, u),
    n.max = z1(n.max, a, s, p, u)
}
function B1(n, a, [s,o,u], f, h) {
    a9(n, a[s], a[o], a[u], a.scale, f, h)
}
const s9 = ["x", "scaleX", "originX"]
  , l9 = ["y", "scaleY", "originY"];
function U1(n, a, s, o) {
    B1(n.x, a, s9, s ? s.x : void 0, o ? o.x : void 0),
    B1(n.y, a, l9, s ? s.y : void 0, o ? o.y : void 0)
}
function N1(n) {
    return n.translate === 0 && n.scale === 1
}
function Xv(n) {
    return N1(n.x) && N1(n.y)
}
function j1(n, a) {
    return n.min === a.min && n.max === a.max
}
function o9(n, a) {
    return j1(n.x, a.x) && j1(n.y, a.y)
}
function P1(n, a) {
    return Math.round(n.min) === Math.round(a.min) && Math.round(n.max) === Math.round(a.max)
}
function Kv(n, a) {
    return P1(n.x, a.x) && P1(n.y, a.y)
}
function H1(n) {
    return he(n.x) / he(n.y)
}
function q1(n, a) {
    return n.translate === a.translate && n.scale === a.scale && n.originPoint === a.originPoint
}
class r9 {
    constructor() {
        this.members = []
    }
    add(a) {
        Gf(this.members, a),
        a.scheduleRender()
    }
    remove(a) {
        if (kf(this.members, a),
        a === this.prevLead && (this.prevLead = void 0),
        a === this.lead) {
            const s = this.members[this.members.length - 1];
            s && this.promote(s)
        }
    }
    relegate(a) {
        const s = this.members.findIndex(u => a === u);
        if (s === 0)
            return !1;
        let o;
        for (let u = s; u >= 0; u--) {
            const f = this.members[u];
            if (f.isPresent !== !1) {
                o = f;
                break
            }
        }
        return o ? (this.promote(o),
        !0) : !1
    }
    promote(a, s) {
        const o = this.lead;
        if (a !== o && (this.prevLead = o,
        this.lead = a,
        a.show(),
        o)) {
            o.instance && o.scheduleRender(),
            a.scheduleRender(),
            a.resumeFrom = o,
            s && (a.resumeFrom.preserveOpacity = !0),
            o.snapshot && (a.snapshot = o.snapshot,
            a.snapshot.latestValues = o.animationValues || o.latestValues),
            a.root && a.root.isUpdating && (a.isLayoutDirty = !0);
            const {crossfade: u} = a.options;
            u === !1 && o.hide()
        }
    }
    exitAnimationComplete() {
        this.members.forEach(a => {
            const {options: s, resumingFrom: o} = a;
            s.onExitComplete && s.onExitComplete(),
            o && o.options.onExitComplete && o.options.onExitComplete()
        }
        )
    }
    scheduleRender() {
        this.members.forEach(a => {
            a.instance && a.scheduleRender(!1)
        }
        )
    }
    removeLeadSnapshot() {
        this.lead && this.lead.snapshot && (this.lead.snapshot = void 0)
    }
}
function u9(n, a, s) {
    let o = "";
    const u = n.x.translate / a.x
      , f = n.y.translate / a.y
      , h = s?.z || 0;
    if ((u || f || h) && (o = `translate3d(${u}px, ${f}px, ${h}px) `),
    (a.x !== 1 || a.y !== 1) && (o += `scale(${1 / a.x}, ${1 / a.y}) `),
    s) {
        const {transformPerspective: m, rotate: y, rotateX: g, rotateY: S, skewX: T, skewY: C} = s;
        m && (o = `perspective(${m}px) ${o}`),
        y && (o += `rotate(${y}deg) `),
        g && (o += `rotateX(${g}deg) `),
        S && (o += `rotateY(${S}deg) `),
        T && (o += `skewX(${T}deg) `),
        C && (o += `skewY(${C}deg) `)
    }
    const p = n.x.scale * a.x
      , d = n.y.scale * a.y;
    return (p !== 1 || d !== 1) && (o += `scale(${p}, ${d})`),
    o || "none"
}
const tf = ["", "X", "Y", "Z"]
  , c9 = 1e3;
let f9 = 0;
function ef(n, a, s, o) {
    const {latestValues: u} = a;
    u[n] && (s[n] = u[n],
    a.setStaticValue(n, 0),
    o && (o[n] = 0))
}
function Zv(n) {
    if (n.hasCheckedOptimisedAppear = !0,
    n.root === n)
        return;
    const {visualElement: a} = n.options;
    if (!a)
        return;
    const s = Vv(a);
    if (window.MotionHasOptimisedAnimation(s, "transform")) {
        const {layout: u, layoutId: f} = n.options;
        window.MotionCancelOptimisedAnimation(s, "transform", Vt, !(u || f))
    }
    const {parent: o} = n;
    o && !o.hasCheckedOptimisedAppear && Zv(o)
}
function Qv({attachResizeListener: n, defaultParent: a, measureScroll: s, checkIsScrollRoot: o, resetTransform: u}) {
    return class {
        constructor(h={}, p=a?.()) {
            this.id = f9++,
            this.animationId = 0,
            this.animationCommitId = 0,
            this.children = new Set,
            this.options = {},
            this.isTreeAnimating = !1,
            this.isAnimationBlocked = !1,
            this.isLayoutDirty = !1,
            this.isProjectionDirty = !1,
            this.isSharedProjectionDirty = !1,
            this.isTransformDirty = !1,
            this.updateManuallyBlocked = !1,
            this.updateBlockedByResize = !1,
            this.isUpdating = !1,
            this.isSVG = !1,
            this.needsReset = !1,
            this.shouldResetTransform = !1,
            this.hasCheckedOptimisedAppear = !1,
            this.treeScale = {
                x: 1,
                y: 1
            },
            this.eventHandlers = new Map,
            this.hasTreeAnimated = !1,
            this.updateScheduled = !1,
            this.scheduleUpdate = () => this.update(),
            this.projectionUpdateScheduled = !1,
            this.checkUpdateFailed = () => {
                this.isUpdating && (this.isUpdating = !1,
                this.clearAllSnapshots())
            }
            ,
            this.updateProjection = () => {
                this.projectionUpdateScheduled = !1,
                this.nodes.forEach(m9),
                this.nodes.forEach(g9),
                this.nodes.forEach(S9),
                this.nodes.forEach(p9)
            }
            ,
            this.resolvedRelativeTargetAt = 0,
            this.hasProjected = !1,
            this.isVisible = !0,
            this.animationProgress = 0,
            this.sharedNodes = new Map,
            this.latestValues = h,
            this.root = p ? p.root || p : this,
            this.path = p ? [...p.path, p] : [],
            this.parent = p,
            this.depth = p ? p.depth + 1 : 0;
            for (let d = 0; d < this.path.length; d++)
                this.path[d].shouldResetTransform = !0;
            this.root === this && (this.nodes = new WS)
        }
        addEventListener(h, p) {
            return this.eventHandlers.has(h) || this.eventHandlers.set(h, new Zf),
            this.eventHandlers.get(h).add(p)
        }
        notifyListeners(h, ...p) {
            const d = this.eventHandlers.get(h);
            d && d.notify(...p)
        }
        hasListeners(h) {
            return this.eventHandlers.has(h)
        }
        mount(h) {
            if (this.instance)
                return;
            this.isSVG = uv(h) && !t7(h),
            this.instance = h;
            const {layoutId: p, layout: d, visualElement: m} = this.options;
            if (m && !m.current && m.mount(h),
            this.root.nodes.add(this),
            this.parent && this.parent.children.add(this),
            this.root.hasTreeAnimated && (d || p) && (this.isLayoutDirty = !0),
            n) {
                let y, g = 0;
                const S = () => this.root.updateBlockedByResize = !1;
                Vt.read( () => {
                    g = window.innerWidth
                }
                ),
                n(h, () => {
                    const T = window.innerWidth;
                    T !== g && (g = T,
                    this.root.updateBlockedByResize = !0,
                    y && y(),
                    y = IS(S, 250),
                    Go.hasAnimatedSinceResize && (Go.hasAnimatedSinceResize = !1,
                    this.nodes.forEach(k1)))
                }
                )
            }
            p && this.root.registerSharedNode(p, this),
            this.options.animate !== !1 && m && (p || d) && this.addEventListener("didUpdate", ({delta: y, hasLayoutChanged: g, hasRelativeLayoutChanged: S, layout: T}) => {
                if (this.isTreeAnimationBlocked()) {
                    this.target = void 0,
                    this.relativeTarget = void 0;
                    return
                }
                const C = this.options.transition || m.getDefaultTransition() || R9
                  , {onLayoutAnimationStart: E, onLayoutAnimationComplete: A} = m.getProps()
                  , V = !this.targetLayout || !Kv(this.targetLayout, T)
                  , q = !g && S;
                if (this.options.layoutRoot || this.resumeFrom || q || g && (V || !this.currentAnimation)) {
                    this.resumeFrom && (this.resumingFrom = this.resumeFrom,
                    this.resumingFrom.resumingFrom = void 0);
                    const B = {
                        ...lh(C, "layout"),
                        onPlay: E,
                        onComplete: A
                    };
                    (m.shouldReduceMotion || this.options.layoutRoot) && (B.delay = 0,
                    B.type = !1),
                    this.startAnimation(B),
                    this.setAnimationOrigin(y, q)
                } else
                    g || k1(this),
                    this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
                this.targetLayout = T
            }
            )
        }
        unmount() {
            this.options.layoutId && this.willUpdate(),
            this.root.nodes.remove(this);
            const h = this.getStack();
            h && h.remove(this),
            this.parent && this.parent.children.delete(this),
            this.instance = void 0,
            this.eventHandlers.clear(),
            ni(this.updateProjection)
        }
        blockUpdate() {
            this.updateManuallyBlocked = !0
        }
        unblockUpdate() {
            this.updateManuallyBlocked = !1
        }
        isUpdateBlocked() {
            return this.updateManuallyBlocked || this.updateBlockedByResize
        }
        isTreeAnimationBlocked() {
            return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1
        }
        startUpdate() {
            this.isUpdateBlocked() || (this.isUpdating = !0,
            this.nodes && this.nodes.forEach(b9),
            this.animationId++)
        }
        getTransformTemplate() {
            const {visualElement: h} = this.options;
            return h && h.getProps().transformTemplate
        }
        willUpdate(h=!0) {
            if (this.root.hasTreeAnimated = !0,
            this.root.isUpdateBlocked()) {
                this.options.onExitComplete && this.options.onExitComplete();
                return
            }
            if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Zv(this),
            !this.root.isUpdating && this.root.startUpdate(),
            this.isLayoutDirty)
                return;
            this.isLayoutDirty = !0;
            for (let y = 0; y < this.path.length; y++) {
                const g = this.path[y];
                g.shouldResetTransform = !0,
                g.updateScroll("snapshot"),
                g.options.layoutRoot && g.willUpdate(!1)
            }
            const {layoutId: p, layout: d} = this.options;
            if (p === void 0 && !d)
                return;
            const m = this.getTransformTemplate();
            this.prevTransformTemplateValue = m ? m(this.latestValues, "") : void 0,
            this.updateSnapshot(),
            h && this.notifyListeners("willUpdate")
        }
        update() {
            if (this.updateScheduled = !1,
            this.isUpdateBlocked()) {
                this.unblockUpdate(),
                this.clearAllSnapshots(),
                this.nodes.forEach(Y1);
                return
            }
            if (this.animationId <= this.animationCommitId) {
                this.nodes.forEach(G1);
                return
            }
            this.animationCommitId = this.animationId,
            this.isUpdating ? (this.isUpdating = !1,
            this.nodes.forEach(v9),
            this.nodes.forEach(h9),
            this.nodes.forEach(d9)) : this.nodes.forEach(G1),
            this.clearAllSnapshots();
            const p = ge.now();
            ie.delta = _n(0, 1e3 / 60, p - ie.timestamp),
            ie.timestamp = p,
            ie.isProcessing = !0,
            Gc.update.process(ie),
            Gc.preRender.process(ie),
            Gc.render.process(ie),
            ie.isProcessing = !1
        }
        didUpdate() {
            this.updateScheduled || (this.updateScheduled = !0,
            rh.read(this.scheduleUpdate))
        }
        clearAllSnapshots() {
            this.nodes.forEach(y9),
            this.sharedNodes.forEach(T9)
        }
        scheduleUpdateProjection() {
            this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0,
            Vt.preRender(this.updateProjection, !1, !0))
        }
        scheduleCheckAfterUnmount() {
            Vt.postRender( () => {
                this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed()
            }
            )
        }
        updateSnapshot() {
            this.snapshot || !this.instance || (this.snapshot = this.measure(),
            this.snapshot && !he(this.snapshot.measuredBox.x) && !he(this.snapshot.measuredBox.y) && (this.snapshot = void 0))
        }
        updateLayout() {
            if (!this.instance || (this.updateScroll(),
            !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
                return;
            if (this.resumeFrom && !this.resumeFrom.instance)
                for (let d = 0; d < this.path.length; d++)
                    this.path[d].updateScroll();
            const h = this.layout;
            this.layout = this.measure(!1),
            this.layoutCorrected = Yt(),
            this.isLayoutDirty = !1,
            this.projectionDelta = void 0,
            this.notifyListeners("measure", this.layout.layoutBox);
            const {visualElement: p} = this.options;
            p && p.notify("LayoutMeasure", this.layout.layoutBox, h ? h.layoutBox : void 0)
        }
        updateScroll(h="measure") {
            let p = !!(this.options.layoutScroll && this.instance);
            if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === h && (p = !1),
            p && this.instance) {
                const d = o(this.instance);
                this.scroll = {
                    animationId: this.root.animationId,
                    phase: h,
                    isRoot: d,
                    offset: s(this.instance),
                    wasRoot: this.scroll ? this.scroll.isRoot : d
                }
            }
        }
        resetTransform() {
            if (!u)
                return;
            const h = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout
              , p = this.projectionDelta && !Xv(this.projectionDelta)
              , d = this.getTransformTemplate()
              , m = d ? d(this.latestValues, "") : void 0
              , y = m !== this.prevTransformTemplateValue;
            h && this.instance && (p || _i(this.latestValues) || y) && (u(this.instance, m),
            this.shouldResetTransform = !1,
            this.scheduleRender())
        }
        measure(h=!0) {
            const p = this.measurePageBox();
            let d = this.removeElementScroll(p);
            return h && (d = this.removeTransform(d)),
            M9(d),
            {
                animationId: this.root.animationId,
                measuredBox: p,
                layoutBox: d,
                latestValues: {},
                source: this.id
            }
        }
        measurePageBox() {
            const {visualElement: h} = this.options;
            if (!h)
                return Yt();
            const p = h.measureViewportBox();
            if (!(this.scroll?.wasRoot || this.path.some(E9))) {
                const {scroll: m} = this.root;
                m && (Ea(p.x, m.offset.x),
                Ea(p.y, m.offset.y))
            }
            return p
        }
        removeElementScroll(h) {
            const p = Yt();
            if (je(p, h),
            this.scroll?.wasRoot)
                return p;
            for (let d = 0; d < this.path.length; d++) {
                const m = this.path[d]
                  , {scroll: y, options: g} = m;
                m !== this.root && y && g.layoutScroll && (y.wasRoot && je(p, h),
                Ea(p.x, y.offset.x),
                Ea(p.y, y.offset.y))
            }
            return p
        }
        applyTransform(h, p=!1) {
            const d = Yt();
            je(d, h);
            for (let m = 0; m < this.path.length; m++) {
                const y = this.path[m];
                !p && y.options.layoutScroll && y.scroll && y !== y.root && _a(d, {
                    x: -y.scroll.offset.x,
                    y: -y.scroll.offset.y
                }),
                _i(y.latestValues) && _a(d, y.latestValues)
            }
            return _i(this.latestValues) && _a(d, this.latestValues),
            d
        }
        removeTransform(h) {
            const p = Yt();
            je(p, h);
            for (let d = 0; d < this.path.length; d++) {
                const m = this.path[d];
                if (!m.instance || !_i(m.latestValues))
                    continue;
                xf(m.latestValues) && m.updateSnapshot();
                const y = Yt()
                  , g = m.measurePageBox();
                je(y, g),
                U1(p, m.latestValues, m.snapshot ? m.snapshot.layoutBox : void 0, y)
            }
            return _i(this.latestValues) && U1(p, this.latestValues),
            p
        }
        setTargetDelta(h) {
            this.targetDelta = h,
            this.root.scheduleUpdateProjection(),
            this.isProjectionDirty = !0
        }
        setOptions(h) {
            this.options = {
                ...this.options,
                ...h,
                crossfade: h.crossfade !== void 0 ? h.crossfade : !0
            }
        }
        clearMeasurements() {
            this.scroll = void 0,
            this.layout = void 0,
            this.snapshot = void 0,
            this.prevTransformTemplateValue = void 0,
            this.targetDelta = void 0,
            this.target = void 0,
            this.isLayoutDirty = !1
        }
        forceRelativeParentToResolveTarget() {
            this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ie.timestamp && this.relativeParent.resolveTargetDelta(!0)
        }
        resolveTargetDelta(h=!1) {
            const p = this.getLead();
            this.isProjectionDirty || (this.isProjectionDirty = p.isProjectionDirty),
            this.isTransformDirty || (this.isTransformDirty = p.isTransformDirty),
            this.isSharedProjectionDirty || (this.isSharedProjectionDirty = p.isSharedProjectionDirty);
            const d = !!this.resumingFrom || this !== p;
            if (!(h || d && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
                return;
            const {layout: y, layoutId: g} = this.options;
            if (!(!this.layout || !(y || g))) {
                if (this.resolvedRelativeTargetAt = ie.timestamp,
                !this.targetDelta && !this.relativeTarget) {
                    const S = this.getClosestProjectingParent();
                    S && S.layout && this.animationProgress !== 1 ? (this.relativeParent = S,
                    this.forceRelativeParentToResolveTarget(),
                    this.relativeTarget = Yt(),
                    this.relativeTargetOrigin = Yt(),
                    Is(this.relativeTargetOrigin, this.layout.layoutBox, S.layout.layoutBox),
                    je(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
                }
                if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Yt(),
                this.targetWithTransforms = Yt()),
                this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(),
                VS(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : je(this.target, this.layout.layoutBox),
                Ev(this.target, this.targetDelta)) : je(this.target, this.layout.layoutBox),
                this.attemptToResolveRelativeTarget)) {
                    this.attemptToResolveRelativeTarget = !1;
                    const S = this.getClosestProjectingParent();
                    S && !!S.resumingFrom == !!this.resumingFrom && !S.options.layoutScroll && S.target && this.animationProgress !== 1 ? (this.relativeParent = S,
                    this.forceRelativeParentToResolveTarget(),
                    this.relativeTarget = Yt(),
                    this.relativeTargetOrigin = Yt(),
                    Is(this.relativeTargetOrigin, this.target, S.target),
                    je(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
                }
            }
        }
        getClosestProjectingParent() {
            if (!(!this.parent || xf(this.parent.latestValues) || Mv(this.parent.latestValues)))
                return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent()
        }
        isProjecting() {
            return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout)
        }
        calcProjection() {
            const h = this.getLead()
              , p = !!this.resumingFrom || this !== h;
            let d = !0;
            if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (d = !1),
            p && (this.isSharedProjectionDirty || this.isTransformDirty) && (d = !1),
            this.resolvedRelativeTargetAt === ie.timestamp && (d = !1),
            d)
                return;
            const {layout: m, layoutId: y} = this.options;
            if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation),
            this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
            !this.layout || !(m || y))
                return;
            je(this.layoutCorrected, this.layout.layoutBox);
            const g = this.treeScale.x
              , S = this.treeScale.y;
            k7(this.layoutCorrected, this.treeScale, this.path, p),
            h.layout && !h.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (h.target = h.layout.layoutBox,
            h.targetWithTransforms = Yt());
            const {target: T} = h;
            if (!T) {
                this.prevProjectionDelta && (this.createProjectionDeltas(),
                this.scheduleRender());
                return
            }
            !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (w1(this.prevProjectionDelta.x, this.projectionDelta.x),
            w1(this.prevProjectionDelta.y, this.projectionDelta.y)),
            Ws(this.projectionDelta, this.layoutCorrected, T, this.latestValues),
            (this.treeScale.x !== g || this.treeScale.y !== S || !q1(this.projectionDelta.x, this.prevProjectionDelta.x) || !q1(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0,
            this.scheduleRender(),
            this.notifyListeners("projectionUpdate", T))
        }
        hide() {
            this.isVisible = !1
        }
        show() {
            this.isVisible = !0
        }
        scheduleRender(h=!0) {
            if (this.options.visualElement?.scheduleRender(),
            h) {
                const p = this.getStack();
                p && p.scheduleRender()
            }
            this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0)
        }
        createProjectionDeltas() {
            this.prevProjectionDelta = Aa(),
            this.projectionDelta = Aa(),
            this.projectionDeltaWithTransform = Aa()
        }
        setAnimationOrigin(h, p=!1) {
            const d = this.snapshot
              , m = d ? d.latestValues : {}
              , y = {
                ...this.latestValues
            }
              , g = Aa();
            (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0),
            this.attemptToResolveRelativeTarget = !p;
            const S = Yt()
              , T = d ? d.source : void 0
              , C = this.layout ? this.layout.source : void 0
              , E = T !== C
              , A = this.getStack()
              , V = !A || A.members.length <= 1
              , q = !!(E && !V && this.options.crossfade === !0 && !this.path.some(x9));
            this.animationProgress = 0;
            let B;
            this.mixTargetDelta = G => {
                const j = G / 1e3;
                X1(g.x, h.x, j),
                X1(g.y, h.y, j),
                this.setTargetDelta(g),
                this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Is(S, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
                C9(this.relativeTarget, this.relativeTargetOrigin, S, j),
                B && o9(this.relativeTarget, B) && (this.isProjectionDirty = !1),
                B || (B = Yt()),
                je(B, this.relativeTarget)),
                E && (this.animationValues = y,
                e9(y, m, this.latestValues, j, q, V)),
                this.root.scheduleUpdateProjection(),
                this.scheduleRender(),
                this.animationProgress = j
            }
            ,
            this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0)
        }
        startAnimation(h) {
            this.notifyListeners("animationStart"),
            this.currentAnimation?.stop(),
            this.resumingFrom?.currentAnimation?.stop(),
            this.pendingAnimation && (ni(this.pendingAnimation),
            this.pendingAnimation = void 0),
            this.pendingAnimation = Vt.update( () => {
                Go.hasAnimatedSinceResize = !0,
                this.motionValue || (this.motionValue = Ua(0)),
                this.currentAnimation = $S(this.motionValue, [0, 1e3], {
                    ...h,
                    velocity: 0,
                    isSync: !0,
                    onUpdate: p => {
                        this.mixTargetDelta(p),
                        h.onUpdate && h.onUpdate(p)
                    }
                    ,
                    onStop: () => {}
                    ,
                    onComplete: () => {
                        h.onComplete && h.onComplete(),
                        this.completeAnimation()
                    }
                }),
                this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
                this.pendingAnimation = void 0
            }
            )
        }
        completeAnimation() {
            this.resumingFrom && (this.resumingFrom.currentAnimation = void 0,
            this.resumingFrom.preserveOpacity = void 0);
            const h = this.getStack();
            h && h.exitAnimationComplete(),
            this.resumingFrom = this.currentAnimation = this.animationValues = void 0,
            this.notifyListeners("animationComplete")
        }
        finishAnimation() {
            this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(c9),
            this.currentAnimation.stop()),
            this.completeAnimation()
        }
        applyTransformsToTarget() {
            const h = this.getLead();
            let {targetWithTransforms: p, target: d, layout: m, latestValues: y} = h;
            if (!(!p || !d || !m)) {
                if (this !== h && this.layout && m && Fv(this.options.animationType, this.layout.layoutBox, m.layoutBox)) {
                    d = this.target || Yt();
                    const g = he(this.layout.layoutBox.x);
                    d.x.min = h.target.x.min,
                    d.x.max = d.x.min + g;
                    const S = he(this.layout.layoutBox.y);
                    d.y.min = h.target.y.min,
                    d.y.max = d.y.min + S
                }
                je(p, d),
                _a(p, y),
                Ws(this.projectionDeltaWithTransform, this.layoutCorrected, p, y)
            }
        }
        registerSharedNode(h, p) {
            this.sharedNodes.has(h) || this.sharedNodes.set(h, new r9),
            this.sharedNodes.get(h).add(p);
            const m = p.options.initialPromotionConfig;
            p.promote({
                transition: m ? m.transition : void 0,
                preserveFollowOpacity: m && m.shouldPreserveFollowOpacity ? m.shouldPreserveFollowOpacity(p) : void 0
            })
        }
        isLead() {
            const h = this.getStack();
            return h ? h.lead === this : !0
        }
        getLead() {
            const {layoutId: h} = this.options;
            return h ? this.getStack()?.lead || this : this
        }
        getPrevLead() {
            const {layoutId: h} = this.options;
            return h ? this.getStack()?.prevLead : void 0
        }
        getStack() {
            const {layoutId: h} = this.options;
            if (h)
                return this.root.sharedNodes.get(h)
        }
        promote({needsReset: h, transition: p, preserveFollowOpacity: d}={}) {
            const m = this.getStack();
            m && m.promote(this, d),
            h && (this.projectionDelta = void 0,
            this.needsReset = !0),
            p && this.setOptions({
                transition: p
            })
        }
        relegate() {
            const h = this.getStack();
            return h ? h.relegate(this) : !1
        }
        resetSkewAndRotation() {
            const {visualElement: h} = this.options;
            if (!h)
                return;
            let p = !1;
            const {latestValues: d} = h;
            if ((d.z || d.rotate || d.rotateX || d.rotateY || d.rotateZ || d.skewX || d.skewY) && (p = !0),
            !p)
                return;
            const m = {};
            d.z && ef("z", h, m, this.animationValues);
            for (let y = 0; y < tf.length; y++)
                ef(`rotate${tf[y]}`, h, m, this.animationValues),
                ef(`skew${tf[y]}`, h, m, this.animationValues);
            h.render();
            for (const y in m)
                h.setStaticValue(y, m[y]),
                this.animationValues && (this.animationValues[y] = m[y]);
            h.scheduleRender()
        }
        applyProjectionStyles(h, p) {
            if (!this.instance || this.isSVG)
                return;
            if (!this.isVisible) {
                h.visibility = "hidden";
                return
            }
            const d = this.getTransformTemplate();
            if (this.needsReset) {
                this.needsReset = !1,
                h.visibility = "",
                h.opacity = "",
                h.pointerEvents = Yo(p?.pointerEvents) || "",
                h.transform = d ? d(this.latestValues, "") : "none";
                return
            }
            const m = this.getLead();
            if (!this.projectionDelta || !this.layout || !m.target) {
                this.options.layoutId && (h.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1,
                h.pointerEvents = Yo(p?.pointerEvents) || ""),
                this.hasProjected && !_i(this.latestValues) && (h.transform = d ? d({}, "") : "none",
                this.hasProjected = !1);
                return
            }
            h.visibility = "";
            const y = m.animationValues || m.latestValues;
            this.applyTransformsToTarget();
            let g = u9(this.projectionDeltaWithTransform, this.treeScale, y);
            d && (g = d(y, g)),
            h.transform = g;
            const {x: S, y: T} = this.projectionDelta;
            h.transformOrigin = `${S.origin * 100}% ${T.origin * 100}% 0`,
            m.animationValues ? h.opacity = m === this ? y.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : y.opacityExit : h.opacity = m === this ? y.opacity !== void 0 ? y.opacity : "" : y.opacityExit !== void 0 ? y.opacityExit : 0;
            for (const C in ll) {
                if (y[C] === void 0)
                    continue;
                const {correct: E, applyTo: A, isCSSVariable: V} = ll[C]
                  , q = g === "none" ? y[C] : E(y[C], m);
                if (A) {
                    const B = A.length;
                    for (let G = 0; G < B; G++)
                        h[A[G]] = q
                } else
                    V ? this.options.visualElement.renderState.vars[C] = q : h[C] = q
            }
            this.options.layoutId && (h.pointerEvents = m === this ? Yo(p?.pointerEvents) || "" : "none")
        }
        clearSnapshot() {
            this.resumeFrom = this.snapshot = void 0
        }
        resetTree() {
            this.root.nodes.forEach(h => h.currentAnimation?.stop()),
            this.root.nodes.forEach(Y1),
            this.root.sharedNodes.clear()
        }
    }
}
function h9(n) {
    n.updateLayout()
}
function d9(n) {
    const a = n.resumeFrom?.snapshot || n.snapshot;
    if (n.isLead() && n.layout && a && n.hasListeners("didUpdate")) {
        const {layoutBox: s, measuredBox: o} = n.layout
          , {animationType: u} = n.options
          , f = a.source !== n.layout.source;
        u === "size" ? He(y => {
            const g = f ? a.measuredBox[y] : a.layoutBox[y]
              , S = he(g);
            g.min = s[y].min,
            g.max = g.min + S
        }
        ) : Fv(u, a.layoutBox, s) && He(y => {
            const g = f ? a.measuredBox[y] : a.layoutBox[y]
              , S = he(s[y]);
            g.max = g.min + S,
            n.relativeTarget && !n.currentAnimation && (n.isProjectionDirty = !0,
            n.relativeTarget[y].max = n.relativeTarget[y].min + S)
        }
        );
        const h = Aa();
        Ws(h, s, a.layoutBox);
        const p = Aa();
        f ? Ws(p, n.applyTransform(o, !0), a.measuredBox) : Ws(p, s, a.layoutBox);
        const d = !Xv(h);
        let m = !1;
        if (!n.resumeFrom) {
            const y = n.getClosestProjectingParent();
            if (y && !y.resumeFrom) {
                const {snapshot: g, layout: S} = y;
                if (g && S) {
                    const T = Yt();
                    Is(T, a.layoutBox, g.layoutBox);
                    const C = Yt();
                    Is(C, s, S.layoutBox),
                    Kv(T, C) || (m = !0),
                    y.options.layoutRoot && (n.relativeTarget = C,
                    n.relativeTargetOrigin = T,
                    n.relativeParent = y)
                }
            }
        }
        n.notifyListeners("didUpdate", {
            layout: s,
            snapshot: a,
            delta: p,
            layoutDelta: h,
            hasLayoutChanged: d,
            hasRelativeLayoutChanged: m
        })
    } else if (n.isLead()) {
        const {onExitComplete: s} = n.options;
        s && s()
    }
    n.options.transition = void 0
}
function m9(n) {
    n.parent && (n.isProjecting() || (n.isProjectionDirty = n.parent.isProjectionDirty),
    n.isSharedProjectionDirty || (n.isSharedProjectionDirty = !!(n.isProjectionDirty || n.parent.isProjectionDirty || n.parent.isSharedProjectionDirty)),
    n.isTransformDirty || (n.isTransformDirty = n.parent.isTransformDirty))
}
function p9(n) {
    n.isProjectionDirty = n.isSharedProjectionDirty = n.isTransformDirty = !1
}
function y9(n) {
    n.clearSnapshot()
}
function Y1(n) {
    n.clearMeasurements()
}
function G1(n) {
    n.isLayoutDirty = !1
}
function v9(n) {
    const {visualElement: a} = n.options;
    a && a.getProps().onBeforeLayoutMeasure && a.notify("BeforeLayoutMeasure"),
    n.resetTransform()
}
function k1(n) {
    n.finishAnimation(),
    n.targetDelta = n.relativeTarget = n.target = void 0,
    n.isProjectionDirty = !0
}
function g9(n) {
    n.resolveTargetDelta()
}
function S9(n) {
    n.calcProjection()
}
function b9(n) {
    n.resetSkewAndRotation()
}
function T9(n) {
    n.removeLeadSnapshot()
}
function X1(n, a, s) {
    n.translate = Bt(a.translate, 0, s),
    n.scale = Bt(a.scale, 1, s),
    n.origin = a.origin,
    n.originPoint = a.originPoint
}
function K1(n, a, s, o) {
    n.min = Bt(a.min, s.min, o),
    n.max = Bt(a.max, s.max, o)
}
function C9(n, a, s, o) {
    K1(n.x, a.x, s.x, o),
    K1(n.y, a.y, s.y, o)
}
function x9(n) {
    return n.animationValues && n.animationValues.opacityExit !== void 0
}
const R9 = {
    duration: .45,
    ease: [.4, 0, .1, 1]
}
  , Z1 = n => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(n)
  , Q1 = Z1("applewebkit/") && !Z1("chrome/") ? Math.round : Ge;
function F1(n) {
    n.min = Q1(n.min),
    n.max = Q1(n.max)
}
function M9(n) {
    F1(n.x),
    F1(n.y)
}
function Fv(n, a, s) {
    return n === "position" || n === "preserve-aspect" && !OS(H1(a), H1(s), .2)
}
function E9(n) {
    return n !== n.root && n.scroll?.wasRoot
}
const _9 = Qv({
    attachResizeListener: (n, a) => ol(n, "resize", a),
    measureScroll: () => ({
        x: document.documentElement.scrollLeft || document.body.scrollLeft,
        y: document.documentElement.scrollTop || document.body.scrollTop
    }),
    checkIsScrollRoot: () => !0
})
  , nf = {
    current: void 0
}
  , $v = Qv({
    measureScroll: n => ({
        x: n.scrollLeft,
        y: n.scrollTop
    }),
    defaultParent: () => {
        if (!nf.current) {
            const n = new _9({});
            n.mount(window),
            n.setOptions({
                layoutScroll: !0
            }),
            nf.current = n
        }
        return nf.current
    }
    ,
    resetTransform: (n, a) => {
        n.style.transform = a !== void 0 ? a : "none"
    }
    ,
    checkIsScrollRoot: n => window.getComputedStyle(n).position === "fixed"
})
  , A9 = {
    pan: {
        Feature: KS
    },
    drag: {
        Feature: XS,
        ProjectionNode: $v,
        MeasureLayout: Yv
    }
};
function $1(n, a, s) {
    const {props: o} = n;
    n.animationState && o.whileHover && n.animationState.setActive("whileHover", s === "Start");
    const u = "onHover" + s
      , f = o[u];
    f && Vt.postRender( () => f(a, hl(a)))
}
class D9 extends ai {
    mount() {
        const {current: a} = this.node;
        a && (this.unmount = F6(a, (s, o) => ($1(this.node, o, "Start"),
        u => $1(this.node, u, "End"))))
    }
    unmount() {}
}
class L9 extends ai {
    constructor() {
        super(...arguments),
        this.isActive = !1
    }
    onFocus() {
        let a = !1;
        try {
            a = this.node.current.matches(":focus-visible")
        } catch {
            a = !0
        }
        !a || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0),
        this.isActive = !0)
    }
    onBlur() {
        !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1),
        this.isActive = !1)
    }
    mount() {
        this.unmount = ul(ol(this.node.current, "focus", () => this.onFocus()), ol(this.node.current, "blur", () => this.onBlur()))
    }
    unmount() {}
}
function J1(n, a, s) {
    const {props: o} = n;
    if (n.current instanceof HTMLButtonElement && n.current.disabled)
        return;
    n.animationState && o.whileTap && n.animationState.setActive("whileTap", s === "Start");
    const u = "onTap" + (s === "End" ? "" : s)
      , f = o[u];
    f && Vt.postRender( () => f(a, hl(a)))
}
class O9 extends ai {
    mount() {
        const {current: a} = this.node;
        a && (this.unmount = I6(a, (s, o) => (J1(this.node, o, "Start"),
        (u, {success: f}) => J1(this.node, u, f ? "End" : "Cancel")), {
            useGlobalTarget: this.node.props.globalTapTarget
        }))
    }
    unmount() {}
}
const Lf = new WeakMap
  , af = new WeakMap
  , V9 = n => {
    const a = Lf.get(n.target);
    a && a(n)
}
  , w9 = n => {
    n.forEach(V9)
}
;
function z9({root: n, ...a}) {
    const s = n || document;
    af.has(s) || af.set(s, {});
    const o = af.get(s)
      , u = JSON.stringify(a);
    return o[u] || (o[u] = new IntersectionObserver(w9,{
        root: n,
        ...a
    })),
    o[u]
}
function B9(n, a, s) {
    const o = z9(a);
    return Lf.set(n, s),
    o.observe(n),
    () => {
        Lf.delete(n),
        o.unobserve(n)
    }
}
const U9 = {
    some: 0,
    all: 1
};
class N9 extends ai {
    constructor() {
        super(...arguments),
        this.hasEnteredView = !1,
        this.isInView = !1
    }
    startObserver() {
        this.unmount();
        const {viewport: a={}} = this.node.getProps()
          , {root: s, margin: o, amount: u="some", once: f} = a
          , h = {
            root: s ? s.current : void 0,
            rootMargin: o,
            threshold: typeof u == "number" ? u : U9[u]
        }
          , p = d => {
            const {isIntersecting: m} = d;
            if (this.isInView === m || (this.isInView = m,
            f && !m && this.hasEnteredView))
                return;
            m && (this.hasEnteredView = !0),
            this.node.animationState && this.node.animationState.setActive("whileInView", m);
            const {onViewportEnter: y, onViewportLeave: g} = this.node.getProps()
              , S = m ? y : g;
            S && S(d)
        }
        ;
        return B9(this.node.current, h, p)
    }
    mount() {
        this.startObserver()
    }
    update() {
        if (typeof IntersectionObserver > "u")
            return;
        const {props: a, prevProps: s} = this.node;
        ["amount", "margin", "root"].some(j9(a, s)) && this.startObserver()
    }
    unmount() {}
}
function j9({viewport: n={}}, {viewport: a={}}={}) {
    return s => n[s] !== a[s]
}
const P9 = {
    inView: {
        Feature: N9
    },
    tap: {
        Feature: O9
    },
    focus: {
        Feature: L9
    },
    hover: {
        Feature: D9
    }
}
  , H9 = {
    layout: {
        ProjectionNode: $v,
        MeasureLayout: Yv
    }
}
  , q9 = {
    ...MS,
    ...P9,
    ...A9,
    ...H9
}
  , zt = q7(q9, tS);
function Y9() {
    const n = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: .02
            }
        }
    }
      , a = {
        hidden: {
            pathLength: 0,
            opacity: 0,
            fill: "#fff"
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            fill: [null, "#000", "#fff", "#000"],
            transition: {
                default: {
                    duration: .8,
                    ease: Io
                },
                fill: {
                    duration: .5,
                    ease: Io,
                    delay: 1.2
                },
                times: [0, .33, .66, 1]
            }
        }
    };
    return X.jsx(zt.div, {
        exit: {
            opacity: 0
        },
        className: "absolute inset-0 flex items-center justify-center bg-white z-100",
        children: X.jsx(zt.svg, {
            xmlns: "http://www.w3.org/2000/svg",
            width: "817",
            height: "537",
            viewBox: "0 0 817 537",
            variants: n,
            initial: "hidden",
            animate: "visible",
            className: "w-[24rem] md:w-[32rem] m-auto",
            children: X.jsxs("g", {
                xmlns: "http://www.w3.org/2000/svg",
                "clip-path": "url(#clip0_5_142)",
                id: "g42",
                children: [X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M54.2724 346.452C47.5583 346.452 40.6138 345.201 33.6199 342.749C26.4779 340.231 20.2081 336.167 15.008 330.637C9.8243 325.141 6.02293 318.707 3.71907 311.532L2.78107 308.635L21.2284 301.033L22.2652 304.538C23.3513 308.24 25.2437 311.927 27.8932 315.498C30.4274 318.937 34.0971 321.767 38.7871 323.923C43.5594 326.112 48.5786 327.231 53.7293 327.231C56.494 327.231 59.5219 326.869 62.7473 326.145C65.8411 325.454 68.8855 324.154 71.7818 322.261C74.6287 320.418 77.1136 317.867 79.2035 314.658C81.1782 311.614 82.182 307.78 82.182 303.287C82.182 297.939 80.6023 293.545 77.3275 289.875C74.0363 286.173 69.2146 283.638 62.9777 282.355L55.9509 280.956L61.0852 261.752L69.3627 263.463C79.8124 265.652 88.0404 270.309 93.8659 277.303C99.6914 284.313 102.654 292.887 102.654 302.761C102.654 305.624 102.259 308.899 101.502 312.47C100.712 316.123 99.2635 319.891 97.2065 323.643C95.1166 327.445 92.1216 331.098 88.3202 334.505C84.4859 337.96 79.5162 340.84 73.5755 343.078C67.6348 345.316 61.1511 346.452 54.2889 346.452H54.2724ZM39.6593 277.105C29.44 274.653 21.3765 269.782 15.6333 262.608C9.89013 255.433 6.97739 247.336 6.97739 238.549C6.97739 230.485 8.93567 223.343 12.8193 217.287C16.6536 211.297 22.15 206.426 29.1274 202.806C36.0719 199.202 44.0367 197.392 52.8243 197.392C59.308 197.392 66.0386 198.642 72.802 201.111C79.7136 203.629 85.7201 207.693 90.6241 213.19C95.5115 218.67 98.9673 224.956 100.909 231.9L101.716 234.78L83.877 241.642L82.8568 238.236C80.7833 231.242 77.0148 225.976 71.3703 222.175C65.693 218.357 59.4561 216.415 52.8243 216.415C49.6976 216.415 45.9949 217.09 41.8315 218.423C37.915 219.673 34.6237 222.01 31.7604 225.565C28.9793 229.02 27.6134 233.151 27.6134 238.203C27.6134 240.885 28.2223 243.699 29.44 246.579C30.6084 249.36 32.4351 251.648 35.0351 253.59C37.7175 255.581 40.7783 256.963 44.1354 257.704L51.804 259.629L46.6861 278.718L39.6264 277.122L39.6593 277.105Z",
                    id: "path1"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M178.467 343.802C168.725 342.798 159.592 340.165 151.347 335.986C143.07 331.789 135.911 326.276 130.07 319.612C124.244 312.98 119.735 305.41 116.658 297.133C113.597 288.872 112.034 280.281 112.034 271.642C112.034 265.24 113.07 258.23 115.127 250.841C117.217 243.337 120.871 235.981 126.005 228.955C131.156 221.911 137.162 216.201 143.86 211.972C150.475 207.792 156.794 204.813 162.653 203.118C168.429 201.44 173.777 200.403 178.549 200.025L182.104 199.745V220.677L179.175 221.006C173.958 221.582 168.495 222.998 162.9 225.219C157.42 227.391 152.006 230.962 146.805 235.833C141.671 240.639 137.787 246.365 135.27 252.833C132.719 259.399 131.435 265.784 131.435 271.839C131.435 276.315 132.176 281.269 133.657 286.551C135.105 291.718 137.985 297.215 142.231 302.859C146.41 308.438 151.89 313.013 158.506 316.436C165.203 319.891 172.164 322.064 179.191 322.854L182.12 323.183V344.197L178.5 343.819L178.467 343.802ZM191.204 323.166L194.133 322.837C201.16 322.047 207.759 320.089 213.749 317.044C219.739 314 224.873 310.116 229.037 305.509C233.2 300.901 236.442 295.602 238.68 289.76C240.935 283.918 242.07 277.895 242.07 271.823C242.07 265.751 240.935 259.761 238.68 253.984C236.426 248.192 233.184 242.877 229.02 238.219C224.873 233.562 219.739 229.695 213.766 226.717C207.776 223.722 201.16 221.796 194.133 221.006L191.204 220.677V199.712L194.792 200.041C204.55 200.913 213.716 203.48 222.043 207.677C230.37 211.873 237.545 217.304 243.387 223.837C249.229 230.37 253.754 237.89 256.831 246.168C259.892 254.445 261.456 263.019 261.456 271.658C261.456 280.298 259.909 288.904 256.831 297.231C253.754 305.575 249.245 313.144 243.403 319.743C237.561 326.342 230.37 331.839 222.059 336.084C213.733 340.346 204.55 342.946 194.792 343.819L191.204 344.131V323.166Z",
                    id: "path3"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M297.429 200.996H276.414V342.831H297.429V200.996Z",
                    id: "path5"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M417.526 323.627H306.529V342.831H417.526V323.627Z",
                    id: "path7"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M379.479 516.345H180.294V535.549H379.479V516.345Z",
                    id: "path9"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M425.244 339.161L468.984 229.712L488.913 236.788L469.083 285.942H506.274V305.147H461.563L445.172 346.238L425.26 339.161H425.244ZM479.138 204.83L499.083 198.017L556.185 339.161L536.274 346.238L479.154 204.83H479.138Z",
                    id: "path11"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M594.413 276.974L611.676 264.681L664.319 334.685L647.056 346.978L594.413 276.974ZM568.017 342.831V200.996H589.032V342.831H568.017ZM622.833 262.459L626.371 261.094C628.165 260.402 630.057 259.201 631.999 257.523C633.826 255.943 635.356 253.738 636.541 250.973C637.742 248.159 638.351 245.131 638.351 241.988C638.351 239.256 637.775 236.261 636.656 233.085C635.586 230.074 633.941 227.539 631.769 225.581C629.547 223.573 627.227 222.158 624.857 221.418C622.372 220.628 619.887 220.216 617.468 220.216H598.132V201.012H618.011C622.405 201.012 626.98 201.72 631.588 203.135C636.327 204.583 641.033 207.298 645.575 211.182C650.167 215.115 653.655 219.97 655.943 225.598C658.197 231.143 659.349 236.656 659.349 241.988C659.349 247.715 658.131 253.359 655.729 258.74C653.31 264.171 650.134 268.565 646.283 271.823C642.547 274.983 638.845 277.319 635.307 278.751L632.624 279.837L622.849 262.459H622.833Z",
                    id: "path13"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M700.473 200.996H679.458V342.831H700.473V200.996Z",
                    id: "path15"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M766.61 346.452C759.896 346.452 752.952 345.201 745.958 342.749C738.816 340.231 732.546 336.167 727.346 330.637C722.162 325.141 718.361 318.707 716.057 311.532L715.119 308.635L733.566 301.033L734.603 304.538C735.689 308.24 737.582 311.927 740.231 315.498C742.766 318.937 746.435 321.767 751.125 323.923C755.898 326.112 760.917 327.231 766.067 327.231C768.832 327.231 771.86 326.869 775.085 326.145C778.179 325.454 781.224 324.154 784.12 322.261C786.967 320.418 789.452 317.867 791.542 314.658C793.516 311.614 794.52 307.78 794.52 303.287C794.52 297.939 792.94 293.545 789.666 289.875C786.374 286.173 781.553 283.638 775.316 282.355L768.289 280.956L773.423 261.752L781.701 263.463C792.15 265.652 800.379 270.309 806.204 277.303C812.029 284.313 814.992 292.887 814.992 302.761C814.992 305.624 814.597 308.899 813.84 312.47C813.05 316.123 811.602 319.891 809.545 323.643C807.455 327.445 804.46 331.098 800.658 334.505C796.824 337.96 791.854 340.84 785.914 343.078C779.973 345.316 773.489 346.452 766.627 346.452H766.61ZM751.997 277.105C741.778 274.653 733.715 269.782 727.971 262.608C722.228 255.433 719.315 247.336 719.315 238.549C719.315 230.485 721.274 223.343 725.157 217.287C728.992 211.297 734.488 206.426 741.465 202.806C748.41 199.202 756.375 197.392 765.162 197.392C771.646 197.392 778.377 198.642 785.14 201.111C792.052 203.629 798.058 207.693 802.962 213.19C807.85 218.67 811.305 224.956 813.247 231.9L814.054 234.78L796.215 241.642L795.195 238.236C793.121 231.242 789.353 225.976 783.708 222.175C778.031 218.357 771.794 216.415 765.162 216.415C762.036 216.415 758.333 217.09 754.17 218.423C750.253 219.673 746.962 222.01 744.098 225.565C741.317 229.02 739.951 233.151 739.951 238.203C739.951 240.885 740.56 243.699 741.778 246.579C742.947 249.36 744.773 251.648 747.373 253.59C750.056 255.581 753.116 256.963 756.473 257.704L764.142 259.629L759.024 278.718L751.965 277.122L751.997 277.105Z",
                    id: "path17"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M0 142.527L43.7405 33.0769L63.6689 40.153L43.8392 89.3076H81.0301V108.512H36.3187L19.9284 149.603L0.0164562 142.527H0ZM53.8939 8.19515L73.8388 1.36584L130.942 142.51L111.03 149.587L53.8939 8.19515Z",
                    id: "path19"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M166.767 146.197V32.6819H187.781V146.213H166.767V146.197ZM124.754 23.5652V4.36084H229.794V23.5652H124.754Z",
                    id: "path21"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M358.465 146.197V52.3306H379.479V146.197H358.465ZM245.213 146.197V52.3306H266.228V146.197H245.213ZM240.293 12.1117L257.407 0L312.519 77.8706L367.466 0L384.581 12.1117L312.535 113.235L240.293 12.1117Z",
                    id: "path23"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M633.299 126.531L636.228 126.219C641.445 125.659 646.908 124.228 652.503 122.006C657.983 119.834 663.397 116.263 668.597 111.392C673.732 106.587 677.615 100.86 680.133 94.3925C682.684 87.8265 683.968 81.4415 683.968 75.3857C683.968 70.9096 683.227 65.9563 681.746 60.6739C680.298 55.5066 677.418 50.0103 673.172 44.3658C668.992 38.7872 663.513 34.2124 656.897 30.7895C650.199 27.3172 643.239 25.1615 636.212 24.3716L633.283 24.0424V3.01147L636.903 3.38997C646.645 4.39379 655.778 7.02678 664.023 11.2066C672.3 15.403 679.459 20.9158 685.3 27.5641C691.126 34.1959 695.635 41.7657 698.712 50.0432C701.773 58.3206 703.336 66.8943 703.336 75.5338C703.336 81.9352 702.3 88.9291 700.243 96.3344C698.169 103.838 694.499 111.194 689.365 118.221C684.214 125.264 678.208 130.975 671.51 135.204C664.895 139.384 658.576 142.362 652.717 144.057C646.941 145.736 641.593 146.772 636.821 147.151L633.266 147.431V126.499L633.299 126.531Z",
                    id: "path25"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M463.619 147.184C453.861 146.312 444.695 143.745 436.368 139.548C428.041 135.352 420.866 129.921 415.024 123.388C409.182 116.855 404.657 109.335 401.596 101.057C398.535 92.7963 396.972 84.2226 396.972 75.5667C396.972 66.9107 398.519 58.3206 401.596 49.9938C404.673 41.6505 409.182 34.0807 415.024 27.4818C420.866 20.8829 428.058 15.3865 436.368 11.1408C444.695 6.87867 453.877 4.27859 463.636 3.40642L467.223 3.09375V24.0589L464.294 24.388C457.267 25.1779 450.668 27.1362 444.678 30.1806C438.688 33.225 433.554 37.1086 429.391 41.7164C425.227 46.3241 421.985 51.623 419.731 57.4649C417.476 63.3068 416.341 69.3298 416.341 75.4021C416.341 81.4744 417.476 87.4645 419.731 93.2406C421.985 99.0332 425.227 104.349 429.407 109.006C433.554 113.663 438.688 117.53 444.645 120.508C450.635 123.503 457.251 125.429 464.278 126.219L467.207 126.548V147.513L463.619 147.184Z",
                    id: "path27"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M768.24 149.817C761.526 149.817 754.581 148.566 747.587 146.114C740.445 143.613 734.175 139.532 728.975 133.986C723.792 128.49 719.99 122.055 717.686 114.881L716.765 111.984L735.212 104.382L736.249 107.887C737.335 111.589 739.227 115.276 741.877 118.846C744.411 122.286 748.081 125.116 752.771 127.272C757.543 129.461 762.562 130.58 767.713 130.58C770.461 130.58 773.506 130.218 776.731 129.494C779.825 128.802 782.853 127.502 785.765 125.61C788.612 123.767 791.097 121.216 793.187 118.007C795.162 114.963 796.166 111.129 796.166 106.636C796.166 101.288 794.586 96.894 791.311 93.2242C788.02 89.5216 783.198 86.9874 776.961 85.6873L769.935 84.2885L775.069 65.1007L783.346 66.8121C793.796 69.0008 802.024 73.6579 807.85 80.6517C813.675 87.662 816.637 96.2357 816.637 106.109C816.637 108.973 816.242 112.231 815.485 115.819C814.695 119.472 813.247 123.24 811.19 126.992C809.1 130.794 806.105 134.447 802.304 137.853C798.47 141.309 793.5 144.189 787.559 146.427C781.618 148.665 775.135 149.801 768.273 149.801L768.24 149.817ZM753.627 80.4707C743.407 78.0187 735.327 73.1313 729.601 65.9728C723.857 58.7979 720.945 50.7015 720.945 41.9139C720.945 33.8504 722.903 26.7084 726.787 20.6526C730.621 14.6625 736.117 9.79149 743.095 6.15468C750.039 2.55078 758.004 0.740601 766.791 0.740601C773.275 0.740601 779.989 1.99127 786.769 4.45969C793.681 6.97749 799.671 11.0422 804.591 16.5385C809.479 22.0184 812.935 28.3047 814.876 35.2656L815.683 38.1455L797.844 45.0077L796.824 41.6013C794.751 34.6074 790.982 29.3414 785.338 25.54C779.66 21.7222 773.423 19.7968 766.791 19.7968C763.665 19.7968 759.962 20.4715 755.799 21.8045C751.882 23.0552 748.591 25.3919 745.728 28.9465C742.947 32.4023 741.581 36.5328 741.581 41.5848C741.581 44.2507 742.19 47.0812 743.407 49.961C744.576 52.7421 746.402 55.0295 749.002 56.9713C751.668 58.9625 754.746 60.3448 758.103 61.0853L765.771 62.9943L760.67 82.0999L753.61 80.5036L753.627 80.4707Z",
                    id: "path29"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M54.2724 536.273C47.5583 536.273 40.5973 535.023 33.6199 532.571C26.4779 530.07 20.2081 525.988 15.008 520.443C9.8243 514.946 6.02293 508.512 3.71907 501.337L2.78107 498.441L21.2284 490.838L22.2652 494.343C23.3513 498.046 25.2437 501.732 27.8932 505.303C30.4274 508.742 34.0971 511.573 38.7871 513.729C43.5594 515.917 48.5786 517.036 53.7293 517.036C56.494 517.036 59.5219 516.674 62.7473 515.95C65.8411 515.259 68.8855 513.959 71.7818 512.066C74.6287 510.223 77.1136 507.673 79.2035 504.464C81.1782 501.419 82.182 497.585 82.182 493.093C82.182 487.744 80.6023 483.35 77.3275 479.681C74.0363 475.978 69.2146 473.444 62.9777 472.16L55.9509 470.745L61.0852 451.557L69.3627 453.269C79.8124 455.457 88.0569 460.114 93.8659 467.108C99.6914 474.119 102.654 482.692 102.654 492.566C102.654 495.429 102.259 498.704 101.502 502.275C100.712 505.928 99.2635 509.697 97.2065 513.449C95.1166 517.25 92.1216 520.903 88.3202 524.31C84.4859 527.766 79.5162 530.645 73.5755 532.883C67.6348 535.122 61.1511 536.257 54.2889 536.257L54.2724 536.273ZM39.6593 466.944C29.44 464.492 21.3601 459.604 15.6333 452.446C9.89013 445.271 6.97739 437.174 6.97739 428.387C6.97739 420.323 8.93567 413.181 12.8193 407.142C16.6536 401.152 22.15 396.281 29.1274 392.644C36.0719 389.04 44.0367 387.23 52.8243 387.23C59.308 387.23 66.0386 388.481 72.802 390.949C79.7136 393.467 85.7037 397.532 90.6241 403.028C95.5115 408.508 98.9673 414.811 100.909 421.755L101.716 424.635L83.877 431.497L82.8568 428.091C80.7833 421.097 77.0148 415.847 71.3703 412.029C65.693 408.212 59.4561 406.27 52.8243 406.27C49.6976 406.27 45.9949 406.944 41.8315 408.277C37.915 409.528 34.6237 411.865 31.7604 415.419C28.9793 418.875 27.6134 423.006 27.6134 428.058C27.6134 430.724 28.2223 433.554 29.44 436.434C30.6084 439.215 32.4351 441.502 35.0351 443.444C37.701 445.435 40.7783 446.818 44.1354 447.558L51.804 449.467L46.6861 468.573L39.6264 466.977L39.6593 466.944Z",
                    id: "path31"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M167.458 535.697C160.843 534.809 154.523 532.768 148.681 529.658C142.84 526.548 137.689 522.582 133.377 517.892C129.033 513.169 125.61 507.705 123.191 501.65C120.755 495.577 119.521 489.126 119.521 482.478V390.817H140.536V482.478C140.536 487.613 141.605 492.516 143.745 497.042C145.867 501.567 149.093 505.648 153.322 509.17C157.502 512.659 162.636 515.029 168.56 516.23L171.193 516.773V536.208L167.458 535.714V535.697Z",
                    id: "path33"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M387.082 516.756L389.731 516.23C394.668 515.242 399.473 513.136 404.015 509.993C408.458 506.899 411.914 502.851 414.284 497.914C416.703 492.911 417.921 487.728 417.921 482.478V390.817H438.935V482.478C438.935 489.11 437.701 495.561 435.282 501.65C432.863 507.705 429.407 513.202 424.997 517.991C420.619 522.763 415.419 526.712 409.577 529.773C403.735 532.818 397.416 534.825 390.817 535.714L387.082 536.208V516.756Z",
                    id: "path35"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M487.596 466.795L504.859 454.503L557.502 524.507L540.239 536.8L487.596 466.795ZM461.2 532.669V390.834H482.215V532.669H461.2ZM516.032 452.298L519.57 450.915C521.364 450.208 523.257 449.006 525.198 447.344C527.025 445.764 528.556 443.559 529.74 440.795C530.942 437.981 531.551 434.953 531.551 431.81C531.551 429.078 530.975 426.083 529.856 422.907C528.786 419.895 527.14 417.378 524.968 415.403C522.746 413.395 520.426 411.98 518.056 411.223C515.572 410.433 513.087 410.022 510.668 410.022H491.332V390.817H511.211C515.604 390.817 520.179 391.525 524.787 392.94C529.526 394.388 534.233 397.104 538.775 400.987C543.366 404.92 546.855 409.775 549.142 415.403C551.397 420.949 552.549 426.461 552.549 431.793C552.549 437.52 551.331 443.164 548.928 448.562C546.509 453.993 543.333 458.386 539.482 461.645C535.747 464.788 532.061 467.125 528.506 468.573L525.824 469.675L516.049 452.298H516.032Z",
                    id: "path37"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M640.309 536.092C627.292 536.092 615.065 532.883 603.957 526.548C592.85 520.212 583.848 511.128 577.216 499.527C570.584 487.958 567.227 475.237 567.227 461.727C567.227 448.216 570.519 435.496 577.019 423.878C583.535 412.227 592.471 403.094 603.595 396.742C614.703 390.406 626.864 387.197 639.766 387.197C649.673 387.197 659.398 389.254 668.68 393.335C677.961 397.416 686.09 403.225 692.87 410.631L694.993 412.951L680.676 427.268L678.372 424.52C673.534 418.793 667.659 414.284 660.929 411.141C654.182 407.998 647.138 406.401 639.964 406.401C632.789 406.401 625.581 407.882 619.245 410.795C612.893 413.724 607.38 417.789 602.838 422.89C598.264 428.025 594.676 434.048 592.191 440.778C589.69 447.525 588.423 454.585 588.423 461.727C588.423 468.869 589.723 475.879 592.257 482.56C594.808 489.242 598.445 495.232 603.085 500.383C607.677 505.484 613.272 509.565 619.673 512.494C626.058 515.407 633.068 516.888 640.49 516.888C650.89 516.888 660.517 513.613 669.074 507.179C677.648 500.745 683.638 491.71 686.913 480.322L687.933 476.784L707.286 484.733L706.397 487.613C704.636 493.257 701.97 499 698.482 504.678C694.944 510.437 690.303 515.687 684.691 520.278C679.096 524.869 672.497 528.671 665.059 531.616C657.539 534.578 649.228 536.076 640.309 536.076V536.092ZM638.466 471.535V452.15H710.692V471.535H638.466Z",
                    id: "path39"
                }), X.jsx(zt.path, {
                    variants: a,
                    stroke: "black",
                    strokeWidth: "4",
                    d: "M 727.198,532.67 V 390.834 h 85.753 v 19.204 h -64.738 v 103.427 h 64.738 v 19.205 z m 30.115,-61.316 V 452.15 h 45.353 v 19.204 z",
                    id: "path41"
                })]
            })
        })
    }, "loader")
}
const bh = Q4({
    component: G9
});
function G9() {
    return X.jsx(X.Fragment, {
        children: X.jsx(Sy, {})
    })
}
const k9 = "modulepreload"
  , X9 = function(n) {
    return "/" + n
}
  , W1 = {}
  , Jv = function(a, s, o) {
    let u = Promise.resolve();
    if (s && s.length > 0) {
        let d = function(m) {
            return Promise.all(m.map(y => Promise.resolve(y).then(g => ({
                status: "fulfilled",
                value: g
            }), g => ({
                status: "rejected",
                reason: g
            }))))
        };
        document.getElementsByTagName("link");
        const h = document.querySelector("meta[property=csp-nonce]")
          , p = h?.nonce || h?.getAttribute("nonce");
        u = d(s.map(m => {
            if (m = X9(m),
            m in W1)
                return;
            W1[m] = !0;
            const y = m.endsWith(".css")
              , g = y ? '[rel="stylesheet"]' : "";
            if (document.querySelector(`link[href="${m}"]${g}`))
                return;
            const S = document.createElement("link");
            if (S.rel = y ? "stylesheet" : k9,
            y || (S.as = "script"),
            S.crossOrigin = "",
            S.href = m,
            p && S.setAttribute("nonce", p),
            document.head.appendChild(S),
            y)
                return new Promise( (T, C) => {
                    S.addEventListener("load", T),
                    S.addEventListener("error", () => C(new Error(`Unable to preload CSS for ${m}`)))
                }
                )
        }
        ))
    }
    function f(h) {
        const p = new Event("vite:preloadError",{
            cancelable: !0
        });
        if (p.payload = h,
        window.dispatchEvent(p),
        !p.defaultPrevented)
            throw h
    }
    return u.then(h => {
        for (const p of h || [])
            p.status === "rejected" && f(p.reason);
        return a().catch(f)
    }
    )
}
  , K9 = () => Jv( () => import("./coming-soon-DxlMNWFt.js"), __vite__mapDeps([0, 1]))
  , Z9 = Wo("/coming-soon")({
    component: yy(K9, "component")
})
  , Q9 = () => Jv( () => import("./index-Bj15PNX4.js"), __vite__mapDeps([2, 1]))
  , F9 = Wo("/")({
    component: yy(Q9, "component")
})
  , $9 = Z9.update({
    id: "/coming-soon",
    path: "/coming-soon",
    getParentRoute: () => bh
})
  , J9 = F9.update({
    id: "/",
    path: "/",
    getParentRoute: () => bh
})
  , W9 = {
    IndexRoute: J9,
    ComingSoonRoute: $9
}
  , I9 = bh._addFileChildren(W9)._addFileTypes()
  , t8 = i5({
    routeTree: I9,
    defaultPreload: "intent",
    scrollRestoration: !0
});
function e8() {
    const [n,a] = H.useState(!0);
    return H.useEffect( () => {
        const s = setTimeout( () => a(!1), 2250);
        return () => clearTimeout(s)
    }
    , []),
    X.jsxs(X.Fragment, {
        children: [X.jsx(u7, {
            children: n ? X.jsx(Y9, {}) : null
        }), X.jsx(l5, {
            router: t8
        })]
    })
}
const I1 = document.getElementById("root");
I1.innerHTML || x3.createRoot(I1).render(X.jsx(H.StrictMode, {
    children: X.jsx(e8, {})
}));
export {ah as J, ch as M, tl as R, ue as a, by as b, ni as c, t1 as d, X6 as e, Vt as f, B4 as g, zt as h, W5 as i, X as j, cl as k, Ua as m, H as r, qf as u};
