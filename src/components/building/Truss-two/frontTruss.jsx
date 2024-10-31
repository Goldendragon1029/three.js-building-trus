import { useSelector } from "react-redux";
import * as THREE from "three";
import { Pillar } from "../elements/pillar";
import { extrudeSettings } from "../units";
import { useMemo } from "react";
import { sqrt } from "three/webgpu";

const FrontTruss = (props) => {
    const trussWidth = useSelector((state) => state.trussWidth);
    const trussLength = useSelector((state) => state.trussLength);
    const trussHeight = useSelector((state) => state.trussHeight);
    const roofPitch = useSelector((state) => state.roofPitch);
    
    const pillarWidth = 0.1;
    const sloperailLength = 0.5;
    const topSloperailPosition = 0.5;
    const topSloperailWidth = topSloperailPosition * 12 / roofPitch * 2;
    const pillarDistance = 2.5;
    const pillarNumber = Math.ceil(trussWidth / pillarDistance);
    const realDistance = (trussWidth - (pillarNumber - 1) * pillarWidth) / pillarNumber;
    const downRoofPillarPosition = 0.7;

    const complex = (topSloperailPosition + pillarWidth + pillarWidth * (12 - roofPitch) / 12) * Math.cos(Math.atan(roofPitch / 12)) * 2;

    const arraySettings = useMemo(() => {
        const pillars = [];
        if (props.isFront) {
            for (let index = 0; index < pillarNumber - 1; index++) {
                const moveLength = (realDistance * (index + 1) + pillarWidth * index);
                let extrudeLength = trussHeight;
                if (moveLength < trussWidth / 2 - pillarWidth) {
                    extrudeLength = trussHeight + (moveLength + pillarWidth * 2) * roofPitch / 12;
                } else if (moveLength > trussWidth / 2) {
                    extrudeLength = trussHeight + (trussWidth - moveLength + pillarWidth) * roofPitch / 12;
                } else {
                    extrudeLength = trussHeight + (trussWidth / 2 + pillarWidth) * roofPitch / 12;
                }
                pillars.push({
                    moveLength,
                    extrudeLength: extrudeLength - downRoofPillarPosition
                });
            }
        }
        return pillars;
    }, [pillarNumber, props.isFront, realDistance, trussHeight, trussWidth, roofPitch]);

    const topRoofRailMoves = useMemo(() => {
        const topRoofRailLength = complex * Math.cos(Math.PI / 6);
        const topRoofRails = [];
        const railNumber = Math.round(trussWidth / 2 / Math.cos( Math.atan(roofPitch / 12)) / topRoofRailLength);
        for (let index = 1; index <= railNumber; index++) {
            if (index !== railNumber) {
                topRoofRails.push({
                    moveLength: topRoofRailLength * Math.ceil((index - 1) / 2) * 2 ,
                    sign: (index % 2) === 0 ? -1 : 1,
                    angle: Math.PI / 6 ,
                    extrudeLength: complex
                });
            } else {
                // const x = trussWidth / 2 / Math.cos( Math.atan(roofPitch / 12)) - topRoofRailLength * index;
                // const y = downRoofPillarPosition * Math.cos( 1 / Math.atan(roofPitch / 12) );
                let moveLength = 0;
                let extrudeLength = 0;
                let rotationAngle = 0;

                if (index % 2 === 0) {
                    const angle = Math.PI / 2 -  Math.atan(roofPitch / 12);
                    const x = (trussWidth / 2 + pillarWidth * 2) / Math.cos( Math.atan(roofPitch / 12)) - topRoofRailLength * (index - 1) + pillarWidth * 3.3 * Math.sin(angle * 2);
                    const y = downRoofPillarPosition;
                    extrudeLength = Math.sqrt( x ** 2 + y ** 2 - 2 * x * y * Math.cos(angle));
                    rotationAngle = y * Math.sin(angle) / extrudeLength;
                    moveLength = trussWidth / 2 / Math.cos( Math.atan(roofPitch / 12)) + pillarWidth / 2;
                    extrudeLength -= pillarWidth * Math.sin(angle * 2);
                } else {
                    const x = trussWidth / 2 / Math.cos( Math.atan(roofPitch / 12)) - topRoofRailLength * (index - 1);
                    const y = downRoofPillarPosition;
                    const angle = Math.PI / 2 +  Math.atan(roofPitch / 12);
                    extrudeLength = Math.sqrt( x ** 2 + y ** 2 - 2 * x * y * Math.cos(angle));
                    rotationAngle = y * Math.sin(angle) / extrudeLength - 0.04;
                    moveLength = topRoofRailLength * Math.ceil((index - 1) / 2) * 2;
                }

                topRoofRails.push({
                    moveLength: moveLength,
                    sign: (index % 2) === 0 ? - 1 : 1,
                    angle: rotationAngle,
                    extrudeLength: extrudeLength
                });
            }
        }
        console.log("railNumber=", railNumber);
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
            <group name="left-down-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch - downRoofPillarPosition, 0]} rotation={[Math.atan(roofPitch / 12), 0, 0]}>
                <mesh position={[0, - pillarWidth, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings((trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group name="right-down-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch - downRoofPillarPosition, 0]} rotation={[ - Math.atan(roofPitch / 12), 0, 0]}>
                <mesh position={[0, - pillarWidth, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings( - (trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12)]} />
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
            {arraySettings.map((pillar) => 
                <group position={[0, 0, - pillar.moveLength]}>
                    <mesh position={[0, 0, trussWidth / 2]} rotation={[ - Math.PI / 2, 0, 0]}>
                        <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(pillar.extrudeLength)]} />
                        <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                    </mesh>
                </group>               

            )}
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
        </group>
    )
}
export default FrontTruss