import { useEffect, useRef, useState } from 'react';
// import './ChartWidget.scss'
import ChartHelper from './ChartHelper';
import LineChart from './LineChart';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { Dimensions, D } from '../types';
import * as d3 from 'd3';
import LineChartDateBisector from './LineChartDateBisector';
import React from 'react';
// import './styles.css';

type ChartWidgetProps = {
  title: string;
};
const ChartWidget = ({ title }: ChartWidgetProps) => {
  const [data, setData] = useState<D[]>([{ date: '', value: 0, type: '' }]);
  // const [data, setData] = useState<D>();

  //
  const [propertiesNames] = useState(['date', 'value', 'type']);

  const { height, width } = useWindowDimensions();

  const dimensions = useRef() as { current: Dimensions };
  dimensions.current = ChartHelper.getDimensions(
    width * 0.9,
    height * 0.5,
    50,
    50,
    10,
    50,
  );

  // resize
  useEffect(() => {
    (
      dimensions as unknown as {
        current: Dimensions;
      }
    ).current = ChartHelper.getDimensions(
      width * 0.9,
      height * 0.5,
      50,
      50,
      10,
      50,
    );
    // console.log(dimensions.current)
  }, [width, height, dimensions]);

  //   const loadData = () => {
  //     d3.dsv(',', '/utils/dummyData.csv', d => {
  //       return (d as unknown) as D[];
  //     })
  //       .then(d => ({
  //         date: new Date(d.dte),e
  //         type: d.var,
  //         value: +d.q,
  //       }))
  //       .sort((a: Date, b: Date): Date => b.date - a.date)
  //       .then(d => {
  //         setData((d as unknown) as D[]);
  //       });
  //   };

  const loadData = () => {
    d3.dsv(',', '/data/dummyData.csv', d => {
      return d as unknown as D[];
    }).then(d => {
      d = reshapeData(d);
      return setData(d as unknown as D[]);
    });
  };
  useEffect(() => {
    if (data.length <= 1) loadData();
  });
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
  const circleRadius = 7;
  return (
    <>
      <div className='header'>
        <h1 className='title'>{title}</h1>
        {/* <div className='legend-group'>
          <div className='legend viewers'></div>
          <span>Viewers</span>
          <div className='legend editors'></div>
          <span>Editors</span>
        </div> */}
      </div>
      {data.length > 1 ? (
        <>
          <LineChart
            dimensions={dimensions.current}
            data={data[0].values as unknown as D[]}
            propertiesNames={propertiesNames}
          />
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default ChartWidget;
