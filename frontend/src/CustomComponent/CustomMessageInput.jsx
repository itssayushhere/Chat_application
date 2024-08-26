/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useMessageInputContext } from "stream-chat-react";
import { IoSendOutline } from "react-icons/io5";
import { LoadingIndicator } from "stream-chat-react";
import { MdOutlineAttachFile } from "react-icons/md";
// AttachmentUploadButton component
const AttachmentUploadButton = () => {
  const { uploadNewFiles, isUploadEnabled, maxFilesLeft } =
    useMessageInputContext();

  function handleChange(e) {
    const files = e.currentTarget.files;

    if (files && files.length > 0) {
      uploadNewFiles(files);
      e.currentTarget.value = "";
    }
  }

  if (!isUploadEnabled || maxFilesLeft === 0) {
    return null;
  }

  return (
    <label className="flex items-center justify-center text-xl cursor-pointer">
      <input type="file" className="hidden" onChange={handleChange} />
      <MdOutlineAttachFile />
    </label>
  );
};

// AttachmentActions component
const AttachmentActions = ({ attachment, type }) => {
  const { removeImage, uploadImage, removeFile, uploadFile } =
    useMessageInputContext();
  const [remove, upload] =
    type === "image" ? [removeImage, uploadImage] : [removeFile, uploadFile];

  let children = null;

  if (attachment.state === "uploading") {
    children = (
      <div className="message-input__attachment-action">
        <LoadingIndicator />
      </div>
    );
  }

  if (attachment.state === "finished") {
    children = (
      <div className="flex gap-1 w-full mx-auto p-1">
        <a
          className=""
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
        >
          📥
        </a>
        <button className=" " onClick={() => remove(attachment.id)}>
          ❌
        </button>
      </div>
    );
  }

  if (attachment.state === "failed") {
    children = (
      <button className="" onClick={() => upload(attachment.id)}>
        Failed. Retry?
      </button>
    );
  }

  return <div className="">{children}</div>;
};

const CustomLinkPreviewList = () => {
  const { linkPreviews: linkPreviewMap, dismissLinkPreview } =
    useMessageInputContext();
  const linkPreviews = Array.from(linkPreviewMap.values());

  if (linkPreviews.length === 0) {
    return null;
  }

  return (
    <ul className="">
      {linkPreviews.map(
        (preview) =>
          preview.state === "loaded" && (
            <li key={preview.og_scrape_url} className="flex items-center ">
              <span className="">🔗</span>
              <div className="">
                <strong>{preview.title}</strong>
                <br />
                {preview.text}
              </div>
              <button
                type="button"
                className=" p-2 mr-5"
                onClick={() => dismissLinkPreview(preview)}
              >
                ❌
              </button>
            </li>
          )
      )}
    </ul>
  );
};
// ImageAttachmentPreview component
const ImageAttachmentPreview = ({ id }) => {
  const { imageUploads } = useMessageInputContext();
  const image = imageUploads[id];
  const url = image.previewUri ?? image.url ?? "fallback.webm";

  return (
    <div className="w-fit flex flex-col items-center  justify-center border-2 border-black p-2">
    {/* <div
      className="w-full  "
      style={{
        backgroundImage: `url(${url})`,
        height: "200px", // Set your desired height
        width: "200px", // Set your desired width
        backgroundSize: "cover", // Ensure the image covers the entire element
        backgroundPosition: "center", // Center the image within the element
        backgroundRepeat: "no-repeat", // Prevent the image from repeating
      }}
      aria-label={image.file.name}
      >
    </div> */}
    <img src={url} alt={image.file.name} className="h-20 w-20 object-cover overflow-hidden" />
      <AttachmentActions attachment={image} type="image" />
      </div>
  );
};

// FileAttachmentPreview component
const FileAttachmentPreview = ({ id }) => {
  const { fileUploads } = useMessageInputContext();
  const attachment = fileUploads[id];

  return (
    <div className="p-2">
      📄 {attachment.file.name} <br />({attachment.file.size} bytes)
      <AttachmentActions attachment={attachment} type="file" />
    </div>
  );
};

// CustomMessageInput component
const CustomMessageInput = () => {
  const {
    text,
    handleChange,
    handleSubmit,
    textareaRef,
    imageUploads,
    fileUploads,
  } = useMessageInputContext();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height to auto to allow for shrinking
      const newHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${newHeight > 300 ? 300 : newHeight}px`;
    }
  }, [text, textareaRef]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(); 
    }
  };


  return (
    <div className="w-full bg-black  rounded">
      <CustomLinkPreviewList />
      <div className=" flex   gap-4 ">
        {Object.keys(imageUploads).map((id) => (
          <ImageAttachmentPreview key={id} id={id} />
        ))}
        {Object.keys(fileUploads).map((id) => (
          <FileAttachmentPreview key={id} id={id} />
        ))}
      </div>
      <div className="w-full flex p-2 relative  items-center">
        <div className="flex absolute bottom-[22px] left-4 z-50 ">
          <AttachmentUploadButton />
        </div>
        <textarea
          rows={1}
          value={text}
          ref={textareaRef}
          className={`w-full p-3 px-10 rounded-lg hidden-scrollbar bg-black bg-opacity-100  text-white  focus:outline-none`}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          placeholder="Type your message..."
        />
        <button
          type="button"
          className="p-3 mr-2 absolute right-0 bottom-2 z-50 "
          onClick={handleSubmit}
        >
          <IoSendOutline className="text-blue-500 text-lg" />
        </button>
      </div>
    </div>
  );
};

export default CustomMessageInput;
