var tvn_vertexShaderObject_tripod;
var tvn_fragmentShaderObject_tripod;
var tvn_shaderProgramObject_tripod;
var textureSamplerUniform_tripod;

var tvn_vao_tripod;
var tvn_vbo_tripod;
var tvn_vbo_color;
var tvn_distortion_uniform_tripod;
var angle1;
var vertices = new Float32Array(37680);
var radius = 0.04;
var i = 0;
var stack = [];
var index = -1;
var tvn_modelMatrix_tripod;
var tvn_viewMatrix_tripod;
var tvn_projectionMatrix_tripod;

var tvn_tripod_texture

var tvn_trans_x_tripod = 2.8
var tvn_trans_y_tripod = -0.7
var tvn_trans_z_tripod = -6.1

var tvn_trans_x_script = -6.2
var tvn_trans_y_script = -0.5
var tvn_trans_z_script = -9.9

function tvn_init_tripod() {
    /*************Cylinder **********************/
    for (angle1 = 0.0; angle1 < 2 * 3.14; angle1 = angle1 + 0.001) {
        vertices[i++] = (Math.cos(angle1) * radius);
        vertices[i++] = (1.0);
        vertices[i++] = (Math.sin(angle1) * radius);

        vertices[i++] = (Math.cos(angle1) * radius);
        vertices[i++] = -1.0;
        vertices[i++] = (Math.sin(angle1) * radius);

    }

    console.log("vertices " + vertices.length);
    console.log("vertices[i] " + i);
    //vertex shade
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

    tvn_vertexShaderObject_tripod = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(tvn_vertexShaderObject_tripod, vertexShaderSourcedCode);
    gl.compileShader(tvn_vertexShaderObject_tripod);
    if (gl.getShaderParameter(tvn_vertexShaderObject_tripod, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_vertexShaderObject_tripod);
        if (error.length > 0) {
            alert(error);
            uninitialize();
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

    tvn_fragmentShaderObject_tripod = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(tvn_fragmentShaderObject_tripod, fragmentShaderSourceCode);
    gl.compileShader(tvn_fragmentShaderObject_tripod);
    if (gl.getShaderParameter(tvn_fragmentShaderObject_tripod, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_fragmentShaderObject_tripod);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
    }

    //shader program 
    tvn_shaderProgramObject_tripod = gl.createProgram();
    gl.attachShader(tvn_shaderProgramObject_tripod, tvn_vertexShaderObject_tripod);
    gl.attachShader(tvn_shaderProgramObject_tripod, tvn_fragmentShaderObject_tripod);

    //pre-link binding of shader program object with vertex shader attributes
    gl.bindAttribLocation(tvn_shaderProgramObject_tripod, macros.AMC_ATTRIB_POSITION, "vPosition");


    //linking 
    gl.linkProgram(tvn_shaderProgramObject_tripod);
    if (!gl.getProgramParameter(tvn_shaderProgramObject_tripod, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(tvn_shaderProgramObject_tripod);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
    }

    //get MVP uniform location

    textureSamplerUniform_tripod = gl.getUniformLocation(tvn_shaderProgramObject_tripod, "u_texture_sampler");
    tvn_modelMatrix_tripod = gl.getUniformLocation(tvn_shaderProgramObject_tripod, "model_matrix");
    tvn_viewMatrix_tripod = gl.getUniformLocation(tvn_shaderProgramObject_tripod, "view_matrix");
    tvn_projectionMatrix_tripod = gl.getUniformLocation(tvn_shaderProgramObject_tripod, "projection_matrix");
    tvn_distortion_uniform_tripod = gl.getUniformLocation(tvn_shaderProgramObject_tripod, "distortion");

    tvn_vao_tripod = gl.createVertexArray();
    gl.bindVertexArray(tvn_vao_tripod);

    /*************position*****************************/
    tvn_vbo_tripod = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_tripod);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION,
        3, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    gl.bindVertexArray(null);


    tvn_tripod_texture = gl.createTexture();
    blackTex = new Uint8Array(
        [10, 10, 10, 255]
    )
    gl.bindTexture(gl.TEXTURE_2D, tvn_tripod_texture);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, blackTex);
    gl.bindTexture(gl.TEXTURE_2D, null);

}




function stackpush(matrix) {
    var prevMatrix;
    console.log("push" + matrix);
    if (index < 0) {
        stack.push(matrix);
        index++;
        return matrix;
    }
    else {
        prevMatrix = stack[index];
        stack.push(mat4.multiply(matrix, prevMatrix, matrix));
        index++;
        return matrix;
    }

}

function stackpop() {
    if (!stack[0]) {
        stack[0] = mat4.create();
        return stack[0];
    }

    else {
        stack.pop(index--);
        return stack[index];
    }

}


function tvn_tripod_draw() {
    var rCylinderx = 0.38;
    var rCylindery = 1.0;


    gl.useProgram(tvn_shaderProgramObject_tripod);

    gl.uniform1f(tvn_distortion_uniform_tripod, blackWhiteDistortion)

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tvn_tripod_texture);
    gl.uniform1i(textureSamplerUniform_tripod, 0);


    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotateMatrix = mat4.create();


    //console.log("draww" + modelMatrix);
    modelMatrix = stackpush(modelMatrix);

    mat4.translate(translateMatrix, translateMatrix, [grtransMicX, grtransMicY, grtransMicZ]);//resulting matrix, act on the matrix, open square bracket

    //console.log("second" + modelMatrix);
    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.scale(modelMatrix, modelMatrix, [grscale, grscale, grscale])
    modelMatrix = stackpush(modelMatrix); // -4
    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);
    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);


    gl.bindVertexArray(tvn_vao_tripod);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);



    /***********************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [rCylinderx, -rCylindery, 0.0]);//resulting matrix, act on the matrix, open square bracket
    //console.log("second cyl " + modelViewMatrix);
    mat4.rotateZ(rotateMatrix, rotateMatrix, deg2rad(20));


    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);


    modelMatrix = stackpush(modelMatrix);
    stackpop();

    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);



    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);

    /*******************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();
    modelViewMatrix = mat4.create();


    mat4.translate(translateMatrix, translateMatrix, [-rCylinderx, -rCylindery, 0.0]);//resulting matrix, act on the matrix, open square bracket
    mat4.rotateZ(rotateMatrix, rotateMatrix, deg2rad(-20));

    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);


    modelMatrix = stackpush(modelMatrix);
    stackpop();

    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);


    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);


    // modelViewMatrix = stack.pop();

    stackpop();
    stackpop();


    //Camera Tripod

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tvn_tripod_texture);
    gl.uniform1i(textureSamplerUniform_tripod, 0);


    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();


    //console.log("draww" + modelMatrix);
    modelMatrix = stackpush(modelMatrix);

    mat4.translate(translateMatrix, translateMatrix, [tvn_trans_x_tripod, tvn_trans_y_tripod, tvn_trans_z_tripod]);//resulting matrix, act on the matrix, open square bracket

    //console.log("second" + modelMatrix);
    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.scale(modelMatrix, modelMatrix, [grscale, grscale, grscale])
    modelMatrix = stackpush(modelMatrix); // -4
    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);
    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);


    gl.bindVertexArray(tvn_vao_tripod);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);



    /***********************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [rCylinderx, -rCylindery, 0.0]);//resulting matrix, act on the matrix, open square bracket
    //console.log("second cyl " + modelViewMatrix);
    mat4.rotateZ(rotateMatrix, rotateMatrix, deg2rad(20));


    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);


    modelMatrix = stackpush(modelMatrix);
    stackpop();

    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);



    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);

    /*******************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();
    modelViewMatrix = mat4.create();


    mat4.translate(translateMatrix, translateMatrix, [-rCylinderx, -rCylindery, 0.0]);//resulting matrix, act on the matrix, open square bracket
    mat4.rotateZ(rotateMatrix, rotateMatrix, deg2rad(-20));

    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);


    modelMatrix = stackpush(modelMatrix);
    stackpop();

    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);


    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);


    // modelViewMatrix = stack.pop();

    stackpop();
    stackpop();


    //Script Tripod
    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotateMatrix = mat4.create();


    //console.log("draww" + modelMatrix);
    modelMatrix = stackpush(modelMatrix);

    mat4.translate(translateMatrix, translateMatrix, [tvn_trans_x_script, tvn_trans_y_script, tvn_trans_z_script]);//resulting matrix, act on the matrix, open square bracket

    //console.log("second" + modelMatrix);
    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.scale(modelMatrix, modelMatrix, [grscale, grscale, grscale])
    modelMatrix = stackpush(modelMatrix); // -4
    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);
    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);


    gl.bindVertexArray(tvn_vao_tripod);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);



    /***********************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [rCylinderx, -rCylindery, 0.0]);//resulting matrix, act on the matrix, open square bracket
    //console.log("second cyl " + modelViewMatrix);
    mat4.rotateZ(rotateMatrix, rotateMatrix, deg2rad(20));


    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);


    modelMatrix = stackpush(modelMatrix);
    stackpop();

    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);



    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);

    /*******************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();
    modelViewMatrix = mat4.create();


    mat4.translate(translateMatrix, translateMatrix, [-rCylinderx, -rCylindery, 0.0]);//resulting matrix, act on the matrix, open square bracket
    mat4.rotateZ(rotateMatrix, rotateMatrix, deg2rad(-20));

    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);


    modelMatrix = stackpush(modelMatrix);
    stackpop();

    gl.uniformMatrix4fv(tvn_modelMatrix_tripod, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix_tripod, false, gViewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix_tripod, false, projectionMatrix);


    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);


    // modelViewMatrix = stack.pop();

    stackpop();
    stackpop();


    //   gl.bindVertexArray(null);
    gl.bindVertexArray(null);
    gl.useProgram(null);


}


function tvn_tripod_uninit() {
    if (tvn_vao_tripod) {
        gl.deleteVertexArary(tvn_vao_tripod);
        tvn_vao_tripod = null;
    }

    if (tvn_vbo_tripod) {
        gl.deleteBuffer(tvn_vbo_tripod);
        tvn_vbo_tripod = null;
    }

    if (tvn_shaderProgramObject_tripod) {
        if (tvn_fragmentShaderObject_tripod) {
            gl.detachShader(tvn_shaderProgramObject_tripod, tvn_fragmentShaderObject_tripod);
            gl.deleteShader(tvn_fragmentShaderObject_tripod);
            tvn_fragmentShaderObject_tripod = null;
        }

        if (tvn_vertexShaderObject_tripod) {
            gl.detachShader(tvn_shaderProgramObject_tripod, tvn_vertexShaderObject_tripod);
            gl.deleteShader(tvn_vertexShaderObject_tripod);
            tvn_vertexShaderObject_tripod = null;
        }

        gl.deleteProgram(tvn_shaderProgramObject_tripod);
        tvn_shaderProgramObject_tripod = null;
    }
}