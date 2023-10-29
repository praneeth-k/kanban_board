import React from "react";
import { useDroppable } from "@dnd-kit/core";

function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: props?.id,
  });
  const style = {
    backgroundColor: isOver ? "#daf9dc" : undefined,
  };

  return (
    <div className={props?.className} ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
export default Droppable;
