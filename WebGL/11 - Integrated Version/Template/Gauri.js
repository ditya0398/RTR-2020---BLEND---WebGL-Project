const WebGLMacros =
{
    GR_ATTRIBUTE_POSITION: 0,
    GR_ATTRIBUTE_COLOR: 1,
    GR_ATTRIBUTE_TEXTURE: 2,
    GR_ATTRIBUTE_NORMAL: 3
};

var grvertexShaderObjectTableBench;
var grfragmentShaderObjectTableBench;
var grshaderProgramObjectTableBench;


var grgVaoRadio;
var grgVboPositionRadio;
var grgVboTextureRadio;
// bench
// bench
var grgVaoBenchTable;
var grgVboPositionBenchTable;
var grgVboTextureBenchTable;
var grgVaoBenchLegs;
var grgVboPositionBenchLegs;
var grgVboTextureBenchLegs;

var grfangleX_table = 0.0;
var grfangleY_table = 0.0;

var grftransx_table = 2.4;
var grftransy_table = -1.1;
var grftransz_table = -14.8;

var grscaling_table = 0.27;

var grfangleX_bench = 0.0;
var grfangleY_bench = 0.0;

var grftransx_bench = 2.67;
var grftransy_bench = -1.4;
var grftransz_bench = -12.8;

var grscaling_bench = 0.27;

var grftransx_radio = 3.0;
var grftransy_radio = -0.9;
var grftransz_radio = -14.6;
var grscaling_radio = 0.32;
var grfangleX_radio = 0.0;
var grfangleY_radio = 305.0;

// texture
var grtextureBench;
var grtextureRadio;
var grtextureBenchLegs;
var grtextureAntenna;
var grtextureRoad;
var grtextureFootpath;
var grtextureSamplerUniform;

var grgModelMatrixUniformTableBench;
var grgViewMatrixUniformTableBench;
var grgProjectionMatrixUniformTableBench;


var grstackMatrixTableBench = [];
var grmatrixPositionTableBench = -1;

//AKHI
var ASJ_ambientUniform_pointLight_gauri;
var ASJ_lightColorUniform_pointLight_gauri;
var ASJ_lightPositionUniform_pointLight_gauri;
var ASJ_shininessUniform_pointLight_gauri;
var ASJ_strengthUniform_pointLight_gauri;
var ASJ_eyeDirectionUniform_pointLight_gauri;
var ASJ_attenuationUniform_pointLight_gauri;
var ASJ_lightPositionUniform_pointLight_gauri_2;

var gr_vbo_normal_table;
var gr_vbo_normal_bench;
var gr_vbo_normal_radio;



var textureKaagazKePhool;





var posterX = 3.89;
var posterY = -0.6;
var posterZ = -6.099;

