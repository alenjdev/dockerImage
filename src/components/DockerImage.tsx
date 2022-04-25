import { ModuleData, App, Device } from "@formant/data-sdk";
import { useState, useEffect, FC } from "react";

import { Docker } from "./DockerImage/index";

interface IDockerImageProps {
  device: Device | undefined;
  command: string;
}

export const DockerImage: FC<IDockerImageProps> = ({ device, command }) => {
  const [dockerVersion, setDockerVersion] = useState<string>(".-.-.-");
  const [date, setDate] = useState("--:--:--");

  useEffect(() => {
    App.addModuleDataListener(receiveModuleData);
  }, []);

  const clearData = (
    lastUpdate: number,
    scruttingTime: number,
    seconds: number
  ) => {
    return lastUpdate + seconds * 1000 < scruttingTime;
  };

  const receiveModuleData = async (newValue: ModuleData) => {
    const dockerImage = getLatestDockerImage(newValue);
    if (!!!dockerImage) return;
    const isDataExpired = clearData(dockerImage[0], newValue.time, +10);
    if (isDataExpired) {
      setDockerVersion("--:--:--");
      setDate("--:--:--");
      return;
    }
    setDockerVersion(dockerImage[1]);
    const formatedTime = formatDate(dockerImage[0]);
    setDate(formatedTime);
  };

  const sendCommand = async () => {
    if (!!device) {
      device?.sendCommand(command, "");
    }
  };
  return (
    <Docker
      getLatestImage={sendCommand}
      date={date}
      latestImage={dockerVersion}
    />
  );
};

function getLatestDockerImage(
  moduleData: ModuleData
): [number, string] | undefined {
  const streams = Object.values(moduleData.streams);
  if (streams.length === 0) {
    throw new Error("No streams.");
  }
  const stream = streams[0];
  if (stream === undefined) {
    throw new Error("No stream.");
  }
  if (stream.loading) {
    return undefined;
  }
  if (stream.tooMuchData) {
    throw new Error("Too much data.");
  }
  if (stream.data.length === 0) {
    throw new Error("No data.");
  }
  const latestPoint = stream.data[0].points.at(-1);
  if (!latestPoint) {
    throw new Error("No datapoints.");
  }
  return latestPoint;
}

const formatDate = (date: number) => {
  return `${new Date(date).getHours()}:${new Date(
    date
  ).getMinutes()}:${new Date(date).getSeconds()} ${
    new Date(date).getHours() >= 12 ? "pm" : "am"
  }`;
};
