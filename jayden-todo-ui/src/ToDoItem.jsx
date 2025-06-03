import React, { useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { Pencil, Trash2 } from 'lucide-react';

function ToDoItem({ item, toggleCompleted, startEditItem, confirmDeleteItem }) {
    const [showConfetti, setShowConfetti] = useState(false);
    const cardRef = useRef(null);
    const prevCompletedRef = useRef(item.completed);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


    // 🎉 Trigger confetti only when completion goes from false → true
    useEffect(() => {
        const prevCompleted = prevCompletedRef.current;
        if (!prevCompleted && item.completed) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
        prevCompletedRef.current = item.completed;
    }, [item.completed]);

    // 📏 Measure card size
    useEffect(() => {
        if (cardRef.current) {
            const { offsetWidth, offsetHeight } = cardRef.current;
            setDimensions({ width: offsetWidth, height: offsetHeight });
        }
    }, [item.completed]);

    return (
        <div
            ref={cardRef}
            key={item.id}
            className="p-4 rounded shadow flex justify-between items-start relative overflow-hidden"
            style={{
                backgroundColor: item.completed ? '#9d9d9d' : item.color || '#f3f4f6',
                color: item.completed ? '#1f2937' : '#111827',
            }}
        >
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <Confetti
                        numberOfPieces={200}
                        width={dimensions.width}
                        height={dimensions.height}
                        gravity={0.2}
                        initialVelocityY={15}
                        tweenDuration={4000}
                        recycle={false}
                        colors={["#34D399", "#60A5FA", "#FBBF24", "#F472B6", "#A78BFA"]}
                    />
                </div>
            )}

            <div className="flex-1 z-10">
                <div className="flex items-center gap-2 mb-1">
                    <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleCompleted(item)}
                        className="cursor-pointer"
                    />
                    <h4 className={`font-semibold text-lg ${item.completed ? 'line-through text-green-700' : ''}`}>
                        {item.itemName}
                    </h4>
                    {item.completed && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded-full select-none">
                            Completed
                        </span>
                    )}
                </div>
                <p className={`${item.completed ? 'line-through text-green-700' : ''}`}>{item.description}</p>
                <p className={`${item.completed ? 'text-green-700' : ''}`}>
                    📅 {(() => {
                        const d = new Date(item.date);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const year = d.getFullYear();
                        return `${day}-${month}-${year}`; // ✅ dd-mm-yyyy
                    })()}
                    <br />
                    ⏰ {new Date(`1970-01-01T${item.time}`).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })}
                </p>

                <p className={`italic text-sm ${item.completed ? 'text-green-700' : ''}`}>{item.notes}</p>
            </div>

            <div className="flex flex-col gap-2 ml-4 z-10">
                <button onClick={() => startEditItem(item)} className="text-blue-600 hover:text-blue-700">
                    <Pencil size={18} />
                </button>
                <button
                    onClick={() => confirmDeleteItem(item)}
                    className="text-red-600 hover:text-red-700"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default ToDoItem;
