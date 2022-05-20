import { color } from 'd3';
import React from 'react';

export const ColorLegend = ({
  colorScale,
  tickSpacing = 100,
  tickSize = 10,
  tickTextOffset = 40,
}) => {
  return colorScale.domain().map((domainValue: number, i: number) => (
    <g className='tick' transform={`translate(${i * tickSpacing + 30}, -40)`}>
      <rect
        width='24'
        height='8'
        fill={colorScale(domainValue)}
        stroke='black'
        strokeWidth='1'
        ry='4'
        rx='4'
      />{' '}
      <text x={tickTextOffset} dy='.65em'>
        {domainValue}
      </text>
    </g>
  ));
};
