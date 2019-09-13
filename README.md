# 3GS

## The library

3GS is a simple **3D graphics library for the web**, which creates a **more user-friendly interface over WebGL**. This repo contains both the library and a tech demo (a game) using it. It was created as the final project for the 2018/19 edition of the Interactive Graphics course at Sapienza University of Rome by four students of the course ([@giorgiodema](https://github.com/giorgiodema), [@polyc](https://github.com/polyc), [@jotaro-sama](https://github.com/jotaro-sama) and [@Sergio0694](https://github.com/Sergio0694)). The project required to create a game with WebGL, but, both as an exercise of software engineering and as a way to create something that could eventually be expanded on and reused later on, we decided to separate our project into a library and a game using it. The library handles the basic aspects of 3D graphics programming so that the user can get a simple 3D scene up and running without the need to write any single line of JavaScript calling the WebGL library, nor GLSL shaders. 

At the present time, **this library is by no means production ready**, and it does not replace already existing (and more complete) libraries with the same purposes. Feel free to play with it for your hobby projects though!

The library's name is a pun on the creators' names: Gabriele, Giorgio, Giovanni and Sergio.

## The game

The game has you control a walking humanoid mech in order to escape from a maze. Three mazes are procedurally generated and you can choose which one to play in the main menu. You can move with WASD and regulate the height of the camera with the mouse's scroll wheel. The model and textures for the mech were made by [@jotaro-sama](https://github.com/jotaro-sama) with Blender.

## Dependencies

The files in the `angelDependencies` folder are taken from [Edward Angel's examples](https://github.com/esangel/WebGL) for the book "Interactive Computer Graphics, 7th Edition" by him and Dave Shreiner, which was our coursebook. Where specified, they've been edited to better fit our needs.