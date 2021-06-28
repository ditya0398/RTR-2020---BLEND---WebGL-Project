var DM_starbucks_wall_texture;
var SBR_DM_angle = 0.0;


var SBR_DM_vertexShaderObject;
var SBR_DM_fragmentShaderObject;
var SBR_DM_ShaderProgramObject;

var SBR_DM_Cube_Vbo;
var SBR_DM_Cube_Vertices_Vbo;
var SBR_DM_Cube_Texture_Vbo_DM;

var SBR_DM_mUniform;
var SBR_DM_vUniform;
var SBR_DM_pUniform;


/* Texture Variables */
var SBR_DM_Table_Texture;
var SBR_DM_Table_surface_Texture;
var SBR_DM_Desk_Texture;
var SBR_DM_Green_Texture;
var SBR_DM_Pot_Texture;
var SBR_DM_CupBoard_Texture;
var SBR_DM_Menu_01_Texture;
var SBR_DM_Menu_02_Texture;
var SBR_DM_Table_Sofa_Texture;
var SBR_DM_Floar_Texture;
var DM_starbucks_wall_texture;
var DM_starbucks_roof_texture;
var DM_starbucks_floor_texture;
var DM_starbucks_logo_texture;
var SBR_DM_Chair_Wood_Texture;

var SBR_DM_X_ = 5.0;
var SBR_DM_Y_ = -0.645//0.0;
var SBR_DM_Z_ = 4.54//5.5;

var SBR_DM_EYE_X_ = 5.0;
var SBR_DM_EYE_Y_ = -0.7//0.0;
var SBR_DM_EYE_Z_ = 0.0//5.5;

var SBR_DM_Stack_Matrix = [];
var SBR_DM_Matrix_Count = -1;


var SBR_DM_texture_Sampler_Uniform;

var perspectiveMatrix;


