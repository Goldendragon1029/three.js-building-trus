import { TextureLoader } from "three"
import * as THREE from 'three'
import { extrudeSettings } from "../units"
import CSG from '../libs/three-csg.js';
import { useLoader } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { Pillar } from "../elements/pillar.jsx";

const Ground = () => {
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
    return (
        <group>
            <mesh position={[trussLength / 2, 0, - trussWidth / 2 - pillarWidth]} rotation={[0, - Math.PI / 2, 0]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussLength)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <mesh position={[trussLength / 2, 0,  trussWidth / 2]} rotation={[0, - Math.PI / 2, 0]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussLength)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <mesh position={[trussLength / 2, 0,  trussWidth / 2]} rotation={[0, 0, 0]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings( - trussWidth)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <mesh position={[ - trussLength / 2 - pillarWidth, 0,  trussWidth / 2]} rotation={[0, 0, 0]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings( - trussWidth)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <mesh geometry={CSGBaseModel.geometry}>
                <meshLambertMaterial map={groundTexture} bumpMap={groundTexture} bumpScale={0.2} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
            <mesh rotation={[ - Math.PI / 2, 0, Math.PI / 2]}>
                <planeGeometry args={[trussWidth + 1.5, trussLength + 1.5]} />
                <meshLambertMaterial map={groundTexture} bumpMap={groundTexture} bumpScale={0.2} toneMapped={false} />
            </mesh>
        </group>
    )
}

export default Ground;