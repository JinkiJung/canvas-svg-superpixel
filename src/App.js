import './App.css';
import './imageOverlay.css';
import data from "./test.jpg.json";
import CanvasSuperpixel from './canvasSuperpixel';

const colors = ["red", "blue", "yellow", "green", "purple"];

function App() {
  return (
    <div className="App">
      <CanvasSuperpixel keyId={"mainCanvas"} fileName={"./resource/test.jpg"} data={data} width={1024} height={768} defaultcolor={"black"} colorbuttons={colors}/> 
    </div>
  );
}

export default App;
