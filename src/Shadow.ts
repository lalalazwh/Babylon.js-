import { ArcRotateCamera, DirectionalLight, Engine, MeshBuilder, Scene, SceneLoader, ShadowGenerator, Vector3 } from "babylonjs";
import 'babylonjs-loaders';
import Coordinate from "./Coordinate";

export default class Shadow {

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
        const camera = new ArcRotateCamera('camrea', -Math.PI / 2, Math.PI / 2.5, 50, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //重点！！！！！！！！！！！！！！（可学）！！！！！！！！！！！！！！！！！！！！！
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);

        //创建模型阴影！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        //控制光的照射方向形成指定阴影
        const light = new DirectionalLight('dir1', new Vector3(0, -1, 1), scene);
        light.position = new Vector3(0, 15, -10);

        const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 1 });
        ground.receiveShadows = true;//地面接收投影

        const shadowGenerator = new ShadowGenerator(1024, light);//阴影产生的网格，有哪种光产生

        SceneLoader.ImportMesh('him',
            'https://playground.babylonjs.com/scenes/Dude/',
            'Dude.babylon',
            scene,
            function (newMeshes2, _particleSystem2, skeletons2) {
                const dude = newMeshes2[0];
                dude.scaling = new Vector3(0.2, 0.2, 0.2);

                shadowGenerator.addShadowCaster(dude, true);//阴影网格与哪个模型进行绑定

                scene.beginAnimation(skeletons2[0], 0, 100, true);
            }
        );



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