import { ArcRotateCamera, AttachToBoxBehavior, BoundingBoxGizmo, Color3, Engine, HemisphericLight, Mesh, MultiPointerScaleBehavior, Scene, SceneLoader, SixDofDragBehavior, TransformNode, UtilityLayerRenderer, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";
import "babylonjs-loaders";//老是忘记加载这个，致使不能加载模型，代码也不报错
import { GUI3DManager, HolographicButton, PlanePanel } from "babylonjs-gui";

export default class MeshBehavior02 {

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
        //创建相机（参数：名称，水平旋转角度，垂直旋转角度，相机半径，相机距离目标点距离,scene(一般默认只有一个场景)）
        const camera = new ArcRotateCamera('camrea', -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, -3, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light;


        //基础坐标轴
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);

        scene.createDefaultVRExperience({floorMeshes:[]});
//import "babylonjs-loaders";//老是忘记加载这个，致使不能加载模型，代码也不报错
        SceneLoader.LoadAssetContainer('model/', 'seagulf.glb', scene, (container)=>{
            //添加文件到场景中
            container.addAllToScene();

            container.meshes[0].scaling.scaleInPlace(0.005);//缩放和定位加载的模型(从gltf加载的第一个网格是根节点)

            //包裹在边界框网格中，以避免拾取命中率
            const gltfMesh = container.meshes[0] as Mesh;//这个错误是因为gltfMesh的类型是AbstractMesh，而BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox()函数需要的参数类型是Mesh。为了解决这个问题，你可以将gltfMesh强制转换为Mesh类型
            const boundingBox = BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh);
            boundingBox.rotation.y = -Math.PI/2;

            //创建边界框(可见盒子)
            const utilLayer = new UtilityLayerRenderer(scene);
            utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

            const gizmo = new BoundingBoxGizmo(Color3.FromHexString("#0984e3"),utilLayer);//边界框颜色设置
            gizmo.attachedMesh = boundingBox;//边界框绑定模型

            //在VR中创建拖动和缩放指针的行为
            const sixDofDragBehavior = new SixDofDragBehavior();
            boundingBox.addBehavior(sixDofDragBehavior);

            const multiPointerScaleBehavior = new  MultiPointerScaleBehavior();
            boundingBox.addBehavior(multiPointerScaleBehavior);

            //创建工具条（3DUI）：关闭边界框并固定
            const  manager = new GUI3DManager();
            const appBar = new TransformNode('');
            appBar.scaling.scaleInPlace(0.8);//UI界面大小缩放
            const panel = new PlanePanel();
            panel.margin = 0;
            panel.rows = 1
            manager.addControl(panel);

            panel.linkToTransformNode(appBar);
            for(let i = 0; i<1; i++){
                const button = new HolographicButton('orientation');
                panel.addControl(button);
                button.text = "Button #" + panel.children.length;
                if(i==0){
                    button.onPointerClickObservable.add(()=>{
                        if(gizmo.attachedMesh){
                            gizmo.attachedMesh = null;
                            boundingBox.removeBehavior(sixDofDragBehavior);
                            boundingBox.removeBehavior(multiPointerScaleBehavior);
                        }else{
                            gizmo.attachedMesh = boundingBox;
                            boundingBox.removeBehavior(sixDofDragBehavior);
                            boundingBox.removeBehavior(multiPointerScaleBehavior);
                        }
                    });
                }
            }
            //添加行为
            const behavior = new AttachToBoxBehavior(appBar);
            boundingBox.addBehavior(behavior);//将按钮和模型绑定在一起
        });


        //返回该场景
        return scene;
        //链接地址（http://localhost:5173/）
    }
}





//----------------------------------------------------------------------
//----------------------------------------------------------------------
//js代码示例(了解更充分)
//创造相机
// const camera = new BABYLON.ArcRotateCamera(
//     "camera",//相机名称
//     0,//水平旋转角度(alpha值)
//     0,//垂直旋转角度(beta值)
//     10,//相机半径
//     BABYLON.Vector3.Zero(),//相机距离目标点距离
//     scene//场景加载
//   );
//   //设置相机所在的场景
//   camera.setPosition(new BABYLON.Vector3(0, 0, -10));
//   //把相机附加到画布上
//   camera.attachControl(canvas);
//----------------------------------------------------------------------
//创建光源
// const light = new BABYLON.DirectionalLight(
//     "light",//光源名称
//     new BABYLON.Vector3(2, -2, 0),//光源的方向
//     scene//光源所在场景
//   );
//   //设置平行光的颜色
//   light.diffuse = new BABYLON.Color3(1, 1, 1);
//   //设置平行光的高光颜色
//   light.specular = new BABYLON.Color3(1, 1 ,1);
//   //设置平行光的强度
//   light.intensity = 1;
//----------------------------------------------------------------------
//创建立方体(更多见Babylon官方文档)
// const box = BABYLON.MeshBuilder.CreateBox(
//   "box",
//   {height: 2, width: 2},
//   scene
// );
// //位置设置
// box.position.set(0, 0, 4);
// //三轴按比例缩小
// box.scaling.set(0.5, 0.5, 1);
// //饶某一点旋转
// box.rotateAround(
//   new BABYLON.Vector3(0, 0, 0),//旋转点的中心点
//   new BABYLON.Vector3(0, 1, 0),//旋转点的轴
//   Math.PI/4  //旋转的角度
// );