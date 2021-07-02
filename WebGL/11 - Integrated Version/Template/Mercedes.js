var materials_ModelLoading_Merc;

var material_modelLoading_Merc;
var samplerUniform_modelLoading__Merc;

var gParts_Table_Merc;

var gParts_Teapot_Merc;


var vertexShaderObject_modelLoading_Merc;
var fragmentShaderObject_modelLoading_Merc;



var gAngleTriangle_modelLoading_Merc=0.0;
var gAngleSquare_modelLoading_Merc=0.0;
var perspectiveProjectionMatrix_modelLoading;


var modelUniform_modelLoading_Merc, viewUniform_modelLoading_Merc, projectionUniform_modelLoading_Merc,cameraPosUniform_Merc;
var LightPositionUniform_modelLoading_Merc, LKeyPressed_modelLoading_Merc ;
var LAUniform_modelLoading_Merc, LDUniform_modelLoading_Merc, LSUniform_modelLoading_Merc;
var KAUniform_modelLoading_Merc, KDUniform_modelLoading_Merc, KSUniform_modelLoading_Merc, MaterialShininessUniform_modelLoading_Merc;
var gbLighting_modelLoading_Merc=true;
//var perspectiveProjectionMatrix_modelLoading;
var light_ambient_modelLoading_Merc = [0.0, 0.0, 0.0];
var light_diffuse_modelLoading_Merc = [1.0, 1.0, 1.0];
var light_specular_modelLoading_Merc = [1.0, 1.0, 1.0];
var light_position_modelLoading_Merc = [100.0, 100.0, 100.0,1.0];
	
var material_ambient_modelLoading_Merc = [0.0, 0.0, 0.0];
var material_diffuse_modelLoading_Merc = [1.0, 1.0, 1.0];
var material_specular_modelLoading_Merc = [1.0, 1.0, 1.0];
	
var material_shininess_modelLoading_Merc = 50.0;
var sphere_modelLoading_Merc=null;

var transY_Merc = 0.0;

var diffuseUniform_Merc,diffuseMapUniform_Merc,ambientUniform_Merc,emissiveUniform_Merc,specularUniform_Merc,shininessUniform_Merc,opacityUniform_Merc,u_lightDirectionUniform_Merc,u_ambientLightUniform_Merc;

var numElements_Teapot = [];
var numElements_table = [];

var vao_cube_modelLoading_Merc = [];
var vao_mercedes_modelLoading_Merc = [];
var vbo_mercedes_modelLoading_Merc = [];


var vao_teapot_Merc = [];
var vbo_teapot_Merc = [];



var mercTransX = -1.2500000000000002;
var MercTransY = -2.749999999999998;
var MercTransZ = 9.8999999999999895;

var MercScale = 0.012999999999999182;

var vbo_cube_tp_modelLoading_Merc ;
    

var MercedesProgramObject_Merc;


