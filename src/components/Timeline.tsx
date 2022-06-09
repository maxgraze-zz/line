import React, { useRef } from 'react';
import * as d3 from 'd3';

export const Timeline = ({ data }) => {
  //   const [data, setData] = useState<D[]>([{ date: '', value: 0, type: '' }]);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipArea = useRef(null);

  data = data.sort((a, b) => b.date - a.date);
  // eslint-disable-next-line no-console
  const reshapeData = (data: D[]) => {
    let names = [...new Set(data.map(d => d.type))];
    let result = names.map(name => {
      return {
        name: name,
        values: data.filter(d => name === d.type),
      };
    });
    return result;
  };

  //   useEffect(() => {
  //     if (!loaded) {
  //       setLoaded(true);
  //     }

  //     const isNewHeight = prevHeight !== props.dimensions.height;
  //     const isNewWidth = prevWidth !== props.dimensions.width;
  //     if (isNewHeight || isNewWidth) {
  //       setPrevWidth(props.dimensions.height);
  //       setPrevHeight(props.dimensions.width);
  //     }
  //   }, [prevHeight, prevWidth, props.dimensions.height, props.dimensions.width]);

  //   let mergedData = d3.merge(props.data.map(d => d.values));
  //   let scales = ChartHelper.getScales(
  //     mergedData as D[],
  //     props.dimensions.boundedWidth,
  //     props.dimensions.boundedHeight,
  //     props.propertiesNames,
  //   );

  let height = 500;
  let width = 700;
  let margin = { top: 80, right: 50, bottom: 50, left: 80 };
  let innerHeight = height - margin.top - margin.bottom;
  let innerWidth = width - margin.left - margin.right;
  let chartid = 'chart-change';
  let sources = ['Viewers', 'Editors'];
  let parseTime = d3.timeParse('%Y-%m-%d');

  //Accessor functions and other data manipulations to feed into the bisector and scale
  let xAxcessor = d => parseTime(d.date);
  let yAccessor = d => d.value;
  let selectSeries = d3.group(data, d => d.type);
  let selectLookup = d3.group(data, d => parseTime(d.date));
  let selectDates = Array.from(selectLookup).map(d => parseTime(d[1][0].date));
  let extData = d3.extent(data, d => yAccessor(d)); // filter data.set for extext
  let extDates = d3.extent(data, d => xAxcessor(d));
  let tlDateFormat = d3.timeFormat('%a, %b %e %Y'); // Timeline Tooltip Date Format

  //formater for the xAxis
  let formatDate = d3.timeFormat('%-d. %-b');

  //Scales
  let xScale = d3
    .scaleTime()
    .domain(extDates)
    .range([0, width - margin.left - margin.right]);

  let yScale = d3.scaleLinear().domain(extData).range([innerHeight, 0]).nice();

  let colorScale = d3
    .scaleOrdinal()
    .domain(sources)
    .range(['#f59c78', '#4c97f5']);

  //Function to generate the lines
  let lineGenerator = d3
    .line()
    .x(d => xScale(xAxcessor(d)))
    .y(d => yScale(yAccessor(d)))
    .curve(d3.curveMonotoneX);

  //Creating the SVG and bounds
  let svg = d3
    .select(svgRef.current)
    .attr('viewBox', [0, 0, width, height])
    .attr('id', chartid);

  const bounds = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // d3.line()
  //   .defined

  //optional - make axis ticks fit space

  // create both x axis to be rendered
  var xAxis = d3
    .axisBottom(xScale)
    .ticks(10)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(null, formatDate);

  if (width < 700) {
    xAxis.tickFormat(d3.timeFormat('%b'));
  }

  // create the one y axis to be rendered
  var yAxis = d3.axisLeft(yScale).tickSize(0);

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
    .attr('d', d => lineGenerator(d[1]))
    .attr('class', d => 'ts-line ts-line-' + d[0])
    .attr('fill', 'none')
    .attr('stroke', d => colorScale(d));

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

  let chartTip = d3
    .select(tooltipRef.current)
    .attr('class', 'toolTip chartTip');
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
      let [x] = d3.pointer(event);
      const x0 = xScale.invert(x);
      const currentDateSplit = x0.toISOString().split('T')[0].split('-');
      const currentDate = {
        year: parseInt(currentDateSplit[0], 10),
        month: parseInt(currentDateSplit[1], 10),
        day: parseInt(currentDateSplit[2], 10),
      };

      let date = new Date(
        currentDate.year,
        currentDate.month - 1,
        currentDate.day,
      );
      let bisect = d3.bisector(d => d).right;
      let hoverDate = selectDates[bisect(selectDates, date)];
      console.log(bisect(selectDates, date));
      // console.log(x0);
      // 1) Lookup/Get values by date 2) Filter by selection group 3) Sort by top values
      let lookup = selectLookup
        .get(hoverDate)
        .sort((a, b) => d3.descending(a.value, b.value));
      // Display and position vertical line
      d3.select('#' + chartid + ' .y-highlight')
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
              .attr('fill', 'none')
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
          if (innerWidth - d3.pointer(event)[0] < 120) {
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
      d3.select('#' + chartid + ' .y-highlight').style('opacity', 0); // Hide y-highlight line
      d3.selectAll('#' + chartid + ' .y-highlight-point').remove(); // Remove y-highlight points
    });

  return (
    <div className='timeline'>
      <svg id='chart-change' ref={svgRef} width={width} height={height}>
        <g className='y-highlight-points'></g>
        {/* <rect ref={tipArea} className='tip-area'></rect> */}
      </svg>
      <div className='toolTip chartTip' ref={tooltipRef} />
    </div>
  );
};
