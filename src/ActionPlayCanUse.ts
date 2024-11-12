import { ActionManager, ArcRotateCamera, Color3, Color4, Engine, IncrementValueAction, InterpolateValueAction, Mesh, MeshBuilder, PointLight, Scene, SetValueAction, StandardMaterial, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class ActionPlayCanUse {

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
        scene.clearColor = new Color4(0, 0, 0, 1);//修改场景scene颜色为黑色！！

        const camera = new ArcRotateCamera('camrea', -Math.PI / 2, Math.PI / 2.5, 300, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        const redlight = new PointLight('redlight', new Vector3(0, 50, 0), this.scene);//使用点光源
        const greenlight = new PointLight('greenlight', new Vector3(0, 50, 0), this.scene);
        const bluelight = new PointLight('bluelight', new Vector3(0, 50, 0), this.scene);

        redlight.diffuse = Color3.Red();
        greenlight.diffuse = Color3.Green();
        bluelight.diffuse = Color3.Blue();

        const axis = new Coordinate(scene);
        axis.showAxis(60);

        //地面
        const ground = MeshBuilder.CreateGround('ground', { width: 1000, height: 1000, updatable: false });
        const gMat = new StandardMaterial('gMat');
        gMat.specularColor = Color3.Black();
        ground.material = gMat;

        //盒子
        const redBox = MeshBuilder.CreateBox('redBox', { size: 20 });
        const redMat = new StandardMaterial('redMat');
        redMat.diffuseColor = new Color3(0.4, 0.4, 0.4);//漫反射颜色
        redMat.specularColor = new Color3(0.4, 0.4, 0.4);//高光反射颜色
        redMat.emissiveColor = Color3.Red();//色彩放射程度
        redBox.material = redMat;
        redBox.position.x = -100;

        const greenBox = MeshBuilder.CreateBox('greenBox', { size: 20 });
        const greenMat = new StandardMaterial('greenMat');
        greenMat.diffuseColor = new Color3(0.4, 0.4, 0.4);//漫反射颜色
        greenMat.specularColor = new Color3(0.4, 0.4, 0.4);//高光反射颜色
        greenMat.emissiveColor = Color3.Green();//色彩放射程度
        greenBox.material = greenMat;
        greenBox.position.z = -100;

        const blueBox = MeshBuilder.CreateBox('blueBox', { size: 20 });
        const blueMat = new StandardMaterial('blueMat');
        blueMat.diffuseColor = new Color3(0.4, 0.4, 0.4);//漫反射颜色
        blueMat.specularColor = new Color3(0.4, 0.4, 0.4);//高光反射颜色
        blueMat.emissiveColor = Color3.Blue();//色彩放射程度
        blueBox.material = blueMat;
        blueBox.position.x = 100;
//****************************************** 可用！：选中模型效果函数   ****************************************************

        //准备(如上，作为效果渲染的准备)
        let prepareButton = function (mesh: Mesh, _color: Color3, _light: PointLight) {
            mesh.actionManager = new ActionManager();
        }
        prepareButton(redBox, Color3.Red(), redlight);
        prepareButton(greenBox, Color3.Green(), greenlight);
        prepareButton(blueBox, Color3.Blue(), bluelight);

        //鼠标选中（事件链：只不过换了物体效果类型而已，所以效果名称一定不能写错，具体的，后面可以查一下官网
        let makeOverOut = function (mesh: Mesh) {
            mesh.actionManager?.registerAction(
                new SetValueAction(
                    ActionManager.OnPointerOverTrigger,
                    mesh,
                    'material.emissiveColor',
                    Color3.White()
                )
            );
            //鼠标离开 颜色恢复原状
            mesh.actionManager?.registerAction(
                new SetValueAction(
                    ActionManager.OnPointerOutTrigger,
                    mesh,
                    'material.emissiveColor',
                    (mesh.material! as StandardMaterial).emissiveColor
                )
            );
            //鼠标选中：放大效果
            mesh.actionManager?.registerAction(
                new InterpolateValueAction(
                    ActionManager.OnPointerOverTrigger,
                    mesh,
                    'scaling',
                    new Vector3(1.1, 1.1, 1.1),
                    150//变化速度：0.15s
                )
            );
            //鼠标选中后滑开：恢复原状
            mesh.actionManager?.registerAction(
                new InterpolateValueAction(
                    ActionManager.OnPointerOutTrigger,
                    mesh,
                    'scaling',
                    new Vector3(1, 1, 1),
                    150
                )
            );
        }
        //带入参数
        makeOverOut(redBox);
        makeOverOut(greenBox);
        makeOverOut(blueBox);

 //    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//*************************************************************************************************************** */



        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   可学，而不是创建三个动画，这个和甜甜圈转动动画的最大区别就是：外面套了函数的壳子： let rotate = function(mesh: Mesh){   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //盒子自转(函数)
        scene.actionManager = new ActionManager();
        let rotate = function (mesh: Mesh) {
            scene.actionManager.registerAction(
                new IncrementValueAction(
                    ActionManager.OnEveryFrameTrigger,
                    mesh,
                    'rotation.y',
                    0.01
                )
            );
        }
        //带入参数
        rotate(redBox);
        rotate(greenBox);
        rotate(blueBox);
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        //球
        const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 20, segments: 16 });
        const sphereMat = new StandardMaterial('sphereMat');
        sphereMat.diffuseColor = new Color3(0.4, 0.4, 0.4);//漫反射颜色
        sphereMat.specularColor = new Color3(0.4, 0.4, 0.4);//高光反射颜色
        sphereMat.emissiveColor = Color3.Yellow();//色彩放射程度
        sphere.material = sphereMat;
        sphere.position.z = 100;

        //甜甜圈
        const donut = MeshBuilder.CreateTorus('dount', { diameter: 20, thickness: 8, tessellation: 60 })
        donut.position.y = 5;
        //动画：转圈
        let alpha = 0;
        scene.registerBeforeRender(() => {
            donut.position.x = Math.cos(alpha) * 100;
            donut.position.z = Math.sin(alpha) * 100;
            alpha += 0.01;//每帧移动，alpha自增0.01 =》转速
        })


        //添加甜甜圈与其他物体的相交动作事件（事件链）
        donut.actionManager = new ActionManager();
        donut.actionManager.registerAction(
            new SetValueAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,//触发器类型：相交进入时候触发
                    parameter: sphere//相交物体对象
                },
                donut,
                'scaling',//变化动作类型
                new Vector3(1.2, 1.2, 1.2)
            )
        );
        donut.actionManager.registerAction(
            new SetValueAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger,//触发器类型：相交进入时候触发
                    parameter: sphere//相交物体对象
                },
                donut,
                'scaling',//变化动作类型
                new Vector3(1, 1, 1)
            )
        );

        return scene;
        //链接地址（http://localhost:5173/）
    }
}

