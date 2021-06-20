
//To start animation: To have requestAnimation() to be called "cross-browser" compatible
var tvn_requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

//To stop animation : to have cancelAnimationFrame() to be called "cross-browser" compatible
var cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame ||
    window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame ||
    window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame ||
    window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame;

// onload function
function main() {
    // get canvas element
    canvas = document.getElementById("tvn");
    if (!canvas)
        console.log("Obtaining Canvas Failed\n");
    else
        console.log("Obtaining Canvas Succeeded\n");
    canvas_orignal_width = canvas.width;
    canvas_orignal_height = canvas.height;

    //register keyboard's keydown event handler
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("click", mouseDown, false);
    window.addEventListener("resize", resize, false);

    //initialize WebGL
    init();

    // start drawing here as warming-up
    resize();
    draw();
}

function toggleFullScreen() {
    //code 
    var fullscreen_element =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullscreenElement ||
        document.msFullscreenElement ||
        null;

    //if not fullscreen
    if (fullscreen_element == null) {
        if (canvas.requestFullScree)
            canvas.requestFullScree();
        else if (canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
        else if (canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();
        else if (canvas.msRequestFullscreen)
            canvas.msRequestFullscreen();
        bFullscreen = true;
    }
    else // if already fullscreen
    {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
        bFullscreen = false;
    }
}

function init() {
    // code 
    // get WebGL 2.0 context 
    gl = canvas.getContext("webgl2");
    if (gl == null) // failed to get context
    {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    tvn_init();

    /*********************************************************/
    //set clear color 
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //blue 

    //inidialize projection matrix
    perspectiveProjectionMatrix = mat4.create();
}

function resize() {
    //code 
    if (bFullscreen == true) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    else {
        canvas.width = canvas_orignal_width;
        canvas.height = canvas_orignal_height;
    }

    //set the viewport to match
    gl.viewport(0, 0, canvas.width, canvas.height);


    mat4.perspective(perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width) / parseFloat(canvas.height), 0.1, 100.0);

}

function draw() {
    //code 
    gl.clear(gl.COLOR_BUFFER_BIT);

    tvn_display();
    
    //animation loop
    requestAnimationFrame(draw, canvas);
}

function uninitialize() {
    tvn_uninitialize();
    }

function keyDown(event) {
    //code
    switch (event.keyCode) {
        case 27: // escape 
            //unitialize
            uninitialize();
            //close our application's tab
            window.close(); // may not work in firefox but work in safari and chrome 
            break;
        case 70: // for 'F' or 'f'
            toggleFullScreen();
            break;
    }
}

function mouseDown() {
    //code
}