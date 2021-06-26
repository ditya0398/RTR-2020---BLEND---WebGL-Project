var degrees;
var tvn_vertexShaderObject_script;
var tvn_fragmentShaderObject_script;
var tvn_shaderProgramObject_script;

var tvn_vao_script;
var tvn_vao_rectangle_script;
var tvn_vbo_rectangle_script;
var tvn_vbo_rectangle_tex_script;
var tvn_pUniform;
var tvn_vUniform;
var tvn_mUniform;
var rangle = 0.0;
var script_texture;

var tvn_trans_x_script_main = -14.95
var tvn_trans_y_script_main = -0.9
var tvn_trans_z_script_main = -26.3
var tvn_scale_script_main = 2.35

function tvn_script_init() {
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

    tvn_vertexShaderObject_script = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(tvn_vertexShaderObject_script, vertexShaderSourcedCode);
    gl.compileShader(tvn_vertexShaderObject_script);
    if (gl.getShaderParameter(tvn_vertexShaderObject_script, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_vertexShaderObject_script);
        if (error.length > 0) {
            alert(error);
            tvn_uninit_script();
        }
    }

    //fragemnt shader
    var fragmentShaderSourceCode =
        "#version 300 es" +
        "\n" +
        "precision highp float;" +
        "uniform sampler2D u_texture_sampler;" +
        "in vec2 tex_coord;" +
        "out vec4 FragColor;" +
        "void main(void)" +
        "{" +
        "FragColor = texture(u_texture_sampler,tex_coord);" +
        "}";

    tvn_fragmentShaderObject_script = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(tvn_fragmentShaderObject_script, fragmentShaderSourceCode);
    gl.compileShader(tvn_fragmentShaderObject_script);
    if (gl.getShaderParameter(tvn_fragmentShaderObject_script, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_fragmentShaderObject_script);
        if (error.length > 0) {
            alert(error);
            tvn_uninit_script();
        }
    }

    //shader program 
    tvn_shaderProgramObject_script = gl.createProgram();
    gl.attachShader(tvn_shaderProgramObject_script, tvn_vertexShaderObject_script);
    gl.attachShader(tvn_shaderProgramObject_script, tvn_fragmentShaderObject_script);

    //pre-link binding of shader program object with vertex shader attributes
    gl.bindAttribLocation(tvn_shaderProgramObject_script, macros.AMC_ATTRIB_POSITION, "vPosition");
    gl.bindAttribLocation(tvn_shaderProgramObject_script, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord");
    

    //linking 
    gl.linkProgram(tvn_shaderProgramObject_script);
    if (!gl.getProgramParameter(tvn_shaderProgramObject_script, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(tvn_shaderProgramObject_script);
        if (error.length > 0) {
            alert(error);
            tvn_uninit_script();
        }
    }

    //get MVP uniform location
    tvn_pUniform = gl.getUniformLocation(tvn_shaderProgramObject_script, "u_p_matrix");
    tvn_vUniform = gl.getUniformLocation(tvn_shaderProgramObject_script, "u_v_matrix");
    tvn_mUniform = gl.getUniformLocation(tvn_shaderProgramObject_script, "u_m_matrix");
    textureSamplerUniform = gl.getUniformLocation(tvn_shaderProgramObject_script, "u_texture_sampler");

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
    tvn_vao_rectangle_script = gl.createVertexArray();
    gl.bindVertexArray(tvn_vao_rectangle_script);

    tvn_vbo_rectangle_script = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_rectangle_script);
    gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION,
        3, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    
    tvn_vbo_rectangle_tex_script = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_rectangle_tex_script);
    gl.bufferData(gl.ARRAY_BUFFER, texCoord, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD,
        2, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);


    script_texture = gl.createTexture();
    script_texture.image = new Image();
    script_texture.image.src = "Tejswini_Resources/script.png";

    script_texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, script_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, script_texture.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }


}

function tvn_script_draw() {

    gl.useProgram(tvn_shaderProgramObject_script);

    var modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [tvn_trans_x_script_main, tvn_trans_y_script_main, tvn_trans_z_script_main]);//resulting matrix, act on the matrix, open square bracket
    mat4.scale(modelMatrix, modelMatrix, [tvn_scale_script_main, tvn_scale_script_main, tvn_scale_script_main])

    gl.uniformMatrix4fv(tvn_mUniform, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_vUniform, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_pUniform, false, perspectiveMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, script_texture);
    gl.uniform1i(textureSamplerUniform, 0);

    gl.bindVertexArray(tvn_vao_rectangle_script);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);


    gl.useProgram(null);
}


function tvn_uninit_script() {
    if (tvn_vao_script) {
        gl.deleteVertexArary(tvn_vao_script);
        tvn_vao_script = null;
    }

    if (tvn_vbo) {
        gl.deleteBuffer(tvn_vbo);
        tvn_vbo = null;
    }

    if (tvn_shaderProgramObject_script) {
        if (tvn_fragmentShaderObject_script) {
            gl.detachShader(tvn_shaderProgramObject_script, tvn_fragmentShaderObject_script);
            gl.deleteShader(tvn_fragmentShaderObject_script);
            tvn_fragmentShaderObject_script = null;
        }

        if (tvn_vertexShaderObject_script) {
            gl.detachShader(tvn_shaderProgramObject_script, tvn_vertexShaderObject_script);
            gl.deleteShader(tvn_vertexShaderObject_script);
            tvn_vertexShaderObject_script = null;
        }

        gl.deleteProgram(tvn_shaderProgramObject_script);
        tvn_shaderProgramObject_script = null;
    }
}