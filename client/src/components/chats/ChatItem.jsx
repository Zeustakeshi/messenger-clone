import React from "react";
import Avatar from "../Avatar";
import { useNavigate } from "react-router-dom";

const ChatItem = ({ chatId }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/chats/${chatId}`);
    };

    return (
        <button
            onClick={handleNavigate}
            className="flex justify-between items-center w-full my-2"
        >
            <div className="flex-1 flex justify-start items-start gap-2">
                <Avatar size={50}></Avatar>
                <div className="flex-1 flex flex-col justify-start items-start">
                    <span className="text-lg font-medium text-slate-700">
                        username
                    </span>
                    <span className="text-sm text-slate-600 whitespace-nowrap max-w-[250px] overflow-hidden text-ellipsis">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Corrupti quibusdam ad, labore debitis iusto enim
                        delectus impedit doloremque adipisci pariatur quas alias
                        consequuntur officiis maxime nobis eligendi accusamus
                        molestias excepturi!
                    </span>
                </div>
            </div>
        </button>
    );
};

export default ChatItem;
