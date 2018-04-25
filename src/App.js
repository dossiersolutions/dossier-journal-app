import React from 'react';
import Routes from "./routes"
// class App extends Component {


//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <Home/>
//       </div>
//     );
//   }
// }
//
//
// export default App;

export default () => <div className="container bg-light" style={{maxWidth: "960px"}}><Routes/></div>;
