import { useSelector } from "react-redux";
import * as THREE from "three";
import { Pillar } from "../elements/pillar";
import { extrudeSettings } from "../units";

const FrontTruss = () => {
    const trussType = useSelector((state) => state.trussType);
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


    return (
        <group position={[trussLength / 2, 0, 0]}>
            <group>
                <mesh position={[0, 0, - trussWidth / 2]} rotation={[ - Math.PI / 2, 0, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussHeight)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group>
                <mesh position={[0, 0, trussWidth / 2 + pillarWidth]} rotation={[ - Math.PI / 2, 0, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussHeight)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch, 0]} rotation={[Math.atan(roofPitch / 12), 0, 0]}>
                <mesh position={[0, - pillarWidth, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings((trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch, 0]} rotation={[ - Math.atan(roofPitch / 12), 0, 0]}>
                <mesh position={[0, - pillarWidth, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings( - (trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group position={[0, trussHeight - sloperailLength, trussWidth / 2]}>
                <mesh rotation={[Math.atan(sloperailLength * (1 + roofPitch / 12) / sloperailLength), 0, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings( - Math.sqrt(sloperailLength ** 2 + (sloperailLength + sloperailLength * roofPitch / 12) ** 2) - pillarWidth / (12 / roofPitch) * 1.3)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group position={[0, trussHeight - sloperailLength, - trussWidth / 2]}>
                <mesh rotation={[ - Math.atan(sloperailLength * (1 + roofPitch / 12) / sloperailLength), 0, 0]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(Math.sqrt(sloperailLength ** 2 + (sloperailLength + sloperailLength * roofPitch / 12) ** 2) + pillarWidth / (12 / roofPitch) * 1.3)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>
            <group>
                <mesh position={[0, trussHeight + (trussWidth / 2 + pillarWidth) * roofPitch / 12 - topSloperailPosition, - topSloperailWidth / 2]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(topSloperailWidth)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </mesh>
            </group>

            {(() => {
                const pillars = [];
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
                    pillars.push(
                        <group position={[0, 0, - moveLength]}>
                            <mesh position={[0, 0, trussWidth / 2]} rotation={[ - Math.PI / 2, 0, 0]}>
                                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(extrudeLength)]} />
                                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                            </mesh>
                        </group>               
                    );
                }
                return pillars;
            })()}
        </group>
    )
}
export default FrontTruss