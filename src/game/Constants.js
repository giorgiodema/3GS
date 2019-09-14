// An enum to keep track of the cells state
const _CELL = {
    EMPTY: 0,
    UNDEFINED: 1,
    WALL: 2,
    PASSAGE: 3,
    PLAYER: 4,
    TARGET: 5
}

class Constants {

    static get GRID_WIDTH() {
        return 20;
    }

    static get BLOCK_SIZE() {
        return 1;
    }

    static get CELL() {
        return _CELL;
    }

    static get CAMERA_DISTANCE() {
        return 0.5;
    }

    static get CAMERA_HEIGHT() {
        return 0.1;
    }

    static get CHARACTER_SCALING() {
        return 0.01;
    }

    static get CHARACTER_HEIGHT() {
        return 0.08;
    }

    static get TROPHY_COLOR(){ 
        return vec3(211/255,176/255,0);
    }

    static get WALL_COLOR() {
        return vec3(4/255,59/255,4/255);
    }

    static get GROUND_COLOR() {
        return vec3(181/255, 150/255, 110/255);
    }

    static get LIGHT_HEIGHT() {
        return 50;
    }

    static get UPPER_ARM_ROTATION_POINT() {
        return vec3(0.0,-3.0,0.0);
    }

    static get LOWER_LEG_ROTATION_POINT() {
        return vec3(-2,0.0,0.0);
    }

    static get FOOT_ROTATION_POINT() {
        return vec3(0.0,5.0,0.0);
    }

}
