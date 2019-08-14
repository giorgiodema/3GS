class RenderingContext {
    constructor () {
        this._loadDependency("../common/angel/webgl-utils.js", 
            this._loadDependency("../common/angel/initShaders.js", 
                this._loadDependency("../common/angel/MV.js")
            )
        );
    }

    _loadDependency(address, callback) {
        let head = document.head;
        let scriptElem = document.createElement('script');
        scriptElem.type = 'text/javascript';
        scriptElem.src = address;

        scriptElem.onreadystatechange = callback;

        head.appendChild(scriptElem);
    }
}