function GRInit() {
    // vertex shader
    var grvertexShaderSourceCode =
        "#version 300 es" +
        "\n" +
        "in vec4 vPosition;" +
        "in vec2 vTexCoord;" +
        "in vec3 vNormal;" +
        "uniform mat4 u_model_matrix;" +
        "uniform mat4 u_view_matrix;" +
        "uniform mat4 u_projection_matrix;" +
        "out vec2 out_texcoord;" +
        //akhi out
        "out vec4 Position;" +
        "out vec3 tNormal;" +
        "void main(void)" +
        "{" +
        "gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;" +
        "out_texcoord = vTexCoord;" +
        //akhi
        "Position= u_model_matrix * vPosition;" +
        "tNormal= normalize(mat3(u_model_matrix) * vNormal);" +
        "}";

    grvertexShaderObjectTableBench = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(grvertexShaderObjectTableBench, grvertexShaderSourceCode);
    gl.compileShader(grvertexShaderObjectTableBench);
    if (gl.getShaderParameter(grvertexShaderObjectTableBench, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(grvertexShaderObjectTableBench);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
        alert("in compile vertex shader error");

    }

    var grfragmentShaderSourceCode =
        "#version 300 es" +
        "\n" +
        "precision highp float;" +
        "in vec2 out_texcoord;" +
        "uniform highp sampler2D u_texture_sampler;" +
        "out vec4 FragColor;" +
        //Akhi Uniform
        "uniform vec4 Ambient_AJ;" +
        "uniform vec3 LightColor_AJ;" +
        "uniform vec3 LightPosition_AJ;" +
        "uniform float Shininess_AJ;" +
        "uniform float Strength_AJ;" +
        "uniform vec3 EyeDirection_AJ;" +
        "uniform float Attenuation_AJ;" +

        //2nd point light
        "uniform vec3 LightPosition_2_AJ;" +
        //Akhi in
        "in vec4 Position;" +
        "in vec3 tNormal;" +
        //akhi func
        "vec4 pointLight(vec3 Normal,vec4 Color,vec3 LightPosition)" +
        "{" +

        "vec3 lightDirection=vec3(Position)-LightPosition;" +
        "\n" +
        "float lightDistance=length(lightDirection);" +
        "lightDirection= lightDirection / lightDistance;" +
        "\n" +
        "vec3 HalfVector=normalize(EyeDirection_AJ - lightDirection);" +
        "\n" +
        "float AttenuaFactor = 1.0 / (Attenuation_AJ * lightDistance * lightDistance  );" +

        "float diffuse=max(0.0f,-1.0*dot(Normal,lightDirection)) * 0.5;" +
        "\n" +
        "float specular=max(0.0f,1.0*dot(Normal,HalfVector));" +

        "if(diffuse<=0.00001)" +
        "{" +
        "specular=0.0f;" +
        "}" +
        "else" +
        "{" +
        "specular=pow(specular,Shininess_AJ);" +
        "}" +
        "\n" +
        "vec4 scatteredLight=Ambient_AJ + vec4(LightColor_AJ * diffuse * AttenuaFactor,1.0);" +
        "vec4 ReflectedLight=vec4(LightColor_AJ * specular * Strength_AJ * AttenuaFactor,1.0);" +

        "vec4 res=min(Color * scatteredLight + ReflectedLight,vec4(1.0));" +
        "return res;" +
        "}" +

        "void main(void)" +
        "{" +
        "vec4 color;" +
        "color= texture(u_texture_sampler, out_texcoord);" +
        //Akhi Lighting Calculation
        "vec3 Normal_AJ=tNormal;" +
        "vec4 result_1;" +
        "vec4 result_2;" +

        "result_1=pointLight(Normal_AJ,color,LightPosition_AJ);" +
        "result_2=pointLight(Normal_AJ,color,LightPosition_2_AJ);" +

        "FragColor =color * (result_1 + result_2 );" +
        "}";

    grfragmentShaderObjectTableBench = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(grfragmentShaderObjectTableBench, grfragmentShaderSourceCode);
    gl.compileShader(grfragmentShaderObjectTableBench);
    if (gl.getShaderParameter(grfragmentShaderObjectTableBench, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(grfragmentShaderObjectTableBench);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
        alert("in compile fragment shader error");

    }

    // shader program
    grshaderProgramObjectTableBench = gl.createProgram();
    //attach shader object
    gl.attachShader(grshaderProgramObjectTableBench, grvertexShaderObjectTableBench);
    gl.attachShader(grshaderProgramObjectTableBench, grfragmentShaderObjectTableBench);
    // pre-linking
    gl.bindAttribLocation(grshaderProgramObjectTableBench, WebGLMacros.GR_ATTRIBUTE_POSITION, "vPosition");
    gl.bindAttribLocation(grshaderProgramObjectTableBench, WebGLMacros.GR_ATTRIBUTE_TEXTURE, "vTexCoord");

    // linking
    gl.linkProgram(grshaderProgramObjectTableBench);
    if (!gl.getProgramParameter(grshaderProgramObjectTableBench, gl.LINK_STATUS)) {
        var err = gl.getProgramInfoLog(grshaderProgramObjectTableBench);
        if (err.length > 0) {
            alert(err);

        }

        alert("in shader program object error");
        alert(err);
        // uninitialize(); 
    }

    // mvp uniform binding
    grgModelMatrixUniformTableBench = gl.getUniformLocation(grshaderProgramObjectTableBench, "u_model_matrix");
    grgViewMatrixUniformTableBench = gl.getUniformLocation(grshaderProgramObjectTableBench, "u_view_matrix");
    grgProjectionMatrixUniformTableBench = gl.getUniformLocation(grshaderProgramObjectTableBench, "u_projection_matrix");
    grtextureSamplerUniform = gl.getUniformLocation(grshaderProgramObjectTableBench, "u_texture_sampler");

    //AKHI UNIFORM binding
    ASJ_ambientUniform_pointLight_gauri = gl.getUniformLocation(grshaderProgramObjectTableBench, "Ambient_AJ");
    ASJ_lightColorUniform_pointLight_gauri = gl.getUniformLocation(grshaderProgramObjectTableBench, "LightColor_AJ");
    ASJ_lightPositionUniform_pointLight_gauri = gl.getUniformLocation(grshaderProgramObjectTableBench, "LightPosition_AJ");
    ASJ_shininessUniform_pointLight_gauri = gl.getUniformLocation(grshaderProgramObjectTableBench, "Shininess_AJ");
    ASJ_strengthUniform_pointLight_gauri = gl.getUniformLocation(grshaderProgramObjectTableBench, "Strength_AJ");
    ASJ_eyeDirectionUniform_pointLight_gauri = gl.getUniformLocation(grshaderProgramObjectTableBench, "EyeDirection_AJ");
    ASJ_attenuationUniform_pointLight_gauri = gl.getUniformLocation(grshaderProgramObjectTableBench, "Attenuation_AJ");

    ASJ_lightPositionUniform_pointLight_gauri_2 = gl.getUniformLocation(grshaderProgramObjectTableBench, "LightPosition_2_AJ");


    // radio 
    var grradioVertices = new Float32Array(
        [
            1.0, 0.5, 0.2,
            -1.0, 0.5, 0.2,
            -1.0, -0.5, 0.2,
            1.0, -0.5, 0.2,
            // right face
            1.0, 0.5, -0.2,
            1.0, 0.5, 0.2,
            1.0, -0.5, 0.2,
            1.0, -0.5, -0.2,
            // back face
            -1.0, 0.5, -0.2,
            1.0, 0.5, -0.2,
            1.0, -0.5, -0.2,
            -1.0, -0.5, -0.2,
            // left face
            -1.0, 0.5, 0.2,
            -1.0, 0.5, -0.2,
            -1.0, -0.5, -0.2,
            -1.0, -0.5, 0.2,
            // top face
            1.0, 0.5, -0.2,
            -1.0, 0.5, -0.2,
            -1.0, 0.5, 0.2,
            1.0, 0.5, 0.2,
            // bottom face
            1.0, -0.5, -0.2,
            -1.0, -0.5, -0.2,
            -1.0, -0.5, 0.2,
            1.0, -0.5, 0.2
        ]
    );

    var grradioTexCoords = new Float32Array(
        [
            0.98, 0.92,						// left bottom	rt
            0.015, 0.92,						// left top     lt
            0.015, 0.08,						// right top	lb
            0.98, 0.08,						// right bottom	rb

            0.13, 0.08,							// right
            0.1, 0.08,
            0.1, 0.067,
            0.13, 0.067,

            0.13, 0.08,							// back rt
            0.1, 0.08,								// lt
            0.1, 0.069,							// lb
            0.13, 0.069,								// rb

            0.13, 0.08,							// left
            0.1, 0.08,
            0.1, 0.07,
            0.13, 0.07,

            0.13, 0.08,							// right
            0.1, 0.08,
            0.1, 0.067,
            0.13, 0.067,

            0.13, 0.08,							// right
            0.1, 0.08,
            0.1, 0.067,
            0.13, 0.067,
        ]
    );

    var grcubeTexcoords = new Float32Array(
        [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            1.0, 0.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ]
    );
    var grcubeNormal = new Float32Array([0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        //RIGHT FACE
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        //BACK FACE
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        //LEFT FACE
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        //TOP FACE
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,


        //BOTTOM FACE
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0]);
    var grcubeVertices = new Float32Array(
        [
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            // right face
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            // back face
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
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            // bottom face
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0
        ]
    );

    // radio
    grgVaoRadio = gl.createVertexArray();
    gl.bindVertexArray(grgVaoRadio);

    grgVboPositionRadio = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboPositionRadio);
    gl.bufferData(gl.ARRAY_BUFFER, grradioVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.GR_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(WebGLMacros.GR_ATTRIBUTE_POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    grgVboTextureRadio = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboTextureRadio);
    gl.bufferData(gl.ARRAY_BUFFER, grradioTexCoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.GR_ATTRIBUTE_TEXTURE, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(WebGLMacros.GR_ATTRIBUTE_TEXTURE);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    gr_vbo_normal_radio = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gr_vbo_normal_radio);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeNormal, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_NORMAL, 3, gl.FLOAT,
        false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_NORMAL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    gl.bindVertexArray(null);


    // table
    grgVaoBenchTable = gl.createVertexArray();
    gl.bindVertexArray(grgVaoBenchTable);

    grgVboPositionBenchTable = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboPositionBenchTable);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.GR_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(WebGLMacros.GR_ATTRIBUTE_POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    grgVboTextureBenchTable = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboTextureBenchTable);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeTexcoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.GR_ATTRIBUTE_TEXTURE, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(WebGLMacros.GR_ATTRIBUTE_TEXTURE);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //normal
    gr_vbo_normal_table = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gr_vbo_normal_table);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeNormal, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_NORMAL, 3, gl.FLOAT,
        false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_NORMAL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);



    gl.bindVertexArray(null);

    // bench legs
    grgVaoBenchLegs = gl.createVertexArray();
    gl.bindVertexArray(grgVaoBenchLegs);

    grgVboPositionBenchLegs = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboPositionBenchLegs);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.GR_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(WebGLMacros.GR_ATTRIBUTE_POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    grgVboTextureBenchLegs = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboTextureBenchLegs);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeTexcoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.GR_ATTRIBUTE_TEXTURE, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(WebGLMacros.GR_ATTRIBUTE_TEXTURE);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //normal
    gr_vbo_normal_bench = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gr_vbo_normal_bench);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeNormal, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_NORMAL, 3, gl.FLOAT,
        false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_NORMAL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    // texture for bench
    grtextureBench = gl.createTexture();
    grtextureBench.image = new Image();
    grtextureBench.image.src = "GauriResources/bench.jpg";
    grtextureBench.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, grtextureBench);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grtextureBench.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    // texture for radio
    grtextureRadio = gl.createTexture();
    grtextureRadio.image = new Image();
    grtextureRadio.image.src = "GauriResources/bush.png";
    grtextureRadio.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, grtextureRadio);
        //gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grtextureRadio.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    // texture for bench legs and table
    grtextureBenchLegs = gl.createTexture();
    grtextureBenchLegs.image = new Image();
    grtextureBenchLegs.image.src = "GauriResources/wood.png";
    grtextureBenchLegs.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grtextureBenchLegs.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    // texture for antenna
    grtextureAntenna = gl.createTexture();
    grtextureAntenna.image = new Image();
    grtextureAntenna.image.src = "GauriResources/antenna.png";
    grtextureAntenna.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, grtextureAntenna);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grtextureAntenna.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    
  //texture for kaagaz ke phool
  textureKaagazKePhool = gl.createTexture();
  textureKaagazKePhool.image = new Image();
  textureKaagazKePhool.image.src = "AdityaResources/KaagazKePhool2.jpg";
  textureKaagazKePhool.image.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, textureKaagazKePhool);
      //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureKaagazKePhool.image);
      gl.bindTexture(gl.TEXTURE_2D, null);
  };

}


