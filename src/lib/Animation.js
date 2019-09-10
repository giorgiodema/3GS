class KeyframeShift {
    constructor(object, frames, initPos, initRot, initScale, finalPos, finalRot, finalScale, rotPoint) {
        this._now = 0;
        this._start = 0;
        this._object = object;
        this._frames = frames;
        this._initPos = initPos;
        this._initRot = initRot;
        this._initScale = initScale;
        this._rotPoint = rotPoint;

        if(this._initPos !== null)
            this._currentPos = vec3(initPos[0], initPos[1], initPos[2]);

        if(this._initRot !== null)
            this._currentRot = vec3(initRot[0], initRot[1], initRot[2]);

        if(this._initScale !== null)
            this._currentScale = vec3(initScale[0], initScale[1], initScale[2]);

        this._finalPos = finalPos;
        this._finalRot = finalRot;
        this._finalScale = finalScale;
    }

    //Return an interpolated scalar value
    interpolateScalar(initValue, finalValue){
        var ret = initValue + ((this._now - this._start)/(this._frames - this._start)) * (finalValue - initValue);
        return ret;
    }

    //Return an interpolated vector
    interpolateVector(initVector, finalVector){
        var ret = vec3(0,0,0);
        ret[0] = this.interpolateScalar(initVector[0], finalVector[0]);
        ret[1] = this.interpolateScalar(initVector[1], finalVector[1]);
        ret[2] = this.interpolateScalar(initVector[2], finalVector[2]);

        return ret;
    }

    //Update objects parameters
    update(){
        //check if keyframe is exhausted
        if(this._now < this._frames){

            //center the object in the origin before computing transformation
            var objPos = vec3(this._object.pos[0],this._object.pos[1],this._object.pos[2]);
            this._object.translate(-objPos[0],-objPos[1],-objPos[2]);
            // undo scale before computing transformations
            var objScale = vec3(this._object._scale[0],this._object._scale[1],this._object._scale[2]);
            this._object.setScale(1.0,1.0,1.0);

            //updates position
            if(this._finalPos != null){
                this._currentPos = this.interpolateVector(this._initPos, this._finalPos);
                this._object.setPosition(this._currentPos[0], this._currentPos[1], this._currentPos[2]);
            }

            //updates rotation
            if(this._finalRot != null){

                //updates X axis
                if(this._finalRot[0] != null){
                    this._currentRot[0] = this.interpolateScalar(this._initRot[0], this._finalRot[0],this._rotPoint);
                    this._object.setRotation(this._currentRot[0], [1, 0, 0]);
                }

                //updates Y axis
                if(this._finalRot[1] != null){
                    this._currentRot[1] = this.interpolateScalar(this._initRot[1], this._finalRot[1],this._rotPoint);
                    this._object.setRotation(this._currentRot[1], [0, 1, 0]);
                }

                //updates Z axis
                if(this._finalRot[2] != null){
                    this._currentRot[2] = this.interpolateScalar(this._initRot[2], this._finalRot[2],this._rotPoint);
                    this._object.setRotation(this._currentRot[2], [0, 0, 1]);
                }

            }

            //updates scaling
            if(this._finalScale != null){
                this._currentScale = this.interpolateVector(this._initScale, this._finalScale);
                this._object.setScale(this._currentScale[0], this._currentScale[1], this._currentScale[2]);
            }

            //redo scaling after computing transformation
            this._object.setScale(objScale[0],objScale[1],objScale[2]);
            
            //move object in its original position after computing transfomrations
            this._object.translate(objPos[0],objPos[1],objPos[2]);

            //increment logical time
            this._now += 1;
            return true;
        }
        //keyframe exhausted
        else return false;
    }

    //reset keyframeshift
    reset(){
        this._now = 0;
    }
}


class Animation {
    constructor(isLoop, animArray) {
        this._play = true;
        this._animArray = animArray;
        this._isLoop = isLoop;
        if (isLoop){
            this._animArrayIndex = 0;
            this._currentKeyframeshift = this._animArray[this._animArrayIndex];
        }
    }

    //Pick a KeyframeShift from its internal stack and begins updating parameters
    // until is exhausted
    animate(){
        if (this._play) {

            var seqLen = this._animArray.length;


            //check if keyframeshift is exhausted and if animation is a loop
            if(this._isLoop){
                if (this._currentKeyframeshift.update() == false) {

                    //it's a loop, KeyframeShift needs to be resetted
                    this._currentKeyframeshift.reset();

                    //pass to the next KeyframeShift
                    this._animArrayIndex += 1;

                    //check array len, in case restart array scanning
                    if(this._animArrayIndex == seqLen){
                        this._animArrayIndex = 0;
                    }

                    //assign next keyframeShift
                    this._currentKeyframeshift = this._animArray[this._animArrayIndex];
                    return;
                }
            }

            //One-shot animation case
            else if (seqLen != 0 && !this._animArray[0].update())
                //shift (remove first element) exhausted KeyframeShift
                this._animArray.shift();
        }
    }

    //pause animation
    pause(){
        this._play = false;
    }

    //play animation
    play(){
        this._play = true;
    }

}
