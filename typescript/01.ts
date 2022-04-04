class User {
    public name: string
    public password: string
}

class NotGenericUserRepository<T> {
    private _url: string

    constructor(url: string) {
        this._url = url
    }

    public getAsync() {
        return Q.Promise((resolve: (users: User[]) =>), resect)
    }
}