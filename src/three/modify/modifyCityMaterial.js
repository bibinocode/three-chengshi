/**
 * @author 阿逼
 * @descriptions hook城市模型着色器
 */
import * as Three from 'three'
import gsap from 'gsap'
export default function modifyCityMaterial (mesh) {
  // 传入物体的原因是因为gemoetry下有个computeBoundingBox方法用来计算当前几何体的的边界矩形，然后就可以取到最高和最低
  // 计算后就可以通过 gemoetry取属性boundingBox

  mesh.material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
      #include <common>
      //#end#
    `)
    shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', `
      #include <dithering_fragment>
      //#end fra#
    `)
    // 颜色渐变效果
    addGradColor(shader, mesh)
    addShaper(shader, mesh)
    addLine(shader)
    addToTop(shader)
  }
}

export function addGradColor (shader, mesh) {
  mesh.geometry.computeBoundingBox()
  const { min, max } = mesh.geometry.boundingBox
  let uHeight = max.y - min.y

  shader.uniforms.uHeight = {
    value: uHeight
  }
  shader.uniforms.uTopColor = {
    value: new Three.Color('#aaaeff')
  }

  // hook顶点着色器,将顶点参数传给片元着色器
  shader.vertexShader = shader.vertexShader.replace('#include <common>', `
      #include <common>
      varying vec3 vPosition;
    `)
  shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      vPosition = position;
    `)

  // hook 片元着色器
  shader.fragmentShader = shader.fragmentShader.replace('//#end#', `
      uniform vec3 uTopColor;
      uniform float uHeight;
      varying vec3 vPosition;
      //#end#
    `)
  shader.fragmentShader = shader.fragmentShader.replace('//#end fra#', `
      vec4 distColor = gl_FragColor;
      // 计算混合百分比
      float gradMin = (vPosition.y + uHeight / 2.0) / uHeight;
      // 计算混合颜色
      vec3 gradMinxColor = mix(distColor.xyz,uTopColor,gradMin);
      gl_FragColor = vec4(gradMinxColor,1.0);
      //#end fra#
    `)
}


export function addShaper (shader, mesh) {
  // 需要一个原点
  shader.uniforms.uDistance = {
    value: new Three.Vector2(0, 0)
  }
  // 需要一个脉冲宽度
  shader.uniforms.uShaperWidth = {
    value: 5
  }
  // 时间
  shader.uniforms.uShaperTime = {
    value: 0
  }

  // uniform传递
  shader.fragmentShader = shader.fragmentShader.replace('//#end#', `
    uniform vec2 uDistance;
    uniform float uShaperWidth;
    uniform float uShaperTime;
    //#end#
  `)

  // 效果
  shader.fragmentShader = shader.fragmentShader.replace('//#end fra#', `
    // 计算顶点xz距离圆心距离
    float shaperRadius = distance(vPosition.xz,uDistance);
    // 计算扩散范围函数 半径的平方 + 线圈宽度
    float shaperIndex = -(shaperRadius - uShaperTime)*(shaperRadius - uShaperTime) + uShaperWidth;
    // 如果扩散范围 > 0时,就重新定义混合颜色
    if(shaperIndex > 0.0){
      gl_FragColor = mix(gl_FragColor,vec4(1,1,1,1),shaperIndex / uShaperWidth);
    }
    //#end fra#
  `)

  // 用gsap改变时间
  gsap.to(shader.uniforms.uShaperTime, {
    value: 500,
    duration: 2,
    ease: 'none', // 线性
    repeat: -1
  })
}


export function addLine (shader) {
  shader.uniforms.uLineWidth = {
    value: 50
  }
  shader.uniforms.uLineTime = {
    value: -1000
  }

  shader.fragmentShader = shader.fragmentShader.replace('//#end#', `
    uniform float uLineWidth;
    uniform float uLineTime;
    //#end#
  `)

  shader.fragmentShader = shader.fragmentShader.replace('//#end fra#', `
    float lineIndex = -(vPosition.x + vPosition.z - uLineTime) * (vPosition.x + vPosition.z - uLineTime) + uLineWidth;
    if(lineIndex > 0.0){
      gl_FragColor = mix(gl_FragColor,vec4(1.0,0.8,0.8,1.0),lineIndex / uLineWidth);
    }
    //#end fra#
  `)

  gsap.to(shader.uniforms.uLineTime, {
    value: 1000,
    duration: 4,
    ease: 'none',
    repeat: -1
  })
}

export function addToTop (shader) {
  shader.uniforms.uTopHeight = {
    value: 200
  }
  shader.uniforms.uTopTime = {
    value: 0
  }

  shader.fragmentShader = shader.fragmentShader.replace('//#end#', `
    uniform float uTopHeight;
    uniform float uTopTime;
    //#end#
  `)

  shader.fragmentShader = shader.fragmentShader.replace('//#end fra#',
    `
    float topIndex = -(vPosition.y - uTopTime) * (vPosition.y - uTopTime) + uTopHeight;
    if(topIndex > 0.0){
      gl_FragColor = mix(gl_FragColor,vec4(0.8,0.8,1.0,1.0),topIndex / uTopHeight);
    }
    //#end fra#
  `)
  gsap.to(shader.uniforms.uTopTime, {
    value: 500,
    duration: 3,
    ease: "none",
    repeat: -1
  })
}