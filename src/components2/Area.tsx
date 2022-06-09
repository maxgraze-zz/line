import React from 'react';
import * as d3 from 'd3';
import { D } from '../types';

type AreaProps = {
  data: D[];
  xAccessorScaled: (d: D) => number;
  yAccessorScaled: (d: D) => number;
  y0Scaled: number;
  style: { fill: string };
};

const Area = ({
  data,
  xAccessorScaled,
  yAccessorScaled,
  y0Scaled,
  ...props
}: AreaProps) => {
  const areaGenerator = d3
    .area()
    .x(xAccessorScaled)
    .y0(yAccessorScaled)
    .y1(y0Scaled)
    .curve(d3.curveMonotoneX);

  return (
    <path
      {...props}
      className={`Line Line--type-area`}
      d={areaGenerator(data)}
    />
  );
};

export default Area;
