/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/widgets/LineChartWidget/LineChartDateBisectorWidget.tsx
*/

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { D, Dimensions } from '../types';
import useWindowDimensions from '../hooks/useWindowDimensions';

import { useCsv } from '../hooks/useCsv';
import ChartHelper from './ChartHelper';
import { Timeline } from './Timeline';

const formatDataRows = ({ count, date, type }) => ({
  count: +count,
  date: new Date(date),
  type,
});

const DATA_URL = '/data/dummyData.csv';

const TimelineWidget = () => {
  const [data, setData] = useState<D[]>([{ date: '', count: 0, type: '' }]);
  const [propertiesNames] = useState(['date', 'count', 'type']);
  const { width, height } = useWindowDimensions();

  const dimensions = useRef() as { current: Dimensions };
  dimensions.current = ChartHelper.getDimensions(
    width * 0.9,
    height * 0.9,
    30,
    50,
    10,
    20,
  );

  // resize
  useEffect(() => {
    (dimensions as unknown as { current: Dimensions }).current =
      ChartHelper.getDimensions(width * 0.9, height * 0.9, 30, 50, 10, 20);
    // console.log(dimensions.current)
  }, [width, height]);

  // const loadData = () => {
  //   useCsv(DATA_URL, formatDataRows).then(d => {
  //     setData(d as unknown as D[]);
  //   });
  // };
  const loadData = () => {
    d3.json('/data/dummyData.json').then(d => {
      d.data.forEach(v => (v.date = new Date(v.date)));
      setData(d.data as unknown as D[]);
    });
  };
  // const loadData = () => {
  //   d3.dsv(',', '/data/dummyData.csv', d => {
  //     return formatDataRows(d) as unknown as D[];
  //   }).then(d => {
  //     setData(d as unknown as D[]);
  //   });
  // };

  useEffect(() => {
    if (data.length <= 1) loadData();
  });

  return (
    <>
      {data.length > 1 ? (
        <Timeline
          dimensions={dimensions.current}
          data={data}
          propertiesNames={propertiesNames}
        />
      ) : (
        <>Loading</>
      )}
    </>
  );
};
export default TimelineWidget;
