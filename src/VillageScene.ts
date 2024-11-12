import { ArcRotateCamera, AssetsManager, Color3, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "babylonjs";
import "babylonjs-loaders";
export default class VillageScene{

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
        const camera = new ArcRotateCamera('camrea',-Math.PI/2, Math.PI/2.5, 15, new Vector3(0, 0, 0));
        camera.attachControl(this.canvas, true);//允许鼠标控制相机

        //创建环境光(参数：名称，方向(处于正方向，但照向负方向，场景)
        const light = new HemisphericLight('light', new Vector3(1, 1, 0), this.scene);
        light;
        // //贴图材质加载(官方)
        // const boxMat = new StandardMaterial("boxMat");
        // boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png");

        // //Ui贴图（官方）
        // const faceUV = [];
        //   faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        //   faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
        //   faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
        //   faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side

        // //创建盒子(官方形式)
        // const box = MeshBuilder.CreateBox(
        //     'box',
        //     // {width: 2, height:1.5}
        //     {faceUV: faceUV, wrap:true}
        //     );
        // //位置设置
        // box.position.y = 0.5;
        // box.material = boxMat;

        //等比例缩放（按照三轴方向）
        // box.scaling.x = 2;
        //角度旋转(按照三轴)
        // box.rotation.y = Tools.ToRadians(45);

        // //创建屋顶(官方形式)
        // const roof = MeshBuilder.CreateCylinder('roof',{
        //     diameter:1.3, height: 1.2, tessellation: 3
        // });
        // roof.scaling.x = 0.75;
        // roof.rotation.z = Math.PI/2;
        // roof.position.y = 1.22;
        // //加载材质
        // const roofMat = new StandardMaterial("roofMat");
        // roofMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/roof.jpg');
        // roof.material = roofMat;

        // //创建地面(官方形式)
        // const ground = MeshBuilder.CreateGround(
        //     'ground',
        //     {width: 20, height:20}
        // );
        // //加载材质
        // const groundMat = new StandardMaterial('groundMat');
        // groundMat.diffuseColor = new Color3(0, 0.75, 0);
        // ground.material = groundMat;//将材质加载到地面ground上

        
        //添加音乐
        // const music = new Sound(
        //     "cello",//音乐名称
        //     "music/music01_gaowuren.mp3", //音乐所在路径(告五人)
        //     this.scene, //添加场景
        //     null, 
        //     { loop: true, autoplay: true });//自动、循环部分设置


        
        //------------------*****重点*****---------------------------
        //------------------------法1-------------------------------------
        //加载本地gltf模型，并对其进行大小和位置调整
        var assetsManager = new AssetsManager(scene);
        var meshTask = assetsManager.addMeshTask("", "", "model/", "办公楼01.gltf");
        var meshTask2 = assetsManager.addMeshTask("", "", "model/", "办公楼03.gltf");
        var meshTask3 = assetsManager.addMeshTask("", "", "model/", "办公楼05.gltf");

        //模型1设置
        meshTask.onSuccess = function(task){
            task.loadedMeshes[0].position =new Vector3(0 ,0, 50);//模型位置
            task.loadedMeshes[0].scaling = new Vector3(1, 1, 1);//模型大小缩放
            task.loadedMeshes[0].rotateAround(
                  new Vector3(0, 0, 0),//旋转点的中心点
                  new Vector3(0, 1, 0),//旋转点的轴
                  -Math.PI/2  //旋转的角度
                );
        }

        //模型2设置
        meshTask2.onSuccess = function(task){
            task.loadedMeshes[0].position =new Vector3(0 ,0, 50);//模型位置
            task.loadedMeshes[0].scaling = new Vector3(1, 1, 1);//模型大小缩放
            task.loadedMeshes[0].rotateAround(
                  new Vector3(0, 0, 0),//旋转点的中心点
                  new Vector3(0, 1, 0),//旋转点的轴
                  Math.PI/2  //旋转的角度
                );
        }
        //模型3设置
        meshTask3.onSuccess = function(task){
            task.loadedMeshes[0].position =new Vector3(0 ,0, 50);//模型位置
            task.loadedMeshes[0].scaling = new Vector3(0.8, 0.8, 0.8);//模型大小缩放
            task.loadedMeshes[0].rotateAround(
                  new Vector3(0, 0, 0),//旋转点的中心点
                  new Vector3(0, 1, 0),//旋转点的轴
                  0  //旋转的角度
                );
        }
        //模型加载到场景
        assetsManager.load();
        //----------------------------------------------------------------------


        /**************************法2************************* 
        //人物动画（这种方法也是可以设置加载模型的方位位置
        // Dude
        SceneLoader.ImportMeshAsync("him", 
        "https://playground.babylonjs.com/scenes/Dude/", 
        "Dude.babylon", 
        scene
        ).then((result) => {！！！！！！！！！！！！
            //获取模型对象赋予变量进行操作！！！！！！！！！！！！！
            var dude = result.meshes[0];
            dude.scaling = new Vector3(0.25, 0.25, 0.25);

            //场景加载动画
            scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
        });
        */

        //--------------------------------官方文档操作------------------------------------
        //创建地面（基于以上官方，进行修改成函数调用形式）
        const ground = this.bulidGround();
        ground;

        //合并Roof和Box对象(官方文档)
        //小房子
        const detached_house = this.buildHouse(1)!;//这里加！表示函数返回值不会为null
        detached_house.rotation.y = -Math.PI / 16;
        detached_house.position.x = -6.8;
        detached_house.position.z = 2.5;

        //大房子
        const semi_house = this.buildHouse(2)!;
        semi_house .rotation.y = -Math.PI / 16;
        semi_house.position.x = -4.5;
        semi_house.position.z = 3;
        //上述两个自建对象不能删，为了下面群组进行部署，只不过重叠了而已

        //官方村庄群
        const places = []; //each entry is an array [house type, rotation, x, z]
        places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
        places.push([2, -Math.PI / 16, -4.5, 3 ]);
        places.push([2, -Math.PI / 16, -1.5, 4 ]);
        places.push([2, -Math.PI / 3, 1.5, 6 ]);
        places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
        places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
        places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
        places.push([1, 5 * Math.PI / 4, 0, -1 ]);
        places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
        places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
        places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
        places.push([2, Math.PI / 1.9, 4.75, -1 ]);
        places.push([1, Math.PI / 1.95, 4.5, -3 ]);
        places.push([2, Math.PI / 1.9, 4.75, -5 ]);
        places.push([1, Math.PI / 1.9, 4.75, -7 ]);
        places.push([2, -Math.PI / 3, 5.25, 2 ]);
        places.push([1, -Math.PI / 3, 6, 4 ]);
    
        //Create instances from the first two that were built 
        const houses = [];
        for (let i = 0; i < places.length; i++) {
            if (places[i][0] === 1) {
                houses[i] = detached_house.createInstance("house" + i);
            }
            else {
                houses[i] = semi_house.createInstance("house" + i);
            }
            houses[i].rotation.y = places[i][1];
            houses[i].position.x = places[i][2];
            houses[i].position.z = places[i][3];
        }


        //返回该场景
        return scene;
        //链接地址（http://localhost:5173/）
        
    }

    //自定义函数(地面)
    bulidGround() {
        const groundMat = new StandardMaterial('groundMat');
        groundMat.diffuseColor = new Color3(0, 1, 0);

        const ground = MeshBuilder.CreateGround("ground",{
            width:80,
            height:80
        });
        //材质加载到指定对象上
        ground.material = groundMat;
        return ground;
    }

    //自定义房子(House)//官方还有利用数组建立房屋群！！自己看
    buildHouse(width:number){
        const roof = this.buildRoof(width);
        const box = this.buildBox(width);
      return Mesh.MergeMeshes([box, roof],
            true,//roof的关于材质1（box）的使用与否
            false,//roof的关于材质2（roof）的使用与否
            undefined,//可以不用，但不能少
            false,//roof的关于材质1（box）的使用与否
            true//roof的关于材质2（roof）的使用与否
            );
    }

    //自定义函数(屋顶)
    buildRoof(width:number){
        //加载材质
        const roofMat = new StandardMaterial("roofMat");
        roofMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/roof.jpg');

        //创建屋顶
        const roof = MeshBuilder.CreateCylinder('roof',{
            diameter:1.3, height: 1.2, tessellation: 3
        });
        roof.scaling.x = 0.75;
        roof.scaling.y = width;
        roof.rotation.z = Math.PI/2;
        roof.position.y = 1.22;
        roof.material = roofMat;
        return roof;
    }

    //自定义函数(屋子主体)
    //根据宽度来更换材质选择
    buildBox(width: number){
        //贴图材质加载
        const boxMat = new StandardMaterial("boxMat");
        if( width == 2)
        {
           boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png");
        }else
        {//主体宽度为1时的材质选择
           boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");
        }
        
        //Ui贴图（官方）
        const faceUV = [];
        if(width == 2)
        {
          faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
          faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
          faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
          faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side             
        }
        else{
          faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
          faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
          faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
          faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side 
        }
        const box = MeshBuilder.CreateBox(
            'box',
            {width: width, 
            faceUV: faceUV,
            wrap:true}
            );
        //位置设置
        box.position.y = 0.5;
        box.material = boxMat;
        return box;
    }

}


