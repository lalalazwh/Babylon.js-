import { ArcRotateCamera, Engine, HemisphericLight, Scene, Sprite, SpriteManager, Vector3 } from "babylonjs";
import Coordinate from "./Coordinate";

export default class ActionSprite {

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
        camera.speed = 0.2;

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;


        const axis = new Coordinate(scene);
        axis.showAxis(4);


        //创建精灵（2维素材）
        const spriteManager = new SpriteManager(
            'sprteManager',
            'https://playground.babylonjs.com/textures/palm.png',
            2000,//精灵数量
            800,
            scene
        );

        //具体精灵（精灵容器）
        for( let i = 0; i<2000; i++){
            const tree = new Sprite('tree' + i, spriteManager);
            tree.position.x = Math.random() * 100 - 50;
            tree.position.z = Math.random() * 100 - 50;

            //部分呈现倒伏状
            if(Math.round(Math.random() * 5) == 0){
                tree.angle = Math.PI/2;
                tree.position.y = -0.2
            }
        }
        
        //player精灵创建
        const spriteManagerPlayer = new SpriteManager(
            'spriteManagerPlayer',
            'https://playground.babylonjs.com/textures/player.png',
            2,
            64,//单位大小
            scene
        );
        spriteManagerPlayer.isPickable = true;

        //第一个player容器
        const player1 = new Sprite('player1', spriteManagerPlayer);
        player1.playAnimation(0, 40, true, 100);//人物动画
        player1.position.y = -0.3;
        player1.size = 0.3;
        player1.isPickable = true;

        return scene;
        //链接地址（http://localhost:5173/）
    }
}

