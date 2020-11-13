import React, {useState, useEffect} from "react";
import Superpixel from './superpixel';

const CanvasSuperpixel = ({keyId, data, width, height, fill}) => {
    const [ annotating, setAnnotating ] = useState({ tag: -1, color: ""});
    var keys = [];
    for(var k in data) keys.push(k);
    const viewBoxString = [0, 0, width, height].join(" ");
    return (
        <svg id={keyId} viewBox={viewBoxString} annotating={annotating.tag} annotatingcolor={annotating.color}>
            {keys.map((key) => <Superpixel key={key} keyId={key} pixels={data[key].split(",")} imgWidth={width} annotation={annotating} fill={fill} annotatingCallback={setAnnotating} />)}
        </svg>
    );
}

export default CanvasSuperpixel;
