


class Parser{
    constructor(serverAddr,objPath){
        this.serverAddr = serverAddr;
        this.objPath = objPath;
        this.components = [];
    }

    _readObjFile(){
        var request = new XMLHttpRequest();
        request.open("GET",this.serverAddr + "/" + this.objPath,false);
        request.send();
        if (request.status === 200) 
            return request.responseText;
        else
            return null;
    }

    parse(){
        var s = this._readObjFile();
        while(s.length>0){
            var lineEnd = s.indexOf('\n');
            var line = s.substr(0,lineEnd);
            s = s.substr(lineEnd+1,s.length-1);

            if (!(line.startsWith("o") || line.startsWith("vt") || line.startsWith("vn") || line.startsWith("f")))
                continue;

            console.log(line);
            console.log("---------------------");
        }
    }

    getVertices(){
        return this.vertices;
    }

    getNormals(){
        return this.normals;
    }

    getUVCoords(){
        return this.uvcoords;
    }
    
}



