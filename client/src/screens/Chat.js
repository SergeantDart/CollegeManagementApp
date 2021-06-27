import {useState, useRef} from "react";
import {connect} from "react-redux";
import {firebase} from "../Firebase";
import {useCollectionData} from "react-firebase-hooks/firestore";
import ChatMessage from "../components/ChatMessage";


const Chat = (props) => {

    const dummy = useRef();

    const messagesReference = firebase.firestore().collection("messages");
    
    const messagesQuery = messagesReference.orderBy("createdAt").limitToLast(25);

    const [messages] = useCollectionData(messagesQuery, {idField: "id"});

    const [formValue, setFormValue] = useState();

    const sendMessage = async(event) => {
        event.preventDefault();

        await messagesReference.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user: props.users.login.user
        });

        setFormValue("");
        dummy.current.scrollIntoView({behavior: "smooth"});
    }

    console.log(props);
    return (
        <div className="chat_container">
            <h2>Academic chat room</h2>
            <main>
                {messages && messages.map(message =>
                    <ChatMessage key={message.id} message={message} currentUser={props.users.login.user}/>
                )}

                <span ref={dummy}></span>
            </main>

            

            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="Write your message..."/>

                <button type="submit" disabled={!formValue}>SEND</button>
            </form>

        </div>
    )

    

}

function mapStateToProps(state) {
    return (
        <div>

        </div>
        

    )
}


export default connect(mapStateToProps)(Chat);