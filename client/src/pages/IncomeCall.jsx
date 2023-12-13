import React, { useEffect } from "react";
import { useCall } from "../context/CallContext";

const IncomeCall = () => {
    const { peerId } = useCall();
    const [userCall, setUserCall] = useState(null);
    const navigation = useNavigate();
    const { user } = useApp();
    const [searchParams] = useSearchParams();
    const { id: userCallId } = useParams();

    /** LISTEN CALL STATUS */
    useEffect(() => {
        socket.on("receivce-end-call", ({ reason }) => {
            alert(reason);
            navigation("/home");
        });

        return () => {
            socket.off("receivce-end-call");
        };
    }, []);

    return <div>{peerId}</div>;
};

export default IncomeCall;