function initializeModel_Merc(){

	var modelLoadingProgramObject;
	//vertex shaderProgramObject
	var vertexShaderSourceCode =
	"#version 300 es"+
	"\n" +
      "layout(location = 0)in vec4 a_position;                                              " +
      "layout(location = 1)in vec3 a_normal;                                                " +
      "layout(location = 2)in vec2 a_texcoord;                                              " +
      "in vec4 a_color;                                                 " +
      "                                                                 " +
      "uniform mat4 u_projection;                                       " +
      "uniform mat4 u_view;                                             " +
      "uniform mat4 u_world;                                            " +
      "uniform vec3 u_viewWorldPosition;                                " +
      "                                                                 " +
      "out vec3 v_normal;                                               " +
      "out vec3 v_surfaceToView;                                        " +
      "out vec2 v_texcoord;                                             " +
      "out vec4 v_color;                                                " +
      "                                                                 " +
      "void main() {                                                    " +
      "  vec4 worldPosition = u_world * a_position;                     " +
      "  gl_Position = u_projection * u_view * worldPosition;           " +
      "  v_surfaceToView = u_viewWorldPosition - worldPosition.xyz;     " +
      "  v_normal = mat3(u_world) * a_normal;                           " +
      "  v_texcoord = a_texcoord;                                       " +
      "  v_color = a_color;                                             " +
		"}";
	vertexShaderObject_modelLoading_Merc=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_modelLoading_Merc, vertexShaderSourceCode);
	gl.compileShader(vertexShaderObject_modelLoading_Merc);
	if(gl.getShaderParameter(vertexShaderObject_modelLoading_Merc,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(vertexShaderObject_modelLoading_Merc);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	
	//fragmentShader
	var fragmentShaderSource =
	"#version 300 es"+
	"\n"+
	"precision highp  float;" +
	
   "   in vec3 v_normal;                                                                                " +
   "   in vec3 v_surfaceToView;                                                                         " +
   "   in vec2 v_texcoord;                                                                              " +
   "   in vec4 v_color;                                                                                 " +
   "                                                                                                    " +
   " uniform vec3 diffuse;                                                                              " +
   " uniform sampler2D diffuseMap;                                                                      " +
   " uniform vec3 ambient;                                                                              " +
   " uniform vec3 emissive;                                                                             " +
   " uniform vec3 specular;                                                                             " +
   " uniform float shininess;                                                                           " +
   " uniform float opacity;                                                                             " +
   " uniform vec3 u_lightDirection;                                                                     " +
   " uniform vec3 u_ambientLight;                                                                       " +
   "                                                                                                    " +
   " out vec4 outColor;                                                                                 " +
   "                                                                                                    " +
   " void main() {                                                                                      " +
   "     vec3 normal = normalize(v_normal);                                                             " +
   "                                                                                                    " +
   "     vec3 surfaceToViewDirection = normalize(v_surfaceToView);                                      " +
   "     vec3 halfVector = normalize(u_lightDirection + surfaceToViewDirection);                        " +
   "                                                                                                    " +
   "     float fakeLight = dot(u_lightDirection, normal) * .5 + .5;                                     " +
   "     float specularLight = clamp(dot(normal, halfVector), 0.0, 1.0);                                " +
   "                                                                                                    " +
   "     vec4 diffuseMapColor = texture(diffuseMap, v_texcoord);                                        " +
   "     vec3 effectiveDiffuse = diffuse;                                                               " +
   "     float effectiveOpacity = opacity;                                                              " +
   "                                                                                                    " +
   "     outColor = vec4(                                                                               " +
   "         emissive +                                                                                 " +
   "         ambient * u_ambientLight +                                                                 " +
   "         effectiveDiffuse * fakeLight +                                                             " +
   "         specular * pow(specularLight, shininess),                                                  " +
   "         effectiveOpacity);                                                                         " +
    
		"}";
	fragmentShaderObject_modelLoading_Merc = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_modelLoading_Merc,fragmentShaderSource);
	gl.compileShader(fragmentShaderObject_modelLoading_Merc);
	if(gl.getShaderParameter(fragmentShaderObject_modelLoading_Merc,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(fragmentShaderObject_modelLoading_Merc);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	//shader program
	modelLoadingProgramObject=gl.createProgram();
	gl.attachShader(modelLoadingProgramObject, vertexShaderObject_modelLoading_Merc);
	gl.attachShader(modelLoadingProgramObject, fragmentShaderObject_modelLoading_Merc);
	
	//pre-link binidng of shader program object with vertex shader attributes
	// gl.bindAttribLocation(shaderProgramObject, WebGLMacros.VDG_ATTRIBUTE_VERTEX, "vPosition");
	// gl.bindAttribLocation(shaderProgramObject, WebGLMacros.VDG_ATTRIBUTE_NORMAL, "vNormal");
	
	//linking
	gl.linkProgram(modelLoadingProgramObject);
	if(!gl.getProgramParameter(modelLoadingProgramObject, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(modelLoadingProgramObject);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	//get MVP uniform
	modelUniform_modelLoading_Merc = gl.getUniformLocation(modelLoadingProgramObject, "u_world");
	viewUniform_modelLoading_Merc = gl.getUniformLocation(modelLoadingProgramObject, "u_view");
	projectionUniform_modelLoading_Merc = gl.getUniformLocation(modelLoadingProgramObject, "u_projection");
  cameraPosUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "u_viewWorldPosition");


	LKeyPressed_modelLoading_Merc = gl.getUniformLocation(modelLoadingProgramObject, "u_LKeyPressed");
	// LAUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LAUniform");		
	// LDUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LDUniform");
	// LSUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LSUniform");
	
	// KAUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_KAUniform");
	// KDUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_KDUniform");
	// KSUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_KSUniform");
	
	// LightPositionUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LightPosition");
	// MaterialShininessUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_MaterialShininess");
	// samplerUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "diffuseMap");


  
	diffuseUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "diffuse");
	diffuseMapUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "diffuseMap");
	ambientUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "ambient");

  emissiveUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "emissive");
  specularUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "specular");
  shininessUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "shininess");
  opacityUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "opacity");
  u_lightDirectionUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "u_lightDirection");
  u_ambientLightUniform_Merc = gl.getUniformLocation(modelLoadingProgramObject, "u_ambientLight");


	// sphere = new Mesh();
	// makeSphere(sphere,2.0,30,30);
	

	gl.clearColor(0.0,1.0,0.0,1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL)
	perspectiveProjectionMatrix_modelLoading =  mat4.create();

	return modelLoadingProgramObject;
}

