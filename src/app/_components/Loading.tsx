"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading: React.FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <FontAwesomeIcon icon={faSpinner} spin size="2x" />
    </div>
  );
};

export default Loading;
