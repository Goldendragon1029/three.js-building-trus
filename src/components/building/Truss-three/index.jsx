import { useSelector } from "react-redux";
import * as THREE from "three";
import { Pillar } from "../elements/pillar";
import { extrudeSettings } from "../units";
import FrontTruss from "./frontTruss";
import RoofTruss from "./roofTruss";
import { useMemo } from "react";

const TrussThree = () => {
    const trussWidth = useSelector((state) => state.trussWidth);
    const trussLength = useSelector((state) => state.trussLength);
    const trussHeight = useSelector((state) => state.trussHeight);
    
    const pillarWidth = 0.1;
    const pillarDistance = 2.5;
    const pillarNumber = Math.ceil(trussLength / pillarDistance);
    const realDistance = (trussLength - (pillarNumber - 1) * pillarWidth) / pillarNumber;

    const Trusses = useMemo(() => {
        const Truss = [];
            for (let index = 0; index < pillarNumber + 1; index++) {
                const moveLength = (realDistance * index + pillarWidth * index);
                let isFront = true;
                if (index === 0 || index === pillarNumber) {
                    isFront = true;
                } else {
                    isFront = false;
                }
                Truss.push({
                    moveLength,
                    isFront
                });
            }
        return Truss
    }, [pillarNumber, realDistance]);

    return (
        <group>
            {Trusses.map((truss) =>
                <group position={[ - truss.moveLength, 0, 0]}>
                    <FrontTruss isFront={truss.isFront}/>
                </group> 
            )}

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