
var canvas = null;
var gl = null;

var original_width;
var original_height;

var angle = 0.0;

var bfullscreen;

const WebGLMicros =
{
    DVM_ATTTRIBUTE_VERTEX : 0,
    DVM_ATTTRIBUTE_NORMAL : 1,
    DVM_ATTTRIBUTE_COLOR : 2,
    DVM_ATTTRIBUTE_TEXTURE : 3,

}

var vertexShaderObject;
var fragmentShaderObject;
var ShaderProgramObject;

var Cube_Vbo_DM;
var Cube_Vertices_Vbo_DM;
var Cube_Texture_Vbo_DM;

var mUniform_DM;
var vUniform_DM;
var pUniform_DM;


/* Texture Variables */
var Table_Texture;
var Table_surface_Texture;
var Desk_Texture;
var Green_Texture;
var Pot_Texture;
var CupBoard_Texture;
var Menu_01_Texture;
var Menu_02_Texture;
var Table_Sofa_Texture;
var Floar_Texture;
var Ceiling_Texture;
var starbucks_roof_texture;
var starbucks_floor_texture
var starbucks_wall_texture
var starbucks_logo_texture

var X_ = 0.0;
var Z_ = 5.0;

var Stack_Matrix = [];
var Matrix_Count = -1;


var texture_Sampler_Uniform;

