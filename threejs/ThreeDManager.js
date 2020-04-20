/**
 * Created by 王冬 on 2020/4/19.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */

const THREE = window.THREE;

class ThreeDManager {
    constructor(DOM) {
        this.DOM = DOM;
        // 尺寸
        this.size = {
            width: DOM.clientWidth,
            height: DOM.clientHeight
        }
        // 数字的最大的值
        this.MAX_NUMBER = 1;
        this.MIN_NUMBER = 0;
        // 点的数组
        this.points = [];
        this._createScene();
        this._createCamera();
        this._createRender();
        this._createController();
        this._animate();
    }

    // 调用前，先使用 setPointsMax 设置坐标轴最大值，否则最大值默认为 1
    init() {
        this._setCamera()
        this._createGeometry();
        this._createXYZText();
    }

    // 创造场景
    _createScene() {
        this.scene = new THREE.Scene();      //创建场景
        this.scene.background = new THREE.Color('#fff');
    }

    // 添加环境光源
    _addAmbientLight(color = '#fff') {
        let light = new THREE.AmbientLight(color);
        light.position.set(100, 100, 200);
        this.scene.add(light);
    }

    // 清空场景（所有绘制的元素都被清除）
    _clearScene() {
        this.MAX_NUMBER = 1;
        this.MIN_NUMBER = 0;
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }

    // 创造相机
    _createCamera() {
        console.log(this.MAX_NUMBER, this.MIN_NUMBER)
        const MAX_NUMBER = this.MAX_NUMBER - this.MIN_NUMBER;
        const proportion = this.size.width / this.size.height;
        let w = null;
        let h = null;
        // 这里要算出立方体相机的尺寸
        if (proportion > 1) {
            // 说明宽度大于高度
            w = MAX_NUMBER * proportion;
            h = MAX_NUMBER;
        } else {
            w = MAX_NUMBER;
            h = MAX_NUMBER * proportion;
        }
        // 这个是可视区域，是一个立方体，需要定义六个面的位置
        this.camera = new THREE.OrthographicCamera(
            // 左平面的位置，右平面的位置
            w * -1, w * 1,
            // 上平面的位置，下平面的位置
            h * 1, h * -1,
            // 前平面的位置，后平面的位置
            h * -1, MAX_NUMBER * 3);
        this.camera.position.set(MAX_NUMBER, MAX_NUMBER * 0.8, MAX_NUMBER); // 设置相机坐标
        // this.camera.position.set(500, 500, 800);//设置相机坐标
        this.camera.lookAt({x: 0, y: 0, z: 0});//让相机指向场景中心
    }

    // 创建渲染器（容器），并添加到 body 里
    _createRender() {
        //创建渲染器（并设置抗锯齿属性）
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        //设置渲染器的大小
        this.renderer.setSize(this.size.width, this.size.height);
        //添加渲染器的DOM元素到body中
        this.DOM.appendChild(this.renderer.domElement);
    }

    // 创建控制器
    _createController() {
        const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        controls.screenSpacePanning = true;
    }

    // 自动渲染动画，每帧更新一次
    _animate(time) {
        requestAnimationFrame(this._animate.bind(this));
        // 渲染动画
        this.renderer.render(this.scene, this.camera);
    }

    // 设置相机位置
    _setCamera() {
        const MAX_NUMBER = this.MAX_NUMBER;
        const proportion = this.size.width / this.size.height;
        let w = null;
        let h = null;
        // 这里要算出立方体相机的尺寸
        if (proportion > 1) {
            // 说明宽度大于高度
            w = MAX_NUMBER * proportion;
            h = MAX_NUMBER;
        } else {
            w = MAX_NUMBER;
            h = MAX_NUMBER * proportion;
        }
        // 这个是可视区域，是一个立方体，需要定义六个面的位置
        // 修改相机可视区域定位的值
        this.camera.left = w * -1;
        this.camera.right = w * 1;
        this.camera.top = h * 1;
        this.camera.bottom = h * -1;
        this.camera.near = h * -1;
        this.camera.far = MAX_NUMBER * 5;
        this.camera.position.set(MAX_NUMBER, MAX_NUMBER * 0.8, MAX_NUMBER); // 设置相机坐标
        this.camera.updateProjectionMatrix();
    }

