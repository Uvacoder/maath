import { useEffect, useRef } from "react";

import {
  BufferAttribute,
  Group,
  Line,
  Plane,
  Vector3,
  Points,
  Mesh,
  StreamDrawUsage,
} from "three";

import * as random from "maath/random";
import * as buffer from "maath/buffer";
import * as misc from "maath/misc";
import * as threeUtils from "maath/three";

function Demo() {
  const plane = new Plane(new Vector3().randomDirection().normalize());

  const $group = useRef<Group>(null!);
  const $line = useRef<Line>(null!);
  const $points = useRef<Points>(null!);
  const $planeHelper = useRef<Points>(null!);
  const $intersection = useRef<Mesh>(null!);

  const points = random.inSphere(new Float32Array(2 * 3));

  useEffect(() => {
    const attr = new BufferAttribute(points, 3);
    attr.usage = StreamDrawUsage;

    $line.current.geometry.setAttribute("position", attr);
    $points.current.geometry.setAttribute("position", attr);

    const [a, b] = threeUtils.bufferToVectors(points, 3);

    $intersection.current.position.copy(
      misc.planeSegmentIntersection(plane, [a, b]) as Vector3
    );
  });

  return (
    <>
      {/* @ts-ignore */}
      <line castShadow ref={$line}>
        <bufferGeometry />
        <lineBasicMaterial color="#ff005b" />
      </line>

      <points castShadow ref={$points}>
        <bufferGeometry />
        <pointsMaterial size={5} color="#ff005b" />
      </points>

      <mesh ref={$intersection}>
        <sphereGeometry args={[0.025, 32, 32]} />
        <meshNormalMaterial />
      </mesh>

      <>
        {/* @ts-ignore */}
        <planeHelper ref={$planeHelper} args={[plane, 3, "#ff005b"]} />
        <arrowHelper args={[plane.normal, new Vector3(), 0.5, "#ff005b"]} />
      </>

      <group ref={$group} />
    </>
  );
}

export default Demo;