var perspectiveDM_Projection_Matrix;


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
                angle += 0.1;
            break;
            case 72:
                angle -= 0.1;
            break;
            case 73:
                console.log("angle is :" + angle);
                console.log("X is :" + X_);
                console.log("Y is :" + Z_);
                break;
        case 37: //LEFT
            X_ += 0.5;
            break;
        case 38: //UP
            Z_ += 0.5;
            break;
        case 39://RIGHT
            X_ -= 0.5;
            break;
        case 40: //DOWN
            Z_ -= 0.5;
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

    gl = canvas.getContext("webgl2");

    if (!gl) {
        console.log("obtaining WebGL2 faild.");
    }
    else {
        console.log("obtaining WebGL2 succeded.");
    }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    /* VertexShaderObject */
    var VertexShaderSourceCode =
        "#version 300 es                \n" +
        "in vec4 vPosition;             \n" +
        "in vec2 vTexCoord;             \n" +
		"out vec2 out_TexCoord;         \n" +
		"uniform mat4 u_m_matrix;       \n" +
		"uniform mat4 u_v_matrix;       \n" +
		"uniform mat4 u_p_matrix;       \n" +
		"void main(void){               \n" +
		"gl_Position = u_p_matrix * u_v_matrix * u_m_matrix * vPosition;\n" +
		"out_TexCoord = vTexCoord;             \n" +
        "}";



    vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, VertexShaderSourceCode);
    gl.compileShader(vertexShaderObject);

    if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(vertexShaderObject);
        if (error.length > 0) {
            console.log("after vertex shader code compile.");

            alert(error)
            unInitilize();
        }
    }
    /* Fragment shader code */

    var fragmentShaderSourceCode =
        "#version 300 es                \n" +
        "precision highp float;         \n" +
        "uniform highp sampler2D u_Texture_Sampler;\n" +
        "in vec2 out_TexCoord;          \n" +
		"out vec4 FragColor;            \n" +
		"void main(void){               \n" +
		"FragColor = texture(u_Texture_Sampler, out_TexCoord);\n" +
        "}";

    fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
    gl.compileShader(fragmentShaderObject);

    if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(fragmentShaderObject);
        if (error.length > 0) {
            alert(error)
            unInitilize();
        }
    }

    /* Shader Linking  */

    ShaderProgramObject = gl.createProgram();
    gl.attachShader(ShaderProgramObject, vertexShaderObject);
    gl.attachShader(ShaderProgramObject, fragmentShaderObject);

    gl.bindAttribLocation(ShaderProgramObject, WebGLMicros.DVM_ATTTRIBUTE_VERTEX, "vPosition");
    gl.bindAttribLocation(ShaderProgramObject, WebGLMicros.DVM_ATTTRIBUTE_TEXTURE, "vTexCoord");


    gl.linkProgram(ShaderProgramObject);
    if (!gl.getProgramParameter(ShaderProgramObject, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(ShaderProgramObject);
        if (error.length > 0) {
            alert(error);
            unInitilize();
        }
    }

    mUniform_DM = gl.getUniformLocation(ShaderProgramObject, "u_m_matrix");
    vUniform_DM = gl.getUniformLocation(ShaderProgramObject, "u_v_matrix");
    pUniform_DM = gl.getUniformLocation(ShaderProgramObject, "u_p_matrix");
    texture_Sampler_Uniform = gl.getUniformLocation(ShaderProgramObject,"u_Texture_Sampler");

    var CubeVertices = new Float32Array([
        //Front 
        6.0, 3.0, 6.0,
        -6.0, 3.0, 6.0,
        -6.0, -1.5, 6.0,
        6.0, -1.5, 6.0,

        //Right
        6.0, 3.0, -6.0,
        6.0, 3.0, 6.0,
        6.0, -1.5, 6.0,
        6.0, -1.5, -6.0,
    
        //Back
        6.0, 3.0, -6.0,
        -6.0, 3.0, -6.0,
        -6.0, -1.5, -6.0,
        6.0, -1.5, -6.0,

        //Left
        -6.0, 3.0, -6.0,
        -6.0, 3.0, 6.0,
        -6.0, -1.5, 6.0,
        -6.0, -1.5, -6.0,

        //Bottom
        6.0, -1.5, 6.0,
        -6.0, -1.5, 6.0,
        -6.0, -1.5, -6.0,
        6.0, -1.5, -6.0,

        //Top
        6.0, 3.0, 6.0,
        -6.0, 3.0, 6.0,
        -6.0, 3.0, -6.0,
        6.0, 3.0, -6.0,

        //counter  Front
        -4.5, -0.5, -5.0,
        -1.5, -0.5, -5.0,
        -1.5, -1.5, -5.0,
        -4.5, -1.5, -5.0,
        
        //counter Left 
        -4.5, -0.5, -5.0,
        -4.5, -0.5, -0.5,
        -4.5, -1.5, -0.5,
        -4.5, -1.5, -5.0,

        //Left side counter Cover 
        -4.5, -0.5, -0.5,
        -6.0, -0.5, -0.5,
        -6.0, -1.5, -0.5,
        -4.5, -1.5, -0.5,

        //left Table Desk  
        -4.3, -0.45, -5.5,
        -4.3, -0.45, -0.5,
        -5.0, -0.45, -0.5,
        -5.0, -0.45, -5.5,

        //left Table Desk front cover  
        -4.3, -0.45, -5.5,
        -4.3, -0.45, -0.5,
        -4.3, -0.5, -0.5,
        -4.3, -0.5, -5.5,

        //left Table Desk left cover  
        -4.3, -0.45, -0.5,
        -5.0, -0.45, -0.5,
        -5.0, -0.5, -0.5,
        -4.3, -0.5, -0.5,

        //Front Table Desk
        -1.5, -0.45, -4.8,
        -4.3, -0.45, -4.8,
        -4.3, -0.45, -5.5,
        -1.5, -0.45, -5.5,

        //Front Table Desk front cover
        -1.5, -0.45, -4.8,
        -4.3, -0.45, -4.8,
        -4.3, -0.5, -4.8,
        -1.5, -0.5, -4.8,

        //Sofa BOTTOM Front
        -5.25, -1.0, 2.5,
        -5.25, -1.0, 5.25,
        -5.25, -1.5, 5.25,
        -5.25, -1.5, 2.5,

        //Sofa middle one 
        -5.25, -1.0, 2.5,
        -5.25, -1.0, 5.25,
        -5.75, -1.0, 5.25,
        -5.75, -1.0, 2.5,

        //Sofa middle back 
        -5.75, -0.5, 2.5,
        -5.75, -0.5, 5.75,
        -5.75, -1.0, 5.75,
        -5.75, -1.0, 2.5,

        //Sofa top one 
        -5.75, -0.5, 2.5,
        -5.75, -0.5, 5.75,
        -6.0, -0.5, 5.75,
        -6.0, -0.5, 2.5,

        //Left Sofa BOTTOM Front
        -2.5, -1.5, 5.25,
        -5.25, -1.5, 5.25,
        -5.25, -1.0, 5.25,
        -2.5, -1.0, 5.25,
        
        //left Sofa middle one 
        -2.5, -1.0, 5.25,
        -5.75, -1.0, 5.25,
        -5.75, -1.0, 5.75,
        -2.5, -1.0, 5.75,

        //Left Sofa middle back 
        -2.5, -0.5, 5.75,
        -5.75, -0.5, 5.75,
        -5.75, -1.0, 5.75,
        -2.5, -1.0, 5.75,

        // Left Sofa top one 
        -2.5, -0.5, 6.0,
        -6.0, -0.5, 6.0,
        -6.0, -0.5, 5.75,
        -2.5, -0.5, 5.75,

        //Sofa Out side Corner (Inner Portion) 
        -5.25, -1.5, 2.5,
        -6.0, -1.5, 2.5,
        -6.0, -0.5, 2.5,
        -5.25, -0.5, 2.5,  
        
        //Sofa Out side Corner (Outer Portion)  
        -5.25, -1.5, 2.0,
        -6.0, -1.5, 2.0,
        -6.0, -0.5, 2.0,
        -5.25, -0.5, 2.0,

        //Sofa Out side Corner (Front Portion)  
        -5.25, -0.5, 2.0,
        -5.25, -0.5, 2.5,
        -5.25, -1.5, 2.5,
        -5.25, -1.5, 2.0,

        //Sofa Out side Corner (Top Portion)  
        -5.25, -0.5, 2.5,
        -5.25, -0.5, 2.0,
        -6.0, -0.5, 2.0,
        -6.0, -0.5, 2.5,

        //Sofa Out side Corner (left Inner Portion)
        -2.5, -0.5, 5.25,
        -2.5, -0.5, 6.0,
        -2.5, -1.5, 6.0,
        -2.5, -1.5, 5.25,
                
        //Sofa Out side Corner (Left Outer Portion)
        -2.0, -0.5, 5.25,
        -2.0, -0.5, 6.0,
        -2.0, -1.5, 6.0,
        -2.0, -1.5, 5.25,

        //Sofa Out side Corner (Left Front Portion)
        -2.0, -1.5, 5.25,
        -2.5, -1.5, 5.25,
        -2.5, -0.5, 5.25,
        -2.0, -0.5, 5.25,

        //Sofa Out side Corner (Left Top Portion)
        -2.5, -0.5, 6.0,
        -2.0, -0.5, 6.0,
        -2.0, -0.5, 5.25,
        -2.5, -0.5, 5.25,

        //Small Sofa's         
        //Left Sofa BOTTOM Front
        0.75, -1.5, -0.25,
        -0.75, -1.5, -0.25,
        -0.75, -1.0, -0.25,
        0.75, -1.0, -0.25,
        
        //left Sofa middle one 
        0.75, -1.0, -0.25,
        -0.75, -1.0, -0.25,
        -0.75, -1.0, 0.25,
        0.75, -1.0, 0.25,

        //Left Sofa middle back 
        0.75, -0.5, 0.25,
        -0.75, -0.5, 0.25,
        -0.75, -1.0, 0.25,
        0.75, -1.0, 0.25,

        // Left Sofa top one 
        0.75, -0.5, 0.5,
        -0.75, -0.5, 0.5,
        -0.75, -0.5, 0.25,
        0.75, -0.5, 0.25,

        //Sofa Out side Corner ( left Inner Portion) 
        0.75, -0.5, -0.25,
        0.75, -0.5, 0.5,
        0.75, -1.5, 0.5,
        0.75, -1.5, -0.25,

        //Sofa Out side Corner ( left owter Portion) 
        1.0, -0.5, -0.25,
        1.0, -0.5, 0.5,
        1.0, -1.5, 0.5,
        1.0, -1.5, -0.25,

        //Sofa Out side corner (left front portion )
        0.75, -1.5, -0.25,
        1.0, -1.5, -0.25,
        1.0, -0.5, -0.25,
        0.75, -0.5, -0.25,

        //Sofa Out side Corner (Left Top Portion)
        0.75, -0.5, 0.5,
        1.0, -0.5, 0.5,
        1.0, -0.5, -0.25,
        0.75, -0.5, -0.25,

        //right
        //Sofa Out side Corner ( left Inner Portion) 
        -0.75, -0.5, -0.25,
        -0.75, -0.5, 0.5,
        -0.75, -1.5, 0.5,
        -0.75, -1.5, -0.25,

        //Sofa Out side Corner ( left owter Portion) 
        -1.0, -0.5, -0.25,
        -1.0, -0.5, 0.5,
        -1.0, -1.5, 0.5,
        -1.0, -1.5, -0.25,

        //Sofa Out side corner (left front portion )
        -0.75, -1.5, -0.25,
        -1.0, -1.5, -0.25,
        -1.0, -0.5, -0.25,
        -0.75, -0.5, -0.25,

        //Sofa Out side Corner (Left Top Portion)
        -0.75, -0.5, 0.5,
        -1.0, -0.5, 0.5,
        -1.0, -0.5, -0.25,
        -0.75, -0.5, -0.25,

        //back
        1.0, -1.5, 0.5,
        -1.0, -1.5, 0.5,
        -1.0, -0.5, 0.5,
        1.0, -0.5, 0.5,

        //Chair Front
        0.5, -0.5, 0.1,
        -0.5, -0.5, 0.1,
        -0.5, 0.5, 0.1,
        0.5, 0.5, 0.1,

        //Chair Back
        0.5, -0.6, 0.0,
        -0.5, -0.6, 0.0,
        -0.5, 0.5, 0.0,
        0.5, 0.5, 0.0,

        //corner right
        0.5, 0.5, 0.0,
        0.5, 0.5, 0.1,
        0.5, -0.5, 0.1,
        0.5, -0.5, 0.0,

        //corner left
        -0.5, 0.5, 0.0,
        -0.5, 0.5, 0.1,
        -0.5, -0.5, 0.1,
        -0.5, -0.5, 0.0,

        //Chair base Front
        0.5, -0.5, 0.1,
        -0.5, -0.5, 0.1,
        -0.5, -0.5, 1.0,
        0.5, -0.5, 1.0,

        //Chair Base Back
        0.5, -0.6, 0.1,
        -0.5, -0.6, 0.1,
        -0.5, -0.6, 1.0,
        0.5, -0.6, 1.0,

        //corner base right
        0.5, -0.6, 1.0,
        0.5, -0.6, 0.0,
        0.5, -0.5, 0.0,
        0.5, -0.5, 1.0,

        //corner base left
        -0.5, -0.6, 1.0,
        -0.5, -0.6, 0.0,
        -0.5, -0.5, 0.0,
        -0.5, -0.5, 1.0,

        //Corner base front 
        0.5, -0.5, 1.0,
        -0.5, -0.5, 1.0,
        -0.5, -0.6, 1.0,
        0.5, -0.6, 1.0,

        //Flower pot Front portion
        1.25, -0.5, 0.3,
        -1.25, -0.5, 0.3,
        -1.25, 0.5, 0.5,
        1.25, 0.5, 0.5,

        //Flower pot back portion
        1.25, -0.5, -0.3,
        -1.25, -0.5, -0.3,
        -1.25, 0.5, -0.5,
        1.25, 0.5, -0.5,

        //Flower pot Right
        1.25, -0.5, -0.3,
        1.25, -0.5, 0.3,
        1.25, 0.5, 0.5,
        1.25, 0.5, -0.5,

        //Flower pot left
        -1.25, -0.5, -0.3,
        -1.25, -0.5, 0.3,
        -1.25, 0.5, 0.5,
        -1.25, 0.5, -0.5,

        //Green pot Front
        1.1, 1.5, 0.4,
        -1.1, 1.5, 0.4,
        -1.1, 0.5, 0.4,
        1.1, 0.5, 0.4,
        
        //Green pot back
        1.1, 1.5, -0.4,
        -1.1, 1.5, -0.4,
        -1.1, 0.5, -0.4,
        1.1, 0.5, -0.4,

        //Green pot Right
        1.1, 1.5, -0.4,
        1.1, 1.5, 0.4,
        1.1, 0.5, 0.4,
        1.1, 0.5, -0.4,
        
        //Green pot Right
        -1.1, 1.5, -0.4,
        -1.1, 1.5, 0.4,
        -1.1, 0.5, 0.4,
        -1.1, 0.5, -0.4,

        //Green Top
        -1.1, 1.5, -0.4,
        1.1, 1.5, -0.4,
        1.1, 1.5, 0.4,
        -1.1, 1.5, 0.4,

        //CupBoard front
        2.5, 1.25, 0.75,
        -2.5, 1.25, 0.75,
        -2.5, -1.25, 0.75,
        2.5, -1.25, 0.75,

        //CupBoard left 
        -2.5, 1.25, 0.0,
        -2.5, 1.25, 0.75,
        -2.5, -1.25, 0.75,
        -2.5, -1.25, 0.0,

        //CupBoard left 
        2.5, 1.25, 0.0,
        2.5, 1.25, 0.75,
        2.5, -1.25, 0.75,
        2.5, -1.25, 0.0,

        //Menu_1 Front
        0.0, 1.6, 0.75,
        -3.0, 1.6, 0.75,
        -3.0, -1.6, 0.75,
        0.0, -1.6, 0.75,
        
        //Menu_2 Front
        3.0, 1.6, 0.75,
        0.0, 1.6, 0.75,
        0.0, -1.6, 0.75,
        3.0, -1.6, 0.75,

        // Table Top Side
        1.0, -0.25, 0.5,
        -1.0, -0.25, 0.5,
        -1.0, -0.25, -0.5,
        1.0, -0.25, -0.5,

        //Table Cover left
        -1.0, -0.25, 0.5,
        -1.0, -0.25, -0.5,
        -1.0, -0.35, -0.5,
        -1.0, -0.35, 0.5,

        //Table Cover Right
        1.0, -0.25, 0.5,
        1.0, -0.25, -0.5,
        1.0, -0.35, -0.5,
        1.0, -0.35, 0.5,

        //Table Cover Front
        1.0, -0.25, 0.5,
        1.0, -0.35, 0.5,
        -1.0, -0.35, 0.5,
        -1.0, -0.25, 0.5,

        //Table Cover back
        1.0, -0.25, -0.5,
        1.0, -0.35, -0.5,
        -1.0, -0.35, -0.5,
        -1.0, -0.25, -0.5,

        //Rod left
        -0.1, -0.25, -0.1,
        -0.1, -0.25, 0.1,
        -0.1, -1.25, 0.1,
        -0.1, -1.25, -0.1,

        //Rod Right
        0.1, -0.25, -0.1,
        0.1, -0.25, 0.1,
        0.1, -1.25, 0.1,
        0.1, -1.25, -0.1,

        // //Rod Front
        0.1, -0.25, 0.1,
        -0.1, -0.25, 0.1,
        -0.1, -1.25, 0.1,
        0.1, -1.25, 0.1,

        // //Rod back
        0.1, -0.25, -0.1,
        -0.1, -0.25, -0.1,
        -0.1, -1.25, -0.1,
        0.1, -1.25, -0.1,

    ]);

    var CubeTexCoords = new Float32Array([
        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
        
        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
        
        //Surface
        0.0, 0.0,
		5.0, 0.0,
		5.0, 5.0,
		0.0, 5.0,

        0.0, 0.0,
		2.0, 0.0,
		2.0, 2.0,
		0.0, 2.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		0.4, 0.0,
		0.4, 0.4,
		0.0, 0.4,

        0.0, 0.0,
		0.4, 0.0,
		0.4, 0.4,
		0.0, 0.4,

        0.0, 0.0,
		0.4, 0.0,
		0.4, 0.4,
		0.0, 0.4,

        0.0, 0.0,
		0.4, 0.0,
		0.4, 0.4,
		0.0, 0.4,
        
        0.0, 0.0,
		0.4, 0.0,
		0.4, 0.4,
		0.0, 0.4,

        0.0, 0.0,
		0.4, 0.0,
		0.4, 0.4,
		0.0, 0.4,

        0.0, 0.0,
		0.4, 0.0,
		0.4, 0.4,
		0.0, 0.4,

        0.0, 0.0,
		0.4, 0.0,
		0.4, 0.4,
		0.0, 0.4,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		1.1, 0.0,
		1.1, 1.1,
		0.0, 1.1,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.7,
		0.7, 0.0,
		0.0, 0.7,

        
        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.7,
		0.7, 0.0,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.7,
		0.7, 0.0,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.7,
		0.7, 0.0,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.7,
		0.7, 0.0,
		0.0, 0.7,

        0.0, 0.0,
		0.1, 0.1,
		0.1, 0.0,
		0.0, 0.1,

        0.0, 0.0,
		0.1, 0.1,
		0.1, 0.0,
		0.0, 0.1,

        0.0, 0.0,
		0.7, 0.7,
		0.7, 0.0,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.7,
		0.7, 0.0,
		0.0, 0.7,

        0.0, 0.0,
		0.2, 0.2,
		0.2, 0.0,
		0.0, 0.2,
        
        0.0, 0.0,
		0.2, 0.2,
		0.2, 0.0,
		0.0, 0.2,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		0.7, 0.0,
		0.7, 0.7,
		0.0, 0.7,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        
        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

        0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        //Menu_1
        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        //Menu_2
        0.0, 0.0,
		1.0, 0.0,
        1.0, 1.0,
		0.0, 1.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

        1.0, 1.0,
		0.0, 1.0,
        0.0, 0.0,
		1.0, 0.0,

    ]);


      /* Cube VBO  */
    Cube_Vbo_DM = gl.createVertexArray();
    gl.bindVertexArray(Cube_Vbo_DM);

    Cube_Vertices_Vbo_DM = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Cube_Vertices_Vbo_DM);
    gl.bufferData(gl.ARRAY_BUFFER, CubeVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_VERTEX,
        3,
        gl.FLOAT,
        false, 0, 0);

    gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_VERTEX);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Cube_Texture_Vbo_DM = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, Cube_Texture_Vbo_DM);
    gl.bufferData(gl.ARRAY_BUFFER, CubeTexCoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_TEXTURE,
        2,
        gl.FLOAT,
        false, 0, 0);

    gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_TEXTURE);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    gl.enable(gl.DEPTH_TEST);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    
    LoadTexture();

    perspectiveDM_Projection_Matrix = mat4.create();
    mat4.identity(perspectiveDM_Projection_Matrix);

    resize();
}

