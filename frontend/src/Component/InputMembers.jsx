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
    const checking = serverMembers.filter((item) => item.name === value);
    if (checking.length === 0) {
      return null;
    }
    const data = checking.map((item) => item.id);
    if (!selectedMembers.includes(data[0])) {
      setSelectedMembers([...selectedMembers, data[0]]);
      setShowMembers([...showMembers, value]);
      setInput(""); 
    }else{
      setInput("")
    }
  };

  const handleRemove = (value) => {
    let data;
    data = serverMembers
      .filter((item) => item.name === value)
      .map((item) => item.id);
    setSelectedMembers(selectedMembers.filter((item) => item !== data[0]));
    setShowMembers(showMembers.filter((item) => item !== value));
  };

  const notfilteroptions = serverMembers.map((item) => ({
    value: item.name,
  }));

  const options = notfilteroptions.filter((item) => item.value);

  return (
    <div className="mb-4">
      {serverMembers.length === 0 ? (
        <h1 className="p-2 text-center text-wrap">
          No members left on the server to Add
        </h1>
      ) : (
        <div>
          <div className="mb-2 text-sm font-medium items-center text-gray-700 flex">
            <h1 className="text-black">Selected:</h1>
            <div className=" flex w-72 flex-wrap ">
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
                option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              onChange={handleAutoComplete}
              onPressEnter={() => handleMembers(input)} // Handle Enter key press
              value={input} // Bind the input state to the AutoComplete component
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
