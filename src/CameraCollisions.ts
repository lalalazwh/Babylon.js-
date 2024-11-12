import { Color3, Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class CameraCollisions {

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
        //设置场景重力及其zhongli方向
        scene.gravity = new Vector3(0, -0.98, 0);

        //将场景的碰撞检测打开
        scene.collisionsEnabled = true;

        const camera = new FreeCamera('camera', new Vector3(8, 2, -10));//鼠标可控制相机类型
        camera.attachControl(this.canvas, true);//允许鼠标控制相机
        camera.setTarget(Vector3.Zero());
        camera.minZ = 0.5;//物体内部不显示

        camera.speed = 0.4;//控制相机移动速度

        //相机绑定应用重力
        camera.applyGravity = true;
        //定义碰撞体外壳
        camera.ellipsoid = new Vector3(1, 1, 1);//摄像机中心视角站位(摄像机本身构建物体进行碰撞检测）
        //打开相机的碰撞检测
        camera.checkCollisions = true;

        

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.5;

        const ground = MeshBuilder.CreateGround('ground', { width: 30, height: 30 });
        //打开地面的碰撞检测
        ground.checkCollisions = true;

        const gMat = new StandardMaterial('gMat');
        gMat.diffuseColor = Color3.White();
        gMat.backFaceCulling = false;
        ground.material = gMat;
        ground.position.y = -0.5;

        const bMat = new StandardMaterial('bMat');
        bMat.diffuseTexture = new Texture('https://playground.babylonjs.com/textures/crate.png');
        const box = MeshBuilder.CreateBox('box', { width: 10 });
        box.material = bMat;
        //打开box的碰撞检测
        box.checkCollisions = true;

        const box2 = MeshBuilder.CreateBox('box2');

        const box3 = MeshBuilder.CreateBox('box3');

        const box4 = MeshBuilder.CreateBox('box4');
        box2.material = bMat;
        box3.material = bMat;
        box4.material = bMat;
        box2.position = new Vector3(3, 0, 5);
        box3.position = new Vector3(-3, 0, 5);
        box4.position = new Vector3(3, 0, -5);
        box2.checkCollisions = true;
        box3.checkCollisions = true;
        box4.checkCollisions = true;



        //基础坐标轴
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);


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