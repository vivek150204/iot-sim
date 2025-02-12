import { Stage, Layer, Image, Line } from "react-konva";
//@ts-ignore
import { useDrop } from "react-dnd";
import { useState, useEffect } from "react";

const componentImages: Record<string, string> = {
  led: "/assets/led.png",
  joystick: "/assets/joystick.png",
  bridge: "/assets/bridge.png",
  buzzer: "/assets/buzzer.png",
  motor: "/assets/motor.png",
  panandtilt: "/assets/panandtilt.png",
  sensor: "/assets/sensor.png",
};

interface Element {
  id: number;
  type: string;
  x: number;
  y: number;
  image?: HTMLImageElement;
}

interface Wire {
  id: number;
  startId: number;
  endId: number;
}

const Canvas: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  
  // Load images and store them in the state
  useEffect(() => {
    const loadImages = async () => {
      const imageMap: Record<string, HTMLImageElement> = {};
      await Promise.all(
        Object.keys(componentImages).map((type) => {
          return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = componentImages[type];
            img.onload = () => {
              imageMap[type] = img;
              resolve();
            };
          });
        })
      );
      
      // Set elements with loaded images
      setElements((prev) =>
        prev.map((el) => ({
          ...el,
          image: imageMap[el.type],
        }))
      );
    };

    loadImages();
  }, []);

  const [, drop] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (item: { type: string }, monitor: any) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        setElements((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: item.type,
            x: offset.x - 150,
            y: offset.y,
            image: null, // Initially null, will be updated in useEffect
          },
        ]);
      }
    },
  }));

  // Handle component selection and wire creation
  const handleComponentClick = (element: Element) => {
    if (!selectedElement) {
      setSelectedElement(element);
    } else {
      if (selectedElement.id !== element.id) {
        setWires((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            startId: selectedElement.id,
            endId: element.id,
          },
        ]);
      }
      setSelectedElement(null);
    }
  };

  // Update position on drag
  const handleDragMove = (e: any, id: number) => {
    const { x, y } = e.target.position();
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  // Get wire connection points
  const getWirePoints = (wire: Wire) => {
    const startNode = elements.find((el) => el.id === wire.startId);
    const endNode = elements.find((el) => el.id === wire.endId);

    if (!startNode || !endNode) return [];

    return [
      startNode.x + 50, // Center X of start component
      startNode.y + 50, // Center Y of start component
      endNode.x + 50, // Center X of end component
      endNode.y + 50, // Center Y of end component
    ];
  };

  return (
    <div ref={drop} style={{ flex: 1, position: "relative" }}>
      <Stage width={1700} height={1000} style={{ border: "1px solid black" }}>
        <Layer>
          {/* Render wires dynamically */}
          {wires.map((wire) => (
            <Line
              key={wire.id}
              points={getWirePoints(wire)}
              stroke="blue"
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
              dash={[10, 5]}
              shadowColor="rgba(0, 0, 255, 0.5)"
              shadowBlur={10}
              tension={0.5}
              onDblClick={() =>
                setWires((prev) => prev.filter((w) => w.id !== wire.id))
              }
            />
          ))}

          {/* Render components */}
          {elements.map((el) => (
            <Image
              key={el.id}
              x={el.x}
              y={el.y}
              width={100}
              height={100}
              image={el.image}
              draggable
              onDragMove={(e) => handleDragMove(e, el.id)}
              onClick={() => handleComponentClick(el)}
              stroke={selectedElement?.id === el.id ? "red" : ""}
              strokeWidth={selectedElement?.id === el.id ? 5 : 0}
              shadowColor={selectedElement?.id === el.id ? "red" : ""}
              shadowBlur={selectedElement?.id === el.id ? 10 : 0}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
