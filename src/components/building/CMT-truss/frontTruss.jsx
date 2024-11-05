import { useSelector } from "react-redux";
import * as THREE from "three";
import { Pillar } from "../elements/pillar";
import { extrudeSettings } from "../units";
import { useMemo, useRef, useEffect } from "react";

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

    const newRoofRail = useMemo(() => {
        const roofRails = [];
        const alpha = Math.atan(roofPitch / 12);
        const position_y = trussHeight + (trussWidth / 2) * roofPitch / 12 - topSloperailPosition - downRoofPillarPosition + pillarWidth * Math.sin(alpha * 2);
        const triangle_a = (topSloperailPosition) / roofPitch * 12 + (downRoofPillarPosition) * 12 / roofPitch;
        const triangle_b = triangle_a / Math.cos(alpha);
        const init_a = downRoofPillarPosition / roofPitch * 12;
        const init_b = downRoofPillarPosition / Math.sin(alpha) - downRoofPillarPosition * Math.sin(alpha) / 1.5;
        const distance_a = 1.5;
        const count = Math.ceil((triangle_a - init_a) / distance_a) * 2;
        const real_distance_a = (triangle_a - init_a) / count;
        const real_distance_b = (triangle_b - init_b) / count;

        for (let index = 2; index < count; index += 2) {
            const a = init_a + real_distance_a * (index + 2);
            const b = init_b + real_distance_b * (index - 1);
            const c = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(alpha));
            const beta = Math.asin(Math.sin(alpha) * b / c);
    
            roofRails.push({
                position_y: position_y,
                position_z: (triangle_a - a),
                extrudeLength: c,
                angle: beta
            })
        }

        for (let index = 2; index < count - 1; index += 2) {
            const a = init_a + real_distance_a * (index);
            const b = init_b + real_distance_b * (index - 1);
            const c = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(alpha));
            const beta = Math.asin(Math.sin(alpha) * b / c);
            
            roofRails.push({
                position_y: position_y,
                position_z: (triangle_a - a),
                extrudeLength: c,
                angle: beta
            })
        }
        const a = init_a + real_distance_a * 2;
        const b = init_b - pillarWidth * (1 + Math.sin(alpha));
        const c = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(alpha));
        const beta = Math.asin(Math.sin(alpha) * b / c);

        roofRails.push({
            position_y: position_y,
            position_z: (triangle_a - a),
            extrudeLength: c,
            angle: beta
        })
        return roofRails;
    }, [roofPitch, topSloperailPosition, trussHeight, trussWidth]);

    const pillarDistance = 2.5;
    const pillarNumber = Math.ceil(trussLength / pillarDistance);
    const realDistance = (trussLength - (pillarNumber - 1) * pillarWidth) / pillarNumber;
    const obj_pillar = new THREE.Object3D();
    const ref_pillar = useRef();
    const obj_leftRoofPillar = new THREE.Object3D();
    const ref_leftRoofPillar = useRef();
    const obj_rightRoofPillar = new THREE.Object3D();
    const ref_rightRoofPillar = useRef();

    useEffect(() => {
        if (ref_pillar.current && ref_leftRoofPillar.current && ref_rightRoofPillar.current) {
            for (let index = 0; index <= pillarNumber; index++) {
                obj_pillar.position.set( - index * (realDistance + pillarWidth), 0, - trussWidth / 2);
                obj_pillar.rotation.set( - Math.PI / 2, 0, 0);
                obj_pillar.updateMatrix();
                ref_pillar.current.setMatrixAt(index, obj_pillar.matrix);
            }
            for (let index = 0; index <= pillarNumber; index++) {
                obj_pillar.position.set( - index * (realDistance + pillarWidth), 0, trussWidth / 2 + pillarWidth);
                obj_pillar.rotation.set( - Math.PI / 2, 0, 0);
                obj_pillar.updateMatrix();
                ref_pillar.current.setMatrixAt(index + 1 + pillarNumber, obj_pillar.matrix);
            }
            
            for (let index = 0; index <= pillarNumber; index++) {
                obj_leftRoofPillar.position.set( - index * (realDistance + pillarWidth), -pillarWidth, 0);
                obj_leftRoofPillar.updateMatrix();
                ref_leftRoofPillar.current.setMatrixAt(index, obj_leftRoofPillar.matrix);
            }

            for (let index = 0; index <= pillarNumber; index++) {
                obj_rightRoofPillar.position.set( - index * (realDistance + pillarWidth), -pillarWidth, 0);
                obj_rightRoofPillar.rotation.set(0, Math.PI, 0);
                obj_rightRoofPillar.updateMatrix();
                ref_rightRoofPillar.current.setMatrixAt(index, obj_rightRoofPillar.matrix);
            }
            
    
            ref_pillar.current.instanceMatrix.needsUpdate = true;
            ref_leftRoofPillar.current.instanceMatrix.needsUpdate = true;
            ref_rightRoofPillar.current.instanceMatrix.needsUpdate = true;
        }
    }, [trussWidth, trussLength]);

    const NewRail = (props) => {
        const obj_newRail = new THREE.Object3D();
        const ref_newRail = useRef();
        useEffect(() => {
            if (ref_newRail.current) {
                for (let index = 0; index <= pillarNumber; index++) {
                    obj_newRail.position.set( - index * (realDistance + pillarWidth), 0, 0);
                    obj_newRail.updateMatrix();
                    ref_newRail.current.setMatrixAt(index, obj_newRail.matrix);
                }
                ref_newRail.current.instanceMatrix.needsUpdate = true;
            }
        }, [trussWidth, trussLength])
        

        return (
            <instancedMesh ref={ref_newRail} args={[null, null, pillarNumber + 1]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(props.extrudeLength)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </instancedMesh>
        )
    }

    return (
        <group position={[trussLength / 2, 0, 0]}>
            <instancedMesh ref={ref_pillar} args={[null, null, (pillarNumber + 1) * 2]}>
                <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings(trussHeight)]} />
                <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
            </instancedMesh>
            <group name="left-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch, 0]} rotation={[Math.atan(roofPitch / 12), 0, 0]}>
                <instancedMesh ref={ref_leftRoofPillar} args={[null, null, (pillarNumber + 1)]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings((trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </instancedMesh>
            </group>
            <group name="right-roof-pillar" position={[pillarWidth, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch, 0]} rotation={[ - Math.atan(roofPitch / 12), 0, 0]}>
                <instancedMesh ref={ref_rightRoofPillar} args={[null, null, (pillarNumber + 1)]}>
                    <extrudeGeometry args={[Pillar(pillarWidth), extrudeSettings((trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12)]} />
                    <meshStandardMaterial color={0x666666} side={THREE.DoubleSide} metalness={5} roughness={1} />
                </instancedMesh>
            </group>
            <group name="left-down-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch - downRoofPillarPosition - topSloperailPosition, topSloperailPosition / (roofPitch / 12)]} rotation={[Math.atan(roofPitch / 12), 0, 0]}>
                <group position={[0, - pillarWidth, 0]}>
                    <NewRail extrudeLength={(trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12 - Math.sqrt((downRoofPillarPosition + topSloperailPosition) ** 2 + (topSloperailPosition / (roofPitch / 12)) ** 2) + downRoofPillarPosition * Math.sin(Math.atan(roofPitch / 12)) + pillarWidth / trussWidth * 2.5 * Math.cos(Math.atan(roofPitch / 12))} />
                </group>
            </group>
            <group position={[ - trussLength, 0, 0]} rotation={[0, Math.PI, 0]}>
                <group name="left-down-roof-pillar" position={[0, trussHeight + pillarWidth + (trussWidth / 2 + pillarWidth) / 12 * roofPitch - downRoofPillarPosition - topSloperailPosition, topSloperailPosition / (roofPitch / 12)]} rotation={[Math.atan(roofPitch / 12), 0, 0]}>
                    <group position={[0, - pillarWidth, 0]}>
                        <NewRail extrudeLength={(trussWidth / 2 + pillarWidth) * Math.sqrt(144 + roofPitch * roofPitch) / 12 - Math.sqrt((downRoofPillarPosition + topSloperailPosition) ** 2 + (topSloperailPosition / (roofPitch / 12)) ** 2) + downRoofPillarPosition * Math.sin(Math.atan(roofPitch / 12)) + pillarWidth / trussWidth * 2.5 * Math.cos(Math.atan(roofPitch / 12))} />
                    </group>
                </group>
            </group>
            
            <group name="left-slope-rail" position={[0, trussHeight - sloperailLength - downRoofPillarPosition, trussWidth / 2]} rotation={[Math.atan(sloperailLength * (1 + roofPitch / 12) / sloperailLength), 0, 0]}>
                <NewRail extrudeLength={- Math.sqrt(sloperailLength ** 2 + (sloperailLength + sloperailLength * roofPitch / 12) ** 2) - pillarWidth / (12 / roofPitch) * 1.3} />
            </group>
            <group name="right-slope-rail" position={[0, trussHeight - sloperailLength - downRoofPillarPosition, - trussWidth / 2]} rotation={[ - Math.atan(sloperailLength * (1 + roofPitch / 12) / sloperailLength), 0, 0]}>
                <NewRail extrudeLength={Math.sqrt(sloperailLength ** 2 + (sloperailLength + sloperailLength * roofPitch / 12) ** 2) + pillarWidth / (12 / roofPitch) * 1.3} />
            </group>
            <group name="top-slope-rail" position={[0, trussHeight + (trussWidth / 2 + pillarWidth) * roofPitch / 12 - topSloperailPosition - downRoofPillarPosition, - topSloperailWidth / 2]}>
                <NewRail extrudeLength={topSloperailWidth} />
            </group>
            {topRoofRailMoves.map((topRoofRailMove) => 
                <group position={[0, - topRoofRailMove.moveLength * Math.sin(Math.atan(roofPitch / 12)), topRoofRailMove.moveLength * Math.cos(Math.atan(roofPitch / 12))]}>
                    <group position={[0, trussHeight + pillarWidth * (12 - roofPitch) / 12 + (trussWidth / 2 + pillarWidth) * roofPitch / 12, 0]} rotation={[topRoofRailMove.sign * topRoofRailMove.angle + Math.atan(roofPitch / 12), 0, 0]}>
                        <group position={[0, - pillarWidth, 0]}>
                            <NewRail extrudeLength={topRoofRailMove.sign * topRoofRailMove.extrudeLength} />
                        </group>
                    </group>
                </group>
            )}
            {topRoofRailMoves.map((topRoofRailMove) => 
                <group position={[ - trussLength, 0, 0]} rotation={[0, Math.PI, 0]}>
                    <group position={[0, - topRoofRailMove.moveLength * Math.sin(Math.atan(roofPitch / 12)), topRoofRailMove.moveLength * Math.cos(Math.atan(roofPitch / 12))]}>
                        <group position={[0, trussHeight + pillarWidth * (12 - roofPitch) / 12 + (trussWidth / 2 + pillarWidth) * roofPitch / 12, 0]} rotation={[topRoofRailMove.sign * topRoofRailMove.angle + Math.atan(roofPitch / 12), 0, 0]}>
                            <group position={[0, - pillarWidth, 0]}>
                                <NewRail extrudeLength={topRoofRailMove.sign * topRoofRailMove.extrudeLength} />
                            </group>
                        </group>
                    </group>
                </group>
            )}
            {roofVertiaclRail.map((topRoofRailMove) => 
                <group position={[0, - topRoofRailMove.moveLength * Math.sin(Math.atan(roofPitch / 12)), topRoofRailMove.moveLength * Math.cos(Math.atan(roofPitch / 12))]}>
                    <group position={[0, trussHeight + pillarWidth * (12 - roofPitch) / 12 + (trussWidth / 2 + pillarWidth) * roofPitch / 12, 0]} rotation={[topRoofRailMove.angle + Math.atan(roofPitch / 12), 0, 0]}>
                        <mesh position={[0, - pillarWidth, 0]}>
                            <NewRail extrudeLength={topRoofRailMove.extrudeLength} />
                        </mesh>
                    </group>
                </group>
            )}
            {roofVertiaclRail.map((topRoofRailMove) => 
                <group position={[ - trussLength, 0, 0]} rotation={[0, Math.PI, 0]}>
                    <group position={[0, - topRoofRailMove.moveLength * Math.sin(Math.atan(roofPitch / 12)), topRoofRailMove.moveLength * Math.cos(Math.atan(roofPitch / 12))]}>
                        <group position={[0, trussHeight + pillarWidth * (12 - roofPitch) / 12 + (trussWidth / 2 + pillarWidth) * roofPitch / 12, 0]} rotation={[topRoofRailMove.angle + Math.atan(roofPitch / 12), 0, 0]}>
                            <group position={[0, - pillarWidth, 0]}>
                                <NewRail extrudeLength={topRoofRailMove.extrudeLength} />
                            </group>
                        </group>
                    </group>
                </group>
            )}
            {newRoofRail.map((roofRail) => 
                <group position={[0, roofRail.position_y, roofRail.position_z]} rotation={[ - roofRail.angle, 0, 0]}>
                    <NewRail extrudeLength={roofRail.extrudeLength} />
                </group>
            )}

                {newRoofRail.map((roofRail) => 
            <group position={[ - trussLength, 0, 0]} rotation={[0, Math.PI, 0]}>
                    <group position={[0, roofRail.position_y, roofRail.position_z]} rotation={[ - roofRail.angle, 0, 0]}>
                        <NewRail extrudeLength={roofRail.extrudeLength} />
                    </group>
            </group>
                )}
            <group position={[0, trussHeight + (trussWidth / 2) * roofPitch / 12 - topSloperailPosition - downRoofPillarPosition + pillarWidth * Math.sin(Math.atan(roofPitch / 12) * 2), 0]}>
                <group position={[0, 0, pillarWidth / 2]} rotation={[ - Math.PI / 2, 0, 0]}>
                    <NewRail extrudeLength={trussWidth / 2 * roofPitch / 12  + pillarWidth - ((trussWidth / 2) * roofPitch / 12 - topSloperailPosition - downRoofPillarPosition + pillarWidth * Math.sin(Math.atan(roofPitch / 12) * 2))} />
                </group>
            </group>

        </group>
    )
}
export default FrontTruss