function parseOBJ_Merc(text) {
    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];
    const objColors = [[0, 0, 0]];
  
    // same order as `f` indices
    const objVertexData = [
      objPositions,
      objTexcoords,
      objNormals,
      objColors,
    ];
  
    // same order as `f` indices
    let webglVertexData = [
      [],   // positions
      [],   // texcoords
      [],   // normals
      [],   // colors
    ];
  
    const materialLibs = [];
    const geometries = [];
    let geometry;
    let groups = ['default'];
    let material = 'default';
    let object = 'default';
  
    const noop = () => {};
  
    function newGeometry() {
      // If there is an existing geometry and it's
      // not empty then start a new one.
      if (geometry && geometry.data.position.length) {
        geometry = undefined;
      }
    }
  
    function setGeometry() {
      if (!geometry) {
        const position = [];
        const texcoord = [];
        const normal = [];
        const color = [];
        webglVertexData = [
          position,
          texcoord,
          normal,
          color,
        ];
        geometry = {
          object,
          groups,
          material,
          data: {
            position,
            texcoord,
            normal,
            color,
          },
        };
        geometries.push(geometry);
      }
    }
  
    function addVertex(vert) {
      const ptn = vert.split('/');
      ptn.forEach((objIndexStr, i) => {
        if (!objIndexStr) {
          return;
        }
        const objIndex = parseInt(objIndexStr);
        const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
        webglVertexData[i].push(...objVertexData[i][index]);
        // if this is the position index (index 0) and we parsed
        // vertex colors then copy the vertex colors to the webgl vertex color data
        if (i === 0 && objColors.length > 1) {
          geometry.data.color.push(...objColors[index]);
        }
      });
    }
  
    const keywords = {
      v(parts) {
        // if there are more than 3 values here they are vertex colors
        if (parts.length > 3) {
          objPositions.push(parts.slice(0, 3).map(parseFloat));
          objColors.push(parts.slice(3).map(parseFloat));
        } else {
          objPositions.push(parts.map(parseFloat));
        }
      },
      vn(parts) {
        objNormals.push(parts.map(parseFloat));
      },
      vt(parts) {
        // should check for missing v and extra w?
        objTexcoords.push(parts.map(parseFloat));
      },
      f(parts) {
        setGeometry();
        const numTriangles = parts.length - 2;
        for (let tri = 0; tri < numTriangles; ++tri) {
          addVertex(parts[0]);
          addVertex(parts[tri + 1]);
          addVertex(parts[tri + 2]);
        }
      },
      s: noop,    // smoothing group
      mtllib(parts, unparsedArgs) {
        // the spec says there can be multiple filenames here
        // but many exist with spaces in a single filename
        materialLibs.push(unparsedArgs);
      },
      usemtl(parts, unparsedArgs) {
        material = unparsedArgs;
        newGeometry();
      },
      g(parts) {
        groups = parts;
        newGeometry();
      },
      o(parts, unparsedArgs) {
        object = unparsedArgs;
        newGeometry();
      },
    };
  
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      const m = keywordRE.exec(line);
      if (!m) {
        continue;
      }
      const [, keyword, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword];
      if (!handler) {
        console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
        continue;
      }
      handler(parts, unparsedArgs);
    }
  
    // remove any arrays that have no entries.
    for (const geometry of geometries) {
      geometry.data = Object.fromEntries(
          Object.entries(geometry.data).filter(([, array]) => array.length > 0));
    }
  console.log("no of geometries" +geometries);
    return {
      geometries,
      materialLibs,
    };
}			

