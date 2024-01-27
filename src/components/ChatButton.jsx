import React from 'react'
import { Button } from '@/shadcn/components/ui/button'
import { ChatBubbleIcon } from '@radix-ui/react-icons'

export default function ChatButton({setChatIsOpen, setSelectedChat}) {

  

  const handleClick = () => {
    setSelectedChat(null);
    
    setChatIsOpen((prev) => !prev)
  }
  return (
    <Button
      className="h-16 w-16 bg-primary text-background fixed bottom-4 right-4 sm:right-[224px] p-2.5 rounded-full drop-shadow-xl"
      size="icon"
      variant="outline"
      onClick={handleClick}
    >
      <ChatBubbleIcon className="h-8 w-8"/>
    </Button>
  )
}
