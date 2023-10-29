const Constants = {
  apiLinks: {
    auth: {
      login: "http://localhost:3001/auth/login",
      signin: "http://localhost:3001/auth/signin",
      deleteUser: "http://localhost:3001/auth/delete_user",
      changePassword: "http://localhost:3001/auth/change_password",
    },
    task: {
      create: "http://localhost:3001/task/create",
      getOne: "http://localhost:3001/task/details",
      getAll: "http://localhost:3001/task/all",
      update: "http://localhost:3001/task/update",
      delete: "http://localhost:3001/task/delete",
    },
  },
  initialAlertProps: {
    show: false,
    title: "",
    message: "",
    okBtnFunc: null,
    okBtnName: "",
    inputElements: [],
  },
  kanbanBoardDesc:
    "A Kanban board is a visual project management tool used to visualize and manage work processes in a systematic and efficient way. It is often associated with the Kanban methodology, which originated in the manufacturing industry but has since been adopted in various fields, including software development, project management, and personal task management.",
};

export default Constants;