function GRDisplay() {
    // variables
    var grmodelMatrix = mat4.create();
    var grviewMatrix = mat4.create();
    var grprojectionMatrix = mat4.create();
    var grscaleMatrix = mat4.create();
    var grtranslateMatrix = mat4.create();
    var grrotateMatrix = mat4.create();



    gl.useProgram(grshaderProgramObjectTableBench);

    //akhilesh
    var Eye_AJ = new Float32Array([0.0, 0.0, 2.0]);
    var shininess_AJ = 2.50;
    var strength_AJ = parseFloat(5);
    var attenuation_AJ = parseFloat(0.50);
    var Ambient_AJ = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    var LightColor_AJ = new Float32Array([1.0, 1.0, 1.0]);
    var lightPosition_AJ = view;//new Float32Array([0.0, 1.0, -15 + val_AJ]);

    var lightPosition_AJ_2 = new Float32Array([2.9000000000000012, 0.33199999999999107, -14.299999999999961]);


    //lightPosition_AJ[2]=
    gl.uniform4fv(ASJ_ambientUniform_pointLight_gauri, Ambient_AJ);
    gl.uniform3fv(ASJ_lightColorUniform_pointLight_gauri, LightColor_AJ);
    gl.uniform3fv(ASJ_lightPositionUniform_pointLight_gauri, lightPosition_AJ);
    gl.uniform1f(ASJ_shininessUniform_pointLight_gauri, shininess_AJ);
    gl.uniform1f(ASJ_strengthUniform_pointLight_gauri, strength_AJ);
    gl.uniform3fv(ASJ_eyeDirectionUniform_pointLight_gauri, Eye_AJ);
    gl.uniform1f(ASJ_attenuationUniform_pointLight_gauri, attenuation_AJ);
    gl.uniform3fv(ASJ_lightPositionUniform_pointLight_gauri_2, lightPosition_AJ_2);

    //************************************************************************************************ radio ********************************************************
    //***************************************************************************************************************************************************************
    mat4.scale(grscaleMatrix, grscaleMatrix, [grscaling_radio, grscaling_radio, grscaling_radio]);
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [grftransx_radio, grftransy_radio, grftransz_radio]);
    mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(grfangleX_radio));
    mat4.rotateY(grrotateMatrix, grrotateMatrix, deg2rad(grfangleY_radio));
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grmodelMatrix, grscaleMatrix);

    GRPushToStack(grmodelMatrix);

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureRadio);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoRadio);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);


    //***************** antenna - 1
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-0.9, 0.9, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.015, 1.0, 0.08]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureAntenna);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoRadio);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    //***************** antenna - 2
    grmodelMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-0.9, 1.4, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.008, 0.1, 0.06]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureAntenna);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoRadio);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //********************** Antenna - 3
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-0.9, 1.45, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.017, 0.03, 0.08]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    //console.log("antenna model matrix : " + grmodelMatrix);
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureAntenna);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoRadio);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    GRPopFromStack();

    //*************************************************************************************** bench ************************************************************** 
    //************************************************************************************************************************************************************
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.scale(grscaleMatrix, grscaleMatrix, [grscaling_bench, grscaling_bench, grscaling_bench]);
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [grftransx_bench, grftransy_bench, grftransz_bench]);
    mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(grfangleX_bench));
    mat4.rotateY(grrotateMatrix, grrotateMatrix, deg2rad(grfangleY_bench));
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grmodelMatrix, grscaleMatrix);
    // push matrix for whole bench
    GRPushToStack(grmodelMatrix);

    //*********************** bench desk
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, 0.0, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [3.8, 0.1, 1.2]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBench);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchTable);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //********************** Bench legs 
    // right leg bench
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [2.2, -1.2, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [1.2, 0.1, 1.0]);
    mat4.rotateZ(grrotateMatrix, grrotateMatrix, deg2rad(90.0));
    mat4.multiply(grtranslateMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    // left leg bench
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-2.2, -1.2, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [1.2, 0.1, 1.0]);
    mat4.rotateZ(grrotateMatrix, grrotateMatrix, deg2rad(90.0));
    mat4.multiply(grtranslateMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    GRPopFromStack();

    //************************************************************************ Chai Table **********************************************************************
    //**********************************************************************************************************************************************************
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.scale(grscaleMatrix, grscaleMatrix, [grscaling_table, grscaling_table, grscaling_table]);
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [grftransx_table, grftransy_table, grftransz_table]);
    mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(grfangleX_table));
    mat4.rotateY(grrotateMatrix, grrotateMatrix, deg2rad(grfangleY_table));
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grmodelMatrix, grscaleMatrix);
    // push matrix for whole bench
    GRPushToStack(grmodelMatrix);

    //*********************** table surface
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, 0.0, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [4.0, 0.1, 1.5]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //*********************** table holder - front
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, -0.25, 1.2]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [3.0, 0.14, 0.1]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //*********************** table holder - back
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, -0.25, -1.2]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [3.2, 0.14, 0.1]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //******************************** table holder - right
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [3.1, -0.25, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.1, 0.14, 1.12]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //******************************* table holder - left
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-3.1, -0.3, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.1, 0.2, 1.12]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //********************** table legs - front left 
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-3.15, -1.8, 1.2]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.15, 1.7, 0.12]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //********************** table legs - front right 
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [3.15, -1.8, 1.2]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.15, 1.7, 0.12]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //********************** table legs - back left 
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-3.15, -1.8, -1.2]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.15, 1.7, 0.12]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //*********************** table legs - back right
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [3.15, -1.8, -1.2]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [0.15, 1.7, 0.12]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStack(grmodelMatrix);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureBenchLegs);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchLegs);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    GRPopFromStack();
    //drawFilmPosters();
    gl.useProgram(null);

}

