import React, { useState, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import { D, Dimensions } from '../types';
import ChartHelper from './ChartHelper';
import Axis from './Axis';
import Line from './Line';
import { ColorLegend } from './ColorLegend';
import { line } from 'd3';

const formatDate = d3.timeFormat('%-d. %-b');
// const dateAccessor = (d: D) => formatDate(d.date.toString());
let Timeline = (props: TimelineChartProps) => {
  const [loaded, setLoaded] = useState(false);

  const [prevHeight, setPrevHeight] = useState(props.dimensions.height);
  const [prevWidth, setPrevWidth] = useState(props.dimensions.width);

  const memoizedDrawCallback = useCallback(() => {
    // d3.select('#div').selectAll('*').remove()
  }, []);

  // const memoizedUpdateCallback = useCallback(() => {
  //   const scales = ChartHelper.getScales(
  //     props.data,
  //     props.dimensions.boundedWidth,
  //     props.dimensions.boundedHeight,
  //     props.propertiesNames,
  //   );
  //   return scales
  // const bounds = d3.select('#bounds');
  // const helper = new ChartHelper(props.propertiesNames);
  // // Chart

  // // draw chart
  // const linesGenerator = d3
  //   .area()
  //   // @ts-ignore
  //   .x(d => scales.xScale(helper.xAccessor(d)))
  //   // @ts-ignore
  //   .y0(scales.yScale(0))
  //   .y1(d => {
  //     // @ts-ignore
  //     return scales.yScale((d as D).value);
  //   });

  // d3.select('#path')
  //   .attr('fill', props.fill)
  //   .attr('stroke', props.stroke)
  //   // @ts-ignore
  //   .attr('d', linesGenerator(props.data));

  // // Peripherals

  // // yAxis
  // const yAxisGenerator = d3.axisLeft(scales.yScale);
  // bounds
  //   .select('#y-axis')
  //   // @ts-ignore
  //   .call(yAxisGenerator);

  // // xAxis
  // const xAxisGenerator = d3.axisBottom(scales.xScale);
  // bounds
  //   .select('#x-axis')
  //   // @ts-ignore
  //   .call(xAxisGenerator)
  //   .style('transform', `translateY(${props.dimensions.boundedHeight}px)`);
  // }, [
  //   props.data,
  //   props.dimensions.boundedHeight,
  //   props.dimensions.boundedWidth,
  //   props.fill,
  //   props.propertiesNames,
  //   props.stroke,
  // ]);

  // useEffect(() => {
  //   if (!loaded) {
  //     setLoaded(true);
  //     memoizedDrawCallback();
  //     memoizedUpdateCallback();
  //   } else {
  //     memoizedUpdateCallback();
  //   }
  // }, [loaded, memoizedDrawCallback, memoizedUpdateCallback]);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    }

    const isNewHeight = prevHeight !== props.dimensions.height;
    const isNewWidth = prevWidth !== props.dimensions.width;
    if (isNewHeight || isNewWidth) {
      setPrevWidth(props.dimensions.height);
      setPrevHeight(props.dimensions.width);
      memoizedDrawCallback();
      // memoizedUpdateCallback();
    }
  }, [
    memoizedDrawCallback,
    // memoizedUpdateCallback,
    prevHeight,
    prevWidth,
    props.dimensions.height,
    props.dimensions.width,
  ]);
  let scales = ChartHelper.getScales(
    props.data,
    props.dimensions.boundedWidth,
    props.dimensions.boundedHeight,
    props.propertiesNames,
  );

  const helper = new ChartHelper(props.propertiesNames);
  const xAccessorScaled = (d: D) => scales.xScale(helper.xAccessor(d));
  const yAccessorScaled = (d: D) => scales.yScale(helper.yAccessor(d));
  const y0AccessorScaled = scales.yScale(scales.yScale.domain()[0]);
  // let lineData = props.data.filter(d => d.name === 'Editors');
  // let lineD = lineData[0].values;
  // console.log(lineD);
  // console.log(lineData[0]);
  let colorValue = d => d.type;
  let circleRadius = 7;
  const tickSpacing = 100;
  const colorScale = d3
    .scaleOrdinal()
    .domain(props.data.map(colorValue))
    .range(['#E6842A', '#137B80', '#8E6C8A']);
  return (
    <div id='div'>
      <svg
        id='wrapper'
        width={props.dimensions.width}
        height={props.dimensions.height}
        overflow='visible'
      >
        <ColorLegend
          tickSpacing={22}
          tickTextOffset={12}
          tickSize={circleRadius}
          colorScale={colorScale}
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
            formatTick={formatDate}
          />
          <Axis
            dimension='y'
            dimensions={props.dimensions}
            scale={scales.yScale}
            label=''
          />
          {/* {props.data.series ? ( */}
          {/* {lineD.map(d => ( */}
          <Line
            data={props.data.filter(d => d.type === 'Editors')}
            xAccessorScaled={xAccessorScaled}
            yAccessorScaled={yAccessorScaled}
          />
          {/* ))} */}
          {/* ) : (
            <Line
              data={props.data.filter(d => d.type === 'Viewers')}
              xAccessorScaled={xAccessorScaled}
              yAccessorScaled={yAccessorScaled}
            />
          )} */}
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
