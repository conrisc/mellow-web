import React from 'react';
import { debounce } from 'throttle-debounce';
import { DevelopersApi } from 'what_api';

export class SongList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            skip: 0,
            limit: 30,
            songs: []
        }
        this.getSongsDebounced = debounce(2000, () => this.getSongs())
    }

    componentDidMount() {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    }

    getSongs() {
        const api = new DevelopersApi();

        const opts = {
            skip: this.state.skip,
            limit: this.state.limit,
            tags:  this.props.tags.filter(tagElement => tagElement.selected).map(tagElement => tagElement.tagItem.id)
        };

        return api.searchSong(opts)
            .then(data => {
                this.setState({ songs: data })
            }, error => {
                // this.pushToast('Cound not get songs');
                console.error(error);
            });
    }

    render() {
        const tagsIdToNameMap = this.props.tags.reduce(
            (acc, tagElement) => { 
                acc[tagElement.tagItem.id] = tagElement.tagItem.name;
                return acc;
            }, 
        {});
        return (
            <div>
                <div className="row">
                    <div className="input-field col s2">
                        <input
                            id="skip"
                            type="number"
                            value={this.state.skip}
                            onChange={e => { this.setState({ skip: Number(e.target.value) }); this.getSongsDebounced(); }}
                            min="0"
                        />
                        <label htmlFor="skip">Skip</label>
                    </div>
                    <div className="input-field col s2">
                        <select value={this.state.limit} onChange={e => this.setState({ limit: Number(e.target.value) })}>
                            <option value={10}>10</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                        </select>
                        <label>Limit</label>
                    </div>
                </div>
                <ul className="collection">
                    {
                        this.state.songs.map((songItem, index) => {
                            const date = new Date(songItem.dateAdded).toGMTString();
                            const videoIdMatch = songItem.url.match(/[?&]v=([^&?]*)/);
                            const videoId = videoIdMatch ? videoIdMatch[1] : '';
                            return (
                                <li className="collection-item row" key={index}>
                                    <div className="col">
                                        <h6 className="bold">{songItem.title}</h6>
                                        {
                                            songItem.tags.map(tagId => <span key={tagId} className="tag-item">{tagsIdToNameMap[tagId]}</span>)
                                        }
                                        <p>
                                            <span className="small-text grey-text">{date}</span>
                                        </p>
                                    </div>
                                    <div className="col s5 right right-text">
                                        <a
                                        href={"https://www.youtube.com/results?search_query="+songItem.title}
                                        className="btn btn-small"
                                        target="_blank" rel="noopener noreferrer"
                                        title="Search song in youtube">
                                            <i className="fas fa-link"></i>
                                        </a>
                                        <a
                                        href={songItem.url}
                                        className={"btn btn-small" + (songItem.url ? '' : ' disabled')}
                                        target="_blank" rel="noopener noreferrer"
                                        title="Open song in youtube">
                                            <i className="fas fa-link"></i>
                                        </a>
                                        <button
                                        className="btn btn-small"
                                        onClick={() => props.getYtItems(songItem.title)}
                                        title="Find this song using youtube">
                                            <i className="fab fa-youtube"></i>
                                        </button>
                                        <button
                                        className={"btn btn-small" + (videoId ? '' : ' disabled')}
                                        onClick={() => props.loadVideo(videoId)}
                                        title="Play song on other devices">
                                            <i className="fas fa-play"></i>
                                        </button>
                                        <button
                                        className={"btn btn-small" + (videoId ? '' : ' disabled')}
                                        onClick={() => props.playVideo(videoId, index)}
                                        title="Play song on this device">
                                            PY
                                        </button>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}
