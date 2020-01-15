console.log('loaded main.js')

setup()

async function setup(){
	// load webgltextures
	const imageTexture = await loadTextures()

	// create webglobj
	const webglObj = createWebglObj(imageTexture)

	// game loop
	gameLoop(webglObj)
}

function gameLoop(webglObj){
	webglObj.render()	
}