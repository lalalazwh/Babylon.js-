import './style.css'
// import BasicScene from './BasicScene';
// import ParentChildren from './ParentChildren';
// import VillageScene from './VillageScene'//重点！！！！！！！！！！场景示例
// import BetterEnvironment from './BetterEnvironment';
// import Particles from './Particles';
// import VillageAnimation from './VillageAnimation';
// import MoveToPath from './MoveToPath';//动画运动路径
// import StreeLight from './StreeLight';
// import CameraBehavior from './CameraBehavior';

// import ActionMesh from './ActionMesh';
// import CameraCollisions from './CameraCollisions';
// import flyCamera from './FlyCamera';
// import followCamera from './FollowCamera';
// import FreeCamera from './FreeCamera';
// import ObjectCollision from './ObjectCollision';
// import RotateFreeCamera from './RotateFreeCamera';
// import { TestCameraProblem01 } from './TestCameraProblem01';
// import WalkAndLookAround from './WalkAndLookAround';
// import MeshBehavior01 from './MeshBehavior01';
// import MeshBehavior02 from './MeshBehavior02';

// import ActionSprite from './ActionSprite';
// import ActionPlayCanUse from './ActionPlayCanUse';
// import GUI01WenLi from './GUI01WenLi';
// import Shadow from './Shadow';
// import Path3D_01 from './01Path3D';
// import Path3D_02 from './02Path3D';
import { ZWH_Final } from './ZWH_Final';

//创建类对象，接收index.html中的指定标签
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!
//将参数传递给BasicScene.ts文件中的函数
// new BasicScene(canvas);

//将参数传递给VillageScene.ts文件中的函数
// new VillageScene(canvas);

//将参数传递给ParentChildren.ts文件中的函数
// new ParentChildren(canvas);

//将参数传递给VillageAnimation.ts文件中的函数
// new VillageAnimation(canvas);

//将参数传递给MoveToPath.ts文件中的函数
// new MoveToPath(canvas);

// 将参数传递给BetterEnvironment.ts文件中的函数
// new BetterEnvironment(canvas);

//将参数传递给Particles.ts文件中的函数
// new Particles(canvas);

//将参数传递给StreeLight.ts文件中的函数
// new StreeLight(canvas);

//将参数传递给Shadow.ts文件中的函数
// new Shadow(canvas);

/*进阶教程！！！！！！！！！！！！！！！！！！！！！*/
// new CameraBehavior(canvas);//相机行为：弹跳行为、成帧行为

// new MeshBehavior01(canvas);//模型行为：沿轴拖动物体

// new MeshBehavior02(canvas);//模型行为：沿六轴方向进行模型的移动和放缩

// new FreeCamera(canvas);//通用相机：键盘和鼠标控制移动和方向

// new followCamera(canvas);//以某一个物体为基准进行摄像机的移动

// new flyCamera(canvas);//仿照飞行游戏摄影视角

//(1)相机+碰撞检测+重力系统

//重点！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
// new CameraCollisions(canvas);//相机的碰撞or物体的移动碰撞=>用于模型导览校园时！！！！！

// new ObjectCollision(canvas);//w物体间的碰撞（第三视角）
//能否做到（第一视角和第三视角的切换？？？？？？）
//step1
// new RotateFreeCamera(canvas);//自由选择相机与自定义输入

//step2
// new WalkAndLookAround(canvas);//第一视角和第三视角共同体现：重点！！！！！！！！！！！！！！！！！！！！！！

//问题测试
//攀爬斜面 + 空格跳跃效果
// new TestCameraProblem01(canvas);//(已解决！)


//（2）事件
// new ActionMesh(canvas);//模型添加行为 _____________>可用：放大，缩小效果可以额外添加趣味玩法：放大和缩小门，当“主角”经过此处时

// new ActionSprite(canvas);//精灵（2维图片）添加事件

// new ActionPlayCanUse(canvas);//鼠标悬浮选中物体时，物体表现出被选中的效果，以及其他：如灯光控制

//学到这里
//(3)GUI 交互界面设置
// new GUI01WenLi(canvas);//GUI 有关纹理方面

//(4)功能一：Path3D-游览路线设置
// new Path3D_01(canvas);

//功能二：相机跟随路径
// new Path3D_02(canvas);

/*********************************************ZWH的最终作品*********************************************** */
new ZWH_Final(canvas);