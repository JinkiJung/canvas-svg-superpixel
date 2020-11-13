import './App.css';
import './imageOverlay.css';
import data from "./test.jpg.json";
import CanvasSuperpixel from './canvasSuperpixel';

function setAnnotationLabel(number, color){
  document.getElementById("mainCanvas").setAttribute("annotating", number);
  document.getElementById("mainCanvas").setAttribute("annotatingcolor", color);
}

function App() {
  return (
    <div className="App">
      <div className="coloring-buttons"><button onClick={()=>{setAnnotationLabel(1,"red")}}>Red</button> 
      <button onClick={()=>{setAnnotationLabel(2,"blue")}}>Blue</button> 
      <button onClick={()=>{setAnnotationLabel(3,"yellow")}}>Yellow</button> 
      <button onClick={()=>{setAnnotationLabel(4,"green")}}>Green</button></div>
      <div className="img-overlay-wrap">
      <img src="./resource/test.jpg" alt={"test"}/>
        <CanvasSuperpixel keyId={"mainCanvas"} data={data} width={1024} height={768} annotating={-1} annotatingcolor={""} /> 
      </div>
    </div>
  );
}

export default App;