function parseMapArgs_Merc(unparsedArgs) {
// TODO: handle options
return unparsedArgs;
}

function parseMTL_Merc(text) {
const materials = {};
let material;

const keywords = {
newmtl(parts, unparsedArgs) {
material = {};
materials[unparsedArgs] = material;
},
/* eslint brace-style:0 */
Ns(parts)       { material.shininess      = parseFloat(parts[0]); },
Ka(parts)       { material.ambient        = parts.map(parseFloat); },
Kd(parts)       { material.diffuse        = parts.map(parseFloat); },
Ks(parts)       { material.specular       = parts.map(parseFloat); },
Ke(parts)       { material.emissive       = parts.map(parseFloat); },
map_Kd(parts, unparsedArgs)   { material.diffuseMap = parseMapArgs_Merc(unparsedArgs); },
map_Ns(parts, unparsedArgs)   { material.specularMap = parseMapArgs_Merc(unparsedArgs); },
map_Bump(parts, unparsedArgs) { material.normalMap = parseMapArgs_Merc(unparsedArgs); },
Ni(parts)       { material.opticalDensity = parseFloat(parts[0]); },
d(parts)        { material.opacity        = parseFloat(parts[0]); },
illum(parts)    { material.illum          = parseInt(parts[0]); },
};

const keywordRE = /(\w*)(?: )*(.*)/;
const lines = text.split('\n');
for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
const line = lines[lineNo].trim();
if (line === '' || line.startsWith('#')) {
continue;
}
const m = keywordRE.exec(line);
if (!m) {
    continue;
}
const [, keyword, unparsedArgs] = m;
const parts = line.split(/\s+/).slice(1);
const handler = keywords[keyword];
if (!handler) {
    console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
    continue;
}
    handler(parts, unparsedArgs);
}

return materials;
}

function isPowerOf2_Merc(value) {
    return (value & (value - 1)) === 0;
}

function create1PixelTexture_Merc(gl, pixel) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array(pixel));
        return texture;
}

function createTexture_Merc(gl, url) {
        const texture = create1PixelTexture_Merc(gl, [128, 192, 255, 255]);
        // Asynchronously load an image
        const image = new Image();
        image.src = url;
        image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

        // Check if the image is a power of 2 in both dimensions.
        if (isPowerOf2_Merc(image.width) && isPowerOf2_Merc(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
        } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
});
return texture;
}


