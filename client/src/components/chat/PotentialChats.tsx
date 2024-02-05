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
    console.log("potentialChats", potentialChats);

    return (<></>);
};

export default PotentialChats;
