import * as THREE from "three";

export const RoofRail = (pillarWidth) => {
    const newModel = new THREE.Shape();
    const roofRailHeight = pillarWidth / 10;
    newModel.moveTo(0, 0);
    newModel.lineTo(pillarWidth / 2, 0);
    newModel.lineTo(pillarWidth, pillarWidth / 2);
    newModel.lineTo(pillarWidth * 2, pillarWidth / 2);
    newModel.lineTo(pillarWidth * 2.5, 0);
    newModel.lineTo(pillarWidth * 3, 0);
    newModel.lineTo(pillarWidth * 3, roofRailHeight);
    newModel.lineTo(pillarWidth * 2.5, roofRailHeight);
    newModel.lineTo(pillarWidth * 2, pillarWidth / 2 + roofRailHeight);
    newModel.lineTo(pillarWidth, pillarWidth / 2 + roofRailHeight);
    newModel.lineTo(pillarWidth / 2, roofRailHeight);
    newModel.lineTo(0, roofRailHeight);
    newModel.closePath();
    return newModel;
}