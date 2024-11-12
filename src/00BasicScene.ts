import { ArcRotateCamera, Engine, HemisphericLight, Scene, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class BasicScene {

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


        return scene;
        //链接地址（http://localhost:5173/）
    }
}