    // 绘制线条的基础函数
    _drawLine(xyz1, xyz2, color = '#000') {
        // 创建geometry
        const geometryXY1 = new THREE.Geometry();
        // 添加顶点
        geometryXY1.vertices.push(new THREE.Vector3(...xyz1));
        geometryXY1.vertices.push(new THREE.Vector3(...xyz2));
        const line1 = new THREE.Line(geometryXY1, new THREE.LineBasicMaterial({color}));     //利用geometry和material创建line
        this.scene.add(line1);    //将line添加到场景中
    }

    // 创建 x、y、z 坐标轴
    _createGeometry() {
        const MAX_NUMBER = this.MAX_NUMBER;
        const MIN_NUMBER = this.MIN_NUMBER;
        const LineLength = MAX_NUMBER - MIN_NUMBER
        // 渲染 x/z 轴面
        // 创建geometry
        const geometryXY1 = new THREE.Geometry();
        // 添加顶点
        geometryXY1.vertices.push(new THREE.Vector3(MIN_NUMBER, 0, 0));
        geometryXY1.vertices.push(new THREE.Vector3(MAX_NUMBER, 0, 0));

        const geometryXY2 = new THREE.Geometry();
        geometryXY2.vertices.push(new THREE.Vector3(MIN_NUMBER, 0, 0));
        geometryXY2.vertices.push(new THREE.Vector3(MAX_NUMBER, 0, 0));

        for (let i = 0; i <= 10; i++) {
            // let isZero = parseInt() === 0;
            let n = MIN_NUMBER + i * LineLength / 10;
            let isZero = n < Number.EPSILON && n > Number.EPSILON * -1;

            const line1 = new THREE.Line(geometryXY1, new THREE.LineBasicMaterial({color: isZero ? '#000' : "#ccc"}));     //利用geometry和material创建line

            if (isZero) {
                line1.position.z = 0;
            } else {
                line1.position.z = MIN_NUMBER + i * LineLength / 10;   //设置line的位置（即z轴的坐标）
            }
            this.scene.add(line1);    //将line添加到场景中

            const line11 = new THREE.Line(geometryXY2, new THREE.LineBasicMaterial({color: isZero ? '#000' : "#ccc"}));
            if (isZero) {
                line11.position.x = 0;
            } else {
                line11.position.x = MIN_NUMBER + i * LineLength / 10;
            }
            line11.rotation.y = -Math.PI / 2;    //绕y轴旋转90度
            this.scene.add(line11);
        }

        // 渲染 Y/Z 面
        const geometryYZ1 = new THREE.Geometry();    //创建geometry
        geometryYZ1.vertices.push(new THREE.Vector3(0, 0, MIN_NUMBER));  //添加顶点
        geometryYZ1.vertices.push(new THREE.Vector3(0, 0, MAX_NUMBER));
        const geometryYZ2 = new THREE.Geometry();    //创建geometry
        geometryYZ2.vertices.push(new THREE.Vector3(0, 0, MIN_NUMBER));  //添加顶点
        geometryYZ2.vertices.push(new THREE.Vector3(0, 0, MAX_NUMBER));
        for (let i = 0; i <= 10; i++) {
            // let isZero = parseInt(MIN_NUMBER + i * LineLength / 10) === 0;
            let n = MIN_NUMBER + i * LineLength / 10;
            // 是否是0值坐标轴线
            let isZero = n < Number.EPSILON && n > Number.EPSILON * -1;
            const line2 = new THREE.Line(geometryYZ1, new THREE.LineBasicMaterial({color: isZero ? '#000' : "#ccc"}));     //利用geometry和material创建line
            if (isZero) {
                line2.position.y = 0
            } else {
                line2.position.y = MIN_NUMBER + i * LineLength / 10;   //设置line的位置
            }
            this.scene.add(line2);    //将line添加到场景中

            const line22 = new THREE.Line(geometryYZ2, new THREE.LineBasicMaterial({color: isZero ? '#000' : "#ccc"}));
            if (isZero) {
                line22.position.z = 0
            } else {
                line22.position.z = MIN_NUMBER + i * LineLength / 10;
            }
            line22.rotation.x = -Math.PI / 2;    //绕y轴旋转90度
            this.scene.add(line22);
        }

        // 渲染 X/Z 面
        const geometryXZ1 = new THREE.Geometry();    //创建geometry
        geometryXZ1.vertices.push(new THREE.Vector3(MIN_NUMBER, 0, 0));  //添加顶点
        geometryXZ1.vertices.push(new THREE.Vector3(MAX_NUMBER, 0, 0));
        const geometryXZ2 = new THREE.Geometry();    //创建geometry
        geometryXZ2.vertices.push(new THREE.Vector3(MIN_NUMBER, 0, 0));  //添加顶点
        geometryXZ2.vertices.push(new THREE.Vector3(MAX_NUMBER, 0, 0));
        for (let i = 0; i <= 10; i++) {
            // let isZero = parseInt(MIN_NUMBER + i * LineLength / 10) === 0;
            let n = MIN_NUMBER + i * LineLength / 10;
            let isZero = n < Number.EPSILON && n > Number.EPSILON * -1;
            const line3 = new THREE.Line(geometryXZ1, new THREE.LineBasicMaterial({color: isZero ? '#000' : "#ccc"}));     //利用geometry和material创建line
            if (isZero) {
                line3.position.y = 0
            } else {
                line3.position.y = MIN_NUMBER + i * LineLength / 10;   //设置line的位置
            }
            this.scene.add(line3);    //将line添加到场景中

            const line33 = new THREE.Line(geometryXZ2, new THREE.LineBasicMaterial({color: isZero ? '#000' : "#ccc"}));
            if (isZero) {
                line33.position.x = 0
            } else {
                line33.position.x = MIN_NUMBER + i * LineLength / 10;
            }
            line33.rotation.z = Math.PI / 2;    //绕y轴旋转90度
            this.scene.add(line33);
        }
    }

