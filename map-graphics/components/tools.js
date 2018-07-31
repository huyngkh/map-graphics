import React, {Component} from 'react';

class ToolBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul>
                <li><a href="#" onClick={()=>alert('Under constructor /!\\')}>Hide/Show base map</a></li>
                <li><a href="#" onClick={()=>alert('Under constructor /!\\')}>Add new layers</a></li>
                <li><br /></li>
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
                    <button id="btn-save" className="control-button" >Save</button>
                </li>
            </ul>
        );
    }


}

export default ToolBox;