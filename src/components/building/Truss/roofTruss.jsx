import { useSelector } from "react-redux";
import * as THREE from "three";
import { extrudeSettings } from "../units";
import { RoofRail } from "../elements/roofRail";

const RoofTruss = () => {
    const trussWidth = useSelector((state) => state.trussWidth);
    const trussLength = useSelector((state) => state.trussLength);
    const trussHeight = useSelector((state) => state.trussHeight);
    const roofPitch = useSelector((state) => state.roofPitch);
    
    const pillarWidth = 0.1;
    const topRoofRailPosition = 0.3;
    const roofRailDistance = 1.5;
    const roofRailNumber = Math.ceil((trussWidth / 2 - topRoofRailPosition) / roofRailDistance);
    const realDistance = (trussWidth / 2 - topRoofRailPosition) / roofRailNumber;

    return (
        <group>
            {(() => {
                const roofRail = [];
                for (let index = 0; index < roofRailNumber; index++) {
                    const moveLength = (realDistance * index + topRoofRailPosition);
                    const moveHeight = moveLength * roofPitch / 12 - (trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) * roofPitch / 12);
                    roofRail.push(
                    <>
                        <group position={[0, - moveHeight, - moveLength]} rotation={[ - Math.atan(roofPitch / 12), 0, 0]}>
                            <mesh name="RightRoofRail" position={[ - trussLength / 2 - pillarWidth, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                                    <extrudeGeometry args={[RoofRail(pillarWidth / 2), extrudeSettings(trussLength + 2 * pillarWidth)]} />
                                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                            </mesh>
                        </group>
                        <group  position={[0, - moveHeight, moveLength]} rotation={[ Math.atan(roofPitch / 12), 0, 0]}>
                            <mesh name="LeftRoofRail" position={[ trussLength / 2 + pillarWidth, 0, 0]} rotation={[0, - Math.PI / 2, 0]}>
                                    <extrudeGeometry args={[RoofRail(pillarWidth / 2), extrudeSettings(trussLength + 2 * pillarWidth)]} />
                                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                            </mesh>
                        </group>
                    </>
                    );
                }
                return roofRail;
            })()}
        </group>
    )
}
export default RoofTruss