    // 绘制 x、y、z 坐标轴的文字
    _createXYZText() {
        const MAX_NUMBER = this.MAX_NUMBER;
        const MIN_NUMBER = this.MIN_NUMBER;
        const LineLength = MAX_NUMBER - MIN_NUMBER

        const textLoader = new THREE.FontLoader();
        const that = this;
        textLoader.load(
            './fonts/helvetiker_regular.typeface.json',
            function (font) {
                // left top text
                const options = {
                    size: LineLength * 0.03,
                    height: 0,  // 厚度
                    font, // “引用js字体必须换成英文”
                    bevelThickness: 1,  // 文字斜角的深度。默认值是10。
                    bevelSize: 90,   // 距文字轮廓有多远是斜角。默认值为8。
                    // bevelSegments: 1,   // 斜角段的数量。默认值为3。
                    // curveSegments: 50,  // 曲线上的点数。默认值为12。
                    // bevelEnabled: true,  // 布尔值。打开斜角。默认值为False。
                }

                // 第一个是坐标位置，第二是每个坐标轴写多少+1个文字，比如 10，间隔 10，数字是从 0 ~ 100
                function createText(positions, n = 10, direction) {
                    for (let i = 0; i < n + 1; i++) {
                        let num = positions.text ? positions.text(i) : i * positions.n;
                        num = typeof num === 'number' ? JSON.stringify(Number(num.toFixed(1))) : num;
                        const text = num;
                        // 使用 TextBufferGeometry 比 TextGeometry快
                        const textLeftTop = new THREE.TextBufferGeometry(text, options);
                        const textMeshLeftTop = new THREE.Mesh(textLeftTop, new THREE.MeshBasicMaterial({
                            color: '#333'
                        }));
                        let x = typeof positions.x === 'function' ? positions.x(i) : positions.x;
                        // textMeshLeftTop.position.x = x;
                        let y = typeof positions.y === 'function' ? positions.y(i) : positions.y;
                        // textMeshLeftTop.position.y = y;
                        let z = typeof positions.z === 'function' ? positions.z(i) : positions.z;
                        // textMeshLeftTop.position.z = z;
                        // textGroup.push(textMeshLeftTop);
                        const group = new THREE.Group();//创建一个组，测试如果不加入组无法如以中心旋转而是从min位置旋转
                        // 设置 group 的基准坐标（即group的0,0,0的坐标，是整个世界坐标轴的哪里）
                        group.position.x = x;
                        group.position.y = y;
                        group.position.z = z;
                        group.add(textMeshLeftTop);

                        // 旋转坐标轴文字
                        if ((direction === 'yz-z' && z !== 0) || direction === 'yz-y') {
                            // yx-y 时，不画 0，不然同一个位置有2个不同方向的0，很难看
                            if (direction === 'yz-y' && y === 0) {
                                // console.log(x, y, z)
                                continue;
                            }
                            const q = new THREE.Vector3(0, 1, 0);
                            group.rotateOnWorldAxis(q, Math.PI / 2);
                            group.position.z += MAX_NUMBER / 20;
                        }
                        that.scene.add(group);
                    }
                }

                // 画六个方向的坐标轴文字
                createText({
                    n: LineLength / 10,
                    text: function (i) {
                        if (MIN_NUMBER + i * LineLength / 10 < Number.EPSILON && MIN_NUMBER + i * LineLength / 10 > Number.EPSILON * -1) {
                            return ''
                        } else {
                            return MIN_NUMBER + i * LineLength / 10
                        }
                    },
                    x: 0,
                    y: MAX_NUMBER,
                    z: function (i) {
                        return MIN_NUMBER + i * LineLength / 10
                    }
                }, undefined, 'yz-z');  // xz 面和 z 轴平行的数字，下同
                createText({
                    text: function (i) {
                        if (MIN_NUMBER + i * LineLength / 10 < Number.EPSILON && MIN_NUMBER + i * LineLength / 10 > Number.EPSILON * -1) {
                            return 'Z'
                        } else {
                            return MIN_NUMBER + i * LineLength / 10
                        }
                    },
                    n: MAX_NUMBER / 10,
                    x: function (i) {
                        return MIN_NUMBER + i * LineLength / 10
                    },
                    y: 0,
                    z: MAX_NUMBER
                }, undefined, 'xz-x');
                // x、y 轴文字
                createText({
                    n: MAX_NUMBER / 10,
                    text: function (i) {
                        if (MIN_NUMBER + i * LineLength / 10 < Number.EPSILON && MIN_NUMBER + i * LineLength / 10 > Number.EPSILON * -1) {
                            return 'Y'
                        } else {
                            return MIN_NUMBER + i * LineLength / 10
                        }
                    },
                    x: function (i) {
                        return MIN_NUMBER + i * LineLength / 10
                    },
                    y: MAX_NUMBER,
                    z: 0
                }, undefined, 'xy-x');
                createText({
                    text: function (i) {
                        if (MIN_NUMBER + i * LineLength / 10 < Number.EPSILON && MIN_NUMBER + i * LineLength / 10 > Number.EPSILON * -1) {
                            return ''
                        } else {
                            return MIN_NUMBER + i * LineLength / 10
                        }
                    },
                    n: MAX_NUMBER / 10,
                    x: MAX_NUMBER,
                    y: 0,
                    z: function (i) {
                        return MIN_NUMBER + i * LineLength / 10
                    }
                }, undefined, 'xz-z');
                createText({
                    text: function (i) {
                        if (MIN_NUMBER + i * LineLength / 10 < Number.EPSILON && MIN_NUMBER + i * LineLength / 10 > Number.EPSILON * -1) {
                            return 'X'
                        } else {
                            return MIN_NUMBER + i * LineLength / 10
                        }
                    },
                    n: MAX_NUMBER / 10,
                    x: MAX_NUMBER,
                    y: function (i) {
                        return MIN_NUMBER + i * LineLength / 10
                    },
                    z: 0
                }, undefined, 'xy-y');
                createText({
                    text: function (i) {
                        if (MIN_NUMBER + i * LineLength / 10 < Number.EPSILON && MIN_NUMBER + i * LineLength / 10 > Number.EPSILON * -1) {
                            return ''
                        } else {
                            return MIN_NUMBER + i * LineLength / 10
                        }
                    },
                    n: MAX_NUMBER / 10,
                    x: 0,
                    z: MAX_NUMBER,
                    y: function (i) {
                        return MIN_NUMBER + i * LineLength / 10
                    }
                }, undefined, 'yz-y');
            }
        );
    }

