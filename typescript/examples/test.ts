class Route {
    public controllerName: string
    public actionName: string
    public args: Object[]

    constructor(controllerName: string, actionName: string, args: Object[]) {
        this.controllerName = controllerName
        this.actionName = actionName
        this.args = args
    }
}

class Router {
    private readonly _defaultController: string
    private readonly _defaultAction: string
    constructor(defaultController: string, defaultACtion: string) {
        this._defaultController = defaultController || 'home'
        this._defaultAction = defaultACtion || 'index'
    }
    public initialize() {
        // 观察用户改变 URL 的行为
        window.addEventListener('hashchange', () => {
            const r = this.getRoute()
            this.onRouteChange(r)
        })
    }

    private getRoute() {
        const h = window.location.hash
        return this.parseRoute(h)
    }

    private parseRoute(hash: string) {
        let comp,controller,action,args,i
        if (hash[hash.length - 1] === '/') {
            hash = hash.substring(0, hash.length - 1)
        }
        comp = hash.replace('#', '').split('/')
        controller = comp[0] || this._defaultController
        action = comp[1] || this._defaultAction
        args = []
        for (i = 2; i < comp.length; i++) {
            args.push(comp[i])
        }
        return new Route(controller, action, args)
    }

    private onRouteChange(route: Route) {
        this.meditor.publish(new AppEvent('app.dispatch', route, null))
        console.log(route)
    }
}

// @ts-ignore
let a = new Router()
console.log(a)

interface IMediator {
    publish(e: IAppEvent): void
    subscribe(e: IAppEvent): void
    unsubscribe(e: IAppEvent): void
}

class Router {
    // ...
    private onRouteChange(route: Route) {
        this.meditor.publish(new AppEvent('app.dispatch', route, null))
    }
}

class Dispatch {
    //...
    public initialize() {
        this.meditor.subscribe(new AppEvent('app.dispatch', null, (e:any, data?:any) => {
            this.dispatch(data)
        }))
    }
    // 创建和销毁 controller 实例
    private dispatch(route: IRoute) {
        // 1. 销毁旧的 controller
        // 2. 创建新的控制器实例
        // 3. 通过中介器触发控制器的 action
    }
    // ...
}