import { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
const WorkoutForm = () => {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyfield, setEmptyfield] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = { title, load, reps };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyfield(json.emptyFields);
    }

    if (response.ok) {
      setError(null);
      setTitle("");
      setLoad("");
      setReps("");
      setEmptyfield([]);
      console.log("New workout added ", json);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new workout</h3>
      <label htmlFor="title">Exercise Title:</label>
      <input
        id="title"
        type="text"
        className={emptyfield.includes("title") ? "error" : ""}
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label htmlFor="load">Load (kg):</label>
      <input
        id="load"
        type="number"
        className={emptyfield.includes("load") ? "error" : ""}
        onChange={(e) => setLoad(e.target.value)}
        value={load}
      />

      <label htmlFor="reps">Reps:</label>
      <input
        id="reps"
        type="number"
        className={emptyfield.includes("reps") ? "error" : ""}
        onChange={(e) => setReps(e.target.value)}
        value={reps}
      />

      <button onSubmit={handleSubmit}>Add workout</button>
      {/* <input type="submit" value="Add workout" /> */}
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
