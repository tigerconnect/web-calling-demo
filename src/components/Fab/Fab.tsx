import React from "react";
import clsx from 'clsx';
import "./Fab.css";

function setSize(size: string) {
  switch (size) {
    case "small":
      return 30;
    case "medium":
      return 40;
    case "large":
      return 50;
    default:
      return 30;
  }
}

export default function Fab({
  children,
  color = 'clear',
  dataQaId,
  onClick,
  isInactive = false,
  isEnabled = true,
  isDisabled = false,
  marginButton = "0 10px",
  size = "medium",
}: FabProps) {
  const style = {
    margin: marginButton,
    cursor: isDisabled ? "default" : "pointer",
    height: `${setSize(size)}px`,
    width: `${setSize(size)}px`,
  };

  const disabled = isDisabled || !isEnabled

  return (
    <div
      className={clsx(`fab ${color}`, { disabled, inactive: isInactive })}
      style={style}
      onClick={onClick}
      data-qa-id={dataQaId}
    >
      {children}
    </div>
  );
}

type FabProps = {
  children: any;
  color?: string;
  dataQaId?: string;
  onClick: () => void;
  isInactive?: boolean;
  isEnabled?: boolean;
  isDisabled?: boolean;
  marginButton?: string;
  size?: string;
};
