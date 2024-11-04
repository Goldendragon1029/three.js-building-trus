import { useSelector } from "react-redux";
import * as THREE from "three";
import { Pillar } from "../elements/pillar";
import { extrudeSettings } from "../units";
import FrontTruss from "./frontTruss";
import RoofTruss from "./roofTruss";

const TrussThree = () => {
    const trussWidth = useSelector((state) => state.trussWidth);
    const trussLength = useSelector((state) => state.trussLength);
    const trussHeight = useSelector((state) => state.trussHeight);
    const pillarWidth = 0.1;
    return (
        <group>
            <FrontTruss />
            <mesh name="RightBaseRail" position={[ - trussLength / 2 - pillarWidth, trussHeight, - trussWidth / 2]} rotation={[0, Math.PI / 2, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussLength + 2 * pillarWidth)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <mesh name="LeftBaseRail" position={[ - trussLength / 2 - pillarWidth, trussHeight, trussWidth / 2 + pillarWidth]} rotation={[0, Math.PI / 2, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussLength + 2 * pillarWidth)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <RoofTruss />
        </group>
    )
}
export default TrussThree