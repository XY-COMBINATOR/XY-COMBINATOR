uniform sampler2D tFluid;

uniform vec3 uColor;
uniform vec3 uBackgroundColor;

uniform float uIntensity;




void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    vec3 fluidColor = texture2D(tFluid, uv).rgb;


    vec4 texture = texture2D(inputBuffer, uv);

    float intensity = length(fluidColor) * uIntensity;

    vec3 selectedColor = uColor * length(fluidColor);

    vec4 colorForFluidEffect = vec4(selectedColor, 1); // Set alpha to 0.5 for semi-transparency

    vec4 computedBgColor = vec4(uBackgroundColor, 1.);



    vec4 computedFluidColor = mix(texture, colorForFluidEffect, 0.0);

    vec4 finalColor;

    if(texture.a < 0.1) {
        finalColor = mix(computedBgColor, colorForFluidEffect, intensity);
    } else {
        finalColor = mix(computedFluidColor, computedBgColor, 1.0 - texture.a);
    }

    outputColor = finalColor;
}
