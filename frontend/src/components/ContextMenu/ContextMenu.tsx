import "./ContextMenu.css";

function ContextMenu(props: any) {
  return (
    <menu className="context-menu" style={{ top: props?.y, left: props?.x }}>
      <div className="context-menu-item" onClick={props?.editTask}>
        Edit
      </div>
      <div className="context-menu-item" onClick={props?.deleteTask}>
        Delete
      </div>
    </menu>
  );
}

export default ContextMenu;
