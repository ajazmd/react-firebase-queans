
import { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove, // Add this import for removing answers
} from "firebase/firestore";
import { Form, Button, Card, ListGroup } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [answerTexts, setAnswerTexts] = useState({}); // Store answer text for each question

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "questions"), (snapshot) => {
      const questionsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionsList);
    });

    return () => unsubscribe(); // Cleanup when component unmounts
  }, []);

  const fetchQuestions = async () => {
    const querySnapshot = await getDocs(collection(db, "questions"));
    const questionsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setQuestions(questionsList);
  };

  const handleAnswerChange = (questionId, text) => {
    setAnswerTexts({ ...answerTexts, [questionId]: text });
  };

  const submitAnswer = async (questionId) => {
    const answerText = answerTexts[questionId];
    if (!auth.currentUser) {
      toast.error("Please log in and provide an answer.");
      return;
    }

    if (!answerText) {
      toast.error("Provide an answer before submitting.");
      return;
    }

    const answer = {
      text: answerText,
      answeredBy: auth.currentUser.email,
      createdAt: new Date(),
    };

    try {
      const questionRef = doc(db, "questions", questionId);
      await updateDoc(questionRef, {
        answers: arrayUnion(answer),
      });
      toast.success("Answer submitted successfully!");
      setAnswerTexts({ ...answerTexts, [questionId]: "" }); // Clear the answer input
      fetchQuestions(); // Refresh the questions list
    } catch (error) {
      toast.error("Error submitting answer: ", error);
    }
  };

  // Add this function to handle deleting an answer
  const deleteAnswer = async (questionId, answer) => {
    if (!auth.currentUser || auth.currentUser.email !== answer.answeredBy) {
      toast.error("You can only delete your own answers.");
      return;
    }

    try {
      const questionRef = doc(db, "questions", questionId);
      await updateDoc(questionRef, {
        answers: arrayRemove(answer), // Remove the specific answer
      });
      toast.success("Answer deleted successfully!");
      fetchQuestions(); // Refresh the questions list
    } catch (error) {
      toast.error("Error deleting answer: ", error);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ToastContainer />
      <Form className="mb-4">
        <Form.Group controlId="search">
          <Form.Label className="text-center w-100">
            <h4 className="fw-bold">Search for Your Question</h4>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Type here to find Answers to Your Question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Form>
      {filteredQuestions.length === 0 ? (
        <p className="text-muted" style={{
          color: "#6c757d",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "2rem",
        }}>No questions found.</p>
      ) : (
        <ListGroup>
          {filteredQuestions.map((q) => (
            <ListGroup.Item key={q.id} style={{ borderLeft: '1px solid blue', borderBottom: '1px solid blue', color: 'black', padding: '20px' }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-primary">{q.text}</Card.Title>
                  <Card.Text>Asked by: {q.askedBy}</Card.Text>

                  {/* Display Answers */}
                  {q.answers && q.answers.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-primary">Answers:</h5>
                      {q.answers.map((answer, index) => (
                        <Card key={index} className="mb-2">
                          <Card.Body>
                            <Card.Text>{answer.text}</Card.Text>
                            <Card.Text className="text-primary">
                              <span> Answered by: {answer.answeredBy}</span>
                            </Card.Text>
                            {/* Add Delete Button for the answer */}
                            {auth.currentUser && auth.currentUser.email === answer.answeredBy && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => deleteAnswer(q.id, answer)}
                              >
                                Delete
                              </Button>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Add Answer Form */}
                  <Form className="mt-3">
                    <Form.Group controlId={`answer-${q.id}`}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Write Your answer here..."
                        value={answerTexts[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      />
                      <Button
                      variant="success"
                      className="mt-3"
                      size="sm"
                      onClick={() => submitAnswer(q.id)}
                    >
                      Submit
                    </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Home;