    // 添加点
    addPoint(x, y, z) {
        // 创建单个粒子
        const point = new THREE.Vector3(x, y, z);
        this.points.push(point)
    }

    // 删除添加的点
    clearPointsList() {
        this.points = [];
    }

    // 获取点的最大值。
    // 如果第一个参数不传，则忽略第二个参数，使用默认最大最小值
    // 如果第一个参数传的是数组，则忽略第二个参数，通过数组计算最大最小值
    // 如果第一个参数传的是数字，则认为第二个参数传的也是数字，使用第一个作为最小值，第二个作为最大值
    setPointsMax(pointsOrMin, Max) {
        let max, min;
        // 如果第一个参数不传，则忽略第二个参数，使用默认最大最小值
        // 如果第一个参数传的是数组，则忽略第二个参数。
        // 如果第一个参数传的是数字，则认为第二个参数传的也是数字
        if (typeof pointsOrMin === 'number') {
            this.MIN_NUMBER = pointsOrMin;
            this.MAX_NUMBER = Max;
            return;
        } else if (!pointsOrMin) {
            this.MIN_NUMBER = -1;
            this.MAX_NUMBER = 1;
            return;
        }
        max = pointsOrMin[0][0];
        min = pointsOrMin[0][0];
        pointsOrMin.forEach(point => {
            point.forEach(xyz => {
                if (xyz > max) {
                    max = xyz;
                }
                if (xyz < min) {
                    min = xyz;
                }
            })
        })
        // 此时获得最大的数字，现在要根据最大的数值求坐标轴最大刻度
        // 为了简化，方法是以 10 次方为单位，判断小数点0前后的位数
        const StrMax = String(max);
        const StrMaxArr = StrMax.split('.');
        const isMaxMinus = StrMaxArr[0].indexOf('-') > -1
        // 先判断小数点前是否大于1位（同时，删除负号）
        if ((isMaxMinus && StrMaxArr[0].length > 2) || (!isMaxMinus && StrMaxArr[0].length > 1)) {
            max = Math.pow(10, StrMaxArr[0].length + 1);
        } else if (StrMaxArr[0] !== '0') {
            // 如果只有一位，那么判断一下是否是0，如果不是0，则max 取10
            max = 10;
        } else {
            // 如果小数点前只有一位且是0，则判断小数点后，第几位开始不是0
            for (let j = 0; j < StrMaxArr[1].length; j++) {
                // 如果某一位不等于0。比如0.0123的第一位不是0（此时j=1），那么坐标轴最大值应该取0.1（即10的-1次方）
                // 如果是 0.123，则 j = 0，取 1， 10 的 0 次方
                if (StrMaxArr[1][j] !== '0') {
                    max = Math.pow(10, j * -1);
                    break;
                }
            }
        }
        max *= isMaxMinus ? -1 : 1

        // 特殊处理一下 max
        if (max <= 0 && max > -1) {
            max = 0;
        }
        this.MAX_NUMBER = max;

        const StrMin = String(min);
        const StrMinArr = StrMin.split('.');
        // 是否是负数
        const isMinMinus = StrMinArr[0].indexOf('-') > -1
        // 先判断小数点前是否大于1位
        if ((isMinMinus && StrMinArr[0].length > 2) || (!isMinMinus && StrMinArr[0].length > 1)) {
            min = Math.pow(10, StrMinArr[0].length + 1);
        } else if (StrMinArr[0] !== '0') {
            // 如果只有一位，那么判断一下是否是0，如果不是0，则 min 取10
            min = -10;
        } else {
            // 如果小数点前只有一位且是0，则判断小数点后，第几位开始不是0
            for (let j = 0; j < StrMinArr[1].length; j++) {
                // 如果某一位不等于0。比如0.0123的第一位不是0（此时j=1），那么坐标轴最大值应该取0.1（即10的-1次方）
                // 如果是 0.123，则 j = 0，取 1， 10 的 0 次方
                if (StrMinArr[1][j] !== '0') {
                    min = Math.pow(10, j * -1);
                    break;
                }
            }
        }
        min *= isMinMinus ? -1 : 1;
        // 特殊处理一下 min
        if (min < 1 && min >= 0) {
            min = 0;
        }

        this.MIN_NUMBER = min;
    }

    // 画一个点
    drawPoint(x, y, z, color = '#000', size = 2) {
        const geom = new THREE.Geometry();
        const material = new THREE.PointsMaterial({
            color: color,
            size: size
        });
        // 将粒子加入粒子geometry
        const point = new THREE.Vector3(x, y, z);
        geom.vertices.push(point);
        // 创建粒子系统
        const system = new THREE.Points(geom, material);
        // 将粒子系统加入场景
        this.scene.add(system);
        this.clearPointsList();
    }

    // 画多个点（需要先利用 addPoint 添加点）
    drawPoints(color = '#000', size = 2) {
        const geom = new THREE.Geometry();
        const material = new THREE.PointsMaterial({
            color: color,
            size: size
        });
        // 将粒子加入粒子geometry
        this.points.forEach(item => geom.vertices.push(item));
        // 创建粒子系统
        const system = new THREE.Points(geom, material);
        // 将粒子系统加入场景
        this.scene.add(system);
        this.clearPointsList();
    }

}
