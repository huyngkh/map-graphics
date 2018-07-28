import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ToolBox from './components/tools'
import MapViewport from './components/map';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <header>
                    <p>User profile</p>
                </header>

                <section>
                    <nav>
                        <ToolBox />
                    </nav>
                    <article>
                        <MapViewport />;
                    </article>
                </section>

                <footer>
                    <p>Footer</p>
                </footer>
            </div>
        );
    }    
}

ReactDOM.render(<App />, document.querySelector('.container'));