function drawFilmPosters()
{

    var modelMatrix = mat4.create();
   
    
    mat4.translate(modelMatrix, modelMatrix, [posterX,posterY, posterZ]);
    mat4.scale(modelMatrix,modelMatrix,[0.2,0.2,0.2]);
    mat4.rotateY(modelMatrix, modelMatrix, deg2rad(270.0));
    gl.uniformMatrix4fv(grgModelMatrixUniformTableBench, false, modelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformTableBench, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformTableBench, false, perspectiveMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureKaagazKePhool);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoBenchTable);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        //  gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
        //  gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    //gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function GRPushToStack(matrix) {
    if (grmatrixPositionTableBench == -1) {
        grstackMatrixTableBench.push(matrix);
        //console.log("in push, matrixposition 0 : " +grstackMatrixTableBench[0]);
        grmatrixPositionTableBench++;
        return matrix;
    }
    else {
        var topMatrix = grstackMatrixTableBench[grmatrixPositionTableBench];
        //console.log("in GRPushToStack, top matrix : " + topMatrix);
        mat4.multiply(matrix, topMatrix, matrix);
        grstackMatrixTableBench.push(matrix);
        grmatrixPositionTableBench++;
        //sconsole.log("return pushed matrix : position : " + grmatrixPositionTableBench + " matrix : " + grstackMatrixTableBench);
        return grstackMatrixTableBench[grmatrixPositionTableBench];
    }

}

