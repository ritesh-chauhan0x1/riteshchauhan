import "./search.css";
import { ResultContext } from "../../App";
import { CgSearch } from "react-icons/cg";
import { useContext } from "react";

const Search = () => {
    const { updateData } = useContext(ResultContext);
    return <>
        <div className="main-searchbar-container">
            <div className="searchbar-container">
                <CgSearch className="search-icon" />
                                <input
                                    type="text"
                                    name="roll"
                                    id="roll"
                                    placeholder="Enter student roll number here"
                                    onChange={(e) => {
                                        if (e.target.value.length > 4) {
                                            Fetch(e.target.value)
                                                .then(data => data.json())
                                                .then(data => {
                                                    updateData(data);
                                                });
                                        }
                                    }}
                                    onKeyUp={(e) => {
                                        if (e.key === "Enter" && e.target.value.length > 4) {
                                            Fetch(e.target.value)
                                                .then(data => data.json())
                                                .then(data => {
                                                    updateData(data);
                                                });
                                        }
                                    }}
                                />
            </div>
        </div>
    </>
}

const Fetch = (rollNumber) => {
    let fetchUrl = "https://ddos.******.workers.dev/?roll=" + rollNumber;
    return fetch(fetchUrl);
}

export default Search;
