import * as THREE from "three";
import Ground from "./ground";
import Wall from "./wall";


interface mazeData {
    groundTextureUrl: string,
    wallTextureUrl: string,
    size: size,
    map: string[][],
    initialPosition: number[],
    initialDirection: number,
    exitLocation: number[],
}

interface size {
    "width": number
    "height": number,
}

export default class Maze {
    public map: string[][];
    public size: { width: number; height: number };
    public initialPosition: THREE.Vector3;
    public initialDirection: number;
    public exitLocation: THREE.Vector3;
    public object: THREE.Group;
    public ground: Ground;
    public wall: Wall;
    public scale: THREE.Vector3;
    public loaded: boolean;

    constructor(mapaData: mazeData) {
        
        this.scale = new THREE.Vector3(1.0, 0.5, 1.0);
        this.map = mapaData.map;
        this.size = mapaData.size;
        this.initialPosition = this.cellToCartesian(mapaData.initialPosition);
        this.initialDirection = mapaData.initialDirection;

        this.exitLocation = this.cellToCartesian(mapaData.exitLocation);
        this.object = new THREE.Group();
        this.ground = new Ground({ textureUrl: mapaData.groundTextureUrl, size: mapaData.size });

        this.object.add(this.ground.object);
        
        this.wall = new Wall({ textureUrl: mapaData.wallTextureUrl });

        let wallObject: THREE.Object3D;
            for (let i = 0; i <= this.size.width; i++) {
                for (let j = 0; j <= this.size.height; j++) {
                    if (this.map[j][i] == "Norte" || this.map[j][i] == "NorteOeste") {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - this.size.width / 2.0 + 0.5, 0.5, j - this.size.height / 2.0);
                        this.object.add(wallObject);
                    }
                    if (this.map[j][i] == "Oeste" || this.map[j][i] == "NorteOeste") {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - this.size.width / 2.0, 0.5, j - this.size.height / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }
                }
            }
        
        
        this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
        this.loaded = true;
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    private cellToCartesian(position: number[]): THREE.Vector3 {
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    private cartesianToCell(position: THREE.Vector3): number[] {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    private distanceToWestWall(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == "Oeste" || this.map[indices[0]][indices[1]] == "NorteOeste") {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    private distanceToEastWall(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == "Oeste" || this.map[indices[0]][indices[1]] == "NorteOeste") {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    private distanceToNorthWall(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == "Norte" || this.map[indices[0]][indices[1]] == "NorteOeste") {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    private distanceToSouthWall(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == "Norte" || this.map[indices[0]][indices[1]] == "NorteOeste") {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    foundExit(position: THREE.Vector3): boolean {
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };
}