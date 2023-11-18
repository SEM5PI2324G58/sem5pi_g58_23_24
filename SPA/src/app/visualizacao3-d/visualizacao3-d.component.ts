import { AfterViewInit, Component, ElementRef, Input, ViewChild } from
'@angular/core';
import * as THREE from "three";
import Maze from "./maze";
import Lights from './lights';
import Camera from './camera';
import Orientation from './orientation';
import Ground from './ground';
import { merge } from 'lodash';
import Player from './player';


@Component({
  selector: 'app-visualizacao3-d',
  templateUrl: './visualizacao3-d.component.html',
  styleUrls: ['./visualizacao3-d.component.css']
})
export class Visualizacao3DComponent implements AfterViewInit{

  
  @ViewChild('myCanvas')private canvasRef!: ElementRef;
  fixedViewCameraParameters: any;
  firstPersonViewCameraParameters: any;
  thirdPersonViewCameraParameters: any;
  topViewCameraParameters: any;
  player: any;
  
  
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  
      
  ngAfterViewInit(): void {
    this.createScene();
    this.render();
    }

    @Input() public rotationSpeedX: number = 0.001;
    @Input() public rotationSpeedY: number = 0.005;
    @Input() public size: number = 200;
    @Input() public texture: string = '';
    //* Stage Properties
    @Input() public cameraZ: number = 15;
    @Input() public cameraY: number = 3;
    @Input() public cameraX: number = 0;
    @Input() public fieldOfView: number = 30;
    @Input('nearClipping') public nearClippingPlane: number = 1;
    @Input('farClipping') public farClippingPlane: number = 1000;
    
    private renderer!: THREE.WebGLRenderer;
    private scene2D!: THREE.Scene;
    private square!: THREE.LineLoop;
    private camera2D!: THREE.OrthographicCamera;
    private scene3D!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private fixedViewCamera: any;
    private firstPersonViewCamera: any;
    private thirdPersonViewCamera: any;
    private topViewCamera: any;

