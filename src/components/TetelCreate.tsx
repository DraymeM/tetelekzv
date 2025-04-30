import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const TetelCreate: React.FC = () => {
  const [name, setName] = useState("");
  const [osszegzes, setOsszegzes] = useState("");
  const [sections, setSections] = useState([
    { content: "", subsections: [{ title: "", description: "" }] },
  ]);
  const [flashcards, setFlashcards] = useState([{ question: "", answer: "" }]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/tetelekzv/BackEnd/create_tetel.php",
        { name, osszegzes, sections, flashcards },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage("Sikeres mentés! ID: " + res.data.tetel_id);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Hiba történt.");
    }
  };

  return (
    <div className="p-4 text-white">
      <Navbar />
      <h2 className="text-xl font-bold mb-4">Tétel Létrehozása</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Tétel címe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Összegzés"
          value={osszegzes}
          onChange={(e) => setOsszegzes(e.target.value)}
        />

        <h3 className="font-semibold">Szekciók</h3>
        {sections.map((section, si) => (
          <div key={si} className="p-2 border rounded border-gray-600">
            <textarea
              placeholder="Szekció szöveg"
              className="w-full p-2 rounded bg-gray-700 mb-2"
              value={section.content}
              onChange={(e) => {
                const newSections = [...sections];
                newSections[si].content = e.target.value;
                setSections(newSections);
              }}
            />
            <h4>Alszekciók</h4>
            {section.subsections.map((sub, subi) => (
              <div key={subi} className="mb-2">
                <input
                  className="w-full p-1 mb-1 rounded bg-gray-600"
                  placeholder="Cím"
                  value={sub.title}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[si].subsections[subi].title = e.target.value;
                    setSections(updated);
                  }}
                />
                <textarea
                  className="w-full p-1 rounded bg-gray-600"
                  placeholder="Leírás"
                  value={sub.description}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[si].subsections[subi].description = e.target.value;
                    setSections(updated);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newSections = [...sections];
                newSections[si].subsections.push({
                  title: "",
                  description: "",
                });
                setSections(newSections);
              }}
              className="text-sm mt-1 text-blue-400"
            >
              + Alszekció hozzáadása
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-blue-400"
          onClick={() =>
            setSections([...sections, { content: "", subsections: [] }])
          }
        >
          + Szekció hozzáadása
        </button>

        <h3 className="font-semibold mt-4">Flashcardok</h3>
        {flashcards.map((fc, i) => (
          <div key={i}>
            <input
              className="w-full p-2 rounded bg-gray-700 mb-1"
              placeholder="Kérdés"
              value={fc.question}
              onChange={(e) => {
                const cards = [...flashcards];
                cards[i].question = e.target.value;
                setFlashcards(cards);
              }}
            />
            <input
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Válasz"
              value={fc.answer}
              onChange={(e) => {
                const cards = [...flashcards];
                cards[i].answer = e.target.value;
                setFlashcards(cards);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFlashcards([...flashcards, { question: "", answer: "" }])
          }
          className="text-sm text-blue-400"
        >
          + Flashcard hozzáadása
        </button>

        <button type="submit" className="p-2 bg-green-600 rounded">
          Létrehozás
        </button>

        {message && <div className="mt-2 text-yellow-400">{message}</div>}
      </form>
    </div>
  );
};

export default TetelCreate;
