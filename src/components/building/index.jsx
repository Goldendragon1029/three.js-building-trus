import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import { useSelector } from "react-redux"
import Truss from "./Truss"
import TrussTwo from "./Truss-two"
import TrussThree from "./Truss-three"
import { TextureLoader } from "three"
import * as THREE from 'three'
import { Suspense } from "react"
import { Pillar } from "./elements/pillar"
import { extrudeSettings } from "./units"

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

    return(
        <>
            <Canvas style={{width: "100%", height: "100vh", background: `radial-gradient(at 50% 100%, #ffffcc 40%, #666666 80%, #eeeeee 100%)`}} dpr={[1.5, 2]} shadows camera={{position: [8, 5, 8]}}>
                <color attach="background" args={[0xccccff]} />
                <fog attach="fog" args={['#272730', 16, 30]} />
                {trussType === "one" && <Truss />}
                {trussType === "two" && <TrussTwo />}
                {trussType === "three" && <TrussThree />}
                <directionalLight 
                    position={[100, 50, 20]}
                    intensity={3.5}
                    castShadow
                    shadow-mapSize-width={1024} 
                    shadow-mapSize-height={1024}
                    shadow-camera-near={0.1}
                    shadow-camera-far={50}
                    shadow-camera-right={20}
                    shadow-camera-left={-20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />
                <directionalLight 
                    position={[ - 100, 50, -20]}
                    intensity={3.5}
                    castShadow
                    shadow-mapSize-width={1024} 
                    shadow-mapSize-height={1024}
                    shadow-camera-near={0.1}
                    shadow-camera-far={50}
                    shadow-camera-right={20}
                    shadow-camera-left={-20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />
                <ambientLight intensity={0.1}/>
                <OrbitControls />
                <fog attach={"fog"} color={"gray"} near={50} far={80} />
                <axesHelper args={[5]}/>
                
                <mesh position={[trussLength / 2, 0, - trussWidth / 2 - pillarWidth]} rotation={[0, - Math.PI / 2, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussLength)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
                <mesh position={[trussLength / 2, 0,  trussWidth / 2]} rotation={[0, - Math.PI / 2, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussLength)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
                <mesh position={[0, - 0.04, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                    <boxGeometry args={[trussWidth + 2, trussLength + 2, 0.1]}></boxGeometry>
                    <meshLambertMaterial map={groundTexture} bumpMap={groundTexture} bumpScale={0.2} side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
                <mesh rotation={[ - Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[200, 200]}/>
                    <meshStandardMaterial color={0x22aaaa} transparent opacity={0.2} roughness={0.7} />
                </mesh>
            </Canvas>
        </>
    )
}
export default Building