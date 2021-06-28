var tvn_vertexShaderObject_speaker;
var tvn_fragmentShaderObject_speaker;
var tvn_shaderProgramObject_speaker;
var textureSamplerUniform_speaker;
var tvn_distortion_uniform_speaker;

var tvn_vao_speaker;
var tvn_vbo_speaker;
var tvn_vao_rectangle_speaker;
var tvn_vbo_rectangle_speaker;
var tvn_vbo_tex_coord_speaker;
var tvn_projectionMatrix_speaker;
var tvn_modelMatrix_speaker;
var tvn_viewMatrix_speaker;

var tvn_trans_x_speaker = 21.4
var tvn_trans_y_speaker = -3.9
var tvn_trans_z_speaker = -24.3
var tvn_scale_speaker = 1.52

var speaker_texture

var tvn_vao_rectangle_Speaker;

function tvn_speaker_init() {
    //vertex shader 
    var vertexShaderSourcedCode =
        "#version 300 es" +
        "\n" +
        "in vec4 vPosition;" +
        "in vec2 vtexcoord;" +
        "uniform mat4 model_matrix;" +
        "uniform mat4 view_matrix;" +
        "uniform mat4 projection_matrix;" +
        "out vec2 out_tex_coord;" +
        "void main(void)" +
        "{" +
        "gl_Position = projection_matrix * view_matrix * model_matrix * vPosition;" +
        "out_tex_coord = vtexcoord;" +

        "}";

    tvn_vertexShaderObject_speaker = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(tvn_vertexShaderObject_speaker, vertexShaderSourcedCode);
    gl.compileShader(tvn_vertexShaderObject_speaker);
    if (gl.getShaderParameter(tvn_vertexShaderObject_speaker, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_vertexShaderObject_speaker);
        if (error.length > 0) {
            alert(error);
            tvn_speaker_uninit();
        }
    }

    //fragemnt shader
    var fragmentShaderSourceCode =
        "#version 300 es" +
        "\n" +
        "precision highp float;" +
        "in vec2 out_tex_coord;" +
        "uniform sampler2D u_texture_sampler;" +
        "uniform float distortion;" +
        "out vec4 FragColor;" +
        "void main(void)" +
        "{" +
        "FragColor = texture(u_texture_sampler, out_tex_coord);" +
        "vec3 gray = vec3(dot(vec3(FragColor), vec3(0.2126, 0.7152, 0.0722)));" +
		"FragColor = vec4(mix(vec3(FragColor), gray, distortion), 1.0);" +
        "}";

    tvn_fragmentShaderObject_speaker = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(tvn_fragmentShaderObject_speaker, fragmentShaderSourceCode);
    gl.compileShader(tvn_fragmentShaderObject_speaker);
    if (gl.getShaderParameter(tvn_fragmentShaderObject_speaker, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_fragmentShaderObject_speaker);
        if (error.length > 0) {
            alert(error);
            tvn_speaker_uninit();
        }
    }

    //shader program 
    tvn_shaderProgramObject_speaker = gl.createProgram();
    gl.attachShader(tvn_shaderProgramObject_speaker, tvn_vertexShaderObject_speaker);
    gl.attachShader(tvn_shaderProgramObject_speaker, tvn_fragmentShaderObject_speaker);

    //pre-link binding of shader program object with vertex shader attributes
    gl.bindAttribLocation(tvn_shaderProgramObject_speaker, macros.AMC_ATTRIB_POSITION, "vPosition");
    gl.bindAttribLocation(tvn_shaderProgramObject_speaker, macros.AMC_ATTRIB_TEXCOORD, "vtexcoord");


    //linking 
    gl.linkProgram(tvn_shaderProgramObject_speaker);
    if (!gl.getProgramParameter(tvn_shaderProgramObject_speaker, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(tvn_shaderProgramObject_speaker);
        if (error.length > 0) {
            alert(error);
            tvn_speaker_uninit();
        }
    }


    //get MVP uniform location
    tvn_projectionMatrix_speaker = gl.getUniformLocation(tvn_shaderProgramObject_speaker, "projection_matrix");
    tvn_viewMatrix_speaker = gl.getUniformLocation(tvn_shaderProgramObject_speaker, "view_matrix");
    tvn_modelMatrix_speaker = gl.getUniformLocation(tvn_shaderProgramObject_speaker, "model_matrix");
    textureSamplerUniform_speaker = gl.getUniformLocation(tvn_shaderProgramObject_speaker, "u_texture_sampler");
    tvn_distortion_uniform_speaker = gl.getUniformLocation(tvn_shaderProgramObject_speaker, "distortion");

    // ** vertices , color , shader attribs, vbo initialization***

    var squareVertices = new Float32Array([
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
        // 2
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

    var cubeTexCoord = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,

        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,

        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,

        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,

        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,
        0.0, 0.0,

    ]);










    /***********************rectangle position**********************************/
    tvn_vao_rectangle_Speaker = gl.createVertexArray();
    gl.bindVertexArray(tvn_vao_rectangle_Speaker);

    tvn_vbo_rectangle_speaker = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_rectangle_speaker);
    gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION,
        3, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIB_POSITION); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    /**************************************************************/
    tvn_vbo_tex_coord_speaker = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_tex_coord_speaker);
    gl.bufferData(gl.ARRAY_BUFFER, cubeTexCoord, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    /*******************************************************************/
    speaker_texture = gl.createTexture();
    speaker_texture.image = new Image();
    speaker_texture.image.src = "Tejswini_Resources/speaker.png";

    speaker_texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, speaker_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, speaker_texture.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

    }

}


