import React, { useState } from "react";
import Superpixel from "./superpixel";

var keys = [];

const getAnnotationData = (key, array, defaultAnnotating) => {
    for (var e of array) {
        if (e.index === parseInt(key)) return { tag: e.tag, color: e.color };
      }
    return defaultAnnotating;
  }

const updateAnnotating = (keyId, tag, color) => {
    //setAnnotating({ tag: index, color: color }); // computationally intensive requiring re-rendering
    document.getElementById(keyId).setAttribute("annotating", tag);
    document.getElementById(keyId).setAttribute("annotatingcolor", color);
}

const CanvasSuperpixel = ({
  keyId,
  fileName,
  segmentationData,
  width,
  height,
  defaultcolor,
  colorbuttons,
  annotationData,
}) => {
  const [ annotating ] = useState({
    tag: -1,
    color: defaultcolor,
  });
  if (keys.length === 0) for (var k in segmentationData) keys.push(k);
  const viewBoxString = [0, 0, width, height].join(" ");
  const annotatedIndices = annotationData.map((element) => element.index);
  return (
    <div>
      <div className="coloring-buttons">
        {colorbuttons.map((color, tag) => (
          <button
            key={tag}
            onClick={() => updateAnnotating(keyId, tag, color)}
          >
            {color}
          </button>
        ))}
      </div>
      <div className="img-overlay-wrap">
        <img src={fileName} width={width} height={height} alt={"test"} />
        <svg
          id={keyId}
          viewBox={viewBoxString}
          annotating={annotating.tag}
          annotatingcolor={annotating.color}
        >
          {
          keys.map((key) => {
            const initialAnnotation = annotatedIndices.includes(parseInt(key))
              ? getAnnotationData(key, annotationData, annotating) : annotating;
            return <Superpixel
              keyId={key}
              pixels={segmentationData[key].split(",")}
              canvasWidth={width}
              canvasHeight={height}
              initialAnnotation={initialAnnotation}
              key={key}
            />;
          })}
        </svg>
      </div>
    </div>
  );
};

export default CanvasSuperpixel;
