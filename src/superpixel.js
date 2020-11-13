import React, {useState, useEffect, useRef} from "react";
import Snap from "snapsvg-cjs";

const defaultOpacity = 0.3;

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

const direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}

function addOffset(point, offset){
    return [ point[0] + offset[0] , point[1] + offset[1] ];
}

function addDirection(point, given_direction){
    switch (given_direction){
        case direction.UP:
            return addOffset(point, [0, -1]);
        case direction.DOWN:
            return addOffset(point, [0, 1]);
        case direction.LEFT:
            return addOffset(point, [-1, 0]);
        case direction.RIGHT:
            return addOffset(point, [1, 0]);
        default:
            return point;
    }
}

function checkMembership(points, given_point){
    for(var point of points ){
        if (point[0] === given_point[0] && point[1] === given_point[1]){
            return true;
        }
    }
    return false;
}

function convert2Point(index, width){
    return [ index%width, Math.floor(index/width) ];
}

function moveForward(currentPoint, given_direction, pathString){
    let newPoint = addDirection(currentPoint, given_direction);
    let newString = pathString + "L "+ newPoint.join(" ")+" ";
    return [ newString,  newPoint ];
}

function getPathFromPoints(points){
    if(points===undefined || points.length===0)
        return undefined;
    var currentPoint= points[0];
    const startPoint = currentPoint;
    var pathString = "M "+currentPoint.join(" ")+" ";
    var traverseDirection = direction.RIGHT;
    var count = 0;
    do{
        if (traverseDirection === direction.RIGHT && checkMembership(points, addOffset(currentPoint, [0, -1]))){//points.includes(currentPoint)){
            traverseDirection = (traverseDirection + 3 ) % 4;
            [ pathString, currentPoint ] = moveForward(currentPoint, traverseDirection, pathString);
        } else if (traverseDirection === direction.RIGHT && checkMembership(points, currentPoint)){//points.includes(currentPoint)){
            [ pathString, currentPoint ] = moveForward(currentPoint, direction.RIGHT, pathString);
        } else if (traverseDirection === direction.DOWN && checkMembership(points, currentPoint)){//points.includes(currentPoint)){
            traverseDirection = (traverseDirection + 3 ) % 4;
            [ pathString, currentPoint ] = moveForward(currentPoint, traverseDirection, pathString);
        } else if (traverseDirection === direction.DOWN && checkMembership(points, addOffset(currentPoint, [-1, 0]))){ //points.includes(addOffset(currentPoint, [-1, 0]))){
            [ pathString, currentPoint ] = moveForward(currentPoint, direction.DOWN, pathString);
        } else if (traverseDirection === direction.LEFT && checkMembership(points, addOffset(currentPoint, [-1, 0]))){ //points.includes(addOffset(currentPoint, [-1, 0]))){
            traverseDirection = (traverseDirection + 3 ) % 4;
            [ pathString, currentPoint ] = moveForward(currentPoint, traverseDirection, pathString);
        } else if (traverseDirection === direction.LEFT && checkMembership(points, addOffset(currentPoint, [-1, -1]))){ //points.includes(addOffset(currentPoint, [-1, -1]))){
            [ pathString, currentPoint ] = moveForward(currentPoint, direction.LEFT, pathString);
        } else if (traverseDirection === direction.UP && checkMembership(points, addOffset(currentPoint, [-1, -1]))){ //points.includes(addOffset(currentPoint, [-1, -1]))){
            traverseDirection = (traverseDirection + 3 ) % 4;
            [ pathString, currentPoint ] = moveForward(currentPoint, traverseDirection, pathString);
        } else if (traverseDirection === direction.UP && checkMembership(points, addOffset(currentPoint, [0, -1]))){ //points.includes(addOffset(currentPoint, [0, -1]))){
            [ pathString, currentPoint ] = moveForward(currentPoint, direction.UP, pathString);
        } else {
            traverseDirection = (traverseDirection + 1 ) % 4;
        }
        count += 1;
    } while((currentPoint[0] !== startPoint[0] || currentPoint[1] !== startPoint[1]) && count < 1000);
    return pathString + "Z";
}

const Superpixel = ({keyId, pixels, imgWidth, annotation, fill, annotatingCallback}) => {
    useEffect(() => {
        var s = Snap("#pixel" + keyId.toString());
        var myPathString = getPathFromPoints(pixels.map((element) => {return [element % imgWidth, Math.floor(element / imgWidth)]}));
        var pixel = s.path( myPathString );
        pixel.attr({ stroke: "red", strokeWidth: 0, fill: fill, opacity: defaultOpacity });
        pixel.mouseover(function (event) {
            if (event.target.parentNode.nodeName === "svg" && event.target.parentNode.getAttribute("annotation") < 0 
            && event.target.parentNode.parentNode.nodeName === "svg" && event.target.parentNode.parentNode.getAttribute("annotating")>=0) {
                coloringPixel(this, event.target.parentNode.parentNode.getAttribute("annotatingcolor"), 0.6, 1);
            }
          })
          .mouseout(function (event) {
            if (event.target.parentNode.nodeName === "svg" && event.target.parentNode.getAttribute("annotation") < 0
            && event.target.parentNode.parentNode.nodeName === "svg" && event.target.parentNode.parentNode.getAttribute("annotating")>=0) {
                coloringPixel(this, fill, defaultOpacity, 0);
            }
          })
          .mousemove(function (event) {
              if (event.buttons === 1 && event.target.parentNode.nodeName === "svg" && event.target.parentNode.getAttribute("annotation")
                && event.target.parentNode.parentNode.nodeName === "svg" && event.target.parentNode.parentNode.getAttribute("annotating")>=0) {
                event.target.parentNode.setAttribute("annotation", event.target.parentNode.parentNode.getAttribute("annotating"));
                coloringPixel(this, event.target.parentNode.parentNode.getAttribute("annotatingcolor"), 0.8, 0);
              }
          });
    }, []);
    const idKey = "pixel" + keyId.toString();
    return <svg id={idKey} annotation={annotation.tag}/>;
  };

export default Superpixel;
