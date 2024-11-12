import { ArcRotateCamera, Color3, Engine, HemisphericLight, LinesMesh, Matrix, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class ObjectCollision {

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
        //设置场景重力及其zhongli方向
        scene.gravity = new Vector3(0, -0.98, 0);

        //将场景的碰撞检测打开
        scene.collisionsEnabled = true;


        //创建相机（参数：名称，水平旋转角度，垂直旋转角度，相机半径，相机距离目标点距离,scene(一般默认只有一个场景)）
        const camera = new ArcRotateCamera('camrea', -Math.PI / 2, Math.PI / 2.5, 18, new Vector3(0, 2, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机



        //基础坐标轴
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);



        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.5;

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


        //键盘行为！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        let angle = 0;
        let matrix = Matrix.Identity();
        let moveDir = new Vector3(0, 0, 1);

        scene.onKeyboardObservable.add((kbinfo) => {
            switch (kbinfo.event.key) {
                case "A"://左转
                case "a":
                    angle -= 0.1;
                    base.rotation.y = angle;
                    //在转向后，通过以下的矩阵转换来使得，转向前进的轴线相应改变
                    Matrix.RotationYToRef(angle, matrix);
                    Vector3.TransformNormalToRef(forward, matrix, moveDir);
                    break;

                case "D"://右转
                case "d":
                    angle += 0.1;
                    base.rotation.y = angle;
                    //在转向后，通过以下的矩阵转换来使得，转向前进的轴线相应改变
                    Matrix.RotationYToRef(angle, matrix);
                    Vector3.TransformNormalToRef(forward, matrix, moveDir);
                    break;

                case "W"://前进
                case "w":
                    base.moveWithCollisions(moveDir.scale(0.1));
                    break;

                case "S"://后退
                case "s":
                    base.moveWithCollisions(moveDir.scale(-0.1));
                    break;
            }


        })


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