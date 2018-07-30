import React, {Component} from 'react';

class ToolBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul>
                <li><a href="#">Hide/Show base map</a></li>
                <li><a href="#">Add new layers</a></li>
                <li><a href="#">Draw a polyline</a></li>
                <li>
                <select id="type">
                    <option value="Point">Point</option>
                    <option value="LineString">LineString</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Circle">Circle</option>
                    <option value="None">None</option>
                </select>
                </li>
                <li>
                    <button id="btn-draw" className="control-button" >Draw</button>
                    <button id="btn-move" className="control-button" >Move</button>
                </li>
            </ul>
        );
    }


}

export default ToolBox;