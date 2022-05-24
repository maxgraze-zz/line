export type D = {
  date: Date | string;
  value: number;
  type?: string;
  values?: number;
  name?: string;
};

// export interface D {
//   [property: string]: string[] | [];
// }

export type TimelineProps = {
  data: D[];
  label: string;
  xAccessor: (d: D) => Date | null;
  yAccessor: (d: D) => number;
};
export type Dimensions = {
  width: number;
  height: number;
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  boundedWidth: number;
  boundedHeight: number;
};