async function loadModel_Merc(modelName,vao_cube,vbo_cube,callback)
{
  var parts_modelLoading;
  
  let numElements_modelLoading = [];
  numElements_modelLoading.length = 0;
  var numElementsCounter_modelLoading = 0;

                const objHref = modelName;  /* webglfundamentals: url */
                const response = await fetch(objHref);
                const text = await response.text();
                const obj = parseOBJ_Merc(text);
                console.log(obj.geometries.length);
                const baseHref = new URL(objHref, window.location.href);
                const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
                const matHref = new URL(filename, baseHref).href;
                const response = await fetch(matHref);
                return await response.text();
                }));

                materials_ModelLoading_Merc = parseMTL_Merc(matTexts.join('\n'));

                const textures = {
                defaultWhite: create1PixelTexture_Merc(gl, [255, 255, 255, 255]),
                };

                // load texture for materials
                for (material_modelLoading_Merc of Object.values(materials_ModelLoading_Merc)) {
                    Object.entries(material_modelLoading_Merc)
                    .filter(([key]) => key.endsWith('Map'))
                    .forEach(([key, filename]) => {
                    let texture = textures[filename];
                    if (!texture) {
                    const textureHref = new URL(filename, baseHref).href;
                    texture = createTexture_Merc(gl, textureHref);
                    textures[filename] = texture;
                    }
                    material_modelLoading_Merc[key] = texture;
                });
                }

                const defaultMaterial = {
                diffuse: [1, 1, 1],
                diffuseMap: textures.defaultWhite,
                ambient: [0, 0, 0],
                specular: [1, 1, 1],
                shininess: 400,
                opacity: 1,
                };

                //diffuseMap: textures.defaultWhite,

                parts_modelLoading = obj.geometries.map(({material, data}) => {
                if (data.color) {
                if (data.position.length === data.color.length) {
                // it's 3. The our helper library assumes 4 so we need
                // to tell it there are only 3.
                data.color = { numComponents: 3, data: data.color };
                }
                } else {
                // there are no vertex colors so just use constant white
                data.color = { value: [1, 1, 1, 1] };
                }

                // create a buffer for each array by calling
                // gl.createBuffer, gl.bindBuffer, gl.bufferData
                const bufferInfo = null; //webglUtils.createBufferInfoFromArrays(gl, data);


                var length = vao_cube.length + 1;
                var vboLength = vbo_cube.length + 4;
                for(var i = vao_cube.length; i < length;i ++)
                {        
                vao_cube[i]=gl.createVertexArray();

                gl.bindVertexArray(vao_cube[i]);

                var j = vbo_cube.length;
                {

                vbo_cube[j] =  gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo_cube[j]);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.position), gl.STATIC_DRAW);
                gl.vertexAttribPointer(0,
                        3,
                        gl.FLOAT,
                        false, 0, 0);
                gl.enableVertexAttribArray(0);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                if(obj.geometries[i].data.normal != null)
                {
                j +=1;
                vbo_cube[j] =  gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER,  vbo_cube[j]);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.normal), gl.STATIC_DRAW);
                gl.vertexAttribPointer(1,3,gl.FLOAT,false, 0, 0);
                gl.enableVertexAttribArray(1);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                }
                if(obj.geometries[i].data.texcoord != null)
                {
                j +=1;
                vbo_cube[j] =  gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER,  vbo_cube[j]);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.texcoord), gl.STATIC_DRAW);
                gl.vertexAttribPointer(2,
                            2,
                            gl.FLOAT,
                            false, 0, 0);

                gl.enableVertexAttribArray(2);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                }

               
                if(obj.geometries[i].data.color != null)
                {
                j += 1;        
                vbo_cube[j] =  gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo_cube[j]);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.color), gl.STATIC_DRAW);
                gl.vertexAttribPointer(3,
                            4,
                            gl.FLOAT,
                            false, 0, 0);
                // gl.enableVertexAttribArray(3);
                }
                gl.bindVertexArray(null);
                }
                }
                vbo_cube_tp_modelLoading_Merc = gl.createBuffer();
                // vbo_Normal_cube =  gl.createBuffer();
                // vbo_TexCoord_cube =  gl.createBuffer();
                // vbo_color_cube =  gl.createBuffer();
                GetIndicesAndElements(gl,data);

                return {
                material: {
                ...defaultMaterial,
                ...materials_ModelLoading_Merc[material],
                }
                };
                });




                function GetIndicesAndElements(gl,arrays)
                {

                let indices = arrays.indices;
                if (indices) {
                //  indices = makeTypedArray(indices, 'indices');
                //  bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
                //  bufferInfo.numElements = indices.length;
                } else {
                numElements_modelLoading[numElementsCounter_modelLoading] = getNumElementsFromNonIndexedArrays(arrays);
                console.log(numElementsCounter_modelLoading);
                numElementsCounter_modelLoading += 1;
             
                }
                }

                function getNumElementsFromNonIndexedArrays(arrays) {

                const positionKeys = ['position', 'positions', 'a_position'];
                let key;
                for (const k of positionKeys) {
                if (k in arrays) {
                key = k;
                break;
                }
                }
                key = key || Object.keys(arrays)[0];
                const array = arrays[key];
                const length = getArray(array).length;
                const numComponents = getNumComponents(array, key);
                const numElements = length / numComponents;
                if (length % numComponents > 0) {
                throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
                }
                return numElements;
                }

                function getArray(array) {
                return array.length ? array : array.data;
                }


                function guessNumComponentsFromName(name, length) {
                const texcoordRE = /coord|texture/i;
                const colorRE = /color|colour/i;
                let numComponents;
                if (texcoordRE.test(name)) {
                numComponents = 2;
                } else if (colorRE.test(name)) {
                numComponents = 4;
                } else {
                numComponents = 3;  // position, normals, indices ...
                }

                if (length % numComponents > 0) {
                throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
                }

                return numComponents;
                }

                function getNumComponents(array, arrayName) {
                return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
                }

                if(parts_modelLoading.length > 0)
                  callback(parts_modelLoading,numElements_modelLoading)                  
                else
                  console.log("did not succeeed");

}