function init_InteriorStarbucks()
{
     /* SBR_DM_vertexShaderObject */
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



 SBR_DM_vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
 gl.shaderSource(SBR_DM_vertexShaderObject, VertexShaderSourceCode);
 gl.compileShader(SBR_DM_vertexShaderObject);

 if (gl.getShaderParameter(SBR_DM_vertexShaderObject, gl.COMPILE_STATUS) == false) {
     var error = gl.getShaderInfoLog(SBR_DM_vertexShaderObject);
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

 SBR_DM_fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
 gl.shaderSource(SBR_DM_fragmentShaderObject, fragmentShaderSourceCode);
 gl.compileShader(SBR_DM_fragmentShaderObject);

 if (gl.getShaderParameter(SBR_DM_fragmentShaderObject, gl.COMPILE_STATUS) == false) {
     var error = gl.getShaderInfoLog(SBR_DM_fragmentShaderObject);
     if (error.length > 0) {
         alert(error)
         unInitilize();
     }
 }

 /* Shader Linking  */

 SBR_DM_ShaderProgramObject = gl.createProgram();
 gl.attachShader(SBR_DM_ShaderProgramObject, SBR_DM_vertexShaderObject);
 gl.attachShader(SBR_DM_ShaderProgramObject, SBR_DM_fragmentShaderObject);

 gl.bindAttribLocation(SBR_DM_ShaderProgramObject, WebGLMicros.DVM_ATTTRIBUTE_VERTEX, "vPosition");
 gl.bindAttribLocation(SBR_DM_ShaderProgramObject, WebGLMicros.DVM_ATTTRIBUTE_TEXTURE, "vTexCoord");


 gl.linkProgram(SBR_DM_ShaderProgramObject);
 if (!gl.getProgramParameter(SBR_DM_ShaderProgramObject, gl.LINK_STATUS)) {
     var error = gl.getProgramInfoLog(SBR_DM_ShaderProgramObject);
     if (error.length > 0) {
         alert(error);
         unInitilize();
     }
 }

 SBR_DM_mUniform = gl.getUniformLocation(SBR_DM_ShaderProgramObject, "u_m_matrix");
 SBR_DM_vUniform = gl.getUniformLocation(SBR_DM_ShaderProgramObject, "u_v_matrix");
 SBR_DM_pUniform = gl.getUniformLocation(SBR_DM_ShaderProgramObject, "u_p_matrix");
 SBR_DM_texture_Sampler_Uniform = gl.getUniformLocation(SBR_DM_ShaderProgramObject,"u_Texture_Sampler");

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
     0.5, -0.5, -5.0,
     0.5, -1.5, -5.0,
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
     0.5, -0.45, -4.8,
     -4.3, -0.45, -4.8,
     -4.3, -0.45, -5.5,
     0.5, -0.45, -5.5,

     //Front Table Desk front cover
     0.5, -0.45, -4.8,
     -4.3, -0.45, -4.8,
     -4.3, -0.5, -4.8,
     0.5, -0.5, -4.8,

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

     //Counter 
     0.5, -0.5, -5.0,
     0.5, -0.5, -6.0,
     0.5, -1.5, -6.0,
     0.5, -1.5, -5.0,

     //Counter Desk Cover 
     0.5, -0.45, -4.75,
     0.5, -0.45, -6.0,
     0.5, -0.5, -6.0,
     0.5, -0.5, -4.75,

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
     2.0, 0.0,
     2.0, 1.0,
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
     5.0, 0.0,
     5.0, 5.0,
     0.0, 5.0,

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
 SBR_DM_Cube_Vbo = gl.createVertexArray();
 gl.bindVertexArray(SBR_DM_Cube_Vbo);

 SBR_DM_Cube_Vertices_Vbo = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, SBR_DM_Cube_Vertices_Vbo);
 gl.bufferData(gl.ARRAY_BUFFER, CubeVertices, gl.STATIC_DRAW);
 gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_VERTEX,
     3,
     gl.FLOAT,
     false, 0, 0);

 gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_VERTEX);
 gl.bindBuffer(gl.ARRAY_BUFFER, null);

 SBR_DM_Cube_Texture_Vbo_DM = gl.createBuffer();

 gl.bindBuffer(gl.ARRAY_BUFFER, SBR_DM_Cube_Texture_Vbo_DM);
 gl.bufferData(gl.ARRAY_BUFFER, CubeTexCoords, gl.STATIC_DRAW);
 gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_TEXTURE,
     2,
     gl.FLOAT,
     false, 0, 0);

 gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_TEXTURE);
 gl.bindBuffer(gl.ARRAY_BUFFER, null);

 gl.bindVertexArray(null);

 LoadTexture_InteriorStarbucks();
}


