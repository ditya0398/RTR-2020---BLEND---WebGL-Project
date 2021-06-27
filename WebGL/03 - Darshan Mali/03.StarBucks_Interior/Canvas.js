var SBR_DM_canvas = null;
var gl = null;

var SBR_DM_original_width;
var SBR_DM_original_height;



var SBR_DM_bfullscreen;






var SBR_DM_requestAnimation = window.requestAnimationFrame ||
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

    SBR_DM_canvas = document.getElementById("DVM");

    if (!SBR_DM_canvas) {
        console.log("obtaining SBR_DM_canvas faild.");
    }
    else {
        console.log("obtaining SBR_DM_canvas succeded.");
    }

    SBR_DM_original_width = SBR_DM_canvas.width;
    SBR_DM_original_height = SBR_DM_canvas.height;


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
                SBR_DM_angle += 0.1;
            break;
            case 72:
                SBR_DM_angle -= 0.1;
            break;
            case 73:
                console.log("SBR_DM_angle is :" + SBR_DM_angle);
                console.log("X is :" + SBR_DM_X_);
                console.log("Y is :" + SBR_DM_Z_);
                break;
        case 37: //LEFT
            SBR_DM_X_ += 0.5;
            break;
        case 38: //UP
            SBR_DM_Z_ += 0.5;
            break;
        case 39://RIGHT
            SBR_DM_X_ -= 0.5;
            break;
        case 40: //DOWN
            SBR_DM_Z_ -= 0.5;
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

        if (SBR_DM_canvas.requestFullscreen) {
            console.log("Inside the Chrome.");
            SBR_DM_canvas.requestFullscreen();
            SBR_DM_bfullscreen = true;
        }
        else if (SBR_DM_canvas.mozRequestFullScreen) {
            console.log("Inside the Moz.");
            SBR_DM_canvas.mozRequestFullScreen();
            fullscreen = true;
        }
        else if (SBR_DM_canvas.webkitRequestFullscreen) {
            console.log("Inside the MacOS.");
            SBR_DM_canvas.webkitRequestFullscreen();
            SBR_DM_bfullscreen = true;
        }
        else if (SBR_DM_canvas.msRequestFullscreen) {
            console.log("Inside the MS.");
            SBR_DM_canvas.msRequestFullscreen();
            SBR_DM_bfullscreen = true;
        }
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            SBR_DM_bfullscreen = false;
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            SBR_DM_bfullscreen = false;
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            SBR_DM_bfullscreen = false;
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
            SBR_DM_bfullscreen = false;
        }
        SBR_DM_bfullscreen = false;
    }

}

function init() {

    gl = SBR_DM_canvas.getContext("webgl2");

    if (!gl) {
        console.log("obtaining WebGL2 faild.");
    }
    else {
        console.log("obtaining WebGL2 succeded.");
    }

    gl.viewportWidth = SBR_DM_canvas.width;
    gl.viewportHeight = SBR_DM_canvas.height;

   
init_InteriorStarbucks();
    gl.enable(gl.DEPTH_TEST);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    
   

    SBR_DM_Perspective_Projection_Matrix = mat4.create();
    mat4.identity(SBR_DM_Perspective_Projection_Matrix);

    resize();
}


function resize() {

    if (SBR_DM_bfullscreen == true) {

        SBR_DM_canvas.width = window.innerWidth;
        SBR_DM_canvas.height = window.innerHeight;
    }
    else {
        SBR_DM_canvas.width = SBR_DM_original_width;
        SBR_DM_canvas.height = SBR_DM_original_height;
    }

    gl.viewport(0, 0, SBR_DM_canvas.width, SBR_DM_canvas.height);
    
    mat4.perspective(SBR_DM_Perspective_Projection_Matrix, 
        45.0, 
        parseFloat(SBR_DM_canvas.width) / parseFloat(SBR_DM_canvas.height), 
        0.1, 
        100.0);
}

function display() {
    

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   display_InteriorStarbucks();
  //  update();

    requestAnimationFrame(display, SBR_DM_canvas);
}



function degToRad(Degrees)
{
    return (Degrees * Math.PI / 180.0);
}

function update()
{

    if(SBR_DM_angle > 360.0)
    {
        SBR_DM_angle = 0.0;
    }
}

function unInitilize() {
    if (SBR_DM_Cube_Vbo) {
        gl.deleteVertexArray(SBR_DM_Cube_Vbo);
        SBR_DM_Cube_Vbo = 0;
    }

    if (SBR_DM_Cube_Vertices_Vbo) {
        gl.deleteBuffer(SBR_DM_Cube_Vertices_Vbo);
        SBR_DM_Cube_Vertices_Vbo = 0;
    }
    if (SBR_DM_Cube_Texture_Vbo_DM) {
        gl.deleteBuffer(SBR_DM_Cube_Texture_Vbo_DM);
        SBR_DM_Cube_Texture_Vbo_DM = 0;
    }

    if (SBR_DM_ShaderProgramObject) {
        if (SBR_DM_fragmentShaderObject) {
            gl.detachShader(SBR_DM_ShaderProgramObject, SBR_DM_fragmentShaderObject);
            gl.deleteShader(SBR_DM_fragmentShaderObject);
            SBR_DM_fragmentShaderObject = null;

        }

        if (SBR_DM_vertexShaderObject) {
            gl.detachShader(SBR_DM_ShaderProgramObject, SBR_DM_vertexShaderObject);
            gl.deleteShader(SBR_DM_vertexShaderObject);
            SBR_DM_vertexShaderObject = null;
        }
        gl.deleteProgram(SBR_DM_ShaderProgramObject);
        SBR_DM_ShaderProgramObject = null;
    }
}
