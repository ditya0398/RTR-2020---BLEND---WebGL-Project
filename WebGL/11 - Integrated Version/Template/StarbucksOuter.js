
const WebGLMicros =
{
    DVM_ATTTRIBUTE_VERTEX: 0,
    DVM_ATTTRIBUTE_NORMAL: 1,
    DVM_ATTTRIBUTE_COLOR: 2,
    DVM_ATTTRIBUTE_TEXTURE: 3,

}


var angle_StarbuckOuter = 0;
var Image_Switch_StarbuckOuter = 1;

var vertexShaderObject_StarbuckOuter;
var fragmentShaderObject_StarbuckOuter;
var ShaderProgramObject_StarbuckOuter;

var Square_Vbo_DM_StarbuckOuter;
var Square_Vertices_Vbo_DM_StarbuckOuter;
var Square_Texture_Vbo_DM_StarbuckOuter;

/* Texture Variables */
var left_Side_Starbugs;
var Main_Door_Starbug;
var Gallery_Glass_Starbug;
var Front_Side_Starbugs;
var Starbug_Logo_Starbugs;
var Shalter_Starbugs;
var Wall_Wood_Starbugs;

var mvpUniform_DM_StarbuckOuter;

var Smiley_Texture_StarbuckOuter;
var road_Starbugs;
/* Texture Variables */

/* Brick Shader  */

var gVao_Brick_Shader_StarbuckOuter;
var gVbo_Brick_Shader_Vertex_StarbuckOuter;
var gVbo_Brick_Shader_Normal_StarbuckOuter;

var gVertexShaderObj_StarbuckOuter;
var gFragmentShaderObj_StarbuckOuter;
var gshaderProgramObj_StarbuckOuter;

/*splite 1.model view, 2.projection matrics */
var gMVMatrixUniform_DM_StarbuckOuter;
var gPMatrixUniform_DM_StarbuckOuter;

var BrickColor_DM_StarbuckOuter;/* Brick color */
var BrickSize_DM_StarbuckOuter;/* Brick Size */
var Brickpct_DM_StarbuckOuter;/*  */
var MortarColor_DM_StarbuckOuter;/*Line between two brick */
var U_LPosition_BrickS_DM_StarbuckOuter;/*Positon*/

/* Brick Shader  */

var texture_Sampler_Uniform_StarbuckOuter;

var modelMatrixStarbuckOuter;
var viewMatrixStarbuckOuter;
var projectionMatrixStarbuckOuter;

