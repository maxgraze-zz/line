import React from 'react';
import { Timeline } from './Timeline';

export const wrapper = ({ graphData }) => {
  //state to handle the legend
  //change data etc.

  return (
    <div className='mural-line-chart'>
      <Timeline />
    </div>
  );
};
