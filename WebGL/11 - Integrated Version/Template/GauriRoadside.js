

var grgVertexShaderObject;
var grgFragmentShadeerObject;
var grgShaderProgramObject;

var grgVaoRoadside;
var grgVboPositionRoadside;
var grgVboTextureRoadside;

var grtransRoadsideX = 1.5;
var grtransRoadsideY = -2.2;
var grtransRoadsideZ = -6.0;


// texture
var grtextureRoadside;
var grgtextureSamplerUniform;

var grgModelMatrixUniform;
var grgViewMatrixUniform;
var grgProjectionMatrixUniform;

var grstackMatrix = [];
var grmatrixPosition = -1;

var ASJ_ambientUniform_pointLight_roadside;
var ASJ_lightColorUniform_pointLight_roadside;
var ASJ_lightPositionUniform_pointLight_roadside;
var ASJ_shininessUniform_pointLight_roadside;
var ASJ_strengthUniform_pointLight_roadside;
var ASJ_eyeDirectionUniform_pointLight_roadside;
var ASJ_attenuationUniform_pointLight_roadside;

var vbo_normal_roadSide;

function GRInitRoadside() {
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
        " tNormal = normalize(mat3(u_model_matrix)  * vNormal);\n" +
        "}";

    grvertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(grvertexShaderObject, grvertexShaderSourceCode);
    gl.compileShader(grvertexShaderObject);
    if (gl.getShaderParameter(grvertexShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(grvertexShaderObject);
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
        //Akhi in
        "in vec4 Position;" +
        "in vec3 tNormal;" +

        //akhi func
        "vec4 pointLight(vec3 Normal,vec4 Color)" +
        "{" +

        "vec3 lightDirection=vec3(Position)-LightPosition_AJ;" +
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

        "vec4 res=min( scatteredLight + ReflectedLight,vec4(1.0));" +
        "return res;" +
        "}" +

        "void main(void)" +
        "{" +
        //Akhi Lighting Calculation
        "vec3 Normal_AJ=tNormal;" +
        "vec4 color;" +
        "vec4 result;" +
        "color=texture(u_texture_sampler, out_texcoord);" +
        "result=pointLight(Normal_AJ,color);" +
        
        "FragColor =color*result;" +
        "}";

    grfragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(grfragmentShaderObject, grfragmentShaderSourceCode);
    gl.compileShader(grfragmentShaderObject);
    if (gl.getShaderParameter(grfragmentShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(grfragmentShaderObject);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
        alert("in compile fragment shader error");

    }

    // shader program
    grshaderProgramObject = gl.createProgram();
    //attach shader object
    gl.attachShader(grshaderProgramObject, grvertexShaderObject);
    gl.attachShader(grshaderProgramObject, grfragmentShaderObject);
    // pre-linking
    gl.bindAttribLocation(grshaderProgramObject, macros.AMC_ATTRIB_POSITION, "vPosition");
    gl.bindAttribLocation(grshaderProgramObject, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord");
    gl.bindAttribLocation(grshaderProgramObject, macros.AMC_ATTRIB_NORMAL, "vNormal");
    // linking
    gl.linkProgram(grshaderProgramObject);
    if (!gl.getProgramParameter(grshaderProgramObject, gl.LINK_STATUS)) {
        var err = gl.getProgramInfoLog(grshaderProgramObject);
        if (err.length > 0) {
            alert(err);

        }

        alert("in shader program object error");
        alert(err);
        // uninitialize(); 
    }

    // mvp uniform binding
    grgModelMatrixUniform = gl.getUniformLocation(grshaderProgramObject, "u_model_matrix");
    grgViewMatrixUniform = gl.getUniformLocation(grshaderProgramObject, "u_view_matrix");
    grgProjectionMatrixUniform = gl.getUniformLocation(grshaderProgramObject, "u_projection_matrix");
    grtextureSamplerUniform = gl.getUniformLocation(grshaderProgramObject, "u_texture_sampler");

    //AKHI UNIFORM
    ASJ_ambientUniform_pointLight_roadside = gl.getUniformLocation(grshaderProgramObject, "Ambient_AJ");
    ASJ_lightColorUniform_pointLight_roadside = gl.getUniformLocation(grshaderProgramObject, "LightColor_AJ");
    ASJ_lightPositionUniform_pointLight_roadside = gl.getUniformLocation(grshaderProgramObject, "LightPosition_AJ");
    ASJ_shininessUniform_pointLight_roadside = gl.getUniformLocation(grshaderProgramObject, "Shininess_AJ");
    ASJ_strengthUniform_pointLight_roadside = gl.getUniformLocation(grshaderProgramObject, "Strength_AJ");
    ASJ_eyeDirectionUniform_pointLight_roadside = gl.getUniformLocation(grshaderProgramObject, "EyeDirection_AJ");
    ASJ_attenuationUniform_pointLight_roadside = gl.getUniformLocation(grshaderProgramObject, "Attenuation_AJ");


    var grcubeTexcoords = new Float32Array(
        [
            0.0, 0.0,		// right		
            12.0, 0.0,
            12.0, 1.0,
            0.0, 1.0,

            0.9, 0.9,
            0.9, 0.9,
            0.9, 0.9,
            0.9, 0.9,

            12.0, 0.0,  // left
            0.0, 0.0,
            0.0, 1.0,
            12.0, 1.0,

            0.9, 0.9,
            0.9, 0.9,
            0.9, 0.9,
            0.9, 0.9,

            0.0, 0.0,
            12.0, 0.0,
            12.0, 1.0,
            0.0, 1.0,

            0.9, 0.9,
            0.9, 0.9,
            0.9, 0.9,
            0.9, 0.9
        ]
    );

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
    // radio
    grgVaoRoadside = gl.createVertexArray();
    gl.bindVertexArray(grgVaoRoadside);

    grgVboPositionRoadside = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboPositionRoadside);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    grgVboTextureRoadside = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboTextureRoadside);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeTexcoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    //normal
    vbo_normal_roadSide = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_normal_roadSide);
    gl.bufferData(gl.ARRAY_BUFFER, grcubeNormal, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_NORMAL, 3, gl.FLOAT,
        false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_NORMAL);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    gl.bindVertexArray(null);


    // texture for radio
    grtextureRoadside = gl.createTexture();
    grtextureRoadside.image = new Image();
    grtextureRoadside.image.src = "GauriResources/road_pavement.jpg";
    grtextureRoadside.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, grtextureRoadside);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grtextureRoadside.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
}