function drawModel_Merc()
{


	//gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.useProgram(MercedesProgramObject_Merc);
	//lighting details
	
// if(gParts_Table)
//   console.log(gParts_Table.length);


	var modelMatrix = mat4.create();
	var viewMatrix = mat4.create();
	
  
  mat4.lookAt(viewMatrix, [0.0, -1.5, 1.0], [0.0, -1.5, 0.0], [0.0, 1.0, 0.0]);
  //var angleInRadian = degreeToRadian(gAngle);
  mat4.translate(modelMatrix, modelMatrix, [mercTransX, MercTransY, MercTransZ]);
  mat4.scale(modelMatrix, modelMatrix, [MercScale, MercScale, MercScale]);
	//var angleInRadian = degreeToRadian(gAngle);
	// mat4.translate(modelMatrix, modelMatrix, [0.0,transY_Merc,-100.0]);
  // mat4.scale(modelMatrix, modelMatrix, [0.2,0.2,0.2]);
//	mat4.rotateY(modelMatrix,modelMatrix,degreeToRadian(gAngleTriangle_modelLoading));
	
	//gAngleTriangle_modelLoading += 0.005;
	//mat4.rotateY(modelMatrix,modelMatrix,degreeToRadian(gAngleTriangle));
	//mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);
	gl.uniformMatrix4fv(modelUniform_modelLoading_Merc,false,modelMatrix);
	gl.uniformMatrix4fv(viewUniform_modelLoading_Merc,false,viewMatrix);
	gl.uniformMatrix4fv(projectionUniform_modelLoading_Merc,false,perspectiveMatrix);
  gl.uniform3fv(cameraPosUniform_Merc,[0.0,0.0,0.0]);

  var lightPos = [100.0,100.0,100.0];
  
  gl.uniform3fv(u_lightDirectionUniform_Merc,vec3.normalize(lightPos,[100.0,100.0,100.0]));



	
	// if(gParts_Table)
	// {
		

	// 	for(var i = 0; i < gParts_Table.length;i++)
	// 	{

	// 		if(gbLighting_modelLoading){
	// 			gl.uniform1i(LKeyPressed_modelLoading, 1);
	// 			gl.uniform3fv(LAUniform_modelLoading, light_ambient_modelLoading);
	// 			gl.uniform3fv(LDUniform_modelLoading, light_diffuse_modelLoading);
	// 			gl.uniform3fv(LSUniform_modelLoading, light_specular_modelLoading);
				
	// 			gl.uniform4fv(LightPositionUniform_modelLoading, light_position_modelLoading);
				
	// 			//set material properties
	// 			gl.uniform3fv(KAUniform_modelLoading, gParts_Table[i].material.ambient);
	// 			gl.uniform3fv(KDUniform_modelLoading, gParts_Table[i].material.diffuse);
	// 			gl.uniform3fv(KSUniform_modelLoading, gParts_Table[i].material.specular);
	// 			gl.uniform1f(MaterialShininessUniform_modelLoading,gParts_Table[i].material.shininess);
				
	// 			}
	// 			else
	// 			{
	// 					gl.uniform1i(LKeyPressed_modelLoading, 0);
	// 			}
	// 		gl.bindTexture(gl.TEXTURE_2D, gParts_Table[i].material.diffuseMap);

	// 			gl.bindVertexArray(vao_mercedes_modelLoading[i]);
		
	// 			gl.drawArrays(gl.TRIANGLES,0,numElements_Teapot[i]);
	// 	}
        
	// }


  if(gParts_Teapot_Merc)
	{
		

		for(var i = 0; i < gParts_Teapot_Merc.length;i++)
		{

			if(gbLighting_modelLoading_Merc){
				gl.uniform1i(LKeyPressed_modelLoading_Merc, 1);
				// gl.uniform3fv(LAUniform_modelLoading, light_ambient_modelLoading);
				// gl.uniform3fv(LDUniform_modelLoading, light_diffuse_modelLoading);
				// gl.uniform3fv(LSUniform_modelLoading, light_specular_modelLoading);
				
				// gl.uniform4fv(LightPositionUniform_modelLoading, light_position_modelLoading);
				
				//set material properties
				gl.uniform3fv(ambientUniform_Merc, gParts_Teapot_Merc[i].material.ambient);
		//		gl.uniform3fv(diffuseMapUniform, gParts_Teapot[i].material.diffuseMap);
				gl.uniform3fv(diffuseUniform_Merc, gParts_Teapot_Merc[i].material.diffuse);
        gl.uniform3fv(specularUniform_Merc, gParts_Teapot_Merc[i].material.specular);
				gl.uniform1f(shininessUniform_Merc,gParts_Teapot_Merc[i].material.shininess);
				gl.uniform1f(opacityUniform_Merc,gParts_Teapot_Merc[i].material.opacity);

				}
				else
				{
						gl.uniform1i(LKeyPressed_modelLoading_Merc, 0);
				}
			gl.bindTexture(gl.TEXTURE_2D, gParts_Teapot_Merc[i].material.diffuseMap);

				gl.bindVertexArray(vao_teapot_Merc[i]);
		
				gl.drawArrays(gl.TRIANGLES,0,numElements_table[i]);
		}
        
	}
	
	
	gl.useProgram(null);




	// requestAnimationFrame(drawModel_Merc,canvas);
	 console.log(i);
	
	// if( gAngleTriangle_modelLoading_Merc >= 360.0)
	// 		gAngleTriangle_modelLoading_Merc = 0.0;
	// 	else
	// 		gAngleTriangle_modelLoading_Merc = gAngleTriangle_modelLoading_Merc + 1.0;
	
	// if( gAngleSquare_modelLoading_Merc >= 360.0)
	// 		gAngleSquare_modelLoading_Merc = 0.0;
	// 	else
	// 		gAngleSquare_modelLoading_Merc = gAngleSquare_modelLoading_Merc + 1.0;
}


