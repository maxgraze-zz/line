import React from 'react';

export const ColorLegend = ({
  colorScale,
  tickSpacing = 100,
  tickSize = 10,
  tickTextOffset = 40,
  type = 'pill',
}) => {
  if (type === 'pill') {
    var width = '24',
      height = '8',
      round = '4';
  } else if (type === 'rect') {
    var width = '8',
      height = '8',
      round = '0';
    tickTextOffset = 15;
  }
  return colorScale.domain().map((domainValue: number, i: number) => (
    <g className='tick' transform={`translate(${i * tickSpacing + 30}, -40)`}>
      <rect
        width={width}
        height={height}
        fill={colorScale(domainValue)}
        strokeWidth='1'
        ry={round}
        rx={round}
      />{' '}
      <text x={tickTextOffset} dy='.65em'>
        {domainValue}
      </text>
    </g>
  ));
};