function GRDisplayRoadside() {
    // variables
    var grmodelMatrix = mat4.create();
    var grviewMatrix = mat4.create();
    var grprojectionMatrix = mat4.create();
    var grscaleMatrix = mat4.create();
    var grtranslateMatrix = mat4.create();
    var grrotateMatrix = mat4.create();



    gl.useProgram(grshaderProgramObject);


    //akhilesh
    var Eye_AJ = new Float32Array([0.0, 0.0, 2.0]);
    var shininess_AJ = 2.50;
    var strength_AJ = parseFloat(5);
    var attenuation_AJ = parseFloat(0.50);
    var Ambient_AJ = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    var LightColor_AJ = new Float32Array([1.0, 1.0, 1.0]);
    var lightPosition_AJ = view;//new Float32Array([0.0, 1.0, -15 + val_AJ]);

    //lightPosition_AJ[2]=
    gl.uniform4fv(ASJ_ambientUniform_pointLight_roadside, Ambient_AJ);
    gl.uniform3fv(ASJ_lightColorUniform_pointLight_roadside, LightColor_AJ);
    gl.uniform3fv(ASJ_lightPositionUniform_pointLight_roadside, lightPosition_AJ);
    gl.uniform1f(ASJ_shininessUniform_pointLight_roadside, shininess_AJ);
    gl.uniform1f(ASJ_strengthUniform_pointLight_roadside, strength_AJ);
    gl.uniform3fv(ASJ_eyeDirectionUniform_pointLight_roadside, Eye_AJ);
    gl.uniform1f(ASJ_attenuationUniform_pointLight_roadside, attenuation_AJ);


    //************************************************************************************************ roadside ********************************************************
    //***************************************************************************************************************************************************************
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [grtransRoadsideX, grtransRoadsideY, grtransRoadsideZ]);
    mat4.rotateY(grrotateMatrix, grrotateMatrix, deg2rad(90.0));
    mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(grfangleX));
    mat4.scale(grscaleMatrix, grscaleMatrix, [12.0, 0.1, 0.1]);
    mat4.multiply(grtranslateMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);

    GRPushToStack(grmodelMatrix);

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniform, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniform, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniform, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureRoadside);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoRoadside);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    GRPopFromStack();

    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    //************************************************************************************************ roadside ********************************************************
    //***************************************************************************************************************************************************************
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-grtransRoadsideX, grtransRoadsideY, grtransRoadsideZ]);
    mat4.rotateY(grrotateMatrix, grrotateMatrix, deg2rad(90.0));
    mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(grfangleX));
    mat4.scale(grscaleMatrix, grscaleMatrix, [12.0, 0.1, 0.1]);
    mat4.multiply(grtranslateMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);

    GRPushToStack(grmodelMatrix);

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniform, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniform, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniform, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureRoadside);
    gl.uniform1i(grtextureSamplerUniform, 0);

    gl.bindVertexArray(grgVaoRoadside);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    GRPopFromStack();


    gl.useProgram(null);

}

function GRPushToStack(matrix) {
    if (grmatrixPosition == -1) {
        grstackMatrix.push(matrix);
        grmatrixPosition++;
        return matrix;
    }
    else {
        var topMatrix = grstackMatrix[grmatrixPosition];
        mat4.multiply(matrix, topMatrix, matrix);
        grstackMatrix.push(matrix);
        grmatrixPosition++;
        return grstackMatrix[grmatrixPosition];
    }

}

function GRPopFromStack() {
    if (!grstackMatrix[0]) {
        grstackMatrix[0] = mat4.create();
        return grstackMatrix[0];
    }
    else {
        grstackMatrix.pop();
        grmatrixPosition--;
        return grstackMatrix[grmatrixPosition];
    }

}


function GRUninitializeRoadside() {
    if (grgVaoRoadside) {
        gl.deleteVertexArray(grgVaoRoadside);
        grgVaoRoadside = null;
    }
    if (grgVboPositionRoadside) {
        gl.deleteBuffer(grgVboPositionRoadside);
        grgVboPositionRoadside = null;
    }
    if (grtextureRoadside) {
        gl.deleteTexture(grtextureRoadside);
        grtextureRoadside = null;
    }

    if (grshaderProgramObject) {
        if (grfragmentShaderObject) {
            gl.detachShader(grshaderProgramObject, grfragmentShaderObject);
            gl.deleteShader(grfragmentShaderObject);
            grfragmentShaderObject = null;
        }

        if (grfragmentShaderObject) {
            gl.detachShader(grshaderProgramObject, grvertexShaderObject);
            gl.deleteShader(grvertexShaderObject);
            grvertexShaderObject = null;
        }

        gl.deleteProgram(grshaderProgramObject);
        grshaderProgramObject = null;
    }
}












