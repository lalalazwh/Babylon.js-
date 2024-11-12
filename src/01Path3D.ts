import { ArcRotateCamera, Color4, Engine, HemisphericLight, MeshBuilder, Scene, Vector3, Path3D, Color3, LinesMesh } from "babylonjs";
import Coordinate from "./Coordinate";
// import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

export default class Path3D_01 {

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

        const camera = new ArcRotateCamera('camrea', -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;


        const axis = new Coordinate(scene);
        axis.showAxis(4);

        const box = MeshBuilder.CreateBox('box');
        box

        scene.clearColor = new Color4(0.5, 0.5, 0.5, 1);

        //运动轨迹点设置——利用函数
        const points = []
        for (let i = 0; i < 50; i++) {
            points.push(new Vector3(i - 25, 5 * Math.sin(i / 2), 0));
        }
        // const points = [v1, v2, ..., vn];          // array of Vector3
        // const path3d = new BABYLON.Path3D(points);

        //Path3D
        const path3d = new Path3D(points);

        const tangents = path3d.getTangents();//切线数组
        const normals = path3d.getNormals();//法线数组
        const binormal = path3d.getBinormals();//爽发现数组

        //获取前面设置的点位
        const curve = path3d.getCurve();

        //线的绘制
        const line = MeshBuilder.CreateLines('line', { points: curve })
        line
        //+ 法线绘制(利用数组进行存储，方便更新)
        const tg: LinesMesh[] = []
        const no: LinesMesh[] = []
        const bi: LinesMesh[] = []
        for (let p = 0; p < curve.length; p++) {
            tg[p] = MeshBuilder.CreateLines('tg' + p, { points: [curve[p], curve[p].add(tangents[p])], updatable:true });//updatable:true允许点位更新
            tg[p].color = Color3.Red();

            no[p] = MeshBuilder.CreateLines('no' + p, { points: [curve[p], curve[p].add(normals[p])],updatable:true });
            no[p].color = Color3.Blue();

            bi[p] = MeshBuilder.CreateLines('bi' + p, { points: [curve[p], curve[p].add(binormal[p])],updatable:true });
            bi[p].color = Color3.Green();
        }

        // //通过点位的更新，到达 转动的动态效果
        // let theta = 0
        // let newVector = Vector3.Zero()
        // scene.registerAfterRender(()=>{
        //     theta += 0.05
        //     newVector = new Vector3(Math.sin(theta), 0, Math.cos(theta))//新的点位设置
        //     path3d.update(curve, newVector)//点位在更新

        //     for(let p = 0; p < curve.length; p++){
        //         tg[p] = MeshBuilder.CreateLines('tg' + p, { points: [curve[p], curve[p].add(tangents[p])], instance:tg[p] });//instance:tg[p]法线设置
        //         tg[p].color = Color3.Red();
    
        //         no[p] = MeshBuilder.CreateLines('no' + p, { points: [curve[p], curve[p].add(normals[p])],instance:no[p]});
        //         no[p].color = Color3.Blue();
    
        //         bi[p] = MeshBuilder.CreateLines('bi' + p, { points: [curve[p], curve[p].add(binormal[p])],instance:bi[p] });
        //         bi[p].color = Color3.Green();
        //     }
        // })



        //******************************************************************************************************************** */        
        // //运动轨迹点设置——利用点的集合——这是我需要做的！！！！！！
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

        // const sphere = MeshBuilder.CreateSphere('sphere', {diameter:0.2})//创建移动物体小球
        // plane.position.y = 0.3;
        // plane.parent = sphere;

        // let percent = 0//设置物体当前在规划路线行驶路程占比初始值为0
        // scene.onBeforeAnimationsObservable.add(()=>{
        //     percent = (percent + 0.001)%1
        //     txt.text = percent.toString().substring(0, 4)
        //     sphere.position = path3d.getPointAt(percent) //物体获取移动路径中，当前所在位置
        // })

        // //getPreviousPointIndexAt——获取当前物体所占比例的 前一个 索引点
        // const spherePre = MeshBuilder.CreateSphere('spherePre', {diameter:0.2})//创建移动物体小球
        // spherePre.visibility = 0.5
        // spherePre.position = path3d.getCurve()[path3d.getPreviousPointIndexAt(0.5)]


        // setTimeout(()=>{
        //     spherePre.position = path3d.getCurve()[path3d.getPreviousPointIndexAt(0.9)]
        // },
        // 3000) //时间器设置，3s之后出现在指定位置

        // //截取原有路径，形成新的Path3D
        // const path2 = path3d.slice(0.3, 0.9)//截取原路径：原路径长度的0.3 到 原路径长度的0.9位置
        // const p2Line = MeshBuilder.CreateLines('path2', {points:path2.getCurve()})
        // p2Line.color = Color3.Red()
        // p2Line.position.z = 1



        return scene;
        //链接地址（http://localhost:5173/）
    }
}

