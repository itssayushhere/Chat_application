/* eslint-disable react/prop-types */
import { useState } from "react";
import { AutoComplete } from "antd";

const InputMembers = ({ allUsers, selectedMembers, setSelectedMembers }) => {
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState([]);

  const handleAutoComplete = (value) => {
    setInput(value);
  };
  const serverMembers = allUsers.filter((m) => m.id !== "itssayushhere");
  const handleMembers = (value) => {
    let data;
    const checking = serverMembers.filter((item) => item.username === value);
    if (checking.length === 0) {
      return null;
    }
    data = serverMembers
      .filter((item) => item.username === value)
      .map((item) => item.id);
    if (selectedMembers.includes(data[0])) {
      return null;
    } else {
      setSelectedMembers([...selectedMembers, data[0]]);
      setShowMembers([...showMembers, value]);
    }
  };

  const handleRemove = (value) => {
    let data;
    if (value === "itsayushhere") {
      data = ["itsayushhere"];
    } else {
      data = serverMembers
        .filter((item) => item.username === value)
        .map((item) => item.id);
    }
    setSelectedMembers(selectedMembers.filter((item) => item !== data[0]));
    setShowMembers(showMembers.filter((item) => item !== value));
  };

  const options = serverMembers.map((item) => ({
    value: item.username,
  }));

  return (
    <div className="mb-4">
      {serverMembers.length === 0 ? (
        <h1 className="p-2  text-center text-wrap">No members left on the server to Add</h1>
      ) : (
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700 flex">
            Members to Add:
            <div className="ml-3">
              {showMembers.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-1 m-[2px] bg-slate-200 px-2 py-[2px] w-fit rounded-xl border border-black"
                >
                  <p>{item}</p>
                  <button
                    onClick={() => handleRemove(item)}
                    className="flex gap-1"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex items-center gap-2">
            <AutoComplete
              options={options}
              placeholder="Try to type"
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              onChange={handleAutoComplete}
              className="w-full"
            />
            <button
              className="p-1 bg-blue-500 rounded text-white"
              onClick={() => handleMembers(input)}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputMembers;
