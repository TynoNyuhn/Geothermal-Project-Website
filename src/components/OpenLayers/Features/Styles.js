import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Text from 'ol/style/Text.js';

export default {
  Point: new Style({
    image: new CircleStyle({
      radius: 10,
      // fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
      fill: new Fill({
        color: "rgba(133,182,111,1.0)"
      })
    }),
    text: new Text({text: ""})
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
};