function initStarbucksOuter() {
    /*  ******************************** regular shader code binding and linking ***************************************** */
    /* VertexShaderObject */
    var VertexShaderSourceCode =
        "#version 300 es                \n" +
        "in vec4 vPosition;             \n" +
        "in vec2 vTexCoord;             \n" +
        "out vec2 out_TexCoord;         \n" +
        "uniform mat4 u_model_matrix;     \n" +
        "uniform mat4 u_view_matrix;     \n" +
        "uniform mat4 u_projection_matrix;     \n" +
        "void main(void){               \n" +
        "gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;\n" +
        "out_TexCoord = vTexCoord;             \n" +
        "}";



    vertexShaderObject_StarbuckOuter = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject_StarbuckOuter, VertexShaderSourceCode);
    gl.compileShader(vertexShaderObject_StarbuckOuter);

    if (gl.getShaderParameter(vertexShaderObject_StarbuckOuter, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(vertexShaderObject_StarbuckOuter);
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

    fragmentShaderObject_StarbuckOuter = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject_StarbuckOuter, fragmentShaderSourceCode);
    gl.compileShader(fragmentShaderObject_StarbuckOuter);

    if (gl.getShaderParameter(fragmentShaderObject_StarbuckOuter, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(fragmentShaderObject_StarbuckOuter);
        if (error.length > 0) {
            alert(error)
            unInitilize();
        }
    }

    /* Shader Linking  */

    ShaderProgramObject_StarbuckOuter = gl.createProgram();
    gl.attachShader(ShaderProgramObject_StarbuckOuter, vertexShaderObject_StarbuckOuter);
    gl.attachShader(ShaderProgramObject_StarbuckOuter, fragmentShaderObject_StarbuckOuter);

    gl.bindAttribLocation(ShaderProgramObject_StarbuckOuter, WebGLMicros.DVM_ATTTRIBUTE_VERTEX, "vPosition");
    gl.bindAttribLocation(ShaderProgramObject_StarbuckOuter, WebGLMicros.DVM_ATTTRIBUTE_TEXTURE, "vTexCoord");


    gl.linkProgram(ShaderProgramObject_StarbuckOuter);
    if (!gl.getProgramParameter(ShaderProgramObject_StarbuckOuter, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(ShaderProgramObject_StarbuckOuter);
        if (error.length > 0) {
            alert(error);
            unInitilize();
        }
    }

    modelMatrixStarbuckOuter = gl.getUniformLocation(ShaderProgramObject_StarbuckOuter, "u_model_matrix");
    viewMatrixStarbuckOuter = gl.getUniformLocation(ShaderProgramObject_StarbuckOuter, "u_view_matrix");
    projectionMatrixStarbuckOuter = gl.getUniformLocation(ShaderProgramObject_StarbuckOuter, "u_projection_matrix");
    texture_Sampler_Uniform_StarbuckOuter = gl.getUniformLocation(ShaderProgramObject_StarbuckOuter, "u_Texture_Sampler");

    var Square_Vertices = new Float32Array([
        //starbucks
        10.0, 6.0, 0,
        -10.0, 6.0, 0,
        -10.0, -3.0, 0,
        10.0, -3.0, 0,

        //road
        20.0, -2.5, 23.0, 
        -20.0,-2.5, 23.0, 
        -20.0, -2.5,-26.0,
        20.0, -2.5, -26.0,

        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,

        // left face
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,

        // top face
        //3
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,

        // bottom face
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0


        
    ]);


    var square_porch = new Float32Array([
      
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,

        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,

        // left face
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,

        // top face
        //3
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,

        // bottom face
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0



    ]);

    var Square_TexCoords = new Float32Array([
        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,

        40.0, 0.0,
        0.0, 0.0,
        0.0, 40.0,
        40.0, 40.0,

        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,

        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,

        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,

        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,
        0.0, 0.0,

        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,

        0.0, 0.0,
        4.0, 0.0,
        4.0, 1.0,
        0.0, 1.0,

        2.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        2.0, 0.0,

        2.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        2.0, 0.0,

        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,

        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0

    ]);


    /* Vertex VBO for Smiley */
    Square_Vbo_DM_StarbuckOuter = gl.createVertexArray();
    gl.bindVertexArray(Square_Vbo_DM_StarbuckOuter);

    Square_Vertices_Vbo_DM_StarbuckOuter = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Square_Vertices_Vbo_DM_StarbuckOuter);
    gl.bufferData(gl.ARRAY_BUFFER, Square_Vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_VERTEX,
        3,
        gl.FLOAT,
        false, 0, 0);

    gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_VERTEX);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);




    /* Texture VBO for Smiley */
    Square_Texture_Vbo_DM_StarbuckOuter = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, Square_Texture_Vbo_DM_StarbuckOuter);
    gl.bufferData(gl.ARRAY_BUFFER, Square_TexCoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_TEXTURE,
        2,
        gl.FLOAT,
        false, 0, 0);

    gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_TEXTURE);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    LoadGLTexture_Starbucks_Outer();

