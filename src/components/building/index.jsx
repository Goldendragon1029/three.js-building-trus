import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useSelector } from "react-redux"
import Standard from "./standard-truss/index.jsx"
import CTCT from "./CTCT-truss/index.jsx"
import CMT from "./CMT-truss/index.jsx"
import Ground from "./ground/index.jsx"

const Building = () => {
    const trussType = useSelector((state) => state.trussType);
    return(
        <>
            <Canvas style={{width: "100%", height: "100vh"}} shadows camera={{position: [20, 10, 4]}}>
                <Environment backgroundIntensity={0.2} preset="warehouse" backgroundBlurriness={1} background />
                {trussType === "Standard" && <Standard />}
                {trussType === "CTCT" && <CTCT />}
                {trussType === "CMT" && <CMT />}
                <ambientLight intensity={1.2} />
                <OrbitControls />
                <Ground />
            </Canvas>
        </>
    )
}
export default Building