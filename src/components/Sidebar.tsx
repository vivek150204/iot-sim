import ComponentItem from "./ComponentItem";

const Sidebar: React.FC = () => {
  return (
    <div style={{ width: "150px", padding: "10px", borderRight: "2px solid black" }}>
      <h3>Components</h3>
      <ComponentItem type="led" />
      <ComponentItem type="joystick" />
      <ComponentItem type="bridge" />
      <ComponentItem type="buzzer" />
      <ComponentItem type="motor" />
      <ComponentItem type="panandtilt" />
      <ComponentItem type="sensor" /> 

    </div>
  );
};

export default Sidebar;
