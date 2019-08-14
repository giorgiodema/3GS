class RenderingContext {
    constructor () {

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