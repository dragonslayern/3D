if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene, renderer, dirLight, hemiLight, keyboard, meshAnim, meshAnim2, animation;
var morphs = [];
var stats, sphere;
var guiControls, datGUI, controls;
var material_sphere1, material_sphere2;

var clock = new THREE.Clock();


function init() {

    keyboard = new THREEx.KeyboardState();
    var container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 0, 250);

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xffffff, 1, 5000);
    scene.fog.color.setHSL(0.6, 0, 1);

    /*
    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.15;
    */


    //AUDIOLISTENER
    // var listener = new THREE.AudioListener();
    // camera.add(listener);
    //
    // var mesh1 = new THREE.Mesh(sphere, material_sphere1);
    // mesh1.position.set(-250, 30, 0);
    // scene.add(mesh1);
    //
    // var sound1 = new THREE.Audio(listener);
    // sound1.load('sound/nochurch.mp3');
    // sound1.setRefDistance(1000);
    // sound1.autoplay = true;
    // mesh1.add(sound1);

    // LIGHTS

    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    //

    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(50);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadowMapWidth = 2048;
    dirLight.shadowMapHeight = 2048;

    var d = 100;

    dirLight.shadowCameraLeft = -d;
    dirLight.shadowCameraRight = d;
    dirLight.shadowCameraTop = d;
    dirLight.shadowCameraBottom = -d;

    dirLight.shadowCameraFar = 3500;
    dirLight.shadowBias = -0.0001;
    dirLight.shadowDarkness = 0.35;
    //dirLight.shadowCameraVisible = true;



    // GROUND
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
    var vertexShader = document.getElementById('vertexShader').textContent;
    var fragmentShader = document.getElementById('fragmentShader').textContent;
    var uniforms = {
      topColor: {
        type: "c",
        value: new THREE.Color(0x0077ff)
      },
      bottomColor: {
        type: "c",
        value: new THREE.Color(0xffffff)
      },
      offset: {
        type: "f",
        value: 33
      },
      exponent: {
        type: "f",
        value: 0.6
      }
    }
    uniforms.topColor.value.copy(hemiLight.color);

    scene.fog.color.copy(uniforms.bottomColor.value);

    var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      side: THREE.BackSide
    });

    var sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);



    // MODEL

    var loader = new THREE.JSONLoader();
    //var kuk = 'models/animated/3D3.js';
    loader.load("models/animated/test4.json", function(geometry, material) {

      morphColorsToFaceColors(geometry, material);
      geometry.computeMorphNormals(material);

      var material = new THREE.MeshPhongMaterial({
        morphTargets: true,
        morphNormals: true,
        specular: 0xffffff,
        shading: THREE.SmoothShading,
        vertexColors: THREE.FaceColors
      });

      // for (var i = 0; i < material.length; i++) {
      //   material[i].morphTargets = true;
      // }


      meshAnim = new THREE.MorphAnimMesh(geometry, material);
      meshAnim.duration = 93;

      var s = 10;
      meshAnim.scale.set(s, s, s);
      meshAnim.position.y = -33;
      meshAnim.rotation.y = -
        0.5;

      meshAnim.castShadow = true;
      meshAnim.receiveShadow = true;


      scene.add(meshAnim);
      morphs.push(meshAnim);

    });

    // var loader2 = new THREE.JSONLoader();
    // //var kuk = 'models/animated/3D3.js';
    // loader2.load("models/animated/flamingo.js", function(geometry, material) {
    //
    //   morphColorsToFaceColors(geometry);
    //   geometry.computeMorphNormals();
    //
    //
    //
    //   var material2 = new THREE.MeshPhongMaterial({
    //     color: 0xffffff,
    //     specular: 0xffffff,
    //     shininess: 20,
    //     morphTargets: true,
    //     morphNormals: true,
    //     vertexColors: THREE.FaceColors,
    //     shading: THREE.FlatShading
    //   });
    //
    //   meshAnim2 = new THREE.MorphAnimMesh(geometry, material);
    //   meshAnim2.duration = 10;
    //
    //   var s2 = 0.35;
    //   meshAnim2.scale.set(s2, s2, s2);
    //   meshAnim2.position.y = -1;
    //   meshAnim2.rotation.y = -0.5;
    //   meshAnim2.position.x = -10;
    //
    //   meshAnim2.castShadow = true;
    //   meshAnim2.receiveShadow = true;
    //
    //
    //   scene.add(meshAnim2);
    //   morphs.push(meshAnim2);
    //
    // });
    //END OF JSON LOADER
    // RENDERER

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer
      .setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapCullFace = THREE.CullFaceBack;

    function lensFlareUpdateCallback(object) {

      var f, fl = object.lensFlares.length;
      var flare;
      var vecX = -object.positionScreen.x * 2;
      var vecY = -object.positionScreen.y * 2;


      for (f = 0; f < fl; f++) {

        flare = object.lensFlares[f];

        flare.x = object.positionScreen.x + vecX * flare.distance;
        flare.y = object.positionScreen.y + vecY * flare.distance;

        flare.rotation = 0;

      }

      object.lensFlares[2].y += 0.025;
      object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad(45);

    }

    // STATS

    stats = new Stats();
    container.appendChild(stats.domElement);

    //

    window.addEventListener('resize', onWindowResize, false);
    //document.addEventListener( 'keydown', onKeyDown, false );

    render();

  } //end of init ()

function update() {
  var delta = clock.getDelta(); // seconds.
  var moveDistance = 2000 * delta; // 20 pixels per second
  var rotateAngle = 100 * delta; // pi/2 radians (90 degrees) per second

  if (keyboard.pressed("W"))
    meshAnim.translateZ(-moveDistance);
  if (keyboard.pressed("S"))
    meshAnim.translateZ(moveDistance);

  // rotate left/right/up/down
  var rotation_matrix = new THREE.Matrix4().identity();
  if (keyboard.pressed("A")) {
    meshAnim.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    console.log("testar kuk1");
  }
  if (keyboard.pressed("D")) {
    meshAnim.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    console.log("testar kuk2");
  }

  //translatera uppåt
  // if (keyboard.pressed("Z")) {
  //   meshAnim.position.set(0, 10.1, 0);
  //   meshAnim.rotation.set(0, 0, 0);
  //   console.log("testar kuk3");
  // }

}

function render() {

  var delta = clock.getDelta();

  //controls.update();

  for (var i = 0; i < morphs.length; i++) {

    morph = morphs[i];
    morph.updateAnimation(100 * delta);

  }
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  update();

}

function morphColorsToFaceColors(geometry) {

  if (geometry.morphColors && geometry.morphColors.length) {

    var colorMap = geometry.morphColors[0];

    for (var i = 0; i < colorMap.colors.length; i++) {

      geometry.faces[i].color = colorMap.colors[i];

    }

  }

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onKeyDown(event) {

  switch (event.keyCode) {

    case 72:
      /*h*/

      hemiLight.visible = !hemiLight.visible;
      break;

    case 68:
      /*d*/

      dirLight.visible = !dirLight.visible;
      break;

  }

}
