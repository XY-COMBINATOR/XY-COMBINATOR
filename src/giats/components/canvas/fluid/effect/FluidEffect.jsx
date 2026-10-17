import { Effect } from 'postprocessing';
import { Uniform } from 'three';
import fragmentShader from '@src/components/canvas/fluid/glsl/post.frag';
import hexToRgb from '@src/components/canvas/fluid/utils';

class FluidEffect extends Effect {
  constructor({ tFluid, intensity = 1.0, fluidColor = '#ffffff', backgroundColor = '#000000' } = {}) {
    const uniforms = new Map(
      Object.entries({
        tFluid: new Uniform(tFluid),
        uIntensity: new Uniform(intensity),
        uColor: new Uniform(hexToRgb(fluidColor)),
        uBackgroundColor: new Uniform(hexToRgb(backgroundColor)),
      }),
    );

    super('FluidEffect', fragmentShader, { uniforms });

    this.state = {
      tFluid,
      intensity,
      fluidColor,
      backgroundColor,
      cachedFluidColor: hexToRgb(fluidColor),
      cachedBackgroundColor: hexToRgb(backgroundColor),
    };
  }

  updateUniform(key, value) {
    const uniform = this.uniforms.get(key);
    if (uniform && uniform.value !== value) {
      uniform.value = value;
    }
  }

  update() {
    const newFluidColor = hexToRgb(this.state.fluidColor);
    if (newFluidColor !== this.state.cachedFluidColor) {
      this.state.cachedFluidColor = newFluidColor;
      this.updateUniform('uColor', newFluidColor);
    }

    const newBackgroundColor = hexToRgb(this.state.backgroundColor);
    if (newBackgroundColor !== this.state.cachedBackgroundColor) {
      this.state.cachedBackgroundColor = newBackgroundColor;
      this.updateUniform('uBackgroundColor', newBackgroundColor);
    }

    this.updateUniform('uIntensity', this.state.intensity);
  }
}

export default FluidEffect;
