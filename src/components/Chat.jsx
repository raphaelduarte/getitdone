import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/components/ui/avatar"
import { Separator } from '@/shadcn/components/ui/separator'
import { Input } from '@/shadcn/components/ui/input'
import { Button } from '@/shadcn/components/ui/button'
import { ScrollArea } from "@/shadcn/components/ui/scroll-area"
import { useAuthContext } from '@/hooks/useAuthContext'
import { useSubcollection } from '@/hooks/useSubcollection'
import Message from './Message'
import getInitials from '@/utils/getInitials'
import { useFirestore } from '@/hooks/useFirestore'
import { ChevronLeftIcon, Cross1Icon } from '@radix-ui/react-icons'
import { auth, timestamp } from '@/firebase/config'


export default function Chat({
    selectedChat,
    chats,
    setSelectedChat,
    setChatIsOpen,
    users
}) {

    const { user } = useAuthContext()

    const {
        updateDocument: updateChat,
        addDocument: createChat,
        addSubDocument: createMessage,
    } = useFirestore("chats")

    const [messageContent, setMessageContent] = useState("")


    const chat = chats.find((chat) => {
        return chat.id === selectedChat?.id
    })

    const addMessageToChat = async () => {
        await createMessage(selectedChat.id, "messages", {
            author: user.uid,
            createdAt: new Date(),
            content: messageContent,
        });

        await updateChat(selectedChat.id, {
            lastMessage: {
                content: messageContent,
                createdAt: timestamp,
            },
        });
    };

    let chatId = null

    useEffect(() => {
        // Quando um novo chat é criado e o ID é atualizado, esta função é chamada
        if (selectedChat?.id && !chat) {
            addMessageToChat();
        }
    }, [selectedChat]);


    const { documents: messages } = useSubcollection(
        "chats",
        chat?.id,
        "messages",
        null,
        ["createdAt", "asc"]
    )


    const sendMessage = async (e) => {
        e.preventDefault();
        if (messageContent === "") return;

        if (!chat?.id) {
            const { payload } = await createChat({
                participants: [...selectedChat.participants],
            });
            console.log(payload)
            console.log(selectedChat.id)
            if (payload) {
                setSelectedChat(prevState => {
                    return {
                        ...prevState,
                        id: payload,
                        participants: [...selectedChat.participants]
                    }
                } 
                );

                await createMessage(selectedChat?.id || payload, "messages", {
                    author: user.uid,
                    createdAt: new Date(),
                    content: messageContent,
                });

                await updateChat(selectedChat?.id || payload, {
                    lastMessage: {
                        content: messageContent,
                        createdAt: timestamp,
                    },
                });

            } else {
                console.error('Payload ou payload.id é undefined');
            }
        } else {
            // Chamada para adicionar mensagem se o chat já existir
            await createMessage(selectedChat?.id || chatId, "messages", {
                author: user.uid,
                createdAt: new Date(),
                content: messageContent,
            });

            await updateChat(selectedChat?.id || chatId, {
                lastMessage: {
                    content: messageContent,
                    createdAt: timestamp,
                },
            });
        }
        console.log(selectedChat.id)
        setMessageContent("");
    };

    const closeChat = () => {
        setChatIsOpen(false)
        setSelectedChat(null)
    }

    const openChat = (chat, userName) => {

        return setSelectedChat({
            id: chat.id,
            recipient: userName
        })
    }

    const formatMessageDate = (dateObj) => {
        const now = new Date();
        const dayInMilliseconds = 24 * 60 * 60 * 1000;
        const daysOfWeek = [
            "domingo",
            "segunda-feira",
            "terça-feira",
            "quarta-feira",
            "quinta-feira",
            "sexta-feira",
            "sábado",
        ];

        // Calcula a diferença entre a data atual e a data passada em dias
        const diffInDays = Math.floor((now - dateObj) / dayInMilliseconds);

        // Se for o mesmo dia, retorna a hora
        if (diffInDays === 0) {
            return dateObj.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        // Se for o dia anterior, retorna "Ontem"
        if (diffInDays === 1) {
            return "Ontem";
        }

        // Se for entre 2 e 6 dias atrás, retorna o dia da semana
        if (diffInDays >= 2 && diffInDays < 7) {
            return daysOfWeek[dateObj.getDay()];
        }

        // Se for 7 dias atrás ou mais, retorna a data no formato DD/MM/AA
        return dateObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });
    };


    return (
        <div className='fixed bottom-24 right-4 sm:right-[248px] h-[500px] h-96 bg-input w-[350px] sm:w-96 rounded-lg p-5 drop-shadow-xl'>
            <div className='flex flex-col h-full'>
                <div className='flex gap-3 items-center'>
                    {selectedChat && <Button
                        className="top-2 right-2"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedChat(null)}
                    >
                        <ChevronLeftIcon className='w-6 h-6' />
                    </Button>}

                    {selectedChat &&
                        (
                            <Avatar>
                                <AvatarImage src="" />
                                <AvatarFallback>
                                    {getInitials(selectedChat.recipient)}
                                </AvatarFallback>
                            </Avatar>
                        )
                    }

                    <p className='font-medium'>
                        {selectedChat?.recipient || "Conversas"}
                    </p>
                </div>
                <Button
                    className="absolute top-2 right-2"
                    variant="ghost"
                    onClick={closeChat}
                >
                    <Cross1Icon />
                </Button>
                <Separator className="bg-muted-foreground/10 my-4" />
                <ScrollArea className="flex-grow">
                    {selectedChat
                        ? (messages?.length &&
                            messages?.map((message, index) => (
                                <Message key={`message-${index}`} message={message} />
                            ))) || (
                            <p className='text-foreground/50 text-sm'>
                                Não há mensagens para exibir
                            </p>
                        )
                        : chats?.filter(chat => chat.participants.includes(user.uid))
                        .map((chat) => {
                            const chatUser = users.find(
                                (u) => (chat.participants.includes(u.id) && u.id !== user.uid)
                            )
                            return (
                                <div key={`chat-${chat.id}`}>
                                    <div
                                        onClick={() => openChat(chat, chatUser.name)}
                                        role="button"
                                        className="relative"
                                    >
                                        <div className='flex gap-2.5 items-center'>
                                            <Avatar>
                                                <AvatarImage src="" />
                                                <AvatarFallback>
                                                    {getInitials(chatUser.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className='font-medium'>{chatUser.name}</p>
                                                <p className='text-muted-foreground text-sm'>
                                                    {chat.lastMessage.content}
                                                </p>
                                            </div>
                                            <p className='absolute top-1 right-2 text-muted-foreground text-xs'>
                                                {formatMessageDate(chat.lastMessage.createdAt.toDate())}
                                            </p>
                                        </div>
                                    </div>
                                    <Separator key={`separator-${chat.id}`} className="bg-muted-foreground/10 my-4" />
                                </div>

                            )
                        }
                        ) || (
                            <p className='text-foreground/50 text-sm'>Não há conversas para exibir</p>
                        )}
                </ScrollArea>
                <form className='flex gap-2.5' onSubmit={sendMessage}>
                    <Input
                        type="text"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <Button type="submit">Enviar</Button>
                </form>
            </div>
        </div>
    )
}