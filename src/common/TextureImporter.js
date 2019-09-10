class TextureImporter {
    constructor(objPath){
        this.objPath = objPath;
    }    

    getTexture(callback) {
        let texture = document.getElementById("texImage");
        texture.src = this.objPath;

        function loaded() {
            callback(texture);
        }

        if (texture.complete) {
            loaded()
        } else {
            texture.addEventListener('load', loaded)
            texture.addEventListener('error', function() {
                console.log("Error loading the texture.");
            })
        }
    }
}