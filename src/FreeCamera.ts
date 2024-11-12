import { ArcRotateCamera, Color3, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class BasicScene {

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
        const camera = new ArcRotateCamera('camrea', Math.PI/2, 
        Math.PI/2.3, 10, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机(按住Ctrl键 点击物体可以进行拖动，若不想，则可限制第三个参数为：false)
        //以鼠标所在位置为缩放原点
        camera.zoomToMouseLocation = true;
        //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        camera.wheelDeltaPercentage = 0.005;//控制相机缩放速度！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！

        // //01通用相机
        // const camera = new UniversalCamera('camera', new Vector3(0, 5, -10));

        // camera.setTarget(Vector3.Zero());//相机视角初始看向 零点

        // //给鼠标滚轮加入事件，使其可以对视角进行放缩
        // camera.inputs.addMouseWheel();

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light;

        // const box = MeshBuilder.CreateBox("box");
        // box;

        //材料
        const redMat = new StandardMaterial('red');
        redMat.diffuseColor = Color3.Red();
        redMat.emissiveColor = Color3.Red();
        redMat.specularColor = Color3.Red();

        const greenMat = new StandardMaterial('green');
        greenMat.diffuseColor = Color3.Green();
        greenMat.emissiveColor = Color3.Green();
        greenMat.specularColor = Color3.Green();

        const blueMat = new StandardMaterial('blue');
        blueMat.diffuseColor = Color3.Blue();
        blueMat.emissiveColor = Color3.Blue();
        blueMat.specularColor = Color3.Blue();

        //平面
        const pRed = MeshBuilder.CreatePlane('pRed',{size:2, sideOrientation: Mesh.DOUBLESIDE});
        pRed.position.x = -3;//通过位移，使得平面在同一摄像机下的选择角度设置
        pRed.position.z = 0;
        pRed.material = redMat;

        const pGreen = MeshBuilder.CreatePlane('pRed',{size:2, sideOrientation: Mesh.DOUBLESIDE});
        pGreen.position.x = 3;
        pGreen.position.z = -1.5;
        pGreen.material = greenMat;

        const pBlue = MeshBuilder.CreatePlane('pRed',{size:2, sideOrientation: Mesh.DOUBLESIDE});
        pBlue.position.x = 3;
        pBlue.position.z = 1.5;
        pBlue.material = blueMat;



        //基础坐标轴
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(10);


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