function LoadTexture_InteriorStarbucks()
{
    SBR_DM_Table_Texture = gl.createTexture();
    SBR_DM_Table_Texture.image = new Image();
    SBR_DM_Table_Texture.image.src = "Res/Table_01.jpg";
    
    SBR_DM_Table_Texture.image.onload = function (){
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Table_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Table_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);


    }

    SBR_DM_Table_surface_Texture = gl.createTexture();
    SBR_DM_Table_surface_Texture.image = new Image();
    SBR_DM_Table_surface_Texture.image.src = "Res/Floor_2.jpg";
    
    SBR_DM_Table_surface_Texture.image.onload = function (){
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Table_surface_Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Table_surface_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    SBR_DM_Desk_Texture = gl.createTexture();
    SBR_DM_Desk_Texture.image = new Image();
    SBR_DM_Desk_Texture.image.src = "Res/Desk_01.jpg";
    
    SBR_DM_Desk_Texture.image.onload = function (){
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Desk_Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Desk_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    SBR_DM_Green_Texture = gl.createTexture();
    SBR_DM_Green_Texture.image = new Image();
    SBR_DM_Green_Texture.image.src = "Res/Leaf_01.jpeg";
    
    SBR_DM_Green_Texture.image.onload = function (){
        
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Green_Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Green_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    SBR_DM_Pot_Texture = gl.createTexture();
    SBR_DM_Pot_Texture.image = new Image();
    SBR_DM_Pot_Texture.image.src = "Res/sample_02.jpg";
    
    SBR_DM_Pot_Texture.image.onload = function (){
        
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Pot_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    SBR_DM_CupBoard_Texture = gl.createTexture();
    SBR_DM_CupBoard_Texture.image = new Image();
    SBR_DM_CupBoard_Texture.image.src = "Res/CupBoard.jpg";
    
    SBR_DM_CupBoard_Texture.image.onload = function (){
        
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_CupBoard_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_CupBoard_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    SBR_DM_Menu_01_Texture = gl.createTexture();
    SBR_DM_Menu_01_Texture.image = new Image();
    SBR_DM_Menu_01_Texture.image.src = "Res/Menu_01.jpg";
    
    SBR_DM_Menu_01_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Menu_01_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Menu_01_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    SBR_DM_Menu_02_Texture = gl.createTexture();
    SBR_DM_Menu_02_Texture.image = new Image();
    SBR_DM_Menu_02_Texture.image.src = "Res/Menu_02.jpg";
    
    SBR_DM_Menu_02_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Menu_02_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Menu_02_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    SBR_DM_Table_Sofa_Texture = gl.createTexture();
    SBR_DM_Table_Sofa_Texture.image = new Image();
    SBR_DM_Table_Sofa_Texture.image.src = "Res/Sofa_table.jpg";
    
    SBR_DM_Table_Sofa_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Table_Sofa_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Table_Sofa_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    SBR_DM_Floar_Texture = gl.createTexture();
    SBR_DM_Floar_Texture.image = new Image();
    SBR_DM_Floar_Texture.image.src = "Res/marbel.png";
    
    SBR_DM_Floar_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Floar_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Floar_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    DM_starbucks_wall_texture = gl.createTexture();
    DM_starbucks_wall_texture.image = new Image();
    DM_starbucks_wall_texture.image.src = "Res/starbucks_wall_art.jpg";
    
    DM_starbucks_wall_texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, DM_starbucks_wall_texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, DM_starbucks_wall_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    DM_starbucks_floor_texture = gl.createTexture();
    DM_starbucks_floor_texture.image = new Image();
    DM_starbucks_floor_texture.image.src = "Res/starbucks_floor.jpg";

    DM_starbucks_floor_texture.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, DM_starbucks_floor_texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, DM_starbucks_floor_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }


    DM_starbucks_logo_texture = gl.createTexture();
    DM_starbucks_logo_texture.image = new Image();
    DM_starbucks_logo_texture.image.src = "Res/starbucks_logo.png";

    DM_starbucks_logo_texture.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, DM_starbucks_logo_texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, DM_starbucks_logo_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }



    DM_starbucks_roof_texture = gl.createTexture();
    DM_starbucks_roof_texture.image = new Image();
    DM_starbucks_roof_texture.image.src = "Res/roof.jpg";

    DM_starbucks_roof_texture.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, DM_starbucks_roof_texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, DM_starbucks_roof_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    /*starbucks_wall_texture = gl.createTexture();
    starbucks_wall_texture.image = new Image();
    starbucks_wall_texture.image.src = "Res/starbucks_wall_art.jpg";

    starbucks_wall_texture.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, starbucks_wall_texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, starbucks_wall_texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }*/


    SBR_DM_Chair_Wood_Texture = gl.createTexture();
    SBR_DM_Chair_Wood_Texture.image = new Image();
    SBR_DM_Chair_Wood_Texture.image.src = "Res/wood_02.jpg";
    
    SBR_DM_Chair_Wood_Texture.image.onload = function (){ 
        
        gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Chair_Wood_Texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SBR_DM_Chair_Wood_Texture.image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

var DM_Projection_Matrix
var DM_View_Matrix
    

function display_InteriorStarbucks()
{
    gl.useProgram(SBR_DM_ShaderProgramObject);

    DM_Projection_Matrix = mat4.create();
    DM_View_Matrix = mat4.create();
    var DM_Model_Matrix = mat4.create();
    var DM_XRotation_Matrix = mat4.create();
    var DM_XTranslate_Matrix = mat4.create();
    var DM_Scale_Matrix = mat4.create();

    mat4.lookAt(DM_View_Matrix, [SBR_DM_X_, SBR_DM_Y_, SBR_DM_Z_], [SBR_DM_EYE_X_, SBR_DM_EYE_Y_, SBR_DM_EYE_Z_], [0.0, 1.0, 0.0]);
    
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix, DM_XRotation_Matrix);
    
    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);
    
    gl.uniform1i(SBR_DM_texture_Sampler_Uniform, 0);

    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, DM_starbucks_logo_texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);// front wall
    gl.bindTexture(gl.TEXTURE_2D, null);


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, DM_starbucks_wall_texture);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);// back Wall  
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);// Right Wall
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);// left wall
    

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, DM_starbucks_floor_texture);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);// Top wall

    

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, DM_starbucks_roof_texture);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);// Bottom Floar     

    gl.bindVertexArray(null);

    //counter Desk 
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Desk_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 44, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 48, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 52, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 304, 4);

    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Table_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 300, 4);


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
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, 0.0, 5.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);


    //SMALL ONE SOFA
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

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
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, -3.2);
    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, 0.0, 2.5]);
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //SMALL ONE SOFA
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

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
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, 0.0, 1.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //SMALL ONE SOFA
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

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
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, -3.2);
    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, 0.0, -1.5]);
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //SMALL ONE SOFA
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

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

    //*****************************************************************************************CHAIR
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-3.25, -0.25, -3.0]);
    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, -7.9);
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);
    
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Chair_Wood_Texture);
    
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 172, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 176, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 180, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 184, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 188, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 192, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 196, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 200, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 204, 4);

    gl.bindVertexArray(null);

    //Chair table rod Right back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.75, 1.25, 0.75]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.0, -0.25, 0.25]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Chair Rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Chair_Wood_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    PopMatrix_InteriorStarBucks();

    //*********************************************************************************************Chair 2
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-3.25, -0.25, -1.0]);
    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, -7.9);
    
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);
    
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Chair_Wood_Texture);

    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 172, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 176, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 180, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 184, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 188, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 192, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 196, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 200, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 204, 4);

    gl.bindVertexArray(null);

    //Chair table rod Right back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.75, 1.25, 0.75]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.0, -0.25, 0.25]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Chair Rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Chair_Wood_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    PopMatrix_InteriorStarBucks();

    //*********************************************************************************************Chair 3
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-2.0, -0.25, -3.25]);
    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, 3.2);
    
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);
    
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Chair_Wood_Texture);

    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 172, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 176, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 180, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 184, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 188, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 192, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 196, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 200, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 204, 4);

    gl.bindVertexArray(null);

    //Chair table rod Right back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.75, 1.25, 0.75]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.0, -0.25, 0.25]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Chair Rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Chair_Wood_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    PopMatrix_InteriorStarBucks();

    
    //Right side gamla
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-4.5, -1.0, 1.0]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 208, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 212, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 216, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 220, 4);
    
    gl.bindVertexArray(null);

    //Green
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Green_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 224, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 228, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 232, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 236, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 240, 4);
    
    gl.bindVertexArray(null);

    //left Side Gamla
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-1.0, -1.0, 4.7]);
    
    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, 1.6);
    
    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 208, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 212, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 216, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 220, 4);
    
    gl.bindVertexArray(null);

    //Green
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Green_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 224, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 228, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 232, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 236, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 240, 4);
    
    gl.bindVertexArray(null);
    
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, 1.6);
    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-6.0, 1.0, -3.25]);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //CupBoard Front 
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_CupBoard_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 244, 4);

    gl.bindVertexArray(null);
    
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 248, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 252, 4);
    
    gl.bindVertexArray(null);
    
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();


    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-2.5, 1.25, -6.7]);
    //mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [1.0, 2.0, 0.1]);

    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Menu_01
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Menu_01_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 256, 4);
    
    gl.bindVertexArray(null);
  

    //Menu_2
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Menu_02_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 260, 4);
    
    gl.bindVertexArray(null);

    //*****************************************************Sofa Table Big one 
    
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, 2.0, 1.0, 3.0);
    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-4.0, -0.6, 4.0]);

    mat4.rotateY(DM_XRotation_Matrix, DM_XRotation_Matrix, 1.6);

    mat4.multiply(DM_Model_Matrix, DM_XTranslate_Matrix, DM_XRotation_Matrix );
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    
    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Table_Sofa_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 264, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 268, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 272, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 276, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 280, 4);
    
    gl.bindVertexArray(null);

    //Sofa table rod Right Front 
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.8, -0.2, 0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Right back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.8, -0.2, -0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Sofa Table rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Left Front 
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-0.8, -0.2, 0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Left back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-0.8, -0.2, -0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Sofa Table rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    PopMatrix_InteriorStarBucks();

