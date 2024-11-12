import { ArcRotateCamera, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";
import { AdvancedDynamicTexture, Button } from "babylonjs-gui";

export default class GUI01WenLi {

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

        //网格创建
        const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 16 });
        sphere.position.y = 1;

        const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6, subdivisions: 2 });
        ground;

        //GUI
        // //01满屏UI：依附在屏幕上，与模型无关
        // const adTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');//满屏UI类型：这里只是创造了一个画布（空白）

        //02局部UI（自己创建一个“文本框进行相关的放置），依附在具体的网格上（模型上）
        //创建文本框，并进行相关设定
        const plane = MeshBuilder.CreatePlane('plane', { size: 2 });
        plane.parent = sphere;
        plane.position.y = 2;

        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;

        const adTexture = AdvancedDynamicTexture.CreateForMesh(plane, 128, 128, false);
        adTexture.renderScale = 1;

        //将要添加到上面空白画布的东西
        // // //01满屏UI button
        // const button = Button.CreateSimpleButton('button', 'Click Me');
        // button.width = '150px';
        // button.height = '40px';
        // button.color = 'white';
        // button.background = 'green';
        // button.cornerRadius = 20;
        // button.onPointerClickObservable.add(() =>{//button点击触发事件
        //     alert('满屏UI测试成功!')//中文显示没问题
        // });
        // //将设置完成的Button添加的画布上
        // adTexture.addControl(button);

        //02局部网格UI设置（可用！！！！！！！！！！！！！！！！！！！！！！！！！
        const button = Button.CreateSimpleButton('button', 'Click Me');
        //控件大小最好按比例大小设置，否则容易 “内容溢出文本框大小，造成显示效果不佳”
        button.width = 1;
        button.height = 0.4;
        button.color = 'white';
        button.background = 'green';
        button.cornerRadius = 20;
        button.onPointerClickObservable.add(() => {//button点击触发事件
            alert('局部UI测试成功!')//中文显示没问题
        });
        //将设置完成的Button添加的画布上
        adTexture.addControl(button);

        //重点 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // Show inspector.(babylonjs自带模型调试器)
        scene.debugLayer.show();
        return scene;
        //链接地址（http://localhost:5173/）
    }
}

