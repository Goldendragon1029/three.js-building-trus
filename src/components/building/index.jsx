import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useSelector } from "react-redux"
import Truss from "./Truss"
import TrussTwo from "./Truss-two"
import TrussThree from "./Truss-three"

const Building = () => {
    const trussType = useSelector((state) => state.trussType);
    return(
        <>
            <Canvas style={{width: "100%", height: "100vh"}} shadows camera={{ position: [8, 5, 8]}}>
                <color attach="background" args={[0xccccff]} />
                {trussType === "one" && <Truss />}
                {trussType === "two" && <TrussTwo />}
                {trussType === "three" && <TrussThree />}
                <directionalLight 
                    position={[100, 20, 0]}
                    intensity={2.5}
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
                    position={[ - 100, 20, 0]}
                    intensity={2.5}
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
                <fog attach={"fog"} color={"gray"} near={40} far={70} />
                <axesHelper args={[5]}/>
                <mesh rotation={[ - Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[200, 200]}/>
                    <meshStandardMaterial color={0xaaaaaa} transparent opacity={0.2} roughness={0} />
                </mesh>
            </Canvas>
        </>
    )
}
export default Building