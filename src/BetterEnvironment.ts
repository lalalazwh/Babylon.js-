import { Animation, ArcRotateCamera, Axis, Color3, Color4, CubeTexture, DirectionalLight, Engine, Mesh, MeshBuilder, ParticleSystem, PointerEventTypes, Scene, SceneLoader, ShadowGenerator, Space, SpotLight, Sprite, SpriteManager, StandardMaterial, Texture, Tools, Vector3 } from "babylonjs";
//通过阴影的深浅，来形成高度不同的地形
import "babylonjs-loaders";
import "babylonjs-gui";
import Coordinate from "./Coordinate";
import { AdvancedDynamicTexture, Control, Slider, StackPanel, TextBlock } from "babylonjs-gui";
export default class BetterEnvironment {

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
        const camera = new ArcRotateCamera('camrea', 
        Math.PI / 2, 
        Math.PI / 2.5, 
        150, 
        new Vector3(0, 60, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机
        camera.upperBetaLimit = Math.PI /2.2;
        camera.minZ = 0.45;
        camera.speed = 0.055;

        // //官方跟随镜头设置(缺点：不能人为控制)
        // const camera = new FollowCamera('followCamera',
        // new Vector3(-6, 0, 0));

        // camera.radius = 1;
        // camera.heightOffset = 6;//高度设置
        // camera.rotationOffset = 0;
        // camera.cameraAcceleration = 0.005;//移动速度（跟随模型，避免出现模型旋转出现镜头猛的切换
        // camera.maxCameraSpeed = 10;


        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        // const light = new HemisphericLight('light', new Vector3(1, 1, 1), this.scene);
        // light.intensity = 1;//修改灯光强调

        //创建模型阴影！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        //控制光的照射方向形成指定阴影
        const light = new DirectionalLight('dir1', new Vector3(0, -2, 1), scene);
        light.position = new Vector3(20, 50, -100);

        const shadowGenerator = new ShadowGenerator(1024, light);//阴影产生的网格，有哪种光产生

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
        track.push(new walk(86, 7));
        track.push(new walk(-85, 14.8));//参数（角度:是当前路径到达后面参数数值后，进行第一个参数的旋转角度， 路径累加和：包括之间的路径长度）
        track.push(new walk(-93, 16.5));
        track.push(new walk(48, 25.5));
        track.push(new walk(-112, 30.5));
        track.push(new walk(-65, 33.2));
        track.push(new walk(38, 37.5));
        track.push(new walk(-98, 45.2));
        track.push(new walk(0, 47))

        SceneLoader.ImportMeshAsync("him",
            "https://playground.babylonjs.com/scenes/Dude/",
            "Dude.babylon",
            scene
        ).then((result) => {
            //获取模型对象赋予变量进行操作
            var dude = result.meshes[0];
            //模型大小比例设置
            dude.scaling = new Vector3(0.008, 0.008, 0.008);

            shadowGenerator.addShadowCaster(dude, true);//影响绑定

            //模型（初始）位置设置
            dude.position = new Vector3(-6, 0, 0);
            //模型旋转初始角度设置
            dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);//参数：轴线基准，旋转角度，模型所处空间




            const startRoation = dude.rotationQuaternion!.clone();//起始转向角度设置

            // //设置相机在模型加载后的位置（利用之前的“父子对象”）法1
            camera.parent = dude;

            // //法2（官方
            // camera.lockedTarget = dude;


            scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

            //初始参数（可见Move to Path）
            let distance = 0;
            let step = 0.01;
            let p = 0;
            //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
            dude.movePOV(0, 0, step);
            distance += step;

            scene.onBeforeRenderObservable.add(() => {
                dude.movePOV(0, 0, step);
                distance += step;

                if (distance > track[p].dist) {

                    dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
                    p += 1;
                    p %= track.length;
                    if (p === 0) {
                        distance = 0;
                        dude.position = new Vector3(-6, 0, 0);
                        dude.rotationQuaternion = startRoation.clone();
                    }
                }

            })

        });


        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!灯光GUI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        //UI操作盘设置
        const pannel = new StackPanel();
        pannel.width = '220px';
        pannel.top = '-25px';
        //位置模式设置
        pannel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        pannel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        adt.addControl(pannel);

        //UI字样
        const header = new TextBlock();
        header.text = 'Night to Day';
        header.height = '30px';
        header.color = 'white';

        pannel.addControl(header);

        //控制条滑轨
        const slider = new Slider();
        slider.minimum = 0;
        slider.maximum = 3;
        slider.borderColor = 'black';//边框颜色
        slider.color = 'gray';
        slider.background = 'white';
        slider.value = 1;//初始值
        slider.height = '20px';
        slider.width = '200px';
        //添加滑动事件
        slider.onValueChangedObservable.add((value) => {
            if (light) {
                light.intensity = value;
            }
        })

        pannel.addControl(slider);


        //重点！！！！！！！！！！！！！！（可学）！！！！！！！！！！！！！！！！！！！！！
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);

