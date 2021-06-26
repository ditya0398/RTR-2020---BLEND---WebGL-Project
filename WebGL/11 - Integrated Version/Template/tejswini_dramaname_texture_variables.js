var degrees;
var tvn_vertexShaderObject_drama;
var tvn_fragmentShaderObject_drama;
var tvn_shaderProgramObject_drama;

var tvn_vao_drama;
var tvn_vao_rectangle_drama;
var tvn_vbo_rectangle_drama;
var tvn_vbo_rectangle_tex_drama;
var tvn_pUniform_drama;
var tvn_vUniform_drama;
var tvn_mUniform_drama;
var tvn_distortion_uniform_drama;

var textureSamplerUniform_drama;

var tvn_trans_x_drama_main_1 = -5.0
var tvn_trans_x_drama_main_2 = 5.0
var tvn_trans_x_drama_main_3 = -5.0
var tvn_trans_x_drama_main_4 = 5.0
var tvn_trans_x_drama_main_5 = -5.0
var tvn_trans_x_drama_main_6 = 5.0
var tvn_trans_y_drama_main_1 = 0.0
var tvn_trans_y_drama_main_2 = 0.0
var tvn_trans_y_drama_main_3 = 0.0
var tvn_trans_y_drama_main_4 = 0.0
var tvn_trans_y_drama_main_5 = 0.0
var tvn_trans_y_drama_main_6 = 0.0
var tvn_trans_z_drama_main_1 = 1.4
var tvn_trans_z_drama_main_2 = 1.4
var tvn_trans_z_drama_main_3 = 1.4
var tvn_trans_z_drama_main_4 = 1.4
var tvn_trans_z_drama_main_5 = 1.4
var tvn_trans_z_drama_main_6 = 1.4
var tvn_scale_drama_Main_1 = 1.0
var tvn_scale_drama_Main_2 = 1.0
var tvn_scale_drama_Main_3 = 1.0
var tvn_scale_drama_Main_4 = 1.0
var tvn_scale_drama_Main_5 = 1.0
var tvn_scale_drama_Main_6 = 1.0
var drama_texture_1;
var drama_texture_2;
var drama_texture_3;
var drama_texture_4;
var drama_texture_5;

