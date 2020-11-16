import './App.css';
import './imageOverlay.css';
import data from "./test.jpg.json";
import CanvasSuperpixel from './canvasSuperpixel';

const colors = ["remove", "red", "blue", "yellow", "green", "purple"];
const annotated = [{index: 1, tag: 1, color: "red"}, {index: 2, tag: 2, color: "blue"}]
function App() {
  return (
    <div className="App">
      <CanvasSuperpixel keyId={"mainCanvas"} fileName={"./resource/test.jpg"} segmentationData={data} annotationData={annotated} width={1024} height={768} defaultcolor={"black"} colorbuttons={colors}/> 
    </div>
  );
}

export default App;