function LoadTexture()
{
    Table_Texture = gl.createTexture();
    Table_Texture.image = new Image();
    Table_Texture.image.src = "Res/Table_01.jpg";
    
    Table_Texture.image.onload = function (){
        
        gl.bindTexture(gl.TEXTURE_2D, Table_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Table_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);


    }

    Table_surface_Texture = gl.createTexture();
    Table_surface_Texture.image = new Image();
    Table_surface_Texture.image.src = "Res/Floor_2.jpg";
    
    Table_surface_Texture.image.onload = function (){
        
        gl.bindTexture(gl.TEXTURE_2D, Table_surface_Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Table_surface_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    starbucks_roof_texture = gl.createTexture();
    starbucks_roof_texture.image = new Image();
    starbucks_roof_texture.image.src = "Res/roof.jpg";

    starbucks_roof_texture.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, starbucks_roof_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, starbucks_roof_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    starbucks_floor_texture = gl.createTexture();
    starbucks_floor_texture.image = new Image();
    starbucks_floor_texture.image.src = "Res/starbucks_floor.jpg";

    starbucks_floor_texture.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, starbucks_floor_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, starbucks_floor_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    starbucks_wall_texture = gl.createTexture();
    starbucks_wall_texture.image = new Image();
    starbucks_wall_texture.image.src = "Res/starbucks_wall_art.jpg";

    starbucks_wall_texture.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, starbucks_wall_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, starbucks_wall_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }



    starbucks_logo_texture = gl.createTexture();
    starbucks_logo_texture.image = new Image();
    starbucks_logo_texture.image.src = "Res/starbucks_logo.png";

    starbucks_logo_texture.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, starbucks_logo_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, starbucks_logo_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }




    Desk_Texture = gl.createTexture();
    Desk_Texture.image = new Image();
    Desk_Texture.image.src = "Res/Desk_01.jpg";
    
    Desk_Texture.image.onload = function (){
        
        gl.bindTexture(gl.TEXTURE_2D, Desk_Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Desk_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    Green_Texture = gl.createTexture();
    Green_Texture.image = new Image();
    Green_Texture.image.src = "Res/Leaf_01.jpeg";
    
    Green_Texture.image.onload = function (){
        
        
        gl.bindTexture(gl.TEXTURE_2D, Green_Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Green_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    Pot_Texture = gl.createTexture();
    Pot_Texture.image = new Image();
    Pot_Texture.image.src = "Res/sample_02.jpg";
    
    Pot_Texture.image.onload = function (){
        
        
        gl.bindTexture(gl.TEXTURE_2D, Pot_Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Pot_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    CupBoard_Texture = gl.createTexture();
    CupBoard_Texture.image = new Image();
    CupBoard_Texture.image.src = "Res/CupBoard.jpg";
    
    CupBoard_Texture.image.onload = function (){
        
        
        gl.bindTexture(gl.TEXTURE_2D, CupBoard_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, CupBoard_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    Menu_01_Texture = gl.createTexture();
    Menu_01_Texture.image = new Image();
    Menu_01_Texture.image.src = "Res/Menu_01.jpg";
    
    Menu_01_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, Menu_01_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Menu_01_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    Menu_02_Texture = gl.createTexture();
    Menu_02_Texture.image = new Image();
    Menu_02_Texture.image.src = "Res/Menu_02.jpg";
    
    Menu_02_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, Menu_02_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Menu_02_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    Table_Sofa_Texture = gl.createTexture();
    Table_Sofa_Texture.image = new Image();
    Table_Sofa_Texture.image.src = "Res/Sofa_table.jpg";
    
    Table_Sofa_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, Table_Sofa_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Table_Sofa_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    Floar_Texture = gl.createTexture();
    Floar_Texture.image = new Image();
    Floar_Texture.image.src = "Res/marbel.png";
    
    Floar_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, Floar_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Floar_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    Ceiling_Texture = gl.createTexture();
    Ceiling_Texture.image = new Image();
    Ceiling_Texture.image.src = "Res/Ceiling_01.jpg";
    
    Ceiling_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, Ceiling_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Ceiling_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
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
    
    mat4.perspective(perspectiveDM_Projection_Matrix, 
        45.0, 
        parseFloat(canvas.width) / parseFloat(canvas.height), 
        0.1, 
        100.0);
}

function display() {
    

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(ShaderProgramObject);

    var DM_Model_Matrix = mat4.create();
    var DM_Projection_Matrix = mat4.create();
    var DM_View_Matrix = mat4.create();
    var DM_XRotation_Matrix = mat4.create();
    var DM_XTranslate_Matrix = mat4.create();
    var DM_Scale_Matrix = mat4.create();




    //mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, angle);

    mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix, DM_XRotation_Matrix);

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, Table_surface_Texture);
    gl.uniform1i(texture_Sampler_Uniform, 0);

    gl.bindVertexArray(Cube_Vbo_DM);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, starbucks_wall_texture);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);// Front Wall  
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, starbucks_logo_texture);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);// Right Wall
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, starbucks_wall_texture);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);// back wall
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);// left wall
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindVertexArray(null);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, starbucks_roof_texture);
    gl.bindVertexArray(Cube_Vbo_DM);



    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);// Top wall
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindVertexArray(null);

    
    //gl.bindTexture(gl.TEXTURE_2D, Floar_Texture);

    gl.bindVertexArray(Cube_Vbo_DM);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, starbucks_floor_texture);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);// Bottom Floar     
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindVertexArray(null);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, Desk_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 44, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 48, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 52, 4);

    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, Table_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);

    //Sofa 
    gl.drawArrays(gl.TRIANGLE_FAN, 56, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 60, 4);

    //Green
    gl.drawArrays(gl.TRIANGLE_FAN, 64, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 68, 4);

    //Sofa
    gl.drawArrays(gl.TRIANGLE_FAN, 72, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 76, 4);

    //Green
    gl.drawArrays(gl.TRIANGLE_FAN, 80, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 84, 4);

    //Sofa Corner Front 
    gl.drawArrays(gl.TRIANGLE_FAN, 88, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 92, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 96, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 100, 4);

    //Sofa Corner Front 
    gl.drawArrays(gl.TRIANGLE_FAN, 104, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 108, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 112, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 116, 4);

    gl.bindVertexArray(null);

    //************************************************************************************* Near to door 
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    // DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, 0.0, 5.0]);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);


    //SMALL ONE SOFA
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 120, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 124, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 128, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 132, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 136, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 140, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 144, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 148, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 152, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 156, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 160, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 164, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 168, 4);

    gl.bindVertexArray(null);

    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    //DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, -3.2);
    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, 0.0, 2.5]);
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    //SMALL ONE SOFA
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 120, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 124, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 128, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 132, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 136, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 140, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 144, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 148, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 152, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 156, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 160, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 164, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 168, 4);

    gl.bindVertexArray(null);

    //************************************************************************************* Middle Set
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    // DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, 0.0, 1.0]);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);


    //SMALL ONE SOFA
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 120, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 124, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 128, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 132, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 136, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 140, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 144, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 148, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 152, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 156, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 160, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 164, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 168, 4);

    gl.bindVertexArray(null);

    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    //DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, -3.2);
    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, 0.0, -1.5]);
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    //SMALL ONE SOFA
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 120, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 124, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 128, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 132, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 136, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 140, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 144, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 148, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 152, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 156, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 160, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 164, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 168, 4);

    gl.bindVertexArray(null);




    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    //DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.0, 0.0, 0.0]);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    //CHAIR
    gl.bindVertexArray(Cube_Vbo_DM);

    // gl.drawArrays(gl.TRIANGLE_FAN, 172, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 176, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 180, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 184, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 188, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 192, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 196, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 200, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 204, 4);


    gl.bindVertexArray(null);

    //Right side gamla
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    //DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-4.5, -1.0, 1.0]);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, Pot_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 208, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 212, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 216, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 220, 4);

    gl.bindVertexArray(null);

    //Green
    gl.bindTexture(gl.TEXTURE_2D, Green_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 224, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 228, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 232, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 236, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 240, 4);

    gl.bindVertexArray(null);

    //left Side Gamla
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    //DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-1.0, -1.0, 4.7]);

    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, 1.6);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, Pot_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 208, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 212, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 216, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 220, 4);

    gl.bindVertexArray(null);

    //Green
    gl.bindTexture(gl.TEXTURE_2D, Green_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 224, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 228, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 232, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 236, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 240, 4);

    gl.bindVertexArray(null);

    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    //DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, 1.6);
    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-6.0, 1.0, -3.25]);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    //CupBoard Front 
    gl.bindTexture(gl.TEXTURE_2D, CupBoard_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 244, 4);

    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, Pot_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 248, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 252, 4);

    gl.bindVertexArray(null);

    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();


    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-2.5, 1.25, -6.7]);
    //mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [1.0, 2.0, 0.1]);

    mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix, DM_XTranslate_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    //Menu_01
    gl.bindTexture(gl.TEXTURE_2D, Menu_01_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 256, 4);

    gl.bindVertexArray(null);


    //Menu_2
    gl.bindTexture(gl.TEXTURE_2D, Menu_02_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 260, 4);

    gl.bindVertexArray(null);

    //Sofa Table
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    //mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-4.0, -0.5, 4.0]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [2.0, 0.0, 0.0]);

    //mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix, DM_XTranslate_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);


    gl.bindTexture(gl.TEXTURE_2D, Table_Sofa_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 264, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 268, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 272, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 276, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 280, 4);

    gl.bindVertexArray(null);

    //Sofa table rod 1
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_View_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    //mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-3.25, 0.0, 4.35]);
    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.0, 0.0, 0.0]);

    mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix, DM_XTranslate_Matrix);

    DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    PopMatrix();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    //Sofa Table rod
    gl.bindTexture(gl.TEXTURE_2D, Pot_Texture);
    gl.bindVertexArray(Cube_Vbo_DM);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);

    gl.bindVertexArray(null);

    PopMatrix();

    // //
    // mat4.identity(DM_Model_Matrix);
    // mat4.identity(DM_View_Matrix);
    // mat4.identity(DM_Projection_Matrix);
    // mat4.identity(DM_XRotation_Matrix);
    // mat4.identity(DM_XTranslate_Matrix);
    // mat4.identity(DM_Scale_Matrix);

    // mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-3.25, 0.0, 3.75]);

    // mat4.lookAt(DM_View_Matrix, [X_, 0.0, Z_], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    // mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);

    // DM_Model_Matrix = PushMatrix(DM_Model_Matrix);
    // PopMatrix();

    // mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveDM_Projection_Matrix);

    // gl.uniformMatrix4fv(mUniform_DM, false, DM_Model_Matrix);
    // gl.uniformMatrix4fv(vUniform_DM, false, DM_View_Matrix);
    // gl.uniformMatrix4fv(pUniform_DM, false, DM_Projection_Matrix);

    // //Sofa Table rod 2
    // gl.bindTexture(gl.TEXTURE_2D, Pot_Texture);
    // gl.bindVertexArray(Cube_Vbo_DM);

    // gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);

    // gl.bindVertexArray(null);

    gl.useProgram(null);

    update();

    requestAnimationFrame(display, canvas);
}