function GRPopFromStack() {
    if (!grstackMatrixTableBench[0]) {
        grstackMatrixTableBench[0] = mat4.create();
        return grstackMatrixTableBench[0];
    }
    else {
        grstackMatrixTableBench.pop();
        grmatrixPositionTableBench--;
        return grstackMatrixTableBench[grmatrixPositionTableBench];
    }

}


function GRUninitialize() {
    if (grgVaoRadio) {
        gl.deleteVertexArray(grgVaoRadio);
        grgVaoRadio = null;
    }
    if (grgVboPositionRadio) {
        gl.deleteBuffer(grgVboPositionRadio);
        grgVboPositionRadio = null;
    }

    if (grshaderProgramObjectTableBench) {
        if (grfragmentShaderObjectTableBench) {
            gl.detachShader(grshaderProgramObjectTableBench, grfragmentShaderObjectTableBench);
            gl.deleteShader(grfragmentShaderObjectTableBench);
            grfragmentShaderObjectTableBench = null;
        }

        if (grfragmentShaderObjectTableBench) {
            gl.detachShader(grshaderProgramObjectTableBench, grvertexShaderObjectTableBench);
            gl.deleteShader(grvertexShaderObjectTableBench);
            grvertexShaderObjectTableBench = null;
        }

        gl.deleteProgram(grshaderProgramObjectTableBench);
        grshaderProgramObjectTableBench = null;
    }
}












