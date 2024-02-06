import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const PotentialChats = () => {
    
    const chatContext = useContext(ChatContext);

    if (!chatContext) {
        // Handle the case when chatContext is null
        console.error("ChatContext not available");
        return null;
    }

    // Type assertion: tell TypeScript that chatContext is not null here.
    const {potentialChats} = chatContext!;

    console.log("pchats", potentialChats);
    return (
        <>
            <div className="all-users">
                {potentialChats && potentialChats.map((u, index) => (
                    <div className="single-user" key={index}>
                        {u.name}
                        <span className="user-online"></span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PotentialChats;
