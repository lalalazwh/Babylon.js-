import { Animation, ArcRotateCamera, Axis, Engine, HemisphericLight, MeshBuilder, Scene, SceneLoader, Space, StandardMaterial, Tools, Vector3 } from "babylonjs";
//需要装插件 ：npm i earcut
import * as earcut from 'earcut';
(window as any).earcut = earcut;//因为不知道是用哪个类，就直接选择挂载至windows上

import "babylonjs-loaders";
import Coordinate from "./Coordinate";

export default class VillageAnimation {

    engine: Engine;
    scene: Scene;

    carReady:boolean;

    //参数类型统一
    constructor(private readonly canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas);//获取canvas标签并创建引擎
        this.scene = this.CreateScene();//创建场景,调用函数接收返回后的场景

        //碰撞检测小车(初始状态)(这里其实主要是放在加载模型还未完成，就开启碰撞检测)
        this.carReady = false;
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
        const camera = new ArcRotateCamera('camrea', -Math.PI / 2, Math.PI / 3, 15, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(1, 1, 0), this.scene);
        light;

        //！！！！！！！！！！！！！！！！！！！碰撞检测！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        //碰撞盒子
        const wireMat = new StandardMaterial("wireMat");
        wireMat.wireframe = true;

        //盒子模型构建
        const hitBox = MeshBuilder.CreateBox("carbox",{
            width: 0.5,
            height: 0.6,
            depth: 4.5
        });
        hitBox.material = wireMat;
        hitBox.position.x = 3.1;
        hitBox.position.y = 0.3;
        hitBox.position.z = -5;