function tvn_drama_init() {
    //vertex shader 
    var vertexShaderSourcedCode =
        "#version 300 es" +
        "\n" +
        "in vec4 vPosition;" +
        "in vec2 vTexCoord;" +

        "uniform mat4 u_p_matrix;" +
        "uniform mat4 u_v_matrix;" +
        "uniform mat4 u_m_matrix;" +
        "out vec4 out_color;" +
        "out vec2 tex_coord;" +
        "void main(void)" +
        "{" +
        "gl_Position = u_p_matrix * u_v_matrix * u_m_matrix * vPosition;" +
        "tex_coord = vec2(vTexCoord.x, vTexCoord.y);" +
        
        "}";

    tvn_vertexShaderObject_drama = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(tvn_vertexShaderObject_drama, vertexShaderSourcedCode);
    gl.compileShader(tvn_vertexShaderObject_drama);
    if (gl.getShaderParameter(tvn_vertexShaderObject_drama, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_vertexShaderObject_drama);
        if (error.length > 0) {
            alert(error);
            tvn_uninit_drama();
        }
    }

    //fragemnt shader
    var fragmentShaderSourceCode =
        "#version 300 es" +
        "\n" +
        "precision highp float;" +
        "uniform sampler2D u_texture_sampler;" +
        "uniform float distortion;" +
        "in vec2 tex_coord;" +
        "out vec4 FragColor;" +
        "void main(void)" +
        "{" +
        "FragColor = texture(u_texture_sampler,tex_coord);" +
        "vec3 gray = vec3(dot(vec3(FragColor), vec3(0.2126, 0.7152, 0.0722)));" +
		"FragColor = vec4(mix(vec3(FragColor), gray, distortion), 1.0);" +
        "}";

    tvn_fragmentShaderObject_drama = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(tvn_fragmentShaderObject_drama, fragmentShaderSourceCode);
    gl.compileShader(tvn_fragmentShaderObject_drama);
    if (gl.getShaderParameter(tvn_fragmentShaderObject_drama, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_fragmentShaderObject_drama);
        if (error.length > 0) {
            alert(error);
            tvn_uninit_drama();
        }
    }

    //shader program 
    tvn_shaderProgramObject_drama = gl.createProgram();
    gl.attachShader(tvn_shaderProgramObject_drama, tvn_vertexShaderObject_drama);
    gl.attachShader(tvn_shaderProgramObject_drama, tvn_fragmentShaderObject_drama);

    //pre-link binding of shader program object with vertex shader attributes
    gl.bindAttribLocation(tvn_shaderProgramObject_drama, macros.AMC_ATTRIB_POSITION, "vPosition");
    gl.bindAttribLocation(tvn_shaderProgramObject_drama, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord");
    

    //linking 
    gl.linkProgram(tvn_shaderProgramObject_drama);
    if (!gl.getProgramParameter(tvn_shaderProgramObject_drama, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(tvn_shaderProgramObject_drama);
        if (error.length > 0) {
            alert(error);
            tvn_uninit_drama();
        }
    }

    //get MVP uniform location
    tvn_pUniform_drama = gl.getUniformLocation(tvn_shaderProgramObject_drama, "u_p_matrix");
    tvn_vUniform_drama = gl.getUniformLocation(tvn_shaderProgramObject_drama, "u_v_matrix");
    tvn_mUniform_drama = gl.getUniformLocation(tvn_shaderProgramObject_drama, "u_m_matrix");
    textureSamplerUniform_drama = gl.getUniformLocation(tvn_shaderProgramObject_drama, "u_texture_sampler");
    tvn_distortion_uniform_drama = gl.getUniformLocation(tvn_shaderProgramObject_drama, "distortion");

    // ** vertices , color , shader attribs, vbo initialization***

    var squareVertices = new Float32Array([
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,

        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,

        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,

        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,

        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,

        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0
    ]);

    var texCoord = new Float32Array([
        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ])

    /***********************rectangle position**********************************/
    tvn_vao_rectangle_drama = gl.createVertexArray();
    gl.bindVertexArray(tvn_vao_rectangle_drama);

    tvn_vbo_rectangle_drama = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_rectangle_drama);
    gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION,
        3, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    
    tvn_vbo_rectangle_tex_drama = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_rectangle_tex_drama);
    gl.bufferData(gl.ARRAY_BUFFER, texCoord, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD,
        2, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);




    drama_texture_1 = gl.createTexture();
    drama_texture_1.image = new Image();
    drama_texture_1.image.src = "Tejswini_Resources/natak_1.jpg";

    drama_texture_1.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, drama_texture_1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drama_texture_1.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }


    drama_texture_2 = gl.createTexture();
    drama_texture_2.image = new Image();
    drama_texture_2.image.src = "Tejswini_Resources/natak_2.jpg";

    drama_texture_2.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, drama_texture_2);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drama_texture_2.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    drama_texture_3 = gl.createTexture();
    drama_texture_3.image = new Image();
    drama_texture_3.image.src = "Tejswini_Resources/natak_3.jpg";

    drama_texture_3.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, drama_texture_3);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drama_texture_3.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    drama_texture_4 = gl.createTexture();
    drama_texture_4.image = new Image();
    drama_texture_4.image.src = "Tejswini_Resources/natak_4.jpg";

    drama_texture_4.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, drama_texture_4);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drama_texture_4.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    drama_texture_5 = gl.createTexture();
    drama_texture_5.image = new Image();
    drama_texture_5.image.src = "Tejswini_Resources/natak_5.jpg";

    drama_texture_5.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, drama_texture_5);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drama_texture_5.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }


    drama_texture_6 = gl.createTexture();
    drama_texture_6.image = new Image();
    drama_texture_6.image.src = "Tejswini_Resources/natak_6.jpg";

    drama_texture_6.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, drama_texture_6);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drama_texture_6.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

