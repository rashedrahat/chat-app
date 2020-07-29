import React from 'react';
import Layout from './Components/Layout'
import './index.css'

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <Layout title={"Chat App Baby"}/>
            </div>
        );
    }
}

export default App;