/*
 //--------------------------------------------------------------
     //文本设置：重点！！！！！！！！！！！！！！！！！！后续可以用！！
    showAxis = (size:number) => {
	const makeTextPlane = (text:string, color:string, size:number) => {
		const dynamicTexture = new DynamicTexture("dynamicTexture", 50, this.scene, true);
		dynamicTexture.hasAlpha = true;
        //绘制文本
		dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, "transparent", true);
        const  planeMat = new StandardMaterial('textPlaneMat');//材质对象创建
        planeMat.backFaceCulling = false;
        planeMat.specularColor = new Color3(0, 0, 0);
        planeMat.diffuseTexture = dynamicTexture;

        //绘制平面
        const plane = MeshBuilder.CreatePlane('textPlane', {size:size});
        //将文本绑定值文本所在平面(可注释下面代码来检查文本所在位置)
        plane.material = planeMat;
		return plane;
    }
        //X轴
        const axisx = MeshBuilder.CreateLines('axisx', {
            points:[
            Vector3.Zero(),//中心点
            new Vector3(size, 0, 0),
            new Vector3(size * 0.95, 0.05 * size, 0),
            new Vector3(size, 0, 0), 
            new Vector3(size * 0.95, -0.05 * size, 0)
        ]});
        //线的颜色设置
        axisx.color = new Color3(1,0,0);
        //标注文本
        const xChar = makeTextPlane("X",'red', size/10);
        //文本位置(接近箭头)
        xChar.position =new Vector3(0.9*size, -0.05*size, 0);
    }
        //------------------------------------------------------
*/


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