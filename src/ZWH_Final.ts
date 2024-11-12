import { AssetsManager, Animation, Color3, CubeTexture, Engine, HemisphericLight, LinesMesh, Mesh, MeshBuilder, Path3D, Scene, SceneLoader, StandardMaterial, Texture, UniversalCamera, Vector3, Viewport, Quaternion, SpriteManager, Sprite, Color4, ParticleSystem, PointerEventTypes, SetValueAction, ActionManager, Sound } from "babylonjs";
import Coordinate from "./Coordinate";
import "babylonjs-loaders";
import { AdvancedDynamicTexture, Button, Control, Slider, StackPanel, TextBlock } from "babylonjs-gui";
export class ZWH_Final {

  engine: Engine;
  scene: Scene;
  carReady: boolean;
  //参数类型统一
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);//获取canvas标签并创建引擎
    this.scene = this.CreateScene();//创建场景,调用函数接收返回后的场景
    //场景函数
    this.CreateEnvironment();

    //相机函数
    this.CreateController();

    //碰撞检测小车(初始状态)(这里其实主要是放在加载模型还未完成，就开启碰撞检测)
    this.carReady = false;

    //渲染场景(循环调用)
    this.engine.runRenderLoop(() => {
      this.scene.render();
    })
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const light = new HemisphericLight('hemi', new Vector3(8, 8, 3), this.scene);
    light.intensity = 0.6;

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!灯光GUI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    //UI操作盘设置
    const pannel = new StackPanel();
    pannel.width = '220px';
    pannel.top = '-620px';
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

    let music = new Sound('告五人', 'music/music01_gaowuren.mp3', this.scene);

    window.addEventListener("keydown", function (evt) {
      // 敲击空格键
      if (evt.keyCode === 80) {
        if (music.isPlaying) {
          music.stop(); // 如果音乐正在播放，则停止播放
        } else {
          music.play(); // 如果音乐未在播放，则开始播放
        }
      }
    });
    ///www/wwwroot/ZWHfinal

    // window.addEventListener('mousedown', event => {
    //   if (event.button === 2) {
    //     if (music.isPlaying) {
    //       music.stop();
    //     } else {
    //       music.play();
    //     }
    //   }
    // });





    //*************************************************基础一：地面+天空盒+道路建模*********************************************
    //创建地面
    const ground = MeshBuilder.CreateGround("ground", { width: 500, height: 500 }, this.scene);
    ground.position.y = -0.65;
    //地面材质贴图
    const groundMat = new StandardMaterial('groundMat');
    groundMat.diffuseTexture = new Texture('picture/Ground.png');
    groundMat.diffuseTexture.hasAlpha = true;
    ground.material = groundMat;

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

    //模型加载 方式二
    // SceneLoader.ImportMeshAsync("", "model/", "BaseGround.glb").then(() => {
    //   const BaseGround = this.scene.getMeshByName("BaseGround")!;
    //   BaseGround.checkCollisions = true;

    // });

    const axis = new Coordinate(this.scene);
    axis.showAxis(8);
    // new AxesViewer()

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
      task.loadedMeshes[0].position = new Vector3(10, -3, 160);//模型位置
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
    //******************************************************景观区域模型设置********************************************************* */
    //景观-01-喷泉
    //截面旋转成3D（旋转体：高数）
    const fountainProfile = [
      new Vector3(0, 0, 0),
      new Vector3(2, 0, 0),
      new Vector3(2, 0.8, 0),
      new Vector3(1.6, 0.8, 0),
      new Vector3(1.6, 0.2, 0),
      new Vector3(0.2, 0.4, 0),
      new Vector3(0.2, 3.2, 0),
      new Vector3(0.6, 3.6, 0)
    ];
    const fountain = MeshBuilder.CreateLathe('fountain', {
      shape: fountainProfile,
      sideOrientation: Mesh.DOUBLESIDE
    });
    fountain.position.x = 45;
    fountain.position.z = 45;
    fountain.position.y = -0.5
    fountain.checkCollisions = true;
    //喷泉粒子效果
    //粒子制作
    const particleSystem = new ParticleSystem('particleSystem', 5000, this.scene);
    particleSystem.particleTexture = new Texture('https://playground.babylonjs.com/textures/flare.png')

    //粒子发射位置
    particleSystem.emitter = new Vector3(45, 3, 45);
    //粒子在不同发射位置的大小
    particleSystem.minEmitBox = new Vector3(-0.02, 0, 0);
    particleSystem.maxEmitBox = new Vector3(0.02, 0, 0);

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
    particleSystem.direction1 = new Vector3(-4, 4, 4);
    particleSystem.direction2 = new Vector3(4, 6, -4);

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
    this.scene.onPointerObservable.add((pointerInfo) => {
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
    //景观02-路灯
    SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "lamp.babylon").then(() => {
      // const lampLight = new SpotLight("lampLight",
      //   Vector3.Zero(),
      //   new Vector3(0, -1, 0),
      //   0.8 * Math.PI,
      //   0.01,
      //   this.scene);

      // lampLight.diffuse = Color3.Yellow();
      // lampLight.parent = this.scene.getMeshByName("bulb")!;

      const lamp_1 = this.scene.getMeshByName("lamp")!;
      lamp_1.position = new Vector3(-10, -0.5, 10);
      lamp_1.rotation = Vector3.Zero();

      // 设置lamp模型的缩放
      const scaleFactor = 0.3; // 缩放因子，可以根据需要调整
      lamp_1.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);

      // 复制10个lamp模型并使其位置排成一字型，间距为10
      const numLamps = 20;
      const distanceBetweenLamps = 10;

      for (let i = 0; i < numLamps; i++) {
        const lampClone_1 = lamp_1.clone("lamp" + i, null)!;
        lampClone_1.position.x = -10;
        lampClone_1.position.z = 10 + i * distanceBetweenLamps;

        // // 为每个lampClone创建不同的光源名称
        // const lampLightClone = new SpotLight("lampLight" + i,
        //   Vector3.Zero(),
        //   new Vector3(0, -1, 0),
        //   0.8 * Math.PI,
        //   0.01,
        //   this.scene);

        // lampLightClone.diffuse = Color3.Yellow();
        // lampLightClone.parent = lampClone;
      }
      const lamp_2 = this.scene.getMeshByName("lamp")!;
      lamp_2.position = new Vector3(10, -0.5, 10);
      lamp_2.rotation = Vector3.Zero();
      lamp_2.rotation.y = Math.PI;

      // 设置lamp模型的缩放
      lamp_2.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
      for (let i = 0; i < numLamps; i++) {
        const lampClone_2 = lamp_2.clone("lamp" + i, null)!;
        lampClone_2.position.x = 10;
        lampClone_2.position.z = 10 + i * distanceBetweenLamps;
      }

      const lamp_3 = this.scene.getMeshByName("lamp")!;
      lamp_3.position = new Vector3(20, -0.5, 10);
      lamp_3.rotation = Vector3.Zero();
      lamp_3.rotation.y = Math.PI / 2;

      // 设置lamp模型的缩放
      lamp_3.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
      for (let i = 2; i < 8; i++) {
        const lampClone_3 = lamp_3.clone("lamp" + i, null)!;
        lampClone_3.position.x = 10 + i * distanceBetweenLamps;
        lampClone_3.position.z = 10;
      }

      const lamp_4 = this.scene.getMeshByName("lamp")!;
      lamp_4.position = new Vector3(95, -0.5, 10);
      lamp_4.rotation = Vector3.Zero();

      // 设置lamp模型的缩放
      lamp_4.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
      for (let i = 1; i < numLamps; i++) {
        const lampClone_4 = lamp_4.clone("lamp" + i, null)!;
        lampClone_4.position.x = 95;
        lampClone_4.position.z = 10 + i * distanceBetweenLamps;
      }

      const lamp_5 = this.scene.getMeshByName("lamp")!;
      lamp_5.position = new Vector3(-20, -0.5, 10);
      lamp_5.rotation.y = Math.PI / 2;

      // 设置lamp模型的缩放
      lamp_5.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
      for (let i = 1; i < numLamps; i++) {
        const lampClone_5 = lamp_5.clone("lamp" + i, null)!;
        lampClone_5.position.x = -20 - i * distanceBetweenLamps;
        lampClone_5.position.z = 10;
      }

      const lamp_6 = this.scene.getMeshByName("lamp")!;
      lamp_6.position = new Vector3(-20, -0.5, -10);
      lamp_6.rotation.y = -Math.PI / 2;

      // 设置lamp模型的缩放
      lamp_6.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
      for (let i = 1; i < numLamps; i++) {
        const lampClone_6 = lamp_6.clone("lamp" + i, null)!;
        lampClone_6.position.x = -20 - i * distanceBetweenLamps;
        lampClone_6.position.z = -10;
      }


      const lamp_7 = this.scene.getMeshByName("lamp")!;
      lamp_7.position = new Vector3(10, -0.5, -10);
      lamp_7.rotation = Vector3.Zero();
      lamp_7.rotation.y = -Math.PI / 2;

      // 设置lamp模型的缩放
      lamp_7.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
      for (let i = 1; i < 9; i++) {
        const lampClone_7 = lamp_7.clone("lamp" + i, null)!;
        lampClone_7.position.x = 10 + i * distanceBetweenLamps;
        lampClone_7.position.z = -10;
      }
    });
    /**************************************************************************************** */
    //景观03-静态第三方模型
    var assetsManager_LandScape = new AssetsManager(this.scene);
    var Mesh_FlowerTan = assetsManager_LandScape.addMeshTask("", "", "model/", "花坛01.glb");

    Mesh_FlowerTan.onSuccess = function (task) {
      task.loadedMeshes[0].position = new Vector3(50, -4.5, 80);//模型位置
      task.loadedMeshes[0].scaling = new Vector3(2, 2, 2);//模型大小缩放
      task.loadedMeshes[0].checkCollisions = true;
    }








    assetsManager_LandScape.load();


    //******************************************************************************************************************* */
    //种树（2D图片始终朝向“摄像机”=>伪3D效果
    const spriteManagerTrees = new SpriteManager('spriteManagerTrees',
      "https://playground.babylonjs.com/textures/palm.png",
      2000,//容量（棵树）
      { width: 512, height: 1024 },//单元图片大小（尺寸：应该是像素）
      this.scene
    );
    const treeSpacing = 5;
    //利用循环 进行放置（种树区域1）
    for (let i = 0; i < 100; i++) {
      const tree: any = new Sprite('tree', spriteManagerTrees);
      tree.position = new Vector3(
        -240,
        0,
        -250 + i * treeSpacing
      );
    }
    //利用循环 进行放置（种树区域2）
    for (let i = 0; i < 100; i++) {
      const tree: any = new Sprite('tree', spriteManagerTrees);
      tree.position = new Vector3(
        -250 + i * treeSpacing,
        0,
        240
      );

    }
    //利用循环 进行放置（种树区域3）
    for (let i = 0; i < 100; i++) {
      const tree: any = new Sprite('tree', spriteManagerTrees);
      tree.position = new Vector3(
        240,
        0,
        250 - i * treeSpacing
      );
    }
    //利用循环 进行放置（种树区域4）
    for (let i = 0; i < 100; i++) {
      const tree: any = new Sprite('tree', spriteManagerTrees);
      tree.position = new Vector3(
        250 - i * treeSpacing,
        0,
        -240
      );
    }

    //**********************************************************小车动画********************************************************* */
    //添加小车动画！！！！！！！！！！！！！
    SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
      const car = this.scene.getMeshByName("car")!;
      // car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
      car.position = new Vector3(40, 1, 0.8)
      //汽车加载完成后，设初始状态更改为“true”
      this.carReady = true;
      const carSize = 8;
      car.scaling = new Vector3(carSize, carSize, carSize);

      const animCar = new Animation("carAnimation", "position.x", 50, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

      //       "carAnimation"：动画的名称，用于标识该动画。
      // "position.x"：动画属性，表示动画将影响汽车的X轴位置。
      // 100：动画的总帧数，即动画从开始到结束需要播放的帧数。
      // Animation.ANIMATIONTYPE_FLOAT：动画类型，表示动画的属性值是一个浮点数。
      // Animation.ANIMATIONLOOPMODE_CYCLE：循环模式，表示动画播放完毕后会自动重新开始播放。


      const carKeys = [];
      //起始关键帧+距离
      carKeys.push({
        frame: 0,
        value: 40
      });

      //过程/终止关键帧时候该到达的+距离
      carKeys.push({
        frame: 500,
        value: -20
      });

      carKeys.push({
        frame: 1000,
        value: -100
      });


      //       第0帧：value: 10，表示小车在第0帧时的X轴位置为10。
      // 第200帧：value: -15，表示小车在第200帧时的X轴位置为-15。
      // 根据这两个关键帧的定义，可以得出小车的移动时间是200帧，即动画的总帧数为50（从0到200）。而小车的移动距离可以通过计算两个关键帧的X轴位置差值得出，即10 - (-15) = 25。

      animCar.setKeys(carKeys);

      car.animations = [];
      car.animations.push(animCar);

      this.scene.beginAnimation(car, 0, 1000, true);
      // car: 这是要进行动画的对象，通常是一个3D模型或者一个2D精灵。
      // 0: 这是动画的起始帧数，表示从第0帧开始播放动画。
      // 100: 这是动画的结束帧数，表示动画将在第100帧时停止播放。
      // true: 这是一个布尔值，表示是否循环播放动画。如果设置为true，则动画将循环播放；如果设置为false，则动画只播放一次。

      //wheel animation
      const wheelRB = this.scene.getMeshByName("wheelRB");
      const wheelRF = this.scene.getMeshByName("wheelRF");
      const wheelLB = this.scene.getMeshByName("wheelLB");
      const wheelLF = this.scene.getMeshByName("wheelLF");

      this.scene.beginAnimation(wheelRB, 0, 1000, true);
      this.scene.beginAnimation(wheelRF, 0, 1000, true);
      this.scene.beginAnimation(wheelLB, 0, 1000, true);
      this.scene.beginAnimation(wheelLF, 0, 1000, true);
      car.checkCollisions = true;

      // //为小车添加“行人优先规则”
      // // 添加“行人模型
      // SceneLoader.ImportMeshAsync("him",
      //   "https://playground.babylonjs.com/scenes/Dude/",
      //   "Dude.babylon",
      //   this.scene
      // ).then((result) => {
      //   //获取模型对象赋予变量进行操作
      //   var dude = result.meshes[0];
      //   //模型大小比例设置
      //   dude.scaling = new Vector3(0.008, 0.008, 0.008);
      //   //模型（初始）位置设置
      //   dude.position = new Vector3(0, 0, -10);
      //   //模型旋转初始角度设置
      //   dude.rotate(Axis.Y, Tools.ToRadians(-90), Space.LOCAL);//参数：轴线基准，旋转角度，模型所处空间

      //   const startRoation = dude.rotationQuaternion!.clone();//起始转向角度设置
      //   this.scene.beginAnimation(result.skeletons[0], 0, 1000, true, 1.0);

      //   //walk类和构造函数
      //   class walk {
      //     turn: number;
      //     dist: number;
      //     constructor(turn: number, dist: number) {
      //       this.turn = turn;
      //       this.dist = dist;
      //     }
      //   }
      //   const track: any[] = [];
      //   track.push(new walk(180, 0));
      //   track.push(new walk(0, 5));//参数（角度:是当前路径到达后面参数数值后，进行第一个参数的旋转角度， 路径累加和：包括之间的路径长度）
      //   // track.push(new walk(-93, 16.5));


      //   //初始参数（可见Move to Path）
      //   let distance = 0;
      //   let step = 0.015;
      //   let p = 0;
      //   //！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
      //   //碰撞盒子
      //   //只要汽车进入危险区域（hitbox）产生交集，则人物模型停止移动
      //   const hitBox = this.scene.getMeshByName('carbox')!;
      //   this.scene.onBeforeAnimationsObservable.add(() => {
      //     if (this.carReady) {
      //       if (//前一模型 与 （）内模型是否产生交集：intersectsMesh）
      //         this.scene.getMeshByName("car")!.intersectsMesh(hitBox) &&
      //         !dude.getChildMeshes()[1].intersectsMesh(hitBox)
      //       ) {
      //         return;
      //       }
      //     }
      //     dude.movePOV(0, 0, step);
      //     distance += step;

      //     if (distance > track[p].dist) {

      //       dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
      //       p += 1;
      //       p %= track.length;
      //       //走完一趟，误差还原
      //       if (p === 0) {
      //         distance = 0;
      //         dude.position = new Vector3(0, 0, -10);
      //         dude.rotationQuaternion = startRoation.clone();
      //       }
      //     }

      //   });
      // });

    });

    //**********************************************************缩放门动画！！！！！********************************************************* */
    //
    //放大门模型
    const Men_Bigger = MeshBuilder.CreateBox('Men_Bigger');
    Men_Bigger.position = new Vector3(130, 0, 120);
    Men_Bigger.scaling = new Vector3(0.5, 1, 8);

    // 为长方体创建一个材质，并设置其颜色
    var material = new StandardMaterial("material", this.scene);
    material.diffuseColor = new Color3(1, 0, 0);
    // 将材质应用到长方体上
    Men_Bigger.material = material;

    //教学区面板**********************************************************************************
    const plane_Men_Bigger = MeshBuilder.CreatePlane('plane_Men_Bigger', { size: 3 });

    plane_Men_Bigger.parent = Men_Bigger;//面板物体绑定
    plane_Men_Bigger.position.y = 3;

    plane_Men_Bigger.billboardMode = Mesh.BILLBOARDMODE_ALL;

    const adTexture_MenBigger = AdvancedDynamicTexture.CreateForMesh(plane_Men_Bigger, 128, 128, false);
    adTexture_MenBigger.renderScale = 1;

    const button_MenBigger = Button.CreateSimpleButton('button_MenBigger', '放大！');
    //控件大小最好按比例大小设置，否则容易 “内容溢出文本框大小，造成显示效果不佳”
    button_MenBigger.width = 4;
    button_MenBigger.height = 8;
    button_MenBigger.color = 'white';
    button_MenBigger.background = 'green';
    button_MenBigger.cornerRadius = 20;
    // button_MenBigger.onPointerClickObservable.add(() => {//button点击触发事件
    //   alert('此处为教学区!')//中文显示没问题
    // });
    //将设置完成的Button添加的画布上
    adTexture_MenBigger.addControl(button_MenBigger);


    const box = MeshBuilder.CreateBox('box');
    box.material = new StandardMaterial('mat');
    box.position = new Vector3(130, 0, 130);
    //添加事件
    box.actionManager = new ActionManager();
    const Size_Bigger = 5;


    //box事件一：与其他物体相加：进入or离开时发生动画
    //进入
    box.actionManager.registerAction(
      new SetValueAction(
        {
          trigger: ActionManager.OnIntersectionEnterTrigger,
          parameter: {
            mesh: Men_Bigger,
            usePreciseInterscetion: true//与哪个模型发生交集，进行相应改变
          }
        },
        box,
        'scaling',
        new Vector3(Size_Bigger, Size_Bigger, Size_Bigger)
      )
    )
    //离开
    box.actionManager.registerAction(
      new SetValueAction(
        {
          trigger: ActionManager.OnIntersectionExitTrigger,
          parameter: {
            mesh: Men_Bigger,
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
    this.scene.registerBeforeRender(() => {
      box.position.x = 128 + Math.sin(delta) * 3;
      box.position.z = 120
      delta += 0.01;
    });


    //缩小门模型*****************************************************************************
    const Men_Minner = MeshBuilder.CreateBox('Men_Minner');
    Men_Minner.position = new Vector3(150, 0, 120);
    Men_Minner.scaling = new Vector3(0.5, 1, 8);

    // 为长方体创建一个材质，并设置其颜色
    var material = new StandardMaterial("material", this.scene);
    material.diffuseColor = Color3.Blue();
    // 将材质应用到长方体上
    Men_Minner.material = material;

    //教学区面板**********************************************************************************
    const plane_Men_Minner = MeshBuilder.CreatePlane('plane_Men_Minner', { size: 3 });

    plane_Men_Minner.parent = Men_Minner;//面板物体绑定
    plane_Men_Minner.position.y = 3;

    plane_Men_Minner.billboardMode = Mesh.BILLBOARDMODE_ALL;

    const adTexture_Men_Minner = AdvancedDynamicTexture.CreateForMesh(plane_Men_Minner, 128, 128, false);
    adTexture_Men_Minner.renderScale = 1;

    const button_Men_Minner = Button.CreateSimpleButton('button_Men_Minner', '缩小！');
    //控件大小最好按比例大小设置，否则容易 “内容溢出文本框大小，造成显示效果不佳”
    button_Men_Minner.width = 4;
    button_Men_Minner.height = 8;
    button_Men_Minner.color = 'white';
    button_Men_Minner.background = 'green';
    button_Men_Minner.cornerRadius = 20;
    // button_MenBigger.onPointerClickObservable.add(() => {//button点击触发事件
    //   alert('此处为教学区!')//中文显示没问题
    // });
    //将设置完成的Button添加的画布上
    adTexture_Men_Minner.addControl(button_Men_Minner);


    const box_01 = MeshBuilder.CreateBox('box_01');
    box_01.material = new StandardMaterial('mat');
    box_01.scaling = new Vector3(Size_Bigger, Size_Bigger, Size_Bigger)
    //添加事件
    box_01.actionManager = new ActionManager();
    const Size_Minner = 0.5;


    //box事件一：与其他物体相加：进入or离开时发生动画
    //进入
    box_01.actionManager.registerAction(
      new SetValueAction(
        {
          trigger: ActionManager.OnIntersectionEnterTrigger,
          parameter: {
            mesh: Men_Minner,
            usePreciseInterscetion: true//与哪个模型发生交集，进行相应改变
          }
        },
        box_01,
        'scaling',
        new Vector3(Size_Minner, Size_Minner, Size_Minner)
      )
    )
    //离开
    box_01.actionManager.registerAction(
      new SetValueAction(
        {
          trigger: ActionManager.OnIntersectionExitTrigger,
          parameter: {
            mesh: Men_Minner,
            usePreciseInterscetion: true
          }
        },
        box_01,
        'scaling',
        new Vector3(Size_Bigger, Size_Bigger, Size_Bigger)
      )
    )

    //渲染检测
    let delta_Minner = 0;
    this.scene.registerBeforeRender(() => {
      box_01.position.x = 148 + Math.sin(delta_Minner) * 3;
      box_01.position.z = 120
      delta_Minner += 0.05;
    });

    //***************************************************************************************************************************** */
    //GUI（平面）-功能02—— 各区域名称
    //各区域面板需绑定的物体
    //教学区
    const plane_TeachShow = MeshBuilder.CreateBox('plane_TeachShow', {}, this.scene);
    plane_TeachShow.position = new Vector3(0, 0, -34)
    plane_TeachShow.scaling = new Vector3(8, 4, 0.5)
    // 为长方体创建一个材质，并设置其颜色
    var material = new StandardMaterial("material", this.scene);
    material.diffuseColor = new Color3(1, 0, 0); // 鼠鼻红

    // 将材质应用到长方体上
    plane_TeachShow.material = material;
    plane_TeachShow.checkCollisions = true;

    //教学区面板**********************************************************************************
    const plane = MeshBuilder.CreatePlane('plane', { size: 2 });

    plane.parent = plane_TeachShow;//面板物体绑定
    plane.position.y = 1;

    plane.billboardMode = Mesh.BILLBOARDMODE_ALL;

    const adTexture = AdvancedDynamicTexture.CreateForMesh(plane, 128, 128, false);
    adTexture.renderScale = 1;

    const button = Button.CreateSimpleButton('button', 'Click Me');
    //控件大小最好按比例大小设置，否则容易 “内容溢出文本框大小，造成显示效果不佳”
    button.width = 1;
    button.height = 0.4;
    button.color = 'white';
    button.background = 'green';
    button.cornerRadius = 20;
    button.onPointerClickObservable.add(() => {//button点击触发事件
      alert('此处为教学区!')//中文显示没问题
    });
    //将设置完成的Button添加的画布上
    adTexture.addControl(button);

    //宿舍区面板**********************************************************************************
    const plane_DormitoryShow = MeshBuilder.CreateBox('plane_DormitoryShow', {}, this.scene);
    plane_DormitoryShow.position = new Vector3(-20, 0, 10);
    plane_DormitoryShow.scaling = new Vector3(8, 4, 0.5)
    // 为长方体创建一个材质，并设置其颜色
    var material_DormitoryShow = new StandardMaterial("material_DormitoryShow", this.scene);
    material_DormitoryShow.diffuseColor = Color3.Blue()

    // 将材质应用到长方体上
    plane_DormitoryShow.material = material_DormitoryShow;
    plane_DormitoryShow.checkCollisions = true;

    const plane_Dormitory = MeshBuilder.CreatePlane('plane_Dormitory', { size: 2 });

    plane_Dormitory.parent = plane_DormitoryShow;//面板物体绑定
    plane_Dormitory.position.y = 1;

    plane_Dormitory.billboardMode = Mesh.BILLBOARDMODE_ALL;

    const adTexture_Dormitory = AdvancedDynamicTexture.CreateForMesh(plane_Dormitory, 128, 128, false);
    adTexture.renderScale = 1;

    const button_Dormitory = Button.CreateSimpleButton('button_Dormitory', 'Click Me');
    //控件大小最好按比例大小设置，否则容易 “内容溢出文本框大小，造成显示效果不佳”
    button_Dormitory.width = 1;
    button_Dormitory.height = 0.4;
    button_Dormitory.color = 'white';
    button_Dormitory.background = 'green';
    button_Dormitory.cornerRadius = 20;
    button_Dormitory.onPointerClickObservable.add(() => {//button点击触发事件
      alert('此处为宿舍区!')//中文显示没问题
    });
    //将设置完成的Button添加的画布上
    adTexture_Dormitory.addControl(button_Dormitory);


    //景观区面板**********************************************************************************
    const plane_ScenicShow = MeshBuilder.CreateBox('plane_ScenicShow', {}, this.scene);
    plane_ScenicShow.position = new Vector3(50, 0, 15);
    plane_ScenicShow.scaling = new Vector3(8, 4, 0.5)
    // 为长方体创建一个材质，并设置其颜色
    var material_ScenicShow = new StandardMaterial("material_ScenicShow", this.scene);
    material_ScenicShow.diffuseColor = Color3.Yellow()

    // 将材质应用到长方体上
    plane_ScenicShow.material = material_ScenicShow;
    plane_ScenicShow.checkCollisions = true;

    const plane_Scenic = MeshBuilder.CreatePlane('plane_Scenic', { size: 2 });

    plane_Scenic.parent = plane_ScenicShow;//面板物体绑定
    plane_Scenic.position.y = 1;

    plane_Scenic.billboardMode = Mesh.BILLBOARDMODE_ALL;

    const adTexture_Scenic = AdvancedDynamicTexture.CreateForMesh(plane_Scenic, 128, 128, false);
    adTexture_Scenic.renderScale = 1;

    const button_Scenic = Button.CreateSimpleButton('button_Scenic', 'Click Me');
    //控件大小最好按比例大小设置，否则容易 “内容溢出文本框大小，造成显示效果不佳”
    button_Scenic.width = 1;
    button_Scenic.height = 0.4;
    button_Scenic.color = 'white';
    button_Scenic.background = 'green';
    button_Scenic.cornerRadius = 20;
    button_Scenic.onPointerClickObservable.add(() => {//button点击触发事件
      alert('此处为景观区!')//中文显示没问题
    });
    //将设置完成的Button添加的画布上
    adTexture_Scenic.addControl(button_Scenic);

    //科研楼区面板**********************************************************************************
    const plane_ScientificShow = MeshBuilder.CreateBox('plane_ScientificShow', {}, this.scene);
    plane_ScientificShow.position = new Vector3(120, 0, -30);
    plane_ScientificShow.scaling = new Vector3(8, 4, 0.5)
    // 为长方体创建一个材质，并设置其颜色
    var material_ScientificShow = new StandardMaterial("material_ScientificShow", this.scene);
    material_ScientificShow.diffuseColor = Color3.White()

    // 将材质应用到长方体上
    plane_ScientificShow.material = material_ScientificShow;
    plane_ScientificShow.checkCollisions = true;

    const plane_Scientific = MeshBuilder.CreatePlane('plane_Scientific', { size: 2 });

    plane_Scientific.parent = plane_ScientificShow;//面板物体绑定
    plane_Scientific.position.y = 1;

    plane_Scientific.billboardMode = Mesh.BILLBOARDMODE_ALL;

    const adTexture_Scientific = AdvancedDynamicTexture.CreateForMesh(plane_Scientific, 128, 128, false);
    adTexture_Scientific.renderScale = 1;

    const button_Scientific = Button.CreateSimpleButton('button_Scientific', 'Click Me');
    //控件大小最好按比例大小设置，否则容易 “内容溢出文本框大小，造成显示效果不佳”
    button_Scientific.width = 1;
    button_Scientific.height = 0.4;
    button_Scientific.color = 'white';
    button_Scientific.background = 'green';
    button_Scientific.cornerRadius = 20;
    button_Scientific.onPointerClickObservable.add(() => {//button点击触发事件
      alert('此处为科研楼!')//中文显示没问题
    });
    //将设置完成的Button添加的画布上
    adTexture_Scientific.addControl(button_Scientific);




  }



  /////****************************相机+主角设置+Path3D********************************************* */
  //创造相机
  CreateController(): void {

    //摄影机01（第一人称视角）
    const camera = new UniversalCamera('camrea', new Vector3(0, 1.5, 0));
    camera.attachControl(this.canvas, true);//允许鼠标控制相机
    // 相机重力设置
    camera.applyGravity = true;
    camera.checkCollisions = true;

    //相机外壳碰撞检测
    camera.ellipsoid = new Vector3(10, 1.5, 10);
    //同时调节相机的高度
    camera.ellipsoid = new Vector3(1.5, 0.5, 1.5);//碰撞外壳
    camera.ellipsoidOffset = new Vector3(0, 0.5, 0);

    camera.minZ = 0.45;
    camera.speed = 0.45;
    camera.angularSensibility = 4000;//相机旋转灵敏度，值越大，越慢

    //wasd控制相机移动//https://www.toptal.com/developers/keycode 这个网站可以得到相应的键盘数值
    camera.keysUp.push(87);//w
    camera.keysLeft.push(65);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
    camera.keysUpward.push(32);//长按空格到达相机往上升起的效果！！

    //摄影机02（第三人称视角）
    const viewCamera = new UniversalCamera('viewCamera', new Vector3(0, 130, 0), this.scene);
    viewCamera.parent = camera;//父对象绑定，便于呈现同一视角
    viewCamera.setTarget(Vector3.Zero());
    viewCamera.attachControl(this.canvas, true);//允许鼠标控制相机
    // viewCamera.rotation.y += Math.PI; // 将相机水平旋转90度
    viewCamera.angularSensibility = 4000;//相机旋转灵敏度，值越大，越慢

    //相机03（填补空缺,呈现主角）
    const baseCamera = new UniversalCamera('baseCamera', new Vector3(0, 3, -10), this.scene);
    baseCamera.parent = camera;
    baseCamera.setTarget(Vector3.Zero());
    this.scene.addCamera(baseCamera);
    // baseCamera.attachControl(this.canvas, true);//允许鼠标控制相机

    //添加活动相机
    /*
    在Babylon.js中，一个场景只能有一个活动相机。如果你想要在同一个场景中使用多个相机，可以通过切换不同的相机来实现。
    只有活动相机会渲染到屏幕上，其他相机不会被显示,
    添加多个相机，只有最后一个添加的相机会被激活。。
    */
    let NowBigViewPort = baseCamera;
    let RightSmallViewPort = camera;
    let LeftSmallViewPort = viewCamera;

    this.scene.activeCameras?.push(LeftSmallViewPort);
    this.scene.activeCameras?.push(RightSmallViewPort);
    this.scene.activeCameras?.push(NowBigViewPort);//活动相机



    //添加两个视口
    LeftSmallViewPort.viewport = new Viewport(0, 0.6, 0.5, 0.4);//长宽（后两位参数）为百分比 ：0.5 = 50%
    RightSmallViewPort.viewport = new Viewport(0.5, 0.7, 0.5, 0.3)
    NowBigViewPort.viewport = new Viewport(0, 0, 1.0, 0.7);




    //场景主角
    let theta = 0;
    const base = new Mesh('pviot');
    base.checkCollisions = true;

    base.parent = camera;//对相机进行相关视角和自定义操作后，进行主角绑定！！！！！！！！！！！
    //注意：这里是先搞定（主相机01）camera后，在以此为基准，进行其他物体的操作

    const headDiam = 1.5;
    const bodyDiam = 2;
    const head = MeshBuilder.CreateSphere('h', { diameter: headDiam });
    head.parent = base;

    const body = MeshBuilder.CreateSphere('b', { diameter: bodyDiam });
    body.parent = base;

    head.position.y = 0.7 * (headDiam + bodyDiam);
    body.position.y = 0.5 * bodyDiam;

    //可视化碰撞盒子
    const extra = 0.25;
    const offsetY = (bodyDiam + headDiam) / 2 - base.position.y;

    base.ellipsoid = new Vector3(bodyDiam / 2, (headDiam + bodyDiam) / 2, bodyDiam / 2)//构建‘碰撞外壳大小’:此处类似椭圆形

    base.ellipsoid.addInPlace(new Vector3(extra, extra, extra));

    const a = base.ellipsoid.x;
    const b = base.ellipsoid.y;
    const points_ZWH: Vector3[] = [];//通过点来模拟上述创建的可视化“线”
    for (let i = -Math.PI / 2; i < Math.PI / 2; i += Math.PI / 36) {
      points_ZWH.push(new Vector3(0, b * Math.sin(i) + offsetY, a * Math.cos(i)));
    }

    const ellipse: LinesMesh[] = [];
    ellipse[0] = MeshBuilder.CreateLines('e', { points: points_ZWH });
    ellipse[0].color = Color3.Red();
    ellipse[0].parent = base;

    const steps = 12;
    theta = 2 * Math.PI / steps;
    for (let i = 1; i < steps; i++) {
      ellipse[i] = ellipse[0].clone('el' + i);

      ellipse[i].parent = base;
      ellipse[i].rotation.y = i * theta;//刚好转一圈
    }


    //方向线
    const forward = new Vector3(0, 0, 1);
    const ptOffsetB = new Vector3(0, headDiam + extra, 0);
    const line_ZWH = MeshBuilder.CreateLines('dir', {
      points: [base.position.add(ptOffsetB), base.position.add(ptOffsetB.add(forward.scale(3)))]//由点成线
    });
    line_ZWH.parent = base;


    //功能 ：Path3D跟随设置
    //运动轨迹点设置——利用函数
    //Path3D
    //运动轨迹点设置——利用点的集合——这是我需要做的！！！！！！
    // const points = [
    //     new Vector3(-3, 0, 0),
    //     new Vector3(2, 0, 0),
    //     new Vector3(2, 1, 0)
    // ]
    // const line = MeshBuilder.CreateLines('line', {points});//绘制路径线

    // const path3d = new Path3D(points);//点位的获取与加载

    // //更新Path3D的点位
    // // path3d.update(points2);

    // //GetPointAt——获取当前运动物体，在所设置线路的位置比例显示
    // const plane = MeshBuilder.CreatePlane('plane')
    // const adt = AdvancedDynamicTexture.CreateForMesh(plane, 64, 64, false)
    // const txt = new TextBlock()
    // txt.color = 'white'
    // adt.addControl(txt)

    //（1）路径点位设置
    const pathGroup = new Mesh('pathGroup')
    let v3 = (x: number, y: number, z: number) => new Vector3(x, y, z);
    const points = [];
    //线段1
    for (let i = -150; i <= 100; i += 10) {
      points.push(v3(i, 10, 0));
    }
    //线段2
    for (let i = 0; i <= 100; i += 10) {
      points.push(v3(100, 10, i));
    }

    // new Vector3(-150, 10, 0),
    // new Vector3(-145, 10, 0),
    // new Vector3(-140, 10, 0),
    // new Vector3(-135, 10, 0),
    // new Vector3(-130, 10, 0),
    // new Vector3(-125, 10, 0),
    // new Vector3(-120, 10, 0),
    // new Vector3(-115, 10, 0),
    // new Vector3(-110, 10, 0),
    // new Vector3(-105, 10, 0),
    // new Vector3(-100, 10, 0),
    // new Vector3(-95, 10, 0),
    // new Vector3(-90, 10, 0),
    // new Vector3(-85, 10, 0),
    // new Vector3(-80, 10, 0),
    // new Vector3(-75, 10, 0),

    //   new Vector3(0, 10, 0),
    //   new Vector3(20, 10, 0),
    //   new Vector3(40, 10, 0),
    //   new Vector3(60, 10, 0),
    //   new Vector3(80, 10, 0),
    //   new Vector3(100, 10, 0),

    //   new Vector3(105, 10, 0),
    //   new Vector3(105, 10, 20),
    //   new Vector3(105, 10, 40),
    //   new Vector3(105, 10, 60),
    //   new Vector3(105, 10, 80),
    //   new Vector3(105, 10, 100)

    //绘制路线（可视化）
    const Pathline_One = MeshBuilder.CreateLines('Pathline_One', { points });
    Pathline_One.color = new Color3(1, 1, 0.5);
    Pathline_One.parent = pathGroup;

    const path3d = new Path3D(points)
    //三线设置
    const tangents = path3d.getTangents();//切线数组
    const normals = path3d.getNormals();//法线数组
    const binormals = path3d.getBinormals();//双法线数组
    const PointPath = path3d.getCurve()

    //visualation(可视化)
    for (let p = 0; p < PointPath.length; p++) {
      const tg = MeshBuilder.CreateLines('tg' + p, { points: [PointPath[p], PointPath[p].add(tangents[p])] });
      tg.color = Color3.Red()
      tg.parent = pathGroup;

      const no = MeshBuilder.CreateLines('no' + p, { points: [PointPath[p], PointPath[p].add(normals[p])] });
      no.color = Color3.Blue()
      no.parent = pathGroup;

      const bi = MeshBuilder.CreateLines('bi' + p, { points: [PointPath[p], PointPath[p].add(binormals[p])] });
      bi.color = Color3.Green()
      bi.parent = pathGroup;
    }

    //移动相机游览(animation camera)
    camera.updateUpVectorFromRotation = true;

    //移动动作define
    const framesRate = 60 //每秒刷新频率：每秒60帧

    const posAnim = new Animation('cameraPos', 'position', framesRate, Animation.ANIMATIONTYPE_VECTOR3)
    const posKeys = []//关键帧设置：与之前的点位相对应
    const rotAnim = new Animation('cameraRot', 'rotaionQuaternion', framesRate, Animation.ANIMATIONTYPE_QUATERNION);
    const rotKeys = []
    //关键帧点位设置
    for (let i = 0; i < PointPath.length; i++) {
      const position = PointPath[i]
      const tangent = tangents[i]
      const binormal = binormals[i]

      const rotation = Quaternion.FromLookDirectionRH(tangent, binormal)

      posKeys.push({ frame: i * framesRate, value: position })
      rotKeys.push({ frame: i * framesRate, value: rotation })
    }
    //动画和关键帧的绑定
    posAnim.setKeys(posKeys)
    rotAnim.setKeys(rotKeys)

    camera.animations.push(posAnim)
    camera.animations.push(rotAnim)


    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!GUI 滑条控制相机移动速度!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    //UI操作盘设置
    const pannel = new StackPanel();
    pannel.width = '220px';
    pannel.top = '-550px';
    //位置模式设置
    pannel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    pannel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    adt.addControl(pannel);

    //UI字样
    const SpeedHeader = new TextBlock();
    SpeedHeader.text = 'Camera Speed';
    SpeedHeader.height = '30px';
    SpeedHeader.color = 'white';

    pannel.addControl(SpeedHeader);
    //控制条滑轨
    const slider_speed = new Slider();
    slider_speed.minimum = 0;
    slider_speed.maximum = 0.4;
    slider_speed.borderColor = 'black';//边框颜色
    slider_speed.color = 'yellow';
    slider_speed.background = 'white';
    slider_speed.value = 0.4;//初始值
    slider_speed.height = '20px';
    slider_speed.width = '200px';
    //添加滑动事件
    slider_speed.onValueChangedObservable.add((value) => {
      if (camera) {
        camera.speed = value;
      }
    })
    pannel.addControl(slider_speed);




    // GUI AND EXTRA VISUALIZATION DEFINITION
    //
    var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("myUI");


    // 添加一个按钮到面板上
    let button1 = Button.CreateSimpleButton("button_turn_firstview", "切换漫游视角");//()
    // let text = Button.CreateSimpleButton("button_turn_firstview", "注意：只有第三人称视口的按钮点击有效！！！");
    button1.width = "150px";
    button1.height = "50px";
    button1.color = "white";
    button1.background = "blue";
    button1.top = "-280px"; // 距离顶部的距离
    button1.left = "380px"; // 距离左侧的距离

    button1.onPointerClickObservable.add(() => {
      if (NowBigViewPort == baseCamera) {
        // var tempviewport = camera.viewport;
        NowBigViewPort = camera;
        RightSmallViewPort = baseCamera
      }
      else {
        NowBigViewPort = baseCamera;
        RightSmallViewPort = camera;
      }
      this.scene.activeCameras?.push(NowBigViewPort);//活动相机
      RightSmallViewPort.viewport = new Viewport(0.5, 0.7, 0.5, 0.3)
      NowBigViewPort.viewport = new Viewport(0, 0, 1.0, 0.7);
      NowBigViewPort.speed = 0.3;
      NowBigViewPort.angularSensibility = 4000;
    });
    // 将按钮添加到面板上
    // text.width = "500px";
    // text.height = "50px";
    // text.color = "white";
    // text.background = "red";
    // text.top = "-310px"; // 距离顶部的距离
    // text.left = "-440px"; // 距离左侧的距离
    // advancedTexture.addControl(text);
    advancedTexture.addControl(button1);


    //GUI(满屏)-功能01—— 显示导览线
    let viewPathButton = Button.CreateSimpleButton("viewPath", "显示游览线");
    viewPathButton.width = 0.2;
    viewPathButton.height = '40px';
    viewPathButton.background = 'black';
    viewPathButton.color = 'white';
    viewPathButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    viewPathButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

    let pathEnabled = false;
    pathGroup.setEnabled(pathEnabled);
    viewPathButton.onPointerClickObservable.add(() => {
      pathEnabled = !pathEnabled;
      pathGroup.setEnabled(pathEnabled);
    });
    advancedTexture.addControl(viewPathButton);

    //GUI(满屏)-功能02—— 回归初始观览位置
    let showOverheadCameraButton = Button.CreateSimpleButton("showOverhead", "停止相机游览");
    showOverheadCameraButton.width = 0.2;
    showOverheadCameraButton.height = '40px';
    showOverheadCameraButton.background = 'black';
    showOverheadCameraButton.color = 'white';

    showOverheadCameraButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    showOverheadCameraButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    showOverheadCameraButton.onPointerClickObservable.add(() => {
      this.scene.activeCamera = camera;
      this.scene.stopAnimation(camera);
    });
    advancedTexture.addControl(showOverheadCameraButton);

    //GUI(满屏)-功能03—— 开启摄像机导览
    let showTrackCameraButton = Button.CreateSimpleButton("showOverhead", "开始导览");
    showTrackCameraButton.width = 0.2;
    showTrackCameraButton.height = '40px';
    showTrackCameraButton.background = 'black';
    showTrackCameraButton.color = 'white';
    showTrackCameraButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    showTrackCameraButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    showTrackCameraButton.onPointerClickObservable.add(() => {
      this.scene.activeCamera = camera;
      this.scene.beginAnimation(camera, 0, framesRate * PointPath.length, true);
    });
    advancedTexture.addControl(showTrackCameraButton);

    //***************************************************************************************************************************** */
    //GUI（平面）-功能02—— 各区域名称

    // const plane = MeshBuilder.CreatePlane('plane', { size: 2 });

    // plane.parent = sphere;//面板物体绑定
    // plane.position.y = 2;

    // plane.billboardMode = Mesh.BILLBOARDMODE_ALL;

    // const adTexture = AdvancedDynamicTexture.CreateForMesh(plane, 128, 128, false);
    // adTexture.renderScale = 1;

    // const button = Button.CreateSimpleButton('button', 'Click Me');
    //     //控件大小最好按比例大小设置，否则容易 “内容溢出文本框大小，造成显示效果不佳”
    //     button.width = 1;
    //     button.height = 0.4;
    //     button.color = 'white';
    //     button.background = 'green';
    //     button.cornerRadius = 20;
    //     button.onPointerClickObservable.add(() => {//button点击触发事件
    //         alert('局部UI测试成功!')//中文显示没问题
    //     });
    //     //将设置完成的Button添加的画布上
    //     adTexture.addControl(button);

    //     //重点 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //     // Show inspector.(babylonjs自带模型调试器)
    //     this.scene.debugLayer.show();

















  }
}

