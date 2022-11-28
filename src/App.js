import { useState, useEffect } from "react"
import "./App.css"

const API_BASE = "https://mern-todo-server.up.railway.app"

function App() {
  const [todos, setTodos] = useState([])
  const [popupActive, setpopupActive] = useState(false)
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    GetTodos()
  }, [])

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log("Error: ", err))
  }

  const updateStatus = async (id) => {
    const data = await fetch(API_BASE + "/todo/status/" + id).then((res) =>
      res.json()
    )

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.status = data.status
        }
        return todo
      })
    )
  }

  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json())

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id))
  }

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json())

    setTodos([...todos, data])
    setpopupActive(false)
    setNewTodo("")
  }

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center items-center text-white w-[100%] ">
      <div
        className={
          "w-[90%] max-w-[700px] " +
          (popupActive
            ? "blur-sm transition duration-1000"
            : "transition duration-1000")
        }
      >
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex items-center justify-between bg-cyan-900 rounded-2xl m-4 pr-4 p-2"
          >
            <div
              className="flex items-center p-2 cursor-pointer"
              onClick={() => updateStatus(todo._id)}
            >
              <p
                className={
                  "h-5 w-5 px-2  rounded-full cursor-pointer  " +
                  (todo.status
                    ? "bg-[#24875e] transition duration-300"
                    : "bg-[#be8646] transition duration-300")
                }
              ></p>
              <h1
                className={
                  "px-2  text-2xl " +
                  (todo.status
                    ? "line-through decoration-pink-500 decoration-4"
                    : "")
                }
              >
                {todo.text}
              </h1>
            </div>
            <div>
              <h1
                className="hover:scale-110 transition duration-100 cursor-pointer w-8 h-8 pt-1 text-center  text-white rounded-full  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 "
                onClick={() => deleteTodo(todo._id)}
              >
                &#x2715;
              </h1>
            </div>
          </div>
        ))}
      </div>
      <div
        className="  cursor-pointer popupButton bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-125 transition duration-200"
        onClick={() => setpopupActive(!popupActive)}
      >
        +
      </div>
      {popupActive ? (
        <div className="popupAddTask text-black ">
          <div className="flex flex-col py-5">
            <div className="absolute right-3 top-3 ">
              <div
                className=" hover:scale-110 transition duration-200 cursor-pointer w-6 h-6 text-center  text-white rounded-full  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                onClick={() => setpopupActive(!popupActive)}
              >
                &#x2715;
              </div>
            </div>
            <h1 className="font-bold pb-2">ADD TASK</h1>
            <textarea
              type="text"
              className="add-todo-input text-black rounded-2xl h-28 p-3 shadow-xl overflow-auto"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div>
              <button
                className="hover:scale-105 transition duration-200 text-left rounded-3xl p-2 px-5 text-white mt-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                type="button"
                onClick={() => addTodo()}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default App
