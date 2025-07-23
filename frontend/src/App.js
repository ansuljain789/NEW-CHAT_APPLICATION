
import { Route ,Routes} from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage'
import ForgotPassword from './components/Authentication/ForgotPassword';

function App() {
  return (
    <div className="App">
   <Routes>
    <Route path='/' Component={HomePage} />
    <Route path='/chats' Component={ChatPage} />
    <Route path="/forgot" element={<ForgotPassword />} />

  
    </Routes>
    

     </div>
  );
}

export default App;