function drawCup()
{


	//gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.useProgram(MercedesProgramObject_Merc);
	//lighting details
	
// if(gParts_Table)
//   console.log(gParts_Table.length);


	var modelMatrix = mat4.create();
	var viewMatrix = mat4.create();
	
  
 // mat4.lookAt(viewMatrix, [0.0, -1.5, 1.0], [0.0, -1.5, 0.0], [0.0, 1.0, 0.0]);
  //var angleInRadian = degreeToRadian(gAngle);
  mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -50.0]);
  mat4.scale(modelMatrix, modelMatrix, [0.2, 0.2, 0.2]);
	//var angleInRadian = degreeToRadian(gAngle);
	// mat4.translate(modelMatrix, modelMatrix, [0.0,transY_Merc,-100.0]);
  // mat4.scale(modelMatrix, modelMatrix, [0.2,0.2,0.2]);
//	mat4.rotateY(modelMatrix,modelMatrix,degreeToRadian(gAngleTriangle_modelLoading));
	
	//gAngleTriangle_modelLoading += 0.005;
	//mat4.rotateY(modelMatrix,modelMatrix,degreeToRadian(gAngleTriangle));
	//mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);
	gl.uniformMatrix4fv(modelUniform_modelLoading_Merc,false,modelMatrix);
	gl.uniformMatrix4fv(viewUniform_modelLoading_Merc,false,viewMatrix);
	gl.uniformMatrix4fv(projectionUniform_modelLoading_Merc,false,perspectiveMatrix);
  gl.uniform3fv(cameraPosUniform_Merc,[0.0,0.0,0.0]);

  var lightPos = [100.0,100.0,100.0];
  
  gl.uniform3fv(u_lightDirectionUniform_Merc,vec3.normalize(lightPos,[100.0,100.0,100.0]));



	
	// if(gParts_Table)
	// {
		

	// 	for(var i = 0; i < gParts_Table.length;i++)
	// 	{

	// 		if(gbLighting_modelLoading){
	// 			gl.uniform1i(LKeyPressed_modelLoading, 1);
	// 			gl.uniform3fv(LAUniform_modelLoading, light_ambient_modelLoading);
	// 			gl.uniform3fv(LDUniform_modelLoading, light_diffuse_modelLoading);
	// 			gl.uniform3fv(LSUniform_modelLoading, light_specular_modelLoading);
				
	// 			gl.uniform4fv(LightPositionUniform_modelLoading, light_position_modelLoading);
				
	// 			//set material properties
	// 			gl.uniform3fv(KAUniform_modelLoading, gParts_Table[i].material.ambient);
	// 			gl.uniform3fv(KDUniform_modelLoading, gParts_Table[i].material.diffuse);
	// 			gl.uniform3fv(KSUniform_modelLoading, gParts_Table[i].material.specular);
	// 			gl.uniform1f(MaterialShininessUniform_modelLoading,gParts_Table[i].material.shininess);
				
	// 			}
	// 			else
	// 			{
	// 					gl.uniform1i(LKeyPressed_modelLoading, 0);
	// 			}
	// 		gl.bindTexture(gl.TEXTURE_2D, gParts_Table[i].material.diffuseMap);

	// 			gl.bindVertexArray(vao_mercedes_modelLoading[i]);
		
	// 			gl.drawArrays(gl.TRIANGLES,0,numElements_Teapot[i]);
	// 	}
        
	// }


  if(gParts_Teapot_Merc)
	{
		

		for(var i = 0; i < gParts_Teapot_Merc.length;i++)
		{

			if(gbLighting_modelLoading_Merc){
				gl.uniform1i(LKeyPressed_modelLoading_Merc, 1);
				// gl.uniform3fv(LAUniform_modelLoading, light_ambient_modelLoading);
				// gl.uniform3fv(LDUniform_modelLoading, light_diffuse_modelLoading);
				// gl.uniform3fv(LSUniform_modelLoading, light_specular_modelLoading);
				
				// gl.uniform4fv(LightPositionUniform_modelLoading, light_position_modelLoading);
				
				//set material properties
				gl.uniform3fv(ambientUniform_Merc, gParts_Teapot_Merc[i].material.ambient);
		//		gl.uniform3fv(diffuseMapUniform, gParts_Teapot[i].material.diffuseMap);
				gl.uniform3fv(diffuseUniform_Merc, gParts_Teapot_Merc[i].material.diffuse);
        gl.uniform3fv(specularUniform_Merc, gParts_Teapot_Merc[i].material.specular);
				gl.uniform1f(shininessUniform_Merc,gParts_Teapot_Merc[i].material.shininess);
				gl.uniform1f(opacityUniform_Merc,gParts_Teapot_Merc[i].material.opacity);

				}
				else
				{
						gl.uniform1i(LKeyPressed_modelLoading_Merc, 0);
				}
			gl.bindTexture(gl.TEXTURE_2D, gParts_Teapot_Merc[i].material.diffuseMap);

				gl.bindVertexArray(vao_teapot_Merc[i]);
		
				gl.drawArrays(gl.TRIANGLES,0,numElements_table[i]);
		}
        
	}
	
	
	gl.useProgram(null);




	// requestAnimationFrame(drawModel_Merc,canvas);
	 console.log(i);
	
	// if( gAngleTriangle_modelLoading_Merc >= 360.0)
	// 		gAngleTriangle_modelLoading_Merc = 0.0;
	// 	else
	// 		gAngleTriangle_modelLoading_Merc = gAngleTriangle_modelLoading_Merc + 1.0;
	
	// if( gAngleSquare_modelLoading_Merc >= 360.0)
	// 		gAngleSquare_modelLoading_Merc = 0.0;
	// 	else
	// 		gAngleSquare_modelLoading_Merc = gAngleSquare_modelLoading_Merc + 1.0;
}