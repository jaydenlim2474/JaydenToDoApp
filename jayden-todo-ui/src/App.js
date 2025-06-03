import React, { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import ToDoItem from './ToDoItem';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
import DeleteConfirmation from "./DeleteConfirmation";

registerLocale("en-GB", enGB);
function parseDateLocal(dateString) {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
}

function formatDateLocal(date) {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}


function App() {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    //console.log('REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
    //console.log('REACT_APP_API_PORT:', process.env.REACT_APP_API_PORT);
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);

    // ToDo states
    const [newTitle, setNewTitle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const inputRef = useRef();

    //Filter
    const [filterFromDate, setFilterFromDate] = useState('');
    const [filterToDate, setFilterToDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const [showAddInput, setShowAddInput] = useState(false);
    const addInputRef = useRef();

    //show form
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [todoItems, setTodoItems] = useState([]);
    const [newItem, setNewItem] = useState({
        itemName: "",
        description: "",
        date: "",
        time: "",
        notes: "",
        color: "#ffffff",
    });
    const [editingItemId, setEditingItemId] = useState(null);
    const [editItem, setEditItem] = useState({});

    //Delete Confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    //validation
    const [validationErrors, setValidationErrors] = useState({});

    //add validation
    const validateForm = () => {
        const errors = {};

        if (!newItem.itemName.trim()) {
            errors.itemName = "Item Name is required.";
        }
        if (!newItem.date) {
            errors.date = "Date is required.";
        }
        if (!newItem.time) {
            errors.time = "Time is required.";
        }
        if (!newItem.color || newItem.color === "#ffffff") {
            errors.color = "Please select a non-default color.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    //select ToDo then direct clear the filters
    const handleSelectTodo = (todo) => {
        selectTodo(todo);
        setFilterFromDate("");
        setFilterToDate("");
        setFilterStatus("ALL");
    };

    //edit validataion
    const validateEditForm = () => {
        const errors = {};

        if (!editItem.itemName || editItem.itemName.trim() === "") {
            errors.itemName = "Item Name is required";
        }

        if (!editItem.date) {
            errors.date = "Date is required";
        }

        if (!editItem.time) {
            errors.time = "Time is required";
        }

        if (!editItem.color) {
            errors.color = "Color is required";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveEditItem = (id) => {
        if (validateEditForm()) {
            saveEditItem(id);
            setValidationErrors({});
        }
    };


    // Load all ToDos
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/todos`)
            .then((res) => res.json())
            .then(setTodos)
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    // Load ToDoItems when a ToDo is selected
    useEffect(() => {
        if (!selectedTodo) {
            setTodoItems([]);
            return;
        }
        fetch(`${API_BASE_URL}/api/todoitems/todo/${selectedTodo.id}`)
            .then((res) => res.json())
            .then((data) => setTodoItems(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Fetch error:", err));
    }, [selectedTodo]);

    // Dismiss input if click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (addInputRef.current && !addInputRef.current.contains(e.target)) {
                setShowAddInput(false);
                setNewTitle("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle clicks outside ToDo edit input to cancel edit
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setEditingId(null);
                setEditTitle("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ToDo CRUD handlers
    const addTodo = () => {
        if (!newTitle.trim()) return;

        fetch(`${API_BASE_URL}/api/todos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to create ToDo");
                }
                return res.json();
            })
            .then((todo) => {
                setTodos([todo, ...todos]);
                setNewTitle("");
            })
            .catch((err) => {
                console.error("Error creating todo:", err);
            });
    };


    const deleteTodo = (id) => {
        fetch(`${API_BASE_URL}/api/todos/${id}`, { method: "DELETE" }).then(() =>
            setTodos(todos.filter((t) => t.id !== id))
        );

        if (selectedTodo?.id === id) {
            setSelectedTodo(null);
            setTodoItems([]);
        }
    };

    const confirmDelete = (todo) => {
        setItemToDelete(todo);
        setShowDeleteConfirm(true);
    };

    // Confirmed delete handler
    const handleDeleteConfirmed = () => {
        if (itemToDelete?.itemName) {
            deleteItem(itemToDelete.id);
        } else if (itemToDelete?.title) {
            deleteTodo(itemToDelete.id);
        } 
        setShowDeleteConfirm(false);
        setItemToDelete(null);
    };

    // Cancel delete handler
    const handleDeleteCanceled = () => {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
    };

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
    };

    const saveEdit = (id) => {
        fetch(`${API_BASE_URL}/api/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, title: editTitle }),
        }).then(() => {
            setTodos(todos.map((t) => (t.id === id ? { ...t, title: editTitle } : t)));
            if (selectedTodo?.id === id) {
                setSelectedTodo({ ...selectedTodo, title: editTitle });
            }
            cancelEdit();
        });
    };

    const selectTodo = (todo) => {
        setSelectedTodo(todo);
        cancelEdit();
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const addItem = () => {
        if (!newItem.itemName.trim()) return;
        if (!selectedTodo) return;

        fetch(`${API_BASE_URL}/api/todoitems`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...newItem,
                toDoId: selectedTodo.id,
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to add item");
                }

                const text = await res.text();
                return text ? JSON.parse(text) : null;
            })
            .then((item) => {
                if (item) {
                    setTodoItems([item, ...todoItems]);
                } else {
                    fetch(`${API_BASE_URL}/api/todoitems/todo/${selectedTodo.id}`)
                        .then((res) => res.json())
                        .then(setTodoItems);
                }

                setNewItem({
                    itemName: "",
                    description: "",
                    date: "",
                    time: "",
                    notes: "",
                    color: "#ffffff",
                });
                setShowAddItemForm(false);
            })
            .catch((err) => {
                console.error("Add Item error:", err);
            });
    };


    useEffect(() => {
        if (showAddItemForm) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showAddItemForm]);


    const deleteItem = (id) => {
        fetch(`${API_BASE_URL}/api/todoitems/${id}`, { method: "DELETE" }).then(() =>
            setTodoItems(todoItems.filter((item) => item.id !== id))
        );
    };

    const startEditItem = (item) => {
        setEditingItemId(item.id);
        setEditItem({ ...item });
    };

    const cancelEditItem = () => {
        setEditingItemId(null);
        setEditItem({});
    };

    const handleEditItemChange = (e) => {
        const { name, value } = e.target;
        setEditItem((prev) => ({ ...prev, [name]: value }));
    };

    const saveEditItem = (id) => {
        fetch(`${API_BASE_URL}/api/todoitems/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editItem),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to update item");
                const text = await res.text();
                return text ? JSON.parse(text) : null;
            })
            .then(updatedItem => {
                if (updatedItem) {
                    setTodoItems(todoItems.map(item => (item.id === id ? updatedItem : item)));
                } else {
                    setTodoItems(todoItems.map(item => (item.id === id ? editItem : item)));
                }
                cancelEditItem();
            })
            .catch(err => {
                console.error(err);
            });
    };

    const toggleCompleted = (item) => {
        const newCompleted = !Boolean(item.completed);

        fetch(`${API_BASE_URL}/api/todoitems/${item.id}/completed`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: newCompleted }),
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to update completed status');

                setTodoItems(prevItems =>
                    prevItems.map(i =>
                        i.id === item.id ? { ...i, completed: newCompleted } : i
                    )
                );
            })
            .catch(console.error);
    };


    //Filter ToDo Item
    //const filteredItems = todoItems.filter(item => {
    //    if (!item.date) return false;
    //    const itemDate = new Date(item.date);

    //    //console.log("Item Date:", item.date, itemDate);
    //    if (filterFromDate) {
    //        //console.log("From Date:", filterFromDate, parseDateLocal(filterFromDate));
    //        if (itemDate < parseDateLocal(filterFromDate)) return false;
    //    }
    //    if (filterToDate) {
    //        //console.log("To Date:", filterToDate, parseDateLocal(filterToDate));
    //        if (itemDate > parseDateLocal(filterToDate)) return false;
    //    }

    //    if (filterStatus === 'Completed' && !item.completed) return false;
    //    if (filterStatus === 'Incompleted' && item.completed) return false;

    //    return true;
    //});

    const filteredItems = todoItems.filter(item => {
        if (!item.date) return false;
        const itemDate = new Date(item.date);

        if (filterFromDate) {
            const from = parseDateLocal(filterFromDate); // already at 00:00:00
            if (itemDate < from) return false;
        }

        if (filterToDate) {
            const to = parseDateLocal(filterToDate);
            to.setHours(23, 59, 59, 999); // include entire day
            if (itemDate > to) return false;
        }

        if (filterStatus === 'Completed' && !item.completed) return false;
        if (filterStatus === 'Incompleted' && item.completed) return false;

        return true;
    });



    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Left Navigator */}
            <div className="w-80 bg-white shadow-lg border-r border-gray-200 p-5 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">ToDos</h2>
                    <button
                        onClick={() => setShowAddInput(true)}
                        className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700 transition"
                    >
                        ADD
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            className={`cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 flex justify-between items-center shadow-sm transition
                    ${selectedTodo?.id === todo.id ? "bg-blue-100" : ""}`}
                            onClick={() => handleSelectTodo(todo)}
                        >
                            {editingId === todo.id ? (
                                <div className="flex w-full items-center gap-2" ref={inputRef}>
                                    <input
                                        className="flex-1 px-2 py-1 text-sm rounded border border-gray-300 focus:outline-none"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => saveEdit(todo.id)}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-800 truncate flex-1">
                                        {todo.title}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEdit(todo);
                                            }}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDelete(todo);
                                            }}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 size={18} />
                                            </button>
                                            {/* Delete confirmation modal */}
                                            {showDeleteConfirm && (
                                                <DeleteConfirmation
                                                    message={`Are you sure you want to delete "${itemToDelete?.title || itemToDelete?.itemName || "this item"
                                                        }"? This action cannot be undone.`}
                                                    onConfirm={handleDeleteConfirmed}
                                                    onCancel={handleDeleteCanceled}
                                                />
                                            )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {showAddInput && (
                    <div className="mt-5 flex items-center gap-2" ref={addInputRef}>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="New ToDo title"
                            autoFocus
                            className="flex-1 p-2 text-sm border rounded border-gray-300 focus:outline-blue-400"
                        />
                        <button
                            onClick={() => {
                                addTodo();
                                setShowAddInput(false);
                            }}
                            className="text-green-600 hover:text-green-700"
                        >
                            <Check size={20} />
                        </button>
                        <button
                            onClick={() => {
                                setShowAddInput(false);
                                setNewTitle("");
                            }}
                            className="text-red-600 hover:text-red-700"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Right Panel (ToDoItems CRUD) */}
            <div className="flex-1 p-10 bg-gray-100 overflow-auto">
                {selectedTodo ? (
                    <>
                        {/* Filters Row */}
                        <div className="flex flex-wrap justify-between items-end mb-4">
                            {/* Filters: 75% width */}
                            <div className="w-full md:w-3/4 flex gap-4 flex-wrap">
                                {/* From Date Filter */}
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                    <div className="relative z-[50] w-full">
                                        <DatePicker
                                            selected={filterFromDate ? parseDateLocal(filterFromDate) : null}
                                            onChange={(date) => setFilterFromDate(formatDateLocal(date))}
                                            dateFormat="dd-MM-yyyy"
                                            locale="en-GB"
                                            placeholderText="dd-mm-yyyy"
                                            className="p-2 border rounded w-full"
                                            isClearable
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                </div>

                                {/* To Date Filter */}
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                    <div className="relative z-[50] w-full">
                                        <DatePicker
                                            selected={filterToDate ? parseDateLocal(filterToDate) : null}
                                            onChange={(date) => setFilterToDate(formatDateLocal(date))}
                                            dateFormat="dd-MM-yyyy"
                                            locale="en-GB"
                                            isClearable
                                            placeholderText="dd-mm-yyyy"
                                            className="p-2 border rounded w-full"
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="p-2 border rounded w-full"
                                    >
                                        <option value="All">All</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Incompleted">Incompleted</option>
                                    </select>
                                </div>
                            </div>

                            {/* Add Button: 25% width */}
                            <div className="w-full md:w-1/4 flex justify-end mt-4 md:mt-0">
                                <button
                                    onClick={() => setShowAddItemForm(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
                                >
                                    Add New Item
                                </button>
                            </div>
                        </div>



                        {/* Add Item Modal Popup */}
                        {showAddItemForm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                {/* Overlay */}
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-50"
                                    onClick={() => setShowAddItemForm(false)}
                                />

                                {/* Modal */}
                                <div className="relative z-[99999] w-96 p-6 bg-white rounded shadow-lg" style={{ minWidth: "1000px" }}>
                                    <h3 className="text-lg font-semibold mb-4">Add New Item</h3>

                                    <div className="mb-2">
                                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Name
                                        </label>
                                        <input
                                            id="itemName"
                                            name="itemName"
                                            placeholder="Item Name"
                                            value={newItem.itemName}
                                            onChange={handleNewItemChange}
                                            className="w-full p-2 border rounded"
                                            autoFocus
                                        />
                                        {validationErrors.itemName && (
                                            <p className="text-red-600 text-sm mt-1">{validationErrors.itemName}</p>
                                        )}
                                    </div>

                                    <div className="mb-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <input
                                            id="description"
                                            name="description"
                                            placeholder="Description"
                                            value={newItem.description}
                                            onChange={handleNewItemChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>

                                    <div className="flex gap-2 mb-2">
                                        <div className="flex-1">
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                                Date
                                            </label>
                                            <DatePicker
                                                id="date"
                                                selected={newItem.date ? parseDateLocal(newItem.date) : null}
                                                onChange={(date) =>
                                                    handleNewItemChange({
                                                        target: {
                                                            name: "date",
                                                            value: date
                                                                ? `${date.getFullYear()}-${(date.getMonth() + 1)
                                                                    .toString()
                                                                    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
                                                                : "",
                                                        },
                                                    })
                                                }
                                                dateFormat="dd-MM-yyyy"
                                                locale="en-GB"
                                                isClearable
                                                placeholderText="dd-mm-yyyy"
                                                className="p-2 border rounded w-full"
                                                wrapperClassName="w-full"
                                            />
                                            {validationErrors.date && (
                                                <p className="text-red-600 text-sm mt-1">{validationErrors.date}</p>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                                Time
                                            </label>
                                            <input
                                                id="time"
                                                type="time"
                                                name="time"
                                                value={newItem.time}
                                                onChange={handleNewItemChange}
                                                className="p-2 border rounded w-full"
                                            />
                                            {validationErrors.time && (
                                                <p className="text-red-600 text-sm mt-1">{validationErrors.time}</p>
                                            )}

                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            placeholder="Notes"
                                            value={newItem.notes}
                                            onChange={handleNewItemChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Card Color
                                        </label>
                                        <input
                                            id="color"
                                            type="color"
                                            name="color"
                                            value={newItem.color}
                                            onChange={handleNewItemChange}
                                            className="w-16 h-8 p-1 rounded"
                                        />
                                        {validationErrors.color && (
                                            <p className="text-red-600 text-sm mt-1">{validationErrors.color}</p>
                                        )}

                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => {
                                                setShowAddItemForm(false);
                                                setNewItem({
                                                    itemName: "",
                                                    description: "",
                                                    date: "",
                                                    time: "",
                                                    notes: "",
                                                    color: "#ffffff",
                                                });
                                            }}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (validateForm()) {
                                                    addItem();
                                                    setShowAddItemForm(false);
                                                    setValidationErrors({});
                                                }
                                            }}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="space-y-4">
                            {filteredItems.length > 0 ? (
                                [...filteredItems]
                                    .sort((a, b) => {
                                        const dateA = new Date(a.date);
                                        const dateB = new Date(b.date);
                                        if (dateA < dateB) return -1;
                                        if (dateA > dateB) return 1;
                                        if (a.time < b.time) return -1;
                                        if (a.time > b.time) return 1;
                                        return 0;
                                    })
                                    .map((item) =>
                                        editingItemId === item.id ? (
                                            <div key={item.id} className="p-4 rounded shadow bg-white space-y-4">
                                                <div className="p-4 rounded-xl shadow-md bg-gray-100">
                                                    <div className="flex items-center">
                                                        {/* ✅ Checkbox hidden in edit mode */}
                                                        <h2 className="text-xl font-bold">{'Editing ' + item.itemName}</h2>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                                    <input
                                                        name="itemName"
                                                        value={editItem.itemName || ""}
                                                        onChange={handleEditItemChange}
                                                        className="w-full p-2 border rounded"
                                                        autoFocus
                                                    />
                                                    {validationErrors.itemName && (
                                                        <p className="text-sm text-red-600">{validationErrors.itemName}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                                    <input
                                                        name="description"
                                                        value={editItem.description || ""}
                                                        onChange={handleEditItemChange}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                                        <DatePicker
                                                            selected={editItem.date ? new Date(editItem.date) : null}
                                                            onChange={(date) =>
                                                                handleEditItemChange({
                                                                    target: {
                                                                        name: "date",
                                                                        value: date
                                                                            ? `${date.getFullYear()}-${(date.getMonth() + 1)
                                                                                .toString()
                                                                                .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
                                                                            : ""
,
                                                                    },
                                                                })
                                                            }
                                                            dateFormat="dd-MM-yyyy"
                                                            locale="en-GB"
                                                            placeholderText="dd-mm-yyyy"
                                                            isClearable
                                                            className="w-full p-2 border rounded"
                                                        />
                                                        {validationErrors.date && (
                                                            <p className="text-sm text-red-600">{validationErrors.date}</p>
                                                        )}

                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700">Time</label>
                                                        <input
                                                            type="time"
                                                            name="time"
                                                            value={editItem.time || ""}
                                                            onChange={handleEditItemChange}
                                                            className="w-full p-2 border rounded"
                                                        />
                                                        {validationErrors.time && (
                                                            <p className="text-sm text-red-600">{validationErrors.time}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                                    <textarea
                                                        name="notes"
                                                        value={editItem.notes || ""}
                                                        onChange={handleEditItemChange}
                                                        className="w-full p-2 border rounded"
                                                        rows={3}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Color</label>
                                                    <input
                                                        type="color"
                                                        name="color"
                                                        value={editItem.color || "#ffffff"}
                                                        onChange={handleEditItemChange}
                                                        className="w-16 h-8 p-1 rounded"
                                                    />
                                                    {validationErrors.color && (
                                                        <p className="text-sm text-red-600">{validationErrors.color}</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 justify-end">
                                                    <button
                                                        onClick={() => handleSaveEditItem(item.id)}
                                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditItem}
                                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <ToDoItem
                                                item={item}
                                                toggleCompleted={toggleCompleted}
                                                startEditItem={startEditItem}
                                                confirmDeleteItem={(item) => {
                                                    setItemToDelete(item);
                                                    setShowDeleteConfirm(true);
                                                }}
                                            />
                                        )
                                    )
                            ) : (
                                <p className="text-gray-500 text-sm">This To-Do do not have any item / This Filter do not have item.</p>
                            )}
                        </div>

                    </>
                ) : (
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-700 mb-2">
                            Welcome to Jayden's ToDo App
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Select or create a ToDo from the left to view details here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
