import React, { useRef, useState, useEffect } from 'react';
import { D, Dimensions, DataRecord, AccessorFn } from '../types';

import {
  timeFormat,
  format,
  extent,
  group,
  sort,
  pointer,
  bisector,
  descending,
  selectAll,
  scaleTime,
  scaleLinear,
  curveMonotoneX,
  select,
  line,
  axisLeft,
  axisBottom,
  scaleOrdinal,
} from 'd3';

interface TimelineProps {
  data: D[];
  dimensions: Dimensions;
  propertiesNames: string[];
}

export const Timeline: React.FC<TimelineProps> = ({
  data,
  dimensions,
  propertiesNames,
  ...props
}) => {
  //   const [data, setData] = useState<D[]>([{ date: '', value: 0, type: '' }]);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  const [loaded, setLoaded] = useState(false);

  const [prevHeight, setPrevHeight] = useState(dimensions.height);
  const [prevWidth, setPrevWidth] = useState(dimensions.width);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    }

    const isNewHeight = prevHeight !== dimensions.height;
    const isNewWidth = prevWidth !== dimensions.width;
    if (isNewHeight || isNewWidth) {
      setPrevWidth(dimensions.height);
      setPrevHeight(dimensions.width);
    }
  }, [prevHeight, prevWidth, dimensions.height, dimensions.width]);

  let height = 500;
  let width = 700;
  let margin = { top: 80, right: 50, bottom: 50, left: 80 };
  let innerHeight = height - margin.top - margin.bottom;
  let innerWidth = width - margin.left - margin.right;
  let chartid = 'chart-change';
  let sources = ['Viewers', 'Editors'];

  data = data.sort((a, b) => b.date - a.date);

  //Accessor functions and other data manipulations to feed into the bisector and scale
  let xAxcessor: AccessorFn = d => d.date;
  let yAccessor: AccessorFn = d => d.count;
  let selectSeries = group(data, d => d.type);
  let selectLookup = group(data, d => new Date(d.date));
  let selectDates = sort(Array.from(selectLookup, ([x]) => x));

  let extData = extent(data, d => yAccessor(d)) as [number, number]; // filter data.set for extext
  let extDates = extent(data, d => xAxcessor(d)) as [Date, Date];
  const allDates: (string | Date)[] = data.map(d => d.date);
  let tlDateFormat = timeFormat('%a, %b %e %Y'); // Timeline Tooltip Date Format

  //formater for the xAxis
  let xAxisTickFormat: (date: Date) => string = timeFormat('%-d. %-b');
  let yAxisTickFormat = format('d');

  //Scales
  let xScale = scaleTime().domain(extDates).range([0, innerWidth]);

  let yScale = scaleLinear().domain([extData[0], 10]).range([innerHeight, 0]);

  let colorScale = scaleOrdinal().domain(sources).range(['#f59c78', '#4c97f5']);

  //Function to generate the lines
  let lineGenerator = line()
    .x(d => xScale(xAxcessor(d)))
    .y(d => yScale(yAccessor(d)))
    .curve(curveMonotoneX);

  //Creating the SVG and bounds
  let svg = select(svgRef.current)
    .attr('viewBox', [0, 0, width, height])
    .attr('id', chartid);

  const bounds = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const xAxis = axisBottom(xScale)
    .tickValues(allDates as Date[])
    // .ticks(timeDay.every(1))
    .ticks(allDates.length - 1)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(xAxisTickFormat);

  // if (dimensions.width < 700) {
  //   xAxis.tickFormat(d3.timeFormat('%b'));
  // }

  // create the one y axis to be rendered
  var yAxis = axisLeft(yScale).tickSize(0).tickFormat(yAxisTickFormat);
  // .tickValues(d3.range(0, 10));

  bounds
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(' + 0 + ',' + innerHeight + ')')
    .call(xAxis);

  bounds
    .append('g')
    .attr('class', 'y-axis')
    .attr('transform', 'translate(' + -margin.right / 5 + ',0)')
    .call(yAxis);

  //Creating the line series
  let lineGroup = bounds.append('g').attr('class', 'line-group');

  lineGroup
    .append('g')
    .selectAll('path')
    .data(selectSeries)
    .join('path')
    .attr('d', d =>
      lineGenerator(d[1] as [number, number][] | Iterable<[number, number]>),
    )
    .attr('class', d => 'ts-line ts-line-' + d[0])
    .attr('fill', 'none')
    .attr('stroke', d => colorScale(d) as string);

  //Creating bisector line
  bounds
    .append('line')
    .attr('class', 'y-highlight')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke-dasharray', '2')
    .style('stroke', '#999')
    .style('opacity', 0);

  // Chart Area Tooltip

  let chartTip = select(tooltipRef.current).attr('class', 'toolTip chartTip');
  // Group for line highligt points, sits below tootTip area so point don't interfere with hover
  let yPoints = bounds.append('g').attr('class', 'y-highlight-points');

  // Chart toolTip Area (defines where hover with be active)
  let tipArea = bounds.append('g').attr('class', 'tip-area');

  tipArea
    // .select(tooltipArea.current)
    .append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('opacity', 0)
    .attr('pointer-events', 'all')
    .on('pointermove', event => {
      let [x] = pointer(event);
      const x0 = xScale.invert(x);
      let bisect = bisector(d => d).center;
      let hoverDate = selectDates[bisect(selectDates, x0)];
      // console.log(x0);
      // 1) Lookup/Get values by date 2) Filter by selection group 3) Sort by top values
      let lookup = selectLookup
        .get(hoverDate)
        .sort((a, b) => descending(a.value, b.value));
      // Display and position vertical line
      select('#' + chartid + ' .y-highlight')
        .attr('x1', xScale(hoverDate))
        .attr('x2', xScale(hoverDate))
        .style('opacity', 1);

      // Update Pattern for the Point Highlights
      const yPoint = yPoints
        .selectAll('g')
        .data(lookup, d => d.type)
        .join(
          enter =>
            enter
              .append('g')
              .attr('class', 'y-highlight-point')
              .attr('transform', d => `translate(10, 50)`)
              .attr('opacity', d => (!isNaN(yAccessor(d)) ? 1 : 0)) // hide if value is NaN,
              .append('circle')
              .attr('r', 5)
              .attr('stroke-width', '1.5px')
              .attr('fill', 'white')
              .attr('stroke', d => colorScale(d.type)),
          update =>
            update
              .attr(
                'transform',
                d =>
                  `translate(${xScale(xAxcessor(d))},${yScale(yAccessor(d))})`,
              )
              .attr('opacity', d => (!isNaN(yAccessor(d)) ? 1 : 0)), // hide if value is NaN
          exit => exit.remove(),
        );

      // Custom toolTip Content

      let tipContent = ``; // Start content string
      tipContent += `<table class="tip-table" align="right"><tbody><tr>`;
      // Interate over selected categories twice to create the column and rows - probably a better way to do this
      lookup.map(d => {
        tipContent += `<td class="row-header"><strong style="color: ${colorScale(
          d.type,
        )};">${d.type}</td></strong>`;
      });
      tipContent += `</tr><tr>`;
      lookup.map(d => {
        // tipContent += `<thead><tr><th></th><th>${d.type}</th></tr></thead>`
        tipContent += `<td><span class="tip-values">${yAccessor(
          d,
        )}</span></td>`;
      });
      `</tr></tbody></table>`;

      chartTip
        .style('left', () => {
          if (innerWidth - pointer(event)[0] < 120) {
            return event.pageX - (24 + 240) + 'px';
          } else {
            return event.pageX + 24 + 'px';
          }
        })
        .style('top', event.pageY + 24 + 'px')
        .style('display', 'inline-block')
        .html(`<strong>${tlDateFormat(hoverDate)}</strong><br>${tipContent}`);
    })
    .on('mouseout', event => {
      chartTip.style('display', 'none'); // Hide toolTip
      select('#' + chartid + ' .y-highlight').style('opacity', 0); // Hide y-highlight line
      selectAll('#' + chartid + ' .y-highlight-point').remove(); // Remove y-highlight points
    });

  return (
    <div className='timeline'>
      <svg
        id='chart-change'
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
      >
        <g className='y-highlight-points'></g>
        {/* <rect ref={tipArea} className='tip-area'></rect> */}
      </svg>
      <div className='toolTip chartTip' ref={tooltipRef} />
    </div>
  );
};
