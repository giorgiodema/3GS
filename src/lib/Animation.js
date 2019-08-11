class KeyframeShift {
    _now = 0;
    _start = 0;
    constructor(object, frames, pos, rot, scale) {
        this._obj = object;
        this._frames = frames;
        this._initPos = object.pos;
        this._initRot = object.rot;
        this._initScale = object.scale;
        this._currentPos = object.pos;
        this._currentRot = object.rot;
        this._currentScale = object.scale;
        this._finalPos = pos;
        /* rot parameter must be a 3*2 matrix [[rotateX -> <boolean>, xAngle],
                                                [rotateY -> <boolean>, yAngle],
                                                [rotateZ -> <boolean>, zAngle]] */
        this._finalRot = rot;
        this._finalScale = scale;
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
            if(this._finalPos != NULL)[
                this._currentPos = this.interpolateVector(this._currentPos, this._finalPos);
                this._object.translate(this._currentPos[0], this._currentPos[1], this._currentPos[2]);
            }

            //updates rotation
            if(this._finalRot != NULL){

                /* _finalRot property is a 3*2 matrix [[rotateX -> <boolean>, xAngle],
                                                        [rotateY -> <boolean>, yAngle],
                                                        [rotateZ -> <boolean>, zAngle]]

                    _currentRot is a vector [xAngle, yAngle, zAngle]
                */

                //updates X axis
                if(this._finalRot[0][0]){
                    this._currentRot[0] = this.interpolateVector(this._currentRot[0], this._finalRot[0][1]);
                    this._object.rotate(this._currentRot[0], [1, 0, 0]);
                }

                //updates Y axis
                if(this._finalRot[1][0]){
                    this._currentRot[1] = this.interpolateVector(this._currentRot[1], this._finalRot[1][1]);
                    this._object.rotate(this._currentRot[1], [0, 1, 0]);
                }

                //updates Z axis
                if(this._finalRot[2][0]){
                    this._currentRot[2] = this.interpolateVector(this._currentRot[2], this._finalRot[2][1]);
                    this._object.rotate(this._currentRot[2], [0, 0, 1]);
                }
            }

            //updates scaling
            if(this._finalScale != NULL){
                this._currentScale = this.interpolateVector(this._currentScale, this._finalScale);
                this._object.scale(this._currentScale[0], this._currentScale[1], this._currentScale[2]);
            }

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
            this._animArrayIterator = this._animArray[Symbol.iterator]();
            this._currentKeyframeshift;
        }
    }

    resetIterator(){
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
    }

    //Pick a KeyframeShift from its internal stack and begins updating parameters
    // until is exhausted
    animate(){
        if (this._play) {
            //Loop sequence
            if(this._isLoop){
                //check initialization
                if(typeof this._currentKeyframeshift == 'undefined') this._currentKeyframeshift.iterate();

                //check if keyfram is exhausted
                if(this._currentKeyframeshift.update() == false){
                    //it's a loop, Keyframeshift needs to be resetted
                    this._currentKeyframeshift.reset();

                    //pass to the next KeyframeShift
                    this._currentKeyframeshift.iterate();
                }

                return;
            }

            //One-shot sequence
            else {
                var seqLen = this._animArray.length;
                //check if sequence is not empty and keyframeshift not exhausted
                if(seqLen != 0 && !this._animArray[slen-1].update()){
                    //pop exhausted keyframe
                    sequence.pop();
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
