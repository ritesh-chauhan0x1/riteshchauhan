import { useState, useContext, createContext } from "react";
import Result from "./components/resultWindow/Result";
import Search from "./components/searchbar/Search";

export const ResultContext = createContext({
    name: "",
});

const App = () => {
    const [student_id, setStudent_id] = useState(null);
    const [phone, setPhone] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [roll_no, setRoll_no] = useState(null);
    const [Program_Description, setProgram_Description] = useState(null);

    const updateData = (data) => {
        setStudent_id(data.student_id);
        setPhone(data.phone);
        setEmail(data.email);
        setName(data.name);
        setRoll_no(data.roll_no);
        setProgram_Description(data.Program_Description);
    }

    return (
        <ResultContext.Provider value={{ student_id, phone, email, name, roll_no, Program_Description, updateData }}>
            <Search />
            <Result />
            <div className="ritesh-box">
                - Ritesh Chauhan
            </div>
        </ResultContext.Provider>
    )
}

export default App;