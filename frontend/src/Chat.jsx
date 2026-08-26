import { useContext , useState , useEffect } from 'react'
import './Chat.css'
import { MyContext } from './MyContext'
import ReactMarkdown from 'react-markdown';
import rehypeHighligh from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import "highlight.js/styles/github-dark.css";

export default function Chat () {
    let {newChat , chats , setNewChat , reply , user , chatError , setChatError } = useContext(MyContext);
    let [latestReply , setLatestReply ] = useState(null);

    useEffect(()=>{
        if(reply==null){
            setLatestReply(null);
            return;
        } 
        if(!chats?.length) return;

        const content = reply?.split(" ");

        let idx = 0;
        const interval = setInterval(()=>{
            setLatestReply(content?.slice(0,idx+1).join(" "));

            idx++;
            if(idx >= content?.length) clearInterval(interval);
        },40);

        return ()=> clearInterval(interval);
    }, [chats , reply ]);

    return (
        <>
            { newChat && <p className='newChatText'>What’s on the agenda today ?</p>}
            <div className="chats">
                {
                    chats?.slice(0 , -1).map((chat, idx)=>
                        <div className={chat.role==='user'? 'userDiv' : 'gptDiv'} key={idx}>
                            { chat.role==='user'?
                            <p className='userMessage'>{chat.content}</p> :
                            <div className='gptMessage'>
                                <ReactMarkdown rehypePlugins={[rehypeHighligh]} remarkPlugins={[remarkGfm]}>{chat.content}</ReactMarkdown>
                            </div>
                            }
                        </div>
                    )
                }

                {
                    chats?.length!=0 && latestReply && 
                    <div className='gptMessage' key='typing'> 
                        <ReactMarkdown rehypePlugins={[rehypeHighligh]} remarkPlugins={[remarkGfm]} >{latestReply}</ReactMarkdown>
                    </div> 
                }

                {
                    chats?.length!=0 && latestReply==null && 
                    <div className= 'gptDiv' key='non-typing'> 
                            <div className='gptMessage'>
                                <ReactMarkdown rehypePlugins={[rehypeHighligh]} remarkPlugins={[remarkGfm]}>{chats[chats.length - 1]?.content}</ReactMarkdown>
                            </div>
                    </div>
                }
            </div>
        </>
    )
}