        //天空盒设置（本质上就是六张正方形的（天空）图片进行合成一个盒子
        const skybox = MeshBuilder.CreateBox('skybox', { size: 150 });
        const skyboxMat = new StandardMaterial('skyboxMat');
        skyboxMat.backFaceCulling = false;
        skyboxMat.reflectionTexture = new CubeTexture(
            'https://playground.babylonjs.com/textures/skybox',
            scene
        );
        // 材质模式转变“！”作用同之前
        skyboxMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        //看不见的地方的颜色设置
        skyboxMat.diffuseColor = new Color3(0, 0, 0);
        skyboxMat.specularColor = new Color3(0, 0, 0);

        skybox.material = skyboxMat;

        //调节限制摄像机角度，防止穿帮()
        camera.attachControl(this.canvas, true);//允许鼠标控制相机
        camera.upperBetaLimit = Math.PI / 2.2;

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // //创造地形
        // const groundMat = new StandardMaterial('groundMat');
        // groundMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/villagegreen.png');
        // groundMat.diffuseTexture.hasAlpha = true;

        // const ground = MeshBuilder.CreateGround('ground', { width: 24, height: 24 });
        // ground.material = groundMat;


        // //Create large ground for valley environment
        // const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround",
        //     "https://assets.babylonjs.com/environments/villageheightmap.png",
        //     { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 });
        // //参数说明：subdivisions：20 = 将地形的细分网格数 = 20*20 =400，细分程度越高，地形精确度越高

        // //地形材质
        // const largeGroundMat = new StandardMaterial("groundMat");
        // //材质文件绑定
        // largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png");

        // largeGround.material = largeGroundMat;
        // //避免材质重叠渲染时，出现冲突（位置错开一点）
        // largeGround.position.y = -0.01;

        //valleyvillage（包含上述注释部分）
        SceneLoader.ImportMeshAsync(
            "",
            "https://assets.babylonjs.com/meshes/",
            "valleyvillage.glb"
        ).then(()=>{
            const ground = scene.getMeshByName('ground')!;//获取官方模型中的地面（便于在地面反射阴影）
            ground.receiveShadows = true;
        });

        //小车动画
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
            const car = scene.getMeshByName("car")!;
            car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
            car.position.y = 0.16;
            car.position.x = -3;
            car.position.z = 8;

