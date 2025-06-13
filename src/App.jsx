import React, { useState, useEffect } from "react";

const TodoApp = () => {
  const [input, setInput] = useState(""); // 'task' renamed to 'input'
  const [list, setList] = useState([]);
  const [view, setView] = useState("all");
  const [sortMode, setSortMode] = useState("none");

  useEffect(() => {
    const saved = localStorage.getItem("todo-list");
    if (saved) setList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(list));
  }, [list]);

  const handleAdd = () => {
    if (!input.trim()) {
      alert("Oops! You need to enter something.");
      return;
    }
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      done: false,
    };
    setList([...list, newTask]);
    setInput("");
  };

  const toggleDone = (id) => {
    setList(list.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteItem = (id) => {
    setList(list.filter(item => item.id !== id));
  };

  const filtered = list.filter(item =>
    view === "all" ? true : view === "active" ? !item.done : item.done
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortMode) {
      case "az":
        return a.text.localeCompare(b.text);
      case "za":
        return b.text.localeCompare(a.text);
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">📝 My To-Do</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="What needs to get done?"
          className="flex-1 border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "active", "done"].map(mode => (
          <button
            key={mode}
            onClick={() => setView(mode)}
            className={`px-3 py-1 rounded border ${view === mode ? "bg-green-600 text-white" : "bg-white text-black"}`}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Sort:</label>
        <select
          value={sortMode}
          onChange={e => setSortMode(e.target.value)}
          className="border border-gray-300 rounded p-1"
        >
          <option value="none">None</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <ul className="space-y-2">
        {sorted.length ? (
          sorted.map(item => (
            <li
              key={item.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleDone(item.id)}
                  className="w-4 h-4"
                />
                <span className={item.done ? "line-through text-gray-500" : ""}>
                  {item.text}
                </span>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-400 italic">No tasks to show right now.</p>
        )}
      </ul>
    </div>
  );
};

export default TodoApp;
