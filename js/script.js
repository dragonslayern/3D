var camera, scene, renderer, geometry, material, plane, box, skybox,
	textureSkybox, controls, clock, keyboard, MovingCube, mesh;



var init = function() {



	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,
		0.1, 10000);
	scene.add(camera);
	//scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera.position.set(0, 1, 30);
	//camera.lookAt(scene.position);

	keyboard = new THREEx.KeyboardState();
	clock = new THREE.Clock();

	var pointLight = new THREE.PointLight('white', 1);
	pointLight.position.set(499, 499, 499);
	scene.add(pointLight);
	pointLight.castShadow = true;

	var ambLight = new THREE.AmbientLight('0x444499');
	scene.add(ambLight);


	var skyGeometry = new THREE.BoxGeometry(8000, 2000, 8000);

	var materialArray = [];

	var textureSky = THREE.ImageUtils.loadTexture('images/sky-roof.jpg');
	var textureFloor = THREE.ImageUtils.loadTexture('images/sky-floor.png');
	var textureWall = THREE.ImageUtils.loadTexture('images/sky-nsun.jpg');
	var textureSkySun = THREE.ImageUtils.loadTexture('images/skySun.jpg');

	textureFloor.wrapS = textureFloor.wrapT = THREE.ClampToEdgeWrapping;
	textureFloor.repeat.set(10, 10);

	textureSky.minFilter = THREE.NearestFilter;
	textureFloor.minFilter = THREE.NearestFilter;
	textureWall.minFilter = THREE.NearestFilter;
	textureSkySun.minFilter = THREE.NearestFilter;

	materialArray.push(new THREE.MeshBasicMaterial({
		map: textureWall,
		side: THREE.BackSide
	}))
	materialArray.push(new THREE.MeshBasicMaterial({
		map: textureSkySun,
		side: THREE.BackSide
	}))
	materialArray.push(new THREE.MeshBasicMaterial({
		map: textureSky,
		side: THREE.BackSide
	}))
	materialArray.push(new THREE.MeshBasicMaterial({
		map: textureFloor,
		side: THREE.BackSide
	}))
	materialArray.push(new THREE.MeshBasicMaterial({
		map: textureWall,
		side: THREE.BackSide
	}))
	materialArray.push(new THREE.MeshBasicMaterial({
		map: textureWall,
		side: THREE.BackSide
	}))
	var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	scene.add(skyBox);

	skyBox.position.y = 1000;

	//renderar kukbox
	function render() {

		requestAnimationFrame(render);
		renderer.render(scene, camera);
		update();
	}
	render();



	// var boxGeometry = new THREE.BoxGeometry(40, 40, 40);
	// var boxMaterial = new THREE.MeshPhongMaterial({
	// 	color: 'blue'
	// });
	// MovingCube = new THREE.Mesh(boxGeometry, boxMaterial);
	// scene.add(MovingCube);
	// MovingCube.position.y += 20.1;

	/*var loader = new THREE.JSONLoader();
			loader.load( "grammystatue.json", function( geometry ) {
				var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('images/crate.jpg') } );

				//var geometry = new THREE.CubeGeometry(5,10,5);

			mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
			mesh.scale.set( 2, 2, 2 );
			mesh.position.y = 0;
			mesh.position.x = 0;
			scene.add( mesh );



			}); */

	var onProgress = function(xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + '% downloaded');
		}
	};

	var onError = function(xhr) {};



	THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

	var loader = new THREE.OBJMTLLoader();
	loader.load('grammystatue.obj', 'grammystatue.mtl', function(object) {

		object.position.y = 0;
		object.position.x = 0;
		scene.add(object);

		mesh = object;

	}, onProgress, onError);



	function update() {
		var delta = clock.getDelta(); // seconds.
		var moveDistance = 200 * delta; // 200 pixels per second
		var rotateAngle = Math.PI / 2 * delta; // pi/2 radians (90 degrees) per second

		if (keyboard.pressed("W"))
			mesh.translateZ(-moveDistance);
		if (keyboard.pressed("S"))
			mesh.translateZ(moveDistance);

		// rotate left/right/up/down
		var rotation_matrix = new THREE.Matrix4().identity();
		if (keyboard.pressed("A"))
			mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
		if (keyboard.pressed("D"))
			mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);

		if (keyboard.pressed("Z")) {
			mesh.position.set(0, 25.1, 0);
			mesh.rotation.set(0, 0, 0);
		}

		// var relativeCameraOffset = new THREE.Vector3(0, 30, 300);
		//
		// var cameraOffset = relativeCameraOffset.applyMatrix(mesh.matrixWorld);
		//
		// camera.position.x = cameraOffset.x;
		// camera.position.y = cameraOffset.y;
		// camera.position.z = cameraOffset.z;
		// camera.lookAt(mesh.position);

	}
}
