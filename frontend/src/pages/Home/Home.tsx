import { useEffect, useRef, useState } from "react";
import Login from "../../components/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Constants from "../../util/constants";
import {
  closeAlert,
  setAlertProps,
  showToastMessage,
} from "../../redux/CommonSlice";
import { useNavigate } from "react-router-dom";
import { setTaskList } from "../../redux/TaskSlice";
import "./Home.css";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import Draggable from "../../components/DragAndDrop/Draggable";
import Droppable from "../../components/DragAndDrop/Droppable";
import { DndContext } from "@dnd-kit/core";

function Home(props: any) {
  const activeUser = useSelector((state: any) => state.user);
  const taskList = useSelector((state: any) => state.task.taskList);

  const [contextMenuProps, setContextMenuProps] = useState({
    show: false,
    x: 0,
    y: 0,
    editTask: () => {},
    deleteTask: () => {},
  });
  const hideContextMenu = () => {
    setContextMenuProps({
      show: false,
      x: 0,
      y: 0,
      editTask: () => {},
      deleteTask: () => {},
    });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reloadTasks = () => {
    if (activeUser?.token) {
      axios
        .post(Constants.apiLinks.task.getAll, { token: activeUser.token })
        .then((res: any) => {
          dispatch(setTaskList({ taskList: res.data.taskList }));
          navigate("/");
        })
        .catch((err: any) => {
          const msg = err.response?.data?.msg
            ? err.response.data.msg
            : err.message;
          dispatch(
            setAlertProps({
              ...Constants.initialAlertProps,
              show: true,
              title: "Error",
              message: msg,
            })
          );
        });
    }
  };
  useEffect(() => {
    reloadTasks();
  }, [activeUser]);
  const addTask = (task: any) => {
    if (task?.title) {
      axios
        .post(Constants.apiLinks.task.create, {
          ...task,
          token: activeUser.token,
        })
        .then((res: any) => {
          dispatch(closeAlert({}));
          reloadTasks();
          dispatch(showToastMessage({ message: res.data.msg }));
        })
        .catch((err: any) => {
          const msg = err.response?.data?.msg
            ? err.response.data.msg
            : err.message;

          dispatch(
            setAlertProps({
              ...Constants.initialAlertProps,
              show: true,
              title: "Error",
              message: msg,
            })
          );
        });
    }
  };
  const showDeleteTaskUi = (task: any) => {
    dispatch(
      setAlertProps({
        ...Constants.initialAlertProps,
        show: true,
        title: "Delete Task",
        message: "Are you sure, you want to delete this task?",
        okBtnFunc: () => deleteTask(task),
        okBtnName: "Ok",
      })
    );
  };
  const deleteTask = (task: any) => {
    axios
      .post(Constants.apiLinks.task.delete, {
        taskid: task._id,
        token: activeUser.token,
      })
      .then((res) => {
        dispatch(showToastMessage({ message: res.data.msg }));
        reloadTasks();
        dispatch(closeAlert({}));
      })
      .catch((err: any) => {
        const msg = err.response?.data?.msg
          ? err.response.data.msg
          : err.message;
        dispatch(
          setAlertProps({
            ...Constants.initialAlertProps,
            show: true,
            title: "Error",
            message: msg,
          })
        );
      });
  };
  const showEditTaskUi = (task: any) => {
    dispatch(
      setAlertProps({
        show: true,
        title: "Edit Task",
        message: "Enter Task Details",
        okBtnFunc: (formdata: any) => editTask(formdata, task),
        okBtnName: "Submit",
        inputElements: [
          { name: "title", value: task.title },
          { name: "desc", value: task.desc },
          {
            name: "status",
            value: task.status,
            elmType: "combo",
            comboOptions: ["New", "InProgress", "Completed"],
          },
        ],
      })
    );
  };
  const editTask = (formdata: any, task: any) => {
    let updatedTask = { ...task };
    updatedTask.title = formdata.title;
    updatedTask.desc = formdata.desc;
    updatedTask.status = formdata.status;
    axios
      .put(Constants.apiLinks.task.update, {
        task: updatedTask,
        token: activeUser.token,
      })
      .then((res) => {
        dispatch(showToastMessage({ message: res.data.msg }));
        reloadTasks();
        dispatch(closeAlert({}));
      })
      .catch((err: any) => {
        const msg = err.response?.data?.msg
          ? err.response.data.msg
          : err.message;
        dispatch(
          setAlertProps({
            ...Constants.initialAlertProps,
            show: true,
            title: "Error",
            message: msg,
          })
        );
      });
  };
  const handleOnContextMenu = (evt: any, rightClickedItem: any) => {
    evt.preventDefault();
    setContextMenuProps({
      show: true,
      x: evt.clientX + 5,
      y: evt.clientY + 5,
      editTask: () => {
        showEditTaskUi(rightClickedItem);
        hideContextMenu();
      },
      deleteTask: () => {
        showDeleteTaskUi(rightClickedItem);
        hideContextMenu();
      },
    });
  };
  function handleDragEnd(event: any) {
    const over = event.over;
    let curTask = { ...event.active?.data?.current };
    if (over && curTask) {
      const overStatus = over.id.substring("droppable_".length);
      if (overStatus != curTask.status) {
        curTask.status = overStatus;
        editTask(curTask, event.active.data.current);
      }
    }
  }
  if (!activeUser.name) {
    return <Login />;
  } else
    return (
      <>
        {contextMenuProps.show && <ContextMenu {...contextMenuProps} />}
        <DndContext onDragEnd={handleDragEnd}>
          <div className="tasklist" onMouseUp={() => hideContextMenu()}>
            <div className="task-container">
              <Droppable
                id="Droppable_New"
                className="todo col-flex center-cross"
              >
                <div className="sub-title">New</div>
                {taskList
                  ?.filter((task: any) => task?.status?.toLowerCase() == "new")
                  .map((task: any) => {
                    return (
                      <Draggable
                        id={task._id}
                        className="card"
                        key={task.id}
                        task={task}
                      >
                        <div
                          onClick={() => showEditTaskUi(task)}
                          onContextMenu={(e) => {
                            handleOnContextMenu(e, task);
                          }}
                        >
                          {task.title}
                        </div>
                      </Draggable>
                    );
                  })}
              </Droppable>
              <Droppable
                id="Droppable_InProgress"
                className="inprogress col-flex center-cross"
              >
                <div className="sub-title">In Progress</div>
                {taskList
                  ?.filter(
                    (task: any) => task?.status?.toLowerCase() == "inprogress"
                  )
                  .map((task: any) => {
                    return (
                      <Draggable
                        id={task._id}
                        className="card"
                        key={task.id}
                        task={task}
                      >
                        <div
                          onClick={() => showEditTaskUi(task)}
                          onContextMenu={(e) => {
                            handleOnContextMenu(e, task);
                          }}
                        >
                          {task.title}
                        </div>
                      </Draggable>
                    );
                  })}
              </Droppable>
              <Droppable
                id="Droppable_Completed"
                className="completed col-flex center-cross"
              >
                <div className="sub-title">Completed</div>
                {taskList
                  ?.filter(
                    (task: any) => task?.status?.toLowerCase() == "completed"
                  )
                  .map((task: any) => {
                    return (
                      <Draggable
                        id={task._id}
                        className="card"
                        key={task.id}
                        task={task}
                      >
                        <div
                          onClick={() => showEditTaskUi(task)}
                          onContextMenu={(e) => {
                            handleOnContextMenu(e, task);
                          }}
                        >
                          {task.title}
                        </div>
                      </Draggable>
                    );
                  })}
              </Droppable>
            </div>
            <div className="footer-icons">
              <img
                src="reload.png"
                alt="Reload tasks"
                title="Reload tasks"
                onClick={reloadTasks}
              />
              <img
                src="plus.png"
                alt="Add task"
                title="Add task"
                onClick={() => {
                  dispatch(
                    setAlertProps({
                      show: true,
                      title: "Add Task",
                      message: "Enter Task Details",
                      okBtnFunc: addTask,
                      okBtnName: "Submit",
                      inputElements: [
                        { name: "title", value: "" },
                        { name: "desc", value: "" },
                        {
                          name: "status",
                          value: "New",
                          elmType: "combo",
                          comboOptions: ["New", "InProgress", "Completed"],
                        },
                      ],
                    })
                  );
                }}
              />
            </div>
          </div>
        </DndContext>
      </>
    );
}

export default Home;
