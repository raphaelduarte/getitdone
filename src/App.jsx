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
  const { document: userDoc } = useDocument("users", user?.uid)
    if(!userDoc) return <Loading />
    return children(userDoc)
}

function App() {

  const { user, authIsReady } = useAuthContext()
  const [chatIsOpen, setChatIsOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [rerender, setRerender] = useState(false)

  const { documents: chats } = useCollection("chats")

  const { documents: users } = useCollection("users")

  const isMobile = useMediaQuery("(max-width: 640px)")

  if(!chats) return <Loading />

  if (!authIsReady) return <Loading />

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App flex flex-col sm:flex-row">
        <Toaster />
        <BrowserRouter>
          {
            user ?
              <UserDocProvider user={user}>
                
                  <UserDocWrapper user={user}>
                    {(userDoc) => (
                      <UsersProvider userDoc={userDoc}>
                        <>
                          {isMobile ? <Topbar/> : (<Sidebar
                          rerender={rerender}
                          setRerender={setRerender} />)}
  
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
                            setSelectedChat={setSelectedChat}
                            setChatIsOpen={setChatIsOpen}
                            chats={chats}
                            users={users}
                            />}
                          {chatIsOpen &&
                            <Chat
                              selectedChat={selectedChat}
                              chats={chats}
                              users={users}
                              setSelectedChat={setSelectedChat}
                              setChatIsOpen={setChatIsOpen}
                            />}
  
                          <ChatButton
                            setChatIsOpen={setChatIsOpen}
                            setSelectedChat={setSelectedChat}
                            selectedChat={selectedChat}
                            chats={chats}
                            />
                          
                        </>
                      </UsersProvider>
                    )}
                  </UserDocWrapper>
                
              </UserDocProvider> :
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/*" element={<Signup />} />
              </Routes>
          }

        </BrowserRouter>
      </div>
    </ThemeProvider>

  )
}

export default App
