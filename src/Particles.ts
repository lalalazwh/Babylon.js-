import { ArcRotateCamera, Color4, Engine, HemisphericLight, Mesh, MeshBuilder, ParticleSystem, PointerEventTypes, Scene, Texture, Vector3 } from "babylonjs";

export default class Particles{

    engine: Engine;
    scene: Scene;

    //参数类型统一
    constructor(private readonly canvas:HTMLCanvasElement){
        this.engine = new Engine(this.canvas);//获取canvas标签并创建引擎
        this.scene = this.CreateScene();//创建场景,调用函数接收返回后的场景
        //渲染场景(循环调用)
        this.engine.runRenderLoop(()=>{
            this.scene.render();
        })
    }

    //创建函数（场景）
    CreateScene():Scene{
        //这里就可以直接套用Babylonjs的官网文档示例代码,但视频教程稍有区别，此处更显模块化
        //创建场景
        const scene = new Scene(this.engine);
        //创建相机（参数：名称，水平旋转角度，垂直旋转角度，相机半径，相机距离目标点距离,scene(一般默认只有一个场景)）
        const camera = new ArcRotateCamera('camrea',-Math.PI/2, Math.PI/2.5, 10, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
        light;
        
                //截面旋转成3D（旋转体：高数）
                const fountainProfile = [
                    new Vector3(0, 0, 0),
                    new Vector3(10, 0, 0),
                    new Vector3(10, 4, 0),
                    new Vector3(8, 4, 0),
                    new Vector3(8, 1, 0),
                    new Vector3(1, 2, 0),
                    new Vector3(1, 15, 0),
                    new Vector3(3, 17, 0)
                ];
                const fountain = MeshBuilder.CreateLathe('fountain',{
                    shape:fountainProfile,
                    sideOrientation:Mesh.DOUBLESIDE
                });
                fountain.position.y = -6;
        
                //喷泉粒子效果
                //粒子制作
                const particleSystem = new ParticleSystem('particleSystem',5000, scene);
                particleSystem.particleTexture = new Texture('https://playground.babylonjs.com/textures/flare.png')
        
                //粒子发射位置
                particleSystem.emitter = new Vector3(0, 10 ,0);
                //粒子在不同发射位置的大小
                particleSystem.minEmitBox = new Vector3(-1, 0,0);
                particleSystem.maxEmitBox = new Vector3(1, 0,0);
        
                //颜色(color1和color2是粒子颜色随机变换的范围)
                particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
                particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
                particleSystem.colorDead = new Color4(0, 0, 0.2, 0);//粒子消失时候的颜色
        
                //粒子尺寸
                particleSystem.minSize = 0.1;
                particleSystem.maxSize = 0.5;//同上
        
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
                particleSystem.direction1 = new Vector3(-2, 8 ,2);
                particleSystem.direction2 = new Vector3(2, 8, -2);
        
                //
                particleSystem.minAngularSpeed =0;
                particleSystem.maxAngularSpeed  = Math.PI;
        
                //速度
                particleSystem.minEmitPower = 1;
                particleSystem.maxEmitPower = 3;
                particleSystem.updateSpeed = 0.025;
        
                //启动
                particleSystem.start();
        
                //！！！！！！！！！！！！！！！！！！！！！！！！事件控制！！！！！！！！！！！！！！！！！！！！！！！！！！
                let switched = false;
                scene.onPointerObservable.add((pointerInfo)=>{
                    switch(pointerInfo.type){
                        case PointerEventTypes.POINTERDOWN://点击鼠标后
                        //在此基础上在点击模型
                        if(pointerInfo.pickInfo?.hit){
                            const pickMesh = pointerInfo.pickInfo.pickedMesh;
                            if(pickMesh == fountain){//若点击的模型时之前的“喷泉fountain"
                                switched =! switched;//切换开关(利用“取反” ，而不是“不等于”)
                            }
                            //判断当前开关状态
                            if(switched){
                                particleSystem.start();
                            }
                            else
                            {
                                particleSystem.stop();
                            }
                        }
                    }
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