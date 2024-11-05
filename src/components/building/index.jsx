import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import { useSelector } from "react-redux"
import Truss from "./Truss"
import TrussTwo from "./Truss-two"
import TrussThree from "./Truss-three"
import { TextureLoader } from "three"
import * as THREE from 'three'
import { Pillar } from "./elements/pillar"
import { extrudeSettings } from "./units"
import CSG from './libs/three-csg.js';

const Building = () => {
    const trussType = useSelector((state) => state.trussType);
    const trussWidth = useSelector((state) => state.trussWidth);
    const trussLength = useSelector((state) => state.trussLength);
    const pillarWidth = 0.1;

    const groundLoader = useLoader(TextureLoader, 'image/4.jpg');
    const groundTexture = groundLoader.clone();
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(3, 3 * trussLength / trussWidth);

    const baseModel = new THREE.Mesh(new THREE.BoxGeometry(trussWidth + 2, trussLength + 2, 0.1));
    const delModel = new THREE.Mesh(new THREE.BoxGeometry(trussWidth + 1.5, trussLength + 1.5, 0.1));

    let baseModel_Temp = baseModel.clone();
    baseModel_Temp.position.set(0, - 0.04, 0);
    baseModel_Temp.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    baseModel_Temp.updateMatrixWorld();

    let delModel_Temp = delModel.clone();
    delModel_Temp.position.set(0, -0.04, 0);
    delModel_Temp.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    delModel_Temp.updateMatrixWorld();

    const meshBaseModel_CSG = CSG.fromMesh(baseModel_Temp);
    const meshDelModel_CSG = CSG.fromMesh(delModel_Temp);
    const finalModel_CSG = meshBaseModel_CSG.subtract(meshDelModel_CSG);
    const CSGBaseModel = CSG.toMesh(finalModel_CSG, new THREE.Matrix4());

    return(
        <>
            <Canvas style={{width: "100%", height: "100vh"}} dpr={[1.5, 2]} shadows camera={{position: [20, 10, 4]}}>
                <Environment backgroundIntensity={3} preset="warehouse" backgroundBlurriness={1} background />
                {trussType === "Standard" && <Truss />}
                {trussType === "CTCT" && <TrussTwo />}
                {trussType === "CMT" && <TrussThree />}
                <ambientLight intensity={1.2}/>
                <OrbitControls />
                <axesHelper args={[5]}/>
                <mesh position={[trussLength / 2, 0, - trussWidth / 2 - pillarWidth]} rotation={[0, - Math.PI / 2, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussLength)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
                <mesh position={[trussLength / 2, 0,  trussWidth / 2]} rotation={[0, - Math.PI / 2, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussLength)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
                <mesh geometry={CSGBaseModel.geometry}>
                    <meshLambertMaterial map={groundTexture} bumpMap={groundTexture} bumpScale={0.2} side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
            </Canvas>
        </>
    )
}
export default Building