﻿/*
 Highcharts JS v6.2.0 (2018-10-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (P, L) { "object" === typeof module && module.exports ? module.exports = P.document ? L(P) : L : "function" === typeof define && define.amd ? define(function () { return L(P) }) : P.Highcharts = L(P) })("undefined" !== typeof window ? window : this, function (P) {
    var L = function () {
        var a = "undefined" === typeof P ? window : P, B = a.document, E = a.navigator && a.navigator.userAgent || "", F = B && B.createElementNS && !!B.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect, p = /(edge|msie|trident)/i.test(E) && !a.opera, g = -1 !== E.indexOf("Firefox"),
            d = -1 !== E.indexOf("Chrome"), t = g && 4 > parseInt(E.split("Firefox/")[1], 10); return a.Highcharts ? a.Highcharts.error(16, !0) : {
                product: "Highcharts", version: "6.2.0", deg2rad: 2 * Math.PI / 360, doc: B, hasBidiBug: t, hasTouch: B && void 0 !== B.documentElement.ontouchstart, isMS: p, isWebKit: -1 !== E.indexOf("AppleWebKit"), isFirefox: g, isChrome: d, isSafari: !d && -1 !== E.indexOf("Safari"), isTouchDevice: /(Mobile|Android|Windows Phone)/.test(E), SVG_NS: "http://www.w3.org/2000/svg", chartCount: 0, seriesTypes: {}, symbolSizes: {}, svg: F, win: a, marginNames: ["plotTop",
                    "marginRight", "marginBottom", "plotLeft"], noop: function () { }, charts: []
            }
    }(); (function (a) {
        a.timers = []; var B = a.charts, E = a.doc, F = a.win; a.error = function (p, g) { p = a.isNumber(p) ? "Highcharts error #" + p + ": www.highcharts.com/errors/" + p : p; if (g) throw Error(p); F.console && console.log(p) }; a.Fx = function (a, g, d) { this.options = g; this.elem = a; this.prop = d }; a.Fx.prototype = {
            dSetter: function () {
                var a = this.paths[0], g = this.paths[1], d = [], t = this.now, x = a.length, v; if (1 === t) d = this.toD; else if (x === g.length && 1 > t) for (; x--;)v = parseFloat(a[x]),
                    d[x] = isNaN(v) ? g[x] : t * parseFloat(g[x] - v) + v; else d = g; this.elem.attr("d", d, null, !0)
            }, update: function () { var a = this.elem, g = this.prop, d = this.now, t = this.options.step; if (this[g + "Setter"]) this[g + "Setter"](); else a.attr ? a.element && a.attr(g, d, null, !0) : a.style[g] = d + this.unit; t && t.call(a, d, this) }, run: function (p, g, d) {
                var t = this, x = t.options, v = function (a) { return v.stopped ? !1 : t.step(a) }, r = F.requestAnimationFrame || function (a) { setTimeout(a, 13) }, f = function () {
                    for (var c = 0; c < a.timers.length; c++)a.timers[c]() || a.timers.splice(c--,
                        1); a.timers.length && r(f)
                }; p !== g || this.elem["forceAnimate:" + this.prop] ? (this.startTime = +new Date, this.start = p, this.end = g, this.unit = d, this.now = this.start, this.pos = 0, v.elem = this.elem, v.prop = this.prop, v() && 1 === a.timers.push(v) && r(f)) : (delete x.curAnim[this.prop], x.complete && 0 === a.keys(x.curAnim).length && x.complete.call(this.elem))
            }, step: function (p) {
                var g = +new Date, d, t = this.options, x = this.elem, v = t.complete, r = t.duration, f = t.curAnim; x.attr && !x.element ? p = !1 : p || g >= r + this.startTime ? (this.now = this.end, this.pos =
                    1, this.update(), d = f[this.prop] = !0, a.objectEach(f, function (a) { !0 !== a && (d = !1) }), d && v && v.call(x), p = !1) : (this.pos = t.easing((g - this.startTime) / r), this.now = this.start + (this.end - this.start) * this.pos, this.update(), p = !0); return p
            }, initPath: function (p, g, d) {
                function t(a) { var b, e; for (n = a.length; n--;)b = "M" === a[n] || "L" === a[n], e = /[a-zA-Z]/.test(a[n + 3]), b && e && a.splice(n + 1, 0, a[n + 1], a[n + 2], a[n + 1], a[n + 2]) } function x(a, b) {
                    for (; a.length < m;) {
                        a[0] = b[m - a.length]; var c = a.slice(0, l);[].splice.apply(a, [0, 0].concat(c)); e && (c =
                            a.slice(a.length - l), [].splice.apply(a, [a.length, 0].concat(c)), n--)
                    } a[0] = "M"
                } function v(a, c) { for (var f = (m - a.length) / l; 0 < f && f--;)b = a.slice().splice(a.length / D - l, l * D), b[0] = c[m - l - f * l], u && (b[l - 6] = b[l - 2], b[l - 5] = b[l - 1]), [].splice.apply(a, [a.length / D, 0].concat(b)), e && f-- } g = g || ""; var r, f = p.startX, c = p.endX, u = -1 < g.indexOf("C"), l = u ? 7 : 3, m, b, n; g = g.split(" "); d = d.slice(); var e = p.isArea, D = e ? 2 : 1, w; u && (t(g), t(d)); if (f && c) {
                    for (n = 0; n < f.length; n++)if (f[n] === c[0]) { r = n; break } else if (f[0] === c[c.length - f.length + n]) {
                        r = n; w =
                            !0; break
                    } void 0 === r && (g = [])
                } g.length && a.isNumber(r) && (m = d.length + r * D * l, w ? (x(g, d), v(d, g)) : (x(d, g), v(g, d))); return [g, d]
            }, fillSetter: function () { a.Fx.prototype.strokeSetter.apply(this, arguments) }, strokeSetter: function () { this.elem.attr(this.prop, a.color(this.start).tweenTo(a.color(this.end), this.pos), null, !0) }
        }; a.merge = function () {
            var p, g = arguments, d, t = {}, x = function (d, r) {
                "object" !== typeof d && (d = {}); a.objectEach(r, function (f, c) {
                    !a.isObject(f, !0) || a.isClass(f) || a.isDOMElement(f) ? d[c] = r[c] : d[c] = x(d[c] || {},
                        f)
                }); return d
            }; !0 === g[0] && (t = g[1], g = Array.prototype.slice.call(g, 2)); d = g.length; for (p = 0; p < d; p++)t = x(t, g[p]); return t
        }; a.pInt = function (a, g) { return parseInt(a, g || 10) }; a.isString = function (a) { return "string" === typeof a }; a.isArray = function (a) { a = Object.prototype.toString.call(a); return "[object Array]" === a || "[object Array Iterator]" === a }; a.isObject = function (p, g) { return !!p && "object" === typeof p && (!g || !a.isArray(p)) }; a.isDOMElement = function (p) { return a.isObject(p) && "number" === typeof p.nodeType }; a.isClass = function (p) {
            var g =
                p && p.constructor; return !(!a.isObject(p, !0) || a.isDOMElement(p) || !g || !g.name || "Object" === g.name)
        }; a.isNumber = function (a) { return "number" === typeof a && !isNaN(a) && Infinity > a && -Infinity < a }; a.erase = function (a, g) { for (var d = a.length; d--;)if (a[d] === g) { a.splice(d, 1); break } }; a.defined = function (a) { return void 0 !== a && null !== a }; a.attr = function (p, g, d) {
            var t; a.isString(g) ? a.defined(d) ? p.setAttribute(g, d) : p && p.getAttribute && ((t = p.getAttribute(g)) || "class" !== g || (t = p.getAttribute(g + "Name"))) : a.defined(g) && a.isObject(g) &&
                a.objectEach(g, function (a, d) { p.setAttribute(d, a) }); return t
        }; a.splat = function (p) { return a.isArray(p) ? p : [p] }; a.syncTimeout = function (a, g, d) { if (g) return setTimeout(a, g, d); a.call(0, d) }; a.clearTimeout = function (p) { a.defined(p) && clearTimeout(p) }; a.extend = function (a, g) { var d; a || (a = {}); for (d in g) a[d] = g[d]; return a }; a.pick = function () { var a = arguments, g, d, t = a.length; for (g = 0; g < t; g++)if (d = a[g], void 0 !== d && null !== d) return d }; a.css = function (p, g) {
            a.isMS && !a.svg && g && void 0 !== g.opacity && (g.filter = "alpha(opacity\x3d" +
                100 * g.opacity + ")"); a.extend(p.style, g)
        }; a.createElement = function (p, g, d, t, x) { p = E.createElement(p); var v = a.css; g && a.extend(p, g); x && v(p, { padding: 0, border: "none", margin: 0 }); d && v(p, d); t && t.appendChild(p); return p }; a.extendClass = function (p, g) { var d = function () { }; d.prototype = new p; a.extend(d.prototype, g); return d }; a.pad = function (a, g, d) { return Array((g || 2) + 1 - String(a).replace("-", "").length).join(d || 0) + a }; a.relativeLength = function (a, g, d) { return /%$/.test(a) ? g * parseFloat(a) / 100 + (d || 0) : parseFloat(a) }; a.wrap =
            function (a, g, d) { var t = a[g]; a[g] = function () { var a = Array.prototype.slice.call(arguments), g = arguments, r = this; r.proceed = function () { t.apply(r, arguments.length ? arguments : g) }; a.unshift(t); a = d.apply(this, a); r.proceed = null; return a } }; a.datePropsToTimestamps = function (p) { a.objectEach(p, function (g, d) { a.isObject(g) && "function" === typeof g.getTime ? p[d] = g.getTime() : (a.isObject(g) || a.isArray(g)) && a.datePropsToTimestamps(g) }) }; a.formatSingle = function (p, g, d) {
                var t = /\.([0-9])/, x = a.defaultOptions.lang; /f$/.test(p) ? (d =
                    (d = p.match(t)) ? d[1] : -1, null !== g && (g = a.numberFormat(g, d, x.decimalPoint, -1 < p.indexOf(",") ? x.thousandsSep : ""))) : g = (d || a.time).dateFormat(p, g); return g
            }; a.format = function (p, g, d) { for (var t = "{", x = !1, v, r, f, c, u = [], l; p;) { t = p.indexOf(t); if (-1 === t) break; v = p.slice(0, t); if (x) { v = v.split(":"); r = v.shift().split("."); c = r.length; l = g; for (f = 0; f < c; f++)l && (l = l[r[f]]); v.length && (l = a.formatSingle(v.join(":"), l, d)); u.push(l) } else u.push(v); p = p.slice(t + 1); t = (x = !x) ? "}" : "{" } u.push(p); return u.join("") }; a.getMagnitude = function (a) {
                return Math.pow(10,
                    Math.floor(Math.log(a) / Math.LN10))
            }; a.normalizeTickInterval = function (p, g, d, t, x) { var v, r = p; d = a.pick(d, 1); v = p / d; g || (g = x ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === t && (1 === d ? g = a.grep(g, function (a) { return 0 === a % 1 }) : .1 >= d && (g = [1 / d]))); for (t = 0; t < g.length && !(r = g[t], x && r * d >= p || !x && v <= (g[t] + (g[t + 1] || g[t])) / 2); t++); return r = a.correctFloat(r * d, -Math.round(Math.log(.001) / Math.LN10)) }; a.stableSort = function (a, g) {
                var d = a.length, t, x; for (x = 0; x < d; x++)a[x].safeI = x; a.sort(function (a, d) {
                    t = g(a, d); return 0 === t ?
                        a.safeI - d.safeI : t
                }); for (x = 0; x < d; x++)delete a[x].safeI
            }; a.arrayMin = function (a) { for (var g = a.length, d = a[0]; g--;)a[g] < d && (d = a[g]); return d }; a.arrayMax = function (a) { for (var g = a.length, d = a[0]; g--;)a[g] > d && (d = a[g]); return d }; a.destroyObjectProperties = function (p, g) { a.objectEach(p, function (a, t) { a && a !== g && a.destroy && a.destroy(); delete p[t] }) }; a.discardElement = function (p) { var g = a.garbageBin; g || (g = a.createElement("div")); p && g.appendChild(p); g.innerHTML = "" }; a.correctFloat = function (a, g) {
                return parseFloat(a.toPrecision(g ||
                    14))
            }; a.setAnimation = function (p, g) { g.renderer.globalAnimation = a.pick(p, g.options.chart.animation, !0) }; a.animObject = function (p) { return a.isObject(p) ? a.merge(p) : { duration: p ? 500 : 0 } }; a.timeUnits = { millisecond: 1, second: 1E3, minute: 6E4, hour: 36E5, day: 864E5, week: 6048E5, month: 24192E5, year: 314496E5 }; a.numberFormat = function (p, g, d, t) {
                p = +p || 0; g = +g; var x = a.defaultOptions.lang, v = (p.toString().split(".")[1] || "").split("e")[0].length, r, f, c = p.toString().split("e"); -1 === g ? g = Math.min(v, 20) : a.isNumber(g) ? g && c[1] && 0 > c[1] &&
                    (r = g + +c[1], 0 <= r ? (c[0] = (+c[0]).toExponential(r).split("e")[0], g = r) : (c[0] = c[0].split(".")[0] || 0, p = 20 > g ? (c[0] * Math.pow(10, c[1])).toFixed(g) : 0, c[1] = 0)) : g = 2; f = (Math.abs(c[1] ? c[0] : p) + Math.pow(10, -Math.max(g, v) - 1)).toFixed(g); v = String(a.pInt(f)); r = 3 < v.length ? v.length % 3 : 0; d = a.pick(d, x.decimalPoint); t = a.pick(t, x.thousandsSep); p = (0 > p ? "-" : "") + (r ? v.substr(0, r) + t : ""); p += v.substr(r).replace(/(\d{3})(?=\d)/g, "$1" + t); g && (p += d + f.slice(-g)); c[1] && 0 !== +p && (p += "e" + c[1]); return p
            }; Math.easeInOutSine = function (a) {
                return -.5 *
                    (Math.cos(Math.PI * a) - 1)
            }; a.getStyle = function (p, g, d) { if ("width" === g) return Math.max(0, Math.min(p.offsetWidth, p.scrollWidth) - a.getStyle(p, "padding-left") - a.getStyle(p, "padding-right")); if ("height" === g) return Math.max(0, Math.min(p.offsetHeight, p.scrollHeight) - a.getStyle(p, "padding-top") - a.getStyle(p, "padding-bottom")); F.getComputedStyle || a.error(27, !0); if (p = F.getComputedStyle(p, void 0)) p = p.getPropertyValue(g), a.pick(d, "opacity" !== g) && (p = a.pInt(p)); return p }; a.inArray = function (p, g, d) {
                return (a.indexOfPolyfill ||
                    Array.prototype.indexOf).call(g, p, d)
            }; a.grep = function (p, g) { return (a.filterPolyfill || Array.prototype.filter).call(p, g) }; a.find = Array.prototype.find ? function (a, g) { return a.find(g) } : function (a, g) { var d, t = a.length; for (d = 0; d < t; d++)if (g(a[d], d)) return a[d] }; a.some = function (p, g, d) { return (a.somePolyfill || Array.prototype.some).call(p, g, d) }; a.map = function (a, g) { for (var d = [], t = 0, x = a.length; t < x; t++)d[t] = g.call(a[t], a[t], t, a); return d }; a.keys = function (p) { return (a.keysPolyfill || Object.keys).call(void 0, p) }; a.reduce =
                function (p, g, d) { return (a.reducePolyfill || Array.prototype.reduce).apply(p, 2 < arguments.length ? [g, d] : [g]) }; a.offset = function (a) { var g = E.documentElement; a = a.parentElement || a.parentNode ? a.getBoundingClientRect() : { top: 0, left: 0 }; return { top: a.top + (F.pageYOffset || g.scrollTop) - (g.clientTop || 0), left: a.left + (F.pageXOffset || g.scrollLeft) - (g.clientLeft || 0) } }; a.stop = function (p, g) { for (var d = a.timers.length; d--;)a.timers[d].elem !== p || g && g !== a.timers[d].prop || (a.timers[d].stopped = !0) }; a.each = function (p, g, d) {
                    return (a.forEachPolyfill ||
                        Array.prototype.forEach).call(p, g, d)
                }; a.objectEach = function (a, g, d) { for (var t in a) a.hasOwnProperty(t) && g.call(d || a[t], a[t], t, a) }; a.addEvent = function (p, g, d, t) {
                    var x, v = p.addEventListener || a.addEventListenerPolyfill; x = "function" === typeof p && p.prototype ? p.prototype.protoEvents = p.prototype.protoEvents || {} : p.hcEvents = p.hcEvents || {}; a.Point && p instanceof a.Point && p.series && p.series.chart && (p.series.chart.runTrackerClick = !0); v && v.call(p, g, d, !1); x[g] || (x[g] = []); x[g].push(d); t && a.isNumber(t.order) && (d.order =
                        t.order, x[g].sort(function (a, f) { return a.order - f.order })); return function () { a.removeEvent(p, g, d) }
                }; a.removeEvent = function (p, g, d) {
                    function t(f, c) { var d = p.removeEventListener || a.removeEventListenerPolyfill; d && d.call(p, f, c, !1) } function x(f) { var c, d; p.nodeName && (g ? (c = {}, c[g] = !0) : c = f, a.objectEach(c, function (a, c) { if (f[c]) for (d = f[c].length; d--;)t(c, f[c][d]) })) } var v, r; a.each(["protoEvents", "hcEvents"], function (f) {
                        var c = p[f]; c && (g ? (v = c[g] || [], d ? (r = a.inArray(d, v), -1 < r && (v.splice(r, 1), c[g] = v), t(g, d)) : (x(c),
                            c[g] = [])) : (x(c), p[f] = {}))
                    })
                }; a.fireEvent = function (p, g, d, t) {
                    var x, v, r, f, c; d = d || {}; E.createEvent && (p.dispatchEvent || p.fireEvent) ? (x = E.createEvent("Events"), x.initEvent(g, !0, !0), a.extend(x, d), p.dispatchEvent ? p.dispatchEvent(x) : p.fireEvent(g, x)) : a.each(["protoEvents", "hcEvents"], function (u) { if (p[u]) for (v = p[u][g] || [], r = v.length, d.target || a.extend(d, { preventDefault: function () { d.defaultPrevented = !0 }, target: p, type: g }), f = 0; f < r; f++)(c = v[f]) && !1 === c.call(p, d) && d.preventDefault() }); t && !d.defaultPrevented && t.call(p,
                        d)
                }; a.animate = function (p, g, d) {
                    var t, x = "", v, r, f; a.isObject(d) || (f = arguments, d = { duration: f[2], easing: f[3], complete: f[4] }); a.isNumber(d.duration) || (d.duration = 400); d.easing = "function" === typeof d.easing ? d.easing : Math[d.easing] || Math.easeInOutSine; d.curAnim = a.merge(g); a.objectEach(g, function (c, f) {
                        a.stop(p, f); r = new a.Fx(p, d, f); v = null; "d" === f ? (r.paths = r.initPath(p, p.d, g.d), r.toD = g.d, t = 0, v = 1) : p.attr ? t = p.attr(f) : (t = parseFloat(a.getStyle(p, f)) || 0, "opacity" !== f && (x = "px")); v || (v = c); v && v.match && v.match("px") &&
                            (v = v.replace(/px/g, "")); r.run(t, v, x)
                    })
                }; a.seriesType = function (p, g, d, t, x) { var v = a.getOptions(), r = a.seriesTypes; v.plotOptions[p] = a.merge(v.plotOptions[g], d); r[p] = a.extendClass(r[g] || function () { }, t); r[p].prototype.type = p; x && (r[p].prototype.pointClass = a.extendClass(a.Point, x)); return r[p] }; a.uniqueKey = function () { var a = Math.random().toString(36).substring(2, 9), g = 0; return function () { return "highcharts-" + a + "-" + g++ } }(); F.jQuery && (F.jQuery.fn.highcharts = function () {
                    var p = [].slice.call(arguments); if (this[0]) return p[0] ?
                        (new (a[a.isString(p[0]) ? p.shift() : "Chart"])(this[0], p[0], p[1]), this) : B[a.attr(this[0], "data-highcharts-chart")]
                })
    })(L); (function (a) {
        var B = a.each, E = a.isNumber, F = a.map, p = a.merge, g = a.pInt; a.Color = function (d) { if (!(this instanceof a.Color)) return new a.Color(d); this.init(d) }; a.Color.prototype = {
            parsers: [{ regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/, parse: function (a) { return [g(a[1]), g(a[2]), g(a[3]), parseFloat(a[4], 10)] } }, {
                regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
                parse: function (a) { return [g(a[1]), g(a[2]), g(a[3]), 1] }
            }], names: { white: "#ffffff", black: "#000000" }, init: function (d) {
                var g, x, v, r; if ((this.input = d = this.names[d && d.toLowerCase ? d.toLowerCase() : ""] || d) && d.stops) this.stops = F(d.stops, function (f) { return new a.Color(f[1]) }); else if (d && d.charAt && "#" === d.charAt() && (g = d.length, d = parseInt(d.substr(1), 16), 7 === g ? x = [(d & 16711680) >> 16, (d & 65280) >> 8, d & 255, 1] : 4 === g && (x = [(d & 3840) >> 4 | (d & 3840) >> 8, (d & 240) >> 4 | d & 240, (d & 15) << 4 | d & 15, 1])), !x) for (v = this.parsers.length; v-- && !x;)r = this.parsers[v],
                    (g = r.regex.exec(d)) && (x = r.parse(g)); this.rgba = x || []
            }, get: function (a) { var d = this.input, x = this.rgba, g; this.stops ? (g = p(d), g.stops = [].concat(g.stops), B(this.stops, function (d, f) { g.stops[f] = [g.stops[f][0], d.get(a)] })) : g = x && E(x[0]) ? "rgb" === a || !a && 1 === x[3] ? "rgb(" + x[0] + "," + x[1] + "," + x[2] + ")" : "a" === a ? x[3] : "rgba(" + x.join(",") + ")" : d; return g }, brighten: function (a) {
                var d, x = this.rgba; if (this.stops) B(this.stops, function (d) { d.brighten(a) }); else if (E(a) && 0 !== a) for (d = 0; 3 > d; d++)x[d] += g(255 * a), 0 > x[d] && (x[d] = 0), 255 < x[d] &&
                    (x[d] = 255); return this
            }, setOpacity: function (a) { this.rgba[3] = a; return this }, tweenTo: function (a, g) { var d = this.rgba, v = a.rgba; v.length && d && d.length ? (a = 1 !== v[3] || 1 !== d[3], g = (a ? "rgba(" : "rgb(") + Math.round(v[0] + (d[0] - v[0]) * (1 - g)) + "," + Math.round(v[1] + (d[1] - v[1]) * (1 - g)) + "," + Math.round(v[2] + (d[2] - v[2]) * (1 - g)) + (a ? "," + (v[3] + (d[3] - v[3]) * (1 - g)) : "") + ")") : g = a.input || "none"; return g }
        }; a.color = function (d) { return new a.Color(d) }
    })(L); (function (a) {
        var B, E, F = a.addEvent, p = a.animate, g = a.attr, d = a.charts, t = a.color, x = a.css,
            v = a.createElement, r = a.defined, f = a.deg2rad, c = a.destroyObjectProperties, u = a.doc, l = a.each, m = a.extend, b = a.erase, n = a.grep, e = a.hasTouch, D = a.inArray, w = a.isArray, H = a.isFirefox, A = a.isMS, z = a.isObject, q = a.isString, C = a.isWebKit, G = a.merge, I = a.noop, J = a.objectEach, k = a.pick, y = a.pInt, O = a.removeEvent, h = a.splat, K = a.stop, T = a.svg, R = a.SVG_NS, Q = a.symbolSizes, N = a.win; B = a.SVGElement = function () { return this }; m(B.prototype, {
                opacity: 1, SVG_NS: R, textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline cursor".split(" "),
                init: function (a, b) { this.element = "span" === b ? v(b) : u.createElementNS(this.SVG_NS, b); this.renderer = a }, animate: function (b, h, y) { h = a.animObject(k(h, this.renderer.globalAnimation, !0)); 0 !== h.duration ? (y && (h.complete = y), p(this, b, h)) : (this.attr(b, null, y), h.step && h.step.call(this)); return this }, complexColor: function (b, h, k) {
                    var y = this.renderer, M, e, c, q, m, f, d, n, K, D, C, u = [], O; a.fireEvent(this.renderer, "complexColor", { args: arguments }, function () {
                        b.radialGradient ? e = "radialGradient" : b.linearGradient && (e = "linearGradient");
                        e && (c = b[e], m = y.gradients, d = b.stops, D = k.radialReference, w(c) && (b[e] = c = { x1: c[0], y1: c[1], x2: c[2], y2: c[3], gradientUnits: "userSpaceOnUse" }), "radialGradient" === e && D && !r(c.gradientUnits) && (q = c, c = G(c, y.getRadialAttr(D, q), { gradientUnits: "userSpaceOnUse" })), J(c, function (a, b) { "id" !== b && u.push(b, a) }), J(d, function (a) { u.push(a) }), u = u.join(","), m[u] ? C = m[u].attr("id") : (c.id = C = a.uniqueKey(), m[u] = f = y.createElement(e).attr(c).add(y.defs), f.radAttr = q, f.stops = [], l(d, function (b) {
                            0 === b[1].indexOf("rgba") ? (M = a.color(b[1]),
                                n = M.get("rgb"), K = M.get("a")) : (n = b[1], K = 1); b = y.createElement("stop").attr({ offset: b[0], "stop-color": n, "stop-opacity": K }).add(f); f.stops.push(b)
                        })), O = "url(" + y.url + "#" + C + ")", k.setAttribute(h, O), k.gradient = u, b.toString = function () { return O })
                    })
                }, applyTextOutline: function (h) {
                    var k = this.element, y, M, e, c, q; -1 !== h.indexOf("contrast") && (h = h.replace(/contrast/g, this.renderer.getContrast(k.style.fill))); h = h.split(" "); M = h[h.length - 1]; if ((e = h[0]) && "none" !== e && a.svg) {
                        this.fakeTS = !0; h = [].slice.call(k.getElementsByTagName("tspan"));
                        this.ySetter = this.xSetter; e = e.replace(/(^[\d\.]+)(.*?)$/g, function (a, b, h) { return 2 * b + h }); for (q = h.length; q--;)y = h[q], "highcharts-text-outline" === y.getAttribute("class") && b(h, k.removeChild(y)); c = k.firstChild; l(h, function (a, b) { 0 === b && (a.setAttribute("x", k.getAttribute("x")), b = k.getAttribute("y"), a.setAttribute("y", b || 0), null === b && k.setAttribute("y", 0)); a = a.cloneNode(1); g(a, { "class": "highcharts-text-outline", fill: M, stroke: M, "stroke-width": e, "stroke-linejoin": "round" }); k.insertBefore(a, c) })
                    }
                }, attr: function (a,
                    b, h, k) { var y, e = this.element, M, c = this, q, m; "string" === typeof a && void 0 !== b && (y = a, a = {}, a[y] = b); "string" === typeof a ? c = (this[a + "Getter"] || this._defaultGetter).call(this, a, e) : (J(a, function (b, h) { q = !1; k || K(this, h); this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)$/.test(h) && (M || (this.symbolAttr(a), M = !0), q = !0); !this.rotation || "x" !== h && "y" !== h || (this.doTransform = !0); q || (m = this[h + "Setter"] || this._defaultSetter, m.call(this, b, h, e)) }, this), this.afterSetters()); h && h.call(this); return c }, afterSetters: function () {
                        this.doTransform &&
                            (this.updateTransform(), this.doTransform = !1)
                    }, addClass: function (a, b) { var h = this.attr("class") || ""; -1 === h.indexOf(a) && (b || (a = (h + (h ? " " : "") + a).replace("  ", " ")), this.attr("class", a)); return this }, hasClass: function (a) { return -1 !== D(a, (this.attr("class") || "").split(" ")) }, removeClass: function (a) { return this.attr("class", (this.attr("class") || "").replace(a, "")) }, symbolAttr: function (a) {
                        var b = this; l("x y r start end width height innerR anchorX anchorY".split(" "), function (h) { b[h] = k(a[h], b[h]) }); b.attr({
                            d: b.renderer.symbols[b.symbolName](b.x,
                                b.y, b.width, b.height, b)
                        })
                    }, clip: function (a) { return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : "none") }, crisp: function (a, b) { var h; b = b || a.strokeWidth || 0; h = Math.round(b) % 2 / 2; a.x = Math.floor(a.x || this.x || 0) + h; a.y = Math.floor(a.y || this.y || 0) + h; a.width = Math.floor((a.width || this.width || 0) - 2 * h); a.height = Math.floor((a.height || this.height || 0) - 2 * h); r(a.strokeWidth) && (a.strokeWidth = b); return a }, css: function (a) {
                        var b = this.styles, h = {}, k = this.element, e, c = "", M, q = !b, f = ["textOutline", "textOverflow",
                            "width"]; a && a.color && (a.fill = a.color); b && J(a, function (a, k) { a !== b[k] && (h[k] = a, q = !0) }); q && (b && (a = m(b, h)), a && (null === a.width || "auto" === a.width ? delete this.textWidth : "text" === k.nodeName.toLowerCase() && a.width && (e = this.textWidth = y(a.width))), this.styles = a, e && !T && this.renderer.forExport && delete a.width, k.namespaceURI === this.SVG_NS ? (M = function (a, b) { return "-" + b.toLowerCase() }, J(a, function (a, b) { -1 === D(b, f) && (c += b.replace(/([A-Z])/g, M) + ":" + a + ";") }), c && g(k, "style", c)) : x(k, a), this.added && ("text" === this.element.nodeName &&
                                this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline))); return this
                    }, getStyle: function (a) { return N.getComputedStyle(this.element || this, "").getPropertyValue(a) }, strokeWidth: function () { var a = this.getStyle("stroke-width"), b; a.indexOf("px") === a.length - 2 ? a = y(a) : (b = u.createElementNS(R, "rect"), g(b, { width: a, "stroke-width": 0 }), this.element.parentNode.appendChild(b), a = b.getBBox().width, b.parentNode.removeChild(b)); return a }, on: function (a, b) {
                        var h = this, k = h.element; e && "click" ===
                            a ? (k.ontouchstart = function (a) { h.touchEventFired = Date.now(); a.preventDefault(); b.call(k, a) }, k.onclick = function (a) { (-1 === N.navigator.userAgent.indexOf("Android") || 1100 < Date.now() - (h.touchEventFired || 0)) && b.call(k, a) }) : k["on" + a] = b; return this
                    }, setRadialReference: function (a) { var b = this.renderer.gradients[this.element.gradient]; this.element.radialReference = a; b && b.radAttr && b.animate(this.renderer.getRadialAttr(a, b.radAttr)); return this }, translate: function (a, b) { return this.attr({ translateX: a, translateY: b }) },
                invert: function (a) { this.inverted = a; this.updateTransform(); return this }, updateTransform: function () {
                    var a = this.translateX || 0, b = this.translateY || 0, h = this.scaleX, y = this.scaleY, e = this.inverted, c = this.rotation, q = this.matrix, m = this.element; e && (a += this.width, b += this.height); a = ["translate(" + a + "," + b + ")"]; r(q) && a.push("matrix(" + q.join(",") + ")"); e ? a.push("rotate(90) scale(-1,1)") : c && a.push("rotate(" + c + " " + k(this.rotationOriginX, m.getAttribute("x"), 0) + " " + k(this.rotationOriginY, m.getAttribute("y") || 0) + ")"); (r(h) ||
                        r(y)) && a.push("scale(" + k(h, 1) + " " + k(y, 1) + ")"); a.length && m.setAttribute("transform", a.join(" "))
                }, toFront: function () { var a = this.element; a.parentNode.appendChild(a); return this }, align: function (a, h, y) {
                    var e, c, m, M, f = {}; c = this.renderer; m = c.alignedObjects; var d, l; if (a) { if (this.alignOptions = a, this.alignByTranslate = h, !y || q(y)) this.alignTo = e = y || "renderer", b(m, this), m.push(this), y = null } else a = this.alignOptions, h = this.alignByTranslate, e = this.alignTo; y = k(y, c[e], c); e = a.align; c = a.verticalAlign; m = (y.x || 0) + (a.x ||
                        0); M = (y.y || 0) + (a.y || 0); "right" === e ? d = 1 : "center" === e && (d = 2); d && (m += (y.width - (a.width || 0)) / d); f[h ? "translateX" : "x"] = Math.round(m); "bottom" === c ? l = 1 : "middle" === c && (l = 2); l && (M += (y.height - (a.height || 0)) / l); f[h ? "translateY" : "y"] = Math.round(M); this[this.placed ? "animate" : "attr"](f); this.placed = !0; this.alignAttr = f; return this
                }, getBBox: function (a, b) {
                    var h, y = this.renderer, e, c = this.element, q = this.styles, M, d = this.textStr, n, K = y.cache, D = y.cacheKeys, C = c.namespaceURI === this.SVG_NS, G; b = k(b, this.rotation); e = b * f; M = c &&
                        B.prototype.getStyle.call(c, "font-size"); r(d) && (G = d.toString(), -1 === G.indexOf("\x3c") && (G = G.replace(/[0-9]/g, "0")), G += ["", b || 0, M, this.textWidth, q && q.textOverflow].join()); G && !a && (h = K[G]); if (!h) {
                            if (C || y.forExport) { try { (n = this.fakeTS && function (a) { l(c.querySelectorAll(".highcharts-text-outline"), function (b) { b.style.display = a }) }) && n("none"), h = c.getBBox ? m({}, c.getBBox()) : { width: c.offsetWidth, height: c.offsetHeight }, n && n("") } catch (X) { } if (!h || 0 > h.width) h = { width: 0, height: 0 } } else h = this.htmlGetBBox(); y.isSVG &&
                                (a = h.width, y = h.height, C && (h.height = y = { "11px,17": 14, "13px,20": 16 }[q && q.fontSize + "," + Math.round(y)] || y), b && (h.width = Math.abs(y * Math.sin(e)) + Math.abs(a * Math.cos(e)), h.height = Math.abs(y * Math.cos(e)) + Math.abs(a * Math.sin(e)))); if (G && 0 < h.height) { for (; 250 < D.length;)delete K[D.shift()]; K[G] || D.push(G); K[G] = h }
                        } return h
                }, show: function (a) { return this.attr({ visibility: a ? "inherit" : "visible" }) }, hide: function () { return this.attr({ visibility: "hidden" }) }, fadeOut: function (a) {
                    var b = this; b.animate({ opacity: 0 }, {
                        duration: a ||
                            150, complete: function () { b.attr({ y: -9999 }) }
                    })
                }, add: function (a) { var b = this.renderer, h = this.element, k; a && (this.parentGroup = a); this.parentInverted = a && a.inverted; void 0 !== this.textStr && b.buildText(this); this.added = !0; if (!a || a.handleZ || this.zIndex) k = this.zIndexSetter(); k || (a ? a.element : b.box).appendChild(h); if (this.onAdd) this.onAdd(); return this }, safeRemoveChild: function (a) { var b = a.parentNode; b && b.removeChild(a) }, destroy: function () {
                    var a = this, h = a.element || {}, k = a.renderer.isSVG && "SPAN" === h.nodeName && a.parentGroup,
                        y = h.ownerSVGElement, e = a.clipPath; h.onclick = h.onmouseout = h.onmouseover = h.onmousemove = h.point = null; K(a); e && y && (l(y.querySelectorAll("[clip-path],[CLIP-PATH]"), function (a) { var b = a.getAttribute("clip-path"), h = e.element.id; (-1 < b.indexOf("(#" + h + ")") || -1 < b.indexOf('("#' + h + '")')) && a.removeAttribute("clip-path") }), a.clipPath = e.destroy()); if (a.stops) { for (y = 0; y < a.stops.length; y++)a.stops[y] = a.stops[y].destroy(); a.stops = null } for (a.safeRemoveChild(h); k && k.div && 0 === k.div.childNodes.length;)h = k.parentGroup, a.safeRemoveChild(k.div),
                            delete k.div, k = h; a.alignTo && b(a.renderer.alignedObjects, a); J(a, function (b, h) { delete a[h] }); return null
                }, xGetter: function (a) { "circle" === this.element.nodeName && ("x" === a ? a = "cx" : "y" === a && (a = "cy")); return this._defaultGetter(a) }, _defaultGetter: function (a) { a = k(this[a + "Value"], this[a], this.element ? this.element.getAttribute(a) : null, 0); /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a)); return a }, dSetter: function (a, b, h) {
                    a && a.join && (a = a.join(" ")); /(NaN| {2}|^$)/.test(a) && (a = "M 0 0"); this[b] !== a && (h.setAttribute(b, a),
                        this[b] = a)
                }, alignSetter: function (a) { this.alignValue = a; this.element.setAttribute("text-anchor", { left: "start", center: "middle", right: "end" }[a]) }, opacitySetter: function (a, b, h) { this[b] = a; h.setAttribute(b, a) }, titleSetter: function (a) {
                    var b = this.element.getElementsByTagName("title")[0]; b || (b = u.createElementNS(this.SVG_NS, "title"), this.element.appendChild(b)); b.firstChild && b.removeChild(b.firstChild); b.appendChild(u.createTextNode(String(k(a), "").replace(/<[^>]*>/g, "").replace(/&lt;/g, "\x3c").replace(/&gt;/g,
                        "\x3e")))
                }, textSetter: function (a) { a !== this.textStr && (delete this.bBox, this.textStr = a, this.added && this.renderer.buildText(this)) }, fillSetter: function (a, b, h) { "string" === typeof a ? h.setAttribute(b, a) : a && this.complexColor(a, b, h) }, visibilitySetter: function (a, b, h) { "inherit" === a ? h.removeAttribute(b) : this[b] !== a && h.setAttribute(b, a); this[b] = a }, zIndexSetter: function (a, b) {
                    var h = this.renderer, k = this.parentGroup, e = (k || h).element || h.box, c, q = this.element, m, f, h = e === h.box; c = this.added; var d; r(a) ? (q.setAttribute("data-z-index",
                        a), a = +a, this[b] === a && (c = !1)) : r(this[b]) && q.removeAttribute("data-z-index"); this[b] = a; if (c) { (a = this.zIndex) && k && (k.handleZ = !0); b = e.childNodes; for (d = b.length - 1; 0 <= d && !m; d--)if (k = b[d], c = k.getAttribute("data-z-index"), f = !r(c), k !== q) if (0 > a && f && !h && !d) e.insertBefore(q, b[d]), m = !0; else if (y(c) <= a || f && (!r(a) || 0 <= a)) e.insertBefore(q, b[d + 1] || null), m = !0; m || (e.insertBefore(q, b[h ? 3 : 0] || null), m = !0) } return m
                }, _defaultSetter: function (a, b, h) { h.setAttribute(b, a) }
            }); B.prototype.yGetter = B.prototype.xGetter; B.prototype.translateXSetter =
                B.prototype.translateYSetter = B.prototype.rotationSetter = B.prototype.verticalAlignSetter = B.prototype.rotationOriginXSetter = B.prototype.rotationOriginYSetter = B.prototype.scaleXSetter = B.prototype.scaleYSetter = B.prototype.matrixSetter = function (a, b) { this[b] = a; this.doTransform = !0 }; E = a.SVGRenderer = function () { this.init.apply(this, arguments) }; m(E.prototype, {
                    Element: B, SVG_NS: R, init: function (a, b, h, k, y, e) {
                        var c; k = this.createElement("svg").attr({ version: "1.1", "class": "highcharts-root" }); c = k.element; a.appendChild(c);
                        g(a, "dir", "ltr"); -1 === a.innerHTML.indexOf("xmlns") && g(c, "xmlns", this.SVG_NS); this.isSVG = !0; this.box = c; this.boxWrapper = k; this.alignedObjects = []; this.url = (H || C) && u.getElementsByTagName("base").length ? N.location.href.split("#")[0].replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : ""; this.createElement("desc").add().element.appendChild(u.createTextNode("Created with Highcharts 6.2.0")); this.defs = this.createElement("defs").add(); this.allowHTML = e; this.forExport = y; this.gradients = {};
                        this.cache = {}; this.cacheKeys = []; this.imgCount = 0; this.setSize(b, h, !1); var q; H && a.getBoundingClientRect && (b = function () { x(a, { left: 0, top: 0 }); q = a.getBoundingClientRect(); x(a, { left: Math.ceil(q.left) - q.left + "px", top: Math.ceil(q.top) - q.top + "px" }) }, b(), this.unSubPixelFix = F(N, "resize", b))
                    }, definition: function (a) {
                        function b(a, y) {
                            var e; l(h(a), function (a) {
                                var h = k.createElement(a.tagName), c = {}; J(a, function (a, b) { "tagName" !== b && "children" !== b && "textContent" !== b && (c[b] = a) }); h.attr(c); h.add(y || k.defs); a.textContent &&
                                    h.element.appendChild(u.createTextNode(a.textContent)); b(a.children || [], h); e = h
                            }); return e
                        } var k = this; return b(a)
                    }, isHidden: function () { return !this.boxWrapper.getBBox().width }, destroy: function () { var a = this.defs; this.box = null; this.boxWrapper = this.boxWrapper.destroy(); c(this.gradients || {}); this.gradients = null; a && (this.defs = a.destroy()); this.unSubPixelFix && this.unSubPixelFix(); return this.alignedObjects = null }, createElement: function (a) { var b = new this.Element; b.init(this, a); return b }, draw: I, getRadialAttr: function (a,
                        b) { return { cx: a[0] - a[2] / 2 + b.cx * a[2], cy: a[1] - a[2] / 2 + b.cy * a[2], r: b.r * a[2] } }, truncate: function (a, b, h, k, y, e, c) {
                            var q = this, m = a.rotation, f, d = k ? 1 : 0, l = (h || k).length, n = l, K = [], G = function (a) { b.firstChild && b.removeChild(b.firstChild); a && b.appendChild(u.createTextNode(a)) }, D = function (e, m) { m = m || e; if (void 0 === K[m]) if (b.getSubStringLength) try { K[m] = y + b.getSubStringLength(0, k ? m + 1 : m) } catch (Y) { } else q.getSpanWidth && (G(c(h || k, e)), K[m] = y + q.getSpanWidth(a, b)); return K[m] }, C, w; a.rotation = 0; C = D(b.textContent.length); if (w =
                                y + C > e) { for (; d <= l;)n = Math.ceil((d + l) / 2), k && (f = c(k, n)), C = D(n, f && f.length - 1), d === l ? d = l + 1 : C > e ? l = n - 1 : d = n; 0 === l ? G("") : h && l === h.length - 1 || G(f || c(h || k, n)) } k && k.splice(0, n); a.actualWidth = C; a.rotation = m; return w
                        }, escapes: { "\x26": "\x26amp;", "\x3c": "\x26lt;", "\x3e": "\x26gt;", "'": "\x26#39;", '"': "\x26quot;" }, buildText: function (a) {
                            var b = a.element, h = this, e = h.forExport, c = k(a.textStr, "").toString(), q = -1 !== c.indexOf("\x3c"), m = b.childNodes, f, d = g(b, "x"), K = a.styles, G = a.textWidth, C = K && K.lineHeight, w = K && K.textOutline, O =
                                K && "ellipsis" === K.textOverflow, z = K && "nowrap" === K.whiteSpace, r = K && K.fontSize, A, I, H = m.length, K = G && !a.added && this.box, M = function (a) { return C ? y(C) : h.fontMetrics(void 0, a.getAttribute("style") ? a : b).h }, v = function (a, b) { J(h.escapes, function (h, k) { b && -1 !== D(h, b) || (a = a.toString().replace(new RegExp(h, "g"), k)) }); return a }, t = function (a, b) {
                                    var h; h = a.indexOf("\x3c"); a = a.substring(h, a.indexOf("\x3e") - h); h = a.indexOf(b + "\x3d"); if (-1 !== h && (h = h + b.length + 1, b = a.charAt(h), '"' === b || "'" === b)) return a = a.substring(h + 1), a.substring(0,
                                        a.indexOf(b))
                                }; A = [c, O, z, C, w, r, G].join(); if (A !== a.textCache) {
                                    for (a.textCache = A; H--;)b.removeChild(m[H]); q || w || O || G || -1 !== c.indexOf(" ") ? (K && K.appendChild(b), c = q ? c.replace(/<(b|strong)>/g, '\x3cspan class\x3d"highcharts-strong"\x3e').replace(/<(i|em)>/g, '\x3cspan class\x3d"highcharts-emphasized"\x3e').replace(/<a/g, "\x3cspan").replace(/<\/(b|strong|i|em|a)>/g, "\x3c/span\x3e").split(/<br.*?>/g) : [c], c = n(c, function (a) { return "" !== a }), l(c, function (k, y) {
                                        var c, q = 0, m = 0; k = k.replace(/^\s+|\s+$/g, "").replace(/<span/g,
                                            "|||\x3cspan").replace(/<\/span>/g, "\x3c/span\x3e|||"); c = k.split("|||"); l(c, function (k) {
                                                if ("" !== k || 1 === c.length) {
                                                    var K = {}, l = u.createElementNS(h.SVG_NS, "tspan"), n, C; (n = t(k, "class")) && g(l, "class", n); if (n = t(k, "style")) n = n.replace(/(;| |^)color([ :])/, "$1fill$2"), g(l, "style", n); (C = t(k, "href")) && !e && (g(l, "onclick", 'location.href\x3d"' + C + '"'), g(l, "class", "highcharts-anchor")); k = v(k.replace(/<[a-zA-Z\/](.|\n)*?>/g, "") || " "); if (" " !== k) {
                                                        l.appendChild(u.createTextNode(k)); q ? K.dx = 0 : y && null !== d && (K.x = d); g(l,
                                                            K); b.appendChild(l); !q && I && (!T && e && x(l, { display: "block" }), g(l, "dy", M(l))); if (G) {
                                                                var D = k.replace(/([^\^])-/g, "$1- ").split(" "), K = !z && (1 < c.length || y || 1 < D.length); C = 0; var w = M(l); if (O) f = h.truncate(a, l, k, void 0, 0, Math.max(0, G - parseInt(r || 12, 10)), function (a, b) { return a.substring(0, b) + "\u2026" }); else if (K) for (; D.length;)D.length && !z && 0 < C && (l = u.createElementNS(R, "tspan"), g(l, { dy: w, x: d }), n && g(l, "style", n), l.appendChild(u.createTextNode(D.join(" ").replace(/- /g, "-"))), b.appendChild(l)), h.truncate(a, l, null,
                                                                    D, 0 === C ? m : 0, G, function (a, b) { return D.slice(0, b).join(" ").replace(/- /g, "-") }), m = a.actualWidth, C++
                                                            } q++
                                                    }
                                                }
                                            }); I = I || b.childNodes.length
                                    }), O && f && a.attr("title", v(a.textStr, ["\x26lt;", "\x26gt;"])), K && K.removeChild(b), w && a.applyTextOutline && a.applyTextOutline(w)) : b.appendChild(u.createTextNode(v(c)))
                                }
                        }, getContrast: function (a) { a = t(a).rgba; a[0] *= 1; a[1] *= 1.2; a[2] *= .5; return 459 < a[0] + a[1] + a[2] ? "#000000" : "#FFFFFF" }, button: function (a, b, h, k, y, e, c, q, m) {
                            var f = this.label(a, b, h, m, null, null, null, null, "button"), d = 0;
                            f.attr(G({ padding: 8, r: 2 }, y)); F(f.element, A ? "mouseover" : "mouseenter", function () { 3 !== d && f.setState(1) }); F(f.element, A ? "mouseout" : "mouseleave", function () { 3 !== d && f.setState(d) }); f.setState = function (a) { 1 !== a && (f.state = d = a); f.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0]) }; return f.on("click", function (a) { 3 !== d && k.call(f, a) })
                        }, crispLine: function (a, b) {
                            a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - b % 2 / 2); a[2] === a[5] &&
                                (a[2] = a[5] = Math.round(a[2]) + b % 2 / 2); return a
                        }, path: function (a) { var b = {}; w(a) ? b.d = a : z(a) && m(b, a); return this.createElement("path").attr(b) }, circle: function (a, b, h) { a = z(a) ? a : { x: a, y: b, r: h }; b = this.createElement("circle"); b.xSetter = b.ySetter = function (a, b, h) { h.setAttribute("c" + b, a) }; return b.attr(a) }, arc: function (a, b, h, k, y, e) { z(a) ? (k = a, b = k.y, h = k.r, a = k.x) : k = { innerR: k, start: y, end: e }; a = this.symbol("arc", a, b, h, h, k); a.r = h; return a }, rect: function (a, b, h, k, y, e) {
                            y = z(a) ? a.r : y; e = this.createElement("rect"); a = z(a) ? a :
                                void 0 === a ? {} : { x: a, y: b, width: Math.max(h, 0), height: Math.max(k, 0) }; y && (a.r = y); e.rSetter = function (a, b, h) { g(h, { rx: a, ry: a }) }; return e.attr(a)
                        }, setSize: function (a, b, h) { var y = this.alignedObjects, e = y.length; this.width = a; this.height = b; for (this.boxWrapper.animate({ width: a, height: b }, { step: function () { this.attr({ viewBox: "0 0 " + this.attr("width") + " " + this.attr("height") }) }, duration: k(h, !0) ? void 0 : 0 }); e--;)y[e].align() }, g: function (a) { var b = this.createElement("g"); return a ? b.attr({ "class": "highcharts-" + a }) : b }, image: function (a,
                            b, h, k, y, e) { var c = { preserveAspectRatio: "none" }, q, f = function (a, b) { a.setAttributeNS ? a.setAttributeNS("http://www.w3.org/1999/xlink", "href", b) : a.setAttribute("hc-svg-href", b) }, d = function (b) { f(q.element, a); e.call(q, b) }; 1 < arguments.length && m(c, { x: b, y: h, width: k, height: y }); q = this.createElement("image").attr(c); e ? (f(q.element, "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw\x3d\x3d"), c = new N.Image, F(c, "load", d), c.src = a, c.complete && d({})) : f(q.element, a); return q }, symbol: function (a,
                                b, h, y, e, c) {
                                var q = this, f, K = /^url\((.*?)\)$/, n = K.test(a), C = !n && (this.symbols[a] ? a : "circle"), G = C && this.symbols[C], D = r(b) && G && G.call(this.symbols, Math.round(b), Math.round(h), y, e, c), w, O; G ? (f = this.path(D), m(f, { symbolName: C, x: b, y: h, width: y, height: e }), c && m(f, c)) : n && (w = a.match(K)[1], f = this.image(w), f.imgwidth = k(Q[w] && Q[w].width, c && c.width), f.imgheight = k(Q[w] && Q[w].height, c && c.height), O = function () { f.attr({ width: f.width, height: f.height }) }, l(["width", "height"], function (a) {
                                    f[a + "Setter"] = function (a, b) {
                                        var h = {},
                                            k = this["img" + b], y = "width" === b ? "translateX" : "translateY"; this[b] = a; r(k) && (this.element && this.element.setAttribute(b, k), this.alignByTranslate || (h[y] = ((this[b] || 0) - k) / 2, this.attr(h)))
                                    }
                                }), r(b) && f.attr({ x: b, y: h }), f.isImg = !0, r(f.imgwidth) && r(f.imgheight) ? O() : (f.attr({ width: 0, height: 0 }), v("img", {
                                    onload: function () {
                                        var a = d[q.chartIndex]; 0 === this.width && (x(this, { position: "absolute", top: "-999em" }), u.body.appendChild(this)); Q[w] = { width: this.width, height: this.height }; f.imgwidth = this.width; f.imgheight = this.height;
                                        f.element && O(); this.parentNode && this.parentNode.removeChild(this); q.imgCount--; if (!q.imgCount && a && a.onload) a.onload()
                                    }, src: w
                                }), this.imgCount++)); return f
                            }, symbols: {
                                circle: function (a, b, h, k) { return this.arc(a + h / 2, b + k / 2, h / 2, k / 2, { start: 0, end: 2 * Math.PI, open: !1 }) }, square: function (a, b, h, k) { return ["M", a, b, "L", a + h, b, a + h, b + k, a, b + k, "Z"] }, triangle: function (a, b, h, k) { return ["M", a + h / 2, b, "L", a + h, b + k, a, b + k, "Z"] }, "triangle-down": function (a, b, h, k) { return ["M", a, b, "L", a + h, b, a + h / 2, b + k, "Z"] }, diamond: function (a, b, h, k) {
                                    return ["M",
                                        a + h / 2, b, "L", a + h, b + k / 2, a + h / 2, b + k, a, b + k / 2, "Z"]
                                }, arc: function (a, b, h, y, e) { var c = e.start, q = e.r || h, f = e.r || y || h, m = e.end - .001; h = e.innerR; y = k(e.open, .001 > Math.abs(e.end - e.start - 2 * Math.PI)); var d = Math.cos(c), l = Math.sin(c), K = Math.cos(m), m = Math.sin(m); e = .001 > e.end - c - Math.PI ? 0 : 1; q = ["M", a + q * d, b + f * l, "A", q, f, 0, e, 1, a + q * K, b + f * m]; r(h) && q.push(y ? "M" : "L", a + h * K, b + h * m, "A", h, h, 0, e, 0, a + h * d, b + h * l); q.push(y ? "" : "Z"); return q }, callout: function (a, b, h, k, y) {
                                    var e = Math.min(y && y.r || 0, h, k), c = e + 6, q = y && y.anchorX; y = y && y.anchorY; var f;
                                    f = ["M", a + e, b, "L", a + h - e, b, "C", a + h, b, a + h, b, a + h, b + e, "L", a + h, b + k - e, "C", a + h, b + k, a + h, b + k, a + h - e, b + k, "L", a + e, b + k, "C", a, b + k, a, b + k, a, b + k - e, "L", a, b + e, "C", a, b, a, b, a + e, b]; q && q > h ? y > b + c && y < b + k - c ? f.splice(13, 3, "L", a + h, y - 6, a + h + 6, y, a + h, y + 6, a + h, b + k - e) : f.splice(13, 3, "L", a + h, k / 2, q, y, a + h, k / 2, a + h, b + k - e) : q && 0 > q ? y > b + c && y < b + k - c ? f.splice(33, 3, "L", a, y + 6, a - 6, y, a, y - 6, a, b + e) : f.splice(33, 3, "L", a, k / 2, q, y, a, k / 2, a, b + e) : y && y > k && q > a + c && q < a + h - c ? f.splice(23, 3, "L", q + 6, b + k, q, b + k + 6, q - 6, b + k, a + e, b + k) : y && 0 > y && q > a + c && q < a + h - c && f.splice(3, 3, "L",
                                        q - 6, b, q, b - 6, q + 6, b, h - e, b); return f
                                }
                            }, clipRect: function (b, h, k, y) { var e = a.uniqueKey(), c = this.createElement("clipPath").attr({ id: e }).add(this.defs); b = this.rect(b, h, k, y, 0).add(c); b.id = e; b.clipPath = c; b.count = 0; return b }, text: function (a, b, h, k) {
                                var y = {}; if (k && (this.allowHTML || !this.forExport)) return this.html(a, b, h); y.x = Math.round(b || 0); h && (y.y = Math.round(h)); r(a) && (y.text = a); a = this.createElement("text").attr(y); k || (a.xSetter = function (a, b, h) {
                                    var k = h.getElementsByTagName("tspan"), y, e = h.getAttribute(b), c; for (c =
                                        0; c < k.length; c++)y = k[c], y.getAttribute(b) === e && y.setAttribute(b, a); h.setAttribute(b, a)
                                }); return a
                            }, fontMetrics: function (a, b) { a = b && B.prototype.getStyle.call(b, "font-size"); a = /px/.test(a) ? y(a) : /em/.test(a) ? parseFloat(a) * (b ? this.fontMetrics(null, b.parentNode).f : 16) : 12; b = 24 > a ? a + 3 : Math.round(1.2 * a); return { h: b, b: Math.round(.8 * b), f: a } }, rotCorr: function (a, b, h) { var k = a; b && h && (k = Math.max(k * Math.cos(b * f), 4)); return { x: -a / 3 * Math.sin(b * f), y: k } }, label: function (b, h, k, y, e, c, q, f, d) {
                                var K = this, n = K.g("button" !== d && "label"),
                                    C = n.text = K.text("", 0, 0, q).attr({ zIndex: 1 }), D, w, u = 0, z = 3, g = 0, A, I, T, x, H, v = {}, J, R = /^url\((.*?)\)$/.test(y), t = R, p, Q, N, M; d && n.addClass("highcharts-" + d); t = !0; p = function () { return D.strokeWidth() % 2 / 2 }; Q = function () {
                                        var a = C.element.style, b = {}; w = (void 0 === A || void 0 === I || H) && r(C.textStr) && C.getBBox(); n.width = (A || w.width || 0) + 2 * z + g; n.height = (I || w.height || 0) + 2 * z; J = z + K.fontMetrics(a && a.fontSize, C).b; t && (D || (n.box = D = K.symbols[y] || R ? K.symbol(y) : K.rect(), D.addClass(("button" === d ? "" : "highcharts-label-box") + (d ? " highcharts-" +
                                            d + "-box" : "")), D.add(n), a = p(), b.x = a, b.y = (f ? -J : 0) + a), b.width = Math.round(n.width), b.height = Math.round(n.height), D.attr(m(b, v)), v = {})
                                    }; N = function () { var a = g + z, b; b = f ? 0 : J; r(A) && w && ("center" === H || "right" === H) && (a += { center: .5, right: 1 }[H] * (A - w.width)); if (a !== C.x || b !== C.y) C.attr("x", a), C.hasBoxWidthChanged && (w = C.getBBox(!0), Q()), void 0 !== b && C.attr("y", b); C.x = a; C.y = b }; M = function (a, b) { D ? D.attr(a, b) : v[a] = b }; n.onAdd = function () { C.add(n); n.attr({ text: b || 0 === b ? b : "", x: h, y: k }); D && r(e) && n.attr({ anchorX: e, anchorY: c }) };
                                n.widthSetter = function (b) { A = a.isNumber(b) ? b : null }; n.heightSetter = function (a) { I = a }; n["text-alignSetter"] = function (a) { H = a }; n.paddingSetter = function (a) { r(a) && a !== z && (z = n.padding = a, N()) }; n.paddingLeftSetter = function (a) { r(a) && a !== g && (g = a, N()) }; n.alignSetter = function (a) { a = { left: 0, center: .5, right: 1 }[a]; a !== u && (u = a, w && n.attr({ x: T })) }; n.textSetter = function (a) { void 0 !== a && C.textSetter(a); Q(); N() }; n["stroke-widthSetter"] = function (a, b) { a && (t = !0); this["stroke-width"] = a; M(b, a) }; n.rSetter = function (a, b) { M(b, a) };
                                n.anchorXSetter = function (a, b) { e = n.anchorX = a; M(b, Math.round(a) - p() - T) }; n.anchorYSetter = function (a, b) { c = n.anchorY = a; M(b, a - x) }; n.xSetter = function (a) { n.x = a; u && (a -= u * ((A || w.width) + 2 * z), n["forceAnimate:x"] = !0); T = Math.round(a); n.attr("translateX", T) }; n.ySetter = function (a) { x = n.y = Math.round(a); n.attr("translateY", x) }; var V = n.css; return m(n, {
                                    css: function (a) { if (a) { var b = {}; a = G(a); l(n.textProps, function (h) { void 0 !== a[h] && (b[h] = a[h], delete a[h]) }); C.css(b); "width" in b && Q() } return V.call(n, a) }, getBBox: function () {
                                        return {
                                            width: w.width +
                                                2 * z, height: w.height + 2 * z, x: w.x - z, y: w.y - z
                                        }
                                    }, destroy: function () { O(n.element, "mouseenter"); O(n.element, "mouseleave"); C && (C = C.destroy()); D && (D = D.destroy()); B.prototype.destroy.call(n); n = K = Q = N = M = null }
                                })
                            }
                }); a.Renderer = E
    })(L); (function (a) {
        var B = a.attr, E = a.createElement, F = a.css, p = a.defined, g = a.each, d = a.extend, t = a.isFirefox, x = a.isMS, v = a.isWebKit, r = a.pick, f = a.pInt, c = a.SVGRenderer, u = a.win, l = a.wrap; d(a.SVGElement.prototype, {
            htmlCss: function (a) {
                var b = "SPAN" === this.element.tagName && a && "width" in a, c = r(b && a.width,
                    void 0); b && (delete a.width, this.textWidth = c, this.htmlUpdateTransform()); a && "ellipsis" === a.textOverflow && (a.whiteSpace = "nowrap", a.overflow = "hidden"); this.styles = d(this.styles, a); F(this.element, a); return this
            }, htmlGetBBox: function () { var a = this.element; return { x: a.offsetLeft, y: a.offsetTop, width: a.offsetWidth, height: a.offsetHeight } }, htmlUpdateTransform: function () {
                if (this.added) {
                    var a = this.renderer, b = this.element, c = this.x || 0, e = this.y || 0, d = this.textAlign || "left", l = { left: 0, center: .5, right: 1 }[d], u = this.styles,
                        r = u && u.whiteSpace; F(b, { marginLeft: this.translateX || 0, marginTop: this.translateY || 0 }); this.inverted && g(b.childNodes, function (e) { a.invertChild(e, b) }); if ("SPAN" === b.tagName) {
                            var u = this.rotation, z = this.textWidth && f(this.textWidth), q = [u, d, b.innerHTML, this.textWidth, this.textAlign].join(), C; (C = z !== this.oldTextWidth) && !(C = z > this.oldTextWidth) && ((C = this.textPxLength) || (F(b, { width: "", whiteSpace: r || "nowrap" }), C = b.offsetWidth), C = C > z); C && /[ \-]/.test(b.textContent || b.innerText) ? (F(b, {
                                width: z + "px", display: "block",
                                whiteSpace: r || "normal"
                            }), this.oldTextWidth = z, this.hasBoxWidthChanged = !0) : this.hasBoxWidthChanged = !1; q !== this.cTT && (r = a.fontMetrics(b.style.fontSize).b, !p(u) || u === (this.oldRotation || 0) && d === this.oldAlign || this.setSpanRotation(u, l, r), this.getSpanCorrection(!p(u) && this.textPxLength || b.offsetWidth, r, l, u, d)); F(b, { left: c + (this.xCorr || 0) + "px", top: e + (this.yCorr || 0) + "px" }); this.cTT = q; this.oldRotation = u; this.oldAlign = d
                        }
                } else this.alignOnAdd = !0
            }, setSpanRotation: function (a, b, c) {
                var e = {}, f = this.renderer.getTransformKey();
                e[f] = e.transform = "rotate(" + a + "deg)"; e[f + (t ? "Origin" : "-origin")] = e.transformOrigin = 100 * b + "% " + c + "px"; F(this.element, e)
            }, getSpanCorrection: function (a, b, c) { this.xCorr = -a * c; this.yCorr = -b }
        }); d(c.prototype, {
            getTransformKey: function () { return x && !/Edge/.test(u.navigator.userAgent) ? "-ms-transform" : v ? "-webkit-transform" : t ? "MozTransform" : u.opera ? "-o-transform" : "" }, html: function (a, b, c) {
                var e = this.createElement("span"), f = e.element, n = e.renderer, m = n.isSVG, u = function (a, b) {
                    g(["opacity", "visibility"], function (e) {
                        l(a,
                            e + "Setter", function (a, e, c, k) { a.call(this, e, c, k); b[c] = e })
                    }); a.addedSetters = !0
                }; e.textSetter = function (a) { a !== f.innerHTML && delete this.bBox; this.textStr = a; f.innerHTML = r(a, ""); e.doTransform = !0 }; m && u(e, e.element.style); e.xSetter = e.ySetter = e.alignSetter = e.rotationSetter = function (a, b) { "align" === b && (b = "textAlign"); e[b] = a; e.doTransform = !0 }; e.afterSetters = function () { this.doTransform && (this.htmlUpdateTransform(), this.doTransform = !1) }; e.attr({ text: a, x: Math.round(b), y: Math.round(c) }).css({ position: "absolute" });
                f.style.whiteSpace = "nowrap"; e.css = e.htmlCss; m && (e.add = function (a) {
                    var b, c = n.box.parentNode, m = []; if (this.parentGroup = a) {
                        if (b = a.div, !b) {
                            for (; a;)m.push(a), a = a.parentGroup; g(m.reverse(), function (a) {
                                function q(b, h) { a[h] = b; "translateX" === h ? k.left = b + "px" : k.top = b + "px"; a.doTransform = !0 } var k, y = B(a.element, "class"); y && (y = { className: y }); b = a.div = a.div || E("div", y, { position: "absolute", left: (a.translateX || 0) + "px", top: (a.translateY || 0) + "px", display: a.display, opacity: a.opacity, pointerEvents: a.styles && a.styles.pointerEvents },
                                    b || c); k = b.style; d(a, { classSetter: function (a) { return function (b) { this.element.setAttribute("class", b); a.className = b } }(b), on: function () { m[0].div && e.on.apply({ element: m[0].div }, arguments); return a }, translateXSetter: q, translateYSetter: q }); a.addedSetters || u(a, k)
                            })
                        }
                    } else b = c; b.appendChild(f); e.added = !0; e.alignOnAdd && e.htmlUpdateTransform(); return e
                }); return e
            }
        })
    })(L); (function (a) {
        var B = a.defined, E = a.each, F = a.extend, p = a.merge, g = a.pick, d = a.timeUnits, t = a.win; a.Time = function (a) { this.update(a, !1) }; a.Time.prototype =
        {
            defaultOptions: {}, update: function (a) {
                var d = g(a && a.useUTC, !0), r = this; this.options = a = p(!0, this.options || {}, a); this.Date = a.Date || t.Date; this.timezoneOffset = (this.useUTC = d) && a.timezoneOffset; this.getTimezoneOffset = this.timezoneOffsetFunction(); (this.variableTimezone = !(d && !a.getTimezoneOffset && !a.timezone)) || this.timezoneOffset ? (this.get = function (a, c) { var f = c.getTime(), d = f - r.getTimezoneOffset(c); c.setTime(d); a = c["getUTC" + a](); c.setTime(f); return a }, this.set = function (a, c, d) {
                    var f; if ("Milliseconds" === a ||
                        "Seconds" === a || "Minutes" === a && 0 === c.getTimezoneOffset() % 60) c["set" + a](d); else f = r.getTimezoneOffset(c), f = c.getTime() - f, c.setTime(f), c["setUTC" + a](d), a = r.getTimezoneOffset(c), f = c.getTime() + a, c.setTime(f)
                }) : d ? (this.get = function (a, c) { return c["getUTC" + a]() }, this.set = function (a, c, d) { return c["setUTC" + a](d) }) : (this.get = function (a, c) { return c["get" + a]() }, this.set = function (a, c, d) { return c["set" + a](d) })
            }, makeTime: function (d, v, r, f, c, u) {
                var l, m, b; this.useUTC ? (l = this.Date.UTC.apply(0, arguments), m = this.getTimezoneOffset(l),
                    l += m, b = this.getTimezoneOffset(l), m !== b ? l += b - m : m - 36E5 !== this.getTimezoneOffset(l - 36E5) || a.isSafari || (l -= 36E5)) : l = (new this.Date(d, v, g(r, 1), g(f, 0), g(c, 0), g(u, 0))).getTime(); return l
            }, timezoneOffsetFunction: function () {
                var d = this, g = this.options, r = t.moment; if (!this.useUTC) return function (a) { return 6E4 * (new Date(a)).getTimezoneOffset() }; if (g.timezone) { if (r) return function (a) { return 6E4 * -r.tz(a, g.timezone).utcOffset() }; a.error(25) } return this.useUTC && g.getTimezoneOffset ? function (a) { return 6E4 * g.getTimezoneOffset(a) } :
                    function () { return 6E4 * (d.timezoneOffset || 0) }
            }, dateFormat: function (d, g, r) {
                if (!a.defined(g) || isNaN(g)) return a.defaultOptions.lang.invalidDate || ""; d = a.pick(d, "%Y-%m-%d %H:%M:%S"); var f = this, c = new this.Date(g), u = this.get("Hours", c), l = this.get("Day", c), m = this.get("Date", c), b = this.get("Month", c), n = this.get("FullYear", c), e = a.defaultOptions.lang, D = e.weekdays, w = e.shortWeekdays, x = a.pad, c = a.extend({
                    a: w ? w[l] : D[l].substr(0, 3), A: D[l], d: x(m), e: x(m, 2, " "), w: l, b: e.shortMonths[b], B: e.months[b], m: x(b + 1), o: b + 1, y: n.toString().substr(2,
                        2), Y: n, H: x(u), k: u, I: x(u % 12 || 12), l: u % 12 || 12, M: x(f.get("Minutes", c)), p: 12 > u ? "AM" : "PM", P: 12 > u ? "am" : "pm", S: x(c.getSeconds()), L: x(Math.floor(g % 1E3), 3)
                }, a.dateFormats); a.objectEach(c, function (a, b) { for (; -1 !== d.indexOf("%" + b);)d = d.replace("%" + b, "function" === typeof a ? a.call(f, g) : a) }); return r ? d.substr(0, 1).toUpperCase() + d.substr(1) : d
            }, resolveDTLFormat: function (d) { return a.isObject(d, !0) ? d : (d = a.splat(d), { main: d[0], from: d[1], to: d[2] }) }, getTimeTicks: function (a, v, r, f) {
                var c = this, u = [], l, m = {}, b; l = new c.Date(v);
                var n = a.unitRange, e = a.count || 1, D; f = g(f, 1); if (B(v)) {
                    c.set("Milliseconds", l, n >= d.second ? 0 : e * Math.floor(c.get("Milliseconds", l) / e)); n >= d.second && c.set("Seconds", l, n >= d.minute ? 0 : e * Math.floor(c.get("Seconds", l) / e)); n >= d.minute && c.set("Minutes", l, n >= d.hour ? 0 : e * Math.floor(c.get("Minutes", l) / e)); n >= d.hour && c.set("Hours", l, n >= d.day ? 0 : e * Math.floor(c.get("Hours", l) / e)); n >= d.day && c.set("Date", l, n >= d.month ? 1 : e * Math.floor(c.get("Date", l) / e)); n >= d.month && (c.set("Month", l, n >= d.year ? 0 : e * Math.floor(c.get("Month", l) /
                        e)), b = c.get("FullYear", l)); n >= d.year && c.set("FullYear", l, b - b % e); n === d.week && (b = c.get("Day", l), c.set("Date", l, c.get("Date", l) - b + f + (b < f ? -7 : 0))); b = c.get("FullYear", l); f = c.get("Month", l); var w = c.get("Date", l), x = c.get("Hours", l); v = l.getTime(); c.variableTimezone && (D = r - v > 4 * d.month || c.getTimezoneOffset(v) !== c.getTimezoneOffset(r)); v = l.getTime(); for (l = 1; v < r;)u.push(v), v = n === d.year ? c.makeTime(b + l * e, 0) : n === d.month ? c.makeTime(b, f + l * e) : !D || n !== d.day && n !== d.week ? D && n === d.hour && 1 < e ? c.makeTime(b, f, w, x + l * e) : v + n * e :
                            c.makeTime(b, f, w + l * e * (n === d.day ? 1 : 7)), l++; u.push(v); n <= d.hour && 1E4 > u.length && E(u, function (a) { 0 === a % 18E5 && "000000000" === c.dateFormat("%H%M%S%L", a) && (m[a] = "day") })
                } u.info = F(a, { higherRanks: m, totalRange: n * e }); return u
            }
        }
    })(L); (function (a) {
        var B = a.merge; a.defaultOptions = {
            symbols: ["circle", "diamond", "square", "triangle", "triangle-down"], lang: {
                loading: "Loading...", months: "January February March April May June July August September October November December".split(" "), shortMonths: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), decimalPoint: ".", numericSymbols: "kMGTPE".split(""), resetZoom: "Reset zoom", resetZoomTitle: "Reset zoom level 1:1", thousandsSep: " "
            }, global: {}, time: a.Time.prototype.defaultOptions, chart: { borderRadius: 0, colorCount: 10, defaultSeriesType: "line", ignoreHiddenSeries: !0, spacing: [10, 10, 15, 10], resetZoomButton: { theme: { zIndex: 6 }, position: { align: "right", x: -10, y: 10 } }, width: null, height: null }, title: {
                text: "Chart title", align: "center", margin: 15,
                widthAdjust: -44
            }, subtitle: { text: "", align: "center", widthAdjust: -44 }, plotOptions: {}, labels: { style: { position: "absolute", color: "#333333" } }, legend: { enabled: !0, align: "center", alignColumns: !0, layout: "horizontal", labelFormatter: function () { return this.name }, borderColor: "#999999", borderRadius: 0, navigation: {}, itemCheckboxStyle: { position: "absolute", width: "13px", height: "13px" }, squareSymbol: !0, symbolPadding: 5, verticalAlign: "bottom", x: 0, y: 0, title: {} }, loading: {}, tooltip: {
                enabled: !0, animation: a.svg, borderRadius: 3,
                dateTimeLabelFormats: { millisecond: "%A, %b %e, %H:%M:%S.%L", second: "%A, %b %e, %H:%M:%S", minute: "%A, %b %e, %H:%M", hour: "%A, %b %e, %H:%M", day: "%A, %b %e, %Y", week: "Week from %A, %b %e, %Y", month: "%B %Y", year: "%Y" }, footerFormat: "", padding: 8, snap: a.isTouchDevice ? 25 : 10, headerFormat: '\x3cspan class\x3d"highcharts-header"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e', pointFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cspan class\x3d"highcharts-strong"\x3e{point.y}\x3c/span\x3e\x3cbr/\x3e'
            },
            credits: { enabled: !0, href: "https://www.highcharts.com", position: { align: "right", x: -10, verticalAlign: "bottom", y: -5 }, text: "Highcharts.com" }
        }; a.setOptions = function (E) { a.defaultOptions = B(!0, a.defaultOptions, E); a.time.update(B(a.defaultOptions.global, a.defaultOptions.time), !1); return a.defaultOptions }; a.getOptions = function () { return a.defaultOptions }; a.defaultPlotOptions = a.defaultOptions.plotOptions; a.time = new a.Time(B(a.defaultOptions.global, a.defaultOptions.time)); a.dateFormat = function (B, F, p) {
            return a.time.dateFormat(B,
                F, p)
        }
    })(L); (function (a) {
        var B = a.correctFloat, E = a.defined, F = a.destroyObjectProperties, p = a.fireEvent, g = a.isNumber, d = a.pick, t = a.deg2rad; a.Tick = function (a, d, g, f, c) { this.axis = a; this.pos = d; this.type = g || ""; this.isNewLabel = this.isNew = !0; this.parameters = c || {}; this.tickmarkOffset = this.parameters.tickmarkOffset; this.options = this.parameters.options; g || f || this.addLabel() }; a.Tick.prototype = {
            addLabel: function () {
                var g = this, v = g.axis, r = v.options, f = v.chart, c = v.categories, u = v.names, l = g.pos, m = d(g.options && g.options.labels,
                    r.labels), b = v.tickPositions, n = l === b[0], e = l === b[b.length - 1], c = this.parameters.category || (c ? d(c[l], u[l], l) : l), D = g.label, b = b.info, w, H, A, z; v.isDatetimeAxis && b && (H = f.time.resolveDTLFormat(r.dateTimeLabelFormats[!r.grid && b.higherRanks[l] || b.unitName]), w = H.main); g.isFirst = n; g.isLast = e; g.formatCtx = { axis: v, chart: f, isFirst: n, isLast: e, dateTimeLabelFormat: w, tickPositionInfo: b, value: v.isLog ? B(v.lin2log(c)) : c, pos: l }; r = v.labelFormatter.call(g.formatCtx, this.formatCtx); if (z = H && H.list) g.shortenLabel = function () {
                        for (A =
                            0; A < z.length; A++)if (D.attr({ text: v.labelFormatter.call(a.extend(g.formatCtx, { dateTimeLabelFormat: z[A] })) }), D.getBBox().width < v.getSlotWidth(g) - 2 * d(m.padding, 5)) return; D.attr({ text: "" })
                    }; if (E(D)) D && D.textStr !== r && (!D.textWidth || m.style && m.style.width || D.styles.width || D.css({ width: null }), D.attr({ text: r })); else { if (g.label = D = E(r) && m.enabled ? f.renderer.text(r, 0, 0, m.useHTML).add(v.labelGroup) : null) D.textPxLength = D.getBBox().width; g.rotation = 0 }
            }, getLabelSize: function () {
                return this.label ? this.label.getBBox()[this.axis.horiz ?
                    "height" : "width"] : 0
            }, handleOverflow: function (a) {
                var g = this.axis, r = g.options.labels, f = a.x, c = g.chart.chartWidth, u = g.chart.spacing, l = d(g.labelLeft, Math.min(g.pos, u[3])), u = d(g.labelRight, Math.max(g.isRadial ? 0 : g.pos + g.len, c - u[1])), m = this.label, b = this.rotation, n = { left: 0, center: .5, right: 1 }[g.labelAlign || m.attr("align")], e = m.getBBox().width, D = g.getSlotWidth(this), w = D, H = 1, A, z = {}; if (b || "justify" !== d(r.overflow, "justify")) 0 > b && f - n * e < l ? A = Math.round(f / Math.cos(b * t) - l) : 0 < b && f + n * e > u && (A = Math.round((c - f) / Math.cos(b *
                    t))); else if (c = f + (1 - n) * e, f - n * e < l ? w = a.x + w * (1 - n) - l : c > u && (w = u - a.x + w * n, H = -1), w = Math.min(D, w), w < D && "center" === g.labelAlign && (a.x += H * (D - w - n * (D - Math.min(e, w)))), e > w || g.autoRotation && (m.styles || {}).width) A = w; A && (this.shortenLabel ? this.shortenLabel() : (z.width = A, (r.style || {}).textOverflow || (z.textOverflow = "ellipsis"), m.css(z)))
            }, getPosition: function (d, g, r, f) {
                var c = this.axis, u = c.chart, l = f && u.oldChartHeight || u.chartHeight; d = {
                    x: d ? a.correctFloat(c.translate(g + r, null, null, f) + c.transB) : c.left + c.offset + (c.opposite ?
                        (f && u.oldChartWidth || u.chartWidth) - c.right - c.left : 0), y: d ? l - c.bottom + c.offset - (c.opposite ? c.height : 0) : a.correctFloat(l - c.translate(g + r, null, null, f) - c.transB)
                }; p(this, "afterGetPosition", { pos: d }); return d
            }, getLabelPosition: function (a, d, g, f, c, u, l, m) {
                var b = this.axis, n = b.transA, e = b.reversed, D = b.staggerLines, w = b.tickRotCorr || { x: 0, y: 0 }, r = c.y, A = f || b.reserveSpaceDefault ? 0 : -b.labelOffset * ("center" === b.labelAlign ? .5 : 1), z = {}; E(r) || (r = 0 === b.side ? g.rotation ? -8 : -g.getBBox().height : 2 === b.side ? w.y + 8 : Math.cos(g.rotation *
                    t) * (w.y - g.getBBox(!1, 0).height / 2)); a = a + c.x + A + w.x - (u && f ? u * n * (e ? -1 : 1) : 0); d = d + r - (u && !f ? u * n * (e ? 1 : -1) : 0); D && (g = l / (m || 1) % D, b.opposite && (g = D - g - 1), d += b.labelOffset / D * g); z.x = a; z.y = Math.round(d); p(this, "afterGetLabelPosition", { pos: z }); return z
            }, getMarkPath: function (a, d, g, f, c, u) { return u.crispLine(["M", a, d, "L", a + (c ? 0 : -g), d + (c ? g : 0)], f) }, renderGridLine: function (a, g, r) {
                var f = this.axis, c = this.gridLine, u = {}, l = this.pos, m = this.type, b = d(this.tickmarkOffset, f.tickmarkOffset), n = f.chart.renderer; c || (m || (u.zIndex = 1), a &&
                    (g = 0), this.gridLine = c = n.path().attr(u).addClass("highcharts-" + (m ? m + "-" : "") + "grid-line").add(f.gridGroup)); if (c && (r = f.getPlotLinePath(l + b, c.strokeWidth() * r, a, "pass"))) c[a || this.isNew ? "attr" : "animate"]({ d: r, opacity: g })
            }, renderMark: function (a, d, g) {
                var f = this.axis, c = f.chart.renderer, u = this.type, l = f.tickSize(u ? u + "Tick" : "tick"), m = this.mark, b = !m, n = a.x; a = a.y; l && (f.opposite && (l[0] = -l[0]), b && (this.mark = m = c.path().addClass("highcharts-" + (u ? u + "-" : "") + "tick").add(f.axisGroup)), m[b ? "attr" : "animate"]({
                    d: this.getMarkPath(n,
                        a, l[0], m.strokeWidth() * g, f.horiz, c), opacity: d
                }))
            }, renderLabel: function (a, t, r, f) {
                var c = this.axis, u = c.horiz, l = c.options, m = this.label, b = l.labels, n = b.step, c = d(this.tickmarkOffset, c.tickmarkOffset), e = !0, D = a.x; a = a.y; m && g(D) && (m.xy = a = this.getLabelPosition(D, a, m, u, b, c, f, n), this.isFirst && !this.isLast && !d(l.showFirstLabel, 1) || this.isLast && !this.isFirst && !d(l.showLastLabel, 1) ? e = !1 : !u || b.step || b.rotation || t || 0 === r || this.handleOverflow(a), n && f % n && (e = !1), e && g(a.y) ? (a.opacity = r, m[this.isNewLabel ? "attr" : "animate"](a),
                    this.isNewLabel = !1) : (m.attr("y", -9999), this.isNewLabel = !0))
            }, render: function (g, t, r) { var f = this.axis, c = f.horiz, u = this.pos, l = d(this.tickmarkOffset, f.tickmarkOffset), u = this.getPosition(c, u, l, t), l = u.x, m = u.y, f = c && l === f.pos + f.len || !c && m === f.pos ? -1 : 1; r = d(r, 1); this.isActive = !0; this.renderGridLine(t, r, f); this.renderMark(u, r, f); this.renderLabel(u, t, r, g); this.isNew = !1; a.fireEvent(this, "afterRender") }, destroy: function () { F(this, this.axis) }
        }
    })(L); var W = function (a) {
        var B = a.addEvent, E = a.animObject, F = a.arrayMax, p =
            a.arrayMin, g = a.correctFloat, d = a.defaultOptions, t = a.defined, x = a.deg2rad, v = a.destroyObjectProperties, r = a.each, f = a.extend, c = a.fireEvent, u = a.format, l = a.getMagnitude, m = a.grep, b = a.inArray, n = a.isArray, e = a.isNumber, D = a.isString, w = a.merge, H = a.normalizeTickInterval, A = a.objectEach, z = a.pick, q = a.removeEvent, C = a.splat, G = a.syncTimeout, I = a.Tick, J = function () { this.init.apply(this, arguments) }; a.extend(J.prototype, {
                defaultOptions: {
                    dateTimeLabelFormats: {
                        millisecond: { main: "%H:%M:%S.%L", range: !1 }, second: {
                            main: "%H:%M:%S",
                            range: !1
                        }, minute: { main: "%H:%M", range: !1 }, hour: { main: "%H:%M", range: !1 }, day: { main: "%e. %b" }, week: { main: "%e. %b" }, month: { main: "%b '%y" }, year: { main: "%Y" }
                    }, endOnTick: !1, labels: { enabled: !0, indentation: 10, x: 0 }, maxPadding: .01, minorTickLength: 2, minorTickPosition: "outside", minPadding: .01, startOfWeek: 1, startOnTick: !1, tickLength: 10, tickPixelInterval: 100, tickmarkPlacement: "between", tickPosition: "outside", title: { align: "middle" }, type: "linear"
                }, defaultYAxisOptions: {
                    endOnTick: !0, maxPadding: .05, minPadding: .05, tickPixelInterval: 72,
                    showLastLabel: !0, labels: { x: -8 }, startOnTick: !0, title: { rotation: 270, text: "Values" }, stackLabels: { allowOverlap: !1, enabled: !1, formatter: function () { return a.numberFormat(this.total, -1) } }
                }, defaultLeftAxisOptions: { labels: { x: -15 }, title: { rotation: 270 } }, defaultRightAxisOptions: { labels: { x: 15 }, title: { rotation: 90 } }, defaultBottomAxisOptions: { labels: { autoRotation: [-45], x: 0 }, title: { rotation: 0 } }, defaultTopAxisOptions: { labels: { autoRotation: [-45], x: 0 }, title: { rotation: 0 } }, init: function (a, y) {
                    var k = y.isX, h = this; h.chart =
                        a; h.horiz = a.inverted && !h.isZAxis ? !k : k; h.isXAxis = k; h.coll = h.coll || (k ? "xAxis" : "yAxis"); c(this, "init", { userOptions: y }); h.opposite = y.opposite; h.side = y.side || (h.horiz ? h.opposite ? 0 : 2 : h.opposite ? 1 : 3); h.setOptions(y); var e = this.options, q = e.type; h.labelFormatter = e.labels.formatter || h.defaultLabelFormatter; h.userOptions = y; h.minPixelPadding = 0; h.reversed = e.reversed; h.visible = !1 !== e.visible; h.zoomEnabled = !1 !== e.zoomEnabled; h.hasNames = "category" === q || !0 === e.categories; h.categories = e.categories || h.hasNames; h.names ||
                            (h.names = [], h.names.keys = {}); h.plotLinesAndBandsGroups = {}; h.isLog = "logarithmic" === q; h.isDatetimeAxis = "datetime" === q; h.positiveValuesOnly = h.isLog && !h.allowNegativeLog; h.isLinked = t(e.linkedTo); h.ticks = {}; h.labelEdge = []; h.minorTicks = {}; h.plotLinesAndBands = []; h.alternateBands = {}; h.len = 0; h.minRange = h.userMinRange = e.minRange || e.maxZoom; h.range = e.range; h.offset = e.offset || 0; h.stacks = {}; h.oldStacks = {}; h.stacksTouched = 0; h.max = null; h.min = null; h.crosshair = z(e.crosshair, C(a.options.tooltip.crosshairs)[k ? 0 : 1],
                                !1); y = h.options.events; -1 === b(h, a.axes) && (k ? a.axes.splice(a.xAxis.length, 0, h) : a.axes.push(h), a[h.coll].push(h)); h.series = h.series || []; a.inverted && !h.isZAxis && k && void 0 === h.reversed && (h.reversed = !0); A(y, function (a, b) { B(h, b, a) }); h.lin2log = e.linearToLogConverter || h.lin2log; h.isLog && (h.val2lin = h.log2lin, h.lin2val = h.lin2log); c(this, "afterInit")
                }, setOptions: function (a) {
                    this.options = w(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions,
                    this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], w(d[this.coll], a)); c(this, "afterSetOptions", { userOptions: a })
                }, defaultLabelFormatter: function () {
                    var b = this.axis, y = this.value, e = b.chart.time, h = b.categories, c = this.dateTimeLabelFormat, q = d.lang, f = q.numericSymbols, q = q.numericSymbolMagnitude || 1E3, m = f && f.length, n, l = b.options.labels.format, b = b.isLog ? Math.abs(y) : b.tickInterval; if (l) n = u(l, this, e); else if (h) n = y; else if (c) n = e.dateFormat(c, y); else if (m && 1E3 <= b) for (; m-- && void 0 === n;)e = Math.pow(q,
                        m + 1), b >= e && 0 === 10 * y % e && null !== f[m] && 0 !== y && (n = a.numberFormat(y / e, -1) + f[m]); void 0 === n && (n = 1E4 <= Math.abs(y) ? a.numberFormat(y, -1) : a.numberFormat(y, -1, void 0, "")); return n
                }, getSeriesExtremes: function () {
                    var a = this, b = a.chart; c(this, "getSeriesExtremes", null, function () {
                        a.hasVisibleSeries = !1; a.dataMin = a.dataMax = a.threshold = null; a.softThreshold = !a.isXAxis; a.buildStacks && a.buildStacks(); r(a.series, function (k) {
                            if (k.visible || !b.options.chart.ignoreHiddenSeries) {
                                var h = k.options, y = h.threshold, c; a.hasVisibleSeries =
                                    !0; a.positiveValuesOnly && 0 >= y && (y = null); if (a.isXAxis) h = k.xData, h.length && (k = p(h), c = F(h), e(k) || k instanceof Date || (h = m(h, e), k = p(h), c = F(h)), h.length && (a.dataMin = Math.min(z(a.dataMin, h[0], k), k), a.dataMax = Math.max(z(a.dataMax, h[0], c), c))); else if (k.getExtremes(), c = k.dataMax, k = k.dataMin, t(k) && t(c) && (a.dataMin = Math.min(z(a.dataMin, k), k), a.dataMax = Math.max(z(a.dataMax, c), c)), t(y) && (a.threshold = y), !h.softThreshold || a.positiveValuesOnly) a.softThreshold = !1
                            }
                        })
                    }); c(this, "afterGetSeriesExtremes")
                }, translate: function (a,
                    b, c, h, q, d) { var k = this.linkedParent || this, y = 1, f = 0, n = h ? k.oldTransA : k.transA; h = h ? k.oldMin : k.min; var m = k.minPixelPadding; q = (k.isOrdinal || k.isBroken || k.isLog && q) && k.lin2val; n || (n = k.transA); c && (y *= -1, f = k.len); k.reversed && (y *= -1, f -= y * (k.sector || k.len)); b ? (a = (a * y + f - m) / n + h, q && (a = k.lin2val(a))) : (q && (a = k.val2lin(a)), a = e(h) ? y * (a - h) * n + f + y * m + (e(d) ? n * d : 0) : void 0); return a }, toPixels: function (a, b) { return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos) }, toValue: function (a, b) {
                        return this.translate(a - (b ? 0 : this.pos),
                            !0, !this.horiz, null, !0)
                    }, getPlotLinePath: function (a, b, c, h, q) {
                        var k = this.chart, y = this.left, d = this.top, f, n, m = c && k.oldChartHeight || k.chartHeight, l = c && k.oldChartWidth || k.chartWidth, C; f = this.transB; var K = function (a, b, k) { if ("pass" !== h && a < b || a > k) h ? a = Math.min(Math.max(b, a), k) : C = !0; return a }; q = z(q, this.translate(a, null, null, c)); q = Math.min(Math.max(-1E5, q), 1E5); a = c = Math.round(q + f); f = n = Math.round(m - q - f); e(q) ? this.horiz ? (f = d, n = m - this.bottom, a = c = K(a, y, y + this.width)) : (a = y, c = l - this.right, f = n = K(f, d, d + this.height)) :
                            (C = !0, h = !1); return C && !h ? null : k.renderer.crispLine(["M", a, f, "L", c, n], b || 1)
                    }, getLinearTickPositions: function (a, b, e) { var h, k = g(Math.floor(b / a) * a); e = g(Math.ceil(e / a) * a); var y = [], c; g(k + a) === k && (c = 20); if (this.single) return [b]; for (b = k; b <= e;) { y.push(b); b = g(b + a, c); if (b === h) break; h = b } return y }, getMinorTickInterval: function () { var a = this.options; return !0 === a.minorTicks ? z(a.minorTickInterval, "auto") : !1 === a.minorTicks ? null : a.minorTickInterval }, getMinorTickPositions: function () {
                        var a = this, b = a.options, e = a.tickPositions,
                            h = a.minorTickInterval, c = [], q = a.pointRangePadding || 0, d = a.min - q, q = a.max + q, f = q - d; if (f && f / h < a.len / 3) if (a.isLog) r(this.paddedTicks, function (b, k, y) { k && c.push.apply(c, a.getLogTickPositions(h, y[k - 1], y[k], !0)) }); else if (a.isDatetimeAxis && "auto" === this.getMinorTickInterval()) c = c.concat(a.getTimeTicks(a.normalizeTimeTickInterval(h), d, q, b.startOfWeek)); else for (b = d + (e[0] - d) % h; b <= q && b !== c[0]; b += h)c.push(b); 0 !== c.length && a.trimTicks(c); return c
                    }, adjustForMinRange: function () {
                        var a = this.options, b = this.min, e = this.max,
                            h, c, q, d, f, n, m, l; this.isXAxis && void 0 === this.minRange && !this.isLog && (t(a.min) || t(a.max) ? this.minRange = null : (r(this.series, function (a) { n = a.xData; for (d = m = a.xIncrement ? 1 : n.length - 1; 0 < d; d--)if (f = n[d] - n[d - 1], void 0 === q || f < q) q = f }), this.minRange = Math.min(5 * q, this.dataMax - this.dataMin))); e - b < this.minRange && (c = this.dataMax - this.dataMin >= this.minRange, l = this.minRange, h = (l - e + b) / 2, h = [b - h, z(a.min, b - h)], c && (h[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin), b = F(h), e = [b + l, z(a.max, b + l)], c && (e[2] = this.isLog ?
                                this.log2lin(this.dataMax) : this.dataMax), e = p(e), e - b < l && (h[0] = e - l, h[1] = z(a.min, e - l), b = F(h))); this.min = b; this.max = e
                    }, getClosest: function () { var a; this.categories ? a = 1 : r(this.series, function (b) { var k = b.closestPointRange, h = b.visible || !b.chart.options.chart.ignoreHiddenSeries; !b.noSharedTooltip && t(k) && h && (a = t(a) ? Math.min(a, k) : k) }); return a }, nameToX: function (a) {
                        var k = n(this.categories), e = k ? this.categories : this.names, h = a.options.x, c; a.series.requireSorting = !1; t(h) || (h = !1 === this.options.uniqueNames ? a.series.autoIncrement() :
                            k ? b(a.name, e) : z(e.keys[a.name], -1)); -1 === h ? k || (c = e.length) : c = h; void 0 !== c && (this.names[c] = a.name, this.names.keys[a.name] = c); return c
                    }, updateNames: function () { var b = this, e = this.names; 0 < e.length && (r(a.keys(e.keys), function (a) { delete e.keys[a] }), e.length = 0, this.minRange = this.userMinRange, r(this.series || [], function (a) { a.xIncrement = null; if (!a.points || a.isDirtyData) a.processData(), a.generatePoints(); r(a.points, function (h, k) { var e; h.options && (e = b.nameToX(h), void 0 !== e && e !== h.x && (h.x = e, a.xData[k] = e)) }) })) },
                setAxisTranslation: function (a) {
                    var b = this, k = b.max - b.min, h = b.axisPointRange || 0, e, q = 0, d = 0, f = b.linkedParent, n = !!b.categories, m = b.transA, l = b.isXAxis; if (l || n || h) e = b.getClosest(), f ? (q = f.minPointOffset, d = f.pointRangePadding) : r(b.series, function (a) { var k = n ? 1 : l ? z(a.options.pointRange, e, 0) : b.axisPointRange || 0; a = a.options.pointPlacement; h = Math.max(h, k); b.single || (q = Math.max(q, D(a) ? 0 : k / 2), d = Math.max(d, "on" === a ? 0 : k)) }), f = b.ordinalSlope && e ? b.ordinalSlope / e : 1, b.minPointOffset = q *= f, b.pointRangePadding = d *= f, b.pointRange =
                        Math.min(h, k), l && (b.closestPointRange = e); a && (b.oldTransA = m); b.translationSlope = b.transA = m = b.staticScale || b.len / (k + d || 1); b.transB = b.horiz ? b.left : b.bottom; b.minPixelPadding = m * q; c(this, "afterSetAxisTranslation")
                }, minFromRange: function () { return this.max - this.range }, setTickInterval: function (b) {
                    var k = this, q = k.chart, h = k.options, d = k.isLog, f = k.isDatetimeAxis, n = k.isXAxis, m = k.isLinked, C = h.maxPadding, D = h.minPadding, G = h.tickInterval, w = h.tickPixelInterval, u = k.categories, A = e(k.threshold) ? k.threshold : null, I = k.softThreshold,
                        J, p, v, x; f || u || m || this.getTickAmount(); v = z(k.userMin, h.min); x = z(k.userMax, h.max); m ? (k.linkedParent = q[k.coll][h.linkedTo], q = k.linkedParent.getExtremes(), k.min = z(q.min, q.dataMin), k.max = z(q.max, q.dataMax), h.type !== k.linkedParent.options.type && a.error(11, 1)) : (!I && t(A) && (k.dataMin >= A ? (J = A, D = 0) : k.dataMax <= A && (p = A, C = 0)), k.min = z(v, J, k.dataMin), k.max = z(x, p, k.dataMax)); d && (k.positiveValuesOnly && !b && 0 >= Math.min(k.min, z(k.dataMin, k.min)) && a.error(10, 1), k.min = g(k.log2lin(k.min), 15), k.max = g(k.log2lin(k.max), 15));
                    k.range && t(k.max) && (k.userMin = k.min = v = Math.max(k.dataMin, k.minFromRange()), k.userMax = x = k.max, k.range = null); c(k, "foundExtremes"); k.beforePadding && k.beforePadding(); k.adjustForMinRange(); !(u || k.axisPointRange || k.usePercentage || m) && t(k.min) && t(k.max) && (q = k.max - k.min) && (!t(v) && D && (k.min -= q * D), !t(x) && C && (k.max += q * C)); e(h.softMin) && !e(k.userMin) && (k.min = Math.min(k.min, h.softMin)); e(h.softMax) && !e(k.userMax) && (k.max = Math.max(k.max, h.softMax)); e(h.floor) && (k.min = Math.max(k.min, h.floor)); e(h.ceiling) && (k.max =
                        Math.min(k.max, h.ceiling)); I && t(k.dataMin) && (A = A || 0, !t(v) && k.min < A && k.dataMin >= A ? k.min = A : !t(x) && k.max > A && k.dataMax <= A && (k.max = A)); k.tickInterval = k.min === k.max || void 0 === k.min || void 0 === k.max ? 1 : m && !G && w === k.linkedParent.options.tickPixelInterval ? G = k.linkedParent.tickInterval : z(G, this.tickAmount ? (k.max - k.min) / Math.max(this.tickAmount - 1, 1) : void 0, u ? 1 : (k.max - k.min) * w / Math.max(k.len, w)); n && !b && r(k.series, function (a) { a.processData(k.min !== k.oldMin || k.max !== k.oldMax) }); k.setAxisTranslation(!0); k.beforeSetTickPositions &&
                            k.beforeSetTickPositions(); k.postProcessTickInterval && (k.tickInterval = k.postProcessTickInterval(k.tickInterval)); k.pointRange && !G && (k.tickInterval = Math.max(k.pointRange, k.tickInterval)); b = z(h.minTickInterval, k.isDatetimeAxis && k.closestPointRange); !G && k.tickInterval < b && (k.tickInterval = b); f || d || G || (k.tickInterval = H(k.tickInterval, null, l(k.tickInterval), z(h.allowDecimals, !(.5 < k.tickInterval && 5 > k.tickInterval && 1E3 < k.max && 9999 > k.max)), !!this.tickAmount)); this.tickAmount || (k.tickInterval = k.unsquish());
                    this.setTickPositions()
                }, setTickPositions: function () {
                    var b = this.options, e, q = b.tickPositions; e = this.getMinorTickInterval(); var h = b.tickPositioner, d = b.startOnTick, f = b.endOnTick; this.tickmarkOffset = this.categories && "between" === b.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0; this.minorTickInterval = "auto" === e && this.tickInterval ? this.tickInterval / 5 : e; this.single = this.min === this.max && t(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== b.allowDecimals); this.tickPositions = e = q && q.slice();
                    !e && (!this.ordinalPositions && (this.max - this.min) / this.tickInterval > Math.max(2 * this.len, 200) ? (e = [this.min, this.max], a.error(19)) : e = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, b.units), this.min, this.max, b.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), e.length > this.len && (e = [e[0], e.pop()], e[0] === e[1] && (e.length =
                        1)), this.tickPositions = e, h && (h = h.apply(this, [this.min, this.max]))) && (this.tickPositions = e = h); this.paddedTicks = e.slice(0); this.trimTicks(e, d, f); this.isLinked || (this.single && 2 > e.length && (this.min -= .5, this.max += .5), q || h || this.adjustTickAmount()); c(this, "afterSetTickPositions")
                }, trimTicks: function (a, b, e) {
                    var h = a[0], k = a[a.length - 1], c = this.minPointOffset || 0; if (!this.isLinked) {
                        if (b && -Infinity !== h) this.min = h; else for (; this.min - c > a[0];)a.shift(); if (e) this.max = k; else for (; this.max + c < a[a.length - 1];)a.pop();
                        0 === a.length && t(h) && !this.options.tickPositions && a.push((k + h) / 2)
                    }
                }, alignToOthers: function () { var a = {}, b, e = this.options; !1 === this.chart.options.chart.alignTicks || !1 === e.alignTicks || !1 === e.startOnTick || !1 === e.endOnTick || this.isLog || r(this.chart[this.coll], function (h) { var k = h.options, k = [h.horiz ? k.left : k.top, k.width, k.height, k.pane].join(); h.series.length && (a[k] ? b = !0 : a[k] = 1) }); return b }, getTickAmount: function () {
                    var a = this.options, b = a.tickAmount, e = a.tickPixelInterval; !t(a.tickInterval) && this.len < e && !this.isRadial &&
                        !this.isLog && a.startOnTick && a.endOnTick && (b = 2); !b && this.alignToOthers() && (b = Math.ceil(this.len / e) + 1); 4 > b && (this.finalTickAmt = b, b = 5); this.tickAmount = b
                }, adjustTickAmount: function () {
                    var a = this.tickInterval, b = this.tickPositions, e = this.tickAmount, h = this.finalTickAmt, c = b && b.length, q = z(this.threshold, this.softThreshold ? 0 : null); if (this.hasData()) {
                        if (c < e) { for (; b.length < e;)b.length % 2 || this.min === q ? b.push(g(b[b.length - 1] + a)) : b.unshift(g(b[0] - a)); this.transA *= (c - 1) / (e - 1); this.min = b[0]; this.max = b[b.length - 1] } else c >
                            e && (this.tickInterval *= 2, this.setTickPositions()); if (t(h)) { for (a = e = b.length; a--;)(3 === h && 1 === a % 2 || 2 >= h && 0 < a && a < e - 1) && b.splice(a, 1); this.finalTickAmt = void 0 }
                    }
                }, setScale: function () {
                    var a, b; this.oldMin = this.min; this.oldMax = this.max; this.oldAxisLength = this.len; this.setAxisSize(); b = this.len !== this.oldAxisLength; r(this.series, function (b) { if (b.isDirtyData || b.isDirty || b.xAxis.isDirty) a = !0 }); b || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ?
                        (this.resetStacks && this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = b || this.min !== this.oldMin || this.max !== this.oldMax)) : this.cleanStacks && this.cleanStacks(); c(this, "afterSetScale")
                }, setExtremes: function (a, b, e, h, q) {
                    var k = this, d = k.chart; e = z(e, !0); r(k.series, function (a) { delete a.kdTree }); q = f(q, { min: a, max: b }); c(k, "setExtremes", q, function () {
                        k.userMin = a; k.userMax = b; k.eventArgs = q; e &&
                            d.redraw(h)
                    })
                }, zoom: function (a, b) { var k = this.dataMin, h = this.dataMax, e = this.options, c = Math.min(k, z(e.min, k)), e = Math.max(h, z(e.max, h)); if (a !== this.min || b !== this.max) this.allowZoomOutside || (t(k) && (a < c && (a = c), a > e && (a = e)), t(h) && (b < c && (b = c), b > e && (b = e))), this.displayBtn = void 0 !== a || void 0 !== b, this.setExtremes(a, b, !1, void 0, { trigger: "zoom" }); return !0 }, setAxisSize: function () {
                    var b = this.chart, e = this.options, c = e.offsets || [0, 0, 0, 0], h = this.horiz, q = this.width = Math.round(a.relativeLength(z(e.width, b.plotWidth - c[3] +
                        c[1]), b.plotWidth)), d = this.height = Math.round(a.relativeLength(z(e.height, b.plotHeight - c[0] + c[2]), b.plotHeight)), f = this.top = Math.round(a.relativeLength(z(e.top, b.plotTop + c[0]), b.plotHeight, b.plotTop)), e = this.left = Math.round(a.relativeLength(z(e.left, b.plotLeft + c[3]), b.plotWidth, b.plotLeft)); this.bottom = b.chartHeight - d - f; this.right = b.chartWidth - q - e; this.len = Math.max(h ? q : d, 0); this.pos = h ? e : f
                }, getExtremes: function () {
                    var a = this.isLog; return {
                        min: a ? g(this.lin2log(this.min)) : this.min, max: a ? g(this.lin2log(this.max)) :
                            this.max, dataMin: this.dataMin, dataMax: this.dataMax, userMin: this.userMin, userMax: this.userMax
                    }
                }, getThreshold: function (a) { var b = this.isLog, k = b ? this.lin2log(this.min) : this.min, b = b ? this.lin2log(this.max) : this.max; null === a || -Infinity === a ? a = k : Infinity === a ? a = b : k > a ? a = k : b < a && (a = b); return this.translate(a, 0, 1, 0, 1) }, autoLabelAlign: function (a) { a = (z(a, 0) - 90 * this.side + 720) % 360; return 15 < a && 165 > a ? "right" : 195 < a && 345 > a ? "left" : "center" }, tickSize: function (a) {
                    var b = this.options, e = b[a + "Length"], h = z(b[a + "Width"], "tick" ===
                        a && this.isXAxis ? 1 : 0); if (h && e) return "inside" === b[a + "Position"] && (e = -e), [e, h]
                }, labelMetrics: function () { var a = this.tickPositions && this.tickPositions[0] || 0; return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[a] && this.ticks[a].label) }, unsquish: function () {
                    var a = this.options.labels, b = this.horiz, e = this.tickInterval, h = e, c = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / e), q, d = a.rotation, f = this.labelMetrics(), n, m = Number.MAX_VALUE, l, C = function (a) {
                        a /=
                            c || 1; a = 1 < a ? Math.ceil(a) : 1; return g(a * e)
                    }; b ? (l = !a.staggerLines && !a.step && (t(d) ? [d] : c < z(a.autoRotationLimit, 80) && a.autoRotation)) && r(l, function (a) { var b; if (a === d || a && -90 <= a && 90 >= a) n = C(Math.abs(f.h / Math.sin(x * a))), b = n + Math.abs(a / 360), b < m && (m = b, q = a, h = n) }) : a.step || (h = C(f.h)); this.autoRotation = l; this.labelRotation = z(q, d); return h
                }, getSlotWidth: function (a) {
                    var b = this.chart, e = this.horiz, h = this.options.labels, k = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1), c = b.margin[3]; return a && a.slotWidth ||
                        e && 2 > (h.step || 0) && !h.rotation && (this.staggerLines || 1) * this.len / k || !e && (h.style && parseInt(h.style.width, 10) || c && c - b.spacing[3] || .33 * b.chartWidth)
                }, renderUnsquish: function () {
                    var a = this.chart, b = a.renderer, e = this.tickPositions, h = this.ticks, c = this.options.labels, q = c && c.style || {}, d = this.horiz, f = this.getSlotWidth(), n = Math.max(1, Math.round(f - 2 * (c.padding || 5))), m = {}, l = this.labelMetrics(), C = c.style && c.style.textOverflow, G, g, w = 0, u; D(c.rotation) || (m.rotation = c.rotation || 0); r(e, function (a) {
                        (a = h[a]) && a.label &&
                            a.label.textPxLength > w && (w = a.label.textPxLength)
                    }); this.maxLabelLength = w; if (this.autoRotation) w > n && w > l.h ? m.rotation = this.labelRotation : this.labelRotation = 0; else if (f && (G = n, !C)) for (g = "clip", n = e.length; !d && n--;)if (u = e[n], u = h[u].label) u.styles && "ellipsis" === u.styles.textOverflow ? u.css({ textOverflow: "clip" }) : u.textPxLength > f && u.css({ width: f + "px" }), u.getBBox().height > this.len / e.length - (l.h - l.f) && (u.specificTextOverflow = "ellipsis"); m.rotation && (G = w > .5 * a.chartHeight ? .33 * a.chartHeight : w, C || (g = "ellipsis"));
                    if (this.labelAlign = c.align || this.autoLabelAlign(this.labelRotation)) m.align = this.labelAlign; r(e, function (a) { var b = (a = h[a]) && a.label, e = q.width, k = {}; b && (b.attr(m), a.shortenLabel ? a.shortenLabel() : G && !e && "nowrap" !== q.whiteSpace && (G < b.textPxLength || "SPAN" === b.element.tagName) ? (k.width = G, C || (k.textOverflow = b.specificTextOverflow || g), b.css(k)) : b.styles && b.styles.width && !k.width && !e && b.css({ width: null }), delete b.specificTextOverflow, a.rotation = m.rotation) }, this); this.tickRotCorr = b.rotCorr(l.b, this.labelRotation ||
                        0, 0 !== this.side)
                }, hasData: function () { return this.hasVisibleSeries || t(this.min) && t(this.max) && this.tickPositions && 0 < this.tickPositions.length }, addTitle: function (a) {
                    var b = this.chart.renderer, e = this.horiz, h = this.opposite, k = this.options.title, c; this.axisTitle || ((c = k.textAlign) || (c = (e ? { low: "left", middle: "center", high: "right" } : { low: h ? "right" : "left", middle: "center", high: h ? "left" : "right" })[k.align]), this.axisTitle = b.text(k.text, 0, 0, k.useHTML).attr({ zIndex: 7, rotation: k.rotation || 0, align: c }).addClass("highcharts-axis-title").add(this.axisGroup),
                        this.axisTitle.isNew = !0); this.axisTitle.css({ width: this.len }); this.axisTitle[a ? "show" : "hide"](!0)
                }, generateTick: function (a) { var b = this.ticks; b[a] ? b[a].addLabel() : b[a] = new I(this, a) }, getOffset: function () {
                    var a = this, b = a.chart, e = b.renderer, h = a.options, q = a.tickPositions, d = a.ticks, f = a.horiz, n = a.side, m = b.inverted && !a.isZAxis ? [1, 0, 3, 2][n] : n, l, C, G = 0, g, w = 0, D = h.title, u = h.labels, I = 0, J = b.axisOffset, b = b.clipOffset, H = [-1, 1, 1, -1][n], v = h.className, p = a.axisParent; l = a.hasData(); a.showAxis = C = l || z(h.showEmpty, !0); a.staggerLines =
                        a.horiz && u.staggerLines; a.axisGroup || (a.gridGroup = e.g("grid").attr({ zIndex: h.gridZIndex || 1 }).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (v || "")).add(p), a.axisGroup = e.g("axis").attr({ zIndex: h.zIndex || 2 }).addClass("highcharts-" + this.coll.toLowerCase() + " " + (v || "")).add(p), a.labelGroup = e.g("axis-labels").attr({ zIndex: u.zIndex || 7 }).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (v || "")).add(p)); l || a.isLinked ? (r(q, function (b, h) { a.generateTick(b, h) }), a.renderUnsquish(), a.reserveSpaceDefault =
                            0 === n || 2 === n || { 1: "left", 3: "right" }[n] === a.labelAlign, z(u.reserveSpace, "center" === a.labelAlign ? !0 : null, a.reserveSpaceDefault) && r(q, function (a) { I = Math.max(d[a].getLabelSize(), I) }), a.staggerLines && (I *= a.staggerLines), a.labelOffset = I * (a.opposite ? -1 : 1)) : A(d, function (a, b) { a.destroy(); delete d[b] }); D && D.text && !1 !== D.enabled && (a.addTitle(C), C && !1 !== D.reserveSpace && (a.titleOffset = G = a.axisTitle.getBBox()[f ? "height" : "width"], g = D.offset, w = t(g) ? 0 : z(D.margin, f ? 5 : 10))); a.renderLine(); a.offset = H * z(h.offset, J[n]);
                    a.tickRotCorr = a.tickRotCorr || { x: 0, y: 0 }; e = 0 === n ? -a.labelMetrics().h : 2 === n ? a.tickRotCorr.y : 0; w = Math.abs(I) + w; I && (w = w - e + H * (f ? z(u.y, a.tickRotCorr.y + 8 * H) : u.x)); a.axisTitleMargin = z(g, w); a.getMaxLabelDimensions && (a.maxLabelDimensions = a.getMaxLabelDimensions(d, q)); f = this.tickSize("tick"); J[n] = Math.max(J[n], a.axisTitleMargin + G + H * a.offset, w, l && q.length && f ? f[0] + H * a.offset : 0); h = h.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2); b[m] = Math.max(b[m], h); c(this, "afterGetOffset")
                }, getLinePath: function (a) {
                    var b = this.chart,
                        e = this.opposite, h = this.offset, k = this.horiz, c = this.left + (e ? this.width : 0) + h, h = b.chartHeight - this.bottom - (e ? this.height : 0) + h; e && (a *= -1); return b.renderer.crispLine(["M", k ? this.left : c, k ? h : this.top, "L", k ? b.chartWidth - this.right : c, k ? h : b.chartHeight - this.bottom], a)
                }, renderLine: function () { this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup)) }, getTitlePosition: function () {
                    var a = this.horiz, b = this.left, e = this.top, h = this.len, c = this.options.title, q = a ? b : e,
                        d = this.opposite, f = this.offset, n = c.x || 0, m = c.y || 0, l = this.axisTitle, C = this.chart.renderer.fontMetrics(c.style && c.style.fontSize, l), l = Math.max(l.getBBox(null, 0).height - C.h - 1, 0), h = { low: q + (a ? 0 : h), middle: q + h / 2, high: q + (a ? h : 0) }[c.align], b = (a ? e + this.height : b) + (a ? 1 : -1) * (d ? -1 : 1) * this.axisTitleMargin + [-l, l, C.f, -l][this.side]; return { x: a ? h + n : b + (d ? this.width : 0) + f + n, y: a ? b + m - (d ? this.height : 0) + f : h + m }
                }, renderMinorTick: function (a) {
                    var b = this.chart.hasRendered && e(this.oldMin), c = this.minorTicks; c[a] || (c[a] = new I(this, a,
                        "minor")); b && c[a].isNew && c[a].render(null, !0); c[a].render(null, !1, 1)
                }, renderTick: function (a, b) { var c = this.isLinked, h = this.ticks, k = this.chart.hasRendered && e(this.oldMin); if (!c || a >= this.min && a <= this.max) h[a] || (h[a] = new I(this, a)), k && h[a].isNew && h[a].render(b, !0, -1), h[a].render(b) }, render: function () {
                    var b = this, q = b.chart, d = b.options, h = b.isLog, f = b.isLinked, n = b.tickPositions, m = b.axisTitle, l = b.ticks, C = b.minorTicks, w = b.alternateBands, D = d.stackLabels, g = d.alternateGridColor, u = b.tickmarkOffset, z = b.axisLine,
                        J = b.showAxis, H = E(q.renderer.globalAnimation), t, v; b.labelEdge.length = 0; b.overlap = !1; r([l, C, w], function (a) { A(a, function (a) { a.isActive = !1 }) }); if (b.hasData() || f) b.minorTickInterval && !b.categories && r(b.getMinorTickPositions(), function (a) { b.renderMinorTick(a) }), n.length && (r(n, function (a, h) { b.renderTick(a, h) }), u && (0 === b.min || b.single) && (l[-1] || (l[-1] = new I(b, -1, null, !0)), l[-1].render(-1))), g && r(n, function (e, c) {
                            v = void 0 !== n[c + 1] ? n[c + 1] + u : b.max - u; 0 === c % 2 && e < b.max && v <= b.max + (q.polar ? -u : u) && (w[e] || (w[e] = new a.PlotLineOrBand(b)),
                                t = e + u, w[e].options = { from: h ? b.lin2log(t) : t, to: h ? b.lin2log(v) : v, color: g }, w[e].render(), w[e].isActive = !0)
                        }), b._addedPlotLB || (r((d.plotLines || []).concat(d.plotBands || []), function (a) { b.addPlotBandOrLine(a) }), b._addedPlotLB = !0); r([l, C, w], function (a) { var b, h = [], e = H.duration; A(a, function (a, b) { a.isActive || (a.render(b, !1, 0), a.isActive = !1, h.push(b)) }); G(function () { for (b = h.length; b--;)a[h[b]] && !a[h[b]].isActive && (a[h[b]].destroy(), delete a[h[b]]) }, a !== w && q.hasRendered && e ? e : 0) }); z && (z[z.isPlaced ? "animate" : "attr"]({ d: this.getLinePath(z.strokeWidth()) }),
                            z.isPlaced = !0, z[J ? "show" : "hide"](!0)); m && J && (d = b.getTitlePosition(), e(d.y) ? (m[m.isNew ? "attr" : "animate"](d), m.isNew = !1) : (m.attr("y", -9999), m.isNew = !0)); D && D.enabled && b.renderStackTotals(); b.isDirty = !1; c(this, "afterRender")
                }, redraw: function () { this.visible && (this.render(), r(this.plotLinesAndBands, function (a) { a.render() })); r(this.series, function (a) { a.isDirty = !0 }) }, keepProps: "extKey hcEvents names series userMax userMin".split(" "), destroy: function (a) {
                    var e = this, k = e.stacks, h = e.plotLinesAndBands, d; c(this,
                        "destroy", { keepEvents: a }); a || q(e); A(k, function (a, b) { v(a); k[b] = null }); r([e.ticks, e.minorTicks, e.alternateBands], function (a) { v(a) }); if (h) for (a = h.length; a--;)h[a].destroy(); r("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" "), function (a) { e[a] && (e[a] = e[a].destroy()) }); for (d in e.plotLinesAndBandsGroups) e.plotLinesAndBandsGroups[d] = e.plotLinesAndBandsGroups[d].destroy(); A(e, function (a, h) { -1 === b(h, e.keepProps) && delete e[h] })
                }, drawCrosshair: function (a, b) {
                    var e,
                        h = this.crosshair, k = z(h.snap, !0), q, d = this.cross; c(this, "drawCrosshair", { e: a, point: b }); a || (a = this.cross && this.cross.e); if (this.crosshair && !1 !== (t(b) || !k)) {
                            k ? t(b) && (q = z(b.crosshairPos, this.isXAxis ? b.plotX : this.len - b.plotY)) : q = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos); t(q) && (e = this.getPlotLinePath(b && (this.isXAxis ? b.x : z(b.stackY, b.y)), null, null, null, q) || null); if (!t(e)) { this.hideCrosshair(); return } k = this.categories && !this.isRadial; d || (this.cross = d = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" +
                                (k ? "category " : "thin ") + h.className).attr({ zIndex: z(h.zIndex, 2) }).add()); d.show().attr({ d: e }); k && !h.width && d.attr({ "stroke-width": this.transA }); this.cross.e = a
                        } else this.hideCrosshair(); c(this, "afterDrawCrosshair", { e: a, point: b })
                }, hideCrosshair: function () { this.cross && this.cross.hide() }
            }); return a.Axis = J
    }(L); (function (a) {
        var B = a.Axis, E = a.getMagnitude, F = a.normalizeTickInterval, p = a.timeUnits; B.prototype.getTimeTicks = function () { return this.chart.time.getTimeTicks.apply(this.chart.time, arguments) }; B.prototype.normalizeTimeTickInterval =
            function (a, d) { var g = d || [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1, 2]], ["week", [1, 2]], ["month", [1, 2, 3, 4, 6]], ["year", null]]; d = g[g.length - 1]; var x = p[d[0]], v = d[1], r; for (r = 0; r < g.length && !(d = g[r], x = p[d[0]], v = d[1], g[r + 1] && a <= (x * v[v.length - 1] + p[g[r + 1][0]]) / 2); r++); x === p.year && a < 5 * x && (v = [1, 2, 5]); a = F(a / x, v, "year" === d[0] ? Math.max(E(a / x), 1) : 1); return { unitRange: x, count: a, unitName: d[0] } }
    })(L); (function (a) {
        var B = a.Axis,
            E = a.getMagnitude, F = a.map, p = a.normalizeTickInterval, g = a.pick; B.prototype.getLogTickPositions = function (a, t, x, v) {
                var d = this.options, f = this.len, c = []; v || (this._minorAutoInterval = null); if (.5 <= a) a = Math.round(a), c = this.getLinearTickPositions(a, t, x); else if (.08 <= a) for (var f = Math.floor(t), u, l, m, b, n, d = .3 < a ? [1, 2, 4] : .15 < a ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; f < x + 1 && !n; f++)for (l = d.length, u = 0; u < l && !n; u++)m = this.log2lin(this.lin2log(f) * d[u]), m > t && (!v || b <= x) && void 0 !== b && c.push(b), b > x && (n = !0), b = m; else t = this.lin2log(t),
                    x = this.lin2log(x), a = v ? this.getMinorTickInterval() : d.tickInterval, a = g("auto" === a ? null : a, this._minorAutoInterval, d.tickPixelInterval / (v ? 5 : 1) * (x - t) / ((v ? f / this.tickPositions.length : f) || 1)), a = p(a, null, E(a)), c = F(this.getLinearTickPositions(a, t, x), this.log2lin), v || (this._minorAutoInterval = a / 5); v || (this.tickInterval = a); return c
            }; B.prototype.log2lin = function (a) { return Math.log(a) / Math.LN10 }; B.prototype.lin2log = function (a) { return Math.pow(10, a) }
    })(L); (function (a, B) {
        var E = a.arrayMax, F = a.arrayMin, p = a.defined,
            g = a.destroyObjectProperties, d = a.each, t = a.erase, x = a.merge, v = a.pick; a.PlotLineOrBand = function (a, d) { this.axis = a; d && (this.options = d, this.id = d.id) }; a.PlotLineOrBand.prototype = {
                render: function () {
                    a.fireEvent(this, "render"); var d = this, f = d.axis, c = f.horiz, g = d.options, l = g.label, m = d.label, b = g.to, n = g.from, e = g.value, D = p(n) && p(b), w = p(e), H = d.svgElem, A = !H, z = [], q = v(g.zIndex, 0), C = g.events, z = { "class": "highcharts-plot-" + (D ? "band " : "line ") + (g.className || "") }, G = {}, I = f.chart.renderer, J = D ? "bands" : "lines", k; f.isLog && (n = f.log2lin(n),
                        b = f.log2lin(b), e = f.log2lin(e)); G.zIndex = q; J += "-" + q; (k = f.plotLinesAndBandsGroups[J]) || (f.plotLinesAndBandsGroups[J] = k = I.g("plot-" + J).attr(G).add()); A && (d.svgElem = H = I.path().attr(z).add(k)); if (w) z = f.getPlotLinePath(e, H.strokeWidth()); else if (D) z = f.getPlotBandPath(n, b, g); else return; A && z && z.length ? (H.attr({ d: z }), C && a.objectEach(C, function (a, b) { H.on(b, function (a) { C[b].apply(d, [a]) }) })) : H && (z ? (H.show(), H.animate({ d: z })) : (H.hide(), m && (d.label = m = m.destroy()))); l && p(l.text) && z && z.length && 0 < f.width && 0 < f.height &&
                            !z.isFlat ? (l = x({ align: c && D && "center", x: c ? !D && 4 : 10, verticalAlign: !c && D && "middle", y: c ? D ? 16 : 10 : D ? 6 : -4, rotation: c && !D && 90 }, l), this.renderLabel(l, z, D, q)) : m && m.hide(); return d
                }, renderLabel: function (a, d, c, g) {
                    var f = this.label, m = this.axis.chart.renderer; f || (f = { align: a.textAlign || a.align, rotation: a.rotation, "class": "highcharts-plot-" + (c ? "band" : "line") + "-label " + (a.className || "") }, f.zIndex = g, this.label = f = m.text(a.text, 0, 0, a.useHTML).attr(f).add()); g = d.xBounds || [d[1], d[4], c ? d[6] : d[1]]; d = d.yBounds || [d[2], d[5],
                    c ? d[7] : d[2]]; c = F(g); m = F(d); f.align(a, !1, { x: c, y: m, width: E(g) - c, height: E(d) - m }); f.show()
                }, destroy: function () { t(this.axis.plotLinesAndBands, this); delete this.axis; g(this) }
            }; a.extend(B.prototype, {
                getPlotBandPath: function (a, d) {
                    var c = this.getPlotLinePath(d, null, null, !0), f = this.getPlotLinePath(a, null, null, !0), l = [], m = this.horiz, b = 1, n; a = a < this.min && d < this.min || a > this.max && d > this.max; if (f && c) for (a && (n = f.toString() === c.toString(), b = 0), a = 0; a < f.length; a += 6)m && c[a + 1] === f[a + 1] ? (c[a + 1] += b, c[a + 4] += b) : m || c[a + 2] !==
                        f[a + 2] || (c[a + 2] += b, c[a + 5] += b), l.push("M", f[a + 1], f[a + 2], "L", f[a + 4], f[a + 5], c[a + 4], c[a + 5], c[a + 1], c[a + 2], "z"), l.isFlat = n; return l
                }, addPlotBand: function (a) { return this.addPlotBandOrLine(a, "plotBands") }, addPlotLine: function (a) { return this.addPlotBandOrLine(a, "plotLines") }, addPlotBandOrLine: function (d, f) { var c = (new a.PlotLineOrBand(this, d)).render(), g = this.userOptions; c && (f && (g[f] = g[f] || [], g[f].push(d)), this.plotLinesAndBands.push(c)); return c }, removePlotBandOrLine: function (a) {
                    for (var f = this.plotLinesAndBands,
                        c = this.options, g = this.userOptions, l = f.length; l--;)f[l].id === a && f[l].destroy(); d([c.plotLines || [], g.plotLines || [], c.plotBands || [], g.plotBands || []], function (c) { for (l = c.length; l--;)c[l].id === a && t(c, c[l]) })
                }, removePlotBand: function (a) { this.removePlotBandOrLine(a) }, removePlotLine: function (a) { this.removePlotBandOrLine(a) }
            })
    })(L, W); (function (a) {
        var B = a.doc, E = a.each, F = a.extend, p = a.format, g = a.isNumber, d = a.map, t = a.merge, x = a.pick, v = a.splat, r = a.syncTimeout, f = a.timeUnits; a.Tooltip = function () {
            this.init.apply(this,
                arguments)
        }; a.Tooltip.prototype = {
            init: function (a, d) { this.chart = a; this.options = d; this.crosshairs = []; this.now = { x: 0, y: 0 }; this.isHidden = !0; this.split = d.split && !a.inverted; this.shared = d.shared || this.split; this.outside = d.outside && !this.split }, cleanSplit: function (a) { E(this.chart.series, function (c) { var d = c && c.tt; d && (!d.isActive || a ? c.tt = d.destroy() : d.isActive = !1) }) }, applyFilter: function () {
                var a = this.chart; a.renderer.definition({
                    tagName: "filter", id: "drop-shadow-" + a.index, opacity: .5, children: [{
                        tagName: "feGaussianBlur",
                        in: "SourceAlpha", stdDeviation: 1
                    }, { tagName: "feOffset", dx: 1, dy: 1 }, { tagName: "feComponentTransfer", children: [{ tagName: "feFuncA", type: "linear", slope: .3 }] }, { tagName: "feMerge", children: [{ tagName: "feMergeNode" }, { tagName: "feMergeNode", in: "SourceGraphic" }] }]
                }); a.renderer.definition({ tagName: "style", textContent: ".highcharts-tooltip-" + a.index + "{filter:url(#drop-shadow-" + a.index + ")}" })
            }, getLabel: function () {
                var c = this.chart.renderer, d = this.options, f; this.label || (this.outside && (this.container = f = a.doc.createElement("div"),
                    f.className = "highcharts-tooltip-container", a.css(f, { position: "absolute", top: "1px", pointerEvents: d.style && d.style.pointerEvents }), a.doc.body.appendChild(f), this.renderer = c = new a.Renderer(f, 0, 0)), this.label = this.split ? c.g("tooltip") : c.label("", 0, 0, d.shape || "callout", null, null, d.useHTML, null, "tooltip").attr({ padding: d.padding, r: d.borderRadius }), this.applyFilter(), this.label.addClass("highcharts-tooltip-" + this.chart.index), this.outside && (this.label.attr({ x: this.distance, y: this.distance }), this.label.xSetter =
                        function (a) { f.style.left = a + "px" }, this.label.ySetter = function (a) { f.style.top = a + "px" }), this.label.attr({ zIndex: 8 }).add()); return this.label
            }, update: function (a) { this.destroy(); t(!0, this.chart.options.tooltip.userOptions, a); this.init(this.chart, t(!0, this.options, a)) }, destroy: function () {
                this.label && (this.label = this.label.destroy()); this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy()); this.renderer && (this.renderer = this.renderer.destroy(), a.discardElement(this.container)); a.clearTimeout(this.hideTimer);
                a.clearTimeout(this.tooltipTimeout)
            }, move: function (c, d, f, m) { var b = this, n = b.now, e = !1 !== b.options.animation && !b.isHidden && (1 < Math.abs(c - n.x) || 1 < Math.abs(d - n.y)), l = b.followPointer || 1 < b.len; F(n, { x: e ? (2 * n.x + c) / 3 : c, y: e ? (n.y + d) / 2 : d, anchorX: l ? void 0 : e ? (2 * n.anchorX + f) / 3 : f, anchorY: l ? void 0 : e ? (n.anchorY + m) / 2 : m }); b.getLabel().attr(n); e && (a.clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function () { b && b.move(c, d, f, m) }, 32)) }, hide: function (c) {
                var d = this; a.clearTimeout(this.hideTimer); c = x(c, this.options.hideDelay,
                    500); this.isHidden || (this.hideTimer = r(function () { d.getLabel()[c ? "fadeOut" : "hide"](); d.isHidden = !0 }, c))
            }, getAnchor: function (a, f) {
                var c = this.chart, m = c.pointer, b = c.inverted, n = c.plotTop, e = c.plotLeft, g = 0, w = 0, u, A; a = v(a); this.followPointer && f ? (void 0 === f.chartX && (f = m.normalize(f)), a = [f.chartX - c.plotLeft, f.chartY - n]) : a[0].tooltipPos ? a = a[0].tooltipPos : (E(a, function (a) { u = a.series.yAxis; A = a.series.xAxis; g += a.plotX + (!b && A ? A.left - e : 0); w += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!b && u ? u.top - n : 0) }), g /= a.length,
                    w /= a.length, a = [b ? c.plotWidth - w : g, this.shared && !b && 1 < a.length && f ? f.chartY - n : b ? c.plotHeight - g : w]); return d(a, Math.round)
            }, getPosition: function (a, d, f) {
                var c = this.chart, b = this.distance, n = {}, e = c.inverted && f.h || 0, l, g = this.outside, u = g ? B.documentElement.clientWidth - 2 * b : c.chartWidth, A = g ? Math.max(B.body.scrollHeight, B.documentElement.scrollHeight, B.body.offsetHeight, B.documentElement.offsetHeight, B.documentElement.clientHeight) : c.chartHeight, z = c.pointer.chartPosition, q = ["y", A, d, (g ? z.top - b : 0) + f.plotY + c.plotTop,
                    g ? 0 : c.plotTop, g ? A : c.plotTop + c.plotHeight], C = ["x", u, a, (g ? z.left - b : 0) + f.plotX + c.plotLeft, g ? 0 : c.plotLeft, g ? u : c.plotLeft + c.plotWidth], G = !this.followPointer && x(f.ttBelow, !c.inverted === !!f.negative), I = function (a, h, c, d, k, q) { var f = c < d - b, m = d + b + c < h, g = d - b - c; d += b; if (G && m) n[a] = d; else if (!G && f) n[a] = g; else if (f) n[a] = Math.min(q - c, 0 > g - e ? g : g - e); else if (m) n[a] = Math.max(k, d + e + c > h ? d : d + e); else return !1 }, J = function (a, h, e, c) { var d; c < b || c > h - b ? d = !1 : n[a] = c < e / 2 ? 1 : c > h - e / 2 ? h - e - 2 : c - e / 2; return d }, k = function (a) {
                        var b = q; q = C; C = b; l =
                            a
                    }, y = function () { !1 !== I.apply(0, q) ? !1 !== J.apply(0, C) || l || (k(!0), y()) : l ? n.x = n.y = 0 : (k(!0), y()) }; (c.inverted || 1 < this.len) && k(); y(); return n
            }, defaultFormatter: function (a) { var c = this.points || v(this), d; d = [a.tooltipFooterHeaderFormatter(c[0])]; d = d.concat(a.bodyFormatter(c)); d.push(a.tooltipFooterHeaderFormatter(c[0], !0)); return d }, refresh: function (c, d) {
                var f, m = this.options, b = c, n, e = {}, g = []; f = m.formatter || this.defaultFormatter; var e = this.shared, w; m.enabled && (a.clearTimeout(this.hideTimer), this.followPointer =
                    v(b)[0].series.tooltipOptions.followPointer, n = this.getAnchor(b, d), d = n[0], m = n[1], !e || b.series && b.series.noSharedTooltip ? e = b.getLabelConfig() : (E(b, function (a) { a.setState("hover"); g.push(a.getLabelConfig()) }), e = { x: b[0].category, y: b[0].y }, e.points = g, b = b[0]), this.len = g.length, e = f.call(e, this), w = b.series, this.distance = x(w.tooltipOptions.distance, 16), !1 === e ? this.hide() : (f = this.getLabel(), this.isHidden && f.attr({ opacity: 1 }).show(), this.split ? this.renderSplit(e, v(c)) : (f.css({ width: this.chart.spacingBox.width }),
                        f.attr({ text: e && e.join ? e.join("") : e }), f.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + x(b.colorIndex, w.colorIndex)), this.updatePosition({ plotX: d, plotY: m, negative: b.negative, ttBelow: b.ttBelow, h: n[2] || 0 })), this.isHidden = !1))
            }, renderSplit: function (c, d) {
                var f = this, m = [], b = this.chart, n = b.renderer, e = !0, g = this.options, w = 0, u, A = this.getLabel(), z = b.plotTop; a.isString(c) && (c = [!1, c]); E(c.slice(0, d.length + 1), function (a, c) {
                    if (!1 !== a) {
                        c = d[c - 1] || { isHeader: !0, plotX: d[0].plotX }; var q = c.series ||
                            f, C = q.tt, l = "highcharts-color-" + x(c.colorIndex, (c.series || {}).colorIndex, "none"); C || (q.tt = C = n.label(null, null, null, "callout", null, null, g.useHTML).addClass("highcharts-tooltip-box " + l + (c.isHeader ? " highcharts-tooltip-header" : "")).attr({ padding: g.padding, r: g.borderRadius }).add(A)); C.isActive = !0; C.attr({ text: a }); a = C.getBBox(); l = a.width + C.strokeWidth(); c.isHeader ? (w = a.height, b.xAxis[0].opposite && (u = !0, z -= w), l = Math.max(0, Math.min(c.plotX + b.plotLeft - l / 2, b.chartWidth + (b.scrollablePixels ? b.scrollablePixels -
                                b.marginRight : 0) - l))) : l = c.plotX + b.plotLeft - x(g.distance, 16) - l; 0 > l && (e = !1); a = (c.series && c.series.yAxis && c.series.yAxis.pos) + (c.plotY || 0); a -= z; c.isHeader && (a = u ? -w : b.plotHeight + w); m.push({ target: a, rank: c.isHeader ? 1 : 0, size: q.tt.getBBox().height + 1, point: c, x: l, tt: C })
                    }
                }); this.cleanSplit(); a.distribute(m, b.plotHeight + w); E(m, function (a) {
                    var c = a.point, d = c.series; a.tt.attr({
                        visibility: void 0 === a.pos ? "hidden" : "inherit", x: e || c.isHeader ? a.x : c.plotX + b.plotLeft + x(g.distance, 16), y: a.pos + z, anchorX: c.isHeader ? c.plotX +
                            b.plotLeft : c.plotX + d.xAxis.pos, anchorY: c.isHeader ? b.plotTop + b.plotHeight / 2 : c.plotY + d.yAxis.pos
                    })
                })
            }, updatePosition: function (a) {
                var c = this.chart, d = this.getLabel(), f = (this.options.positioner || this.getPosition).call(this, d.width, d.height, a), b = a.plotX + c.plotLeft; a = a.plotY + c.plotTop; var n; this.outside && (n = (this.options.borderWidth || 0) + 2 * this.distance, this.renderer.setSize(d.width + n, d.height + n, !1), b += c.pointer.chartPosition.left - f.x, a += c.pointer.chartPosition.top - f.y); this.move(Math.round(f.x), Math.round(f.y ||
                    0), b, a)
            }, getDateFormat: function (a, d, g, m) { var b = this.chart.time, c = b.dateFormat("%m-%d %H:%M:%S.%L", d), e, l, w = { millisecond: 15, second: 12, minute: 9, hour: 6, day: 3 }, u = "millisecond"; for (l in f) { if (a === f.week && +b.dateFormat("%w", d) === g && "00:00:00.000" === c.substr(6)) { l = "week"; break } if (f[l] > a) { l = u; break } if (w[l] && c.substr(w[l]) !== "01-01 00:00:00.000".substr(w[l])) break; "week" !== l && (u = l) } l && (e = b.resolveDTLFormat(m[l]).main); return e }, getXDateFormat: function (a, d, f) {
                d = d.dateTimeLabelFormats; var c = f && f.closestPointRange;
                return (c ? this.getDateFormat(c, a.x, f.options.startOfWeek, d) : d.day) || d.year
            }, tooltipFooterHeaderFormatter: function (a, d) { d = d ? "footer" : "header"; var c = a.series, f = c.tooltipOptions, b = f.xDateFormat, n = c.xAxis, e = n && "datetime" === n.options.type && g(a.key), D = f[d + "Format"]; e && !b && (b = this.getXDateFormat(a, f, n)); e && b && E(a.point && a.point.tooltipDateKeys || ["key"], function (a) { D = D.replace("{point." + a + "}", "{point." + a + ":" + b + "}") }); return p(D, { point: a, series: c }, this.chart.time) }, bodyFormatter: function (a) {
                return d(a, function (a) {
                    var c =
                        a.series.tooltipOptions; return (c[(a.point.formatPrefix || "point") + "Formatter"] || a.point.tooltipFormatter).call(a.point, c[(a.point.formatPrefix || "point") + "Format"])
                })
            }
        }
    })(L); (function (a) {
        var B = a.addEvent, E = a.attr, F = a.charts, p = a.css, g = a.defined, d = a.each, t = a.extend, x = a.find, v = a.fireEvent, r = a.isNumber, f = a.isObject, c = a.offset, u = a.pick, l = a.splat, m = a.Tooltip; a.Pointer = function (a, c) { this.init(a, c) }; a.Pointer.prototype = {
            init: function (a, c) {
                this.options = c; this.chart = a; this.runChartClick = c.chart.events && !!c.chart.events.click;
                this.pinchDown = []; this.lastValidTouch = {}; m && (a.tooltip = new m(a, c.tooltip), this.followTouchMove = u(c.tooltip.followTouchMove, !0)); this.setDOMEvents()
            }, zoomOption: function (a) { var b = this.chart, e = b.options.chart, c = e.zoomType || "", b = b.inverted; /touch/.test(a.type) && (c = u(e.pinchType, c)); this.zoomX = a = /x/.test(c); this.zoomY = c = /y/.test(c); this.zoomHor = a && !b || c && b; this.zoomVert = c && !b || a && b; this.hasZoom = a || c }, normalize: function (a, d) {
                var b; b = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a; d ||
                    (this.chartPosition = d = c(this.chart.container)); return t(a, { chartX: Math.round(b.pageX - d.left), chartY: Math.round(b.pageY - d.top) })
            }, getCoordinates: function (a) { var b = { xAxis: [], yAxis: [] }; d(this.chart.axes, function (e) { b[e.isXAxis ? "xAxis" : "yAxis"].push({ axis: e, value: e.toValue(a[e.horiz ? "chartX" : "chartY"]) }) }); return b }, findNearestKDPoint: function (a, c, e) {
                var b; d(a, function (a) {
                    var d = !(a.noSharedTooltip && c) && 0 > a.options.findNearestPointBy.indexOf("y"); a = a.searchPoint(e, d); if ((d = f(a, !0)) && !(d = !f(b, !0))) var d =
                        b.distX - a.distX, n = b.dist - a.dist, m = (a.series.group && a.series.group.zIndex) - (b.series.group && b.series.group.zIndex), d = 0 < (0 !== d && c ? d : 0 !== n ? n : 0 !== m ? m : b.series.index > a.series.index ? -1 : 1); d && (b = a)
                }); return b
            }, getPointFromEvent: function (a) { a = a.target; for (var b; a && !b;)b = a.point, a = a.parentNode; return b }, getChartCoordinatesFromPoint: function (a, c) {
                var b = a.series, d = b.xAxis, b = b.yAxis, f = u(a.clientX, a.plotX), n = a.shapeArgs; if (d && b) return c ? { chartX: d.len + d.pos - f, chartY: b.len + b.pos - a.plotY } : {
                    chartX: f + d.pos, chartY: a.plotY +
                        b.pos
                }; if (n && n.x && n.y) return { chartX: n.x, chartY: n.y }
            }, getHoverData: function (b, c, e, m, g, l, A) {
                var n, q = [], C = A && A.isBoosting; m = !(!m || !b); A = c && !c.stickyTracking ? [c] : a.grep(e, function (a) { return a.visible && !(!g && a.directTouch) && u(a.options.enableMouseTracking, !0) && a.stickyTracking }); c = (n = m ? b : this.findNearestKDPoint(A, g, l)) && n.series; n && (g && !c.noSharedTooltip ? (A = a.grep(e, function (a) { return a.visible && !(!g && a.directTouch) && u(a.options.enableMouseTracking, !0) && !a.noSharedTooltip }), d(A, function (a) {
                    var b = x(a.points,
                        function (a) { return a.x === n.x && !a.isNull }); f(b) && (C && (b = a.getPoint(b)), q.push(b))
                })) : q.push(n)); return { hoverPoint: n, hoverSeries: c, hoverPoints: q }
            }, runPointActions: function (b, c) {
                var e = this.chart, f = e.tooltip && e.tooltip.options.enabled ? e.tooltip : void 0, n = f ? f.shared : !1, m = c || e.hoverPoint, g = m && m.series || e.hoverSeries, g = this.getHoverData(m, g, e.series, "touchmove" !== b.type && (!!c || g && g.directTouch && this.isDirectTouch), n, b, { isBoosting: e.isBoosting }), l, m = g.hoverPoint; l = g.hoverPoints; c = (g = g.hoverSeries) && g.tooltipOptions.followPointer;
                n = n && g && !g.noSharedTooltip; if (m && (m !== e.hoverPoint || f && f.isHidden)) { d(e.hoverPoints || [], function (b) { -1 === a.inArray(b, l) && b.setState() }); d(l || [], function (a) { a.setState("hover") }); if (e.hoverSeries !== g) g.onMouseOver(); e.hoverPoint && e.hoverPoint.firePointEvent("mouseOut"); if (!m.series) return; m.firePointEvent("mouseOver"); e.hoverPoints = l; e.hoverPoint = m; f && f.refresh(n ? l : m, b) } else c && f && !f.isHidden && (m = f.getAnchor([{}], b), f.updatePosition({ plotX: m[0], plotY: m[1] })); this.unDocMouseMove || (this.unDocMouseMove =
                    B(e.container.ownerDocument, "mousemove", function (b) { var e = F[a.hoverChartIndex]; if (e) e.pointer.onDocumentMouseMove(b) })); d(e.axes, function (e) { var c = u(e.crosshair.snap, !0), d = c ? a.find(l, function (a) { return a.series[e.coll] === e }) : void 0; d || !c ? e.drawCrosshair(b, d) : e.hideCrosshair() })
            }, reset: function (a, c) {
                var b = this.chart, f = b.hoverSeries, m = b.hoverPoint, n = b.hoverPoints, g = b.tooltip, u = g && g.shared ? n : m; a && u && d(l(u), function (b) { b.series.isCartesian && void 0 === b.plotX && (a = !1) }); if (a) g && u && (g.refresh(u), g.shared &&
                    n ? d(n, function (a) { a.setState(a.state, !0); a.series.isCartesian && (a.series.xAxis.crosshair && a.series.xAxis.drawCrosshair(null, a), a.series.yAxis.crosshair && a.series.yAxis.drawCrosshair(null, a)) }) : m && (m.setState(m.state, !0), d(b.axes, function (a) { a.crosshair && a.drawCrosshair(null, m) }))); else {
                    if (m) m.onMouseOut(); n && d(n, function (a) { a.setState() }); if (f) f.onMouseOut(); g && g.hide(c); this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove()); d(b.axes, function (a) { a.hideCrosshair() }); this.hoverX = b.hoverPoints =
                        b.hoverPoint = null
                }
            }, scaleGroups: function (a, c) { var b = this.chart, f; d(b.series, function (e) { f = a || e.getPlotBox(); e.xAxis && e.xAxis.zoomEnabled && e.group && (e.group.attr(f), e.markerGroup && (e.markerGroup.attr(f), e.markerGroup.clip(c ? b.clipRect : null)), e.dataLabelsGroup && e.dataLabelsGroup.attr(f)) }); b.clipRect.attr(c || b.clipBox) }, dragStart: function (a) { var b = this.chart; b.mouseIsDown = a.type; b.cancelClick = !1; b.mouseDownX = this.mouseDownX = a.chartX; b.mouseDownY = this.mouseDownY = a.chartY }, drag: function (a) {
                var b = this.chart,
                    e = b.options.chart, c = a.chartX, d = a.chartY, f = this.zoomHor, m = this.zoomVert, g = b.plotLeft, q = b.plotTop, l = b.plotWidth, G = b.plotHeight, u, J = this.selectionMarker, k = this.mouseDownX, y = this.mouseDownY, t = e.panKey && a[e.panKey + "Key"]; J && J.touch || (c < g ? c = g : c > g + l && (c = g + l), d < q ? d = q : d > q + G && (d = q + G), this.hasDragged = Math.sqrt(Math.pow(k - c, 2) + Math.pow(y - d, 2)), 10 < this.hasDragged && (u = b.isInsidePlot(k - g, y - q), b.hasCartesianSeries && (this.zoomX || this.zoomY) && u && !t && !J && (this.selectionMarker = J = b.renderer.rect(g, q, f ? 1 : l, m ? 1 : G, 0).attr({
                        "class": "highcharts-selection-marker",
                        zIndex: 7
                    }).add()), J && f && (c -= k, J.attr({ width: Math.abs(c), x: (0 < c ? 0 : c) + k })), J && m && (c = d - y, J.attr({ height: Math.abs(c), y: (0 < c ? 0 : c) + y })), u && !J && e.panning && b.pan(a, e.panning)))
            }, drop: function (a) {
                var b = this, e = this.chart, c = this.hasPinched; if (this.selectionMarker) {
                    var f = { originalEvent: a, xAxis: [], yAxis: [] }, m = this.selectionMarker, l = m.attr ? m.attr("x") : m.x, u = m.attr ? m.attr("y") : m.y, q = m.attr ? m.attr("width") : m.width, C = m.attr ? m.attr("height") : m.height, G; if (this.hasDragged || c) d(e.axes, function (e) {
                        if (e.zoomEnabled && g(e.min) &&
                            (c || b[{ xAxis: "zoomX", yAxis: "zoomY" }[e.coll]])) { var d = e.horiz, k = "touchend" === a.type ? e.minPixelPadding : 0, m = e.toValue((d ? l : u) + k), d = e.toValue((d ? l + q : u + C) - k); f[e.coll].push({ axis: e, min: Math.min(m, d), max: Math.max(m, d) }); G = !0 }
                    }), G && v(e, "selection", f, function (a) { e.zoom(t(a, c ? { animation: !1 } : null)) }); r(e.index) && (this.selectionMarker = this.selectionMarker.destroy()); c && this.scaleGroups()
                } e && r(e.index) && (p(e.container, { cursor: e._cursor }), e.cancelClick = 10 < this.hasDragged, e.mouseIsDown = this.hasDragged = this.hasPinched =
                    !1, this.pinchDown = [])
            }, onContainerMouseDown: function (a) { a = this.normalize(a); 2 !== a.button && (this.zoomOption(a), a.preventDefault && a.preventDefault(), this.dragStart(a)) }, onDocumentMouseUp: function (b) { F[a.hoverChartIndex] && F[a.hoverChartIndex].pointer.drop(b) }, onDocumentMouseMove: function (a) { var b = this.chart, e = this.chartPosition; a = this.normalize(a, e); !e || this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || this.reset() }, onContainerMouseLeave: function (b) {
                var c =
                    F[a.hoverChartIndex]; c && (b.relatedTarget || b.toElement) && (c.pointer.reset(), c.pointer.chartPosition = null)
            }, onContainerMouseMove: function (b) { var c = this.chart; g(a.hoverChartIndex) && F[a.hoverChartIndex] && F[a.hoverChartIndex].mouseIsDown || (a.hoverChartIndex = c.index); b = this.normalize(b); b.returnValue = !1; "mousedown" === c.mouseIsDown && this.drag(b); !this.inClass(b.target, "highcharts-tracker") && !c.isInsidePlot(b.chartX - c.plotLeft, b.chartY - c.plotTop) || c.openMenu || this.runPointActions(b) }, inClass: function (a, c) {
                for (var b; a;) {
                    if (b =
                        E(a, "class")) { if (-1 !== b.indexOf(c)) return !0; if (-1 !== b.indexOf("highcharts-container")) return !1 } a = a.parentNode
                }
            }, onTrackerMouseOut: function (a) { var b = this.chart.hoverSeries; a = a.relatedTarget || a.toElement; this.isDirectTouch = !1; if (!(!b || !a || b.stickyTracking || this.inClass(a, "highcharts-tooltip") || this.inClass(a, "highcharts-series-" + b.index) && this.inClass(a, "highcharts-tracker"))) b.onMouseOut() }, onContainerClick: function (a) {
                var b = this.chart, e = b.hoverPoint, c = b.plotLeft, d = b.plotTop; a = this.normalize(a); b.cancelClick ||
                    (e && this.inClass(a.target, "highcharts-tracker") ? (v(e.series, "click", t(a, { point: e })), b.hoverPoint && e.firePointEvent("click", a)) : (t(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - c, a.chartY - d) && v(b, "click", a)))
            }, setDOMEvents: function () {
                var b = this, c = b.chart.container, e = c.ownerDocument; c.onmousedown = function (a) { b.onContainerMouseDown(a) }; c.onmousemove = function (a) { b.onContainerMouseMove(a) }; c.onclick = function (a) { b.onContainerClick(a) }; this.unbindContainerMouseLeave = B(c, "mouseleave", b.onContainerMouseLeave);
                a.unbindDocumentMouseUp || (a.unbindDocumentMouseUp = B(e, "mouseup", b.onDocumentMouseUp)); a.hasTouch && (c.ontouchstart = function (a) { b.onContainerTouchStart(a) }, c.ontouchmove = function (a) { b.onContainerTouchMove(a) }, a.unbindDocumentTouchEnd || (a.unbindDocumentTouchEnd = B(e, "touchend", b.onDocumentTouchEnd)))
            }, destroy: function () {
                var b = this; b.unDocMouseMove && b.unDocMouseMove(); this.unbindContainerMouseLeave(); a.chartCount || (a.unbindDocumentMouseUp && (a.unbindDocumentMouseUp = a.unbindDocumentMouseUp()), a.unbindDocumentTouchEnd &&
                    (a.unbindDocumentTouchEnd = a.unbindDocumentTouchEnd())); clearInterval(b.tooltipTimeout); a.objectEach(b, function (a, c) { b[c] = null })
            }
        }
    })(L); (function (a) {
        var B = a.charts, E = a.each, F = a.extend, p = a.map, g = a.noop, d = a.pick; F(a.Pointer.prototype, {
            pinchTranslate: function (a, d, g, r, f, c) { this.zoomHor && this.pinchTranslateDirection(!0, a, d, g, r, f, c); this.zoomVert && this.pinchTranslateDirection(!1, a, d, g, r, f, c) }, pinchTranslateDirection: function (a, d, g, r, f, c, u, l) {
                var m = this.chart, b = a ? "x" : "y", n = a ? "X" : "Y", e = "chart" + n, D = a ? "width" :
                    "height", w = m["plot" + (a ? "Left" : "Top")], t, A, z = l || 1, q = m.inverted, C = m.bounds[a ? "h" : "v"], G = 1 === d.length, I = d[0][e], J = g[0][e], k = !G && d[1][e], y = !G && g[1][e], p; g = function () { !G && 20 < Math.abs(I - k) && (z = l || Math.abs(J - y) / Math.abs(I - k)); A = (w - J) / z + I; t = m["plot" + (a ? "Width" : "Height")] / z }; g(); d = A; d < C.min ? (d = C.min, p = !0) : d + t > C.max && (d = C.max - t, p = !0); p ? (J -= .8 * (J - u[b][0]), G || (y -= .8 * (y - u[b][1])), g()) : u[b] = [J, y]; q || (c[b] = A - w, c[D] = t); c = q ? 1 / z : z; f[D] = t; f[b] = d; r[q ? a ? "scaleY" : "scaleX" : "scale" + n] = z; r["translate" + n] = c * w + (J - c * I)
            }, pinch: function (a) {
                var t =
                    this, v = t.chart, r = t.pinchDown, f = a.touches, c = f.length, u = t.lastValidTouch, l = t.hasZoom, m = t.selectionMarker, b = {}, n = 1 === c && (t.inClass(a.target, "highcharts-tracker") && v.runTrackerClick || t.runChartClick), e = {}; 1 < c && (t.initiated = !0); l && t.initiated && !n && a.preventDefault(); p(f, function (a) { return t.normalize(a) }); "touchstart" === a.type ? (E(f, function (a, b) { r[b] = { chartX: a.chartX, chartY: a.chartY } }), u.x = [r[0].chartX, r[1] && r[1].chartX], u.y = [r[0].chartY, r[1] && r[1].chartY], E(v.axes, function (a) {
                        if (a.zoomEnabled) {
                            var b =
                                v.bounds[a.horiz ? "h" : "v"], c = a.minPixelPadding, e = a.toPixels(d(a.options.min, a.dataMin)), f = a.toPixels(d(a.options.max, a.dataMax)), q = Math.max(e, f); b.min = Math.min(a.pos, Math.min(e, f) - c); b.max = Math.max(a.pos + a.len, q + c)
                        }
                    }), t.res = !0) : t.followTouchMove && 1 === c ? this.runPointActions(t.normalize(a)) : r.length && (m || (t.selectionMarker = m = F({ destroy: g, touch: !0 }, v.plotBox)), t.pinchTranslate(r, f, b, m, e, u), t.hasPinched = l, t.scaleGroups(b, e), t.res && (t.res = !1, this.reset(!1, 0)))
            }, touch: function (g, p) {
                var t = this.chart, r, f;
                if (t.index !== a.hoverChartIndex) this.onContainerMouseLeave({ relatedTarget: !0 }); a.hoverChartIndex = t.index; 1 === g.touches.length ? (g = this.normalize(g), (f = t.isInsidePlot(g.chartX - t.plotLeft, g.chartY - t.plotTop)) && !t.openMenu ? (p && this.runPointActions(g), "touchmove" === g.type && (p = this.pinchDown, r = p[0] ? 4 <= Math.sqrt(Math.pow(p[0].chartX - g.chartX, 2) + Math.pow(p[0].chartY - g.chartY, 2)) : !1), d(r, !0) && this.pinch(g)) : p && this.reset()) : 2 === g.touches.length && this.pinch(g)
            }, onContainerTouchStart: function (a) {
                this.zoomOption(a);
                this.touch(a, !0)
            }, onContainerTouchMove: function (a) { this.touch(a) }, onDocumentTouchEnd: function (d) { B[a.hoverChartIndex] && B[a.hoverChartIndex].pointer.drop(d) }
        })
    })(L); (function (a) {
        var B = a.addEvent, E = a.charts, F = a.css, p = a.doc, g = a.extend, d = a.noop, t = a.Pointer, x = a.removeEvent, v = a.win, r = a.wrap; if (!a.hasTouch && (v.PointerEvent || v.MSPointerEvent)) {
            var f = {}, c = !!v.PointerEvent, u = function () {
                var c = []; c.item = function (a) { return this[a] }; a.objectEach(f, function (a) { c.push({ pageX: a.pageX, pageY: a.pageY, target: a.target }) });
                return c
            }, l = function (c, b, f, e) { "touch" !== c.pointerType && c.pointerType !== c.MSPOINTER_TYPE_TOUCH || !E[a.hoverChartIndex] || (e(c), e = E[a.hoverChartIndex].pointer, e[b]({ type: f, target: c.currentTarget, preventDefault: d, touches: u() })) }; g(t.prototype, {
                onContainerPointerDown: function (a) { l(a, "onContainerTouchStart", "touchstart", function (a) { f[a.pointerId] = { pageX: a.pageX, pageY: a.pageY, target: a.currentTarget } }) }, onContainerPointerMove: function (a) {
                    l(a, "onContainerTouchMove", "touchmove", function (a) {
                        f[a.pointerId] = {
                            pageX: a.pageX,
                            pageY: a.pageY
                        }; f[a.pointerId].target || (f[a.pointerId].target = a.currentTarget)
                    })
                }, onDocumentPointerUp: function (a) { l(a, "onDocumentTouchEnd", "touchend", function (a) { delete f[a.pointerId] }) }, batchMSEvents: function (a) { a(this.chart.container, c ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown); a(this.chart.container, c ? "pointermove" : "MSPointerMove", this.onContainerPointerMove); a(p, c ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp) }
            }); r(t.prototype, "init", function (a, b, c) {
                a.call(this, b, c); this.hasZoom &&
                    F(b.container, { "-ms-touch-action": "none", "touch-action": "none" })
            }); r(t.prototype, "setDOMEvents", function (a) { a.apply(this); (this.hasZoom || this.followTouchMove) && this.batchMSEvents(B) }); r(t.prototype, "destroy", function (a) { this.batchMSEvents(x); a.call(this) })
        }
    })(L); (function (a) {
        var B = a.addEvent, E = a.css, F = a.discardElement, p = a.defined, g = a.each, d = a.fireEvent, t = a.isFirefox, x = a.marginNames, v = a.merge, r = a.pick, f = a.setAnimation, c = a.stableSort, u = a.win, l = a.wrap; a.Legend = function (a, b) { this.init(a, b) }; a.Legend.prototype =
        {
            init: function (a, b) { this.chart = a; this.setOptions(b); b.enabled && (this.render(), B(this.chart, "endResize", function () { this.legend.positionCheckboxes() }), this.proximate ? this.unchartrender = B(this.chart, "render", function () { this.legend.proximatePositions(); this.legend.positionItems() }) : this.unchartrender && this.unchartrender()) }, setOptions: function (a) {
                var b = r(a.padding, 8); this.options = a; this.itemMarginTop = a.itemMarginTop || 0; this.padding = b; this.initialItemY = b - 5; this.symbolWidth = r(a.symbolWidth, 16); this.pages =
                    []; this.proximate = "proximate" === a.layout && !this.chart.inverted
            }, update: function (a, b) { var c = this.chart; this.setOptions(v(!0, this.options, a)); this.destroy(); c.isDirtyLegend = c.isDirtyBox = !0; r(b, !0) && c.redraw(); d(this, "afterUpdate") }, colorizeItem: function (a, b) { a.legendGroup[b ? "removeClass" : "addClass"]("highcharts-legend-item-hidden"); d(this, "afterColorizeItem", { item: a, visible: b }) }, positionItems: function () { g(this.allItems, this.positionItem, this); this.chart.isResizing || this.positionCheckboxes() }, positionItem: function (a) {
                var b =
                    this.options, c = b.symbolPadding, b = !b.rtl, e = a._legendItemPos, d = e[0], e = e[1], f = a.checkbox; if ((a = a.legendGroup) && a.element) a[p(a.translateY) ? "animate" : "attr"]({ translateX: b ? d : this.legendWidth - d - 2 * c - 4, translateY: e }); f && (f.x = d, f.y = e)
            }, destroyItem: function (a) { var b = a.checkbox; g(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function (b) { a[b] && (a[b] = a[b].destroy()) }); b && F(a.checkbox) }, destroy: function () {
                function a(a) { this[a] && (this[a] = this[a].destroy()) } g(this.getAllItems(), function (b) {
                    g(["legendItem",
                        "legendGroup"], a, b)
                }); g("clipRect up down pager nav box title group".split(" "), a, this); this.display = null
            }, positionCheckboxes: function () { var a = this.group && this.group.alignAttr, b, c = this.clipHeight || this.legendHeight, e = this.titleHeight; a && (b = a.translateY, g(this.allItems, function (d) { var f = d.checkbox, g; f && (g = b + e + f.y + (this.scrollOffset || 0) + 3, E(f, { left: a.translateX + d.checkboxOffset + f.x - 20 + "px", top: g + "px", display: this.proximate || g > b - 6 && g < b + c - 6 ? "" : "none" })) }, this)) }, renderTitle: function () {
                var a = this.options,
                    b = this.padding, c = a.title, e = 0; c.text && (this.title || (this.title = this.chart.renderer.label(c.text, b - 3, b - 4, null, null, null, a.useHTML, null, "legend-title").attr({ zIndex: 1 }).add(this.group)), a = this.title.getBBox(), e = a.height, this.offsetWidth = a.width, this.contentGroup.attr({ translateY: e })); this.titleHeight = e
            }, setText: function (c) { var b = this.options; c.legendItem.attr({ text: b.labelFormat ? a.format(b.labelFormat, c, this.chart.time) : b.labelFormatter.call(c) }) }, renderItem: function (a) {
                var b = this.chart, c = b.renderer,
                    e = this.options, d = this.symbolWidth, f = e.symbolPadding, g = "horizontal" === e.layout ? r(e.itemDistance, 20) : 0, l = !e.rtl, m = a.legendItem, q = !a.series, C = !q && a.series.drawLegendSymbol ? a.series : a, G = C.options, G = this.createCheckboxForItem && G && G.showCheckbox, g = d + f + g + (G ? 20 : 0), u = e.useHTML, t = a.options.className; m || (a.legendGroup = c.g("legend-item").addClass("highcharts-" + C.type + "-series highcharts-color-" + a.colorIndex + (t ? " " + t : "") + (q ? " highcharts-series-" + a.index : "")).attr({ zIndex: 1 }).add(this.scrollGroup), a.legendItem =
                        m = c.text("", l ? d + f : -f, this.baseline || 0, u).attr({ align: l ? "left" : "right", zIndex: 2 }).add(a.legendGroup), this.baseline || (this.fontMetrics = c.fontMetrics(12, m), this.baseline = this.fontMetrics.f + 3 + this.itemMarginTop, m.attr("y", this.baseline)), this.symbolHeight = e.symbolHeight || this.fontMetrics.f, C.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, m, u), G && this.createCheckboxForItem(a)); this.colorizeItem(a, a.visible); m.css({ width: (e.itemWidth || e.width || b.spacingBox.width) - g }); this.setText(a);
                b = m.getBBox(); a.itemWidth = a.checkboxOffset = e.itemWidth || a.legendItemWidth || b.width + g; this.maxItemWidth = Math.max(this.maxItemWidth, a.itemWidth); this.totalItemWidth += a.itemWidth; this.itemHeight = a.itemHeight = Math.round(a.legendItemHeight || b.height || this.symbolHeight)
            }, layoutItem: function (a) {
                var b = this.options, c = this.padding, e = "horizontal" === b.layout, d = a.itemHeight, f = b.itemMarginBottom || 0, g = this.itemMarginTop, l = e ? r(b.itemDistance, 20) : 0, m = b.width, q = m || this.chart.spacingBox.width - 2 * c - b.x, b = b.alignColumns &&
                    this.totalItemWidth > q ? this.maxItemWidth : a.itemWidth; e && this.itemX - c + b > q && (this.itemX = c, this.itemY += g + this.lastLineHeight + f, this.lastLineHeight = 0); this.lastItemY = g + this.itemY + f; this.lastLineHeight = Math.max(d, this.lastLineHeight); a._legendItemPos = [this.itemX, this.itemY]; e ? this.itemX += b : (this.itemY += g + d + f, this.lastLineHeight = d); this.offsetWidth = m || Math.max((e ? this.itemX - c - (a.checkbox ? 0 : l) : b) + c, this.offsetWidth)
            }, getAllItems: function () {
                var a = []; g(this.chart.series, function (b) {
                    var c = b && b.options; b && r(c.showInLegend,
                        p(c.linkedTo) ? !1 : void 0, !0) && (a = a.concat(b.legendItems || ("point" === c.legendType ? b.data : b)))
                }); d(this, "afterGetAllItems", { allItems: a }); return a
            }, getAlignment: function () { var a = this.options; return this.proximate ? a.align.charAt(0) + "tv" : a.floating ? "" : a.align.charAt(0) + a.verticalAlign.charAt(0) + a.layout.charAt(0) }, adjustMargins: function (a, b) {
                var c = this.chart, e = this.options, d = this.getAlignment(); d && g([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function (f, g) {
                    f.test(d) && !p(a[g]) && (c[x[g]] =
                        Math.max(c[x[g]], c.legend[(g + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][g] * e[g % 2 ? "x" : "y"] + r(e.margin, 12) + b[g] + (0 === g && void 0 !== c.options.title.margin ? c.titleOffset + c.options.title.margin : 0)))
                })
            }, proximatePositions: function () {
                var c = this.chart, b = [], d = "left" === this.options.align; g(this.allItems, function (e) {
                    var f, g; f = d; e.xAxis && e.points && (e.xAxis.options.reversed && (f = !f), f = a.find(f ? e.points : e.points.slice(0).reverse(), function (b) { return a.isNumber(b.plotY) }), g = e.legendGroup.getBBox().height, b.push({
                        target: e.visible ?
                            (f ? f.plotY : e.xAxis.height) - .3 * g : c.plotHeight, size: g, item: e
                    }))
                }, this); a.distribute(b, c.plotHeight); g(b, function (a) { a.item._legendItemPos[1] = c.plotTop - c.spacing[0] + a.pos })
            }, render: function () {
                var a = this.chart, b = a.renderer, d = this.group, e, f, l, u = this.box, A = this.options, z = this.padding; this.itemX = z; this.itemY = this.initialItemY; this.lastItemY = this.offsetWidth = 0; d || (this.group = d = b.g("legend").attr({ zIndex: 7 }).add(), this.contentGroup = b.g().attr({ zIndex: 1 }).add(d), this.scrollGroup = b.g().add(this.contentGroup));
                this.renderTitle(); e = this.getAllItems(); c(e, function (a, b) { return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0) }); A.reversed && e.reverse(); this.allItems = e; this.display = f = !!e.length; this.itemHeight = this.totalItemWidth = this.maxItemWidth = this.lastLineHeight = 0; g(e, this.renderItem, this); g(e, this.layoutItem, this); e = (A.width || this.offsetWidth) + z; l = this.lastItemY + this.lastLineHeight + this.titleHeight; l = this.handleOverflow(l); l += z; u || (this.box = u = b.rect().addClass("highcharts-legend-box").attr({ r: A.borderRadius }).add(d),
                    u.isNew = !0); 0 < e && 0 < l && (u[u.isNew ? "attr" : "animate"](u.crisp.call({}, { x: 0, y: 0, width: e, height: l }, u.strokeWidth())), u.isNew = !1); u[f ? "show" : "hide"](); "none" === d.getStyle("display") && (e = l = 0); this.legendWidth = e; this.legendHeight = l; f && (b = a.spacingBox, /(lth|ct|rth)/.test(this.getAlignment()) && (b = v(b, { y: b.y + a.titleOffset + a.options.title.margin })), d.align(v(A, { width: e, height: l, verticalAlign: this.proximate ? "top" : A.verticalAlign }), !0, b)); this.proximate || this.positionItems()
            }, handleOverflow: function (a) {
                var b = this,
                    c = this.chart, e = c.renderer, d = this.options, f = d.y, l = this.padding, c = c.spacingBox.height + ("top" === d.verticalAlign ? -f : f) - l, f = d.maxHeight, m, u = this.clipRect, q = d.navigation, C = r(q.animation, !0), G = q.arrowSize || 12, I = this.nav, t = this.pages, k, y = this.allItems, p = function (a) { "number" === typeof a ? u.attr({ height: a }) : u && (b.clipRect = u.destroy(), b.contentGroup.clip()); b.contentGroup.div && (b.contentGroup.div.style.clip = a ? "rect(" + l + "px,9999px," + (l + a) + "px,0)" : "auto") }; "horizontal" !== d.layout || "middle" === d.verticalAlign || d.floating ||
                        (c /= 2); f && (c = Math.min(c, f)); t.length = 0; a > c && !1 !== q.enabled ? (this.clipHeight = m = Math.max(c - 20 - this.titleHeight - l, 0), this.currentPage = r(this.currentPage, 1), this.fullHeight = a, g(y, function (a, b) { var c = a._legendItemPos[1], h = Math.round(a.legendItem.getBBox().height), e = t.length; if (!e || c - t[e - 1] > m && (k || c) !== t[e - 1]) t.push(k || c), e++; a.pageIx = e - 1; k && (y[b - 1].pageIx = e - 1); b === y.length - 1 && c + h - t[e - 1] > m && (t.push(c), a.pageIx = e); c !== k && (k = c) }), u || (u = b.clipRect = e.clipRect(0, l, 9999, 0), b.contentGroup.clip(u)), p(m), I || (this.nav =
                            I = e.g().attr({ zIndex: 1 }).add(this.group), this.up = e.symbol("triangle", 0, 0, G, G).on("click", function () { b.scroll(-1, C) }).add(I), this.pager = e.text("", 15, 10).addClass("highcharts-legend-navigation").add(I), this.down = e.symbol("triangle-down", 0, 0, G, G).on("click", function () { b.scroll(1, C) }).add(I)), b.scroll(0), a = c) : I && (p(), this.nav = I.destroy(), this.scrollGroup.attr({ translateY: 1 }), this.clipHeight = 0); return a
            }, scroll: function (a, b) {
                var c = this.pages, e = c.length; a = this.currentPage + a; var d = this.clipHeight, g = this.pager,
                    l = this.padding; a > e && (a = e); 0 < a && (void 0 !== b && f(b, this.chart), this.nav.attr({ translateX: l, translateY: d + this.padding + 7 + this.titleHeight, visibility: "visible" }), this.up.attr({ "class": 1 === a ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active" }), g.attr({ text: a + "/" + e }), this.down.attr({ x: 18 + this.pager.getBBox().width, "class": a === e ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active" }), this.scrollOffset = -c[a - 1] + this.initialItemY, this.scrollGroup.animate({ translateY: this.scrollOffset }),
                        this.currentPage = a, this.positionCheckboxes())
            }
        }; a.LegendSymbolMixin = {
            drawRectangle: function (a, b) { var c = a.symbolHeight, e = a.options.squareSymbol; b.legendSymbol = this.chart.renderer.rect(e ? (a.symbolWidth - c) / 2 : 0, a.baseline - c + 1, e ? c : a.symbolWidth, c, r(a.options.symbolRadius, c / 2)).addClass("highcharts-point").attr({ zIndex: 3 }).add(b.legendGroup) }, drawLineMarker: function (a) {
                var b = this.options.marker, c, e = a.symbolWidth, d = a.symbolHeight; c = d / 2; var f = this.chart.renderer, g = this.legendGroup; a = a.baseline - Math.round(.3 *
                    a.fontMetrics.b); this.legendLine = f.path(["M", 0, a, "L", e, a]).addClass("highcharts-graph").attr({}).add(g); b && !1 !== b.enabled && e && (c = Math.min(r(b.radius, c), c), 0 === this.symbol.indexOf("url") && (b = v(b, { width: d, height: d }), c = 0), this.legendSymbol = b = f.symbol(this.symbol, e / 2 - c, a - c, 2 * c, 2 * c, b).addClass("highcharts-point").add(g), b.isMarker = !0)
            }
        }; (/Trident\/7\.0/.test(u.navigator.userAgent) || t) && l(a.Legend.prototype, "positionItem", function (a, b) { var c = this, e = function () { b._legendItemPos && a.call(c, b) }; e(); setTimeout(e) })
    })(L);
    (function (a) {
        var B = a.addEvent, E = a.animObject, F = a.attr, p = a.doc, g = a.Axis, d = a.createElement, t = a.defaultOptions, x = a.discardElement, v = a.charts, r = a.defined, f = a.each, c = a.extend, u = a.find, l = a.fireEvent, m = a.grep, b = a.isNumber, n = a.isObject, e = a.isString, D = a.Legend, w = a.marginNames, H = a.merge, A = a.objectEach, z = a.Pointer, q = a.pick, C = a.pInt, G = a.removeEvent, I = a.seriesTypes, J = a.splat, k = a.syncTimeout, y = a.win, O = a.Chart = function () { this.getArgs.apply(this, arguments) }; a.chart = function (a, b, c) { return new O(a, b, c) }; c(O.prototype,
            {
                callbacks: [], getArgs: function () { var a = [].slice.call(arguments); if (e(a[0]) || a[0].nodeName) this.renderTo = a.shift(); this.init(a[0], a[1]) }, init: function (b, c) {
                    var e, h, d = b.series, f = b.plotOptions || {}; l(this, "init", { args: arguments }, function () {
                        b.series = null; e = H(t, b); for (h in e.plotOptions) e.plotOptions[h].tooltip = f[h] && H(f[h].tooltip) || void 0; e.tooltip.userOptions = b.chart && b.chart.forExport && b.tooltip.userOptions || b.tooltip; e.series = b.series = d; this.userOptions = b; var k = e.chart, q = k.events; this.margin = []; this.spacing =
                            []; this.bounds = { h: {}, v: {} }; this.labelCollectors = []; this.callback = c; this.isResizing = 0; this.options = e; this.axes = []; this.series = []; this.time = b.time && a.keys(b.time).length ? new a.Time(b.time) : a.time; this.hasCartesianSeries = k.showAxes; var g = this; g.index = v.length; v.push(g); a.chartCount++; q && A(q, function (a, b) { B(g, b, a) }); g.xAxis = []; g.yAxis = []; g.pointCount = g.colorCounter = g.symbolCounter = 0; l(g, "afterInit"); g.firstRender()
                    })
                }, initSeries: function (b) {
                    var c = this.options.chart; (c = I[b.type || c.type || c.defaultSeriesType]) ||
                        a.error(17, !0); c = new c; c.init(this, b); return c
                }, orderSeries: function (a) { var b = this.series; for (a = a || 0; a < b.length; a++)b[a] && (b[a].index = a, b[a].name = b[a].getName()) }, isInsidePlot: function (a, b, c) { var e = c ? b : a; a = c ? a : b; return 0 <= e && e <= this.plotWidth && 0 <= a && a <= this.plotHeight }, redraw: function (b) {
                    l(this, "beforeRedraw"); var e = this.axes, h = this.series, d = this.pointer, k = this.legend, q = this.userOptions.legend, g = this.isDirtyLegend, C, G, m = this.hasCartesianSeries, n = this.isDirtyBox, u, y = this.renderer, w = y.isHidden(), z =
                        []; this.setResponsive && this.setResponsive(!1); a.setAnimation(b, this); w && this.temporaryDisplay(); this.layOutTitles(); for (b = h.length; b--;)if (u = h[b], u.options.stacking && (C = !0, u.isDirty)) { G = !0; break } if (G) for (b = h.length; b--;)u = h[b], u.options.stacking && (u.isDirty = !0); f(h, function (a) { a.isDirty && ("point" === a.options.legendType ? (a.updateTotals && a.updateTotals(), g = !0) : q && (q.labelFormatter || q.labelFormat) && (g = !0)); a.isDirtyData && l(a, "updatedData") }); g && k && k.options.enabled && (k.render(), this.isDirtyLegend = !1);
                    C && this.getStacks(); m && f(e, function (a) { a.updateNames(); a.updateYNames && a.updateYNames(); a.setScale() }); this.getMargins(); m && (f(e, function (a) { a.isDirty && (n = !0) }), f(e, function (a) { var b = a.min + "," + a.max; a.extKey !== b && (a.extKey = b, z.push(function () { l(a, "afterSetExtremes", c(a.eventArgs, a.getExtremes())); delete a.eventArgs })); (n || C) && a.redraw() })); n && this.drawChartBox(); l(this, "predraw"); f(h, function (a) { (n || a.isDirty) && a.visible && a.redraw(); a.isDirtyData = !1 }); d && d.reset(!0); y.draw(); l(this, "redraw"); l(this,
                        "render"); w && this.temporaryDisplay(!0); f(z, function (a) { a.call() })
                }, get: function (a) { function b(b) { return b.id === a || b.options && b.options.id === a } var c, e = this.series, h; c = u(this.axes, b) || u(this.series, b); for (h = 0; !c && h < e.length; h++)c = u(e[h].points || [], b); return c }, getAxes: function () { var a = this, b = this.options, c = b.xAxis = J(b.xAxis || {}), b = b.yAxis = J(b.yAxis || {}); l(this, "getAxes"); f(c, function (a, b) { a.index = b; a.isX = !0 }); f(b, function (a, b) { a.index = b }); c = c.concat(b); f(c, function (b) { new g(a, b) }); l(this, "afterGetAxes") },
                getSelectedPoints: function () { var a = []; f(this.series, function (b) { a = a.concat(m(b.data || [], function (a) { return a.selected })) }); return a }, getSelectedSeries: function () { return m(this.series, function (a) { return a.selected }) }, setTitle: function (a, b, c) {
                    var e = this, h = e.options, d; d = h.title = H(h.title, a); h = h.subtitle = H(h.subtitle, b); f([["title", a, d], ["subtitle", b, h]], function (a, b) {
                        var c = a[0], h = e[c], d = a[1]; a = a[2]; h && d && (e[c] = h = h.destroy()); a && !h && (e[c] = e.renderer.text(a.text, 0, 0, a.useHTML).attr({
                            align: a.align, "class": "highcharts-" +
                                c, zIndex: a.zIndex || 4
                        }).add(), e[c].update = function (a) { e.setTitle(!b && a, b && a) })
                    }); e.layOutTitles(c)
                }, layOutTitles: function (a) {
                    var b = 0, e, h = this.renderer, d = this.spacingBox; f(["title", "subtitle"], function (a) { var e = this[a], f = this.options[a]; a = "title" === a ? -3 : f.verticalAlign ? 0 : b + 2; var k; e && (k = h.fontMetrics(k, e).b, e.css({ width: (f.width || d.width + f.widthAdjust) + "px" }).align(c({ y: a + k }, f), !1, "spacingBox"), f.floating || f.verticalAlign || (b = Math.ceil(b + e.getBBox(f.useHTML).height))) }, this); e = this.titleOffset !== b;
                    this.titleOffset = b; !this.isDirtyBox && e && (this.isDirtyBox = this.isDirtyLegend = e, this.hasRendered && q(a, !0) && this.isDirtyBox && this.redraw())
                }, getChartSize: function () { var b = this.options.chart, c = b.width, b = b.height, e = this.renderTo; r(c) || (this.containerWidth = a.getStyle(e, "width")); r(b) || (this.containerHeight = a.getStyle(e, "height")); this.chartWidth = Math.max(0, c || this.containerWidth || 600); this.chartHeight = Math.max(0, a.relativeLength(b, this.chartWidth) || (1 < this.containerHeight ? this.containerHeight : 400)) }, temporaryDisplay: function (b) {
                    var c =
                        this.renderTo; if (b) for (; c && c.style;)c.hcOrigStyle && (a.css(c, c.hcOrigStyle), delete c.hcOrigStyle), c.hcOrigDetached && (p.body.removeChild(c), c.hcOrigDetached = !1), c = c.parentNode; else for (; c && c.style;) {
                            p.body.contains(c) || c.parentNode || (c.hcOrigDetached = !0, p.body.appendChild(c)); if ("none" === a.getStyle(c, "display", !1) || c.hcOricDetached) c.hcOrigStyle = { display: c.style.display, height: c.style.height, overflow: c.style.overflow }, b = { display: "block", overflow: "hidden" }, c !== this.renderTo && (b.height = 0), a.css(c, b),
                                c.offsetWidth || c.style.setProperty("display", "block", "important"); c = c.parentNode; if (c === p.body) break
                        }
                }, setClassName: function (a) { this.container.className = "highcharts-container " + (a || "") }, getContainer: function () {
                    var c, f = this.options, k = f.chart, q, g; c = this.renderTo; var G = a.uniqueKey(), m; c || (this.renderTo = c = k.renderTo); e(c) && (this.renderTo = c = p.getElementById(c)); c || a.error(13, !0); q = C(F(c, "data-highcharts-chart")); b(q) && v[q] && v[q].hasRendered && v[q].destroy(); F(c, "data-highcharts-chart", this.index); c.innerHTML =
                        ""; k.skipClone || c.offsetWidth || this.temporaryDisplay(); this.getChartSize(); q = this.chartWidth; g = this.chartHeight; this.container = c = d("div", { id: G }, void 0, c); this._cursor = c.style.cursor; this.renderer = new (a[k.renderer] || a.Renderer)(c, q, g, null, k.forExport, f.exporting && f.exporting.allowHTML); this.setClassName(k.className); for (m in f.defs) this.renderer.definition(f.defs[m]); this.renderer.chartIndex = this.index; l(this, "afterGetContainer")
                }, getMargins: function (a) {
                    var b = this.spacing, c = this.margin, e = this.titleOffset;
                    this.resetMargins(); e && !r(c[0]) && (this.plotTop = Math.max(this.plotTop, e + this.options.title.margin + b[0])); this.legend && this.legend.display && this.legend.adjustMargins(c, b); l(this, "getMargins"); a || this.getAxisMargins()
                }, getAxisMargins: function () { var a = this, b = a.axisOffset = [0, 0, 0, 0], c = a.margin; a.hasCartesianSeries && f(a.axes, function (a) { a.visible && a.getOffset() }); f(w, function (e, d) { r(c[d]) || (a[e] += b[d]) }); a.setChartSize() }, reflow: function (b) {
                    var c = this, e = c.options.chart, d = c.renderTo, h = r(e.width) && r(e.height),
                        f = e.width || a.getStyle(d, "width"), e = e.height || a.getStyle(d, "height"), d = b ? b.target : y; if (!h && !c.isPrinting && f && e && (d === y || d === p)) { if (f !== c.containerWidth || e !== c.containerHeight) a.clearTimeout(c.reflowTimeout), c.reflowTimeout = k(function () { c.container && c.setSize(void 0, void 0, !1) }, b ? 100 : 0); c.containerWidth = f; c.containerHeight = e }
                }, setReflow: function (a) {
                    var b = this; !1 === a || this.unbindReflow ? !1 === a && this.unbindReflow && (this.unbindReflow = this.unbindReflow()) : (this.unbindReflow = B(y, "resize", function (a) { b.reflow(a) }),
                        B(this, "destroy", this.unbindReflow))
                }, setSize: function (b, c, e) {
                    var d = this, h = d.renderer; d.isResizing += 1; a.setAnimation(e, d); d.oldChartHeight = d.chartHeight; d.oldChartWidth = d.chartWidth; void 0 !== b && (d.options.chart.width = b); void 0 !== c && (d.options.chart.height = c); d.getChartSize(); d.setChartSize(!0); h.setSize(d.chartWidth, d.chartHeight, e); f(d.axes, function (a) { a.isDirty = !0; a.setScale() }); d.isDirtyLegend = !0; d.isDirtyBox = !0; d.layOutTitles(); d.getMargins(); d.redraw(e); d.oldChartHeight = null; l(d, "resize"); k(function () {
                        d &&
                            l(d, "endResize", null, function () { --d.isResizing })
                    }, E(void 0).duration)
                }, setChartSize: function (a) {
                    var b = this.inverted, c = this.renderer, e = this.chartWidth, d = this.chartHeight, h = this.options.chart, k = this.spacing, q = this.clipOffset, g, C, G, m; this.plotLeft = g = Math.round(this.plotLeft); this.plotTop = C = Math.round(this.plotTop); this.plotWidth = G = Math.max(0, Math.round(e - g - this.marginRight)); this.plotHeight = m = Math.max(0, Math.round(d - C - this.marginBottom)); this.plotSizeX = b ? m : G; this.plotSizeY = b ? G : m; this.plotBorderWidth =
                        h.plotBorderWidth || 0; this.spacingBox = c.spacingBox = { x: k[3], y: k[0], width: e - k[3] - k[1], height: d - k[0] - k[2] }; this.plotBox = c.plotBox = { x: g, y: C, width: G, height: m }; e = 2 * Math.floor(this.plotBorderWidth / 2); b = Math.ceil(Math.max(e, q[3]) / 2); c = Math.ceil(Math.max(e, q[0]) / 2); this.clipBox = { x: b, y: c, width: Math.floor(this.plotSizeX - Math.max(e, q[1]) / 2 - b), height: Math.max(0, Math.floor(this.plotSizeY - Math.max(e, q[2]) / 2 - c)) }; a || f(this.axes, function (a) { a.setAxisSize(); a.setAxisTranslation() }); l(this, "afterSetChartSize", { skipAxes: a })
                },
                resetMargins: function () { var a = this, b = a.options.chart; f(["margin", "spacing"], function (c) { var e = b[c], d = n(e) ? e : [e, e, e, e]; f(["Top", "Right", "Bottom", "Left"], function (e, h) { a[c][h] = q(b[c + e], d[h]) }) }); f(w, function (b, c) { a[b] = q(a.margin[c], a.spacing[c]) }); a.axisOffset = [0, 0, 0, 0]; a.clipOffset = [0, 0, 0, 0] }, drawChartBox: function () {
                    var a = this.options.chart, b = this.renderer, c = this.chartWidth, e = this.chartHeight, d = this.chartBackground, f = this.plotBackground, k = this.plotBorder, q, g, C = this.plotLeft, G = this.plotTop, m = this.plotWidth,
                        n = this.plotHeight, u = this.plotBox, y = this.clipRect, w = this.clipBox, z = "animate"; d || (this.chartBackground = d = b.rect().addClass("highcharts-background").add(), z = "attr"); q = g = d.strokeWidth(); d[z]({ x: g / 2, y: g / 2, width: c - g - q % 2, height: e - g - q % 2, r: a.borderRadius }); z = "animate"; f || (z = "attr", this.plotBackground = f = b.rect().addClass("highcharts-plot-background").add()); f[z](u); y ? y.animate({ width: w.width, height: w.height }) : this.clipRect = b.clipRect(w); z = "animate"; k || (z = "attr", this.plotBorder = k = b.rect().addClass("highcharts-plot-border").attr({ zIndex: 1 }).add());
                    k[z](k.crisp({ x: C, y: G, width: m, height: n }, -k.strokeWidth())); this.isDirtyBox = !1; l(this, "afterDrawChartBox")
                }, propFromSeries: function () { var a = this, b = a.options.chart, c, e = a.options.series, d, k; f(["inverted", "angular", "polar"], function (h) { c = I[b.type || b.defaultSeriesType]; k = b[h] || c && c.prototype[h]; for (d = e && e.length; !k && d--;)(c = I[e[d].type]) && c.prototype[h] && (k = !0); a[h] = k }) }, linkSeries: function () {
                    var a = this, b = a.series; f(b, function (a) { a.linkedSeries.length = 0 }); f(b, function (b) {
                        var c = b.options.linkedTo; e(c) &&
                            (c = ":previous" === c ? a.series[b.index - 1] : a.get(c)) && c.linkedParent !== b && (c.linkedSeries.push(b), b.linkedParent = c, b.visible = q(b.options.visible, c.options.visible, b.visible))
                    }); l(this, "afterLinkSeries")
                }, renderSeries: function () { f(this.series, function (a) { a.translate(); a.render() }) }, renderLabels: function () { var a = this, b = a.options.labels; b.items && f(b.items, function (e) { var d = c(b.style, e.style), h = C(d.left) + a.plotLeft, f = C(d.top) + a.plotTop + 12; delete d.left; delete d.top; a.renderer.text(e.html, h, f).attr({ zIndex: 2 }).css(d).add() }) },
                render: function () {
                    var a = this.axes, b = this.renderer, c = this.options, e, d, k; this.setTitle(); this.legend = new D(this, c.legend); this.getStacks && this.getStacks(); this.getMargins(!0); this.setChartSize(); c = this.plotWidth; e = this.plotHeight = Math.max(this.plotHeight - 21, 0); f(a, function (a) { a.setScale() }); this.getAxisMargins(); d = 1.1 < c / this.plotWidth; k = 1.05 < e / this.plotHeight; if (d || k) f(a, function (a) { (a.horiz && d || !a.horiz && k) && a.setTickInterval(!0) }), this.getMargins(); this.drawChartBox(); this.hasCartesianSeries && f(a,
                        function (a) { a.visible && a.render() }); this.seriesGroup || (this.seriesGroup = b.g("series-group").attr({ zIndex: 3 }).add()); this.renderSeries(); this.renderLabels(); this.addCredits(); this.setResponsive && this.setResponsive(); this.hasRendered = !0
                }, addCredits: function (a) {
                    var b = this; a = H(!0, this.options.credits, a); a.enabled && !this.credits && (this.credits = this.renderer.text(a.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click", function () { a.href && (y.location.href = a.href) }).attr({
                        align: a.position.align,
                        zIndex: 8
                    }).add().align(a.position), this.credits.update = function (a) { b.credits = b.credits.destroy(); b.addCredits(a) })
                }, destroy: function () {
                    var b = this, c = b.axes, e = b.series, d = b.container, k, q = d && d.parentNode; l(b, "destroy"); b.renderer.forExport ? a.erase(v, b) : v[b.index] = void 0; a.chartCount--; b.renderTo.removeAttribute("data-highcharts-chart"); G(b); for (k = c.length; k--;)c[k] = c[k].destroy(); this.scroller && this.scroller.destroy && this.scroller.destroy(); for (k = e.length; k--;)e[k] = e[k].destroy(); f("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "),
                        function (a) { var c = b[a]; c && c.destroy && (b[a] = c.destroy()) }); d && (d.innerHTML = "", G(d), q && x(d)); A(b, function (a, c) { delete b[c] })
                }, firstRender: function () { var a = this, b = a.options; if (!a.isReadyToRender || a.isReadyToRender()) { a.getContainer(); a.resetMargins(); a.setChartSize(); a.propFromSeries(); a.getAxes(); f(b.series || [], function (b) { a.initSeries(b) }); a.linkSeries(); l(a, "beforeRender"); z && (a.pointer = new z(a, b)); a.render(); if (!a.renderer.imgCount && a.onload) a.onload(); a.temporaryDisplay(!0) } }, onload: function () {
                    f([this.callback].concat(this.callbacks),
                        function (a) { a && void 0 !== this.index && a.apply(this, [this]) }, this); l(this, "load"); l(this, "render"); r(this.index) && this.setReflow(this.options.chart.reflow); this.onload = null
                }
            })
    })(L); (function (a) {
        var B = a.addEvent, E = a.Chart, F = a.each; B(E, "afterSetChartSize", function (p) {
            var g = this.options.chart.scrollablePlotArea; (g = g && g.minWidth) && !this.renderer.forExport && (this.scrollablePixels = g = Math.max(0, g - this.chartWidth)) && (this.plotWidth += g, this.clipBox.width += g, p.skipAxes || F(this.axes, function (d) {
                1 === d.side ? d.getPlotLinePath =
                    function () { var g = this.right, p; this.right = g - d.chart.scrollablePixels; p = a.Axis.prototype.getPlotLinePath.apply(this, arguments); this.right = g; return p } : (d.setAxisSize(), d.setAxisTranslation())
            }))
        }); B(E, "render", function () { this.scrollablePixels ? (this.setUpScrolling && this.setUpScrolling(), this.applyFixed()) : this.fixedDiv && this.applyFixed() }); E.prototype.setUpScrolling = function () {
            this.scrollingContainer = a.createElement("div", { className: "highcharts-scrolling" }, { overflowX: "auto", WebkitOverflowScrolling: "touch" },
                this.renderTo); this.innerContainer = a.createElement("div", { className: "highcharts-inner-container" }, null, this.scrollingContainer); this.innerContainer.appendChild(this.container); this.setUpScrolling = null
        }; E.prototype.applyFixed = function () {
            var p = this.container, g, d, t = !this.fixedDiv; t && (this.fixedDiv = a.createElement("div", { className: "highcharts-fixed" }, { position: "absolute", overflow: "hidden", pointerEvents: "none", zIndex: 2 }, null, !0), this.renderTo.insertBefore(this.fixedDiv, this.renderTo.firstChild), this.fixedRenderer =
                g = new a.Renderer(this.fixedDiv, 0, 0), this.scrollableMask = g.path().attr({ fill: a.color(this.options.chart.backgroundColor || "#fff").setOpacity(.85).get(), zIndex: -1 }).addClass("highcharts-scrollable-mask").add(), a.each([this.inverted ? ".highcharts-xaxis" : ".highcharts-yaxis", this.inverted ? ".highcharts-xaxis-labels" : ".highcharts-yaxis-labels", ".highcharts-contextbutton", ".highcharts-credits", ".highcharts-legend", ".highcharts-subtitle", ".highcharts-title", ".highcharts-legend-checkbox"], function (d) {
                    a.each(p.querySelectorAll(d),
                        function (a) { (a.namespaceURI === g.SVG_NS ? g.box : g.box.parentNode).appendChild(a); a.style.pointerEvents = "auto" })
                })); this.fixedRenderer.setSize(this.chartWidth, this.chartHeight); d = this.chartWidth + this.scrollablePixels; a.stop(this.container); this.container.style.width = d + "px"; this.renderer.boxWrapper.attr({ width: d, height: this.chartHeight, viewBox: [0, 0, d, this.chartHeight].join(" ") }); this.chartBackground.attr({ width: d }); t && (d = this.options.chart.scrollablePlotArea, d.scrollPositionX && (this.scrollingContainer.scrollLeft =
                    this.scrollablePixels * d.scrollPositionX)); t = this.axisOffset; d = this.plotTop - t[0] - 1; var t = this.plotTop + this.plotHeight + t[2], x = this.plotLeft + this.plotWidth - this.scrollablePixels; this.scrollableMask.attr({ d: this.scrollablePixels ? ["M", 0, d, "L", this.plotLeft - 1, d, "L", this.plotLeft - 1, t, "L", 0, t, "Z", "M", x, d, "L", this.chartWidth, d, "L", this.chartWidth, t, "L", x, t, "Z"] : ["M", 0, 0] })
        }
    })(L); (function (a) {
        var B, E = a.each, F = a.extend, p = a.erase, g = a.fireEvent, d = a.format, t = a.isArray, x = a.isNumber, v = a.pick, r = a.uniqueKey, f = a.defined,
            c = a.removeEvent; a.Point = B = function () { }; a.Point.prototype = {
                init: function (a, c, d) { var b = a.chart.options.chart.colorCount; this.series = a; this.applyOptions(c, d); this.id = f(this.id) ? this.id : r(); a.options.colorByPoint ? (c = a.colorCounter, a.colorCounter++, a.colorCounter === b && (a.colorCounter = 0)) : c = a.colorIndex; this.colorIndex = v(this.colorIndex, c); a.chart.pointCount++; g(this, "afterInit"); return this }, applyOptions: function (a, c) {
                    var d = this.series, b = d.options.pointValKey || d.pointValKey; a = B.prototype.optionsToObject.call(this,
                        a); F(this, a); this.options = this.options ? F(this.options, a) : a; a.group && delete this.group; a.dataLabels && delete this.dataLabels; b && (this.y = this[b]); this.isNull = v(this.isValid && !this.isValid(), null === this.x || !x(this.y, !0)); this.selected && (this.state = "select"); "name" in this && void 0 === c && d.xAxis && d.xAxis.hasNames && (this.x = d.xAxis.nameToX(this)); void 0 === this.x && d && (this.x = void 0 === c ? d.autoIncrement(this) : c); return this
                }, setNestedProperty: function (c, d, f) {
                    f = f.split("."); a.reduce(f, function (b, c, e, f) {
                        b[c] = f.length -
                            1 === e ? d : a.isObject(b[c], !0) ? b[c] : {}; return b[c]
                    }, c); return c
                }, optionsToObject: function (c) {
                    var d = {}, f = this.series, b = f.options.keys, g = b || f.pointArrayMap || ["y"], e = g.length, u = 0, w = 0; if (x(c) || null === c) d[g[0]] = c; else if (t(c)) for (!b && c.length > e && (f = typeof c[0], "string" === f ? d.name = c[0] : "number" === f && (d.x = c[0]), u++); w < e;)b && void 0 === c[u] || (0 < g[w].indexOf(".") ? a.Point.prototype.setNestedProperty(d, c[u], g[w]) : d[g[w]] = c[u]), u++, w++; else "object" === typeof c && (d = c, c.dataLabels && (f._hasPointLabels = !0), c.marker && (f._hasPointMarkers =
                        !0)); return d
                }, getClassName: function () { return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "") }, getZone: function () {
                    var a = this.series, c = a.zones, a = a.zoneAxis || "y", d = 0, b; for (b = c[d]; this[a] >=
                        b.value;)b = c[++d]; this.nonZonedColor || (this.nonZonedColor = this.color); this.color = b && b.color && !this.options.color ? b.color : this.nonZonedColor; return b
                }, destroy: function () { var a = this.series.chart, d = a.hoverPoints, f; a.pointCount--; d && (this.setState(), p(d, this), d.length || (a.hoverPoints = null)); if (this === a.hoverPoint) this.onMouseOut(); if (this.graphic || this.dataLabel || this.dataLabels) c(this), this.destroyElements(); this.legendItem && a.legend.destroyItem(this); for (f in this) this[f] = null }, destroyElements: function () {
                    for (var a =
                        ["graphic", "dataLabel", "dataLabelUpper", "connector", "shadowGroup"], c, d = 6; d--;)c = a[d], this[c] && (this[c] = this[c].destroy()); this.dataLabels && (E(this.dataLabels, function (a) { a.element && a.destroy() }), delete this.dataLabels); this.connectors && (E(this.connectors, function (a) { a.element && a.destroy() }), delete this.connectors)
                }, getLabelConfig: function () {
                    return {
                        x: this.category, y: this.y, color: this.color, colorIndex: this.colorIndex, key: this.name || this.category, series: this.series, point: this, percentage: this.percentage,
                        total: this.total || this.stackTotal
                    }
                }, tooltipFormatter: function (a) { var c = this.series, f = c.tooltipOptions, b = v(f.valueDecimals, ""), g = f.valuePrefix || "", e = f.valueSuffix || ""; E(c.pointArrayMap || ["y"], function (c) { c = "{point." + c; if (g || e) a = a.replace(RegExp(c + "}", "g"), g + c + "}" + e); a = a.replace(RegExp(c + "}", "g"), c + ":,." + b + "f}") }); return d(a, { point: this, series: this.series }, c.chart.time) }, firePointEvent: function (a, c, d) {
                    var b = this, f = this.series.options; (f.point.events[a] || b.options && b.options.events && b.options.events[a]) &&
                        this.importEvents(); "click" === a && f.allowPointSelect && (d = function (a) { b.select && b.select(null, a.ctrlKey || a.metaKey || a.shiftKey) }); g(this, a, c, d)
                }, visible: !0
            }
    })(L); (function (a) {
        var B = a.addEvent, E = a.animObject, F = a.arrayMax, p = a.arrayMin, g = a.correctFloat, d = a.defaultOptions, t = a.defined, x = a.each, v = a.erase, r = a.extend, f = a.fireEvent, c = a.grep, u = a.isArray, l = a.isNumber, m = a.isString, b = a.merge, n = a.objectEach, e = a.pick, D = a.removeEvent, w = a.splat, H = a.SVGElement, A = a.syncTimeout, z = a.win; a.Series = a.seriesType("line", null,
            {
                allowPointSelect: !1, showCheckbox: !1, animation: { duration: 1E3 }, events: {}, marker: { enabledThreshold: 2, radius: 4, states: { normal: { animation: !0 }, hover: { animation: { duration: 50 }, enabled: !0, radiusPlus: 2 } } }, point: { events: {} }, dataLabels: { align: "center", formatter: function () { return null === this.y ? "" : a.numberFormat(this.y, -1) }, verticalAlign: "bottom", x: 0, y: 0, padding: 5 }, cropThreshold: 300, pointRange: 0, softThreshold: !0, states: {
                    normal: { animation: !0 }, hover: { animation: { duration: 50 }, lineWidthPlus: 1, marker: {}, halo: { size: 10 } },
                    select: {}
                }, stickyTracking: !0, turboThreshold: 1E3, findNearestPointBy: "x"
            }, {
            isCartesian: !0, pointClass: a.Point, sorted: !0, requireSorting: !0, directTouch: !1, axisTypes: ["xAxis", "yAxis"], colorCounter: 0, parallelArrays: ["x", "y"], coll: "series", init: function (a, b) {
                var c = this, d, g = a.series, k; c.chart = a; c.options = b = c.setOptions(b); c.linkedSeries = []; c.bindAxes(); r(c, { name: b.name, state: "", visible: !1 !== b.visible, selected: !0 === b.selected }); d = b.events; n(d, function (a, b) { B(c, b, a) }); if (d && d.click || b.point && b.point.events &&
                    b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0; c.getColor(); c.getSymbol(); x(c.parallelArrays, function (a) { c[a + "Data"] = [] }); c.setData(b.data, !1); c.isCartesian && (a.hasCartesianSeries = !0); g.length && (k = g[g.length - 1]); c._i = e(k && k._i, -1) + 1; a.orderSeries(this.insert(g)); f(this, "afterInit")
            }, insert: function (a) {
                var b = this.options.index, c; if (l(b)) { for (c = a.length; c--;)if (b >= e(a[c].options.index, a[c]._i)) { a.splice(c + 1, 0, this); break } -1 === c && a.unshift(this); c += 1 } else a.push(this); return e(c, a.length -
                    1)
            }, bindAxes: function () { var b = this, c = b.options, e = b.chart, d; x(b.axisTypes || [], function (f) { x(e[f], function (a) { d = a.options; if (c[f] === d.index || void 0 !== c[f] && c[f] === d.id || void 0 === c[f] && 0 === d.index) b.insert(a.series), b[f] = a, a.isDirty = !0 }); b[f] || b.optionalAxis === f || a.error(18, !0) }) }, updateParallelArrays: function (a, b) {
                var c = a.series, e = arguments, d = l(b) ? function (e) { var d = "y" === e && c.toYData ? c.toYData(a) : a[e]; c[e + "Data"][b] = d } : function (a) { Array.prototype[b].apply(c[a + "Data"], Array.prototype.slice.call(e, 2)) };
                x(c.parallelArrays, d)
            }, autoIncrement: function () { var a = this.options, b = this.xIncrement, c, d = a.pointIntervalUnit, f = this.chart.time, b = e(b, a.pointStart, 0); this.pointInterval = c = e(this.pointInterval, a.pointInterval, 1); d && (a = new f.Date(b), "day" === d ? f.set("Date", a, f.get("Date", a) + c) : "month" === d ? f.set("Month", a, f.get("Month", a) + c) : "year" === d && f.set("FullYear", a, f.get("FullYear", a) + c), c = a.getTime() - b); this.xIncrement = b + c; return b }, setOptions: function (a) {
                var c = this.chart, g = c.options, q = g.plotOptions, l = (c.userOptions ||
                    {}).plotOptions || {}, k = q[this.type]; this.userOptions = a; c = b(k, q.series, a); this.tooltipOptions = b(d.tooltip, d.plotOptions.series && d.plotOptions.series.tooltip, d.plotOptions[this.type].tooltip, g.tooltip.userOptions, q.series && q.series.tooltip, q[this.type].tooltip, a.tooltip); this.stickyTracking = e(a.stickyTracking, l[this.type] && l[this.type].stickyTracking, l.series && l.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : c.stickyTracking); null === k.marker && delete c.marker; this.zoneAxis =
                        c.zoneAxis; a = this.zones = (c.zones || []).slice(); !c.negativeColor && !c.negativeFillColor || c.zones || a.push({ value: c[this.zoneAxis + "Threshold"] || c.threshold || 0, className: "highcharts-negative" }); a.length && t(a[a.length - 1].value) && a.push({}); f(this, "afterSetOptions", { options: c }); return c
            }, getName: function () { return this.name || "Series " + (this.index + 1) }, getCyclic: function (a, b, c) {
                var d, f = this.chart, k = this.userOptions, g = a + "Index", q = a + "Counter", h = c ? c.length : e(f.options.chart[a + "Count"], f[a + "Count"]); b || (d = e(k[g],
                    k["_" + g]), t(d) || (f.series.length || (f[q] = 0), k["_" + g] = d = f[q] % h, f[q] += 1), c && (b = c[d])); void 0 !== d && (this[g] = d); this[a] = b
            }, getColor: function () { this.getCyclic("color") }, getSymbol: function () { this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols) }, drawLegendSymbol: a.LegendSymbolMixin.drawLineMarker, updateData: function (b) {
                var c = this.options, e = this.points, d = [], f, k, g, q = this.requireSorting; x(b, function (b) {
                    var h; h = a.defined(b) && this.pointClass.prototype.optionsToObject.call({ series: this },
                        b).x; l(h) && (h = a.inArray(h, this.xData, g), -1 === h || e[h].touched ? d.push(b) : b !== c.data[h] ? (e[h].update(b, !1, null, !1), e[h].touched = !0, q && (g = h + 1)) : e[h] && (e[h].touched = !0), f = !0)
                }, this); if (f) for (b = e.length; b--;)k = e[b], k.touched || k.remove(!1), k.touched = !1; else if (b.length === e.length) x(b, function (a, b) { e[b].update && a !== c.data[b] && e[b].update(a, !1, null, !1) }); else return !1; x(d, function (a) { this.addPoint(a, !1) }, this); return !0
            }, setData: function (b, c, d, f) {
                var g = this, k = g.points, q = k && k.length || 0, C, h = g.options, n = g.chart,
                    w = null, G = g.xAxis, z = h.turboThreshold, t = this.xData, A = this.yData, p = (C = g.pointArrayMap) && C.length, r; b = b || []; C = b.length; c = e(c, !0); !1 !== f && C && q && !g.cropped && !g.hasGroupedData && g.visible && !g.isSeriesBoosting && (r = this.updateData(b)); if (!r) {
                        g.xIncrement = null; g.colorCounter = 0; x(this.parallelArrays, function (a) { g[a + "Data"].length = 0 }); if (z && C > z) {
                            for (d = 0; null === w && d < C;)w = b[d], d++; if (l(w)) for (d = 0; d < C; d++)t[d] = this.autoIncrement(), A[d] = b[d]; else if (u(w)) if (p) for (d = 0; d < C; d++)w = b[d], t[d] = w[0], A[d] = w.slice(1, p + 1); else for (d =
                                0; d < C; d++)w = b[d], t[d] = w[0], A[d] = w[1]; else a.error(12)
                        } else for (d = 0; d < C; d++)void 0 !== b[d] && (w = { series: g }, g.pointClass.prototype.applyOptions.apply(w, [b[d]]), g.updateParallelArrays(w, d)); A && m(A[0]) && a.error(14, !0); g.data = []; g.options.data = g.userOptions.data = b; for (d = q; d--;)k[d] && k[d].destroy && k[d].destroy(); G && (G.minRange = G.userMinRange); g.isDirty = n.isDirtyBox = !0; g.isDirtyData = !!k; d = !1
                    } "point" === h.legendType && (this.processData(), this.generatePoints()); c && n.redraw(d)
            }, processData: function (b) {
                var c = this.xData,
                    d = this.yData, e = c.length, f; f = 0; var k, g, q = this.xAxis, h, l = this.options; h = l.cropThreshold; var m = this.getExtremesFromAll || l.getExtremesFromAll, n = this.isCartesian, l = q && q.val2lin, w = q && q.isLog, u = this.requireSorting, z, A; if (n && !this.isDirty && !q.isDirty && !this.yAxis.isDirty && !b) return !1; q && (b = q.getExtremes(), z = b.min, A = b.max); n && this.sorted && !m && (!h || e > h || this.forceCrop) && (c[e - 1] < z || c[0] > A ? (c = [], d = []) : this.yData && (c[0] < z || c[e - 1] > A) && (f = this.cropData(this.xData, this.yData, z, A), c = f.xData, d = f.yData, f = f.start, k =
                        !0)); for (h = c.length || 1; --h;)e = w ? l(c[h]) - l(c[h - 1]) : c[h] - c[h - 1], 0 < e && (void 0 === g || e < g) ? g = e : 0 > e && u && (a.error(15), u = !1); this.cropped = k; this.cropStart = f; this.processedXData = c; this.processedYData = d; this.closestPointRange = g
            }, cropData: function (a, b, c, d, f) { var k = a.length, g = 0, q = k, h; f = e(f, this.cropShoulder, 1); for (h = 0; h < k; h++)if (a[h] >= c) { g = Math.max(0, h - f); break } for (c = h; c < k; c++)if (a[c] > d) { q = c + f; break } return { xData: a.slice(g, q), yData: b.slice(g, q), start: g, end: q } }, generatePoints: function () {
                var a = this.options, b = a.data,
                    c = this.data, d, e = this.processedXData, f = this.processedYData, g = this.pointClass, l = e.length, h = this.cropStart || 0, m, n = this.hasGroupedData, a = a.keys, u, z = [], A; c || n || (c = [], c.length = b.length, c = this.data = c); a && n && (this.options.keys = !1); for (A = 0; A < l; A++)m = h + A, n ? (u = (new g).init(this, [e[A]].concat(w(f[A]))), u.dataGroup = this.groupMap[A], u.dataGroup.options && (u.options = u.dataGroup.options, r(u, u.dataGroup.options))) : (u = c[m]) || void 0 === b[m] || (c[m] = u = (new g).init(this, b[m], e[A])), u && (u.index = m, z[A] = u); this.options.keys =
                        a; if (c && (l !== (d = c.length) || n)) for (A = 0; A < d; A++)A !== h || n || (A += l), c[A] && (c[A].destroyElements(), c[A].plotX = void 0); this.data = c; this.points = z
            }, getExtremes: function (a) {
                var b = this.yAxis, c = this.processedXData, d, e = [], f = 0; d = this.xAxis.getExtremes(); var g = d.min, q = d.max, h, m, n = this.requireSorting ? 1 : 0, w, A; a = a || this.stackedYData || this.processedYData || []; d = a.length; for (A = 0; A < d; A++)if (m = c[A], w = a[A], h = (l(w, !0) || u(w)) && (!b.positiveValuesOnly || w.length || 0 < w), m = this.getExtremesFromAll || this.options.getExtremesFromAll ||
                    this.cropped || (c[A + n] || m) >= g && (c[A - n] || m) <= q, h && m) if (h = w.length) for (; h--;)"number" === typeof w[h] && (e[f++] = w[h]); else e[f++] = w; this.dataMin = p(e); this.dataMax = F(e)
            }, translate: function () {
                this.processedXData || this.processData(); this.generatePoints(); var a = this.options, b = a.stacking, c = this.xAxis, d = c.categories, m = this.yAxis, k = this.points, n = k.length, w = !!this.modifyValue, h = a.pointPlacement, u = "between" === h || l(h), A = a.threshold, z = a.startFromThreshold ? A : 0, p, r, v, D, x = Number.MAX_VALUE; "between" === h && (h = .5); l(h) &&
                    (h *= e(a.pointRange || c.pointRange)); for (a = 0; a < n; a++) {
                        var H = k[a], B = H.x, E = H.y; r = H.low; var F = b && m.stacks[(this.negStacks && E < (z ? 0 : A) ? "-" : "") + this.stackKey], L; m.positiveValuesOnly && null !== E && 0 >= E && (H.isNull = !0); H.plotX = p = g(Math.min(Math.max(-1E5, c.translate(B, 0, 0, 0, 1, h, "flags" === this.type)), 1E5)); b && this.visible && !H.isNull && F && F[B] && (D = this.getStackIndicator(D, B, this.index), L = F[B], E = L.points[D.key], r = E[0], E = E[1], r === z && D.key === F[B].base && (r = e(l(A) && A, m.min)), m.positiveValuesOnly && 0 >= r && (r = null), H.total =
                            H.stackTotal = L.total, H.percentage = L.total && H.y / L.total * 100, H.stackY = E, L.setOffset(this.pointXOffset || 0, this.barW || 0)); H.yBottom = t(r) ? Math.min(Math.max(-1E5, m.translate(r, 0, 1, 0, 1)), 1E5) : null; w && (E = this.modifyValue(E, H)); H.plotY = r = "number" === typeof E && Infinity !== E ? Math.min(Math.max(-1E5, m.translate(E, 0, 1, 0, 1)), 1E5) : void 0; H.isInside = void 0 !== r && 0 <= r && r <= m.len && 0 <= p && p <= c.len; H.clientX = u ? g(c.translate(B, 0, 0, 0, 1, h)) : p; H.negative = H.y < (A || 0); H.category = d && void 0 !== d[H.x] ? d[H.x] : H.x; H.isNull || (void 0 !==
                                v && (x = Math.min(x, Math.abs(p - v))), v = p); H.zone = this.zones.length && H.getZone()
                    } this.closestPointRangePx = x; f(this, "afterTranslate")
            }, getValidPoints: function (a, b) { var d = this.chart; return c(a || this.points || [], function (a) { return b && !d.isInsidePlot(a.plotX, a.plotY, d.inverted) ? !1 : !a.isNull }) }, setClip: function (a) {
                var b = this.chart, c = this.options, d = b.renderer, e = b.inverted, f = this.clipBox, g = f || b.clipBox, q = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, g.height, c.xAxis, c.yAxis].join(), h = b[q], l = b[q +
                    "m"]; h || (a && (g.width = 0, e && (g.x = b.plotSizeX), b[q + "m"] = l = d.clipRect(e ? b.plotSizeX + 99 : -99, e ? -b.plotLeft : -b.plotTop, 99, e ? b.chartWidth : b.chartHeight)), b[q] = h = d.clipRect(g), h.count = { length: 0 }); a && !h.count[this.index] && (h.count[this.index] = !0, h.count.length += 1); !1 !== c.clip && (this.group.clip(a || f ? h : b.clipRect), this.markerGroup.clip(l), this.sharedClipKey = q); a || (h.count[this.index] && (delete h.count[this.index], --h.count.length), 0 === h.count.length && q && b[q] && (f || (b[q] = b[q].destroy()), b[q + "m"] && (b[q + "m"] = b[q +
                        "m"].destroy())))
            }, animate: function (a) { var b = this.chart, c = E(this.options.animation), d; a ? this.setClip(c) : (d = this.sharedClipKey, (a = b[d]) && a.animate({ width: b.plotSizeX, x: 0 }, c), b[d + "m"] && b[d + "m"].animate({ width: b.plotSizeX + 99, x: 0 }, c), this.animate = null) }, afterAnimate: function () { this.setClip(); f(this, "afterAnimate"); this.finishedAnimating = !0 }, drawPoints: function () {
                var a = this.points, b = this.chart, c, d, f, k, g = this.options.marker, l, h, m, n = this[this.specialGroup] || this.markerGroup, w, u = e(g.enabled, this.xAxis.isRadial ?
                    !0 : null, this.closestPointRangePx >= g.enabledThreshold * g.radius); if (!1 !== g.enabled || this._hasPointMarkers) for (c = 0; c < a.length; c++)d = a[c], k = d.graphic, l = d.marker || {}, h = !!d.marker, f = u && void 0 === l.enabled || l.enabled, m = d.isInside, f && !d.isNull ? (f = e(l.symbol, this.symbol), w = this.markerAttribs(d, d.selected && "select"), k ? k[m ? "show" : "hide"](!0).animate(w) : m && (0 < w.width || d.hasImage) && (d.graphic = k = b.renderer.symbol(f, w.x, w.y, w.width, w.height, h ? l : g).add(n)), k && k.addClass(d.getClassName(), !0)) : k && (d.graphic = k.destroy())
            },
            markerAttribs: function (a, b) { var c = this.options.marker, d = a.marker || {}, f = d.symbol || c.symbol, g = e(d.radius, c.radius); b && (c = c.states[b], b = d.states && d.states[b], g = e(b && b.radius, c && c.radius, g + (c && c.radiusPlus || 0))); a.hasImage = f && 0 === f.indexOf("url"); a.hasImage && (g = 0); a = { x: Math.floor(a.plotX) - g, y: a.plotY - g }; g && (a.width = a.height = 2 * g); return a }, destroy: function () {
                var b = this, c = b.chart, d = /AppleWebKit\/533/.test(z.navigator.userAgent), e, g, k = b.data || [], l, m; f(b, "destroy"); D(b); x(b.axisTypes || [], function (a) {
                    (m = b[a]) &&
                        m.series && (v(m.series, b), m.isDirty = m.forceRedraw = !0)
                }); b.legendItem && b.chart.legend.destroyItem(b); for (g = k.length; g--;)(l = k[g]) && l.destroy && l.destroy(); b.points = null; a.clearTimeout(b.animationTimeout); n(b, function (a, b) { a instanceof H && !a.survive && (e = d && "group" === b ? "hide" : "destroy", a[e]()) }); c.hoverSeries === b && (c.hoverSeries = null); v(c.series, b); c.orderSeries(); n(b, function (a, c) { delete b[c] })
            }, getGraphPath: function (a, b, c) {
                var d = this, e = d.options, f = e.step, g, q = [], h = [], l; a = a || d.points; (g = a.reversed) && a.reverse();
                (f = { right: 1, center: 2 }[f] || f && 3) && g && (f = 4 - f); !e.connectNulls || b || c || (a = this.getValidPoints(a)); x(a, function (g, k) {
                    var m = g.plotX, n = g.plotY, w = a[k - 1]; (g.leftCliff || w && w.rightCliff) && !c && (l = !0); g.isNull && !t(b) && 0 < k ? l = !e.connectNulls : g.isNull && !b ? l = !0 : (0 === k || l ? k = ["M", g.plotX, g.plotY] : d.getPointSpline ? k = d.getPointSpline(a, g, k) : f ? (k = 1 === f ? ["L", w.plotX, n] : 2 === f ? ["L", (w.plotX + m) / 2, w.plotY, "L", (w.plotX + m) / 2, n] : ["L", m, w.plotY], k.push("L", m, n)) : k = ["L", m, n], h.push(g.x), f && (h.push(g.x), 2 === f && h.push(g.x)), q.push.apply(q,
                        k), l = !1)
                }); q.xMap = h; return d.graphPath = q
            }, drawGraph: function () { var a = this, b = (this.gappedPath || this.getGraphPath).call(this), c = [["graph", "highcharts-graph"]], c = a.getZonesGraphs(c); x(c, function (c, d) { d = c[0]; var e = a[d]; e ? (e.endX = a.preventGraphAnimation ? null : b.xMap, e.animate({ d: b })) : b.length && (a[d] = a.chart.renderer.path(b).addClass(c[1]).attr({ zIndex: 1 }).add(a.group)); e && (e.startX = b.xMap, e.isArea = b.isArea) }) }, getZonesGraphs: function (a) {
                x(this.zones, function (b, c) {
                    a.push(["zone-graph-" + c, "highcharts-graph highcharts-zone-graph-" +
                        c + " " + (b.className || "")])
                }, this); return a
            }, applyZones: function () {
                var a = this, b = this.chart, c = b.renderer, d = this.zones, f, g, l = this.clips || [], m, h = this.graph, n = this.area, w = Math.max(b.chartWidth, b.chartHeight), u = this[(this.zoneAxis || "y") + "Axis"], A, z, t = b.inverted, p, r, v, D, H = !1; d.length && (h || n) && u && void 0 !== u.min && (z = u.reversed, p = u.horiz, h && !this.showLine && h.hide(), n && n.hide(), A = u.getExtremes(), x(d, function (d, k) {
                    f = z ? p ? b.plotWidth : 0 : p ? 0 : u.toPixels(A.min); f = Math.min(Math.max(e(g, f), 0), w); g = Math.min(Math.max(Math.round(u.toPixels(e(d.value,
                        A.max), !0)), 0), w); H && (f = g = u.toPixels(A.max)); r = Math.abs(f - g); v = Math.min(f, g); D = Math.max(f, g); u.isXAxis ? (m = { x: t ? D : v, y: 0, width: r, height: w }, p || (m.x = b.plotHeight - m.x)) : (m = { x: 0, y: t ? D : v, width: w, height: r }, p && (m.y = b.plotWidth - m.y)); l[k] ? l[k].animate(m) : (l[k] = c.clipRect(m), h && a["zone-graph-" + k].clip(l[k]), n && a["zone-area-" + k].clip(l[k])); H = d.value > A.max; a.resetZones && 0 === g && (g = void 0)
                }), this.clips = l)
            }, invertGroups: function (a) {
                function b() {
                    x(["group", "markerGroup"], function (b) {
                        c[b] && (d.renderer.isVML && c[b].attr({
                            width: c.yAxis.len,
                            height: c.xAxis.len
                        }), c[b].width = c.yAxis.len, c[b].height = c.xAxis.len, c[b].invert(a))
                    })
                } var c = this, d = c.chart, e; c.xAxis && (e = B(d, "resize", b), B(c, "destroy", e), b(a), c.invertGroups = b)
            }, plotGroup: function (a, b, c, d, e) {
                var f = this[a], g = !f; g && (this[a] = f = this.chart.renderer.g().attr({ zIndex: d || .1 }).add(e)); f.addClass("highcharts-" + b + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series " + (t(this.colorIndex) ? "highcharts-color-" + this.colorIndex + " " : "") + (this.options.className || "") + (f.hasClass("highcharts-tracker") ?
                    " highcharts-tracker" : ""), !0); f.attr({ visibility: c })[g ? "attr" : "animate"](this.getPlotBox()); return f
            }, getPlotBox: function () { var a = this.chart, b = this.xAxis, c = this.yAxis; a.inverted && (b = c, c = this.xAxis); return { translateX: b ? b.left : a.plotLeft, translateY: c ? c.top : a.plotTop, scaleX: 1, scaleY: 1 } }, render: function () {
                var a = this, b = a.chart, c, d = a.options, e = !!a.animate && b.renderer.isSVG && E(d.animation).duration, g = a.visible ? "inherit" : "hidden", l = d.zIndex, m = a.hasRendered, h = b.seriesGroup, n = b.inverted; c = a.plotGroup("group",
                    "series", g, l, h); a.markerGroup = a.plotGroup("markerGroup", "markers", g, l, h); e && a.animate(!0); c.inverted = a.isCartesian ? n : !1; a.drawGraph && (a.drawGraph(), a.applyZones()); a.drawDataLabels && a.drawDataLabels(); a.visible && a.drawPoints(); a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker(); a.invertGroups(n); !1 === d.clip || a.sharedClipKey || m || c.clip(b.clipRect); e && a.animate(); m || (a.animationTimeout = A(function () { a.afterAnimate() }, e)); a.isDirty = !1; a.hasRendered = !0; f(a, "afterRender")
            }, redraw: function () {
                var a =
                    this.chart, b = this.isDirty || this.isDirtyData, c = this.group, d = this.xAxis, f = this.yAxis; c && (a.inverted && c.attr({ width: a.plotWidth, height: a.plotHeight }), c.animate({ translateX: e(d && d.left, a.plotLeft), translateY: e(f && f.top, a.plotTop) })); this.translate(); this.render(); b && delete this.kdTree
            }, kdAxisArray: ["clientX", "plotY"], searchPoint: function (a, b) {
                var c = this.xAxis, d = this.yAxis, e = this.chart.inverted; return this.searchKDTree({
                    clientX: e ? c.len - a.chartY + c.pos : a.chartX - c.pos, plotY: e ? d.len - a.chartX + d.pos : a.chartY -
                        d.pos
                }, b)
            }, buildKDTree: function () { function a(c, d, e) { var f, g; if (g = c && c.length) return f = b.kdAxisArray[d % e], c.sort(function (a, b) { return a[f] - b[f] }), g = Math.floor(g / 2), { point: c[g], left: a(c.slice(0, g), d + 1, e), right: a(c.slice(g + 1), d + 1, e) } } this.buildingKdTree = !0; var b = this, c = -1 < b.options.findNearestPointBy.indexOf("y") ? 2 : 1; delete b.kdTree; A(function () { b.kdTree = a(b.getValidPoints(null, !b.directTouch), c, c); b.buildingKdTree = !1 }, b.options.kdNow ? 0 : 1) }, searchKDTree: function (a, b) {
                function c(a, b, k, l) {
                    var h = b.point,
                        q = d.kdAxisArray[k % l], m, n, w = h; n = t(a[e]) && t(h[e]) ? Math.pow(a[e] - h[e], 2) : null; m = t(a[f]) && t(h[f]) ? Math.pow(a[f] - h[f], 2) : null; m = (n || 0) + (m || 0); h.dist = t(m) ? Math.sqrt(m) : Number.MAX_VALUE; h.distX = t(n) ? Math.sqrt(n) : Number.MAX_VALUE; q = a[q] - h[q]; m = 0 > q ? "left" : "right"; n = 0 > q ? "right" : "left"; b[m] && (m = c(a, b[m], k + 1, l), w = m[g] < w[g] ? m : h); b[n] && Math.sqrt(q * q) < w[g] && (a = c(a, b[n], k + 1, l), w = a[g] < w[g] ? a : w); return w
                } var d = this, e = this.kdAxisArray[0], f = this.kdAxisArray[1], g = b ? "distX" : "dist"; b = -1 < d.options.findNearestPointBy.indexOf("y") ?
                    2 : 1; this.kdTree || this.buildingKdTree || this.buildKDTree(); if (this.kdTree) return c(a, this.kdTree, b, b)
            }
        })
    })(L); (function (a) {
        var B = a.Axis, E = a.Chart, F = a.correctFloat, p = a.defined, g = a.destroyObjectProperties, d = a.each, t = a.format, x = a.objectEach, v = a.pick, r = a.Series; a.StackItem = function (a, c, d, g, m) {
            var b = a.chart.inverted; this.axis = a; this.isNegative = d; this.options = c; this.x = g; this.total = null; this.points = {}; this.stack = m; this.rightCliff = this.leftCliff = 0; this.alignOptions = {
                align: c.align || (b ? d ? "left" : "right" : "center"),
                verticalAlign: c.verticalAlign || (b ? "middle" : d ? "bottom" : "top"), y: v(c.y, b ? 4 : d ? 14 : -6), x: v(c.x, b ? d ? -6 : 6 : 0)
            }; this.textAlign = c.textAlign || (b ? d ? "right" : "left" : "center")
        }; a.StackItem.prototype = {
            destroy: function () { g(this, this.axis) }, render: function (a) {
                var c = this.axis.chart, d = this.options, f = d.format, f = f ? t(f, this, c.time) : d.formatter.call(this); this.label ? this.label.attr({ text: f, visibility: "hidden" }) : this.label = c.renderer.text(f, null, null, d.useHTML).css(d.style).attr({
                    align: this.textAlign, rotation: d.rotation,
                    visibility: "hidden"
                }).add(a); this.label.labelrank = c.plotHeight
            }, setOffset: function (a, c) { var d = this.axis, f = d.chart, g = d.translate(d.usePercentage ? 100 : this.total, 0, 0, 0, 1), b = d.translate(0), b = p(g) && Math.abs(g - b); a = f.xAxis[0].translate(this.x) + a; d = p(g) && this.getStackBox(f, this, a, g, c, b, d); (c = this.label) && d && (c.align(this.alignOptions, null, d), d = c.alignAttr, c[!1 === this.options.crop || f.isInsidePlot(d.x, d.y) ? "show" : "hide"](!0)) }, getStackBox: function (a, c, d, g, m, b, n) {
                var e = c.axis.reversed, f = a.inverted; a = n.height +
                    n.pos - (f ? a.plotLeft : a.plotTop); c = c.isNegative && !e || !c.isNegative && e; return { x: f ? c ? g : g - b : d, y: f ? a - d - m : c ? a - g - b : a - g, width: f ? b : m, height: f ? m : b }
            }
        }; E.prototype.getStacks = function () { var a = this; d(a.yAxis, function (a) { a.stacks && a.hasVisibleSeries && (a.oldStacks = a.stacks) }); d(a.series, function (c) { !c.options.stacking || !0 !== c.visible && !1 !== a.options.chart.ignoreHiddenSeries || (c.stackKey = c.type + v(c.options.stack, "")) }) }; B.prototype.buildStacks = function () {
            var a = this.series, c = v(this.options.reversedStacks, !0), d = a.length,
                g; if (!this.isXAxis) { this.usePercentage = !1; for (g = d; g--;)a[c ? g : d - g - 1].setStackedPoints(); for (g = 0; g < d; g++)a[g].modifyStacks() }
        }; B.prototype.renderStackTotals = function () { var a = this.chart, c = a.renderer, d = this.stacks, g = this.stackTotalGroup; g || (this.stackTotalGroup = g = c.g("stack-labels").attr({ visibility: "visible", zIndex: 6 }).add()); g.translate(a.plotLeft, a.plotTop); x(d, function (a) { x(a, function (a) { a.render(g) }) }) }; B.prototype.resetStacks = function () {
            var a = this, c = a.stacks; a.isXAxis || x(c, function (c) {
                x(c, function (d,
                    f) { d.touched < a.stacksTouched ? (d.destroy(), delete c[f]) : (d.total = null, d.cumulative = null) })
            })
        }; B.prototype.cleanStacks = function () { var a; this.isXAxis || (this.oldStacks && (a = this.stacks = this.oldStacks), x(a, function (a) { x(a, function (a) { a.cumulative = a.total }) })) }; r.prototype.setStackedPoints = function () {
            if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
                var d = this.processedXData, c = this.processedYData, g = [], l = c.length, m = this.options, b = m.threshold, n = v(m.startFromThreshold &&
                    b, 0), e = m.stack, m = m.stacking, t = this.stackKey, w = "-" + t, r = this.negStacks, A = this.yAxis, z = A.stacks, q = A.oldStacks, C, x, I, J, k, y, B; A.stacksTouched += 1; for (k = 0; k < l; k++)y = d[k], B = c[k], C = this.getStackIndicator(C, y, this.index), J = C.key, I = (x = r && B < (n ? 0 : b)) ? w : t, z[I] || (z[I] = {}), z[I][y] || (q[I] && q[I][y] ? (z[I][y] = q[I][y], z[I][y].total = null) : z[I][y] = new a.StackItem(A, A.options.stackLabels, x, y, e)), I = z[I][y], null !== B ? (I.points[J] = I.points[this.index] = [v(I.cumulative, n)], p(I.cumulative) || (I.base = J), I.touched = A.stacksTouched,
                        0 < C.index && !1 === this.singleStacks && (I.points[J][0] = I.points[this.index + "," + y + ",0"][0])) : I.points[J] = I.points[this.index] = null, "percent" === m ? (x = x ? t : w, r && z[x] && z[x][y] ? (x = z[x][y], I.total = x.total = Math.max(x.total, I.total) + Math.abs(B) || 0) : I.total = F(I.total + (Math.abs(B) || 0))) : I.total = F(I.total + (B || 0)), I.cumulative = v(I.cumulative, n) + (B || 0), null !== B && (I.points[J].push(I.cumulative), g[k] = I.cumulative); "percent" === m && (A.usePercentage = !0); this.stackedYData = g; A.oldStacks = {}
            }
        }; r.prototype.modifyStacks = function () {
            var a =
                this, c = a.stackKey, g = a.yAxis.stacks, l = a.processedXData, m, b = a.options.stacking; a[b + "Stacker"] && d([c, "-" + c], function (c) { for (var d = l.length, f, n; d--;)if (f = l[d], m = a.getStackIndicator(m, f, a.index, c), n = (f = g[c] && g[c][f]) && f.points[m.key]) a[b + "Stacker"](n, f, d) })
        }; r.prototype.percentStacker = function (a, c, d) { c = c.total ? 100 / c.total : 0; a[0] = F(a[0] * c); a[1] = F(a[1] * c); this.stackedYData[d] = a[1] }; r.prototype.getStackIndicator = function (a, c, d, g) {
            !p(a) || a.x !== c || g && a.key !== g ? a = { x: c, index: 0, key: g } : a.index++; a.key = [d, c, a.index].join();
            return a
        }
    })(L); (function (a) {
        var B = a.addEvent, E = a.Axis, F = a.createElement, p = a.css, g = a.defined, d = a.each, t = a.erase, x = a.extend, v = a.fireEvent, r = a.inArray, f = a.isNumber, c = a.isObject, u = a.isArray, l = a.merge, m = a.objectEach, b = a.pick, n = a.Point, e = a.Series, D = a.seriesTypes, w = a.setAnimation, H = a.splat; x(a.Chart.prototype, {
            addSeries: function (a, c, d) { var e, f = this; a && (c = b(c, !0), v(f, "addSeries", { options: a }, function () { e = f.initSeries(a); f.isDirtyLegend = !0; f.linkSeries(); v(f, "afterAddSeries"); c && f.redraw(d) })); return e }, addAxis: function (a,
                c, d, e) { var f = c ? "xAxis" : "yAxis", g = this.options; a = l(a, { index: this[f].length, isX: c }); c = new E(this, a); g[f] = H(g[f] || {}); g[f].push(a); b(d, !0) && this.redraw(e); return c }, showLoading: function (a) {
                    var b = this, c = b.options, d = b.loadingDiv, e = function () { d && p(d, { left: b.plotLeft + "px", top: b.plotTop + "px", width: b.plotWidth + "px", height: b.plotHeight + "px" }) }; d || (b.loadingDiv = d = F("div", { className: "highcharts-loading highcharts-loading-hidden" }, null, b.container), b.loadingSpan = F("span", { className: "highcharts-loading-inner" },
                        null, d), B(b, "redraw", e)); d.className = "highcharts-loading"; b.loadingSpan.innerHTML = a || c.lang.loading; b.loadingShown = !0; e()
                }, hideLoading: function () { var a = this.loadingDiv; a && (a.className = "highcharts-loading highcharts-loading-hidden"); this.loadingShown = !1 }, propsRequireDirtyBox: "backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
            propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "), update: function (a, c, e, n) {
                var q = this, w = { credits: "addCredits", title: "setTitle", subtitle: "setSubtitle" }, A = a.chart, k, t, z = []; v(q, "update", { options: a }); if (A) {
                    l(!0, q.options.chart, A); "className" in A && q.setClassName(A.className); "reflow" in A && q.setReflow(A.reflow); if ("inverted" in A || "polar" in A || "type" in A) q.propFromSeries(), k = !0; "alignTicks" in A && (k = !0); m(A, function (a, b) {
                        -1 !==
                            r("chart." + b, q.propsRequireUpdateSeries) && (t = !0); -1 !== r(b, q.propsRequireDirtyBox) && (q.isDirtyBox = !0)
                    })
                } a.plotOptions && l(!0, this.options.plotOptions, a.plotOptions); m(a, function (a, b) { if (q[b] && "function" === typeof q[b].update) q[b].update(a, !1); else if ("function" === typeof q[w[b]]) q[w[b]](a); "chart" !== b && -1 !== r(b, q.propsRequireUpdateSeries) && (t = !0) }); d("xAxis yAxis zAxis series colorAxis pane".split(" "), function (b) {
                    var c; a[b] && ("series" === b && (c = [], d(q[b], function (a, b) { a.options.isInternal || c.push(b) })),
                        d(H(a[b]), function (a, d) { (d = g(a.id) && q.get(a.id) || q[b][c ? c[d] : d]) && d.coll === b && (d.update(a, !1), e && (d.touched = !0)); if (!d && e) if ("series" === b) q.addSeries(a, !1).touched = !0; else if ("xAxis" === b || "yAxis" === b) q.addAxis(a, "xAxis" === b, !1).touched = !0 }), e && d(q[b], function (a) { a.touched || a.options.isInternal ? delete a.touched : z.push(a) }))
                }); d(z, function (a) { a.remove && a.remove(!1) }); k && d(q.axes, function (a) { a.update({}, !1) }); t && d(q.series, function (a) { a.update({}, !1) }); a.loading && l(!0, q.options.loading, a.loading); k =
                    A && A.width; A = A && A.height; f(k) && k !== q.chartWidth || f(A) && A !== q.chartHeight ? q.setSize(k, A, n) : b(c, !0) && q.redraw(n); v(q, "afterUpdate", { options: a })
            }, setSubtitle: function (a) { this.setTitle(void 0, a) }
        }); x(n.prototype, {
            update: function (a, d, e, f) {
                function g() {
                    l.applyOptions(a); null === l.y && k && (l.graphic = k.destroy()); c(a, !0) && (k && k.element && a && a.marker && void 0 !== a.marker.symbol && (l.graphic = k.destroy()), a && a.dataLabels && l.dataLabel && (l.dataLabel = l.dataLabel.destroy()), l.connector && (l.connector = l.connector.destroy()));
                    m = l.index; q.updateParallelArrays(l, m); h.data[m] = c(h.data[m], !0) || c(a, !0) ? l.options : b(a, h.data[m]); q.isDirty = q.isDirtyData = !0; !q.fixedBox && q.hasCartesianSeries && (n.isDirtyBox = !0); "point" === h.legendType && (n.isDirtyLegend = !0); d && n.redraw(e)
                } var l = this, q = l.series, k = l.graphic, m, n = q.chart, h = q.options; d = b(d, !0); !1 === f ? g() : l.firePointEvent("update", { options: a }, g)
            }, remove: function (a, b) { this.series.removePoint(r(this, this.series.data), a, b) }
        }); x(e.prototype, {
            addPoint: function (a, c, d, e) {
                var f = this.options, g = this.data,
                    l = this.chart, k = this.xAxis, k = k && k.hasNames && k.names, q = f.data, m, h, n = this.xData, w, A; c = b(c, !0); m = { series: this }; this.pointClass.prototype.applyOptions.apply(m, [a]); A = m.x; w = n.length; if (this.requireSorting && A < n[w - 1]) for (h = !0; w && n[w - 1] > A;)w--; this.updateParallelArrays(m, "splice", w, 0, 0); this.updateParallelArrays(m, w); k && m.name && (k[A] = m.name); q.splice(w, 0, a); h && (this.data.splice(w, 0, null), this.processData()); "point" === f.legendType && this.generatePoints(); d && (g[0] && g[0].remove ? g[0].remove(!1) : (g.shift(), this.updateParallelArrays(m,
                        "shift"), q.shift())); this.isDirtyData = this.isDirty = !0; c && l.redraw(e)
            }, removePoint: function (a, c, d) { var e = this, f = e.data, g = f[a], l = e.points, k = e.chart, q = function () { l && l.length === f.length && l.splice(a, 1); f.splice(a, 1); e.options.data.splice(a, 1); e.updateParallelArrays(g || { series: e }, "splice", a, 1); g && g.destroy(); e.isDirty = !0; e.isDirtyData = !0; c && k.redraw() }; w(d, k); c = b(c, !0); g ? g.firePointEvent("remove", null, q) : q() }, remove: function (a, c, d) {
                function e() {
                    f.destroy(); f.remove = null; g.isDirtyLegend = g.isDirtyBox = !0;
                    g.linkSeries(); b(a, !0) && g.redraw(c)
                } var f = this, g = f.chart; !1 !== d ? v(f, "remove", null, e) : e()
            }, update: function (c, e) {
                var f = this, g = f.chart, m = f.userOptions, n = f.oldType || f.type, w = c.type || m.type || g.options.chart.type, k = D[n].prototype, t, A = ["group", "markerGroup", "dataLabelsGroup"], h = ["navigatorSeries", "baseSeries"], u = f.finishedAnimating && { animation: !1 }, p = ["data", "name", "turboThreshold"], z = a.keys(c), H = 0 < z.length; d(z, function (a) { -1 === r(a, p) && (H = !1) }); if (H) c.data && this.setData(c.data, !1), c.name && this.setName(c.name,
                    !1); else { h = A.concat(h); d(h, function (a) { h[a] = f[a]; delete f[a] }); c = l(m, u, { index: f.index, pointStart: b(m.pointStart, f.xData[0]) }, { data: f.options.data }, c); f.remove(!1, null, !1); for (t in k) f[t] = void 0; D[w || n] ? x(f, D[w || n].prototype) : a.error(17, !0); d(h, function (a) { f[a] = h[a] }); f.init(g, c); c.zIndex !== m.zIndex && d(A, function (a) { f[a] && f[a].attr({ zIndex: c.zIndex }) }); f.oldType = n; g.linkSeries() } v(this, "afterUpdate"); b(e, !0) && g.redraw(H ? void 0 : !1)
            }, setName: function (a) {
                this.name = this.options.name = this.userOptions.name =
                    a; this.chart.isDirtyLegend = !0
            }
        }); x(E.prototype, {
            update: function (a, c) { var d = this.chart, e = a && a.events || {}; a = l(this.userOptions, a); d.options[this.coll].indexOf && (d.options[this.coll][d.options[this.coll].indexOf(this.userOptions)] = a); m(d.options[this.coll].events, function (a, b) { "undefined" === typeof e[b] && (e[b] = void 0) }); this.destroy(!0); this.init(d, x(a, { events: e })); d.isDirtyBox = !0; b(c, !0) && d.redraw() }, remove: function (a) {
                for (var c = this.chart, e = this.coll, f = this.series, g = f.length; g--;)f[g] && f[g].remove(!1);
                t(c.axes, this); t(c[e], this); u(c.options[e]) ? c.options[e].splice(this.options.index, 1) : delete c.options[e]; d(c[e], function (a, b) { a.options.index = a.userOptions.index = b }); this.destroy(); c.isDirtyBox = !0; b(a, !0) && c.redraw()
            }, setTitle: function (a, b) { this.update({ title: a }, b) }, setCategories: function (a, b) { this.update({ categories: a }, b) }
        })
    })(L); (function (a) {
        var B = a.each, E = a.map, F = a.pick, p = a.Series, g = a.seriesType; g("area", "line", { softThreshold: !1, threshold: 0 }, {
            singleStacks: !1, getStackPoints: function (d) {
                var g = [],
                    p = [], v = this.xAxis, r = this.yAxis, f = r.stacks[this.stackKey], c = {}, u = this.index, l = r.series, m = l.length, b, n = F(r.options.reversedStacks, !0) ? 1 : -1, e; d = d || this.points; if (this.options.stacking) {
                        for (e = 0; e < d.length; e++)d[e].leftNull = d[e].rightNull = null, c[d[e].x] = d[e]; a.objectEach(f, function (a, b) { null !== a.total && p.push(b) }); p.sort(function (a, b) { return a - b }); b = E(l, function () { return this.visible }); B(p, function (a, d) {
                            var l = 0, w, t; if (c[a] && !c[a].isNull) g.push(c[a]), B([-1, 1], function (g) {
                                var l = 1 === g ? "rightNull" : "leftNull",
                                    q = 0, r = f[p[d + g]]; if (r) for (e = u; 0 <= e && e < m;)w = r.points[e], w || (e === u ? c[a][l] = !0 : b[e] && (t = f[a].points[e]) && (q -= t[1] - t[0])), e += n; c[a][1 === g ? "rightCliff" : "leftCliff"] = q
                            }); else { for (e = u; 0 <= e && e < m;) { if (w = f[a].points[e]) { l = w[1]; break } e += n } l = r.translate(l, 0, 1, 0, 1); g.push({ isNull: !0, plotX: v.translate(a, 0, 0, 0, 1), x: a, plotY: l, yBottom: l }) }
                        })
                    } return g
            }, getGraphPath: function (a) {
                var d = p.prototype.getGraphPath, g = this.options, v = g.stacking, r = this.yAxis, f, c, u = [], l = [], m = this.index, b, n = r.stacks[this.stackKey], e = g.threshold,
                    D = r.getThreshold(g.threshold), w, g = g.connectNulls || "percent" === v, H = function (c, d, f) { var g = a[c]; c = v && n[g.x].points[m]; var q = g[f + "Null"] || 0; f = g[f + "Cliff"] || 0; var w, p, g = !0; f || q ? (w = (q ? c[0] : c[1]) + f, p = c[0] + f, g = !!q) : !v && a[d] && a[d].isNull && (w = p = e); void 0 !== w && (l.push({ plotX: b, plotY: null === w ? D : r.getThreshold(w), isNull: g, isCliff: !0 }), u.push({ plotX: b, plotY: null === p ? D : r.getThreshold(p), doCurve: !1 })) }; a = a || this.points; v && (a = this.getStackPoints(a)); for (f = 0; f < a.length; f++)if (c = a[f].isNull, b = F(a[f].rectPlotX, a[f].plotX),
                        w = F(a[f].yBottom, D), !c || g) g || H(f, f - 1, "left"), c && !v && g || (l.push(a[f]), u.push({ x: f, plotX: b, plotY: w })), g || H(f, f + 1, "right"); f = d.call(this, l, !0, !0); u.reversed = !0; c = d.call(this, u, !0, !0); c.length && (c[0] = "L"); c = f.concat(c); d = d.call(this, l, !1, g); c.xMap = f.xMap; this.areaPath = c; return d
            }, drawGraph: function () {
                this.areaPath = []; p.prototype.drawGraph.apply(this); var a = this, g = this.areaPath, x = this.options, v = [["area", "highcharts-area"]]; B(this.zones, function (a, d) {
                    v.push(["zone-area-" + d, "highcharts-area highcharts-zone-area-" +
                        d + " " + a.className])
                }); B(v, function (d) { var f = d[0], c = a[f]; c ? (c.endX = a.preventGraphAnimation ? null : g.xMap, c.animate({ d: g })) : (c = a[f] = a.chart.renderer.path(g).addClass(d[1]).attr({ zIndex: 0 }).add(a.group), c.isArea = !0); c.startX = g.xMap; c.shiftUnit = x.step ? 2 : 1 })
            }, drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
        })
    })(L); (function (a) {
        var B = a.pick; a = a.seriesType; a("spline", "line", {}, {
            getPointSpline: function (a, F, p) {
                var g = F.plotX, d = F.plotY, t = a[p - 1]; p = a[p + 1]; var x, v, r, f; if (t && !t.isNull && !1 !== t.doCurve && !F.isCliff &&
                    p && !p.isNull && !1 !== p.doCurve && !F.isCliff) { a = t.plotY; r = p.plotX; p = p.plotY; var c = 0; x = (1.5 * g + t.plotX) / 2.5; v = (1.5 * d + a) / 2.5; r = (1.5 * g + r) / 2.5; f = (1.5 * d + p) / 2.5; r !== x && (c = (f - v) * (r - g) / (r - x) + d - f); v += c; f += c; v > a && v > d ? (v = Math.max(a, d), f = 2 * d - v) : v < a && v < d && (v = Math.min(a, d), f = 2 * d - v); f > p && f > d ? (f = Math.max(p, d), v = 2 * d - f) : f < p && f < d && (f = Math.min(p, d), v = 2 * d - f); F.rightContX = r; F.rightContY = f } F = ["C", B(t.rightContX, t.plotX), B(t.rightContY, t.plotY), B(x, g), B(v, d), g, d]; t.rightContX = t.rightContY = null; return F
            }
        })
    })(L); (function (a) {
        var B =
            a.seriesTypes.area.prototype, E = a.seriesType; E("areaspline", "spline", a.defaultPlotOptions.area, { getStackPoints: B.getStackPoints, getGraphPath: B.getGraphPath, drawGraph: B.drawGraph, drawLegendSymbol: a.LegendSymbolMixin.drawRectangle })
    })(L); (function (a) {
        var B = a.animObject, E = a.each, F = a.extend, p = a.defined, g = a.isNumber, d = a.merge, t = a.pick, x = a.Series, v = a.seriesType, r = a.svg; v("column", "line", {
            borderRadius: 0, crisp: !0, groupPadding: .2, marker: null, pointPadding: .1, minPointLength: 0, cropThreshold: 50, pointRange: null,
            states: { hover: { halo: !1 } }, dataLabels: { align: null, verticalAlign: null, y: null }, softThreshold: !1, startFromThreshold: !0, stickyTracking: !1, tooltip: { distance: 6 }, threshold: 0
        }, {
            cropShoulder: 0, directTouch: !0, trackerGroups: ["group", "dataLabelsGroup"], negStacks: !0, init: function () { x.prototype.init.apply(this, arguments); var a = this, c = a.chart; c.hasRendered && E(c.series, function (c) { c.type === a.type && (c.isDirty = !0) }) }, getColumnMetrics: function () {
                var a = this, c = a.options, d = a.xAxis, g = a.yAxis, m = d.options.reversedStacks, m =
                    d.reversed && !m || !d.reversed && m, b, n = {}, e = 0; !1 === c.grouping ? e = 1 : E(a.chart.series, function (c) { var d = c.options, f = c.yAxis, l; c.type !== a.type || !c.visible && a.chart.options.chart.ignoreHiddenSeries || g.len !== f.len || g.pos !== f.pos || (d.stacking ? (b = c.stackKey, void 0 === n[b] && (n[b] = e++), l = n[b]) : !1 !== d.grouping && (l = e++), c.columnIndex = l) }); var p = Math.min(Math.abs(d.transA) * (d.ordinalSlope || c.pointRange || d.closestPointRange || d.tickInterval || 1), d.len), w = p * c.groupPadding, r = (p - 2 * w) / (e || 1), c = Math.min(c.maxPointWidth || d.len,
                        t(c.pointWidth, r * (1 - 2 * c.pointPadding))); a.columnMetrics = { width: c, offset: (r - c) / 2 + (w + ((a.columnIndex || 0) + (m ? 1 : 0)) * r - p / 2) * (m ? -1 : 1) }; return a.columnMetrics
            }, crispCol: function (a, c, d, g) { var f = this.chart, b = this.borderWidth, l = -(b % 2 ? .5 : 0), b = b % 2 ? .5 : 1; f.inverted && f.renderer.isVML && (b += 1); this.options.crisp && (d = Math.round(a + d) + l, a = Math.round(a) + l, d -= a); g = Math.round(c + g) + b; l = .5 >= Math.abs(c) && .5 < g; c = Math.round(c) + b; g -= c; l && g && (--c, g += 1); return { x: a, y: c, width: d, height: g } }, translate: function () {
                var a = this, c = a.chart,
                    d = a.options, g = a.dense = 2 > a.closestPointRange * a.xAxis.transA, g = a.borderWidth = t(d.borderWidth, g ? 0 : 1), m = a.yAxis, b = d.threshold, n = a.translatedThreshold = m.getThreshold(b), e = t(d.minPointLength, 5), r = a.getColumnMetrics(), w = r.width, v = a.barW = Math.max(w, 1 + 2 * g), A = a.pointXOffset = r.offset; c.inverted && (n -= .5); d.pointPadding && (v = Math.ceil(v)); x.prototype.translate.apply(a); E(a.points, function (d) {
                        var g = t(d.yBottom, n), f = 999 + Math.abs(g), l = w, f = Math.min(Math.max(-f, d.plotY), m.len + f), r = d.plotX + A, u = v, k = Math.min(f, g), y, z =
                            Math.max(f, g) - k; e && Math.abs(z) < e && (z = e, y = !m.reversed && !d.negative || m.reversed && d.negative, d.y === b && a.dataMax <= b && m.min < b && (y = !y), k = Math.abs(k - n) > e ? g - e : n - (y ? e : 0)); p(d.options.pointWidth) && (l = u = Math.ceil(d.options.pointWidth), r -= Math.round((l - w) / 2)); d.barX = r; d.pointWidth = l; d.tooltipPos = c.inverted ? [m.len + m.pos - c.plotLeft - f, a.xAxis.len - r - u / 2, z] : [r + u / 2, f + m.pos - c.plotTop, z]; d.shapeType = "rect"; d.shapeArgs = a.crispCol.apply(a, d.isNull ? [r, n, u, 0] : [r, k, u, z])
                    })
            }, getSymbol: a.noop, drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            drawGraph: function () { this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data") }, drawPoints: function () { var a = this, c = this.chart, p = a.options, l = c.renderer, m = p.animationLimit || 250, b; E(a.points, function (f) { var e = f.graphic, n = e && c.pointCount < m ? "animate" : "attr"; if (g(f.plotY) && null !== f.y) { b = f.shapeArgs; if (e) e[n](d(b)); else f.graphic = e = l[f.shapeType](b).add(f.group || a.group); p.borderRadius && e.attr({ r: p.borderRadius }); e.addClass(f.getClassName(), !0) } else e && (f.graphic = e.destroy()) }) }, animate: function (a) {
                var c =
                    this, d = this.yAxis, g = c.options, f = this.chart.inverted, b = {}, n = f ? "translateX" : "translateY", e; r && (a ? (b.scaleY = .001, a = Math.min(d.pos + d.len, Math.max(d.pos, d.toPixels(g.threshold))), f ? b.translateX = a - d.len : b.translateY = a, c.group.attr(b)) : (e = c.group.attr(n), c.group.animate({ scaleY: 1 }, F(B(c.options.animation), { step: function (a, g) { b[n] = e + g.pos * (d.pos - e); c.group.attr(b) } })), c.animate = null))
            }, remove: function () {
                var a = this, c = a.chart; c.hasRendered && E(c.series, function (c) { c.type === a.type && (c.isDirty = !0) }); x.prototype.remove.apply(a,
                    arguments)
            }
        })
    })(L); (function (a) { a = a.seriesType; a("bar", "column", null, { inverted: !0 }) })(L); (function (a) {
        var B = a.Series; a = a.seriesType; a("scatter", "line", { lineWidth: 0, findNearestPointBy: "xy", marker: { enabled: !0 }, tooltip: { headerFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e \x3cspan class\x3d"highcharts-header"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e', pointFormat: "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e" } }, {
            sorted: !1,
            requireSorting: !1, noSharedTooltip: !0, trackerGroups: ["group", "markerGroup", "dataLabelsGroup"], takeOrdinalPosition: !1, drawGraph: function () { this.options.lineWidth && B.prototype.drawGraph.call(this) }
        })
    })(L); (function (a) {
        var B = a.deg2rad, E = a.isNumber, F = a.pick, p = a.relativeLength; a.CenteredSeriesMixin = {
            getCenter: function () {
                var a = this.options, d = this.chart, t = 2 * (a.slicedOffset || 0), x = d.plotWidth - 2 * t, d = d.plotHeight - 2 * t, v = a.center, v = [F(v[0], "50%"), F(v[1], "50%"), a.size || "100%", a.innerSize || 0], r = Math.min(x, d), f, c;
                for (f = 0; 4 > f; ++f)c = v[f], a = 2 > f || 2 === f && /%$/.test(c), v[f] = p(c, [x, d, r, v[2]][f]) + (a ? t : 0); v[3] > v[2] && (v[3] = v[2]); return v
            }, getStartAndEndRadians: function (a, d) { a = E(a) ? a : 0; d = E(d) && d > a && 360 > d - a ? d : a + 360; return { start: B * (a + -90), end: B * (d + -90) } }
        }
    })(L); (function (a) {
        var B = a.addEvent, E = a.CenteredSeriesMixin, F = a.defined, p = a.each, g = a.extend, d = E.getStartAndEndRadians, t = a.inArray, x = a.noop, v = a.pick, r = a.Point, f = a.Series, c = a.seriesType, u = a.setAnimation; c("pie", "line", {
            center: [null, null], clip: !1, colorByPoint: !0, dataLabels: {
                allowOverlap: !0,
                distance: 30, enabled: !0, formatter: function () { return this.point.isNull ? void 0 : this.point.name }, x: 0
            }, ignoreHiddenPoint: !0, legendType: "point", marker: null, size: null, showInLegend: !1, slicedOffset: 10, stickyTracking: !1, tooltip: { followPointer: !0 }
        }, {
            isCartesian: !1, requireSorting: !1, directTouch: !0, noSharedTooltip: !0, trackerGroups: ["group", "dataLabelsGroup"], axisTypes: [], pointAttribs: a.seriesTypes.column.prototype.pointAttribs, animate: function (a) {
                var c = this, b = c.points, d = c.startAngleRad; a || (p(b, function (a) {
                    var b =
                        a.graphic, e = a.shapeArgs; b && (b.attr({ r: a.startR || c.center[3] / 2, start: d, end: d }), b.animate({ r: e.r, start: e.start, end: e.end }, c.options.animation))
                }), c.animate = null)
            }, updateTotals: function () { var a, c = 0, b = this.points, d = b.length, e, g = this.options.ignoreHiddenPoint; for (a = 0; a < d; a++)e = b[a], c += g && !e.visible ? 0 : e.isNull ? 0 : e.y; this.total = c; for (a = 0; a < d; a++)e = b[a], e.percentage = 0 < c && (e.visible || !g) ? e.y / c * 100 : 0, e.total = c }, generatePoints: function () { f.prototype.generatePoints.call(this); this.updateTotals() }, translate: function (a) {
                this.generatePoints();
                var c = 0, b = this.options, g = b.slicedOffset, e = g + (b.borderWidth || 0), f, l, p, r = d(b.startAngle, b.endAngle), t = this.startAngleRad = r.start, r = (this.endAngleRad = r.end) - t, q = this.points, u, x = b.dataLabels.distance, b = b.ignoreHiddenPoint, B, J = q.length, k; a || (this.center = a = this.getCenter()); this.getX = function (b, c, d) { p = Math.asin(Math.min((b - a[1]) / (a[2] / 2 + d.labelDistance), 1)); return a[0] + (c ? -1 : 1) * Math.cos(p) * (a[2] / 2 + d.labelDistance) }; for (B = 0; B < J; B++) {
                    k = q[B]; k.labelDistance = v(k.options.dataLabels && k.options.dataLabels.distance,
                        x); this.maxLabelDistance = Math.max(this.maxLabelDistance || 0, k.labelDistance); f = t + c * r; if (!b || k.visible) c += k.percentage / 100; l = t + c * r; k.shapeType = "arc"; k.shapeArgs = { x: a[0], y: a[1], r: a[2] / 2, innerR: a[3] / 2, start: Math.round(1E3 * f) / 1E3, end: Math.round(1E3 * l) / 1E3 }; p = (l + f) / 2; p > 1.5 * Math.PI ? p -= 2 * Math.PI : p < -Math.PI / 2 && (p += 2 * Math.PI); k.slicedTranslation = { translateX: Math.round(Math.cos(p) * g), translateY: Math.round(Math.sin(p) * g) }; l = Math.cos(p) * a[2] / 2; u = Math.sin(p) * a[2] / 2; k.tooltipPos = [a[0] + .7 * l, a[1] + .7 * u]; k.half = p < -Math.PI /
                            2 || p > Math.PI / 2 ? 1 : 0; k.angle = p; f = Math.min(e, k.labelDistance / 5); k.labelPos = [a[0] + l + Math.cos(p) * k.labelDistance, a[1] + u + Math.sin(p) * k.labelDistance, a[0] + l + Math.cos(p) * f, a[1] + u + Math.sin(p) * f, a[0] + l, a[1] + u, 0 > k.labelDistance ? "center" : k.half ? "right" : "left", p]
                }
            }, drawGraph: null, drawPoints: function () {
                var a = this, c = a.chart.renderer, b, d, e; p(a.points, function (f) {
                    d = f.graphic; f.isNull ? d && (f.graphic = d.destroy()) : (e = f.shapeArgs, b = f.getTranslate(), d ? d.setRadialReference(a.center).animate(g(e, b)) : f.graphic = d = c[f.shapeType](e).setRadialReference(a.center).attr(b).add(a.group),
                        d.attr({ visibility: f.visible ? "inherit" : "hidden" }), d.addClass(f.getClassName()))
                })
            }, searchPoint: x, sortByAngle: function (a, c) { a.sort(function (a, d) { return void 0 !== a.angle && (d.angle - a.angle) * c }) }, drawLegendSymbol: a.LegendSymbolMixin.drawRectangle, getCenter: E.getCenter, getSymbol: x
        }, {
            init: function () { r.prototype.init.apply(this, arguments); var a = this, c; a.name = v(a.name, "Slice"); c = function (b) { a.slice("select" === b.type) }; B(a, "select", c); B(a, "unselect", c); return a }, isValid: function () {
                return a.isNumber(this.y,
                    !0) && 0 <= this.y
            }, setVisible: function (a, c) { var b = this, d = b.series, e = d.chart, f = d.options.ignoreHiddenPoint; c = v(c, f); a !== b.visible && (b.visible = b.options.visible = a = void 0 === a ? !b.visible : a, d.options.data[t(b, d.data)] = b.options, p(["graphic", "dataLabel", "connector", "shadowGroup"], function (c) { if (b[c]) b[c][a ? "show" : "hide"](!0) }), b.legendItem && e.legend.colorizeItem(b, a), a || "hover" !== b.state || b.setState(""), f && (d.isDirty = !0), c && e.redraw()) }, slice: function (a, c, b) {
                var d = this.series; u(b, d.chart); v(c, !0); this.sliced =
                    this.options.sliced = F(a) ? a : !this.sliced; d.options.data[t(this, d.data)] = this.options; this.graphic.animate(this.getTranslate())
            }, getTranslate: function () { return this.sliced ? this.slicedTranslation : { translateX: 0, translateY: 0 } }, haloPath: function (a) { var c = this.shapeArgs; return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(c.x, c.y, c.r + a, c.r + a, { innerR: this.shapeArgs.r - 1, start: c.start, end: c.end }) }
        })
    })(L); (function (a) {
        var B = a.addEvent, E = a.arrayMax, F = a.defined, p = a.each, g = a.extend, d = a.format,
            t = a.map, x = a.merge, v = a.noop, r = a.pick, f = a.relativeLength, c = a.Series, u = a.seriesTypes, l = a.some, m = a.stableSort, b = a.isArray, n = a.splat; a.distribute = function (b, c, d) {
                function e(a, b) { return a.target - b.target } var f, g = !0, q = b, w = [], n; n = 0; var u = q.reducedLen || c; for (f = b.length; f--;)n += b[f].size; if (n > u) { m(b, function (a, b) { return (b.rank || 0) - (a.rank || 0) }); for (n = f = 0; n <= u;)n += b[f].size, f++; w = b.splice(f - 1, b.length) } m(b, e); for (b = t(b, function (a) { return { size: a.size, targets: [a.target], align: r(a.align, .5) } }); g;) {
                    for (f = b.length; f--;)g =
                        b[f], n = (Math.min.apply(0, g.targets) + Math.max.apply(0, g.targets)) / 2, g.pos = Math.min(Math.max(0, n - g.size * g.align), c - g.size); f = b.length; for (g = !1; f--;)0 < f && b[f - 1].pos + b[f - 1].size > b[f].pos && (b[f - 1].size += b[f].size, b[f - 1].targets = b[f - 1].targets.concat(b[f].targets), b[f - 1].align = .5, b[f - 1].pos + b[f - 1].size > c && (b[f - 1].pos = c - b[f - 1].size), b.splice(f, 1), g = !0)
                } q.push.apply(q, w); f = 0; l(b, function (b) {
                    var e = 0; if (l(b.targets, function () {
                        q[f].pos = b.pos + e; if (Math.abs(q[f].pos - q[f].target) > d) return p(q.slice(0, f + 1), function (a) { delete a.pos }),
                            q.reducedLen = (q.reducedLen || c) - .1 * c, q.reducedLen > .1 * c && a.distribute(q, c, d), !0; e += q[f].size; f++
                    })) return !0
                }); m(q, e)
            }; c.prototype.drawDataLabels = function () {
                function c(a, b) { var c = b.filter; return c ? (b = c.operator, a = a[c.property], c = c.value, "\x3e" === b && a > c || "\x3c" === b && a < c || "\x3e\x3d" === b && a >= c || "\x3c\x3d" === b && a <= c || "\x3d\x3d" === b && a == c || "\x3d\x3d\x3d" === b && a === c ? !0 : !1) : !0 } function f(a, c) {
                    var d = [], e; if (b(a) && !b(c)) d = t(a, function (a) { return x(a, c) }); else if (b(c) && !b(a)) d = t(c, function (b) { return x(a, b) }); else if (b(a) ||
                        b(c)) for (e = Math.max(a.length, c.length); e--;)d[e] = x(a[e], c[e]); else d = x(a, c); return d
                } var g = this, l = g.chart, m = g.options, u = m.dataLabels, q = g.points, v, G = g.hasRendered || 0, I, E = r(u.defer, !!m.animation), k = l.renderer, u = f(f(l.options.plotOptions && l.options.plotOptions.series && l.options.plotOptions.series.dataLabels, l.options.plotOptions && l.options.plotOptions[g.type] && l.options.plotOptions[g.type].dataLabels), u); if (b(u) || u.enabled || g._hasPointLabels) I = g.plotGroup("dataLabelsGroup", "data-labels", E && !G ? "hidden" :
                    "visible", u.zIndex || 6), E && (I.attr({ opacity: +G }), G || B(g, "afterAnimate", function () { g.visible && I.show(!0); I[m.animation ? "animate" : "attr"]({ opacity: 1 }, { duration: 200 }) })), p(q, function (b) {
                        v = n(f(u, b.dlOptions || b.options && b.options.dataLabels)); p(v, function (e, f) {
                            var h = e.enabled && !b.isNull && c(b, e), q, m, n, w = b.dataLabels ? b.dataLabels[f] : b.dataLabel, p = b.connectors ? b.connectors[f] : b.connector, r = !w; h && (q = b.getLabelConfig(), m = e[b.formatPrefix + "Format"] || e.format, q = F(m) ? d(m, q, l.time) : (e[b.formatPrefix + "Formatter"] ||
                                e.formatter).call(q, e), m = e.rotation, n = { r: e.borderRadius || 0, rotation: m, padding: e.padding, zIndex: 1 }, a.objectEach(n, function (a, b) { void 0 === a && delete n[b] })); !w || h && F(q) ? h && F(q) && (w ? n.text = q : (b.dataLabels = b.dataLabels || [], w = b.dataLabels[f] = m ? k.text(q, 0, -9999).addClass("highcharts-data-label") : k.label(q, 0, -9999, e.shape, null, null, e.useHTML, null, "data-label"), f || (b.dataLabel = w), w.addClass(" highcharts-data-label-color-" + b.colorIndex + " " + (e.className || "") + (e.useHTML ? " highcharts-tracker" : ""))), w.options =
                                    e, w.attr(n), w.added || w.add(I), g.alignDataLabel(b, w, e, null, r)) : (b.dataLabel = b.dataLabel.destroy(), b.dataLabels && (1 === b.dataLabels.length ? delete b.dataLabels : delete b.dataLabels[f]), f || delete b.dataLabel, p && (b.connector = b.connector.destroy(), b.connectors && (1 === b.connectors.length ? delete b.connectors : delete b.connectors[f])))
                        })
                    }); a.fireEvent(this, "afterDrawDataLabels")
            }; c.prototype.alignDataLabel = function (a, b, c, d, f) {
                var e = this.chart, l = e.inverted, m = r(a.dlBox && a.dlBox.centerX, a.plotX, -9999), n = r(a.plotY,
                    -9999), w = b.getBBox(), p, k = c.rotation, t = c.align, u = this.visible && (a.series.forceDL || e.isInsidePlot(m, Math.round(n), l) || d && e.isInsidePlot(m, l ? d.x + 1 : d.y + d.height - 1, l)), h = "justify" === r(c.overflow, "justify"); if (u && (p = e.renderer.fontMetrics(void 0, b).b, d = g({ x: l ? this.yAxis.len - n : m, y: Math.round(l ? this.xAxis.len - m : n), width: 0, height: 0 }, d), g(c, { width: w.width, height: w.height }), k ? (h = !1, m = e.renderer.rotCorr(p, k), m = { x: d.x + c.x + d.width / 2 + m.x, y: d.y + c.y + { top: 0, middle: .5, bottom: 1 }[c.verticalAlign] * d.height }, b[f ? "attr" :
                        "animate"](m).attr({ align: t }), n = (k + 720) % 360, n = 180 < n && 360 > n, "left" === t ? m.y -= n ? w.height : 0 : "center" === t ? (m.x -= w.width / 2, m.y -= w.height / 2) : "right" === t && (m.x -= w.width, m.y -= n ? 0 : w.height), b.placed = !0, b.alignAttr = m) : (b.align(c, null, d), m = b.alignAttr), h && 0 <= d.height ? a.isLabelJustified = this.justifyDataLabel(b, c, m, w, d, f) : r(c.crop, !0) && (u = e.isInsidePlot(m.x, m.y) && e.isInsidePlot(m.x + w.width, m.y + w.height)), c.shape && !k)) b[f ? "attr" : "animate"]({ anchorX: l ? e.plotWidth - a.plotY : a.plotX, anchorY: l ? e.plotHeight - a.plotX : a.plotY });
                u || (b.attr({ y: -9999 }), b.placed = !1)
            }; c.prototype.justifyDataLabel = function (a, b, c, d, f, g) { var e = this.chart, l = b.align, m = b.verticalAlign, n, w, k = a.box ? 0 : a.padding || 0; n = c.x + k; 0 > n && ("right" === l ? b.align = "left" : b.x = -n, w = !0); n = c.x + d.width - k; n > e.plotWidth && ("left" === l ? b.align = "right" : b.x = e.plotWidth - n, w = !0); n = c.y + k; 0 > n && ("bottom" === m ? b.verticalAlign = "top" : b.y = -n, w = !0); n = c.y + d.height - k; n > e.plotHeight && ("top" === m ? b.verticalAlign = "bottom" : b.y = e.plotHeight - n, w = !0); w && (a.placed = !g, a.align(b, null, f)); return w }; u.pie &&
                (u.pie.prototype.drawDataLabels = function () {
                    var b = this, d = b.data, f, g = b.chart, l = b.options.dataLabels, m = r(l.connectorPadding, 10), n = r(l.connectorWidth, 1), t = g.plotWidth, u = g.plotHeight, v = Math.round(g.chartWidth / 3), x, k = b.center, y = k[2] / 2, B = k[1], h, K, L, R, Q = [[], []], N, M, P, U, S = [0, 0, 0, 0]; b.visible && (l.enabled || b._hasPointLabels) && (p(d, function (a) { a.dataLabel && a.visible && a.dataLabel.shortened && (a.dataLabel.attr({ width: "auto" }).css({ width: "auto", textOverflow: "clip" }), a.dataLabel.shortened = !1) }), c.prototype.drawDataLabels.apply(b),
                        p(d, function (a) { a.dataLabel && (a.visible ? (Q[a.half].push(a), a.dataLabel._pos = null, a.dataLabel.getBBox().width > v && (a.dataLabel.css({ width: .7 * v }), a.dataLabel.shortened = !0)) : (a.dataLabel = a.dataLabel.destroy(), a.dataLabels && 1 === a.dataLabels.length && delete a.dataLabels)) }), p(Q, function (c, d) {
                            var e, n, q = c.length, w = [], v; if (q) for (b.sortByAngle(c, d - .5), 0 < b.maxLabelDistance && (e = Math.max(0, B - y - b.maxLabelDistance), n = Math.min(B + y + b.maxLabelDistance, g.plotHeight), p(c, function (a) {
                                0 < a.labelDistance && a.dataLabel && (a.top =
                                    Math.max(0, B - y - a.labelDistance), a.bottom = Math.min(B + y + a.labelDistance, g.plotHeight), v = a.dataLabel.getBBox().height || 21, a.distributeBox = { target: a.labelPos[1] - a.top + v / 2, size: v, rank: a.y }, w.push(a.distributeBox))
                            }), e = n + v - e, a.distribute(w, e, e / 5)), U = 0; U < q; U++)f = c[U], L = f.labelPos, h = f.dataLabel, P = !1 === f.visible ? "hidden" : "inherit", M = e = L[1], w && F(f.distributeBox) && (void 0 === f.distributeBox.pos ? P = "hidden" : (R = f.distributeBox.size, M = f.top + f.distributeBox.pos)), delete f.positionIndex, N = l.justify ? k[0] + (d ? -1 : 1) * (y +
                                f.labelDistance) : b.getX(M < f.top + 2 || M > f.bottom - 2 ? e : M, d, f), h._attr = { visibility: P, align: L[6] }, h._pos = { x: N + l.x + ({ left: m, right: -m }[L[6]] || 0), y: M + l.y - 10 }, L.x = N, L.y = M, r(l.crop, !0) && (K = h.getBBox().width, e = null, N - K < m && 1 === d ? (e = Math.round(K - N + m), S[3] = Math.max(e, S[3])) : N + K > t - m && 0 === d && (e = Math.round(N + K - t + m), S[1] = Math.max(e, S[1])), 0 > M - R / 2 ? S[0] = Math.max(Math.round(-M + R / 2), S[0]) : M + R / 2 > u && (S[2] = Math.max(Math.round(M + R / 2 - u), S[2])), h.sideOverflow = e)
                        }), 0 === E(S) || this.verifyDataLabelOverflow(S)) && (this.placeDataLabels(),
                            n && p(this.points, function (a) { var c; x = a.connector; if ((h = a.dataLabel) && h._pos && a.visible && 0 < a.labelDistance) { P = h._attr.visibility; if (c = !x) a.connector = x = g.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-" + a.colorIndex + (a.className ? " " + a.className : "")).add(b.dataLabelsGroup); x[c ? "attr" : "animate"]({ d: b.connectorPath(a.labelPos) }); x.attr("visibility", P) } else x && (a.connector = x.destroy()) }))
                }, u.pie.prototype.connectorPath = function (a) {
                    var b = a.x, c = a.y; return r(this.options.dataLabels.softConnector,
                        !0) ? ["M", b + ("left" === a[6] ? 5 : -5), c, "C", b, c, 2 * a[2] - a[4], 2 * a[3] - a[5], a[2], a[3], "L", a[4], a[5]] : ["M", b + ("left" === a[6] ? 5 : -5), c, "L", a[2], a[3], "L", a[4], a[5]]
                }, u.pie.prototype.placeDataLabels = function () {
                    p(this.points, function (a) {
                        var b = a.dataLabel; b && a.visible && ((a = b._pos) ? (b.sideOverflow && (b._attr.width = b.getBBox().width - b.sideOverflow, b.css({ width: b._attr.width + "px", textOverflow: (this.options.dataLabels.style || {}).textOverflow || "ellipsis" }), b.shortened = !0), b.attr(b._attr), b[b.moved ? "animate" : "attr"](a), b.moved =
                            !0) : b && b.attr({ y: -9999 }))
                    }, this)
                }, u.pie.prototype.alignDataLabel = v, u.pie.prototype.verifyDataLabelOverflow = function (a) {
                    var b = this.center, c = this.options, d = c.center, e = c.minSize || 80, g, l = null !== c.size; l || (null !== d[0] ? g = Math.max(b[2] - Math.max(a[1], a[3]), e) : (g = Math.max(b[2] - a[1] - a[3], e), b[0] += (a[3] - a[1]) / 2), null !== d[1] ? g = Math.max(Math.min(g, b[2] - Math.max(a[0], a[2])), e) : (g = Math.max(Math.min(g, b[2] - a[0] - a[2]), e), b[1] += (a[0] - a[2]) / 2), g < b[2] ? (b[2] = g, b[3] = Math.min(f(c.innerSize || 0, g), g), this.translate(b), this.drawDataLabels &&
                        this.drawDataLabels()) : l = !0); return l
                }); u.column && (u.column.prototype.alignDataLabel = function (a, b, d, f, g) {
                    var e = this.chart.inverted, l = a.series, m = a.dlBox || a.shapeArgs, n = r(a.below, a.plotY > r(this.translatedThreshold, l.yAxis.len)), w = r(d.inside, !!this.options.stacking); m && (f = x(m), 0 > f.y && (f.height += f.y, f.y = 0), m = f.y + f.height - l.yAxis.len, 0 < m && (f.height -= m), e && (f = { x: l.yAxis.len - f.y - f.height, y: l.xAxis.len - f.x - f.width, width: f.height, height: f.width }), w || (e ? (f.x += n ? 0 : f.width, f.width = 0) : (f.y += n ? f.height : 0, f.height =
                        0))); d.align = r(d.align, !e || w ? "center" : n ? "right" : "left"); d.verticalAlign = r(d.verticalAlign, e || w ? "middle" : n ? "top" : "bottom"); c.prototype.alignDataLabel.call(this, a, b, d, f, g); a.isLabelJustified && a.contrastColor && b.css({ color: a.contrastColor })
                })
    })(L); (function (a) {
        var B = a.Chart, E = a.each, F = a.isArray, p = a.objectEach, g = a.pick; a = a.addEvent; a(B, "render", function () {
            var a = []; E(this.labelCollectors || [], function (d) { a = a.concat(d()) }); E(this.yAxis || [], function (d) {
                d.options.stackLabels && !d.options.stackLabels.allowOverlap &&
                    p(d.stacks, function (d) { p(d, function (d) { a.push(d.label) }) })
            }); E(this.series || [], function (d) { var p = d.options.dataLabels; d.visible && (!1 !== p.enabled || d._hasPointLabels) && E(d.points, function (d) { if (d.visible) { var p = F(d.dataLabels) ? d.dataLabels : d.dataLabel ? [d.dataLabel] : []; E(p, function (f) { var c = f.options; f.labelrank = g(c.labelrank, d.labelrank, d.shapeArgs && d.shapeArgs.height); c.allowOverlap || a.push(f) }) } }) }); this.hideOverlappingLabels(a)
        }); B.prototype.hideOverlappingLabels = function (a) {
            var d = a.length, g = this.renderer,
                p, r, f, c, u, l, m = function (a, c, d, f, g, l, m, p) { return !(g > a + d || g + m < a || l > c + f || l + p < c) }; f = function (a) { var b, c, d, f = a.box ? 0 : a.padding || 0; d = 0; if (a && (!a.alignAttr || a.placed)) return b = a.alignAttr || { x: a.attr("x"), y: a.attr("y") }, c = a.parentGroup, a.width || (d = a.getBBox(), a.width = d.width, a.height = d.height, d = g.fontMetrics(null, a.element).h), { x: b.x + (c.translateX || 0) + f, y: b.y + (c.translateY || 0) + f - d, width: a.width - 2 * f, height: a.height - 2 * f } }; for (r = 0; r < d; r++)if (p = a[r]) p.oldOpacity = p.opacity, p.newOpacity = 1, p.absoluteBox = f(p); a.sort(function (a,
                    c) { return (c.labelrank || 0) - (a.labelrank || 0) }); for (r = 0; r < d; r++)for (l = (f = a[r]) && f.absoluteBox, p = r + 1; p < d; ++p)if (u = (c = a[p]) && c.absoluteBox, l && u && f !== c && 0 !== f.newOpacity && 0 !== c.newOpacity && (u = m(l.x, l.y, l.width, l.height, u.x, u.y, u.width, u.height))) (f.labelrank < c.labelrank ? f : c).newOpacity = 0; E(a, function (a) {
                        var b, c; a && (c = a.newOpacity, a.oldOpacity !== c && (a.alignAttr && a.placed ? (c ? a.show(!0) : b = function () { a.hide() }, a.alignAttr.opacity = c, a[a.isOld ? "animate" : "attr"](a.alignAttr, null, b)) : a.attr({ opacity: c })), a.isOld =
                            !0)
                    })
        }
    })(L); (function (a) {
        var B = a.addEvent, E = a.Chart, F = a.createElement, p = a.css, g = a.defaultOptions, d = a.defaultPlotOptions, t = a.each, x = a.extend, v = a.fireEvent, r = a.hasTouch, f = a.inArray, c = a.isObject, u = a.Legend, l = a.merge, m = a.pick, b = a.Point, n = a.Series, e = a.seriesTypes, D; D = a.TrackerMixin = {
            drawTrackerPoint: function () {
                var a = this, b = a.chart.pointer, c = function (a) { var c = b.getPointFromEvent(a); void 0 !== c && (b.isDirectTouch = !0, c.onMouseOver(a)) }; t(a.points, function (a) {
                    a.graphic && (a.graphic.element.point = a); a.dataLabel &&
                        (a.dataLabel.div ? a.dataLabel.div.point = a : a.dataLabel.element.point = a)
                }); a._hasTracking || (t(a.trackerGroups, function (d) { if (a[d] && (a[d].addClass("highcharts-tracker").on("mouseover", c).on("mouseout", function (a) { b.onTrackerMouseOut(a) }), r)) a[d].on("touchstart", c) }), a._hasTracking = !0); v(this, "afterDrawTracker")
            }, drawTrackerGraph: function () {
                var a = this, b = a.options.trackByArea, c = [].concat(b ? a.areaPath : a.graphPath), d = c.length, e = a.chart, f = e.pointer, g = e.renderer, l = e.options.tooltip.snap, m = a.tracker, k, n = function () {
                    if (e.hoverSeries !==
                        a) a.onMouseOver()
                }; if (d && !b) for (k = d + 1; k--;)"M" === c[k] && c.splice(k + 1, 0, c[k + 1] - l, c[k + 2], "L"), (k && "M" === c[k] || k === d) && c.splice(k, 0, "L", c[k - 2] + l, c[k - 1]); m ? m.attr({ d: c }) : a.graph && (a.tracker = g.path(c).attr({ visibility: a.visible ? "visible" : "hidden", zIndex: 2 }).addClass(b ? "highcharts-tracker-area" : "highcharts-tracker-line").add(a.group), t([a.tracker, a.markerGroup], function (a) { a.addClass("highcharts-tracker").on("mouseover", n).on("mouseout", function (a) { f.onTrackerMouseOut(a) }); if (r) a.on("touchstart", n) })); v(this,
                    "afterDrawTracker")
            }
        }; e.column && (e.column.prototype.drawTracker = D.drawTrackerPoint); e.pie && (e.pie.prototype.drawTracker = D.drawTrackerPoint); e.scatter && (e.scatter.prototype.drawTracker = D.drawTrackerPoint); x(u.prototype, {
            setItemEvents: function (a, c, d) {
                var e = this.chart.renderer.boxWrapper, f = "highcharts-legend-" + (a instanceof b ? "point" : "series") + "-active"; (d ? c : a.legendGroup).on("mouseover", function () { a.setState("hover"); e.addClass(f) }).on("mouseout", function () { e.removeClass(f); a.setState() }).on("click",
                    function (b) { var c = function () { a.setVisible && a.setVisible() }; e.removeClass(f); b = { browserEvent: b }; a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : v(a, "legendItemClick", b, c) })
            }, createCheckboxForItem: function (a) { a.checkbox = F("input", { type: "checkbox", className: "highcharts-legend-checkbox", checked: a.selected, defaultChecked: a.selected }, this.options.itemCheckboxStyle, this.chart.container); B(a.checkbox, "click", function (b) { v(a.series || a, "checkboxClick", { checked: b.target.checked, item: a }, function () { a.select() }) }) }
        });
        x(E.prototype, {
            showResetZoom: function () { function a() { b.zoomOut() } var b = this, c = g.lang, d = b.options.chart.resetZoomButton, e = d.theme, f = e.states, l = "chart" === d.relativeTo ? null : "plotBox"; v(this, "beforeShowResetZoom", null, function () { b.resetZoomButton = b.renderer.button(c.resetZoom, null, null, a, e, f && f.hover).attr({ align: d.position.align, title: c.resetZoomTitle }).addClass("highcharts-reset-zoom").add().align(d.position, !1, l) }) }, zoomOut: function () { v(this, "selection", { resetSelection: !0 }, this.zoom) }, zoom: function (a) {
                var b,
                    d = this.pointer, e = !1, f; !a || a.resetSelection ? (t(this.axes, function (a) { b = a.zoom() }), d.initiated = !1) : t(a.xAxis.concat(a.yAxis), function (a) { var c = a.axis; d[c.isXAxis ? "zoomX" : "zoomY"] && (b = c.zoom(a.min, a.max), c.displayBtn && (e = !0)) }); f = this.resetZoomButton; e && !f ? this.showResetZoom() : !e && c(f) && (this.resetZoomButton = f.destroy()); b && this.redraw(m(this.options.chart.animation, a && a.animation, 100 > this.pointCount))
            }, pan: function (a, b) {
                var c = this, d = c.hoverPoints, e; d && t(d, function (a) { a.setState() }); t("xy" === b ? [1, 0] :
                    [1], function (b) {
                        b = c[b ? "xAxis" : "yAxis"][0]; var d = b.horiz, f = a[d ? "chartX" : "chartY"], d = d ? "mouseDownX" : "mouseDownY", g = c[d], k = (b.pointRange || 0) / 2, l = b.reversed && !c.inverted || !b.reversed && c.inverted ? -1 : 1, m = b.getExtremes(), h = b.toValue(g - f, !0) + k * l, l = b.toValue(g + b.len - f, !0) - k * l, n = l < h, g = n ? l : h, h = n ? h : l, l = Math.min(m.dataMin, k ? m.min : b.toValue(b.toPixels(m.min) - b.minPixelPadding)), k = Math.max(m.dataMax, k ? m.max : b.toValue(b.toPixels(m.max) + b.minPixelPadding)), n = l - g; 0 < n && (h += n, g = l); n = h - k; 0 < n && (h = k, g -= n); b.series.length &&
                            g !== m.min && h !== m.max && (b.setExtremes(g, h, !1, !1, { trigger: "pan" }), e = !0); c[d] = f
                    }); e && c.redraw(!1); p(c.container, { cursor: "move" })
            }
        }); x(b.prototype, {
            select: function (a, b) {
                var c = this, d = c.series, e = d.chart; a = m(a, !c.selected); c.firePointEvent(a ? "select" : "unselect", { accumulate: b }, function () {
                    c.selected = c.options.selected = a; d.options.data[f(c, d.data)] = c.options; c.setState(a && "select"); b || t(e.getSelectedPoints(), function (a) {
                        a.selected && a !== c && (a.selected = a.options.selected = !1, d.options.data[f(a, d.data)] = a.options,
                            a.setState(""), a.firePointEvent("unselect"))
                    })
                })
            }, onMouseOver: function (a) { var b = this.series.chart, c = b.pointer; a = a ? c.normalize(a) : c.getChartCoordinatesFromPoint(this, b.inverted); c.runPointActions(a, this) }, onMouseOut: function () { var a = this.series.chart; this.firePointEvent("mouseOut"); t(a.hoverPoints || [], function (a) { a.setState() }); a.hoverPoints = a.hoverPoint = null }, importEvents: function () {
                if (!this.hasImportedEvents) {
                    var b = this, c = l(b.series.options.point, b.options).events; b.events = c; a.objectEach(c, function (a,
                        c) { B(b, c, a) }); this.hasImportedEvents = !0
                }
            }, setState: function (a, b) {
                var c = Math.floor(this.plotX), e = this.plotY, f = this.series, g = f.options.states[a || "normal"] || {}, l = d[f.type].marker && f.options.marker, n = l && !1 === l.enabled, p = l && l.states && l.states[a || "normal"] || {}, k = !1 === p.enabled, r = f.stateMarkerGraphic, t = this.marker || {}, h = f.chart, u = f.halo, w, x = l && f.markerAttribs; a = a || ""; if (!(a === this.state && !b || this.selected && "select" !== a || !1 === g.enabled || a && (k || n && !1 === p.enabled) || a && t.states && t.states[a] && !1 === t.states[a].enabled)) {
                    x &&
                        (w = f.markerAttribs(this, a)); if (this.graphic) this.state && this.graphic.removeClass("highcharts-point-" + this.state), a && this.graphic.addClass("highcharts-point-" + a), w && this.graphic.animate(w, m(h.options.chart.animation, p.animation, l.animation)), r && r.hide(); else {
                            if (a && p) if (l = t.symbol || f.symbol, r && r.currentSymbol !== l && (r = r.destroy()), r) r[b ? "animate" : "attr"]({ x: w.x, y: w.y }); else l && (f.stateMarkerGraphic = r = h.renderer.symbol(l, w.x, w.y, w.width, w.height).add(f.markerGroup), r.currentSymbol = l); r && (r[a && h.isInsidePlot(c,
                                e, h.inverted) ? "show" : "hide"](), r.element.point = this)
                        } (c = g.halo) && c.size ? (u || (f.halo = u = h.renderer.path().add((this.graphic || r).parentGroup)), u.show()[b ? "animate" : "attr"]({ d: this.haloPath(c.size) }), u.attr({ "class": "highcharts-halo highcharts-color-" + m(this.colorIndex, f.colorIndex) + (this.className ? " " + this.className : ""), zIndex: -1 }), u.point = this) : u && u.point && u.point.haloPath && u.animate({ d: u.point.haloPath(0) }, null, u.hide); this.state = a; v(this, "afterSetState")
                }
            }, haloPath: function (a) {
                return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) -
                    a, this.plotY - a, 2 * a, 2 * a)
            }
        }); x(n.prototype, {
            onMouseOver: function () { var a = this.chart, b = a.hoverSeries; if (b && b !== this) b.onMouseOut(); this.options.events.mouseOver && v(this, "mouseOver"); this.setState("hover"); a.hoverSeries = this }, onMouseOut: function () { var a = this.options, b = this.chart, c = b.tooltip, d = b.hoverPoint; b.hoverSeries = null; if (d) d.onMouseOut(); this && a.events.mouseOut && v(this, "mouseOut"); !c || this.stickyTracking || c.shared && !this.noSharedTooltip || c.hide(); this.setState() }, setState: function (a) {
                var b = this;
                a = a || ""; b.state !== a && (t([b.group, b.markerGroup, b.dataLabelsGroup], function (c) { c && (b.state && c.removeClass("highcharts-series-" + b.state), a && c.addClass("highcharts-series-" + a)) }), b.state = a)
            }, setVisible: function (a, b) {
                var c = this, d = c.chart, e = c.legendItem, f, g = d.options.chart.ignoreHiddenSeries, l = c.visible; f = (c.visible = a = c.options.visible = c.userOptions.visible = void 0 === a ? !l : a) ? "show" : "hide"; t(["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"], function (a) { if (c[a]) c[a][f]() }); if (d.hoverSeries === c || (d.hoverPoint &&
                    d.hoverPoint.series) === c) c.onMouseOut(); e && d.legend.colorizeItem(c, a); c.isDirty = !0; c.options.stacking && t(d.series, function (a) { a.options.stacking && a.visible && (a.isDirty = !0) }); t(c.linkedSeries, function (b) { b.setVisible(a, !1) }); g && (d.isDirtyBox = !0); v(c, f); !1 !== b && d.redraw()
            }, show: function () { this.setVisible(!0) }, hide: function () { this.setVisible(!1) }, select: function (a) { this.selected = a = void 0 === a ? !this.selected : a; this.checkbox && (this.checkbox.checked = a); v(this, a ? "select" : "unselect") }, drawTracker: D.drawTrackerGraph
        })
    })(L);
    (function (a) {
        var B = a.Chart, E = a.each, F = a.inArray, p = a.isArray, g = a.isObject, d = a.pick, t = a.splat; B.prototype.setResponsive = function (d) {
            var g = this.options.responsive, p = [], f = this.currentResponsive; g && g.rules && E(g.rules, function (c) { void 0 === c._id && (c._id = a.uniqueKey()); this.matchResponsiveRule(c, p, d) }, this); var c = a.merge.apply(0, a.map(p, function (c) { return a.find(g.rules, function (a) { return a._id === c }).chartOptions })), p = p.toString() || void 0; p !== (f && f.ruleIds) && (f && this.update(f.undoOptions, d), p ? (this.currentResponsive =
                { ruleIds: p, mergedOptions: c, undoOptions: this.currentOptions(c) }, this.update(c, d)) : this.currentResponsive = void 0)
        }; B.prototype.matchResponsiveRule = function (a, g) { var p = a.condition; (p.callback || function () { return this.chartWidth <= d(p.maxWidth, Number.MAX_VALUE) && this.chartHeight <= d(p.maxHeight, Number.MAX_VALUE) && this.chartWidth >= d(p.minWidth, 0) && this.chartHeight >= d(p.minHeight, 0) }).call(this) && g.push(a._id) }; B.prototype.currentOptions = function (d) {
            function v(d, c, r, l) {
                var f; a.objectEach(d, function (a, d) {
                    if (!l &&
                        -1 < F(d, ["series", "xAxis", "yAxis"])) for (a = t(a), r[d] = [], f = 0; f < a.length; f++)c[d][f] && (r[d][f] = {}, v(a[f], c[d][f], r[d][f], l + 1)); else g(a) ? (r[d] = p(a) ? [] : {}, v(a, c[d] || {}, r[d], l + 1)) : r[d] = c[d] || null
                })
            } var r = {}; v(d, this.options, r, 0); return r
        }
    })(L); return L
});
//# sourceMappingURL=highcharts.js.map