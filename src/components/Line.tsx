import React from 'react';
import * as d3 from 'd3';
import { D } from '../types';
// import './styles.css';

type LineProps = {
  data: [number, number][] | Iterable<[number, number]>; //this should be D[]
  xAccessorScaled: (d: D) => number | number;
  yAccessorScaled: (d: D) => number | number;
};

//(d: D) =>
const Line = ({
  data,
  xAccessorScaled,
  yAccessorScaled,
  ...props
}: LineProps) => {
  console.log(data);
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
    />
  );
};

export default Line;
