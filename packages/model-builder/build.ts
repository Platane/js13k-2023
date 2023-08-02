import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import * as fs from "fs";
import * as path from "path";
import { MathUtils } from "three";

// monkey patch
class E {}
(global as any).ProgressEvent = E;

const glb_url =
  // "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/Fox/glTF-Binary/Fox.glb";
  "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/RiggedSimple/glTF-Binary/RiggedSimple.glb";

// fs.writeFileSync(
//   __dirname + "/tube.glb",
//   await fetch(glb_url).then((res) => res.arrayBuffer())
// );

// const blob = new Blob([glb]);
// const url = URL.createObjectURL(blob);

// console.log(url);

const loader = new GLTFLoader();
const { animations, scene, parser } = await loader.loadAsync(glb_url);

const mesh = scene.children[0].children[0].children[1] as THREE.Mesh;

const getPositionVectors = (geo: THREE.BufferGeometry) => {
  const positions = geo.getAttribute("position")!;
  const indexes = geo.getIndex()!;

  return Array.from(indexes.array).map(
    (i) =>
      new THREE.Vector3(positions.getX(i), positions.getY(i), positions.getZ(i))
  );
};

console.log(parser.json);

const vertices = getPositionVectors(mesh.geometry);

const pack = new Float32Array(vertices.flatMap((v) => v.toArray()));

fs.writeFileSync(import.meta.dir + "/../game/assets/geometry.bin", pack);
