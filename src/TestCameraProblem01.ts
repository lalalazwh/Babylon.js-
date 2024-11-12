import { AssetsManager, Color3, CubeTexture, Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, SceneLoader, StandardMaterial, Texture, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";
import "babylonjs-loaders";
export class TestCameraProblem01 {

  engine: Engine;
  scene: Scene;

  //参数类型统一
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);//获取canvas标签并创建引擎
    this.scene = this.CreateScene();//创建场景,调用函数接收返回后的场景
    //场景函数
    this.CreateEnvironment();

    //相机函数
    this.CreateController();

    //渲染场景(循环调用)
    this.engine.runRenderLoop(() => {
      this.scene.render();
    })
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const light = new HemisphericLight('hemi', new Vector3(8, 8, 3), this.scene);
    light.intensity = 0.6;

    // //鼠标指针锁，即点击鼠标一下，就可以松开手指进行画面的转动
    // scene.onPointerDown = (evt) => {
    //   if (evt.button === 0) this.engine.enterPointerlock();//指针锁 0=鼠标左键
    //   if (evt.button === 1) this.engine.exitPointerlock();//指针锁开 1=鼠标中间
    // }

    //重力环境设置
    const framesPerSecond = 60;//帧数
    const gravity = -9.81;

    scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
    //场景碰撞点
    scene.collisionsEnabled = true;

    return scene;
  }

  //创造环境
  CreateEnvironment(): void {
    //*************************************************基础一：地面+天空盒+道路建模*********************************************
    //创建地面
    const ground = MeshBuilder.CreateGround("ground", { width: 500, height: 500 }, this.scene);
    ground.position.y = -1;

    const redMat = new StandardMaterial('red');
    redMat.diffuseColor = Color3.Blue();
    redMat.emissiveColor = Color3.Gray();
    redMat.specularColor = Color3.Green();
    //天空盒设置（本质上就是六张正方形的（天空）图片进行合成一个盒子
    const skybox = MeshBuilder.CreateBox('skybox', { size: 500 });
    const skyboxMat = new StandardMaterial('skyboxMat');
    skyboxMat.backFaceCulling = false;
    skyboxMat.reflectionTexture = new CubeTexture(
      'https://playground.babylonjs.com/textures/skybox',
      this.scene
    );
    // 材质模式转变“！”作用同之前
    skyboxMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    //看不见的地方的颜色设置
    skyboxMat.diffuseColor = new Color3(0, 0, 0);
    skyboxMat.specularColor = new Color3(0, 0, 0);

    skybox.material = skyboxMat;


    // //自定义模型地形加载 方式一
    //  var assetsManager = new AssetsManager(this.scene);
    //  var meshBase = assetsManager.addMeshTask("","","model/","BaseGround.glb");
    //  //模型设置
    //  meshBase.onSuccess = function(task){
    //   task.loadedMeshes[0].position = new Vector3(0,0,10);//模型位置
    //   task.loadedMeshes[0].scaling = new Vector3(1, 1 ,1);//模型放缩
    //   // task.loadedMeshes[0].rotateAround(
    //   //   new Vector3(0, 0, 0),//旋转点的中心点
    //   //   new Vector3(0, 1, 0),//旋转点的轴
    //   //   -Math.PI/2 //旋转的角度
    //   // );
    //   // task.loadedMeshes[0].checkCollisions = true; // 添加碰撞检测ee 
    //  }

    //      //模型加载到场景
    //      assetsManager.load();
    //模型加载 方式二
    SceneLoader.ImportMeshAsync("", "model/", "BaseGround-02.glb").then(() => {
      const BaseGround = this.scene.getMeshByName("BaseGround")!;
      BaseGround.checkCollisions = true;

    });

    const axis = new Coordinate(this.scene);
    axis.showAxis(4);

    //场景物体增加碰撞检查
    ground.checkCollisions = true;

    //基础二：区域建筑模型设置
    var assetsManager_teach = new AssetsManager(this.scene);
    var meshTask = assetsManager_teach.addMeshTask("", "", "model/", "办公楼01.gltf");
    var meshTask2 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼02.gltf");
    var meshTask3 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼03.gltf");
    var meshTask4 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼04.gltf");
    var meshTask5 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼05.gltf");
    var meshTask5_1 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼05.gltf");
    var meshTask5_2 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼05.gltf");
    var meshTask5_3 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼05.gltf");
    var meshTask5_4 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼05.gltf");
    var meshTask5_5 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼05.gltf");
    var meshTask6 = assetsManager_teach.addMeshTask("", "", "model/", "办公楼06.glb");
    var meshTask7_1 = assetsManager_teach.addMeshTask("", "", "model/", "科技楼01.glb");
    var meshTask7_2 = assetsManager_teach.addMeshTask("", "", "model/", "科技楼02.glb");
    var meshTask7_3 = assetsManager_teach.addMeshTask("", "", "model/", "科技楼03.glb");
    var meshTask7_3_1 = assetsManager_teach.addMeshTask("", "", "model/", "科技楼03.glb");
    var meshTask7_3_2 = assetsManager_teach.addMeshTask("", "", "model/", "科技楼03.glb");
    var meshTask8_1_1 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼01.glb");
    var meshTask8_1_2 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼01.glb");
    var meshTask8_1_3 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼01.glb");
    var meshTask8_1_4 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼01.glb");
    var meshTask8_1_5 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼01.glb");
    var meshTask8_2_1 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_2 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_3 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_4 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_5 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_6 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_7 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_8 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_9 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb");
    var meshTask8_2_10 = assetsManager_teach.addMeshTask("", "", "model/", "宿舍楼02.glb")

    //教学区
    //模型1设置
    meshTask.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-35, 0, 120);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
      // 将加载完成的网格传递给 makeOverOut 函数
    }

    //模型2设置
    meshTask2.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(80, 0, 80);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    //模型3设置
    meshTask3.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-80, 0, 0);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(1, 1, 1);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    //模型4设置
    meshTask4.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(100, 0, 60);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    //模型5设置
    meshTask5.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(70, 0, 100);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask5_1.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(150, 0, 100);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask5_2.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(150, 0, 140);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask5_3.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(70, 0, 140);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask5_4.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(70, 0, 180);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask5_5.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(150, 0, 180);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    //模型6设置
    meshTask6.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(160, 0, -180);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        0  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    //模型7-1设置
    meshTask7_1.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-160, 0, 90);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.6, 0.6, 0.6);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    //模型7-2设置
    meshTask7_2.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(10, 0, 160);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }

    //模型7-3设置
    meshTask7_3.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-55, 0, 180);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.6, 0.6, 0.6);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask7_3_1.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-55, 0, 150);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.6, 0.6, 0.6);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask7_3_2.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-55, 0, 120);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.6, 0.6, 0.6);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }

    //模型8-1设置
    meshTask8_1_1.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(40, 0, -20);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 1  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_1_2.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(100, 0, -20);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 1  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_1_3.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(160, 0, -20);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 1  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_1_4.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(40, 0, -55);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 1  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_1_5.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(100, 0, -55);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 1  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }

    //模型8-2设置
    meshTask8_2_1.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(110, 0, 20);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_2_2.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(150, 0, 20);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_2_3.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(190, 0, 20);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_2_4.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(190, 0, 50);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_2_5.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(150, 0, 50);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        -Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }

    meshTask8_2_6.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-120, 0, -180);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }

    meshTask8_2_7.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-160, 0, -180);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }

    meshTask8_2_8.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-200, 0, -180);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_2_9.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-200, 0, -150);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }
    meshTask8_2_10.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(-160, 0, -150);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(0.9, 0.9, 0.9);//模型大小缩放
      task.loadedMeshes[0].rotateAround(
        new Vector3(0, 0, 0),//旋转点的中心点
        new Vector3(0, 1, 0),//旋转点的轴
        Math.PI / 2  //旋转的角度
      );
      task.loadedMeshes[0].checkCollisions = true;
    }


    //模型加载到场景
    assetsManager_teach.load();
    //******************************************************************************************************************* */

    //*************************************************功能一：自定义导览路线************************************************************ */
  
  
  
  }

  //创造相机
  CreateController(): void {
    const camera = new FreeCamera('camera', new Vector3(0, 100, 50), this.scene);//之所以设定y轴为10，一是方便落到坡面上
    camera.attachControl();
    camera.setTarget(Vector3.Zero()); // 让相机看向原点
    //相机重力设置
    camera.applyGravity = true;
    camera.checkCollisions = true;

    //相机外壳碰撞检测
    camera.ellipsoid = new Vector3(10, 1, 10);


    camera.minZ = 0.45;
    camera.speed = 0.45;
    camera.angularSensibility = 4000;//相机旋转灵敏度，值越大，越慢

    //wasd控制相机移动//https://www.toptal.com/developers/keycode 这个网站可以得到相应的键盘数值
    camera.keysUp.push(87);//w
    camera.keysLeft.push(65);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
    camera.keysUpward.push(32);//长按空格到达相机往上升起的效果！！
  }
}