    async createScene(){
      
      this.scene2D = new THREE.Scene();
      let points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0)];
      let geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      this.square = new THREE.LineLoop(geometry, material);
      this.scene2D.add(this.square);
     

      // Create a 3D scene (the game itself)
      this.scene3D = new THREE.Scene();

      let mazeData = {
        groundTextureUrl: "assets/ground.jpg",
        wallTextureUrl: "assets/wall.jpg",
        size: { width: 10, height: 10 },
        map: [
        [3, 3, 2, 2, 2, 2, 1, 2, 2, 3, 1],
        [1, 1, 3, 2, 1, 1, 2, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 2, 2, 1, 1, 0, 1],
        [1, 2, 3, 1, 2, 2, 1, 1, 2, 0, 1],
        [3, 0, 0, 3, 1, 2, 0, 3, 1, 2, 1],
        [1, 3, 0, 0, 0, 3, 1, 0, 1, 1, 1],
        [1, 2, 1, 3, 2, 0, 2, 2, 1, 1, 1],
        [3, 2, 0, 2, 1, 1, 3, 1, 2, 1, 1],
        [1, 3, 0, 1, 2, 2, 0, 1, 2, 0, 1],
        [1, 2, 2, 1, 1, 2, 3, 0, 0, 2, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0]
      ],
      initialPosition: [7, 6],
      initialDirection: 0.0,
      exitLocation: [-0.5, 6]
      }

      let maze = new Maze(mazeData);
      this.scene3D.add(maze.object);

      const playerData = {
        url: "assets/RobotExpressive/RobotExpressive.glb",
        credits: "Model and related code snippets created by <a href='https://www.patreon.com/quaternius' target='_blank' rel='noopener'>Tomás Laulhé</a>. CC0 1.0. Modified by <a href='https://donmccurdy.com/' target='_blank' rel='noopener'>Don McCurdy</a>.",
        eyeHeight: 0.8, // fraction of character height
        scale: new THREE.Vector3(0.1, 0.1, 0.1),
        walkingSpeed: 0.75,
        initialDirection: 0.0, // Expressed in degrees
        turningSpeed: 75.0, // Expressed in degrees / second
        runningFactor: 2.0, // Affects walking speed and turning speed
        keyCodes: { fixedView: "Digit1", firstPersonView: "Digit2", thirdPersonView: "Digit3", topView: "Digit4", viewMode: "KeyV", userInterface: "KeyU", miniMap: "KeyM", help: "KeyH", statistics: "KeyS", run: "KeyR", left: "ArrowLeft", right: "ArrowRight", backward: "ArrowDown", forward: "ArrowUp", jump: "KeyJ", yes: "KeyY", no: "KeyN", wave: "KeyW", punch: "KeyP", thumbsUp: "KeyT" }
      }

      this.player = new Player(playerData);


      let light = new Lights({
        ambientLight: { color: 0xffffff, intensity: 1.0 },
        pointLight1: { color: 0xffffff, intensity: 1.0, distance: 0.0, position: new THREE.Vector3(0.0, 0.0, 0.0) },
        pointLight2: { color: 0xffffff, intensity: 1.0, distance: 0.0, position: new THREE.Vector3(0.0, 0.0, 0.0) },
        spotLight: { color: 0xffffff, intensity: 1.0, distance: 0.0, angle: Math.PI / 3.0, penumbra: 0.0, position: new THREE.Vector3(0.0, 0.0, 0.0), direction: 0.0 } // angle and direction expressed in radians
        })
      
      this.scene3D.add(light.object);

      const cameraData = {
        view: "fixed", // Fixed view: "fixed"; first-person view: "first-person"; third-person view: "third-person"; top view: "top"; mini-map: "mini-map"
        multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 1.0, 1.0), // Viewport position and size: fraction of window width and window height; MUST BE REDEFINED when creating an instance of ThumbRaiser() so that each view is assigned a different viewport
        target: new THREE.Vector3(0.0, 0.0, 0.0), // Target position
        initialOrientation: new Orientation(135.0, -45.0), // Horizontal and vertical orientation and associated limits (expressed in degrees)
        orientationMin: new Orientation(-180.0, -90.0),
        orientationMax: new Orientation(180.0, 0.0),
        initialDistance: 8.0, // Distance to the target and associated limits
        distanceMin: 4.0,
        distanceMax: 16.0,
        initialZoom: 1.0, // Zoom factor and associated limits
        zoomMin: 0.5,
        zoomMax: 2.0,
        initialFov: 45.0, // Field-of-view (expressed in degrees)
        near: 0.01, // Front clipping plane
        far: 100.0 // Back clipping plane
      };

      this.fixedViewCameraParameters = { ...cameraData, ...{ view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) }};
      this.firstPersonViewCameraParameters = { ...cameraData, ...{ view: "first-person", multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }};
      this.thirdPersonViewCameraParameters = {...cameraData, ...{ view: "third-person", multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }};
      this.topViewCameraParameters =   {...cameraData,...{ view: "top", multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0 }};
       
      this.fixedViewCamera = new Camera(this.fixedViewCameraParameters, window.innerWidth, window.innerHeight);
      this.firstPersonViewCamera = new Camera(this.firstPersonViewCameraParameters, window.innerWidth, window.innerHeight);
      this.thirdPersonViewCamera = new Camera(this.thirdPersonViewCameraParameters, window.innerWidth, window.innerHeight);
      this.topViewCamera = new Camera(this.topViewCameraParameters, window.innerWidth, window.innerHeight);

      this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);
      
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      

      // Create the camera corresponding to the 2D scene
      await this.sleep(1000);
      this.scene3D.add(this.player.object);
      this.player.object.position.set(maze.initialPosition.x, maze.initialPosition.y, maze.initialPosition.z);
      //this.player.position.set(maze.initialPosition.x, maze.initialPosition.y, maze.initialPosition.z); 

      window.addEventListener("resize", event => this.windowResize(event));

      

    }

    sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    private render() {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene3D, this.fixedViewCamera.perspective);
      }
      
      windowResize(event: Event) {
        this.fixedViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.firstPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.thirdPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.topViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

   
    

    
    
    
}
