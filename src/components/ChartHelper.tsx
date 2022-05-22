import { extent, max } from 'd3-array';
import { scaleTime, scaleOrdinal, scaleLinear } from 'd3-scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { Dimensions, D } from '../types';

export default class ChartHelper {
  private readonly metric: string[];

  constructor(metric: string[]) {
    this.metric = metric;
  }

  static dateParser = timeParse('%Y-%m-%d');

  static formatDate = timeFormat('%-d. %-b');

  // @ts-ignore
  public xAccessor = (d: D) =>
    ChartHelper.dateParser(d[this.metric[0]] as string);
  // @ts-ignore
  public yAccessor = (d: D) => +d[this.metric[1]];

  // @ts-ignore
  public colorAccessor = (d: D) => d[this.metric[2]];

  static getDimensions = (
    width: number,
    height: number,
    left: number,
    right: number,
    top: number,
    bottom: number,
  ): Dimensions => {
    const dimensions = {
      width,
      height,
      margin: {
        left,
        right,
        top,
        bottom,
      },
      boundedWidth: 0,
      boundedHeight: 0,
    };
    dimensions.boundedWidth =
      dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight =
      dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
    // (dimensions.innerHeight = Math.max(dimensions.boundedHeight, 0)),
    // (dimensions.innerWidth = Math.max(dimensions.boundedWidth, 0));
    return dimensions;
  };

  static getScales = (
    data: D[],
    width: number,
    height: number,
    metric: string[],
    // colorAccessor: (d: D) => string,
  ) => {
    const helper = new ChartHelper(metric);
    return {
      xScale: scaleTime()
        .domain(extent(data, helper.xAccessor) as [Date, Date])
        .range([0, width]),
      yScale: scaleLinear()
        .domain([
          0,
          max(data, d => {
            return +(d.value as number);
          }),
        ] as number[])
        .range([height, 0])
        .nice(),
      colorScale: scaleOrdinal()
        .domain(['Viewers', 'Editors'])
        .range(['#E6842A', '#137B80']),
    };
  };
}
