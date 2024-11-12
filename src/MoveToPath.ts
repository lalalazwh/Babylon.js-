//P20动画路径设置
import { ArcRotateCamera, Axis, Color3, Engine, HemisphericLight, MeshBuilder, Scene, Space, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class MoveToPath {

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
        const camera = new ArcRotateCamera('camrea', -Math.PI / 2.5, Math.PI/3.5, 10, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light;

        //重点！！！！！！！！！！！！！！（可学）！！！！！！！！！！！！！！！！！！！！！
        //坐标系创建(直接从Coordinate.ts中集成的函数进行调用)
        const axis = new Coordinate(scene);
        axis.showAxis(4);



        const faceColors = [];
        faceColors[0] = Color3.Blue().toColor4();
        faceColors[1] = Color3.Teal().toColor4();
        faceColors[2] = Color3.Red().toColor4();
        faceColors[3] = Color3.Purple().toColor4();
        faceColors[4] = Color3.Green().toColor4();
        faceColors[5] = Color3.Yellow().toColor4();

        const box = MeshBuilder.CreateBox('box', { size: 0.5, faceColors: faceColors });
        box.position = new Vector3(2, 0, 2);

        //y面 绘制三角形 
        const points = [];
        points.push(new Vector3(2, 0, 2));
        points.push(new Vector3(2, 0, -2));
        points.push(new Vector3(-2, 0, -2));

        //闭合路径？？？
        points.push(points[0]);

        MeshBuilder.CreateLines("triangle", { points: points });

        //动画设置
        class slide{ //after covering dist apply turn
            turn:number;
            dist:number;
            //构造函数
            constructor(turn: number,dist: number){
                this.turn = turn;
                this.dist = dist;
            }
        };
        const track: any[] = [];
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!重点!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //控制物体移动到什么位置后，进行指定角度的转向（参数：旋转角度，旋转发生位置(移动距离)
        track.push(new slide(Math.PI / 2, 4));  //first side length 4
        track.push(new slide(3 * Math.PI / 4, 8)); //at finish of second side distance covered is 4 + 4
        track.push(new slide(3 * Math.PI / 4, 8 + 4 * Math.sqrt(2))); //all three sides cover the distance 4 + 4 + 4 * sqrt(2)

        //动画回调函数
        //参数设置
        let distance = 0;//移动距离初始
        let p = 0;//移动线段
        let step = 0.05;//移动步长
        scene.onBeforeRenderObservable.add(()=>{
            box.movePOV(0, 0, step);//（参数：起点、终点、步长）
            distance += step;
            //旋转判断（条件，走完这条线的长度）
            if(distance > track[p].dist){
              box.rotate(Axis.Y, track[p].turn, Space.LOCAL);
              p += 1;//走此下一段线
              p %= track.length;
              //三段线走完重置
              if (p === 0) {
                distance = 0;
                box.position = new Vector3(2, 0, 2); //reset to initial conditions(同时减少误差：直接还原初始方位)只是此处：起点即为终点（忽略误差）
                box.rotation = Vector3.Zero();//prevents error accumulation 
            }
            }
        })
       //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!重点!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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