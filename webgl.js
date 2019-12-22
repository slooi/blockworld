console.log('loaded webgl.js')

// Shader Source
const vsSource = document.getElementById('vsSource').textContent
const fsSource = document.getElementById('fsSource').textContent

// Canvas
const canvas = document.createElement('canvas')
document.body.append(canvas)
canvas.width = 300
canvas.height = 300	

// gl
let gl = canvas.getContext('webgl')
if(!gl){
	gl = canvas.getContext('experimental-webgl')
}
if(!gl){
	alert('ERROR all versions of webgl are not supported on your browser, please use a browser which supports webgl')
}

// Viewport &
gl.viewport(0,0,300,300	)
gl.clearColor(0.4,0.6,0.8,1)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

// program
// vertexshader
const program = buildProgram()
gl.useProgram(program)



// vertices
const vertices = new Float32Array([
//	X		Y				R, G, B
		-0.5, 0.0,	0,0,0	,
		0.5, 0.0,		1,0,0,
		0.0, 0.5,		0,1,0
])

// vertex Buffer
const vertexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW)

// attributes
let attribLocations = []
for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES);i++){
	const attribName = gl.getActiveAttrib(program,i).name
	attribLocations[attribName] = gl.getAttribLocation(program,attribName)
}
console.log('attribLocations',attribLocations)

// Attributes
gl.vertexAttribPointer(
	attribLocations.a_VertexPositions,
	2,
	gl.FLOAT,
	false,
	2*Float32Array.BYTES_PER_ELEMENT,
	0
)
gl.enableVertexAttribArray(attribLocations.a_VertexPositions)
gl.vertexAttribPointer(
	attribLocations.a_Color,
	3,
	gl.FLOAT,
	false,
	3*Float32Array.BYTES_PER_ELEMENT,
	2*Float32Array.BYTES_PER_ELEMENT
)
gl.enableVertexAttribArray(attribLocations.a_Color)

// gl.drawArrays(gl.POINTS,0,vertices.length/2)
gl.drawArrays(gl.TRIANGLES,0,vertices.length/2)
// const logl.getAttribLocation()
// gl.vertexAttribPointer()

// drawing
// gl.drawArrays(gl.POINTS,)


function buildShader(type,shaderSource){
	const shader = gl.createShader(type)
	gl.shaderSource(shader,shaderSource)
	gl.compileShader(shader)

	// Check shader
	if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error('ERROR compiling shader type:',type,'Info:',gl.getShaderInfoLog(shader))
	return shader
}

function buildProgram(){
	const program = gl.createProgram()
	gl.attachShader(program,buildShader(gl.VERTEX_SHADER,vsSource))
	gl.attachShader(program,buildShader(gl.FRAGMENT_SHADER,fsSource))
	gl.linkProgram(program)

	// Check program
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)) 
		throw new Error('ERROR linking program. Info:',gl.getProgramInfoLog(program))

	gl.validateProgram(program)	
	if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS))
		throw new Error('ERROR validating program. Info:',gl.getProgramInfoLog(program))

	return program
}