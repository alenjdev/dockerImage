import "./App.scss";
// import { DockerImage } from "./components/DockerImage";
import { DockerImage } from "./components/DockerImage";
import { Authentication, Fleet, Device } from "@formant/data-sdk";
import { useState, useEffect } from "react";

function App() {
  const [device, setDevice] = useState<Device | undefined>(undefined);

  useEffect(() => {
    getDevice();
  }, []);

  const getDevice = async () => {
    if (await Authentication.waitTilAuthenticated()) {
      const currentDevice = await Fleet.getCurrentDevice();
      setDevice(currentDevice);
    }
  };
  return (
    <div className="App">
      <DockerImage device={device} command="run_docker_script" />
    </div>
  );
}

export default App;
