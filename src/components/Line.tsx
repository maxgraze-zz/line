import React from 'react';
import * as d3 from 'd3';
import { line, curveMonotoneX } from 'd3-shape';
import { D } from '../types';
// import './styles.css';

type LineProps = {
  data: [number, number][] | Iterable<[number, number]> | D[];
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
  const lineGenerator = line()
    .x(xAccessorScaled)
    .y(yAccessorScaled)
    .curve(curveMonotoneX);

  return (
    <path
      {...props}
      className={`Line Line--type-line`}
      d={lineGenerator(data) as string | undefined}
      stroke={colorAccessorScaled(data[0])}
    />
  );
};

export default Line;
