import React, {useEffect, useState} from 'react';
import {DevelopersApi, SongItem} from 'what_api';

export function NewSongModal(props) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});
    }, []);

    function addSong() {
        if (title.trim() === '') {
            console.warn('Title does not match criteria!');
            return;
        }
        const opts = {
            songItem: new SongItem(title.trim(), url.trim(), new Date().toISOString(), ['5dee1f9e23b7760023ca1c4e'])
        }

        const api = new DevelopersApi();
        api.addSong(opts)
            .then(data => {
                console.log('API called successfully.', data);
            }, error => {
                console.error(error);
            });
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
