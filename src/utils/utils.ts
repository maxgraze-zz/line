export const callAccessor = (accessor: any, d: any, i: number) =>
  typeof accessor === 'function' ? accessor(d, i) : accessor;
