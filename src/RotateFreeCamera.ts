import { Engine, FreeCamera, HemisphericLight, ICameraInput, KeyboardInfo, MeshBuilder, Observer, Scene, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";
import { Nullable } from "babylonjs/index";

export default class RotateFreeCamera{

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
        const camera = new FreeCamera('camrea',new Vector3(0, 3, -15));

        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");//删掉键盘默认输入

//！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        //进行自定义输入
        camera.inputs.add(new FreeCameraKeyboardRotateInput(0.01));//与下面自定义类进行同步:()内为旋转灵敏度输入设置
        // camera.inputs.attached.KeyboardRotate.
//！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！

        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        //基础坐标轴
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);

        const box = MeshBuilder.CreateBox('box',{size:2});
        box.position.y = 1;

        const ground = MeshBuilder.CreateGround('ground',{height: 6, width: 6, subdivisions:2});
        ground;


        //返回该场景
        return scene;
        //链接地址（http://localhost:5173/）
    }
}


//实现键盘输入（自定义
class FreeCameraKeyboardRotateInput implements ICameraInput<FreeCamera>{
    camera!: FreeCamera;

    // public sensility = 0.01;//灵敏度设置

    rotateObsv: Nullable<Observer<KeyboardInfo>> = null;//记录旋转值

    constructor(public sensility:number) {}

    getClassName(): string {
        return 'FreeCameraKeyboardRotateInput';
    }
    getSimpleName(): string {
        return 'KeyboardRotate';
    }
    attachControl(_noPreventDefault?: boolean | undefined): void {
        const scene = this.camera.getScene();
        this.rotateObsv = scene.onKeyboardObservable.add((kbInfo)=>{
            console.log(kbInfo.event.key);//控制台输出相应按键
            switch(kbInfo.event.key){
                case 'ArrowLeft'://这里指的是 左右箭头按键，当然也可设定成W w等
                    this.camera.cameraRotation.y += this.sensility;
                    break;
                case 'ArrowRight':
                    this.camera.cameraRotation.y -= this.sensility;
                    break;
            }
        });
    }
    detachControl(): void {
        if(this.rotateObsv){
            this.camera.getScene().onKeyboardObservable.remove(this.rotateObsv);
        }
    }
    checkInputs?: (() => void) | undefined;
    
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