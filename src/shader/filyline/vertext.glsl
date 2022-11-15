attribute float aSize;
uniform float uTime;
uniform float uLength;
varying float vSize;
void main(){
  vec4 viewPosition = viewMatrix * modelMatrix *  vec4(position,1.0);
  gl_Position = projectionMatrix * viewPosition;

  // 根据第几个点，然后来依次计算每个点的大小
  vSize = (aSize - uTime);
  // 将反方向的折叠
  if(vSize < 0.0){
    vSize = vSize + uLength;
  }
  // 只显示一半效果,就减去总体的长度
  vSize = (vSize - uLength / 2.0) * 0.1;
  // 因为固定的大小，所以我们需要通过是否原理摄像机来二次计算点的大小
  // 因为是原理相机所以值是负的，所以我们需要取反为正所以这里加了个 - 号。
  gl_PointSize = -vSize / viewPosition.z;
}