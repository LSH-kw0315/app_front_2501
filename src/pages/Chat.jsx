import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

function Chat() {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)
    const name=localStorage.getItem("chatbotRoomName")
    
    const fetchInitialMessages = async () => {
        try {
            
            console.log(name)
            const response = await axios.get(`http://localhost:8070/api/v1/chat/ai/${name}`)
            if (response.data && response.data.length > 0) {
                setMessages(response.data)
            }
        } catch (error) {
            console.error('Error fetching initial messages:', error)
            // toast.error('채팅 연결에 문제가 발생했습니다.')
        } 
    }

    useEffect( () =>{
        fetchInitialMessages();
    },[])


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSubmit =async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const newChat = {
            id: `msg${messages.length + 1}`,
            content: newMessage,
            createdAt: new Date().toISOString(),
            isMyMessage: true,
        }

        setMessages((prev)=>[...prev, newChat])
        setNewMessage('')

        await axios.post(`http://localhost:8070/api/v1/chat/ai/${name}`, {
            id:newChat.id,
            content: newMessage
        })
        .then(
            respose=>setMessages((prev)=>[...prev,respose.data])
        )
        

    }


    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* 채팅 헤더 */}
                <div className="bg-indigo-600 text-white p-4">
                    <h1 className="text-xl font-bold">DATA BLOCKS 채팅방</h1>
                    <p className="text-sm opacity-75">Backend Developer들과의 대화</p>
                </div>

                {/* 메시지 목록 */}
                <div className="h-[600px] overflow-y-auto p-4 bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.isMyMessage ? 'justify-end' : 'justify-start'
                                } items-end space-x-2`}
                            >
                                <div
                                    className={`max-w-[70%] ${
                                        message.isMyMessage
                                            ? 'bg-indigo-500 text-white rounded-l-lg rounded-tr-lg'
                                            : 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg'
                                    } p-3 shadow-md`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className="text-xs text-right mt-1 opacity-75">
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* 메시지 입력 */}
                <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            전송
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Chat
