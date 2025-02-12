//@ts-ignore
import { useDrag } from "react-dnd";

const componentImages: Record<string, string> = {
    led: "/assets/led.png",
    joystick: "/assets/joystick.png",
    bridge : "/assets/bridge.png",
    buzzer : "/assets/buzzer.png",
    motor : "/assets/motor.png",
    panandtilt : "/assets/panandtilt.png",
    sensor : "/assets/sensor.png",
    
  };
  

interface ComponentItemProps {
  type: string;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: { type },
    collect: (monitor : any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ padding: "10px", margin: "5px", cursor: "grab", opacity: isDragging ? 0.5 : 1 }}>
      <img src={componentImages[type]} alt={type} width={75} height={75} />
    </div>
  );
};

export default ComponentItem;
