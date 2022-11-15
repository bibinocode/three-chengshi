varying float vSize;
uniform vec3 uColor;
void main(){
  // 圆的坐标到圆心的位置
  float distanceToCenter = distance(gl_PointCoord,vec2(0.5,0.5));
  // 颜色显示程度
  float strength = 1.0 - (distanceToCenter * 2.0);
  if(vSize <=0.0){
    // 改变为圆点
    // 设置透明，就相当于看不见了，
    gl_FragColor = vec4(1.0,0.0,0.0,0.0);
  }else{
    gl_FragColor = vec4(uColor,strength);
  }
  
}