        //重点！！！！！！！！！！！！！！（可学）！！！！！！！！！！！！！！！！！！！！！
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);

        //------------------后续可用小车模型+动画！！！！！！！！！！！！！-------------------------------------------
        //base小车（方法1：自己搭建）
        // const car = this.buildCar(scene);
        // car;

        //法2：导入官方模型，进行动画操作
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
            const car = scene.getMeshByName("car")!;
            //汽车加载完成后，设初始状态更改为“true”
            this.carReady = true;
            //起始位置
            car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
            car.position.y = 0.16;
            car.position.x = -3;
            car.position.z = 8;

            const animCar = new Animation("carAnimation", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

            const carKeys = [];

            carKeys.push({
                frame: 0,
                value: 8
            });

            carKeys.push({
                frame: 150,
                value: -7
            });

            carKeys.push({
                frame: 200,
                value: -7
            });

            animCar.setKeys(carKeys);

            car.animations = [];
            car.animations.push(animCar);

            scene.beginAnimation(car, 0, 200, true);

            //wheel animation
            const wheelRB = scene.getMeshByName("wheelRB");
            const wheelRF = scene.getMeshByName("wheelRF");
            const wheelLB = scene.getMeshByName("wheelLB");
            const wheelLF = scene.getMeshByName("wheelLF");

            scene.beginAnimation(wheelRB, 0, 30, true);
            scene.beginAnimation(wheelRF, 0, 30, true);
            scene.beginAnimation(wheelLB, 0, 30, true);
            scene.beginAnimation(wheelLF, 0, 30, true);
        });

        //人物动画（这种方法也是可以设置加载模型的方位华为位置
        // Dude
        SceneLoader.ImportMeshAsync("him",
            "https://playground.babylonjs.com/scenes/Dude/",
            "Dude.babylon",
            scene
        ).then((result) => {
            //获取模型对象赋予变量进行操作
            var dude = result.meshes[0];
            //模型大小比例设置
            dude.scaling = new Vector3(0.008, 0.008, 0.008);
            //模型（初始）位置设置
            dude.position = new Vector3(1.5, 0, -6.9);
            //模型旋转初始角度设置
            dude.rotate(Axis.Y, Tools.ToRadians(-90), Space.LOCAL);//参数：轴线基准，旋转角度，模型所处空间

            const startRoation = dude.rotationQuaternion!.clone();//起始转向角度设置
            scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

            //walk类和构造函数
            class walk {
                turn: number;
                dist: number;
                constructor(turn: number, dist: number) {
                    this.turn = turn;
                    this.dist = dist;
                }
            }
            const track: any[] = [];
            track.push(new walk(180, 2.5));
            track.push(new walk(0, 5));//参数（角度:是当前路径到达后面参数数值后，进行第一个参数的旋转角度， 路径累加和：包括之间的路径长度）
            // track.push(new walk(-93, 16.5));
            // track.push(new walk(48, 25.5));
            // track.push(new walk(-112, 30.5));
            // track.push(new walk(-65, 33.2));
            // track.push(new walk(38, 37.5));
            // track.push(new walk(-98, 45.2));
            // track.push(new walk(0, 47))

            //初始参数（可见Move to Path）
            let distance = 0;
            let step = 0.015;
            let p = 0;
            //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
            //碰撞盒子
            //只要汽车进入危险区域（hitbox）产生交集，则人物模型停止移动
            const hitBox = scene.getMeshByName('carbox')!;
            scene.onBeforeAnimationsObservable.add(()=>{
                if(this.carReady){
                    if(//前一模型 与 （）内模型是否产生交集：intersectsMesh）
                        scene.getMeshByName("car")!.intersectsMesh(hitBox)&&
                        !dude.getChildMeshes()[1].intersectsMesh(hitBox)
                    ){
                        return;
                    }
                }
                dude.movePOV(0, 0, step);
                distance += step;

                if (distance > track[p].dist) {

                    dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
                    p += 1;
                    p %= track.length;
                    //走完一趟，误差还原
                    if (p === 0) {
                        distance = 0;
                        dude.position = new Vector3(1.5, 0, -6.9);
                        dude.rotationQuaternion = startRoation.clone();
                    }
                }

            });
        });


            //调用自定义函数（导入模型）
            // this.ImportMeshes();

            //返回该场景
            return scene;
            //链接地址（http://localhost:5173/）
        }

    // buildCar(scene: Scene) {
    //     //base
    //     const outline = [
    //         new Vector3(-0.3, 0, -0.1),
    //         new Vector3(0.2, 0, -0.1),
    //     ]

    //     //curved front//车前弧面
    //     for (let i = 0; i < 20; i++) {
    //         outline.push(
    //             new Vector3(
    //                 0.2 * Math.cos(i * Math.PI / 40),
    //                 0,
    //                 0.2 * Math.sin(i * Math.PI / 40) - 0.1
    //             ));
    //     }

    //     //top
    //     outline.push(new Vector3(0, 0, 0.1));
    //     outline.push(new Vector3(-0.3, 0, 0.1));

    //     //车身材质：https://assets.babylonjs.com/environments/car.png
    //     //车轮材质：https://assets.babylonjs.com/environments/wheel.png
    //     const carMat = new StandardMaterial('carMat');
    //     //纹理贴图
    //     carMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/car.png");

    //     //贴图设置
    //     const faceUV = [];
    //     faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
    //     faceUV[1] = new Vector4(0, 0, 1, 0.5);
    //     faceUV[2] = new Vector4(0.38, 1, 0, 0.5);


    //     //建立小车(借用封闭函数进行几何体的拉升)
    //     const car = MeshBuilder.ExtrudePolygon('car',
    //         {
    //             shape: outline,
    //             depth: 0.2,
    //             faceUV: faceUV,//贴图位置（数组）赋予对应
    //             wrap: true
    //         });
    //     //材质赋予
    //     car.material = carMat;

    //     //轮子材质对象
    //     const wheelRBMat = new StandardMaterial('wheelRB');
    //     wheelRBMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/wheel.png");

    //     //贴图位置对应
    //     const wheelUV = [];
    //     wheelUV[0] = new Vector4(0, 0, 1, 1);
    //     wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
    //     wheelUV[2] = new Vector4(0, 0, 1, 1);

    //     //轮子(基于第一个轮子的位置进行“克隆)
    //     const wheelRB = MeshBuilder.CreateCylinder(
    //         "wheelRB",
    //         {
    //             diameter: 0.125,
    //             height: 0.05,
    //             faceUV: wheelUV//极易忘记这里进行贴图位置绑定！！！！！！！！！！
    //         });
    //     wheelRB.material = wheelRBMat;
    //     wheelRB.parent = car;//前一章的父对象和子对象（以上面车子的主体为”父对象")
    //     wheelRB.position.z = -0.1;
    //     wheelRB.position.x = -0.2;
    //     wheelRB.position.y = 0.035;

    //     const wheelRF = wheelRB.clone("wheelRF");
    //     wheelRF.position.x = 0.1;

    //     const wheelLB = wheelRB.clone("wheelLB");
    //     wheelLB.position.y = -0.2 - 0.035;

    //     const wheelLF = wheelRF.clone("wheelLF");
    //     wheelLF.position.y = -0.2 - 0.035;

    //     //动画设置！！！！！！！！！！！！！！！！！！！！！！！！
    //     const animWheel = new Animation(
    //         'wheelAnimation',
    //         'rotation.y',//运动方向
    //         30,//动画帧数
    //         Animation.ANIMATIONTYPE_FLOAT,//动画类型
    //         Animation.ANIMATIONLOOPMODE_CYCLE//循环类型
    //     );

    //     //动画关键帧(起点)
    //     const wheelKeys = [];
    //     wheelKeys.push({
    //         frame: 0,
    //         value: 0
    //     });
    //     //动画关键帧(终点点)
    //     wheelKeys.push({
    //         frame: 30,
    //         value: 2 * Math.PI
    //     });

    //     //动画绑定关键帧
    //     animWheel.setKeys(wheelKeys);

    //     //动画绑定物体
    //     wheelRB.animations = [];
    //     wheelRB.animations.push(animWheel);

    //     wheelRF.animations = [];
    //     wheelRF.animations.push(animWheel);
    //     wheelLB.animations = [];
    //     wheelLB.animations.push(animWheel);
    //     wheelLF.animations = [];
    //     wheelLF.animations.push(animWheel);

    //     //物体动画放置在 场景 动画播放设置
    //     scene.beginAnimation(wheelRB, 0, 30, true);
    //     scene.beginAnimation(wheelRF, 0, 30, true);
    //     scene.beginAnimation(wheelLB, 0, 30, true);
    //     scene.beginAnimation(wheelLF, 0, 30, true);

    //     //car(车身) 动画设置：这里以为之前“轮子”已经绑定了“父对象：车身”，
    //     //所以在“已经事先轮子旋转的情况下”，只要车身移动，随之而动的整体（车身+轮子），就营造出汽车跑动的状态
    //     const animCar = new Animation(
    //         "carAnimation",//动画名称
    //         "position.x", //动画移动轴
    //         30, //帧率
    //         Animation.ANIMATIONTYPE_FLOAT, //动画类型
    //         Animation.ANIMATIONLOOPMODE_CYCLE//动画循环方式
    //     );

    //     //关键帧定义（起点 到  终点）
    //     const carKeys = [];

    //     //第一个关键帧
    //     carKeys.push({
    //         frame: 0,
    //         value: -4
    //     });

    //     //第二个关键帧
    //     carKeys.push({
    //         frame: 150,
    //         value: 4
    //     });

    //     //第三个关键帧
    //     carKeys.push({
    //         frame: 210,
    //         value: 4
    //     });

    //     //物体关键帧绑定
    //     animCar.setKeys(carKeys);

    //     //动画与物体绑定
    //     car.animations = [];
    //     car.animations.push(animCar);

    //     //场景动画加载(参数：物体，帧数范围：起-终)
    //     scene.beginAnimation(car, 0, 210, true);


    //     return car;
    // }

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