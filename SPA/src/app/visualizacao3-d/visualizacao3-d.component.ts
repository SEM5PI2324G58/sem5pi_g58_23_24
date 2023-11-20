import { AfterViewInit, Component, ElementRef, Input, ViewChild } from
'@angular/core';
import * as THREE from "three";
import Maze from "./maze";
import Lights from './lights';
import Camera from './camera';
import Orientation from './orientation';
import Player from './player';
import UserInterface from './userInterface';
import { PisoService } from 'src/serviceInfo/piso.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';


@Component({
  selector: 'app-visualizacao3-d',
  templateUrl: './visualizacao3-d.component.html',
  styleUrls: ['./visualizacao3-d.component.css']
})
export class Visualizacao3DComponent implements AfterViewInit{

    listaCodigos: string[] = [];
    listaNumeroPisos: number[] = [];
    codigo: any;
  
    constructor(
        private pisoService: PisoService,
        private edificioService: EdificioService,
      ) { }

    ngOnInit(): void {  

    this.edificioService.listarCodEdificios().subscribe({
        next: data => {
        this.listaCodigos = data;
        }
    });

    }

    listarNumeroPisos(): void {
    const codigo = this.codigo.options.item(this.codigo.selectedIndex)?.value;
    console.log(codigo);
    if (codigo === "") {
        this.listaNumeroPisos = [];
    } else {
        this.pisoService.listarNumeroPisos(codigo).subscribe({
        next: data => {
            this.listaNumeroPisos = data;
        },
        error: error => {
            console.error('Error fetching floor numbers:', error);
            this.listaNumeroPisos= [];
        },
        complete: () => {
        }
        });
    }
    }

    
    @ViewChild('myCanvas')private canvasRef!: ElementRef;
    fixedViewCameraParameters: any;
    firstPersonViewCameraParameters: any;
    thirdPersonViewCameraParameters: any;
    topViewCameraParameters: any;
    player: any;
    mousePosition!: THREE.Vector2;
    view: any;
    changeCameraDistance!: boolean;
    changeCameraOrientation!: boolean;
    horizontal: any;
    vertical: any;
    distance: any;
    zoom: any;
    activeViewCamera: any;
    viewsPanel!: HTMLElement | null;
    projection: any;
    reset!: any;
    resetAll!: any;
    gameRunning: any;
    maze!: Maze;
    light!: Lights;
    clock!: THREE.Clock;
    userInterface!: UserInterface;
    
    
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
            ["NorteOeste", "NorteOeste", "Norte", "Norte", "Norte", "Norte", "Oeste", "Norte", "Norte", "NorteOeste", "Oeste"],
            ["Oeste", "Oeste", "NorteOeste", "Norte", "Oeste", "Oeste", "Norte", "Norte", "Oeste", "Oeste", "Oeste"],
            ["Oeste", "Oeste", "Norte", "Oeste","Oeste", "Norte", "Norte", "Oeste", "Oeste", " ", "Oeste"],
            ["Oeste", "Norte", "NorteOeste", "Oeste", "Norte", "Norte", "Oeste", "Oeste", "Norte", " ","Oeste"],
            ["NorteOeste", " ", " ", "NorteOeste", "Oeste", "Norte", " ", "NorteOeste", "Oeste", "Norte", "Oeste"],
            ["Oeste", "NorteOeste", " ", " ", " ", "NorteOeste", "Oeste", " ", "Oeste", "Oeste", "Oeste"],
            ["Oeste", "Norte", "Oeste", "NorteOeste", "Norte", " ", "Norte", "Norte", "Oeste", "Oeste", "Oeste"],
            ["NorteOeste", "Norte", " ", "Norte", "Oeste", "Oeste", "NorteOeste", "Oeste", "Norte", "Oeste", "Oeste"],
            ["Oeste", "NorteOeste", " ", "Oeste", "Norte", "Norte", " ", "Oeste", "Norte", " ", "Oeste"],
            ["Oeste", "Norte", "Norte", "Oeste", "Oeste", "Norte", "NorteOeste", " ", " ", "Norte", "Oeste"],
            ["Norte", "Norte", "Norte", "Norte", "Norte", "Norte", "Norte", "Norte", "Norte", "Norte", " "]
        ],
        initialPosition: [7, 6],
        initialDirection: 0.0,
        exitLocation: [-0.5, 6]
        }

        this.maze = new Maze(mazeData);

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

        let lightParam = {
            ambientLight: { color: 0xffffff, intensity: 0.1 },
            pointLight1: { color: 0xffffff, intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
            pointLight2: { color: 0xffffff, intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) },
            spotLight: { color: 0xffffff, intensity: 1.0, distance: 0.0, angle: Math.PI / 3.0, penumbra: 0.0, position: new THREE.Vector3(0.0, 0.0, 0.0), direction: 0.0 } // angle and direction expressed in radians
            }
        
            
        

        this.light = new Lights(lightParam);
        

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
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        

        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
        this.gameRunning = false;
        
        this.viewsPanel = document.getElementById("views-panel");
        this.view = document.getElementById("view");
        this.projection = document.getElementById("projection");
        this.horizontal = document.getElementById("horizontal");
        this.horizontal.step = 1;
        this.vertical = document.getElementById("vertical");
        this.vertical.step = 1;
        this.distance = document.getElementById("distance");
        this.distance.step = 0.1;
        this.zoom = document.getElementById("zoom");
        this.zoom.step = 0.1;
        this.reset = document.getElementById("reset");
        this.resetAll = document.getElementById("reset-all");
        this.codigo = document.getElementById("codigo");



        this.setActiveViewCamera(this.fixedViewCamera);

        

        window.addEventListener("resize", event => this.windowResize(event));

        this.renderer.domElement.addEventListener("mousedown", event => this.mouseDown(event));

        this.renderer.domElement.addEventListener("mousemove", event => this.mouseMove(event));

        this.renderer.domElement.addEventListener("mouseup", event => this.mouseUp(event));

        this.renderer.domElement.addEventListener("wheel", event => this.mouseWheel(event));

        this.renderer.domElement.addEventListener("contextmenu", event => this.contextMenu(event));

        // Register the event handler to be called on select, input number, or input checkbox change
        this.view.addEventListener("change", (event: Event) => this.elementChange(event));
        this.projection.addEventListener("change", (event: Event) => this.elementChange(event));
        this.horizontal.addEventListener("change", (event: Event) => this.elementChange(event));
        this.vertical.addEventListener("change", (event: Event) => this.elementChange(event));
        this.distance.addEventListener("change", (event: Event) => this.elementChange(event));
        this.zoom.addEventListener("change", (event: Event) => this.elementChange(event));

        this.reset.addEventListener("click", (event: Event) => this.buttonClick(event));
        this.resetAll.addEventListener("click", (event: Event) => this.buttonClick(event));

        this.codigo.addEventListener("change", (event: Event) => this.elementChange(event));


        }

        sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        private render() {
        requestAnimationFrame(() => this.render());
        this.update();
        }

        displayPanel() {
        this.view.options.selectedIndex = ["fixed", "first-person", "third-person", "top"].indexOf(this.activeViewCamera.view);
        if(this.projection.option != null )
        this.projection.options.selectedIndex = ["perspective", "orthographic"].indexOf(this.activeViewCamera.projection);
        this.horizontal.value = this.activeViewCamera.orientation.h.toFixed(0);
        this.vertical.value = this.activeViewCamera.orientation.v.toFixed(0);
        this.distance.value = this.activeViewCamera.distance.toFixed(1);
        this.zoom.value = this.activeViewCamera.zoom.toFixed(1);
    }
        
        windowResize(event: Event) {
        this.fixedViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.firstPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.thirdPersonViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.topViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        mouseDown(event : MouseEvent) {
        if (event.buttons == 1 || event.buttons == 2) { // Primary or secondary button down
            // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
            this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
            // Select the camera whose view is being pointed
            const cameraView = this.getPointedViewport(this.mousePosition);
            if (cameraView != "none") {
                // One of the remaining cameras selected
                const cameraIndex = ["fixed", "first-person", "third-person", "top"].indexOf(cameraView);
                //this.view.options.selectedIndex = cameraIndex;
                this.setActiveViewCamera([this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][cameraIndex]);
                if (event.buttons == 1) { // Primary button down
                    this.changeCameraDistance = true;
                }
                else { // Secondary button down
                    this.changeCameraOrientation = true;
                }
            }
        }
        }

        getPointedViewport(pointer: THREE.Vector2) {
        let viewport;
        /* Check if the pointer is over the mini-map camera viewport
        if (this.miniMapCheckBox.checked) {
            viewport = this.miniMapCamera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return this.miniMapCamera.view;
            }
        }*/
        // Check if the pointer is over the remaining camera viewports
        let cameras;
        /*if (this.multipleViewsCheckBox.checked) {
            cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
        }else {*/
        
        cameras = [this.activeViewCamera];
        for (const camera of cameras) {
            viewport = camera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return camera.view;
            }
        }
        // No camera viewport is being pointed
        return "none";
    }

        setActiveViewCamera(camera: any) {
        this.activeViewCamera = camera;
        this.horizontal.min = this.activeViewCamera.orientationMin.h.toFixed(0);
        this.horizontal.max = this.activeViewCamera.orientationMax.h.toFixed(0);
        this.vertical.min = this.activeViewCamera.orientationMin.v.toFixed(0);
        this.vertical.max = this.activeViewCamera.orientationMax.v.toFixed(0);
        this.distance.min = this.activeViewCamera.distanceMin.toFixed(1);
        this.distance.max = this.activeViewCamera.distanceMax.toFixed(1);
        this.zoom.min = this.activeViewCamera.zoomMin.toFixed(1);
        this.zoom.max = this.activeViewCamera.zoomMax.toFixed(1);
        this.displayPanel();
        }

        pointerIsOverViewport(pointer: THREE.Vector2, viewport: any) {
        return (
            pointer.x >= viewport.x &&
            pointer.x < viewport.x + viewport.width &&
            pointer.y >= viewport.y &&
            pointer.y < viewport.y + viewport.height);
    }

    mouseMove(event : MouseEvent) {
        if (event.buttons == 1 || event.buttons == 2) { // Primary or secondary button down
            if (this.changeCameraDistance || this.changeCameraOrientation /*|| this.dragMiniMap*/) { // Mouse action in progress
                // Compute mouse movement and update mouse position
                const newMousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
                const mouseIncrement = newMousePosition.clone().sub(this.mousePosition);
                this.mousePosition = newMousePosition;
                if (event.buttons == 1) { // Primary button down
                    if (this.changeCameraDistance) {
                        this.activeViewCamera.updateDistance(-0.05 * (mouseIncrement.x + mouseIncrement.y));
                        this.displayPanel();
                    }
                    /*else if (this.dragMiniMap) {
                        const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
                        const width = this.miniMapCamera.viewport.width * windowMinSize;
                        const height = this.miniMapCamera.viewport.height * windowMinSize;
                        this.miniMapCamera.viewport.x += mouseIncrement.x / (window.innerWidth - width);
                        this.miniMapCamera.viewport.y += mouseIncrement.y / (window.innerHeight - height);
                    }*/
                }
                else { // Secondary button down
                    if (this.changeCameraOrientation) {
                        this.activeViewCamera.updateOrientation(mouseIncrement.multiply(new THREE.Vector2(-0.5, 0.5)));
                        this.displayPanel();
                    }
                }
            }
        }
    }
    
    mouseUp(event: MouseEvent) {
        // Reset mouse move action
        //this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
    }

    mouseWheel(event: WheelEvent) {
        // Prevent the mouse wheel from scrolling the document's content
        event.preventDefault();
        // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
        this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
        // Select the camera whose view is being pointed
        const cameraView = this.getPointedViewport(this.mousePosition);
        if (cameraView != "none" /*&& cameraView != "mini-map"*/) { // One of the remaining cameras selected
            const cameraIndex = ["fixed", "first-person", "third-person", "top"].indexOf(cameraView);
            //this.view.options.selectedIndex = cameraIndex;
            const activeViewCamera = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][cameraIndex];
            activeViewCamera.updateZoom(-0.001 * event.deltaY);
            this.setActiveViewCamera(activeViewCamera);
        }
    }

    contextMenu(event: Event) {
        // Prevent the context menu from appearing when the secondary mouse button is clicked
        event.preventDefault();
    }

    
    elementChange(event: Event) {
        if(event.target != null){
        let target = event.target as HTMLFormElement;
        switch (target.id) {
            case "view":
                this.setActiveViewCamera([this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][this.view.options.selectedIndex]);
                break;
            case "projection":
                this.activeViewCamera.setActiveProjection(["perspective", "orthographic"][this.projection.options.selectedIndex]);
                this.displayPanel();
                break;
            case "horizontal":
            case "vertical":
            case "distance":
            case "zoom":
                if (target.checkValidity()) {
                    switch (target.id) {
                        case "horizontal":
                        case "vertical":
                            this.activeViewCamera.setOrientation(new Orientation(this.horizontal.value, this.vertical.value));
                            break;
                        case "distance":
                            this.activeViewCamera.setDistance(this.distance.value);
                            break;
                        case "zoom":
                            this.activeViewCamera.setZoom(this.zoom.value);
                            break;
                    }
                }
                break;
            case "user-interface":
                if ('checked' in target) {
                    this.setUserInterfaceVisibility((target as any)['checked']);
                }
                break;
            case "codigo":
                this.listarNumeroPisos();
                break;
            /*case "multiple-views":
                this.setViewMode(event.target.checked);
                break;
            case "help":
                this.setHelpVisibility(event.target.checked);
                break;
            case "statistics":
                this.setStatisticsVisibility(event.target.checked);
                break;
                */
        }
        }
    }
    buttonClick(event: Event) {
        if(event.target != null){
        let target = event.target as HTMLFormElement;
        switch (target.id) {
            case "reset":
                this.activeViewCamera.initialize();
                break;
            case "reset-all":
                this.fixedViewCamera.initialize();
                this.firstPersonViewCamera.initialize();
                this.thirdPersonViewCamera.initialize();
                this.topViewCamera.initialize();
                break;
        }
        this.displayPanel();
        }
    }

    setUserInterfaceVisibility(visible: boolean) {
        //this.userInterfaceCheckBox.checked = visible;
        //this.viewsPanel.style.visibility = visible ? "visible" : "hidden";
        //this.subwindowsPanel.style.visibility = visible ? "visible" : "hidden";
        this.userInterface.setVisibility(visible);
        }

    update() {
        if (!this.gameRunning) {
            if (this.maze.loaded && this.player.loaded) { // If all resources have been loaded
                // Add the maze, the player and the lights to the scene
                this.scene3D.add(this.maze.object);
                this.scene3D.add(this.player.object);
                this.scene3D.add(this.light.object);

                // Create the clock
                this.clock = new THREE.Clock();

                // Create model animations (states, emotes and expressions)
                //this.animations = new Animations(this.player.object, this.player.animations);
                
                // Set the player's position and direction
                this.player.object.position.set(this.maze.initialPosition.x, this.maze.initialPosition.y, this.maze.initialPosition.z);
                this.player.object.direction = this.maze.initialDirection;

                // Create the user interface
                this.userInterface = new UserInterface(this.scene3D, this.renderer, {object: {ambientLight: this.light.ambientLight,
                                                                                            pointLight1: this.light.pointLight1,
                                                                                            pointLight2: this.light.pointLight2} }, /*this.fog,*/ this.player.object/*, this.animations*/);
                console.log("Game started");
                // Start the game
                this.gameRunning = true;
            }
        } else {
            // Update the model animations
            //const deltaT = this.clock.getDelta();
            //this.animations.update(deltaT);

            // Update the player
            /*if (!this.animations.actionInProgress) {
                // Check if the player found the exit
                if (this.maze.foundExit(this.player.position)) {
                    this.finalSequence();
                }
                else {
                    let coveredDistance = this.player.walkingSpeed * deltaT;
                    let directionIncrement = this.player.turningSpeed * deltaT;
                    if (this.player.keyStates.run) {
                        coveredDistance *= this.player.runningFactor;
                        directionIncrement *= this.player.runningFactor;
                    }
                    if (this.player.keyStates.left) {
                        this.player.direction += directionIncrement;
                    }
                    else if (this.player.keyStates.right) {
                        this.player.direction -= directionIncrement;
                    }
                    const direction = THREE.MathUtils.degToRad(this.player.direction);
                    if (this.player.keyStates.backward) {
                        const newPosition = new THREE.Vector3(-coveredDistance * Math.sin(direction), 0.0, -coveredDistance * Math.cos(direction)).add(this.player.position);
                        if (this.collision(newPosition)) {
                            this.animations.fadeToAction("Death", 0.2);
                        }
                        else {
                            this.animations.fadeToAction(this.player.keyStates.run ? "Running" : "Walking", 0.2);
                            this.player.position = newPosition;
                        }
                    }
                    else if (this.player.keyStates.forward) {
                        const newPosition = new THREE.Vector3(coveredDistance * Math.sin(direction), 0.0, coveredDistance * Math.cos(direction)).add(this.player.position);
                        if (this.collision(newPosition)) {
                            this.animations.fadeToAction("Death", 0.2);
                        }
                        else {
                            this.animations.fadeToAction(this.player.keyStates.run ? "Running" : "Walking", 0.2);
                            this.player.position = newPosition;
                        }
                    }
                    else if (this.player.keyStates.jump) {
                        this.animations.fadeToAction("Jump", 0.2);
                    }
                    else if (this.player.keyStates.yes) {
                        this.animations.fadeToAction("Yes", 0.2);
                    }
                    else if (this.player.keyStates.no) {
                        this.animations.fadeToAction("No", 0.2);
                    }
                    else if (this.player.keyStates.wave) {
                        this.animations.fadeToAction("Wave", 0.2);
                    }
                    else if (this.player.keyStates.punch) {
                        this.animations.fadeToAction("Punch", 0.2);
                    }
                    else if (this.player.keyStates.thumbsUp) {
                        this.animations.fadeToAction("ThumbsUp", 0.2);
                    }
                    else {
                        this.animations.fadeToAction("Idle", this.animations.activeName != "Death" ? 0.2 : 0.6);
                    }
                    this.player.object.position.set(this.player.position.x, this.player.position.y, this.player.position.z);
                    this.player.object.rotation.y = direction - this.player.initialDirection;
                }
            }*/

            // Update first-person, third-person and top view cameras parameters (player direction and target)
            this.firstPersonViewCamera.playerDirection = this.player.object.direction;
            this.thirdPersonViewCamera.playerDirection = this.player.object.direction;
            this.topViewCamera.playerDirection = this.player.object.direction;
            const target = new THREE.Vector3(this.player.object.position.x, this.player.object.position.y + this.player.eyeHeight, this.player.object.position.z);
            this.firstPersonViewCamera.setTarget(target);
            this.thirdPersonViewCamera.setTarget(target);
            this.topViewCamera.setTarget(target);

            // Update statistics
            //this.statistics.update();

            // Render primary viewport(s)
            //this.renderer.clear();

            /*if (this.fog.enabled) {
                this.scene3D.fog = this.fog.object;
            }
            else {
                this.scene3D.fog = null;
            }*/
            let cameras;
            /*if (this.multipleViewsCheckBox.checked) {
                cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
            }
            else {
            }*/
            cameras = [this.activeViewCamera];
            for (const camera of cameras) {
                this.player.object.visible = (camera != this.firstPersonViewCamera);
                const viewport = camera.getViewport();
                //this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene3D, camera.object);
                //this.renderer.render(this.scene2D, this.camera2D);
                this.renderer.clearDepth();
            }

            // Render secondary viewport (mini-map)
            /*if (this.miniMapCheckBox.checked) {
                this.scene3D.fog = null;
                this.player.object.visible = true;
                const viewport = this.miniMapCamera.getViewport();
                this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene3D, this.miniMapCamera.object);
                this.renderer.render(this.scene2D, this.camera2D);
            }*/
        }
    }
        
    }
