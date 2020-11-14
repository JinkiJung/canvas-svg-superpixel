import React, { useState } from "react";
import Superpixel from "./superpixel";

var keys = [];

const CanvasSuperpixel = ({
  keyId,
  fileName,
  data,
  width,
  height,
  defaultcolor,
  colorbuttons,
}) => {
  const [annotating, setAnnotating] = useState({
    tag: -1,
    color: defaultcolor,
  });
  if(keys.length===0)
    for (var k in data) keys.push(k);
  const viewBoxString = [0, 0, width, height].join(" ");

  return (
    <div>
      <h1 >{annotating.color}</h1>
      <div className="coloring-buttons">
        {colorbuttons.map((color, index) => (
          <button
            key={index}
            onClick={() => setAnnotating({ tag: index, color: color })}
          >
            {color}
          </button>
        ))}
      </div>
      <div className="img-overlay-wrap">
        <img src={fileName} alt={"test"} />
        <svg id={keyId} viewBox={viewBoxString} annotating={annotating.tag} annotatingcolor={annotating.color}>
          {keys.map((key) => (
            <Superpixel
              keyId={key}
              pixels={data[key].split(",")}
              canvasWidth={width}
              canvasHeight={height}
              initialAnnotation={annotating}
              key={key}
              annotating={() => annotating}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default CanvasSuperpixel;
