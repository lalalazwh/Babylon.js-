import { ArcRotateCamera, Color3, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, SpotLight, StandardMaterial, Vector3 } from "babylonjs";

export default class StreeLight {

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
        const camera = new ArcRotateCamera('camrea', -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(10, 4, 50), this.scene);
        light;
        //创建点光源
        // const pointlight = new BABYLON.PointLight(
        //   "pointLight", //点光源名称
        //   new BABYLON.Vector3(-2, 0, 0),//点光源位置
        //   scene
        // );
        // //设置点光源的颜色(RGB)
        // pointlight.diffuse = new BABYLON.Color3(1, 0, 0);
        // //设置点光源的高光颜色（反射颜色）
        // pointlight.specular = new BABYLON.Color3(1, 0, 1);
        // //设置光源的强度、
        // pointlight.intensity = 0.5;

        // //生成阴影
        // //球体生成阴影
        // var shadowGenerator = new BABYLON.ShadowGenerator(1024, spolight);//值越大，阴影越清晰

        //点光源
        //the bulb to the parent
        const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), Math.PI, 10, scene);
        lampLight.diffuse = Color3.Yellow();

        //shape to extrude
        const lampShape = [];
        for (let i = 0; i < 20; i++) {
            lampShape.push(new Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
        }
        lampShape.push(lampShape[0]); //close shape

        //extrusion path
        const lampPath = [];
        lampPath.push(new Vector3(0, 0, 0));
        lampPath.push(new Vector3(0, 10, 0));
        for (let i = 0; i < 20; i++) {
            lampPath.push(new Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
        }
        lampPath.push(new Vector3(3, 11, 0));

        const yellowMat = new StandardMaterial("yellowMat");
        yellowMat.emissiveColor = Color3.Yellow();

        //extrude lamp
        const lamp = MeshBuilder.ExtrudeShape("lamp", { cap: Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5 });

        //add bulb
        const bulb = MeshBuilder.CreateSphere("bulb", { diameterX: 1.5, diameterZ: 0.8 });

        bulb.material = yellowMat;
        bulb.parent = lamp;
        bulb.position.x = 2;
        bulb.position.y = 10.5;

        lampLight.parent = bulb;

        const ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50 });
        ground;

        //返回该场景
        return scene;
        //链接地址（http://localhost:5173/）
    }
}





//----------------------------------------------------------------------
//----------------------------------------------------------------------
//js代码示例(了解更充分)
//创造相机
// const camera = new ArcRotateCamera(
//     "camera",//相机名称
//     0,//水平旋转角度(alpha值)
//     0,//垂直旋转角度(beta值)
//     10,//相机半径
//     Vector3.Zero(),//相机距离目标点距离
//     scene//场景加载
//   );
//   //设置相机所在的场景
//   camera.setPosition(new Vector3(0, 0, -10));
//   //把相机附加到画布上
//   camera.attachControl(canvas);
//----------------------------------------------------------------------
//创建光源
// const light = new DirectionalLight(
//     "light",//光源名称
//     new Vector3(2, -2, 0),//光源的方向
//     scene//光源所在场景
//   );
//   //设置平行光的颜色
//   light.diffuse = new Color3(1, 1, 1);
//   //设置平行光的高光颜色
//   light.specular = new Color3(1, 1 ,1);
//   //设置平行光的强度
//   light.intensity = 1;
//----------------------------------------------------------------------
//创建立方体(更多见Babylon官方文档)
// const box = MeshBuilder.CreateBox(
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
//   new Vector3(0, 0, 0),//旋转点的中心点
//   new Vector3(0, 1, 0),//旋转点的轴
//   Math.PI/4  //旋转的角度
// );