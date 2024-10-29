import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import FrontTruss from "./frontTruss"

const Building = () => {
    return(
        <>
            <Canvas style={{width: "100%", height: "100vh"}} shadows camera={{near: 1, far: 70, position: [8, 5, 8]}}>
                <color attach="background" args={[0xccccff]} />
                <FrontTruss />
                <directionalLight 
                    position={[20, 10, 10]}
                    intensity={3}
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
                <gridHelper args={[30, 30]}/>
            </Canvas>
        </>
    )
}
export default Building