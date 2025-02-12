//@ts-ignore
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Canvas />
      </div>
    </DndProvider>
  );
};

export default App;
