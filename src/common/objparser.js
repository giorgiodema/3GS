class Parser{
    constructor(serverAddr,objPath){
        this.serverAddr = serverAddr;
        this.objPath = objPath;

        this.verticesArray = [];
        this.normalsArray = [];
        this.uvCoordsArray = [];
        
        this.components = new Object();
        this.names = [];
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

    _splitLine(line,sep){
        if(line.indexOf(sep)===-1)
            return [line];
        
        var sepidx = line.indexOf(sep);
        var h = line.substring(0,sepidx);
        var t = line.substring(sepidx+1);
        return [h].concat(this._splitLine(t,sep));
    }

    _expandVertices(v){
        return [v[0],v[1],v[2],v[0],v[2],v[3]];
    }

    parse(){
        var s = this._readObjFile();
        while(s.length>0){
            var lineEnd = s.indexOf('\n');
            
            // The line is all of the characters up to the newline
            // (which is the first excluded character by substring's syntax)
            var line = s.substring(0,lineEnd);

            // The rest of the document is everything starting from the character after the newline
            s = s.substring(lineEnd+1);

            if (!(line.startsWith("o") || line.startsWith("v") ||line.startsWith("vt") || line.startsWith("vn") || line.startsWith("f")))
                continue;

            if (line.startsWith("o")){
                var name = line.substring(2);
                this.names.push(name);
                this.components[name] = new Object();
                this.components[name]["vertices"] = [];
                this.components[name]["normals"] = [];
                this.components[name]["uvCoords"] = [];
                this.verticesArray = [];
                this.normalsArray = [];
                this.uvCoordsArray = [];
            }
            else{
                
                var currComp = this.names[this.names.length-1];

                if(line.startsWith("vt")){
                    var lines = this._splitLine(line.substring(3),' ');
                    var u = parseFloat(lines[0]);
                    var v = parseFloat(lines[1]);
                    this.uvCoordsArray.push(vec2(u,v));
                }
    
                else if(line.startsWith("vn")){
                    var lines = this._splitLine(line.substring(3),' ');
                    var x = parseFloat(lines[0]);
                    var y = parseFloat(lines[1]);
                    var z = parseFloat(lines[2]);
                    this.normalsArray.push(vec3(x,y,z));
                }
    
                else if(line.startsWith("v")){
                    var lines = this._splitLine(line.substring(2),' ');
                    var x = parseFloat(lines[0]);
                    var y = parseFloat(lines[1]);
                    var z = parseFloat(lines[2]);
                    this.verticesArray.push(vec3(x,y,z));
                }
    
                else if(line.startsWith("f")){
                    var lines = this._splitLine(line.substring(2),' ');
    
                    var vidxArray = [];
                    var nidxArray = [];
                    var uvidxArray = [];

                    lines.forEach(l => {
                        // vertex \\ normal (no texture)
                        if(l.indexOf('//')>=0){
                            var a = this._splitLine(l,"//");
                            vidxArray.push(parseInt(a[0]));
                            nidxArray.push(parseInt(a[1]));
                        }
                        else{
                            var a = this._splitLine(l,"/");
                            // vertex / uvcoord / normal
                            if(a.length===3){
                                vidxArray.push(parseInt(a[0]));
                                uvidxArray.push(parseInt(a[1]));
                                nidxArray.push(parseInt(a[2]));
                            }
                            // vertex / uvcoord
                            else if(a.length===2){
                                vidxArray.push(parseInt(a[0]));
                                uvidxArray.push(parseInt(a[1]));
                            }
                        }
                    });

                    // triangles
                    if(vidxArray.length===3){
                        vidxArray.forEach(vidx => {
                            // The -1 is required because our array starts from index 0 while the
                            // .obj format starts counting from 1 
                            this.components[currComp]["vertices"].push(this.verticesArray[vidx - 1]);
                        });
                        nidxArray.forEach(nidx => {
                            this.components[currComp]["normals"].push(this.normalsArray[nidx - 1]);
                        });
                        uvidxArray.forEach(uvidx => {
                            this.components[currComp]["uvCoords"].push(this.uvCoordsArray[uvidx - 1]);
                        });
                    }

                    // quadrilaterals
                    else if(vidxArray.length==4){
                        var vidxArrayExp = this._expandVertices(vidxArray);
                        var nidxArrayExp = nidxArray.length === 0 ? [] : this._expandVertices(nidxArray);
                        var uvidxArrayExp = uvidxArray.length === 0 ? [] : this._expandVertices(uvidxArray);
                        vidxArrayExp.forEach(vidx => {
                            this.components[currComp]["vertices"].push(this.verticesArray[vidx - 1]);
                        });
                        nidxArrayExp.forEach(nidx => {
                            this.components[currComp]["normals"].push(this.normalsArray[nidx - 1]);
                        });
                        uvidxArrayExp.forEach(uvidx => {
                            this.components[currComp]["uvCoords"].push(this.uvCoordsArray[uvidx - 1]);
                        });
                    }
    
                }
            }
        }
    }

    getComponents(){
        return this.names.slice(0);
    }

    getVertices(componentName){
        if(this.names.findIndex(e =>{return e===componentName;})>=0)
            if(this.components[componentName]["vertices"].length>0)
                return this.components[componentName]["vertices"].slice(0);
        else
            return null;
    }

    getNormals(componentName){
        if(this.names.findIndex(e =>{return e===componentName;})>=0)
            if(this.components[componentName]["normals"].length>0)
                return this.components[componentName]["normals"].slice(0);
        else
            return null;
    }

    getUVCoords(componentName){
        if(this.names.findIndex(e =>{return e===componentName;})>=0)
            if(this.components[componentName]["uvCoords"].length>0)
                return this.components[componentName]["uvCoords"].slice(0);
        else
            return null;
    }
    
}



