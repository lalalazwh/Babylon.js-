import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, PointerDragBehavior, Scene, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class MeshBehavior01{

    engine: Engine;
    scene: Scene;

    //参数类型统一
    constructor(private readonly canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas);//获取canvas标签并创建引擎
        this.scene = this.CreateScene();//创建场景,调用函数接收返回后的场景
        //渲染场景(循环调用)
        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })
    }

    //创建函数（场景）
    CreateScene():Scene{
        //这里就可以直接套用Babylonjs的官网文档示例代码,但视频教程稍有区别，此处更显模块化
        //创建场景
        const scene = new Scene(this.engine);
        //创建相机（参数：名称，水平旋转角度，垂直旋转角度，相机半径，相机距离目标点距离,scene(一般默认只有一个场景)）
        const camera = new ArcRotateCamera('camrea',-Math.PI/2, Math.PI/2.5, 10, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light;

        //基础坐标轴
        const axis = new Coordinate(scene);
        axis.showAxis(10);

        //创建面
        var sphere = MeshBuilder.CreateSphere('sphere', {segments:16, diameter:2},scene);
        sphere.rotation.x = Math.PI/2;//相机旋转角度
        sphere.position.y = 1;

        //创建地面
        var ground = MeshBuilder.CreateGround('ground', {width:6, height:6, subdivisions:2}, scene);
        ground;

        //创建模型移动轴:设定移动轴向
        var pointerDragBehavior = new PointerDragBehavior({dragAxis:new Vector3(1, 0, 0)});//此处就是沿着x轴向进行移动

        //移动行为设定
        pointerDragBehavior.useObjectOrientationForDragging = false;//默认情况下，拖动平面将在每一帧上更新。若要禁用此功能

        //拖动监听行为事件(判断当前拖动行为是否发生)
        pointerDragBehavior.onDragStartObservable.add(()=>{//开始行为
            console.log("dragStart");
            console.log();
        })

        pointerDragBehavior.onDragObservable.add(()=>{
            console.log("drag");
            console.log();
        })

        pointerDragBehavior.onDragEndObservable.add(()=>{//结束行为
            console.log("dragEnd");
            console.log();
        })

        sphere.addBehavior(pointerDragBehavior);

        

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