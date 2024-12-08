import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send } from 'lucide-react'

type Message = {
	id: number,
	text: string,
	sender: 'user' | 'ai'
};

const Chat = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [messages, setMessages] = useState<Message[]>([{ id: 1, text: 'What can i assist you with', sender: 'ai' }]);
	const [inputMessage, setInputMessage] = useState<string>('')

	const sendPrompt = async (prompt: string) => {
		const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const result = await model.generateContent(prompt);
		console.log();
		return result.response.text()
	}

	const handleSendMessage = async () => {
		if (inputMessage.trim().length === 0) {
			return;
		}

		setLoading(true);

		setMessages((prevMessages) => {

			return [...prevMessages, { id: messages.length + 1, text: inputMessage, sender: 'user' }]
		});

		const result = await sendPrompt(inputMessage)

		setMessages((prevMessages) => {

			return [...prevMessages, { id: messages.length + 1, text: result, sender: 'ai' }]
		});

		setInputMessage('');
		setLoading(false);

	}

	return (
		<div className="flex flex-col h[600px] max-w-lg mx-auto border rounded-lg overflow-hidden" >
			<div className="p-4">
				{
					messages.map((message) => {
						return (
							<div key={`${message.sender}-${message.id}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
								}`}>
								<div
									className={`max-w-[70%] rounded-lg px-4 py-2 ${message.sender === 'user'
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 text-gray-800'
										}`}
								>
									{message.text}
								</div>
							</div>
						)
					})
				}
				{loading ? (
					<div
						className={`max-w-[70%] rounded-lg px-4 py-2 bg-gray-200 text-gray-800`}>
						...
					</div>
				) : null}
			</div>


			<div className="border-t p-4 flex items-center space-x-2">
				<input
					type="text"
					value={inputMessage}
					className="flex-grow pl-2"
					onChange={(event) => setInputMessage(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							handleSendMessage();
						}
					}}
				/>
				<button onClick={() => {
					handleSendMessage();
				}}>
					<Send className="h-4 w-4" />
					<span className="sr-only">Send message</span>
				</button>
			</div>
		</div>
	)
}

export default Chat;