import { ActionManager, ArcRotateCamera, Color3, Engine, HemisphericLight, InterpolateValueAction, MeshBuilder, PredicateCondition, Scene, SetValueAction, StandardMaterial, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class ActionMesh {

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
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        //基础坐标轴
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);

        //(1)实现box点击变色效果
        const box = MeshBuilder.CreateBox('box');
        box.material = new StandardMaterial('mat');
        //添加事件
        box.actionManager = new ActionManager();
        box.actionManager.registerAction(
            new InterpolateValueAction(
                ActionManager.OnPickTrigger,//鼠标点击触发器
                light,
                'diffuse',
                Color3.Blue(),
                1000 //事件动画帧数(1s)
            )
        )?.then(//点击第二次触发的事件
            new SetValueAction(
                ActionManager.NothingTrigger,//构成框架触发器
                box,
                'material.wireframe',//调用的触发器名称，名称错了，效果不显示
                true
            )
        ).then(//循环操作=》取消线框=》取消蓝色（恢复原装）
            new SetValueAction(
                ActionManager.NothingTrigger,//构成框架触发器
                box,
                'material.wireframe',//调用的触发器名称，名称错了，效果不显示
                false//关掉就行
            )
        ).then(
            new InterpolateValueAction(
                ActionManager.OnPickTrigger,//鼠标点击触发器
                light,
                'diffuse',
                Color3.Gray(),//颜色再变回来就行
                1000 //事件动画帧数(1s) 1000ms = 1s
            )
        );//构成循环效果


        //给box添加第二个事件：当物体变为Gray色后，相机旋转归到原位置
        box.actionManager.registerAction(//需要再次注册一个行为事件
            new InterpolateValueAction(
                ActionManager.OnPickDownTrigger,
                camera,
                'alpha',
                0,
                500,//(0.5s)
                new PredicateCondition(//事件执行条件
                    box.actionManager as ActionManager,
                    () => {
                        return light.diffuse.equals(Color3.Gray());//当无疑变为灰色后，再点击物体，相机复位
                    }
                )
            )
        );

        //box事件三：与其他物体相加：进入or离开时发生动画
        //进入
        const sphere = MeshBuilder.CreateSphere('sphere');
        sphere.position.x = 3;

        box.actionManager.registerAction(
            new SetValueAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter:{
                        mesh:sphere,
                        usePreciseInterscetion: true//与哪个模型发生交集，进行相应改变
                    }
                },
                box,
                'scaling',
                new Vector3(1, 2, 1)
            )
        )
        //离开
        box.actionManager.registerAction(
            new SetValueAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger,
                    parameter:{
                        mesh:sphere,
                        usePreciseInterscetion: true
                    }
                },
                box,
                'scaling',
                new Vector3(1, 1, 1)
            )
        )

        //渲染检测
        let delta = 0;
        scene.registerBeforeRender(()=>{
            box.position.x = Math.sin(delta) * 3;
            delta += 0.01;
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