function tvn_speaker_draw() {
    gl.useProgram(tvn_shaderProgramObject_speaker);

    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotateMatrix = mat4.create();

    gl.uniform1f(tvn_distortion_uniform_speaker, blackWhiteDistortion)

    mat4.translate(translateMatrix, translateMatrix, [-tvn_trans_x_speaker, tvn_trans_y_speaker, tvn_trans_z_speaker]);//resulting matrix, act on the matrix, open square bracket
    mat4.rotateY(rotateMatrix, rotateMatrix, deg2rad(45));

    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_speaker, tvn_scale_speaker, tvn_scale_speaker])

    mat4.multiply(projectionMatrix, projectionMatrix, perspectiveMatrix);
    gl.uniformMatrix4fv(tvn_modelMatrix_speaker, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_speaker, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_speaker, false, projectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, speaker_texture);
    gl.uniform1i(textureSamplerUniform_speaker, 0);


    gl.bindVertexArray(tvn_vao_rectangle_Speaker);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    mat4.translate(modelMatrix, modelMatrix, [0.0, 2.0, 0.0])
    gl.bindTexture(gl.TEXTURE_2D, speaker_texture);
    gl.uniformMatrix4fv(tvn_modelMatrix_speaker, false, modelMatrix);
    gl.bindVertexArray(tvn_vao_rectangle);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    /********************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();


    mat4.translate(translateMatrix, translateMatrix, [tvn_trans_x_speaker, tvn_trans_y_speaker, tvn_trans_z_speaker]);//resulting matrix, act on the matrix, open square bracket
    mat4.rotateY(rotateMatrix, rotateMatrix, deg2rad(-45));



    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_speaker, tvn_scale_speaker, tvn_scale_speaker])
    
    mat4.multiply(projectionMatrix, projectionMatrix, perspectiveMatrix);
    gl.uniformMatrix4fv(tvn_modelMatrix_speaker, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_speaker, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_speaker, false, projectionMatrix);

    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, speaker_texture);
    gl.uniform1i(textureSamplerUniform_speaker, 0);


    gl.bindVertexArray(tvn_vao_rectangle_Speaker);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    mat4.translate(modelMatrix, modelMatrix, [0.0, 2.0, 0.0])
    gl.bindTexture(gl.TEXTURE_2D, speaker_texture);
    gl.uniformMatrix4fv(tvn_modelMatrix_speaker, false, modelMatrix);
    gl.bindVertexArray(tvn_vao_rectangle_Speaker);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.useProgram(null);

}


function tvn_speaker_uninit() {
    if (tvn_vao_speaker) {
        gl.deleteVertexArary(tvn_vao_speaker);
        tvn_vao_speaker = null;
    }

    if (tvn_vbo_speaker) {
        gl.deleteBuffer(tvn_vbo_speaker);
        tvn_vbo_speaker = null;
    }

    if (tvn_shaderProgramObject_speaker) {
        if (tvn_fragmentShaderObject_speaker) {
            gl.detachShader(tvn_shaderProgramObject_speaker, tvn_fragmentShaderObject_speaker);
            gl.deleteShader(tvn_fragmentShaderObject_speaker);
            tvn_fragmentShaderObject_speaker = null;
        }

        if (tvn_vertexShaderObject_speaker) {
            gl.detachShader(tvn_shaderProgramObject_speaker, tvn_vertexShaderObject_speaker);
            gl.deleteShader(tvn_vertexShaderObject_speaker);
            tvn_vertexShaderObject_speaker = null;
        }

        gl.deleteProgram(tvn_shaderProgramObject_speaker);
        tvn_shaderProgramObject_speaker = null;
    }
}