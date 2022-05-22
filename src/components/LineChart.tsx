import React, { useState, useCallback, useEffect } from 'react';
import { D, Dimensions } from '../types';
import ChartHelper from './ChartHelper';
import Axis from './Axis';
import Line from './Line';
import { ColorLegend } from './ColorLegend';

import { merge } from 'd3-array';

let Timeline = (props: TimelineChartProps) => {
  const [loaded, setLoaded] = useState(false);

  const [prevHeight, setPrevHeight] = useState(props.dimensions.height);
  const [prevWidth, setPrevWidth] = useState(props.dimensions.width);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    }

    const isNewHeight = prevHeight !== props.dimensions.height;
    const isNewWidth = prevWidth !== props.dimensions.width;
    if (isNewHeight || isNewWidth) {
      setPrevWidth(props.dimensions.height);
      setPrevHeight(props.dimensions.width);
    }
  }, [prevHeight, prevWidth, props.dimensions.height, props.dimensions.width]);

  let mergedData = merge(props.data.map(d => d.values));
  let scales = ChartHelper.getScales(
    mergedData as D[],
    props.dimensions.boundedWidth,
    props.dimensions.boundedHeight,
    props.propertiesNames,
  );

  const helper = new ChartHelper(props.propertiesNames);
  // console.log(props.data[0].values[0]);
  const xAccessorScaled = (d: D) => scales.xScale(helper.xAccessor(d));
  const yAccessorScaled = (d: D) => scales.yScale(helper.yAccessor(d));
  const y0AccessorScaled = scales.yScale(scales.yScale.domain()[0]);
  const colorAccessorScaled = (d: D) =>
    scales.colorScale(helper.colorAccessor(d));

  // console.log(data.map(d => colorAccessorScaled(d)));
  let circleRadius = 7;
  const tickSpacing = 100;

  return (
    <div id='div'>
      <svg
        id='wrapper'
        width={props.dimensions.width}
        height={props.dimensions.height}
        overflow='visible'
      >
        <ColorLegend
          tickTextOffset={12}
          tickSize={circleRadius}
          colorScale={scales.colorScale}
          tickSpacing={tickSpacing}
          tickTextOffset={40}
        />
        <g
          id='bounds'
          style={{
            transform: `translate(${props.dimensions.margin.left}px, ${props.dimensions.margin.top}px)`,
          }}
        >
          {/* <path id='path' /> */}
          {/* <g id='x-axis' />
          <g id='y-axis' /> */}
          <Axis
            dimension='x'
            dimensions={props.dimensions}
            scale={scales.xScale}
            formatTick={ChartHelper.formatDate}
          />
          <Axis
            dimension='y'
            dimensions={props.dimensions}
            scale={scales.yScale}
            label=''
          />
          {props.data[0].name ? (
            props.data.map((d, i) => (
              <Line
                data={d.values}
                xAccessorScaled={xAccessorScaled}
                yAccessorScaled={yAccessorScaled}
                colorAccessorScaled={colorAccessorScaled}
              />
            ))
          ) : (
            <Line
              data={props.data}
              xAccessorScaled={xAccessorScaled}
              yAccessorScaled={yAccessorScaled}
              colorAccessorScaled={colorAccessorScaled}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

interface TimelineChartProps {
  data: D[];
  dimensions: Dimensions;
  // fill: string;
  propertiesNames: string[];
  stroke: string;
}

export default Timeline;
