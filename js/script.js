var camera, scene, renderer, geometry, material, plane, box, skybox,
	textureSkybox, controls, clock, keyboard, MovingCube, mesh, hemiLight,
	dirLight, renderer;
var morphs = [];



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


	//LIGHTS
	hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
	hemiLight.color.setHSL(0.6, 1, 0.6);
	hemiLight.groundColor.setHSL(0.095, 1, 0.75);
	hemiLight.position.set(0, 500, 0);
	scene.add(hemiLight);

	dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.color.setHSL(0.1, 1, 0.95);
	dirLight.position.set(-1, 1.75, 1);
	dirLight.position.multiplyScalar(50);
	scene.add(dirLight);

	dirLight.castShadow = true;

	dirLight.shadowMapWidth = 2048;
	dirLight.shadowMapHeight = 2048;

	var d = 50;

	dirLight.shadowCameraLeft = -d;
	dirLight.shadowCameraRight = d;
	dirLight.shadowCameraTop = d;
	dirLight.shadowCameraBottom = -d;

	dirLight.shadowCameraFar = 3500;
	dirLight.shadowBias = -0.0001;
	dirLight.shadowDarkness = 0.35;
	//END LIGHTS

	//GROUND
	var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
	var groundMat = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0x050505
	});
	groundMat.color.setHSL(0.095, 1, 0.75);

	var ground = new THREE.Mesh(groundGeo, groundMat);
	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -33;
	scene.add(ground);

	ground.receiveShadow = true;

	// SKYDOME

	// var vertexShader = document.getElementById('vertexShader').textContent;
	// var fragmentShader = document.getElementById('fragmentShader').textContent;
	// var uniforms = {
	// 	topColor: {
	// 		type: "c",
	// 		value: new THREE.Color(0x0077ff)
	// 	},
	// 	bottomColor: {
	// 		type: "c",
	// 		value: new THREE.Color(0xffffff)
	// 	},
	// 	offset: {
	// 		type: "f",
	// 		value: 33
	// 	},
	// 	exponent: {
	// 		type: "f",
	// 		value: 0.6
	// 	}
	// }
	// uniforms.topColor.value.copy(hemiLight.color);
	//
	// scene.fog.color.copy(uniforms.bottomColor.value);
	//
	// var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
	// var skyMat = new THREE.ShaderMaterial({
	// 	vertexShader: vertexShader,
	// 	fragmentShader: fragmentShader,
	// 	uniforms: uniforms,
	// 	side: THREE.BackSide
	// });
	//
	// var sky = new THREE.Mesh(skyGeo, skyMat);
	// scene.add(sky);

	//dirLight.shadowCameraVisible = true;
	// var pointLight = new THREE.PointLight('white', 1);
	// pointLight.position.set(499, 499, 499);
	// scene.add(pointLight);
	// pointLight.castShadow = true;
	//
	// var ambLight = new THREE.AmbientLight('0x444499');
	// scene.add(ambLight);


	// var skyGeometry = new THREE.BoxGeometry(8000, 2000, 8000);
	//
	// var materialArray = [];
	//
	// THREE.ImageUtils.crossOrigin = '';
	// var textureSky = THREE.ImageUtils.loadTexture('images/sky-roof.jpg');
	// var textureFloor = THREE.ImageUtils.loadTexture('images/sky-floor.png');
	// var textureWall = THREE.ImageUtils.loadTexture('images/sky-nsun.jpg');
	// var textureSkySun = THREE.ImageUtils.loadTexture('images/skySun.jpg');
	//
	// textureFloor.wrapS = textureFloor.wrapT = THREE.ClampToEdgeWrapping;
	// textureFloor.repeat.set(10, 10);
	//
	// textureSky.minFilter = THREE.NearestFilter;
	// textureFloor.minFilter = THREE.NearestFilter;
	// textureWall.minFilter = THREE.NearestFilter;
	// textureSkySun.minFilter = THREE.NearestFilter;
	//
	// materialArray.push(new THREE.MeshBasicMaterial({
	// 	map: textureWall,
	// 	side: THREE.BackSide
	// }))
	// materialArray.push(new THREE.MeshBasicMaterial({
	// 	map: textureSkySun,
	// 	side: THREE.BackSide
	// }))
	// materialArray.push(new THREE.MeshBasicMaterial({
	// 	map: textureSky,
	// 	side: THREE.BackSide
	// }))
	// materialArray.push(new THREE.MeshBasicMaterial({
	// 	map: textureFloor,
	// 	side: THREE.BackSide
	// }))
	// materialArray.push(new THREE.MeshBasicMaterial({
	// 	map: textureWall,
	// 	side: THREE.BackSide
	// }))
	// materialArray.push(new THREE.MeshBasicMaterial({
	// 	map: textureWall,
	// 	side: THREE.BackSide
	// }))
	// var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
	// var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	// scene.add(skyBox);
	//
	// skyBox.position.y = 1000;


	//RENDERINSTÄLLNINGAR

	// renderer = new THREE.WebGLRenderer({
	// 	antialias: true
	// });
	// //renderer.setClearColor(scene.fog.color);
	// renderer.setPixelRatio(window.devicePixelRatio);
	// renderer.setSize(window.innerWidth, window.innerHeight);
	// //container.appendChild(renderer.domElement);
	//
	// renderer.gammaInput = true;
	// renderer.gammaOutput = true;
	//
	// renderer.shadowMapEnabled = true;
	// renderer.shadowMapCullFace = THREE.CullFaceBack;

	function animate() {

		requestAnimationFrame(animate);

		render();
		stats.update();

	}

	//GAMMAL RENDERARE
	function render() {

		var delta = clock.getDelta();

		//controls.update();

		for (var i = 0; i < morphs.length; i++) {

			morph = morphs[i];
			morph.updateAnimation(1000 * delta);

		}

		renderer.render(scene, camera);
		update();
	}

	// function render() {
	//
	// 	requestAnimationFrame(render);
	// 	renderer.render(scene, camera);
	// 	update();
	// }
	render();



	// MODEL

	var loader = new THREE.JSONLoader();

	loader.load("models/flamingo.js", function(geometry) {

		morphColorsToFaceColors(geometry);
		geometry.computeMorphNormals();

		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			specular: 0xffffff,
			shininess: 20,
			morphTargets: true,
			morphNormals: true,
			vertexColors: THREE.FaceColors,
			shading: THREE.FlatShading
		});
		var mesh = new THREE.MorphAnimMesh(geometry, material);

		mesh.duration = 1000;

		var s = 0.05;
		mesh.scale.set(s, s, s);
		mesh.position.y = 5;
		mesh.rotation.y = -1;

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add(mesh);
		morphs.push(mesh);

	});

	function morphColorsToFaceColors(geometry) {

		if (geometry.morphColors && geometry.morphColors.length) {

			var colorMap = geometry.morphColors[0];

			for (var i = 0; i < colorMap.colors.length; i++) {

				geometry.faces[i].color = colorMap.colors[i];

			}

		}

	}

	//OBJMTLLoader
	// var onProgress = function(xhr) {
	// 	if (xhr.lengthComputable) {
	// 		var percentComplete = xhr.loaded / xhr.total * 100;
	// 		console.log(Math.round(percentComplete, 2) + '% downloaded');
	// 	}
	// };
	//
	// var onError = function(xhr) {};
	// THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
	// var loader = new THREE.OBJMTLLoader();
	// loader.load('models/grammystatue.obj', 'models/grammystatue.mtl', function(
	// 	object) {
	//
	// 	object.position.y = 0;
	// 	object.position.x = 0;
	// 	scene.add(object);
	// 	mesh = object;
	// }, onProgress, onError);

	function update() {
		var delta = clock.getDelta(); // seconds.
		var moveDistance = 20 * delta; // 200 pixels per second
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



		//render();
	}
}
