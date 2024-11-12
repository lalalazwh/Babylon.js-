import { Color3, Engine, HemisphericLight, ICameraInput, KeyboardInfo, LinesMesh, Mesh, MeshBuilder, Nullable, Observer, Scene, StandardMaterial, Texture, UniversalCamera, Vector3, Viewport } from "babylonjs";
import Coordinate from "./Coordinate";

export default class WalkAndLookAround {

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

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //摄影机01（第一人称视角）
        const camera = new UniversalCamera('camrea', new Vector3(0, 1.5, 0));
        camera.minZ = 0.001;
        camera.speed = 0.02;
        camera.attachControl(this.canvas, true);//允许鼠标控制相机


        //摄影机02（第三人称视角）
        const viewCamera = new UniversalCamera('viewCamera', new Vector3(0, 8, -8));
        viewCamera.parent = camera;//父对象绑定，便于呈现同一视角
        viewCamera.setTarget(Vector3.Zero());

        //添加活动相机
        scene.activeCameras?.push(viewCamera);
        scene.activeCameras?.push(camera);

        //添加两个视口
        camera.viewport = new Viewport(0, 0.5, 1.0, 0.5);//长宽（后两位参数）为百分比 ：0.5 = 50%
        viewCamera.viewport = new Viewport(0, 0, 1.0, 0.5);

        //移除默认输入，防止干扰
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");//删掉键盘默认输入
        // camera.inputs.removeByType("FreeCameraMouseInput");//删掉键盘默认输入

        //添加新的输入
        camera.inputs.add(new FreeCameraKeyboardRotateInput(0.1));//见之前RotateFreeCamera的注释


        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        //基础坐标轴
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);


        const ground = MeshBuilder.CreateGround('ground', { width: 30, height: 30 });
        //打开地面的碰撞检测
        ground.checkCollisions = true;

        const gMat = new StandardMaterial('gMat');
        gMat.diffuseColor = Color3.White();
        gMat.backFaceCulling = false;
        ground.material = gMat;
        ground.position.y = -0.55;

        const bMat = new StandardMaterial('bMat');
        bMat.diffuseTexture = new Texture('https://playground.babylonjs.com/textures/crate.png');
        const box = MeshBuilder.CreateBox('box', { size: 2 });
        box.material = bMat;
        //打开box的碰撞检测
        box.checkCollisions = true;

        //复制场景盒子！！！！！！！！！！！！！！！！！！！！！！！
        const randNum = function (min: number, max: number) {
            return min + (max - min) * Math.random();
        }

        const boxNum = 6;
        let theta = 0;
        const radius = 6;

        //定义盒子随机生成位置
        box.position = new Vector3(
            (radius + randNum(-radius / 2, radius / 2)) * Math.cos(theta + randNum(-theta / 10, theta / 10)),
            1,
            (radius + randNum(-radius / 2, radius / 2)) * Math.sin(theta + randNum(-theta / 10, theta / 10)),
        )

        //定义box模型数组
        const boxes: Mesh[] = [box];
        for (let i = 1; i < boxNum; i++) {
            theta += 2 * Math.PI / boxNum;

            const newBox = box.clone('box' + i);
            boxes.push(newBox);//boxes数组压入克隆的box
            newBox.position = new Vector3(
                (radius + randNum(-radius / 2, radius / 2)) * Math.cos(theta + randNum(-theta / 10, theta / 10)),
                1,
                (radius + randNum(-radius / 2, radius / 2)) * Math.sin(theta + randNum(-theta / 10, theta / 10)),
            )
        };

        //场景主角
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
        const points: Vector3[] = [];//通过点来模拟上述创建的可视化“线”
        for (let i = -Math.PI / 2; i < Math.PI / 2; i += Math.PI / 36) {
            points.push(new Vector3(0, b * Math.sin(i) + offsetY, a * Math.cos(i)));
        }

        const ellipse: LinesMesh[] = [];
        ellipse[0] = MeshBuilder.CreateLines('e', { points: points });
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
        const line = MeshBuilder.CreateLines('dir', {
            points: [base.position.add(ptOffsetB), base.position.add(ptOffsetB.add(forward.scale(3)))]//由点成线
        });
        line.parent = base;

        //环境设置
        scene.gravity = new Vector3(0, -0.9, 0);//场景重力
        scene.collisionsEnabled = true;//场景碰撞检测

        camera.checkCollisions = true;
        camera.applyGravity = true;//相机重力应用，之所以上面和下面的代码都只对 camera（摄像机01）操作，是因为ViewCamera（摄像机02）是绑定到parent对象的camera身上
        //同时调节相机的高度
        camera.ellipsoid = new Vector3(1.5, 1.5, 1.5);//碰撞外壳
        camera.ellipsoidOffset = new Vector3(0, 1, 0); 

        ground.checkCollisions = true;

        //返回该场景
        return scene;
        //链接地址（http://localhost:5173/）
    }


}

//实现键盘输入（自定义
class FreeCameraKeyboardRotateInput implements ICameraInput<UniversalCamera>{
    camera!: UniversalCamera;

    // public sensility = 0.01;//灵敏度设置

    rotateObsv: Nullable<Observer<KeyboardInfo>> = null;//记录旋转值

    constructor(public sensility: number) { }

    getClassName(): string {
        return 'FreeCameraKeyboardRotateInput';
    }
    getSimpleName(): string {
        return 'KeyboardRotate';
    }
    attachControl(_noPreventDefault?: boolean | undefined): void {
        const scene = this.camera.getScene();

        const direction = Vector3.Zero();

        this.rotateObsv = scene.onKeyboardObservable.add((kbInfo) => {
            console.log(kbInfo.event.key);//控制台输出相应按键
            switch (kbInfo.event.key) {
                case 'ArrowLeft'://这里指的是 左右箭头按键，当然也可设定成W w等
                    this.camera.rotation.y -= this.sensility;
                    direction.copyFromFloats(0, 0, 0);
                    break;
                case 'ArrowRight':
                    this.camera.rotation.y += this.sensility;
                    direction.copyFromFloats(0, 0, 0);
                    break;
                case 'ArrowUp':
                    direction.copyFromFloats(0, 0, this.camera.speed);//以零点为基准，进行前后Z轴向的摄影机移动
                    break;
                case 'ArrowDown':
                    direction.copyFromFloats(0, 0, -this.camera.speed);
                    break;
                    case 'Space': // 添加空格键的处理逻辑
                    this.camera.position.y += 1; // 相机跳跃高度
                    break;
            }
            //相机视角矩阵转换
            this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix);
            Vector3.TransformNormalToRef(
                direction,
                this.camera._cameraTransformMatrix,
                this.camera._transformedDirection
            );
            this.camera.cameraDirection.addInPlace(this.camera._transformedDirection);
        });
    }
    detachControl(): void {
        if (this.rotateObsv) {
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