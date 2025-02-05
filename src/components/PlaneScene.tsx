import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const PlaneModel: React.FC<{ target: THREE.Vector3 | null }> = ({ target }) => {
  const { scene } = useGLTF("/3d/scene.gltf");
  const ref = useRef<THREE.Group>(null);
  const prevAngle = useRef(-90);

  // Set initial rotation and scale
  scene.rotation.set(Math.PI / 4, -Math.PI / 2, 0);
  scene.scale.set(0.1, 0.1, 0.1);

  useFrame(() => {
    if (ref.current && target) {
      const planePosition = ref.current.position.clone();
      const direction = target.clone().sub(planePosition).normalize();
      const distance = planePosition.distanceTo(target);

      const targetAngle = THREE.MathUtils.radToDeg(Math.atan2(direction.x, direction.z)) + 90;
      let currentAngle = THREE.MathUtils.radToDeg(ref.current.rotation.y);
      
      if (Math.abs(currentAngle - prevAngle.current) > 10) {
        currentAngle = prevAngle.current; 
      }

      const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;

      prevAngle.current = THREE.MathUtils.lerp(currentAngle, currentAngle + angleDiff, 0.05);
      ref.current.rotation.y = THREE.MathUtils.degToRad(prevAngle.current);

      if (Math.abs(angleDiff) < 5 && distance > 0.3) {
        const speed = 0.05;
        ref.current.position.add(direction.multiplyScalar(speed));
      }
    }
  });

  return <primitive object={scene} ref={ref} />;
};

const ClickHandler: React.FC<{ setTarget: (pos: THREE.Vector3) => void }> = ({ setTarget }) => {
  const { camera } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  const handleClick = (event: MouseEvent) => {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.current.setFromCamera(mouse, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();

    if (raycaster.current.ray.intersectPlane(plane, intersection)) {
      setTarget(intersection);
    }
  };

  React.useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return null;
};

const PlaneScene: React.FC = () => {
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{
          position: [0, 10, 10],
          rotation: [-Math.PI / 4, 0, 0],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={1} />
        <PlaneModel target={target} />
        <ClickHandler setTarget={setTarget} />
      </Canvas>
    </div>
  );
};

export default PlaneScene;
