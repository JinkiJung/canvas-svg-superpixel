import React from "react";
import Superpixel from './superpixel';

class CanvasSuperpixel extends React.Component {
  componentDidMount() {}
  render() {
    const idKey = "canvas" + this.props.keyId.toString();
    var keys = [];
    for(var k in this.props.data) keys.push(k);
    return (
        <svg id={idKey} viewBox={`0 0 1024 768`}>
            {keys.map((key) => <Superpixel keyId={key} imgWidth={1024} pixels={this.props.data[key].split(",")} fill={"black"} highlight={"red"} annotation={-1}/>)}
        </svg>
    );
  }
}

export default CanvasSuperpixel;
