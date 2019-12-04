import build, { getParam } from 'build-route-tree';

const rawTree = {
  home: null,
  price: {
    supplier: getParam(null),
  },
  demo: null,
};

export const routes = build(rawTree);
