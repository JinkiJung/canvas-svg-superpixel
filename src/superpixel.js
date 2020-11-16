import React, { useState, useEffect } from "react";
import Snap from "snapsvg-cjs";

const defaultOpacity = 0.1;
const annotatedOpacity = 0.7;
const annotatingOpacity = 0.9;

function coloringPixel(component, color, opacity, strokeWidth){
    component.animate(
      {
        fill: color,
        opacity: opacity,
        strokeWidth: strokeWidth
      },
      0
    );
  }

const Direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}

function addOffset(point, offset, gridWidth){
    return point + offset[0] + (offset[1] * gridWidth);
}

function convertGrid2Img(index, gridWidth, canvasWidth){
    return index % gridWidth + Math.floor(index / gridWidth) * canvasWidth;
}

function convertImg2Grid(index, canvasWidth, gridWidth){
    return index % canvasWidth + Math.floor(index / canvasWidth) * gridWidth;
}

function moveAlongDirection(point, direction, gridWidth){
    switch (direction){
        case Direction.UP:
            return addOffset(point, [0, -1], gridWidth);
        case Direction.DOWN:
            return addOffset(point, [0, 1], gridWidth);
        case Direction.LEFT:
            return addOffset(point, [-1, 0], gridWidth);
        case Direction.RIGHT:
            return addOffset(point, [1, 0], gridWidth);
        default:
            return point;
    }
}

function checkMembership(points, gridPoint, coordinates){
    if(gridPoint < 0 || gridPoint % coordinates.gridWidth >= coordinates.canvasWidth || Math.floor(gridPoint / coordinates.gridWidth) >= coordinates.canvasHeight) // exclude grid edges
        return false;
    else
        return points.includes(String(convertGrid2Img(gridPoint, coordinates.gridWidth, coordinates.canvasWidth)));
}

function convert2Point(index, gridWidth){
    return [ index%gridWidth, Math.floor(index/gridWidth) ];
}

function stepForward(currentPoint, direction, pathString, gridWidth){
    let newPoint = moveAlongDirection(currentPoint, direction, gridWidth);
    let newPathString = pathString + "L "+ convert2Point(newPoint, gridWidth).join(" ")+" ";
    return [ newPathString,  newPoint ];
}

function getPathFromPoints(points, canvasWidth, canvasHeight){
    const gridWidth = canvasWidth + 1;
    const gridHeight = canvasHeight + 1;
    if(points===undefined || points.length===0)
        return undefined;
    var currentPoint= convertImg2Grid(parseInt(points[0]), canvasWidth, gridWidth);
    const startPoint = currentPoint;
    var pathString = "M "+convert2Point(currentPoint, gridWidth).join(" ")+" ";
    var traverseDirection = Direction.RIGHT;
    var count = 0;
    var coordinates = {gridWidth: gridWidth, gridHeight: gridHeight, canvasWidth: canvasWidth, canvasHeight: canvasHeight};
    do{       
        if (traverseDirection === Direction.RIGHT && checkMembership(points, addOffset(currentPoint, [0, -1], gridWidth), coordinates)){
            traverseDirection = (traverseDirection + 3 ) % 4;
            [ pathString, currentPoint ] = stepForward(currentPoint, traverseDirection, pathString, gridWidth);
        } else if (traverseDirection === Direction.RIGHT && checkMembership(points, currentPoint, coordinates)){
            [ pathString, currentPoint ] = stepForward(currentPoint, Direction.RIGHT, pathString, gridWidth);
        } else if (traverseDirection === Direction.DOWN && checkMembership(points, currentPoint, coordinates)){
            traverseDirection = (traverseDirection + 3 ) % 4;
            [ pathString, currentPoint ] = stepForward(currentPoint, traverseDirection, pathString, gridWidth);
        } else if (traverseDirection === Direction.DOWN && checkMembership(points, addOffset(currentPoint, [-1, 0], gridWidth), coordinates)){ 
            [ pathString, currentPoint ] = stepForward(currentPoint, Direction.DOWN, pathString, gridWidth);
        } else if (traverseDirection === Direction.LEFT && checkMembership(points, addOffset(currentPoint, [-1, 0], gridWidth), coordinates)){ 
            traverseDirection = (traverseDirection + 3 ) % 4;
            [ pathString, currentPoint ] = stepForward(currentPoint, traverseDirection, pathString, gridWidth);
        } else if (traverseDirection === Direction.LEFT && checkMembership(points, addOffset(currentPoint, [-1, -1], gridWidth), coordinates)){ 
            [ pathString, currentPoint ] = stepForward(currentPoint, Direction.LEFT, pathString, gridWidth);
        } else if (traverseDirection === Direction.UP && checkMembership(points, addOffset(currentPoint, [-1, -1], gridWidth), coordinates)){ 
            traverseDirection = (traverseDirection + 3 ) % 4;
            [ pathString, currentPoint ] = stepForward(currentPoint, traverseDirection, pathString, gridWidth);
        } else if (traverseDirection === Direction.UP && checkMembership(points, addOffset(currentPoint, [0, -1], gridWidth), coordinates)){ 
            [ pathString, currentPoint ] = stepForward(currentPoint, Direction.UP, pathString, gridWidth);
        } else {
            traverseDirection = (traverseDirection + 1 ) % 4;
        }
        count += 1;
    } while(currentPoint !== startPoint && count < 1000);
    return pathString + "Z";
}

