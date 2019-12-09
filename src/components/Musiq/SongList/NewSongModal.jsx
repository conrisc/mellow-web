import React, {useEffect, useState} from 'react';

export function NewSongModal(props) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});
    }, []);

    function addSong() {

    }

    return (
        <div id="add-song-modal" className="modal">
            <div className="modal-content">
                <h4>Add song</h4>
                <div className="row">
                    <div className="col s6 input-field">
                        <i className="fas fa-music prefix"></i>
                        <input id="addSongTitle" type="text" className="validate" value={title} onChange={e => setTitle(e.target.value)} />
                        <label htmlFor="addSongTitle">Song title</label>
                    </div>
                    <div className="col s6 input-field">
                        <i className="fas fa-link prefix"></i>
                        <input id="addSongUrl" type="text" className="validate" value={url} onChange={e => setUrl(e.target.value)} />
                        <label htmlFor="addSongUrl">Song url</label>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">Cancel</a>
                <a href="#!" className="modal-close waves-effect waves-green btn" onClick={addSong}>Add</a>
            </div>
        </div>
    );
}
