import { ArcRotateCamera,  Engine, HemisphericLight, MeshBuilder, Scene, Vector3, Path3D, Color3, Mesh, Curve3, UniversalCamera, Animation, Quaternion } from "babylonjs";
import Coordinate from "./Coordinate";
import { AdvancedDynamicTexture, Button, Control } from "babylonjs-gui";

export default class Path3D_02 {

    engine: Engine;
    scene: Scene;

    //参数类型统一
    constructor(private readonly canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas);//获取canvas标签并创建引擎
        this.scene = this.CreateScene();//创建场景,调用函数接收返回后的场景
        //渲染场景(循环调用)
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })
    }

    //创建函数（场景）
    CreateScene(): Scene {
        //这里就可以直接套用Babylonjs的官网文档示例代码,但视频教程稍有区别，此处更显模块化
        //创建场景
        const scene = new Scene(this.engine);

        const camera = new ArcRotateCamera('camrea', -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;


        const axis = new Coordinate(scene);
        axis.showAxis(4);

        //path
        const pathGroup = new Mesh('pathGroup')
        let v3 = (x: number, y: number, z: number) => new Vector3(x, y, z);
        let curve = Curve3.CreateCubicBezier(v3(5, 0, 0), v3(2.5, 2.5, -0.5), v3(1.5, 2, -1), v3(1, 2, -2), 10);
        let curveCont = Curve3.CreateCubicBezier(v3(1, 2, -2), v3(0, 2, -4.5), v3(-2, 1, -3.5), v3(-0.75, 3, -2), 10);

        curve = curve.continue(curveCont);
        curveCont = Curve3.CreateCubicBezier(v3(-0.75, 3, -2), v3(0, 4, -1), v3(0.5, 4.5, 0), v3(-0.75, 3, -2), 10);

        curve = curve.continue(curveCont);
        curveCont = Curve3.CreateCubicBezier(v3(-0.5, 4.75, 1), v3(-1, 4.75, 1), v3(-1.5, 4, 2.5), v3(-2, 3, 3.5), 10);

        curve = curve.continue(curveCont);
        curveCont = Curve3.CreateCubicBezier(v3(-2, 3, 3.5), v3(-2.5, 2, 4), v3(-1, 2.5, 5), v3(0, 0, 5), 10);

        curve = curve.continue(curveCont);
        //利用continue，将各段曲线（贝塞尔）连接起来

        var curveMesh = MeshBuilder.CreateLines("bezier", { points: curve.getPoints() }, scene);
        curveMesh.color = new Color3(1, 1, 0.5);
        curveMesh.parent = pathGroup;

        //path3d
        const path3d = new Path3D(curve.getPoints());
        //三线设置
        const tangents = path3d.getTangents();//切线数组
        const normals = path3d.getNormals();//法线数组
        const binormals = path3d.getBinormals();//双法线数组
        const curvePath = path3d.getCurve()

        //visualation(可视化)
        for (let p = 0; p < curvePath.length; p++) {
            const tg = MeshBuilder.CreateLines('tg' + p, { points: [curvePath[p], curvePath[p].add(tangents[p])] });
            tg.color = Color3.Red()
            tg.parent = pathGroup;

            const no = MeshBuilder.CreateLines('no' + p, { points: [curvePath[p], curvePath[p].add(normals[p])] });
            no.color = Color3.Blue()
            no.parent = pathGroup;

            const bi = MeshBuilder.CreateLines('bi' + p, { points: [curvePath[p], curvePath[p].add(binormals[p])] });
            bi.color = Color3.Green()
            bi.parent = pathGroup;
        }

        //移动相机游览(animation camera)
        const movingCamera = new UniversalCamera('movingCamera', Vector3.Zero())
        movingCamera.fov = Math.PI / 2
        movingCamera.minZ = 0.01
        movingCamera.maxZ = 25
        movingCamera.updateUpVectorFromRotation = true;

        //移动动作define
        const framesRate = 60 //每秒刷新频率：每秒60帧

        const posAnim = new Animation('cameraPos', 'position', framesRate, Animation.ANIMATIONTYPE_VECTOR3)
        const posKeys = []//关键帧设置：与之前的点位相对应
        const rotAnim = new Animation('cameraRot', 'rotaionQuaternion', framesRate, Animation.ANIMATIONTYPE_QUATERNION);
        const rotKeys = []

        //关键帧点位设置
        for (let i = 0; i < curvePath.length; i++) {
            const position = curvePath[i]
            const tangent = tangents[i]
            const binormal = binormals[i]

            const rotation = Quaternion.FromLookDirectionRH(tangent, binormal)

            posKeys.push({ frame: i * framesRate, value: position })
            rotKeys.push({ frame: i * framesRate, value: rotation })
        }

        //动画和关键帧的绑定
        posAnim.setKeys(posKeys)
        rotAnim.setKeys(rotKeys)

        movingCamera.animations.push(posAnim)
        movingCamera.animations.push(rotAnim)

        //动画的触发测试

        // GUI AND EXTRA VISUALIZATION DEFINITION
        //
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("myUI");

        //GUI(满屏)-功能01—— 显示导览线
        let viewPathButton = Button.CreateSimpleButton("viewPath", "View Camera Path");
        viewPathButton.width = 0.2;
        viewPathButton.height = '24px';
        viewPathButton.background = 'black';
        viewPathButton.color = 'white';
        viewPathButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        viewPathButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        let pathEnabled = false;
        pathGroup.setEnabled(pathEnabled);
        viewPathButton.onPointerClickObservable.add(() => {
            pathEnabled = !pathEnabled;
            pathGroup.setEnabled(pathEnabled);
        });
        advancedTexture.addControl(viewPathButton);

        //GUI(满屏)-功能02—— 回归初始观览位置
        let showOverheadCameraButton = Button.CreateSimpleButton("showOverhead", "Use Overhead Camera");
        showOverheadCameraButton.width = 0.2;
        showOverheadCameraButton.height = '24px';
        showOverheadCameraButton.background = 'black';
        showOverheadCameraButton.color = 'white';

        showOverheadCameraButton.verticalAlignment =Control.VERTICAL_ALIGNMENT_BOTTOM;
        showOverheadCameraButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        showOverheadCameraButton.onPointerClickObservable.add(() => {
            scene.activeCamera = camera;
            scene.stopAnimation(movingCamera);
        });
        advancedTexture.addControl(showOverheadCameraButton);

        //GUI(满屏)-功能03—— 开启摄像机导览
        let showTrackCameraButton = Button.CreateSimpleButton("showOverhead", "Use Track Camera");
        showTrackCameraButton.width = 0.2;
        showTrackCameraButton.height = '24px';
        showTrackCameraButton.background = 'black';
        showTrackCameraButton.color = 'white';
        showTrackCameraButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        showTrackCameraButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        showTrackCameraButton.onPointerClickObservable.add(() => {
            scene.activeCamera = movingCamera;
            scene.beginAnimation(movingCamera, 0, framesRate * curvePath.length, true);
        });
        advancedTexture.addControl(showTrackCameraButton);

        return scene;

        //链接地址（http://localhost:5173/）
    }
}