const Superpixel = ({keyId, pixels, canvasWidth, canvasHeight, initialAnnotation}) => {
    const [ annotation ] = useState(initialAnnotation);
    const idKey = "pixel" + keyId.toString();
    useEffect(() => {
        var s = Snap("#pixel" + keyId.toString());
        if(s.children().length <= 2){ // must be updated to check the inclusion of 'path' within children
            var pathString = getPathFromPoints(pixels, canvasWidth, canvasHeight, keyId);
            var pixel = s.path( pathString );
            pixel.attr({ stroke: "white", strokeWidth: 0, fill: annotation.color, opacity: annotation.tag < 0 ? defaultOpacity : annotatedOpacity });
            pixel.mouseover(function (event) {
                if (event.target.parentNode.nodeName === "svg" && event.target.parentNode.getAttribute("annotation") < 0
                && event.target.parentNode.parentNode.nodeName === "svg" && event.target.parentNode.parentNode.getAttribute("annotating")>=0) {
                    coloringPixel(this, event.target.parentNode.parentNode.getAttribute("annotatingcolor"), annotatingOpacity, 1);
                }
              })
              .mouseout(function (event) {
                if (event.target.parentNode.nodeName === "svg" && event.target.parentNode.getAttribute("annotation") < 0
                && event.target.parentNode.parentNode.nodeName === "svg" && event.target.parentNode.parentNode.getAttribute("annotating")>=0) {
                    coloringPixel(this, annotation.color, annotation.tag >= 0 ? annotatedOpacity : defaultOpacity, 0);
                }
              })
              .mousemove(function (event) {
                  if (event.buttons === 1 && event.target.parentNode.nodeName === "svg" && event.target.parentNode.getAttribute("annotation")
                  && event.target.parentNode.parentNode.nodeName === "svg" && event.target.parentNode.parentNode.getAttribute("annotating")>=0) {
                    const fillColor = event.target.parentNode.parentNode.getAttribute("annotatingcolor");
                    if(fillColor === 'remove'){
                        event.target.parentNode.setAttribute("annotation", -1);
                        coloringPixel(this, annotation.color, annotatedOpacity, 0);
                    }else{
                        event.target.parentNode.setAttribute("annotation", event.target.parentNode.parentNode.getAttribute("annotating"));
                        coloringPixel(this, fillColor, annotatedOpacity, 0);
                    }
                  }
              });
        }
        
    }, [canvasWidth, canvasHeight]);
    return <svg id={idKey} annotation={annotation.tag}/>;
  };

export default Superpixel;
