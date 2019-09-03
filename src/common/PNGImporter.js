class PNGImporter {
    constructor(objPath){
        this.objPath = objPath;
    }    

    getImageMatrix(callback) {
        let imgObj = new Image();
        imgObj.src = this.objPath;
        imgObj.onload = () => {
            let canvas = document.getElementById("imageLoadingCanvas");
            let ctx = canvas.getContext("2d");
            ctx.drawImage(imgObj, 0, 0);

            let imgData = ctx.getImageData(0, 0, 1024, 1024);

            let matrix = new Array();
            for(let i = 0; i < imgData.width; i++) {
                let column = new Array();
                for(let j = 0 ; j < imgData.height; j++) {
                    let red = j * (imgData.width * 4) + (i * 4)
                    column.push([imgData.data[red], imgData.data[red+1], imgData.data[red+2], imgData.data[red+3]]);
                }
                matrix.push(column);
            }
            callback(matrix);
        };
        imgObj.onerror = () => {
            console.log("Error loading the image");
        };
    }
}