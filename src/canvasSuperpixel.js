import React from "react";
import Superpixel from './superpixel';

class CanvasSuperpixel extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            annotating: this.props.annotating,
            annotatingcolor: this.props.annotatingcolor
        };
    }
  componentDidMount() {
  }
  render() {
    const idKey = this.props.keyId.toString();
    var keys = [];
    for(var k in this.props.data) keys.push(k);
    const viewBoxString = [0,0,this.props.width, this.props.height].join(" ");
    return (
        <svg ref={this.canvasRef} id={idKey} viewBox={viewBoxString} annotating={this.props.annotating} annotatingcolor={this.props.annotatingcolor}>
            {keys.map((key) => <Superpixel key={key} keyId={key} imgWidth={this.props.width} pixels={this.props.data[key].split(",")} fill={"black"} highlight={"red"} annotation={-1}/>)}
        </svg>
    );
  }
}

export default CanvasSuperpixel;