/*************************************************** */
    porch_vao = gl.createVertexArray();
    gl.bindVertexArray(porch_vao);

    porch_vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, porch_vbo);
    gl.bufferData(gl.ARRAY_BUFFER, square_porch, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_VERTEX,
        3,
        gl.FLOAT,
        false, 0, 0);

    gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_VERTEX);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    /*  ******************************** Brick shader code binding and linking ***************************************** */


    /* VertexShaderObject */
    var Brick_VertexShaderSourceCode =
        "#version 300 es                        \n" +
        "precision highp float;                 \n" +

        "in vec4 vPosition;                     \n" +
        "in vec3 vNormal;                       \n" +

        "uniform mat4 u_model_view_matrix;      \n" +
        "uniform mat4 u_p_matrix;               \n" +

        "uniform vec3 u_light_position;         \n" +

        "const float Specular_C = 0.3;          \n" +
        "const float Diffuse_C = 1.0 - Specular_C ;\n" +
        "int repeate = 0;                    \n" +

        "out float LightIntensity;              \n" +
        "out vec2 MCPosition;                   \n" +

        "void main(void){                       \n" +

        "vec3 eye_cordinates = vec3(u_model_view_matrix * vPosition);\n" +
        "mat3 normal_matrix = mat3(transpose(inverse(u_model_view_matrix)));\n" +
        "vec3 tnormal = normalize(normal_matrix * vNormal);\n" +
        "vec3 source = normalize(u_light_position - eye_cordinates);\n" +
        "vec3 reflect_vec = reflect(-source, tnormal);\n" +
        "vec3 view_vec = normalize(-eye_cordinates);\n" +
        "float diffuse_light = max( dot(source , tnormal), 0.0);\n" +
        "float spec = 0.0f;                     \n" +

        "if(diffuse_light > 0.0){               \n" +
        "spec = max(dot(reflect_vec, view_vec), 0.0);\n" +
        "spec = pow(spec, 16.0);                \n" +
        "}                                      \n" +

        "LightIntensity = Diffuse_C * diffuse_light + Specular_C * spec; \n" +
        "if((vPosition.x < -2.4) && (vPosition.y < -1.74)){               \n" +
        "repeate++;}                            \n" +
        //"repeate++;                             \n" +
        "if((vPosition.x < -2.4) && (vPosition.y < -1.74) && (repeate > 1)){ \n" +
        "MCPosition.x = vPosition.x;            \n" +
        "MCPosition.y = vPosition.y;            \n" +
        "}                                      \n" +
        "else{ \n" +
        "MCPosition.x = vPosition.x;            \n" +
        "MCPosition.y = vPosition.y;            \n" +
        "}                                      \n" +
        "gl_Position = u_p_matrix * vPosition;  \n" +
        "}";



    gVertexShaderObj_StarbuckOuter = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gVertexShaderObj_StarbuckOuter, Brick_VertexShaderSourceCode);
    gl.compileShader(gVertexShaderObj_StarbuckOuter);

    if (gl.getShaderParameter(gVertexShaderObj_StarbuckOuter, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(gVertexShaderObj_StarbuckOuter);
        if (error.length > 0) {
            console.log("after vertex shader code compile.");

            alert(error)
            unInitilize();
        }
    }
    /* Fragment shader code */

    var Brick_fragmentShaderSourceCode =
        "#version 300 es                        \n" +
        "precision highp float;                 \n" +
        "uniform vec3 BrickColor_DM, MortarColor_DM;\n" +
        "uniform vec2 BrickSize_DM;             \n" +
        "uniform vec2 Brickpct_DM;              \n" +

        "in float LightIntensity;               \n" +
        "in vec2 MCPosition;                    \n" +

        "out vec4 FragColor;                    \n" +

        "void main(void){                       \n" +

        "vec3 color;                            \n" +
        "vec2 position, useBrick;               \n" +

        "position = MCPosition / BrickSize_DM;  \n" +

        "if(fract(position.y * 0.5) > 0.5){     \n" +
        "position.x += 0.5;                     \n" +
        "}                                      \n" +

        "position = fract(position);            \n" +
        "useBrick = step(position, Brickpct_DM);\n" +
        "color = mix(MortarColor_DM, BrickColor_DM, useBrick.x * useBrick.y);\n" +
        "color *= LightIntensity;               \n" +

        "FragColor = vec4( color, 1.0);         \n" +
        "}";

    gFragmentShaderObj_StarbuckOuter = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gFragmentShaderObj_StarbuckOuter, Brick_fragmentShaderSourceCode);
    gl.compileShader(gFragmentShaderObj_StarbuckOuter);

    if (gl.getShaderParameter(gFragmentShaderObj_StarbuckOuter, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(gFragmentShaderObj_StarbuckOuter);
        if (error.length > 0) {
            alert(error)
            unInitilize();
        }
    }

    /* Shader Linking  */

    gshaderProgramObj_StarbuckOuter = gl.createProgram();
    gl.attachShader(gshaderProgramObj_StarbuckOuter, gVertexShaderObj_StarbuckOuter);
    gl.attachShader(gshaderProgramObj_StarbuckOuter, gFragmentShaderObj_StarbuckOuter);

    gl.bindAttribLocation(gshaderProgramObj_StarbuckOuter, WebGLMicros.DVM_ATTTRIBUTE_VERTEX, "vPosition");
    gl.bindAttribLocation(gshaderProgramObj_StarbuckOuter, WebGLMicros.DVM_ATTTRIBUTE_NORMAL, "vNormal");


    gl.linkProgram(gshaderProgramObj_StarbuckOuter);
    if (!gl.getProgramParameter(gshaderProgramObj_StarbuckOuter, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(gshaderProgramObj_StarbuckOuter);
        if (error.length > 0) {
            alert(error);
            unInitilize();
        }
    }

    gMVMatrixUniform_DM_StarbuckOuter = gl.getUniformLocation(gshaderProgramObj_StarbuckOuter, "u_model_view_matrix");
    gPMatrixUniform_DM_StarbuckOuter = gl.getUniformLocation(gshaderProgramObj_StarbuckOuter, "u_p_matrix");

    MortarColor_DM_StarbuckOuter = gl.getUniformLocation(gshaderProgramObj_StarbuckOuter, "MortarColor_DM");
    BrickColor_DM_StarbuckOuter = gl.getUniformLocation(gshaderProgramObj_StarbuckOuter, "BrickColor_DM");

    BrickSize_DM_StarbuckOuter = gl.getUniformLocation(gshaderProgramObj_StarbuckOuter, "BrickSize_DM");
    Brickpct_DM_StarbuckOuter = gl.getUniformLocation(gshaderProgramObj_StarbuckOuter, "Brickpct_DM");

    U_LPosition_BrickS_DM_StarbuckOuter = gl.getUniformLocation(gshaderProgramObj_StarbuckOuter, "u_light_position");

    var Brick_Square_Vertices = new Float32Array([
        //front side 
        2.5, -1.0, 2.5,
        -2.5, -1.0, 2.5,
        -2.5, -1.75, 2.5,
        2.5, -1.75, 2.5,

        //back
        2.5, 1.5, -3.0,
        -2.5, 1.5, -3.0,
        -2.5, -1.75, -3.0,
        2.5, -1.75, -3.0,

        //Left
        -2.5, 1.5, -3.0,
        -2.5, 1.5, 2.5,
        -2.5, -1.75, 2.5,
        -2.5, -1.75, -3.0,

        // right
        2.5, 1.5, -3.0,
        2.5, 1.5, 2.5,
        2.5, -1.75, 2.5,
        2.5, -1.75, -3.0,

        /* Steps began */
        0.5, -1.0, 2.75,
        -0.5, -1.0, 2.75,
        -0.5, -1.25, 2.75,
        0.5, -1.25, 2.75,

        0.75, -1.25, 3.0,
        -0.75, -1.25, 3.0,
        -0.75, -1.5, 3.0,
        0.75, -1.5, 3.0,

        1.0, -1.5, 3.25,
        -1.0, -1.5, 3.25,
        -1.0, -1.75, 3.25,
        1.0, -1.75, 3.25,

        //Gallery front wall 
        0.0, 4.5, -0.5,
        -3.25, 2.5, -0.5,
        3.25, 2.5, -0.5


    ]);

    var Brick_Square_TexCoords = new Float32Array([

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0


    ]);

    /* Vertex VBO for Break */
    gVao_Brick_Shader_StarbuckOuter = gl.createVertexArray();
    gl.bindVertexArray(gVao_Brick_Shader_StarbuckOuter);

    gVbo_Brick_Shader_Vertex_StarbuckOuter = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gVbo_Brick_Shader_Vertex_StarbuckOuter);
    gl.bufferData(gl.ARRAY_BUFFER, Brick_Square_Vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_VERTEX,
        3,
        gl.FLOAT,
        false, 0, 0);

    gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_VERTEX);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /* Texture VBO for Smiley */
    gVbo_Brick_Shader_Normal_StarbuckOuter = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, gVbo_Brick_Shader_Normal_StarbuckOuter);
    gl.bufferData(gl.ARRAY_BUFFER, Brick_Square_TexCoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_NORMAL,
        3,
        gl.FLOAT,
        false, 0, 0);

    gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_NORMAL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

}
function LoadGLTexture_Starbucks_Outer() {
    left_Side_Starbugs = gl.createTexture();
    left_Side_Starbugs.image = new Image();
    left_Side_Starbugs.image.src = "DarshanResources/LR_STARBUG.jpg";
    left_Side_Starbugs.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, left_Side_Starbugs);
        //gl.pixelStorei(gl.UNPACK_FLIP_Z_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, left_Side_Starbugs.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    road_Starbugs = gl.createTexture();
    road_Starbugs.image = new Image();
    road_Starbugs.image.src = "DarshanResources/road.jpg";
    road_Starbugs.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, road_Starbugs);
        //gl.pixelStorei(gl.UNPACK_FLIP_Z_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, road_Starbugs.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }





}
function displayStarBucksOuter() {
    /*  ******************************** Regular shader Program obj ***************************************** */

    gl.useProgram(ShaderProgramObject_StarbuckOuter);

    var modelMatrix = mat4.create();
    var modelViewMatrix = mat4.create();
    // var ViewMatrix = mat4.create();
    var modelViewProjectionMatrix = mat4.create();

    var translateMatrix = mat4.create();

    //mat4.rotateY(XRotationMatrix, XRotationMatrix, deg2rad(angle_StarbuckOuter));

    mat4.translate(translateMatrix, translateMatrix, [0.0, 0.0, -10.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    

    // mat4.lookAt(ViewMatrix, [0.0, -1.5, 1.0], [0.0, -1.5, 0.0], [0.0, 1.0, 0.0]);

    // mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);

    //  mat4.multiply(modelViewProjectionMatrix, perspectiveMatrix, modelViewMatrix);

    gl.uniformMatrix4fv(modelMatrixStarbuckOuter, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixStarbuckOuter, false, viewMatrix_Scene3);
    gl.uniformMatrix4fv(projectionMatrixStarbuckOuter, false, perspectiveMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, left_Side_Starbugs);
    gl.uniform1i(texture_Sampler_Uniform_StarbuckOuter, 0);

    gl.bindVertexArray(Square_Vbo_DM_StarbuckOuter);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, road_Starbugs);

    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    
    gl.bindVertexArray(null);


    /*  ******************************** Brick shader Program obj ***************************************** */

    /*  gl.useProgram(gshaderProgramObj_StarbuckOuter);

       gl.uniform3f(BrickColor_DM_StarbuckOuter, 1.0, 0.3, 0.2);
       gl.uniform3f(MortarColor_DM_StarbuckOuter, 0.85, 0.86, 0.84);
       gl.uniform2f(BrickSize_DM_StarbuckOuter, 0.30, 0.15);
       gl.uniform2f(Brickpct_DM_StarbuckOuter, 0.90, 0.85);
       gl.uniform3f(U_LPosition_BrickS_DM_StarbuckOuter,8.0 * deg2rad( Math.sin(angle_StarbuckOuter)), 1.0, 8.0 * deg2rad( Math.cos(angle_StarbuckOuter)));

       var projectionMatrix = mat4.create();

       mat4.identity(projectionMatrix);


       mat4.multiply(projectionMatrix, perspectiveMatrix, modelMatrix);

       gl.uniformMatrix4fv(gPMatrixUniform_DM_StarbuckOuter, false, perspectiveMatrix);
       gl.uniformMatrix4fv(gMVMatrixUniform_DM_StarbuckOuter, false, modelMatrix);

       gl.bindVertexArray(gVao_Brick_Shader_StarbuckOuter);

       gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
       gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
       gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
       gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);

       gl.bindVertexArray(null);

       gl.uniform3f(BrickColor_DM_StarbuckOuter, 0.5, 0.3, 0.0);
       gl.uniform3f(MortarColor_DM_StarbuckOuter, 0.85, 0.86, 0.84);

       gl.bindVertexArray(gVao_Brick_Shader_StarbuckOuter);

       gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
       gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
       gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);

       gl.bindVertexArray(null);

       gl.bindVertexArray(gVao_Brick_Shader_StarbuckOuter);

       gl.drawArrays(gl.TRIANGLES, 28, 3);

       gl.bindVertexArray(null);

       gl.useProgram(null);
  */
}