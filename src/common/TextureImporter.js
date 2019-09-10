class TextureImporter {
    constructor(objPath){
        this.objPath = objPath;
    }    

    getTexture(callback) { 
        let texture = document.createElement("img");
        texture.hidden = "true";
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