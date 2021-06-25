
var canvas = null;
var gl = null;

var original_width;
var original_height;



var bfullscreen;

const WebGLMicros =
{
    DVM_ATTTRIBUTE_VERTEX : 0,
    DVM_ATTTRIBUTE_NORMAL : 1,
    DVM_ATTTRIBUTE_COLOR : 2,
    DVM_ATTTRIBUTE_TEXTURE : 3,

}



var requestAnimation = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    windows.mozRequestAnimationFrame ||
    windows.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var cancleAnimationFrame =
    window.cancleAnimationFrame ||
    window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame ||
    window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame ||
    window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame ||
    window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame;


function main() {

    canvas = document.getElementById("DVM");

    if (!canvas) {
        console.log("obtaining canvas faild.");
    }
    else {
        console.log("obtaining canvas succeded.");
    }

    original_width = canvas.width;
    original_height = canvas.height;


    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("resize", resize, false);

    init();
    resize();//warm up
    display();//warm up cause repaint nahi hot.


}

function keyDown(event) {
    switch (event.keyCode) {
        case 70:
            ToggleFullscreen();
        break;
        case 71:
            angle_StarbuckOuter += 1;
            break;
        case 27:
            unInitilize();
            window.close();
            break;
    }
}

function ToggleFullscreen(params) {

    //variable dec
    var fullscreen_element =
        document.fullscreenElement || // chrome, opera mini
        document.webkitFullscreenElement || // (apple)safari
        document.mozFullScreenElement || //modzilla fire fox
        document.msFullscreenElement || //MS edge
        null;

    // aapan screen la full screen aata kartoy.
    if (fullscreen_element == null) {

        if (canvas.requestFullscreen) {
            console.log("Inside the Chrome.");
            canvas.requestFullscreen();
            bfullscreen = true;
        }
        else if (canvas.mozRequestFullScreen) {
            console.log("Inside the Moz.");
            canvas.mozRequestFullScreen();
            fullscreen = true;
        }
        else if (canvas.webkitRequestFullscreen) {
            console.log("Inside the MacOS.");
            canvas.webkitRequestFullscreen();
            bfullscreen = true;
        }
        else if (canvas.msRequestFullscreen) {
            console.log("Inside the MS.");
            canvas.msRequestFullscreen();
            bfullscreen = true;
        }
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            bfullscreen = false;
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            bfullscreen = false;
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            bfullscreen = false;
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
            bfullscreen = false;
        }
        bfullscreen = false;
    }

}

function init() {

    //this is the most imp change 2d to webgl2
    gl = canvas.getContext("webgl2");

    if (!gl) {
        console.log("obtaining WebGL2 faild.");
    }
    else {
        console.log("obtaining WebGL2 succeded.");
    }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    initStarbucksOuter();
    
    gl.enable(gl.DEPTH_TEST);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    
    perspectiveProjectionMatrix_StarbuckOuter = mat4.create();
    mat4.identity(perspectiveProjectionMatrix_StarbuckOuter);
    

    resize();
}


function resize() {

    if (bfullscreen == true) {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    else {
        canvas.width = original_width;
        canvas.height = original_height;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    
    mat4.perspective(perspectiveProjectionMatrix_StarbuckOuter, 
        45.0, 
        parseFloat(canvas.width) / parseFloat(canvas.height), 
        0.1, 
        100.0);
}

function display() {
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   displayStarBucksOuter();
    update();

    requestAnimationFrame(display, canvas);

}

function update()
{
    
    if(angle_StarbuckOuter > 360)
    {
        angle_StarbuckOuter = 0;
    }
}

function degToRad(Degrees)
{
    return (Degrees * Math.PI / 180.0);
}

function unInitilize() {
    if (Square_Vbo_DM_StarbuckOuter) {
        gl.deleteVertexArray(Square_Vbo_DM_StarbuckOuter);
        Square_Vbo_DM_StarbuckOuter = 0;
    }

    if (Square_Vertices_Vbo_DM_StarbuckOuter) {
        gl.deleteBuffer(Square_Vertices_Vbo_DM_StarbuckOuter);
        Square_Vertices_Vbo_DM_StarbuckOuter = 0;
    }
    if (Square_Texture_Vbo_DM_StarbuckOuter) {
        gl.deleteBuffer(Square_Texture_Vbo_DM_StarbuckOuter);
        Square_Texture_Vbo_DM_StarbuckOuter = 0;
    }

    if (ShaderProgramObject_StarbuckOuter) {
        if (fragmentShaderObject_StarbuckOuter) {
            gl.detachShader(ShaderProgramObject_StarbuckOuter, fragmentShaderObject_StarbuckOuter);
            gl.deleteShader(fragmentShaderObject_StarbuckOuter);
            fragmentShaderObject_StarbuckOuter = null;

        }

        if (vertexShaderObject_StarbuckOuter) {
            gl.detachShader(ShaderProgramObject_StarbuckOuter, vertexShaderObject_StarbuckOuter);
            gl.deleteShader(vertexShaderObject_StarbuckOuter);
            vertexShaderObject_StarbuckOuter = null;
        }
        gl.deleteProgram(ShaderProgramObject_StarbuckOuter);
        ShaderProgramObject_StarbuckOuter = null;
    }
}
