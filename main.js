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

	// webglObj.setBlocks([
	// 	//	X		Y			
	// 			0, 0
	// 	],[
	// 	//	TL TR BL BR
	// 			0,	0,	1,	1
	// 	])
	webglObj.render()	
}