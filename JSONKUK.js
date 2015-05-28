var loader = new THREE.JSONLoader();

            loader.load( './humpback-whale-animated-threejs-max-exporter.js', function ( geometry, materials ) {

		var originalMaterial = materials[ 0 ];
		originalMaterial.skinning = true;

		mesh = new THREE.SkinnedMesh( geometry, originalMaterial );
		mesh.scale.set( 0.1, 0.1, 0.1 );

                var animation = new THREE.Animation(
                    mesh,
                    geometry.animation
                );
                animation.play();

                init();
                animate();

            });
