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

import LineChartDateBisectorHelper from './ChartHelper';
import LineChartDateBisector from './LineChartDateBisector';
const LineChartDateBisectorWidget = () => {
  const [data, setData] = useState<D[]>([{ date: '', y: 0 }]);

  const { width, height } = useWindowDimensions();

  const dimensions = useRef() as { current: Dimensions };
  dimensions.current = LineChartDateBisectorHelper.getDimensions(
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
      LineChartDateBisectorHelper.getDimensions(
        width * 0.9,
        height * 0.9,
        30,
        50,
        10,
        20,
      );
    // console.log(dimensions.current)
  }, [width, height]);

  const loadData = () => {
    d3.dsv(',', '/data/line.csv', d => {
      return d as unknown as D[];
    }).then(d => {
      setData(d as unknown as D[]);
    });
  };

  useEffect(() => {
    if (data.length <= 1) loadData();
  });

  return (
    <>
      {data.length > 1 ? (
        <LineChartDateBisector
          dimensions={dimensions.current}
          data={data}
          propertiesNames={['date', 'y']}
        />
      ) : (
        <>Loading</>
      )}
    </>
  );
};
export default LineChartDateBisectorWidget;
