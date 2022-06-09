/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/LineChart/LineChartDateBisector.tsx
*/

import React, { useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { D, Dimensions } from '../types';
import LineChartDateBisectorHelper from './ChartHelper';
import ChartHelper from './ChartHelper';

const LineChartDateBisector = (props: ILineChartProps) => {
  const memoizedUpdateCallback = useCallback(() => {
    const scales = LineChartDateBisectorHelper.getScales(
      props.data,
      props.dimensions.boundedWidth,
      props.dimensions.boundedHeight,
      props.propertiesNames,
    );
    const bounds = d3.select('#bounds');

    const helper = new LineChartDateBisectorHelper(props.propertiesNames);

    let selectLookup = d3.group(props.data, d => d.date);
    let selectDates = Array.from(selectLookup).map(d => d[1][0].date);

    // draw chart
    const linesGenerator = d3
      .line()
      // @ts-ignore
      .x(d => scales.xScale(helper.xAccessor(d)))
      // @ts-ignore
      .y(d => scales.yScale(helper.yAccessor(d)));

    d3.select('#path')
      .attr('fill', 'none')
      .attr('stroke', 'tomato')
      // @ts-ignore
      .attr('d', linesGenerator(props.data));

    // Peripherals

    //yAxis
    const yAxisGenerator = d3.axisLeft(scales.yScale);
    bounds
      .select('#y-axis')
      // @ts-ignore
      .call(yAxisGenerator);

    // xAxis
    const xAxisGenerator = d3.axisBottom(scales.xScale);
    bounds
      .select('#x-axis')
      // @ts-ignore
      .call(xAxisGenerator)
      .style('transform', `translateY(${props.dimensions.boundedHeight}px)`);

    // @ts-ignore
    // let bisect = d3.bisector(d => d);

    const bisect = d3.bisector(d => {
      const currentDateSplit = (d as { date: string }).date.split('-');
      const currentDate = {
        year: parseInt(currentDateSplit[2], 10),
        month: parseInt(currentDateSplit[0], 10),
        day: parseInt(currentDateSplit[1], 10),
      };
      return new Date(currentDate.year, currentDate.month, currentDate.day);
    });

    const focus = bounds
      .append('g')
      .append('circle')
      .style('fill', 'none')
      .attr('stroke', 'white')
      .attr('r', 8.5)
      .style('opacity', 0);

    const focusText = bounds
      .append('g')
      .append('text')
      .style('opacity', 0)
      .style('fill', 'white')
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle');

    bounds
      .append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', props.dimensions.width)
      .attr('height', props.dimensions.height)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

    function mouseover() {
      focus.style('opacity', 1);
      focusText.style('opacity', 1);
    }

    function mousemove(event: React.MouseEvent) {
      const [x] = d3.pointer(event);
      const x0 = scales.xScale.invert(x);
      const currentDateHover = x0.toISOString().split('T')[0];
      const currentDateSplit = x0.toISOString().split('T')[0].split('-');
      const currentDate = {
        year: parseInt(currentDateSplit[0], 10),
        month: parseInt(currentDateSplit[1], 10),
        day: parseInt(currentDateSplit[2], 10),
      };
      //   let hoverdata = currentDate[bisect(selectDates, invert)]; //it would return 2.
      let selectedData = props.data[props.data.length - 1];
      console.log(
        new Date(currentDate.year, currentDate.month, currentDate.day),
      );
      const i = bisect.right(
        props.data,
        new Date(currentDate.year, currentDate.month, currentDate.day),
      );
      if (i <= props.data.length - 1) selectedData = props.data[i];
      let bisect2 = d3.bisector(d => d).right;

      console.log('bi', bisect2(selectDates, currentDateHover));
      let hoverDate = selectDates[bisect2(selectDates, currentDateHover)]; //it would return 2.
      //   hoverDate = ChartHelper.dateParser(hoverDate);

      // 1) Lookup/Get values by date 2) Filter by selection group 3) Sort by top values
      let lookup = selectLookup.get(hoverDate);
      // .sort((a, b) => d3.descending(a.value, b.value));

      focus
        .attr('cx', scales.xScale(new Date(selectedData.date)))
        .attr('cy', scales.yScale(selectedData.value));
      focusText
        .html(`x:${selectedData.date}  -  y:${selectedData.value}`)
        .attr('x', scales.xScale(new Date(selectedData.date)) + 15)
        .attr('y', scales.yScale(selectedData.value));

      //   focus
      //     .attr('cx', scales.xScale(new Date(selectedData.date)))
      //     .attr('cy', scales.yScale(selectedData.value));
      //   focusText
      //     .html(`x:${selectedData.date}  -  y:${selectedData.value}`)
      //     .attr('x', scales.xScale(new Date(selectedData.date)) + 15)
      //     .attr('y', scales.yScale(selectedData.value));
    }
    function mouseout() {
      focus.style('opacity', 0);
      focusText.style('opacity', 0);
    }
  }, [props.data, props.dimensions, props.propertiesNames]);

  useEffect(() => {
    memoizedUpdateCallback();
  }, [memoizedUpdateCallback, props.data]);

  return (
    <div id='div'>
      <svg
        id='wrapper'
        width={props.dimensions.width}
        height={props.dimensions.height}
      >
        <g
          id='bounds'
          style={{
            transform: `translate(${props.dimensions.margin.left}px, ${props.dimensions.margin.top}px)`,
          }}
        >
          <path id='path' />
          <g id='x-axis' />
          <g id='y-axis' />
        </g>
      </svg>
    </div>
  );
};

interface ILineChartProps {
  dimensions: Dimensions;
  data: D[];
  propertiesNames: string[];
}

export default LineChartDateBisector;