            const animCar = new Animation("carAnimation", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

            const carKeys = [];

            carKeys.push({
                frame: 0,
                value: 10
            });


            carKeys.push({
                frame: 200,
                value: -15
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

        //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        //种树（2D图片始终朝向“摄像机”=>伪3D效果
        const spriteManagerTrees = new SpriteManager('spriteManagerTrees',
            "https://playground.babylonjs.com/textures/palm.png",
            2000,//容量（棵树）
            { width: 512, height: 1024 },//单元图片大小（尺寸：应该是像素）
            scene
        );

        //利用循环 进行放置（种树区域1）
        for (let i = 0; i < 500; i++) {
            const tree = new Sprite('tree', spriteManagerTrees);
            tree.position = new Vector3(
                Math.random() * -30,
                0.5,
                Math.random() * 20 + 8
            );
        }

        //利用循环 进行放置（种树区域2）
        for (let i = 0; i < 500; i++) {
            const tree = new Sprite('tree', spriteManagerTrees);
            tree.position = new Vector3(
                Math.random() * 25 + 7,//X面
                0.5,//Y面
                Math.random() * -30 + 8//Z面
            );
        }

        //UFO 2D动画
        const spriteManagerUFO = new SpriteManager(
            "UFOManager",
            "https://assets.babylonjs.com/environments/ufo.png",
            1,
            { width: 128, height: 76 },
            scene
        );
        //同上，只不过是结合动画
        const ufo = new Sprite("ufo", spriteManagerUFO);
        ufo.playAnimation(0, 16, true, 125);
        ufo.position.y = 5;
        ufo.position.z = 0;
        ufo.width = 2;
        ufo.height = 1;
        //也可采用外部模型加载，例如“坐标系的导入

        //截面旋转成3D（旋转体：高数）
        const fountainProfile = [
            new Vector3(0, 0, 0),
            new Vector3(0.5, 0, 0),
            new Vector3(0.5, 0.2, 0),
            new Vector3(0.4, 0.2, 0),
            new Vector3(0.4, 0.05, 0),
            new Vector3(0.05, 0.1, 0),
            new Vector3(0.05, 0.8, 0),
            new Vector3(0.15, 0.9, 0)
        ];
        const fountain = MeshBuilder.CreateLathe('fountain', {
            shape: fountainProfile,
            sideOrientation: Mesh.DOUBLESIDE
        });
        fountain.position.x = -4;
        fountain.position.z = -6;

        //喷泉粒子效果
        //粒子制作
        const particleSystem = new ParticleSystem('particleSystem', 5000, scene);
        particleSystem.particleTexture = new Texture('https://playground.babylonjs.com/textures/flare.png')

        //粒子发射位置
        particleSystem.emitter = new Vector3(-4, 1, -6);
        //粒子在不同发射位置的大小
        particleSystem.minEmitBox = new Vector3(-0.01, 0, 0);
        particleSystem.maxEmitBox = new Vector3(0.01, 0, 0);

        //颜色(color1和color2是粒子颜色随机变换的范围)
        particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new Color4(0, 0, 0.2, 0);//粒子消失时候的颜色

        //粒子尺寸
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.15;//同上

        //粒子的生命周期
        particleSystem.minLifeTime = 2;//单位：秒
        particleSystem.maxLifeTime = 3.5;

        //粒子发射速率
        particleSystem.emitRate = 1500;

        //混合模式
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

        //重力
        particleSystem.gravity = new Vector3(0, -9.81, 0);

        //发射方向
        particleSystem.direction1 = new Vector3(-1, 1, 1);
        particleSystem.direction2 = new Vector3(1, 1.5, -1);

        //
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        //速度
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 2;
        particleSystem.updateSpeed = 0.025;

        //启动
        particleSystem.start();

        //！！！！！！！！！！！！！！！！！！！！！！！！事件控制！！！！！！！！！！！！！！！！！！！！！！！！！！
        let switched = false;
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN://点击鼠标后
                    //在此基础上在点击模型
                    if (pointerInfo.pickInfo?.hit) {
                        const pickMesh = pointerInfo.pickInfo.pickedMesh;
                        if (pickMesh == fountain) {//若点击的模型时之前的“喷泉fountain"
                            switched = !switched;//切换开关(利用“取反” ，而不是“不等于”)
                        }
                        //判断当前开关状态
                        if (switched) {
                            particleSystem.start();
                        }
                        else {
                            particleSystem.stop();
                        }
                    }
            }
        });
        //添加路灯(官方模型)
        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "lamp.babylon").then(() => {
            const lampLight = new SpotLight("lampLight",
                Vector3.Zero(),
                new Vector3(0, -1, 0),
                0.8 * Math.PI,
                0.01,
                scene);

            lampLight.diffuse = Color3.Yellow();
            lampLight.parent = scene.getMeshByName("bulb")!;


            const lamp = scene.getMeshByName("lamp")!;
            lamp.position = new Vector3(2, 0, 2);
            lamp.rotation = Vector3.Zero();
            lamp.rotation.y = -Math.PI / 4;

            const lamp3 = lamp.clone("lamp3", null)!;
            lamp3.position.z = -8;

            const lamp1 = lamp.clone("lamp1", null)!;
            lamp1.position.x = -8;
            lamp1.position.z = 1.2;
            lamp1.rotation.y = Math.PI / 2;

            const lamp2 = lamp1.clone("lamp2", null)!;
            lamp2.position.x = -2.7;
            lamp2.position.z = 0.8;
            lamp2.rotation.y = -Math.PI / 2;

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