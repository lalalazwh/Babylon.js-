//坐标系显示
import { Color3, DynamicTexture, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from "babylonjs";

export default class Coordinate{
  //场景构建
  constructor(private scene:Scene){}

    //坐标系的建立
    //坐标系文本
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

        //其余各轴
        const axisY = MeshBuilder.CreateLines("axisY", { points:[
            Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0), 
            new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
        ]});
        axisY.color = new Color3(0, 1, 0);
        const yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
        
        const axisZ = MeshBuilder.CreateLines("axisZ", { points: [
            Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
            new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
        ]}); 
        axisZ.color = new Color3(0, 0, 1);
        const zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
    }

    /*******************************Local Axes****************************/
localAxes = (size:number) => {
    const local_axisX = MeshBuilder.CreateLines("local_axisX", { points: [
        Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
    ]}, this.scene);
    local_axisX.color = new Color3(1, 0, 0);

    const local_axisY = MeshBuilder.CreateLines("local_axisY", { points: [
        Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
    ]}, this.scene);
    local_axisY.color = new Color3(0, 1, 0);

    const local_axisZ = MeshBuilder.CreateLines("local_axisZ", { points: [
        Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
    ]}, this.scene);
    local_axisZ.color = new Color3(0, 0, 1);

    const local_origin = new TransformNode("local_origin");

    local_axisX.parent = local_origin;
    local_axisY.parent = local_origin;
    local_axisZ.parent = local_origin;

    return local_origin;
}
/*******************************End Local Axes****************************/

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