import React, { useState } from 'react';
import ChartWidget from './components2/ChartWidget';
import { Timeline } from './components/Timeline';
import { useCsv } from './hooks/useCsv';
import * as d3 from 'd3';
import './styles.css';
import LineChartDateBisectorWidget from './Bisector/LineChartDateBisectorWidget';

let parseTime = d3.timeParse('%Y-%m-%d');

const formatDataRows = ({ value, date, type }) => ({
  value: +value,
  date,
  type,
});

const DATA_URL = '/data/dummyData.csv';

const App = () => {
  const { isLoading: isTimelineLoading, data: data } = useCsv(
    DATA_URL,
    formatDataRows,
  );
  const title = 'Unique viewers and editors history';
  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <Timeline data={data} />
          {/* <ChartWidget title='timeline' /> */}
          {/* <LineChartDateBisectorWidget /> */}
        </header>
      </div>
    </>
  );
};

export default App;
