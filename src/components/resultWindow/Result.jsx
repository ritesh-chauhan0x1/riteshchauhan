import "./result.css";
import { PiInfoLight } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { useContext } from "react";
import { ResultContext } from "../../App";

const Result = () => {
    const { student_id, roll_no, name, phone, email, Program_Description } = useContext(ResultContext)
    return <>
        <div className="main-result-container">
            <div className="result-window-container">
                <div className="result-top-bar">
                    <IoPersonOutline className="person-outline" />
                    &gt;
                    <div id="searched-roll">{roll_no || "Empty"}</div>
                    &gt;
                    <div className="normal-text">Details</div>
                </div>

                <div className="result-window">
                    <table>
                        <tr>
                            <th>Name</th>
                            <td id="student-name">{name || "UNKNOWN"}</td>
                        </tr>
                        <tr>
                            <th>Program</th>
                            <td id="program">{Program_Description || "UNKNOWN"}</td>
                        </tr>
                        <tr>
                            <th>Roll Number</th>
                            <td id="roll">{roll_no || "UNKNOWN"}</td>
                        </tr>
                        <tr>
                            <th>Student Number</th>
                            <td id="student-number">{student_id || "UNKNOWN"}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td id="phone-number">{phone || "UNKNOWN"}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td id="email">{email || "UNKNOWN"}</td>
                        </tr>
                    </table>
                                        <div className="misc-container">
                                                <button 
                                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                                    title="SAP lock features coming soon"
                                                >
                                                    SAP Lock
                                                </button>
                                        </div>
                </div>
                <div className="result-bottom-bar">
                    <span className="text">
                        <PiInfoLight className="info-icon" /> Don't use these information for harmful and unlawful purposes.
                    </span>
                </div>
            </div>
        </div>
    </>
}

export default Result;