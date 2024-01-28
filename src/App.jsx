import './index.css'
import MembersBar from './components/MembersBar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home/Home'
import Pacientes from './pages/Pacientes/Pacientes'
import Messages from './pages/Messages/Messages'
import Login from './pages/Login/Login'
import Projects from './pages/Projects/Projects'
import Profile from './pages/Profile/Profile'
import Signup from './pages/Signup/Signup'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./providers/ThemeProvider"
import { useAuthContext } from './hooks/useAuthContext'
import Loading from './components/Loading'
import Chat from './components/Chat'
import Tasks from './pages/Tasks/Tasks'
import ChatButton from './components/ChatButton'
import { useState } from 'react'
import { useCollection } from './hooks/useCollection'
import { Toaster } from '@/shadcn/components/ui/toaster'
import { UserDocProvider } from './contexts/UserDocContext'
import { useDocument } from './hooks/useDocument'
import { Users } from 'lucide-react'
import { UsersContext, UsersProvider } from './contexts/UsersContext'
import useMediaQuery from './hooks/useMediaQuery'
import Topbar from './components/Topbar'

const UserDocWrapper = ({ user, children }) => {

  const { documents: chats } = useCollection("chats",[
    "participants",
    "array-contains",
    user.uid
  ])

  const { document: userDoc } = useDocument("users", user?.uid)
    if(!userDoc) return <Loading />
    return children(userDoc, chats)
}


function App() {

  const { user, authIsReady } = useAuthContext()
  const [chatIsOpen, setChatIsOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [rerender, setRerender] = useState(false)

  const { documents: users } = useCollection("users")

  const isMobile = useMediaQuery("(max-width: 640px)")

  if (!authIsReady) return <Loading />

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" user={user}>
      <div className="App flex flex-col sm:flex-row">
        <Toaster />
        <BrowserRouter user={user}>
          {
            user ? (
              <UserDocProvider user={user}>
                
                  <UserDocWrapper user={user}>
                    {(userDoc, chats) => (
                      <UsersProvider userDoc={userDoc}>
                        <>
                          {isMobile ? <Topbar userDoc={userDoc}/> 
                            : (<Sidebar
                              userDoc={userDoc}
                              rerender={rerender}
                              setRerender={setRerender} 
                            />)}
  
                          <div className="mt-12 sm:mt-0 flex-grow">
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="*" element={<Home />} />
                              <Route path="/pacientes" element={<Pacientes />} />
                              <Route path="/projects" element={<Projects />} />
                              <Route path="/chats" element={<Messages />} />
                              <Route path="/tasks" element={<Tasks />} />
                              <Route path="/profile" element={<Profile
                                rerender={rerender}
                                setRerender={setRerender} />} />
                            </Routes>
                          </div>
                        
                          {!isMobile && <MembersBar
                            userDoc={userDoc}
                            setSelectedChat={setSelectedChat}
                            setChatIsOpen={setChatIsOpen}
                            chats={chats}
                            />}
                          {chatIsOpen &&
                            <Chat
                              userDoc={userDoc}
                              selectedChat={selectedChat}
                              chats={chats}
                              setSelectedChat={setSelectedChat}
                              setChatIsOpen={setChatIsOpen}
                            />}
  
                          <ChatButton
                            userDoc={userDoc}
                            setChatIsOpen={setChatIsOpen}
                            setSelectedChat={setSelectedChat}
                            selectedChat={selectedChat}
                            chats={chats}
                            />
                          
                        </>
                      </UsersProvider>
                    )}
                  </UserDocWrapper>
                
              </UserDocProvider> ) : (
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/*" element={<Signup />} />
              </Routes>
          )}

        </BrowserRouter>
      </div>
    </ThemeProvider>

  )
}

export default App
