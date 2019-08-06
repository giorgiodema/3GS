class KeyframeShift {
    constructor(object, frames, pos, rot, scale) {
        this.obj = object;
        this.frames = frames;
        this.initPos = object.pos;
        this.initRot = object.rot;
        this.initScale = object.scale;
        this.currentPos = object.pos;
        this.currentRot = object.rot;
        this.currentScale = object.scale;
        this.finalPos = pos;
        this.finalRot = rot;
        this.finalScale = scale;
    }

    interpolate(){
        //TODO
    }

    update() {
        //TODO
    }
}

class Animation {
    constructor(isLoop) {
        this.play = true;
        this.animArray = new Array();
        this.isLoop = isLoop;
    }
    addAnimation(){

        //TODO
    }

    animate(){
        //TODO
        if (this.play) {
            //ROBA UPDATE
        }

        //IF LOOP AND ANIMATION ENDED ---> RESET CURRENT POS
    }

    pause(){
        this.play = false;
    }

    play(){
        this.play = true;
    }
}
