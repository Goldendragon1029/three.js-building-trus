import { useSelector } from "react-redux";
import * as THREE from "three";
import { Pillar } from "../elements/pillar";
import { extrudeSettings } from "../units";
import { useMemo } from "react";

const FrontTruss = () => {
    const trussWidth = useSelector((state) => state.trussWidth);
    const trussLength = useSelector((state) => state.trussLength);
    const trussHeight = useSelector((state) => state.trussHeight);
    const roofPitch = useSelector((state) => state.roofPitch);
    
    const pillarWidth = 0.1;
    const sloperailLength = 0.5;
    const downRoofPillarPosition = 0.7;
    
    const complex = (downRoofPillarPosition - pillarWidth / 1.5) * Math.cos(Math.atan(roofPitch / 12)) * 2;
    
    const topRoofRailLength = complex * Math.cos(Math.PI / 6);
    const railNumber = Math.ceil(trussWidth / 2 / Math.cos( Math.atan(roofPitch / 12)) / topRoofRailLength);
    const topSloperailPosition = ((Math.ceil(railNumber / 2) - 1) * topRoofRailLength - downRoofPillarPosition * Math.sin(Math.atan(roofPitch / 12))) * Math.sin(Math.atan(roofPitch / 12));
    const topSloperailWidth = topSloperailPosition * 12 / roofPitch * 2;

    const topRoofRailMoves = useMemo(() => {
        const topRoofRailLength = complex * Math.cos(Math.PI / 6);
        const topRoofRails = [];
        const railNumber = Math.ceil(trussWidth / 2 / Math.cos( Math.atan(roofPitch / 12)) / topRoofRailLength);
        for (let index = Math.ceil(railNumber / 2); index < railNumber; index++) {
            topRoofRails.push({
                moveLength: topRoofRailLength * Math.ceil((index - 1) / 2) * 2 ,
                sign: (index % 2) === 0 ? -1 : 1,
                angle: Math.PI / 6 ,
                extrudeLength: complex
            });
        }
        return topRoofRails;
    }, [complex, roofPitch, trussWidth]);

    const roofVertiaclRail = useMemo(() => {
        const topRoofRailLength = complex * Math.cos(Math.PI / 6);
        const topRoofRails = [];
        const railNumber = Math.ceil(trussWidth / 2 / Math.cos( Math.atan(roofPitch / 12)) / topRoofRailLength);
        for (let index = Math.ceil(railNumber / 2) - 1; index < railNumber; index++) {
            topRoofRails.push({
                moveLength: topRoofRailLength * index + pillarWidth / 2,
                angle: Math.PI / 2,
                extrudeLength: downRoofPillarPosition * Math.cos(Math.atan(roofPitch / 12))
            });
        }
        return topRoofRails;
    }, [complex, roofPitch, trussWidth]);

    return (
        <group position={[trussLength / 2, 0, 0]}>
            <mesh name="right-pillar" position={[0, 0, - trussWidth / 2]} rotation={[ - Math.PI / 2, 0, 0]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussHeight)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <mesh name="left-pillar" position={[0, 0, trussWidth / 2 + pillarWidth]} rotation={[ - Math.PI / 2, 0, 0]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussHeight)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <group name="left-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch, 0]} rotation={[Math.atan(roofPitch / 12), 0, 0]}>
                <mesh position={[0, - pillarWidth, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings((trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group name="right-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch, 0]} rotation={[ - Math.atan(roofPitch / 12), 0, 0]}>
                <mesh position={[0, - pillarWidth, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings( - (trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group name="left-down-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch - downRoofPillarPosition - topSloperailPosition, topSloperailPosition / (roofPitch / 12)]} rotation={[Math.atan(roofPitch / 12), 0, 0]}>
                <mesh position={[0, - pillarWidth, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings((trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12 - topSloperailPosition / Math.sin(roofPitch / 12) - (downRoofPillarPosition - pillarWidth * 2) * Math.sin(Math.atan(roofPitch / 12)))]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group name="right-down-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch - downRoofPillarPosition - topSloperailPosition, - topSloperailPosition / (roofPitch / 12)]} rotation={[ - Math.atan(roofPitch / 12), 0, 0]}>
                <mesh position={[0, - pillarWidth, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings( - (trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12 + topSloperailPosition / Math.sin(roofPitch / 12) + (downRoofPillarPosition - pillarWidth * 2) * Math.sin(Math.atan(roofPitch / 12)))]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <mesh name="left-slope-rail" position={[0, trussHeight - sloperailLength - downRoofPillarPosition, trussWidth / 2]} rotation={[Math.atan(sloperailLength * (1 + roofPitch / 12) / sloperailLength), 0, 0]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings( - Math.sqrt(sloperailLength ** 2 + (sloperailLength + sloperailLength * roofPitch / 12) ** 2) - pillarWidth / (12 / roofPitch) * 1.3)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <mesh name="right-slope-rail" position={[0, trussHeight - sloperailLength - downRoofPillarPosition, - trussWidth / 2]} rotation={[ - Math.atan(sloperailLength * (1 + roofPitch / 12) / sloperailLength), 0, 0]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(Math.sqrt(sloperailLength ** 2 + (sloperailLength + sloperailLength * roofPitch / 12) ** 2) + pillarWidth / (12 / roofPitch) * 1.3)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            <mesh name="top-slope-rail" position={[0, trussHeight + (trussWidth / 2 + pillarWidth) * roofPitch / 12 - topSloperailPosition - downRoofPillarPosition, - topSloperailWidth / 2]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(topSloperailWidth)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </mesh>
            {topRoofRailMoves.map((topRoofRailMove) => 
                <group position={[0, - topRoofRailMove.moveLength * Math.sin(Math.atan(roofPitch / 12)), topRoofRailMove.moveLength * Math.cos(Math.atan(roofPitch / 12))]}>
                    <group position={[0, trussHeight + pillarWidth * (12 - roofPitch) / 12 + (trussWidth / 2 + pillarWidth) * roofPitch / 12, 0]} rotation={[topRoofRailMove.sign * topRoofRailMove.angle + Math.atan(roofPitch / 12), 0, 0]}>
                        <mesh position={[0, - pillarWidth, 0]}>
                            <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(topRoofRailMove.sign * topRoofRailMove.extrudeLength)]} />
                            <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                        </mesh>
                    </group>
                </group>
            )}
            {topRoofRailMoves.map((topRoofRailMove) => 
                <group position={[pillarWidth, 0, 0]} rotation={[0, Math.PI, 0]}>
                    <group position={[0, - topRoofRailMove.moveLength * Math.sin(Math.atan(roofPitch / 12)), topRoofRailMove.moveLength * Math.cos(Math.atan(roofPitch / 12))]}>
                        <group position={[0, trussHeight + pillarWidth * (12 - roofPitch) / 12 + (trussWidth / 2 + pillarWidth) * roofPitch / 12, 0]} rotation={[topRoofRailMove.sign * topRoofRailMove.angle + Math.atan(roofPitch / 12), 0, 0]}>
                            <mesh position={[0, - pillarWidth, 0]}>
                                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(topRoofRailMove.sign * topRoofRailMove.extrudeLength)]} />
                                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                            </mesh>
                        </group>
                    </group>
                </group>
            )}
            {roofVertiaclRail.map((topRoofRailMove) => 
                <group position={[0, - topRoofRailMove.moveLength * Math.sin(Math.atan(roofPitch / 12)), topRoofRailMove.moveLength * Math.cos(Math.atan(roofPitch / 12))]}>
                    <group position={[0, trussHeight + pillarWidth * (12 - roofPitch) / 12 + (trussWidth / 2 + pillarWidth) * roofPitch / 12, 0]} rotation={[topRoofRailMove.angle + Math.atan(roofPitch / 12), 0, 0]}>
                        <mesh position={[0, - pillarWidth, 0]}>
                            <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(topRoofRailMove.extrudeLength)]} />
                            <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                        </mesh>
                    </group>
                </group>
            )}
            {roofVertiaclRail.map((topRoofRailMove) => 
                <group position={[pillarWidth, 0, 0]} rotation={[0, Math.PI, 0]}>
                    <group position={[0, - topRoofRailMove.moveLength * Math.sin(Math.atan(roofPitch / 12)), topRoofRailMove.moveLength * Math.cos(Math.atan(roofPitch / 12))]}>
                        <group position={[0, trussHeight + pillarWidth * (12 - roofPitch) / 12 + (trussWidth / 2 + pillarWidth) * roofPitch / 12, 0]} rotation={[topRoofRailMove.angle + Math.atan(roofPitch / 12), 0, 0]}>
                            <mesh position={[0, - pillarWidth, 0]}>
                                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(topRoofRailMove.extrudeLength)]} />
                                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                            </mesh>
                        </group>
                    </group>
                </group>
            )}
        </group>
    )
}
export default FrontTruss