function tvn_drama_draw() {

    gl.useProgram(tvn_shaderProgramObject_drama);

    var modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [tvn_trans_x_drama_main_1, tvn_trans_y_drama_main_1, tvn_trans_z_drama_main_1]);//resulting matrix, act on the matrix, open square bracket
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_drama_Main_1, tvn_scale_drama_Main_1, tvn_scale_drama_Main_1])

    gl.uniformMatrix4fv(tvn_mUniform_drama, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_vUniform_drama, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_pUniform_drama, false, perspectiveMatrix);

    gl.uniform1f(tvn_distortion_uniform_drama, blackWhiteDistortion)

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, drama_texture_1);
    gl.uniform1i(textureSamplerUniform_drama, 0);

    gl.bindVertexArray(tvn_vao_rectangle_drama);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    

    /********natak_2***********/
    modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [tvn_trans_x_drama_main_2, tvn_trans_y_drama_main_2, tvn_trans_z_drama_main_2]);//resulting matrix, act on the matrix, open square bracket
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_drama_Main_2, tvn_scale_drama_Main_2, tvn_scale_drama_Main_2])

    gl.uniformMatrix4fv(tvn_mUniform_drama, false, modelMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, drama_texture_2);
    gl.uniform1i(textureSamplerUniform_drama, 0);

    gl.bindVertexArray(tvn_vao_rectangle_drama);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    
/*********************************/


    /********natak_3***********/
    modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [tvn_trans_x_drama_main_3, tvn_trans_y_drama_main_3, tvn_trans_z_drama_main_3]);//resulting matrix, act on the matrix, open square bracket
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_drama_Main_3, tvn_scale_drama_Main_3, tvn_scale_drama_Main_3])

    gl.uniformMatrix4fv(tvn_mUniform_drama, false, modelMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, drama_texture_3);
    gl.uniform1i(textureSamplerUniform_drama, 0);

    gl.bindVertexArray(tvn_vao_rectangle_drama);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

/*********************************/

    /********natak_4***********/
    modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [tvn_trans_x_drama_main_4, tvn_trans_y_drama_main_4, tvn_trans_z_drama_main_4]);//resulting matrix, act on the matrix, open square bracket
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_drama_Main_4, tvn_scale_drama_Main_4, tvn_scale_drama_Main_4])

    gl.uniformMatrix4fv(tvn_mUniform_drama, false, modelMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, drama_texture_4);
    gl.uniform1i(textureSamplerUniform_drama, 0);

    gl.bindVertexArray(tvn_vao_rectangle_drama);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

/*********************************/

    /********natak_5***********/
    modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [tvn_trans_x_drama_main_5, tvn_trans_y_drama_main_5, tvn_trans_z_drama_main_5]);//resulting matrix, act on the matrix, open square bracket
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_drama_Main_5, tvn_scale_drama_Main_5, tvn_scale_drama_Main_5])

    gl.uniformMatrix4fv(tvn_mUniform_drama, false, modelMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, drama_texture_5);
    gl.uniform1i(textureSamplerUniform_drama, 0);

    gl.bindVertexArray(tvn_vao_rectangle_drama);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

/*********************************/

    /********natak_6***********/
    modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [tvn_trans_x_drama_main_6, tvn_trans_y_drama_main_6, tvn_trans_z_drama_main_6]);//resulting matrix, act on the matrix, open square bracket
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_drama_Main_6, tvn_scale_drama_Main_6, tvn_scale_drama_Main_6])

    gl.uniformMatrix4fv(tvn_mUniform_drama, false, modelMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, drama_texture_6);
    gl.uniform1i(textureSamplerUniform_drama, 0);

    gl.bindVertexArray(tvn_vao_rectangle_drama);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

/*********************************/

    gl.bindVertexArray(null);

    gl.useProgram(null);
}


function tvn_uninit_drama() {
    if (tvn_vao_drama) {
        gl.deleteVertexArary(tvn_vao_drama);
        tvn_vao_drama = null;
    }

    if (tvn_vbo) {
        gl.deleteBuffer(tvn_vbo);
        tvn_vbo = null;
    }

    if (tvn_shaderProgramObject_drama) {
        if (tvn_fragmentShaderObject_drama) {
            gl.detachShader(tvn_shaderProgramObject_drama, tvn_fragmentShaderObject_drama);
            gl.deleteShader(tvn_fragmentShaderObject_drama);
            tvn_fragmentShaderObject_drama = null;
        }

        if (tvn_vertexShaderObject_drama) {
            gl.detachShader(tvn_shaderProgramObject_drama, tvn_vertexShaderObject_drama);
            gl.deleteShader(tvn_vertexShaderObject_drama);
            tvn_vertexShaderObject_drama = null;
        }

        gl.deleteProgram(tvn_shaderProgramObject_drama);
        tvn_shaderProgramObject_drama = null;
    }
}