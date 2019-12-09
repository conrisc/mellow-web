import React, {useEffect, useState} from 'react';
import {DevelopersApi, SongItem} from 'what_api';

export function NewSongModal(props) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [songTags, setTags] = useState(['new-song']);
    const [editedTag, setEditedTag] = useState('');

    const tagsNameToIdMap = props.tags.reduce(
        (acc, tagElement) => {
            acc[tagElement.tagItem.name] = tagElement.tagItem.id;
            return acc;
        },
    {});

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});
    }, []);

    function handleTagChange(event) {
        const value = event.target.value;
        setEditedTag(value);
    }

    function handleTagAction(event) {
        switch(event.key) {
            case ' ':
            case 'Enter':
                if (editedTag.trim() !== '') {
                    setTags([...songTags, editedTag.trim()]);
                    setEditedTag('');
                    event.preventDefault();
                }
                break;
            case 'Backspace':
                if (editedTag === '') {
                    setEditedTag(songTags[songTags.length-1]);
                    setTags(songTags.slice(0,-1));
                    event.preventDefault();
                }
                break;
        }
    }

    function addSong() {
        if (title.trim() === '') {
            console.warn('Title does not match criteria!');
            return;
        }
        const songTagsIds = songTags.map(tagName => tagsNameToIdMap[tagName])
            .filter(tagId => typeof tagId === 'string');

        const opts = {
            songItem: new SongItem(title.trim(), url.trim(), new Date().toISOString(), songTagsIds)
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
                <div className="row">
                    <div className="col">
                        {songTags.map((tagName, index) =>
                            <div key={index} className="tag-item">
                                {tagName}
                                {/* <i className="fas fa-times"></i> */}
                            </div>)
                        }
                    </div>
                    <div className="col">
                        <input className="input-small" type="text" value={editedTag} onChange={handleTagChange} onKeyDown={handleTagAction} />
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