function PushMatrix(Matrix)
{
    if( Matrix_Count == -1)
    {
        Stack_Matrix.push(Matrix);
        Matrix_Count++;
        return Matrix;
    }
    else{
        var prev_Matrix = Stack_Matrix[Matrix_Count];
        mat4.multiply(Matrix, prev_Matrix, Matrix);
        Stack_Matrix.push(Matrix);
        Matrix_Count++;
        return Matrix;
    }
}

function PopMatrix()
{
    if(!Stack_Matrix[0])
    {
        Stack_Matrix[0] = mat4.create();
        return Stack_Matrix[0];
    }
    else{
        Stack_Matrix.pop();
        Matrix_Count--;
        return (Stack_Matrix[Matrix_Count]);
    }
}

function degToRad(Degrees)
{
    return (Degrees * Math.PI / 180.0);
}

function update()
{

    if(angle > 360.0)
    {
        angle = 0.0;
    }
}

function unInitilize() {
    if (Cube_Vbo_DM) {
        gl.deleteVertexArray(Cube_Vbo_DM);
        Cube_Vbo_DM = 0;
    }

    if (Cube_Vertices_Vbo_DM) {
        gl.deleteBuffer(Cube_Vertices_Vbo_DM);
        Cube_Vertices_Vbo_DM = 0;
    }
    if (Cube_Texture_Vbo_DM) {
        gl.deleteBuffer(Cube_Texture_Vbo_DM);
        Cube_Texture_Vbo_DM = 0;
    }

    if (ShaderProgramObject) {
        if (fragmentShaderObject) {
            gl.detachShader(ShaderProgramObject, fragmentShaderObject);
            gl.deleteShader(fragmentShaderObject);
            fragmentShaderObject = null;

        }

        if (vertexShaderObject) {
            gl.detachShader(ShaderProgramObject, vertexShaderObject);
            gl.deleteShader(vertexShaderObject);
            vertexShaderObject = null;
        }
        gl.deleteProgram(ShaderProgramObject);
        ShaderProgramObject = null;
    }
}
