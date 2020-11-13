import './App.css';
import './imageOverlay.css';
import data from "./test.jpg.json";
import CanvasSuperpixel from './canvasSuperpixel';

function App() {
  return (
    <div className="App">
      <div class="img-overlay-wrap">
      <img src="./resource/test.jpg" alt={"test"}/>
        <CanvasSuperpixel keyId={"segmentCanvas"} data={data} width={1024} height={768} /> 
      </div>
    </div>
  );
}

export default App;
