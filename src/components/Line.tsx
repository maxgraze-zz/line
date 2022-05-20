import React from 'react';
import * as d3 from 'd3';
import { D } from '../types';
// import './styles.css';

type LineProps = {
  data: [number, number][] | Iterable<[number, number]>; //this should be D[]
  xAccessorScaled: (d: D) => number | number;
  yAccessorScaled: (d: D) => number | number;
  colorAccessorScaled: (d: D) => string;
};

//(d: D) =>
const Line = ({
  data,
  xAccessorScaled,
  yAccessorScaled,
  colorAccessorScaled,
  ...props
}: LineProps) => {
  //add color to take
  const lineGenerator = d3
    .line()
    .x(xAccessorScaled)
    .y(yAccessorScaled)
    .curve(d3.curveMonotoneX);

  return (
    <path
      {...props}
      className={`Line Line--type-line`}
      d={lineGenerator(data) as string | undefined}
      stroke={colorAccessorScaled(data)}
    />
  );
};

export default Line;
