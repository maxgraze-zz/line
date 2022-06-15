import React, { useState } from 'react';
import ChartWidget from './ReactVersion/ChartWidget';
import { Timeline } from './D3Version/Timeline';
import TimelineWidget from './D3Version/TimelineWidget';
import { useCsv } from './hooks/useCsv';
import * as d3 from 'd3';
import './styles.css';
import LineChartDateBisectorWidget from './Bisector/LineChartDateBisectorWidget';

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
          <TimelineWidget />
          {/* <ChartWidget title='timeline' /> */}
        </header>
      </div>
    </>
  );
};

export default App;