//*****************************************************Sofa Table Small one 
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, -0.7, -0.15]);

    mat4.multiply(DM_Model_Matrix,DM_Model_Matrix,  DM_XTranslate_Matrix );
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    
    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Table_Sofa_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 264, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 268, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 272, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 276, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 280, 4);
    
    gl.bindVertexArray(null);

    //Sofa table rod Right Front 
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.8, -0.2, 0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Right back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.8, -0.2, -0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Sofa Table rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Left Front 
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-0.8, -0.2, 0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Left back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-0.8, -0.2, -0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Sofa Table rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    PopMatrix_InteriorStarBucks();


    //*****************************************************Sofa Table Small Two
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [5.0, -0.7, 4.0]);

    mat4.multiply(DM_Model_Matrix,DM_Model_Matrix,  DM_XTranslate_Matrix );
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    
    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Table_Sofa_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 264, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 268, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 272, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 276, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 280, 4);
    
    gl.bindVertexArray(null);

    //Sofa table rod Right Front 
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.8, -0.2, 0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Right back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [0.8, -0.2, -0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Sofa Table rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Left Front 
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-0.8, -0.2, 0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    //Sofa table rod Left back
    DM_Model_Matrix = mat4.create();
    DM_Projection_Matrix = mat4.create();
    DM_XRotation_Matrix = mat4.create();
    DM_XTranslate_Matrix = mat4.create();
    DM_Scale_Matrix = mat4.create();

    mat4.scale(DM_Scale_Matrix, DM_Scale_Matrix, [0.5, 0.5, 0.5]);

    mat4.translate(DM_XTranslate_Matrix, DM_XTranslate_Matrix, [-0.8, -0.2, -0.35]);

    mat4.multiply(DM_XTranslate_Matrix, DM_XTranslate_Matrix,  DM_Scale_Matrix);
    mat4.multiply(DM_Model_Matrix, DM_Model_Matrix,  DM_XTranslate_Matrix);
    
    DM_Model_Matrix = PushMatrix_InteriorStarBucks(DM_Model_Matrix);
    PopMatrix_InteriorStarBucks();

    mat4.multiply(DM_Projection_Matrix, DM_Projection_Matrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(SBR_DM_mUniform, false, DM_Model_Matrix);
    gl.uniformMatrix4fv(SBR_DM_vUniform, false, DM_View_Matrix);
    gl.uniformMatrix4fv(SBR_DM_pUniform, false, DM_Projection_Matrix);

    //Sofa Table rod
    gl.bindTexture(gl.TEXTURE_2D, SBR_DM_Pot_Texture);
    gl.bindVertexArray(SBR_DM_Cube_Vbo);

    gl.drawArrays(gl.TRIANGLE_FAN, 284, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 288, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 292, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 296, 4);
 
    gl.bindVertexArray(null);

    PopMatrix_InteriorStarBucks();
 
    gl.useProgram(null);

}

function PushMatrix_InteriorStarBucks(Matrix)
{
    if( SBR_DM_Matrix_Count == -1)
    {
        SBR_DM_Stack_Matrix.push(Matrix);
        SBR_DM_Matrix_Count++;
        return Matrix;
    }
    else{
        var prev_Matrix = SBR_DM_Stack_Matrix[SBR_DM_Matrix_Count];
        mat4.multiply(Matrix, prev_Matrix, Matrix);
        SBR_DM_Stack_Matrix.push(Matrix);
        SBR_DM_Matrix_Count++;
        return Matrix;
    }
}

function PopMatrix_InteriorStarBucks()
{
    if(!SBR_DM_Stack_Matrix[0])
    {
        SBR_DM_Stack_Matrix[0] = mat4.create();
        return SBR_DM_Stack_Matrix[0];
    }
    else{
        SBR_DM_Stack_Matrix.pop();
        SBR_DM_Matrix_Count--;
        return (SBR_DM_Stack_Matrix[SBR_DM_Matrix_Count]);
    }
}