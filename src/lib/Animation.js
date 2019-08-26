class KeyframeShift {
    _now = 0;
    _start = 0;
    constructor(object, frames, initPos, initRot, initScale, finalPos, finalRot, finalScale) {
        this._object = object;
        this._frames = frames;
        this._initPos = initPos;
        this._initRot = initRot;
        this._initScale = initScale;
        this._currentPos = initPos;
        this._currentRot = initRot;
        this._currentScale = initScale;
        this._finalPos = finalPos;
        /* finalRot parameter must be a 3*2 matrix [[rotateX -> <boolean>, xAngle],
                                                [rotateY -> <boolean>, yAngle],
                                                [rotateZ -> <boolean>, zAngle]] */
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

            //updates position
            if(this._finalPos != null){
                this._currentPos = this.interpolateVector(this._initPos, this._finalPos);
                this._object.setPosition(this._currentPos[0], this._currentPos[1], this._currentPos[2]);
            }

            //updates rotation
            if(this._finalRot != null){

                /* _finalRot property is a 3*2 matrix [[rotateX -> <boolean>, xAngle],
                                                        [rotateY -> <boolean>, yAngle],
                                                        [rotateZ -> <boolean>, zAngle]]

                    _currentRot is a vector [xAngle, yAngle, zAngle]
                */

                //updates X axis
                if(this._finalRot[0] != null){
                    this._currentRot[0] = this.interpolateScalar(this._initRot[0], this._finalRot[0][1]);
                    this._object.setRotation(this._currentRot[0], [1, 0, 0]);
                }

                //updates Y axis
                if(this._finalRot[1] != null){
                    this._currentRot[1] = this.interpolateScalar(this._initRot[1], this._finalRot[1][1]);
                    this._object.setRotation(this._currentRot[1], [0, 1, 0]);
                }

                //updates Z axis
                if(this._finalRot[2] != null){
                    this._currentRot[2] = this.interpolateScalar(this._initRot[2], this._finalRot[2][1]);
                    this._object.setRotation(this._currentRot[2], [0, 0, 1]);
                }

            }

            //updates scaling
            if(this._finalScale != null){
                this._currentScale = this.interpolateVector(this._initScale, this._finalScale);
                this._object.setScale(this._currentScale[0], this._currentScale[1], this._currentScale[2]);
            }
            console.log(this._currentRot);
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
            //this._animArrayIterator = this._animArray[Symbol.iterator]();
            this._animArrayIndex = 0;
            this._currentKeyframeshift = this._animArray[this._animArrayIndex];
        }
    }

    /*resetIterator(){
        if(this._isLoop) this._animArrayIterator = this._animArray[Symbol.iterator]();
    }

    iterate(){
        if(this._isLoop){
            var current = this._animArrayIterator.next();
            if(typeof current == 'undefined'){
                //iterator needs to be resetted
                this.resetIterator();
                return this._animArrayIterator.next();
            }
            else return current;
        }
    }*/

    //Pick a KeyframeShift from its internal stack and begins updating parameters
    // until is exhausted
    animate(){
        if (this._play) {
            var seqLen = this._animArray.length;
            //Loop sequence
            if(this._isLoop){

                //check if keyfram is exhausted
                if(!this._currentKeyframeshift.update()){
                    //it's a loop, KeyframeShift needs to be resetted
                    this._currentKeyframeshift.reset();

                    //pass to the next KeyframeShift
                    this._animArrayIndex += 1;
                    //check array len, in case restart array scanning
                    if(this._animArrayIndex == seqLen){
                        this._animArrayIndex = 0;
                    }
                    this._currentKeyframeshift = this._animArray[this._animArrayIndex];
                }

                return;
            }

            //One-shot sequence
            else {
                //check if sequence is not empty and keyframeshift not exhausted
                if(seqLen != 0 && !this._animArray[seqLen-1].update()){
                    //pop exhausted KeyframeShift
                    this._animArray.pop();
                }
                return;
            }
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
