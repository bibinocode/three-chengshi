varying vec3 vPosition;
uniform float uHeight;
void main(){
    // 根究物体高度计算混合颜色
    float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
    gl_FragColor = vec4(1,1,0,1.0 - gradMix);
}