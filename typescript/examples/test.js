var Route = /** @class */ (function () {
    function Route(controllerName, actionName, args) {
        this.controllerName = controllerName;
        this.actionName = actionName;
        this.args = args;
    }
    return Route;
}());
var Router = /** @class */ (function () {
    function Router(defaultController, defaultACtion) {
        this._defaultController = defaultController || 'home';
        this._defaultAction = defaultACtion || 'index';
    }
    Router.prototype.initialize = function () {
        var _this = this;
        // 观察用户改变 URL 的行为
        window.addEventListener('hashchange', function () {
            var r = _this.getRoute();
            _this.onRouteChange(r);
        });
    };
    Router.prototype.getRoute = function () {
        var h = window.location.hash;
        return this.parseRoute(h);
    };
    Router.prototype.parseRoute = function (hash) {
        var comp, controller, action, args, i;
        if (hash[hash.length - 1] === '/') {
            hash = hash.substring(0, hash.length - 1);
        }
        comp = hash.replace('#', '').split('/');
        controller = comp[0] || this._defaultController;
        action = comp[1] || this._defaultAction;
        args = [];
        for (i = 2; i < comp.length; i++) {
            args.push(comp[i]);
        }
        return new Route(controller, action, args);
    };
    Router.prototype.onRouteChange = function (route) {
        console.log(route);
    };
    return Router;
}());
// @ts-ignore
var a = new Router();
console.log(a);
